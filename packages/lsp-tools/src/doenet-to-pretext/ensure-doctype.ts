import type { Root as XastRoot } from "xast";

/**
 * Ensure there is a `<?xml ... ?>` declaration at the top of the document.
 */
export function ensureDocType(xmlAst: XastRoot) {
    const hasDocType = Boolean(
        xmlAst.children.find((child) => child.type === "doctype"),
    );
    if (!hasDocType) {
        xmlAst.children.unshift({ type: "text", value: "\n" });
        xmlAst.children.unshift({
            type: "instruction",
            name: "xml",
            value: 'version="1.0" encoding="UTF-8"',
        });
    }
}
