# PinkInk accessibility

PinkInk treats every text color as normal-size text and requires a WCAG AA
contrast ratio of at least 4.5:1. Essential non-text indicators require at
least 3:1.

The automated audit covers both PinkInk themes across:

- TextMate syntax tokens and semantic tokens
- Editor, active-line, folds, brackets, cursors, overview rulers, sticky scroll, find-match, peek, notebook, walkthrough, and diff surfaces
- AI chat, Agent Sessions, inline chat, inline edits, ghost text, and inlay hints
- Review comments, SCM graphs, merge editors, tests, coverage, and debugging
- Workbench labels, controls, tabs, Command Center, notifications, banners, and charts
- Profiles, ports, Extensions, MCP, and symbol icons
- Integrated terminal text, selections, command markers, suggestions, and all 16 ANSI colors
- Essential focus, state, diagnostic, testing, and debugging indicators

Transparent colors are alpha-composited over their actual background layers
before contrast is calculated.

Run the full validation suite:

```powershell
npm run check
```

Run only the WCAG audit:

```powershell
npm run check:contrast
```

Decorative separators, whitespace markers, and ornamental guides are excluded
because WCAG contrast requirements do not apply when they convey no essential
information.
