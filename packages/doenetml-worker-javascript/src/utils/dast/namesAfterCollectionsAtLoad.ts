/**
 * A name or a property after a collection is the collection's own, never
 * each item's (D59, COLL-1, COLL-2; Doenet/DoenetML#2626).
 *
 * A collection is a list (`<mathList>` … `<vectorList>`), a `<sequence>`, a
 * `<collect>`, a `<sort>` or `<shuffle>`, a `<sortIndices>`, a `<repeat>` or
 * `<repeatForSequence>`, a list operator, a `<functionIterates>`, and a
 * `<select>` or other random chooser or sampler whose `numToSelect` (or
 * `numSamples`) is written as anything but a literal `1`. After one, a name
 * or a property is the collection's own: `numItems`, the settings every
 * component has (`hide`, `fixed`, `disabled`), and the properties the tag
 * declares for itself. Anything else names nothing, with a warning that
 * suggests an index (`doenet-w0200`): `$pl.x` → `$pl[1].x`, `$r.P` →
 * `$r[1].P`.
 *
 * Which a tag is comes from the tag as written, never from how many items it
 * holds as the document runs (a one-entry `<mathList>` is still a list, and
 * `numToSelect="$n"` is a collection), so this is decided here, from the
 * DoenetML, before anything runs. A `<conditionalContent>`, and a `<select>`
 * or other chooser that picks one, are not collections for this: each stands
 * for what it shows (COLL-3, COMP-11), and is left as it is. A `<group>`
 * holding one component stands for it (COLL-3), so `$g.x` of `<group
 * name="g">$r</group>` names nothing, as `$r.x` does.
 *
 * A reference written as a tag (`<point extend="$pl.x"/>`) is missing, with
 * the warning, marked as `typeChangeAtLoad` marks one (`Copy.js`); any other
 * reference (`$pl.x` as text or in an attribute, an action's
 * `target="$r.mi"`) is made into one that names nothing, a blank.
 *
 * Only what the resolver left unresolved after the collection is read, and
 * a name written inside a collection whose children are written (a list, a
 * `<sort>`, a `<shuffle>`), or inside the one it copies, is that component,
 * as after any tag: `$pl.P` of a `<point name="P">` written in it, and
 * `$pl2.P` of `<pointList name="pl2" extend="$pl"/>`, which the resolver
 * leaves for the copy to resolve. The names written inside a `<repeat>` or
 * the options of a `<select>` belong to its items, and a `<collect>` holds
 * copies of what it collects, so a name after one of these names nothing.
 *
 * Runs after sugar and before the type checks at load, which leave a
 * reference decided here as it is.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent, SerializedAttribute } from "./types";
import type { DiagnosticRecord } from "@doenet/utils";
import { documentReferents } from "./valueReferences";
import { unwrapSource } from "./convertNormalizedDast";
import { codedDiagnostic } from "../diagnostics";
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { ownPropertiesOfComposite } from "../numItems";
import { typeHasProperty } from "./typeChangeAtLoad";
import {
    nameDifferingOnlyInCase,
    propertyDifferingOnlyInCase,
} from "./nameCase";
import { sequenceEntryComponentType } from "../sequence";

/** The collections built as composites, besides a `<select>`. */
const COMPOSITE_COLLECTIONS = new Set([
    "repeat",
    "repeatForSequence",
    "collect",
    "sort",
    "shuffle",
]);

/**
 * The collections a name written inside which belongs to an item, not to
 * the collection: what a `<repeat>`'s template or a `<select>`'s option
 * declares is made once per iteration or pick, and a `<collect>` holds
 * copies of what it collects.
 */
const NAMES_BELONG_TO_ITEMS = new Set([
    "repeat",
    "repeatForSequence",
    "select",
    "collect",
]);

/**
 * What the type checks at load read of the branches of a
 * `<conditionalContent>` or a `<select>` (`typeChangeAtLoad.ts`), so that a
 * name in branches is followed by the one every-branch rule (COMP-11):
 *
 * - `containerAt`: the container the component at `idx` is (through copies),
 *   for a name after it, or, with `indexed`, after an index into its picks
 *   (a `<select>` of any number of picks);
 * - `declares`: whether every branch of `container` declares the names
 *   `names`, once, with one tag (`ok`), none does (`none`), or not
 *   (`missing`, `types`, `skip`), as `branchDeclaration` decides it;
 * - `named`: the components the names `names` name in the branches of
 *   `container`;
 * - `parts`: its cases (and `<else>`) or options.
 */
export type BranchReader = {
    containerAt(idx: number, indexed: boolean): SerializedComponent | undefined;
    declares(
        container: SerializedComponent,
        names: string[],
        indexed: boolean,
    ): string;
    named(
        container: SerializedComponent,
        names: string[],
    ): SerializedComponent[] | null;
    parts(container: SerializedComponent): SerializedComponent[] | undefined;
};

/**
 * A reference decided here to name nothing (`doenet-w0200`), with the
 * collection it follows, so that the warning is dropped if the load finds
 * either in a cycle (`doenet-e0005`, `breakReferenceCycles`): a reference to
 * a component in error reports nothing more (DIAG-5). The warning is
 * `diagnostic`, or, for a reference written as a tag, the mark on it.
 */
export type NameAfterCollection = {
    component: SerializedComponent;
    collection: SerializedComponent | undefined;
    diagnostic?: DiagnosticRecord;
};

/**
 * The warnings of `checkNamesAfterCollectionsAtLoad`, once the cycles at
 * load are found: none for a reference, or a collection it follows, that is
 * in error now (DIAG-5), whose tag form is then left to the run time, which
 * reports nothing more of a reference into an error.
 */
