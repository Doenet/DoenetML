//@ts-ignore
import me from "math-expressions";
import { subsets } from "../math/subset-of-reals";

export function serializedComponentsReplacer(key: any, value: any) {
    if (value !== value) {
        return { objectType: "special-numeric", stringValue: "NaN" };
    } else if (value === Infinity) {
        return { objectType: "special-numeric", stringValue: "Infinity" };
    } else if (value === -Infinity) {
        return { objectType: "special-numeric", stringValue: "-Infinity" };
    }
    return value;
}

export function nanInfinityReviver(key: any, value: any) {
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
}

export function serializedComponentsReviver(key: any, value: any) {
    return me.reviver(
        key,
        subsets.subsetReviver(key, nanInfinityReviver(key, value)),
    );
}
