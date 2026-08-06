<?php

declare(strict_types=1);

// PinkInk showcase: namespaces (berry), enums (coral), interfaces & traits
// (blue), type keywords (gold), properties (magenta), $this (rosePink).

namespace DavidPine\PinkInk;

enum Accent: string
{
    case Pink = 'pink';
    case Cyan = 'cyan';
    case Magenta = 'magenta';
}

interface Describable
{
    public function describe(): string;
}

trait ContrastAware
{
    public function accessible(): bool
    {
        return $this->contrast >= self::MIN_CONTRAST;
    }
}

final class Swatch implements Describable
{
    use ContrastAware;

    public const MIN_CONTRAST = 4.5;

    public function __construct(
        public readonly string $name,
        public readonly string $hex,
        public readonly float $contrast,
    ) {
    }

    public function describe(): string
    {
        return sprintf('%s · %s · %.2f:1', $this->name, $this->hex, $this->contrast);
    }
}

final class Palette
{
    /** @var array<string, Swatch> */
    private array $swatches;

    public function __construct()
    {
        $this->swatches = [
            Accent::Pink->value => new Swatch('Neon Pink', '#ff4fa3', 6.37),
            Accent::Cyan->value => new Swatch('Electric Cyan', '#55e6e6', 13.2),
            Accent::Magenta->value => new Swatch('Hot Magenta', '#d979ff', 8.45),
        ];
    }

    public function find(Accent $accent): ?Swatch
    {
        return $this->swatches[$accent->value] ?? null;
    }

    /** @return list<string> */
    public function render(): array
    {
        $lines = [];
        foreach ($this->swatches as $swatch) {
            if ($swatch->accessible()) {
                $lines[] = $swatch->describe();
            }
        }

        return $lines;
    }
}

$palette = new Palette();
foreach ($palette->render() as $line) {
    echo $line, PHP_EOL;
}
