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
      };
