import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { contrastRatio } from "./color-contrast.mjs";

const TEXT_MINIMUM = 4.5;
const UI_MINIMUM = 3;
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
  await readFile(resolve(projectRoot, "package.json"), "utf8"),
);
const failures = [];
const coverageFailures = [];
let checkCount = 0;
let lowestPassingCheck;
const lowestPassingChecksByMinimum = new Map();

const textPairs = [
  ["foreground", ["editor.background"]],
  ["descriptionForeground", ["sideBar.background"]],
  ["descriptionForeground", ["editorWidget.background"]],
  ["disabledForeground", ["sideBar.background"]],
  ["errorForeground", ["editor.background"]],
  ["icon.foreground", ["sideBar.background"]],
  ["textLink.foreground", ["editor.background"]],
  ["textLink.activeForeground", ["editor.background"]],
  ["textPreformat.foreground", ["textPreformat.background"]],
  ["button.foreground", ["button.background"]],
  ["button.foreground", ["button.hoverBackground"]],
  ["button.secondaryForeground", ["button.secondaryBackground"]],
  ["button.secondaryForeground", ["button.secondaryHoverBackground"]],
  ["dropdown.foreground", ["dropdown.background"]],
  ["input.foreground", ["input.background"]],
  ["input.placeholderForeground", ["input.background"]],
  ["inputOption.activeForeground", ["inputOption.activeBackground", "input.background"]],
  ["badge.foreground", ["badge.background"]],
  ["activityBarBadge.foreground", ["activityBarBadge.background"]],
  ["list.activeSelectionForeground", ["list.activeSelectionBackground", "sideBar.background"]],
  ["list.inactiveSelectionForeground", ["list.inactiveSelectionBackground", "sideBar.background"]],
  ["list.hoverForeground", ["list.hoverBackground", "sideBar.background"]],
  ["list.focusForeground", ["list.focusBackground", "sideBar.background"]],
  ["list.errorForeground", ["sideBar.background"]],
  ["list.highlightForeground", ["sideBar.background"]],
  ["list.invalidItemForeground", ["sideBar.background"]],
  ["list.warningForeground", ["sideBar.background"]],
  ["activityBar.foreground", ["activityBar.background"]],
  ["activityBar.foreground", ["activityBar.activeBackground"]],
  ["activityBar.inactiveForeground", ["activityBar.background"]],
  ["activityBarTop.foreground", ["activityBar.background"]],
  ["activityBarTop.inactiveForeground", ["activityBar.background"]],
  ["sideBar.foreground", ["sideBar.background"]],
  ["sideBarTitle.foreground", ["sideBar.background"]],
  ["sideBarSectionHeader.foreground", ["sideBarSectionHeader.background"]],
  ["tab.activeForeground", ["tab.activeBackground"]],
  ["tab.inactiveForeground", ["tab.inactiveBackground"]],
  ["tab.hoverForeground", ["tab.hoverBackground"]],
  ["tab.unfocusedActiveForeground", ["tab.activeBackground"]],
  ["tab.unfocusedInactiveForeground", ["tab.inactiveBackground"]],
  ["editor.foreground", ["editor.background"]],
  ["editor.selectionForeground", ["editor.selectionBackground", "editor.background"]],
  ["editorLineNumber.foreground", ["editor.background"]],
  ["editorLineNumber.activeForeground", ["editor.background"]],
  ["editorCodeLens.foreground", ["editor.background"]],
  ["editorLink.activeForeground", ["editor.background"]],
  ["editorBracketHighlight.foreground1", ["editor.background"]],
  ["editorBracketHighlight.foreground2", ["editor.background"]],
  ["editorBracketHighlight.foreground3", ["editor.background"]],
  ["editorBracketHighlight.foreground4", ["editor.background"]],
  ["editorBracketHighlight.foreground5", ["editor.background"]],
  ["editorBracketHighlight.foreground6", ["editor.background"]],
  ["editorBracketHighlight.unexpectedBracket.foreground", ["editor.background"]],
  ["editorWidget.foreground", ["editorWidget.background"]],
  ["editorSuggestWidget.foreground", ["editorSuggestWidget.background"]],
  ["editorSuggestWidget.highlightForeground", ["editorSuggestWidget.background"]],
  ["editorSuggestWidget.focusHighlightForeground", ["editorSuggestWidget.background"]],
  ["editorSuggestWidget.selectedForeground", ["editorSuggestWidget.selectedBackground"]],
  ["editorHoverWidget.foreground", ["editorHoverWidget.background"]],
  ["editorHoverWidget.highlightForeground", ["editorHoverWidget.background"]],
  ["peekViewResult.fileForeground", ["peekViewResult.background"]],
  ["peekViewResult.lineForeground", ["peekViewResult.background"]],
  ["peekViewResult.selectionForeground", ["peekViewResult.selectionBackground"]],
  ["peekViewTitleDescription.foreground", ["peekViewTitle.background"]],
  ["peekViewTitleLabel.foreground", ["peekViewTitle.background"]],
  ["panelTitle.activeForeground", ["panel.background"]],
  ["panelTitle.inactiveForeground", ["panel.background"]],
  ["statusBar.foreground", ["statusBar.background"]],
  ["statusBar.debuggingForeground", ["statusBar.debuggingBackground"]],
  ["statusBarItem.hoverForeground", ["statusBarItem.hoverBackground", "statusBar.background"]],
  ["statusBarItem.remoteForeground", ["statusBarItem.remoteBackground"]],
  ["statusBarItem.errorForeground", ["statusBarItem.errorBackground"]],
  ["statusBarItem.warningForeground", ["statusBarItem.warningBackground"]],
  ["titleBar.activeForeground", ["titleBar.activeBackground"]],
  ["titleBar.inactiveForeground", ["titleBar.inactiveBackground"]],
  ["menu.foreground", ["menu.background"]],
  ["menu.selectionForeground", ["menu.selectionBackground", "menu.background"]],
  ["menubar.selectionForeground", ["menubar.selectionBackground", "titleBar.activeBackground"]],
  ["notificationCenterHeader.foreground", ["notificationCenterHeader.background"]],
  ["notifications.foreground", ["notifications.background"]],
  ["notificationLink.foreground", ["notifications.background"]],
  ["quickInput.foreground", ["quickInput.background"]],
  ["pickerGroup.foreground", ["quickInput.background"]],
  ["keybindingLabel.foreground", ["keybindingLabel.background"]],
  ["terminal.foreground", ["terminal.background"]],
  ["terminal.selectionForeground", ["terminal.selectionBackground", "terminal.background"]],
  [
    "terminal.selectionForeground",
    ["terminal.inactiveSelectionBackground", "terminal.background"],
  ],
  ["breadcrumb.foreground", ["breadcrumb.background"]],
  ["breadcrumb.focusForeground", ["breadcrumb.background"]],
  ["breadcrumb.activeSelectionForeground", ["breadcrumb.background"]],
  ["settings.headerForeground", ["editor.background"]],
  ["settings.dropdownForeground", ["settings.dropdownBackground"]],
  ["settings.textInputForeground", ["settings.textInputBackground"]],
  ["settings.numberInputForeground", ["settings.numberInputBackground"]],
];

