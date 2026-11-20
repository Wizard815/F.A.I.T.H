"""FAITH's door to HA's Assist API: describe, targets (no side effects), call, redaction."""

from homeassistant.components.homeassistant.exposed_entities import async_expose_entity
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import async_mock_service
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from .test_faith import _setup


async def _house(hass: HomeAssistant) -> None:
    for c in ("homeassistant", "intent", "conversation"):
        assert await async_setup_component(hass, c, {})
    hass.states.async_set("light.kitchen", "off", {"friendly_name": "Kitchen light"})
    hass.states.async_set("light.porch", "on", {"friendly_name": "Porch light"})
    hass.states.async_set("person.sam", "Work", {"friendly_name": "Sam", "latitude": 1.0})
    # Someone exposed their person entity to Assist: FAITH still only learns home or away.
    async_expose_entity(hass, "conversation", "person.sam", True)


async def test_describe_targets_call(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, hass_client) -> None:
    await _house(hass)
    await _setup(hass, aioclient_mock)
    client = await hass_client()
    ask = lambda body: client.post("/api/faith/assist", json=body)  # noqa: E731

    r = await (await ask({"action": "describe"})).json()
    names = {t["name"] for t in r["tools"]}
    assert {"HassTurnOn", "HassTurnOff", "GetLiveContext"} <= names
    assert "Kitchen light" in r["prompt"], "the house overview names the exposed devices"
    turn_on = next(t for t in r["tools"] if t["name"] == "HassTurnOn")
    assert turn_on["parameters"]["type"] == "object"

    calls = async_mock_service(hass, "light", "turn_on")
    t = await (await ask({"action": "targets", "tool": "HassTurnOn", "args": {"name": "Kitchen light"}})).json()
    assert t["targets"] == ["light.kitchen"]
    assert calls == [], "working out targets changes nothing"

    done = await (await ask({"action": "call", "tool": "HassTurnOn", "args": {"name": "Kitchen light"}})).json()
    assert "result" in done
    await hass.async_block_till_done()
    assert [c.data["entity_id"] for c in calls] == [["light.kitchen"]]

    live = await (await ask({"action": "call", "tool": "GetLiveContext", "args": {}})).json()
    assert "Kitchen light" in live["result"]["result"]
    assert "Sam" in live["result"]["result"] and "away" in live["result"]["result"]
    assert "Work" not in live["result"]["result"] and "latitude" not in live["result"]["result"], "where someone is stays in HA"

    bad = await ask({"action": "call", "tool": "NoSuchTool", "args": {}})
    assert bad.status == 404


async def test_needs_a_token(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, hass_client_no_auth) -> None:
    await _house(hass)
    await _setup(hass, aioclient_mock)
    client = await hass_client_no_auth()
    assert (await client.post("/api/faith/assist", json={"action": "describe"})).status == 401
