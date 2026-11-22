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
 * The errors found are marked on the `_copy` as
 * `doenetAttributes.extendErrorsAtLoad` (each `{ code, args }`, quoting the
 * reference as written, `$r[$n]`), which `Copy.js` reports in place of
 * computing them again, so the error is the same one, kept once, when the
 * extend is made, whatever index it is made with. Only errors are marked:
 * an extend found to change nothing is decided again when it is made, as
 * before. An extend whose source's tag the DoenetML does not give (`$g.x`
 * of a name left for run time, `$r[$n]` of a repeat whose iterations do not
 * each hold one component of the tag written), that is written as a tag
 * other than the one it extends (`<group extend="$r">` of a `<repeat>`),
 * or that the type check found in error first (`typeChangeAtLoad`), is not
 * marked, and is decided when it is made. What is not given is never
 * guessed: an extend written as a tag that makes its content may extend
 * something else, which the run time reports another error for.
 *
 * An `<award>` or a `<choice>` can only be copied (D42, `doenet-e0078`), so
 * an extend or a `copyWithState` written as one is marked here too, decided
 * by the tag written alone, whatever it is of, unless the type check found it
 * in error first or its reference names nothing, which is shown instead.
 * It is the only error a
 * `copyWithState` is marked with: what one would change of the choices it
 * carries is decided when it is made.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent } from "./types";
import { unwrapSource } from "./convertNormalizedDast";
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { codedDiagnostic } from "../diagnostics";
import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
import { TAGS_OF_LIST_FORMS } from "../copy";
import {
    extendChangesContentErrors,
    onlyCopiedErrors,
    PARTS_OF_CHOOSING_TAGS,
} from "../../components/abstract/Copy";

/**
 * The composites an extend written as the tag they hold reaches through
 * (`heldOfType`).
 */
const HOLDERS = new Set(["conditionalContent", "select", "group"]);

/** What `doenetAttributes.extendErrorsAtLoad` holds: each error found. */
export type ExtendErrorAtLoad = { code: DiagnosticCode; args: DiagnosticArgs };

/**
 * The error diagnostics of the marks `errors`, as the extend reports them
 * when it is made (`Copy.js`).
 */