const uiPairs = [
  ["checkbox.foreground", ["checkbox.background"]],
  ["list.activeSelectionIconForeground", ["list.activeSelectionBackground", "sideBar.background"]],
  ["editorCursor.foreground", ["editor.background"]],
  ["terminalCursor.foreground", ["terminal.background"]],
  ["editorError.foreground", ["editor.background"]],
  ["editorWarning.foreground", ["editor.background"]],
  ["editorInfo.foreground", ["editor.background"]],
  ["editorHint.foreground", ["editor.background"]],
  ["editorLightBulb.foreground", ["editor.background"]],
  ["editorLightBulbAutoFix.foreground", ["editor.background"]],
  ["editorOverviewRuler.findMatchForeground", ["editor.background"]],
  ["editorOverviewRuler.rangeHighlightForeground", ["editor.background"]],
  ["debugIcon.breakpointForeground", ["editor.background"]],
  ["debugIcon.breakpointDisabledForeground", ["editor.background"]],
  ["debugIcon.startForeground", ["debugToolBar.background"]],
  ["debugIcon.pauseForeground", ["debugToolBar.background"]],
  ["debugIcon.stopForeground", ["debugToolBar.background"]],
  ["debugIcon.disconnectForeground", ["debugToolBar.background"]],
  ["debugIcon.restartForeground", ["debugToolBar.background"]],
  ["debugIcon.stepOverForeground", ["debugToolBar.background"]],
  ["debugIcon.stepIntoForeground", ["debugToolBar.background"]],
  ["debugIcon.stepOutForeground", ["debugToolBar.background"]],
  ["debugIcon.continueForeground", ["debugToolBar.background"]],
  ["debugIcon.stepBackForeground", ["debugToolBar.background"]],
  ["notebookStatusSuccessIcon.foreground", ["notebook.background"]],
  ["notebookStatusErrorIcon.foreground", ["notebook.background"]],
  ["notebookStatusRunningIcon.foreground", ["notebook.background"]],
  ["settings.checkboxForeground", ["settings.checkboxBackground"]],
  ["welcomePage.progress.foreground", ["welcomePage.progress.background"]],
  ["focusBorder", ["editor.background"]],
  ["activityBar.activeBorder", ["activityBar.background"]],
  ["tab.activeBorderTop", ["tab.activeBackground"]],
  ["panelTitle.activeBorder", ["panel.background"]],
  ["editor.findMatchBorder", ["editor.background"]],
  ["editor.findMatchHighlightBorder", ["editor.background"]],
  ["peekViewEditor.matchHighlightBorder", ["peekViewEditor.background"]],
];

const decorativeForegrounds = new Set([
  "editorGutter.commentRangeForeground",
  "editorRuler.foreground",
  "editorWhitespace.foreground",
  "textSeparator.foreground",
  "agentsVoice.speakingForeground",
]);

