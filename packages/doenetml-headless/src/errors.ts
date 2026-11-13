/**
 * Why `@doenet/doenetml-headless` refused something.
 *
 * - `invalidState`: the saved state is not a viewer state report.
 * - `dataFormatVersion`: the saved state's `data_format_version` is not the
 *   one the core reads.
 * - `documentMismatch`: the saved state was written for a different document
 *   source (its `cid`).
 * - `variantMismatch`, `attemptMismatch`: the saved state was written for a
 *   different variant or attempt than the one asked for.
 * - `notFound`: no component answers to the target.
 * - `noStableKey`: the target names a component, but not uniquely from the
 *   document root, so it has no stable key and cannot be driven.
 * - `unsupportedInput`: the target is not an input `setInput` knows.
 * - `inputDisabled`: the input or the choice is disabled, the input is fixed,
 *   or the point cannot be moved, so it would ignore the value.
 * - `invalidValue`: the value does not fit the input.
 */
export type HeadlessErrorCode =
    | "invalidState"
    | "dataFormatVersion"
    | "documentMismatch"
    | "variantMismatch"
    | "attemptMismatch"
    | "notFound"
    | "noStableKey"
    | "unsupportedInput"
    | "inputDisabled"
    | "invalidValue";

export class HeadlessError extends Error {
    readonly code: HeadlessErrorCode;

    constructor(code: HeadlessErrorCode, message: string) {
        super(message);
        this.name = "HeadlessError";
        this.code = code;
    }
}
