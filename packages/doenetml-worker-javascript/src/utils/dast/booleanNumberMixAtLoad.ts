/**
 * Booleans and numbers are kept apart unless the author asks (D47 decisions
 * 3 and 4, #2582), and a text is not ordered against a number (D58). Each is
 * a type mix, decided at load from what is written (DIAG-2), wherever it is:
 *
 * - **A boolean where a number or a math is wanted** (`doenet-w0203`,
 *   `booleanAsNumber`): a boolean child of a `<math>`, of a `<number>`
 *   without `convertBoolean`, of a list of numbers or maths, of a math
 *   operator, or of a math attribute (`<point x="$b">`), also one in a
 *   `<group>` written there (each item is judged), and a boolean in
 *   arithmetic inside a comparison (`<boolean>$b + 1 = 2</boolean>`). It is
 *   a blank in its place (VAL-5), and the warning names the way to ask for
 *   `1` or `0`: `<number convertBoolean>`, the one place a boolean is read
 *   as a number.
 * - **A number or a math where a boolean is wanted** (`numberAsBoolean`,
 *   and `literalAsBoolean` for a literal `1` or `0`): a `<boolean>`'s
 *   content, or a boolean attribute's (`hide="$n"`, `hide="1"`), or an
 *   operand of its `and`, `or` or `not`, and a number child of a
 *   `<booleanList>` or a boolean operator (`<and>`). The `<boolean>` is
 *   missing, and the warning suggests the comparison meant (`$n != 0`).
 * - **A boolean compared with a number** (`comparedWithNumber`):
 *   `<boolean>$b = 1</boolean>`. The `<boolean>` is missing. `$b = true`
 *   compares booleans.
 * - **A number compared with `true` or `false`**
 *   (`numberComparedWithBoolean`): `<boolean>$n = true</boolean>`, whose
 *   warning suggests a comparison such as `$n != 0`. The `<boolean>` is
 *   missing.
 * - **An input bound to the other type** (`mathInputBoundToBoolean`,
 *   `booleanInputBoundToNumber`): `<mathInput bindValueTo="$b">`, whose
 *   warning suggests a `<booleanInput>`, and the reverse. It is bound to a
 *   blank.
 * - **A text ordered against a number** (`doenet-w0204`): `<`, `>`, `<=` or
 *   `>=` between them is never true (`$s.sectionNumber > 2`). Nothing is
 *   converted, and `=` is unchanged. For a `sectionNumber`, the warning
 *   suggests `ownNumber` (D56).
 *
 * A mix is found also inside logic that is compared (`$bi = not ($b =
 * 1)`). In logic written as a tag, each child the mix is made of becomes a
 * blank, and the component is marked missing (`typeMixInLogic`, read by
 * `Boolean.js` and `When.js`), so logic built on the blank (`not ($b = 1)`)
 * is missing too, never `false` (#2656). In an attribute, an `extend` or a
 * `copy`, or for a literal, the whole content becomes one blank instead. A
 * tag written where a mix is (`<math><boolean name="q">true</boolean> +
 * 1</math>`) keeps its own value for references elsewhere: a new blank
 * takes its place, and the tag is kept in a `<setup>` (`blankPlace`).
 *
 * A type change between them (`<math extend="$b"/>`, `<boolean
 * extend="$n"/>`) is a REF-5 error, decided by `typeChangeRule`
 * (`typeChange.js`), not here.
 *
 * What is written on an `extend` or a `copy` (`<boolean extend="$c">$n</boolean>`,
 * `<p extend="$pp" hide="$n"/>`) is checked as it would be on a tag of the
 * type it makes: its attributes are kept as written until the reference is
 * expanded, so each is read as the attribute component it will become.
 *
 * What a child is, is read as `itemReader` reads the items of a `<sort>`
 * (`reorderedItemsAtLoad.ts`): a bare reference is its referent's type, a
 * property its declared or decided type (TYPE, D45), a list its entries'
 * type, and a wrapper of one component that component. A child whose type
 * the DoenetML doesn't decide, or a wrapper holding several, is not judged.
 * A composite (and a reference to one) is read once (`summaryOf`), so
 * composites whose cases name the same composite don't make the reading
 * exponential.
 *
 * Runs after sugar (which wraps a `<number>`'s several children in a
 * `<math>`, and splits a `<booleanList>`'s text) and after the type-change
 * check, and before the list forms and the value references, while each
 * reference is still a `_copy`, and before the checks of random choices
 * (SEL-6), which then read the blank.
 */
import type { SerializedAttribute, SerializedComponent } from "./types";
import type { ComponentInfoObjects } from "../componentInfoObjects";
import type { DiagnosticRecord } from "@doenet/utils";
import { codedDiagnostic } from "../diagnostics";
import { documentReferents } from "./valueReferences";
import { itemReader } from "./reorderedItemsAtLoad";
import { unwrapSource } from "./convertNormalizedDast";
import { literalText } from "./choiceErrorsAtLoad";
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { buildParsedExpression } from "../booleanLogic";
import me from "math-expressions";

/** Why a value is a type mix (`doenet-w0203`'s `reason`). */
type MixReason =
    | "booleanAsNumber"
    | "numberAsBoolean"
    | "literalAsBoolean"
    | "comparedWithNumber"
    | "numberComparedWithBoolean"
    | "mathInputBoundToBoolean"
    | "booleanInputBoundToNumber";

/** The relations that order (D58); `=` and `≠` don't. */
const ORDERINGS = new Set(["<", ">", "le", "ge", "lts", "gts"]);

