import Foundation

// PinkInk showcase: type aliases (violet), protocols (blue), enums (coral),
// keyword.other.type (gold), properties (magenta), self (pink).

typealias ContrastRatio = Double

enum Accent: String, CaseIterable {
    case pink
    case cyan
    case magenta
}

protocol Describable {
    func describe() -> String
}

struct Swatch: Describable, Hashable {
    static let minContrast: ContrastRatio = 4.5

    let name: String
    let hex: String
    let contrast: ContrastRatio

    var accessible: Bool {
        contrast >= Self.minContrast
    }

    func describe() -> String {
        String(format: "%@ · %@ · %.2f:1", name, hex, contrast)
    }
}

final class Palette {
    private let swatches: [Accent: Swatch]

    init() {
        self.swatches = [
            .pink: Swatch(name: "Neon Pink", hex: "#ff4fa3", contrast: 6.37),
            .cyan: Swatch(name: "Electric Cyan", hex: "#55e6e6", contrast: 13.2),
            .magenta: Swatch(name: "Hot Magenta", hex: "#d979ff", contrast: 8.45),
        ]
    }

    func find(_ accent: Accent) -> Swatch? {
        swatches[accent]
    }

    func render() -> [String] {
        swatches.values
            .filter { $0.accessible }
            .map { $0.describe() }
    }
}

let palette = Palette()
for line in palette.render() {
    print(line)
}
