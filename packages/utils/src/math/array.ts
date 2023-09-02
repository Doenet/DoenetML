// from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
export function flattenDeep(arr1: any[]): any[] {
    return arr1.reduce(
        (acc, val) =>
            Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
        [],
    );
}

export function flattenLevels(arr1: any[], levels: number): any[] {
    return arr1.reduce(
        (acc, val) =>
            Array.isArray(val) && levels > 1
                ? acc.concat(flattenLevels(val, levels - 1))
                : acc.concat(val),
        [],
    );
}

export function mapDeep(
    arr: any[],
    f: Function,
    iprefix: number[] = [],
    origArr?: any[],
): any[] {
    if (!origArr) {
        origArr = arr;
    }
    return arr.map((v: any, i) =>
        Array.isArray(v)
            ? mapDeep(v, f, [...iprefix, i], origArr)
            : f(v, [...iprefix, i], origArr),
    );
}