/** The relations between two values, which compare them. */
const RELATIONS = new Set([...ORDERINGS, "=", "ne"]);

/** The operators of logic, whose operands are each true or false. */
const LOGIC = new Set(["and", "or", "not"]);

/**
 * The operators of arithmetic, whose value is a number. A function applied
 * (`apply`) is not one: `isnumber($x)` is true or false, and what another
 * function gives isn't known here.
 */
const ARITHMETIC = new Set(["+", "-", "*", "/", "^"]);

/** What a value read at load is, for this check. */
type ValueType = "math" | "boolean" | "text";

export function checkBooleanNumberMixAtLoad({
    serializedComponents,
    componentInfoObjects,
    sources,
    nComponents,
}: {
    serializedComponents: (SerializedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    sources: string[];
    nComponents: number;
}): { diagnostics: DiagnosticRecord[]; nComponents: number } {
    const diagnostics: DiagnosticRecord[] = [];
    const referents = documentReferents({
        serializedComponents,
        componentInfoObjects,
        typeRepeatValues: true,
    });
    const reader = itemReader({ componentInfoObjects, referents });
    const allClasses = componentInfoObjects.allComponentClasses as Record<
        string,
        any
    >;
    const booleanClass = allClasses.boolean;

    function inherits(componentType: string, base: string) {
        return componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType: base,
        });
    }

    /**
     * The type of the value `child` is, and the tag it is of, when the
     * DoenetML decides it: one component, or a list or wrapper whose
     * components are all of one type.
     */
    function valueOf(
        child: SerializedComponent,
    ): { type: ValueType; tag: string } | undefined {
        const value = summaryOf(child);
        return value === "none" ? undefined : value;
    }

    /**
     * What `component` is, as `itemReader` reads it, folded as it is read:
     * the one type of value its items are of (and the first one's tag),
     * `"none"` for no items, or `undefined` when they aren't all one
     * component of one value type, or may be others not known. A composite
     * written plainly (a `<conditionalContent>`, `<select>`, `<group>`,
     * repeat, `<sort>` or `<shuffle>`), and a reference to one, is read
     * here, once per component: each of its cases may name the same
     * composite, and listing the items of every path, as `itemReader` does,
     * can take time and memory exponential in how deep they nest.
     * Everything else is read by `itemReader`.
     */
    type Summary = ValueSummary;
    const summaryCache = new Map<number, Summary>();
    const reading = new Set<number>();
    function summaryOf(component: SerializedComponent): Summary {
        const idx = component.componentIdx;
        if (summaryCache.has(idx)) {
            return summaryCache.get(idx);
        }
        if (reading.has(idx)) {
            // a cycle, an error of its own at load
            return undefined;
        }
        reading.add(idx);
        const summary = readSummaryOf(component);
        reading.delete(idx);
        summaryCache.set(idx, summary);
        return summary;
    }
    function readSummaryOf(component: SerializedComponent): Summary {
        const type = component.componentType;
        if (type === "_error") {
            return undefined;
        }
        if (type === "_copy") {
            const target = plainReferent(component);
            return target === undefined
                ? itemsSummary(component)
                : summaryOf(target);
        }
        if (component.extending !== undefined) {
            return itemsSummary(component);
        }
        if (type === "select" || type === "conditionalContent") {
            // every pick or case, each a wrapper of what it holds
            let summary: Summary = "none";
            for (const part of component.children ?? []) {
                if (typeof part !== "object") {
                    continue;
                }
                if (
                    part.componentType !== "option" &&
                    part.componentType !== "case"
                ) {
                    return undefined;
                }
                summary = union(
                    summary,
                    wrapperSummary(withoutSugarGroup(part.children ?? [])),
                );
            }
            return summary;
        }
        if (type === "group") {
            return wrapperSummary(component.children ?? []);
        }
        if (
            type === "repeat" ||
            type === "repeatForSequence" ||
            type === "sort" ||
            type === "shuffle"
        ) {
            if (component.doenetAttributes?.reorderErrorAtLoad) {
                return undefined;
            }
            if (type === "repeat" || type === "repeatForSequence") {
                // each iteration is a wrapper of the template
                return wrapperSummary(component.children ?? []);
            }
            // flattened into its items
            let summary: Summary = "none";
            for (const child of component.children ?? []) {
                if (typeof child === "object") {
                    summary = union(summary, summaryOf(child));
                }
            }
            return summary;
        }
        return itemsSummary(component);
    }

    /**
     * The component the reference `copy` names, when what it is is what
     * that component is (`itemsOfCopy`), and that is a composite read here
     * or another reference; otherwise `undefined`.
     */
    function plainReferent(
        copy: SerializedComponent,
    ): SerializedComponent | undefined {
        if (!copy.extending) {
            return undefined;
        }
        const createdType = copy.attributes?._createComponentOfType;
        const written =
            createdType === undefined
                ? undefined
                : componentInfoObjects.componentTypeAsWritten(
                      String(literalText(createdType) ?? ""),
                  );
        if (
            (written !== undefined &&
                !componentInfoObjects.isCompositeComponent({
                    componentType: written,
                    includeNonStandard: true,
                })) ||
            (copy.children ?? []).some((child) =>
                typeof child === "string" ? child.trim() !== "" : true,
            )
        ) {
            return undefined;
        }
        const ref: any = unwrapSource(copy.extending as any);
        if (!ref || ref.nodeIdx < 0 || (ref.unresolvedPath ?? []).length > 0) {
            return undefined;
        }
        const node =
            referents.componentsByIdx.get(ref.nodeIdx) ??
            referents.copiesByCreatedIdx.get(ref.nodeIdx);
        if (
            node === undefined ||
            !(
                node.componentType === "_copy" ||
                (node.extending === undefined &&
                    READ_HERE.has(node.componentType))
            )
        ) {
            return undefined;
        }
        return node;
    }

    /** What a wrapper holding `children` is (`wrapperItems`). */
    function wrapperSummary(children: (SerializedComponent | string)[]) {
        const held = children.filter((child) =>
            typeof child === "string"
                ? child.trim() !== ""
                : child.componentType !== "setup" &&
                  child.componentType !== "_repeatSetup",
        );
        if (
            held.some(
                (child) =>
                    typeof child === "object" &&
                    child.componentType === "_error",
            )
        ) {
            return undefined;
        }
        if (held.length === 0) {
            return "none";
        }
        if (held.length > 1) {
            // an item of several components, which has no one value
            return undefined;
        }
        const [only] = held;
        return typeof only === "string"
            ? { type: "text" as const, tag: "text" }
            : summaryOf(only);
    }

    /** What `component` is, read by `itemReader`. */
    function itemsSummary(component: SerializedComponent): Summary {
        const { items, unknown } = reader.itemsOfChildren(
            [component],
            new Set(),
        );
        if (unknown) {
            return undefined;
        }
        let summary: Summary = "none";
        for (const item of items) {
            if (item.kind !== "one") {
                return undefined;
            }
            const type = reader.typeOf(item);
            if (type !== "math" && type !== "boolean" && type !== "text") {
                return undefined;
            }
            summary = union(summary, { type, tag: item.tag });
        }
        return summary;
    }

    /**
     * Whether a child of `componentType` is taken by a component of class
     * `parentClass`, as `ChildMatcher`'s `findChildGroup` decides: as its
     * own type, or as the type of one of its adapters.
     */
    function takes(parentClass: any, componentType: string) {
        const takesAs = (type: string) =>
            (parentClass.childGroups ?? []).some((group: any) =>
                group.componentTypes.some((base: string) =>
                    inherits(type, base),
                ),
            );
        if (takesAs(componentType)) {
            return true;
        }
        const childClass = allClasses[componentType];
        for (let n = 0; n < (childClass?.numAdapters ?? 0); n++) {
            const adapterType = childClass.getAdapterComponentType(
                n,
                componentInfoObjects.publicStateVariableInfo,
            );
            if (adapterType && takesAs(adapterType)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Whether `attribute` is written as true (`convertBoolean`,
     * `convertBoolean="true"`), or may be, as a reference.
     */
    function mayBeTrue(attribute: SerializedAttribute | undefined) {
        const attr: any = attribute;
        if (attr === undefined) {
            return false;
        }
        if (attr.type === "primitive") {
            return (
                attr.primitive.value === true ||
                String(attr.primitive.value).trim().toLowerCase() === "true"
            );
        }
        if (attr.type === "component" || attr.type === "unresolved") {
            // an attribute of a reference is kept as written (unresolved)
            const component = attr.type === "component" ? attr.component : attr;
            if (typeof component.state?.value === "boolean") {
                return component.state.value;
            }
            const children = component.children ?? [];
            if (children.every((c: unknown) => typeof c === "string")) {
                // read as a boolean primitive is (`convertNormalizedDast`):
                // true written with no value, else only the word `true`
                return (
                    children.length === 0 ||
                    children.join("").trim().toLowerCase() === "true"
                );
            }
            return true;
        }
        return true;
    }

    /**
     * Whether the number `component` may convert booleans: `convertBoolean`
     * written on it, or, when it is an `extend` or a `copy` that doesn't
     * write it, on the component it copies, whose attributes it takes
     * (`<number extend="$nc">$b</number>` of a `<number convertBoolean>`).
     * When that component isn't known, it may.
     */
    function mayConvertBoolean(
        component: SerializedComponent,
        seen = new Set<SerializedComponent>(),
    ): boolean {
        const written = component.attributes?.convertBoolean;
        if (written !== undefined || component.componentType !== "_copy") {
            return mayBeTrue(written);
        }
        if (seen.has(component)) {
            return true;
        }
        seen.add(component);
        const ref: any = component.extending
            ? unwrapSource(component.extending as any)
            : undefined;
        if (!ref || ref.nodeIdx < 0) {
            return false;
        }
        if ((ref.unresolvedPath ?? []).length > 0) {
            return true;
        }
        const node =
            referents.componentsByIdx.get(ref.nodeIdx) ??
            referents.copiesByCreatedIdx.get(ref.nodeIdx);
        return node === undefined || node === component
            ? true
            : mayConvertBoolean(node, seen);
    }

    /** `child` as the author wrote it, for the message. */
    function asWritten(child: SerializedComponent): {
        source: string;
        form: "reference" | "tag";
    } {
        if (child.componentType === "_copy" && child.extending) {
            const ref: any = unwrapSource(child.extending as any);
            const source = doenetMLReferenceAsWritten(
                ref?.originalPath,
                sources,
            );
            if (source !== "") {
                return { source, form: "reference" };
            }
        }
        const tag =
            child.componentType === "_copy"
                ? String(
                      (child.attributes?._createComponentOfType as any)
                          ?.primitive?.value ?? "boolean",
                  )
                : child.componentType;
        return { source: `<${tag}>`, form: "tag" };
    }

    /**
     * `child` as the author wrote it, as `asWritten`, with the form `list`
     * for a reference to a list (`$bl`), whose message suggests an entry
     * (`$bl[1]`).
     */
    function asWrittenOrList(child: SerializedComponent): {
        source: string;
        form: "reference" | "tag" | "list";
    } {
        const written = asWritten(child);
        if (written.form !== "reference") {
            return written;
        }
        const createdType = child.attributes?._createComponentOfType;
        let type: string | undefined =
            createdType === undefined
                ? undefined
                : componentInfoObjects.componentTypeAsWritten(
                      String(literalText(createdType) ?? ""),
                  );
        if (type === undefined) {
            const ref: any = unwrapSource(child.extending as any);
            if (
                ref &&
                ref.nodeIdx >= 0 &&
                (ref.unresolvedPath ?? []).length === 0
            ) {
                type = referents.referentType(ref.nodeIdx);
            }
        }
        const typeClass = type === undefined ? undefined : allClasses[type];
        return typeClass?.listEntryComponentType !== undefined ||
            typeClass?.listEntryTypeAttribute !== undefined
            ? { ...written, form: "list" }
            : written;
    }

    /**
     * `component` as the author wrote it in full: a reference, or a tag's
     * source text (`<boolean>true</boolean>`).
     */
    function fullyAsWritten(component: SerializedComponent): string {
        const { source, form } = asWritten(component);
        if (form === "reference") {
            return source;
        }
        const start = component.position?.start?.offset;
        const end = component.position?.end?.offset;
        const text = sources[component.sourceDoc ?? 0];
        if (
            typeof start === "number" &&
            typeof end === "number" &&
            text?.[start] === "<"
        ) {
            return text.substring(start, end);
        }
        return source;
    }

    /**
     * Make `component` a blank: a reference that names nothing (D37).
     * `written` is what it stands for, as written, which a random choice's
     * error names (SEL-6, `choiceFeasibilityAtLoad.ts`).
     */
    function blank(component: SerializedComponent, written?: string) {
        written ??= fullyAsWritten(component);
        const ref: any =
            component.componentType === "_copy" && component.extending
                ? unwrapSource(component.extending as any)
                : undefined;
        const blanked = component as any;
        blanked.componentType = "_copy";
        blanked.attributes = {};
        blanked.children = [];
        blanked.state = {};
        // `typeMixAtLoad`: a selection's parameter that is one is not
        // analysable (SEL-6, `choiceFeasibilityAtLoad.ts`)
        blanked.doenetAttributes = {
            noReferent: true,
            typeMixAtLoad: true,
            typeMixSource: written,
        };
        blanked.extending = {
            Ref: {
                nodeIdx: -1,
                unresolvedPath: null,
                originalPath: ref?.originalPath ?? [],
                nodesInResolvedPath: [],
            },
        };
    }

    /**
     * Make the place of `child`, one of `parent`'s children, a blank (VAL-5).
     * A bare reference (`$b`) is that place, and is made the blank. A tag
     * written there (`<boolean name="q">true</boolean>`, also one written
     * with `extend` or `copy`) is a component of its own, which a reference
     * elsewhere (`$q`) still reads: a new blank takes its place, and the tag
     * is kept in a `<setup>` after it, which shows nothing and gives its
     * parent nothing.
     */
    function blankPlace(
        parent: SerializedComponent,
        child: SerializedComponent,
    ) {
        if (child.doenetAttributes?.typeMixAtLoad) {
            return;
        }
        const children = parent.children ?? [];
        const ind = children.indexOf(child);
        if (isBareReference(child) || ind === -1) {
            blank(child);
            return;
        }
        const sourceDoc = child.sourceDoc ?? parent.sourceDoc;
        children[ind] = newBlank(
            child.position,
            sourceDoc,
            fullyAsWritten(child),
        );
        children.push(setupHolding([child], child.position, sourceDoc));
    }

    /**
     * A new `<setup>` holding `tags`, which keeps them, for references
     * elsewhere to read, while it shows nothing and gives its parent
     * nothing.
     */
    function setupHolding(
        tags: SerializedComponent[],
        position: SerializedComponent["position"],
        sourceDoc: number | undefined,
    ): SerializedComponent {
        return {
            type: "serialized",
            componentType: "setup",
            componentIdx: nComponents++,
            attributes: {},
            children: tags,
            state: {},
            doenetAttributes: {},
            position,
            sourceDoc,
        };
    }

    /** A new blank, to stand for content that is all literal. */
    function newBlank(
        position: SerializedComponent["position"],
        sourceDoc: number | undefined,
        written: string,
    ): SerializedComponent {
        const component: SerializedComponent = {
            type: "serialized",
            componentType: "_copy",
            componentIdx: nComponents++,
            attributes: {},
            children: [],
            state: {},
            doenetAttributes: {},
            position,
            sourceDoc,
        };
        blank(component, written);
        return component;
    }

    /**
     * Report a type mix. `inAttribute` is whether it is written in an
     * attribute (`<point x="$b">`), where no tag can be written, so the
     * message suggests a `<number convertBoolean>` written outside it.
     */
    function warn({
        reason,
        source,
        form,
        literal,
        position,
        sourceDoc,
        inAttribute,
    }: {
        reason: MixReason;
        source: string;
        form: "reference" | "tag" | "list" | "literal" | "expression";
        literal?: string;
        position: SerializedComponent["position"];
        sourceDoc: number | undefined;
        inAttribute: boolean;
    }) {
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0203",
                args: {
                    reason,
                    source,
                    form,
                    place: inAttribute ? "attribute" : "content",
                    literal: literal ?? "",
                },
                position,
                sourceDoc,
            }),
        );
    }

    /**
     * The content of `component`, a `<boolean>` or a component that reads
     * its content as one (a `<when>`, a boolean attribute), read as logic:
     * a number or a math at a place of logic, a boolean compared with a
     * number, and a text ordered against a number. With `bound`, it is the
     * `bindValueTo` of a `<booleanInput>`; with `inAttribute`, it is written
     * in an attribute.
     */
    function checkLogic(
        component: SerializedComponent,
        fallback: SerializedComponent["position"],
        bound: boolean,
        inAttribute: boolean,
    ) {
        const children = component.children ?? [];
        const objects = children.filter(
            (c): c is SerializedComponent => typeof c === "object",
        );
        if (objects.length === 0 && children.join("").trim() === "") {
            return;
        }
        const strings = children.filter(
            (c): c is string => typeof c === "string",
        );
        let parsed: any;
        let codePre: string;
        try {
            const result = buildParsedExpression({
                dependencyValues: {
                    stringChildren: strings,
                    allChildren: children.map((c) =>
                        typeof c === "string"
                            ? c
                            : { componentType: c.componentType },
                    ),
                },
                componentInfoObjects,
                doNotSplit: true,
            }).setValue;
            parsed = result.parsedExpression;
            codePre = result.codePre;
        } catch (e) {
            return;
        }
        if (!parsed) {
            return;
        }
        const position = component.position ?? fallback;
        const sourceDoc = component.sourceDoc;
        const childOfCode = (code: unknown) => {
            if (typeof code !== "string" || !code.startsWith(codePre)) {
                return undefined;
            }
            const ind = Number(code.slice(codePre.length));
            return Number.isInteger(ind) ? objects[ind] : undefined;
        };

        /**
         * What `tree` is: a number or math, a boolean, or a text, if known,
         * and the child it is, if it is one.
         */
        function typeOfTree(tree: any): {
            type?: ValueType;
            child?: SerializedComponent;
        } {
            const child = childOfCode(tree);
            if (child) {
                return { type: valueOf(child)?.type, child };
            }
            if (typeof tree === "number") {
                return { type: "math" };
            }
            if (
                typeof tree === "boolean" ||
                tree === "true" ||
                tree === "false"
            ) {
                return { type: "boolean" };
            }
            if (Array.isArray(tree)) {
                const [operator, ...operands] = tree;
                if (RELATIONS.has(operator) || LOGIC.has(operator)) {
                    return { type: "boolean" };
                }
                // Components written side by side (`$s $m`, a product of
                // codes alone) are not taken for arithmetic: an award's
                // `<when>` may hold its responses that way.
                const sideBySide =
                    operator === "*" &&
                    operands.every((x) => childOfCode(x) !== undefined);
                if (
                    ARITHMETIC.has(operator) &&
                    !sideBySide &&
                    operands.some((x) => typeOfTree(x).type === "math")
                ) {
                    return { type: "math" };
                }
            }
            return {};
        }

        const found: {
            reason: MixReason;
            source: string;
            form: "reference" | "tag" | "list" | "literal" | "expression";
            /** the word `true` or `false` a number is compared with */
            literal?: string;
            /** in full, for a random choice's error */
            written: string;
            /**
             * the children it is made of, which are made blanks, or none,
             * for a literal, when the whole content is
             */
            children: SerializedComponent[];
        }[] = [];
        const orderings: {
            source: string;
            operator: string;
            sectionOf?: string;
        }[] = [];

        function describe(
            tree: any,
            child?: SerializedComponent,
        ): {
            source: string;
            form: "reference" | "tag" | "list" | "literal" | "expression";
        } {
            if (child) {
                return asWrittenOrList(child);
            }
            if (typeof tree === "number") {
                return { source: String(tree), form: "literal" };
            }
            // an expression, with each child it holds as written (`$n + 1`)
            let source: string;
            try {
                source = me.fromAst(tree).toString();
            } catch (e) {
                source = String(tree);
            }
            const codes = objects
                .map((child, ind) => ({ code: codePre + ind, child }))
                .reverse(); // `comp10` before `comp1`
            for (const { code, child } of codes) {
                source = source.split(code).join(asWritten(child).source);
            }
            return { source, form: "expression" };
        }

        /**
         * The boolean children that are operands of arithmetic in `tree`, a
         * value compared (`$b` of `$b + 1`), but not of a function applied
         * (`isnumber($x)`) or of components written side by side, which
         * `typeOfTree` doesn't take for arithmetic either.
         */
        function booleansInArithmetic(tree: any): SerializedComponent[] {
            if (!Array.isArray(tree)) {
                return [];
            }
            const [operator, ...operands] = tree;
            const sideBySide =
                operator === "*" &&
                operands.every((x) => childOfCode(x) !== undefined);
            if (!ARITHMETIC.has(operator) || sideBySide) {
                return [];
            }
            return operands.flatMap((operand) => {
                const child = childOfCode(operand);
                if (child) {
                    return valueOf(child)?.type === "boolean" ? [child] : [];
                }
                return booleansInArithmetic(operand);
            });
        }

        /** The children of a number or a math in `tree`. */
        function mathChildrenIn(tree: any): SerializedComponent[] {
            const child = childOfCode(tree);
            if (child) {
                return valueOf(child)?.type === "math" ? [child] : [];
            }
            return Array.isArray(tree)
                ? tree.slice(1).flatMap(mathChildrenIn)
                : [];
        }

        function atPlaceOfLogic(tree: any) {
            if (Array.isArray(tree) && LOGIC.has(tree[0])) {
                tree.slice(1).forEach(atPlaceOfLogic);
                return;
            }
            if (Array.isArray(tree) && RELATIONS.has(tree[0])) {
                relation(tree);
                return;
            }
            const { type, child } = typeOfTree(tree);
            if (type === "math") {
                const { source, form } = describe(tree, child);
                found.push({
                    reason: bound
                        ? "booleanInputBoundToNumber"
                        : form === "literal"
                          ? "literalAsBoolean"
                          : "numberAsBoolean",
                    source,
                    form,
                    written: child ? fullyAsWritten(child) : source,
                    children: child ? [child] : mathChildrenIn(tree),
                });
            }
        }

        function relation(tree: any[]) {
            const operator = tree[0];
            // A chain (`1 < $t <= 3`) is `lts` or `gts` of the tuple of its
            // operands, each pair ordered, and the tuple of whether each
            // ordering is strict.
            const chained = operator === "lts" || operator === "gts";
            const operands = chained
                ? Array.isArray(tree[1]) && tree[1][0] === "tuple"
                    ? tree[1].slice(1)
                    : []
                : tree.slice(1);
            const orders = chained || ORDERINGS.has(operator);
            const typed = operands.map((x: any) => ({
                tree: x,
                ...typeOfTree(x),
            }));
            // Logic compared (`$bi = not ($b = 1)`) is read as logic too.
            for (const operand of operands) {
                if (
                    Array.isArray(operand) &&
                    (LOGIC.has(operand[0]) || RELATIONS.has(operand[0]))
                ) {
                    atPlaceOfLogic(operand);
                }
            }
            // A boolean in arithmetic (`$b + 1 = 2`) is one where a number
            // is wanted, as in a `<math>`.
            for (const { tree: operand } of typed) {
                for (const child of booleansInArithmetic(operand)) {
                    found.push({
                        reason: "booleanAsNumber",
                        ...asWrittenOrList(child),
                        written: fullyAsWritten(child),
                        children: [child],
                    });
                }
            }
            for (let i = 0; i + 1 < typed.length; i++) {
                const pair = [typed[i], typed[i + 1]];
                const boolean = pair.find((x) => x.type === "boolean");
                const number = pair.find((x) => x.type === "math");
                const text = pair.find((x) => x.type === "text");
                if (boolean && number && boolean.child) {
                    found.push({
                        reason: "comparedWithNumber",
                        ...asWritten(boolean.child),
                        written: fullyAsWritten(boolean.child),
                        children: [boolean.child],
                    });
                } else if (
                    boolean &&
                    number &&
                    booleanLiteral(boolean.tree) !== undefined
                ) {
                    // a number compared with the word `true` or `false`
                    // (`$n = true`)
                    const { source, form } = describe(
                        number.tree,
                        number.child,
                    );
                    found.push({
                        reason: "numberComparedWithBoolean",
                        source,
                        form,
                        literal: booleanLiteral(boolean.tree),
                        written: number.child
                            ? fullyAsWritten(number.child)
                            : source,
                        children: number.child
                            ? [number.child]
                            : mathChildrenIn(number.tree),
                    });
                }
                if (orders && text && number && text.child) {
                    const { source } = asWritten(text.child);
                    orderings.push({
                        source,
                        operator: chained
                            ? chainedOrdering(operator, tree[2], i)
                            : ORDERING_AS_WRITTEN[operator],
                        ...(sectionNumberOf(text.child, source) !== undefined
                            ? {
                                  sectionOf: sectionNumberOf(
                                      text.child,
                                      source,
                                  ),
                              }
                            : {}),
                    });
                }
            }
        }

        atPlaceOfLogic(parsed.tree);

        for (const { reason, source, form, literal } of found) {
            warn({
                reason,
                source,
                form,
                literal,
                position,
                sourceDoc,
                inAttribute,
            });
        }
        for (const { source, operator, sectionOf } of orderings) {
            diagnostics.push(
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0204",
                    args: {
                        source,
                        operator,
                        sectionOf: sectionOf ?? "",
                        isSectionNumber:
                            sectionOf === undefined ? "false" : "true",
                    },
                    position,
                    sourceDoc,
                }),
            );
        }
        if (found.length > 0) {
            // A type mix is a blank in its place (VAL-5), and logic made from
            // a blank is missing: a missing value never equals anything, so
            // `<boolean>$b = 1</boolean>` must not be `false`, which a
            // `<booleanInput>`'s answer would credit. In a component written
            // as a tag, each child the mix is made of is made a blank, so
            // that what else is written stays (an award's responses), and
            // the component is marked missing (`typeMixInLogic`, read by
            // `computedFromMissing` in `Boolean.js` and by `When.js`).
            // Otherwise (in an attribute, in an `extend` or a `copy`, whose
            // mark would not reach what it makes, and for a literal, `1`),
            // the whole content is made one blank, so the component is
            // missing as its content is; a tag written in it is kept in a
            // `<setup>`, for a reference elsewhere to read.
            if (
                !inAttribute &&
                component.componentType !== "_copy" &&
                found.every((item) => item.children.length > 0)
            ) {
                for (const item of found) {
                    for (const child of item.children) {
                        blankPlace(component, child);
                    }
                }
                component.doenetAttributes = {
                    ...component.doenetAttributes,
                    typeMixInLogic: true,
                };
            } else {
                const tags = objects.filter((c) => !isBareReference(c));
                component.children = [
                    newBlank(position, sourceDoc, found[0].written),
                    ...(tags.length > 0
                        ? [setupHolding(tags, position, sourceDoc)]
                        : []),
                ];
            }
        }
    }

    /**
     * Check the children of `component`, and then everything in it. `owner`
     * and `attributeName` are the component and attribute it is the
     * attribute component of, if it is one, `parentPosition` where its
     * parent is reported, and `inAttribute` whether it is written in an
     * attribute (an attribute component, or what it holds).
     */
    function visit(
        component: SerializedComponent,
        owner?: SerializedComponent,
        attributeName?: string,
        parentPosition?: SerializedComponent["position"],
        inAttribute = false,
    ) {
        // A reference that makes a component (`<boolean extend="$c">$n</boolean>`)
        // takes what is written in it as that component would.
        const checkedType =
            component.componentType === "_copy"
                ? createdTypeOf(component)
                : component.componentType;
        const componentClass =
            checkedType === undefined ? undefined : allClasses[checkedType];
        // Where to report what has no position of its own: a component the
        // sugar made (a `<boolean>` from a `<booleanList>`'s text) is
        // reported at its parent, and an attribute component at its
        // attribute.
        const fallback =
            component.position ??
            (owner && attributeName
                ? ((owner.attributes[attributeName] as any)?.position ??
                  owner.position)
                : parentPosition);
        const bound =
            attributeName === "bindValueTo" && owner !== undefined
                ? owner.componentType
                : undefined;

        if (componentClass) {
            if (
                componentClass.returnChildGroups ===
                booleanClass?.returnChildGroups
            ) {
                checkLogic(
                    component,
                    fallback,
                    bound !== undefined && inherits(bound, "booleanInput"),
                    inAttribute,
                );
            } else {
                const isNumber = inherits(checkedType!, "number");
                // Only a component that takes one of the two types, and not
                // the other, can find a mix among its children: read what
                // they are only then, as reading a reference can follow
                // every branch of the composites it names.
                const takesMath =
                    takes(componentClass, "math") ||
                    takes(componentClass, "number");
                const takesBoolean = takes(componentClass, "boolean");
                /**
                 * Judge `child`, one of the children of `holder`: the
                 * component itself, or a `<group>` among them, written in
                 * place, which holds values of several types (a boolean
                 * beside a math), each judged in its place.
                 */
                function judge(
                    holder: SerializedComponent,
                    child: SerializedComponent,
                ) {
                    const value = valueOf(child);
                    if (value === undefined) {
                        if (
                            child.componentType === "group" &&
                            child.extending === undefined
                        ) {
                            for (const held of [...(child.children ?? [])]) {
                                if (typeof held === "object") {
                                    judge(child, held);
                                }
                            }
                        }
                        return;
                    }
                    let reason: MixReason | undefined;
                    // Taken neither as its tag (an input, a `<sum>`)
                    // nor as its value's type, but the other type is
                    // wanted (`ChildMatcher` would drop it, `w0107`).
                    const takesIt =
                        takes(componentClass, value.tag) ||
                        (value.type === "boolean"
                            ? takes(componentClass, "boolean")
                            : takes(componentClass, "math") ||
                              takes(componentClass, "number"));
                    if (value.type === "boolean") {
                        const wantsNumber = isNumber
                            ? true
                            : !takesIt &&
                              (takes(componentClass, "math") ||
                                  takes(componentClass, "number"));
                        if (wantsNumber) {
                            reason =
                                bound !== undefined &&
                                inherits(bound, "mathInput")
                                    ? "mathInputBoundToBoolean"
                                    : "booleanAsNumber";
                        }
                    } else if (value.type === "math" && !isNumber) {
                        if (!takesIt && takes(componentClass, "boolean")) {
                            reason = "numberAsBoolean";
                        }
                    }
                    if (reason !== undefined) {
                        const { source, form } = asWrittenOrList(child);
                        warn({
                            reason,
                            source,
                            form,
                            position: child.position ?? fallback,
                            sourceDoc: child.sourceDoc ?? component.sourceDoc,
                            inAttribute,
                        });
                        blankPlace(holder, child);
                    }
                }
                if (
                    isNumber
                        ? !mayConvertBoolean(component)
                        : takesMath !== takesBoolean
                ) {
                    // a copy: a child judged may be moved into a `<setup>`
                    for (const child of [...(component.children ?? [])]) {
                        if (typeof child === "object") {
                            judge(component, child);
                        }
                    }
                }
            }
        }

        for (const child of component.children ?? []) {
            if (typeof child === "object") {
                visit(child, undefined, undefined, fallback, inAttribute);
            }
        }
        for (const [name, attribute] of Object.entries(
            component.attributes ?? {},
        )) {
            if (attribute.type === "component") {
                visit(
                    attribute.component,
                    component,
                    name,
                    undefined,
                    inAttribute || writtenInTag(attribute.component, component),
                );
            }
        }
        if (component.componentType === "_copy") {
            visitAttributesAsWritten(component);
        }
    }

    /**
     * Check the attributes written on a reference that makes a component
     * (`<p extend="$pp" hide="$n"/>`, `<point copy="$P" x="$b"/>`). They
     * are kept as written until the reference is expanded, so each is read
     * here as the attribute component it will become, and what in it is
     * blanked stays blanked in what is written.
     */
    function visitAttributesAsWritten(copy: SerializedComponent) {
        const createdType = createdTypeOf(copy);
        if (createdType === undefined) {
            return;
        }
        const attributeDefinitions = attributesObjectOf(createdType);
        const owner = { ...copy, componentType: createdType };
        for (const [name, attribute] of Object.entries(copy.attributes ?? {})) {
            const written: any = attribute;
            const type = attributeDefinitions[name]?.createComponentOfType;
            if (
                written.type !== "unresolved" ||
                typeof type !== "string" ||
                allClasses[type] === undefined
            ) {
                continue;
            }
            const stand: SerializedComponent = {
                type: "serialized",
                componentType: type,
                componentIdx: -1,
                attributes: {},
                children: written.children ?? [],
                state: {},
                doenetAttributes: {},
                sourceDoc: written.sourceDoc ?? copy.sourceDoc,
            };
            visit(stand, owner, name, undefined, true);
            // content all literal is made one new blank
            written.children = stand.children;
        }
    }

    /** The type of component the reference `copy` makes, if written. */
    function createdTypeOf(copy: SerializedComponent) {
        const created = copy.attributes?._createComponentOfType;
        return created === undefined
            ? undefined
            : componentInfoObjects.componentTypeAsWritten(
                  String(literalText(created) ?? ""),
              );
    }

    const attributesObjects = new Map<string, Record<string, any>>();
    /** The attributes a component of `componentType` takes, by name. */
    function attributesObjectOf(componentType: string): Record<string, any> {
        let attributes = attributesObjects.get(componentType);
        if (attributes === undefined) {
            attributes = allClasses[componentType].createAttributesObject();
            attributesObjects.set(componentType, attributes!);
        }
        return attributes!;
    }

    /**
     * Whether `attributeComponent`, an attribute component of `owner`, was
     * written in `owner`'s tag (`<point x="$b">`) rather than made by a
     * sugar from its children (`<point>($b, 2)</point>`, whose `xs` hold
     * what was written as content): what it holds lies outside `owner`'s
     * children.
     */
    function writtenInTag(
        attributeComponent: SerializedComponent,
        owner: SerializedComponent,
    ): boolean {
        const offset = firstOffsetIn(attributeComponent);
        if (offset === undefined) {
            return false;
        }
        const start = owner.childrenPosition?.start?.offset;
        const end = owner.childrenPosition?.end?.offset;
        return !(
            typeof start === "number" &&
            typeof end === "number" &&
            offset >= start &&
            offset <= end
        );
    }

    /** The offset in the source of the first thing in `component` written. */
    function firstOffsetIn(component: SerializedComponent): number | undefined {
        const offset = component.position?.start?.offset;
        if (typeof offset === "number") {
            return offset;
        }
        for (const child of component.children ?? []) {
            if (typeof child === "object") {
                const found = firstOffsetIn(child);
                if (found !== undefined) {
                    return found;
                }
            }
        }
        return undefined;
    }

    for (const component of serializedComponents) {
        if (typeof component === "object") {
            visit(component);
        }
    }

    return { diagnostics, nComponents };
}

