/**
 * The pass that makes a bare reference in a value position a value reference
 * (`_ref`) that resolves its own reference, in place of the `_copy` composite
 * `convertRefsToCopies` made for it. Part of Doenet/DoenetML#2128.
 *
 * It runs on the serialized document after sugar, so that the parent it sees
 * for each reference is the one the reference will have: `<number>$n+1</number>`
 * holds its `$n` in the `<math>` that sugar made. A `_copy` stays where
 * anything about the reference is only known once it resolves at run time;
 * `Copy.js` then plans a value reference from the component it resolved to.
 */
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { SerializedComponent, SerializedRefResolution } from "./types";
import { comparePathsIgnorePosition } from "./path";
import {
    convertUnresolvedAttributesForComponentType,
    unwrapSource,
} from "./convertNormalizedDast";
import {
    copiesReferent,
    planListEntryAdapterReference,
    planReferentAdapterReference,
    planValueReference,
    RESPONSE_MARKS,
    staticValueReferenceTarget,
} from "../valueReference";
import { sequenceEntryComponentType } from "../sequence";

/**
 * Turn, in place, every `_copy` that can be a value reference into a `_ref`.
 *
 * A `_copy` qualifies when it is a bare reference (`$…`, or an `extend` with
 * nothing else on it that names the type the reference reads and does not
 * read an entry of a list; not `copy`) whose referent resolved, with no
 * attributes but the marks by which
 * an answer records it as a response (`RESPONSE_MARKS`), the component it
 * sits in is not a composite (one that renders its children then draws the
 * reference, `parentDrawsValueReferences`), what it reads is one value of a
 * type known from the document
 * (`staticValueReferenceTarget`; this includes one entry of a list whose
 * class fixes the type of its entries, `$l[$i]` of a `<numberList>`), and
 * the parent takes that type in a child group (`planValueReference`). The
 * `_ref` keeps the `_copy`'s index, position, `extending` and response
 * marks, so the resolver, the state ids and the diagnostics about the
 * reference are unchanged, and an answer that records it as a response
 * records the referenced value as it is on the referent
 * (`valueAsResponse` in `ValueRef.js`).
 *
 * A bare reference written between the brackets of another reference's path
 * (`$i` of `$l[$i]`) has no parent's child groups to match. It qualifies when
 * what it reads is a number: the reference it sits in reads the index from it
 * directly, where it would otherwise read the `integer` a copy made.
 *
 * The referent's type is read from the document: the component under the
 * resolution's `nodeIdx`, the type an `extend` or `copy` will make for the
 * component it names (`createComponentIdx`), or, for the placeholder a
 * `<repeatForSequence>` makes for its `valueName`, the repeat's `type`.
 *
 * A repeat's value and index (`$v` and `$i` in its template) are planned
 * both ways: reading the component each iteration makes for them, and
 * reading the iteration's entry of a list the repeat holds once
 * (`_repeatValues`, `_repeatIndices`). When every reference to one of them
 * qualifies as an entry of the list, and no path names it past its first
 * part, as one that reaches it from outside its iterations does (`$r[2].i`,
 * or `$g.i` for a `<group extend="$r[2]" name="g"/>`), the component the
 * sugar made for it (a `_placeholder` or an `integer`) becomes that list,
 * and the iterations make no component for it (`RepeatIterationLists.js`).
 * Otherwise each reference is planned as it was.
 *
 * A reference that an enclosing component names in one of its reference
 * attributes stays a `_copy`, as `<math referencesAreFunctionSymbols="$f">`
 * reads which of its children came from `$f` off the range of a composite's
 * replacements. The exception is `<award referencesAreResponses="$val">`.
 * When the award is built it gives each reference to `$val` among its
 * descendants an unresolved `isResponse` (`Award.js`), which a copy resolves
 * for its replacement and a `_ref` does not read; a `_ref` made from one is
 * given the mark here, as a primitive.
 */
