"""FAITH for Home Assistant.

FAITH runs in its own container; this integration connects the two:
- the family's dashboard: FAITH cards (custom:faith-card, -chat-card, -who-card,
  -rewards-card) that ask FAITH as the HA user who is looking,
- Assist: FAITH is a conversation agent and knows which HA user is speaking,
- phones: Approve / Deny on a notification becomes that person's decision,
- actions: faith.send_message (family / parents chat, a person's chat and phone)
  and faith.award_points,
- sensors with family-wide numbers (never anyone's private things),
- a "FAITH Admin" sidebar page (HA admins only) for FAITH's own admin console.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
import logging
from pathlib import Path
from typing import Any

import aiohttp
import voluptuous as vol

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import Event, HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import CONF_PANEL_URL, CONF_TOKEN, CONF_URL, DOMAIN, PANEL_PATH, SCAN_SECONDS

_LOGGER = logging.getLogger(__name__)
PLATFORMS = [Platform.CONVERSATION, Platform.SENSOR]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
VERSION = "0.3.0"
CARDS_URL = "/faith_static"

# What the cards may ask FAITH. Every call gets the logged-in HA user added here.
CARD_PATHS = {
    "/api/ha/view", "/api/ha/chat", "/api/ha/chat/history", "/api/ha/speak", "/api/ha/prefs/cards", "/api/ha/approvals", "/api/ha/rewards",
    "/api/ha/rewards/claim", "/api/ha/rewards/redeem", "/api/ha/rewards/award",
    "/api/ha/hub/people", "/api/ha/hub/pair", "/api/ha/hub/signin", "/api/ha/hub/signout", "/api/ha/hub/activity",
}
CARD_PREFIXES = ("/api/ha/confirm/", "/api/ha/approvals/")


class FaithError(HomeAssistantError):
    """FAITH answered with an error."""


class FaithAuthError(FaithError):
    """FAITH refused the token."""


class FaithClient:
    """Talks to FAITH's /api/ha endpoints."""

    def __init__(self, session: aiohttp.ClientSession, url: str, token: str) -> None:
        self._session = session
        self.url = url.rstrip("/")
        self._token = token

    async def request(self, method: str, path: str, body: dict[str, Any] | None = None, timeout: int = 20) -> dict[str, Any]:
        try:
            async with self._session.request(
                method, f"{self.url}{path}", json=body,
                headers={"Authorization": f"Bearer {self._token}"},
                timeout=aiohttp.ClientTimeout(total=timeout),
            ) as resp:
                data = await resp.json(content_type=None)
                if resp.status in (401, 403) and path == "/api/ha/summary":
                    raise FaithAuthError((data or {}).get("error", "unauthorized"))
                if resp.status >= 400:
                    raise FaithError((data or {}).get("error", f"HTTP {resp.status}"))
                return data or {}
        except (aiohttp.ClientError, TimeoutError) as err:
            raise FaithError(f"Couldn't reach FAITH: {err}") from err

    async def summary(self) -> dict[str, Any]:
        return await self.request("GET", "/api/ha/summary")

    async def converse(self, text: str, conversation_id: str | None, language: str, user_id: str | None, device_id: str | None, satellite_id: str | None) -> dict[str, Any]:
        return await self.request("POST", "/api/ha/conversation",
            {"text": text, "conversation_id": conversation_id, "language": language, "user_id": user_id, "device_id": device_id, "satellite_id": satellite_id}, timeout=180)


@dataclass
class FaithData:
    client: FaithClient
    coordinator: DataUpdateCoordinator[dict[str, Any]]


type FaithConfigEntry = ConfigEntry[FaithData]


