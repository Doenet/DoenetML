import {
    formatEnglishDiagnostic,
    type DiagnosticArgs,
    type DiagnosticCode,
} from "@doenet/i18n";
import { diagnosticCodeFrom } from "./diagnostics";

/**
 * The error a `<select>`, `<selectFromSequence>` or `<selectPrimeNumbers>`
 * replaces itself with, as the pair of state values that carry it.
 *
 * These three are the only components that build an `_error` out of a state
 * variable rather than out of a caught value: when nothing can be selected
 * there is no component to render, so the replacement *is* the error box. That
 * state variable held a finished English sentence, which made this the last
 * uncoded `_error` path in the worker — and the one place a Spanish reader got
 * an English box on an otherwise Spanish page (#1581).
 *
 * ## Two values, set together
 *
 * `errorMessage` is unchanged: English, and the string every existing test
 * asserts on. It is filled in from the English catalog rather than written by
 * the caller, exactly as `codedDiagnostic` does it, so the two cannot drift.
 *
 * `errorDiagnostic` is what is new — the code and its arguments, in the shape
 * `errorComponentState` reads. The component hands it to that builder when it
 * creates its replacement, and the main thread renders the box from the code
 * in the reader's language.
 *
 * They are one object because they have to be set together. Both are essential
 * state variables in the same definition group, so a definition that set one
 * and left the other would leave a stale code beside a fresh message — and the
 * box would confidently render the wrong sentence. Every return path hands
 * {@link selectionResult} either a {@link selectError} or
 * {@link NO_SELECT_ERROR}, and there is no way to spell one half.
 *
 * The code is what persists, not the message: a document saved in one language
 * and reopened in another gets the box in the second language, because nothing
 * localized was ever written down.
 */
export type SelectErrorState = {
    errorMessage: string;
    errorDiagnostic: {
        code: DiagnosticCode;
        args?: DiagnosticArgs;
        /**
         * Set when the select could not select because of a value or the
         * variant, rather than because of what the author wrote. Then the
         * select is missing and reports an info rather than an error (D38,
         * DIAG-7; see {@link selectFailureType}).
         */
        type?: "info";
    } | null;
};

/**
 * The pair for a select that cannot select.
 *
 * Takes the code as a named property rather than positionally: `lint:i18n`
 * recognizes a raised code by the text `code: "doenet-…"` in source, and a
 * code passed as a bare argument would read as never raised — which would fail
 * the check that every registered code has a call site.
 */
export function selectError({
    code,
    args,
    type = "error",
}: {
    code: DiagnosticCode;
    args?: DiagnosticArgs;
    /** {@link selectFailureType}; an error unless said otherwise. */
    type?: "error" | "info";
}): SelectErrorState {
    return {
        errorMessage: formatEnglishDiagnostic(code, args),
        errorDiagnostic: {
            code,
            ...(args === undefined ? {} : { args }),
            ...(type === "info" ? { type } : {}),
        },
    };
}

/**
 * The level of a select's failure to select (D38, DIAG-7): an error when
 * what decides it is written in the DoenetML, so it is the same in every
 * variant and the author must change it; otherwise an info, since a value or
 * another random choice decides it (`<selectFromSequence to="$a"
 * numToSelect="3"/>` with a random `a`), and the select is missing while it
 * lasts (DIAG-2).
 *
 * @param decidedByDoenetML The select's `choicesDecidedByDoenetML`.
 */
export function selectFailureType(
    decidedByDoenetML: boolean,
): "error" | "info" {
    return decidedByDoenetML ? "error" : "info";
}

/**
 * Whether a failure of the select to select is a missing selection with an
 * info rather than an error (`selectFailureType`).
 */
export function isInfoSelectFailure(errorDiagnostic: unknown): boolean {
    return (
        typeof errorDiagnostic === "object" &&
        errorDiagnostic !== null &&
        (errorDiagnostic as { type?: unknown }).type === "info"
    );
}

/**
 * Whether the attribute `attribute` of a component is decided by the
 * DoenetML alone: not written (its default), a literal, a primitive, or an
 * attribute component that holds no reference. A reference anywhere in it
 * (`to="$a"`, `numToSelect="$n+1"`) makes it a value that can change.
 */
function attributeDecidedByDoenetML(
    attribute: any,
    componentInfoObjects: any,
): boolean {
    if (!attribute) {
        return true;
    }
    if (attribute.type === "literal" || attribute.type === "primitive") {
        return true;
    }
    if (attribute.type === "expression") {
        return (attribute.slots ?? []).length === 0;
    }
    if (attribute.component) {
        return componentDecidedByDoenetML(
            attribute.component,
            componentInfoObjects,
        );
    }
    // a reference to a variable of another component
    return false;
}

