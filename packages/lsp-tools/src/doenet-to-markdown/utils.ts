/**
 * Compute the sum of an array of numbers.
 */
export function sum(arr: number[]): number {
    let ret = 0;
    for (const a of arr) {
        if (typeof a !== "number") {
            continue;
        }
        ret += a;
    }
    return ret;
}
