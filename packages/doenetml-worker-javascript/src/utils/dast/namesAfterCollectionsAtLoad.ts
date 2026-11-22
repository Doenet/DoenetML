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
 * suggests an index (`doenet-w0199`): `$pl.x` → `$pl[1].x`, `$r.P` →
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

/** The attributes that say how many a chooser or sampler picks. */
const PICK_ATTRIBUTES = ["numToSelect", "numSamples"];

/**
 * The warnings for a name or a property after a collection among
 * `serializedComponents` (`doenet-w0199`), each reference warned about made
 * to name nothing.
 */
export function checkNamesAfterCollectionsAtLoad({
    serializedComponents,
    componentInfoObjects,
    sources,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    sources: readonly string[];
}): DiagnosticRecord[] {
    const diagnostics: DiagnosticRecord[] = [];
    const { componentsByIdx, copiesByCreatedIdx } = documentReferents({
        serializedComponents,
        componentInfoObjects,
    });
    const allClasses = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;

    // Without case, as a type written as a value is read
    // (`_createComponentOfType`); a tag is exact already (D51).
    function canonicalType(type: string | undefined) {
        return type === undefined
            ? undefined
            : componentInfoObjects.componentTypeLowerCaseMapping[
                  type.toLowerCase()
              ];
    }

    function isComposite(componentType: string) {
        return componentInfoObjects.isCompositeComponent({
            componentType,
            includeNonStandard: true,
        });
    }

    /** The attribute of `component` that says how many it picks, if any. */
    function pickAttributeName(componentType: string) {
        const componentClass = allClasses[componentType];
        if (!componentClass) {
            return undefined;
        }
        const attributes = componentClass.createAttributesObject();
        return PICK_ATTRIBUTES.find((name) => name in attributes);
    }

    /** Whether a tag of this type is a collection whatever it picks. */
    function isCollectionType(componentType: string) {
        return (
            COMPOSITE_COLLECTIONS.has(componentType) ||
            allClasses[componentType]?.listEntryComponentType !== undefined
        );
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
        if (declaresBelow(node, name)) {
            return true;
        }
        const ref = refOf(node);
        if (
            node.componentType === "_copy" &&
            ref &&
            ref.nodeIdx >= 0 &&
            !(ref.unresolvedPath?.length > 0)
        ) {
            return writtenInside(ref.nodeIdx, name, seen);
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
                !(childRef.unresolvedPath?.length > 0) &&
                writtenInside(childRef.nodeIdx, name, seen)
            ) {
                return true;
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
                    !(ref.unresolvedPath?.length > 0) &&
                    (written === undefined || !holdsContent(node))
                ) {
                    return collectionAt(ref.nodeIdx, name, seen);
                }
                return undefined;
            }
            return collectionWritten(written, node, () =>
                ref && ref.nodeIdx >= 0 && !(ref.unresolvedPath?.length > 0)
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
        return collectionWritten(node.componentType, node, () => undefined);
    }

    /**
     * The tag `componentType` written as `node`, if it is a collection: a
     * chooser picks as `node` says, or, when it doesn't say, as the one it
     * copies (`copied`), else one.
     */
    function collectionWritten(
        componentType: string,
        node: SerializedComponent,
        copied: () => string | undefined,
    ): string | undefined {
        const pickAttribute = pickAttributeName(componentType);
        if (pickAttribute) {
            const picks = attributeOf(node, pickAttribute);
            if (picks === undefined) {
                return node.componentType === "_copy" &&
                    copied() === componentType
                    ? componentType
                    : undefined;
            }
            return literalText(picks)?.trim() === "1"
                ? undefined
                : componentType;
        }
        return isCollectionType(componentType) ? componentType : undefined;
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
            return ref && ref.nodeIdx >= 0 && !(ref.unresolvedPath?.length > 0)
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

    /** The tags that show one of their branches (COMP-11). */
    function branchesOf(node: SerializedComponent) {
        if (node.componentType === "conditionalContent") {
            return (node.children ?? []).filter(
                (child): child is SerializedComponent =>
                    typeof child === "object" &&
                    (child.componentType === "case" ||
                        child.componentType === "else"),
            );
        }
        if (
            node.componentType === "select" &&
            collectionWritten("select", node, () => undefined) === undefined
        ) {
            return optionsOf(node);
        }
        return undefined;
    }

    /** The `<option>`s of the `<select>` written as `node`. */
    function optionsOf(node: SerializedComponent) {
        return (node.children ?? []).filter(
            (child): child is SerializedComponent =>
                typeof child === "object" && child.componentType === "option",
        );
    }

    /**
     * The components named `name` written below `node`, not inside a
     * `<repeat>`, a `<collect>` or a `<select>` that picks several below it,
     * whose names are reached through them. One every branch of a
     * `<conditionalContent>` or a one-pick `<select>` below it declares once
     * counts once, as the one its first branch declares (`$cc.r` of a case
     * holding a `<conditionalContent>` that holds `r`); one only some of
     * them declare, or one declares twice, counts as more than one, so that
     * it isn't followed.
     */
    function namedBelow(
        node: SerializedComponent,
        name: string,
        found: SerializedComponent[] = [],
    ) {
        for (const child of node.children ?? []) {
            if (typeof child !== "object") {
                continue;
            }
            if (nameOf(child) === name) {
                found.push(child);
                continue;
            }
            const branches = branchesOf(child);
            if (branches) {
                const one = inEveryBranch(branches, name);
                if (one) {
                    found.push(one);
                } else {
                    const named = branches.flatMap((branch) =>
                        namedBelow(branch, name),
                    );
                    if (named.length > 0) {
                        found.push(...named, child);
                    }
                }
            } else if (!NAMES_BELONG_TO_ITEMS.has(child.componentType)) {
                namedBelow(child, name, found);
            }
        }
        return found;
    }

    /**
     * The component named `name` each of `branches` declares once, as the
     * first declares it, or `undefined` when they don't each declare one.
     */
    function inEveryBranch(branches: SerializedComponent[], name: string) {
        const named = branches.map((branch) => namedBelow(branch, name));
        return named.length > 0 && named.every((n) => n.length === 1)
            ? named[0][0]
            : undefined;
    }

    /**
     * The collection a reference reaches along what the resolver left of its
     * path (`path`, after the component at `idx`), with the index of the name
     * or property after it (`at`): the component itself, or one reached
     * through a name every case or option of a `<conditionalContent>` or a
     * one-pick `<select>` declares (`$cc.r.P`, COMP-11), through an index
     * into the items of a `<repeat>` or a `<select>` (`$o[1].r.P`), or that
     * the one component of every case or option is (`$cc.x` of a case
     * holding a list), which it stands for (COLL-3). `undefined` when no
     * collection is followed by a name or property.
     */
    function collectionOnPath(
        idx: number,
        path: any[],
    ):
        | { nodeIdx: number; at: number; collection: string; index: string }
        | undefined {
        let node: SerializedComponent | undefined =
            componentsByIdx.get(idx) ?? copiesByCreatedIdx.get(idx);
        let nodeIdx = idx;
        // inside an item of `node`, a repeat or a select
        let inItem = false;
        // after an index into the branch `node` shows (`$cc[1]`)
        let inBranch = false;
        for (let at = 0; at < path.length && node; at++) {
            const part = path[at];
            const name = part?.name;
            if (typeof name !== "string") {
                return undefined;
            }
            if (name === "") {
                // an index into the branch a `<conditionalContent>` or a
                // one-pick `<select>` shows, which stands for what it holds
                // (`$cc[1].x`, as `$cc.x`)
                if (
                    !inItem &&
                    !inBranch &&
                    (part.index ?? []).length === 1 &&
                    branchesOf(node)
                ) {
                    inBranch = true;
                    continue;
                }
                // an index into the items of a repeat or a select, whose
                // names are what is written in it
                if (
                    !inItem &&
                    (part.index ?? []).length === 1 &&
                    NAMES_BELONG_TO_ITEMS.has(node.componentType) &&
                    node.componentType !== "collect"
                ) {
                    inItem = true;
                    continue;
                }
                return undefined;
            }
            if (!inItem) {
                const collection = collectionAt(nodeIdx, name);
                if (collection !== undefined && !inBranch) {
                    return { nodeIdx, at, collection, index: "[1]" };
                }
            }
            const branches = inItem ? undefined : branchesOf(node);
            let next: SerializedComponent | undefined;
            if (inItem) {
                if (node.componentType === "select") {
                    // a pick is one of its options
                    next = inEveryBranch(optionsOf(node), name);
                } else {
                    const named = namedBelow(node, name);
                    next = named.length === 1 ? named[0] : undefined;
                }
            } else if (branches && branches.length > 0) {
                const named = branches.map((branch) =>
                    namedBelow(branch, name),
                );
                if (named.every((n) => n.length === 1)) {
                    next = named[0][0];
                } else if (named.every((n) => n.length === 0)) {
                    // the one component every branch holds, standing for it
                    const ones = branches.map((branch) => {
                        const content = contentOf(branch);
                        return content.length === 1 &&
                            typeof content[0] === "object"
                            ? collectionOf(content[0], name, new Set())
                            : undefined;
                    });
                    if (
                        ones.every(
                            (one) => one !== undefined && one === ones[0],
                        )
                    ) {
                        const [one] = contentOf(
                            branches[0],
                        ) as SerializedComponent[];
                        // `$cc[1][1].x`: the branch, then an item of what it
                        // holds
                        return {
                            nodeIdx: one.componentIdx,
                            at,
                            collection: ones[0]!,
                            index: inBranch ? "[1]" : "[1][1]",
                        };
                    }
                    return undefined;
                }
            }
            if (!next) {
                return undefined;
            }
            node = next;
            nodeIdx = next.componentIdx;
            inBranch = false;
            inItem =
                (part.index ?? []).length === 1 &&
                NAMES_BELONG_TO_ITEMS.has(next.componentType) &&
                next.componentType !== "collect";
            if ((part.index ?? []).length > 0 && !inItem) {
                return undefined;
            }
        }
        return undefined;
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
        const found = collectionOnPath(ref.nodeIdx, fullPath);
        if (!found) {
            return;
        }
        const { nodeIdx, at, collection, index } = found;
        const path = fullPath.slice(at);
        const first = path[0];
        if (
            isOwnProperty(collection, first.name) ||
            (!NAMES_BELONG_TO_ITEMS.has(collection) &&
                allNames.has(first.name) &&
                writtenInside(nodeIdx, first.name))
        ) {
            return;
        }
        const reference = doenetMLReferenceAsWritten(ref.originalPath, sources);
        const args = {
            name: first.name,
            component: collection,
            kind: isItemName(nodeIdx, collection, first.name)
                ? "name"
                : "property",
            suggestion:
                withIndex(
                    { ...ref, unresolvedPath: path },
                    reference,
                    sources,
                    itemNameInOtherCase(nodeIdx, first.name),
                    index,
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
                typeChangeAtLoad: { code: "doenet-w0199", args },
            };
            return;
        }
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                // written out, as `lint:i18n` reads the code beside `code:`
                code: "doenet-w0199",
                args: { ...args, reference },
                position: component.position,
                sourceDoc: component.sourceDoc,
            }),
        );
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
        if (owner && attributeName?.toLowerCase() === "target") {
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
    return diagnostics;
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

/** An attribute of `component`, matched without regard to case. */
function attributeOf(component: SerializedComponent, name: string) {
    const lower = name.toLowerCase();
    for (const [attrName, attribute] of Object.entries(
        component.attributes ?? {},
    )) {
        if (attrName.toLowerCase() === lower) {
            return attribute;
        }
    }
    return undefined;
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
    const rest =
        corrected !== undefined && source.substring(at + 1, nameEnd) === name
            ? `.${corrected}${source.substring(nameEnd, end)}`
            : source.substring(at, end);
    return `${dollars}${source.substring(start, at)}${index}${rest}`;
}
