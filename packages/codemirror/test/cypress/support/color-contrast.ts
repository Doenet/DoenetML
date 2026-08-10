/**
 * WCAG contrast math and the editor's theme variables, shared by the specs that
 * measure what the editor actually paints.
 *
 * These live here rather than in a spec because more than one spec needs them:
 * `selectionAccessibility.cy.tsx` checks the selection background, and
 * `selectionHighlights.cy.tsx` checks the subtler backgrounds used for the other
 * occurrences of the selected text and for the tag pair. Both ask the same
 * question of a different color.
 */

export type ThemeMode = "dark" | "light";

/** WCAG 2.1 AA for normal-size text. */
export const AA_CONTRAST = 4.5;

/** Mirrors the light/dark values in `packages/doenetml/src/DoenetML.css`. */
export const THEME_VARS: Record<ThemeMode, Record<string, string>> = {
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

export type Rgb = { r: number; g: number; b: number; a: number };

export function parseColor(value: string): Rgb {
    const m = value.match(/rgba?\(([^)]+)\)/);
    if (!m) {
        throw new Error(`Cannot parse color "${value}"`);
    }
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
}

/** Flatten a (possibly translucent) color over an opaque backdrop. */
export function flatten(fg: Rgb, backdrop: Rgb): Rgb {
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

function linearize(c: number): number {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance({ r, g, b }: Rgb): number {
    return (
        0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
    );
}

export function contrastRatio(a: Rgb, b: Rgb): number {
    const l1 = relativeLuminance(a);
    const l2 = relativeLuminance(b);
    const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
    return (hi + 0.05) / (lo + 0.05);
}

/** A CSS keyword/hex normalized to `rgb()` by the browser. */
function normalizeColor(value: string): Rgb {
    const el = document.createElement("span");
    el.style.color = value;
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color;
    el.remove();
    return parseColor(rgb);
}

/**
 * The canvas the editor is actually painted on, read from the editor itself
 * rather than assumed from {@link THEME_VARS}.
 *
 * Reading it is the point: `@uiw/react-codemirror` used to append a theme of
 * its own that painted the editor white regardless of mode, so a spec that
 * compared highlights to an *assumed* dark canvas reported ratios the reader
 * never saw. Asserting the canvas is opaque keeps that from coming back
 * silently.
 */
export function canvasColor(win: Window, mode: ThemeMode): Rgb {
    const editor = win.document.querySelector(".cm-editor");
    expect(editor, ".cm-editor").to.exist;
    const css = win.getComputedStyle(editor!).backgroundColor;
    const color = parseColor(css);
    expect(
        color.a,
        `editor canvas ${css} must be opaque, not inherited from the page`,
    ).to.equal(1);
    expect(
        contrastRatio(color, normalizeColor(THEME_VARS[mode]["--canvas"])),
        `editor canvas ${css} must be the ${mode} canvas`,
    ).to.be.lessThan(1.05);
    return color;
}

/**
 * The color the editor actually renders for `selector`, flattened over the
 * canvas so a translucent value is measured as the reader sees it.
 *
 * Returns the raw CSS alongside it, purely so a failure message can name the
 * color that failed.
 */
export function renderedBackground(
    win: Window,
    selector: string,
    mode: ThemeMode,
): { css: string; color: Rgb } {
    const el = win.document.querySelector(selector);
    expect(el, `element matching ${selector}`).to.exist;
    const css = win.getComputedStyle(el!).backgroundColor;
    return { css, color: flatten(parseColor(css), canvasColor(win, mode)) };
}

/**
 * How far a highlight lifts off the page. The counterweight to
 * {@link expectTokensLegibleOn}: a background can always be made legible by
 * making it invisible.
 */
export function contrastAgainstCanvas(
    win: Window,
    color: Rgb,
    mode: ThemeMode,
): number {
    return contrastRatio(color, canvasColor(win, mode));
}

export type Measured = { text: string; color: string; ratio: number };

function measureSpans(
    win: Window,
    background: Rgb,
    keep: (span: HTMLElement) => boolean,
): Measured[] {
    const spans = Array.from(
        win.document.querySelectorAll(".cm-content .cm-line span"),
    ) as HTMLElement[];

    return spans
        .filter(
            (span) =>
                (span.textContent ?? "").trim().length > 0 &&
                // leaf spans only, so nested markup isn't counted twice
                span.querySelector("span") === null &&
                keep(span),
        )
        .map((span) => {
            const color = win.getComputedStyle(span).color;
            const ratio = contrastRatio(
                flatten(parseColor(color), background),
                background,
            );
            return {
                text: (span.textContent ?? "").trim().slice(0, 40),
                color,
                ratio: Number(ratio.toFixed(2)),
            };
        });
}

/**
 * Every visible syntax token measured against `background` — the color the
 * editor paints behind text for the highlight under test.
 *
 * A highlight can fall on any token, so the whole palette is checked rather
 * than only the tokens that happen to be highlighted in this document.
 *
 * Selected text is left out: it is deliberately recolored to a single value
 * that has nothing to do with the syntax palette, and it is never the thing
 * sitting on the backgrounds this measures. {@link measureSelectedTextOn}
 * covers it instead.
 */
export function measureTokensOn(win: Window, background: Rgb): Measured[] {
    return measureSpans(
        win,
        background,
        (span) => span.closest(".cm-selectedText") === null,
    );
}

/**
 * The recolored text inside the selection, measured against `background`.
 *
 * The counterpart to {@link measureTokensOn}: on the selection the palette is
 * out of the picture, and this one color is what has to stay readable.
 */
export function measureSelectedTextOn(
    win: Window,
    background: Rgb,
): Measured[] {
    return measureSpans(
        win,
        background,
        (span) => span.closest(".cm-selectedText") !== null,
    );
}

/**
 * Assert everything in `measured` clears AA against a background, and that
 * there was something to measure at all — if the spans stopped being produced
 * the assertion would otherwise pass vacuously.
 */
export function expectLegible(
    measured: Measured[],
    describeBackground: string,
) {
    expect(
        measured.length,
        `text measured on ${describeBackground}`,
    ).to.be.greaterThan(0);

    const failures = measured.filter((entry) => entry.ratio < AA_CONTRAST);
    expect(
        failures,
        `Text below ${AA_CONTRAST}:1 on ${describeBackground}:\n` +
            JSON.stringify(failures, null, 2),
    ).to.have.length(0);
}

/** {@link expectLegible} over the unselected syntax tokens. */
export function expectTokensLegibleOn(
    win: Window,
    background: Rgb,
    describeBackground: string,
) {
    expectLegible(measureTokensOn(win, background), describeBackground);
}