const syntaxBackgrounds = [
  ["editor", ["editor.background"]],
  ["active line", ["editor.lineHighlightBackground"]],
  ["find match", ["editor.findMatchBackground", "editor.background"]],
  ["find highlight", ["editor.findMatchHighlightBackground", "editor.background"]],
  ["peek editor", ["peekViewEditor.background"]],
  ["peek match", ["peekViewEditor.matchHighlightBackground", "peekViewEditor.background"]],
  ["notebook editor", ["notebook.cellEditorBackground"]],
  ["walkthrough editor", ["walkThrough.embeddedEditorBackground"]],
  ["inserted line", ["diffEditor.insertedLineBackground", "editor.background"]],
  ["removed line", ["diffEditor.removedLineBackground", "editor.background"]],
  [
    "inserted text",
    [
      "diffEditor.insertedTextBackground",
      "diffEditor.insertedLineBackground",
      "editor.background",
    ],
  ],
  [
    "removed text",
    [
      "diffEditor.removedTextBackground",
      "diffEditor.removedLineBackground",
      "editor.background",
    ],
  ],
  ["chat request code", ["chat.requestBackground"]],
  ["chat bubble code", ["chat.requestBubbleBackground"]],
  ["agents panel code", ["agentsPanel.background"]],
  ["inline chat", ["inlineChat.background"]],
  ["inline chat inserted", ["inlineChatDiff.inserted", "inlineChat.background"]],
  ["inline chat removed", ["inlineChatDiff.removed", "inlineChat.background"]],
  ["active comment range", ["editorCommentsWidget.rangeActiveBackground", "editor.background"]],
  ["comment range", ["editorCommentsWidget.rangeBackground", "editor.background"]],
  ["inline edit modified", ["inlineEdit.modifiedBackground", "editor.background"]],
  ["inline edit modified line", ["inlineEdit.modifiedChangedLineBackground", "inlineEdit.modifiedBackground", "editor.background"]],
  ["inline edit modified text", ["inlineEdit.modifiedChangedTextBackground", "inlineEdit.modifiedChangedLineBackground", "inlineEdit.modifiedBackground", "editor.background"]],
  ["inline edit original", ["inlineEdit.originalBackground", "editor.background"]],
  ["inline edit original line", ["inlineEdit.originalChangedLineBackground", "inlineEdit.originalBackground", "editor.background"]],
  ["inline edit original text", ["inlineEdit.originalChangedTextBackground", "inlineEdit.originalChangedLineBackground", "inlineEdit.originalBackground", "editor.background"]],
  ["merge current", ["merge.currentContentBackground", "editor.background"]],
  ["merge incoming", ["merge.incomingContentBackground", "editor.background"]],
  ["merge common", ["merge.commonContentBackground", "editor.background"]],
  ["merge editor change", ["mergeEditor.change.background", "editor.background"]],
  ["merge editor changed word", ["mergeEditor.change.word.background", "mergeEditor.change.background", "editor.background"]],
  ["merge editor base", ["mergeEditor.changeBase.background", "editor.background"]],
  ["merge editor base word", ["mergeEditor.changeBase.word.background", "mergeEditor.changeBase.background", "editor.background"]],
  ["merge conflict input one", ["mergeEditor.conflict.input1.background", "editor.background"]],
  ["merge conflict input two", ["mergeEditor.conflict.input2.background", "editor.background"]],
  ["merge conflicting lines", ["mergeEditor.conflictingLines.background", "editor.background"]],
  ["testing info line", ["testing.message.info.lineBackground", "editor.background"]],
  ["testing error line", ["testing.message.error.lineBackground", "editor.background"]],
  ["testing covered line", ["testing.coveredBackground", "editor.background"]],
  ["testing uncovered line", ["testing.uncoveredBackground", "editor.background"]],
  ["notebook symbol highlight", ["notebook.symbolHighlightBackground", "notebook.cellEditorBackground"]],
  ["folded code", ["editor.foldBackground", "editor.background"]],
  ["linked editing", ["editor.linkedEditingBackground", "editor.background"]],
  ["word highlight text", ["editor.wordHighlightTextBackground", "editor.background"]],
  ["bracket match", ["editorBracketMatch.background", "editor.background"]],
  ["diagnostic error", ["editorError.background", "editor.background"]],
  ["diagnostic warning", ["editorWarning.background", "editor.background"]],
  ["diagnostic info", ["editorInfo.background", "editor.background"]],
  ["unicode highlight", ["editorUnicodeHighlight.background", "editor.background"]],
  ["search editor match", ["searchEditor.findMatchBackground", "editor.background"]],
];

const terminalAnsiKeys = [
  "terminal.ansiBlack",
  "terminal.ansiRed",
  "terminal.ansiGreen",
  "terminal.ansiYellow",
  "terminal.ansiBlue",
  "terminal.ansiMagenta",
  "terminal.ansiCyan",
  "terminal.ansiWhite",
  "terminal.ansiBrightBlack",
  "terminal.ansiBrightRed",
  "terminal.ansiBrightGreen",
  "terminal.ansiBrightYellow",
  "terminal.ansiBrightBlue",
  "terminal.ansiBrightMagenta",
  "terminal.ansiBrightCyan",
  "terminal.ansiBrightWhite",
];

const testingIconKeys = [
  "testing.iconPassed",
  "testing.iconFailed",
  "testing.iconErrored",
  "testing.iconQueued",
  "testing.iconUnset",
  "testing.iconSkipped",
  "testing.runAction",
];

const gitDecorationKeys = [
  "gitDecoration.addedResourceForeground",
  "gitDecoration.modifiedResourceForeground",
  "gitDecoration.deletedResourceForeground",
  "gitDecoration.renamedResourceForeground",
  "gitDecoration.untrackedResourceForeground",
  "gitDecoration.ignoredResourceForeground",
  "gitDecoration.conflictingResourceForeground",
  "gitDecoration.submoduleResourceForeground",
];

