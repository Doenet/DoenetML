/**
 * The type of every property, decided from the DoenetML when the document
 * loads (TYPE, D45; Doenet/DoenetML#2568): every value a reference reaches
 * has one type, and what the reader enters, or saved state, never changes
 * it.
 *
 * Most properties have one type, which their component declares
 * (`shadowingInstructions.createComponentOfType`): `x` of a `<point>` is a
 * `<math>`. The few that don't declare one are typed here, by one function
 * each, from what is written (TYPE-1): the primitive attributes (`type`) and
 * the tags of what is written in the component, a reference typed as REF-5
 * types it (a bare `$y` is y's tag, a repeat's `valueName` the type its `for`
 * holds). Never from a value.
 *
 * | Property | Decided by |
 * |---|---|
 * | `<slider>`'s `value`, `items` | its `type` (`items` is a list of it) |
 * | `<animateFromSequence>`'s `value` | its `type` (`letters` is a text) |
 * | `<choiceInput>`'s `selectedValues` | a math when every choice holds one math, else a text |
 * | `<tally>`'s `categories` | its `type` with `categories` written (text by default), else a number when every value is a number by its tag, else a text |
 * | `<markers>`' `markers` | a text when any is a `<text>`, else a number |
 * | a selectable type's `value`, `values` | its `type`, else a number |
 * | `<answer>`'s `currentResponses`, `submittedResponses` | not yet decided here |
 *
 * What is decided is marked on the component
 * (`doenetAttributes.propertyTypes`, by variable name), and on a tag made
 * with `extend` or `copy` of one, from what it copies and what is written in
 * it. The run time reads it in place of working the type out from values
 * (`ChoiceInput.js`, `CountOperators.js`, `Markers.js`), and a copy passes
 * it on (`Copy.js`). The checks at load read it too: a reference written as
 * a tag (`typeChangeAtLoad.ts`), and the one-type checks of a `<sort>`, a
 * `<shuffle>` and a repeat's `for` (`reorderedItemsAtLoad.ts`).
 *
 * A type that can't be decided from the DoenetML (a choice holding a
 * reference to what the DoenetML doesn't type, a `<group>` in a `<tally>`)
 * is not marked. The run time then works it out as before, and a reference
 * written as a tag that needs it is `doenet-e0067` at load (TYPE-3).
 *
 * Also reported here: a `<select>` whose `type` isn't one its sugar reads
 * (`doenet-w0145`, as the list operators report it, D45 decision 7).
 */
import type { SerializedComponent, SerializedAttribute } from "./types";
import type { ComponentInfoObjects } from "../componentInfoObjects";
import { documentReferents } from "./valueReferences";
import { itemReader } from "./reorderedItemsAtLoad";
import { unwrapSource } from "./convertNormalizedDast";
import { attributeOf, literalText } from "./choiceErrorsAtLoad";
import { sequenceEntryComponentType } from "../sequence";
import { kindOfComponentType } from "../componentKinds";
import { codedDiagnostic } from "../diagnostics";
import { publicCaseInsensitiveAliasSubstitutions } from "../../StateVariableNameResolver";

/** What `doenetAttributes.propertyTypes` holds: a type by variable name. */
export type PropertyTypes = Record<string, string>;

/** The types a `<select>`'s sugar reads its text as (`selectSugar`). */
const SELECT_SUGAR_TYPES = ["math", "number", "text", "boolean"];

/**
 * The components with a property whose type is decided here, by the class
 * that declares it, with the variables decided.
 */
const DECIDED_HERE: Record<string, string[]> = {
    slider: ["value", "items"],
    animateFromSequence: ["value"],
    choiceInput: ["selectedValues"],
    tally: ["categories"],
    markers: ["markers"],
    _componentWithSelectableType: ["value"],
    _componentListWithSelectableType: ["values"],
};

/**
 * The type of a property of a component, read from the DoenetML, by what
 * `propertyTypeOf` finds.
 *
 * - `type`: the type of one value it holds, or, for an array (`several`), of
 *   each entry. A list tag (`numberList`) for a property holding a list as
 *   one value (a `<slider>`'s `items`).
 * - `undecided`: the component's class does not declare it, and the
 *   DoenetML does not decide it.
 */
export type PropertyType =
    | { type: string; several: boolean; variableName: string }
    | { undecided: true; variableName: string };

/**
 * What decides the types of the properties of the components of
 * `serializedComponents` (see above), with `referents` the document's
 * (`documentReferents`, typing a repeat's `valueName`).
 */
