"""Load custom_components/faith in Home Assistant's test harness."""

import pytest

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

pytest_plugins = ["pytest_homeassistant_custom_component"]


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    yield


@pytest.fixture(autouse=True)
async def core(hass: HomeAssistant):
    """The core integration (exposed entities etc.) that conversation needs."""
    assert await async_setup_component(hass, "homeassistant", {})
    yield
