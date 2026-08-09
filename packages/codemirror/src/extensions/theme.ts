import { EditorView } from "@codemirror/view";

export type ThemeMode = "dark" | "light";

/**
 * Three things the editor points at behind or around text, shared by the
 * editable and read-only themes so they can't drift. Each gets its own visual
 * channel, because when all three were fills of similar strength an author
 * could not tell which was which:
 *
 *  - `selection` — a solid fill under the text the author selected, including
 *    every range Ctrl+D has collected. By far the loudest of the three: it
 *    marks what the next keystroke acts on.
 *  - `match` — a faint fill under the other occurrences of that text on
 *    screen (see `selection-highlight.ts`). A hint, nothing more.
 *  - `tagMatch` / `tagMismatch` — the tag pair under the cursor, drawn as an
 *    outline with no fill at all. CodeMirror's `bracketMatching` ships a
 *    translucent teal fill for this, which on the dark canvas landed at
 *    1.51:1 — indistinguishable from the other two. An outline says the same
 *    thing in a channel neither fill can be confused with.
 *
 * What caps a fill is the text on top of it: the syntax palette must clear
 * WCAG AA (4.5:1) against whatever it is painted over. For `match` that is the
 * binding constraint and the reason it stays faint. The selection escapes it
 * by recoloring its own text — `selectedText` below — so only that one color
 * has to clear AA there, which is what buys the fill its strength. Ratios are
 * against the canvas of the mode; `selectionAccessibility.cy.tsx` measures the
 * text side.
 */
function getHighlightColors(darkMode: ThemeMode) {
    if (darkMode === "dark") {
        return {
            // 3.09:1 on #121212 — clearing WCAG's 3:1 for non-text contrast,
            // where the #092c4d this replaces sat at 1.32:1 and authors read
            // it as no highlight at all. White text on it is 6.07:1.
            selection: "#1b62b5",
            selectedText: "#ffffff",
            match: "#14335a", // 1.47:1
            tagMatch: "#3fa8a0", // 6.53:1 as an outline
            tagMismatch: "#f0665e", // 6.04:1
        };
    }

    return {
        // 1.96:1 on white, up from the 1.28:1 of the neutral `--mainGray`
        // (#e3e3e3) this replaces — a gray that is also the gutter's
        // background, so the selection read as a piece of the editor chrome.
        // Near-black text on it is 9.64:1.
        selection: "#93bcf0",
        selectedText: "#0d1117",
        match: "#e2edfc", // 1.18:1
        tagMatch: "#0f6e66", // 6.10:1 as an outline
        tagMismatch: "#c9372c", // 5.16:1
    };
}

/**
 * Highlight rules shared by the editable and read-only themes.
 *
 * CodeMirror's base theme colors the selection itself, and does so with a
 * high-specificity selector for the *focused* state
 * (`&<light|dark>.cm-focused > .cm-scroller > .cm-selectionLayer
 * .cm-selectionBackground`). We mirror that full path so our color actually
 * wins when focused, and add a focus-agnostic rule so the *blurred* selection
 * (base default `#d9d9d9` light / `#222` dark) is overridden too — otherwise
 * clicking away from the editor reverts the highlight to the washed-out base
 * color. `::selection` covers the native-selection fallback.
 */
function highlightThemeRules(darkMode: ThemeMode) {
    const { selection, selectedText, match, tagMatch, tagMismatch } =
        getHighlightColors(darkMode);
    const outline = (color: string) => ({
        backgroundColor: "transparent",
        outline: `1px solid ${color}`,
        borderRadius: "2px",
    });
    return {
        "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":
            { backgroundColor: selection },
        "& > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
            backgroundColor: selection,
        },
        "::selection": { backgroundColor: selection, color: selectedText },

        // The syntax palette writes `color` onto a generated class of its own,
        // and whether that span ends up inside the selection's span, outside
        // it, or merged with it is CodeMirror's business, not ours. All three
        // selectors are listed so the recolor wins whichever way they nest —
        // each outranks the single generated class, and `color` inherits down
        // to whatever is nested inside.
        ".cm-selectedText, .cm-selectedText span, span .cm-selectedText": {
            color: selectedText,
        },

        ".cm-selectionMatch": { backgroundColor: match },

        // `backgroundColor: transparent` is doing real work: it cancels the
        // fill CodeMirror's base theme sets for these, which is the fill that
        // competed with the selection.
        "&.cm-focused .cm-matchingBracket, .cm-matchingBracket":
            outline(tagMatch),
        "&.cm-focused .cm-nonmatchingBracket, .cm-nonmatchingBracket":
            outline(tagMismatch),
    };
}

