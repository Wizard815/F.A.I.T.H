"""FAITH as an Assist conversation agent."""

from __future__ import annotations

from typing import Literal

from homeassistant.components import conversation
from homeassistant.core import HomeAssistant
from homeassistant.helpers import intent
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import ulid

from . import FaithConfigEntry, FaithError


async def async_setup_entry(hass: HomeAssistant, entry: FaithConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback) -> None:
    async_add_entities([FaithAgent(entry)])


class FaithAgent(conversation.ConversationEntity, conversation.AbstractConversationAgent):
    """Sends what was said to FAITH, with the HA user so FAITH knows who's asking."""

    _attr_has_entity_name = True
    _attr_name = None

    def __init__(self, entry: FaithConfigEntry) -> None:
        self.entry = entry
        self._attr_unique_id = f"{entry.entry_id}_agent"
        self._attr_device_info = {"identifiers": {("faith", entry.entry_id)}, "name": "FAITH", "manufacturer": "FAITH"}

    @property
    def supported_languages(self) -> list[str] | Literal["*"]:
        return "*"

    async def async_process(self, user_input: conversation.ConversationInput) -> conversation.ConversationResult:
        conversation_id = user_input.conversation_id or ulid.ulid_now()
        response = intent.IntentResponse(language=user_input.language)
        try:
            result = await self.entry.runtime_data.client.converse(
                user_input.text,
                conversation_id,
                user_input.language,
                user_input.context.user_id,
                user_input.device_id,
                getattr(user_input, "satellite_id", None),
            )
            response.async_set_speech(str(result.get("speech") or "I don't have an answer for that."))
        except FaithError as err:
            response.async_set_error(intent.IntentResponseErrorCode.UNKNOWN, f"FAITH isn't answering right now. {err}")
        return conversation.ConversationResult(response=response, conversation_id=conversation_id)
