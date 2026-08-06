using System.Collections.Frozen;
using System.Text.RegularExpressions;

namespace PinkInk.Showcase;

public enum Accent
{
    Pink,
    Cyan,
    Magenta
}

public sealed record Swatch(string Name, string Hex, double Contrast);

public interface IPaletteService
{
    Swatch Get(Accent accent);
}

public sealed partial class PaletteService : IPaletteService
{
    private const string NeonPink = "#FF4FA3";

    private static readonly FrozenDictionary<Accent, Swatch> Swatches =
        new Dictionary<Accent, Swatch>
        {
            [Accent.Pink] = new("Neon Pink", NeonPink, 6.37),
            [Accent.Cyan] = new("Electric Cyan", "#55E6E6", 13.2),
            [Accent.Magenta] = new("Hot Magenta", "#D979FF", 8.45)
        }.ToFrozenDictionary();

    public Swatch Get(Accent accent) =>
        Swatches.TryGetValue(accent, out Swatch? swatch)
            ? swatch
            : throw new ArgumentOutOfRangeException(nameof(accent), accent, "Unknown accent");

    public string Describe(Accent accent)
    {
        Swatch swatch = Get(accent);

        if (!HexColorPattern().IsMatch(swatch.Hex))
        {
            throw new InvalidOperationException($"Invalid color: {swatch.Hex}");
        }

        return $"{accent}: {swatch.Name} ({swatch.Hex})";
    }

    [GeneratedRegex("^#[0-9A-F]{6}$", RegexOptions.IgnoreCase)]
    private static partial Regex HexColorPattern();
}