export function namesAfterCollectionsDiagnostics(
    found: NameAfterCollection[],
): DiagnosticRecord[] {
    const diagnostics: DiagnosticRecord[] = [];
    for (const { component, collection, diagnostic } of found) {
        if (
            component.componentType === "_error" ||
            collection?.componentType === "_error"
        ) {
            const mark: any = component.doenetAttributes?.typeChangeAtLoad;
            if (mark?.code === "doenet-w0200") {
                delete component.doenetAttributes!.typeChangeAtLoad;
            }
            continue;
        }
        if (diagnostic) {
            diagnostics.push(diagnostic);
        }
    }
    return diagnostics;
}

/** The attributes that say how many a chooser or sampler picks. */
const PICK_ATTRIBUTES = ["numToSelect", "numSamples"];

/**
 * The tag `componentType`, written as `node`, if it is a collection
 * (COLL-1): a chooser or sampler picks as `node` says, or, when a copy
 * doesn't say, as the one it copies (`copied`, the collection that is, if
 * any), else one; any other tag is a collection whatever it holds (a list,
 * a `<sequence>`, a `<repeat>`, a `<collect>`, …).
 */
export function collectionWritten(
    componentType: string,
    node: SerializedComponent,
    copied: () => string | undefined,
    componentInfoObjects: ComponentInfoObjects,
): string | undefined {
    const componentClass = (
        componentInfoObjects.allComponentClasses as Record<string, any>
    )[componentType];
    if (!componentClass) {
        return undefined;
    }
    const attributes = componentClass.createAttributesObject();
    const pickAttribute = PICK_ATTRIBUTES.find((name) => name in attributes);
    if (pickAttribute) {
        const picks = attributeOf(node, pickAttribute);
        if (picks === undefined) {
            return node.componentType === "_copy" && copied() === componentType
                ? componentType
                : undefined;
        }
        return literalText(picks)?.trim() === "1" ? undefined : componentType;
    }
    return COMPOSITE_COLLECTIONS.has(componentType) ||
        componentClass.listEntryComponentType !== undefined
        ? componentType
        : undefined;
}

/**
 * The tag of the collection `node` is written as (COLL-1), or `undefined`
 * when it is not one. Unlike a name after it (`collectionAt`), a `<group>`
 * is not looked through: a `<group>` is a group, whatever it holds, so a
 * tag made from it is made from a group (D64). A tag written with `copy` or
 * `extend` is the tag written, and a bare reference stands for what it
 * names.
 */
export function collectionTagAsWritten(
    node: SerializedComponent,
    componentAt: (idx: number) => SerializedComponent | undefined,
    componentInfoObjects: ComponentInfoObjects,
    seen: Set<number> = new Set(),
): string | undefined {
    if (seen.has(node.componentIdx)) {
        return undefined;
    }
    seen.add(node.componentIdx);
    if (node.componentType === "group") {
        return undefined;
    }
    if (node.componentType !== "_copy") {
        return collectionWritten(
            node.componentType,
            node,
            () => undefined,
            componentInfoObjects,
        );
    }
    const ref = refOf(node);
    const copied = () => {
        const target =
            ref && ref.nodeIdx >= 0 && !((ref.unresolvedPath?.length ?? 0) > 0)
                ? componentAt(ref.nodeIdx)
                : undefined;
        return target
            ? collectionTagAsWritten(
                  target,
                  componentAt,
                  componentInfoObjects,
                  seen,
              )
            : undefined;
    };
    const literal = literalText(node.attributes?._createComponentOfType);
    const written =
        literal === undefined
            ? undefined
            : componentInfoObjects.componentTypeAsWritten(literal);
    if (written === undefined) {
        // a bare reference stands for what it names
        return copied();
    }
    if (written === "group") {
        return undefined;
    }
    return collectionWritten(written, node, copied, componentInfoObjects);
}

/**
 * The warnings for a name or a property after a collection among
 * `serializedComponents` (`doenet-w0200`), each reference warned about made
 * to name nothing.
 */