function extendErrorDiagnostics(errors: ExtendErrorAtLoad[]) {
    return errors.map(({ code, args }) =>
        codedDiagnostic({ type: "error", code, args: { ...args } }),
    );
}

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

    function writtenTypeOf(copy: SerializedComponent) {
        // the tag written, matched exactly (D51)
        const attr: any = copy.attributes?._createComponentOfType;
        return attr?.primitive?.value as string | undefined;
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

    /** Whether a component of type `type` is one of type `writtenType`. */
    function isOfType(type: string | undefined, writtenType: string) {
        return (
            type === writtenType ||
            (type !== undefined &&
                TAGS_OF_LIST_FORMS[type as keyof typeof TAGS_OF_LIST_FORMS] ===
                    writtenType)
        );
    }

    /**
     * The component the extend `copy` makes its replacement from, as
     * written: the tag a reference with nothing left for run time names,
     * looked through the copies it is a reference to when each is written
     * as the tag it names, or the one component an iteration of a repeat
     * holds (`iterationSource`). `undefined` when the DoenetML does not give
     * it, which is never guessed: a copy written as a tag other than what
     * it names may be an error in its place.
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
        if (!ref) {
            return undefined;
        }
        if ((ref.unresolvedPath?.length ?? 0) > 0) {
            return iterationSource(ref, writtenTypeOf(copy));
        }
        const node =
            byIdx.get(ref.nodeIdx) ?? copiesByCreatedIdx.get(ref.nodeIdx);
        if (!node) {
            return undefined;
        }
        if (node.componentType === "_copy") {
            const below = sourceOf(node, visiting);
            const writtenType = writtenTypeOf(node);
            if (
                writtenType !== undefined &&
                !isOfType(below?.componentType, writtenType)
            ) {
                return undefined;
            }
            return below;
        }
        const writtenType = writtenTypeOf(copy);
        if (
            writtenType !== undefined &&
            !isOfType(node.componentType, writtenType) &&
            HOLDERS.has(node.componentType)
        ) {
            // An extend written as the tag a composite holds
            // (`<answer extend="$cc"/>` of a `<conditionalContent>` holding
            // an `<answer>` in every case) extends what it holds (#2606 item
            // 7), so the same errors apply.
            return heldOfType(node, writtenType, visiting);
        }
        return node;
    }

    /**
     * The one component of type `writtenType` the composite `node` holds in
     * every branch (each case of a `<conditionalContent>` with an `<else>`,
     * each option of a `<select>`, a `<group>`), the first branch's, which an
     * extend of it written as that tag extends. `undefined` when a branch
     * holds anything else, or there may be none.
     */
    function heldOfType(
        node: SerializedComponent,
        writtenType: string,
        visiting: Set<SerializedComponent>,
    ): SerializedComponent | undefined {
        const objects = (pieces: (SerializedComponent | string)[]) => {
            if (
                pieces.some(
                    (piece) => typeof piece === "string" && piece.trim() !== "",
                )
            ) {
                return undefined;
            }
            return pieces.filter(
                (piece): piece is SerializedComponent =>
                    typeof piece === "object",
            );
        };
        /** The one component of `writtenType` `pieces` hold, if so. */
        const oneOf = (
            pieces: (SerializedComponent | string)[],
        ): SerializedComponent | undefined => {
            const held = objects(pieces);
            if (held?.length !== 1) {
                return undefined;
            }
            const [only] = held;
            if (isOfType(only.componentType, writtenType)) {
                return only;
            }
            if (only.componentType === "_copy") {
                const below = sourceOf(only, visiting);
                return below && isOfType(below.componentType, writtenType)
                    ? below
                    : undefined;
            }
            return HOLDERS.has(only.componentType)
                ? heldOfType(only, writtenType, visiting)
                : undefined;
        };
        if (node.componentType === "group") {
            return oneOf(node.children ?? []);
        }
        const branches = objects(node.children ?? []);
        if (!branches || branches.length === 0) {
            return undefined;
        }
        if (node.componentType === "conditionalContent") {
            // with an `<else>` (sugar makes it a `<case>` with no
            // `condition`), one case is always shown
            const hasElse = branches.some(
                (branch) =>
                    branch.componentType === "case" &&
                    branch.attributes?.condition === undefined,
            );
            if (!hasElse) {
                return undefined;
            }
        } else if (
            node.componentType === "select" &&
            node.attributes?.numToSelect !== undefined
        ) {
            return undefined;
        }
        let first: SerializedComponent | undefined;
        for (const branch of branches) {
            const held = oneOf(branch.children ?? []);
            if (!held) {
                return undefined;
            }
            first ??= held;
        }
        return first;
    }

    /**
     * What a reference with an index into the iterations of a `<repeat>`
     * or `<repeatForSequence>` names (`$r[$n]`, `$r[1].s`), when each
     * iteration makes it from the one component of type `writtenType` its
     * template holds there: the template holding one component, or one
     * component named by the names after the index. `undefined` otherwise,
     * which is decided when the extend is made.
     */
    function iterationSource(
        ref: { nodeIdx: number; unresolvedPath: any[] | null },
        writtenType: string | undefined,
    ) {
        const path = ref.unresolvedPath ?? [];
        const repeat = byIdx.get(ref.nodeIdx);
        if (
            writtenType === undefined ||
            !repeat ||
            !["repeat", "repeatForSequence"].includes(repeat.componentType) ||
            path[0]?.name !== "" ||
            (path[0].index ?? []).length !== 1 ||
            path.slice(1).some((part) => (part.index ?? []).length > 0)
        ) {
            return undefined;
        }
        let candidates = (repeat.children ?? []).filter(
            (child): child is SerializedComponent =>
                typeof child === "object" &&
                child.componentType !== "setup" &&
                // where the repeat's value and index are named
                child.componentType !== "_repeatSetup",
        );
        if (
            (repeat.children ?? []).some(
                (child) => typeof child === "string" && child.trim() !== "",
            )
        ) {
            return undefined;
        }
        for (const part of path.slice(1)) {
            const named: SerializedComponent[] = [];
            const stack = [...candidates];
            while (stack.length > 0) {
                const component = stack.pop()!;
                const nameAttr: any = component.attributes?.name;
                const name =
                    nameAttr?.type === "primitive"
                        ? nameAttr.primitive.value
                        : nameAttr?.children?.join?.("");
                if (name === part.name) {
                    named.push(component);
                }
                for (const child of component.children ?? []) {
                    if (typeof child === "object") {
                        stack.push(child);
                    }
                }
            }
            candidates = named;
        }
        if (
            candidates.length !== 1 ||
            !isOfType(candidates[0].componentType, writtenType)
        ) {
            return undefined;
        }
        return candidates[0];
    }

    /**
     * The attributes written on `copy` that its replacement, of type
     * `replacementType`, is given (`convertUnresolvedAttributesForComponentType`
     * in `convertNormalizedDast.ts`): those its class declares, matched
     * exactly (D51), other than the `_copy`'s own, except `asList`, and any
     * other a class that accepts any attribute (`<module>`) is given, as
     * written.
     */
    function attributeNamesFor(
        copy: SerializedComponent,
        replacementType: string,
    ) {
        const declared = allClasses[replacementType].createAttributesObject();
        const names: string[] = [];
        for (const written of Object.keys(copy.attributes ?? {})) {
            if (
                Object.hasOwn(copyAttributesObj, written) &&
                !copyAttributesObj[written].leaveRaw &&
                written !== "asList"
            ) {
                continue;
            }
            if (Object.hasOwn(declared, written)) {
                names.push(written);
            } else if (allClasses[replacementType].acceptAnyAttribute) {
                names.push(written);
            }
        }
        return names;
    }

    const diagnostics: any[] = [];

    /** Mark `errors` on `copy`, and report them now. */
    function markErrors(
        copy: SerializedComponent,
        errors: ExtendErrorAtLoad[],
    ) {
        copy.doenetAttributes = {
            ...copy.doenetAttributes,
            extendErrorsAtLoad: errors,
        };
        diagnostics.push(
            ...extendErrorDiagnostics(errors).map((error) => ({
                ...error,
                position: copy.position,
                sourceDoc: copy.sourceDoc,
            })),
        );
    }

    for (const copy of copies) {
        const linkAttr: any = copy.attributes?._link;
        const link = !(
            linkAttr &&
            (linkAttr.primitive?.value === false ||
                linkAttr.children?.join?.("").trim() === "false")
        );
        const withState = Boolean(copy.attributes?._copyWithState);
        if (!link && !withState) {
            continue;
        }
        // An error found by the type check (`typeChangeAtLoad.ts`), or a
        // reference that names nothing, is what the extend shows in its
        // place, before anything it would change.
        const typeChange = copy.doenetAttributes?.typeChangeAtLoad;
        if (
            (typeChange && typeChange !== "allowed") ||
            copy.doenetAttributes?.noReferent
        ) {
            continue;
        }
        const ref = refOf(copy);
        if (!ref) {
            continue;
        }
        // An `<award>` or a `<choice>` can only be copied (D42): an extend
        // or a `copyWithState` written as one is an error, whatever it is
        // of, so it is decided by the tag written alone.
        const onlyCopied: ExtendErrorAtLoad[] = onlyCopiedErrors({
            writtenType: writtenTypeOf(copy),
            how: link ? "extend" : "copyWithState",
            source: doenetMLReferenceAsWritten(ref.originalPath, sources),
        }).map((error: any) => ({ code: error.code, args: error.args }));
        if (onlyCopied.length > 0) {
            markErrors(copy, onlyCopied);
            continue;
        }
        if (!link) {
            // What a `copyWithState` would change of the choices it carries
            // is decided when it is made (`Copy.js`).
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
            if (
                writtenType !== undefined &&
                Object.hasOwn(PARTS_OF_CHOOSING_TAGS, writtenType)
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
        // error whatever it extends, and so is an extend of one written in
        // the DoenetML (`<math extend="$o"/>` of an `<option>`), whatever
        // it is written as.
        const extendsWrittenPart =
            Object.hasOwn(PARTS_OF_CHOOSING_TAGS, replacementType) &&
            byIdx.get(ref.nodeIdx)?.componentType === replacementType;
        if (
            writtenType !== undefined &&
            writtenType !== replacementType &&
            TAGS_OF_LIST_FORMS[
                replacementType as keyof typeof TAGS_OF_LIST_FORMS
            ] !== writtenType &&
            !Object.hasOwn(PARTS_OF_CHOOSING_TAGS, writtenType) &&
            !extendsWrittenPart
        ) {
            continue;
        }

        const errors: ExtendErrorAtLoad[] = extendChangesContentErrors({
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
        }).map((error: any) => ({ code: error.code, args: error.args }));
        if (errors.length === 0) {
            // Nothing to mark: what is not an error here is decided when
            // the extend is made.
            continue;
        }

        markErrors(copy, errors);
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
