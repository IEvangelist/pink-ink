const HEX_COLOR_PATTERN = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

export function parseHexColor(value) {
  if (typeof value !== "string" || !HEX_COLOR_PATTERN.test(value)) {
    throw new TypeError(`Unsupported hex color: ${value}`);
  }

  let hex = value.slice(1);
  if (hex.length === 3 || hex.length === 4) {
    hex = [...hex].map((digit) => `${digit}${digit}`).join("");
  }

  if (hex.length === 6) {
    hex += "FF";
  }

  return {
    red: Number.parseInt(hex.slice(0, 2), 16) / 255,
    green: Number.parseInt(hex.slice(2, 4), 16) / 255,
    blue: Number.parseInt(hex.slice(4, 6), 16) / 255,
    alpha: Number.parseInt(hex.slice(6, 8), 16) / 255,
  };
}

export function compositeColors(foreground, background) {
  const outputAlpha = foreground.alpha + background.alpha * (1 - foreground.alpha);
  if (outputAlpha === 0) {
    return { red: 0, green: 0, blue: 0, alpha: 0 };
  }

  return {
    red:
      (foreground.red * foreground.alpha +
        background.red * background.alpha * (1 - foreground.alpha)) /
      outputAlpha,
    green:
      (foreground.green * foreground.alpha +
        background.green * background.alpha * (1 - foreground.alpha)) /
      outputAlpha,
    blue:
      (foreground.blue * foreground.alpha +
        background.blue * background.alpha * (1 - foreground.alpha)) /
      outputAlpha,
    alpha: outputAlpha,
  };
}

export function flattenLayers(colors) {
  if (!Array.isArray(colors) || colors.length === 0) {
    throw new TypeError("At least one color layer is required.");
  }

  const parsed = colors.map(parseHexColor);
  let result = parsed.at(-1);

  if (result.alpha !== 1) {
    throw new Error("The bottom color layer must be opaque.");
  }

  for (let index = parsed.length - 2; index >= 0; index -= 1) {
    result = compositeColors(parsed[index], result);
  }

  return result;
}

export function contrastRatio(foreground, backgroundLayers) {
  const background = flattenLayers(backgroundLayers);
  const flattenedForeground = compositeColors(parseHexColor(foreground), background);
  const foregroundLuminance = relativeLuminance(flattenedForeground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

export function relativeLuminance(color) {
  const channels = [color.red, color.green, color.blue].map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