export function convertCopiesToValueReferences({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}) {
    const { componentsByIdx, parentByIdx, referentType, referentClass } =
        documentReferents({
            serializedComponents,
            componentInfoObjects,
        });

    /**
     * Plan making the `_copy` `component` a value reference: the change to
     * make, or `undefined` when it does not qualify. Read as an entry of the
     * list `asEntryOf` when given, the list a repeat's value or index becomes
     * (`iterationDummies`): an iteration reads its own entry of it.
     */
    function planReference(
        component: SerializedComponent,
        parent: SerializedComponent | undefined,
        named: NamedReference[],
        betweenBrackets: boolean,
        asEntryOf?: IterationDummy,
    ): (() => void) | undefined {
        // An `extend` with nothing written on it but the reference
        // (`<math extend="$m"/>`) is the bare reference written out
        // (`unadornedExtendType`), which it is planned as.
        const extendType = unadornedExtendType(component);
        if (
            parent === undefined ||
            component.componentType !== "_copy" ||
            component.extending === undefined ||
            !(
                "Ref" in component.extending ||
                (extendType !== undefined && !betweenBrackets && !asEntryOf)
            ) ||
            !(betweenBrackets
                ? asksOnlyForAnInteger(component)
                : extendType !== undefined || hasOnlyResponseMarks(component))
        ) {
            return;
        }
        const refResolution = unwrapSource(component.extending);
        if (refResolution.nodeIdx < 0) {
            return;
        }
        const naming = named.filter(
            ({ reference }) =>
                reference.nodeIdx === refResolution.nodeIdx &&
                comparePathsIgnorePosition(
                    reference.unresolvedPath,
                    refResolution.unresolvedPath,
                ),
        );
        if (naming.some(({ marksResponse }) => !marksResponse)) {
            return;
        }
        let targetComponentType: string | undefined;
        let targetClass: any;
        let unresolvedPath = refResolution.unresolvedPath;
        if (asEntryOf) {
            targetComponentType = asEntryOf.listComponentType;
            targetClass = asEntryOf.listClass;
            unresolvedPath = [ITERATION_ENTRY, ...(unresolvedPath ?? [])];
        } else {
            targetComponentType = referentType(refResolution.nodeIdx);
            if (targetComponentType === undefined) {
                return;
            }
            targetClass = referentClass(
                refResolution.nodeIdx,
                targetComponentType,
            );
        }
        if (targetClass === undefined) {
            return;
        }
        const target = staticValueReferenceTarget({
            targetComponentType,
            targetClass,
            unresolvedPath,
            componentInfoObjects,
        });
        if (!target) {
            if (
                betweenBrackets ||
                asEntryOf ||
                unresolvedPath != null ||
                naming.length > 0 ||
                Object.keys(component.attributes).length > 0
            ) {
                return;
            }
            return planReferentAdapter(
                component,
                parent,
                targetComponentType,
                targetClass,
            );
        }

        if (betweenBrackets) {
            // The index is read from the reference directly, and
            // rounded where it is read (`refResolutionDependencies.ts`)
            // as the `integer` it asked for rounds.
            if (
                !componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: target.valueComponentType,
                    baseComponentType: "number",
                })
            ) {
                return;
            }
            return () => {
                component.attributes = {};
                makeValueReference(component, {
                    presentedComponentType: "integer",
                    valueComponentType: target.valueComponentType,
                });
            };
        }

        // marked by the answer already, or named by an award, whose mark it
        // is given below
        const isResponse =
            naming.length > 0 ||
            (extendType === undefined &&
                Object.keys(component.attributes).length > 0);

        // the class the parent will be created as, which a list whose
        // entries' type an attribute gives decides from it
        const parentClass =
            componentInfoObjects.allComponentClasses[
                parent.componentType
            ]?.classForSerializedComponent(parent);
        if (!parentClass) {
            return;
        }
        let plan = planValueReference({
            parentClass,
            targetComponentType: target.referentComponentType,
            valueComponentType: target.valueComponentType,
            fromImplicitProp: target.fromImplicitProp,
            hasAttributes: false,
            allowDrawn: true,
            componentInfoObjects,
        });
        let valueComponentType = target.valueComponentType;
        let listEntryAdapterProperty: string | undefined;
        if (!plan && target.listEntryProperty === "value") {
            // An entry of a list component, in a parent that takes what
            // the entries adapt to: the reference reads the entry's property
            // that the adapter would have read (`$l[$i]` as `$l[$i].math`).
            const adapted = planListEntryAdapterReference({
                parentClass,
                listClass: targetClass,
                valueComponentType: target.valueComponentType,
                componentInfoObjects,
            });
            if (adapted) {
                plan = {
                    presentedComponentType: adapted.presentedComponentType,
                };
                valueComponentType = adapted.presentedComponentType;
                listEntryAdapterProperty = adapted.entryProperty;
            }
        }
        if (!plan) {
            return;
        }
        // An extend names a type: it is the bare reference written out only
        // where that is the type of what the reference reads, which the
        // parent then takes as it takes the bare reference (as itself, or
        // through an adapter). One that names another type converts. One
        // that reads an entry of a list (`$c[1]` of a `<collect>`) copies
        // the entry, with how it is typeset and whether it takes clicks,
        // which a reference to the entry does not read, so it stays a copy.
        if (
            extendType !== undefined &&
            (extendType !== target.valueComponentType ||
                target.listEntryProperty === "value")
        ) {
            return;
        }
        const finalPlan = plan;
        return () => {
            if (extendType !== undefined) {
                // It stands where the extend was written, under its index
                // (the one its replacement would have had).
                component.componentIdx = Number(
                    (component.attributes.createComponentIdx as any).primitive
                        .value,
                );
                component.attributes = {};
            }
            if (isResponse) {
                // A copy keeps its attributes as written, for its
                // replacements; a value reference holds its response marks
                // as the type it presents as reads them. They are
                // primitives, so the conversion makes no components.
                component.attributes =
                    convertUnresolvedAttributesForComponentType({
                        attributes: component.attributes,
                        componentType: finalPlan.presentedComponentType,
                        componentInfoObjects,
                        nComponents: 0,
                    }).attributes;
                if (naming.length > 0 && !component.attributes.isResponse) {
                    component.attributes.isResponse = {
                        type: "primitive",
                        name: "isResponse",
                        primitive: { type: "boolean", value: true },
                    };
                }
            }
            makeValueReference(component, {
                ...finalPlan,
                valueComponentType,
                copiesReferent: copiesReferent({
                    fromImplicitProp: target.fromImplicitProp,
                    targetClass,
                    plan: finalPlan,
                }),
            });
            if (listEntryAdapterProperty !== undefined) {
                component.doenetAttributes.listEntryAdapterProperty =
                    listEntryAdapterProperty;
            }
        };
    }

    /**
     * Plan making the `_copy` `component`, a reference to the whole of a
     * component with no implicit prop (`$P` of a `<point>`), a value
     * reference that reads the variable of the referent's adapter that its
     * parent takes (`P.coords` in a `<boolean>`,
     * `planReferentAdapterReference`), in place of a copy of the referent
     * and the adapter its parent would make from that copy. A reference an
     * answer records as a response stays a copy: the answer records the
     * referent itself.
     */
    function planReferentAdapter(
        component: SerializedComponent,
        parent: SerializedComponent,
        targetComponentType: string,
        targetClass: any,
    ): (() => void) | undefined {
        const parentClass =
            componentInfoObjects.allComponentClasses[
                parent.componentType
            ]?.classForSerializedComponent(parent);
        const plan = planReferentAdapterReference({
            parentClass,
            targetComponentType,
            targetClass,
            componentInfoObjects,
        });
        if (!plan) {
            return;
        }
        return () => {
            makeValueReference(component, {
                ...plan,
                valueComponentType: plan.presentedComponentType,
            });
            component.doenetAttributes.readsReferentAdapter = true;
        };
    }

    const iterationDummies = findIterationDummies(
        componentsByIdx,
        parentByIdx,
        componentInfoObjects,
    );

    // Plan every reference first, and a reference to a repeat's value or
    // index both ways: as it reads the component named for it today, and as
    // an entry of the list that component would become.
    const planned: {
        plain?: () => void;
        asEntry?: () => void;
        dummy?: IterationDummy;
    }[] = [];
    const readAsEntry = new Set<SerializedComponent>();
    walk(
        serializedComponents,
        undefined,
        [],
        (component, parent, named, betweenBrackets) => {
            const plain = planReference(
                component,
                parent,
                named,
                betweenBrackets,
            );
            const extending = component.extending;
            const dummy =
                extending && "Ref" in extending
                    ? iterationDummies.get(extending.Ref.nodeIdx)
                    : undefined;
            const asEntry = dummy
                ? planReference(
                      component,
                      parent,
                      named,
                      betweenBrackets,
                      dummy,
                  )
                : undefined;
            if (asEntry) {
                readAsEntry.add(component);
            }
            if (plain || asEntry) {
                planned.push({ plain, asEntry, dummy });
            }
        },
    );

    // A repeat's value or index becomes a list only when every reference to
    // it reads it as an entry, and nothing names it from outside its
    // iterations, which only a component of its own answers. Which iteration
    // such a reference reaches is not known until it resolves: `$r[2].v`, or
    // `$g.v` for a `<group extend="$r[2]" name="g"/>`. So any name that a path
    // names past its first part keeps the component.
    const namesPastFirstPart = new Set<string>();
    forEachReference(serializedComponents, (component, refResolution) => {
        const dummy = iterationDummies.get(refResolution.nodeIdx);
        if (dummy) {
            dummy.isRead = true;
            if (!readAsEntry.has(component)) {
                dummy.becomesList = false;
            }
        }
        for (const part of refResolution.originalPath.slice(1)) {
            namesPastFirstPart.add(part.name);
        }
    });
    for (const dummy of iterationDummies.values()) {
        if (namesPastFirstPart.has(dummy.name)) {
            dummy.becomesList = false;
        }
    }

    for (const { plain, asEntry, dummy } of planned) {
        if (dummy?.becomesList) {
            asEntry!();
        } else {
            plain?.();
        }
    }
    for (const dummy of iterationDummies.values()) {
        if (dummy.becomesList) {
            makeIterationList(dummy);
        }
    }
}

