/**
 * What a section's number waits for, decided at load from the DoenetML
 * (#2614 item 2, DIAG-5, NAME-7).
 *
 * A section is numbered among the sections before it (`sequenceNumbering.js`).
 * A composite before it that has not expanded may make more, so the number
 * waits for it, and a composite whose expansion reads the number waited for
 * it in turn: a circular dependency that stopped the document. Two things
 * keep that from happening:
 *
 * - **A composite that can't make a section is not waited for.** When the
 *   DoenetML shows that a composite can make no sectioning component and no
 *   container a numbering passes through (a `<div>`, a `<cascade>`, a
 *   `<page>`), it is marked (`makesNoSectioning`), and the numbering passes
 *   over it (`markCompositesMakingNoSectioning`). So
 *   `<conditionalContent condition="$s.sectionNumber > 1">` whose cases hold
 *   no section, before the section `s`, loads. A composite given the type of
 *   a section (`<section extend="$x"/>`) makes exactly one, and is counted as
 *   one without being waited for.
 * - **A composite that can, and reads the number to expand, is a cycle,
 *   found at load.** A reference to the number of a section (its
 *   `sectionNumber`, `enumeration`, `title` or `titlePrefix`) reads what
 *   each composite its numbering waits for (`compositesNumberingWaitsFor`)
 *   reads to expand, not the values of what it makes, and a `<collect>`
 *   reads what it collects from to expand: edges of the graph
 *   `breakReferenceCycles` searches. So `$s.title` in a section a `<repeat>`
 *   before `s` makes is no cycle, while
 *   `<repeatForSequence to="$s.sectionNumber"><section/></repeatForSequence>`
 *   before `s` is `doenet-e0005` at the reference, and the rest renders.
 *   Of what a composite reads to expand, only what decides how many
 *   components it makes is an edge, not what chooses which case it shows
 *   (a `condition`): such a cycle can only flip a case, so it is left to
 *   the run time and the load backstop (D61 decision 1, `countEdges` in
 *   `referenceCycles.ts`).
 *
 * Both read the one mark, so what the numbering waits for when the document
 * runs is what the cycle check finds an edge to.
 */
import type { SerializedComponent } from "./types";
import type { ComponentInfoObjects } from "../componentInfoObjects";
import { serializedAttributeComponent } from "../literalAttribute";
import {
    DIVISION_SEQUENCE,
    LIST_ITEM_SEQUENCE,
    MAKES_NO_SECTIONING,
} from "../sequenceNumbering";

/**
 * The containers a numbering passes through, of either sequence: a section
 * inside one is numbered among the sections beside it.
 */
const PASS_THROUGH_TYPES = [
    ...new Set([
        ...DIVISION_SEQUENCE.passThroughComponentTypes,
        ...LIST_ITEM_SEQUENCE.passThroughComponentTypes,
    ]),
];

/**
 * The children of a composite whose own children are what it makes when it
 * is chosen: a `<case>` (and an `<else>`, which sugar makes one) of a
 * `<conditionalContent>`, and an `<option>` of a `<select>`.
 */
const BRANCH_TYPES = ["case", "else", "option"];

/**
 * The properties of a section made from its number, so that a reference to
 * one reads what its numbering waits for. Lower case.
 */
export const NUMBER_PROPERTIES = new Set([
    "sectionnumber",
    "ownnumber",
    "enumeration",
    "title",
    "titleprefix",
]);

/** The reference a `_copy` is of, if it was resolved. */
function referenceOf(copy: SerializedComponent) {
    const extending: any = copy.extending;
    if (!extending) {
        return undefined;
    }
    return (extending.Ref ??
        extending.ExtendAttribute ??
        extending.CopyAttribute ??
        extending.CopyWithStateAttribute) as
        { nodeIdx: number; unresolvedPath: any[] | null } | undefined;
}

/**
 * The helpers both halves share: whether a type is one a numbering counts or
 * passes through, and the type a reference written as a tag makes.
 */
