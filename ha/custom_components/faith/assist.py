"""FAITH and Home Assistant's Assist API: the same tools and house overview HA gives
its own AI agents (Ollama, OpenAI...), offered to FAITH over one authenticated view.

FAITH asks with its own HA token, so HA's "Expose to Assist" settings decide what
FAITH can see and control. FAITH keeps its own rules on top: before a change it asks
here which entities the call would touch ("targets"), so a lock needs a Yes and a
child stays within their kinds of device.

POST /api/faith/assist
  {"action": "describe", "device_id"?, "language"?}  -> {"prompt", "tools": [{name, description, parameters}]}
  {"action": "targets", "tool", "args", "device_id"?} -> {"targets": ["light.kitchen", ...]}
  {"action": "call", "tool", "args", "device_id"?}    -> {"result": {...}}

HA's own sentence matcher (the built-in "Home Assistant" agent), for FAITH's fast path:
  {"action": "recognize", "text", "device_id"?}  -> {"match": {"intent", "args", "targets"} | null}   (nothing is done)
  {"action": "handle", "text", "expect": {"intent", "targets"}, "device_id"?}
      -> {"handled": bool, "speech"}: HA does it and says what it did, but only if the
         sentence still means exactly what FAITH checked (the same intent and targets).
"""

from __future__ import annotations

from http import HTTPStatus
import re
from typing import Any

from aiohttp import web
import voluptuous as vol
import voluptuous_openapi
import yaml

from hassil.recognize import RecognizeResult

from homeassistant.components import conversation
from homeassistant.components.http import KEY_HASS, HomeAssistantView
from homeassistant.core import Context, HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import area_registry as ar, chat_session, device_registry as dr, intent, llm

ASSISTANT = "conversation"  # the "Expose to Assist" list
# Where someone is never leaves Home Assistant through FAITH (the same rule as FAITH's own HA tools).
WHERE = re.compile(r"^sensor\..*(geocoded_location|_location|_address|_latitude|_longitude|_gps|_zone)")


def _context(hass: HomeAssistant, request: web.Request, body: dict[str, Any]) -> llm.LLMContext:
    device_id = body.get("device_id") or None
    if device_id and not dr.async_get(hass).async_get(str(device_id)):
        device_id = None
    return llm.LLMContext(
        platform="faith",
        context=Context(user_id=request["hass_user"].id),
        language=body.get("language") or hass.config.language,
        assistant=ASSISTANT,
        device_id=device_id,
    )


def _redact_live(text: str) -> str:
    """GetLiveContext lists every exposed entity with its state: people and trackers become home/away."""
    head, _, rest = text.partition("\n")
    try:
        entities = yaml.safe_load(rest) or []
    except yaml.YAMLError:
        return head
    out = []
    for e in entities:
        domain = e.get("domain")
        if domain in ("person", "device_tracker"):
            e["state"] = "home" if e.get("state") == "home" else "away"
            e.pop("attributes", None)
        out.append(e)
    return f"{head}\n{yaml.safe_dump(out, sort_keys=False, allow_unicode=True)}"


def _targets(hass: HomeAssistant, tool: llm.Tool, args: dict[str, Any], device_id: str | None) -> list[str]:
    """The entities a call would touch, without touching them."""
    if isinstance(tool, llm.ScriptTool) or tool.__class__.__name__ == "ScriptTool":
        return [f"script.{tool.name.lstrip('_')}"]
    if not isinstance(tool, llm.IntentTool):
        return []
    return _intent_targets(hass, tool.name, args, device_id)


def _intent_targets(hass: HomeAssistant, intent_type: str, args: dict[str, Any], device_id: str | None) -> list[str]:
    handler = next((h for h in intent.async_get(hass) if h.intent_type == intent_type), None)
    as_list = lambda v: [v] if isinstance(v, str) else list(v) if v else None  # noqa: E731
    domains = as_list(args.get("domain")) or (list(handler.platforms) if handler and handler.platforms else None)
    name = args.get("name")
    if isinstance(name, str) and name.strip().lower() == "all":
        name = None  # HA's own handlers read "all" as every match, not a device called "all"
    constraints = intent.MatchTargetsConstraints(
        name=name, area_name=args.get("area"), floor_name=args.get("floor"),
        domains=domains, device_classes=as_list(args.get("device_class")), assistant=ASSISTANT,
    )
    preferences = None
    if device_id and (device := dr.async_get(hass).async_get(device_id)) and device.area_id:
        area = ar.async_get(hass).async_get_area(device.area_id)
        preferences = intent.MatchTargetsPreferences(area_id=device.area_id, floor_id=area.floor_id if area else None)
    if not any([constraints.name, constraints.area_name, constraints.floor_name, constraints.domains, constraints.device_classes]):
        return []
    result = intent.async_match_targets(hass, constraints, preferences)
    return [s.entity_id for s in result.states] if result.is_match else []


