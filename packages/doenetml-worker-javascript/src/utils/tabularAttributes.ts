/**
 * The vocabularies shared by `<tabular>`, `<row>` and `<cell>`.
 *
 * All three declare the same border and alignment attributes, and the values
 * have to agree: a `<cell>` inherits from its `<row>`, which inherits from the
 * `<tabular>`, so a value the outer element accepts has to mean the same thing
 * on the inner one. Declaring them in one place is also what puts them in the
 * schema, which is where autocomplete and the editor's help panel read the
 * allowed values from.
 */

type ValueEntry = { value: string; description: string };

/**
 * The border weights, inherited from PreTeXt's `<tabular>` along with the
 * attributes that carry them.
 */
export function returnBorderValidValues(): ValueEntry[] {
    return [
        { value: "none", description: "Do not render a border." },
        { value: "minor", description: "Render a thin border line." },
        {
            value: "medium",
            description: "Render a medium-weight border line.",
        },
        { value: "major", description: "Render a thick border line." },
    ];
}

/**
 * Horizontal alignment of cell content. `start` and `end` follow the writing
 * direction rather than naming a physical side.
 */
export function returnHalignValidValues(): ValueEntry[] {
    return [
        {
            value: "start",
            description:
                "Align cell content to the leading edge: the left in a left-to-right document, the right in a right-to-left one.",
        },
        {
            value: "center",
            description: "Center cell content horizontally.",
        },
        {
            value: "end",
            description:
                "Align cell content to the trailing edge: the right in a left-to-right document, the left in a right-to-left one.",
        },
        {
            value: "justify",
            description: "Justify cell content across the full cell width.",
        },
    ];
}

/** Vertical alignment of cell content. */
export function returnValignValidValues(): ValueEntry[] {
    return [
        { value: "top", description: "Align cell content to the top." },
        { value: "middle", description: "Center cell content vertically." },
        { value: "bottom", description: "Align cell content to the bottom." },
    ];
}
