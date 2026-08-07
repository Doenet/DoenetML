import { cesc } from "@doenet/utils";
import { verifyListItemContentTopAligned } from "./utils/listItemNumberAlignment";

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
        verifyListItemContentTopAligned("li1");
        cy.get(`#${cesc("ans1")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        // The legend/div swap only applies inside a real list item's first
        // child — confirm the quirk-avoiding <div> is used here, not <legend>.
        cy.get(`#${cesc("ans1")} fieldset > legend`).should("not.exist");

        // A choiceInput directly inside <li> (no <answer> wrapper) is covered
        // by the same mechanism. Its own id is on the <fieldset> itself here
        // (there's no wrapping <answer> span), unlike the ans1 case above.
        verifyListItemContentTopAligned("li2");
        cy.get(`#${cesc("ci2")}`).should("have.css", "margin-top", "0px");
    });

    it("li number aligns with other block first children (<p>, <graph>, nested <ol>)", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="li1"><p name="p1">Paragraph first child</p></li>
      <li name="li2"><graph name="g1" size="small"><point>(1,2)</point></graph></li>
      <li name="li3"><ol name="nested"><li name="nestedLi">Nested item</li></ol></li>
    </ol>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("li1")}`).should("be.visible");
        verifyListItemContentTopAligned("li1");
        verifyListItemContentTopAligned("li2");
        // Nested list as first child: no crash, still renders its own marker.
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
        verifyListItemContentTopAligned("li1");
        cy.get(`#${cesc("ans1")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
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
        verifyListItemContentTopAligned("li1");
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
