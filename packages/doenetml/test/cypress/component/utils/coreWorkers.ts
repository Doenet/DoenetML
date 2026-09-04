import { doenetGlobalConfig } from "../../../../src/global-config";

/**
 * Count the core workers the tests in the enclosing `describe` construct.
 *
 * Counted at `new Worker`: a worker that is booted and discarded, or leaked,
 * shows up here whether or not the viewer still refers to it, which is the
 * question the specs using this ask.
 * Only this page's core worker is counted — MathJax starts one of its own,
 * and a count that included it would answer a different question on every
 * run.
 *
 * Registers `beforeEach`/`afterEach` hooks, so call it in a `describe` body.
 * The count starts at zero for each test; `reset` starts it over mid-test,
 * for a spec that mounts a viewer to set something up before mounting the
 * one under test.
 */
export function trackCoreWorkers() {
    let created = 0;
    let RealWorker: typeof Worker;

    beforeEach(() => {
        created = 0;
        RealWorker = window.Worker;
        window.Worker = class extends RealWorker {
            constructor(scriptUrl: string | URL, options?: WorkerOptions) {
                if (String(scriptUrl) === doenetGlobalConfig.doenetWorkerUrl) {
                    created++;
                }
                super(scriptUrl, options);
            }
        } as typeof Worker;
    });

    afterEach(() => {
        window.Worker = RealWorker;
    });

    return {
        /** Core workers constructed so far in the current test. */
        created: () => created,
        /** Start the count over. */
        reset: () => {
            created = 0;
        },
    };
}
