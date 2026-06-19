/**
 * Elements whose contents must not be formatted whatsoever; E.g., whitespace should not be collapsed.
 */
export const PRE_ELEMENTS = new Set([
    "cline",
    "input",
    "output",
    "prompt",
    "pre",
]);

/**
 * Like PRE_ELEMENTS except these elements allow a uniform amount of whitespace to be added or removed
 * from the start of each line.
 */
export const INDENTABLE_PRE_ELEMENTS = new Set([
    "latex-image",
    "latex-image-preamble",
    "macros",
    "asymptote",
]);