/**
 * The path part by which a reference to a repeat's value or index is
 * planned as one entry of the list it becomes. Which entry is only known
 * when the iteration is made (`remapExtendIndices` in `Repeat.js`); every
 * entry is of the same type.
 */
const ITERATION_ENTRY = { name: "", index: [{ value: ["1"] }] };

/**
 * A component the sugar of a `<repeat>` or `<repeatForSequence>` made for its
 * `valueName` (a `_placeholder`) or `indexName` (an `integer`) in its
 * `_repeatSetup`, which every reference to the name in the template resolved
 * to. Today the repeat makes a component of its own for it in each iteration
 * and points the iteration's references there. It can instead become one
 * list for the whole repeat, `_repeatValues` (a `<repeatForSequence>`'s
 * value, of the repeat's `type`) or `_repeatIndices`, whose entry for the
 * iteration each reference reads. A `<repeat>`'s value is a copy of what it
 * iterates over, and stays a component.
 */
type IterationDummy = {
    node: SerializedComponent;
    setup: SerializedComponent;
    repeat: SerializedComponent;
    name: string;
    listComponentType: string;
    listClass: any;
    /** The repeat's `type`, given to `_repeatValues`. */
    typeAttribute?: SerializedComponent["attributes"][string];
    becomesList: boolean;
    /** Whether any reference reads it. */
    isRead?: boolean;
};

