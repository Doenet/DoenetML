import type { Translator } from "@doenet/i18n";

/**
 * The parenthetical that follows a disclosure panel's heading, naming what
 * activating it will do: "Solution (click to open)".
 *
 * Shared by `<solution>`, `<hint>`, and a collapsible `<section>`, which all
 * render the same affordance. The whole parenthetical is one message rather
 * than a sentence with the verb substituted in, because where the word for
 * open or close falls inside it is the translator's business.
 *
 * @param t Chrome translator from `useT()`.
 * @param open Whether the panel is currently open — that is, whether clicking
 *   it will close it.
 */
export function clickToToggleLabel(t: Translator, open: boolean): string {
    return open
        ? t("collapsible-click-to-close", undefined, "(click to close)")
        : t("collapsible-click-to-open", undefined, "(click to open)");
}
