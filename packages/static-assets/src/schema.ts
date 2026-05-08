import doenetSchema from "./generated/doenet-schema.json";

export type SchemaProperty = {
    name: string;
    type: string;
    isArray: boolean;
    numDimensions?: number;
    indexedArrayDescription?: unknown[];
    description?: string;
    fromAttribute?: boolean;
};

export { doenetSchema };