function findIterationDummies(
    componentsByIdx: Map<number, SerializedComponent>,
    parentByIdx: Map<number, SerializedComponent | undefined>,
    componentInfoObjects: ComponentInfoObjects,
) {
    const dummies = new Map<number, IterationDummy>();
    for (const setup of componentsByIdx.values()) {
        if (setup.componentType !== "_repeatSetup") {
            continue;
        }
        const repeat = parentByIdx.get(setup.componentIdx);
        if (
            repeat?.componentType !== "repeat" &&
            repeat?.componentType !== "repeatForSequence"
        ) {
            continue;
        }
        for (const node of setup.children) {
            if (typeof node === "string") {
                continue;
            }
            const name = primitiveName(node);
            if (name === undefined) {
                continue;
            }
            if (node.componentType === "integer") {
                dummies.set(node.componentIdx, {
                    node,
                    setup,
                    repeat,
                    name,
                    listComponentType: "_repeatIndices",
                    listClass:
                        componentInfoObjects.allComponentClasses[
                            "_repeatIndices"
                        ],
                    becomesList: true,
                });
            } else if (
                node.componentType === "_placeholder" &&
                repeat.componentType === "repeatForSequence"
            ) {
                const typeAttribute = repeat.attributes.type;
                const entryType = sequenceEntryComponentType(typeAttribute);
                if (entryType === undefined) {
                    continue;
                }
                dummies.set(node.componentIdx, {
                    node,
                    setup,
                    repeat,
                    name,
                    listComponentType: "_repeatValues",
                    listClass: (
                        componentInfoObjects.allComponentClasses[
                            "_repeatValues"
                        ] as any
                    ).classForEntryType(entryType),
                    typeAttribute,
                    becomesList: true,
                });
            }
        }
    }
    return dummies;
}

