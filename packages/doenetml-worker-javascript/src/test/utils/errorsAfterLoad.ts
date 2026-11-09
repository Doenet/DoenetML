import type { DiagnosticRecord } from "@doenet/utils";
import type { PublicDoenetMLCore } from "../../CoreWorker";

/**
 * The cores the current test made (`createTestCore`), whose errors after
 * load (DIAG-7) are checked when it ends (`setupErrorsAfterLoad.ts`).
 */
const coresOfThisTest: PublicDoenetMLCore[] = [];

/** Record a core `createTestCore` made, to check when the test ends. */
export function registerTestCore(core: PublicDoenetMLCore) {
    coresOfThisTest.push(core);
}

/**
 * The errors reported after load (`DiagnosticsManager.errorsReportedAfterLoad`)
 * by any core the test made, which are then cleared. For a test of what
 * happens to such an error: one the test does not take this way fails it.
 */
export function takeErrorsReportedAfterLoad(
    core?: PublicDoenetMLCore,
): DiagnosticRecord[] {
    const cores = core ? [core] : coresOfThisTest;
    const errors: DiagnosticRecord[] = [];
    for (const c of cores) {
        const manager = c.core?.diagnosticsManager;
        if (manager) {
            errors.push(...manager.errorsReportedAfterLoad);
            manager.errorsReportedAfterLoad = [];
        }
    }
    return errors;
}

/**
 * Fail if a core the test made reported an error after load, and forget the
 * cores. An error is decided at load, from the DoenetML alone (DIAG-7, D38),
 * so one reported after it is a bug: in production it is a warning, and its
 * component is missing.
 *
 * Each core's pending state saves are cancelled first. Tests do not, as a
 * rule, terminate their cores, and an unterminated core arms a 60-second throttle
 * timer on its first save (`StatePersistence.saveChangesToDatabase`) whose
 * callback holds the whole core. Forgetting the core here is then not enough:
 * every core outlived its test by a minute, and a file that loads a document
 * once per variant, as `selectsamplerandomnumbers.test.ts` does (about 1,300
 * cores in a minute), held most of them at once and ran a Vitest worker out
 * of memory (#2490). `dispose` is what `Core.terminate` calls once its final
 * save is made; the test is over, so no save is left to make.
 */
export function checkNoErrorsAfterLoad() {
    for (const core of coresOfThisTest) {
        core.core?.statePersistence.dispose();
    }
    const errors = takeErrorsReportedAfterLoad();
    coresOfThisTest.length = 0;
    if (errors.length > 0) {
        throw Error(
            `An error was reported after the document loaded (DIAG-7). Errors are decided at load, from the DoenetML alone:\n` +
                errors
                    .map(
                        (e) =>
                            `- ${e.code ?? "(no code)"} at line ${e.position?.start?.line ?? "?"}: ${e.message}`,
                    )
                    .join("\n"),
        );
    }
}
