import type {
    PrimitiveStyleDefinition,
    StyleDefinitionKey,
} from "./styleDefinitionHelpers";
import { STYLE_PALETTES } from "./palettes";

/**
 * Style keys a reader may override. Every style-definition key is overridable
 * except the `*Word` descriptors — words are always re-derived from the
 * overridden values so text style descriptions ("thick red line") stay
 * truthful for reader-chosen colors.
 */
export type ReaderOverridableStyleKey = Exclude<
    StyleDefinitionKey,
    `${string}Word${string}`
>;

/**
 * Per-style-number value overrides a reader may supply: any subset of the
 * non-word style keys (all colors including `*DarkMode` variants, widths,
 * opacities, marker/line/fill styles). When only a light-mode color is given,
 * the dark-mode variant is derived with the same accessibility-aware helpers
 * used for authored styles.
 */
export type ReaderStyleValueOverrides = Partial<
    Pick<PrimitiveStyleDefinition, ReaderOverridableStyleKey>
>;

/**
 * Reader (end-user) style overrides, passed by a host application into
 * `<DoenetViewer>`/`<DoenetEditor>` via the `styleOverrides` prop — never
 * authored in DoenetML. This is the mechanism that lets a reader remap what
 * each style number looks like (e.g. colors they can better tell apart),
 * with every object of that style number shifting together while the
 * distinctions the author encoded survive.
 *
 * Reader overrides win over everything authored (`<styleDefinition>` and
 * `<stylePalette>` alike), applied per-key as the final layer of every
 * section's merged style definitions. They are plain JSON so they cross the
 * worker and iframe boundaries unchanged.
 *
 * The envelope object (rather than a bare number-keyed map) reserves room
 * for future extensions — e.g. per-palette scoping — without breaking hosts.
 */
export interface ReaderStyleOverrides {
    /** Reserved for future format evolution. */
    version?: 1;
    /**
     * Name of a built-in style palette (case-insensitive) the reader wants
     * the whole document rendered with — e.g. `"grayscale"` for a reader who
     * distinguishes styles by lightness alone, or `"okabeito"` for common
     * color vision deficiencies. When set (and registered), it replaces the
     * document's base styles everywhere: authored `<stylePalette>` selections
     * and `<styleDefinition>` customizations are discarded (they were tuned
     * against different colors), and style numbers beyond the reader palette's
     * size cycle onto it. Unregistered names are silently ignored — the host
     * is expected to offer only valid names. Any `styles` overrides apply on
     * top of the reader's palette.
     */
    palette?: string;
    /**
     * Overrides keyed by style number. Applied to every style number that
     * exists in the document's merged style definitions; numbers that never
     * materialize (no palette entry and no style definition) are ignored.
     */
    styles?: Record<string, ReaderStyleValueOverrides>;
}

/**
 * Resolves the `palette` field of reader style overrides to a registered
 * palette name: trims, lowercases (palette names match case-insensitively,
 * like the authored `<stylePalette palette>` attribute), and returns null
 * for missing, non-string, or unregistered values.
 */
export function resolveReaderPaletteName(
    overrides: ReaderStyleOverrides | null | undefined,
): string | null {
    const raw = overrides?.palette;
    if (typeof raw !== "string") {
        return null;
    }
    const name = raw.trim().toLowerCase();
    return name in STYLE_PALETTES ? name : null;
}
