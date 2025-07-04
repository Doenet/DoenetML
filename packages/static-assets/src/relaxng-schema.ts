import _doenetRelaxngSchema from "./generated/doenet-relaxng-schema.json";
import { SchemaProperty } from "./schema";

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

export const doenetRelaxngSchema: RelaxNgSchema = _doenetRelaxngSchema as any;
