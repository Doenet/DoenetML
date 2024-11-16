import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveLabel,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Label tag tests", async () => {
    it("label value, text, and latex", async () => {
        let core = await createTestCore({
            doenetML: `
<label name="l1">Hello</label>
<label name="l2"><text name="text">Hello</text></label>
<label name="l3"><m name="m">\\left(x_2 y_{2.1},\\frac{y^2}{z^{2.1}}\\right)</m></label>
<label name="l4"><math name="math">(a_2 b_2.1,b^2/c^2.1)</math></label>
<label name="l5"><number name="number1">1</number></label>
<label name="l6"><number name="number2" renderAsMath>2</number></label>
<label name="l7">$text and $m and $math and $number1 and $number2</label>
<label name="l8">$l1 and $l2 and $l3 and $l4 and $l5 and $l6 and $l7</label>

            `,
        });

        const stateVariables = await returnAllStateVariables(core);
        let l1 = "Hello";
        let l2 = "Hello";
        let l3Latex = "\\left(x_2 y_{2.1},\\frac{y^2}{z^{2.1}}\\right)";
        let l3Value = `\\(${l3Latex}\\)`;
        let l3Text = "( x₂ y_2.1, (y²)/(z^2.1) )";
        let l4Latex = "\\left( a_{2} b_{2.1}, \\frac{b^{2}}{c^{2.1}} \\right)";
        let l4Value = `\\(${l4Latex}\\)`;
        let l4Text = "( a₂ b_2.1, (b²)/(c^2.1) )";
        let l5 = "1";
        let l6Latex = "2";
        let l6Value = `\\(${l6Latex}\\)`;
        let l6Text = "2";
        let l7Value = `${l2} and ${l3Value} and ${l4Value} and ${l5} and ${l6Value}`;
        let l7Text = `${l2} and ${l3Text} and ${l4Text} and ${l5} and ${l6Text}`;
        let l7Latex = `${l2} and ${l3Latex} and ${l4Latex} and ${l5} and ${l6Latex}`;
        let l8Value = `${l1} and ${l2} and ${l3Value} and ${l4Value} and ${l5} and ${l6Value} and ${l7Value}`;
        let l8Text = `${l1} and ${l2} and ${l3Text} and ${l4Text} and ${l5} and ${l6Text} and ${l7Text}`;
        let l8Latex = `${l1} and ${l2} and ${l3Latex} and ${l4Latex} and ${l5} and ${l6Latex} and ${l7Latex}`;

        expect(stateVariables["/l1"].stateValues.value).eq(l1);
        expect(stateVariables["/l1"].stateValues.text).eq(l1);
        expect(stateVariables["/l1"].stateValues.latex).eq(l1);
        expect(stateVariables["/l1"].stateValues.hasLatex).eq(false);

        expect(stateVariables["/l2"].stateValues.value).eq(l2);
        expect(stateVariables["/l2"].stateValues.text).eq(l2);
        expect(stateVariables["/l2"].stateValues.latex).eq(l2);
        expect(stateVariables["/l2"].stateValues.hasLatex).eq(false);

        expect(stateVariables["/l3"].stateValues.value).eq(l3Value);
        expect(stateVariables["/l3"].stateValues.text).eq(l3Text);
        expect(stateVariables["/l3"].stateValues.latex).eq(l3Latex);
        expect(stateVariables["/l3"].stateValues.hasLatex).eq(true);

        expect(stateVariables["/l4"].stateValues.value).eq(l4Value);
        expect(stateVariables["/l4"].stateValues.text).eq(l4Text);
        expect(stateVariables["/l4"].stateValues.latex).eq(l4Latex);
        expect(stateVariables["/l4"].stateValues.hasLatex).eq(true);

        expect(stateVariables["/l5"].stateValues.value).eq(l5);
        expect(stateVariables["/l5"].stateValues.text).eq(l5);
        expect(stateVariables["/l5"].stateValues.latex).eq(l5);
        expect(stateVariables["/l5"].stateValues.hasLatex).eq(false);

        expect(stateVariables["/l6"].stateValues.value).eq(l6Value);
        expect(stateVariables["/l6"].stateValues.text).eq(l6Text);
        expect(stateVariables["/l6"].stateValues.latex).eq(l6Latex);
        expect(stateVariables["/l6"].stateValues.hasLatex).eq(true);

        expect(stateVariables["/l7"].stateValues.value).eq(l7Value);
        expect(stateVariables["/l7"].stateValues.text).eq(l7Text);
        expect(stateVariables["/l7"].stateValues.latex).eq(l7Latex);
        expect(stateVariables["/l7"].stateValues.hasLatex).eq(true);

        expect(stateVariables["/l8"].stateValues.value).eq(l8Value);
        expect(stateVariables["/l8"].stateValues.text).eq(l8Text);
        expect(stateVariables["/l8"].stateValues.latex).eq(l8Latex);
        expect(stateVariables["/l8"].stateValues.hasLatex).eq(true);
    });

    it("change text label from its value, text, or latex", async () => {
        let core = await createTestCore({
            doenetML: `
<label name="l1">Hello</label>
<label name="l2" copySource="l1" />

<textInput name="value1">$l1.value</textInput>
<textInput name="text1">$l1.text</textInput>
<textInput name="latex1">$l1.latex</textInput>

<textInput name="value2">$l2.value</textInput>
<textInput name="text2">$l2.text</textInput>
<textInput name="latex2">$l2.latex</textInput>
            `,
        });

        async function check_items(text: string) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/l1"].stateValues.value).eq(text);
            expect(stateVariables["/l1"].stateValues.text).eq(text);
            expect(stateVariables["/l1"].stateValues.latex).eq(text);
            expect(stateVariables["/l2"].stateValues.value).eq(text);
            expect(stateVariables["/l2"].stateValues.text).eq(text);
            expect(stateVariables["/l2"].stateValues.latex).eq(text);

            expect(stateVariables["/value1"].stateValues.value).eq(text);
            expect(stateVariables["/text1"].stateValues.value).eq(text);
            expect(stateVariables["/latex1"].stateValues.value).eq(text);

            expect(stateVariables["/value2"].stateValues.value).eq(text);
            expect(stateVariables["/text2"].stateValues.value).eq(text);
            expect(stateVariables["/latex2"].stateValues.value).eq(text);
        }

        await check_items("Hello");

        // cannot change value to expression involving latex
        // (textInput end up converting value to text beforehand )
        await updateTextInputValue({
            text: "\\(\\frac{1}{2}\\)",
            name: "/value1",
            core,
        });
        await check_items("\\(\\frac{1}{2}\\)");

        await updateTextInputValue({ text: "Bye", name: "/text1", core });
        await check_items("Bye");

        await updateTextInputValue({ text: "The", name: "/latex1", core });
        await check_items("The");

        await updateTextInputValue({ text: "quick", name: "/value2", core });
        await check_items("quick");

        await updateTextInputValue({ text: "brown", name: "/text2", core });
        await check_items("brown");

        await updateTextInputValue({ text: "fox", name: "/latex2", core });
        await check_items("fox");
    });

    it("change math label from its value, text, or latex", async () => {
        let core = await createTestCore({
            doenetML: `
<label name="l1"><math>x^2/2</math></label>
<label name="l2" copySource="l1" />

<textInput name="value1">$l1.value</textInput>
<textInput name="text1">$l1.text</textInput>
<textInput name="latex1">$l1.latex</textInput>

<textInput name="value2">$l2.value</textInput>
<textInput name="text2">$l2.text</textInput>
<textInput name="latex2">$l2.latex</textInput>
            `,
        });

        async function check_items(value: string, text: string, latex: string) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/l1"].stateValues.value).eq(value);
            expect(stateVariables["/l1"].stateValues.text).eq(text);
            expect(stateVariables["/l1"].stateValues.latex).eq(latex);
            expect(stateVariables["/l2"].stateValues.value).eq(value);
            expect(stateVariables["/l2"].stateValues.text).eq(text);
            expect(stateVariables["/l2"].stateValues.latex).eq(latex);

            expect(stateVariables["/value1"].stateValues.value).eq(text);
            expect(stateVariables["/text1"].stateValues.value).eq(text);
            expect(stateVariables["/latex1"].stateValues.value).eq(latex);

            expect(stateVariables["/value2"].stateValues.value).eq(text);
            expect(stateVariables["/text2"].stateValues.value).eq(text);
            expect(stateVariables["/latex2"].stateValues.value).eq(latex);
        }

        await check_items(
            "\\(\\frac{x^{2}}{2}\\)",
            "(x²)/2",
            "\\frac{x^{2}}{2}",
        );

        // update value
        // (textInput ends up converting value to text beforehand )
        await updateTextInputValue({
            text: "a/b",
            name: "/value1",
            core,
        });
        await check_items("\\(\\frac{a}{b}\\)", "a/b", "\\frac{a}{b}");

        await updateTextInputValue({ text: "(x,y)", name: "/text1", core });
        await check_items(
            "\\(\\left( x, y \\right)\\)",
            "( x, y )",
            "\\left( x, y \\right)",
        );

        await updateTextInputValue({ text: "z^2", name: "/latex1", core });
        await check_items("\\(z^{2}\\)", "z²", "z^{2}");

        // update value 2
        // (textInput ends up converting value to text beforehand )
        await updateTextInputValue({
            text: "x_4!",
            name: "/value2",
            core,
        });
        await check_items("\\(x_{4}!\\)", "x₄!", "x_{4}!");

        await updateTextInputValue({ text: "A or B", name: "/text2", core });
        await check_items("\\(A \\lor B\\)", "A or B", "A \\lor B");

        await updateTextInputValue({
            text: "\\int_a^b f(x) dx",
            name: "/latex2",
            core,
        });
        await check_items(
            "\\(\\int_{a}^{b} f\\left(x\\right)dx\\)",
            "∫_a^b f(x) dx",
            "\\int_{a}^{b} f\\left(x\\right)dx",
        );
    });

    it("change m label from its value, text, or latex", async () => {
        let core = await createTestCore({
            doenetML: `
<label name="l1"><m>x^2/2</m></label>
<label name="l2" copySource="l1" />

<textInput name="value1">$l1.value</textInput>
<textInput name="text1">$l1.text</textInput>
<textInput name="latex1">$l1.latex</textInput>

<textInput name="value2">$l2.value</textInput>
<textInput name="text2">$l2.text</textInput>
<textInput name="latex2">$l2.latex</textInput>
            `,
        });

        async function check_items(value: string, text: string, latex: string) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/l1"].stateValues.value).eq(value);
            expect(stateVariables["/l1"].stateValues.text).eq(text);
            expect(stateVariables["/l1"].stateValues.latex).eq(latex);
            expect(stateVariables["/l2"].stateValues.value).eq(value);
            expect(stateVariables["/l2"].stateValues.text).eq(text);
            expect(stateVariables["/l2"].stateValues.latex).eq(latex);

            expect(stateVariables["/value1"].stateValues.value).eq(text);
            expect(stateVariables["/text1"].stateValues.value).eq(text);
            expect(stateVariables["/latex1"].stateValues.value).eq(latex);

            expect(stateVariables["/value2"].stateValues.value).eq(text);
            expect(stateVariables["/text2"].stateValues.value).eq(text);
            expect(stateVariables["/latex2"].stateValues.value).eq(latex);
        }

        // Note: doesn't normalize latex
        await check_items("\\(x^2/2\\)", "(x²)/2", "x^2/2");

        // update value
        // (textInput ends up converting value to text beforehand )
        await updateTextInputValue({
            text: "a/b",
            name: "/value1",
            core,
        });
        await check_items("\\(\\frac{a}{b}\\)", "a/b", "\\frac{a}{b}");

        await updateTextInputValue({ text: "(x,y)", name: "/text1", core });
        await check_items(
            "\\(\\left( x, y \\right)\\)",
            "( x, y )",
            "\\left( x, y \\right)",
        );

        // Note: doesn't normalize latex when set from latex variable
        await updateTextInputValue({ text: "z^2", name: "/latex1", core });
        await check_items("\\(z^2\\)", "z²", "z^2");

        // update value 2
        // (textInput ends up converting value to text beforehand )
        await updateTextInputValue({
            text: "x_4!",
            name: "/value2",
            core,
        });
        await check_items("\\(x_{4}!\\)", "x₄!", "x_{4}!");

        await updateTextInputValue({ text: "A or B", name: "/text2", core });
        await check_items("\\(A \\lor B\\)", "A or B", "A \\lor B");

        // Note: doesn't normalize latex when set from latex variable
        await updateTextInputValue({
            text: "\\int_a^b f(x) dx",
            name: "/latex2",
            core,
        });
        await check_items(
            "\\(\\int_a^b f(x) dx\\)",
            "∫_a^b f(x) dx",
            "\\int_a^b f(x) dx",
        );
    });

    it("cannot change multi-child label from its value, text, or latex", async () => {
        let core = await createTestCore({
            doenetML: `
<label name="l1">Hello <m>x^2/2</m></label>
<label name="l2" copySource="l1" />

<textInput name="value1">$l1.value</textInput>
<textInput name="text1">$l1.text</textInput>
<textInput name="latex1">$l1.latex</textInput>

<textInput name="value2">$l2.value</textInput>
<textInput name="text2">$l2.text</textInput>
<textInput name="latex2">$l2.latex</textInput>
            `,
        });

        async function check_items(value: string, text: string, latex: string) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/l1"].stateValues.value).eq(value);
            expect(stateVariables["/l1"].stateValues.text).eq(text);
            expect(stateVariables["/l1"].stateValues.latex).eq(latex);
            expect(stateVariables["/l2"].stateValues.value).eq(value);
            expect(stateVariables["/l2"].stateValues.text).eq(text);
            expect(stateVariables["/l2"].stateValues.latex).eq(latex);

            expect(stateVariables["/value1"].stateValues.value).eq(text);
            expect(stateVariables["/text1"].stateValues.value).eq(text);
            expect(stateVariables["/latex1"].stateValues.value).eq(latex);

            expect(stateVariables["/value2"].stateValues.value).eq(text);
            expect(stateVariables["/text2"].stateValues.value).eq(text);
            expect(stateVariables["/latex2"].stateValues.value).eq(latex);
        }

        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update value
        await updateTextInputValue({
            text: "a/b",
            name: "/value1",
            core,
        });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update text
        await updateTextInputValue({ text: "(x,y)", name: "/text1", core });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update latex
        await updateTextInputValue({ text: "z^2", name: "/latex1", core });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update value 2
        await updateTextInputValue({
            text: "x_4!",
            name: "/value2",
            core,
        });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update text 2
        await updateTextInputValue({ text: "A or B", name: "/text2", core });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update latex 2
        await updateTextInputValue({
            text: "\\int_a^b f(x) dx",
            name: "/latex2",
            core,
        });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");
    });

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
