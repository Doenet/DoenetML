import doenetSchema from "./generated/doenet-schema.json";

/**
 * A single author-facing entry in an attribute's `validValues` list, paired
 * with a human-readable description that flows into editor autocomplete and
 * the context-sensitive help panel.
 */
export type ValidValueEntry = { value: string; description: string };

export type SchemaProperty = {
    name: string;
    /**
     * Component type the property resolves to. Optional because some public
     * state variables (e.g. unwrapped array slots) have no
     * `createComponentOfType` and the generator omits `type` for them.
     */
    type?: string;
    isArray: boolean;
    numDimensions?: number;
    indexedArrayDescription?: unknown[];
    description?: string;
    fromAttribute?: boolean;
};

export { doenetSchema };
