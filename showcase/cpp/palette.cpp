#include <cstdint>
#include <optional>
#include <string>
#include <unordered_map>
#include <vector>

// PinkInk showcase: primitive types (gold), members (magenta),
// namespaces (berry), classes/structs/enums (gold/green/coral).
namespace pinkink {

enum class Accent : std::uint8_t {
    Pink,
    Cyan,
    Magenta,
};

struct Swatch {
    std::string name;
    std::string hex;
    double contrast{0.0};

    [[nodiscard]] std::string describe() const {
        return name + " · " + hex;
    }
};

class Palette {
public:
    Palette() {
        swatches_.emplace(Accent::Pink, Swatch{"Neon Pink", "#ff4fa3", 6.37});
        swatches_.emplace(Accent::Cyan, Swatch{"Electric Cyan", "#55e6e6", 13.2});
        swatches_.emplace(Accent::Magenta, Swatch{"Hot Magenta", "#d979ff", 8.45});
    }

    [[nodiscard]] std::optional<Swatch> find(Accent accent) const {
        if (auto it = swatches_.find(accent); it != swatches_.end()) {
            return it->second;
        }
        return std::nullopt;
    }

    [[nodiscard]] std::vector<std::string> render() const {
        std::vector<std::string> lines;
        lines.reserve(swatches_.size());
        for (const auto& [accent, swatch] : swatches_) {
            if (swatch.contrast >= kMinContrast) {
                lines.push_back(swatch.describe());
            }
        }
        return lines;
    }

private:
    static constexpr double kMinContrast = 4.5;
    static constexpr std::uint32_t kMaxSwatches = 8U;

    std::unordered_map<Accent, Swatch> swatches_;
};

}  // namespace pinkink

int main() {
    const pinkink::Palette palette;
    for (const auto& line : palette.render()) {
        // Rendered swatch description.
        (void)line;
    }
    return 0;
}
