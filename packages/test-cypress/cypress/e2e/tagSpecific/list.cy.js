import { cesc } from "@doenet/utils";
import { verifyListItemMarkerSharesRowWith } from "./utils/listItemNumberAlignment";
import { verifySideBySideColumnTopAlignment } from "./utils/listItemAlignment";

/*
 * Fixed in #1668: a real `<ol>/<ul>` `<li>` whose first child is a labeled block
 * `<choiceInput>` rendered its "1." beside the first choice instead of beside
 * the question label.
 *
 * Two independent mechanisms, and this file keeps them apart because they failed
 * for different reasons:
 *
 *   1. The label renders in a `<div>`, never a `<legend>`. A `<legend>` gets
 *      special layout treatment that makes the browser align the marker with the
 *      content *after* it. This is the half that moves the marker, and it is
 *      unconditional — see `choiceInput.tsx`. It was originally gated on the
 *      core's list-item signal, which left the bug alive for every wrapper that
 *      does not forward that signal (`<li><p>`, `<li><span>`, `<li><em>`); the
 *      wrapper matrix below is what would catch that recurring.
 *   2. `<li>` publishes the list-item alignment signal `<problem>`-style
 *      sections publish, which suppresses the leading child's top margin
 *      (`margin-top: 0px`). Still positional, because a gap it misses costs
 *      spacing rather than a misplaced number.
 *
 * `verifyListItemMarkerSharesRowWith()` measures where the marker really landed;
 * see its doc comment for how a marker that is in no rect gets measured at all.
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

        // Dropping the `<legend>` must move the marker's row and nothing else:
        // the label keeps the inline padding a UA stylesheet gives a `<legend>`,
        // so its text does not shift sideways.
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
    // during development, one level deeper than the last.
    //
    // What a break in that chain costs is asserted here as the top margin, not
    // as the marker's row: the marker moved because of the `<legend>`, and the
    // label is a `<div>` at every depth now, so a marker assertion alone would
    // pass on a chain that forwarded nothing. The marker assertions stay because
    // they are what the reader actually sees, but the `margin-top: 0px` beside
    // each one is what fails if a wrapper stops forwarding.
    it("suppresses the leading child's top margin through a wrapper and through a <sideBySide> panel", () => {
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
        // The `<div>` wrapper forwarded the signal to the `<answer>`, which
        // forwarded it to the `<choiceInput>` it holds.
        cy.get(`#${cesc("ansDiv")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );

        verifyListItemMarkerSharesRowWith(
            "liQuote",
            `#${cesc("ciQuote")}-label`,
        );
        cy.get(`#${cesc("ciQuote")} > legend`).should("not.exist");
        // A `<blockQuote>` forwards to the `<choiceInput>` directly.
        cy.get(`#${cesc("ciQuote")}`).should("have.css", "margin-top", "0px");

        verifyListItemMarkerSharesRowWith("liSbs", `#${cesc("ciSbs")}-label`);
        cy.get(`#${cesc("ansSbs")} fieldset > legend`).should("not.exist");
        // Three links deep: panel, `<div>`, `<answer>`.
        cy.get(`#${cesc("ansSbs")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );

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
    // renderer drops it, so the child behind it is the one whose spacing the item
    // has to fix up. `<li>` and a `<task>` section share one implementation of
    // this (`childRendersSomething()`), so both are checked.
    //
    // `margin-top: 0px` is the assertion that fails without the fix, in both
    // arms. The marker measurement beside it does not: with nothing rendered
    // ahead of the fieldset, the browser puts the marker on the label's row
    // whichever child the core called the lead. It is kept as the statement of
    // what the reader should see, next to the check that earns it.
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
        // one whose top margin is suppressed.
        cy.get(`#${cesc("taskHidden")}`).should("be.visible");
        cy.get(`#${cesc("ansTask")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        cy.get(`#${cesc("ansTask")} fieldset > legend`).should("not.exist");
    });

    // Every other case here loads the document with the child already hidden,
    // but `hide` takes a boolean an author can drive from anything, so it changes
    // while the activity is open. The lead has to follow it: the spacing a reader
    // sees must not depend on which state the document started in. Both
    // directions, because a lead that moved once and then stuck would satisfy
    // half of that. `lists.test.ts` toggles the same document through the core;
    // this is the rendered outcome in a real build.
    it("moves a list item's lead when a first child's hide toggles", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <booleanInput name="b" />
    <ol>
      <li name="item">
        <p name="lead" hide="$b">Sometimes hidden</p>
        <choiceInput name="ci">
          <label>Label behind a sometimes-hidden paragraph</label>
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

        cy.get(`#${cesc("item")}`).should("be.visible");

        // Shown: the `<p>` leads, so it is the one without a top margin and the
        // one the marker sits beside.
        cy.get(`#${cesc("lead")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("ci")}`).should("have.css", "margin-top", "16px");
        verifyListItemMarkerSharesRowWith("item", `#${cesc("lead")}`);

        cy.get("#b_input").click({ force: true });

        // Hidden: the `<choiceInput>` takes over, and the marker is on its label.
        cy.get(`#${cesc("lead")}`).should("not.exist");
        cy.get(`#${cesc("ci")}`).should("have.css", "margin-top", "0px");
        verifyListItemMarkerSharesRowWith("item", `#${cesc("ci")}-label`);

        cy.get("#b_input").click({ force: true });

        // And back: revealing the paragraph returns the lead to it.
        cy.get(`#${cesc("lead")}`).should("have.css", "margin-top", "0px");
        cy.get(`#${cesc("ci")}`).should("have.css", "margin-top", "16px");
        verifyListItemMarkerSharesRowWith("item", `#${cesc("lead")}`);
    });

    // The lead is handed down a chain: the `<li>` picks its first visible child,
    // and a wrapper (`<div>` here, and equally a `<blockQuote>` or a
    // `<sideBySide>` panel — the components #1668 already routes the signal
    // through) forwards it to its own first visible child. Both links have to
    // apply the same visibility test; when only the outer one did, the `<p hide>`
    // one level in kept the forward and the `<answer>` behind it kept the top
    // margin the item wanted suppressed — again the `margin-top: 0px` below, not
    // the marker, is what notices.
    it("skips a child that hides itself inside a wrapper leading a list item", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="liWrapped">
        <div name="divWrapper">
          <p name="hiddenP" hide>Hidden setup text</p>
          <answer name="ansWrapped">
            <choiceInput name="ciWrapped">
              <label>Label behind a hidden paragraph</label>
              <choice credit="1">A</choice>
              <choice>B</choice>
            </choiceInput>
          </answer>
        </div>
      </li>
    </ol>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("liWrapped")}`).should("be.visible");
        cy.get(`#${cesc("hiddenP")}`).should("not.exist");

        verifyListItemMarkerSharesRowWith(
            "liWrapped",
            `#${cesc("ciWrapped")}-label`,
        );
        cy.get(`#${cesc("ansWrapped")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );
        cy.get(`#${cesc("ansWrapped")} fieldset > legend`).should("not.exist");
    });

    // A `<sideBySide>` leading a list item takes its top-or-baseline alignment
    // from one panel — `baseline` for a paragraph, so the number lines up with
    // the text, `flex-start` for anything else. That panel has to be one that is
    // shown: a hidden panel keeps its column but puts no text in it, so a
    // `baseline` read off it lands the row's baseline on whatever the next panel
    // happens to draw. This is only visible in a browser, since the alignment is
    // pure CSS on the rendered flex row.
    it("takes a leading sideBySide's alignment from its first panel that is shown", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <ol>
      <li name="liHiddenPanel">
        <sideBySide name="sbsHiddenPanel">
          <p name="hiddenPanel" hide>Hidden panel</p>
          <graph name="graphPanel" size="small"><point>(1,2)</point></graph>
        </sideBySide>
      </li>
      <li name="liShownPanel">
        <sideBySide name="sbsShownPanel">
          <p name="shownPanel">Shown panel</p>
          <graph size="small"><point>(1,2)</point></graph>
        </sideBySide>
      </li>
    </ol>
    `,
                },
                "*",
            );
        });

        cy.get(`#${cesc("liShownPanel")}`).should("be.visible");
        cy.get(`#${cesc("hiddenPanel")}`).should("not.exist");

        // The hidden paragraph is skipped, so the `<graph>` decides: top-align,
        // and the panels' top edges agree.
        verifySideBySideColumnTopAlignment({
            sideBySideId: "sbsHiddenPanel",
            expectedAlignment: "flex-start",
        });

        // The control: shown, the same paragraph still reports its baseline.
        verifySideBySideColumnTopAlignment({
            sideBySideId: "sbsShownPanel",
            expectedAlignment: "baseline",
        });
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

    // A non-inline `<choiceInput>` renders its label in a `<div>` wherever it
    // sits — outside any list item, in a `<problem asList>` section, and inside
    // an `<li>` but behind a leading `<p>`. The label is never a `<legend>`,
    // because deciding that per position is what left `<li><p>`, `<li><span>`
    // and `<li><em>` misaligned: those wrappers forward no signal, and the set
    // of things an author can wrap an input in has no end.
    //
    // Margin suppression is still positional, and these arms pin that: only the
    // one leading a list item loses its top margin. A gap there costs spacing,
    // not a misplaced number, which is why it is safe to leave positional.
    it("renders the label in a <div> wherever the input sits, and suppresses the top margin only for a list item's lead", () => {
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

        // No `<legend>` anywhere, and every label carries the same inset. The
        // 2px is what a browser's UA stylesheet gives a `<legend>`, kept so that
        // dropping the element moved no label; no spec can measure it on a real
        // `<legend>` any more, because none is rendered.
        ["ansPlain", "ansTask", "ansLate"].forEach((answerName) => {
            cy.get(`#${cesc(answerName)} fieldset > legend`).should(
                "not.exist",
            );
        });
        ["ciPlain", "ciTask", "ciLate"].forEach((inputName) => {
            cy.get(`#${cesc(inputName)}-label`)
                .should(($label) => {
                    expect($label[0].tagName, `${inputName} label`).to.equal(
                        "DIV",
                    );
                })
                .and("have.css", "padding-inline-start", "2px");
        });

        // Not a list item's lead: top margin kept.
        cy.get(`#${cesc("ansPlain")} fieldset`).should(
            "have.css",
            "margin-top",
            "16px",
        );

        // Leads a `<problem asList>` section, which suppresses it for its own
        // `::before`/grid numbering.
        cy.get(`#${cesc("ansTask")} fieldset`).should(
            "have.css",
            "margin-top",
            "0px",
        );

        // Inside a real `<li>` but behind a leading `<p>`, so it is not the lead.
        cy.get(`#${cesc("ansLate")} fieldset`).should(
            "have.css",
            "margin-top",
            "16px",
        );
    });

    // The question this file exists to keep asking: for a labeled block
    // `<choiceInput>` leading a list item, does the marker sit on the label's
    // row — whatever the author wrapped the input in?
    //
    // A matrix over *markup shapes*, not over internal forwarding rules. Six
    // review cycles pinned the five rules the core knew about and still shipped
    // `<li><p>`, `<li><span>` and `<li><em>` broken, because a matrix over rules
    // cannot notice a missing rule. These shapes are author-visible, so a new
    // wrapper that breaks alignment shows up here as a failing row rather than as
    // a bug report.
    const WRAPPERS = [
        { name: "bare", open: "", close: "" },
        { name: "p", open: "<p>", close: "</p>" },
        { name: "span", open: "<span>", close: "</span>" },
        { name: "em", open: "<em>", close: "</em>" },
        { name: "div", open: "<div>", close: "</div>" },
        { name: "blockQuote", open: "<blockQuote>", close: "</blockQuote>" },
        { name: "stack", open: "<stack>", close: "</stack>" },
        { name: "nested p in span", open: "<span><p>", close: "</p></span>" },
        {
            name: "answer in p",
            open: "<p><answer>",
            close: "</answer></p>",
        },
    ];

    WRAPPERS.forEach(({ name, open, close }) => {
        it(`marker stays on the label's row with the input wrapped in ${name}`, () => {
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
    <ol>
      <li name="item">
        ${open}<choiceInput name="input"><label>hello</label>
          <choice>1</choice>
          <choice>2</choice>
        </choiceInput>${close}
      </li>
    </ol>
    `,
                    },
                    "*",
                );
            });

            cy.get(`#${cesc("item")}`).should("be.visible");
            verifyListItemMarkerSharesRowWith(
                "item",
                `#${cesc("input")}-label`,
            );
        });
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

    // Confirms the accessible name actually resolves in the browser now that no
    // `<legend>` is rendered, not just that a `<div>` with the right id exists.
    // `aria-labelledby` outranks a `<legend>` in the accessible-name
    // computation, so this is the name a screen reader announced before the
    // `<legend>` went away too; `accessibility/basicTests.cy.js` runs axe over
    // the same shape.
    it("aria-labelledby resolves to the label <div> and its text matches the label", () => {
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
            expect(labelEl.tagName, "labelled element is a div").to.equal(
                "DIV",
            );
            expect(labelEl.textContent).to.contain(
                "Which of these are the variables in the problem?",
            );
        });
    });
});