function typeHelpers(componentInfoObjects: ComponentInfoObjects) {
    function inherits(componentType: string, base: string) {
        return componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: base,
        });
    }
    function isComposite(componentType: string) {
        return componentInfoObjects.isCompositeComponent({
            componentType,
            includeNonStandard: true,
        });
    }
    function isPassThrough(componentType: string) {
        return PASS_THROUGH_TYPES.some((base) => inherits(componentType, base));
    }
    /** A sectioning component or a container a numbering passes through. */
    function isSectioning(componentType: string) {
        return (
            inherits(componentType, "_sectioningComponent") ||
            isPassThrough(componentType)
        );
    }
    /** The type a reference written as a tag makes, if it is one. */
    function writtenType(copy: SerializedComponent) {
        const written = copy.attributes?._createComponentOfType;
        if (written?.type !== "primitive") {
            return undefined;
        }
        return componentInfoObjects.componentTypeAsWritten(
            String(written.primitive.value),
        );
    }
    return { inherits, isComposite, isPassThrough, isSectioning, writtenType };
}

/**
 * Mark `doenetAttributes.makesNoSectioning` on each composite in
 * `serializedComponents`, at any depth, that the DoenetML shows can make no
 * sectioning component and no container a numbering passes through, so that
 * a section's numbering does not wait for it (`sequenceNumbering.js`).
 *
 * A composite may make one when:
 * - it is a `<collect>`, unless its `componentType` is written as a tag
 *   that is no composite, no sectioning component and no container a
 *   numbering passes through, nor one that any of those is a kind of
 *   (`<collect componentType="p">`), as it makes only what it collects;
 * - it is a reference (`$x`, `<group extend="$x"/>`) to a sectioning
 *   component or a container a numbering passes through, or to a composite
 *   that may make one, or one not decided from the DoenetML (an index into
 *   a composite, `$r[1]`). A reference to a property of a component that
 *   is no composite (`$s.title`, `$pg.vertex2.x`) makes a value, and one
 *   that names nothing makes nothing. A reference written as
 *   a tag that is no composite makes that tag, so may make one only when the
 *   tag is one. The value of a `<repeat>` (`$v`, its `valueName`) is an item
 *   of its `for`, so may make one when an item may;
 * - any child written in it may make one: a sectioning component, a
 *   container a numbering passes through, a composite that may, or a
 *   `<case>` or `<option>` with a child that may. A `<setup>` makes nothing.
 *
 * The marks are made before the cycle check, which reads them
 * (`compositesNumberingWaitsFor`).
 */
