import { stringifyEntitiesLight } from "stringify-entities";

/**
 * Escape a string.
 */
export function escape(
    value: string,
    subset: string[],
    unsafe?: RegExp | null | undefined,
): string {
    const result = clean(value);

    return unsafe ? result.replace(unsafe, encode) : encode(result);

    /**
     * Actually escape characters.
     */
    function encode(value: string): string {
        return (
            stringifyEntitiesLight(value, { subset })
                // We want fancy named versions of these two escaped characters
                .replace(/&#x3C;/g, "&lt;")
                .replace(/&#x26;/g, "&amp;")
        );
    }
}

const nonCharacter = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;
/**
 * Remove non-characters.
 */
export function clean(value: string) {
    return String(value || "").replace(nonCharacter, "");
}

/**
 * Encode a node name.
 */
export function name(value: string) {
    const subset = ["\t", "\n", " ", '"', "&", "'", "/", "<", "=", ">"];
    return escape(value, subset);
}
