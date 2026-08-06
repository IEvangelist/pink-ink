import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packagePath = resolve(projectRoot, "package.json");
const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
const errors = [];

if (packageJson.displayName !== "PinkInk") {
  errors.push('package.json displayName must be "PinkInk".');
}

if (packageJson.author?.name !== "David Pine") {
  errors.push('package.json author.name must be "David Pine".');
}

const themes = packageJson.contributes?.themes;
if (!Array.isArray(themes) || themes.length !== 2) {
  errors.push("package.json must contribute exactly two themes.");
}

const labels = new Set();
const expectedUiThemes = new Set(["vs", "vs-dark"]);
const colorPattern = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

for (const contribution of themes ?? []) {
  labels.add(contribution.label);
  expectedUiThemes.delete(contribution.uiTheme);

  const themePath = resolve(projectRoot, contribution.path);
  let theme;

  try {
    theme = JSON.parse(await readFile(themePath, "utf8"));
  } catch (error) {
    errors.push(`${contribution.label}: unable to read valid JSON (${error.message}).`);
    continue;
  }

  if (theme.$schema !== "vscode://schemas/color-theme") {
    errors.push(`${contribution.label}: missing the VS Code color-theme schema.`);
  }

  if (theme.name !== contribution.label) {
    errors.push(`${contribution.label}: theme name must match its contribution label.`);
  }

  if (theme.semanticHighlighting !== true) {
    errors.push(`${contribution.label}: semanticHighlighting must be enabled.`);
  }

  if (!theme.colors?.["editor.background"] || !theme.colors?.["editor.foreground"]) {
    errors.push(`${contribution.label}: editor background and foreground are required.`);
  }

  if (!Array.isArray(theme.tokenColors) || theme.tokenColors.length === 0) {
    errors.push(`${contribution.label}: tokenColors must not be empty.`);
  }

  validateColorMap(theme.colors, `${contribution.label}.colors`);
  validateTokenColors(theme.tokenColors, contribution.label);
  validateSemanticColors(theme.semanticTokenColors, contribution.label);
}

if (labels.size !== 2) {
  errors.push("Theme contribution labels must be unique.");
}

if (expectedUiThemes.size > 0) {
  errors.push("Theme contributions must contain one light and one dark UI theme.");
}

if (errors.length > 0) {
  console.error("PinkInk validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log("PinkInk validation passed for PinkInk Dark and PinkInk Light.");
}

function validateColorMap(colorMap, location) {
  if (!colorMap || typeof colorMap !== "object") {
    errors.push(`${location}: expected a color map.`);
    return;
  }

  for (const [key, value] of Object.entries(colorMap)) {
    if (typeof value !== "string" || !colorPattern.test(value)) {
      errors.push(`${location}.${key}: "${value}" is not a supported hex color.`);
    }
  }
}

function validateTokenColors(tokenColors, themeLabel) {
  for (const [index, rule] of (tokenColors ?? []).entries()) {
    const location = `${themeLabel}.tokenColors[${index}]`;
    const foreground = rule.settings?.foreground;
    const fontStyle = rule.settings?.fontStyle;

    if (foreground !== undefined && !colorPattern.test(foreground)) {
      errors.push(`${location}: "${foreground}" is not a supported hex color.`);
    }

    if (typeof fontStyle === "string" && fontStyle.split(/\s+/).includes("italic")) {
      errors.push(`${location}: italic styling is not allowed.`);
    }
  }
}

function validateSemanticColors(semanticColors, themeLabel) {
  if (!semanticColors || typeof semanticColors !== "object") {
    errors.push(`${themeLabel}: semanticTokenColors must be defined.`);
    return;
  }

  for (const [selector, style] of Object.entries(semanticColors)) {
    const location = `${themeLabel}.semanticTokenColors.${selector}`;

    if (typeof style === "string") {
      if (!colorPattern.test(style)) {
        errors.push(`${location}: "${style}" is not a supported hex color.`);
      }
      continue;
    }

    if (!style || typeof style !== "object") {
      errors.push(`${location}: expected a color or semantic token style.`);
      continue;
    }

    if (style.foreground !== undefined && !colorPattern.test(style.foreground)) {
      errors.push(`${location}: "${style.foreground}" is not a supported hex color.`);
    }

    if (typeof style.fontStyle === "string" && style.fontStyle.split(/\s+/).includes("italic")) {
      errors.push(`${location}: italic styling is not allowed.`);
    }
  }
}
