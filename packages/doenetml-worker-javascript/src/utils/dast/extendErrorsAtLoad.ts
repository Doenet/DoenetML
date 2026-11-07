/**
 * The errors of an `extend` that would change what its source makes (D32,
 * `extendChangesContentErrors` in `Copy.js`), decided when the document
 * loads, from the DoenetML alone (DIAG-7, D38, #2463).
 *
 * They read only what the author wrote: the tag the extend is written as,
 * the attributes and children written on it, and the tag it extends. So they
 * are decided here, wherever the extend is: in a case not yet true, an
 * iteration not yet made, or an option not picked, the extend is made only
 * after an interaction, and an error that first appeared then would show to
 * a student, not to the author.
 *
 * What is decided is recorded on the `_copy` as
 * `doenetAttributes.extendErrorsAtLoad`, the errors (none when it may
 * change nothing), which `Copy.js` reports in place of computing them again,
 * so the error is the same one, kept once, when the extend is made. An
 * extend whose source's tag the DoenetML does not give (`$g.x` of a name
 * left for run time, written as a tag that does not make its content), or
 * that is written as a tag other than the one it extends (`<group
 * extend="$r">` of a `<repeat>`), is not marked, and is decided when it is
 * made.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import { unwrapSource } from "./convertNormalizedDast";
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { TAGS_OF_LIST_FORMS } from "../copy";
import {
    extendChangesContentErrors,
    TAGS_MAKING_THEIR_CONTENT,
    PARTS_OF_CHOOSING_TAGS,
} from "../../components/abstract/Copy";

/**
 * Decide the errors of every extend in `serializedComponents` that are
 * decided by what is written (see above), mark them on the extend, and
 * return them, to report now. Runs after the list forms are made, so a
 * source's tag is the one the extend's replacement has.
 */
