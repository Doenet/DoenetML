import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateBooleanInputValue } from "../utils/actions";

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
        expect(ci1.insideNativeListItem).eq(true);
    });

    // `renderInlineForListItem` has to survive every component that forwards
    // `childrenToRenderInlineForListItem` — the pass-through wrappers and
    // `<sideBySide>`, which uses its own definition rather than the shared
    // wrapper mixin — or the `<choiceInput>` never learns it leads a list item
    // and the original bug reproduces one level deeper. Covers both spellings
    // of the chain: with an `<answer>` in the middle and without.
    //
    // `insideNativeListItem` is asserted alongside it because the two must
    // agree for the `<legend>`/`<div>` swap to fire. It tells a real `<li>`
    // (native `::marker`) apart from a `<problem asList>` section outside a list
    // (its own `::before`/grid number, no `<legend>` quirk), which is why the
    // section arm at the bottom must report `false` however deeply the wrapper
    // nests.
    it("reaches a choiceInput through wrappers and a <sideBySide> panel, but reports no native list item under a section outside a list", async () => {
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
        expect(ciDiv.insideNativeListItem).eq(true);

        expect(ciQuote.renderInlineForListItem).eq(true);
        expect(ciQuote.insideNativeListItem).eq(true);

        expect(ciSbs.renderInlineForListItem).eq(true);
        expect(ciSbs.insideNativeListItem).eq(true);

        // Under a `<problem asList>` section the alignment signal still arrives
        // (pre-existing behavior, and what suppresses the top margin), but there
        // is no native marker to protect, so the `<legend>` must stay.
        expect(ciTaskDiv.renderInlineForListItem).eq(true);
        expect(ciTaskDiv.insideNativeListItem).eq(false);
    });

    // Pins the one shape where `insideNativeListItem` is true without the
    // `<choiceInput>` leading the `<li>` that owns the marker: a list-item
    // section nested inside a real `<li>`. The `<choiceInput>` leads the
    // `<task>`, so both state variables are true and the label renders in a
    // `<div>`. That is inert — the `<div>` reproduces the `<legend>`'s inset so
    // the label renders in the same place, the accessible name comes from
    // `aria-labelledby` either way, and the section draws its own number in CSS
    // — and it is cheaper than comparing how deep the two ancestors are. See
    // the `insideNativeListItem` definition in `ChoiceInput.js`.
    it("reports being inside a native list item for a section nested in a real <li>", async () => {
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
        expect(ci1.insideNativeListItem).eq(true);
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

    // A child that hides itself does not win the lead of its list item, in
    // either the `<li>` or the section path: `childRendersSomething()` skips it
    // via `hiddenIgnoreParent`, so the child after it — the one that actually
    // renders first — gets the alignment signal. Before this, a leading
    // `<p hide>` stranded it and `<li><p hide/><answer><choiceInput>` still
    // reproduced the marker bug #1668 fixed for the unhidden case.
    //
    // The third arm puts the hidden child *after* the answer, which has always
    // worked and must go on working: it is what tells the two arms above apart
    // from a change that simply stopped honoring `hide` anywhere in an item.
    it("does not delegate list-item alignment to a first child that hides itself (li and task)", async () => {
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
</problem>
<ol>
  <li name="li2">
    <answer name="ans3">
      <choiceInput name="ci3">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
    <p name="hiddenP3" hide>Hidden setup text</p>
  </li>
</ol>`,
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
        const li2 =
            stateVariables[await resolvePathToNodeIdx("li2")].stateValues;
        const ci3 =
            stateVariables[await resolvePathToNodeIdx("ci3")].stateValues;

        // `<li>` skips the hidden <p> and delegates to the <answer> behind it.
        expect(li1.childrenToRenderInlineForListItem[0].componentType).eq(
            "answer",
        );
        expect(ci1.renderInlineForListItem).eq(true);

        // `<task>`'s own firstVisibleChild skips it for the same reason, so the
        // two paths still agree.
        expect(task1.firstVisibleChild.componentType).eq("answer");
        expect(ci2.renderInlineForListItem).eq(true);

        // A hidden child after the answer changes nothing, as before.
        expect(li2.childrenToRenderInlineForListItem[0].componentType).eq(
            "answer",
        );
        expect(ci3.renderInlineForListItem).eq(true);
    });

    // The lead has to move when a child's `hide` changes, not just when the
    // document is first loaded — otherwise the alignment a reader sees depends
    // on which state the document started in.
    it("moves the lead when a first child's hide toggles", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<booleanInput name="b" />
<ol>
  <li name="li1">
    <p name="p1" hide="$b">Sometimes hidden</p>
    <answer name="ans1">
      <choiceInput name="ci1">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
</ol>`,
        });

        async function leadOfLi1() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return {
                lead: stateVariables[await resolvePathToNodeIdx("li1")]
                    .stateValues.childrenToRenderInlineForListItem[0]
                    ?.componentType,
                choiceInputAligned:
                    stateVariables[await resolvePathToNodeIdx("ci1")]
                        .stateValues.renderInlineForListItem,
            };
        }

        // Visible <p> leads, so the <answer> behind it is not delegated to.
        expect(await leadOfLi1()).eqls({
            lead: "p",
            choiceInputAligned: false,
        });

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });

        // Now hidden, so the <answer> takes the lead.
        expect(await leadOfLi1()).eqls({
            lead: "answer",
            choiceInputAligned: true,
        });

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });

        expect(await leadOfLi1()).eqls({
            lead: "p",
            choiceInputAligned: false,
        });
    });

    // A composite never leads an item itself — it expands into its replacements
    // in `activeChildren` — so a hidden one has to be recognized through those
    // replacements, which inherit `hiddenIgnoreParent` from their source
    // composite. Without that, `<li><repeat hide>` strands the child behind it
    // exactly as `<p hide>` used to.
    it("skips the replacements of a leading composite that hides itself", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="liHidden">
    <repeat name="repHidden" hide for="1 2" valueName="v"><p>Hidden $v</p></repeat>
    <answer name="ans1">
      <choiceInput name="ci1">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
  <li name="liShown">
    <repeat name="repShown" for="1 2" valueName="v"><p>Shown $v</p></repeat>
    <answer name="ans2">
      <choiceInput name="ci2">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
  <li name="liConditional">
    <conditionalContent hide condition="true"><p>Hidden branch</p></conditionalContent>
    <answer name="ans3">
      <choiceInput name="ci3">
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        // The hidden repeat's replacements are skipped, so the <answer> leads.
        expect(
            stateVariables[await resolvePathToNodeIdx("liHidden")].stateValues
                .childrenToRenderInlineForListItem[0].componentType,
        ).eq("answer");
        expect(
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues
                .renderInlineForListItem,
        ).eq(true);

        // The control: a repeat that is not hidden still leads through its first
        // replacement, so this is about the `hide`, not about composites.
        expect(
            stateVariables[await resolvePathToNodeIdx("liShown")].stateValues
                .childrenToRenderInlineForListItem[0].componentType,
        ).eq("p");
        expect(
            stateVariables[await resolvePathToNodeIdx("ci2")].stateValues
                .renderInlineForListItem,
        ).eq(false);

        // The recursion is through the source composite, not through `<repeat>`
        // in particular, so any hidden composite behaves the same way.
        expect(
            stateVariables[await resolvePathToNodeIdx("liConditional")]
                .stateValues.childrenToRenderInlineForListItem[0].componentType,
        ).eq("answer");
        expect(
            stateVariables[await resolvePathToNodeIdx("ci3")].stateValues
                .renderInlineForListItem,
        ).eq(true);
    });

    // The lead is handed down a chain, not read once: an `<li>` picks its first
    // visible child, and a wrapper child (`<div>`, `<blockQuote>`, a
    // `<sideBySide>` panel, …) forwards the signal to its own first visible
    // child. Every link has to apply the same visibility test, or the chain ends
    // on a child that is not on the screen — the wrapper used to forward to its
    // first non-label child whatever it was, so a `<p hide>` inside the wrapper
    // reproduced the marker bug that the same `<p hide>` directly inside the
    // `<li>` no longer does.
    it("forwards a wrapper's lead past a child that hides itself", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="liWrapped">
    <div name="divHidden">
      <p name="hiddenP" hide>Hidden setup text</p>
      <answer name="ans1">
        <choiceInput name="ci1">
          <choice credit="1">A</choice>
          <choice>B</choice>
        </choiceInput>
      </answer>
    </div>
  </li>
  <li name="liWrappedShown">
    <div name="divShown">
      <p name="shownP">Shown setup text</p>
      <answer name="ans2">
        <choiceInput name="ci2">
          <choice credit="1">A</choice>
          <choice>B</choice>
        </choiceInput>
      </answer>
    </div>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        // The `<div>` is what the `<li>` delegates to either way.
        for (const div of ["divHidden", "divShown"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(div)].stateValues
                    .renderInlineForListItem,
            ).eq(true);
        }

        // The `<div>` forwards past the hidden `<p>` to the `<answer>`, and
        // reports the block alignment that `<answer>`'s `<choiceInput>` needs
        // rather than the paragraph's baseline.
        const divHidden =
            stateVariables[await resolvePathToNodeIdx("divHidden")].stateValues;
        expect(divHidden.childrenToRenderInlineForListItem[0].componentIdx).eq(
            await resolvePathToNodeIdx("ans1"),
        );
        expect(divHidden.listItemInlineAlignment).eq("flex-start");
        expect(
            stateVariables[await resolvePathToNodeIdx("ci1")].stateValues
                .renderInlineForListItem,
        ).eq(true);

        // The control: a visible `<p>` still takes the wrapper's lead, so this is
        // about the `hide` and not about wrappers skipping paragraphs.
        const divShown =
            stateVariables[await resolvePathToNodeIdx("divShown")].stateValues;
        expect(divShown.childrenToRenderInlineForListItem[0].componentIdx).eq(
            await resolvePathToNodeIdx("shownP"),
        );
        expect(divShown.listItemInlineAlignment).eq("baseline");
        expect(
            stateVariables[await resolvePathToNodeIdx("ci2")].stateValues
                .renderInlineForListItem,
        ).eq(false);
    });

    // Only a child's own `hide` counts, which is why `childRendersSomething()`
    // reads `hiddenIgnoreParent` and not `hidden`. Hiding the `<ol>` marks every
    // child of every item `hidden`, and the lead must not move: nothing is on
    // screen to realign, and the lead this item shows once it is revealed must
    // not depend on having been hidden. This test is the guard on that choice —
    // it fails if `LIST_ITEM_CHILD_VISIBILITY_DEPENDENCY` becomes `hidden`.
    it("keeps the lead of a list item whose container is hidden", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol hide>
  <li name="li1">
    <p name="p1">Lead</p>
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
        const p1 = stateVariables[await resolvePathToNodeIdx("p1")].stateValues;

        expect(p1.hidden).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("li1")].stateValues
                .childrenToRenderInlineForListItem[0].componentIdx,
        ).eq(await resolvePathToNodeIdx("p1"));
        expect(p1.renderInlineForListItem).eq(true);
    });

    // The `<li>` half of the cycle guard in `sectioning.test.ts`. Asking a child
    // for its visibility reaches that child's `hide`, which an author may point
    // at another component's `hidden` — and `hidden` reads its parent's
    // `childrenToHide`. `Li` defines no `childrenToHide`, so nothing closes the
    // loop here; this pins that, so adding one to `Li` without splitting the
    // request the way `SectioningComponent` does fails as a document that will
    // not load rather than as a puzzling lead.
    it("loads a list item whose child's hide references another child's hidden", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="li1">
    <p name="a" hide="$b.hidden">Hidden whenever b is</p>
    <p name="b" hide>Hidden</p>
    <p name="c">Lead</p>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.hidden,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("li1")].stateValues
                .childrenToRenderInlineForListItem[0].componentIdx,
        ).eq(await resolvePathToNodeIdx("c"));
    });
});
