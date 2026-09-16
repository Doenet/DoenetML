import { Plugin } from "unified";
import { DastElement, DastError, DastRoot } from "../types";
import { codedDastError } from "../coded-dast-error";
import { visitIncludingPathIndices } from "../pretty-printer/normalize/utils/visit";
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
        visitIncludingPathIndices(tree, (node, info) => {
            if (!isDastElement(node)) {
                return;
            }

            // Where an `_error` may be written, and whether this element may
            // simply be replaced by one.
            //
            // An `_error` belongs in a `children` array, which is the only
            // place the flattener will take one. An element written between a
            // reference's index brackets lives in that index's `value`
            // instead, and one written as a function reference's argument
            // lives in that reference's `input` — and both of those admit only
            // text, references and elements, so an `_error` left in either is
            // not a diagnostic but a deserialization failure that takes the
            // whole document down. In those two places the offending element
            // is lifted out of where it was written and the error is reported
            // from the nearest enclosing element instead.
            const siblings = info.parents[0]?.children;
            const replaceableInPlace =
                info.index !== undefined &&
                info.containingArray !== undefined &&
                info.containingArray === siblings;

            // Ensure component names cannot start with `_`
            if (startsWithNonLetter(node.name) && node.name !== "_error") {
                const name = node.name;
                // Convert this element into an error element
                const dastError: DastError = codedDastError({
                    code: "doenet-e0024",
                    message: `Invalid component name "${name}". Names must start with a letter.`,
                    args: { name },
                    position: node.position,
                });

                // Replace this element with an `_error` element.
                if (replaceableInPlace) {
                    info.containingArray!.splice(info.index!, 1, dastError);
                } else if (siblings) {
                    // Not a `children` array. Drop the element from wherever it
                    // was written — `info.index` counts along that array, so
                    // `containingArray` is the one to splice — and report from
                    // the nearest element.
                    if (info.index !== undefined && info.containingArray) {
                        info.containingArray.splice(info.index, 1);
                    }
                    siblings.push(dastError);
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
                    // The reason travels as a key, not as the English half-
                    // sentence it used to be pasted from: a translation has to
                    // be free to reorder the whole sentence, which it cannot do
                    // if half of it arrives as an argument.
                    const reason = nonLetter ? "start" : "characters";
                    const message = `Invalid attribute name='${name}'. ${nonLetter ? "Names must start with a letter." : "Names can contain only letters, numbers, underscores or hyphens."}`;
                    const dastError: DastError = codedDastError({
                        code: "doenet-e0025",
                        message,
                        args: { name, reason },
                        position: node.attributes.name?.position,
                    });

                    // Remove the `name` attribute and insert an `_error` element right after this element
                    delete node.attributes.name;

                    if (replaceableInPlace) {
                        info.containingArray!.splice(
                            info.index! + 1,
                            0,
                            dastError,
                        );
                    } else if (siblings) {
                        // The element itself stays where it was written — only
                        // its `name` was invalid, and that has just been
                        // removed — so the error is simply reported from the
                        // nearest element.
                        siblings.push(dastError);
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