export function checkExtendErrorsAtLoad({
    serializedComponents,
    componentInfoObjects,
    sources,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    sources: readonly string[];
}) {
    const byIdx = new Map<number, SerializedComponent>();
    const copiesByCreatedIdx = new Map<number, SerializedComponent>();
    const copies: SerializedComponent[] = [];
    const seen = new Set<SerializedComponent>();

    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || seen.has(component)) {
                continue;
            }
            seen.add(component);
            byIdx.set(component.componentIdx, component);
            if (component.componentType === "_copy") {
                copies.push(component);
                const createdIdx: any =
                    component.attributes?._createComponentIdx;
                if (createdIdx?.type === "primitive") {
                    copiesByCreatedIdx.set(
                        Number(createdIdx.primitive.value),
                        component,
                    );
                }
            }
            for (const attribute of Object.values(component.attributes ?? {})) {
                const attr: any = attribute;
                if (attr.type === "component" && attr.component) {
                    visit([attr.component]);
                } else if (Array.isArray(attr.children)) {
                    visit(attr.children);
                }
            }
            visit(component.children ?? []);
        }
    }
    visit(serializedComponents);

    const allClasses = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;
    const copyAttributesObj = allClasses._copy.createAttributesObject();
    const copyAttributeNames = Object.keys(copyAttributesObj);

    function canonicalType(type: string | undefined) {
        return type === undefined
            ? undefined
            : (componentInfoObjects.componentTypeLowerCaseMapping[
                  type.toLowerCase()
              ] ?? type);
    }

    function writtenTypeOf(copy: SerializedComponent) {
        const attr: any = copy.attributes?._createComponentOfType;
        return canonicalType(attr?.primitive?.value);
    }

    function refOf(copy: SerializedComponent) {
        const extending: any = copy.extending;
        return extending
            ? (unwrapSource(extending) as
                  | {
                        nodeIdx: number;
                        unresolvedPath: any[] | null;
                        originalPath: any[];
                    }
                  | undefined)
            : undefined;
    }

    /**
     * The component the extend `copy` makes its replacement from, as
     * written: the tag a reference with nothing left for run time names,
     * looked through the copies it is a reference to. `undefined` when the
     * DoenetML does not give it.
     */
    function sourceOf(
        copy: SerializedComponent,
        visiting = new Set<SerializedComponent>(),
    ): SerializedComponent | undefined {
        if (visiting.has(copy)) {
            return undefined;
        }
        visiting.add(copy);
        const ref = refOf(copy);
        if (!ref || (ref.unresolvedPath?.length ?? 0) > 0) {
            return undefined;
        }
        const node =
            byIdx.get(ref.nodeIdx) ?? copiesByCreatedIdx.get(ref.nodeIdx);
        if (!node) {
            return undefined;
        }
        if (node.componentType === "_copy") {
            // A tag it is written as gives the type, which an extend of it
            // keeps; its source is still read for what it holds (the
            // `<moduleAttributes>` of a `<module>`).
            const below = sourceOf(node, visiting);
            const writtenType = writtenTypeOf(node);
            if (writtenType && below?.componentType !== writtenType) {
                // A module's parameters are those its source declares.
                if (
                    below === undefined &&
                    (writtenType === "module" ||
                        allClasses[writtenType]?.prototype instanceof
                            allClasses.module)
                ) {
                    return undefined;
                }
                return { ...node, componentType: writtenType, children: [] };
            }
            return below;
        }
        return node;
    }

    /**
     * The attributes written on `copy` that its replacement, of type
     * `replacementType`, is given (`convertUnresolvedAttributesForComponentType`
     * in `Copy.js`): those its class declares, matched ignoring case, other
     * than the `_copy`'s own, except `asList`, and any other a class that
     * accepts any attribute (`<module>`) is given, as written.
     */
    function attributeNamesFor(
        copy: SerializedComponent,
        replacementType: string,
    ) {
        const declared = allClasses[replacementType].createAttributesObject();
        const lowerToName: Record<string, string> = Object.create(null);
        for (const name in declared) {
            lowerToName[name.toLowerCase()] = name;
        }
        const copyLowerToName: Record<string, string> = Object.create(null);
        for (const name in copyAttributesObj) {
            copyLowerToName[name.toLowerCase()] = name;
        }
        const names: string[] = [];
        for (const written of Object.keys(copy.attributes ?? {})) {
            const lower = written.toLowerCase();
            const copyName = copyLowerToName[lower];
            if (
                copyName !== undefined &&
                !copyAttributesObj[copyName].leaveRaw &&
                copyName !== "asList"
            ) {
                continue;
            }
            const name = lowerToName[lower];
            if (name !== undefined) {
                names.push(name);
            } else if (allClasses[replacementType].acceptAnyAttribute) {
                names.push(written);
            }
        }
        return names;
    }

    const diagnostics: any[] = [];

    for (const copy of copies) {
        const linkAttr: any = copy.attributes?._link;
        const link = !(
            linkAttr &&
            (linkAttr.primitive?.value === false ||
                linkAttr.children?.join?.("").trim() === "false")
        );
        if (!link) {
            continue;
        }
        const ref = refOf(copy);
        if (!ref) {
            continue;
        }
        const copyInChildrenAttr: any = copy.attributes?._copyInChildren;
        const copyInChildren = Boolean(copyInChildrenAttr);
        const writtenType = writtenTypeOf(copy);
        const source = sourceOf(copy);

        let replacementType = source?.componentType;
        if (replacementType === undefined) {
            // The tag it extends is not given by the DoenetML. Written as a
            // part of a choosing tag, it is an error whatever it extends.
            // Written as a tag that makes its content, other than a module,
            // whose parameters its source declares, or a list form, it
            // extends a tag of that type, or it is a type error
            // (`typeChangeAtLoad.ts`), so what it may change is known.
            if (
                writtenType !== undefined &&
                (Object.hasOwn(PARTS_OF_CHOOSING_TAGS, writtenType) ||
                    (copyInChildren &&
                        (writtenType === "choiceInput" ||
                            (TAGS_MAKING_THEIR_CONTENT.has(writtenType) &&
                                !["collect", "sort", "shuffle"].includes(
                                    writtenType,
                                )))))
            ) {
                replacementType = writtenType;
            } else {
                continue;
            }
        }
        if (!allClasses[replacementType]) {
            continue;
        }
        // Written as a tag other than the one it extends, an extend may be
        // made from what its source makes (a composite's replacements), or
        // be a type error, which `Copy.js` decides before any of these
        // errors; so it is left to run time. A part of a choosing tag is an
        // error whatever it extends.
        if (
            writtenType !== undefined &&
            writtenType !== replacementType &&
            TAGS_OF_LIST_FORMS[
                replacementType as keyof typeof TAGS_OF_LIST_FORMS
            ] !== writtenType &&
            !Object.hasOwn(PARTS_OF_CHOOSING_TAGS, writtenType)
        ) {
            continue;
        }

        const errors = extendChangesContentErrors({
            replacementType,
            writtenType,
            copyInChildren,
            attributeNames: copyInChildren
                ? attributeNamesFor(copy, replacementType)
                : [],
            copyAttributeNames,
            children: copy.children ?? [],
            sourceChildren: (source?.children ?? []).map(
                literalNamesOfModuleAttributes,
            ),
            source: doenetMLReferenceAsWritten(ref.originalPath, sources),
            componentInfoObjects,
        }).map((error: any) => ({
            ...error,
            position: copy.position,
            sourceDoc: copy.sourceDoc,
        }));

        copy.doenetAttributes = {
            ...copy.doenetAttributes,
            extendErrorsAtLoad: errors,
        };
        diagnostics.push(...errors);
    }

    return diagnostics;
}

/**
 * `child`, with the `name` of each attribute a `<moduleAttributes>` declares
 * given as a primitive, as `extendChangesContentErrors` reads it from a made
 * module: at load it is still the text the author wrote.
 */
function literalNamesOfModuleAttributes(
    child: SerializedComponent | string,
): SerializedComponent | string {
    if (
        typeof child !== "object" ||
        child.componentType !== "moduleAttributes"
    ) {
        return child;
    }
    return {
        ...child,
        children: (child.children ?? []).map((declared) => {
            if (typeof declared !== "object") {
                return declared;
            }
            const nameAttr: any = declared.attributes?.name;
            if (!nameAttr || nameAttr.type === "primitive") {
                return declared;
            }
            const text = Array.isArray(nameAttr.children)
                ? nameAttr.children
                      .filter((x: unknown) => typeof x === "string")
                      .join("")
                      .trim()
                : undefined;
            return {
                ...declared,
                attributes: {
                    ...declared.attributes,
                    name: { type: "primitive", primitive: { value: text } },
                },
            } as any;
        }),
    };
}
