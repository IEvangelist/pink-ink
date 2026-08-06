#!/usr/bin/env bash
#
# PinkInk showcase: functions (cyan), builtins (cyan), positional params
# ($1 rose), special vars ($@, $# rosePink), modifiers (local/readonly).

set -euo pipefail

readonly MIN_CONTRAST="4.5"
declare -A SWATCHES=(
  [pink]="Neon Pink|#ff4fa3|6.37"
  [cyan]="Electric Cyan|#55e6e6|13.2"
  [magenta]="Hot Magenta|#d979ff|8.45"
)

describe_swatch() {
  local accent="$1"
  local record="${SWATCHES[$accent]:-}"
  if [[ -z "$record" ]]; then
    printf 'unknown accent: %s\n' "$accent" >&2
    return 1
  fi

  IFS='|' read -r name hex contrast <<<"$record"
  printf '%s · %s · %s:1\n' "$name" "$hex" "$contrast"
}

render() {
  local count=0
  for accent in "${!SWATCHES[@]}"; do
    describe_swatch "$accent"
    (( count += 1 ))
  done
  printf 'rendered %d of %d swatches\n' "$count" "$#"
}

main() {
  if (( $# > 0 )); then
    describe_swatch "$1"
  else
    render "$@"
  fi
}

main "$@"