def _client(hass: HomeAssistant) -> FaithClient:
    for entry in hass.config_entries.async_loaded_entries(DOMAIN):
        return entry.runtime_data.client
    raise FaithError("FAITH isn't set up.")


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Things that exist once, whatever the number of entries."""
    await hass.http.async_register_static_paths([StaticPathConfig(CARDS_URL, str(Path(__file__).parent / "www"), False)])
    frontend.add_extra_js_url(hass, f"{CARDS_URL}/faith-cards.js?v={VERSION}")
    websocket_api.async_register_command(hass, ws_call)

    async def send_message(call: ServiceCall) -> ServiceResponse:
        return await _client(hass).request("POST", "/api/ha/send", {"to": call.data["to"], "message": call.data["message"], "user_id": call.context.user_id})

    async def award_points(call: ServiceCall) -> ServiceResponse:
        body = {"user_id": call.context.user_id, "args": {"person": call.data["person"], "points": call.data["points"], "reason": call.data["reason"]}}
        return await _client(hass).request("POST", "/api/ha/rewards/award", body)

    hass.services.async_register(DOMAIN, "send_message", send_message,
        schema=vol.Schema({vol.Required("to"): cv.string, vol.Required("message"): cv.string}), supports_response=SupportsResponse.OPTIONAL)
    hass.services.async_register(DOMAIN, "award_points", award_points,
        schema=vol.Schema({vol.Required("person"): cv.string, vol.Required("points"): vol.Coerce(float), vol.Required("reason"): cv.string}), supports_response=SupportsResponse.OPTIONAL)

    @callback
    def notification_action(event: Event) -> None:
        """Approve / Deny tapped on a FAITH push: decide as the HA user who tapped."""
        action = str(event.data.get("action", ""))
        for prefix, approve in (("FAITH_APPROVE_", True), ("FAITH_DENY_", False)):
            if action.startswith(prefix):
                request_id = action[len(prefix):]
                hass.async_create_task(_decide(hass, request_id, approve, event.context.user_id))

    hass.bus.async_listen("mobile_app_notification_action", notification_action)
    return True


async def _decide(hass: HomeAssistant, request_id: str, approve: bool, user_id: str | None) -> None:
    try:
        await _client(hass).request("POST", f"/api/ha/approvals/{request_id}", {"approve": approve, "user_id": user_id})
    except FaithError as err:
        _LOGGER.warning("FAITH couldn't take that decision: %s", err)


@websocket_api.websocket_command({vol.Required("type"): "faith/call", vol.Required("path"): str, vol.Optional("body", default={}): dict})
@websocket_api.async_response
async def ws_call(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """The cards' only way to FAITH: a fixed list of paths, as the logged-in user."""
    path = msg["path"]
    if path not in CARD_PATHS and not any(path.startswith(p) and path[len(p):].replace("-", "").replace("_", "").isalnum() for p in CARD_PREFIXES):
        connection.send_error(msg["id"], "not_allowed", f"Cards can't call {path}")
        return
    body = {**msg["body"], "user_id": connection.user.id}  # never trust a user id from the browser
    try:
        result = await _client(hass).request("POST", path, body, timeout=180 if path in ("/api/ha/chat", "/api/ha/speak") else 30)
    except FaithError as err:
        connection.send_error(msg["id"], "faith_error", str(err))
        return
    connection.send_result(msg["id"], result)


async def async_setup_entry(hass: HomeAssistant, entry: FaithConfigEntry) -> bool:
    client = FaithClient(async_get_clientsession(hass), entry.data[CONF_URL], entry.data[CONF_TOKEN])

    async def _update() -> dict[str, Any]:
        try:
            return await client.summary()
        except FaithError as err:
            raise UpdateFailed(str(err)) from err

    coordinator = DataUpdateCoordinator(hass, _LOGGER, config_entry=entry, name=DOMAIN, update_method=_update, update_interval=timedelta(seconds=SCAN_SECONDS))
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = FaithData(client, coordinator)
    # FAITH's own page is its admin console: a sidebar entry for HA admins only.
    panel_url = entry.data.get(CONF_PANEL_URL) or entry.data[CONF_URL]
    frontend.async_register_built_in_panel(hass, "iframe", sidebar_title="FAITH Admin", sidebar_icon="mdi:home-heart", frontend_url_path=PANEL_PATH, config={"url": panel_url}, require_admin=True, update=True)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: FaithConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL_PATH, warn_if_unknown=False)
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
