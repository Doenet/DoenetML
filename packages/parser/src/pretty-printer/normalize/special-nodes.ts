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

/**
 * Elements whose contents are "whitespace sensitive" and which should be wrapped like a paragraph.
 * For example, in a `PAR_ELEMENTS` element, if there is no space between two nodes, none will be inserted.
 * E.g. `<m>foo</m>bar` -> `<m>foo</m>bar`, where as the default behavior would be
 * `<m>foo</m>bar` -> `<m>foo</m>\nbar`
 */
export const PAR_ELEMENTS = new Set([
    "p",
    "line",
    "biblio",
    "li",
    "idx",
    "h",
    "description",
    "caption",
    "cell",
    "q",
    "em",
    "title",
    "pubtitle",
    "section",
]);

/**
 * Elements which should be on their own line even in paragraph mode.
 */
export const BREAK_AROUND_ELEMENTS = new Set([
    "ol",
    "li",
    "ul",
    "dl",
    "p",
    "q",
    "title",
    "pubtitle",
    "section",
    "subsection",
    "blockquote",
    "feedback",
    "footnote",
    "solution",
    "hint",
    "choice",
    "graph",
]);

/**
 * Elements whose contents should always break (and be indented).
 */
export const ALWAYS_BREAK_ELEMENTS = new Set([
    "section",
    "subsection",
    "ol",
    "ul",
    "dl",
    "graph",
]);

/**
 * Elements whose contents should always break (and be indented).
 */
export const CHILDREN_ON_OWN_LINE_ELEMENTS = new Set([
    "ol",
    "ul",
    "dl",
    "graph",
]);
