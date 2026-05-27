import type { ValidValueEntry } from "@doenet/static-assets/schema";

export type HelpContent =
    | { kind: "none" }
    | {
          kind: "element";
          elementName: string;
          summary: string;
          /** Reference-page slug; null when intentionally undocumented. */
          docsSlug: string | null;
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
      }
    | {
          kind: "property";
          elementName: string;
          propertyName: string;
          description: string;
          /** Reference-page slug for the resolved container element. */
          docsSlug: string | null;
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
          /** Component summary for the referent's element type, alias-aware. */
          summary: string | null;
          /** 1-indexed source line where the referent is defined. */
          line: number | undefined;
          /** Reference-page slug for the referent's element type. */
          docsSlug: string | null;
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
