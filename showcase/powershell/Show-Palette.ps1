Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

enum Accent {
    Pink
    Cyan
    Magenta
}

class Swatch {
    [string] $Name
    [string] $Hex
    [double] $Contrast

    Swatch([string] $name, [string] $hex, [double] $contrast) {
        $this.Name = $name
        $this.Hex = $hex
        $this.Contrast = $contrast
    }

    [string] ToString() {
        return '{0} · {1} · {2:N2}:1' -f $this.Name, $this.Hex, $this.Contrast
    }
}

function Get-PinkInkSwatch {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [Accent] $Accent
    )

    $palette = @{
        Pink = [Swatch]::new('Neon Pink', '#FF4FA3', 6.37)
        Cyan = [Swatch]::new('Electric Cyan', '#55E6E6', 13.2)
        Magenta = [Swatch]::new('Hot Magenta', '#D979FF', 8.45)
    }

    return $palette[$Accent.ToString()]
}

[System.Enum]::GetValues[Accent()] | ForEach-Object {
    Get-PinkInkSwatch -Accent $_
}
