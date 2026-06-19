import type { ValidValueEntry } from "@doenet/static-assets/schema";

/**
 * Per-styleNumber breakdown surfaced on the help panel (issue #1204).  Same
 * shape carried by both the `element` kind (cursor on a `<styleDefinition>`
 * tag name) and the `attribute` kind (cursor on a `styleNumber` attribute or
 * any attribute inside a `<styleDefinition>`), since both rows render the
 * same way — sharing the type makes drift between the two impossible.
 *
 * `entries` is in the runtime's `styleAttributes` declaration order so the
 * panel can render directly without re-sorting; per-color rows carry a
 * derived `colorWord` for the named-color companion next to the hex.
 */
export type StyleBreakdownPayload = {
    styleNumber: number;
    entries: Array<{
        key: string;
        value: string | number | boolean;
        /**
         * Human-readable color word derived from `value` when the key is a
         * non-word color attribute (`lineColor`, `fillColorDarkMode`, …).
         * The panel renders it in parens next to the hex and styles both
         * with the resolved color.  Absent for non-color keys and for
         * color values that already are their own word (CSS named colors).
         */
        colorWord?: string;
    }>;
};

/**
 * Resolved MathQuill function-name list for a `<mathInput>` surfaced on the
 * help panel (issue #1205).  Populated when the cursor sits on
 * `additionalFunctionNames`, `removedFunctionNames`, or `resetFunctionNames`:
 *
 * - `names` is the resolved effective list MathQuill sees at runtime.
 * - `added` / `removed` are the deltas as authored on this element, with
 *   duplicates dropped (first occurrence wins) and case-sensitive matching.
 * - `reset`, when present, is the authored list (also deduped) and signals
 *   that `resetFunctionNames` overrode both deltas; `names` then equals
 *   `reset` and `added`/`removed` are inactive (but kept on the payload
 *   so the panel can flag what the author wrote).
 *
 * Precedence: `reset` wins outright. Otherwise `removed` wins over `added`.
 */
export type FunctionNamesBreakdownPayload = {
    names: string[];
    added: string[];
    removed: string[];
    reset?: string[];
};

/**
 * One element entry in a `suggestions` payload's `suggested` list. Snippets
 * are deliberately excluded from the panel — with only six slots, surfacing
 * several variations of the same element (e.g. all the `<answer>` snippets)
 * crowds out genuinely different components. Snippets still appear in the
 * full Ctrl+Space autocomplete dropdown, ranked next to their element.
 */
export type SuggestionItem = {
    name: string;
    summary: string | null;
    docsSlug: string | null;
};

