import { FlatPathPart } from "@doenet/doenetml-worker";

/**
 * Return `true` if two paths `path1` and `path2` are identical other than their `position` attributes.
 * Otherwise return `false`.
 */
export function comparePathsIgnorePosition(
    path1: FlatPathPart[] | null,
    path2: FlatPathPart[] | null,
) {
    if (path1 === null) {
        if (path2 == null) {
            return true;
        } else {
            return false;
        }
    } else if (path2 === null) {
        return false;
    }

    if (path1.length !== path2.length) {
        return false;
    }

    return path1.every((p1, i) => {
        const p2 = path2[i];

        if (p1.name !== p2.name || p1.index.length !== p2.index.length) {
            return false;
        }

        return p1.index.every((index1, j) => {
            const index2 = p2.index[j];

            if (index1.value.length !== index2.value.length) {
                return false;
            }

            return index1.value.every((v, k) => v == index2.value[k]);
        });
    });
}