/**
 * The page's canvas color, with a fallback for a host that has not defined
 * `--canvas` (the dev sites, and anything embedding this package without
 * `@doenet/doenetml`'s stylesheet). The fallback matters because `CodeMirror`
 * turns off `@uiw/react-codemirror`'s own theme, which used to paint an
 * unconditional white here; without a value of our own the editor would fall
 * through to whatever is behind it.
 */
function canvasBackground(darkMode: ThemeMode) {
    return darkMode === "dark"
        ? "var(--canvas, #121212)"
        : "var(--canvas, #fff)";
}

// Shared gutter palette used by both the editable and read-only themes to keep colors aligned per mode.
function getGutterColors(darkMode: ThemeMode) {
    if (darkMode === "dark") {
        return {
            backgroundColor: "#1e1e1e",
            textColor: "#8b949e",
            borderRight: "1px solid #333",
            activeLineBackgroundColor: "#363636",
        };
    }

    return {
        backgroundColor: "var(--mainGray)",
        textColor: "#595959",
        borderRight: "none",
        activeLineBackgroundColor: "var(--lightBlue)",
    };
}

/**
 * WCAG 2.1 AA compliant color theme for the editable code area.
 *
 * `darkMode` switches a handful of colors that cannot be expressed with a
 * single CSS variable because the light and dark gutters need different
 * treatments:
 *  - light: gutter bg = `--mainGray` (#e3e3e3) with text #595959 (4.54:1)
 *  - dark:  gutter bg = #1e1e1e (VS Code-style, barely lighter than canvas)
 *           with muted text #8b949e (5.2:1 on #1e1e1e)
 *
 * The dark gutter values are also emitted in `editor-viewer.css` under
 * `[data-theme="dark"] .editor-panel .cm-gutters` for belt-and-suspenders
 * coverage inside `EditorViewer`.
 */
export function colorTheme(darkMode: ThemeMode) {
    const gutterColors = getGutterColors(darkMode);
    return EditorView.theme(
        {
            "&": {
                color: "var(--canvasText)",
                height: "100%",
                backgroundColor: canvasBackground(darkMode),
            },
            ".cm-content": {
                caretColor: "#0e9",
            },
            "&.cm-focused .cm-cursor": {
                borderLeftColor: "var(--canvasText)",
            },
            ...highlightThemeRules(darkMode),
            "&.cm-focused": {
                color: "var(--canvasText)",
            },
            ".cm-gutters": {
                backgroundColor: gutterColors.backgroundColor,
                color: gutterColors.textColor,
                border: "none",
                borderRight: gutterColors.borderRight,
            },
            ".cm-activeLine": {
                backgroundColor: "#50505020",
                // Must be explicit: CodeMirror's base theme sets activeLine color
                // to a dark value which is invisible on a dark canvas.
                color: "var(--canvasText)",
            },
            // Subtle gutter highlight on the active line — CodeMirror's base
            // theme uses #e2f2ff (light blue) which is glaring on a dark gutter.
            ".cm-activeLineGutter": {
                backgroundColor: gutterColors.activeLineBackgroundColor,
            },
        },
        // Tell CodeMirror the actual brightness so its base theme applies
        // dark-appropriate defaults (e.g. the blurred selection color) instead
        // of light ones.
        { dark: darkMode === "dark" },
    );
}

// Shared icon palette so all completion types flip together between modes.
function getCompletionIconColors(darkMode: ThemeMode) {
    if (darkMode === "dark") {
        return {
            // Verified ≥4.5:1 on #2a2a2a (the dark tooltip surface)
            component: "#58a6ff", // blue   ~7.6:1
            enumAttr: "#3fb950", // green  ~7.0:1
            value: "#4dd0e1", // teal   ~8.8:1
            reference: "#bc8cff", // purple ~6.5:1
            snippet: "#f78166", // orange ~6.3:1
        };
    }

    return {
        // Verified ≥4.5:1 on white dropdown
        component: "#1f6feb", // blue
        enumAttr: "#1a7f37", // green
        value: "#0e7c86", // teal
        reference: "#8250df", // purple
        snippet: "#bc4c00", // orange
    };
}