export function propertyTypeReader({
    componentInfoObjects,
    referents,
}: {
    componentInfoObjects: ComponentInfoObjects;
    referents: ReturnType<typeof documentReferents>;
}) {
    const { componentsByIdx, copiesByCreatedIdx, referentType } = referents;
    const allClasses = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;
    let reader: ReturnType<typeof itemReader> | undefined;

    /**
     * The types decided of each component, by its index; `null` while they
     * are being decided, so a component whose type reaches its own (a
     * choice holding `$ci` of its own `<choiceInput>`) is not decided.
     */
    const decided = new Map<number, PropertyTypes | null>();

    function canonical(type: string | undefined) {
        return type === undefined
            ? undefined
            : componentInfoObjects.componentTypeLowerCaseMapping[
                  type.toLowerCase()
              ];
    }

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

    /** The reference a `_copy` is of. */
    function refOf(component: SerializedComponent) {
        const extending: any = component.extending;
        return extending
            ? (unwrapSource(extending) as
                  { nodeIdx: number; unresolvedPath: any[] | null } | undefined)
            : undefined;
    }

    /** The tag a `_copy` written as a tag makes, if it is written as one. */
    function tagOf(copy: SerializedComponent) {
        const attribute = copy.attributes?._createComponentOfType;
        return attribute === undefined
            ? undefined
            : canonical(literalText(attribute));
    }

    /**
     * The class, of those `DECIDED_HERE`, a component of `componentType` is
     * built on, if any.
     */
    function decidingClass(componentType: string) {
        return Object.keys(DECIDED_HERE).find((base) =>
            inherits(componentType, base),
        );
    }

    /**
     * What `node` is written as: its tag, its attributes and its children,
     * and, for a tag made with `extend` or `copy` (`<choiceInput
     * extend="$ci">…</choiceInput>`), the attributes and children of what it
     * copies, before its own. `undefined` when that isn't known from the
     * DoenetML.
     */
    function written(
        node: SerializedComponent,
        seen: Set<number> = new Set(),
    ):
        | {
              tag: string;
              attribute: (name: string) => SerializedAttribute | undefined;
              children: (SerializedComponent | string)[];
          }
        | undefined {
        if (seen.has(node.componentIdx)) {
            return undefined;
        }
        seen.add(node.componentIdx);
        if (node.componentType !== "_copy") {
            return {
                tag: node.componentType,
                attribute: (name) => attributeOf(node, name),
                children: node.children ?? [],
            };
        }
        const tag = tagOf(node);
        const ref = refOf(node);
        if (
            tag === undefined ||
            !ref ||
            ref.nodeIdx < 0 ||
            (ref.unresolvedPath ?? []).length > 0
        ) {
            return undefined;
        }
        const source =
            componentsByIdx.get(ref.nodeIdx) ??
            copiesByCreatedIdx.get(ref.nodeIdx);
        const copied = source && written(source, seen);
        if (!copied) {
            return undefined;
        }
        return {
            tag,
            attribute: (name) =>
                attributeOf(node, name) ?? copied.attribute(name),
            children: [...copied.children, ...(node.children ?? [])],
        };
    }

    /**
     * The tag of what a component written in a component (a choice's
     * content, a tally's item) is, read as REF-5 reads it: a bare `$y` is
     * y's tag, a tag made with `extend` or `copy` its own tag. `undefined`
     * when the DoenetML doesn't say.
     */
    function tagOfComponent(component: SerializedComponent) {
        if (component.componentType !== "_copy") {
            return component.componentType;
        }
        const tag = tagOf(component);
        if (tag !== undefined) {
            return tag;
        }
        const ref = refOf(component);
        if (!ref || ref.nodeIdx < 0 || (ref.unresolvedPath ?? []).length > 0) {
            return undefined;
        }
        return referentType(ref.nodeIdx);
    }

    /** The node a reference or a tag made with `extend` names, if known. */
    function nodeOf(component: SerializedComponent) {
        if (component.componentType !== "_copy") {
            return component;
        }
        const ref = refOf(component);
        if (tagOf(component) !== undefined) {
            return component;
        }
        if (!ref || ref.nodeIdx < 0 || (ref.unresolvedPath ?? []).length > 0) {
            return undefined;
        }
        return (
            componentsByIdx.get(ref.nodeIdx) ??
            copiesByCreatedIdx.get(ref.nodeIdx)
        );
    }

    /**
     * The type a value of `component`, written as a choice's content, is
     * read as by `<choiceInput>`: whether it is a math (`Choice.js`'s
     * `math`: a math or number value, or LaTeX). `undefined` when the
     * DoenetML doesn't say.
     */
    function isMathContent(
        component: SerializedComponent | string,
    ): boolean | undefined {
        if (typeof component === "string") {
            return false;
        }
        if (component.componentType === "_copy") {
            const ref = refOf(component);
            const path = ref?.unresolvedPath ?? [];
            if (tagOf(component) === undefined && ref && path.length > 0) {
                // a property (`$P.x`), as its type says
                const property = propertyOfReference(component);
                if (!property || "undecided" in property || property.several) {
                    return undefined;
                }
                return isMathType(property.type, undefined);
            }
        }
        const tag = tagOfComponent(component);
        if (tag === undefined) {
            return undefined;
        }
        return isMathType(tag, nodeOf(component));
    }

    /**
     * Whether a component of `tag` (`node`, if known) holds a math, read as
     * `isMathContent` reads it.
     */
    function isMathType(
        tag: string,
        node: SerializedComponent | undefined,
    ): boolean | undefined {
        if (!allClasses[tag] || isComposite(tag)) {
            return undefined;
        }
        if (allClasses[tag].listEntryComponentType !== undefined) {
            // the list of its entries, not one math
            return false;
        }
        const kind = kindOfComponentType(
            tag,
            componentInfoObjects,
            undefined,
            node ? valueTypesOf(node) : undefined,
        );
        if (kind?.kind === "value") {
            return kind.type === "math";
        }
        if (kind === undefined && decidingClass(tag) !== undefined) {
            // an input whose type is not decided
            return undefined;
        }
        // Something with no math value of its own is read by its LaTeX, as
        // an `<m>` is.
        const info: any = componentInfoObjects.publicStateVariableInfo[tag];
        return info?.stateVariableDescriptions?.latex !== undefined;
    }

    /**
     * The choices of a `<choiceInput>` written as `children`, through what
     * makes them (a `<repeat>`'s template, a `<group>`, the options of a
     * `<select>`, the cases of a `<conditionalContent>`), and whether there
     * may be others not known.
     */
    function choicesIn(
        children: (SerializedComponent | string)[],
        found: { choices: SerializedComponent[]; unknown: boolean },
        seen: Set<number>,
    ) {
        for (const child of children) {
            if (typeof child !== "object" || seen.has(child.componentIdx)) {
                continue;
            }
            const type = tagOfComponent(child);
            if (
                type === "choice" &&
                child.componentType === "_copy" &&
                tagOf(child) === undefined
            ) {
                // A bare `$c` is not a choice but whether it was submitted
                // (its `submitted`), a boolean the `<choiceInput>` ignores.
                continue;
            }
            if (type === "choice") {
                const node = nodeOf(child);
                if (node) {
                    found.choices.push(node);
                } else {
                    found.unknown = true;
                }
                continue;
            }
            if (child.componentType === "_copy") {
                const node = nodeOf(child);
                if (
                    node &&
                    node !== child &&
                    type !== undefined &&
                    (type === "group" || isComposite(type))
                ) {
                    choicesIn(
                        [node],
                        found,
                        new Set(seen).add(child.componentIdx),
                    );
                } else if (type === undefined || isComposite(type)) {
                    found.unknown = true;
                }
                continue;
            }
            if (
                [
                    "repeat",
                    "repeatForSequence",
                    "group",
                    "select",
                    "option",
                    "conditionalContent",
                    "case",
                ].includes(child.componentType)
            ) {
                choicesIn(
                    child.children ?? [],
                    found,
                    new Set(seen).add(child.componentIdx),
                );
            } else if (isComposite(child.componentType)) {
                found.unknown = true;
            }
        }
        return found;
    }

    /**
     * The content of a choice, as written, if known. Blank text is kept, as
     * the choice keeps it (`includeBlankStringChildren`): a `<math>` with
     * space around it is not one math (`Choice.js`'s `math`), so the choice
     * is a text.
     */
    function choiceContent(choice: SerializedComponent) {
        return written(choice)?.children;
    }

    /** A `<choiceInput>`'s `selectedValues` (`ChoiceInput.js`). */
    function choiceInputType(
        children: (SerializedComponent | string)[],
    ): string | undefined {
        const { choices, unknown } = choicesIn(
            children,
            { choices: [], unknown: false },
            new Set(),
        );
        let allMath = choices.length > 0;
        let undecided = unknown;
        for (const choice of choices) {
            const content = choiceContent(choice);
            if (content === undefined) {
                undecided = true;
                continue;
            }
            // more than one child (blank text among them), or none, is
            // read as a text
            const math =
                content.length === 1 ? isMathContent(content[0]) : false;
            if (math === undefined) {
                undecided = true;
            } else if (!math) {
                // A choice that is a text makes them all texts, whatever
                // the others are.
                return "text";
            }
        }
        if (undecided) {
            return undefined;
        }
        return allMath ? "math" : "text";
    }

    /** A selectable type's `type` (`ComponentWithSelectableType.js`). */
    function selectableType(attribute: SerializedAttribute | undefined) {
        const type =
            attribute === undefined
                ? undefined
                : literalText(attribute)?.toLowerCase();
        if (type === "text" || type === "letters") {
            return "text";
        }
        if (type === "math" || type === "boolean") {
            return type;
        }
        return "number";
    }

    /**
     * A `<tally>`'s `categories` (`CountOperators.js`): of its `type` when
     * they are written, else a number when every value it counts is a
     * number by its tag, and a text otherwise, or with none.
     */
    function tallyType(
        node: SerializedComponent,
        attribute: (name: string) => SerializedAttribute | undefined,
        children: (SerializedComponent | string)[],
    ): string | undefined {
        if (attribute("categories") !== undefined) {
            const typeAttribute = attribute("type");
            if (typeAttribute === undefined) {
                return "text";
            }
            const type = literalText(typeAttribute)?.toLowerCase();
            if (type === "letters" || type === "text") {
                return "text";
            }
            // as its `_componentListWithSelectableType` reads it
            return type === "math" || type === "boolean" ? type : "number";
        }
        reader ??= itemReader({ componentInfoObjects, referents });
        const { items, unknown } = reader.itemsOfChildren(
            children,
            new Set([node.componentIdx]),
        );
        // A wrapper of several (a `<group>`), whose components are counted
        // each, is not read here.
        const several = items.some((item) => item.kind !== "one");
        if (
            items.some(
                (item) => item.kind === "one" && !inherits(item.tag, "number"),
            )
        ) {
            return "text";
        }
        if (unknown || several) {
            return undefined;
        }
        return items.length > 0 ? "number" : "text";
    }

    /** `<markers>`' `markers` (`Markers.js`): any text makes them texts. */
    function markersType(
        children: (SerializedComponent | string)[],
    ): string | undefined {
        let unknown = false;
        for (const child of children) {
            if (typeof child !== "object") {
                continue;
            }
            const tag = tagOfComponent(child);
            if (tag === undefined) {
                unknown = true;
            } else if (inherits(tag, "text")) {
                return "text";
            }
        }
        return unknown
            ? undefined
            : children.some(
                    (child) =>
                        typeof child === "object" &&
                        inherits(tagOfComponent(child)!, "number"),
                )
              ? "number"
              : "text";
    }

    /**
     * The types decided here of the properties of `node`, a component or a
     * tag made with `extend` or `copy`, by variable name (see above).
     */
    function propertyTypesOf(node: SerializedComponent): PropertyTypes {
        const idx = node.componentIdx;
        if (decided.has(idx)) {
            return decided.get(idx) ?? {};
        }
        decided.set(idx, null);
        const result: PropertyTypes = {};
        const ofNode = written(node);
        const base = ofNode && decidingClass(ofNode.tag);
        if (ofNode && base) {
            const { attribute, children } = ofNode;
            const set = (name: string, type: string | undefined) => {
                if (type !== undefined) {
                    result[name] = type;
                }
            };
            if (base === "slider") {
                const type = selectableType(attribute("type"));
                const sliderType = type === "text" ? "text" : "number";
                set("value", sliderType);
                set("items", `${sliderType}List`);
            } else if (base === "animateFromSequence") {
                set("value", sequenceEntryComponentType(attribute("type")));
            } else if (base === "choiceInput") {
                set("selectedValues", choiceInputType(children));
            } else if (base === "tally") {
                set("categories", tallyType(node, attribute, children));
            } else if (base === "markers") {
                set("markers", markersType(children));
            } else if (base === "_componentWithSelectableType") {
                set("value", selectableType(attribute("type")));
            } else if (base === "_componentListWithSelectableType") {
                set("values", selectableType(attribute("type")));
            }
        }
        decided.set(idx, result);
        return result;
    }

    /**
     * The types of the values of `node` read as REF-5 reads its implicit
     * property (`kindOfComponentType`): the types decided here, by variable
     * name.
     */
    function valueTypesOf(node: SerializedComponent) {
        return propertyTypesOf(node);
    }

    /**
     * The type of the property `name`, with `numIndices` indices after it,
     * of the component `node` (or, with no node, one of `componentType`,
     * whose types are then those its class declares). `undefined` when
     * `name` is not a public property of it.
     */
    function propertyTypeOf({
        componentType,
        node,
        name,
        numIndices,
    }: {
        componentType: string;
        node: SerializedComponent | undefined;
        name: string;
        numIndices: number;
    }): PropertyType | undefined {
        const componentClass = allClasses[componentType];
        if (!componentClass) {
            return undefined;
        }
        const [variableName] = publicCaseInsensitiveAliasSubstitutions({
            stateVariables: [name],
            componentClass,
            componentInfoObjects,
        });
        if (
            variableName === undefined ||
            variableName.startsWith("__not_public_")
        ) {
            return undefined;
        }
        const info: any =
            componentInfoObjects.publicStateVariableInfo[componentType];
        if (!info) {
            return undefined;
        }
        let description = info.stateVariableDescriptions[variableName];
        let arrayVariable = variableName;
        let several = false;
        if (description) {
            several =
                Boolean(description.isArray) &&
                numIndices < (description.numDimensions ?? 1);
        } else {
            // the name of an array entry: its array, by the longest prefix
            const prefix = Object.keys(info.arrayEntryPrefixes ?? {})
                .filter((p) => variableName.startsWith(p))
                .sort((a, b) => b.length - a.length)[0];
            const entry = prefix && info.arrayEntryPrefixes[prefix];
            if (!entry) {
                return undefined;
            }
            arrayVariable = entry.arrayVariableName;
            description = info.stateVariableDescriptions[arrayVariable];
            several = numIndices < entry.numDimensions;
        }
        if (!description?.public) {
            return undefined;
        }
        const declared = description.createComponentOfType;
        if (typeof declared === "string") {
            return { type: declared, several, variableName: arrayVariable };
        }
        const type = node ? propertyTypesOf(node)[arrayVariable] : undefined;
        return type === undefined
            ? { undecided: true, variableName: arrayVariable }
            : { type, several, variableName: arrayVariable };
    }

    /**
     * The type of the property a reference `copy` names, when it is one
     * name of a property, with indices, after a component that is not a
     * composite (`$P.x`, `$ci.selectedValues[2]`). `undefined` otherwise.
     */
    function propertyOfReference(
        copy: SerializedComponent,
    ): PropertyType | undefined {
        const ref = refOf(copy);
        const path = ref?.unresolvedPath ?? [];
        if (!ref || ref.nodeIdx < 0 || path.length !== 1) {
            return undefined;
        }
        const part = path[0];
        if (typeof part?.name !== "string" || part.name === "") {
            return undefined;
        }
        const componentType = referentType(ref.nodeIdx);
        if (componentType === undefined || isComposite(componentType)) {
            return undefined;
        }
        const node =
            componentsByIdx.get(ref.nodeIdx) ??
            copiesByCreatedIdx.get(ref.nodeIdx);
        return propertyTypeOf({
            componentType,
            node: node?.componentType === "_placeholder" ? undefined : node,
            name: part.name,
            numIndices: (part.index ?? []).length,
        });
    }

    return {
        propertyTypesOf,
        propertyTypeOf,
        tagOf,
        propertyOfReference,
        decidingClass,
    };
}