const expandedTextPairs = [
  ["chat.slashCommandForeground", ["chat.slashCommandBackground"]],
  ["chat.avatarForeground", ["chat.avatarBackground"]],
  ["chat.editedFileForeground", ["chat.requestBackground"]],
  ["chat.editedFileForeground", ["chat.requestBubbleBackground"]],
  ["chat.linesAddedForeground", ["chat.requestBackground"]],
  ["chat.linesAddedForeground", ["chat.requestBubbleBackground"]],
  ["chat.linesRemovedForeground", ["chat.requestBackground"]],
  ["chat.linesRemovedForeground", ["chat.requestBubbleBackground"]],
  ["foreground", ["chat.requestBackground"]],
  ["foreground", ["chat.requestBubbleBackground"]],
  ["agentsPanel.foreground", ["agentsPanel.background"]],
  ["agentsChatInput.foreground", ["agentsChatInput.background"]],
  ["agentsChatInput.placeholderForeground", ["agentsChatInput.background"]],
  ["agentsNewSessionButton.foreground", ["agentsNewSessionButton.background"]],
  ["agentsNewSessionButton.foreground", ["agentsNewSessionButton.hoverBackground"]],
  ["agentsBadge.foreground", ["agentsBadge.background"]],
  ["agentsUnreadBadge.foreground", ["agentsUnreadBadge.background"]],
  ["inlineChat.foreground", ["inlineChat.background"]],
  ["inlineChatInput.placeholderForeground", ["inlineChatInput.background"]],
  ["editorGhostText.foreground", ["editorGhostText.background", "editor.background"]],
  ["editorInlayHint.foreground", ["editorInlayHint.background", "editor.background"]],
  ["editorInlayHint.parameterForeground", ["editorInlayHint.parameterBackground", "editor.background"]],
  ["editorInlayHint.typeForeground", ["editorInlayHint.typeBackground", "editor.background"]],
  ["tab.selectedForeground", ["tab.selectedBackground"]],
  ["tab.unfocusedHoverForeground", ["tab.hoverBackground"]],
  ["scmGraph.historyItemHoverLabelForeground", ["list.hoverBackground", "sideBar.background"]],
  ["scmGraph.historyItemHoverDefaultLabelForeground", ["scmGraph.historyItemHoverDefaultLabelBackground"]],
  ["scmGraph.historyItemHoverAdditionsForeground", ["scmGraph.historyItemHoverDefaultLabelBackground"]],
  ["scmGraph.historyItemHoverDeletionsForeground", ["scmGraph.historyItemHoverDefaultLabelBackground"]],
  ["git.blame.editorDecorationForeground", ["editor.background"]],
  ["gitDecoration.stageModifiedResourceForeground", ["sideBar.background"]],
  ["gitDecoration.stageDeletedResourceForeground", ["sideBar.background"]],
  ["testing.message.error.badgeForeground", ["testing.message.error.badgeBackground"]],
  ["testing.coverCountBadgeForeground", ["testing.coverCountBadgeBackground"]],
  ["debugView.stateLabelForeground", ["debugView.stateLabelBackground", "sideBar.background"]],
  ["debugView.exceptionLabelForeground", ["debugView.exceptionLabelBackground", "sideBar.background"]],
  ["debugConsole.infoForeground", ["panel.background"]],
  ["debugConsole.warningForeground", ["panel.background"]],
  ["debugConsole.errorForeground", ["panel.background"]],
  ["debugConsole.sourceForeground", ["panel.background"]],
  ["terminal.initialHintForeground", ["terminal.background"]],
  ["terminalSymbolIcon.symbolText", ["editorSuggestWidget.background"]],
  ["commandCenter.foreground", ["commandCenter.background"]],
  ["commandCenter.activeForeground", ["commandCenter.activeBackground"]],
  ["commandCenter.inactiveForeground", ["commandCenter.background"]],
  ["banner.foreground", ["banner.background"]],
  ["charts.foreground", ["editorWidget.background"]],
  ["profileBadge.foreground", ["profileBadge.background"]],
  ["extensionBadge.remoteForeground", ["extensionBadge.remoteBackground"]],
  ["extensionButton.foreground", ["extensionButton.background"]],
  ["extensionButton.foreground", ["extensionButton.hoverBackground"]],
  ["extensionButton.prominentForeground", ["extensionButton.prominentBackground"]],
  ["extensionButton.prominentForeground", ["extensionButton.prominentHoverBackground"]],
  ["surface.foreground", ["surface.background"]],
  ["quickInputList.focusForeground", ["quickInputList.focusBackground"]],
  ["quickInputList.focusHighlightForeground", ["quickInputList.focusBackground"]],
  ["editorActionList.foreground", ["editorActionList.background"]],
  ["editorActionList.focusForeground", ["editorActionList.focusBackground"]],
  ["settings.settingsHeaderHoverForeground", ["editor.background"]],
  ["inputValidation.errorForeground", ["inputValidation.errorBackground"]],
  ["inputValidation.infoForeground", ["inputValidation.infoBackground"]],
  ["inputValidation.warningForeground", ["inputValidation.warningBackground"]],
  ["markdownAlert.note.foreground", ["editor.background"]],
  ["markdownAlert.tip.foreground", ["editor.background"]],
  ["markdownAlert.important.foreground", ["editor.background"]],
  ["markdownAlert.warning.foreground", ["editor.background"]],
  ["markdownAlert.caution.foreground", ["editor.background"]],
  ["walkthrough.stepTitle.foreground", ["editor.background"]],
  ["strongForeground", ["editor.background"]],
  ["activeSessionView.foreground", ["activeSessionView.background"]],
  ["inactiveSessionView.foreground", ["inactiveSessionView.background"]],
  ["editorActiveLineNumber.foreground", ["editor.background"]],
  ["diffEditor.unchangedRegionForeground", ["diffEditor.unchangedRegionBackground"]],
];