export function markCompositesMakingNoSectioning({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}) {
    const { inherits, isComposite, isSectioning, writtenType } =
        typeHelpers(componentInfoObjects);

    const componentsByIdx = new Map<number, SerializedComponent>();
    const copiesByCreatedIdx = new Map<number, SerializedComponent>();
    const parentByIdx = new Map<number, SerializedComponent>();
    const composites: SerializedComponent[] = [];

    function gather(
        components: (SerializedComponent | string)[],
        parent?: SerializedComponent,
    ) {
        for (const component of components) {
            if (typeof component !== "object" || component === null) {
                continue;
            }
            if (componentsByIdx.has(component.componentIdx)) {
                continue;
            }
            componentsByIdx.set(component.componentIdx, component);
            if (parent) {
                parentByIdx.set(component.componentIdx, parent);
            }
            const createdIdx = component.attributes?._createComponentIdx;
            if (
                component.componentType === "_copy" &&
                createdIdx?.type === "primitive"
            ) {
                copiesByCreatedIdx.set(
                    Number(createdIdx.primitive.value),
                    component,
                );
            }
            if (isComposite(component.componentType)) {
                composites.push(component);
            }
            for (const attribute of Object.values(
                component.attributes ?? {},
            ) as any[]) {
                if (attribute?.component) {
                    gather([attribute.component]);
                }
                gather(attribute?.references ?? []);
                gather(attribute?.children ?? []);
            }
            gather(component.children ?? [], component);
        }
    }
    gather(serializedComponents);

    const mayMakeByIdx = new Map<number, boolean>();
    // being decided, so a reference that reaches itself is not followed
    // round again: it may make one, as nothing decides that it does not
    const deciding = new Set<number>();

    /** Whether the child `child`, written in a composite, may make one. */
    function childMayMake(child: SerializedComponent | string): boolean {
        if (typeof child !== "object" || child === null) {
            return false;
        }
        const componentType = child.componentType;
        if (componentType === "setup" || componentType === "_repeatSetup") {
            return false;
        }
        if (isComposite(componentType)) {
            return mayMake(child);
        }
        if (BRANCH_TYPES.includes(componentType)) {
            return (child.children ?? []).some(childMayMake);
        }
        return isSectioning(componentType);
    }

    /** Whether the reference `copy` may make one through what it is of. */
    function referenceMayMake(copy: SerializedComponent): boolean {
        if (copy.doenetAttributes?.noReferent) {
            // names nothing, so makes nothing
            return false;
        }
        if (
            copy.doenetAttributes?.typeChangeAtLoad?.code?.startsWith?.(
                "doenet-e",
            )
        ) {
            // an error, decided at load, which it shows in its place
            return false;
        }
        const reference = referenceOf(copy);
        if (!reference || reference.nodeIdx < 0) {
            return true;
        }
        const target =
            componentsByIdx.get(reference.nodeIdx) ??
            copiesByCreatedIdx.get(reference.nodeIdx);
        if (!target) {
            return true;
        }
        const targetIsComposite = isComposite(target.componentType);
        const path = reference.unresolvedPath ?? [];
        if (path.length === 0) {
            return targetIsComposite
                ? mayMake(target)
                : isSectioning(target.componentType);
        }
        if (
            !targetIsComposite &&
            path.every(
                (part: any) =>
                    typeof part?.name === "string" && part.name !== "",
            )
        ) {
            // a property (`$s.title`), an entry of one (`$pg.vertices[1]`)
            // or a property of one (`$pg.vertex2.x`): a value, as the names
            // in a path are resolved at load and what is left are
            // properties
            return false;
        }
        return true;
    }

    /**
     * Whether the value of a repeat, which `placeholder` (the `_placeholder`
     * a `<repeat>`'s `valueName` names) stands for, may make one: whether an
     * item of its `for` may. A `<repeatForSequence>`'s value is a number or
     * a letter. Where the repeat or its `for` is not found, it may.
     */
    function valueMayMake(placeholder: SerializedComponent): boolean {
        const setup = parentByIdx.get(placeholder.componentIdx);
        const repeat = setup && parentByIdx.get(setup.componentIdx);
        if (setup?.componentType !== "_repeatSetup" || repeat === undefined) {
            return true;
        }
        const repeatType =
            repeat.componentType === "_copy"
                ? writtenType(repeat)
                : repeat.componentType;
        if (repeatType === "repeatForSequence") {
            return false;
        }
        const items = repeat.attributes?.for;
        if (repeatType !== "repeat" || items === undefined) {
            return true;
        }
        if (items.type === "primitive") {
            return false;
        }
        if (items.type !== "component") {
            return true;
        }
        // the `<group>` its items are written in
        return (items.component.children ?? []).some(childMayMake);
    }

    /**
     * Whether the `<collect>` `collect` may make one: unless its
     * `componentType` is written as a tag that is no composite, no
     * sectioning component and no container a numbering passes through,
     * and that none of those is a kind of. It makes only what it collects,
     * and a component it collects is of that type.
     */
    function collectMayMake(collect: SerializedComponent): boolean {
        const written = serializedAttributeComponent(
            collect.attributes?.componentType,
        );
        if (
            !written ||
            !written.children.every((child) => typeof child === "string")
        ) {
            return true;
        }
        // a tag name, matched exactly (D62): one in another case was given
        // the tag's spelling before the document loads
        const collected = componentInfoObjects.componentTypeAsWritten(
            (written.children as string[]).join("").trim(),
        );
        if (collected === undefined) {
            return true;
        }
        return Object.keys(componentInfoObjects.allComponentClasses).some(
            (componentType) =>
                (isComposite(componentType) || isSectioning(componentType)) &&
                inherits(componentType, collected),
        );
    }

    function mayMake(composite: SerializedComponent): boolean {
        const idx = composite.componentIdx;
        const known = mayMakeByIdx.get(idx);
        if (known !== undefined) {
            return known;
        }
        if (deciding.has(idx)) {
            return true;
        }
        deciding.add(idx);
        let result: boolean;
        if (composite.componentType === "collect") {
            result = collectMayMake(composite);
        } else if (composite.componentType === "_placeholder") {
            // the value of a repeat, an item of its `for`
            result = valueMayMake(composite);
        } else if (composite.componentType === "_copy") {
            const written = writtenType(composite);
            if (written !== undefined && !isComposite(written)) {
                result = isSectioning(written);
            } else {
                // a reference written as a composite (`<group extend>`)
                // holds what is written in it too
                result =
                    referenceMayMake(composite) ||
                    (written !== undefined &&
                        (composite.children ?? []).some(childMayMake));
            }
        } else {
            result = (composite.children ?? []).some(childMayMake);
        }
        deciding.delete(idx);
        mayMakeByIdx.set(idx, result);
        return result;
    }

    for (const composite of composites) {
        if (!mayMake(composite)) {
            composite.doenetAttributes = {
                ...composite.doenetAttributes,
                [MAKES_NO_SECTIONING]: true,
            };
        }
    }
}

