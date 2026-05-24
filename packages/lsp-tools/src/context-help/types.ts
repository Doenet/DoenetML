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
