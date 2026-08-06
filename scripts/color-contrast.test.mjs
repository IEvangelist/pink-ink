import assert from "node:assert/strict";
import test from "node:test";

import {
  compositeColors,
  contrastRatio,
  flattenLayers,
  parseHexColor,
} from "./color-contrast.mjs";

test("black and white have the maximum contrast ratio", () => {
  assert.equal(contrastRatio("#000000", ["#FFFFFF"]), 21);
});

test("three-digit and six-digit colors produce the same result", () => {
  assert.deepEqual(parseHexColor("#F0A"), parseHexColor("#FF00AA"));
});

test("translucent backgrounds are composited over their base", () => {
  const flattened = flattenLayers(["#00000080", "#FFFFFF"]);

  assert.ok(Math.abs(flattened.red - 127 / 255) < 0.002);
  assert.ok(Math.abs(flattened.green - 127 / 255) < 0.002);
  assert.ok(Math.abs(flattened.blue - 127 / 255) < 0.002);
  assert.equal(flattened.alpha, 1);
});

test("translucent foregrounds are composited before measuring", () => {
  const ratio = contrastRatio("#00000080", ["#FFFFFF"]);

  assert.ok(ratio > 3.94 && ratio < 4.01);
});

test("compositing preserves an opaque foreground", () => {
  const foreground = parseHexColor("#FF4FA3");
  const output = compositeColors(foreground, parseHexColor("#100C12"));

  assert.deepEqual(output, foreground);
});
