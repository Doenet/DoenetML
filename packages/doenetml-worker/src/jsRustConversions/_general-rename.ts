/**
 * Renames specific keys from `props`.
 */
export function generalRename(
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
