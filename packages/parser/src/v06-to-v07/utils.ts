import { toXml } from "../dast-to-xml/dast-util-to-xml";
import { isElement } from "../pretty-printer/normalize/utils/testers";
import { visit } from "../pretty-printer/normalize/utils/visit";
import { DastRoot } from "../types";

/**
 * Find a name that does not conflict with any existing element names. `baseName` is
 * used if available, otherwise a suffix is added to baseName until it is unique.
 */
export function getUniqueName(tree: DastRoot, baseName: string): string {
    const allNames = new Set();
    visit(tree, (node) => {
        if (!isElement(node)) {
            return;
        }
        if (node.attributes["name"]) {
            allNames.add(toXml(node.attributes["name"].children).trim());
        }
        if (node.attributes["assignNames"]) {
            const assignNames = toXml(
                node.attributes["assignNames"].children,
            ).trim();
            if (assignNames) {
                for (const name of assignNames.split(/\s+/)) {
                    allNames.add(name);
                }
            }
        }
    });

    let name = baseName;
    let i = 1;
    while (allNames.has(name)) {
        name = `${baseName}${i}`;
        i++;
    }
    return name;
}
