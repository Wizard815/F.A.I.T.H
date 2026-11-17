"""Config flow: FAITH's address and an `ha` token."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from . import FaithAuthError, FaithClient, FaithError
from .const import CONF_PANEL_URL, CONF_TOKEN, CONF_URL, DOMAIN

SCHEMA = vol.Schema({vol.Required(CONF_URL, default="http://192.168.1.5:8097"): str, vol.Required(CONF_TOKEN): str, vol.Optional(CONF_PANEL_URL, default=""): str})


class FaithConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            url = user_input[CONF_URL].rstrip("/")
            await self.async_set_unique_id(url)
            self._abort_if_unique_id_configured()
            try:
                await FaithClient(async_get_clientsession(self.hass), url, user_input[CONF_TOKEN]).summary()
            except FaithAuthError:
                errors["base"] = "invalid_auth"
            except FaithError:
                errors["base"] = "cannot_connect"
            else:
                return self.async_create_entry(title="FAITH", data={CONF_URL: url, CONF_TOKEN: user_input[CONF_TOKEN], CONF_PANEL_URL: user_input.get(CONF_PANEL_URL, "").rstrip("/")})
        return self.async_show_form(step_id="user", data_schema=SCHEMA, errors=errors)