const expandedUiPairs = [
  ["agentSessionReadIndicator.foreground", ["agentsPanel.background"]],
  ["inlineEdit.gutterIndicator.primaryForeground", ["inlineEdit.gutterIndicator.primaryBackground"]],
  ["inlineEdit.gutterIndicator.secondaryForeground", ["inlineEdit.gutterIndicator.secondaryBackground"]],
  ["inlineEdit.gutterIndicator.successfulForeground", ["inlineEdit.gutterIndicator.successfulBackground"]],
  ["editorLightBulbAi.foreground", ["editor.background"]],
  ["editorGutter.commentGlyphForeground", ["editor.background"]],
  ["editorGutter.commentUnresolvedGlyphForeground", ["editor.background"]],
  ["editorGutter.commentDraftGlyphForeground", ["editor.background"]],
  ["editorOverviewRuler.commentForeground", ["editor.background"]],
  ["editorOverviewRuler.commentUnresolvedForeground", ["editor.background"]],
  ["editorOverviewRuler.commentDraftForeground", ["editor.background"]],
  ["testing.message.info.decorationForeground", ["editor.background"]],
  ["debugConsoleInputIcon.foreground", ["panel.background"]],
  ["debugIcon.breakpointUnverifiedForeground", ["editor.background"]],
  ["debugIcon.breakpointCurrentStackframeForeground", ["editor.background"]],
  ["debugIcon.breakpointStackframeForeground", ["editor.background"]],
  ["notebookEditorOverviewRuler.runningCellForeground", ["notebook.editorBackground"]],
  ["terminalCommandGuide.foreground", ["terminal.background"]],
  ["terminalOverviewRuler.cursorForeground", ["terminal.background"]],
  ["terminalOverviewRuler.findMatchForeground", ["terminal.background"]],
  ["notificationsErrorIcon.foreground", ["notifications.background"]],
  ["notificationsWarningIcon.foreground", ["notifications.background"]],
  ["notificationsInfoIcon.foreground", ["notifications.background"]],
  ["banner.iconForeground", ["banner.background"]],
  ["ports.iconRunningProcessForeground", ["sideBar.background"]],
  ["quickInputList.focusIconForeground", ["quickInputList.focusBackground"]],
  ["editorOverviewRuler.currentContentForeground", ["editor.background"]],
  ["editorOverviewRuler.incomingContentForeground", ["editor.background"]],
  ["editorOverviewRuler.commonContentForeground", ["editor.background"]],
  ["diffEditorOverview.insertedForeground", ["editor.background"]],
  ["diffEditorOverview.removedForeground", ["editor.background"]],
  ["editor.inlineValuesForeground", ["editor.inlineValuesBackground", "editor.background"]],
];

const explicitUiColorPairs = [
  ["agentsChatInput.focusBorder", ["agentsChatInput.background"]],
  ["agentSessionSelectedBadge.border", ["agentsPanel.background"]],
  ["agentSessionSelectedUnfocusedBadge.border", ["agentsPanel.background"]],
  ["agentsNewSessionButton.background", ["agentsPanel.background"]],
  ["agentsNewSessionButton.hoverBackground", ["agentsPanel.background"]],
  ["agentsBadge.background", ["agentsPanel.background"]],
  ["agentsUnreadBadge.background", ["agentsPanel.background"]],
  ["chat.avatarBackground", ["chat.requestBackground"]],
  ["chat.thinkingShimmer", ["chat.requestBackground"]],
  ["chat.inputWorkingBorderColor1", ["input.background"]],
  ["chat.inputWorkingBorderColor2", ["input.background"]],
  ["chat.inputWorkingBorderColor3", ["input.background"]],
  ["chat.inputWorkingBorderColor1", ["agentsChatInput.background"]],
  ["chat.inputWorkingBorderColor2", ["agentsChatInput.background"]],
  ["chat.inputWorkingBorderColor3", ["agentsChatInput.background"]],
  ["inlineChatInput.focusBorder", ["inlineChatInput.background"]],
  ["inlineEdit.gutterIndicator.primaryBorder", ["inlineEdit.gutterIndicator.primaryBackground"]],
  ["inlineEdit.gutterIndicator.secondaryBorder", ["inlineEdit.gutterIndicator.secondaryBackground"]],
  ["inlineEdit.gutterIndicator.successfulBorder", ["inlineEdit.gutterIndicator.successfulBackground"]],
  ["inlineEdit.modifiedBorder", ["editor.background"]],
  ["inlineEdit.originalBorder", ["editor.background"]],
  ["inlineEdit.tabWillAcceptModifiedBorder", ["editor.background"]],
  ["inlineEdit.tabWillAcceptOriginalBorder", ["editor.background"]],
  ["editorCommentsWidget.resolvedBorder", ["editor.background"]],
  ["editorCommentsWidget.unresolvedBorder", ["editor.background"]],
  ["merge.border", ["editor.background"]],
  ["mergeEditor.conflict.unhandledFocused.border", ["editor.background"]],
  ["mergeEditor.conflict.unhandledUnfocused.border", ["editor.background"]],
  ["mergeEditor.conflict.handledFocused.border", ["editor.background"]],
  ["mergeEditor.conflict.handledUnfocused.border", ["editor.background"]],
  ["mergeEditor.conflict.unhandled.minimapOverViewRuler", ["editor.background"]],
  ["mergeEditor.conflict.handled.minimapOverViewRuler", ["editor.background"]],
  ["testing.message.error.badgeBorder", ["testing.message.error.badgeBackground"]],
  ["testing.peekBorder", ["editor.background"]],
  ["testing.messagePeekBorder", ["editor.background"]],
  ["testing.coveredBorder", ["editor.background"]],
  ["testing.coveredGutterBackground", ["editor.background"]],
  ["testing.uncoveredBorder", ["editor.background"]],
  ["testing.uncoveredGutterBackground", ["editor.background"]],
  ["testing.uncoveredBranchBackground", ["editor.background"]],
  ["debugExceptionWidget.border", ["debugExceptionWidget.background"]],
  ["notebook.cellInsertionIndicator", ["notebook.editorBackground"]],
  ["notebook.focusedCellBorder", ["notebook.editorBackground"]],
  ["notebook.focusedEditorBorder", ["notebook.cellEditorBackground"]],
  ["notebook.inactiveFocusedCellBorder", ["notebook.editorBackground"]],
  ["notebook.inactiveSelectedCellBorder", ["notebook.editorBackground"]],
  ["notebook.selectedCellBorder", ["notebook.editorBackground"]],
  ["terminalCommandDecoration.defaultBackground", ["terminal.background"]],
  ["terminalCommandDecoration.successBackground", ["terminal.background"]],
  ["terminalCommandDecoration.errorBackground", ["terminal.background"]],
  ["commandCenter.activeBorder", ["titleBar.activeBackground"]],
  ["notificationCenter.border", ["editor.background"]],
  ["notificationToast.border", ["editor.background"]],
  ["profiles.sashBorder", ["editor.background"]],
  ["profileBadge.background", ["sideBar.background"]],
  ["extensionBadge.remoteBackground", ["sideBar.background"]],
  ["extensionButton.background", ["sideBar.background"]],
  ["extensionButton.hoverBackground", ["sideBar.background"]],
  ["extensionButton.prominentBackground", ["sideBar.background"]],
  ["extensionButton.prominentHoverBackground", ["sideBar.background"]],
];

