import { cesc } from "@doenet/utils";
import { verifyListItemMarkerSharesRowWith } from "./utils/listItemNumberAlignment";
import { verifySideBySideColumnTopAlignment } from "./utils/listItemAlignment";

/*
 * Fixed in #1668: a real `<ol>/<ul>` `<li>` whose first child is a labeled block
 * `<choiceInput>` rendered its "1." beside the first choice instead of beside
 * the question label.
 *
 * The fix has two halves, and both are asserted here:
 *
 *   1. `<li>` publishes the list-item alignment signal that `<problem>`-style
 *      sections publish, which is how the `<choiceInput>` learns it leads a list
 *      item at all. Its own visible effect is suppressing the leading child's
 *      top margin (`margin-top: 0px`).
 *   2. Gated on that signal, the label renders in a `<div>` rather than a
 *      `<legend>` — a `<legend>` gets special layout treatment that makes the
 *      browser align the marker with the content *after* it.
 *
 * (2) is the half that moves the marker; (1) is what tells it when to fire. On
 * top of both mechanisms, `verifyListItemMarkerSharesRowWith()` measures where
 * the marker really landed; see its doc comment for how a marker that is in no
 * rect gets measured at all.
 */
describe("List Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // The first item is byte-faithful to Doenet-Experiments/Alignment.doenet
    // (the file that reported the bug), with only `name` attributes added for
    // targeting; the second drops the `<answer>` wrapper.
    it("li marker aligns with a labeled choiceInput first child, inside <answer> and directly", () => {
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

        cy.get(`#${cesc("li2")}`).should("be.visible");

        verifyListItemMarkerSharesRowWith("li1", `#${cesc("ci1")}-label`);
        cy.get(`#${cesc("ans1")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        cy.get(`#${cesc("ans1")} fieldset > legend`).should("not.exist");

        // The swap must move the marker's row and nothing else: the label keeps
        // the inline padding the UA stylesheet gives a `<legend>` (asserted on a
        // real `<legend>` in the negative test below), so its text does not
        // shift sideways.
        cy.get(`#${cesc("ci1")}-label`).should(
            "have.css",
            "padding-inline-start",
            "2px",
        );

        // A choiceInput directly inside `<li>` (no `<answer>` wrapper) is covered
        // by the same mechanism. Its own id is on the `<fieldset>` itself here.
        verifyListItemMarkerSharesRowWith("li2", `#${cesc("ci2")}-label`);
        cy.get(`#${cesc("ci2")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("ci2")} > legend`).should("not.exist");
    });

    // The signal has to survive every component that forwards
    // `childrenToRenderInlineForListItem`: the pass-through wrappers
    // (`<div>`, `<blockQuote>`, `<stack>`, …) and `<sideBySide>`, which hands it
    // to its panels. Each of these reproduced the original bug at some point
    // during development, one level deeper than the last, which is why this
    // asserts the rendered outcome at every depth rather than trusting the
    // forwarding chain.
    it("aligns the marker through a wrapper and through a <sideBySide> panel", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="liDiv">
        <div>
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
        <blockQuote>
          <choiceInput name="ciQuote">
            <label>Label inside a blockQuote</label>
            <choice credit="1">A</choice>
            <choice>B</choice>
          </choiceInput>
        </blockQuote>
      </li>
      <li name="liSbs">
        <sideBySide name="sbs">
          <div>
            <answer name="ansSbs">
              <choiceInput name="ciSbs">
                <label>Label in a sideBySide panel</label>
                <choice credit="1">A</choice>
                <choice>B</choice>
              </choiceInput>
            </answer>
          </div>
          <p>The other panel</p>
        </sideBySide>
      </li>
    </ol>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("liSbs")}`).should("be.visible");

        verifyListItemMarkerSharesRowWith("liDiv", `#${cesc("ciDiv")}-label`);
        cy.get(`#${cesc("ansDiv")} fieldset > legend`).should("not.exist");

        verifyListItemMarkerSharesRowWith(
            "liQuote",
            `#${cesc("ciQuote")}-label`,
        );
        cy.get(`#${cesc("ciQuote")} > legend`).should("not.exist");

        verifyListItemMarkerSharesRowWith("liSbs", `#${cesc("ciSbs")}-label`);
        cy.get(`#${cesc("ansSbs")} fieldset > legend`).should("not.exist");

        // A `<sideBySide>` leading a list item is the one consumer of the signal
        // that does more than suppress a top margin: it also switches its panels
        // to the flex alignment a section's `<sideBySide>` has always used
        // (`flex-start` here, because the leading panel's content is a block
        // `<choiceInput>` rather than a `<p>`). Same helper as the section-path
        // guard in `problem.cy.js`, so the two paths are pinned to one contract.
        verifySideBySideColumnTopAlignment({
            sideBySideId: "sbs",
            expectedAlignment: "flex-start",
        });
    });

    // A child that hides itself must not take the lead of its list item: the
    // renderer drops it, so the child behind it is what the marker has to line
    // up with. `<li>` and a `<task>` section share one implementation of this
    // (`childRendersSomething()`), so both are checked — the section arm through
    // the top margin, since a section's number is a `::before` the marker scan
    // does not apply to.
    it("skips a first child that hides itself, in a list item and in a section", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="liHidden">
        <p name="hiddenP" hide>Hidden setup text</p>
        <answer name="ansHidden">
          <choiceInput name="ciHidden">
            <label>Label behind a hidden paragraph</label>
            <choice credit="1">A</choice>
            <choice>B</choice>
          </choiceInput>
        </answer>
      </li>
    </ol>
    <problem name="problem">
      <task name="taskHidden">
        <p name="hiddenP2" hide>Hidden setup text</p>
        <answer name="ansTask">
          <choiceInput name="ciTask">
            <label>Label behind a hidden paragraph</label>
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

        cy.get(`#${cesc("liHidden")}`).should("be.visible");
        cy.get(`#${cesc("hiddenP")}`).should("not.exist");

        // The marker lands on the label's row, not a row below it.
        verifyListItemMarkerSharesRowWith(
            "liHidden",
            `#${cesc("ciHidden")}-label`,
        );
        cy.get(`#${cesc("ansHidden")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        cy.get(`#${cesc("ansHidden")} fieldset > legend`).should("not.exist");

        // The section path agrees: the `<answer>` behind the hidden `<p>` is the
        // one whose top margin is suppressed. Its label keeps its `<legend>` —
        // a section draws its own number and never had the `<legend>` quirk.
        cy.get(`#${cesc("taskHidden")}`).should("be.visible");
        cy.get(`#${cesc("ansTask")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        cy.get(`#${cesc("ansTask")} fieldset > legend`).should("exist");
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
    // default top margin of their own, so there is nothing to assert.
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

        // A nested list as the first child renders its own markers and is not
        // disturbed by the signal (list.tsx ignores `renderInlineForListItem`).
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
    });

    // The swap needs both of its conditions: the `<choiceInput>` leads its list
    // item (`renderInlineForListItem`) *and* a real `<li>` is somewhere above it
    // (`insideNativeListItem`). Each arm below is missing one, so all three
    // keep a native `<legend>`. The `<problem asList>` arm matters most — it
    // shares `renderInlineForListItem` for its own `::before`/grid number and
    // never had the `<legend>` quirk, so swapping there would change
    // already-working behavior for a case this fix was never meant to touch. The
    // last arm is the other direction: a `<choiceInput>` behind a leading `<p>`
    // is inside an `<li>`, but the marker is not on its row.
    it("keeps a native <legend> outside a list item, in a section, and away from the marker's row", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <p>
      <answer name="ansPlain">
        <choiceInput name="ciPlain">
          <label>Pick one</label>
          <choice credit="1">A</choice>
          <choice>B</choice>
        </choiceInput>
      </answer>
    </p>
    <problem>
      <task name="task1">
        <answer name="ansTask">
          <choiceInput name="ciTask">
            <label>Pick one</label>
            <choice credit="1">A</choice>
            <choice>B</choice>
          </choiceInput>
        </answer>
      </task>
    </problem>
    <ol>
      <li name="liLate">
        <p>Some intro text</p>
        <answer name="ansLate">
          <choiceInput name="ciLate">
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

        cy.get(`#${cesc("liLate")}`).should("be.visible");

        // Not a list item's first child: native `<legend>` semantics are kept,
        // and the fieldset's top margin is not suppressed.
        cy.get(`#${cesc("ansPlain")} fieldset > legend`).should("exist");
        cy.get(`#${cesc("ansPlain")} fieldset`).should(
            "have.css",
            "margin-top",
            "16px",
        );
        // The inset the swapped `<div>` has to reproduce, measured on a real
        // `<legend>` rather than assumed — this is where the 2px in
        // `choiceInput.tsx` comes from.
        cy.get(`#${cesc("ciPlain")}-label`).should(
            "have.css",
            "padding-inline-start",
            "2px",
        );

        // A `<problem asList>` section: margin suppression still applies
        // (pre-existing, correct for its own numbering) but the `<legend>` stays.
        cy.get(`#${cesc("ansTask")} fieldset > legend`).should("exist");
        cy.get(`#${cesc("ansTask")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );

        // Inside a real `<li>` but behind a leading `<p>`, so the marker sits on
        // the paragraph's row and the `<legend>` cannot disturb it.
        cy.get(`#${cesc("ansLate")} fieldset > legend`).should("exist");
        cy.get(`#${cesc("ansLate")} fieldset`).should(
            "have.css",
            "margin-top",
            "16px",
        );
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
        verifyListItemMarkerSharesRowWith("li1", `#${cesc("ci1")}-label`);
        cy.get(`#${cesc("ans1")} fieldset > legend`).should("not.exist");
    });

    // Confirms the accessible name actually resolves in the browser for the
    // swapped-to-`<div>` case, not just that a `<div>` with the right id exists.
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
