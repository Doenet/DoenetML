import { cesc } from "@doenet/utils";

/*
 * A real `<ol>/<ul>` `<li>` draws a native browser `::marker`, and its vertical
 * position is not observable from the DOM: the marker is painted in the `<ol>`'s
 * padding, outside the `<li>`'s box, and moving it perturbs no queryable rect
 * (measured — see the note at the end of ./utils/listItemNumberAlignment.js).
 *
 * So these specs assert the two mechanisms that decide where the marker lands,
 * rather than the marker itself:
 *
 *   1. the first child's top margin is suppressed (`margin-top: 0px`), so the
 *      content starts at the `<li>`'s top edge; and
 *   2. a labeled non-inline `<choiceInput>` leading a real `<li>` renders its
 *      label in a `<div>`, not a `<legend>` — a `<legend>` gets special layout
 *      treatment that makes the browser align the marker with the content *after*
 *      it (the first choice row) instead of with the label.
 *
 * Both were verified to fail against a build with the fix reverted, so they are
 * regression guards and not just documentation. (2) is the one that actually
 * moves the marker; (1) only removes dead space above the item, because a block
 * child's top margin otherwise collapses out through the padding/border-free
 * `<li>` and carries the marker down with it.
 */
describe("List Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("li number aligns with a block choiceInput first child, inside <answer> and directly", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="li1">
        <answer name="ans1">
          <choiceInput selectMultiple shuffleOrder name="ci1">
            <label>Which of these are the variables in the problem?</label>
            <choice credit="1">t</choice>
            <choice>g</choice>
            <choice>v_0</choice>
            <choice>x</choice>
            <choice>y</choice>
          </choiceInput>
        </answer>
      </li>
      <li name="li2">
        <choiceInput name="ci2">
          <label>Pick one</label>
          <choice credit="1">A</choice>
          <choice>B</choice>
        </choiceInput>
      </li>
    </ol>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("li1")}`).should("be.visible");

        // The bug's exact repro: an <answer><choiceInput> as the sole child of
        // a real <li>. Before the fix, the "1." marker aligned with the first
        // choice row instead of the label.
        cy.get(`#${cesc("ans1")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        cy.get(`#${cesc("ans1")} fieldset > legend`).should("not.exist");

        // A choiceInput directly inside <li> (no <answer> wrapper) is covered
        // by the same mechanism. Its own id is on the <fieldset> itself here
        // (there's no wrapping <answer> span), unlike the ans1 case above.
        cy.get(`#${cesc("ci2")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("ci2")} > legend`).should("not.exist");
    });

    // The relay has to survive a wrapper between the <li> and the choiceInput.
    // <div>/<blockQuote>/<stack>/<column> forward the list-item signal through
    // `returnPassThroughListItemChildStateVariableDefinitions`, and before that
    // mixin also relayed `listItemHasNativeMarker` these two rendered a <legend>
    // and reproduced the original bug one wrapper deep.
    it("swaps legend through a wrapper between <li> and the choiceInput", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="liDiv">
        <div name="d1">
          <answer name="ansDiv">
            <choiceInput name="ciDiv">
              <label>Label inside a div wrapper</label>
              <choice credit="1">A</choice>
              <choice>B</choice>
            </choiceInput>
          </answer>
        </div>
      </li>
      <li name="liQuote">
        <blockQuote name="bq1">
          <choiceInput name="ciQuote">
            <label>Label inside a blockQuote</label>
            <choice credit="1">A</choice>
            <choice>B</choice>
          </choiceInput>
        </blockQuote>
      </li>
    </ol>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("liQuote")}`).should("be.visible");

        cy.get(`#${cesc("ansDiv")} fieldset > legend`).should("not.exist");
        cy.get(`#${cesc("ansDiv")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );

        cy.get(`#${cesc("ciQuote")} > legend`).should("not.exist");
        cy.get(`#${cesc("ciQuote")}`).should("have.css", "margin-top", "0px");
    });

    // Publishing the list-item signal from a plain `<li>` for the first time
    // reaches every renderer that consumes `renderInlineForListItem`, not just
    // `<choiceInput>`. This mirrors the section path's coverage in
    // `problem.cy.js` ("untitled unboxed list items align numbering with block
    // first children") for the types where the suppression is observable.
    //
    // Each `in`/`out` pair is a real assertion: the same component outside a list
    // item keeps its default top margin, so the `0px` inside one cannot pass by
    // accident. `<div>` and `<stack>` are deliberately absent — they carry no
    // default top margin of their own, so their suppression is a no-op here and
    // there is nothing to assert.
    it("suppresses the first child's top margin for every block first-child type", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="liP"><p name="pIn">Paragraph first child</p></li>
      <li name="liPre"><pre name="preIn">x+y</pre></li>
      <li name="liQuote"><blockQuote name="quoteIn"><p>Quoted</p></blockQuote></li>
      <li name="liGraph"><graph name="graphIn" size="small"><point>(1,2)</point></graph></li>
      <li name="liNested"><ol name="nested"><li name="nestedLi">Nested item</li></ol></li>
    </ol>
    <p name="pOut">Paragraph outside a list</p>
    <pre name="preOut">x+y</pre>
    <blockQuote name="quoteOut"><p>Quoted</p></blockQuote>
    <graph name="graphOut" size="small"><point>(1,2)</point></graph>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("nestedLi")}`).should("be.visible");

        [
            ["pIn", "pOut", "16px"],
            ["preIn", "preOut", "12px"],
            ["quoteIn", "quoteOut", "16px"],
            ["graphIn", "graphOut", "12px"],
        ].forEach(([inId, outId, outsideMargin]) => {
            cy.get(`#${cesc(inId)}`).should("have.css", "margin-top", "0px");
            cy.get(`#${cesc(outId)}`).should(
                "have.css",
                "margin-top",
                outsideMargin,
            );
        });

        // A nested list as the first child renders its own markers and is not
        // disturbed by the signal (list.tsx ignores `renderInlineForListItem`).
        cy.get(`#${cesc("nestedLi")}`).should("be.visible");
    });

    it("does not swap legend for a non-inline choiceInput outside a list item", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p name="p1">
      <answer name="ans1">
        <choiceInput name="ci1">
          <label>Pick one</label>
          <choice credit="1">A</choice>
          <choice>B</choice>
        </choiceInput>
      </answer>
    </p>
    `,
                },
                "*",
            );
        });

        // Not a list item's first child: native <legend> semantics are kept,
        // and the fieldset's top margin is not suppressed.
        cy.get(`#${cesc("ans1")} fieldset > legend`).should("exist");
        cy.get(`#${cesc("ans1")} fieldset`).should(
            "have.css",
            "margin-top",
            "16px",
        );
    });

    it("does not swap legend for an inline choiceInput inside a list item", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="li1">
        <answer name="ans1">
          <choiceInput inline name="ci1">
            <label>Pick one</label>
            <choice credit="1">A</choice>
            <choice>B</choice>
          </choiceInput>
        </answer>
      </li>
    </ol>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("li1")}`).should("be.visible");
        // Answer.js only forwards flex-start alignment for a non-inline
        // choiceInput; an inline one keeps native <legend> rendering (moot
        // here since the inline branch never renders a fieldset at all, but
        // this pins down that no fieldset/legend swap logic misfires).
        cy.get(`#${cesc("ans1")} fieldset`).should("not.exist");
    });

    it("<ul> gets the same first-child alignment as <ol>", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ul>
      <li name="li1">
        <answer name="ans1">
          <choiceInput name="ci1">
            <label>Pick one</label>
            <choice credit="1">A</choice>
            <choice>B</choice>
          </choiceInput>
        </answer>
      </li>
    </ul>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("li1")}`).should("be.visible");
        cy.get(`#${cesc("ans1")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        cy.get(`#${cesc("ans1")} fieldset > legend`).should("not.exist");
    });

    // Byte-faithful to Doenet-Experiments/Alignment.doenet (the file that
    // reported the original bug), with only `name` attributes added for
    // targeting. The most authoritative "does it actually work" check.
    it("aligns the original Alignment.doenet repro (with <m> math choices)", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="li1">
        <answer name="ans1">
          <choiceInput selectMultiple shuffleOrder name="ci1">
            <label>Which of these are the variables in the problem?</label>
            <choice credit="1"><m>t</m></choice>
            <choice><m>g</m></choice>
            <choice><m>v_0</m></choice>
            <choice><m>x</m></choice>
            <choice><m>y</m></choice>
          </choiceInput>
        </answer>
      </li>
    </ol>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("li1")}`).should("be.visible");
        cy.get(`#${cesc("ans1")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        cy.get(`#${cesc("ans1")} fieldset > legend`).should("not.exist");
    });

    // Regression test for a bug found during review: renderInlineForListItem
    // is shared between a real <li> and a <problem asList> section (its own
    // ::before/grid number, no <legend> quirk to work around). The legend/div
    // swap must NOT fire there, or it silently changes already-working,
    // already-tested behavior for a case the fix was never meant to touch.
    it("does not swap legend for a choiceInput inside a <problem asList> section (no real <li>)", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <problem name="problem">
      <task name="task1">
        <answer name="ans1">
          <choiceInput name="ci1">
            <label>Pick one</label>
            <choice credit="1">A</choice>
            <choice>B</choice>
          </choiceInput>
        </answer>
      </task>
    </problem>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("task1")}`).should("be.visible");
        // Margin suppression still applies (pre-existing, correct behavior
        // for asList numbering) ...
        cy.get(`#${cesc("ans1")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        // ... but there's no real <li>/native marker here, so the <legend>
        // must be kept, not swapped for a <div>.
        cy.get(`#${cesc("ans1")} fieldset > legend`).should("exist");
    });

    // Confirms the accessible name actually resolves in the browser for the
    // swapped-to-<div> case, not just that a <div> with the right id exists.
    it("aria-labelledby resolves to the swapped <div> and its text matches the label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="li1">
        <answer name="ans1">
          <choiceInput name="ci1">
            <label>Which of these are the variables in the problem?</label>
            <choice credit="1">A</choice>
            <choice>B</choice>
          </choiceInput>
        </answer>
      </li>
    </ol>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("li1")}`).should("be.visible");
        cy.get(`#${cesc("ans1")} fieldset`).should(($fieldset) => {
            const fieldset = $fieldset[0];
            const labelledBy = fieldset.getAttribute("aria-labelledby");
            expect(labelledBy, "aria-labelledby is set").to.be.a("string").and
                .not.be.empty;

            const labelIds = labelledBy.split(/\s+/);
            const labelEl = fieldset.ownerDocument.getElementById(labelIds[0]);
            expect(labelEl, "labelled element exists").to.exist;
            expect(
                labelEl.tagName,
                "labelled element is the swapped div",
            ).to.equal("DIV");
            expect(labelEl.textContent).to.contain(
                "Which of these are the variables in the problem?",
            );
        });
    });
});