const surfaceWaveTextPairs = [
  ["editor.findMatchForeground", ["editor.findMatchBackground", "editor.background"]],
  ["editor.findMatchHighlightForeground", ["editor.findMatchHighlightBackground", "editor.background"]],
  ["editor.foldPlaceholderForeground", ["editor.background"]],
  ["editor.placeholder.foreground", ["editor.background"]],
  ["editorBracketMatch.foreground", ["editorBracketMatch.background", "editor.background"]],
  ["editorLineNumber.dimmedForeground", ["editor.background"]],
  ["search.resultsInfoForeground", ["sideBar.background"]],
  ["statusBar.noFolderForeground", ["statusBar.noFolderBackground"]],
  ["statusBarItem.errorHoverForeground", ["statusBarItem.errorHoverBackground"]],
  ["statusBarItem.offlineForeground", ["statusBarItem.offlineBackground"]],
  ["statusBarItem.offlineHoverForeground", ["statusBarItem.offlineHoverBackground"]],
  ["statusBarItem.prominentForeground", ["statusBarItem.prominentBackground"]],
  ["statusBarItem.prominentHoverForeground", ["statusBarItem.prominentHoverBackground"]],
  ["statusBarItem.remoteHoverForeground", ["statusBarItem.remoteHoverBackground"]],
  ["statusBarItem.warningHoverForeground", ["statusBarItem.warningHoverBackground"]],
  ["list.deemphasizedForeground", ["sideBar.background"]],
  ["list.focusHighlightForeground", ["list.focusBackground", "sideBar.background"]],
  ["panelSectionHeader.foreground", ["panelSectionHeader.background"]],
  ["panelTitleBadge.foreground", ["panelTitleBadge.background"]],
  ["activityErrorBadge.foreground", ["activityErrorBadge.background"]],
  ["activityWarningBadge.foreground", ["activityWarningBadge.background"]],
  ["editorSuggestWidgetStatus.foreground", ["editorSuggestWidget.background"]],
  ["editorGroup.dropIntoPromptForeground", ["editorGroup.dropIntoPromptBackground"]],
  ["editor.foreground", ["editorStickyScroll.background"]],
  ["panelTitle.activeForeground", ["panelStickyScroll.background"]],
  ["activityBarTop.foreground", ["activityBarTop.background"]],
  ["editorWidget.foreground", ["editorMarkerNavigationError.headerBackground", "editorWidget.background"]],
  ["editorWidget.foreground", ["editorMarkerNavigationInfo.headerBackground", "editorWidget.background"]],
  ["editorWidget.foreground", ["editorMarkerNavigationWarning.headerBackground", "editorWidget.background"]],
];

const surfaceWaveUiPairs = [
  ["editorGutter.foldingControlForeground", ["editor.background"]],
  ["editorGutter.itemGlyphForeground", ["editorGutter.itemBackground"]],
  ["editorMultiCursor.primary.foreground", ["editorMultiCursor.primary.background"]],
  ["editorMultiCursor.secondary.foreground", ["editorMultiCursor.secondary.background"]],
  ["editorOverviewRuler.addedForeground", ["editor.background"]],
  ["editorOverviewRuler.bracketMatchForeground", ["editor.background"]],
  ["editorOverviewRuler.deletedForeground", ["editor.background"]],
  ["editorOverviewRuler.errorForeground", ["editor.background"]],
  ["editorOverviewRuler.infoForeground", ["editor.background"]],
  ["editorOverviewRuler.modifiedForeground", ["editor.background"]],
  ["editorOverviewRuler.selectionHighlightForeground", ["editor.background"]],
  ["editorOverviewRuler.warningForeground", ["editor.background"]],
  ["editorOverviewRuler.wordHighlightForeground", ["editor.background"]],
  ["editorOverviewRuler.wordHighlightStrongForeground", ["editor.background"]],
  ["editorOverviewRuler.wordHighlightTextForeground", ["editor.background"]],
  ["problemsErrorIcon.foreground", ["panel.background"]],
  ["problemsInfoIcon.foreground", ["panel.background"]],
  ["problemsWarningIcon.foreground", ["panel.background"]],
  ["list.inactiveSelectionIconForeground", ["list.inactiveSelectionBackground", "sideBar.background"]],
  ["checkbox.disabled.foreground", ["checkbox.disabled.background"]],
  ["radio.activeForeground", ["radio.activeBackground"]],
  ["radio.inactiveForeground", ["radio.inactiveBackground"]],
  ["editorSuggestWidget.selectedIconForeground", ["editorSuggestWidget.selectedBackground"]],
];

