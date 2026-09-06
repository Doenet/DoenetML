import { FlatPathPart } from "@doenet/doenetml-worker";
import { unwrapSource } from "./convertNormalizedDast";
import {
    isSerializedComponent,
    SerializedComponent,
    SerializedRefResolutionPathPart,
} from "./types";

/**
 * A part of a reference path, either as the parser flattened it or as it was
 * serialized onto a component's ref resolution. The two shapes agree on
 * everything compared here.
 */
type PathPart = FlatPathPart | SerializedRefResolutionPathPart;

/**
 * Return `true` if two paths `path1` and `path2` are identical other than their `position` attributes.
 * Otherwise return `false`.
 */
export function comparePathsIgnorePosition(
    path1: PathPart[] | null,
    path2: PathPart[] | null,
) {
    if (path1 === null) {
        return path2 === null;
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

            return index1.value.every((v, k) =>
                compareIndexValues(v, index2.value[k]),
            );
        });
    });
}

/**
 * Compare one entry of a path index.
 *
 * A literal index — the `1` of `$m[1]` — is carried as the string `"1"`, so
 * two writings of it are equal as values. An index that is itself a reference
 * — the `$i` of `$m[$i]` — is carried as a component, and the two writings an
 * author makes of it are two distinct objects. Comparing those as values says
 * that such an index differs from itself, so their structure is compared
 * instead.
 */
function compareIndexValues(value1: unknown, value2: unknown) {
    if (isSerializedComponent(value1) && isSerializedComponent(value2)) {
        return compareIndexComponents(value1, value2);
    }

    return value1 == value2;
}

/**
 * Compare two components appearing inside a path index.
 *
 * Each writing of an index gets its own component index and its own position,
 * so those are what to look past. What has to agree is what the index names:
 * the same component type, the same referent and path where it is a
 * reference, and the same children where it is built out of them.
 */
function compareIndexComponents(
    component1: SerializedComponent,
    component2: SerializedComponent,
): boolean {
    if (component1.componentType !== component2.componentType) {
        return false;
    }

    const extending1 = component1.extending
        ? unwrapSource(component1.extending)
        : null;
    const extending2 = component2.extending
        ? unwrapSource(component2.extending)
        : null;

    if (extending1 || extending2) {
        if (
            !extending1 ||
            !extending2 ||
            extending1.nodeIdx !== extending2.nodeIdx ||
            !comparePathsIgnorePosition(
                extending1.unresolvedPath,
                extending2.unresolvedPath,
            ) ||
            !comparePathsIgnorePosition(
                extending1.originalPath,
                extending2.originalPath,
            )
        ) {
            return false;
        }
    }

    if (component1.children.length !== component2.children.length) {
        return false;
    }

    return component1.children.every((child1, i) => {
        const child2 = component2.children[i];

        if (isSerializedComponent(child1) && isSerializedComponent(child2)) {
            return compareIndexComponents(child1, child2);
        }

        return child1 === child2;
    });
}
