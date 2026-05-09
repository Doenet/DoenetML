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
          allowedValues?: unknown[];
          defaultValue?: unknown;
      }
    | {
          kind: "property";
          elementName: string;
          propertyName: string;
          description: string;
          /** Optional: some properties have no declared component type. */
          type?: string;
          isArray: boolean;
      }
    /**
     * Cursor is on a `$a.b.c…` chain that the JS-only resolver can't follow.
     * Issue #1086 tracks adding multi-part support; until then, surface a
     * placeholder rather than silently rendering the empty state.
     */
    | { kind: "unsupportedRefChain" };
