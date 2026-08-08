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

    // `renderInlineForListItem` has to survive every component that forwards
    // `childrenToRenderInlineForListItem` — the pass-through wrappers and
    // `<sideBySide>`, which uses its own definition rather than the shared
    // wrapper mixin — or the `<choiceInput>` never learns it leads a list item
    // and the original bug reproduces one level deeper. Covers both spellings
    // of the chain: with an `<answer>` in the middle and without.
    //
    // `listItemHasNativeMarker` is asserted alongside it because the two must
    // agree for the `<legend>`/`<div>` swap to fire. It tells a real `<li>`
    // (native `::marker`) apart from a `<problem asList>` section outside a list
    // (its own `::before`/grid number, no `<legend>` quirk), which is why the
    // section arm at the bottom must report `false` however deeply the wrapper
    // nests.
    it("reaches a choiceInput through wrappers and a <sideBySide> panel, but reports no native marker under a section", async () => {
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

        expect(ciSbs.renderInlineForListItem).eq(true);
        expect(ciSbs.listItemHasNativeMarker).eq(true);

        // Under a `<problem asList>` section the alignment signal still arrives
        // (pre-existing behavior, and what suppresses the top margin), but there
        // is no native marker to protect, so the `<legend>` must stay.
        expect(ciTaskDiv.renderInlineForListItem).eq(true);
        expect(ciTaskDiv.listItemHasNativeMarker).eq(false);
    });

    // Pins the one shape where `listItemHasNativeMarker` is true without the
    // `<choiceInput>` leading the `<li>` that owns the marker: a list-item
    // section nested inside a real `<li>`. The `<choiceInput>` leads the
    // `<task>`, so both state variables are true and the label renders in a
    // `<div>`. Harmless (the fieldset's accessible name comes from
    // `aria-labelledby` either way, and the section draws its own number in
    // CSS), and cheaper than comparing how deep the two ancestors are — see the
    // `listItemHasNativeMarker` definition in `ChoiceInput.js`.
    it("reports a native marker for a section nested inside a real <li>", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">
    <p name="intro">Intro text, so the section does not lead the item</p>
    <problem>
      <task name="task1">
        <choiceInput name="ci1">
          <label>Pick one</label>
          <choice credit="1">A</choice>
          <choice>B</choice>
        </choiceInput>
      </task>
    </problem>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const li1 =
            stateVariables[await resolvePathToNodeIdx("li1")].stateValues;
        const ci1 =
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues;

        // The `<li>` delegates to its `<p>`, not to the section...
        expect(li1.childrenToRenderInlineForListItem[0].componentType).eq("p");
        // ...but the `<task>` delegates to the `<choiceInput>` regardless, and
        // the `<li>` ancestor is still there.
        expect(ci1.renderInlineForListItem).eq(true);
        expect(ci1.listItemHasNativeMarker).eq(true);
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
