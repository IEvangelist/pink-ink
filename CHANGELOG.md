# Changelog

## 0.0.4

- Overhauled diff colors so added and removed lines are much easier to tell apart: bolder rose fills for deletions and teal fills for insertions, with brighter word-level highlights on the exact tokens that changed, in both themes.
- Strengthened the inline-chat diff highlights (`inlineChatDiff.inserted` / `inlineChatDiff.removed`) to match.
- Diff line and word fills are audited as non-text UI cues (minimum 3:1) while the code on top of them still clears the 4.5:1 text contrast floor.
- Refreshed the README screenshots to reflect the pink workbench chrome and added a diff-readability showcase.

## 0.0.3

- Colorized the Activity Bar (far-left toolbar): resting icons are a lighter pink, the active icon is brighter, and the active item gains a subtle pink background fill in both themes.
- Extended the pink treatment to the top menu bar (File, Edit, Selection, ...), the window title, and the top-right layout icons via `titleBar.activeForeground`, with a softer pink for the unfocused-window title.
- Colorized the status bar text and icons (line and column, language mode, encoding, notifications, and error/warning counts) with a matching pink in both themes.
- Pinkified the light theme's menu dropdown selection highlight, which was previously an off-brand cool gray, to match the dark theme.

## 0.0.2

- Fixed the Command Center turning green while a Copilot agent session is active by retinting `agentStatusIndicator.background` to the subtle Command Center active surface in both themes.
- Surfaced the author "David Pine" in the color theme picker by adding a `description` to each contributed theme.

## 0.0.1

- Added PinkInk Dark with neon-pink-on-blackened-plum styling.
- Added PinkInk Light with a crisp white editor and cool-gray workbench surfaces.
- Added cyan and magenta syntax accents.
- Added semantic highlighting and integrated terminal colors.
- Ensured both themes use no italic token styles.
- Added automated WCAG AA contrast validation across syntax, workbench, and terminal colors.
- Expanded high-impact theming across AI/chat, inline edits, SCM, merge, testing, debugging, notebooks, terminal enhancements, notifications, charts, profiles, ports, Extensions, and MCP.
- Increased PinkInk Light vibrancy with richer ink-plum text and more saturated pink, cyan, teal, azure, magenta, coral, and gold accents.
- Expanded that vibrant role separation across TypeScript, JavaScript, Python, Go, Rust, HTML, CSS, JSON, YAML, SQL, PowerShell, Markdown, and other semantic-token providers.
- Replaced the beige light palette with stronger neutral-white surfaces, cool-gray chrome, deeper ink text, and higher-impact accent contrast.
- Added 160 documented editor, status bar, list/tree, control, panel, Activity Bar, widget, and editor-group colors to both themes.
- Added dedicated JSON/YAML scalar variation plus Python, PowerShell, and Rust grammar and semantic-token refinements.
- Broadened per-language syntax coverage with distinct roles for built-in primitive types, instance and struct members, namespace/module prefixes, section names, symbols and symbol keys, type aliases, and built-in/semantic variables across Java, C, C++, Objective-C, Swift, Ruby, PHP, Perl, Lua, R, Julia, Dart, Groovy, Clojure, CoffeeScript, F#, Shell, SCSS, Less, XML, HLSL, ShaderLab, INI, and more.
- Expanded workbench chrome with 94 additional surfaces: the multi-file and inline diff editor (moved-code and unchanged-region styling), debug stack-frame highlights and inline values, snippet tab stops, the code-action and command-palette lists, input-validation message text, settings-editor rows and headers, toolbar hover/active states, sidebar sticky scroll and title bars, minimap info and git-gutter marks, Markdown alert callouts, chart lines/axes, and the newest agent, voice, and session surfaces.
- Maximized PinkInk Light accent chroma: every syntax and semantic accent was regenerated at the highest saturation that still meets WCAG AA on white, giving richer pink, magenta, violet, blue, cyan, green, and gold roles without lowering contrast.
- Completed workbench color coverage by auditing both themes against the running build's full 904-color registry: added the final surfaces (global sash hover border, suggest-widget focus outline, Activity Bar top border, Simple Browser border, Peek sticky-scroll header and gutter, test-coverage minimap marks, active dictation mic glow, scrollbar track, and minimap foreground opacity) and removed a dead non-registered color key, leaving only the high-contrast-only borders intentionally unset.
- Added an ink-drop extension icon and Marketplace listing metadata (repository, homepage, and issue tracker links).
- Rewrote the README with badges, an install guide, a palette reference, a language showcase, accessibility notes, and contribution steps.
- Added continuous integration and a dormant release pipeline built on SHA-pinned, latest-stable GitHub Actions, plus Dependabot updates for npm and Actions.