/**
 * The composites among `components` that a numbering of sections waits for
 * when they are before a section: each composite, unless marked as making no
 * section (`makesNoSectioning`), and each reference written as a container a
 * numbering passes through (`<div extend="$d"/>`), and those among the
 * children of each container a numbering passes through (a `<div>`) and of
 * each `<case>` and `<option>`, at any depth. Not those in a section, which
 * numbers its own children, nor a reference written as a section, which is
 * counted as one, nor a `<setup>`, which makes nothing.
 */
export function compositesWaitedForIn(
    components: (SerializedComponent | string)[],
    componentInfoObjects: ComponentInfoObjects,
): SerializedComponent[] {
    const { isComposite, isPassThrough, writtenType } =
        typeHelpers(componentInfoObjects);

    const found: SerializedComponent[] = [];

    function visit(component: SerializedComponent | string) {
        if (typeof component !== "object" || component === null) {
            return;
        }
        const componentType = component.componentType;
        if (componentType === "setup" || componentType === "_repeatSetup") {
            return;
        }
        if (componentType === "_copy") {
            const written = writtenType(component);
            if (written !== undefined && !isComposite(written)) {
                // a tag that is no composite: one section, counted, or a
                // tag the numbering passes over, or a container it passes
                // through, whose count is waited for
                if (isPassThrough(written)) {
                    found.push(component);
                }
                return;
            }
        }
        if (isComposite(componentType)) {
            if (!component.doenetAttributes?.[MAKES_NO_SECTIONING]) {
                found.push(component);
            }
            return;
        }
        if (
            isPassThrough(componentType) ||
            BRANCH_TYPES.includes(componentType)
        ) {
            for (const child of component.children ?? []) {
                visit(child);
            }
        }
    }
    components.forEach(visit);
    return found;
}

/**
 * The composites among `components` (what is written in an iteration of a
 * repeat, in the options of a `<select>` or in a composite a path names)
 * that a reference to an item of it (`$r[1]`, `$r[1].q`) waits for to
 * expand before it is copied: each composite written there, or in an
 * `<option>` or a `<case>` there, marked as making no section or not, apart
 * from one that may be shown as a list (a `<group>`, a `<repeat>`, a
 * reference), which is copied whole, and from `except`, the reference
 * itself. Not those in a component that is no composite, nor in a
 * composite, nor a `<setup>`. Found by running documents: a
 * `<conditionalContent>` in a `<group>` in the item is not waited for.
 */