export type HelpContent =
    | { kind: "none" }
    | {
          kind: "element";
          elementName: string;
          summary: string;
          /** Reference-page slug; null when intentionally undocumented. */
          docsSlug: string | null;
          /**
           * Resolved-style breakdown for the styleNumber active at the
           * cursor's scope (issue #1204).  Populated only when the cursor
           * sits on a `<styleDefinition>` tag name — the element's purpose
           * is to author a full styleNumber, so the help panel mirrors the
           * full listing of every populated style key.  Absent on every
           * other element kind.
           */
          styleBreakdown?: StyleBreakdownPayload;
      }
    | {
          kind: "attribute";
          elementName: string;
          attributeName: string;
          description: string;
          /**
           * Reference-page slug for the owning element (with alias redirection
           * applied — e.g. `<row functionSymbols>` inside `<matrix>` carries
           * the `matrixRow` slug). `null` when intentionally undocumented.
           */
          docsSlug: string | null;
          /**
           * Allowed values for this attribute, each with a per-value
           * description rendered alongside the value in the help panel.
           * Only populated for attributes that declare `validValues`;
           * pure boolean primitives intentionally omit this row since
           * their attribute description already conveys true/false.
           */
          allowedValues?: ValidValueEntry[];
          /**
           * `true` when `allowedValues` constrains each item of a list-valued
           * attribute rather than the whole value. The help panel uses this to
           * label the row "Allowed values (one per item)" instead of "Allowed
           * values".
           */
          allowedValuesArePerItem?: boolean;
          defaultValue?: unknown;
          /**
           * Resolved active value at the cursor's scope, distinct from the
           * schema's static `defaultValue` (issue #1198). Populated only
           * for style attributes — on a per-component override site
           * (`<point markerStyle="…">`) or inside a `<styleDefinition>`
           * attribute — where ancestor `<styleDefinition>` blocks or the
           * built-in numbered presets supply a value that differs from the
           * static fallback. `styleNumber` is the integer the value comes
           * from, so the help panel can render "Active default: X (from
           * styleDefinition styleNumber=N)".
           *
           * Suppressed when the active value would tell the author nothing
           * new — currently when it equals the static `defaultValue` for
           * styleNumber=1 sites with no ancestor `<styleDefinition>`
           * influence. See `computeContextHelp` for the suppression rule.
           */
          activeDefault?: {
              value: string | number | boolean;
              styleNumber: number;
              /**
               * Human-readable color word derived from `value` when the
               * attribute is a non-word color key (`lineColor`,
               * `fillColorDarkMode`, etc.). The help panel renders it in
               * parens next to the hex and styles both with the resolved
               * color. Absent for non-color attributes and for color values
               * that already are their own word (CSS named colors).
               */
              colorWord?: string;
          };
          /**
           * Full per-styleNumber breakdown of the relevant style attributes
           * at the cursor's scope (issue #1204).  Populated for two trigger
           * sites:
           *   - cursor on the `styleNumber` attribute of a graphical
           *     component — entries are filtered to the style key prefixes
           *     declared on that component (e.g. marker* for `<point>`,
           *     line* + fill* for `<polygon>`).
           *   - cursor on any attribute inside a `<styleDefinition>` —
           *     entries cover every populated style key for the active
           *     styleNumber, since the author is editing the styleDefinition
           *     itself and the full listing is the point.
           *
           * Absent for any other cursor position.  See {@link StyleBreakdownPayload}
           * for the shared shape (also surfaced on the `element` kind when
           * the cursor sits on a `<styleDefinition>` tag name).
           */
          styleBreakdown?: StyleBreakdownPayload;
          /**
           * Effective MathQuill function-name list at the cursor's scope
           * (issue #1205). Populated only when the cursor sits on
           * `additionalFunctionNames`, `removedFunctionNames`, or
           * `resetFunctionNames` of a `<mathInput>`. See
           * {@link FunctionNamesBreakdownPayload} for the field-by-field
           * contract.
           */
          functionNamesBreakdown?: FunctionNamesBreakdownPayload;
      }
    /**
     * A reference to a *property* of another component, e.g.
     * `$myMath.splitSymbols`. The panel frames this around the reference
     * concept (what it points at + where), not around the container
     * component's own docs page — so there is no `docsSlug` here; the
     * "Learn about references" link is the only outbound link.
     */
    | {
          kind: "property";
          elementName: string;
          propertyName: string;
          description: string;
          /**
           * Full authored chain after the `$` (e.g. `m.splitSymbols`),
           * rendered in the panel sentence. Identical regardless of which
           * segment the cursor sits on, since the whole macro is one unit.
           */
          displayPath: string;
          /** 1-indexed source line where the container component is defined. */
          line?: number;
          /** Optional: some properties have no declared component type. */
          type?: string;
          isArray: boolean;
      }
    /**
     * A coordinate-style access chased through an array property's
     * `indexAliases` table — e.g. `$vector.head.x`, `$line.points[1].x`,
     * `$circle.center.y`. The chase is exact-match on the alias table only;
     * it never consults the array entry's `type` to look up properties of
     * the represented inner component (e.g. `<point>`). That keeps the help
     * layer in lockstep with the runtime, which also doesn't resolve
     * non-alias members of an array slot. Issue #1180.
     */
    | {
          kind: "arrayEntry";
          /** Owning element's tag name (e.g. `vector`). */
          elementName: string;
          /** Array property name (e.g. `head`). */
          arrayName: string;
          /**
           * Path of alias names consumed after the array prop (e.g. `["x"]`
           * for `$vector.head.x`, `["x"]` for `$line.points[1].x`). Empty if
           * every dimension was consumed by numeric indices. Used to render
           * the "Coordinate:" / "Coordinates:" detail row.
           */
          aliasPath: string[];
          /**
           * The chain past the container, pre-rendered with the author's
           * exact bracket-index values preserved (e.g. `"head.x"`,
           * `"points[1].x"`, `"arr[0][2].z"`). Built from `rawPathParts`
           * so the title shows what the author actually typed rather than
           * a `[…]` placeholder. The panel renders this verbatim.
           */
          displayTail: string;
          /** Array property description from the schema. */
          description: string;
          /**
           * Innermost entry type from `indexedArrayDescription` — display
           * only (e.g. `point` for `points[1]`, `math` for `head.x`). Not
           * a license to chase through it. May be undefined when the array
           * slot lacked a `createComponentOfType`.
           */
          leafType?: string;
          /** Reference-page slug for the owning element. */
          docsSlug: string | null;
      }
    | {
          kind: "refName";
          /**
           * The bare identifier under the cursor (no leading `$`).
           *
           * NOTE (2026-05-10): currently unused by `ContextHelpPanel` — the
           * panel renders `displayPath` only. Tests assert this field but
           * nothing else consumes it. Consider deleting if it remains unused.
           */
          refName: string;
          /**
           * Full chain prefix to render with the leading `$` in the panel.
           * For a bare `$name`, equals `refName` (e.g. `"m"`). For a member
           * ref whose cursor segment resolves to a named descendant
           * (`$sec.bi`), this is the dotted chain (`"sec.bi"`).
           */
          displayPath: string;
          /** Tag name of the referent element (e.g. `math`). */
          targetElementName: string;
          /** 1-indexed source line where the referent is defined. */
          line: number | undefined;
          /**
           * Set when `refName` is introduced by an enclosing `<repeat>` /
           * `<repeatForSequence>` via `valueName` or `indexName` rather
           * than a `name=` attribute on a regular element. The panel
           * renders an extra annotation in this case so the user can see
           * *why* the name is in scope.
           *
           * Other consumers can safely ignore this field — the rest of
           * the payload still describes the introducing element.
           */
          derivedFrom?: {
              role: "valueName" | "indexName";
              ownerElementName: string;
              ownerLine: number | undefined;
          };
      }
    /**
     * Cursor is on a `$a.b.c…` chain that the JS-only resolver can't follow.
     * Issue #1086 tracks adding multi-part support; until then, surface a
     * placeholder rather than silently rendering the empty state.
     */
    | { kind: "unsupportedRefChain" }
    /**
     * Cursor is on a bare `$name` reference that doesn't resolve to a
     * referent. `reason` distinguishes verdicts the runtime resolver can make
     * authoritatively from cases where the resolver was unavailable or
     * inconclusive — so the panel never claims "no referent" when the real
     * cause is the checker's incomplete view:
     *   - `notFound`  — the resolver definitively found no referent.
     *   - `multiple`  — the resolver found more than one (ambiguous) referent.
     *   - `indeterminate` — the resolver couldn't decide (e.g. it hadn't
     *     booted yet, or hit an inconclusive case); the panel hedges.
     */
    | {
          kind: "unresolvedRef";
          /** Chain after the `$` (e.g. `bad`), rendered in the message. */
          displayPath: string;
          reason: "notFound" | "multiple" | "indeterminate";
      }
    /**
     * Cursor is in an element's body or in top-level whitespace — not on any
     * tag, attribute, or reference. Rather than going blank, the panel
     * suggests components the author could insert here ("what can go here?").
     *
     * `suggested` is the top N element entries from the shared ranker
     * (`rankedChildSuggestions`) — the same ordering that drives the
     * autocomplete dropdown's `sortText`. Snippets are intentionally excluded
     * from the panel (they still cluster with their element in the dropdown);
     * variations of one element would crowd out a diverse spread of
     * components in only six chips. See `SuggestionItem`.
     *
     * `totalAllowed` is the full count of allowed element types at this
     * position so the panel can point at Ctrl+Space for the complete list.
     */
    | {
          kind: "suggestions";
          /** Where the cursor is: inside `elementName`, or at the document top. */
          context: { elementName: string } | { topLevel: true };
          suggested: SuggestionItem[];
          totalAllowed: number;
          /**
           * Whether this container also accepts string (text) children. The
           * panel uses this with `totalAllowed` to choose the right empty/
           * non-empty messaging — e.g. `<variantControl>` (no children, no
           * strings) shows "takes no children", whereas a `<math>` body
           * (strings + components) shows a "type text directly" hint above
           * the suggestion list.
           */
          acceptsStringChildren: boolean;
      }
    /**
     * Highlighted autocomplete row is a snippet (multi-line template). Carries
     * the snippet's human-readable description and the raw template text so
     * the panel can preview it before insertion. No `docsSlug` — snippets
     * don't have reference pages.
     */
    | {
          kind: "snippet";
          /** Snippet identifier (also the autocomplete `label`). */
          snippetKey: string;
          /** Root element the snippet expands to. */
          elementName: string;
          /** Human-readable description from the snippet definition. */
          description: string;
          /** Raw snippet template (trimmed leading whitespace). */
          snippetText: string;
      };
