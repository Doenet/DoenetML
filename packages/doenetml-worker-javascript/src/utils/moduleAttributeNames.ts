import { attributeNameCaseCorrections } from "@doenet/parser/attribute-name-case";

/**
 * Which of the module attributes a `<module>`'s `<moduleAttributes>`
 * declares (`declared`, the `name`s of its children) each attribute written
 * on a `<module>` (`written`) sets.
 *
 * Names are matched exactly (NAME-0, D51): `<module copy="$m" a="5"/>` sets
 * a declared `a`. For one release, as for every other attribute, one written
 * in another case (`A="5"`) still sets it, by the rule the parser and the
 * core apply to a component's own attributes
 * (`@doenet/parser/attribute-name-case`): it is the only declared name it
 * differs from only in case, and that name is not written too. Each of those
 * is in `corrections`, for `doenet-w0197`, which `<moduleAttributes>` reports.
 *
 * `writtenFor` maps each declared name that is set to the attribute written
 * for it.
 */
export function moduleAttributesWritten({
    written,
    declared,
}: {
    written: string[];
    declared: Iterable<string>;
}): {
    writtenFor: Map<string, string>;
    corrections: { written: string; corrected: string }[];
} {
    const declaredSet = new Set(declared);
    const corrections = attributeNameCaseCorrections({
        written,
        known: declaredSet,
    });
    const writtenFor = new Map<string, string>();
    for (const name of written) {
        if (declaredSet.has(name)) {
            writtenFor.set(name, name);
        }
    }
    for (const { written, corrected } of corrections) {
        writtenFor.set(corrected, written);
    }
    return { writtenFor, corrections };
}

/**
 * The names the `<moduleAttributes>` among `children` (the children of a
 * `<module>`, serialized) declare.
 */
export function declaredModuleAttributeNames(children: any[]): string[] {
    return (children ?? [])
        .filter((child) => child?.componentType === "moduleAttributes")
        .flatMap((child) => child.children ?? [])
        .map((child) => child?.attributes?.name?.primitive?.value)
        .filter((name): name is string => typeof name === "string" && !!name);
}
