import { FlatDastElement } from "@doenet/doenetml-worker-rust";

/**
 * Renames specific keys from `props`.
 */
export function propRename(
    props: Record<string, any>,
    nameDict: Record<string, string>,
) {
    for (const [oldName, newName] of Object.entries(nameDict)) {
        if (props.hasOwnProperty(oldName)) {
            props[newName] = props[oldName];
            delete props[oldName];
        }
    }
}

/**
 * In-place rename of the tag for an element.
 */
export function elementRename(element: FlatDastElement, newName: string) {
    element.name = newName;
}