export function compositesExpandedIn(
    components: (SerializedComponent | string)[],
    componentInfoObjects: ComponentInfoObjects,
    except?: SerializedComponent,
): SerializedComponent[] {
    const { isComposite } = typeHelpers(componentInfoObjects);

    const found: SerializedComponent[] = [];

    function visit(component: SerializedComponent | string) {
        if (
            typeof component !== "object" ||
            component === null ||
            component === except
        ) {
            return;
        }
        const componentType = component.componentType;
        if (componentType === "setup" || componentType === "_repeatSetup") {
            return;
        }
        if (BRANCH_TYPES.includes(componentType)) {
            (component.children ?? []).forEach(visit);
        } else if (
            isComposite(componentType) &&
            !mayBeShownAsList(componentType, componentInfoObjects)
        ) {
            found.push(component);
        }
    }
    components.forEach(visit);
    return found;
}

/**
 * Whether a composite of type `componentType` has an `asList` attribute: a
 * reference to an item that holds it copies it whole, and does not wait for
 * it to expand (`stopAtListComposites` in `Copy.js`'s `targets`).
 */
function mayBeShownAsList(
    componentType: string,
    componentInfoObjects: ComponentInfoObjects,
) {
    const componentClass =
        componentInfoObjects.allComponentClasses[componentType];
    if (!componentClass) {
        return false;
    }
    let result = shownAsListByClass.get(componentClass);
    if (result === undefined) {
        result = "asList" in (componentClass.createAttributesObject?.() ?? {});
        shownAsListByClass.set(componentClass, result);
    }
    return result;
}
const shownAsListByClass = new WeakMap<object, boolean>();

/**
 * The composites the number of the section `section` waits for, which a
 * reference to its number reads (`NUMBER_PROPERTIES`, `breakReferenceCycles`):
 * each composite written before it among the components it is numbered
 * with, unless marked as making no section (`makesNoSectioning`) or written
 * as a tag of a section, which is counted as one. That is, before it among:
 *
 * - its siblings, and the children of each container a numbering passes
 *   through among them (a `<div>`), at any depth;
 * - the siblings of its parent, when the parent is a composite, a `<case>`
 *   or an `<option>`, whose children are its parent's, or a container a
 *   numbering passes through, and so on up;
 * - the siblings of the section it is in, and so on up, as its number may
 *   include that section's (`includeParentNumber`).
 *
 * `parentOf` is the component each component is written in, as a child.
 * Both sequences are followed, as which numbers a section is decided when
 * the document runs.
 */
export function compositesNumberingWaitsFor({
    section,
    parentOf,
    componentInfoObjects,
}: {
    section: SerializedComponent;
    parentOf: Map<number, SerializedComponent>;
    componentInfoObjects: ComponentInfoObjects;
}): SerializedComponent[] {
    const { inherits, isComposite, isPassThrough } =
        typeHelpers(componentInfoObjects);

    const found: SerializedComponent[] = [];

    /** Whether the children of a component of this type are its parent's. */
    function isTransparent(componentType: string) {
        return (
            isComposite(componentType) ||
            BRANCH_TYPES.includes(componentType) ||
            isPassThrough(componentType)
        );
    }

    let node: SerializedComponent = section;
    const seen = new Set<number>();
    while (!seen.has(node.componentIdx)) {
        seen.add(node.componentIdx);
        const parent = parentOf.get(node.componentIdx);
        if (!parent) {
            break;
        }
        const siblings = parent.children ?? [];
        const position = siblings.indexOf(node);
        found.push(
            ...compositesWaitedForIn(
                position === -1 ? siblings : siblings.slice(0, position),
                componentInfoObjects,
            ),
        );
        if (isTransparent(parent.componentType)) {
            node = parent;
            continue;
        }
        // A component that numbers its children from one: the number may
        // include that of the section it is in.
        let ancestor: SerializedComponent | undefined = parent;
        while (
            ancestor &&
            !inherits(ancestor.componentType, "_sectioningComponent")
        ) {
            ancestor = parentOf.get(ancestor.componentIdx);
        }
        if (!ancestor) {
            break;
        }
        node = ancestor;
    }
    return found;
}
