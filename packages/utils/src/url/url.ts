// @ts-ignore
import cssesc from "cssesc";

// since component names include a "/", escape them before using them as css identifiers
export function cesc(s: string): string {
    s = cssesc(s, { isIdentifier: true });
    if (s.slice(0, 2) === "\\#") {
        // just for convenience in case have a hash, don't escape leading #
        s = s.slice(1);
    }
    return s;
}
