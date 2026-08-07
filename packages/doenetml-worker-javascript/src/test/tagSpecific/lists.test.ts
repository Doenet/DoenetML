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

    it("an unlabeled choiceInput as the first child still gets list-item alignment", async () => {
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

    // Investigative, not a design assertion: neither `childRendersSomething`
    // nor `SectioningComponent`'s own `firstVisibleChild` loop checks a
    // child's own `hidden` state variable (only `textFromComponent` does,
    // and `SectioningComponent`'s `hideChildren` is a different, section-wide
    // broadcast concept). This test pins down actual observed behavior for a
    // hidden first child so it's documented rather than assumed, and compares
    // `<li>` against the pre-existing `<task>` mechanism to tell a
    // pre-existing, shared limitation apart from a new regression.
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
