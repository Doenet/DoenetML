/**
 * The pass that makes a `<collect>`, `<sort>` or `<shuffle>` whose entries
 * are values of one type a list component (`CollectList.js`, `SortList.js`,
 * `ShuffleList.js`) in place of the composite it otherwise is. Part of
 * Doenet/DoenetML#2161.
 *
 * A list component holds its values in one array, which a parent reads, and
 * the viewer draws, as one child per value, where the composite made a copy
 * of each value. Whether one qualifies is decided from the document, so
 * anything about it that is only known at run time keeps the composite:
 *
 * - a `<collect>` qualifies when its `componentType` names one of the types
 *   of `COLLECT_LIST_BASES` as written;
 * - a `<sort>` or `<shuffle>` qualifies when every child is a value of one
 *   of the types of `REORDERED_LIST_BASES`, or a list of them: an authored
 *   component, the text its sugar split into such components, a reference
 *   whose type the document gives, or a list component;
 * - and none is an `extend` or `copy`, or takes an attribute the list does
 *   not (`sortByProp`, or, for a `<collect>`, one it would pass on to the
 *   copies it makes, other than the display settings and `hide`).
 *
 * One of numbers, maths, texts, booleans or intervals drawn in a `<graph>`,
 * or shown in one (`drawnInGraph`), keeps the composite: the copies it makes
 * are drawn where their sources are anchored, and can be dragged there. One
 * of points or vectors is drawn and dragged entry by entry wherever it is,
 * as a `<pointList>` or `<vectorList>` is.
 *
 * It runs after sugar and before the value-reference pass, so that a
 * reference among the children of a list made here becomes a value
 * reference, as among the children of a `<numberList>`, and a reference to
 * an entry of one (`$s[2]`) reads that entry.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent, SerializedAttribute } from "./types";
import {
    convertUnresolvedAttributesForComponentType,
    unwrapSource,
} from "./convertNormalizedDast";
import { documentReferents } from "./valueReferences";
import { staticValueReferenceTarget } from "../valueReference";
import { splitBySpacesOutsideParens } from "../../components/commonsugar/lists";
import { REORDERED_LIST_BASES } from "../../components/abstract/ReorderedValueList";
import { COLLECT_LIST_BASES } from "../../components/CollectList";

/**
 * The types of entries drawn at their own coordinates and dragged entry by
 * entry, which a list form of them draws in a graph as the copies were.
 */
const GRAPHICAL_ENTRY_TYPES = new Set(["point", "vector"]);

/** The list form of each composite this pass can make a list. */
const LIST_FORMS: Record<string, string> = {
    collect: "_collectList",
    sort: "_sortList",
    shuffle: "_shuffleList",
};

/**
 * The attributes, in lowercase, that each composite can have as a list:
 * those of the list form that mean what they meant on the composite.
 */
const LIST_FORM_ATTRIBUTES: Record<string, Set<string>> = {
    collect: new Set([
        "name",
        "from",
        "componenttype",
        "maxnumber",
        "aslist",
        "hide",
        "displaydigits",
        "displaydecimals",
        "displaysmallaszero",
        "padzeros",
        "avoidscientificnotation",
    ]),
    sort: new Set([
        "name",
        "type",
        "aslist",
        "sortvectorsby",
        "sortbycomponent",
    ]),
    shuffle: new Set(["name", "type", "aslist"]),
};

/**
 * The attributes, in lowercase, that an `extend` or `copy` of each list form
 * can set: those that are the copy's own setting. One that changes what the
 * list holds (`type`, `componentType`, `from`, `maxNumber`, `sortByProp`)
 * keeps the list it copies a composite, as do any others.
 */
const COPY_MECHANICS = [
    "createcomponentoftype",
    "createcomponentidx",
    "createcomponentname",
    "copyinchildren",
    "link",
    "name",
];
const LIST_FORM_COPY_ATTRIBUTES: Record<string, Set<string>> = {
    collect: new Set([
        ...COPY_MECHANICS,
        "aslist",
        "hide",
        "displaydigits",
        "displaydecimals",
        "displaysmallaszero",
        "padzeros",
        "avoidscientificnotation",
    ]),
    sort: new Set([
        ...COPY_MECHANICS,
        "aslist",
        "sortvectorsby",
        "sortbycomponent",
    ]),
    shuffle: new Set([...COPY_MECHANICS, "aslist"]),
};

