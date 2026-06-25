/**
 * Shared color-accessibility utilities built on `colord`.
 *
 * Centralizes everything that reasons about WCAG contrast for DoenetML style
 * colors:
 *  - the canonical light/dark canvas colors,
 *  - alpha-aware contrast computation (compositing translucent colors over the
 *    canvas before measuring), and
 *  - derivation of an accessible dark-mode color from a light-mode color.
 *
 * Both the dark-mode color derivation (`style.ts`) and the per-style contrast
 * diagnostics (`styleContrastAccessibility.ts`) consume this module so they
 * cannot drift apart in how they parse colors or define "accessible".
 */
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import namesPlugin from "colord/plugins/names";

extend([a11yPlugin, namesPlugin]);

/** Opaque canvas color behind light-mode content. */
export const CANVAS_LIGHT_MODE_COLOR = "#ffffff";
/**
 * Opaque canvas color behind dark-mode content. Must stay in sync with the
 * `--canvas` custom property under `[data-theme="dark"]` in
 * `packages/doenetml/src/DoenetML.css`.
 */
export const CANVAS_DARK_MODE_COLOR = "#121212";

/** WCAG AA contrast threshold for non-text graphics (lines, markers). */
export const GRAPHIC_CONTRAST_THRESHOLD = 3;
/** WCAG AA contrast threshold for normal-size text. */
export const TEXT_CONTRAST_THRESHOLD = 4.5;

type Rgb = { r: number; g: number; b: number };

function clamp01(value: number): number {
    if (!Number.isFinite(value)) {
        return 1;
    }
    return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * Composites a possibly-translucent foreground color over an opaque background,
 * in gamma-encoded sRGB space (matching how browsers paint overlapping fills).
 */
function compositeOver(
    foreground: { r: number; g: number; b: number; a: number },
    background: Rgb,
): Rgb {
    const a = clamp01(foreground.a);
    return {
        r: foreground.r * a + background.r * (1 - a),
        g: foreground.g * a + background.g * (1 - a),
        b: foreground.b * a + background.b * (1 - a),
    };
}

/**
 * Computes the WCAG contrast ratio of `foreground` against a `canvas`, after
 * compositing.
 *
 * `background`, when provided, is an authored surface color (which may itself be
 * translucent) painted between the foreground and the canvas; it is composited
 * over the canvas first. `opacityMultiplier` scales the foreground alpha (used
 * for the `lineOpacity` / `markerOpacity` style channels).
 *
 * @returns The contrast ratio, or `null` if any color fails to parse.
 */
export function compositedContrastRatio({
    foreground,
    canvas,
    background,
    opacityMultiplier = 1,
}: {
    foreground: string;
    canvas: string;
    background?: string;
    opacityMultiplier?: number;
}): number | null {
    const fg = colord(foreground);
    const canvasColor = colord(canvas);
    if (!fg.isValid() || !canvasColor.isValid()) {
        return null;
    }

    const canvasRgb = canvasColor.toRgb();
    const canvasOpaque: Rgb = {
        r: canvasRgb.r,
        g: canvasRgb.g,
        b: canvasRgb.b,
    };

    let backgroundOpaque = canvasOpaque;
    if (background !== undefined) {
        const bg = colord(background);
        if (!bg.isValid()) {
            return null;
        }
        backgroundOpaque = compositeOver(bg.toRgb(), canvasOpaque);
    }

    const fgRgba = fg.toRgb();
    const effectiveForeground = compositeOver(
        { ...fgRgba, a: clamp01(fgRgba.a * opacityMultiplier) },
        backgroundOpaque,
    );

    return colord(effectiveForeground).contrast(colord(backgroundOpaque));
}

/**
 * Derives an accessible dark-mode color from a light-mode color.
 *
 * Strategy: preserve the original hue and saturation (so the color keeps its
 * identity) and only raise lightness until the color clears `threshold` against
 * the dark canvas. If the light color already meets the threshold against the
 * dark canvas (e.g. a bright accent), it is returned unchanged so author intent
 * is preserved.
 *
 * Because a light-mode-accessible color is, by definition, dark enough to read
 * on white, lightening is the correct direction to make it read on the dark
 * canvas — and clearing the same threshold there yields a color that satisfies
 * WCAG AA in dark mode whenever the input satisfied it in light mode.
 *
 * @param lightColor - Author's (or preset's) light-mode color.
 * @param threshold - Required contrast ratio against the dark canvas.
 * @param opacityMultiplier - Effective opacity of the channel (e.g. lineOpacity).
 * @returns A CSS color string for dark mode (hex), or the input unchanged when
 * it cannot be parsed or already meets the threshold.
 */
export function deriveAccessibleDarkModeColor({
    lightColor,
    threshold,
    opacityMultiplier = 1,
    background,
}: {
    lightColor: string;
    threshold: number;
    opacityMultiplier?: number;
    /**
     * Surface the color must contrast against, defaulting to the dark canvas.
     * Pass the dark-mode background color when deriving text so the derived
     * text/background *pair* is accessible (not just text-vs-canvas).
     */
    background?: string;
}): string {
    const base = colord(lightColor);
    if (!base.isValid()) {
        return lightColor;
    }

    const currentRatio = compositedContrastRatio({
        foreground: lightColor,
        canvas: CANVAS_DARK_MODE_COLOR,
        background,
        opacityMultiplier,
    });
    if (currentRatio !== null && currentRatio >= threshold) {
        return lightColor;
    }

    const { h, s } = base.toHsl();
    for (let l = 0; l <= 100; l++) {
        const candidate = colord({ h, s, l }).toHex();
        const ratio = compositedContrastRatio({
            foreground: candidate,
            canvas: CANVAS_DARK_MODE_COLOR,
            background,
            opacityMultiplier,
        });
        if (ratio !== null && ratio >= threshold) {
            return candidate;
        }
    }

    return "#ffffff";
}

/** Lightness (in HSL %) at or below which a color counts as a dark surface. */
const DARK_SURFACE_MAX_LIGHTNESS = 16;

/**
 * Derives a dark-mode *surface* (background) color from a light-mode background
 * color.
 *
 * A dark-mode background must actually be dark so that foreground text derived
 * against it (see {@link deriveAccessibleDarkModeColor}'s `background` option)
 * has room to be readable. This preserves the background's hue and saturation
 * and lowers its lightness into the dark-surface range; a color that is already
 * a dark surface is returned unchanged.
 *
 * @param lightColor - Author's light-mode background color.
 * @returns A CSS color string (hex) for the dark-mode surface, or the input
 * unchanged when it cannot be parsed or is already dark.
 */
export function deriveAccessibleDarkModeBackground(lightColor: string): string {
    const base = colord(lightColor);
    if (!base.isValid()) {
        return lightColor;
    }

    const { h, s, l } = base.toHsl();
    if (l <= DARK_SURFACE_MAX_LIGHTNESS) {
        return lightColor;
    }

    return colord({ h, s, l: DARK_SURFACE_MAX_LIGHTNESS }).toHex();
}
