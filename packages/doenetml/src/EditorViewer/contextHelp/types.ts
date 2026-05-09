export type HelpContent =
    | { kind: "none" }
    | { kind: "element"; elementName: string; summary: string }
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
          type: string;
          isArray: boolean;
      };
