export * from "./parser";
export * from "./extract-dast-errors";
export * from "./types";
export * from "./types-util";
export * from "./detect-version";
export {
    visit,
    EXIT,
    CONTINUE,
    SKIP,
} from "./pretty-printer/normalize/utils/visit";
export { replaceNode } from "./pretty-printer/normalize/utils/replace-node";
export { toXml } from "./dast-to-xml/dast-util-to-xml";
export { lezerToDast, stringToLezer } from "./lezer-to-dast/lezer-to-dast";
export { filterPositionInfo } from "./dast-to-xml/utils";
export { normalizeDocumentDast } from "./dast-normalize/normalize-dast";
export { expandExternalReferences } from "./expand-external-references";
// `findBareAttributeValuePairs` is intentionally not re-exported: the
// parser layer now strips bare-value pairs from `node.attributes` itself
// (#1197), so no outside consumer needs to re-detect them.  The shared
// message lives in the public API so the LSP and any future consumers
// can match the parser's wording exactly.
export { unquotedAttributeValueMessage } from "./detect-bare-attribute-pairs";