/** The name a component is given, when it is a literal. */
function primitiveName(node: SerializedComponent): string | undefined {
    const nameAttribute = node.attributes.name;
    if (nameAttribute?.type === "primitive") {
        return String(nameAttribute.primitive.value);
    }
    return undefined;
}

/**
 * Turn a repeat's value or index into the list each iteration reads its
 * entry of, and make it a child of the repeat (which creates it, keeping its
 * template serialized), out of the `_repeatSetup`, which is dropped once
 * nothing is left in it. One that nothing reads is not made at all: the
 * repeat is told, in `unreadIterationNames`, to make no component for it
 * in its iterations either (`hasIterationList` in `Repeat.js`).
 */
function makeIterationList(dummy: IterationDummy) {
    const { node, setup, repeat } = dummy;
    setup.children = setup.children.filter((child) => child !== node);
    if (dummy.isRead) {
        node.componentType = dummy.listComponentType;
        if (dummy.typeAttribute !== undefined) {
            node.attributes = {
                ...node.attributes,
                type: dummy.typeAttribute,
            };
        }
        repeat.children.push(node);
    } else {
        repeat.doenetAttributes = {
            ...repeat.doenetAttributes,
            unreadIterationNames: [
                ...(repeat.doenetAttributes?.unreadIterationNames ?? []),
                dummy.listComponentType,
            ],
        };
    }
    if (!setup.children.some((child) => typeof child !== "string")) {
        repeat.children = repeat.children.filter((child) => child !== setup);
    }
}

/**
 * Call `visit` for every component of the tree that extends a reference
 * (`Ref`, `extend` or `copy`): children, attribute components, the
 * references of a reference attribute, the children of an attribute not yet
 * converted, and what is written between the brackets of a reference's path.
 */
function forEachReference(
    components: (SerializedComponent | string)[],
    visit: (
        component: SerializedComponent,
        refResolution: SerializedRefResolution,
    ) => void,
) {
    for (const component of components) {
        if (typeof component === "string") {
            continue;
        }
        if (component.extending) {
            const refResolution = unwrapSource(
                component.extending,
            ) as SerializedRefResolution;
            visit(component, refResolution);
            // as `walk` does: what is written between the brackets, which
            // the planning saw, is in the path as written
            for (const pathPart of refResolution.originalPath) {
                for (const indexPiece of pathPart.index) {
                    forEachReference(indexPiece.value, visit);
                }
            }
        }
        forEachReference(component.children, visit);
        for (const attribute of Object.values(component.attributes)) {
            if (attribute.type === "component") {
                forEachReference([attribute.component], visit);
            } else if (attribute.type === "references") {
                forEachReference(attribute.references, visit);
            } else if (attribute.type === "unresolved") {
                forEachReference(
                    attribute.children as (SerializedComponent | string)[],
                    visit,
                );
            }
        }
    }
}

/**
 * The components of the document by index, each one's parent, and, for a
 * reference that resolved to `nodeIdx`, the type of the component it resolved
 * to (`referentType`) and the class it will be created as (`referentClass`),
 * as far as the document says.
 *
 * The referent's type is read from the document: the component under
 * `nodeIdx`, the type an `extend` or `copy` will make for the component it
 * names (`createComponentIdx`), or, for the placeholder a
 * `<repeatForSequence>` makes for its `valueName`, the repeat's `type`.
 */
