import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";

// A viewer mounted with `render={false}` primes a core worker so its host can
// be told the document's structure, and then stays on that path: nothing
// records the source until `render` turns true, so every re-render arrives
// there again. Attaching a second worker on the way through would strand the
// first — nothing points at it, nothing terminates it, and it goes on holding a
// WASM core and reporting a document structure its replacement is also
// reporting.
//
// Loading catalogs on demand is what made that easy to reach: a catalog landing
// re-renders the viewer, and a viewer that is not rendering yet is exactly the
// one still sitting in this window. Counted at `new Worker` rather than through
// any DoenetML seam, because what leaks is a worker nothing in the component
// refers to any more.

/** A viewer that is not rendering, beside a button that re-renders it. */
function RerenderHarness() {
    const [renders, setRenders] = React.useState(1);
    return (
        <div>
            <button
                data-test="rerender"
                onClick={() => setRenders((count) => count + 1)}
            >
                re-render
            </button>
            <span data-test="renders">{renders}</span>
            <DoenetViewer
                doenetML="<p>waiting to be rendered</p>"
                render={false}
                addVirtualKeyboard={false}
            />
        </div>
    );
}

describe("a viewer that is not rendering yet", () => {
    let coreWorkersCreated = 0;
    let RealWorker: typeof Worker;

    beforeEach(() => {
        coreWorkersCreated = 0;
        RealWorker = window.Worker;
        window.Worker = class extends RealWorker {
            constructor(scriptUrl: string | URL, options?: WorkerOptions) {
                // Only this page's core worker. MathJax starts one of its own,
                // and a count that included it would answer a different
                // question on every run.
                if (String(scriptUrl) === doenetGlobalConfig.doenetWorkerUrl) {
                    coreWorkersCreated++;
                }
                super(scriptUrl, options);
            }
        } as typeof Worker;
    });

    afterEach(() => {
        window.Worker = RealWorker;
    });

    it("primes one core worker, however often it re-renders", () => {
        cy.mount(<RerenderHarness />);

        // The worker is attached during the render that mounts the viewer, so
        // there is one before anything is clicked.
        cy.get('[data-test="renders"]', { timeout: 4000 }).should(
            "have.text",
            "1",
        );
        cy.then(() => {
            expect(coreWorkersCreated, "core workers after mount").to.equal(1);
        });

        cy.get('[data-test="rerender"]').click().click().click();
        cy.get('[data-test="renders"]').should("have.text", "4");

        cy.then(() => {
            expect(
                coreWorkersCreated,
                "core workers after three re-renders",
            ).to.equal(1);
        });
    });
});
