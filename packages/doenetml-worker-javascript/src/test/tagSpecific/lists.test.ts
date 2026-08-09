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
    });

    // `renderInlineForListItem` has to survive every component that forwards
    // `childrenToRenderInlineForListItem` — the pass-through wrappers and
    // `<sideBySide>`, which uses its own definition rather than the shared
    // wrapper mixin — or the `<choiceInput>` never learns it leads a list item
    // and the original bug reproduces one level deeper. Covers both spellings
    // of the chain: with an `<answer>` in the middle and without.
    //
    // This signal now decides only top-margin suppression. The `<legend>`/`<div>`
    // choice no longer reads it — `choiceInput.tsx` always renders the label in a
    // `<div>` — because a signal that has to arrive through every possible
    // wrapper could never be complete: `<li><p>`, `<li><span>` and `<li><em>` do
    // not forward it, and an author can nest a `<choiceInput>` in anything.
    it("reaches a choiceInput through wrappers and a <sideBySide> panel", async () => {
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
        expect(ciQuote.renderInlineForListItem).eq(true);
        expect(ciSbs.renderInlineForListItem).eq(true);

        // A `<problem asList>` section forwards the same signal for its own
        // `::before`/grid numbering, which is what suppresses the top margin
        // there too.
        expect(ciTaskDiv.renderInlineForListItem).eq(true);
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

    /**
     * Loads `doenetML` and checks `expected`, a
     * `component name -> state variable -> value` map. `label` names the case in
     * the assertion message, since one test runs this more than once.
     */
    async function expectLeadPlacement(
        doenetML: string,
        expected: Record<string, Record<string, unknown>>,
        label: string,
    ) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);

        for (const [name, variables] of Object.entries(expected)) {
            const stateValues =
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            for (const [variableName, value] of Object.entries(variables)) {
                expect(
                    stateValues[variableName],
                    `[${label}] ${name}.${variableName}`,
                ).eqls(value);
            }
        }
    }

    function choiceAnswer(answerName: string, inputName: string) {
        return `
      <answer name="${answerName}">
        <choiceInput name="${inputName}">
          <label>Pick one</label>
          <choice credit="1">A</choice>
          <choice>B</choice>
        </choiceInput>
      </answer>`;
    }

    function graphLead(name: string) {
        return `<graph name="${name}" size="small"><point>(1,2)</point></graph>`;
    }

    // One question — a leading child that hid itself is not the item's lead —
    // asked of all five places a list item's lead is chosen, from one table so
    // that a change to any one of them cannot silently diverge from the others.
    // Drifting apart is this area's recurring failure (#1403, #1482, #1579,
    // #1668), and all five now share `childRendersSomething()` — whose doc
    // comment names the state variable each row exercises. Each row is its own
    // test case, named by the rule it pins, so breaking two rules reports two
    // failures rather than stopping at the first.
    //
    // Every row is run twice: once with the leading child hidden and once with
    // it shown. The shown half is the control — without it a row would also pass
    // for a change that stopped delegating alignment at all. Both runs use the
    // same component names: `hiddenChild` is the leading child under test, `item`
    // the list item, `middle` the component whose selection rule the row
    // exercises, and `lead`/`leadInput` the content the number should end up
    // lining up with.
    //
    // Row 4 is the one row whose hidden and shown halves agree about
    // `renderInlineForListItem`, and it is deliberate: a `<sideBySide>` forwards
    // the signal to *every* panel, since they all sit at the top of the row and
    // all want their top margin suppressed, and only the top-vs-baseline
    // alignment is read off a single panel. So there the hidden panel still
    // reports `renderInlineForListItem` — what must not come from it is the
    // alignment.
    const leadSelectionRules: {
        rule: string;
        doenetML: (hide: string) => string;
        whenHidden: Record<string, Record<string, unknown>>;
        whenShown: Record<string, Record<string, unknown>>;
    }[] = [
        {
            rule: "1. an <li> picks its own lead",
            doenetML: (hide) => `
<ol>
  <li name="item">
    <p name="hiddenChild" ${hide}>Setup text</p>
    ${choiceAnswer("lead", "leadInput")}
  </li>
</ol>`,
            whenHidden: {
                hiddenChild: { renderInlineForListItem: false },
                lead: { listItemInlineAlignment: "flex-start" },
                leadInput: { renderInlineForListItem: true },
            },
            whenShown: {
                hiddenChild: { renderInlineForListItem: true },
                lead: { listItemInlineAlignment: "none" },
                leadInput: { renderInlineForListItem: false },
            },
        },
        {
            rule: "2. a section picks its own lead",
            doenetML: (hide) => `
<problem>
  <part name="item">
    <p name="hiddenChild" ${hide}>Setup text</p>
    ${choiceAnswer("lead", "leadInput")}
  </part>
</problem>`,
            whenHidden: {
                hiddenChild: { renderInlineForListItem: false },
                leadInput: { renderInlineForListItem: true },
                item: { firstChildListItemAlignment: "flex-start" },
            },
            whenShown: {
                hiddenChild: { renderInlineForListItem: true },
                leadInput: { renderInlineForListItem: false },
                item: { firstChildListItemAlignment: "baseline" },
            },
        },
        {
            rule: "3. a wrapper forwards past it",
            doenetML: (hide) => `
<ol>
  <li name="item">
    <div name="middle">
      <p name="hiddenChild" ${hide}>Setup text</p>
      ${choiceAnswer("lead", "leadInput")}
    </div>
  </li>
</ol>`,
            whenHidden: {
                hiddenChild: { renderInlineForListItem: false },
                middle: { listItemInlineAlignment: "flex-start" },
                leadInput: { renderInlineForListItem: true },
            },
            whenShown: {
                hiddenChild: { renderInlineForListItem: true },
                middle: { listItemInlineAlignment: "baseline" },
                leadInput: { renderInlineForListItem: false },
            },
        },
        {
            rule: "4. a <sideBySide> reads its panel",
            doenetML: (hide) => `
<ol>
  <li name="item">
    <sideBySide name="middle">
      <p name="hiddenChild" ${hide}>Setup text</p>
      ${graphLead("lead")}
    </sideBySide>
  </li>
</ol>`,
            whenHidden: {
                middle: { listItemInlineAlignment: "flex-start" },
                hiddenChild: { renderInlineForListItem: true },
                lead: { renderInlineForListItem: true },
            },
            whenShown: {
                middle: { listItemInlineAlignment: "baseline" },
                hiddenChild: { renderInlineForListItem: true },
                lead: { renderInlineForListItem: true },
            },
        },
        {
            rule: "5. an <answer> forwards to an input",
            doenetML: (hide) => `
<problem>
  <part name="item">
    <answer name="middle">
      <choiceInput name="hiddenChild" ${hide}>
        <label>Pick one</label>
        <choice credit="1">A</choice>
        <choice>B</choice>
      </choiceInput>
    </answer>
  </part>
</problem>`,
            whenHidden: {
                hiddenChild: { renderInlineForListItem: false },
                middle: { listItemInlineAlignment: "none" },
                item: { firstChildListItemAlignment: "baseline" },
            },
            whenShown: {
                hiddenChild: { renderInlineForListItem: true },
                middle: { listItemInlineAlignment: "flex-start" },
                item: { firstChildListItemAlignment: "flex-start" },
            },
        },
        {
            rule: "6. a hidden non-lead child: no change",
            doenetML: (hide) => `
<ol>
  <li name="item">
    ${choiceAnswer("lead", "leadInput")}
    <p name="hiddenChild" ${hide}>Trailing text</p>
  </li>
</ol>`,
            whenHidden: {
                hiddenChild: { renderInlineForListItem: false },
                leadInput: { renderInlineForListItem: true },
            },
            whenShown: {
                hiddenChild: { renderInlineForListItem: false },
                leadInput: { renderInlineForListItem: true },
            },
        },
    ];

    it.each(leadSelectionRules)(
        "hidden-child lead selection: $rule",
        async ({ doenetML, whenHidden, whenShown }) => {
            await expectLeadPlacement(doenetML("hide"), whenHidden, "hidden");
            await expectLeadPlacement(doenetML(""), whenShown, "shown");
        },
    );

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

    // Only a child's own `hide` counts, which is why `childRendersSomething()`
    // reads `hiddenIgnoreParent` and not `hidden`. Hiding the `<ol>` marks every
    // child of every item `hidden`, and the lead must not move: nothing is on
    // screen to realign, and the lead this item shows once it is revealed must
    // not depend on having been hidden. This test is the guard on that choice —
    // it fails if `listItemChildVisibilityDependency()` becomes `hidden`.
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

    // The `<li>` half of the cycle guard in `sectioning.test.ts`.
    // `hide="$b.hidden"` is ordinary DoenetML, and `hidden` reads its parent's
    // `childrenToHide` — which `Li` does not define, so asking its children for
    // their visibility closes no loop. This pins both halves of that: the
    // document loads, and the lead skips past both hidden children.
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

    // Hiding is one of two ways a wrapper's child can fail to be drawn; the
    // other is a component type with no renderer, and both go through
    // `childRendersSomething()`. A wrapper used to forward to its first
    // non-`<label>` child whatever it was, so an `<animateFromSequence>` — which
    // draws nothing anywhere — took the lead and the `<graph>` behind it kept its
    // top margin. `<label>` is excluded on top of that test rather than by it: a
    // label does render, it is just the wrapper's own naming rather than the
    // content the number lines up with.
    it("forwards a wrapper's lead past a label and past a child of a kind that draws nothing", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<ol>
  <li name="liLabel">
    <div name="divLabel">
      <label name="lab">A label</label>
      <graph name="gLabel" size="small"><point>(1,2)</point></graph>
    </div>
  </li>
  <li name="liAnimate">
    <div name="divAnimate">
      <animateFromSequence target="$Pa.x" from="1" to="5" />
      <graph name="gAnimate" size="small"><point name="Pa">(1,2)</point></graph>
    </div>
  </li>
</ol>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        for (const [wrapper, graph] of [
            ["divLabel", "gLabel"],
            ["divAnimate", "gAnimate"],
        ]) {
            const div =
                stateVariables[await resolvePathToNodeIdx(wrapper)].stateValues;
            expect(
                div.childrenToRenderInlineForListItem[0].componentIdx,
                wrapper,
            ).eq(await resolvePathToNodeIdx(graph));
            // The wrapper reports the `<graph>`'s own `flex-start` back up. A
            // `<label>` or an `<animateFromSequence>` has no alignment to report,
            // so leading with either would leave the wrapper saying `none`.
            expect(div.listItemInlineAlignment, wrapper).eq("flex-start");
            expect(
                stateVariables[await resolvePathToNodeIdx(graph)].stateValues
                    .renderInlineForListItem,
                graph,
            ).eq(true);
        }
    });
});
