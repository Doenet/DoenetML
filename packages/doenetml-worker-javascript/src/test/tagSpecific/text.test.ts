import { describe, expect, it, vi } from "vitest";
import { createTestCore as createTestCoreWithoutListEntries } from "../utils/test-core";
import { withListEntriesAsComponents } from "../utils/list-entries";
import { cleanLatex } from "../utils/math";
import {
    moveText,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

// The entries of point and vector lists, which are not components, are read
// and dragged here as components (`vs[2]`), as they were written for.
async function createTestCore(
    ...args: Parameters<typeof createTestCoreWithoutListEntries>
) {
    return withListEntriesAsComponents(
        await createTestCoreWithoutListEntries(...args),
    );
}

describe("Text tag tests @group2", async () => {
    it("spaces preserved between tags", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><text>Hello</text> <text>there</text>!</p>

    <p name="p2"><text>We <text>could</text> be $_text2.</text></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("Hello there!");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("We could be there.");
    });

    it("components adapt to text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>boolean: <text name="text1"><boolean>true</boolean></text></p>
    <p>number: <text name="text2"><number>5-2</number></text></p>
    <p>math: <text name="text3"><math>5-2</math></text></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("text1")].stateValues
                .value,
        ).eq("true");
        expect(
            stateVariables[await resolvePathToNodeIdx("text2")].stateValues
                .value,
        ).eq("3");
        expect(
            stateVariables[await resolvePathToNodeIdx("text3")].stateValues
                .value,
        ).eq("5 - 2");
    });

    it("text adapts to components", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>number: <number name="n1"><text>4/2</text></number></p>
    <p>number from latex: <number name="n2"><text isLatex>\\frac{4}{2}</text></number></p>
    <p>number from latex 2: <number name="n2a"><latex>\\frac{4}{2}</latex></number></p>
    <p>number latex not parsed as latex: <number name="n3"><text>\\frac{4}{2}</text></number></p>
    <p>number does not adapt with convertBoolean: <number name="n4" convertBoolean><text>4/2</text></number></p>
    <p>number multiplies adjacent texts: <number name="n5"><text>5</text><text>4</text></number></p>
    <p>number multiplies adjacent text and string: <number name="n6">5<text>4</text></number></p>
    <p>math: <math name="m1"><text>sin(2x)</text></math></p>
    <p>math from latex: <math name="m2"><text isLatex>\\sin(2x)</text></math></p>
    <p>math from latex 2: <math name="m2a"><latex>\\sin(2x)</latex></math></p>
    <p>math latex not parsed as latex: <math name="m3"><text>\\sin(2x)</text></math></p>
    <p>math multiplies adjacent texts: <math name="m4" simplify><text>5</text><text>4</text></math></p>
    <p>math multiplies adjacent text and string: <math name="m5" simplify>5<text>4</text></math></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("n1")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("n2")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("n2a")].stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("n3")].stateValues.value,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("n4")].stateValues.value,
        ).eqls(NaN);
        expect(
            stateVariables[await resolvePathToNodeIdx("n5")].stateValues.value,
        ).eq(20);
        expect(
            stateVariables[await resolvePathToNodeIdx("n6")].stateValues.value,
        ).eq(20);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2a")].stateValues.value
                .tree,
        ).eqls(["apply", "sin", ["*", 2, "x"]]);

        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls("\uff3f");
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.value
                .tree,
        ).eqls(20);
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.value
                .tree,
        ).eqls(20);
    });

    it("text from paragraph components", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="orig"><q>Hello,</q> said the <em>cow</em>.  <sq>Bye,</sq> came the <alert>reply</alert>.  The <attr>text</attr> attribute of <tag>text</tag> or <tage>text</tage> (or <tagc>text</tagc>?) doesn't <term>do</term> <c>much</c>.</p>

    <p name="textOnly"><text extend="$orig.text" name="t" /></p>

    <p name="insideText"><text name="t2"><q>Hello,</q> said the <em>cow</em>.  <sq>Bye,</sq> came the <alert>reply</alert>.  The <attr>text</attr> attribute of <tag>text</tag> or <tage>text</tage> (or <tagc>text</tagc>?) doesn't <term>do</term> <c>much</c>.</text></p>
    `,
        });

        let theText = `"Hello," said the cow.  'Bye,' came the reply.  The text attribute of <text> or <text/> (or </text>?) doesn't do much.`;

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.text,
        ).eq(theText);
        expect(
            stateVariables[await resolvePathToNodeIdx("textOnly")].stateValues
                .text,
        ).eq(theText);
        expect(
            stateVariables[await resolvePathToNodeIdx("insideText")].stateValues
                .text,
        ).eq(theText);

        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.value,
        ).eq(theText);
        expect(
            stateVariables[await resolvePathToNodeIdx("t2")].stateValues.value,
        ).eq(theText);
    });

    it("text from single character components", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="orig">Pick a <lsq/>number<rsq/> from 1 <ndash/> 2 <mdash/> no, <lq/>maybe<rq/> from<nbsp/>3<ellipsis /></p>

    <p name="textOnly"><text extend="$orig.text" name="t" /></p>

    <p name="insideText"><text name="t2">Pick a <lsq/>number<rsq/> from 1 <ndash/> 2 <mdash/> no, <lq/>maybe<rq/> from<nbsp/>3<ellipsis /></text></p>
    `,
        });

        const theText = "Pick a ‘number’ from 1 – 2 — no, “maybe” from\u00a03…";

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("orig")].stateValues.text,
        ).eq(theText);
        expect(
            stateVariables[await resolvePathToNodeIdx("textOnly")].stateValues
                .text,
        ).eq(theText);
        expect(
            stateVariables[await resolvePathToNodeIdx("insideText")].stateValues
                .text,
        ).eq(theText);

        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.value,
        ).eq(theText);
        expect(
            stateVariables[await resolvePathToNodeIdx("t2")].stateValues.value,
        ).eq(theText);
    });

    it("text does not force composite replacement, even in boolean", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text>a</text>
    <boolean name="b">
      <text>$nothing</text> = <text></text>
    </boolean>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        // `$nothing` is a blank in the text (D37), which is not `""`
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).to.be.false;
    });

    it("text in graph", async () => {
        const doenetMLsnippet = `
    <graph >
      <text anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" fixed="$fixed1" fixLocation="$fixLocation1">hello</text>
      <text name="item2">bye</text>
    </graph>
            `;

        await test_in_graph(doenetMLsnippet, moveText);
    });

    it("text in graph, handle bad anchor coordinates", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph >
      <text anchor="$anchorCoords1" name="text1">Hello</text>
    </graph>
    

    <p name="pAnchor1">Anchor 1 coordinates:  <point extend="$text1.anchor" name="text1anchor" /></p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="x" /></p>
    

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("text1anchor")]
                    .stateValues.latex,
            ),
        ).eq("x");

        // give good anchor coords
        await updateMathInputValue({
            latex: "(6,7)",
            componentIdx: await resolvePathToNodeIdx("anchorCoords1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("text1anchor")]
                    .stateValues.latex,
            ),
        ).eq("(6,7)");

        // give good anchor coords
        await updateMathInputValue({
            latex: "(6,7)",
            componentIdx: await resolvePathToNodeIdx("anchorCoords1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("text1anchor")]
                    .stateValues.latex,
            ),
        ).eq("(6,7)");

        // give bad anchor coords again
        await updateMathInputValue({
            latex: "q",
            componentIdx: await resolvePathToNodeIdx("anchorCoords1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("text1anchor")]
                    .stateValues.latex,
            ),
        ).eq("q");
    });

    it("color text via style", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
    </setup>

    <p>Style number: <mathInput prefill="1" name="sn" /></p>

    <p><text name="no_style">One</text> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><text name="fixed_style" styleNumber="2">Two</text> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><text name="variable_style" styleNumber="$sn">Three</text> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                .stateValues.text,
        ).eq("none");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("sn"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                .stateValues.text,
        ).eq("none");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("sn"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_variable_style")]
                .stateValues.text,
        ).eq("red with a blue background");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_variable_style")]
                .stateValues.text,
        ).eq("red");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_variable_style")]
                .stateValues.text,
        ).eq("blue");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_no_style")]
                .stateValues.text,
        ).eq("black");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_no_style")]
                .stateValues.text,
        ).eq("none");

        expect(
            stateVariables[await resolvePathToNodeIdx("tsd_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("tc_fixed_style")]
                .stateValues.text,
        ).eq("green");
        expect(
            stateVariables[await resolvePathToNodeIdx("bc_fixed_style")]
                .stateValues.text,
        ).eq("none");
    });

    it("text copied by plain macro, but not value, reflects style and anchor position", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" />
    </setup>

    <graph name="g1">
      <text styleNumber="2" name="t1">One</text>
      <text styleNumber="3" anchor="(3,4)" name="t2" >Two</text>
    </graph>

    <coords extend="$t1.anchor" name="t1coords" />
    <coords extend="$t2.anchor" name="t2coords" />

    <graph name="g2">
      <text extend="$t1" name="t1a" />
      <text extend="$t2" name="t2a" />
    </graph>

    <collect componentType="text" from="$g2" name="collect1" />
    <pointList name="tacoords">$collect1[1].anchor $collect1[2].anchor</pointList>

    <graph name="g3">
      <text extend="$t1.value" name="t1b" />
      <text extend="$t2.value" name="t2b" />
    </graph>

    <collect componentType="text" from="$g3" name="collect2" />
    <pointList name="tbcoords">$collect2[1].anchor $collect2[2].anchor</pointList>

    <p name="p1"><text extend="$t1" name="t1c"/> <text extend="$t2" name="t2c"/></p>

    <p name="p2"><text extend="$t1.value" name="t1d"/> <text extend="$t2.value" name="t2d"/></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("t1")].stateValues.value,
        ).eq("One");
        expect(
            stateVariables[await resolvePathToNodeIdx("t1a")].stateValues.value,
        ).eq("One");
        expect(
            stateVariables[await resolvePathToNodeIdx("t1b")].stateValues.value,
        ).eq("One");
        expect(
            stateVariables[await resolvePathToNodeIdx("t1c")].stateValues.value,
        ).eq("One");
        expect(
            stateVariables[await resolvePathToNodeIdx("t1d")].stateValues.value,
        ).eq("One");

        expect(
            stateVariables[await resolvePathToNodeIdx("t2")].stateValues.value,
        ).eq("Two");
        expect(
            stateVariables[await resolvePathToNodeIdx("t2a")].stateValues.value,
        ).eq("Two");
        expect(
            stateVariables[await resolvePathToNodeIdx("t2b")].stateValues.value,
        ).eq("Two");
        expect(
            stateVariables[await resolvePathToNodeIdx("t2c")].stateValues.value,
        ).eq("Two");
        expect(
            stateVariables[await resolvePathToNodeIdx("t2d")].stateValues.value,
        ).eq("Two");

        expect(
            stateVariables[await resolvePathToNodeIdx("t1")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("t1a")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("t1b")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("t1c")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("t1d")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("t2")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("t2a")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("t2b")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("t2c")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("t2d")].stateValues
                .styleNumber,
        ).eq(1);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t1coords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2coords")]
                    .stateValues.latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tacoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tacoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tbcoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tbcoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move first texts
        await moveText({
            componentIdx: await resolvePathToNodeIdx("t1"),
            x: -2,
            y: 3,
            core,
        });
        await moveText({
            componentIdx: await resolvePathToNodeIdx("t2"),
            x: 4,
            y: -5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t1coords")]
                    .stateValues.latex,
            ),
        ).eq("(-2,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2coords")]
                    .stateValues.latex,
            ),
        ).eq("(4,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tacoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(-2,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tacoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(4,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tbcoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tbcoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move second texts
        await moveText({
            componentIdx: await resolvePathToNodeIdx("t1a"),
            x: 7,
            y: 1,
            core,
        });
        await moveText({
            componentIdx: await resolvePathToNodeIdx("t2a"),
            x: -8,
            y: 2,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t1coords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2coords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tacoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tacoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tbcoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tbcoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move third texts
        await moveText({
            componentIdx: await resolvePathToNodeIdx("t1b"),
            x: -6,
            y: 3,
            core,
        });
        await moveText({
            componentIdx: await resolvePathToNodeIdx("t2b"),
            x: -5,
            y: -4,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t1coords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("t2coords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tacoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tacoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tbcoords[1]")]
                    .stateValues.latex,
            ),
        ).eq("(-6,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("tbcoords[2]")]
                    .stateValues.latex,
            ),
        ).eq("(-5,-4)");
    });

    it("numCharacters and characters", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><text name="t">Hello there</text>!</p>

    <p name="p2">Number of characters is $t.numCharacters.</p>
    <p name="p3">Characters: $t.characters.</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Number of characters is 11.");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("Characters: H, e, l, l, o, , t, h, e, r, e.");

        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .numCharacters,
        ).eq(11);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .characters,
        ).eqls(["H", "e", "l", "l", "o", " ", "t", "h", "e", "r", "e"]);
    });

    it("numWords and words", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><text name="t">Hello there now</text>!</p>

    <p name="p2">Number of words is $t.numWords.</p>
    <p name="p3">words: $t.words.</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Number of words is 3.");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("words: Hello, there, now.");

        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .numWords,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.words,
        ).eqls(["Hello", "there", "now"]);
    });

    it("numListItems and list", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><text name="t">Hello there, friend!</text>!</p>

    <p name="p2">Number of list items is $t.numListItems.</p>
    <p name="p3">list items: $t.list.</p>
    <p name="p4">text list from items: <textList name="tl">$t.list</textList>.</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Number of list items is 2.");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("list items: Hello there, friend!.");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("text list from items: Hello there, friend!.");

        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .numListItems,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.list,
        ).eqls(["Hello there", "friend!"]);

        expect(
            stateVariables[await resolvePathToNodeIdx("tl")].stateValues.texts,
        ).eqls(["Hello there", "friend!"]);
    });

    it("a `$` written as a reference is a `$` in the value", async () => {
        // The parser keeps a `$` written as a reference from starting a
        // reference with a zero-width space after it; the value has none
        // (#2637 item 3), in an attribute and in content.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<textInput name="paren" prefill="&#36;(x)"/>
<textInput name="letter" prefill="&dollar;x"/>
<textInput name="reference" prefill="&#36;&#36;&#102;"/>
<textInput name="between" prefill="a &#36;y b"/>
<textInput name="beforeDigit" prefill="&#36;1"/>
<text name="t1">&dollar;x</text>
<text name="t2">&#36;(x)</text>
<p name="p">&dollar;p and &#36;q</p>
<text name="t3" extend="$t1"/>
<math name="m">&dollar;x</math>
<mathInput name="mi" prefill="&#36;x"/>
<text name="ownSpace">$&#x200B;q</text>
<textInput name="ownSpaceAttr" prefill="$&#x200B;q"/>
`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const value = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.value;
        expect(await value("paren")).eq("$(x)");
        expect(await value("letter")).eq("$x");
        expect(await value("reference")).eq("$$f");
        expect(await value("between")).eq("a $y b");
        expect(await value("beforeDigit")).eq("$1");
        expect(await value("t1")).eq("$x");
        expect(await value("t2")).eq("$(x)");
        expect(await value("t3")).eq("$x");
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("$p and $q");
        // math reads it as written, where the space was blank
        expect((await value("m")).tree).eqls(["unit", "$", "x"]);
        expect((await value("mi")).tree).eqls(["unit", "$", "x"]);
        // Incidental: a zero-width space the author writes right after a
        // `$` is removed too, as the worker can't tell it from the parser's.
        expect(await value("ownSpace")).eq("$q");
        expect(await value("ownSpaceAttr")).eq("$q");
    });

    it("a `$` written as a reference in an attribute read as text at load", async () => {
        // The parser hands a `$` written as a reference over as a piece of
        // text of its own, which the pieces beside it are joined to: no
        // `doenet-e0090` (Doenet/DoenetML#2643 items 6 and 7). Through an
        // extend too, which stopped the document from loading.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<codeEditor name="ce0" staticName="a&#36;1"/>
<codeEditor name="ce1" staticName="a&dollar;b"/>
<codeEditor name="ce2" staticName="&#36;"/>
<codeEditor name="ce4" staticName="&#36;(x)"/>
<codeEditor name="ce3" extend="$ce0" staticName="b&#36;2"/>
<p name="p" permid="p&#36;1">hi</p>
`,
        });
        const primitive = async (name: string, attribute: string) =>
            (core as any).core._components[await resolvePathToNodeIdx(name)]
                .attributes[attribute].primitive.value;
        expect(await primitive("ce0", "staticName")).eq("a$1");
        expect(await primitive("ce1", "staticName")).eq("a$b");
        expect(await primitive("ce2", "staticName")).eq("$");
        expect(await primitive("ce3", "staticName")).eq("b$2");
        // the zero-width space keeping `$(x)` text is removed
        expect(await primitive("ce4", "staticName")).eq("$(x)");
        expect(await primitive("p", "permid")).eq("p$1");
        expect(getDiagnosticsByType(core).errors).eqls([]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("hi");
    });
});
