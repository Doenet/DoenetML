/**
 * Booleans and numbers are kept apart unless the author asks (D47 decisions
 * 3 and 4, #2582), and a text is not ordered against a number (D58). Each is
 * a type mix, decided at load from what is written (DIAG-2), wherever it is:
 *
 * - **A boolean where a number or a math is wanted** (`doenet-w0202`,
 *   `booleanAsNumber`): a boolean child of a `<math>`, of a `<number>`
 *   without `convertBoolean`, of a list of numbers or maths, of a math
 *   operator, or of a math attribute (`<point x="$b">`). It is a blank in
 *   its place (VAL-5), and the warning names the way to ask for `1` or `0`:
 *   `<number convertBoolean>`, the one place a boolean is read as a number.
 * - **A number or a math where a boolean is wanted** (`numberAsBoolean`,
 *   and `literalAsBoolean` for a literal `1` or `0`): a `<boolean>`'s
 *   content, or a boolean attribute's (`hide="$n"`, `hide="1"`), or an
 *   operand of its `and`, `or` or `not`, and a number child of a
 *   `<booleanList>` or a boolean operator (`<and>`). The `<boolean>` is
 *   missing, and the warning suggests the comparison meant (`$n != 0`).
 * - **A boolean compared with a number** (`comparedWithNumber`):
 *   `<boolean>$b = 1</boolean>`. The `<boolean>` is missing. `$b = true`
 *   compares booleans.
 * - **An input bound to the other type** (`mathInputBoundToBoolean`,
 *   `booleanInputBoundToNumber`): `<mathInput bindValueTo="$b">`, whose
 *   warning suggests a `<booleanInput>`, and the reverse. It is bound to a
 *   blank.
 * - **A text ordered against a number** (`doenet-w0203`): `<`, `>`, `<=` or
 *   `>=` between them is never true (`$s.sectionNumber > 2`). Nothing is
 *   converted, and `=` is unchanged. For a `sectionNumber`, the warning
 *   suggests `ownNumber` (D56).
 *
 * A type change between them (`<math extend="$b"/>`, `<boolean
 * extend="$n"/>`) is a REF-5 error, decided by `typeChangeRule`
 * (`typeChange.js`), not here.
 *
 * What a child is, is read as `itemReader` reads the items of a `<sort>`
 * (`reorderedItemsAtLoad.ts`): a bare reference is its referent's type, a
 * property its declared or decided type (TYPE, D45), a list its entries'
 * type, and a wrapper of one component that component. A child whose type
 * the DoenetML doesn't decide, or a wrapper holding several, is not judged.
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
import { doenetMLReferenceAsWritten } from "../sourceLocation";
import { buildParsedExpression } from "../booleanLogic";
import me from "math-expressions";

/** Why a value is a type mix (`doenet-w0202`'s `reason`). */
type MixReason =
    | "booleanAsNumber"
    | "numberAsBoolean"
    | "literalAsBoolean"
    | "comparedWithNumber"
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
    const valueCache = new Map<
        number,
        { type: ValueType; tag: string } | undefined
    >();
    function valueOf(
        child: SerializedComponent,
    ): { type: ValueType; tag: string } | undefined {
        if (!valueCache.has(child.componentIdx)) {
            valueCache.set(child.componentIdx, readValueOf(child));
        }
        return valueCache.get(child.componentIdx);
    }
    function readValueOf(
        child: SerializedComponent,
    ): { type: ValueType; tag: string } | undefined {
        if (child.componentType === "_error") {
            return undefined;
        }
        const { items, unknown } = reader.itemsOfChildren([child], new Set());
        if (unknown || items.length === 0) {
            return undefined;
        }
        let found: { type: ValueType; tag: string } | undefined;
        for (const item of items) {
            if (item.kind !== "one") {
                return undefined;
            }
            const type = reader.typeOf(item);
            if (type !== "math" && type !== "boolean" && type !== "text") {
                return undefined;
            }
            if (found !== undefined && found.type !== type) {
                return undefined;
            }
            found ??= { type, tag: item.tag };
        }
        return found;
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
        if (attr.type === "component") {
            const component = attr.component;
            if (typeof component.state?.value === "boolean") {
                return component.state.value;
            }
            const children = component.children ?? [];
            if (children.every((c: unknown) => typeof c === "string")) {
                return children.join("").trim().toLowerCase() !== "false";
            }
            return true;
        }
        return true;
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

    function warn({
        reason,
        source,
        form,
        position,
        sourceDoc,
    }: {
        reason: MixReason;
        source: string;
        form: "reference" | "tag" | "literal" | "expression";
        position: SerializedComponent["position"];
        sourceDoc: number | undefined;
    }) {
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0202",
                args: { reason, source, form },
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
     * `bindValueTo` of a `<booleanInput>`.
     */
    function checkLogic(
        component: SerializedComponent,
        fallback: SerializedComponent["position"],
        bound: boolean,
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
            form: "reference" | "tag" | "literal" | "expression";
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
            form: "reference" | "tag" | "literal" | "expression";
        } {
            if (child) {
                return asWritten(child);
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
            // A chain (`1 < $t < 3`) is `lts` or `gts` of the tuple of its
            // operands, each pair ordered.
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
                }
                if (orders && text && number && text.child) {
                    const { source } = asWritten(text.child);
                    orderings.push({
                        source,
                        operator: chained
                            ? operator === "lts"
                                ? "<"
                                : ">"
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

        for (const { reason, source, form } of found) {
            warn({ reason, source, form, position, sourceDoc });
        }
        for (const { source, operator, sectionOf } of orderings) {
            diagnostics.push(
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0203",
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
            // A type mix is a blank in its place (VAL-5): each child it is
            // made of, so that what else is written stays (an award's
            // responses), or, for a literal (`1`), the whole content, which
            // is then missing.
            if (found.every((item) => item.children.length > 0)) {
                for (const item of found) {
                    for (const child of item.children) {
                        if (!child.doenetAttributes?.typeMixAtLoad) {
                            blank(child);
                        }
                    }
                }
            } else {
                component.children = [
                    newBlank(position, sourceDoc, found[0].written),
                ];
            }
        }
    }

    /**
     * Check the children of `component`, and then everything in it. `owner`
     * and `attributeName` are the component and attribute it is the
     * attribute component of, if it is one, and `parentPosition` where its
     * parent is reported.
     */
    function visit(
        component: SerializedComponent,
        owner?: SerializedComponent,
        attributeName?: string,
        parentPosition?: SerializedComponent["position"],
    ) {
        const componentClass = allClasses[component.componentType];
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

        if (componentClass && component.componentType !== "_copy") {
            if (
                componentClass.returnChildGroups ===
                booleanClass?.returnChildGroups
            ) {
                checkLogic(
                    component,
                    fallback,
                    bound !== undefined && inherits(bound, "booleanInput"),
                );
            } else {
                const isNumber = inherits(component.componentType, "number");
                // Only a component that takes one of the two types, and not
                // the other, can find a mix among its children: read what
                // they are only then, as reading a reference can follow
                // every branch of the composites it names.
                const takesMath =
                    takes(componentClass, "math") ||
                    takes(componentClass, "number");
                const takesBoolean = takes(componentClass, "boolean");
                if (
                    isNumber
                        ? !mayBeTrue(component.attributes?.convertBoolean)
                        : takesMath !== takesBoolean
                ) {
                    for (const child of component.children ?? []) {
                        if (typeof child !== "object") {
                            continue;
                        }
                        const value = valueOf(child);
                        if (value === undefined) {
                            continue;
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
                            const { source, form } = asWritten(child);
                            warn({
                                reason,
                                source,
                                form,
                                position: child.position ?? fallback,
                                sourceDoc:
                                    child.sourceDoc ?? component.sourceDoc,
                            });
                            blank(child);
                        }
                    }
                }
            }
        }

        for (const child of component.children ?? []) {
            if (typeof child === "object") {
                visit(child, undefined, undefined, fallback);
            }
        }
        for (const [name, attribute] of Object.entries(
            component.attributes ?? {},
        )) {
            if (attribute.type === "component") {
                visit(attribute.component, component, name);
            }
        }
    }

    for (const component of serializedComponents) {
        if (typeof component === "object") {
            visit(component);
        }
    }

    return { diagnostics, nComponents };
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
