"""FAITH's Home Assistant integration against a fake FAITH."""

from homeassistant import config_entries
from homeassistant.components import conversation
from homeassistant.core import Context, HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.faith.const import DOMAIN

URL = "http://faith.test:8097"
SUMMARY = {"today_count": 2, "today": ["18:00 · Family dinner"], "shopping_count": 1, "shopping": ["milk"], "next_meal": "2026-11-17 · dinner: Tacos", "chores_count": 0,
           "hubs": [{"device": "kitchen", "signed_in": None}], "pending_approvals": 0}


async def _setup(hass: HomeAssistant, mock: AiohttpClientMocker) -> MockConfigEntry:
    mock.get(f"{URL}/api/ha/summary", json=SUMMARY)
    entry = MockConfigEntry(domain=DOMAIN, data={"url": URL, "token": "fha_x", "panel_url": "https://faith.home.lan"}, unique_id=URL)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_config_flow(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get(f"{URL}/api/ha/summary", json=SUMMARY)
    r = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert r["type"] is FlowResultType.FORM
    r = await hass.config_entries.flow.async_configure(r["flow_id"], {"url": URL + "/", "token": "fha_x"})
    assert r["type"] is FlowResultType.CREATE_ENTRY
    assert r["data"]["url"] == URL


async def test_config_flow_bad_token(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get(f"{URL}/api/ha/summary", status=403, json={"error": "Use a Home Assistant token"})
    r = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    r = await hass.config_entries.flow.async_configure(r["flow_id"], {"url": URL, "token": "nope"})
    assert r["errors"] == {"base": "invalid_auth"}


async def test_sensors_and_panel(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    await _setup(hass, aioclient_mock)
    assert hass.states.get("sensor.faith_shopping_list").state == "1"
    assert hass.states.get("sensor.faith_shopping_list").attributes["items"] == ["milk"]
    assert hass.states.get("sensor.faith_next_meal").state == "2026-11-17 · dinner: Tacos"
    assert hass.states.get("sensor.faith_kitchen_screen").state == "Household"
    panels = hass.data["frontend_panels"]
    assert panels["faith"].config == {"url": "https://faith.home.lan"}
    assert panels["faith"].require_admin is True
    assert panels["faith"].sidebar_title == "FAITH Admin"


async def test_assist_goes_to_faith_with_the_ha_user(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    await _setup(hass, aioclient_mock)
    aioclient_mock.post(f"{URL}/api/ha/conversation", json={"speech": "Tacos tonight.", "conversation_id": "c1", "person": "wizard"})
    agents = [s.entity_id for s in hass.states.async_all("conversation") if s.entity_id.startswith("conversation.faith")]
    assert agents, hass.states.async_entity_ids("conversation")
    result = await conversation.async_converse(hass, "what's for dinner", None, Context(user_id="ha-wiz"), language="en", agent_id=agents[0])
    assert result.response.speech["plain"]["speech"] == "Tacos tonight."
    sent = aioclient_mock.mock_calls[-1]
    assert sent[2]["user_id"] == "ha-wiz"
    assert sent[2]["text"] == "what's for dinner"
    assert sent[3]["Authorization"] == "Bearer fha_x"


async def test_assist_when_faith_is_down(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    await _setup(hass, aioclient_mock)
    aioclient_mock.post(f"{URL}/api/ha/conversation", status=502, json={"error": "Couldn't reach the model"})
    agents = [s.entity_id for s in hass.states.async_all("conversation") if s.entity_id.startswith("conversation.faith")]
    result = await conversation.async_converse(hass, "hello", None, Context(), language="en", agent_id=agents[0])
    assert "FAITH isn't answering" in result.response.speech["plain"]["speech"]


async def test_cards_call_faith_as_the_logged_in_user(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, hass_ws_client, hass_admin_user) -> None:
    await _setup(hass, aioclient_mock)
    aioclient_mock.post(f"{URL}/api/ha/view", json={"person": {"id": "wizard"}, "cards": []})
    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "faith/call", "path": "/api/ha/view", "body": {"screen": "kitchen", "user_id": "someone-else"}})
    r = await ws.receive_json()
    assert r["success"], r
    assert r["result"]["person"]["id"] == "wizard"
    sent = aioclient_mock.mock_calls[-1][2]
    assert sent["user_id"] == hass_admin_user.id, "the browser can't pick who it is"
    assert sent["screen"] == "kitchen"
    await ws.send_json({"id": 2, "type": "faith/call", "path": "/api/admin/overview", "body": {}})
    r = await ws.receive_json()
    assert not r["success"] and r["error"]["code"] == "not_allowed"
    await ws.send_json({"id": 3, "type": "faith/call", "path": "/api/ha/approvals/../../admin", "body": {}})
    assert not (await ws.receive_json())["success"]


async def test_send_message_action(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    await _setup(hass, aioclient_mock)
    aioclient_mock.post(f"{URL}/api/ha/send", json={"ok": True, "sent_to": ["mattermost:family"]})
    r = await hass.services.async_call("faith", "send_message", {"to": "family", "message": "Dinner's ready"}, blocking=True, return_response=True)
    assert r == {"ok": True, "sent_to": ["mattermost:family"]}
    assert aioclient_mock.mock_calls[-1][2]["message"] == "Dinner's ready"


async def test_approve_from_a_phone_notification(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    await _setup(hass, aioclient_mock)
    aioclient_mock.post(f"{URL}/api/ha/approvals/abc123", json={"ok": True, "status": "approved"})
    hass.bus.async_fire("mobile_app_notification_action", {"action": "FAITH_APPROVE_abc123"}, context=Context(user_id="ha-sam"))
    await hass.async_block_till_done()
    call = aioclient_mock.mock_calls[-1]
    assert str(call[1]).endswith("/api/ha/approvals/abc123")
    assert call[2] == {"approve": True, "user_id": "ha-sam"}
    hass.bus.async_fire("mobile_app_notification_action", {"action": "SOMETHING_ELSE"})
    await hass.async_block_till_done()
    assert len([c for c in aioclient_mock.mock_calls if "approvals" in str(c[1])]) == 1


async def test_cards_script_is_served(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, hass_client) -> None:
    await _setup(hass, aioclient_mock)
    client = await hass_client()
    r = await client.get("/faith_static/faith-cards.js")
    assert r.status == 200
