"""Palette models used to inspect PinkInk's Python token colors."""

from dataclasses import dataclass
from enum import StrEnum
import re

HEX_COLOR = re.compile(r"^#[0-9a-f]{6}$", re.IGNORECASE)


class Accent(StrEnum):
    PINK = "pink"
    CYAN = "cyan"
    MAGENTA = "magenta"


@dataclass(frozen=True, slots=True)
class Swatch:
    name: str
    hex_value: str
    contrast: float

    def __post_init__(self) -> None:
        if not HEX_COLOR.fullmatch(self.hex_value):
            raise ValueError(f"Invalid color: {self.hex_value!r}")


PALETTE: dict[Accent, Swatch] = {
    Accent.PINK: Swatch("Neon Pink", "#ff4fa3", 6.37),
    Accent.CYAN: Swatch("Electric Cyan", "#55e6e6", 13.2),
    Accent.MAGENTA: Swatch("Hot Magenta", "#d979ff", 8.45),
}


def describe(accent: Accent, *, uppercase: bool = False) -> str:
    """Return one human-readable swatch label."""
    swatch = PALETTE[accent]
    label = f"{swatch.name}: {swatch.hex_value} ({swatch.contrast:.2f}:1)"
    return label.upper() if uppercase else label


if __name__ == "__main__":
    for selected_accent in Accent:
        print(describe(selected_accent))
