/**
 * Produces tattoo-inspired swatches for the PinkInk theme showcase.
 */
export type InkMode = "dark" | "light";

export interface Swatch {
  readonly name: string;
  readonly hex: `#${string}`;
  contrast: number;
}

export enum Accent {
  Pink = "pink",
  Cyan = "cyan",
  Magenta = "magenta",
}

const NEON_PINK = "#ff4fa3" as const;
const hexColorPattern = /^#[\da-f]{6}$/i;

export class PaletteService {
  private readonly swatches = new Map<Accent, Swatch>([
    [Accent.Pink, { name: "Neon Pink", hex: NEON_PINK, contrast: 6.37 }],
    [Accent.Cyan, { name: "Electric Cyan", hex: "#55e6e6", contrast: 13.2 }],
    [Accent.Magenta, { name: "Hot Magenta", hex: "#d979ff", contrast: 8.45 }],
  ]);

  public find(accent: Accent): Swatch | undefined {
    return this.swatches.get(accent);
  }

  public describe(mode: InkMode, accent: Accent): string {
    const swatch = this.find(accent);

    if (!swatch || !hexColorPattern.test(swatch.hex)) {
      throw new Error(`Unknown PinkInk accent: ${accent}`);
    }

    return `${mode.toUpperCase()} · ${swatch.name} · ${swatch.hex}`;
  }
}

export async function loadPalette(mode: InkMode): Promise<readonly Swatch[]> {
  const service = new PaletteService();
  const accents = Object.values(Accent);

  await Promise.resolve();
  return accents.flatMap((accent) => {
    const swatch = service.find(accent);
    return swatch ? [swatch] : [];
  });
}

void loadPalette("dark").then((swatches) => {
  console.log({ title: "PinkInk", count: swatches.length, swatches });
});