const surfaceWaveUiColorPairs = [
  ["editor.compositionBorder", ["editor.background"]],
  ["editor.findRangeHighlightBorder", ["editor.background"]],
  ["editor.rangeHighlightBorder", ["editor.background"]],
  ["editor.selectionHighlightBorder", ["editor.background"]],
  ["editor.symbolHighlightBorder", ["editor.background"]],
  ["editor.wordHighlightBorder", ["editor.background"]],
  ["editor.wordHighlightStrongBorder", ["editor.background"]],
  ["editor.wordHighlightTextBorder", ["editor.background"]],
  ["editorBracketMatch.border", ["editor.background"]],
  ["editorGutter.addedSecondaryBackground", ["editor.background"]],
  ["editorGutter.deletedSecondaryBackground", ["editor.background"]],
  ["editorGutter.modifiedSecondaryBackground", ["editor.background"]],
  ["editorUnicodeHighlight.border", ["editor.background"]],
  ["searchEditor.findMatchBorder", ["editor.background"]],
  ["statusBarItem.focusBorder", ["statusBar.background"]],
  ["list.dropBetweenBackground", ["sideBar.background"]],
  ["list.filterMatchBorder", ["sideBar.background"]],
  ["list.focusAndSelectionOutline", ["sideBar.background"]],
  ["list.focusOutline", ["sideBar.background"]],
  ["list.inactiveFocusOutline", ["sideBar.background"]],
  ["checkbox.selectBorder", ["checkbox.selectBackground"]],
  ["radio.activeBorder", ["radio.inactiveBackground"]],
  ["radio.inactiveBorder", ["radio.inactiveBackground"]],
  ["activityBar.activeFocusBorder", ["activityBar.background"]],
  ["activityBar.dropBorder", ["activityBar.background"]],
  ["activityBarTop.activeBorder", ["activityBarTop.background"]],
  ["activityBarTop.dropBorder", ["activityBarTop.background"]],
  ["editorGroup.dropIntoPromptBorder", ["editorGroup.dropIntoPromptBackground"]],
  ["editorGroup.focusedEmptyBorder", ["editorGroup.emptyBackground"]],
];

const dynamicPairGroups = [
  {
    matches: (key) => key.startsWith("symbolIcon.") && key.endsWith("Foreground"),
    backgrounds: [["sideBar.background"], ["quickInput.background"]],
    minimum: UI_MINIMUM,
  },
  {
    matches: (key) => key.startsWith("terminalSymbolIcon.") && key.endsWith("Foreground"),
    backgrounds: [["editorSuggestWidget.background"]],
    minimum: UI_MINIMUM,
  },
  {
    matches: (key) => key.startsWith("extensionIcon.") || key.startsWith("mcpIcon."),
    backgrounds: [["sideBar.background"]],
    minimum: UI_MINIMUM,
  },
  {
    matches: (key) => key.startsWith("debugTokenExpression."),
    backgrounds: [["sideBar.background"]],
    minimum: TEXT_MINIMUM,
  },
  {
    matches: (key) => key.startsWith("testing.icon") || key === "testing.runAction",
    backgrounds: [["sideBar.background"]],
    minimum: UI_MINIMUM,
  },
  {
    matches: (key) => key.startsWith("scmGraph.foreground") || key.endsWith("RefColor"),
    backgrounds: [["sideBar.background"]],
    minimum: UI_MINIMUM,
  },
  {
    matches: (key) => key.startsWith("charts.") && key !== "charts.foreground",
    backgrounds: [["editorWidget.background"]],
    minimum: UI_MINIMUM,
  },
];

