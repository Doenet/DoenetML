import {
    DastElement,
    DastMacro,
    DastMacroPathPart,
    DastRoot,
    toXml,
} from "@doenet/parser";
import { DoenetSourceObject, RowCol } from "../index";
import { AccessList } from "../initializers";

/**
 * Get the element that `macro` is referring to at position `offset`.
 * Because a macro may end in attribute access, the algorithm searches
 * for the largest matching initial segment and returns any unmatched parts
 * of the macro.
 */
export function getMacroReferentAtOffset(
    this: DoenetSourceObject,
    offset: number | RowCol,
    macro: DastMacro,
) {
    const [pathPart, ...restPath] = macro.path;
    if (!pathPart) {
        return null;
    }
    if (pathPart.index.length > 0) {
        throw new Error(
            `The first part of a macro path must be just a name without an index. Failed to resolve "${toXml(
                macro,
            )}"`,
        );
    }
    // If we made it here, we are just a name, so proceed with the lookup!
    let referent = this.getReferentAtOffset(offset, pathPart.name);
    if (!referent) {
        return null;
    }
    // If there are no member accesses, the referent gets returned.
    if (restPath.length === 0) {
        return {
            node: referent,
            unresolvedPath: [] as DastMacroPathPart[],
        };
    }
    // Otherwise, walk down member path until unresolved.
    let currReferent = referent;
    for (let i = 0; i < restPath.length; i++) {
        const part = restPath[i];
        if (part.index.length > 0) {
            // Indexing can only be used on synthetic nodes.
            return {
                node: referent,
                unresolvedPath: restPath.slice(i),
            };
        }
        const propReferent = this.getNamedDescendant(currReferent, part.name);
        if (!propReferent) {
            return {
                node: referent,
                unresolvedPath: restPath.slice(i),
            };
        }
        // Step down one level
        referent = propReferent;
        currReferent = propReferent;
    }
    return {
        node: referent,
        unresolvedPath: [] as DastMacroPathPart[],
    };
}

/**
 * Get a list of all names that can be addressed from `offset`. These names can be used
 * in a macro path.
 */
export function getAddressableNamesAtOffset(
    this: DoenetSourceObject,
    offset: number | RowCol,
) {
    const currElement =
        this.elementAtOffsetWithContext(offset).node || this.dast;
    const descendantNamesMap = this._descendantNamesMap();

    const addressableChildren = getMacroAddressableChildrenAtElement(
        currElement,
        descendantNamesMap,
    );
    const parents = this.getParents(currElement);
    const addressableParents = parents.map((ancestor) =>
        getMacroAddressableChildrenAtElement(ancestor, descendantNamesMap),
    );

    return mergeLeftUniquePrefixes(addressableChildren, addressableParents);
}

/**
 * Get the addresses of all children of `element`. Addresses are lists of nodes that have a `name` property.
 * For example `<a name="x"><b name="y" /></a>` would return `[["x", "y"], ["x"]]`. This function
 * ensures that addresses are unique.
 */
export function getMacroAddressableChildrenAtElement(
    currElement: DastElement | DastRoot,
    descendantNamesMap: Map<DastElement | DastRoot, AccessList>,
): string[][] {
    const accessList = descendantNamesMap.get(currElement);
    if (!accessList) {
        throw new Error(
            `Expected accessList to be defined for ${
                currElement.type === "root" ? "root" : currElement.name
            }`,
        );
    }

    const ret: string[][] = [];
    // First we find all names that address children of `currElement`.
    const addressableNames = new Set(
        filterUnique(accessList.map((n) => n.name)),
    );
    for (const name of addressableNames) {
        ret.push([name]);
    }
    for (const { name, element } of accessList.filter((n) =>
        addressableNames.has(n.name),
    )) {
        const childNames = getMacroAddressableChildrenAtElement(
            element,
            descendantNamesMap,
        );
        ret.push(...childNames.map((childName) => [name, ...childName]));
    }

    return ret;
}

/**
 * Returns a list of all the names that occur exactly once.
 */
function filterUnique(names: string[]): string[] {
    const counts = new Map<string, number>();
    for (const name of names) {
        counts.set(name, (counts.get(name) || 0) + 1);
    }

    return names.filter((name) => counts.get(name) === 1);
}

/**
 * Merge `toMerge` into `base` but only include lists whose prefixes are unique.
 * For example `base=[["a", "b"], ["a", "c"]]` and `toMerge=[["a", "b", "c"], ["a", "b", "d"], ["z"]]`
 * would result in `[["a", "b"], ["a", "c"], ["z"]]`
 */
export function mergeLeftUniquePrefixes(
    base: string[][],
    toMerge: string[][][],
): string[][] {
    const ret: string[][] = [...base];
    const normalizedPrefixes = new Set<string>(
        base.flatMap(getPrefixes).map((p) => p.join(",")),
    );
    for (const addresses of toMerge) {
        const newPrefixes: string[] = [];
        for (const address of addresses) {
            if (
                getPrefixes(address).some((p) =>
                    normalizedPrefixes.has(p.join(",")),
                )
            ) {
                // We share a prefix with an existing address, so we don't add this address.
                continue;
            }
            ret.push(address);
            newPrefixes.push(...getPrefixes(address).map((p) => p.join(",")));
        }
        for (const prefix of newPrefixes) {
            normalizedPrefixes.add(prefix);
        }
    }
    return ret;
}

/**
 * Get all prefixes of `address`.
 */
export function getPrefixes(address: string[]): string[][] {
    return address.map((_, i) => address.slice(0, i + 1));
}