export function convertToListForms({
    serializedComponents,
    componentInfoObjects,
    nComponents,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
}): { nComponents: number } {
    const {
        componentsByIdx,
        parentByIdx,
        copiesByCreatedIdx,
        referentType,
        referentClass,
    } = documentReferents({ serializedComponents, componentInfoObjects });

    const candidates: SerializedComponent[] = [];
    const references: SerializedComponent[] = [];
    for (const component of componentsByIdx.values()) {
        if (component.componentType in LIST_FORMS) {
            candidates.push(component);
        } else if (component.componentType === "_copy" && component.extending) {
            // a reference, or an `extend` or `copy`
            references.push(component);
        }
    }
    if (candidates.length === 0) {
        return { nComponents };
    }

    /**
     * The candidate an `extend` or `copy` of one of the three composites
     * copies, following a chain of such copies (`copy="$e"` of an
     * `<sort extend="$s" name="e"/>`), or `undefined`.
     */
    function copiedCandidate(
        copy: SerializedComponent,
        seen = new Set<number>(),
    ): SerializedComponent | undefined {
        const createdType = createdCompositeType(copy);
        if (createdType === undefined || seen.has(copy.componentIdx)) {
            return undefined;
        }
        seen.add(copy.componentIdx);
        const refResolution = unwrapSource(copy.extending!);
        if (refResolution.unresolvedPath?.length) {
            return undefined;
        }
        const target = componentsByIdx.get(refResolution.nodeIdx);
        if (target !== undefined) {
            return target.componentType === createdType ? target : undefined;
        }
        const targetCopy = copiesByCreatedIdx.get(refResolution.nodeIdx);
        return targetCopy && createdCompositeType(targetCopy) === createdType
            ? copiedCandidate(targetCopy, seen)
            : undefined;
    }

    /** The composite of `LIST_FORMS` a copy makes, if one. */
    function createdCompositeType(copy: SerializedComponent) {
        const createdType = copy.attributes.createComponentOfType;
        if (createdType?.type !== "primitive") {
            return undefined;
        }
        const type = String(createdType.primitive.value).toLowerCase();
        return type in LIST_FORMS ? type : undefined;
    }

    // The `extend`s and `copy`s of each candidate, through chains of them.
    const copiesOfCandidate = new Map<number, SerializedComponent[]>();
    for (const reference of references) {
        const candidate = copiedCandidate(reference);
        if (candidate) {
            const copies = copiesOfCandidate.get(candidate.componentIdx) ?? [];
            copies.push(reference);
            copiesOfCandidate.set(candidate.componentIdx, copies);
        }
    }

    /** Whether every copy of `component` sets only what a copy can. */
    function copiesKeepTheList(component: SerializedComponent) {
        const allowed = LIST_FORM_COPY_ATTRIBUTES[component.componentType];
        return (copiesOfCandidate.get(component.componentIdx) ?? []).every(
            (copy) =>
                Object.keys(copy.attributes).every((name) =>
                    allowed.has(name.toLowerCase()),
                ),
        );
    }

    function isOfType(componentType: string, baseComponentType: string) {
        return componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType,
        });
    }

    function ancestorsOf(idx: number): number[] {
        const ancestors: number[] = [];
        let parent = parentByIdx.get(idx);
        while (parent) {
            ancestors.push(parent.componentIdx);
            parent = parentByIdx.get(parent.componentIdx);
        }
        return ancestors;
    }

    function insideGraph(idx: number) {
        return ancestorsOf(idx).some((ancestorIdx) =>
            isOfType(componentsByIdx.get(ancestorIdx)!.componentType, "graph"),
        );
    }

    /**
     * Whether the component at `idx` is drawn in a graph: it is inside one,
     * or something that shows it is. What shows it is the component, its
     * ancestors, and, through any chain of them, each `extend` or `copy` of
     * one of those, the component that copy makes and the copy's ancestors.
     * A reference to any of them from inside a graph draws it there.
     */
    function drawnInGraph(idx: number) {
        const showing = new Set([idx, ...ancestorsOf(idx)]);
        let added = true;
        while (added) {
            added = false;
            for (const reference of references) {
                if (
                    showing.has(reference.componentIdx) ||
                    !showing.has(unwrapSource(reference.extending!).nodeIdx)
                ) {
                    continue;
                }
                const createdIdx =
                    reference.attributes.createComponentIdx?.type ===
                    "primitive"
                        ? Number(
                              reference.attributes.createComponentIdx.primitive
                                  .value,
                          )
                        : undefined;
                for (const shown of [
                    reference.componentIdx,
                    ...(createdIdx === undefined ? [] : [createdIdx]),
                    ...ancestorsOf(reference.componentIdx),
                ]) {
                    showing.add(shown);
                }
                added = true;
            }
        }
        return (
            [...showing].some(
                (shownIdx) =>
                    componentsByIdx.has(shownIdx) && insideGraph(shownIdx),
            ) ||
            references.some(
                (reference) =>
                    showing.has(unwrapSource(reference.extending!).nodeIdx) &&
                    insideGraph(reference.componentIdx),
            )
        );
    }

    // The type of the entries of each candidate made a list, or `null` for
    // one that stays a composite.
    const decided = new Map<number, string | null>();
    const deciding = new Set<number>();

    /**
     * The type of the values of a component of type `componentType`, when
     * it is one of the types of `REORDERED_LIST_BASES` itself. A type that
     * inherits from one (`<interval>`, `<integer>`, `<latex>`, `<sum>`) keeps
     * the composite, whose copies keep that type (`<collect
     * componentType="interval">` of the sort, `<intervalList>$s</intervalList>`).
     */
    function valueTypeOf(componentType: string) {
        return componentType in REORDERED_LIST_BASES
            ? componentType
            : undefined;
    }

    /**
     * The type of the values a child of a `<sort>` or `<shuffle>` gives,
     * or `undefined` when the document does not say, or it is not one value
     * or a list of them.
     */
    function childValueType(
        child: SerializedComponent | string,
    ): string | null | undefined {
        if (typeof child === "string") {
            // Text the sugar did not split, beside other children, which the
            // composite reports and leaves out.
            return child.trim() === "" ? null : undefined;
        }
        if (child.componentType in LIST_FORMS) {
            return decide(child) ?? undefined;
        }
        if (child.componentType === "_copy") {
            return referenceValueType(child);
        }
        const componentClass = componentInfoObjects.allComponentClasses[
            child.componentType
        ] as any;
        if (componentClass?.listEntryComponentType !== undefined) {
            return valueTypeOf(
                componentClass.classForSerializedComponent(child)
                    .listEntryComponentType,
            );
        }
        if (
            componentInfoObjects.isCompositeComponent({
                componentType: child.componentType,
                includeNonStandard: true,
            })
        ) {
            return undefined;
        }
        return valueTypeOf(child.componentType);
    }

    /** The type of the values a reference among the children reads. */
    function referenceValueType(reference: SerializedComponent) {
        if (!reference.extending || !("Ref" in reference.extending)) {
            return undefined;
        }
        const createdType = reference.attributes.createComponentOfType;
        if (createdType !== undefined) {
            // an `extend` or `copy` that makes a component of its own
            return undefined;
        }
        const refResolution = reference.extending.Ref;
        if (refResolution.nodeIdx < 0) {
            return undefined;
        }
        const node = componentsByIdx.get(refResolution.nodeIdx);
        const wholeComponent = !refResolution.unresolvedPath?.length;
        if (node && node.componentType in LIST_FORMS) {
            const type = decide(node);
            return wholeComponent ? (type ?? undefined) : undefined;
        }
        const targetComponentType = referentType(refResolution.nodeIdx);
        if (targetComponentType === undefined) {
            return undefined;
        }
        const targetClass = referentClass(
            refResolution.nodeIdx,
            targetComponentType,
        );
        if (targetClass === undefined) {
            return undefined;
        }
        if (wholeComponent && targetClass.listEntryComponentType) {
            return valueTypeOf(targetClass.listEntryComponentType);
        }
        // a whole point or vector (`$P`), which the list takes as it is
        if (wholeComponent && GRAPHICAL_ENTRY_TYPES.has(targetComponentType)) {
            return targetComponentType;
        }
        const target = staticValueReferenceTarget({
            targetComponentType,
            targetClass,
            unresolvedPath: refResolution.unresolvedPath,
            componentInfoObjects,
        });
        return target ? valueTypeOf(target.valueComponentType) : undefined;
    }

    function hasOnlyListFormAttributes(component: SerializedComponent) {
        const allowed = LIST_FORM_ATTRIBUTES[component.componentType];
        return Object.keys(component.attributes).every(
            (name) =>
                allowed.has(name.toLowerCase()) &&
                !(
                    component.componentType !== "collect" &&
                    component.attributes[name].type === "unresolved"
                ),
        );
    }

    /**
     * The type of the entries `component`, a candidate, has as a list, or
     * `null` when it stays a composite.
     */
    function decide(component: SerializedComponent): string | null {
        const idx = component.componentIdx;
        if (decided.has(idx)) {
            return decided.get(idx)!;
        }
        if (deciding.has(idx)) {
            return null;
        }
        deciding.add(idx);
        let type: string | null = null;
        if (
            component.extending === undefined &&
            hasOnlyListFormAttributes(component) &&
            copiesKeepTheList(component)
        ) {
            type =
                component.componentType === "collect"
                    ? collectedType(component)
                    : reorderedType(component);
            if (type && !GRAPHICAL_ENTRY_TYPES.has(type) && drawnInGraph(idx)) {
                type = null;
            }
        }
        deciding.delete(idx);
        decided.set(idx, type);
        return type;
    }

    /** The type a `<collect>` collects, if it can be a list of it. */
    function collectedType(collect: SerializedComponent): string | null {
        const attribute = collect.attributes.componentType;
        if (
            attribute?.type !== "component" ||
            !attribute.component.children.every(
                (child) => typeof child === "string",
            )
        ) {
            return null;
        }
        const written = (attribute.component.children as string[])
            .join("")
            .trim()
            .toLowerCase();
        const type =
            componentInfoObjects.componentTypeLowerCaseMapping[written];
        return type in COLLECT_LIST_BASES ? type : null;
    }

    /** The type of the values a `<sort>` or `<shuffle>` reorders, if one. */
    function reorderedType(component: SerializedComponent): string | null {
        let type: string | null = null;
        for (const child of component.children) {
            const childType = childValueType(child);
            if (childType === null) {
                continue;
            }
            if (childType === undefined || (type && type !== childType)) {
                return null;
            }
            type = childType;
        }
        return type && type in REORDERED_LIST_BASES ? type : null;
    }

    for (const candidate of candidates) {
        decide(candidate);
    }

    for (const candidate of candidates) {
        const type = decided.get(candidate.componentIdx);
        if (!type) {
            continue;
        }
        const composite = candidate.componentType;
        candidate.componentType = LIST_FORMS[composite];
        const typeAttribute: SerializedAttribute = {
            type: "primitive",
            name: composite === "collect" ? "componentType" : "type",
            primitive: { type: "string", value: type },
        };
        if (composite === "collect") {
            // The display settings and `hide` it would have passed on to
            // the copies it made are its own.
            const res = convertUnresolvedAttributesForComponentType({
                attributes: {
                    ...candidate.attributes,
                    componentType: typeAttribute,
                },
                componentType: candidate.componentType,
                componentInfoObjects,
                nComponents,
            });
            candidate.attributes = res.attributes;
            nComponents = res.nComponents;
        } else {
            candidate.attributes = {
                ...withoutAttribute(candidate.attributes, "type"),
                type: typeAttribute,
            };
            candidate.children = childrenAsText(candidate.children, type);
        }
    }

    // An `extend` or `copy` of one made a list, directly or through a chain
    // of them, is a list of the same form.
    for (const [candidateIdx, copies] of copiesOfCandidate) {
        const candidate = componentsByIdx.get(candidateIdx)!;
        if (!decided.get(candidateIdx)) {
            continue;
        }
        for (const copy of copies) {
            copy.attributes.createComponentOfType = {
                ...copy.attributes.createComponentOfType,
                type: "primitive",
                primitive: { type: "string", value: candidate.componentType },
            } as SerializedAttribute;
        }
    }

    return { nComponents };
}

