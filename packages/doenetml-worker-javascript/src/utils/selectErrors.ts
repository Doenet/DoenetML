import {
    formatEnglishDiagnostic,
    type DiagnosticArgs,
    type DiagnosticCode,
} from "@doenet/i18n";

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
    errorDiagnostic: { code: DiagnosticCode; args?: DiagnosticArgs } | null;
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
}: {
    code: DiagnosticCode;
    args?: DiagnosticArgs;
}): SelectErrorState {
    return {
        errorMessage: formatEnglishDiagnostic(code, args),
        errorDiagnostic: { code, ...(args === undefined ? {} : { args }) },
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