/**
 * Left-column glyphs for the autocomplete dropdown, one per DoenetML category.
 * CodeMirror renders these from each completion's `type` via the built-in class
 * `.cm-completionIcon-<type>` (types assigned by `deriveCompletionType` in
 * `@doenet/lsp-tools`). Its base theme only defines glyphs for a fixed set of
 * types (and dims them to 0.6 opacity), so we override the one we reuse
 * (`enum`) and add glyphs for our custom types. Uses EditorView.theme (not
 * baseTheme) so these win over CodeMirror's built-in rules by later injection
 * at equal CSS specificity. Glyph-only (CSS `::after` content) — no image
 * assets.
 *
 * Colors are chosen for WCAG AA contrast on the dropdown background surface:
 *  - light mode: white dropdown → light-tuned palette
 *  - dark mode:  #2a2a2a dropdown (set by tooltip.css in dark mode) → brighter palette
 */
export function completionIconTheme(darkMode: ThemeMode) {
    const colors = getCompletionIconColors(darkMode);

    return EditorView.theme({
        ".cm-completionIcon-component::after": { content: '"\\25C8"' }, // ◈
        ".cm-completionIcon-refproperty::after": { content: '"."' },
        ".cm-completionIcon-closetag::after": { content: '"/"' },
        ".cm-completionIcon-enum::after": { content: '"@"' }, // attribute name
        ".cm-completionIcon-value::after": { content: '"\\25AA"' }, // ▪ (enum value)
        ".cm-completionIcon-reference::after": { content: '"$"' },
        ".cm-completionIcon-snippet::after": { content: '"\\274F"' }, // ❏

        ".cm-completionIcon-component": {
            color: colors.component,
            opacity: "1",
        },
        ".cm-completionIcon-enum": { color: colors.enumAttr, opacity: "1" },
        ".cm-completionIcon-value": { color: colors.value, opacity: "1" },
        ".cm-completionIcon-reference": {
            color: colors.reference,
            opacity: "1",
        },
        ".cm-completionIcon-refproperty": {
            color: colors.reference,
            opacity: "1",
        },
        ".cm-completionIcon-snippet": { color: colors.snippet, opacity: "1" },
        ".cm-completionIcon-closetag": {
            color: colors.component,
            opacity: "1",
        },

        // The highlighted option has a solid blue background (CodeMirror's
        // baseTheme: #17c light / #347 dark, with white label text), against
        // which the category colors above are nearly invisible. Render the
        // glyph white on the selected row so it stays legible, matching the
        // label. The descendant selector outranks the single-class color rules
        // above, so it wins regardless of order.
        ".cm-tooltip-autocomplete ul li[aria-selected] .cm-completionIcon": {
            color: "#fff",
            opacity: "1",
        },
    });
}

/**
 * WCAG 2.1 AA compliant read-only color theme.
 *
 * Read-only code gets a tinted content background and muted line text to
 * distinguish it from the editable area. The muted color differs per mode:
 *  - light: #595959 (4.54:1 on white)
 *  - dark:  #c8c8c8 (muted but ~11:1 on the dark canvas #121212)
 */
export function readOnlyColorTheme(darkMode: ThemeMode) {
    const gutterColors = getGutterColors(darkMode);
    const lineTextColor = darkMode === "dark" ? "#c8c8c8" : "#595959";
    const activeLineBackgroundColor =
        darkMode === "dark" ? "#50505020" : "var(--mainGray)";
    return EditorView.theme(
        {
            "&": {
                color: "var(--canvasText)",
                height: "100%",
                backgroundColor: canvasBackground(darkMode),
            },
            ".cm-content": {
                caretColor: "#0e9",
                backgroundColor: "#77777720",
            },
            "&.cm-focused .cm-cursor": {
                borderLeftColor: "var(--canvasText)",
            },
            ...highlightThemeRules(darkMode),
            "&.cm-focused": {
                color: "var(--canvasText)",
            },
            ".cm-gutters": {
                backgroundColor: gutterColors.backgroundColor,
                color: gutterColors.textColor,
                border: "none",
                borderRight: gutterColors.borderRight,
            },
            ".cm-activeLine": {
                backgroundColor: activeLineBackgroundColor,
                color: "var(--canvasText)",
            },
            ".cm-activeLineGutter": {
                backgroundColor: gutterColors.activeLineBackgroundColor,
            },
            ".cm-line": {
                color: lineTextColor,
            },
        },
        { dark: darkMode === "dark" },
    );
}
