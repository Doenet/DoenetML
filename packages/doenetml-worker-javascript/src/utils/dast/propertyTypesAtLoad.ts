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
 * | `<answer>`'s `currentResponses`, `submittedResponses` | each response's: its input's type, or its component's tag (`answerResponseTypes`) |
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
import { errorComponentState } from "./errors";
import { publicCaseInsensitiveAliasSubstitutions } from "../../StateVariableNameResolver";

/**
 * What `doenetAttributes.propertyTypes` holds: a type by variable name, or,
 * for an array whose entries may differ in type (an `<answer>`'s responses,
 * TYPE-2), the type of each entry.
 */
export type PropertyTypes = Record<string, string | string[]>;

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
    answer: ["currentResponses", "submittedResponses"],
};

/**
 * The type a response is recorded as of an input with a `componentType` of
 * its own (`Answer.js`'s `currentResponses`), other than a `<choiceInput>`,
 * whose type is decided here. Any other component is recorded as its tag.
 */
const INPUT_RESPONSE_TYPES: Record<string, string> = {
    mathInput: "math",
    textInput: "text",
    booleanInput: "boolean",
    codeEditor: "text",
    fractionInput: "math",
    matrixInput: "matrix",
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
 * A response of an `<answer>` found in what is written
 * (`answerResponseTypes`): its type, `undefined` when not known, and how
 * many entries it gives, `undefined` when that is not known (a list).
 */
type Response = { type: string | undefined; count: number | undefined };

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
    /**
     * Each `<conditionalContent>` an `<answer>` reads a response from whose
     * cases hold responses of different types (TYPE-2, COMP-11), with them.
     */
    const responseCaseErrors = new Map<
        SerializedComponent,
        { firstType: string; secondType: string }
    >();
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
     * The response a component `component` written as one is recorded as
     * (`Answer.js`'s `currentResponses`): an input as its value's type, a
     * reference (`$mi`, a value reference) as what it reads, a list as its
     * entries, of any number, and any other component as its tag.
     */
    function responseOf(component: SerializedComponent | string): Response {
        const response = responseRead(component);
        // A response missing when the document runs (an index past the end,
        // a property holding no value, a reference that names nothing) is
        // recorded as one blank math, whatever its type (`currentResponses`),
        // so one that may be missing is decided here only as a math.
        return response.type !== "math" && mayBeMissing(component)
            ? { type: undefined, count: undefined }
            : response;
    }

    /**
     * Whether the response `component` may be missing when the document
     * runs: a reference, or a tag made from one, with an index or a
     * property, or that names nothing (marked `missing` at load).
     */
    function mayBeMissing(
        component: SerializedComponent | string,
        seen: Set<number> = new Set(),
    ): boolean {
        if (typeof component === "string" || seen.has(component.componentIdx)) {
            return false;
        }
        if (component.componentType !== "_copy") {
            // a tag made from a reference that names nothing (D37)
            return Boolean(component.doenetAttributes?.missing);
        }
        const ref = refOf(component);
        if (!ref || ref.nodeIdx < 0 || (ref.unresolvedPath ?? []).length > 0) {
            return true;
        }
        // a reference to what is missing
        const node =
            componentsByIdx.get(ref.nodeIdx) ??
            copiesByCreatedIdx.get(ref.nodeIdx);
        if (node === undefined || seen.has(node.componentIdx)) {
            return false;
        }
        return mayBeMissing(node, new Set(seen).add(component.componentIdx));
    }

    /** The response `component` is read as, if it is not missing. */
    function responseRead(component: SerializedComponent | string): Response {
        if (typeof component === "string") {
            return { type: "text", count: 1 };
        }
        let tag: string | undefined;
        let node: SerializedComponent | undefined;
        if (
            component.componentType === "_copy" &&
            tagOf(component) === undefined
        ) {
            const ref = refOf(component);
            if (ref && (ref.unresolvedPath ?? []).length > 0) {
                const property = propertyOfReference(component);
                if (!property || "undecided" in property) {
                    return { type: undefined, count: undefined };
                }
                return property.several
                    ? { type: property.type, count: undefined }
                    : { type: property.type, count: 1 };
            }
            // a bare `$y` reads y's value: an input's, as its type, or a
            // component of its tag
            tag = tagOfComponent(component);
            node = nodeOf(component);
            if (
                tag !== undefined &&
                allClasses[tag]?.variableForImplicitProp &&
                !inherits(tag, "choiceInput")
            ) {
                const valueType = valueTypeOfInput(tag, node);
                if (valueType !== undefined) {
                    return { type: valueType, count: 1 };
                }
            }
        } else {
            tag = tagOfComponent(component);
            node = nodeOf(component);
        }
        if (tag === undefined || tag === "group" || isComposite(tag)) {
            return { type: undefined, count: undefined };
        }
        const entry = allClasses[tag]?.listEntryComponentType;
        if (entry !== undefined) {
            return { type: entry, count: undefined };
        }
        if (inherits(tag, "choiceInput")) {
            const type = node
                ? propertyTypesOf(node).selectedValues
                : undefined;
            return {
                type: typeof type === "string" ? type : undefined,
                count: 1,
            };
        }
        const inputType = Object.entries(INPUT_RESPONSE_TYPES).find(([input]) =>
            inherits(tag!, input),
        )?.[1];
        return { type: inputType ?? tag, count: 1 };
    }

    /**
     * The type of the value a bare reference to a component of `tag`
     * (`node`) reads (its implicit property), as its class declares it or
     * as decided here. `undefined` when not known.
     */
    function valueTypeOfInput(
        tag: string,
        node: SerializedComponent | undefined,
    ) {
        const variable = allClasses[tag]?.variableForImplicitProp;
        const decided = node ? propertyTypesOf(node)[variable] : undefined;
        if (typeof decided === "string") {
            return decided;
        }
        const info: any = componentInfoObjects.publicStateVariableInfo[tag];
        const declared =
            info?.stateVariableDescriptions?.[variable]?.createComponentOfType;
        return typeof declared === "string" ? declared : undefined;
    }

    /**
     * The responses the components `components`, written in an `<award>`,
     * hold: one marked a response (`isResponse` written, or a reference
     * `referencesAreResponses` names, `named`), or, in `potential`, a
     * reference the answer's sugar marked `isPotentialResponse`; and those
     * of what they hold. Those in a `<conditionalContent>` follow COMP-11's
     * every-branch rule (`caseResponses`).
     */
    function awardResponses(
        components: (SerializedComponent | string)[],
        named: { nodeIdx: number; path: string }[],
        found: { responses: Response[]; potential: Response[] },
    ) {
        for (const component of components) {
            if (typeof component !== "object") {
                continue;
            }
            if (isMarkedResponse(component, named)) {
                found.responses.push(responseOf(component));
                continue;
            }
            if (isMarkedPotential(component)) {
                found.potential.push(responseOf(component));
                continue;
            }
            if (component.componentType === "conditionalContent") {
                const cases: {
                    responses: Response[];
                    potential: Response[];
                }[] = [];
                for (const part of component.children ?? []) {
                    if (typeof part !== "object") {
                        continue;
                    }
                    cases.push(
                        awardResponses(part.children ?? [], named, {
                            responses: [],
                            potential: [],
                        }),
                    );
                }
                const merged = caseResponses(component, cases);
                found.responses.push(...merged.responses);
                found.potential.push(...merged.potential);
                continue;
            }
            for (const attribute of Object.values(component.attributes ?? {})) {
                const attr: any = attribute;
                if (attr.type === "component" && attr.component) {
                    awardResponses([attr.component], named, found);
                }
            }
            awardResponses(component.children ?? [], named, found);
        }
        return found;
    }

    /**
     * The responses of the cases of a `<conditionalContent>`, by the
     * every-branch rule (COMP-11): what each case holds when every case
     * holds responses of the same types and number, else one of their one
     * type, of a number not known. Cases holding responses of different
     * types are an error (`responseCaseErrors`), and their responses are
     * not known.
     */
    function caseResponses(
        container: SerializedComponent,
        cases: { responses: Response[]; potential: Response[] }[],
    ): { responses: Response[]; potential: Response[] } {
        const all = cases.flatMap((c) => [...c.responses, ...c.potential]);
        if (all.length === 0) {
            return { responses: [], potential: [] };
        }
        const types = [
            ...new Set(
                all.flatMap((r) => (r.type === undefined ? [] : [r.type])),
            ),
        ];
        if (types.length > 1) {
            responseCaseErrors.set(container, {
                firstType: types[0],
                secondType: types[1],
            });
            return {
                responses: [{ type: undefined, count: undefined }],
                potential: [],
            };
        }
        const signature = (r: Response[]) =>
            r.map((x) => `${x.type}:${x.count}`).join(",");
        const first = cases[0];
        if (
            cases.length > 0 &&
            cases.every(
                (c) =>
                    signature(c.responses) === signature(first.responses) &&
                    signature(c.potential) === signature(first.potential),
            )
        ) {
            return first;
        }
        // of one type, but not as many in each case
        const unknownCount = (r: Response[]) =>
            r.length > 0
                ? [
                      {
                          type: r.some((x) => x.type === undefined)
                              ? undefined
                              : types[0],
                          count: undefined,
                      },
                  ]
                : [];
        return {
            responses: unknownCount(cases.flatMap((c) => c.responses)),
            potential: unknownCount(cases.flatMap((c) => c.potential)),
        };
    }

    /**
     * Whether `component` is written with `isResponse` (true), or is a
     * reference an award's `referencesAreResponses` names (`named`, as
     * `Award.js` marks it when the document runs).
     */
    function isMarkedResponse(
        component: SerializedComponent,
        named: { nodeIdx: number; path: string }[],
    ) {
        const attribute = attributeOf(component, "isResponse");
        if (attribute !== undefined) {
            const text = literalText(attribute);
            if (text === "" || text?.toLowerCase() === "true") {
                return true;
            }
        }
        if (component.componentType !== "_copy" || named.length === 0) {
            return false;
        }
        const ref = refOf(component);
        if (!ref) {
            return false;
        }
        const path = JSON.stringify(
            (ref.unresolvedPath ?? []).map((part: any) => part.name),
        );
        return named.some((n) => n.nodeIdx === ref.nodeIdx && n.path === path);
    }

    /**
     * The children of a case, through the `<group>` with no attributes that
     * its sugar wraps them in.
     */
    function withoutSugarGroup(children: (SerializedComponent | string)[]) {
        const shown = children.filter(
            (child) => typeof child !== "string" || child.trim() !== "",
        );
        const [only] = shown;
        if (
            shown.length === 1 &&
            typeof only === "object" &&
            only.componentType === "group" &&
            Object.keys(only.attributes ?? {}).length === 0
        ) {
            return only.children ?? [];
        }
        return children;
    }

    /** Whether the answer's sugar marked `component` a potential response. */
    function isMarkedPotential(component: SerializedComponent) {
        const attribute = attributeOf(component, "isPotentialResponse");
        return (
            attribute !== undefined &&
            literalText(attribute)?.toLowerCase() === "true"
        );
    }

    /** The inputs written `forAnswer` the `<answer>` `answerIdx`. */
    function inputsForAnswer(answerIdx: number) {
        const inputs: SerializedComponent[] = [];
        for (const component of componentsByIdx.values()) {
            const attribute: any = attributeOf(component, "forAnswer");
            if (attribute?.type !== "references") {
                continue;
            }
            for (const reference of attribute.references ?? []) {
                const ref =
                    typeof reference === "object" && reference?.extending
                        ? refOf(reference)
                        : undefined;
                if (
                    ref?.nodeIdx === answerIdx &&
                    (ref.unresolvedPath ?? []).length === 0
                ) {
                    inputs.push(component);
                }
            }
        }
        return inputs;
    }

    /**
     * The references an `<award>`'s `referencesAreResponses` names, each by
     * what it resolved to and the names after it.
     */
    function referencesNamed(award: SerializedComponent) {
        const attribute: any = attributeOf(award, "referencesAreResponses");
        if (attribute?.type !== "references") {
            return [];
        }
        return (attribute.references ?? []).flatMap((reference: any) => {
            const ref =
                reference?.componentType === "_copy"
                    ? refOf(reference)
                    : undefined;
            return ref
                ? [
                      {
                          nodeIdx: ref.nodeIdx,
                          path: JSON.stringify(
                              (ref.unresolvedPath ?? []).map(
                                  (part: any) => part.name,
                              ),
                          ),
                      },
                  ]
                : [];
        });
    }

    /**
     * The types of an `<answer>`'s responses (`currentResponses`, TYPE-2),
     * read from what is written as `Answer.js` reads them when the document
     * runs: the inputs written `forAnswer` it, then, in order, the responses
     * its awards hold, its inputs, and what its `<considerAsResponses>`
     * holds; or, with none of those, the references its awards hold, which
     * its sugar marked potential responses.
     *
     * The type of each, in order, when each gives one entry and their order
     * is known; else the one type they share, whatever their number; else
     * `undefined`, not decided. The input its sugar made, which it skips
     * when its awards read other inputs (`skippedFirstInput`), is counted
     * only among the types they share.
     */
    function answerResponseTypes(
        node: SerializedComponent,
        children: (SerializedComponent | string)[],
    ): string | string[] | undefined {
        if (node.componentType !== "answer") {
            // a copy of one, whose inputs are made again
            return undefined;
        }
        const responses: Response[] = [];
        const potential: Response[] = [];
        const uncertain: Response[] = [];
        let orderKnown = true;

        const forAnswer = inputsForAnswer(node.componentIdx);
        if (forAnswer.length > 1) {
            orderKnown = false;
        }
        responses.push(...forAnswer.map(responseOf));

        let firstInput = true;
        for (const child of children) {
            if (typeof child !== "object") {
                continue;
            }
            const tag = tagOfComponent(child);
            if (tag === undefined) {
                continue;
            }
            if (inherits(tag, "award")) {
                if (
                    child.componentType === "_copy" ||
                    child.doenetAttributes?.copiedAward
                ) {
                    // made from another award when the document runs
                    return undefined;
                }
                const found = awardResponses(
                    child.children ?? [],
                    referencesNamed(child),
                    { responses: [], potential: [] },
                );
                responses.push(...found.responses);
                potential.push(...found.potential);
            } else if (inherits(tag, "_input")) {
                const response = responseOf(child);
                if (
                    firstInput &&
                    child.doenetAttributes?.createdFromSugar &&
                    !inherits(tag, "choiceInput")
                ) {
                    // skipped, or not, as its awards decide when the document
                    // runs (`skippedFirstInput`)
                    uncertain.push(response);
                    orderKnown = false;
                } else {
                    responses.push(response);
                }
                firstInput = false;
            } else if (inherits(tag, "considerAsResponses")) {
                for (const held of child.children ?? []) {
                    if (typeof held === "string") {
                        if (held.trim() !== "") {
                            responses.push(responseOf(held));
                        }
                        continue;
                    }
                    if (held.componentType === "conditionalContent") {
                        const cases = (held.children ?? [])
                            .filter(
                                (part): part is SerializedComponent =>
                                    typeof part === "object",
                            )
                            .map((part) => ({
                                responses: withoutSugarGroup(
                                    part.children ?? [],
                                )
                                    .filter(
                                        (c) =>
                                            typeof c === "object" ||
                                            c.trim() !== "",
                                    )
                                    .map(responseOf),
                                potential: [],
                            }));
                        responses.push(...caseResponses(held, cases).responses);
                        continue;
                    }
                    responses.push(responseOf(held));
                }
            }
        }

        const chosen =
            responses.length > 0 || uncertain.length > 0
                ? [...responses, ...uncertain]
                : potential;
        if (chosen.length === 0 || chosen.some((r) => r.type === undefined)) {
            return undefined;
        }
        const types = [...new Set(chosen.map((r) => r.type!))];
        if (types.length === 1) {
            return types[0];
        }
        if (orderKnown && chosen.every((r) => r.count === 1)) {
            return chosen.map((r) => r.type!);
        }
        return undefined;
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
            } else if (base === "answer") {
                const types = answerResponseTypes(node, children);
                if (types !== undefined) {
                    result.currentResponses = types;
                    // what was submitted is of the types the DoenetML gives,
                    // never those saved (TYPE-4)
                    result.submittedResponses = types;
                }
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
        index,
    }: {
        componentType: string;
        node: SerializedComponent | undefined;
        name: string;
        numIndices: number;
        /** the index written after it, when it is a literal (`[2]`) */
        index?: number;
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
        let entryNameIndex: number | undefined;
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
            // the entry a name such as `currentResponse2` names
            const ending = variableName.substring(prefix.length);
            if (/^[1-9]\d*$/.test(ending) && entry.numDimensions === 1) {
                entryNameIndex = Number(ending);
            }
        }
        if (!description?.public) {
            return undefined;
        }
        const declared = description.createComponentOfType;
        if (typeof declared === "string") {
            return { type: declared, several, variableName: arrayVariable };
        }
        const decided = node ? propertyTypesOf(node)[arrayVariable] : undefined;
        // Of entries that may differ in type (TYPE-2), a literal index has
        // its entry's type, and the whole, or an index that can reach several
        // entries, the one type they share, if they share one.
        const type = Array.isArray(decided)
            ? index !== undefined && entryNameIndex === undefined
                ? decided[index - 1]
                : entryNameIndex !== undefined
                  ? decided[entryNameIndex - 1]
                  : new Set(decided).size === 1
                    ? decided[0]
                    : undefined
            : decided;
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
            index: literalIndex(part.index?.[0]),
        });
    }

    /** The index `piece` is written as, when it is a literal (`2`). */
    function literalIndex(piece: any): number | undefined {
        const value = piece?.value;
        if (
            Array.isArray(value) &&
            value.length === 1 &&
            typeof value[0] === "string" &&
            /^\s*[1-9]\d*\s*$/.test(value[0])
        ) {
            return Number(value[0]);
        }
        return undefined;
    }

    return {
        responseCaseErrors,
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
    const { propertyTypesOf, decidingClass, tagOf, responseCaseErrors } =
        propertyTypeReader({
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

    // A `<conditionalContent>` an answer reads responses of different types
    // from, one in each case, is an error at load (TYPE-2, COMP-11), shown in
    // place of it, as it would be in any case.
    for (const [container, { firstType, secondType }] of responseCaseErrors) {
        const diagnostic = {
            ...codedDiagnostic({
                type: "error",
                code: "doenet-e0082",
                args: { firstType, secondType },
            }),
            position: container.position,
            sourceDoc: container.sourceDoc,
        };
        diagnostics.push(diagnostic);
        const errorComponent = container as any;
        errorComponent.componentType = "_error";
        errorComponent.state = errorComponentState(
            diagnostic.message,
            diagnostic,
        );
        errorComponent.attributes = {};
        errorComponent.children = [];
        errorComponent.doenetAttributes = {};
    }
    return diagnostics;
}
