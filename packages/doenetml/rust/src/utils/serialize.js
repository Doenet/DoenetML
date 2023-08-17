export function serializedComponentsReplacer(key, value) {
    if (value !== value) {
        return { objectType: "special-numeric", stringValue: "NaN" };
    } else if (value === Infinity) {
        return { objectType: "special-numeric", stringValue: "Infinity" };
    } else if (value === -Infinity) {
        return { objectType: "special-numeric", stringValue: "-Infinity" };
    }
    return value;
}

let nanInfinityReviver = function (key, value) {
    if (value && value.objectType === "special-numeric") {
        if (value.stringValue === "NaN") {
            return NaN;
        } else if (value.stringValue === "Infinity") {
            return Infinity;
        } else if (value.stringValue === "-Infinity") {
            return -Infinity;
        }
    }

    return value;
};

export function serializedComponentsReviver(key, value) {
    return me.reviver(
        key,
        subsets.Subset.reviver(key, nanInfinityReviver(key, value))
    );
}
