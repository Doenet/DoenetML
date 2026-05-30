import { CompletionItemKind } from "vscode-languageserver/browser";

/**
 * The `type` string assigned to each autocomplete completion. It does double
 * duty, which is why it lives here as a single shared vocabulary:
 *
 *   1. **Icons** — CodeMirror renders the dropdown's left-column icon from it
 *      (`.cm-completionIcon-<type>`, styled by `@doenet/codemirror`'s
 *      `completionIconTheme`).
 *   2. **Help dispatch** — the context-help panel branches on it in
 *      {@link import("./context-help/computeContextHelp").computeContextHelpForCompletion}.
 *
 * Because of (2), renaming a value here without updating the help dispatch
 * would silently drop help for that category (it happened once). Both the
 * producer ({@link deriveCompletionType}) and the consumer reference these
 * constants, and the "completion type ↔ context-help dispatch contract" suite
 * in `context-help/computeContextHelp.test.ts` drives every value through the
 * dispatcher so any drift fails a test.
 */
export const COMPLETION_TYPES = {
    /** Element / tag name, e.g. `<math>`. */
    component: "component",
    /** A property of a referenced component, e.g. `$m.displayDecimals`. */
    referenceProperty: "refproperty",
    /** A closing-tag suggestion, e.g. `/math>`. */
    closeTag: "closetag",
    /** A predefined multi-element snippet. */
    snippet: "snippet",
    /** An attribute name. */
    attributeName: "enum",
    /** An enumerated attribute value. */
    attributeValue: "value",
    /** A reference name, e.g. `$myMath`. */
    reference: "reference",
} as const;

export type CompletionType =
    (typeof COMPLETION_TYPES)[keyof typeof COMPLETION_TYPES];

/** Every completion `type` the help dispatcher is expected to recognize. */
export const ALL_COMPLETION_TYPES: readonly CompletionType[] =
    Object.values(COMPLETION_TYPES);

// Numeric-kind → enum-name, used only as the fallback for kinds the DoenetML
// LSP doesn't categorize below. `CompletionItemKind` is currently a plain
// name→number object, but we filter to numeric values so this stays correct
// (no spurious reverse-mapping keys) if it ever becomes a TS enum.
const completionItemKindName = new Map<number, string>(
    Object.entries(CompletionItemKind)
        .filter(([, value]) => typeof value === "number")
        .map(([name, value]) => [value as number, name]),
);

/**
 * Map a raw LSP completion item to its CodeMirror `type` string.
 *
 * Components, reference-properties, and closing tags all arrive as
 * `kind: Property`; they're split here — for icons + help dispatch — using
 * signal the items already carry, with no change to the LSP `kind` itself:
 *   - a leading `/` in the label marks a closing-tag row;
 *   - a `detail` (`"Property on X"`) marks a reference-property (components set
 *     only `documentation`). `textEdit` is *not* a discriminator — components
 *     also carry one in the Ctrl+Space-between-tags path.
 *
 * Other kinds map to the matching {@link COMPLETION_TYPES} value, falling back
 * to the lowercased kind name for any kind not categorized here (those rows
 * simply get no help).
 */
export function deriveCompletionType(item: {
    kind?: CompletionItemKind;
    detail?: string;
    label: string;
}): string | undefined {
    const { kind, detail, label } = item;
    if (kind == null) {
        return undefined;
    }
    switch (kind) {
        case CompletionItemKind.Property:
            if (label.startsWith("/")) {
                return COMPLETION_TYPES.closeTag;
            }
            return detail
                ? COMPLETION_TYPES.referenceProperty
                : COMPLETION_TYPES.component;
        case CompletionItemKind.Snippet:
            return COMPLETION_TYPES.snippet;
        case CompletionItemKind.Enum:
            return COMPLETION_TYPES.attributeName;
        case CompletionItemKind.Value:
            return COMPLETION_TYPES.attributeValue;
        case CompletionItemKind.Reference:
            return COMPLETION_TYPES.reference;
        default:
            return completionItemKindName.get(kind)?.toLowerCase();
    }
}
