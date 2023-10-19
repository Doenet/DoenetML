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

    const allPairs = getElementPairs(this.sourceObj.dast);

    const ret: Diagnostic[] = allPairs.flatMap(({ node, parent }) => {
        const ret: Diagnostic[] = [];
        const name = this.normalizeElementName(node.name);

        if (name === "UNKNOWN_NAME") {
            // No further checking for unknown elements.
            const range = this.sourceObj.getElementTagRanges(node);
            return {
                range: {
                    start: this.sourceObj.offsetToLSPPosition(range[0].start),
                    end: this.sourceObj.offsetToLSPPosition(range[0].end),
                },
                message: `Element \`<${node.name}>\` is not a recognized Doenet element.`,
                severity: DiagnosticSeverity.Warning,
            };
        }

        const schema = this.schemaElementsByName[name];
        //
        // Check parent-child relationship
        //
        if (parent.type === "root") {
            if (!schema) {
                return [];
            }
            if (!schema.top) {
                const range = this.sourceObj.getElementTagRanges(node);
                ret.push({
                    range: {
                        start: this.sourceObj.offsetToLSPPosition(
                            range[0].start,
                        ),
                        end: this.sourceObj.offsetToLSPPosition(range[0].end),
                    },
                    message: `Element \`<${name}>\` is not allowed at the root of the document.`,
                    severity: DiagnosticSeverity.Warning,
                });
            }
        } else {
            const parentName = this.normalizeElementName(parent.name);
            if (
                parentName !== "UNKNOWN_NAME" &&
                !this.isAllowedChild(parentName, name)
            ) {
                const range = this.sourceObj.getElementTagRanges(node);
                ret.push({
                    range: {
                        start: this.sourceObj.offsetToLSPPosition(
                            range[0].start,
                        ),
                        end: this.sourceObj.offsetToLSPPosition(range[0].end),
                    },
                    message: `Element \`<${name}>\` is not allowed inside of \`<${parentName}>\`.`,
                    severity: DiagnosticSeverity.Warning,
                });
            }
        }

        //
        // Check attributes
        //
        for (const attr of node.attributes) {
            const attrName = this.normalizeAttributeName(attr.name);
            if (attrName === "UNKNOWN_NAME") {
                ret.push({
                    range: {
                        start: this.sourceObj.offsetToLSPPosition(
                            attr.position?.start.offset || 0,
                        ),
                        end: this.sourceObj.offsetToLSPPosition(
                            attr.position?.end.offset || 0,
                        ),
                    },
                    message: `Element \`<${name}>\` doesn't have an attribute called \`${attr.name}\`.`,
                    severity: DiagnosticSeverity.Warning,
                });
            } else if (!this.isAllowedAttribute(name, attrName)) {
                ret.push({
                    range: {
                        start: this.sourceObj.offsetToLSPPosition(
                            attr.position?.start.offset || 0,
                        ),
                        end: this.sourceObj.offsetToLSPPosition(
                            attr.position?.end.offset || 0,
                        ),
                    },
                    message: `Element \`<${name}>\` doesn't have an attribute called \`${attrName}\`.`,
                    severity: DiagnosticSeverity.Warning,
                });
            }
        }
        return ret;
    });

    return ret;
}
