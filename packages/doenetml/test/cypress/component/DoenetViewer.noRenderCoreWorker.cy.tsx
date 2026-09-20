import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { trackCoreWorkers } from "./utils/coreWorkers";

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
//
// Reusing the primed worker is only right if it is still the worker the viewer
// goes on to render with, so the way out of this window is pinned too: `render`
// turning true, and a source edited while it was still false.

const RENDER_TIMEOUT = 15_000;

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

/**
 * A viewer that starts out not rendering, whose source can be edited and whose
 * `render` can be turned on — the two ways out of the priming window.
 *
 * It also counts the document structures reported, which is what priming the
 * worker produces. Waiting on that count is how the tests below act on a
 * settled worker, which keeps them about which worker the priming window
 * hands on. Leaving the window while the priming is still in flight is
 * `DoenetViewer.overlappingInitialization.cy.tsx`'s case (#1533).
 */
function RenderLaterHarness() {
    const [rendering, setRendering] = React.useState(false);
    const [doenetML, setDoenetML] = React.useState("<p>first source</p>");
    const [structures, setStructures] = React.useState(0);
    return (
        <div>
            <button
                data-test="edit"
                onClick={() => setDoenetML("<p>second source</p>")}
            >
                edit
            </button>
            <button data-test="render" onClick={() => setRendering(true)}>
                render
            </button>
            <span data-test="structures">{structures}</span>
            <DoenetViewer
                doenetML={doenetML}
                render={rendering}
                addVirtualKeyboard={false}
                documentStructureCallback={() =>
                    setStructures((count) => count + 1)
                }
            />
        </div>
    );
}

describe("a viewer that is not rendering yet", () => {
    const workers = trackCoreWorkers();

    it("primes one core worker, however often it re-renders", () => {
        cy.mount(<RerenderHarness />);

        // The worker is attached during the render that mounts the viewer, so
        // there is one before anything is clicked.
        cy.get('[data-test="renders"]', { timeout: 4000 }).should(
            "have.text",
            "1",
        );
        cy.then(() => {
            expect(workers.created(), "core workers after mount").to.equal(1);
        });

        cy.get('[data-test="rerender"]').click().click().click();
        cy.get('[data-test="renders"]').should("have.text", "4");

        cy.then(() => {
            expect(
                workers.created(),
                "core workers after three re-renders",
            ).to.equal(1);
        });
    });

    it("renders with the worker it primed once `render` turns true", () => {
        cy.mount(<RenderLaterHarness />);
        cy.get('[data-test="structures"]', { timeout: RENDER_TIMEOUT }).should(
            "have.text",
            "1",
        );

        cy.get('[data-test="render"]').click();

        cy.contains("first source", { timeout: RENDER_TIMEOUT }).should(
            "be.visible",
        );
        cy.then(() => {
            // The primed worker has no core yet, so starting one reuses it
            // rather than booting a replacement.
            expect(workers.created(), "core workers after rendering").to.equal(
                1,
            );
        });
    });

    it("renders a source edited while it was not rendering", () => {
        cy.mount(<RenderLaterHarness />);
        cy.get('[data-test="structures"]', { timeout: RENDER_TIMEOUT }).should(
            "have.text",
            "1",
        );

        // Editing re-initializes the primed worker in place, reporting the new
        // source's structure. The source it was primed with must not be the one
        // that ends up on screen.
        cy.get('[data-test="edit"]').click();
        cy.get('[data-test="structures"]', { timeout: RENDER_TIMEOUT }).should(
            "have.text",
            "2",
        );

        cy.get('[data-test="render"]').click();

        cy.contains("second source", { timeout: RENDER_TIMEOUT }).should(
            "be.visible",
        );
        cy.contains("first source").should("not.exist");
        cy.then(() => {
            expect(
                workers.created(),
                "core workers after an edit and a render",
            ).to.equal(1);
        });
    });
});
