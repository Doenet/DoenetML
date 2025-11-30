import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveLabel,
    movePoint,
    updateMathInputValue,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";
import { latexToText } from "../../utils/math";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Label tag tests", async () => {
    it("label value, text, and latex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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

        const stateVariables = await core.returnAllStateVariables(false, true);
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

        expect(
            stateVariables[await resolvePathToNodeIdx("l1")].stateValues.value,
        ).eq(l1);
        expect(
            stateVariables[await resolvePathToNodeIdx("l1")].stateValues.text,
        ).eq(l1);
        expect(
            stateVariables[await resolvePathToNodeIdx("l1")].stateValues.latex,
        ).eq(l1);
        expect(
            stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                .hasLatex,
        ).eq(false);

        expect(
            stateVariables[await resolvePathToNodeIdx("l2")].stateValues.value,
        ).eq(l2);
        expect(
            stateVariables[await resolvePathToNodeIdx("l2")].stateValues.text,
        ).eq(l2);
        expect(
            stateVariables[await resolvePathToNodeIdx("l2")].stateValues.latex,
        ).eq(l2);
        expect(
            stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                .hasLatex,
        ).eq(false);

        expect(
            stateVariables[await resolvePathToNodeIdx("l3")].stateValues.value,
        ).eq(l3Value);
        expect(
            stateVariables[await resolvePathToNodeIdx("l3")].stateValues.text,
        ).eq(l3Text);
        expect(
            stateVariables[await resolvePathToNodeIdx("l3")].stateValues.latex,
        ).eq(l3Latex);
        expect(
            stateVariables[await resolvePathToNodeIdx("l3")].stateValues
                .hasLatex,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("l4")].stateValues.value,
        ).eq(l4Value);
        expect(
            stateVariables[await resolvePathToNodeIdx("l4")].stateValues.text,
        ).eq(l4Text);
        expect(
            stateVariables[await resolvePathToNodeIdx("l4")].stateValues.latex,
        ).eq(l4Latex);
        expect(
            stateVariables[await resolvePathToNodeIdx("l4")].stateValues
                .hasLatex,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("l5")].stateValues.value,
        ).eq(l5);
        expect(
            stateVariables[await resolvePathToNodeIdx("l5")].stateValues.text,
        ).eq(l5);
        expect(
            stateVariables[await resolvePathToNodeIdx("l5")].stateValues.latex,
        ).eq(l5);
        expect(
            stateVariables[await resolvePathToNodeIdx("l5")].stateValues
                .hasLatex,
        ).eq(false);

        expect(
            stateVariables[await resolvePathToNodeIdx("l6")].stateValues.value,
        ).eq(l6Value);
        expect(
            stateVariables[await resolvePathToNodeIdx("l6")].stateValues.text,
        ).eq(l6Text);
        expect(
            stateVariables[await resolvePathToNodeIdx("l6")].stateValues.latex,
        ).eq(l6Latex);
        expect(
            stateVariables[await resolvePathToNodeIdx("l6")].stateValues
                .hasLatex,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("l7")].stateValues.value,
        ).eq(l7Value);
        expect(
            stateVariables[await resolvePathToNodeIdx("l7")].stateValues.text,
        ).eq(l7Text);
        expect(
            stateVariables[await resolvePathToNodeIdx("l7")].stateValues.latex,
        ).eq(l7Latex);
        expect(
            stateVariables[await resolvePathToNodeIdx("l7")].stateValues
                .hasLatex,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("l8")].stateValues.value,
        ).eq(l8Value);
        expect(
            stateVariables[await resolvePathToNodeIdx("l8")].stateValues.text,
        ).eq(l8Text);
        expect(
            stateVariables[await resolvePathToNodeIdx("l8")].stateValues.latex,
        ).eq(l8Latex);
        expect(
            stateVariables[await resolvePathToNodeIdx("l8")].stateValues
                .hasLatex,
        ).eq(true);
    });

    it("change text label from its value, text, or latex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<label name="l1">Hello</label>
<label name="l2" extend="$l1" />

<textInput name="value1">$l1.value</textInput>
<textInput name="text1">$l1.text</textInput>
<textInput name="latex1">$l1.latex</textInput>

<textInput name="value2">$l2.value</textInput>
<textInput name="text2">$l2.text</textInput>
<textInput name="latex2">$l2.latex</textInput>
            `,
        });

        async function check_items(text: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .latex,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .latex,
            ).eq(text);

            expect(
                stateVariables[await resolvePathToNodeIdx("value1")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("text1")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("latex1")].stateValues
                    .value,
            ).eq(text);

            expect(
                stateVariables[await resolvePathToNodeIdx("value2")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("text2")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("latex2")].stateValues
                    .value,
            ).eq(text);
        }

        await check_items("Hello");

        // cannot change value to expression involving latex
        // (textInput end up converting value to text beforehand )
        await updateTextInputValue({
            text: "\\(\\frac{1}{2}\\)",
            componentIdx: await resolvePathToNodeIdx("value1"),
            core,
        });
        await check_items("\\(\\frac{1}{2}\\)");

        await updateTextInputValue({
            text: "Bye",
            componentIdx: await resolvePathToNodeIdx("text1"),
            core,
        });
        await check_items("Bye");

        await updateTextInputValue({
            text: "The",
            componentIdx: await resolvePathToNodeIdx("latex1"),
            core,
        });
        await check_items("The");

        await updateTextInputValue({
            text: "quick",
            componentIdx: await resolvePathToNodeIdx("value2"),
            core,
        });
        await check_items("quick");

        await updateTextInputValue({
            text: "brown",
            componentIdx: await resolvePathToNodeIdx("text2"),
            core,
        });
        await check_items("brown");

        await updateTextInputValue({
            text: "fox",
            componentIdx: await resolvePathToNodeIdx("latex2"),
            core,
        });
        await check_items("fox");
    });

    it("change math label from its value, text, or latex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<label name="l1"><math>x^2/2</math></label>
<label name="l2" extend="$l1" />

<textInput name="value1">$l1.value</textInput>
<textInput name="text1">$l1.text</textInput>
<textInput name="latex1">$l1.latex</textInput>

<textInput name="value2">$l2.value</textInput>
<textInput name="text2">$l2.text</textInput>
<textInput name="latex2">$l2.latex</textInput>
            `,
        });

        async function check_items(value: string, text: string, latex: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .value,
            ).eq(value);
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .latex,
            ).eq(latex);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .value,
            ).eq(value);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .latex,
            ).eq(latex);

            expect(
                stateVariables[await resolvePathToNodeIdx("value1")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("text1")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("latex1")].stateValues
                    .value,
            ).eq(latex);

            expect(
                stateVariables[await resolvePathToNodeIdx("value2")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("text2")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("latex2")].stateValues
                    .value,
            ).eq(latex);
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
            componentIdx: await resolvePathToNodeIdx("value1"),
            core,
        });
        await check_items("\\(\\frac{a}{b}\\)", "a/b", "\\frac{a}{b}");

        await updateTextInputValue({
            text: "(x,y)",
            componentIdx: await resolvePathToNodeIdx("text1"),
            core,
        });
        await check_items(
            "\\(\\left( x, y \\right)\\)",
            "( x, y )",
            "\\left( x, y \\right)",
        );

        await updateTextInputValue({
            text: "z^2",
            componentIdx: await resolvePathToNodeIdx("latex1"),
            core,
        });
        await check_items("\\(z^{2}\\)", "z²", "z^{2}");

        // update value 2
        // (textInput ends up converting value to text beforehand )
        await updateTextInputValue({
            text: "x_4!",
            componentIdx: await resolvePathToNodeIdx("value2"),
            core,
        });
        await check_items("\\(x_{4}!\\)", "x₄!", "x_{4}!");

        await updateTextInputValue({
            text: "A or B",
            componentIdx: await resolvePathToNodeIdx("text2"),
            core,
        });
        await check_items("\\(A \\lor B\\)", "A or B", "A \\lor B");

        await updateTextInputValue({
            text: "\\int_a^b f(x) dx",
            componentIdx: await resolvePathToNodeIdx("latex2"),
            core,
        });
        await check_items(
            "\\(\\int_{a}^{b} f\\left(x\\right)dx\\)",
            "∫_a^b f(x) dx",
            "\\int_{a}^{b} f\\left(x\\right)dx",
        );
    });

    it("change m label from its value, text, or latex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<label name="l1"><m>x^2/2</m></label>
<label name="l2" extend="$l1" />

<textInput name="value1">$l1.value</textInput>
<textInput name="text1">$l1.text</textInput>
<textInput name="latex1">$l1.latex</textInput>

<textInput name="value2">$l2.value</textInput>
<textInput name="text2">$l2.text</textInput>
<textInput name="latex2">$l2.latex</textInput>
            `,
        });

        async function check_items(value: string, text: string, latex: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .value,
            ).eq(value);
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .latex,
            ).eq(latex);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .value,
            ).eq(value);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .latex,
            ).eq(latex);

            expect(
                stateVariables[await resolvePathToNodeIdx("value1")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("text1")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("latex1")].stateValues
                    .value,
            ).eq(latex);

            expect(
                stateVariables[await resolvePathToNodeIdx("value2")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("text2")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("latex2")].stateValues
                    .value,
            ).eq(latex);
        }

        // Note: doesn't normalize latex
        await check_items("\\(x^2/2\\)", "(x²)/2", "x^2/2");

        // update value
        // (textInput ends up converting value to text beforehand )
        await updateTextInputValue({
            text: "a/b",
            componentIdx: await resolvePathToNodeIdx("value1"),
            core,
        });
        await check_items("\\(\\frac{a}{b}\\)", "a/b", "\\frac{a}{b}");

        await updateTextInputValue({
            text: "(x,y)",
            componentIdx: await resolvePathToNodeIdx("text1"),
            core,
        });
        await check_items(
            "\\(\\left( x, y \\right)\\)",
            "( x, y )",
            "\\left( x, y \\right)",
        );

        // Note: doesn't normalize latex when set from latex variable
        await updateTextInputValue({
            text: "z^2",
            componentIdx: await resolvePathToNodeIdx("latex1"),
            core,
        });
        await check_items("\\(z^2\\)", "z²", "z^2");

        // update value 2
        // (textInput ends up converting value to text beforehand )
        await updateTextInputValue({
            text: "x_4!",
            componentIdx: await resolvePathToNodeIdx("value2"),
            core,
        });
        await check_items("\\(x_{4}!\\)", "x₄!", "x_{4}!");

        await updateTextInputValue({
            text: "A or B",
            componentIdx: await resolvePathToNodeIdx("text2"),
            core,
        });
        await check_items("\\(A \\lor B\\)", "A or B", "A \\lor B");

        // Note: doesn't normalize latex when set from latex variable
        await updateTextInputValue({
            text: "\\int_a^b f(x) dx",
            componentIdx: await resolvePathToNodeIdx("latex2"),
            core,
        });
        await check_items(
            "\\(\\int_a^b f(x) dx\\)",
            "∫_a^b f(x) dx",
            "\\int_a^b f(x) dx",
        );
    });

    it("cannot change multi-child label from its value, text, or latex", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<label name="l1">Hello <m>x^2/2</m></label>
<label name="l2" extend="$l1" />

<textInput name="value1">$l1.value</textInput>
<textInput name="text1">$l1.text</textInput>
<textInput name="latex1">$l1.latex</textInput>

<textInput name="value2">$l2.value</textInput>
<textInput name="text2">$l2.text</textInput>
<textInput name="latex2">$l2.latex</textInput>
            `,
        });

        async function check_items(value: string, text: string, latex: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .value,
            ).eq(value);
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l1")].stateValues
                    .latex,
            ).eq(latex);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .value,
            ).eq(value);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .text,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("l2")].stateValues
                    .latex,
            ).eq(latex);

            expect(
                stateVariables[await resolvePathToNodeIdx("value1")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("text1")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("latex1")].stateValues
                    .value,
            ).eq(latex);

            expect(
                stateVariables[await resolvePathToNodeIdx("value2")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("text2")].stateValues
                    .value,
            ).eq(text);
            expect(
                stateVariables[await resolvePathToNodeIdx("latex2")].stateValues
                    .value,
            ).eq(latex);
        }

        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update value
        await updateTextInputValue({
            text: "a/b",
            componentIdx: await resolvePathToNodeIdx("value1"),
            core,
        });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update text
        await updateTextInputValue({
            text: "(x,y)",
            componentIdx: await resolvePathToNodeIdx("text1"),
            core,
        });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update latex
        await updateTextInputValue({
            text: "z^2",
            componentIdx: await resolvePathToNodeIdx("latex1"),
            core,
        });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update value 2
        await updateTextInputValue({
            text: "x_4!",
            componentIdx: await resolvePathToNodeIdx("value2"),
            core,
        });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update text 2
        await updateTextInputValue({
            text: "A or B",
            componentIdx: await resolvePathToNodeIdx("text2"),
            core,
        });
        await check_items("Hello \\(x^2/2\\)", "Hello (x²)/2", "Hello x^2/2");

        // cannot update latex 2
        await updateTextInputValue({
            text: "\\int_a^b f(x) dx",
            componentIdx: await resolvePathToNodeIdx("latex2"),
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <graph >
            <label anchor="$anchorCoords1" name="label1">Hello</label>
          </graph>
          
      
          <p name="pAnchor1">Anchor 1 coordinates:  <point extend="$label1.anchor" name="label1anchor" /></p>
          <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="x" /></p>
          
        
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("label1anchor")]
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
                stateVariables[await resolvePathToNodeIdx("label1anchor")]
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
                stateVariables[await resolvePathToNodeIdx("label1anchor")]
                    .stateValues.latex,
            ),
        ).eq("q");
    });

    it("color label via style", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <setup>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
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

    it("label copied by plain macro, but not value, reflects style and anchor position", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <setup>
                <styleDefinition styleNumber="2" textColor="green" />
                <styleDefinition styleNumber="3" textColor="red" />
            </setup>
        
            <graph name="g1">
                <label styleNumber="2" name="m1">one: <m>x^2</m></label>
                <label styleNumber="3" anchor="(3,4)" name="m2" >two: <m>x^3</m></label>
            </graph>
        
            <coords extend="$m1.anchor" name="m1coords" />
            <coords extend="$m2.anchor" name="m2coords" />
        
            <graph name="g2">
              <label extend="$m1" name="m1a" />
              <label extend="$m2" name="m2a" />
            </graph>
        
            <collect componentType="label" from="$g2" name="col1" />
            <coords extend="$col1[1].anchor" name="m1acoords" />
            <coords extend="$col1[2].anchor" name="m2acoords" />

        
            <graph name="g3">
              <label extend="$m1.value" name="m1b" />
              <label extend="$m2.value" name="m2b" />
            </graph>
        
            <collect componentType="label" from="$g3" name="col2" />
            <coords extend="$col2[1].anchor" name="m1bcoords" />
            <coords extend="$col2[2].anchor" name="m2bcoords" />
        
            <p name="p1"><label extend="$m1" name="m1c"/> <label extend="$m2" name="m2c" /></p>
        
            <p name="p2"><label extend="$m1.value" name="m1d"/> <label extend="$m2.value" name="m2d" /></p>
        
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value,
        ).eq("one: \\(x^2\\)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1a")].stateValues.value,
        ).eq("one: \\(x^2\\)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1b")].stateValues.value,
        ).eq("one: \\(x^2\\)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1c")].stateValues.value,
        ).eq("one: \\(x^2\\)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1d")].stateValues.value,
        ).eq("one: \\(x^2\\)");

        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value,
        ).eq("two: \\(x^3\\)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2a")].stateValues.value,
        ).eq("two: \\(x^3\\)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2b")].stateValues.value,
        ).eq("two: \\(x^3\\)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2c")].stateValues.value,
        ).eq("two: \\(x^3\\)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2d")].stateValues.value,
        ).eq("two: \\(x^3\\)");

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1a")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1b")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1c")].stateValues
                .styleNumber,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1d")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2a")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2b")].stateValues
                .styleNumber,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2c")].stateValues
                .styleNumber,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2d")].stateValues
                .styleNumber,
        ).eq(1);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1acoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2acoords")]
                    .stateValues.latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move first labels
        await moveLabel({
            componentIdx: await resolvePathToNodeIdx("m1"),
            x: -2,
            y: 3,
            core,
        });
        await moveLabel({
            componentIdx: await resolvePathToNodeIdx("m2"),
            x: 4,
            y: -5,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(-2,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(4,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1acoords")]
                    .stateValues.latex,
            ),
        ).eq("(-2,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2acoords")]
                    .stateValues.latex,
            ),
        ).eq("(4,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move second labels
        await moveLabel({
            componentIdx: await resolvePathToNodeIdx("m1a"),
            x: 7,
            y: 1,
            core,
        });
        await moveLabel({
            componentIdx: await resolvePathToNodeIdx("m2a"),
            x: -8,
            y: 2,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1acoords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2acoords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(0,0)");

        // move third labels
        await moveLabel({
            componentIdx: await resolvePathToNodeIdx("m1b"),
            x: -6,
            y: 3,
            core,
        });
        await moveLabel({
            componentIdx: await resolvePathToNodeIdx("m2b"),
            x: -5,
            y: -4,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1coords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2coords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1acoords")]
                    .stateValues.latex,
            ),
        ).eq("(7,1)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2acoords")]
                    .stateValues.latex,
            ),
        ).eq("(-8,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(-6,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2bcoords")]
                    .stateValues.latex,
            ),
        ).eq("(-5,-4)");
    });

    it("label point with child, part math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P" displayDecimals="1" padZeros>
        (1,2)
        <label>We have <m>x^{$P.x} + y^{$P.y}</m></label>
      </point>
      <point name="Q" displayDigits="3" padZeros>
        <label>No latex: x^<text>$Q.x</text> + y^<text>$Q.y</text></label>
        (3,4)
      </point>
      <point name="R" displayDecimals="2">
        <label>$P.label and $R.coords</label>
        (5,6)
      </point>
      <point name="S" displayDigits="2">
        <label>$Q.label and $S.coords</label>
        (7,8)
      </point>
    </graph>

    <p name="labelPPar">Label for P: $P.label</p>
    <p name="labelQPar">Label for Q: $Q.label</p>
    <p name="labelRPar">Label for R: $R.label</p>
    <p name="labelSPar">Label for S: $S.label</p>
    `,
        });

        async function check_items({
            Px,
            Py,
            Qx,
            Qy,
            Rx,
            Ry,
            Sx,
            Sy,
        }: {
            Px: number;
            Py: number;
            Qx: number;
            Qy: number;
            Rx: number;
            Ry: number;
            Sx: number;
            Sy: number;
        }) {
            let PxLatex = me
                .round_numbers_to_precision_plus_decimals(Px, -Infinity, 1)
                .toLatex({ padToDecimals: 1 });
            let PyLatex = me
                .round_numbers_to_precision_plus_decimals(Py, -Infinity, 1)
                .toLatex({ padToDecimals: 1 });

            let QxLatex = me
                .round_numbers_to_precision_plus_decimals(Qx, 3, 0)
                .toLatex({ padToDigits: 3 });
            let QyLatex = me
                .round_numbers_to_precision_plus_decimals(Qy, 3, 0)
                .toLatex({ padToDigits: 3 });

            let RxLatex = me
                .round_numbers_to_precision_plus_decimals(Rx, -Infinity, 2)
                .toLatex();
            let RyLatex = me
                .round_numbers_to_precision_plus_decimals(Ry, -Infinity, 2)
                .toLatex();
            let SxLatex = me
                .round_numbers_to_precision_plus_decimals(Sx, 2, 0)
                .toLatex();
            let SyLatex = me
                .round_numbers_to_precision_plus_decimals(Sy, 2, 0)
                .toLatex();

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let PLabel = `We have \\(x^{ ${PxLatex} } + y^{ ${PyLatex} }\\)`;
            let PLabelText = `We have ${latexToText(`x^{ ${PxLatex} } + y^{ ${PyLatex} }`)}`;
            expect(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .label,
            ).eq(PLabel);
            expect(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .labelHasLatex,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("labelPPar")]
                    .stateValues.text,
            ).eq(`Label for P: ${PLabelText}`);

            let QLabel = `No latex: x^${QxLatex} + y^${QyLatex}`;
            expect(
                stateVariables[await resolvePathToNodeIdx("Q")].stateValues
                    .label,
            ).eq(QLabel);
            expect(
                stateVariables[await resolvePathToNodeIdx("Q")].stateValues
                    .labelHasLatex,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("labelQPar")]
                    .stateValues.text,
            ).eq(`Label for Q: ${QLabel}`);

            let RLabel = `${PLabel} and \\(\\left( ${RxLatex}, ${RyLatex} \\right)\\)`;
            let RLabelText = `${PLabelText} and ${latexToText(`( ${RxLatex}, ${RyLatex} )`)}`;
            expect(
                stateVariables[await resolvePathToNodeIdx("R")].stateValues
                    .label,
            ).eq(RLabel);
            expect(
                stateVariables[await resolvePathToNodeIdx("R")].stateValues
                    .labelHasLatex,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("labelRPar")]
                    .stateValues.text,
            ).eq(`Label for R: ${RLabelText}`);

            let SLabel = `${QLabel} and \\(\\left( ${SxLatex}, ${SyLatex} \\right)\\)`;
            let SLabelText = `${QLabel} and ${latexToText(`( ${SxLatex}, ${SyLatex} )`)}`;
            expect(
                stateVariables[await resolvePathToNodeIdx("S")].stateValues
                    .label,
            ).eq(SLabel);
            expect(
                stateVariables[await resolvePathToNodeIdx("S")].stateValues
                    .labelHasLatex,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("labelSPar")]
                    .stateValues.text,
            ).eq(`Label for S: ${SLabelText}`);
        }

        let Px = 1;
        let Py = 2;
        let Qx = 3;
        let Qy = 4;
        let Rx = 5;
        let Ry = 6;
        let Sx = 7;
        let Sy = 8;
        await check_items({ Px, Py, Qx, Qy, Rx, Ry, Sx, Sy });

        // move points
        Px = Math.PI;
        Py = Math.E;
        Qx = Math.sqrt(2);
        Qy = 1 / 3;
        Rx = 1 / 6;
        Ry = 2 / 3;
        Sx = 1 / 8;
        Sy = 9 / 8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: Px,
            y: Py,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("Q"),
            x: Qx,
            y: Qy,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("R"),
            x: Rx,
            y: Ry,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("S"),
            x: Sx,
            y: Sy,
            core,
        });
        await check_items({ Px, Py, Qx, Qy, Rx, Ry, Sx, Sy });
    });

    it("copy point and override label", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P" displayDecimals="1" padZeros>
        (1,2)
        <label>We have <m>x^{$P.x} + y^{$P.y}</m></label>
      </point>
    </graph>
    <graph>
      <point name="Q" displayDigits="3" padZeros extend="$P">
        <label>No latex: x^<text>$Q.x</text> + y^<text>$Q.y</text></label>
      </point>
    </graph>

    <p name="labelPPar">Label for P: $P.label</p>
    <p name="labelQPar">Label for Q: $Q.label</p>
    `,
        });

        async function check_items(x: number, y: number) {
            let PxLatex = me
                .round_numbers_to_precision_plus_decimals(x, -Infinity, 1)
                .toLatex({ padToDecimals: 1 });
            let PyLatex = me
                .round_numbers_to_precision_plus_decimals(y, -Infinity, 1)
                .toLatex({ padToDecimals: 1 });

            let QxLatex = me
                .round_numbers_to_precision_plus_decimals(x, 3, 0)
                .toLatex({ padToDigits: 3 });
            let QyLatex = me
                .round_numbers_to_precision_plus_decimals(y, 3, 0)
                .toLatex({ padToDigits: 3 });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let PLabel = `We have \\(x^{ ${PxLatex} } + y^{ ${PyLatex} }\\)`;
            let PLabelText = `We have ${latexToText(`x^{ ${PxLatex} } + y^{ ${PyLatex} }`)}`;
            expect(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .label,
            ).eq(PLabel);
            expect(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .labelHasLatex,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("labelPPar")]
                    .stateValues.text,
            ).eq(`Label for P: ${PLabelText}`);

            let QLabel = `No latex: x^${QxLatex} + y^${QyLatex}`;
            expect(
                stateVariables[await resolvePathToNodeIdx("Q")].stateValues
                    .label,
            ).eq(QLabel);
            expect(
                stateVariables[await resolvePathToNodeIdx("Q")].stateValues
                    .labelHasLatex,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("labelQPar")]
                    .stateValues.text,
            ).eq(`Label for Q: ${QLabel}`);
        }

        let x = 1,
            y = 2;
        await check_items(x, y);

        // move point

        x = Math.PI;
        y = Math.E;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x,
            y,
            core,
        });
        await check_items(x, y);
    });

    it("update labels", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="P1">
        (1,2)
        <label>P1</label>
      </point>
      <point name="P2">
        (3,4)
        <label><text>P2</text></label>
      </point>
      <point name="P3">
        (5,6)
        <label><math>P/3</math></label>
      </point>
      <point name="P4">
        (7,8)
        <label><m>\\frac{P}{4}</m></label>
      </point>
    </graph>

    <p>Change label 1: <textInput bindValueTo="$P1.label" name="ti1" /></p>
    <p><updateValue target="$P1.label" newValue="P1" type="text" name="revert1" >
      <label>Revert value 1</label>
    </updateValue></p>
    <p>The label 1: <label extend="$P1.label" name="theLabel1" /></p>

    <p>Change label 2: <textInput bindValueTo="$P2.label" name="ti2" /></p>
    <p><updateValue target="$P2.label" newValue="P2" type="text" name="revert2" >
      <label>Revert value 2</label>
    </updateValue></p>
    <p>The label 2: <label extend="$P2.label" name="theLabel2" /></p>

    <p>Change label 3: <textInput bindValueTo="$(P3.label)" name="ti3" /></p>
    <p><updateValue target="$P3.label" newValue="\\frac{P}{3}" type="text" name="revert3" >
      <label>Revert value 3</label>
    </updateValue></p>
    <p>The label 3: <label extend="$P3.label" name="theLabel3" /></p>
    

    <p>Change label 4: <textInput bindValueTo="$(P4.label)" name="ti4" /></p>
    <p><updateValue target="$P4.label" newValue="\\frac{P}{4}" type="text" name="revert4" >
      <label>Revert value 4</label>
    </updateValue></p>
    <p>The label 4: <label extend="$P4.label" name="theLabel4" /></p>
    
    `,
        });

        async function check_items(
            P1: string,
            P2: string,
            P3: string,
            P4: string,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("P1")].stateValues
                    .label,
            ).eq(P1);
            expect(
                stateVariables[await resolvePathToNodeIdx("P1")].stateValues
                    .labelHasLatex,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel1")]
                    .stateValues.value,
            ).eq(P1);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel1")]
                    .stateValues.text,
            ).eq(P1);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel1")]
                    .stateValues.latex,
            ).eq(P1);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel1")]
                    .stateValues.hasLatex,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("ti1")].stateValues
                    .value,
            ).eq(P1);

            expect(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .label,
            ).eq(P2);
            expect(
                stateVariables[await resolvePathToNodeIdx("P2")].stateValues
                    .labelHasLatex,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel2")]
                    .stateValues.value,
            ).eq(P2);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel2")]
                    .stateValues.text,
            ).eq(P2);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel2")]
                    .stateValues.latex,
            ).eq(P2);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel2")]
                    .stateValues.hasLatex,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("ti2")].stateValues
                    .value,
            ).eq(P2);

            const P3Text = latexToText(P3);
            expect(
                stateVariables[await resolvePathToNodeIdx("P3")].stateValues
                    .label,
            ).eq(`\\(${P3}\\)`);
            expect(
                stateVariables[await resolvePathToNodeIdx("P3")].stateValues
                    .labelHasLatex,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel3")]
                    .stateValues.value,
            ).eq(`\\(${P3}\\)`);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel3")]
                    .stateValues.text,
            ).eq(P3Text);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel3")]
                    .stateValues.latex,
            ).eq(P3);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel3")]
                    .stateValues.hasLatex,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("ti3")].stateValues
                    .value,
            ).eq(P3Text);

            const P4Text = latexToText(P4);
            expect(
                stateVariables[await resolvePathToNodeIdx("P4")].stateValues
                    .label,
            ).eq(`\\(${P4}\\)`);
            expect(
                stateVariables[await resolvePathToNodeIdx("P4")].stateValues
                    .labelHasLatex,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel4")]
                    .stateValues.value,
            ).eq(`\\(${P4}\\)`);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel4")]
                    .stateValues.text,
            ).eq(P4Text);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel4")]
                    .stateValues.latex,
            ).eq(P4);
            expect(
                stateVariables[await resolvePathToNodeIdx("theLabel4")]
                    .stateValues.hasLatex,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("ti4")].stateValues
                    .value,
            ).eq(P4Text);
        }

        await check_items("P1", "P2", "\\frac{P}{3}", "\\frac{P}{4}");

        // Change label via text inputs
        await updateTextInputValue({
            text: "Q1",
            componentIdx: await resolvePathToNodeIdx("ti1"),
            core,
        });
        await updateTextInputValue({
            text: "Q2",
            componentIdx: await resolvePathToNodeIdx("ti2"),
            core,
        });
        await updateTextInputValue({
            text: "\\frac{Q}{3}",
            componentIdx: await resolvePathToNodeIdx("ti3"),
            core,
        });
        await updateTextInputValue({
            text: "\\frac{Q}{4}",
            componentIdx: await resolvePathToNodeIdx("ti4"),
            core,
        });
        await check_items("Q1", "Q2", "\\frac{Q}{3}", "\\frac{Q}{4}");

        // Revert label
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("revert1"),
            core,
        });
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("revert2"),
            core,
        });
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("revert3"),
            core,
        });
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("revert4"),
            core,
        });
        await check_items("P1", "P2", "\\frac{P}{3}", "\\frac{P}{4}");

        // Cannot switch to latex, unneeded delimiters ignored
        await updateTextInputValue({
            text: "\\(\\frac{Q}{1}\\)",
            componentIdx: await resolvePathToNodeIdx("ti1"),
            core,
        });
        await updateTextInputValue({
            text: "\\(\\frac{Q}{2}\\)",
            componentIdx: await resolvePathToNodeIdx("ti2"),
            core,
        });
        await updateTextInputValue({
            text: "\\(\\frac{Q}{3}\\)",
            componentIdx: await resolvePathToNodeIdx("ti3"),
            core,
        });
        await updateTextInputValue({
            text: "\\(\\frac{Q}{4}\\)",
            componentIdx: await resolvePathToNodeIdx("ti4"),
            core,
        });

        await check_items(
            "\\(\\frac{Q}{1}\\)",
            "\\(\\frac{Q}{2}\\)",
            "\\frac{Q}{3}",
            "\\frac{Q}{4}",
        );
    });
});