/**
 * Whether the live component `component`, an attribute component or a
 * child, holds only what is written: no reference (a `_ref` read for its
 * value, or a composite, such as a `_copy`), no extend, and the same of its
 * children and attributes.
 */
function componentDecidedByDoenetML(
    component: any,
    componentInfoObjects: any,
): boolean {
    if (typeof component !== "object" || component === null) {
        return true;
    }
    if (
        component.shadows ||
        component.extending ||
        // a reference read for its value (`valueReferences.ts`)
        component.componentType === "_ref" ||
        componentInfoObjects.isCompositeComponent({
            componentType: component.componentType,
            includeNonStandard: true,
        })
    ) {
        return false;
    }
    return (
        (component.definingChildren ?? []).every((child: any) =>
            componentDecidedByDoenetML(child, componentInfoObjects),
        ) &&
        Object.values(component.attributes ?? {}).every((attribute) =>
            attributeDecidedByDoenetML(attribute, componentInfoObjects),
        )
    );
}

/**
 * Whether the serialized child `child` of a `<select>` is an option whose
 * content the DoenetML fixes: an `<option>` written in it, or an `<option
 * copy>` (or `<option extend>`, a `_copy` that makes an `option`) whose
 * reference was resolved when the document loaded, so has no index a value
 * decides. A bare reference (`$o`), which may stand for any number of
 * components, or a copy whose index is a value (`$g[$k]`), is not.
 */
export function optionWrittenInDoenetML(child: any): boolean {
    if (typeof child !== "object" || child === null) {
        return true;
    }
    if (child.componentType === "option") {
        return true;
    }
    return (
        isCopiedOption(child) &&
        Object.values(child.extending ?? {}).every(
            (refResolution: any) => refResolution?.unresolvedPath === null,
        )
    );
}

/**
 * Whether the serialized child `child` of a `<select>` is an `<option
 * copy>` or `<option extend>`: a `_copy` that makes exactly one `option`.
 */
export function isCopiedOption(child: any): boolean {
    return (
        child?.componentType === "_copy" &&
        child.attributes?._createComponentOfType?.primitive?.value === "option"
    );
}

/**
 * Whether what a select chooses from, and how many, is decided by the
 * DoenetML alone (D38, DIAG-7): each of the attributes `attributeNames` of
 * the select `component` is {@link attributeDecidedByDoenetML}, and, when
 * `serializedOptions` is given, each of those children is
 * {@link optionWrittenInDoenetML}. Computed when the select is made, from
 * what the author wrote, so it is the same in every variant.
 */
export function choicesDecidedByDoenetML({
    component,
    attributeNames,
    serializedOptions,
    componentInfoObjects,
}: {
    component: any;
    attributeNames: string[];
    serializedOptions?: any[];
    componentInfoObjects: any;
}): boolean {
    const attributesDecided = attributeNames.every((name) =>
        attributeDecidedByDoenetML(
            component.attributes?.[name],
            componentInfoObjects,
        ),
    );
    if (!attributesDecided || serializedOptions === undefined) {
        return attributesDecided;
    }
    return serializedOptions.every(optionWrittenInDoenetML);
}

/**
 * The state variable `choicesDecidedByDoenetML` of a select (or the one
 * named `variableName`, kept the same way, such as a `<select>`'s
 * `optionsDecidedByDoenetML`), read by the
 * definition that selects to set the level of a failure
 * ({@link selectFailureType}). The select's constructor computes it from
 * what the author wrote ({@link choicesDecidedByDoenetML}) and keeps it in
 * `doenetAttributes`.
 */
