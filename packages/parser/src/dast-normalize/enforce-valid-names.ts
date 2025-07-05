import { Plugin } from "unified";
import { DastElement, DastError, DastRoot } from "../types";
import { visit } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";
import { toXml } from "..";

/**
 * True if `str` does not start with a letter. This function is valid for all types.
 * If given a non-string type, it will return `false`.
 */
function startsWithNonLetter(str: unknown): boolean {
    return typeof str === "string" && !str.charAt(0).match(/[a-zA-Z]/);
}

function containsInvalidNameCharacters(str: unknown): boolean {
    return typeof str === "string" && !str.match(/^[a-zA-Z0-9-_]+$/);
}

/**
 * Ensure that no component names start with `_` and that all `name` attributes start with a letter.
 */
export const pluginEnforceValidNames: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visit(tree, (node, info) => {
            if (!isDastElement(node)) {
                return;
            }

            // Ensure component names cannot start with `_`
            if (
                startsWithNonLetter(node.name) &&
                node.name !== "_error" &&
                node.name !== "_externalContent"
            ) {
                const name = node.name;
                // Convert this element into an error element
                const dastError: DastError = {
                    type: "error",
                    message: `Invalid component name "${name}". Names must start with a letter.`,
                    position: node.position,
                };

                // Replace this element with an `_error` element
                if (info.index !== undefined && info.parents[0]) {
                    info.parents[0].children.splice(info.index, 1, dastError);
                } else {
                    // If for some reason we don't have an index, append the error to the root
                    console.warn(
                        "No index found for error element, appending to root.",
                    );
                    tree.children.push(dastError);
                }
            }

            // Ensure the value of any `name` attribute
            // - is non-empty,
            // - does not start with a non-letter, and
            // - does not contain characters other than letters, number, hyphens or underscores
            if (node.attributes.name) {
                const name = toXml(node.attributes.name.children);
                const nonLetter = startsWithNonLetter(name);
                const invalidChar = containsInvalidNameCharacters(name);

                if (nonLetter || invalidChar) {
                    const message = `Invalid attribute name='${name}'. ${nonLetter ? "Names must start with a letter." : "Names can contain only letters, numbers, underscores or hyphens."}`;
                    const dastError: DastError = {
                        type: "error",
                        message,
                        position: node.attributes.name?.position,
                    };

                    // Remove the `name` attribute and insert an `_error` element right after this element
                    delete node.attributes.name;

                    if (info.index !== undefined && info.parents[0]) {
                        info.parents[0].children.splice(
                            info.index + 1,
                            0,
                            dastError,
                        );
                    } else {
                        // If for some reason we don't have an index, append the error to the root
                        console.warn(
                            "No index found for error element, appending to root.",
                        );
                        tree.children.push(dastError);
                    }
                }
            }
        });
    };
};
