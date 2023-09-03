import type { Plugin, SupportOption } from "prettier";
import { lezerToDast } from "../lezer-to-dast";
import { DastNodes, PrintOptions } from "../types";
import { normalize } from "./normalize";
import { print } from "./printer";

export const languages: Plugin["languages"] = [
    { name: "doenet", extensions: [".doenet"], parsers: ["doenet-parser"] },
];

export const parsers: Plugin<DastNodes>["parsers"] = {
    "doenet-parser": {
        parse(source: string, options) {
            return normalize(lezerToDast(source));
        },
        astFormat: "dast",
        locStart: (node: DastNodes) =>
            (node.position || { start: { offset: 0 } }).start.offset || 0,
        locEnd: (node: DastNodes) =>
            (node.position || { end: { offset: 0 } }).end.offset || 0,
    },
};

export const printers: Plugin<DastNodes>["printers"] = {
    dast: {
        print,
    },
};

export const options: Plugin["options"] = {
    /**
     * Whether to render with the DoenetML syntax rather than true XML.
     * That means `<` and `&` characters are allowed unescaped in the output.
     */
    doenetSyntax: {
        category: "Global",
        type: "boolean",
        default: false,
        description:
            "Whether to render with the DoenetML syntax rather than true XML. That means `<` and `&` characters are allowed unescaped in the output.",
    },
    /**
     * Whether to output XML error nodes when there are processing errors.
     */
    inlineErrors: {
        category: "Global",
        type: "boolean",
        default: false,
        description:
            "Whether to output XML error nodes when there are processing errors.",
    },
};

export default { languages, parsers, printers, options };
