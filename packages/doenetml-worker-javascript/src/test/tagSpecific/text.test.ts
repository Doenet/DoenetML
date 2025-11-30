import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveText,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Text tag tests", async () => {
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

        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).to.be.true;
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
    <p><text name="fixed_style" stylenumber="2">Two</text> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><text name="variable_style" stylenumber="$sn">Three</text> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

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
    <pointList extend="$collect1.anchor" name="tacoords" />

    <graph name="g3">
      <text extend="$t1.value" name="t1b" />
      <text extend="$t2.value" name="t2b" />
    </graph>

    <collect componentType="text" from="$g3" name="collect2" />
    <pointList extend="$collect2.anchor" name="tbcoords" />

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
});
