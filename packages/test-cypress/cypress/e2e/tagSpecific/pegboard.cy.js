/**
 * How many pegs are drawn across every JSXGraph board on the page.
 *
 * Counting them is the only way to see a pegboard at all: a peg is a bare
 * JSXGraph point with no DoenetML component behind it, so it has no name to
 * query and no state variable to read. It is told apart from any other point
 * on the board by the color the renderer gives it.
 */
function pegsOn(win) {
    let total = 0;
    for (const board of Object.values(win.JXG?.boards ?? {})) {
        total += Object.values(board.objects ?? {}).filter(
            (obj) =>
                obj?.elType === "point" &&
                obj?.visProp?.fillcolor === "darkgray",
        ).length;
    }
    return total;
}

/**
 * Assert the peg count, retrying until it settles. `cy.window().then()` would
 * read once, before the board has caught up with the action that preceded it.
 */
function expectPegs(count, label) {
    cy.window().should((win) => {
        expect(pegsOn(win), label).to.eq(count);
    });
}

/**
 * Load `doenetML` and wait for it to render. Each document below opens with
 * the same `<text name="a">a</text>`, which is what there is to wait on.
 */
function loadDoenetML(doenetML) {
    cy.window().then((win) => {
        win.postMessage({ doenetML }, "*");
    });

    cy.get("#a").should("have.text", "a");
}

describe("Pegboard Tag Tests", { tags: ["@group2"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("stays gone once removed, even when the graph is panned or zoomed", () => {
        // The board outlives a pegboard removed from the document, so its
        // `boundingbox` listener has to go with the component. Left behind, it
        // finds no pegs on the next bounding box change and builds a fresh
        // set, which belongs to no mounted component and can never be removed.
        loadDoenetML(`
    <text name="a">a</text>
    <booleanInput name="show" prefill="true" />
    <graph name="g" xmin="-5" xmax="5" ymin="-5" ymax="5">
      <conditionalContent condition="$show"><pegboard/></conditionalContent>
    </graph>
    <p>Change xmax: <mathInput name="xmaxInput" bindValueTo="$g.xmax" /></p>
    `);

        // A 9x9 lattice: the pegs strictly inside a bounding box of -5 to 5.
        expectPegs(81, "pegs on first render");

        cy.get("#show").click();
        expectPegs(0, "pegs after the pegboard is removed");

        // Widening the graph fires `boundingbox` on the still-live board.
        cy.get("#xmaxInput textarea").type("{end}{backspace}9{enter}", {
            force: true,
        });
        expectPegs(0, "pegs after the bounding box changes");
    });

    it("follows the bounding box while it is in the document", () => {
        // The counterpart to the test above: the listener must still be doing
        // its job, or that one would pass with the pegboard simply broken.
        loadDoenetML(`
    <text name="a">a</text>
    <graph name="g" xmin="-5" xmax="5" ymin="-5" ymax="5">
      <pegboard/>
    </graph>
    <p>Change xmax: <mathInput name="xmaxInput" bindValueTo="$g.xmax" /></p>
    `);

        expectPegs(81, "pegs on first render");

        // x now runs -5 to 9, so 13 columns of 9.
        cy.get("#xmaxInput textarea").type("{end}{backspace}9{enter}", {
            force: true,
        });
        expectPegs(117, "pegs after the graph widens");
    });

    it("comes back following the bounding box after a spell with nothing to draw", () => {
        // A pegboard whose spacing goes to zero has its pegs deleted, by the
        // same code that clears them when it leaves the document. Only the
        // latter may take the listener with it: this pegboard is still
        // mounted, so it has to re-tile once it has a lattice to draw again.
        loadDoenetML(`
    <text name="a">a</text>
    <p>Change dx: <mathInput name="dxInput" prefill="1" /></p>
    <graph name="g" xmin="-5" xmax="5" ymin="-5" ymax="5">
      <pegboard dx="$dxInput" />
    </graph>
    <p>Change xmax: <mathInput name="xmaxInput" bindValueTo="$g.xmax" /></p>
    `);

        expectPegs(81, "pegs on first render");

        cy.get("#dxInput textarea").type("{end}{backspace}0{enter}", {
            force: true,
        });
        expectPegs(0, "pegs at a spacing of zero");

        cy.get("#dxInput textarea").type("{end}{backspace}1{enter}", {
            force: true,
        });
        expectPegs(81, "pegs once the spacing is restored");

        cy.get("#xmaxInput textarea").type("{end}{backspace}9{enter}", {
            force: true,
        });
        expectPegs(117, "pegs after the graph widens");
    });
});
