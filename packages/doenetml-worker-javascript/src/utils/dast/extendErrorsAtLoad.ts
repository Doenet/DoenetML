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
 * Children written inside an extend of a value or an object (`<math
 * extend="$m">+1</math>`, `<point extend="$P">(3,4)</point>`) are
 * `doenet-e0057` too, decided by the tag written alone (D71): a value or an
 * object is what it holds. A container presents what it holds, and its
 * extend may be given more (`childrenOfValueOrObjectError`).
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
    TAGS_MAKING_THEIR_CONTENT,
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

    /**
     * The error for children written inside `copy`, an extend written as
     * the tag `writtenType`, when that tag makes a value or an object (D71,
     * REF-7): a value or an object is what it holds, so an extend of it,
     * which is the same component again, can't be given more. A container
     * (content, D46: `<section>`, `<p>`, `<graph>`, …) presents what it
     * holds, and may (`isContent`); so may a `<group>` or a `<module>`, and
     * the other composites have errors of their own (`doenet-e0057`). An
     * `<m>`, `<me>` or `<men>`, whose children make one expression, counts
     * as a value (`extendTakesNoContent`, D71 decision 7). A `<label>`,
     * `<shortDescription>` or `<description>` may be written where the tag
     * takes one (its `childGroups` name it: a `<point>`'s `<label>`, an
     * input's description), which changes only how it is presented; on a
     * tag that takes none (`<number>`, `<text>`, `<math>`, a list, a
     * `<point>`'s `<shortDescription>`) it is an error as any other child
     * is (kind `presentation` when nothing else is written; user decision
     * on D71 decision 5, 2026-11-24). An `<answer>` and a
     * `<choiceInput>` say what their children would change themselves
     * (`extendChangesContentErrors`).
     */
    function childrenOfValueOrObjectError(
        copy: SerializedComponent,
        writtenType: string | undefined,
        ref: { originalPath: any[] },
        children: (SerializedComponent | string)[],
    ): ExtendErrorAtLoad | undefined {
        if (writtenType === undefined) {
            return undefined;
        }
        const componentType =
            componentInfoObjects.componentTypeAsWritten(writtenType) ??
            writtenType;
        const writtenClass = allClasses[componentType];
        if (
            !writtenClass ||
            componentType.startsWith("_") ||
            (writtenClass.isContent && !writtenClass.extendTakesNoContent) ||
            componentInfoObjects.isCompositeComponent({
                componentType,
                includeNonStandard: true,
            }) ||
            Object.hasOwn(PARTS_OF_CHOOSING_TAGS, componentType) ||
            TAGS_MAKING_THEIR_CONTENT.has(componentType) ||
            ["answer", "choiceInput"].some((base) =>
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: componentType,
                    baseComponentType: base,
                }),
            )
        ) {
            return undefined;
        }
        // A `<label>`, `<shortDescription>` or `<description>` (or a tag
        // that is one, an `<xLabel>`), and whether the written tag takes
        // it: a child group of its class names one it is (literally, not
        // through a group of any content, as an `<m>`'s, which would read it
        // as part of the expression).
        const presentationBases = ["label", "shortDescription", "description"];
        const typeOfChild = (child: SerializedComponent) =>
            child.componentType === "_copy"
                ? writtenTypeOf(child)
                : child.componentType;
        const isPresentation = (child: SerializedComponent) => {
            const type = typeOfChild(child);
            return (
                type !== undefined &&
                presentationBases.some((base) =>
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: type,
                        baseComponentType: base,
                    }),
                )
            );
        };
        const takenBases = (writtenClass.childGroups ?? [])
            .flatMap(
                (group: { componentTypes: string[] }) => group.componentTypes,
            )
            .filter((type: string) => presentationBases.includes(type));
        const takesIt = (child: SerializedComponent) =>
            takenBases.some((base: string) =>
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: typeOfChild(child) ?? "_copy",
                    baseComponentType: base,
                }),
            );
        const allowed = (child: SerializedComponent | string) =>
            typeof child === "string"
                ? child.trim() === ""
                : isPresentation(child) && takesIt(child);
        if (children.every(allowed)) {
            return undefined;
        }
        // An input's children say what it is bound to, so a new one is
        // made with `copy`, as an object is.
        const isInput = componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: "_input",
        });
        const isValue = Boolean(
            (writtenClass.isValue && !isInput) ||
            writtenClass.extendTakesNoContent ||
            writtenClass.listEntryComponentType !== undefined ||
            writtenClass.listEntryTypeAttribute !== undefined,
        );
        // A `<label>`, `<shortDescription>` or `<description>` the tag
        // takes no such child for is no more allowed in a new tag holding
        // the reference (a `<number>`, a `<text>` would read it as part of
        // what it holds) or in a `copy` (a `<point>` doesn't take a
        // `<shortDescription>`), so the form suggested leaves it out.
        const leftOut = children.filter(
            (child): child is SerializedComponent =>
                typeof child !== "string" &&
                isPresentation(child) &&
                !takesIt(child),
        );
        if (
            children.every(
                (child) =>
                    allowed(child) ||
                    (typeof child !== "string" && leftOut.includes(child)),
            )
        ) {
            // Only what the tag doesn't take is written, so there is no
            // other form to suggest: it is removed.
            const types = [...new Set(leftOut.map(typeOfChild))];
            return {
                code: "doenet-e0057",
                args: {
                    componentType,
                    kind: "presentation",
                    source: doenetMLReferenceAsWritten(
                        ref.originalPath,
                        sources,
                    ),
                    children: types.map((type) => `\`<${type}>\``).join(", "),
                    childCount: types.length,
                },
            };
        }
        const written = writtenChildrenText(copy, leftOut);
        // A `<boolean>`'s children are one expression, so what is written
        // is joined to the reference by a logical operator
        // (`<boolean>$b and false</boolean>`), not written beside it. So
        // are those of a tag that reads its children as a `<boolean>` does
        // (`<when>`, `<not>`), but not of one whose children are operands
        // (`<and>$a false</and>`, `<isNumber>`).
        const isLogic =
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType: "boolean",
            }) &&
            writtenClass.returnChildGroups ===
                allClasses.boolean.returnChildGroups;
        return {
            code: "doenet-e0057",
            args: {
                componentType,
                kind: isLogic ? "logic" : isValue ? "value" : "object",
                source: doenetMLReferenceAsWritten(ref.originalPath, sources),
                // after the reference in `<math>$m x</math>`, a space, so
                // that what is written isn't read as part of its name
                written: isLogic
                    ? written.trim()
                    : isValue && /^[A-Za-z0-9_]/.test(written)
                      ? ` ${written}`
                      : written,
            },
        };
    }

    /**
     * The children written inside `copy`, as written, without the children
     * `leftOut`, for a message to suggest them in another form, or `…` when
     * they are long, span lines, or their place in the source isn't known.
     */
    function writtenChildrenText(
        copy: SerializedComponent,
        leftOut: SerializedComponent[] = [],
    ) {
        const start = copy.childrenPosition?.start?.offset;
        const end = copy.childrenPosition?.end?.offset;
        const text = sources[copy.sourceDoc ?? 0];
        if (
            typeof start !== "number" ||
            typeof end !== "number" ||
            text === undefined
        ) {
            return "…";
        }
        let written = text.substring(start, end);
        if (written.length > 60 || written.includes("\n")) {
            return "…";
        }
        // from the last, so that the offsets of those before still hold
        const ranges = leftOut
            .map((child) => [
                child.position?.start?.offset,
                child.position?.end?.offset,
            ])
            .sort((a, b) => (b[0] ?? 0) - (a[0] ?? 0));
        for (const [from, to] of ranges) {
            if (
                typeof from !== "number" ||
                typeof to !== "number" ||
                from < start ||
                to > end
            ) {
                return "…";
            }
            written =
                written.substring(0, from - start) +
                written.substring(to - start);
        }
        return written;
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

        // Children written inside an extend of a value or an object, which
        // is what it holds (D71): decided by the tag written alone. A list
        // tag (`<mathList extend="$ml">3</mathList>`) is made a list holding
        // the extend (`forList`), beside the children written in it.
        const forList = copy.doenetAttributes?.forList;
        const list = forList === undefined ? undefined : byIdx.get(forList);
        const childrenError = list
            ? childrenOfValueOrObjectError(
                  list,
                  list.componentType,
                  ref,
                  (list.children ?? []).filter((child) => child !== copy),
              )
            : copyInChildren
              ? childrenOfValueOrObjectError(
                    copy,
                    writtenType,
                    ref,
                    copy.children ?? [],
                )
              : undefined;
        if (childrenError) {
            markErrors(copy, [childrenError]);
            if (list) {
                // the error, alone, in place of the list
                list.children = [copy];
            }
            continue;
        }
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