/**
 * Mark each component of `serializedComponents` with a property whose type
 * is decided here, and each tag made with `extend` or `copy` of one, with
 * the types decided (`doenetAttributes.propertyTypes`), and return what is
 * reported now (see above).
 */
export function markPropertyTypesAtLoad({
    serializedComponents,
    componentInfoObjects,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
}) {
    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];
    const referents = documentReferents({
        serializedComponents,
        componentInfoObjects,
        typeRepeatValues: true,
    });
    const { propertyTypesOf, decidingClass, tagOf } = propertyTypeReader({
        componentInfoObjects,
        referents,
    });

    const marked: [SerializedComponent, PropertyTypes][] = [];
    const seen = new Set<SerializedComponent>();
    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || seen.has(component)) {
                continue;
            }
            seen.add(component);
            const tag =
                component.componentType === "_copy"
                    ? tagOf(component)
                    : component.componentType;
            if (tag !== undefined && decidingClass(tag) !== undefined) {
                const types = propertyTypesOf(component);
                if (Object.keys(types).length > 0) {
                    marked.push([component, types]);
                }
            }
            if (component.componentType === "select") {
                const typeAttribute = attributeOf(component, "type");
                const type =
                    typeAttribute === undefined
                        ? undefined
                        : literalText(typeAttribute);
                if (type !== undefined && !SELECT_SUGAR_TYPES.includes(type)) {
                    diagnostics.push({
                        ...codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0145",
                            args: { type, component: "select" },
                        }),
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    });
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

    // Marked once all are decided, so that what one reads of another is
    // what was written.
    for (const [component, types] of marked) {
        component.doenetAttributes = {
            ...component.doenetAttributes,
            propertyTypes: types,
        };
    }
    return diagnostics;
}