def _input(hass: HomeAssistant, request: web.Request, body: dict[str, Any], llm_context: llm.LLMContext) -> conversation.ConversationInput:
    return conversation.ConversationInput(
        text=str(body.get("text") or "")[:500], context=Context(user_id=request["hass_user"].id), conversation_id=None,
        device_id=llm_context.device_id, satellite_id=None, language=llm_context.language, agent_id=conversation.HOME_ASSISTANT_AGENT,
    )


def _match(hass: HomeAssistant, result: RecognizeResult, device_id: str | None) -> dict[str, Any]:
    """What HA understood: the intent, its slots as Assist tool arguments, and the entities it would touch."""
    args = {k: e.value for k, e in result.entities.items() if isinstance(e.value, (str, int, float, bool))}
    return {"intent": result.intent.name, "args": args, "targets": sorted(_intent_targets(hass, result.intent.name, args, device_id))}


async def _recognize(hass: HomeAssistant, user_input: conversation.ConversationInput, device_id: str | None) -> dict[str, Any] | None:
    agent = conversation.get_agent_manager(hass).default_agent
    if agent is None or not user_input.text.strip():
        return None
    result = await agent.async_recognize_intent(user_input, strict_intents_only=True)
    return _match(hass, result, device_id) if isinstance(result, RecognizeResult) else None


async def _handle(hass: HomeAssistant, user_input: conversation.ConversationInput, expect: dict[str, Any], device_id: str | None) -> dict[str, Any]:
    want = (expect.get("intent"), sorted(str(t) for t in expect.get("targets") or []))

    def changed(result: RecognizeResult) -> bool:  # True: don't handle it
        m = _match(hass, result, device_id)
        return (m["intent"], m["targets"]) != want

    with (
        chat_session.async_get_chat_session(hass, None) as session,
        conversation.async_get_chat_log(hass, session, user_input) as chat_log,
    ):
        response = await conversation.async_handle_intents(hass, user_input, chat_log, intent_filter=changed)
    if response is None:
        return {"handled": False}
    speech = (response.speech.get("plain") or {}).get("speech", "")
    if response.response_type == intent.IntentResponseType.ERROR:
        return {"handled": False, "speech": speech, "error": str(response.error_code)}
    return {"handled": True, "speech": speech}


class FaithAssistView(HomeAssistantView):
    """FAITH's door to the Assist API."""

    url = "/api/faith/assist"
    name = "api:faith:assist"
    requires_auth = True

    async def post(self, request: web.Request) -> web.Response:
        hass = request.app[KEY_HASS]
        try:
            body = await request.json()
        except ValueError:
            return self.json({"error": "Send JSON."}, HTTPStatus.BAD_REQUEST)
        llm_context = _context(hass, request, body)
        try:
            api = await llm.async_get_api(hass, llm.LLM_API_ASSIST, llm_context)
            action = body.get("action", "describe")
            if action == "describe":
                tools = [{
                    "name": t.name,
                    "description": t.description or t.name,
                    "parameters": voluptuous_openapi.convert(t.parameters, custom_serializer=api.custom_serializer),
                } for t in api.tools]
                return self.json({"prompt": api.api_prompt, "tools": tools})
            if action == "recognize":
                return self.json({"match": await _recognize(hass, _input(hass, request, body, llm_context), llm_context.device_id)})
            if action == "handle":
                return self.json(await _handle(hass, _input(hass, request, body, llm_context), body.get("expect") or {}, llm_context.device_id))
            tool = next((t for t in api.tools if t.name == body.get("tool")), None)
            if tool is None:
                return self.json({"error": f"No Assist tool called {body.get('tool')}."}, HTTPStatus.NOT_FOUND)
            args = body.get("args") or {}
            if action == "targets":
                return self.json({"targets": _targets(hass, tool, args, llm_context.device_id)})
            if action == "call":
                result = await api.async_call_tool(llm.ToolInput(tool_name=tool.name, tool_args=args))
                if tool.name == "GetLiveContext" and isinstance(result, dict) and isinstance(result.get("result"), str):
                    result = {**result, "result": _redact_live(result["result"])}
                return self.json({"result": result})
            return self.json({"error": f"Unknown action {action}."}, HTTPStatus.BAD_REQUEST)
        except (HomeAssistantError, vol.Invalid) as err:
            return self.json({"error": str(err) or err.__class__.__name__}, HTTPStatus.BAD_REQUEST)
