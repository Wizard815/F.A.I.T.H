"""Sensors from FAITH's household summary (never anyone's private things)."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import FaithConfigEntry

# key, name, value from summary, attributes from summary, icon
SENSORS: list[tuple[str, str, str, str | None, str]] = [
    ("today", "Today", "today_count", "today", "mdi:calendar-today"),
    ("shopping", "Shopping list", "shopping_count", "shopping", "mdi:cart"),
    ("next_meal", "Next meal", "next_meal", None, "mdi:silverware-fork-knife"),
    ("chores", "Chores", "chores_count", None, "mdi:broom"),
]


async def async_setup_entry(hass: HomeAssistant, entry: FaithConfigEntry, async_add_entities: AddConfigEntryEntitiesCallback) -> None:
    coord = entry.runtime_data.coordinator
    entities: list[SensorEntity] = [FaithSensor(entry, *s) for s in SENSORS]
    entities += [FaithHubSensor(entry, h["device"]) for h in (coord.data or {}).get("hubs", [])]
    async_add_entities(entities)


class _Base(CoordinatorEntity, SensorEntity):
    _attr_has_entity_name = True

    def __init__(self, entry: FaithConfigEntry, key: str) -> None:
        super().__init__(entry.runtime_data.coordinator)
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_device_info = {"identifiers": {("faith", entry.entry_id)}, "name": "FAITH", "manufacturer": "FAITH"}


class FaithSensor(_Base):
    def __init__(self, entry: FaithConfigEntry, key: str, name: str, value: str, attrs: str | None, icon: str) -> None:
        super().__init__(entry, key)
        self._attr_name = name
        self._attr_icon = icon
        self._value, self._attrs = value, attrs

    @property
    def native_value(self) -> Any:
        return (self.coordinator.data or {}).get(self._value)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        if not self._attrs:
            return None
        return {"items": (self.coordinator.data or {}).get(self._attrs, [])}


class FaithHubSensor(_Base):
    """Who is signed in on a wall screen ('Household' when nobody is). Useful for automations."""

    _attr_icon = "mdi:tablet-dashboard"

    def __init__(self, entry: FaithConfigEntry, device: str) -> None:
        super().__init__(entry, f"hub_{device}")
        self._device = device
        self._attr_name = f"{device.replace('_', ' ').title()} screen"

    @property
    def native_value(self) -> str:
        for h in (self.coordinator.data or {}).get("hubs", []):
            if h.get("device") == self._device:
                return h.get("signed_in") or "Household"
        return "Household"
