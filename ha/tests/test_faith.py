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
