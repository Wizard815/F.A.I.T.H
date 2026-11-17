"""FAITH for Home Assistant.

Makes FAITH a conversation agent for Assist (voice satellites, the HA app) and
adds sensors from FAITH's household summary. Assist requests carry the HA user,
so FAITH can answer as that family member when the user is mapped in faith.yaml.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
import logging
from typing import Any

import aiohttp

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from homeassistant.components import frontend

from .const import CONF_PANEL_URL, CONF_TOKEN, CONF_URL, DOMAIN, PANEL_PATH, SCAN_SECONDS

_LOGGER = logging.getLogger(__name__)
PLATFORMS = [Platform.CONVERSATION, Platform.SENSOR]


class FaithError(Exception):
    """FAITH answered with an error."""


class FaithAuthError(FaithError):
    """FAITH refused the token."""


class FaithClient:
    """Talks to FAITH's /api/ha endpoints."""

    def __init__(self, session: aiohttp.ClientSession, url: str, token: str) -> None:
        self._session = session
        self.url = url.rstrip("/")
        self._token = token

    async def _call(self, method: str, path: str, body: dict[str, Any] | None = None, timeout: int = 20) -> dict[str, Any]:
        try:
            async with self._session.request(
                method,
                f"{self.url}{path}",
                json=body,
                headers={"Authorization": f"Bearer {self._token}"},
                timeout=aiohttp.ClientTimeout(total=timeout),
            ) as resp:
                data = await resp.json(content_type=None)
                if resp.status in (401, 403):
                    raise FaithAuthError((data or {}).get("error", "unauthorized"))
                if resp.status >= 400:
                    raise FaithError((data or {}).get("error", f"HTTP {resp.status}"))
                return data or {}
        except (aiohttp.ClientError, TimeoutError) as err:
            raise FaithError(f"Couldn't reach FAITH: {err}") from err

    async def summary(self) -> dict[str, Any]:
        return await self._call("GET", "/api/ha/summary")

    async def converse(self, text: str, conversation_id: str | None, language: str, user_id: str | None, device_id: str | None, satellite_id: str | None) -> dict[str, Any]:
        return await self._call(
            "POST",
            "/api/ha/conversation",
            {"text": text, "conversation_id": conversation_id, "language": language, "user_id": user_id, "device_id": device_id, "satellite_id": satellite_id},
            timeout=180,
        )


@dataclass
class FaithData:
    client: FaithClient
    coordinator: DataUpdateCoordinator[dict[str, Any]]


type FaithConfigEntry = ConfigEntry[FaithData]


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
    # FAITH's screen in HA's sidebar, so a wall tablet running HA is the family kiosk.
    # The browser loads it, so this is the address the family's devices use (https for Face ID).
    panel_url = entry.data.get(CONF_PANEL_URL) or entry.data[CONF_URL]
    frontend.async_register_built_in_panel(hass, "iframe", sidebar_title="FAITH", sidebar_icon="mdi:home-heart", frontend_url_path=PANEL_PATH, config={"url": panel_url}, require_admin=False, update=True)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: FaithConfigEntry) -> bool:
    frontend.async_remove_panel(hass, PANEL_PATH, warn_if_unknown=False)
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
