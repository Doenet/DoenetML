import doenetSchema from "./generated/doenet-schema.json";
import _doenetRelaxngSchema from "./generated/doenet-relaxng-schema.json";
import _ENTITY_MAP from "./generated/entity-map.json";
import mathAssets from "./generated/math-assets.json";
const ENTITY_MAP: Record<string, string> = _ENTITY_MAP;

export type SchemaProperty = {
    name: string;
    type: string;
    isArray: boolean;
    numDimensions?: number;
    indexedArrayDescription?: unknown[];
};

export type RelaxNgSchema = {
    startType: string | string[];
    refs: Record<string, RelaxNgAttribute>;
};

export type RelaxNgAttribute = {
    type: "element";
    name: string;
    attributes: Record<string, { optional: boolean; type: string[] }>;
    children: { ref: string }[];
    properties?: SchemaProperty[];
    textChildrenAllowed: boolean;
};

const doenetRelaxngSchema: RelaxNgSchema = _doenetRelaxngSchema as any;
export { doenetSchema, ENTITY_MAP, doenetRelaxngSchema, mathAssets };
