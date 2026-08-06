use std::collections::HashMap;
use std::fmt::{self, Display};

#[derive(Clone, Copy, Debug, Eq, Hash, PartialEq)]
pub enum Accent {
    Pink,
    Cyan,
    Magenta,
}

#[derive(Clone, Debug, PartialEq)]
pub struct Swatch {
    pub name: &'static str,
    pub hex: &'static str,
    pub contrast: f32,
}

#[derive(Debug)]
pub enum PaletteError {
    UnknownAccent(Accent),
    InvalidColor(&'static str),
}

impl Display for PaletteError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::UnknownAccent(accent) => write!(formatter, "unknown accent: {accent:?}"),
            Self::InvalidColor(value) => write!(formatter, "invalid color: {value}"),
        }
    }
}

pub fn palette() -> HashMap<Accent, Swatch> {
    HashMap::from([
        (
            Accent::Pink,
            Swatch {
                name: "Neon Pink",
                hex: "#ff4fa3",
                contrast: 6.37,
            },
        ),
        (
            Accent::Cyan,
            Swatch {
                name: "Electric Cyan",
                hex: "#55e6e6",
                contrast: 13.2,
            },
        ),
        (
            Accent::Magenta,
            Swatch {
                name: "Hot Magenta",
                hex: "#d979ff",
                contrast: 8.45,
            },
        ),
    ])
}

pub fn describe(accent: Accent) -> Result<String, PaletteError> {
    let swatches = palette();
    let swatch = swatches
        .get(&accent)
        .ok_or(PaletteError::UnknownAccent(accent))?;

    if !swatch.hex.starts_with('#') || swatch.hex.len() != 7 {
        return Err(PaletteError::InvalidColor(swatch.hex));
    }

    Ok(format!("{} · {} · {:.2}:1", swatch.name, swatch.hex, swatch.contrast))
}
