import { DastElement } from "@doenet/parser";

/**
 * Rename an attribute in place. This function ensure that the order that the attributes
 * appear is preserved.
 */
export function renameAttrInPlace(
    elm: DastElement,
    oldName: string,
    newName: string,
) {
    if (oldName === newName || !elm.attributes[oldName]) {
        return;
    }
    const newAttrs = Object.fromEntries(
        Object.entries(elm.attributes).map(([name, attr]) => {
            if (name === oldName) {
                attr.name = newName;
                return [newName, attr];
            }
            return [name, attr];
        }),
    );
    elm.attributes = newAttrs;
}