for (const contribution of packageJson.contributes.themes) {
  const theme = JSON.parse(
    await readFile(resolve(projectRoot, contribution.path), "utf8"),
  );
  const trackedForegrounds = new Set();

  for (const [foreground, layers] of textPairs) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      foreground,
      layers,
      TEXT_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const [foreground, layers] of uiPairs) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      foreground,
      layers,
      UI_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const [foreground, layers] of expandedTextPairs) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      foreground,
      layers,
      TEXT_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const [foreground, layers] of expandedUiPairs) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      foreground,
      layers,
      UI_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const [color, layers] of explicitUiColorPairs) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      color,
      layers,
      UI_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const [foreground, layers] of surfaceWaveTextPairs) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      foreground,
      layers,
      TEXT_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const [foreground, layers] of surfaceWaveUiPairs) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      foreground,
      layers,
      UI_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const [color, layers] of surfaceWaveUiColorPairs) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      color,
      layers,
      UI_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const group of dynamicPairGroups) {
    const matchingKeys = Object.keys(theme.colors).filter(group.matches);
    for (const key of matchingKeys) {
      for (const layers of group.backgrounds) {
        checkWorkbenchPair(
          theme,
          contribution.label,
          key,
          layers,
          group.minimum,
          trackedForegrounds,
        );
      }
    }
  }

  for (const key of gitDecorationKeys) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      key,
      ["sideBar.background"],
      TEXT_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const key of testingIconKeys) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      key,
      ["sideBar.background"],
      UI_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const key of terminalAnsiKeys) {
    checkWorkbenchPair(
      theme,
      contribution.label,
      key,
      ["terminal.background"],
      TEXT_MINIMUM,
      trackedForegrounds,
    );
  }

  for (const [index, rule] of theme.tokenColors.entries()) {
    const foreground = rule.settings?.foreground;
    if (!foreground) {
      continue;
    }

    const name = rule.name ?? JSON.stringify(rule.scope) ?? `rule ${index}`;
    if (rule.settings.background) {
      recordCheck(
        contribution.label,
        `token: ${name}`,
        foreground,
        [rule.settings.background],
        TEXT_MINIMUM,
      );
      continue;
    }

    for (const [surface, layers] of syntaxBackgrounds) {
      recordCheck(
        contribution.label,
        `token: ${name} on ${surface}`,
        foreground,
        resolveLayers(theme, layers),
        TEXT_MINIMUM,
      );
    }
  }

  for (const [selector, style] of Object.entries(theme.semanticTokenColors)) {
    const foreground = typeof style === "string" ? style : style.foreground;
    if (!foreground) {
      continue;
    }

    for (const [surface, layers] of syntaxBackgrounds) {
      recordCheck(
        contribution.label,
        `semantic: ${selector} on ${surface}`,
        foreground,
        resolveLayers(theme, layers),
        TEXT_MINIMUM,
      );
    }
  }

  const foregroundKeys = Object.keys(theme.colors).filter(
    (key) => key === "foreground" || /foreground$/i.test(key),
  );

  for (const key of foregroundKeys) {
    if (!trackedForegrounds.has(key) && !decorativeForegrounds.has(key)) {
      coverageFailures.push(`${contribution.label}: ${key}`);
    }
  }
}

if (coverageFailures.length > 0) {
  console.error("Contrast audit has unclassified foreground colors:");
  for (const failure of coverageFailures) {
    console.error(`- ${failure}`);
  }
}

if (failures.length > 0) {
  console.error(
    `WCAG contrast audit failed: ${failures.length} of ${checkCount} checks are below threshold.`,
  );

  failures
    .sort((left, right) => left.ratio - right.ratio)
    .forEach((failure) => {
      console.error(
        `- ${failure.theme}: ${failure.label} = ${failure.ratio.toFixed(2)}:1 ` +
          `(minimum ${failure.minimum.toFixed(1)}:1; ${failure.foreground} on ` +
          `${failure.background.join(" over ")})`,
      );
    });
}

if (coverageFailures.length > 0 || failures.length > 0) {
  process.exitCode = 1;
} else {
  const lowestTextCheck = lowestPassingChecksByMinimum.get(TEXT_MINIMUM);
  const lowestUiCheck = lowestPassingChecksByMinimum.get(UI_MINIMUM);
  console.log(
    `WCAG AA contrast passed: ${checkCount} checks. ` +
      `Text minimum: ${lowestTextCheck.ratio.toFixed(2)}:1 ` +
      `(${lowestTextCheck.theme}, ${lowestTextCheck.label}). ` +
      `Non-text minimum: ${lowestUiCheck.ratio.toFixed(2)}:1 ` +
      `(${lowestUiCheck.theme}, ${lowestUiCheck.label}). ` +
      `Overall minimum: ${lowestPassingCheck.ratio.toFixed(2)}:1.`,
  );
}

function checkWorkbenchPair(
  theme,
  themeLabel,
  foregroundKey,
  layers,
  minimum,
  trackedForegrounds,
) {
  const foreground = theme.colors[foregroundKey];
  if (!foreground) {
    coverageFailures.push(`${themeLabel}: missing ${foregroundKey}`);
    return;
  }

  trackedForegrounds.add(foregroundKey);
  recordCheck(
    themeLabel,
    `${foregroundKey} on ${layers.join(" over ")}`,
    foreground,
    resolveLayers(theme, layers),
    minimum,
  );
}

function resolveLayers(theme, layers) {
  return layers.map((keyOrColor) => {
    if (keyOrColor.startsWith("#")) {
      return keyOrColor;
    }

    const color = theme.colors[keyOrColor];
    if (!color) {
      throw new Error(`${theme.name}: missing background color ${keyOrColor}`);
    }

    return color;
  });
}

function recordCheck(theme, label, foreground, background, minimum) {
  let ratio;
  try {
    ratio = contrastRatio(foreground, background);
  } catch (error) {
    throw new Error(
      `${theme}: unable to measure ${label} (${foreground} on ${background.join(
        " over ",
      )}): ${error.message}`,
      { cause: error },
    );
  }

  const check = { theme, label, foreground, background, minimum, ratio };
  checkCount += 1;

  if (ratio + Number.EPSILON < minimum) {
    failures.push(check);
    return;
  }

  if (!lowestPassingCheck || ratio < lowestPassingCheck.ratio) {
    lowestPassingCheck = check;
  }

  const lowestForMinimum = lowestPassingChecksByMinimum.get(minimum);
  if (!lowestForMinimum || ratio < lowestForMinimum.ratio) {
    lowestPassingChecksByMinimum.set(minimum, check);
  }
}
