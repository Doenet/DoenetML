import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import { moveLabel, updateMathInputValue } from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("Label tag tests", async () => {
    it("label in graph", async () => {
        const doenetMLsnippet = `
    <graph >
      <label anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" fixed="$fixed1" fixLocation="$fixLocation1">Hello <m>\\frac{\\partial f}{\\partial x}</m></label>
      <label name="item2">Bye</label>
    </graph>
        `;

        await test_in_graph(doenetMLsnippet, moveLabel);
    });

    it("label in graph, handle bad anchor coordinates", async () => {
        let core = await createTestCore({
            doenetML: `
        <graph >
            <label anchor="$anchorCoords1" name="label1">Hello</label>
          </graph>
          
      
          <p name="pAnchor1">Anchor 1 coordinates:  <point copySource="label1.anchor" name="label1anchor" /></p>
          <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="x" /></p>
          
        
            `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/label1anchor"].stateValues.latex),
        ).eq("x");

        // give good anchor coords
        await updateMathInputValue({
            latex: "(6,7)",
            name: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/label1anchor"].stateValues.latex),
        ).eq("(6,7)");

        // give bad anchor coords again
        await updateMathInputValue({
            latex: "q",
            name: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(stateVariables["/label1anchor"].stateValues.latex),
        ).eq("q");
    });

    it("color label via style", async () => {
        let core = await createTestCore({
            doenetML: `
            <setup>
              <styleDefinitions>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
              </styleDefinitions>
            </setup>
        
            <p>Style number: <mathInput prefill="1" name="sn" /></p>
        
            <p><label name="no_style">one: <m>x^2</m></label> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
            <p><label name="fixed_style" styleNumber="2">two: <m>x^3</m></label> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
            <p><label name="variable_style" styleNumber="$sn">three: <m>x^4</m></label> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>
        
            <graph>
              $no_style{anchor="(1,2)"}
              $fixed_style{anchor="(3,4)"}
              $variable_style
            </graph>
        
            `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "black",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq(
            "black",
        );
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "none",
        );

        await updateMathInputValue({ latex: "2", name: "/sn", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "green",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq(
            "green",
        );
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "none",
        );

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");

        await updateMathInputValue({ latex: "3", name: "/sn", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "red with a blue background",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq("red");
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "blue",
        );

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");
    });

    it("label copied by plain macro, but not value, reflects style and anchor position", async () => {
        let core = await createTestCore({
            doenetML: `
            <setup>
              <styleDefinitions>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" />
              </styleDefinitions>
            </setup>
        
            <graph name="g1">
                <label styleNumber="2" name="m1">one: <m>x^2</m></label>
                <label styleNumber="3" anchor="(3,4)" name="m2" >two: <m>x^3</m></label>
            </graph>
        
            <coords copySource="m1.anchor" name="m1coords" />
            <coords copySource="m2.anchor" name="m2coords" />
        
            <graph name="g2">
              $m1{name="m1a"}
              $m2{name="m2a"}
            </graph>
        
            <collect componentTypes="label" source="g2" prop="anchor" assignNames="m1acoords m2acoords" />
        
            <graph name="g3">
              $m1.value{assignNames="m1b"}
              $m2.value{assignNames="m2b"}
            </graph>
        
            <collect componentTypes="label" source="g3" prop="anchor" assignNames="m1bcoords m2bcoords" />
        
            <p name="p1">$m1{name="m1c"} $m2{name="m2c"}</p>
        
            <p name="p2">$m1.value{assignNames="m1d"} $m2.value{assignNames="m2d"}</p>
        
            `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m1"].stateValues.value).eq("one: \\(x^2\\)");
        expect(stateVariables["/m1a"].stateValues.value).eq("one: \\(x^2\\)");
        expect(stateVariables["/m1b"].stateValues.value).eq("one: \\(x^2\\)");
        expect(stateVariables["/m1c"].stateValues.value).eq("one: \\(x^2\\)");
        expect(stateVariables["/m1d"].stateValues.value).eq("one: \\(x^2\\)");

        expect(stateVariables["/m2"].stateValues.value).eq("two: \\(x^3\\)");
        expect(stateVariables["/m2a"].stateValues.value).eq("two: \\(x^3\\)");
        expect(stateVariables["/m2b"].stateValues.value).eq("two: \\(x^3\\)");
        expect(stateVariables["/m2c"].stateValues.value).eq("two: \\(x^3\\)");
        expect(stateVariables["/m2d"].stateValues.value).eq("two: \\(x^3\\)");

        expect(stateVariables["/m1"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/m1a"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/m1b"].stateValues.styleNumber).eq(1);
        expect(stateVariables["/m1c"].stateValues.styleNumber).eq(2);
        expect(stateVariables["/m1d"].stateValues.styleNumber).eq(1);
        expect(stateVariables["/m2"].stateValues.styleNumber).eq(3);
        expect(stateVariables["/m2a"].stateValues.styleNumber).eq(3);
        expect(stateVariables["/m2b"].stateValues.styleNumber).eq(1);
        expect(stateVariables["/m2c"].stateValues.styleNumber).eq(3);
        expect(stateVariables["/m2d"].stateValues.styleNumber).eq(1);

        expect(cleanLatex(stateVariables["/m1coords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2coords"].stateValues.latex)).eq(
            "(3,4)",
        );
        expect(cleanLatex(stateVariables["/m1acoords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2acoords"].stateValues.latex)).eq(
            "(3,4)",
        );
        expect(cleanLatex(stateVariables["/m1bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );

        // move first labels
        await moveLabel({ name: "/m1", x: -2, y: 3, core });
        await moveLabel({ name: "/m2", x: 4, y: -5, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/m1coords"].stateValues.latex)).eq(
            "(-2,3)",
        );
        expect(cleanLatex(stateVariables["/m2coords"].stateValues.latex)).eq(
            "(4,-5)",
        );
        expect(cleanLatex(stateVariables["/m1acoords"].stateValues.latex)).eq(
            "(-2,3)",
        );
        expect(cleanLatex(stateVariables["/m2acoords"].stateValues.latex)).eq(
            "(4,-5)",
        );
        expect(cleanLatex(stateVariables["/m1bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );

        // move second labels
        await moveLabel({ name: "/m1a", x: 7, y: 1, core });
        await moveLabel({ name: "/m2a", x: -8, y: 2, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/m1coords"].stateValues.latex)).eq(
            "(7,1)",
        );
        expect(cleanLatex(stateVariables["/m2coords"].stateValues.latex)).eq(
            "(-8,2)",
        );
        expect(cleanLatex(stateVariables["/m1acoords"].stateValues.latex)).eq(
            "(7,1)",
        );
        expect(cleanLatex(stateVariables["/m2acoords"].stateValues.latex)).eq(
            "(-8,2)",
        );
        expect(cleanLatex(stateVariables["/m1bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(cleanLatex(stateVariables["/m2bcoords"].stateValues.latex)).eq(
            "(0,0)",
        );

        // move third labels
        await moveLabel({ name: "/m1b", x: -6, y: 3, core });
        await moveLabel({ name: "/m2b", x: -5, y: -4, core });
        stateVariables = await returnAllStateVariables(core);

        expect(cleanLatex(stateVariables["/m1coords"].stateValues.latex)).eq(
            "(7,1)",
        );
        expect(cleanLatex(stateVariables["/m2coords"].stateValues.latex)).eq(
            "(-8,2)",
        );
        expect(cleanLatex(stateVariables["/m1acoords"].stateValues.latex)).eq(
            "(7,1)",
        );
        expect(cleanLatex(stateVariables["/m2acoords"].stateValues.latex)).eq(
            "(-8,2)",
        );
        expect(cleanLatex(stateVariables["/m1bcoords"].stateValues.latex)).eq(
            "(-6,3)",
        );
        expect(cleanLatex(stateVariables["/m2bcoords"].stateValues.latex)).eq(
            "(-5,-4)",
        );
    });
});
