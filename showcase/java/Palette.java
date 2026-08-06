package dev.davidpine.pinkink;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * PinkInk showcase: primitives (gold), records (green), enums (coral),
 * annotations (magenta), interfaces (blue), fields/properties (magenta).
 */
public final class Palette {

    public enum Accent {
        PINK,
        CYAN,
        MAGENTA;
    }

    public interface Describable {
        String describe();
    }

    public record Swatch(String name, String hex, double contrast) implements Describable {
        @Override
        public String describe() {
            return "%s · %s · %.2f:1".formatted(name, hex, contrast);
        }
    }

    @FunctionalInterface
    public interface Formatter {
        String format(Swatch swatch);
    }

    private static final int MAX_SWATCHES = 8;
    private static final double MIN_CONTRAST = 4.5d;
    private final Map<Accent, Swatch> swatches;

    public Palette() {
        this.swatches = Map.of(
            Accent.PINK, new Swatch("Neon Pink", "#ff4fa3", 6.37d),
            Accent.CYAN, new Swatch("Electric Cyan", "#55e6e6", 13.2d),
            Accent.MAGENTA, new Swatch("Hot Magenta", "#d979ff", 8.45d)
        );
    }

    public Optional<Swatch> find(Accent accent) {
        return Optional.ofNullable(swatches.get(accent));
    }

    public List<String> render(Formatter formatter) {
        boolean verbose = swatches.size() < MAX_SWATCHES;
        return swatches.values().stream()
            .filter(swatch -> swatch.contrast() >= MIN_CONTRAST)
            .map(verbose ? formatter::format : Swatch::describe)
            .toList();
    }

    public static void main(String[] args) {
        var palette = new Palette();
        for (var line : palette.render(Swatch::describe)) {
            System.out.println(line);
        }
    }
}