export function checkNamesAfterCollectionsAtLoad({
    serializedComponents,
    componentInfoObjects,
    sources,
    branches,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    sources: readonly string[];
    /** The every-branch rule of the type checks (`typeChangeAtLoad.ts`). */
    branches?: BranchReader;
}): NameAfterCollection[] {
    const found: NameAfterCollection[] = [];
    const { componentsByIdx, copiesByCreatedIdx } = documentReferents({
        serializedComponents,
        componentInfoObjects,
    });
    const allClasses = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;

    // Matched exactly, as a tag is (NAME-0, D51), and a tag written as a
    // value (`<collect componentType>`, D62), which was given the tag's
    // spelling before the document loads if written in another case.
    function canonicalType(type: string | undefined) {
        return type === undefined
            ? undefined
            : componentInfoObjects.componentTypeAsWritten(type);
    }

    function isComposite(componentType: string) {
        return componentInfoObjects.isCompositeComponent({
            componentType,
            includeNonStandard: true,
        });
    }

    /** Each name written in the document. */
    const allNames = new Set<string>();
    for (const component of componentsByIdx.values()) {
        for (const attrName of ["name", "_createComponentName"]) {
            const name = literalText(component.attributes?.[attrName]);
            if (name !== undefined) {
                allNames.add(name);
            }
        }
    }

    /**
     * The tag of the collection the component at `idx` is, as written, or
     * `undefined` when it is not one (COLL-1). A tag written with `copy` or
     * `extend` is the tag written, a `<select>` copied without a
     * `numToSelect` of its own picks what the one it copies picks, a bare
     * reference given a name stands for what it names, and a `<group>`
     * holding one component stands for it (COLL-3).
     */
    function collectionAt(
        idx: number,
        name: string,
        seen: Set<number> = new Set(),
    ): string | undefined {
        const node = componentsByIdx.get(idx) ?? copiesByCreatedIdx.get(idx);
        return node ? collectionOf(node, name, seen) : undefined;
    }

    /**
     * Whether `name` is the name of a component written inside the
     * component at `idx`, or inside what it copies or a bare reference
     * among its children names.
     */
    function writtenInside(
        idx: number,
        name: string,
        seen: Set<number> = new Set(),
    ): boolean {
        const node = componentsByIdx.get(idx) ?? copiesByCreatedIdx.get(idx);
        if (!node || seen.has(node.componentIdx)) {
            return false;
        }
        seen.add(node.componentIdx);
        if (declaresOutsideItems(node, name)) {
            return true;
        }
        const ref = refOf(node);
        if (
            node.componentType === "_copy" &&
            ref &&
            ref.nodeIdx >= 0 &&
            !((ref.unresolvedPath?.length ?? 0) > 0)
        ) {
            return writtenInside(ref.nodeIdx, name, seen);
        }
        if (node.componentType === "group") {
            // a `<group>` holding one component stands for it (COLL-3)
            const content = contentOf(node);
            if (
                content.length === 1 &&
                typeof content[0] === "object" &&
                writtenInside(content[0].componentIdx, name, seen)
            ) {
                return true;
            }
        }
        // what a reference among its children, as the one an `extend` of a
        // list is made with, or a `<group>` holding one, names
        for (const child of node.children ?? []) {
            if (typeof child !== "object" || child.componentType !== "_copy") {
                continue;
            }
            const childRef = refOf(child);
            if (
                childRef &&
                childRef.nodeIdx >= 0 &&
                !((childRef.unresolvedPath?.length ?? 0) > 0) &&
                writtenInside(childRef.nodeIdx, name, seen)
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Whether a component written below `node` is named `name`, not counting
     * what is written in a `<repeat>`'s template or the options of a
     * `<select>` of several there, whose names belong to each of its items:
     * `P` in `<sort name="so"><repeat …><point name="P"/></repeat></sort>`
     * names one point of each iteration, so `$so.P` names nothing (#2638
     * item 2).
     */
    function declaresOutsideItems(
        node: SerializedComponent,
        name: string,
    ): boolean {
        for (const child of node.children ?? []) {
            if (typeof child !== "object") {
                continue;
            }
            if (nameOf(child) === name) {
                return true;
            }
            if (holdsItsItems(child)) {
                continue;
            }
            if (declaresOutsideItems(child, name)) {
                return true;
            }
        }
        return false;
    }

    /** Whether the names written in `node` belong to each of its items. */
    function holdsItsItems(node: SerializedComponent) {
        const type = writtenType(node);
        return (
            type !== undefined &&
            NAMES_BELONG_TO_ITEMS.has(type) &&
            collectionOf(node, "", new Set()) !== undefined
        );
    }

    /**
     * Whether `name`, after the collection `collection` written as `node`,
     * is the name of one of its items itself, rather than of a component in
     * an item: a component of the tag a `<collect>` collects
     * (`$c.A` of a collected point `A`), or one a `<repeat>` or a
     * `<select>` of several among the children of a `<sort>`, a `<shuffle>`
     * or a list makes once per iteration or pick (`$so.P`, `$pl.P`). Its index alone names it,
     * so the suggestion is `$c[1]`, not `$c[1].A`, which names nothing too
     * (DIAG-3, #2638 item 3).
     */
    function isItemItself(
        node: SerializedComponent | undefined,
        collection: string,
        name: string,
    ) {
        if (!node) {
            return false;
        }
        if (collection === "collect") {
            const collected = canonicalType(
                literalText(attributeOf(node, "componentType")),
            );
            if (collected === undefined) {
                return false;
            }
            for (const component of componentsByIdx.values()) {
                if (nameOf(component) !== name) {
                    continue;
                }
                const type = writtenType(component);
                if (
                    type !== undefined &&
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: type,
                        baseComponentType: collected,
                    })
                ) {
                    return true;
                }
            }
            return false;
        }
        if (
            collection !== "sort" &&
            collection !== "shuffle" &&
            allClasses[collection]?.listEntryComponentType === undefined
        ) {
            return false;
        }
        for (const child of node.children ?? []) {
            if (typeof child !== "object" || !holdsItsItems(child)) {
                continue;
            }
            const parts =
                writtenType(child) === "select"
                    ? (child.children ?? []).filter(
                          (option): option is SerializedComponent =>
                              typeof option === "object" &&
                              option.componentType === "option",
                      )
                    : [child];
            for (const part of parts) {
                for (const one of contentOf(part)) {
                    if (typeof one === "object" && nameOf(one) === name) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function collectionOf(
        node: SerializedComponent,
        name: string,
        seen: Set<number>,
    ): string | undefined {
        if (seen.has(node.componentIdx)) {
            return undefined;
        }
        seen.add(node.componentIdx);
        const ref = refOf(node);
        if (node.componentType === "_copy") {
            const written = canonicalType(
                literalText(node.attributes?._createComponentOfType),
            );
            if (written === undefined || written === "group") {
                // a bare reference (`$r`), or a group made from one with
                // nothing of its own, stands for what it names
                if (
                    ref &&
                    ref.nodeIdx >= 0 &&
                    !((ref.unresolvedPath?.length ?? 0) > 0) &&
                    (written === undefined || !holdsContent(node))
                ) {
                    return collectionAt(ref.nodeIdx, name, seen);
                }
                return undefined;
            }
            return collectionWrittenHere(written, node, () =>
                ref &&
                ref.nodeIdx >= 0 &&
                !((ref.unresolvedPath?.length ?? 0) > 0)
                    ? collectionAt(ref.nodeIdx, name, seen)
                    : undefined,
            );
        }
        if (node.componentType === "group") {
            const content = contentOf(node);
            if (
                content.length !== 1 ||
                typeof content[0] !== "object" ||
                // the name is the one component's, which a group of one
                // reaches by it (`$q.r[1]` of a group holding a group `r`)
                nameOf(content[0]) === name
            ) {
                return undefined;
            }
            return collectionOf(content[0], name, seen);
        }
        return collectionWrittenHere(node.componentType, node, () => undefined);
    }

    function collectionWrittenHere(
        componentType: string,
        node: SerializedComponent,
        copied: () => string | undefined,
    ): string | undefined {
        return collectionWritten(
            componentType,
            node,
            copied,
            componentInfoObjects,
        );
    }

    /**
     * Whether `name` is a property of the collection `componentType` itself
     * (COLL-2): one a collection built as a composite keeps public, with the
     * settings every component has, or a public property of a list. Matched
     * without regard to case, so that one written in another case is left
     * for the suggestion of its spelling (D51, `nameCase.ts`).
     */
    function isOwnProperty(componentType: string, name: string) {
        const lower = name.toLowerCase();
        if (isComposite(componentType)) {
            for (const own of ownPropertiesOfComposite(
                allClasses[componentType],
            )) {
                if (own.toLowerCase() === lower) {
                    return true;
                }
            }
            return false;
        }
        if (
            typeHasProperty({
                componentType,
                propName: name,
                componentInfoObjects,
            })
        ) {
            return true;
        }
        for (const own of ownPropertiesOfComposite(allClasses[componentType])) {
            if (own.toLowerCase() === lower) {
                return true;
            }
        }
        return false;
    }

    /** The tag a component written as `node` makes, if known. */
    function writtenType(node: SerializedComponent) {
        if (node.componentType === "_copy") {
            return canonicalType(
                literalText(node.attributes?._createComponentOfType),
            );
        }
        return node.componentType;
    }

    /**
     * The collection `node` stands for, written as a tag (not a copy or a
     * `<group>`), followed as `collectionAt` follows it, so that what it
     * holds can be read from what is written in it.
     */
    function writtenCollection(
        idx: number,
        seen: Set<number> = new Set(),
    ): SerializedComponent | undefined {
        const node = componentsByIdx.get(idx) ?? copiesByCreatedIdx.get(idx);
        if (!node || seen.has(node.componentIdx)) {
            return undefined;
        }
        seen.add(node.componentIdx);
        const ref = refOf(node);
        if (node.componentType === "_copy") {
            return ref &&
                ref.nodeIdx >= 0 &&
                !((ref.unresolvedPath?.length ?? 0) > 0)
                ? writtenCollection(ref.nodeIdx, seen)
                : undefined;
        }
        if (node.componentType === "group") {
            const content = contentOf(node);
            return content.length === 1 && typeof content[0] === "object"
                ? writtenCollection(content[0].componentIdx, seen)
                : undefined;
        }
        return node;
    }

    /**
     * The tags of the items of the collection written as `node`, as far as
     * the DoenetML gives them: the entries of a list, what a `<collect>`
     * collects, what is written in a `<repeat>`, an option of a `<select>`,
     * a `<sort>` or a `<shuffle>`.
     */
    function itemTypes(node: SerializedComponent): string[] {
        const componentType = node.componentType;
        if (componentType === "sequence") {
            const type = sequenceEntryComponentType(attributeOf(node, "type"));
            return type ? [type] : [];
        }
        const entryType = allClasses[componentType]?.listEntryComponentType;
        if (typeof entryType === "string") {
            return [entryType];
        }
        if (componentType === "collect") {
            const type = canonicalType(
                literalText(attributeOf(node, "componentType")),
            );
            return type ? [type] : [];
        }
        const parts =
            componentType === "select"
                ? (node.children ?? []).filter(
                      (child): child is SerializedComponent =>
                          typeof child === "object" &&
                          child.componentType === "option",
                  )
                : [node];
        const types = new Set<string>();
        for (const part of parts) {
            for (const child of part.children ?? []) {
                if (
                    typeof child !== "object" ||
                    child.componentType.startsWith("_repeat") ||
                    child.componentType === "setup"
                ) {
                    continue;
                }
                const type = writtenType(child);
                if (type) {
                    types.add(type);
                }
            }
        }
        return [...types];
    }

    /** The names written below `node`. */
    function namesBelow(node: SerializedComponent, names: Set<string>) {
        for (const child of node.children ?? []) {
            if (typeof child !== "object") {
                continue;
            }
            const name = nameOf(child);
            if (name !== undefined) {
                names.add(name);
            }
            namesBelow(child, names);
        }
        return names;
    }

    /**
     * The name or property `name`, written after a collection, as an item
     * has it when it is written in another case (D51, #2627 item 14): a
     * property of the items' tags (`X` → `x`, `X1` → `xs[1]`), or a name
     * written in the collection. `undefined` when there is none.
     */
    function itemNameInOtherCase(idx: number, name: string) {
        const node = writtenCollection(idx);
        if (!node) {
            return undefined;
        }
        if (allNames.has(name)) {
            return undefined;
        }
        return (
            nameDifferingOnlyInCase(name, namesBelow(node, new Set())) ??
            propertyDifferingOnlyInCase({
                propName: name,
                componentTypes: itemTypes(node),
                componentInfoObjects,
            })
        );
    }

    /**
     * Whether `name`, written after the collection at `idx`, is a name its
     * items have, rather than a property: one written in the collection (a
     * `<repeat>`'s template, a `<select>`'s options), or, for a `<collect>`,
     * whose items are written elsewhere, anywhere. A name written elsewhere
     * that is also a property of the items (`$pl.x` beside a `<math
     * name="x">`) is a property.
     */
    function isItemName(idx: number, collection: string, name: string) {
        if (!allNames.has(name)) {
            return false;
        }
        const node = writtenCollection(idx);
        if (collection === "collect" || !node) {
            return true;
        }
        return namesBelow(node, new Set()).has(name);
    }

    /**
     * A container standing for one item of the repeat or select of several
     * `node`, with what is written in it as its one branch, so that a name
     * after an index into its items (`$o[1].t`) is read by the every-branch
     * rule (`branches.named`), as a name in a branch is.
     */
    function itemAsBranch(node: SerializedComponent): SerializedComponent {
        return {
            componentType: "select",
            componentIdx: -2 - node.componentIdx,
            attributes: {},
            children: [
                {
                    componentType: "option",
                    componentIdx: -2 - node.componentIdx - 1e9,
                    attributes: {},
                    children: (node.children ?? []).filter(
                        (child) =>
                            typeof child === "string" ||
                            !child.componentType.startsWith("_repeat"),
                    ),
                } as SerializedComponent,
            ],
        } as SerializedComponent;
    }

    /**
     * Whether `name` is the `valueName` or `indexName` of the repeat `node`,
     * which an item has though nothing written in it declares it (`$o[1].v`).
     */
    function namedBySetup(node: SerializedComponent, name: string) {
        return (node.children ?? []).some(
            (child) =>
                typeof child === "object" &&
                child.componentType.startsWith("_repeat") &&
                (nameOf(child) === name || declaresBelow(child, name)),
        );
    }

    /** Whether an index into `node` picks one of its items (a repeat's). */
    function takesItemIndex(node: SerializedComponent | undefined) {
        return (
            node?.componentType === "repeat" ||
            node?.componentType === "repeatForSequence"
        );
    }

    /**
     * The collection the branches of `container` each stand for, through the
     * one component each holds (COLL-3), at any depth of containers held so
     * (`$cc.x` of a case holding a `<pointList>`, or holding a
     * `<conditionalContent>` whose cases each hold one), with the number of
     * containers passed through (`levels`). `undefined` when they don't all
     * stand for one, of one tag.
     */
    function branchesStandFor(
        container: SerializedComponent,
        name: string,
        seen: Set<number> = new Set(),
    ):
        | { node: SerializedComponent; collection: string; levels: number }
        | undefined {
        if (seen.has(container.componentIdx) || !branches) {
            return undefined;
        }
        seen.add(container.componentIdx);
        const parts = branches.parts(container);
        if (!parts || parts.length === 0) {
            return undefined;
        }
        let found:
            | { node: SerializedComponent; collection: string; levels: number }
            | undefined;
        for (const part of parts) {
            let content = contentOf(part);
            // through a `<group>` holding one component, as the one sugar
            // makes of what a case holds (COLL-3)
            while (
                content.length === 1 &&
                typeof content[0] === "object" &&
                content[0].componentType === "group"
            ) {
                content = contentOf(content[0]);
            }
            const [one] = content;
            if (content.length !== 1 || typeof one !== "object") {
                return undefined;
            }
            const inner = branches.containerAt(one.componentIdx, false);
            const here = inner
                ? branchesStandFor(inner, name, seen)
                : (() => {
                      const collection = collectionOf(one, name, new Set());
                      return collection === undefined
                          ? undefined
                          : { node: one, collection, levels: 0 };
                  })();
            if (
                !here ||
                (found &&
                    (found.collection !== here.collection ||
                        found.levels !== here.levels))
            ) {
                return undefined;
            }
            found ??= here;
        }
        return found && { ...found, levels: found.levels + 1 };
    }

    /**
     * The collection a reference reaches along what the resolver left of its
     * path (`path`, after the component at `idx`), with the index of the name
     * or property after it (`at`) and the index to suggest before it
     * (`index`):
     *
     * - the component itself (`$r.P`);
     * - one a name reaches through the branches of a `<conditionalContent>`
     *   or a `<select>` (one that picks one, or any after an index into its
     *   picks), read by the every-branch rule of the type checks
     *   (`branches.named`, COMP-11), one name at a time, up to the first
     *   collection: `$cc.r.P`, `$r.P` of a repeat in a case, `$s[1].t.T`. A
     *   name not every branch declares, or declared twice, is not followed
     *   (it is `doenet-w0183` or ambiguous there). One naming components of
     *   different tags, or a collection in some branches only, is left to
     *   that rule when it reports the whole reference (`doenet-w0183`,
     *   `doenet-w0184`), and is otherwise the first collection among them
     *   (`inSomeBranches`);
     * - one a name reaches after an index into the items of a repeat
     *   (`$o[1].t.T`), read the same way in what is written in it, but not
     *   its value or index (`$o[1].v`, `namedBySetup`);
     * - one every branch stands for, through the one component each holds
     *   (`$cc.x`, `$cc[1].x` of a case holding a list, COLL-3).
     *
     * `undefined` when no collection is followed by a name or property.
     */
    function collectionOnPath(
        idx: number,
        path: any[],
    ):
        | { nodeIdx: number; at: number; collection: string; index: string }
        | undefined {
        const [first] = path;
        if (typeof first?.name === "string" && first.name !== "") {
            const collection = collectionAt(idx, first.name);
            if (collection !== undefined) {
                return { nodeIdx: idx, at: 0, collection, index: "[1]" };
            }
        }
        if (!branches) {
            return undefined;
        }
        const node = componentsByIdx.get(idx) ?? copiesByCreatedIdx.get(idx);
        const indexed =
            path.length > 1 &&
            first?.name === "" &&
            (first.index ?? []).length === 1;
        let container = branches.containerAt(idx, indexed);
        // the repeat whose item `container` stands for (`itemAsBranch`)
        let itemOf: SerializedComponent | undefined;
        if (!container && indexed && node && takesItemIndex(node)) {
            container = itemAsBranch(node);
            itemOf = node;
        }
        // Two indices, the first into the items of a repeat whose item holds
        // one `<conditionalContent>` or `<select>`, the second into what
        // that shows (`$o3[1][1].x`), read as one index into that
        // container (`$cc[1].x`), so a collection every branch holds is
        // reached as it is there (#2638 item 1).
        let indexedTwice = false;
        if (
            !container &&
            path.length > 1 &&
            first?.name === "" &&
            (first.index ?? []).length === 2 &&
            node &&
            takesItemIndex(node)
        ) {
            const content = contentOf(itemAsBranch(node).children![0] as any);
            const [one] = content;
            if (content.length === 1 && typeof one === "object") {
                container = branches.containerAt(one.componentIdx, true);
                indexedTwice = container !== undefined;
            }
        }
        if (!container) {
            return undefined;
        }
        // after an index into the branch a container shows (`$cc[1]`), or
        // into the items of a repeat (`$o[1]`)
        const afterIndex = indexed || indexedTwice;
        let inBranch = afterIndex;
        let names: string[] = [];
        for (let at = afterIndex ? 1 : 0; at < path.length; at++) {
            const part = path[at];
            if (typeof part?.name !== "string" || part.name === "") {
                return undefined;
            }
            if (
                names.length === 0 &&
                itemOf &&
                namedBySetup(itemOf, part.name)
            ) {
                // the item's value or index (`$o[1].v`), not a name in it
                return undefined;
            }
            names.push(part.name);
            const declared = branches.declares(
                container,
                names,
                afterIndex && names.length === 1,
            );
            const next = path[at + 1];
            if (declared === "none") {
                if (names.length > 1) {
                    return undefined;
                }
                // no branch declares it: a property after what every branch
                // stands for
                const stood = branchesStandFor(container, part.name);
                if (!stood) {
                    return undefined;
                }
                return {
                    nodeIdx: stood.node.componentIdx,
                    at,
                    collection: stood.collection,
                    index: "[1]".repeat(stood.levels + (inBranch ? 0 : 1)),
                };
            }
            if (declared === "types") {
                // components of different tags, of which only some may be
                // collections (`r` a `<repeat>` in one case and a `<group>`
                // in another)
                return inSomeBranches(
                    container,
                    names,
                    path,
                    at,
                    afterIndex && names.length === 1,
                );
            }
            if (declared !== "ok") {
                // a branch lacks it (`doenet-w0183`), or they declare it
                // twice, as decided by the checks after this
                return undefined;
            }
            const named = branches.named(container, names) ?? [];
            if (named.length === 0) {
                return undefined;
            }
            inBranch = false;
            const index = part.index ?? [];
            if (index.length > 0) {
                // an index into one item of each (`$cc.r[1].q.Q`), read in
                // what is written in it
                if (
                    index.length === 1 &&
                    typeof next?.name === "string" &&
                    next.name !== "" &&
                    named.length === 1 &&
                    takesItemIndex(named[0])
                ) {
                    container = itemAsBranch(named[0]);
                    itemOf = named[0];
                    inBranch = true;
                    names = [];
                    continue;
                }
                return undefined;
            }
            if (typeof next?.name !== "string" || next.name === "") {
                return undefined;
            }
            const collections = named.map((component) =>
                collectionOf(component, next.name, new Set()),
            );
            if (
                collections.every(
                    (collection) =>
                        collection !== undefined &&
                        collection === collections[0],
                )
            ) {
                return {
                    nodeIdx: named[0].componentIdx,
                    at: at + 1,
                    collection: collections[0]!,
                    index: "[1]",
                };
            }
            if (collections.some((collection) => collection !== undefined)) {
                // a collection in some branches only (a `<select>` that
                // picks several in one case and one in another)
                return inSomeBranches(
                    container,
                    names,
                    path,
                    at,
                    afterIndex && names.length === 1,
                );
            }
            itemOf = undefined;
        }
        return undefined;
    }

    /**
     * For the names `names` (up to `path[at]`), which name components of
     * which only some are collections in the branches of `container`, or
     * components of different tags: the first collection among them, so
     * that what follows it names nothing (D59), unless the every-branch rule
     * reports the reference already (`doenet-w0183`, `doenet-w0184`), as it
     * does when what the whole path names differs between branches. Without
     * this, such a reference would read a pick's items while one branch is
     * active and the component in another, with no warning.
     */
    function inSomeBranches(
        container: SerializedComponent,
        names: string[],
        path: any[],
        at: number,
        /** for a name after an index into picks (`branches.declares`) */
        indexed: boolean,
    ):
        | { nodeIdx: number; at: number; collection: string; index: string }
        | undefined {
        const next = path[at + 1];
        if (
            !branches ||
            (path[at].index ?? []).length > 0 ||
            typeof next?.name !== "string" ||
            next.name === ""
        ) {
            return undefined;
        }
        // the names of the whole path, up to an index
        const whole = [...names];
        for (const part of path.slice(at + 1)) {
            if (typeof part?.name !== "string" || part.name === "") {
                break;
            }
            whole.push(part.name);
            if ((part.index ?? []).length > 0) {
                break;
            }
        }
        if (branches.declares(container, whole, indexed) !== "ok") {
            return undefined;
        }
        for (const component of branches.named(container, names) ?? []) {
            const collection = collectionOf(component, next.name, new Set());
            if (collection !== undefined) {
                return {
                    nodeIdx: component.componentIdx,
                    at: at + 1,
                    collection,
                    index: "[1]",
                };
            }
        }
        return undefined;
    }

    /**
     * For a name written inside a collection, after a `<group>` or a bare
     * reference that stands for the collection (COLL-3), the reference made
     * as if written after the collection, which names that component as it
     * does there (D59 decision 8, #2638 item 5): `$g.P` of `<group
     * name="g">$pl</group>` with `<point name="P">` written in `pl` is `P`,
     * as `$pl.P` is, rather than a blank. The resolver can't reach it, as
     * `P` is not written in `g`. Left as it is when the name is not written
     * once there.
     */
    function standInAsWritten(
        component: SerializedComponent,
        ref: { nodeIdx: number; unresolvedPath: any[] | null },
        name: string,
    ) {
        let idx = ref.nodeIdx;
        const seen = new Set<number>();
        for (;;) {
            const node =
                componentsByIdx.get(idx) ?? copiesByCreatedIdx.get(idx);
            if (!node || seen.has(idx)) {
                return;
            }
            seen.add(idx);
            const nodeRef = refOf(node);
            const bare =
                node.componentType === "_copy" &&
                (writtenType(node) === undefined ||
                    (writtenType(node) === "group" && !holdsContent(node)));
            if (bare) {
                if (
                    !nodeRef ||
                    nodeRef.nodeIdx < 0 ||
                    (nodeRef.unresolvedPath?.length ?? 0) > 0
                ) {
                    return;
                }
                idx = nodeRef.nodeIdx;
                continue;
            }
            if (node.componentType === "group") {
                const content = contentOf(node);
                if (content.length !== 1 || typeof content[0] !== "object") {
                    return;
                }
                idx = content[0].componentIdx;
                continue;
            }
            const named = namedBelow(node, name, []);
            let target: number;
            let rest: any[];
            if (named.length === 1) {
                target = named[0].componentIdx;
                rest = (ref.unresolvedPath ?? []).slice(1);
                if ((ref.unresolvedPath?.[0]?.index ?? []).length > 0) {
                    return;
                }
            } else if (named.length === 0 && idx !== ref.nodeIdx) {
                // written in what it copies (`<pointList extend="$pl"/>`),
                // which the copy resolves, as for `$pl2.P`
                target = idx;
                rest = ref.unresolvedPath ?? [];
            } else {
                return;
            }
            if (target === ref.nodeIdx) {
                return;
            }
            const originalPath: any[] = (ref as any).originalPath ?? [];
            const extending: any = component.extending;
            const key = Object.keys(extending)[0];
            component.extending = {
                [key]: {
                    ...(ref as any),
                    nodeIdx: target,
                    unresolvedPath: rest.length > 0 ? rest : null,
                    nodesInResolvedPath: [
                        ...((ref as any).nodesInResolvedPath ?? []),
                        target,
                    ],
                    // what the run time resolves the rest of the path from
                    // (`refResolutionDependencies.ts`), which would
                    // otherwise look for `P` in `g`
                    standIn: {
                        origin: idx,
                        from:
                            originalPath.length -
                            (ref.unresolvedPath?.length ?? 0),
                    },
                },
            } as any;
            return;
        }
    }

    /**
     * The components written below `node` named `name`, not counting what is
     * written in the items of a repeat or a select of several there.
     */
    function namedBelow(
        node: SerializedComponent,
        name: string,
        found: SerializedComponent[],
    ) {
        for (const child of node.children ?? []) {
            if (typeof child !== "object") {
                continue;
            }
            if (nameOf(child) === name) {
                found.push(child);
            }
            if (!holdsItsItems(child)) {
                namedBelow(child, name, found);
            }
        }
        return found;
    }

    /** Check the reference `component`, a `_copy` or a target. */
    function check(
        component: SerializedComponent,
        {
            inReferences,
            owner,
            attributeName,
        }: {
            inReferences: boolean;
            owner?: SerializedComponent;
            attributeName?: string;
        },
    ) {
        const ref = refOf(component);
        if (!ref || ref.nodeIdx < 0) {
            return;
        }
        const fullPath: any[] = ref.unresolvedPath ?? [];
        const onPath = collectionOnPath(ref.nodeIdx, fullPath);
        if (!onPath) {
            return;
        }
        const { nodeIdx, at, collection, index } = onPath;
        const collectionNode =
            componentsByIdx.get(nodeIdx) ?? copiesByCreatedIdx.get(nodeIdx);
        const path = fullPath.slice(at);
        const first = path[0];
        if (isOwnProperty(collection, first.name)) {
            return;
        }
        if (
            !NAMES_BELONG_TO_ITEMS.has(collection) &&
            allNames.has(first.name) &&
            writtenInside(nodeIdx, first.name)
        ) {
            if (at === 0) {
                // through a `<group>` or a reference standing for the
                // collection (`$g.P` of `<group name="g">$pl</group>`)
                standInAsWritten(component, ref, first.name);
            }
            return;
        }
        const reference = doenetMLReferenceAsWritten(ref.originalPath, sources);
        const itemItself = isItemItself(
            writtenCollection(nodeIdx),
            collection,
            first.name,
        );
        const args = {
            name: first.name,
            component: collection,
            kind: itemItself
                ? "item"
                : isItemName(nodeIdx, collection, first.name)
                  ? "name"
                  : "property",
            suggestion:
                withIndex(
                    { ...ref, unresolvedPath: path },
                    reference,
                    sources,
                    itemItself
                        ? undefined
                        : itemNameInOtherCase(nodeIdx, first.name),
                    index,
                    itemItself,
                ) ?? reference,
        };
        const isTag =
            !inReferences &&
            (component.doenetAttributes?.forList !== undefined ||
                canonicalType(
                    literalText(component.attributes?._createComponentOfType),
                ) !== undefined);
        if (isTag) {
            // missing, with the warning, reported with the other decisions
            // made of a tag at load (`reportTypeChangesAtLoad`) and where the
            // copy is made (`Copy.js`)
            component.doenetAttributes = {
                ...component.doenetAttributes,
                typeChangeAtLoad: { code: "doenet-w0200", args },
            };
            found.push({ component, collection: collectionNode });
            return;
        }
        found.push({
            component,
            collection: collectionNode,
            diagnostic: codedDiagnostic({
                type: "warning",
                // written out, as `lint:i18n` reads the code beside `code:`
                code: "doenet-w0200",
                args: { ...args, reference },
                position: component.position,
                sourceDoc: component.sourceDoc,
            }),
        });
        // a blank, as a reference that names nothing is (D37, `Copy.js`)
        const extending: any = component.extending;
        const key = Object.keys(extending)[0];
        component.extending = {
            [key]: {
                ...ref,
                nodeIdx: -1,
                unresolvedPath: null,
                nodesInResolvedPath: [],
            },
        } as any;
        component.doenetAttributes = {
            ...component.doenetAttributes,
            noReferent: true,
        };
        if (owner && attributeName === "target") {
            // an action's target, which would report again that it has none
            // (`doenet-w0043`) when the action acts
            owner.doenetAttributes = {
                ...owner.doenetAttributes,
                targetNamesNothingAtLoad: true,
            };
        }
    }

    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object") {
                continue;
            }
            if (component.componentType === "_copy") {
                check(component, { inReferences: false });
            }
            for (const [attributeName, attribute] of Object.entries(
                component.attributes ?? {},
            )) {
                const attr: any = attribute;
                if (attr.type === "component" && attr.component) {
                    visit([attr.component]);
                } else if (attr.type === "references") {
                    for (const reference of attr.references ?? []) {
                        if (reference?.extending) {
                            check(reference, {
                                inReferences: true,
                                owner: component,
                                attributeName,
                            });
                        }
                        visit(reference?.children ?? []);
                    }
                } else if (Array.isArray(attr.children)) {
                    visit(attr.children);
                }
            }
            for (const part of refOf(component)?.originalPath ?? []) {
                for (const piece of part.index ?? []) {
                    visit(piece.value ?? []);
                }
            }
            visit(component.children ?? []);
        }
    }

    visit(serializedComponents);
    return found;
}

/** The reference a `_copy`, or a reference in an attribute, is of. */
function refOf(component: SerializedComponent) {
    const extending: any = component.extending;
    if (!extending) {
        return undefined;
    }
    return unwrapSource(extending) as
        | {
              nodeIdx: number;
              unresolvedPath: any[] | null;
              originalPath: any[];
          }
        | undefined;
}

/** The text an attribute is written as, if it is only text. */
function literalText(attribute: SerializedAttribute | undefined) {
    if (attribute === undefined) {
        return undefined;
    }
    const attr: any = attribute;
    if (attr.type === "primitive") {
        return String(attr.primitive.value);
    }
    const children =
        attr.type === "component"
            ? attr.component?.children
            : attr.type === "unresolved"
              ? attr.children
              : undefined;
    if (
        Array.isArray(children) &&
        children.every((child: unknown) => typeof child === "string")
    ) {
        return children.join("").trim();
    }
    return undefined;
}

/**
 * An attribute of `component`, matched exactly (NAME-0, D51): one written
 * in another case was given the component's spelling before the document
 * loads (`doenet-w0197`), or is an attribute the component doesn't have.
 */
function attributeOf(component: SerializedComponent, name: string) {
    const attributes = component.attributes ?? {};
    return Object.hasOwn(attributes, name) ? attributes[name] : undefined;
}

/**
 * What a `<group>` holds, as an author counts it (COLL-3): not blank text,
 * nor a `<setup>`.
 */
function contentOf(group: SerializedComponent) {
    return (group.children ?? []).filter((child) =>
        typeof child === "string"
            ? child.trim() !== ""
            : child.componentType !== "setup",
    );
}

/**
 * The name `node` is written with: its `name`, or, for a tag written with
 * `extend` or `copy`, the name the copy gives what it makes.
 */
function nameOf(node: SerializedComponent) {
    return (
        literalText(node.attributes?.name) ??
        literalText(node.attributes?._createComponentName)
    );
}

/** Whether a component written below `node` is named `name`. */
function declaresBelow(node: SerializedComponent, name: string): boolean {
    for (const child of node.children ?? []) {
        if (typeof child !== "object") {
            continue;
        }
        if (nameOf(child) === name) {
            return true;
        }
        if (declaresBelow(child, name)) {
            return true;
        }
    }
    return false;
}

/** Whether a tag written with `copy` or `extend` holds content of its own. */
function holdsContent(copy: SerializedComponent) {
    return contentOf(copy).length > 0;
}

/**
 * The reference as written (`reference`) with `[1]` put after the collection
 * it names, before the name or property that follows it (`$pl.x` →
 * `$pl[1].x`), and that name as `corrected` when given (`$r.X` →
 * `$r[1].x`), or `undefined` when where that goes isn't known.
 */
function withIndex(
    ref: { unresolvedPath: any[] | null; originalPath: any[] },
    reference: string,
    sources: readonly string[],
    corrected?: string,
    index = "[1]",
    /** the name is an item itself, which the index names (`$c.A` → `$c[1]`) */
    dropName = false,
) {
    const path: any[] = ref.unresolvedPath ?? [];
    const original: any[] = ref.originalPath ?? [];
    const start = original[0]?.position?.start?.offset;
    const end = original[original.length - 1]?.position?.end?.offset;
    const source = sources[original[0]?.sourceDoc ?? 0];
    // before the `.` of the name
    const at = path[0]?.position?.start?.offset - 1;
    if (
        source === undefined ||
        typeof start !== "number" ||
        typeof end !== "number" ||
        typeof at !== "number" ||
        Number.isNaN(at) ||
        at <= start ||
        at > end ||
        source[at] !== "."
    ) {
        return undefined;
    }
    const written = source.substring(start, end);
    const writtenAt = reference.indexOf(written);
    if (writtenAt < 0) {
        return undefined;
    }
    const dollars = reference.slice(0, writtenAt);
    // The name as an item has it, in place of the one written in another
    // case (`$r.X` → `$r[1].x`), when it is written there as it is named.
    const name = path[0].name;
    const nameEnd = at + 1 + name.length;
    const writtenAsNamed = source.substring(at + 1, nameEnd) === name;
    if (dropName && !writtenAsNamed) {
        return undefined;
    }
    const rest = dropName
        ? source.substring(nameEnd, end)
        : corrected !== undefined && writtenAsNamed
          ? `.${corrected}${source.substring(nameEnd, end)}`
          : source.substring(at, end);
    return `${dollars}${source.substring(start, at)}${index}${rest}`;
}
