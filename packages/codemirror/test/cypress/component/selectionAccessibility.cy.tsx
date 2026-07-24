import React from "react";
import { CodeMirror } from "../../../src/CodeMirror";
import type { ThemeMode } from "../../../src/extensions/theme";

/**
 * Accessibility coverage for *selected* (highlighted) text in the editor.
 *
 * When an author drags to highlight code, the selection background is painted
 * behind the syntax-highlighted tokens. The tokens keep their own colors, so
 * the selection background must contrast with every token color — including the
 * near-white content color used on the dark canvas. A too-bright dark-mode
 * selection washes those tokens out (the reported illegibility).
 *
 * Why not `cy.checkA11y` here?  axe-core's `color-contrast` rule cannot see the
 * selection: CodeMirror paints it in a separate, negative-z-index layer
 * (`.cm-selectionLayer > .cm-selectionBackground`), and the native fallback is a
 * `::selection` pseudo-element — neither is a DOM background axe can resolve.
 * Pointed at highlighted code, axe compares each token to a *phantom white*
 * background and reports nonsense. So this spec measures the real thing
 * directly: it reads the rendered selection color and each visible token color
 * and asserts the WCAG 2.1 contrast between them is at least AA (4.5:1).
 *
 * The editor theme reads a few colors from CSS custom properties defined in
 * `@doenet/doenetml`'s `DoenetML.css` (not in this package); the mount wrapper
 * re-declares them per mode so the component renders with the real app colors.
 */

// Mirrors the light/dark values in `packages/doenetml/src/DoenetML.css`.
const THEME_VARS: Record<ThemeMode, Record<string, string>> = {
    light: {
        "--canvas": "white",
        "--canvasText": "black",
        "--mainGray": "#e3e3e3",
    },
    dark: {
        "--canvas": "#121212",
        "--canvasText": "white",
        "--mainGray": "#a9a9a9",
    },
};

// Exercises the main token categories: tag names / angle brackets, attribute
// names, attribute-value strings, macros, and (near-white) text content.
const DOENET_SOURCE = `<section name="s">
  <title>Highlighted text should stay legible</title>
  <p>Body text with a macro $s and the number 42.</p>
  <point name="P" coords="(3, 4)" />
</section>`;

const AA_CONTRAST = 4.5;

type Rgb = { r: number; g: number; b: number; a: number };

function parseColor(value: string): Rgb {
    const m = value.match(/rgba?\(([^)]+)\)/);
    if (!m) {
        throw new Error(`Cannot parse color "${value}"`);
    }
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
}

// Flatten a (possibly translucent) color over an opaque backdrop.
function flatten(fg: Rgb, backdrop: Rgb): Rgb {
    if (fg.a >= 1) {
        return fg;
    }
    return {
        r: fg.r * fg.a + backdrop.r * (1 - fg.a),
        g: fg.g * fg.a + backdrop.g * (1 - fg.a),
        b: fg.b * fg.a + backdrop.b * (1 - fg.a),
        a: 1,
    };
}

function relativeLuminance({ r, g, b }: Rgb): number {
    const channel = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: Rgb, b: Rgb): number {
    const l1 = relativeLuminance(a);
    const l2 = relativeLuminance(b);
    const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (hi + 0.05) / (lo + 0.05);
}

function mountAndSelectAll(mode: ThemeMode) {
    const style = {
        height: "500px",
        width: "700px",
        background: THEME_VARS[mode]["--canvas"],
        ...THEME_VARS[mode],
    } as React.CSSProperties;

    cy.mount(
        <div style={style}>
            {/* An element outside the editor to blur onto. */}
            <button id="outside-editor" type="button">
                outside
            </button>
            <CodeMirror value={DOENET_SOURCE} darkMode={mode} />
        </div>,
    );

    // Focus the editor and select the whole document so the selection layer is
    // painted behind every token.
    cy.get(".cm-content").click().type("{selectall}");
    cy.get(".cm-selectionBackground").should("exist");
}

/**
 * Assert every visible, highlighted token has >= AA contrast against the
 * rendered selection background.
 */
function expectHighlightedTextIsLegible(mode: ThemeMode) {
    const canvas = parseColor(
        // Normalize the CSS keyword/hex to rgb via a throwaway element.
        (() => {
            const el = document.createElement("span");
            el.style.color = THEME_VARS[mode]["--canvas"];
            document.body.appendChild(el);
            const rgb = getComputedStyle(el).color;
            el.remove();
            return rgb;
        })(),
    );

    cy.window().then((win) => {
        const selEl = win.document.querySelector(".cm-selectionBackground");
        expect(selEl, "selection background element").to.exist;
        const selectionBg = flatten(
            parseColor(win.getComputedStyle(selEl!).backgroundColor),
            canvas,
        );

        const spans = Array.from(
            win.document.querySelectorAll(".cm-content .cm-line span"),
        ) as HTMLElement[];

        const measured = spans
            .filter(
                (span) =>
                    (span.textContent ?? "").trim().length > 0 &&
                    // leaf spans only, so nested markup isn't counted twice
                    span.querySelector("span") === null,
            )
            .map((span) => {
                const fg = parseColor(win.getComputedStyle(span).color);
                const ratio = contrastRatio(
                    flatten(fg, selectionBg),
                    selectionBg,
                );
                return {
                    text: (span.textContent ?? "").trim().slice(0, 40),
                    color: win.getComputedStyle(span).color,
                    ratio: Number(ratio.toFixed(2)),
                };
            });

        // Guard against a vacuous pass: if syntax highlighting stopped
        // producing token spans, there would be nothing to check and the
        // contrast assertion below would trivially succeed.
        expect(
            measured.length,
            "highlighted tokens measured",
        ).to.be.greaterThan(0);

        const failures = measured.filter((entry) => entry.ratio < AA_CONTRAST);

        const selectionCss = win.getComputedStyle(selEl!).backgroundColor;
        expect(
            failures,
            `Tokens below ${AA_CONTRAST}:1 on selection ${selectionCss}:\n` +
                JSON.stringify(failures, null, 2),
        ).to.have.length(0);
    });
}

describe("CodeMirror selection-highlight accessibility", () => {
    it("light mode: highlighted syntax-colored text meets contrast", () => {
        mountAndSelectAll("light");
        expectHighlightedTextIsLegible("light");
    });

    it("dark mode: highlighted syntax-colored text meets contrast", () => {
        mountAndSelectAll("dark");
        expectHighlightedTextIsLegible("dark");
    });

    // The blurred selection is colored by a separate CodeMirror base-theme rule;
    // clicking away from the editor must not revert the highlight to the
    // washed-out base color.
    it("dark mode: highlighted text stays legible after the editor is blurred", () => {
        mountAndSelectAll("dark");
        cy.get("#outside-editor").focus();
        cy.get(".cm-editor").should("not.have.class", "cm-focused");
        expectHighlightedTextIsLegible("dark");
    });
});
