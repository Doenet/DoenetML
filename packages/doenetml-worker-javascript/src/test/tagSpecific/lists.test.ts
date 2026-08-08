import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("List tag tests @group4", async () => {
    it("li publishes its first visible child for list-item alignment", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">
    <answer name="ans1">
      <choiceInput name="ci1">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const li1 =
            stateVariables[await resolvePathToNodeIdx("li1")].stateValues;
        const ans1 =
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues;
        const ci1 =
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues;

        expect(li1.childrenToRenderInlineForListItem[0].componentType).eq(
            "answer",
        );
        expect(ans1.listItemInlineAlignment).eq("flex-start");
        expect(ci1.renderInlineForListItem).eq(true);
        expect(ci1.listItemHasNativeMarker).eq(true);
    });

    // Regression test: `renderInlineForListItem`/`childrenToRenderInlineForListItem`
    // is shared between a real `<li>` (native `::marker`) and a `<problem
    // asList>` section (its own `::before`/grid number, no `<legend>` quirk
    // to work around). `listItemHasNativeMarker` must tell them apart so
    // choiceInput's <legend>-vs-<div> choice only fires for a real `<li>`.
    it("listItemHasNativeMarker is true under a real <li> and false under a <problem asList> section", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">
    <answer name="ansLi">
      <choiceInput name="ciLi">
        <label>Pick one</label>
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
</ol>
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
</problem>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const ciLi =
            stateVariables[await resolvePathToNodeIdx("ciLi")].stateValues;
        const ciTask =
            stateVariables[await resolvePathToNodeIdx("ciTask")].stateValues;

        // Real <li>: both flags true, <legend> should be swapped for <div>.
        expect(ciLi.renderInlineForListItem).eq(true);
        expect(ciLi.listItemHasNativeMarker).eq(true);

        // <problem asList> section: still gets margin suppression
        // (renderInlineForListItem true, matching pre-existing behavior),
        // but no native marker, so <legend> must NOT be swapped.
        expect(ciTask.renderInlineForListItem).eq(true);
        expect(ciTask.listItemHasNativeMarker).eq(false);
    });

    // `listItemHasNativeMarker` has to survive every component that forwards
    // `childrenToRenderInlineForListItem` — the pass-through wrappers and
    // `<sideBySide>` — or the `<legend>` stays put and the original bug
    // reproduces one level deeper. Covers both spellings of the chain: with an
    // `<answer>` in the middle and without.
    it("relays listItemHasNativeMarker through everything that forwards the alignment signal", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="liDiv">
    <div name="d1">
      <answer name="ansDiv">
        <choiceInput name="ciDiv">
          <label>Pick one</label>
          <choice credit="1">A</choice>
          <choice>B</choice>
        </choiceInput>
      </answer>
    </div>
  </li>
  <li name="liQuote">
    <blockQuote name="bq1">
      <choiceInput name="ciQuote">
        <label>Pick one</label>
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </blockQuote>
  </li>
  <li name="liSbs">
    <sideBySide name="sbs">
      <div name="d3">
        <answer name="ansSbs">
          <choiceInput name="ciSbs">
            <label>Pick one</label>
            <choice credit="1">A</choice>
            <choice>B</choice>
          </choiceInput>
        </answer>
      </div>
      <p>The other panel</p>
    </sideBySide>
  </li>
</ol>
<problem>
  <task name="task1">
    <div name="d2">
      <choiceInput name="ciTaskDiv">
        <label>Pick one</label>
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </div>
  </task>
</problem>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const ciDiv =
            stateVariables[await resolvePathToNodeIdx("ciDiv")].stateValues;
        const ciQuote =
            stateVariables[await resolvePathToNodeIdx("ciQuote")].stateValues;
        const ciSbs =
            stateVariables[await resolvePathToNodeIdx("ciSbs")].stateValues;
        const ciTaskDiv =
            stateVariables[await resolvePathToNodeIdx("ciTaskDiv")].stateValues;

        expect(ciDiv.renderInlineForListItem).eq(true);
        expect(ciDiv.listItemHasNativeMarker).eq(true);

        expect(ciQuote.renderInlineForListItem).eq(true);
        expect(ciQuote.listItemHasNativeMarker).eq(true);

        // `<sideBySide>` forwards the alignment signal to its panels with its
        // own definition rather than the shared wrapper mixin, so it needs its
        // own relay; the `<legend>` quirk does apply inside a panel.
        expect(ciSbs.renderInlineForListItem).eq(true);
        expect(ciSbs.listItemHasNativeMarker).eq(true);

        // The same wrapper under a `<problem asList>` section must still report
        // no native marker — the relay must not invent one.
        expect(ciTaskDiv.renderInlineForListItem).eq(true);
        expect(ciTaskDiv.listItemHasNativeMarker).eq(false);
    });

    it("li publishes a directly-nested choiceInput (no <answer> wrapper) for list-item alignment", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">
    <choiceInput name="ci1">
        <choice credit="1">A</choice>
        <choice>B</choice>
    </choiceInput>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const ci1 =
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues;

        expect(ci1.renderInlineForListItem).eq(true);
    });

    it("does not delegate list-item alignment to a leading blank string", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">

    <answer name="ans1">
      <choiceInput name="ci1">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const li1 =
            stateVariables[await resolvePathToNodeIdx("li1")].stateValues;

        expect(li1.childrenToRenderInlineForListItem[0].componentType).eq(
            "answer",
        );
    });

    // A non-blank leading string counts as the first visible child (it puts
    // text on the screen), so a choiceInput after it is NOT delegated
    // alignment — matching SectioningComponent's own firstVisibleChild
    // semantics (a string can win there too), not a new limitation.
    it("does not delegate list-item alignment past a leading non-blank string", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">Some text
    <answer name="ans1">
      <choiceInput name="ci1">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const li1 =
            stateVariables[await resolvePathToNodeIdx("li1")].stateValues;
        const ans1 =
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues;
        const ci1 =
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues;

        expect(li1.childrenToRenderInlineForListItem).eqls([]);
        expect(ans1.listItemInlineAlignment).eq("none");
        expect(ci1.renderInlineForListItem).eq(false);
    });

    it("does not delegate list-item alignment when the list item renders nothing", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1"></li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const li1 =
            stateVariables[await resolvePathToNodeIdx("li1")].stateValues;

        expect(li1.childrenToRenderInlineForListItem).eqls([]);
    });

    it("answer does not forward list-item alignment for an inline choiceInput", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">
    <answer name="ans1">
      <choiceInput inline name="ci1">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const ans1 =
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues;
        const ci1 =
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues;

        expect(ans1.listItemInlineAlignment).eq("none");
        expect(ci1.renderInlineForListItem).eq(false);
    });

    it("does not delegate list-item alignment to an answer/choiceInput that isn't the first child", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">
    <p name="intro">Some intro text</p>
    <answer name="ans1">
      <choiceInput name="ci1">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const li1 =
            stateVariables[await resolvePathToNodeIdx("li1")].stateValues;
        const ans1 =
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues;
        const ci1 =
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues;

        expect(li1.childrenToRenderInlineForListItem[0].componentType).eq("p");
        expect(ans1.listItemInlineAlignment).eq("none");
        expect(ci1.renderInlineForListItem).eq(false);
    });

    // A known limitation, pinned down rather than fixed: neither
    // `childRendersSomething` nor `SectioningComponent`'s `firstVisibleChild`
    // consults a child's own `hidden`, so a `<p hide>` wins the lead of its list
    // item and strands the child after it — `<li><p hide/><answer><choiceInput>`
    // still reproduces the original marker bug. The renderer half does not share
    // the blind spot (`markLeadingParagraphOfListItem()` in `list.tsx` skips the
    // `null` the core sends for an unrendered child, asserted by
    // `accessibility/listItemParagraphRoles.cy.js`), so core and renderer
    // disagree here. Fixing it means giving both core call sites a `hidden`
    // dependency; left for a follow-up so `<li>` and `<task>` keep behaving
    // identically, which the second half of this test checks.
    it("documents current behavior for a hidden first child (li vs. task)", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">
    <p name="hiddenP" hide>Hidden setup text</p>
    <answer name="ans1">
      <choiceInput name="ci1">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
</ol>
<problem>
  <task name="task1">
    <p name="hiddenP2" hide>Hidden setup text</p>
    <answer name="ans2">
      <choiceInput name="ci2">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </task>
</problem>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const li1 =
            stateVariables[await resolvePathToNodeIdx("li1")].stateValues;
        const ci1 =
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues;
        const task1 =
            stateVariables[await resolvePathToNodeIdx("task1")].stateValues;
        const ci2 =
            stateVariables[await resolvePathToNodeIdx("ci2")].stateValues;

        // `<li>` picks the hidden <p> as its first visible child, so the
        // choiceInput after it does NOT get list-item alignment.
        expect(li1.childrenToRenderInlineForListItem[0].componentType).eq("p");
        expect(ci1.renderInlineForListItem).eq(false);

        // `<task>` has the exact same gap via its own firstVisibleChild:
        // same shared limitation, not something this change made worse.
        expect(task1.firstVisibleChild.componentType).eq("p");
        expect(ci2.renderInlineForListItem).eq(false);
    });
});
