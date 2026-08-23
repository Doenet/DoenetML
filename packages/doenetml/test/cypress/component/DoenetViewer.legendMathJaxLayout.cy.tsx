import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// Component coverage for the two guards on the legend's post-typesetting
// layout pass (#1751), neither of which the `@doenet/test-cypress` specs can
// reach: there MathJax is loaded before any DoenetML is posted, and both
// guards only matter while the engine is still in flight.
//
// The pass exists because JSXGraph typesets a latex label with the synchronous
// `MathJax.typeset`, which throws — and is swallowed by JSXGraph's own
// try/catch — when the engine has not loaded yet. The label is then left
// showing raw latex at the wrong width, and the legend, which is laid out from
// its labels' widths, has to be measured again once MathJax arrives.
//
// `loadMathJax` memoizes its promise on `window.__doenetMathJaxPromise`, so
// putting a deferred promise there is what lets a test decide when that pass
// runs, and therefore what lets it happen late enough to be wrong.

/** Where `loadMathJax` memoizes its promise (`mathjax-loader.ts`). */
const MATHJAX_MEMO_KEY = "__doenetMathJaxPromise";

/** Long enough for a cold core boot, short enough to fail rather than hang. */
const VIEWER_TIMEOUT = 15_000;

/** Long enough to be sure a layout that should not happen has not. */
const SETTLE = 500;

type Deferred = { promise: Promise<unknown>; release: () => void };

/**
 * Stands in for a loaded MathJax engine.
 *
 * Nothing here typesets, and nothing needs to: what these specs assert is
 * where the legend ends up, and the layout pass only ever waits on the
 * engine — `await loadMathJax()`, then `await mathJax.startup?.promise`. A
 * real engine would mean fetching MathJax from a CDN inside a hook, which is
 * a network dependency and a flake in a spec that is not about the network.
 *
 * `typeset` is a no-op rather than absent so that JSXGraph, which calls it
 * directly on the global when it draws a latex label, finds something to call.
 * The label is then left showing its latex source, which is what a board drawn
 * mid-load shows anyway.
 */
const FAKE_ENGINE = {
    startup: { promise: Promise.resolve() },
    typeset: () => {},
    typesetPromise: () => Promise.resolve(),
    typesetClear: () => {},
};

function deferEngine(engine: unknown): Deferred {
    let release!: () => void;
    const promise = new Promise((resolve) => {
        release = () => resolve(engine);
    });
    return { promise, release };
}

function setMathJaxMemo(value: unknown) {
    (window as unknown as Record<string, unknown>)[MATHJAX_MEMO_KEY] = value;
}

/**
 * The legend's label, as a fraction of the board's height measured from its
 * top. The legend is placed relative to the graph's limits, so this is what
 * says which limits it was placed from.
 *
 * Found by the plain word its label carries beside the latex, since the
 * board's axis ticks are `.JXGtext` too, and the latex itself reads as one
 * thing before MathJax has typeset it and another after.
 */
function labelHeightFraction(): Cypress.Chainable<number> {
    return cy.get(".jxgbox").then(($board) => {
        const board = $board[0].getBoundingClientRect();
        return cy.contains(".jxgbox .JXGtext", "curve").then(($label) => {
            const label = $label[0].getBoundingClientRect();
            return (label.top - board.top) / board.height;
        });
    });
}

/**
 * A boxed legend with a latex label, on a graph whose top edge a button
 * raises from 10 to 100.
 *
 * An upper legend sits at 95% of the way up whatever the graph's limits are,
 * so it stays put in pixels when they change — unless it is placed from limits
 * that are no longer current. Placed from `ymax="10"` on a graph now running
 * to 100, `legendY` of 9 lands 17% of the way up instead of 95%. Read the way
 * {@link labelHeightFraction} reads it — down from the board's top — that is
 * 0.80 rather than the near-zero an upper legend gives, which is the
 * difference these tests turn on.
 */
const LEGEND_DOC = `
<number name="top">10</number>
<updateValue name="grow" target="$top" newValue="100" type="number">
  <label>grow</label>
</updateValue>
<graph xmin="-10" xmax="10" ymin="-10" ymax="$top">
  <function name="f">x^2</function>
  <legend boxed>
    <label forObject="$f">curve <m>f(x)</m></label>
  </legend>
</graph>
`;

describe("legend layout across a MathJax load (#1751)", () => {
    const engine: unknown = FAKE_ENGINE;

    afterEach(() => {
        // The memo is per realm and the component runner reuses this window,
        // so a deferred promise left behind would stall the next spec's math.
        setMathJaxMemo(Promise.resolve(engine));
        (window as unknown as Record<string, unknown>).MathJax = engine;
    });

    it("draws a legend with latex while MathJax is still loading", () => {
        cy.wrap(null).then(() => {
            const deferred = deferEngine(engine);
            setMathJaxMemo(deferred.promise);
            // What the loader stages on `window.MathJax` before the engine's
            // script runs: a plain config object, with no `startup`. Reading
            // `MathJax.startup.promise` off it throws a TypeError — out of a
            // render, and ahead of any `.catch` — which used to take the whole
            // document down rather than leave the legend to be laid out later.
            (window as unknown as Record<string, unknown>).MathJax = {
                tex: { inlineMath: [["\\(", "\\)"]] },
            };
            cy.mount(
                <DoenetViewer
                    doenetML={LEGEND_DOC}
                    addVirtualKeyboard={false}
                />,
            );

            cy.get(".jxgbox", { timeout: VIEWER_TIMEOUT }).should("exist");
            cy.contains(".jxgbox .JXGtext", "curve").should("be.visible");
            // The document is still standing, not replaced by an error.
            cy.get("button").contains("grow").should("be.visible");

            cy.wrap(null).then(() => deferred.release());
            // And the legend is laid out where an upper legend belongs.
            labelHeightFraction().should("be.lessThan", 0.4);
        });
    });

    it("ignores a layout pass whose graph limits are no longer current", () => {
        cy.wrap(null).then(() => {
            const stale = deferEngine(engine);
            setMathJaxMemo(stale.promise);

            cy.mount(
                <DoenetViewer
                    doenetML={LEGEND_DOC}
                    addVirtualKeyboard={false}
                />,
            );

            cy.get(".jxgbox", { timeout: VIEWER_TIMEOUT }).should("exist");
            cy.contains(".jxgbox .JXGtext", "curve").should("be.visible");

            // Hand the engine straight to every later layout, so the one the
            // raised graph schedules runs promptly and this test is left
            // waiting only on the pass held open above.
            cy.wrap(null).then(() => setMathJaxMemo(Promise.resolve(engine)));

            cy.get("button").contains("grow").click();

            // Redrawn for the raised graph: still 95% of the way up it.
            labelHeightFraction().should("be.lessThan", 0.4);

            // Now let the pass scheduled for the *old* graph arrive. It closes
            // over limits that ran to 10, and reaches the legend through refs
            // that now hold the objects drawn for a graph running to 100, so
            // applying it would drag the legend 80% of the way down the board.
            cy.wrap(null).then(() => stale.release());
            cy.wait(SETTLE);
            labelHeightFraction().should("be.lessThan", 0.4);
        });
    });
});
