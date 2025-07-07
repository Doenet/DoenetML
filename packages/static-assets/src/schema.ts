import doenetSchema from "./generated/doenet-schema.json";

export type SchemaProperty = {
    name: string;
    type: string;
    isArray: boolean;
    numDimensions?: number;
    indexedArrayDescription?: unknown[];
};

export { doenetSchema };