function withoutAttribute(
    attributes: Record<string, SerializedAttribute>,
    attributeName: string,
) {
    return Object.fromEntries(
        Object.entries(attributes).filter(
            ([name]) => name.toLowerCase() !== attributeName.toLowerCase(),
        ),
    );
}

/**
 * The children of a list form of `<sort>` or `<shuffle>` whose entries are of
 * `type`, with each component its sugar made from a piece of text
 * (`textPiece`) given back as that text, for the list to read
 * (`AuthoredValueList.parseTextPiece`), when the list reads such text
 * itself (`keepsTextPiece`).
 */
function childrenAsText(
    children: (SerializedComponent | string)[],
    type: string,
): (SerializedComponent | string)[] {
    const listClass = (REORDERED_LIST_BASES as Record<string, any>)[type];
    const result: (SerializedComponent | string)[] = [];
    for (const child of children) {
        const text =
            typeof child === "object"
                ? child.doenetAttributes?.textPiece
                : undefined;
        const piece =
            typeof text === "string" &&
            splitBySpacesOutsideParens(text).length === 1 &&
            listClass.keepsTextPiece(text)
                ? text
                : undefined;
        const item = piece ?? child;
        const last = result[result.length - 1];
        if (typeof item === "string" && typeof last === "string") {
            result[result.length - 1] = `${last} ${item}`;
        } else {
            result.push(item);
        }
    }
    return result;
}
