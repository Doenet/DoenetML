/**
 * The error of a `<select>` that its literals keep from selecting, decided
 * when the document loads (DIAG-7, D38, #2463): `doenet-e0035`, more to
 * select without replacement than the options written in it.
 *
 * Such a select fails in every variant. It reports the error when it is
 * made, but in a case not yet true, an iteration not yet made or an option
 * not picked, that is only after an interaction, so it is decided here,
 * wherever the select is, and reported now. The decision is marked on the
 * select (`doenetAttributes.choiceErrorAtLoad`), which takes it from the mark
 * when it is made, and selects nothing (`selectFreshIndices` in
 * `Select.js`), so the error is the same one, kept once.
 *
 * Only what is exactly a literal is read, and anything else is left to run
 * time:
 * - `numToSelect` written as a number in digits, rounded as the integer it
 *   is (`2.5` is 3), or left out (1); not an expression (`1+2`);
 * - `withReplacement` written as `false`, or left out; `""`, `1` and `1>0`
 *   are read when the document runs (as false, true and true);
 * - each child an `<option>` written in the select, none naming the
 *   variants it is picked for (`selectForVariants`), which a variant takes
 *   without counting options; an `<option extend>` marked with its error
 *   (`doenet-e0061`) is that error and no option, and any other reference
 *   may stand for any number of options;
 * - at least one option: a select with none selects nothing, with no error.
 */
import type { SerializedComponent, SerializedAttribute } from "./types";
import { codedDiagnostic } from "../diagnostics";

/** What `doenetAttributes.choiceErrorAtLoad` holds. */
export type ChoiceErrorAtLoad = {
    code: "doenet-e0035";
    args: { numToSelect: number; numOptions: number };
};

/**
 * Mark each `<select>` among `serializedComponents` whose literals keep it
 * from selecting (see above), and return its error, to report now.
 */
export function checkChoiceErrorsAtLoad({
    serializedComponents,
}: {
    serializedComponents: (SerializedComponent | string)[];
}) {
    const diagnostics: ReturnType<typeof codedDiagnostic>[] = [];
    const seen = new Set<SerializedComponent>();

    function visit(components: (SerializedComponent | string)[]) {
        for (const component of components) {
            if (typeof component !== "object" || seen.has(component)) {
                continue;
            }
            seen.add(component);
            if (component.componentType === "select") {
                const mark = selectErrorAtLoad(component);
                if (mark) {
                    component.doenetAttributes = {
                        ...component.doenetAttributes,
                        choiceErrorAtLoad: mark,
                    };
                    diagnostics.push({
                        ...choiceErrorDiagnostic(mark),
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
    return diagnostics;
}

/** The error diagnostic of the mark `mark`. */
export function choiceErrorDiagnostic(mark: ChoiceErrorAtLoad) {
    return codedDiagnostic({
        type: "error",
        code: mark.code,
        args: mark.args,
    });
}

/** The error of the `<select>` `select` its literals decide, if any. */
function selectErrorAtLoad(
    select: SerializedComponent,
): ChoiceErrorAtLoad | undefined {
    const numToSelectAttribute = attributeOf(select, "numToSelect");
    let numToSelect = 1;
    if (numToSelectAttribute !== undefined) {
        const text = literalText(numToSelectAttribute);
        if (text === undefined || !/^\d+(\.\d+)?$/.test(text)) {
            return undefined;
        }
        // An integer, which rounds the number written (`2.5` is 3), as the
        // select's `numToSelect` does (`Integer.js`).
        numToSelect = Math.round(Number(text));
    }
    const withReplacementAttribute = attributeOf(select, "withReplacement");
    if (
        withReplacementAttribute !== undefined &&
        literalBoolean(withReplacementAttribute) !== false
    ) {
        return undefined;
    }

    let numOptions = 0;
    for (const child of select.children ?? []) {
        if (typeof child === "string") {
            if (child.trim() !== "") {
                return undefined;
            }
            continue;
        }
        if (
            child.componentType === "_copy" &&
            (child.doenetAttributes?.extendErrorsAtLoad ?? []).length > 0
        ) {
            // An extend marked with its error (`<option extend="$o"/>`,
            // `doenet-e0061`, `extendErrorsAtLoad.ts`) is that error, taken
            // from the mark when it is made, and no option.
            continue;
        }
        if (
            child.componentType !== "option" ||
            child.extending ||
            attributeOf(child, "selectForVariants") !== undefined
        ) {
            return undefined;
        }
        numOptions++;
    }

    if (numOptions === 0 || numToSelect <= numOptions) {
        return undefined;
    }
    return { code: "doenet-e0035", args: { numToSelect, numOptions } };
}

/** An attribute of `component`, matched without regard to case. */
function attributeOf(component: SerializedComponent, name: string) {
    const lower = name.toLowerCase();
    for (const [attrName, attribute] of Object.entries(
        component.attributes ?? {},
    )) {
        if (attrName.toLowerCase() === lower) {
            return attribute as SerializedAttribute;
        }
    }
    return undefined;
}

/**
 * The boolean the attribute is written as, `true` or `false` (in any case),
 * which the document reads as its value when it loads, or `undefined` when
 * it is written as anything else (`""`, `1`, `1>0`, a reference), which is
 * read when the document runs.
 */
function literalBoolean(attribute: SerializedAttribute) {
    const attr: any = attribute;
    if (attr.type === "primitive") {
        return typeof attr.primitive.value === "boolean"
            ? attr.primitive.value
            : undefined;
    }
    const component = attr.type === "component" ? attr.component : undefined;
    if (
        component &&
        (component.children ?? []).length === 0 &&
        typeof component.state?.value === "boolean"
    ) {
        return component.state.value as boolean;
    }
    return undefined;
}

/** The text the attribute is written as, when it is only text. */
function literalText(attribute: SerializedAttribute) {
    const attr: any = attribute;
    if (attr.type === "primitive") {
        return String(attr.primitive.value);
    }
    const component = attr.type === "component" ? attr.component : undefined;
    const children = component ? component.children : attr.children;
    if (
        Array.isArray(children) &&
        children.length > 0 &&
        children.every((child: unknown) => typeof child === "string")
    ) {
        return children.join("").trim();
    }
    return undefined;
}