/**
 * How the `index`th ordering of a chain (`lts` or `gts`, with `strict` the
 * tuple of whether each is strict) is written: `1 <= $t < 3` is `<=` then
 * `<`.
 */
function chainedOrdering(operator: string, strict: any, index: number) {
    const isStrict = Array.isArray(strict) ? strict[index + 1] : true;
    return operator === "lts"
        ? isStrict === false
            ? "<="
            : "<"
        : isStrict === false
          ? ">="
          : ">";
}

/**
 * The composites `summaryOf` reads itself, as `itemReader` reads them, when
 * written plainly.
 */
const READ_HERE = new Set([
    "select",
    "conditionalContent",
    "group",
    "repeat",
    "repeatForSequence",
    "sort",
    "shuffle",
]);

type ValueSummary =
    { type: "math" | "boolean" | "text"; tag: string } | "none" | undefined;

/**
 * What the items of two parts are together: of one type if both are (the
 * first one's tag), `"none"` if neither has any.
 */
function union(a: ValueSummary, b: ValueSummary): ValueSummary {
    if (a === undefined || b === undefined) {
        return undefined;
    }
    if (a === "none") {
        return b;
    }
    if (b === "none") {
        return a;
    }
    return a.type === b.type ? a : undefined;
}

/**
 * The children of a case or an option, through the `<group>` with no
 * attributes that its sugar wraps them in (as `itemReader` reads them).
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
        return only.children;
    }
    return children;
}

/** Whether `component` is a reference written alone (`$b`), not as a tag. */
function isBareReference(component: SerializedComponent) {
    return (
        component.componentType === "_copy" &&
        component.attributes?._createComponentOfType === undefined
    );
}

/**
 * The word `true` or `false`, if `tree` is that literal in an expression, as
 * `typeOfTree` reads it.
 */
function booleanLiteral(tree: any): string | undefined {
    if (tree === true || tree === "true") {
        return "true";
    }
    if (tree === false || tree === "false") {
        return "false";
    }
    return undefined;
}

/** How an ordering is written, for the message. */
const ORDERING_AS_WRITTEN: Record<string, string> = {
    "<": "<",
    ">": ">",
    le: "<=",
    ge: ">=",
};

/**
 * The section whose `sectionNumber` the reference `child`, written as
 * `source`, reads (`$s` of `$s.sectionNumber`), if it reads one.
 */
function sectionNumberOf(
    child: SerializedComponent,
    source: string,
): string | undefined {
    const ref: any =
        child.componentType === "_copy" && child.extending
            ? unwrapSource(child.extending as any)
            : undefined;
    const path = ref?.unresolvedPath ?? [];
    const last = path[path.length - 1];
    if (
        path.length === 0 ||
        last?.name !== "sectionNumber" ||
        (last.index ?? []).length > 0 ||
        !source.endsWith(".sectionNumber")
    ) {
        return undefined;
    }
    return source.slice(0, -".sectionNumber".length);
}