export function documentReferents({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}) {
    const componentsByIdx = new Map<number, SerializedComponent>();
    const parentByIdx = new Map<number, SerializedComponent | undefined>();
    const copiesByCreatedIdx = new Map<number, SerializedComponent>();

    walk(serializedComponents, undefined, [], (component, parent) => {
        componentsByIdx.set(component.componentIdx, component);
        parentByIdx.set(component.componentIdx, parent);
        const createdIdx = component.attributes.createComponentIdx;
        if (
            component.componentType === "_copy" &&
            createdIdx?.type === "primitive"
        ) {
            copiesByCreatedIdx.set(
                Number(createdIdx.primitive.value),
                component,
            );
        }
    });

    /** The type the component a reference resolved to will have. */
    function referentType(nodeIdx: number): string | undefined {
        const node = componentsByIdx.get(nodeIdx);
        if (node === undefined) {
            return typeMadeByCopy(copiesByCreatedIdx.get(nodeIdx));
        }
        if (node.componentType === "_copy") {
            return typeMadeByCopy(node);
        }
        if (node.componentType === "_placeholder") {
            // the `valueName` of a repeat; a `<repeatForSequence>` makes it
            // as its `type` says, a `<repeat>` as whatever it iterates over
            const setup = parentByIdx.get(nodeIdx);
            const repeat =
                setup?.componentType === "_repeatSetup"
                    ? parentByIdx.get(setup.componentIdx)
                    : undefined;
            if (repeat?.componentType !== "repeatForSequence") {
                return undefined;
            }
            return sequenceValueType(repeat);
        }
        return node.componentType;
    }

    /**
     * The type a `<repeatForSequence>` makes its value as, from its `type`
     * attribute (`sequenceEntryComponentType`). `undefined` when the
     * attribute is not a literal.
     */
    function sequenceValueType(
        repeat: SerializedComponent,
    ): string | undefined {
        return sequenceEntryComponentType(repeat.attributes.type);
    }

    /**
     * The class the component a reference resolved to will be created as,
     * of type `componentType`: for a list whose entries' type a primitive
     * attribute decides (`<sequence type="letters">`), the class for the
     * type its attribute gives (`classForSerializedComponent`). `undefined`
     * when that attribute cannot be read from the document, as for a
     * component an `extend` will make.
     */
    function referentClass(nodeIdx: number, componentType: string) {
        const componentClass =
            componentInfoObjects.allComponentClasses[componentType];
        if (componentClass?.listEntryTypeAttribute === undefined) {
            return componentClass;
        }
        const node = componentsByIdx.get(nodeIdx);
        if (node === undefined || node.componentType !== componentType) {
            return undefined;
        }
        return componentClass.classForSerializedComponent(node);
    }

    function typeMadeByCopy(copy: SerializedComponent | undefined) {
        const typeAttribute = copy?.attributes.createComponentOfType;
        if (typeAttribute?.type !== "primitive") {
            return undefined;
        }
        return componentInfoObjects.componentTypeLowerCaseMapping[
            String(typeAttribute.primitive.value).toLowerCase()
        ];
    }

    return {
        componentsByIdx,
        parentByIdx,
        copiesByCreatedIdx,
        referentType,
        referentClass,
    };
}

/**
 * A reference an enclosing component names in one of its reference
 * attributes, and whether that attribute marks it as a response
 * (`<award referencesAreResponses>`).
 */
type NamedReference = {
    reference: SerializedRefResolution;
    marksResponse: boolean;
};

/**
 * Whether the only attributes of `component` are the marks by which an
 * answer records what it reads as a response: the `isPotentialResponse`
 * an `<answer>` with no input of its own gives every reference in its
 * awards (`Answer.js`), or an `isResponse`. A value reference takes them too.
 */
function hasOnlyResponseMarks(component: SerializedComponent) {
    return Object.keys(component.attributes).every((name) =>
        RESPONSE_MARKS.has(name.toLowerCase()),
    );
}

/**
 * The type an `extend` with nothing written on it but the reference names
 * (`<math extend="$m"/>`), which `convertRefsToCopies` made a `_copy` with
 * only `createComponentOfType`, `createComponentIdx`, `copyInChildren` and
 * the name the document generated for it, and no children; `undefined` for
 * anything else (a name the author wrote, another attribute, a child, a
 * `copy`).
 */
