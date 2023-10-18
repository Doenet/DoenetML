import { RowCol } from "../doenet-source-object";
import type { CompletionItem, Diagnostic } from "vscode-languageserver/browser";
import {
    CompletionItemKind,
    DiagnosticSeverity,
} from "vscode-languageserver/browser";
import { DastElement, DastRoot, showCursor } from "@doenet/parser";
import { AutoCompleter } from ".";

/**
 * Get a list of completion items at the given offset.
 */
export function getSchemaViolations(this: AutoCompleter): Diagnostic[] {
    /**
     * Get all pairs of elements and their parent.
     */
    function getElementPairs(
        node: DastElement | DastRoot,
    ): { node: DastElement; parent: DastElement | DastRoot }[] {
        return node.children.flatMap((child) => {
            if (child.type === "element") {
                return [
                    { node: child, parent: node },
                    ...getElementPairs(child),
                ];
            }
            return [];
        });
    }

    const ret: Diagnostic[] = getElementPairs(this.sourceObj.dast).flatMap(
        ({ node, parent }) => {
            const name = this.normalizeElementName(node.name);
            if (parent.type === "root") {
                const schema = this.schemaElementsByName[name];
                if (!schema) {
                    return [];
                }
                if (!schema.top) {
                    return {
                        range: {
                            start: this.sourceObj.offsetToLSPPosition(
                                node.position?.start.offset || 0,
                            ),
                            end: this.sourceObj.offsetToLSPPosition(
                                node.position?.end.offset || 0,
                            ),
                        },
                        message: `Element \`<${name}>\` is not allowed at the root of the document.`,
                        severity: DiagnosticSeverity.Warning,
                    };
                }
                return [];
            }
            const parentName = this.normalizeElementName(parent.name);
            if (!this._getAllowedChildren(parentName).includes(name)) {
                return {
                    range: {
                        start: this.sourceObj.offsetToLSPPosition(
                            node.position?.start.offset || 0,
                        ),
                        end: this.sourceObj.offsetToLSPPosition(
                            node.position?.end.offset || 0,
                        ),
                    },
                    message: `Element \`<${name}>\` is not allowed as a child of \`<${parentName}>\`.`,
                    severity: DiagnosticSeverity.Warning,
                };
            }

            return [];
        },
    );

    return ret;
}
