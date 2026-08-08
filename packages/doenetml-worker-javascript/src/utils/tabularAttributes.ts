/**
 * The vocabularies shared by `<tabular>`, `<row>` and `<cell>`.
 *
 * All three declare the same border and alignment attributes, and the values
 * have to agree: a `<cell>` inherits from its `<row>`, which inherits from the
 * `<tabular>`, so a value the outer element accepts has to mean the same thing
 * on the inner one. Declaring them in one place is also what puts them in the
 * schema, which is where autocomplete and the editor's help panel read the
 * allowed values from.
 *
 * The `return*ValidValues()` functions supply the attribute declarations. The
 * `*_VALUES` arrays are the same vocabularies as bare strings, for the state
 * variable definitions on `<row>` and `<cell>`: those attributes carry no
 * `createStateVariable`, so their definitions read the authored value through
 * an `attributeComponent` dependency and check it against the vocabulary
 * themselves, via `readVocabularyValue`.
 */

type ValueEntry = { value: string; description: string };

/**
 * The border weights, inherited from PreTeXt's `<tabular>` along with the
 * attributes that carry them.
 */
const BORDER_VALUE_ENTRIES: ValueEntry[] = [
    { value: "none", description: "Do not render a border." },
    { value: "minor", description: "Render a thin border line." },
    { value: "medium", description: "Render a medium-weight border line." },
    { value: "major", description: "Render a thick border line." },
];

/**
 * Horizontal alignment of cell content. `start` and `end` follow the writing
 * direction rather than naming a physical side.
 */
const HALIGN_VALUE_ENTRIES: ValueEntry[] = [
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

/** Vertical alignment of cell content. */
const VALIGN_VALUE_ENTRIES: ValueEntry[] = [
    { value: "top", description: "Align cell content to the top." },
    { value: "middle", description: "Center cell content vertically." },
    { value: "bottom", description: "Align cell content to the bottom." },
];

export const BORDER_VALUES = BORDER_VALUE_ENTRIES.map((entry) => entry.value);
export const HALIGN_VALUES = HALIGN_VALUE_ENTRIES.map((entry) => entry.value);
export const VALIGN_VALUES = VALIGN_VALUE_ENTRIES.map((entry) => entry.value);

// Each caller gets its own array of its own entry objects, so that the
// attributes object a component hands to the core owns its `validValues`
// outright and nothing a component does to its own declaration can reach
// another component's.
function copyEntries(entries: ValueEntry[]): ValueEntry[] {
    return entries.map((entry) => ({ ...entry }));
}

export function returnBorderValidValues(): ValueEntry[] {
    return copyEntries(BORDER_VALUE_ENTRIES);
}

export function returnHalignValidValues(): ValueEntry[] {
    return copyEntries(HALIGN_VALUE_ENTRIES);
}

export function returnValignValidValues(): ValueEntry[] {
    return copyEntries(VALIGN_VALUE_ENTRIES);
}

/**
 * Read an authored value against one of the vocabularies, falling back to
 * `fallback` when it is not in the vocabulary.
 *
 * The `<tabular>` versions of these attributes declare `createStateVariable`,
 * so the attribute machinery applies the `toLowerCase` and trimming their
 * declarations ask for before matching. The `<row>` and `<cell>` versions have
 * no `createStateVariable` and reach their state variables as a raw text
 * component, so they normalize here instead and all three components accept
 * `halign="Center"` and `halign="center"` alike.
 */
export function readVocabularyValue(
    value: unknown,
    vocabulary: string[],
    fallback: string,
): string {
    const normalized =
        typeof value === "string" ? value.trim().toLowerCase() : "";
    return vocabulary.includes(normalized) ? normalized : fallback;
}