function unadornedExtendType(component: SerializedComponent) {
    if (
        component.extending === undefined ||
        !("ExtendAttribute" in component.extending) ||
        component.children.length > 0
    ) {
        return undefined;
    }
    const names = Object.keys(component.attributes);
    if (
        !names.every((name) =>
            [
                "createComponentOfType",
                "createComponentIdx",
                "createComponentName",
                "copyInChildren",
            ].includes(name),
        )
    ) {
        return undefined;
    }
    // a name the document generated (`_math2`), not one the author wrote
    const nameAttribute = component.attributes.createComponentName;
    if (
        nameAttribute !== undefined &&
        !(
            nameAttribute.type === "primitive" &&
            String(nameAttribute.primitive.value).startsWith("_")
        )
    ) {
        return undefined;
    }
    const typeAttribute = component.attributes.createComponentOfType;
    const idxAttribute = component.attributes.createComponentIdx;
    if (
        typeAttribute?.type !== "primitive" ||
        idxAttribute?.type !== "primitive" ||
        typeof typeAttribute.primitive.value !== "string"
    ) {
        return undefined;
    }
    return typeAttribute.primitive.value;
}

/**
 * Whether the one attribute of `component` is the
 * `createComponentOfType="integer"` that `convertRefsToCopies` gives a bare
 * reference written between the brackets of another reference's path.
 */
function asksOnlyForAnInteger(component: SerializedComponent) {
    const typeAttribute = component.attributes.createComponentOfType;
    return (
        Object.keys(component.attributes).length === 1 &&
        typeAttribute?.type === "primitive" &&
        typeAttribute.primitive.value === "integer"
    );
}

/**
 * Turn the `_copy` `component` into a `_ref` that presents as
 * `presentedComponentType` and reads a value of `valueComponentType`.
 */
function makeValueReference(
    component: SerializedComponent,
    {
        presentedComponentType,
        adapterVariable,
        valueComponentType,
        copiesReferent = false,
    }: {
        presentedComponentType: string;
        adapterVariable?: string;
        valueComponentType: string;
        copiesReferent?: boolean;
    },
) {
    component.componentType = "_ref";
    component.doenetAttributes = {
        ...component.doenetAttributes,
        presentedComponentType,
        referencedComponentType: valueComponentType,
    };
    if (adapterVariable !== undefined) {
        component.doenetAttributes.adapterVariable = adapterVariable;
    }
    if (copiesReferent) {
        component.doenetAttributes.copiesReferent = true;
    }
}

/**
 * Visit every component of the tree with its parent and with the references
 * that the components above it name in their reference attributes
 * (`named`). Visits children, attribute components, and the components
 * written between the brackets of a reference's path (`$i` of `$l[$i]`),
 * which hang off the reference and are not children of anything: those are
 * visited with the reference as `parent` and `betweenBrackets` set, and
 * what is inside them (`$i` of `$l[$i+1]`, held by the `integer` that
 * `convertRefsToCopies` wraps the index in) as ordinary children. Not the
 * references of a `createReferences` attribute themselves, which name a
 * component rather than read a value.
 */
function walk(
    components: (SerializedComponent | string)[],
    parent: SerializedComponent | undefined,
    named: NamedReference[],
    visit: (
        component: SerializedComponent,
        parent: SerializedComponent | undefined,
        named: NamedReference[],
        betweenBrackets: boolean,
    ) => void,
    betweenBrackets = false,
) {
    for (const component of components) {
        if (typeof component === "string") {
            continue;
        }
        visit(component, parent, named, betweenBrackets);

        let namedBelow = named;
        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];
            if (attribute.type === "references") {
                for (const reference of attribute.references) {
                    if (reference.extending && "Ref" in reference.extending) {
                        if (namedBelow === named) {
                            namedBelow = [...named];
                        }
                        namedBelow.push({
                            reference: reference.extending.Ref,
                            marksResponse:
                                attrName === "referencesAreResponses",
                        });
                    }
                }
            }
        }

        walk(component.children, component, namedBelow, visit);
        // an award marks the references it names among its descendants,
        // not in attributes (`Award.js`)
        const namedInAttributes = namedBelow.filter(
            ({ marksResponse }) => !marksResponse,
        );
        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];
            if (attribute.type === "component") {
                walk(
                    [attribute.component],
                    component,
                    namedInAttributes,
                    visit,
                );
            }
        }
        if (component.extending) {
            for (const pathPart of unwrapSource(component.extending)
                .originalPath) {
                for (const indexPiece of pathPart.index) {
                    walk(indexPiece.value, component, named, visit, true);
                }
            }
        }
    }
}
