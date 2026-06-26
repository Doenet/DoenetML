import { EditorView } from "@codemirror/view";

type ThemeMode = "dark" | "light";

// Shared gutter palette so editable and read-only themes stay aligned per mode.
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
 * The dark gutter values are also emitted in editor-viewer.css under
 * `[data-theme="dark"] .cm-gutters` for belt-and-suspenders coverage.
 */
export function colorTheme(darkMode: ThemeMode) {
    const gutterColors = getGutterColors(darkMode);
    return EditorView.theme({
        "&": {
            color: "var(--canvasText)",
            height: "100%",
            backgroundColor: "var(--canvas)",
        },
        ".cm-content": {
            caretColor: "#0e9",
            borderDownColor: "var(--canvasText)",
        },
        "&.cm-focused .cm-cursor": {
            backgroundColor: "var(--lightBlue)",
            borderLeftColor: "var(--canvasText)",
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
            backgroundColor: "var(--mainGray)",
        },
        "&.cm-focused": {
            color: "var(--canvasText)",
        },
        "cm-selectionLayer": {
            backgroundColor: "var(--mainGreen)",
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
    });
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
    return EditorView.theme({
        "&": {
            color: "var(--canvasText)",
            height: "100%",
        },
        ".cm-content": {
            caretColor: "#0e9",
            borderDownColor: "var(--canvasText)",
            backgroundColor: "#77777720",
        },
        "&.cm-focused .cm-cursor": {
            backgroundColor: "var(--lightBlue)",
            borderLeftColor: "var(--canvasText)",
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
            backgroundColor: "var(--mainGray)",
        },
        "&.cm-focused": {
            color: "var(--canvasText)",
        },
        "cm-selectionLayer": {
            backgroundColor: "var(--mainGreen)",
        },
        ".cm-gutters": {
            backgroundColor: gutterColors.backgroundColor,
            color: gutterColors.textColor,
            border: "none",
            borderRight: gutterColors.borderRight,
        },
        ".cm-activeLine": {
            backgroundColor: "var(--mainGray)",
            color: "var(--canvasText)",
        },
        ".cm-activeLineGutter": {
            backgroundColor: gutterColors.activeLineBackgroundColor,
        },
        ".cm-line": {
            color: lineTextColor,
        },
    });
}
