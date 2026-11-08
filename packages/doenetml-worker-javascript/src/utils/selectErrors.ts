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
 * what decides it is decided by the DoenetML (it cannot change), so it is
 * the same in every variant and the author must change it; otherwise an
 * info, since a value or another random choice decides it (`<selectFromSequence to="$a"
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
 * Whether the serialized component `component`, or attribute of one,
 * holds only what is written: no reference (a `_copy`, a `_ref`, an
 * extend, or an expression attribute with slots).
 */
function serializedHasNoReference(component: any): boolean {
    if (typeof component !== "object" || component === null) {
        return true;
    }
    if (component.type === "literal" || component.type === "primitive") {
        return true;
    }
    if (component.type === "expression") {
        return (component.slots ?? []).length === 0;
    }
    if (component.component) {
        return serializedHasNoReference(component.component);
    }
    if (
        component.componentType === "_copy" ||
        component.componentType === "_ref" ||
        component.extending
    ) {
        return false;
    }
    return (
        (component.children ?? []).every(serializedHasNoReference) &&
        Object.values(component.attributes ?? {}).every(
            serializedHasNoReference,
        )
    );
}

/**
 * Whether a fresh load reproduces what a `<select>` chooses, so a save can
 * leave its selection out (`definitionEssentialValuesReproducible`): its
 * choices are written without a reference (`choicesWrittenWithoutReference`),
 * and so are its options' weights. An option copied from elsewhere may carry a
 * weight from a value, which can't be seen here, so a select with one is
 * saved.
 */
export function selectionReproducible(
    choicesDecided: boolean,
    serializedOptions: any[],
): boolean {
    return (
        choicesDecided &&
        serializedOptions.every(
            (child) =>
                typeof child !== "object" ||
                child === null ||
                (child.componentType === "option" &&
                    serializedHasNoReference(child.attributes?.selectWeight)),
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
 * Whether the live attribute `attribute` is written without a reference:
 * not written, a literal, a primitive, or an attribute component that holds
 * no reference, composite or input, nor do its children and attributes.
 */
function attributeWrittenWithoutReference(
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
        return componentWrittenWithoutReference(
            attribute.component,
            componentInfoObjects,
        );
    }
    return false;
}

function componentWrittenWithoutReference(
    component: any,
    componentInfoObjects: any,
): boolean {
    if (typeof component !== "object" || component === null) {
        return true;
    }
    if (
        component.shadows ||
        component.extending ||
        component.componentType === "_ref" ||
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: component.componentType,
            baseComponentType: "_input",
        }) ||
        componentInfoObjects.isCompositeComponent({
            componentType: component.componentType,
            includeNonStandard: true,
        })
    ) {
        return false;
    }
    return (
        (component.definingChildren ?? []).every((child: any) =>
            componentWrittenWithoutReference(child, componentInfoObjects),
        ) &&
        Object.values(component.attributes ?? {}).every((attribute) =>
            attributeWrittenWithoutReference(attribute, componentInfoObjects),
        )
    );
}

/**
 * Whether what a select chooses from, and how many, is written in the
 * DoenetML without a reference: each of the attributes `attributeNames` of
 * the select `component`, and, when `serializedOptions` is given, each of
 * those children is {@link optionWrittenInDoenetML}. Computed when the
 * select is made, from what the author wrote. Then a fresh load reproduces
 * the selection (`definitionEssentialValuesReproducible`).
 *
 * Whether a failure to select is an error asks a wider question, whether
 * any of it can change ({@link returnChoicesDecidedByDoenetMLDefinition}):
 * a reference to a component that cannot change decides it too. This one
 * stays narrow, so a select whose choices come through a reference keeps
 * its selection in a save, as before.
 */
export function choicesWrittenWithoutReference({
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
    const attributesWritten = attributeNames.every((name) =>
        attributeWrittenWithoutReference(
            component.attributes?.[name],
            componentInfoObjects,
        ),
    );
    if (!attributesWritten || serializedOptions === undefined) {
        return attributesWritten;
    }
    return serializedOptions.every(optionWrittenInDoenetML);
}

/**
 * The state variable `choicesDecidedByDoenetML` of a select, read by the
 * definition that selects to set the level of a failure
 * ({@link selectFailureType}): whether what it chooses from, and how many,
 * is decided by the DoenetML alone (D38, DIAG-7). It is when none of the
 * attributes `attributeNames` can change (a `decidedByDoenetML`
 * dependency, `canChange`): one written as a literal, or as a reference to
 * a component that cannot change (`numToSelect="$n"` of a `<number>`
 * written as `5`). One that reaches an input, a random choice or something
 * a reader can write to can change. With `withOptions`, its options must
 * also be written in it (`optionsDecidedByDoenetML`, kept by the
 * constructor in `doenetAttributes`).
 *
 * It depends on what the author wrote, not on the variant, so it is the
 * same in every variant, and it is decided when the select first selects,
 * as the document loads, so an error is reported at load.
 */
export function returnChoicesDecidedByDoenetMLDefinition({
    attributeNames,
    withOptions = false,
}: {
    attributeNames: string[];
    withOptions?: boolean;
}) {
    return {
        returnDependencies: () => ({
            attributesDecided: {
                dependencyType: "decidedByDoenetML",
                attributeNames,
            },
            ...(withOptions
                ? {
                      optionsDecided: {
                          dependencyType: "doenetAttribute",
                          attributeName: "optionsDecidedByDoenetML",
                      },
                  }
                : {}),
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: {
                attributesDecided: boolean;
                optionsDecided?: boolean;
            };
        }) {
            return {
                setValue: {
                    choicesDecidedByDoenetML:
                        dependencyValues.attributesDecided &&
                        dependencyValues.optionsDecided !== false,
                },
            };
        },
    };
}

/**
 * The state variable `optionsDecidedByDoenetML` of a `<select>`: whether
 * its options are all written in it (`optionWrittenInDoenetML`), kept by
 * its constructor in `doenetAttributes`.
 */
export function returnOptionsDecidedByDoenetMLDefinition() {
    return {
        returnDependencies: () => ({
            decided: {
                dependencyType: "doenetAttribute",
                attributeName: "optionsDecidedByDoenetML",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { decided: boolean | undefined };
        }) {
            return {
                setValue: {
                    optionsDecidedByDoenetML:
                        dependencyValues.decided !== false,
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
 * @param revive For a state variable, how to make its kept value the value
 *   the definition would have set, such as a math from its saved tree.
 */
export function keptSelection(
    essentialValues: Record<string, unknown> | undefined,
    variableNames: string[],
    revive: Record<string, (value: any) => unknown> = {},
) {
    if (essentialValues?.[variableNames[0]] === undefined) {
        return null;
    }
    // Set from the values kept, rather than read from them where they are
    // kept, so that each can be revived first: a saved value comes back as
    // its JSON, such as a math as its expression tree
    // (A value saved before it was kept, such as `numToSelect` by an older
    // version, is left for the definition to set.)
    const values = Object.fromEntries(
        variableNames
            .filter((name) => essentialValues[name] !== undefined)
            .map((name) => {
                const value = essentialValues[name];
                return [name, revive[name] ? revive[name](value) : value];
            }),
    );
    return { setEssentialValue: { ...values }, setValue: { ...values } };
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
 * or kept, with the selection, when the selection was kept. When a
 * requested variant's choices were taken as given, it is how many it gave,
 * which can differ from the attribute now, as from a variant saved before
 * the document changed.
 */
export function withNumToSelect(result: any, numToSelect: number) {
    if (result.setValue && "numToSelect" in result.setValue) {
        // kept with the selection (`keptSelection`), or set to how many
        // choices a requested variant gave, which were taken as given
        return result;
    }
    return {
        ...result,
        setEssentialValue: { ...result.setEssentialValue, numToSelect },
        setValue: { ...result.setValue, numToSelect },
    };
}

/** Thrown by the generator a probe selection is given: it never draws. */
const NO_DRAW = Symbol("a probe selection does not draw");

/**
 * The selection of a select that a requested variant gives choices to,
 * `requested`, or, when it gives none (`undefined`), the select's own,
 * `select(dependencyValues)`. A select never chooses again (#2389), so the
 * choices are taken as given, even when they are not what it would choose
 * now, with the `numToSelect` they make, and an empty list (`[]`, or `null`
 * from a select that couldn't select) selects nothing.
 *
 * What the select would report is still found, by making its selection
 * with a generator that never draws, so no random choice of the document
 * moves: a failure the DoenetML decides (an error) is reported in every
 * variant, in place of the choices; one a value decides (an info) is
 * reported only when the choices are empty, as a select that couldn't
 * select gives back, with the `numToSelect` it tried, as when it failed, so a
 * reload is the same. The probe stops at the first draw, so a failure the
 * DoenetML can decide must be found before any draw (`doenet-e0045` of a
 * `<selectFromSequence>`); one found only by drawing depends on the variant
 * and is always an info (`doenet-e0052`, `doenet-e0053`, `doenet-i0057`).
 *
 * @param rngKey The dependency `select` draws from.
 * @param takeRequested The selection result for nonempty `requested`.
 * @param emptySelection The selection result for selecting nothing.
 */
export function selectionWithRequested({
    requested,
    dependencyValues,
    select,
    rngKey,
    takeRequested,
    emptySelection,
}: {
    requested: unknown[] | undefined;
    dependencyValues: any;
    select: (dependencyValues: any) => any;
    rngKey: string;
    takeRequested: (requested: unknown[]) => any;
    emptySelection: any;
}) {
    if (requested === undefined) {
        return select(dependencyValues);
    }
    let probe = null;
    try {
        probe = select({
            ...dependencyValues,
            [rngKey]: () => {
                throw NO_DRAW;
            },
        });
    } catch (e) {
        if (e !== NO_DRAW) {
            throw e;
        }
    }
    const failed = Boolean(probe?.setValue?.errorMessage);
    if (failed && !isInfoSelectFailure(probe.setValue.errorDiagnostic)) {
        return probe;
    }
    if (requested.length > 0) {
        return withNumToSelect(takeRequested(requested), requested.length);
    }
    return failed ? probe : withNumToSelect(emptySelection, 0);
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
