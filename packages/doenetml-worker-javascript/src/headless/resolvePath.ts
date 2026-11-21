import type {
    FlatIndex,
    FlatPathPart,
    PublicDoenetMLCore as PublicDoenetMLCoreRust,
    RefResolution,
} from "lib-doenetml-worker";
import type { HeadlessPathResolution } from "@doenet/utils";
import type Core from "../Core";
import { expandCompositeComponent } from "../core/CompositeExpander";

/**
 * Parse a reference path such as `$r[3].g.p` into the resolver's path parts.
 * The leading `$` is optional. Only literal indices are accepted: a path whose
 * index is itself a reference names a different component as the document
 * changes, so it is no key.
 *
 * Throws on anything that is not a path of that form.
 */
export function parsePath(path: string): FlatPathPart[] {
    const text = path.startsWith("$") ? path.slice(1) : path;
    const parts: FlatPathPart[] = [];
    const partPattern = /^([\w-]+)((?:\[\d+\])*)/;

    let rest = text;
    while (true) {
        const match = rest.match(partPattern);
        if (!match) {
            throw Error(
                `"${path}" is not a path: write names joined by "." with optional literal indices, such as "r[3].g.p".`,
            );
        }
        parts.push({
            type: "flatPathPart",
            name: match[1],
            index: [...match[2].matchAll(/\[(\d+)\]/g)].map(
                (indexMatch): FlatIndex => ({ value: [indexMatch[1]] }),
            ),
        });
        rest = rest.slice(match[0].length);
        if (rest === "") {
            return parts;
        }
        if (!rest.startsWith(".")) {
            throw Error(
                `"${path}" is not a path: write names joined by "." with optional literal indices, such as "r[3].g.p".`,
            );
        }
        rest = rest.slice(1);
    }
}

/**
 * Turn a root name (the resolver's HTML-id form, `r:3.g.p`) into the path an
 * author writes (`r[3].g.p`).
 */
export function rootNameToPath(rootName: string): string {
    return rootName.replace(/:(\d+)/g, "[$1]");
}

/**
 * Resolve `path` from the document root, expanding each composite the path
 * passes through, the way `resolvePathImmediatelyToNodeIdx` in
 * `@doenet/debug-hooks` does for the tests. Unlike that helper it tells a path
 * that names nothing apart from one that names more than one component, since
 * only the second means the component exists but has no stable key.
 */
export async function resolvePathFromRoot({
    path,
    rustCore,
    core,
}: {
    path: string;
    rustCore: PublicDoenetMLCoreRust;
    core: Core;
}): Promise<HeadlessPathResolution> {
    const flatPath = parsePath(path);

    let resolution: RefResolution;
    try {
        resolution = rustCore.resolve_path({ path: flatPath }, 0, false);
        while (resolution.unresolvedPath !== null) {
            const nextPart = resolution.unresolvedPath[0];
            if (nextPart.name !== "") {
                // The path stopped matching on a name, which no descendant
                // has: what is left would be a property, not a component.
                return { status: "notFound" };
            }

            const composite = core._components[resolution.nodeIdx];
            const isComposite =
                composite &&
                core.componentInfoObjects.isCompositeComponent({
                    componentType: composite.componentType,
                    includeNonStandard: true,
                });
            if (!isComposite || composite.isExpanded) {
                return { status: "notFound" };
            }

            await composite.stateValues.readyToExpandWhenResolved;
            await expandCompositeComponent({ core, component: composite });

            resolution = rustCore.resolve_path({ path: flatPath }, 0, false);
        }
    } catch (err) {
        if (isNonUniqueError(err)) {
            return { status: "notUnique" };
        }
        if (isNoReferentError(err)) {
            return { status: "notFound" };
        }
        throw err;
    }

    const component = core._components[resolution.nodeIdx];
    if (!component) {
        return { status: "notFound" };
    }
    return {
        status: "resolved",
        component: {
            componentIdx: component.componentIdx,
            componentType: component.componentType,
        },
    };
}

/** The resolver's `ResolutionError`, as it crosses the WASM boundary. */
function resolutionErrorName(err: unknown): string {
    if (typeof err === "string") {
        return err;
    }
    if (err instanceof Error) {
        return err.message;
    }
    return JSON.stringify(err) ?? "";
}

function isNonUniqueError(err: unknown) {
    return resolutionErrorName(err).includes("NonUniqueReferent");
}

function isNoReferentError(err: unknown) {
    return resolutionErrorName(err).includes("NoReferent");
}
