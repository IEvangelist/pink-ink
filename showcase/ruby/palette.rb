# frozen_string_literal: true

# PinkInk showcase: symbols (gold), symbol hash keys (magenta),
# instance vars (magenta), special methods (blue), constants (gold).
module PinkInk
  MIN_CONTRAST = 4.5
  MAX_SWATCHES = 8

  class Swatch
    attr_reader :name, :hex, :contrast

    def initialize(name:, hex:, contrast:)
      @name = name
      @hex = hex
      @contrast = contrast
    end

    def describe
      format('%s · %s · %.2f:1', @name, @hex, @contrast)
    end

    def accessible?
      @contrast >= MIN_CONTRAST
    end
  end

  class Palette
    include Enumerable

    def initialize
      @swatches = {
        pink: Swatch.new(name: 'Neon Pink', hex: '#ff4fa3', contrast: 6.37),
        cyan: Swatch.new(name: 'Electric Cyan', hex: '#55e6e6', contrast: 13.2),
        magenta: Swatch.new(name: 'Hot Magenta', hex: '#d979ff', contrast: 8.45)
      }
    end

    def each(&block)
      @swatches.each_value(&block)
    end

    def find(accent)
      @swatches.fetch(accent) { raise KeyError, "unknown accent: #{accent}" }
    end

    def render
      select(&:accessible?).map(&:describe)
    end
  end
end

palette = PinkInk::Palette.new
palette.render.each { |line| puts line }