export function returnChoicesDecidedByDoenetMLDefinition(
    variableName = "choicesDecidedByDoenetML",
) {
    return {
        returnDependencies: () => ({
            decided: {
                dependencyType: "doenetAttribute",
                attributeName: variableName,
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { decided: boolean | undefined };
        }) {
            return {
                setValue: {
                    [variableName]: dependencyValues.decided !== false,
                },
            };
        },
    };
}

/**
 * What a select's selection definition returns when the selection was
 * already made and is kept, as on a reload, or `null` when it wasn't: the
 * select keeps it, whatever it would choose now, and never chooses again.
 * Its definition is given its essential values
 * (`provideEssentialValuesInDefinition`) for this.
 *
 * @param essentialValues The essential values given to the definition.
 * @param variableNames The state variables the definition sets, the first of
 *   them the selection.
 */
export function keptSelection(
    essentialValues: Record<string, unknown> | undefined,
    variableNames: string[],
) {
    if (essentialValues?.[variableNames[0]] === undefined) {
        return null;
    }
    return {
        useEssentialOrDefaultValue: Object.fromEntries(
            variableNames.map((name) => [name, true]),
        ),
    };
}

/**
 * The state variable `numToSelect` of a select, kept with its selection: how
 * many it selected, as `numToSelect` was when it made the selection. A later
 * change to the attribute (`specifiedNumToSelect`) is ignored, also when
 * the document is loaded again, as the selection made with it is kept.
 */
export const NUM_TO_SELECT_VARIABLE = {
    variableName: "numToSelect",
    description:
        "How many were selected: the number to select when the selection was made.",
    public: true,
    shadowingInstructions: { createComponentOfType: "integer" },
    hasEssential: true,
    shadowVariable: true,
    immutable: true,
};

/**
 * `result`, what a select's selection definition returns, with the
 * `numToSelect` it was made with set alongside it (`NUM_TO_SELECT_VARIABLE`),
 * or kept, with the selection, when the selection was kept.
 */
export function withNumToSelect(result: any, numToSelect: number) {
    if (result.useEssentialOrDefaultValue) {
        return {
            ...result,
            useEssentialOrDefaultValue: {
                ...result.useEssentialOrDefaultValue,
                numToSelect: true,
            },
        };
    }
    return {
        ...result,
        setEssentialValue: { ...result.setEssentialValue, numToSelect },
        setValue: { ...result.setValue, numToSelect },
    };
}

/** The pair for a select that selected something. */
export const NO_SELECT_ERROR: SelectErrorState = {
    errorMessage: "",
    errorDiagnostic: null,
};

/**
 * The pair off something already carrying one — a helper's return value, on
 * its way into the state variables.
 *
 * Exists so a forwarding site names one thing rather than two: spelling both
 * properties by hand is exactly where a message ends up without its code.
 */
export function takeSelectError({
    errorMessage,
    errorDiagnostic,
}: SelectErrorState): SelectErrorState {
    return { errorMessage, errorDiagnostic };
}

/**
 * What a select's definition returns: the error pair, and whatever the
 * component ended up selecting.
 *
 * The two slots always carry the same thing — a select's selection is
 * essential, so every branch writes the value it computed to both — and each
 * branch used to spell that thing out twice. Writing it once is what keeps the
 * error pair and the selection from disagreeing between the two.
 *
 * They stay two objects rather than one shared reference, because core owns
 * each independently once it has them.
 *
 * @param selection The selection state variables this component defines:
 *   `selectedIndices` for `<select>`, `selectedValues` too for the other two.
 */
export function selectionResult(
    error: SelectErrorState,
    selection: Record<string, unknown>,
) {
    return {
        setEssentialValue: { ...error, ...selection },
        setValue: { ...error, ...selection },
    };
}

/**
 * The state variable `selectErrorReported` of a select that is a list
 * component (`<selectFromSequence>`, `<selectPrimeNumbers>`), which reports
 * the select's error, when it has one, as an error diagnostic, or as an info
 * when a value or the variant decided it ({@link selectFailureType}): the
 * select then selects nothing, and has no error put after it.
 *
 * Such a select has no replacement to be the error box. A definition that
 * sends an error while the document is built has one put after its component
 * instead (`addQueuedErrorComponentsFromStateVariables`), so this is
 * evaluated as the select is created (`mustEvaluate`). A reference to the
 * select, which shadows its error, does not report it again.
 */
export function returnSelectErrorReportDefinition() {
    return {
        mustEvaluate: true,
        returnDependencies: () => ({
            errorMessage: {
                dependencyType: "stateVariable",
                variableName: "errorMessage",
            },
            errorDiagnostic: {
                dependencyType: "stateVariable",
                variableName: "errorDiagnostic",
            },
            shadowSource: {
                dependencyType: "shadowSource",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: {
                errorMessage: string | null;
                errorDiagnostic: unknown;
                shadowSource: unknown;
            };
        }) {
            const report =
                Boolean(dependencyValues.errorMessage) &&
                dependencyValues.shadowSource === null;
            return {
                setValue: { selectErrorReported: report },
                sendDiagnostics: report
                    ? [
                          {
                              type: isInfoSelectFailure(
                                  dependencyValues.errorDiagnostic,
                              )
                                  ? "info"
                                  : "error",
                              message: dependencyValues.errorMessage,
                              ...diagnosticCodeFrom(
                                  dependencyValues.errorDiagnostic,
                              ),
                          },
                      ]
                    : [],
            };
        },
    };
}
