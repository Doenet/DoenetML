import { afterEach } from "vitest";
import { checkNoErrorsAfterLoad } from "./utils/errorsAfterLoad";

// A test fails if a document it loaded reported an error after load
// (DIAG-7): the end-of-load assertion of `DiagnosticsManager`.
afterEach(() => {
    checkNoErrorsAfterLoad();
});
