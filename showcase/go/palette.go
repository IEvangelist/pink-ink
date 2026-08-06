package palette

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
)

type Accent string

const (
	Pink    Accent = "pink"
	Cyan    Accent = "cyan"
	Magenta Accent = "magenta"
)

type Swatch struct {
	Name     string
	Hex      string
	Contrast float64
}

var (
	errUnknownAccent = errors.New("unknown PinkInk accent")
	hexColorPattern  = regexp.MustCompile(`^#[0-9a-fA-F]{6}$`)
)

func Describe(accent Accent, uppercase bool) (string, error) {
	swatch, ok := map[Accent]Swatch{
		Pink:    {Name: "Neon Pink", Hex: "#ff4fa3", Contrast: 6.37},
		Cyan:    {Name: "Electric Cyan", Hex: "#55e6e6", Contrast: 13.2},
		Magenta: {Name: "Hot Magenta", Hex: "#d979ff", Contrast: 8.45},
	}[accent]
	if !ok {
		return "", fmt.Errorf("%w: %q", errUnknownAccent, accent)
	}
	if !hexColorPattern.MatchString(swatch.Hex) {
		return "", fmt.Errorf("invalid color %q", swatch.Hex)
	}

	label := fmt.Sprintf("%s · %s · %.2f:1", swatch.Name, swatch.Hex, swatch.Contrast)
	if uppercase {
		label = strings.ToUpper(label)
	}

	return label, nil
}
