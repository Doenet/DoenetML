/**
 * Return whether or not the arrays `a` and `b` equal
 * using a shallow comparison.
 *
 * @param a
 * @param b
 */
export function arrayEq(a: any[], b: any[]) {
    if (a.length !== b.length) {
        return false;
    }

    return a.every((v, i) => v === b[i]);
}
