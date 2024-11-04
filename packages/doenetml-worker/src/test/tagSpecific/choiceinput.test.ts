import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";
import Core from "../../Core";
import { V } from "vitest/dist/chunks/reporters.WnPwkmgA.js";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("ChoiceInput tag tests", async () => {
    async function test_animal_choice_input(
        core: Core,
        inline: boolean,
        shuffleOrder: boolean,
    ) {
        let originalChoices = ["cat", "dog", "monkey", "mouse"];
        const stateVariables = await returnAllStateVariables(core);
        const choiceTexts: string[] =
            stateVariables["/ci"].stateValues.choiceTexts;

        if (!shuffleOrder) {
            expect(choiceTexts).eqls(originalChoices);
        }
        expect([...choiceTexts].sort()).eqls(originalChoices);

        expect(stateVariables["/ci"].stateValues.inline).eq(inline);
        expect(stateVariables["/ci"].stateValues.shuffleOrder).eq(shuffleOrder);

        async function check_items(
            selectedIndex?: number,
            selectedValue?: string,
        ) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected value: ${selectedValue ?? ""}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected index: ${selectedIndex ?? ""}`,
            );
            expect(stateVariables["/pCat"].stateValues.text).eq(
                `Selected cat: ${selectedValue === "cat"}`,
            );
            expect(stateVariables["/pDog"].stateValues.text).eq(
                `Selected dog: ${selectedValue === "dog"}`,
            );
            expect(stateVariables["/pMonkey"].stateValues.text).eq(
                `Selected monkey: ${selectedValue === "monkey"}`,
            );
            expect(stateVariables["/pMouse"].stateValues.text).eq(
                `Selected mouse: ${selectedValue === "mouse"}`,
            );

            expect(stateVariables["/ci"].stateValues.selectedValues).eqls(
                selectedValue ? [selectedValue] : [],
            );
            expect(stateVariables["/ci"].stateValues.selectedIndices).eqls(
                selectedIndex ? [selectedIndex] : [],
            );
            expect(stateVariables["/choice1"].stateValues.selected).eq(
                selectedValue === "cat",
            );
            expect(stateVariables["/choice2"].stateValues.selected).eq(
                selectedValue === "dog",
            );
            expect(stateVariables["/choice3"].stateValues.selected).eq(
                selectedValue === "monkey",
            );
            expect(stateVariables["/choice4"].stateValues.selected).eq(
                selectedValue === "mouse",
            );
        }

        await check_items();

        // select options in order

        for (let i = 0; i < 4; i++) {
            let selectedValue = originalChoices[i];
            let selectedIndex = choiceTexts.indexOf(selectedValue) + 1;
            await updateSelectedIndices({
                name: "/ci",
                selectedIndices: [selectedIndex],
                core,
            });
            await check_items(selectedIndex, selectedValue);
        }
    }

    it("default is block format, not shuffled", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput name="ci">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3">monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="psv">Selected value: $ci.selectedValue</p>
    <p name="psi">Selected index: $ci.selectedIndex</p>

    <p name="pCat">Selected cat: $choice1.selected</p>
    <p name="pDog">Selected dog: $choice2.selected</p>
    <p name="pMonkey">Selected monkey: $choice3.selected</p>
    <p name="pMouse">Selected mouse: $choice4.selected</p>
    `,
            requestedVariantIndex: 8,
        });

        await test_animal_choice_input(core, false, false);
    });

    it("shuffleOrder", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput shuffleOrder name="ci">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3">monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="psv">Selected value: $ci.selectedValue</p>
    <p name="psi">Selected index: $ci.selectedIndex</p>

    <p name="pCat">Selected cat: $choice1.selected</p>
    <p name="pDog">Selected dog: $choice2.selected</p>
    <p name="pMonkey">Selected monkey: $choice3.selected</p>
    <p name="pMouse">Selected mouse: $choice4.selected</p>
    `,
            requestedVariantIndex: 8,
        });

        await test_animal_choice_input(core, false, true);
    });

    it("inline", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput inline name="ci">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3">monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="psv">Selected value: $ci.selectedValue</p>
    <p name="psi">Selected index: $ci.selectedIndex</p>

    <p name="pCat">Selected cat: $choice1.selected</p>
    <p name="pDog">Selected dog: $choice2.selected</p>
    <p name="pMonkey">Selected monkey: $choice3.selected</p>
    <p name="pMouse">Selected mouse: $choice4.selected</p>
    `,
            requestedVariantIndex: 8,
        });

        await test_animal_choice_input(core, true, false);
    });

    it("inline, shuffle order", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput inline shuffleOrder name="ci">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3">monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="psv">Selected value: $ci.selectedValue</p>
    <p name="psi">Selected index: $ci.selectedIndex</p>

    <p name="pCat">Selected cat: $choice1.selected</p>
    <p name="pDog">Selected dog: $choice2.selected</p>
    <p name="pMonkey">Selected monkey: $choice3.selected</p>
    <p name="pMouse">Selected mouse: $choice4.selected</p>
    `,
            requestedVariantIndex: 8,
        });

        await test_animal_choice_input(core, true, true);
    });

    it("choiceInput references", async () => {
        let core = await createTestCore({
            doenetML: `
      <choiceInput inline shuffleOrder name="ci1">
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
        <choice>d</choice>
        <choice>e</choice>
        <choice>f</choice>
      </choiceInput>
      <choiceInput copySource="ci1" name="ci2" />
      <choiceInput inline="false" copySource="ci1" name="ci3" />
      <choiceInput inline="false" copySource="ci2" name="ci4" />
  
      <p name="psv">Selected values: <asList>
      $ci1.selectedValue
      $ci2.selectedValue
      $ci3.selectedValue
      $ci4.selectedValue
      </asList></p>
      <p name="psi">Selected indices: <asList>
      $ci1.selectedIndex
      $ci2.selectedIndex
      $ci3.selectedIndex
      $ci4.selectedIndex
      </asList></p>

    `,
        });

        let originalChoices = ["a", "b", "c", "d", "e", "f"];

        const stateVariables = await returnAllStateVariables(core);
        const choiceTexts: string[][] = [
            stateVariables["/ci1"].stateValues.choiceTexts,
            stateVariables["/ci2"].stateValues.choiceTexts,
            stateVariables["/ci3"].stateValues.choiceTexts,
            stateVariables["/ci4"].stateValues.choiceTexts,
        ];

        expect([...choiceTexts[0]].sort()).eqls(originalChoices);

        for (let i = 1; i < 4; i++) {
            expect(choiceTexts[i]).eqls(choiceTexts[0]);
        }

        expect(stateVariables["/ci1"].stateValues.inline).eq(true);
        expect(stateVariables["/ci2"].stateValues.inline).eq(true);
        expect(stateVariables["/ci3"].stateValues.inline).eq(false);
        expect(stateVariables["/ci4"].stateValues.inline).eq(false);
        expect(stateVariables["/ci1"].stateValues.shuffleOrder).eq(true);
        expect(stateVariables["/ci2"].stateValues.shuffleOrder).eq(true);
        expect(stateVariables["/ci3"].stateValues.shuffleOrder).eq(true);
        expect(stateVariables["/ci4"].stateValues.shuffleOrder).eq(true);

        async function check_items(
            selectedIndex?: number,
            selectedValue?: string,
        ) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected values: ${selectedValue ? Array(4).fill(selectedValue).join(", ") : ""}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected indices: ${selectedIndex ? Array(4).fill(selectedIndex).join(", ") : ""}`,
            );

            for (let i = 1; i <= 4; i++) {
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedValues,
                ).eqls(selectedValue ? [selectedValue] : []);
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedIndices,
                ).eqls(selectedIndex ? [selectedIndex] : []);
            }
        }

        await check_items();

        // select options in order from each input in turn

        for (let inputInd = 0; inputInd < 4; inputInd++) {
            for (let choiceInd = 0; choiceInd < 6; choiceInd++) {
                let selectedValue = originalChoices[choiceInd];
                let selectedIndex =
                    choiceTexts[inputInd].indexOf(selectedValue) + 1;
                await updateSelectedIndices({
                    name: `/ci${inputInd + 1}`,
                    selectedIndices: [selectedIndex],
                    core,
                });
                await check_items(selectedIndex, selectedValue);
            }
        }
    });

    it("math inside choices", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput shuffleOrder name="ci1">
      <choice>The function is <m>f(\\xi)=\\sin(\\xi)</m>.</choice>
      <choice>The sum of <math name="lambda2">lambda^2</math> and <math name="twice">2 lambda^2</math> is <math simplify>$lambda2+$twice</math>.</choice>
      <choice>The sequence is <sequence from="1" to="5" />.</choice>
      <choice>Can't convert this latex: <m>\\bar{x}^i</m>.</choice>
    </choiceInput>

    <choiceInput inline copySource="ci1" name="ci2" />

    <p name="psv">Selected values: <asList>
    $ci1.selectedValue
    $ci2.selectedValue
    </asList></p>
    <p name="psi">Selected indices: <asList>
    $ci1.selectedIndex
    $ci2.selectedIndex
    </asList></p>

    `,
        });

        let originalChoices = [
            "The function is f(ξ) = sin(ξ).",
            "The sum of λ² and 2 λ² is 3 λ².",
            "The sequence is 1, 2, 3, 4, 5.",
            "Can't convert this latex: \\bar{x}^i.",
        ];

        const stateVariables = await returnAllStateVariables(core);
        const choiceTexts: string[][] = [
            stateVariables["/ci1"].stateValues.choiceTexts,
            stateVariables["/ci2"].stateValues.choiceTexts,
        ];

        expect([...choiceTexts[0]].sort()).eqls([...originalChoices].sort());
        expect(choiceTexts[1]).eqls(choiceTexts[0]);

        expect(stateVariables["/ci1"].stateValues.inline).eq(false);
        expect(stateVariables["/ci2"].stateValues.inline).eq(true);
        expect(stateVariables["/ci1"].stateValues.shuffleOrder).eq(true);
        expect(stateVariables["/ci2"].stateValues.shuffleOrder).eq(true);

        async function check_items(
            selectedIndex?: number,
            selectedValue?: string,
        ) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected values: ${selectedValue ? Array(2).fill(selectedValue).join(", ") : ""}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected indices: ${selectedIndex ? Array(2).fill(selectedIndex).join(", ") : ""}`,
            );

            for (let i = 1; i <= 2; i++) {
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedValues,
                ).eqls(selectedValue ? [selectedValue] : []);
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedIndices,
                ).eqls(selectedIndex ? [selectedIndex] : []);
            }
        }

        await check_items();

        // select options in order from each input in turn

        for (let inputInd = 0; inputInd < 2; inputInd++) {
            for (let choiceInd = 0; choiceInd < 4; choiceInd++) {
                let selectedValue = originalChoices[choiceInd];
                let selectedIndex =
                    choiceTexts[inputInd].indexOf(selectedValue) + 1;
                await updateSelectedIndices({
                    name: `/ci${inputInd + 1}`,
                    selectedIndices: [selectedIndex],
                    core,
                });
                await check_items(selectedIndex, selectedValue);
            }
        }
    });

    it("bind value to textInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput bindValueTo="$ti" shuffleOrder name="ci1">
      <choice>caT</choice>
      <choice>  dog </choice>
      <choice><text>Monkey</text></choice>
    </choiceInput>

    <p>Select by typing: <textInput name="ti" prefill="monkey" /></p>

    <choiceInput inline copySource="ci1" name="ci2" />

    <p name="psv">Selected values: <asList>
    $ci1.selectedValue
    $ci2.selectedValue
    </asList></p>
    <p name="psi">Selected indices: <asList>
    $ci1.selectedIndex
    $ci2.selectedIndex
    </asList></p>

    `,
        });

        let originalChoices = ["caT", "  dog ", "Monkey"];

        const stateVariables = await returnAllStateVariables(core);
        const choiceTexts: string[][] = [
            stateVariables["/ci1"].stateValues.choiceTexts,
            stateVariables["/ci2"].stateValues.choiceTexts,
        ];

        expect([...choiceTexts[0]].sort()).eqls([...originalChoices].sort());
        expect(choiceTexts[1]).eqls(choiceTexts[0]);

        expect(stateVariables["/ci1"].stateValues.inline).eq(false);
        expect(stateVariables["/ci2"].stateValues.inline).eq(true);
        expect(stateVariables["/ci1"].stateValues.shuffleOrder).eq(true);
        expect(stateVariables["/ci2"].stateValues.shuffleOrder).eq(true);

        async function check_items(
            selectedIndex: number | null,
            selectedValue: string | null,
            inputText: string,
        ) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected values: ${selectedValue ? Array(2).fill(selectedValue).join(", ") : ""}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected indices: ${selectedIndex ? Array(2).fill(selectedIndex).join(", ") : ""}`,
            );

            for (let i = 1; i <= 2; i++) {
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedValues,
                ).eqls(selectedValue ? [selectedValue] : []);
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedIndices,
                ).eqls(selectedIndex ? [selectedIndex] : []);
            }

            expect(stateVariables["/ti"].stateValues.value).eq(inputText);
        }

        let selectedValue: string | null = "Monkey";
        let selectedIndex: number | null =
            choiceTexts[0].indexOf(selectedValue) + 1;
        let inputText = "monkey";

        await check_items(selectedIndex, selectedValue, inputText);

        // select cat from first input
        selectedValue = "caT";
        selectedIndex = choiceTexts[0].indexOf(selectedValue) + 1;
        await updateSelectedIndices({
            name: `/ci1`,
            selectedIndices: [selectedIndex],
            core,
        });

        inputText = selectedValue;
        await check_items(selectedIndex, selectedValue, inputText);

        // Type Dog
        selectedValue = "  dog ";
        selectedIndex = choiceTexts[0].indexOf(selectedValue) + 1;
        inputText = "Dog";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        await check_items(selectedIndex, selectedValue, inputText);

        // select monkey from second input
        selectedValue = "Monkey";
        selectedIndex = choiceTexts[0].indexOf(selectedValue) + 1;
        inputText = selectedValue;
        await updateSelectedIndices({
            name: `/ci2`,
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items(selectedIndex, selectedValue, inputText);

        // type no cat
        selectedValue = null;
        selectedIndex = null;
        inputText = "no cat";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        await check_items(selectedIndex, selectedValue, inputText);

        // select cat from second input
        selectedValue = "caT";
        selectedIndex = choiceTexts[0].indexOf(selectedValue) + 1;
        inputText = selectedValue;
        await updateSelectedIndices({
            name: `/ci2`,
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items(selectedIndex, selectedValue, inputText);

        // type no dog
        selectedValue = null;
        selectedIndex = null;
        inputText = "no dog";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        await check_items(selectedIndex, selectedValue, inputText);

        // select dog from first input
        selectedValue = "  dog ";
        selectedIndex = choiceTexts[0].indexOf(selectedValue) + 1;
        inputText = selectedValue;
        await updateSelectedIndices({
            name: `/ci1`,
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items(selectedIndex, selectedValue, inputText);

        // type no monkey
        selectedValue = null;
        selectedIndex = null;
        inputText = "no monkey";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        await check_items(selectedIndex, selectedValue, inputText);

        // type   monKey
        selectedValue = "Monkey";
        inputText = "  monKey   ";
        selectedIndex = choiceTexts[0].indexOf(selectedValue) + 1;
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        await check_items(selectedIndex, selectedValue, inputText);
    });

    it("bind value to textInput, select multiple", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput bindValueTo="$ti" shuffleOrder selectMultiple name="ci1">
      <choice><text>caT</text></choice>
      <choice>  dog </choice>
      <choice>Monkey</choice>
    </choiceInput>

    <p>Select by typing: <textInput name="ti" prefill="monkey" /></p>

    <choiceInput inline copySource="ci1" name="ci2" />

    <p name="psv">Selected values: <asList>
    $ci1.selectedValues
    $ci2.selectedValues
    </asList></p>
    <p name="psi">Selected indices: <asList>
    $ci1.selectedIndices
    $ci2.selectedIndices
    </asList></p>

    `,
            requestedVariantIndex: 1,
        });

        // TODO: determine why the on change handler of ci2
        // is not invoked when selecting monkey, dog for these variants
        // bad variants: 3 (dog, cat, monkey), 4 (dog, monkey, cat)

        let originalChoices = ["caT", "  dog ", "Monkey"];

        const stateVariables = await returnAllStateVariables(core);
        const choiceTexts: string[][] = [
            stateVariables["/ci1"].stateValues.choiceTexts,
            stateVariables["/ci2"].stateValues.choiceTexts,
        ];

        expect([...choiceTexts[0]].sort()).eqls([...originalChoices].sort());
        expect(choiceTexts[1]).eqls(choiceTexts[0]);

        expect(stateVariables["/ci1"].stateValues.inline).eq(false);
        expect(stateVariables["/ci2"].stateValues.inline).eq(true);
        expect(stateVariables["/ci1"].stateValues.shuffleOrder).eq(true);
        expect(stateVariables["/ci2"].stateValues.shuffleOrder).eq(true);

        async function check_items(
            selectedIndices: number[],
            selectedValues: string[],
            inputText: string,
        ) {
            let selectedValuesString = [
                ...selectedValues,
                ...selectedValues,
            ].join(", ");
            let selectedIndicesString = [
                ...selectedIndices,
                ...selectedIndices,
            ].join(", ");

            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected values: ${selectedValuesString}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected indices: ${selectedIndicesString}`,
            );

            for (let i = 1; i <= 2; i++) {
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedValues,
                ).eqls(selectedValues);
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedIndices,
                ).eqls(selectedIndices);
            }

            expect(stateVariables["/ti"].stateValues.value).eq(inputText);
        }

        let selectedValues = ["Monkey"];
        let selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        let inputText = "monkey";

        await check_items(selectedIndices, selectedValues, inputText);

        // select cat from first input
        selectedValues = ["caT", "Monkey"];
        selectedValues.sort(
            (a, b) => choiceTexts[0].indexOf(a) - choiceTexts[0].indexOf(b),
        );
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        inputText = selectedValues.join(", ");
        await updateSelectedIndices({ name: "/ci1", selectedIndices, core });
        await check_items(selectedIndices, selectedValues, inputText);

        // Type Dog
        selectedValues = ["  dog "];
        inputText = "Dog";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        await check_items(selectedIndices, selectedValues, inputText);

        // Type cat  ,DOG
        selectedValues = ["  dog ", "caT"];
        selectedValues.sort(
            (a, b) => choiceTexts[0].indexOf(a) - choiceTexts[0].indexOf(b),
        );
        inputText = "cat   ,DOG";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        await check_items(selectedIndices, selectedValues, inputText);

        // TODO: for
        // bad variants: 3 (dog, cat, monkey), 4 (dog, monkey, cat)
        // this selection is not triggering the on-change handler
        // select monkey, dog from second input
        selectedValues = ["  dog ", "Monkey"].sort(
            (a, b) => choiceTexts[0].indexOf(a) - choiceTexts[0].indexOf(b),
        );
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        inputText = selectedValues.join(", ");
        await updateSelectedIndices({ name: "/ci2", selectedIndices, core });
        await check_items(selectedIndices, selectedValues, inputText);

        // type no cat
        selectedValues = [];
        inputText = "no cat";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        await check_items(selectedIndices, selectedValues, inputText);

        // type cat, no dog
        selectedValues = ["caT"];
        inputText = "cat, no dog";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        await check_items(selectedIndices, selectedValues, inputText);

        // type dog, no monkey,   CAT
        selectedValues = ["  dog ", "caT"].sort(
            (a, b) => choiceTexts[0].indexOf(a) - choiceTexts[0].indexOf(b),
        );
        inputText = "dog, no monkey,   CAT   ";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        await check_items(selectedIndices, selectedValues, inputText);

        // select all from second input
        selectedValues = ["Monkey", "  dog ", "caT"].sort(
            (a, b) => choiceTexts[0].indexOf(a) - choiceTexts[0].indexOf(b),
        );
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        inputText = selectedValues.join(", ");
        await updateSelectedIndices({ name: "/ci2", selectedIndices, core });
        await check_items(selectedIndices, selectedValues, inputText);

        // type no dog at end
        inputText += ", no dog";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        await check_items(selectedIndices, selectedValues, inputText);

        // type dog,  DOG
        selectedValues = ["  dog "];
        inputText = "dog,  DOG";
        await updateTextInputValue({ text: inputText, name: "/ti", core });
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        await check_items(selectedIndices, selectedValues, inputText);

        // select cat from first input
        selectedValues = ["  dog ", "caT"].sort(
            (a, b) => choiceTexts[0].indexOf(a) - choiceTexts[0].indexOf(b),
        );
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        inputText = selectedValues.join(", ");
        await updateSelectedIndices({ name: "/ci2", selectedIndices, core });
        await check_items(selectedIndices, selectedValues, inputText);

        // deselect dog from first input
        selectedValues = ["caT"];
        selectedIndices = selectedValues.map(
            (v) => choiceTexts[0].indexOf(v) + 1,
        );
        inputText = selectedValues.join(", ");
        await updateSelectedIndices({ name: "/ci1", selectedIndices, core });
        await check_items(selectedIndices, selectedValues, inputText);
    });

    it("bind value to fixed text, choiceInput reverts to fixed value", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput bindValueTo="$alwaysMonkey" name="ci1">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
    </choiceInput>

    <p>Fixed to be: <text name="alwaysMonkey" fixed>monkey</text></p>

    <choiceInput inline copySource="ci1" name="ci2" />

    <p name="psv">Selected values: <asList>
    $ci1.selectedValue
    $ci2.selectedValue
    </asList></p>
    <p name="psi">Selected indices: <asList>
    $ci1.selectedIndex
    $ci2.selectedIndex
    </asList></p>

    `,
        });

        async function check_still_monkey() {
            let selectedIndex = 3;
            let selectedValue = "monkey";

            let selectedValuesString = [selectedValue, selectedValue].join(
                ", ",
            );
            let selectedIndicesString = [selectedIndex, selectedIndex].join(
                ", ",
            );

            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected values: ${selectedValuesString}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected indices: ${selectedIndicesString}`,
            );

            for (let i = 1; i <= 2; i++) {
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedValues,
                ).eqls([selectedValue]);
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedIndices,
                ).eqls([selectedIndex]);
            }
        }

        await check_still_monkey();

        await updateSelectedIndices({
            name: "/ci1",
            selectedIndices: [1],
            core,
        });
        await check_still_monkey();

        await updateSelectedIndices({
            name: "/ci1",
            selectedIndices: [2],
            core,
        });
        await check_still_monkey();

        await updateSelectedIndices({
            name: "/ci2",
            selectedIndices: [1],
            core,
        });
        await check_still_monkey();

        await updateSelectedIndices({
            name: "/ci2",
            selectedIndices: [2],
            core,
        });
        await check_still_monkey();
    });

    it("bind value to mathInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput bindValueTo="$mi" name="ci1">
      <choice><math>x^2/2</math></choice>
      <choice><m>y</m></choice>
      <choice><math format="latex">\\frac{\\partial f}{\\partial x}</math></choice>
      <choice>3</choice>
      <choice><text>1/(e^x)</text></choice>
    </choiceInput>
    
    <p>Select by typing: <mathInput name="mi" prefill="y" /></p>

    <choiceInput inline copySource="ci1" name="ci2" />

    <p name="psv">Selected values: <asList>
    $ci1.selectedValue
    $ci2.selectedValue
    </asList></p>
    <p name="psi">Selected indices: <asList>
    $ci1.selectedIndex
    $ci2.selectedIndex
    </asList></p>

    `,
        });

        let originalChoices = ["(x²)/2", "y", "∂f/∂x", "3", "1/(e^x)"];

        const stateVariables = await returnAllStateVariables(core);
        const choiceTexts: string[][] = [
            stateVariables["/ci1"].stateValues.choiceTexts,
            stateVariables["/ci2"].stateValues.choiceTexts,
        ];

        expect(choiceTexts[0]).eqls(originalChoices);
        expect(choiceTexts[1]).eqls(originalChoices);

        expect(stateVariables["/ci1"].stateValues.inline).eq(false);
        expect(stateVariables["/ci2"].stateValues.inline).eq(true);
        expect(stateVariables["/ci1"].stateValues.shuffleOrder).eq(false);
        expect(stateVariables["/ci2"].stateValues.shuffleOrder).eq(false);

        async function check_items(
            selectedIndex: number | null,
            selectedValue: string | null,
            inputMath: any,
        ) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected values: ${selectedValue ? Array(2).fill(selectedValue).join(", ") : ""}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected indices: ${selectedIndex ? Array(2).fill(selectedIndex).join(", ") : ""}`,
            );

            for (let i = 1; i <= 2; i++) {
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedValues,
                ).eqls(selectedValue ? [selectedValue] : []);
                expect(
                    stateVariables[`/ci${i}`].stateValues.selectedIndices,
                ).eqls(selectedIndex ? [selectedIndex] : []);
            }

            expect(stateVariables["/mi"].stateValues.value.tree).eqls(
                inputMath,
            );
        }

        let selectedValue: string | null = "y";
        let selectedIndex: number | null =
            choiceTexts[0].indexOf(selectedValue) + 1;
        let inputMath: any = "y";

        await check_items(selectedIndex, selectedValue, inputMath);

        // select x^2/2 from first input
        selectedIndex = 1;
        selectedValue = originalChoices[selectedIndex - 1];
        inputMath = ["/", ["^", "x", 2], 2];
        await updateSelectedIndices({
            name: "/ci1",
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items(selectedIndex, selectedValue, inputMath);

        // Type 3
        selectedIndex = 4;
        selectedValue = originalChoices[selectedIndex - 1];
        inputMath = 3;
        await updateMathInputValue({ latex: "3", name: "/mi", core });
        await check_items(selectedIndex, selectedValue, inputMath);

        // select ∂f/∂x from second input
        selectedIndex = 3;
        selectedValue = originalChoices[selectedIndex - 1];
        inputMath = ["partial_derivative_leibniz", "f", ["tuple", "x"]];
        await updateSelectedIndices({
            name: "/ci2",
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items(selectedIndex, selectedValue, inputMath);

        // type e^{-x}
        selectedIndex = null;
        selectedValue = null;
        inputMath = ["^", "e", ["-", "x"]];
        await updateMathInputValue({ latex: "e^{-x}", name: "/mi", core });
        await check_items(selectedIndex, selectedValue, inputMath);

        // type 1/e^{x}
        selectedIndex = 5;
        selectedValue = originalChoices[selectedIndex - 1];
        inputMath = ["/", 1, ["^", "e", "x"]];
        await updateMathInputValue({ latex: "1/e^x", name: "/mi", core });
        await check_items(selectedIndex, selectedValue, inputMath);

        // select y from second input
        selectedIndex = 2;
        selectedValue = originalChoices[selectedIndex - 1];
        inputMath = "y";
        await updateSelectedIndices({
            name: "/ci2",
            selectedIndices: [selectedIndex],
            core,
        });
        await check_items(selectedIndex, selectedValue, inputMath);
    });

    it("preselect choices", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput name="c1" preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceInput>

    <choiceInput name="c2" inline shuffleOrder preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceInput>

    <choiceInput name="c3" inline>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceInput>


    <choiceInput name="c4" shuffleOrder>
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceInput>

    <choiceInput name="c5" inline>
      <choice>cat</choice>
      <choice preselect>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceInput>


    <choiceInput name="c6" shuffleOrder>
      <choice>cat</choice>
      <choice preselect>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceInput>


    <choiceInput name="c7" preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceInput>


    <choiceInput name="c8" shuffleOrder inline preselectChoice="2">
      <choice>cat</choice>
      <choice>dog</choice>
      <choice>monkey</choice>
      <choice preselect>mouse</choice>
      <choice>rabbit</choice>
      <choice>emu</choice>
      <choice>giraffe</choice>
      <choice>aardvark</choice>
    </choiceInput>


    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/c1"].stateValues.selectedIndices).eqls([2]);
        expect(stateVariables["/c2"].stateValues.selectedIndices).eqls([2]);
        expect(stateVariables["/c3"].stateValues.selectedValues).eqls([
            "mouse",
        ]);
        expect(stateVariables["/c4"].stateValues.selectedValues).eqls([
            "mouse",
        ]);
        expect(stateVariables["/c5"].stateValues.selectedValues).eqls(["dog"]);

        let dogInd6 =
            stateVariables["/c6"].stateValues.choiceTexts.indexOf("dog");
        let mouseInd6 =
            stateVariables["/c6"].stateValues.choiceTexts.indexOf("mouse");
        let selectedInd6 = Math.min(dogInd6, mouseInd6) + 1;
        expect(stateVariables["/c6"].stateValues.selectedIndices).eqls([
            selectedInd6,
        ]);
        expect(stateVariables["/c7"].stateValues.selectedValues).eqls([
            "mouse",
        ]);
        expect(stateVariables["/c8"].stateValues.selectedValues).eqls([
            "mouse",
        ]);
    });

    it("disabled choice", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput inline placeholder="Choose animal" name="ci">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3" disabled>monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    <p name="psv">Selected value: $ci.selectedValue</p>
    <p name="psi">Selected index: $ci.selectedIndex</p>

    `,
        });

        let originalChoices = ["cat", "dog", "monkey", "mouse"];

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci"].stateValues.choiceTexts).eqls(
            originalChoices,
        );

        async function check_items(selectedIndex?: number) {
            let selectedValue = selectedIndex
                ? originalChoices[selectedIndex - 1]
                : undefined;
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected value: ${selectedValue ?? ""}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected index: ${selectedIndex ?? ""}`,
            );

            expect(stateVariables[`/ci`].stateValues.selectedValues).eqls(
                selectedValue ? [selectedValue] : [],
            );
            expect(stateVariables[`/ci`].stateValues.selectedIndices).eqls(
                selectedIndex ? [selectedIndex] : [],
            );

            for (let i = 1; i <= 4; i++) {
                expect(stateVariables[`/choice${i}`].stateValues.selected).eq(
                    i === selectedIndex,
                );
            }
        }

        await check_items();

        // select options in order

        for (let i = 1; i <= 4; i++) {
            await updateSelectedIndices({
                name: "/ci",
                selectedIndices: [i],
                core,
            });

            if (i === 3) {
                await check_items();
            } else {
                await check_items(i);
            }
        }
    });

    it("select multiple", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput shuffleOrder selectMultiple name="ci">
      <choice name="choice1">cat</choice>
      <choice name="choice2">dog</choice>
      <choice name="choice3">monkey</choice>
      <choice name="choice4">mouse</choice>
    </choiceInput>

    
    <p name="psv">Selected values: $ci.selectedValues</p>
    <p name="psi">Selected indices: $ci.selectedIndices</p>
    `,
        });

        let originalChoices = ["cat", "dog", "monkey", "mouse"];

        let stateVariables = await returnAllStateVariables(core);
        let choiceTexts = stateVariables["/ci"].stateValues.choiceTexts;
        expect([...choiceTexts].sort()).eqls([...originalChoices].sort());

        async function check_items(selectedIndices: number[]) {
            let selectedValues = selectedIndices.map((v) => choiceTexts[v - 1]);
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected values: ${selectedValues.join(", ")}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected indices: ${selectedIndices.join(", ")}`,
            );

            expect(stateVariables[`/ci`].stateValues.selectedValues).eqls(
                selectedValues,
            );
            expect(stateVariables[`/ci`].stateValues.selectedIndices).eqls(
                selectedIndices,
            );

            for (let i = 1; i <= 4; i++) {
                expect(stateVariables[`/choice${i}`].stateValues.selected).eq(
                    selectedIndices.includes(i),
                );
            }
        }

        await check_items([]);

        // select options in order
        let selectedIndices: number[] = [];

        for (let i = 1; i <= 4; i++) {
            selectedIndices.push(i);
            await updateSelectedIndices({ name: "/ci", selectedIndices, core });

            await check_items(selectedIndices);
        }

        // deselect options in order

        while (selectedIndices.length > 0) {
            selectedIndices = selectedIndices.slice(1, selectedIndices.length);
            await updateSelectedIndices({ name: "/ci", selectedIndices, core });

            await check_items(selectedIndices);
        }
    });

    it("chain update off choiceInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput name="ci" >
      <choice>red</choice>
      <choice>orange</choice>
      <choice>yellow</choice>
      <choice>green</choice>
      <choice>blue</choice>
    </choiceInput>

    <text name="t"></text>
    <updateValue triggerWith="ci" target="t" newValue="$t $ci" type="text" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/t"].stateValues.value).eq("");

        await updateSelectedIndices({
            name: "/ci",
            selectedIndices: [2],
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/t"].stateValues.value).eq(" orange");

        await updateSelectedIndices({
            name: "/ci",
            selectedIndices: [5],
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/t"].stateValues.value).eq(" orange blue");

        await updateSelectedIndices({
            name: "/ci",
            selectedIndices: [1],
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/t"].stateValues.value).eq(" orange blue red");
    });

    // verify fixed bug where shuffle order was recalculated
    // causing a copy with no link to have a different shuffle order
    it("shuffleOrder is not recalculated when copy with no link", async () => {
        let core = await createTestCore({
            doenetML: `
    <variantControl uniqueVariants="false" />

    <group name="g" newNamespace>
      <choiceInput shuffleOrder name="ci">
        <choice>a</choice>
        <choice>b</choice>
        <choice>c</choice>
        <choice>d</choice>
        <choice>e</choice>
      </choiceInput>
    </group>
    
    $g{name="g2" link="false"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let choiceOrder = stateVariables["/g/ci"].stateValues.choiceOrder;
        let choiceOrder2 = stateVariables["/g2/ci"].stateValues.choiceOrder;

        expect(choiceOrder2).eqls(choiceOrder);
    });

    it("math choices", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput name="ci">
      <choice><math>x + x</math></choice>
      <choice><m>y+y</m></choice>
      <choice><me>z+z</me></choice>
      <choice><men>u+u</men></choice>
    </choiceInput>


    <p name="psv">Selected value: $ci.selectedValue</p>
    <p name="psi">Selected index: $ci.selectedIndex</p>
    <p name="psv2">Selected value: $ci</p>
    <p name="psvs">Selected value simplified: $ci{simplify}</p>



    `,
        });

        let choices = ["x", "y", "z", "u"].map((v) => `${v} + ${v}`);
        let choicesSimp = ["x", "y", "z", "u"].map((v) => `2 ${v}`);

        async function check_items(selectedIndex?: number) {
            let selectedValue = selectedIndex ? choices[selectedIndex - 1] : "";
            let selectedValueSimp = selectedIndex
                ? choicesSimp[selectedIndex - 1]
                : "";

            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected value: ${selectedValue}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected index: ${selectedIndex ?? ""}`,
            );
            expect(stateVariables["/psv2"].stateValues.text).eq(
                `Selected value: ${selectedValue}`,
            );
            expect(stateVariables["/psvs"].stateValues.text).eq(
                `Selected value simplified: ${selectedValueSimp}`,
            );
        }

        await check_items();

        for (let i = 1; i <= 4; i++) {
            await updateSelectedIndices({
                name: "/ci",
                selectedIndices: [i],
                core,
            });
            await check_items(i);
        }
    });

    it("consistent order for n elements for given variant", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>m: <mathInput prefill="1" name="m" /></p>
  <p>n: <mathInput prefill="6" name="n" /></p>
  <choiceInput name="ci" shuffleOrder>
    <map>
      <template>
        <choice>$v</choice>
      </template>
      <sources alias="v">
        <sequence from="$m" to="$n" />
      </sources>
    </map>
  </choiceInput>
  `,
            requestedVariantIndex: 1,
        });

        let orders = {};

        let m = 1,
            n = 6;

        let stateVariables = await returnAllStateVariables(core);
        let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

        expect([...choiceOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = choiceOrder;

        // switch n to 8

        await updateMathInputValue({ latex: "8", name: "/n", core });

        m = 1;
        n = 8;

        stateVariables = await returnAllStateVariables(core);
        choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

        expect([...choiceOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = choiceOrder;

        // get another list of length 6 by setting m to 3

        await updateMathInputValue({ latex: "3", name: "/m", core });

        m = 3;
        n = 8;

        stateVariables = await returnAllStateVariables(core);
        choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

        expect(choiceOrder).eqls(orders[`1,6`]);

        orders[`${m},${n}`] = choiceOrder;

        // get another list of length 8 by setting n to 10

        await updateMathInputValue({ latex: "10", name: "/n", core });

        m = 3;
        n = 10;

        stateVariables = await returnAllStateVariables(core);
        choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

        expect(choiceOrder).eqls(orders[`1,8`]);

        orders[`${m},${n}`] = choiceOrder;

        // values change with another variant

        core = await createTestCore({
            doenetML: `
  <p>m: <mathInput prefill="1" name="m" /></p>
  <p>n: <mathInput prefill="6" name="n" /></p>
  <choiceInput name="ci" shuffleOrder>
    <map>
      <template>
        <choice>$v</choice>
      </template>
      <sources alias="v">
        <sequence from="$m" to="$n" />
      </sources>
    </map>
  </choiceInput>
  `,
            requestedVariantIndex: 2,
        });

        m = 1;
        n = 6;

        stateVariables = await returnAllStateVariables(core);
        choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

        expect(choiceOrder).not.eqls(orders[`${m},${n}`]);

        expect([...choiceOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = choiceOrder;

        // switch n to 8

        await updateMathInputValue({ latex: "8", name: "/n", core });

        m = 1;
        n = 8;

        stateVariables = await returnAllStateVariables(core);
        choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;
        expect(choiceOrder).not.eqls(orders[`${m},${n}`]);

        expect([...choiceOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = choiceOrder;

        // get another list of length 6 by setting m to 3

        await updateMathInputValue({ latex: "3", name: "/m", core });

        m = 3;
        n = 8;

        stateVariables = await returnAllStateVariables(core);
        choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

        expect(choiceOrder).eqls(orders[`1,6`]);

        orders[`${m},${n}`] = choiceOrder;

        // get another list of length 8 by setting n to 10

        await updateMathInputValue({ latex: "10", name: "/n", core });

        m = 3;
        n = 10;

        stateVariables = await returnAllStateVariables(core);
        choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;

        expect(choiceOrder).eqls(orders[`1,8`]);

        orders[`${m},${n}`] = choiceOrder;
    });

    it("shuffle all but last choice", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput name="ci">
      <shuffle>
        <choice name="choice1">cat</choice>
        <choice name="choice2">dog</choice>
        <choice name="choice3">monkey</choice>
      </shuffle>
      <choice name="choice4">none of the above</choice>
    </choiceInput>

    <p name="psv">Selected value: $ci.selectedValue</p>
    <p name="psi">Selected index: $ci.selectedIndex</p>

    <p name="pCat">Selected cat: $choice1.selected</p>
    <p name="pDog">Selected dog: $choice2.selected</p>
    <p name="pMonkey">Selected monkey: $choice3.selected</p>
    <p name="pNone">Selected none of the above: $choice4.selected</p>
    `,
            requestedVariantIndex: 4,
        });

        let originalChoices = ["cat", "dog", "monkey", "none of the above"];

        const stateVariables = await returnAllStateVariables(core);
        const choiceTexts: string[] =
            stateVariables["/ci"].stateValues.choiceTexts;

        expect([...choiceTexts].sort()).eqls(originalChoices);

        async function check_items(
            selectedIndex?: number,
            selectedValue?: string,
        ) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected value: ${selectedValue ?? ""}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected index: ${selectedIndex ?? ""}`,
            );
            expect(stateVariables["/pCat"].stateValues.text).eq(
                `Selected cat: ${selectedValue === "cat"}`,
            );
            expect(stateVariables["/pDog"].stateValues.text).eq(
                `Selected dog: ${selectedValue === "dog"}`,
            );
            expect(stateVariables["/pMonkey"].stateValues.text).eq(
                `Selected monkey: ${selectedValue === "monkey"}`,
            );
            expect(stateVariables["/pNone"].stateValues.text).eq(
                `Selected none of the above: ${selectedValue === "none of the above"}`,
            );

            expect(stateVariables["/ci"].stateValues.selectedValues).eqls(
                selectedValue ? [selectedValue] : [],
            );
            expect(stateVariables["/ci"].stateValues.selectedIndices).eqls(
                selectedIndex ? [selectedIndex] : [],
            );
            expect(stateVariables["/choice1"].stateValues.selected).eq(
                selectedValue === "cat",
            );
            expect(stateVariables["/choice2"].stateValues.selected).eq(
                selectedValue === "dog",
            );
            expect(stateVariables["/choice3"].stateValues.selected).eq(
                selectedValue === "monkey",
            );
            expect(stateVariables["/choice4"].stateValues.selected).eq(
                selectedValue === "none of the above",
            );
        }

        await check_items();

        // select options in order

        for (let i = 0; i < 4; i++) {
            let selectedValue = originalChoices[i];
            let selectedIndex = choiceTexts.indexOf(selectedValue) + 1;
            await updateSelectedIndices({
                name: "/ci",
                selectedIndices: [selectedIndex],
                core,
            });
            await check_items(selectedIndex, selectedValue);
        }
    });

    it("sorted choices", async () => {
        let core = await createTestCore({
            doenetML: `
    <choiceInput name="ci">
      <sort sortByProp="text">
        <choice name="choice1">mouse</choice>
        <choice name="choice2">dog</choice>
        <choice name="choice3">cat</choice>
        <choice name="choice4">monkey</choice>
      </sort>
    </choiceInput>

    <p name="psv">Selected value: $ci.selectedValue</p>
    <p name="psi">Selected index: $ci.selectedIndex</p>

    <p name="pMouse">Selected mouse: $choice1.selected</p>
    <p name="pDog">Selected dog: $choice2.selected</p>
    <p name="pCat">Selected cat: $choice3.selected</p>
    <p name="pMonkey">Selected monkey: $choice4.selected</p>
    `,
        });

        let sortedChoices = ["cat", "dog", "monkey", "mouse"];
        const stateVariables = await returnAllStateVariables(core);
        const choiceTexts: string[] =
            stateVariables["/ci"].stateValues.choiceTexts;

        expect(choiceTexts).eqls(sortedChoices);

        async function check_items(
            selectedIndex?: number,
            selectedValue?: string,
        ) {
            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv"].stateValues.text).eq(
                `Selected value: ${selectedValue ?? ""}`,
            );
            expect(stateVariables["/psi"].stateValues.text).eq(
                `Selected index: ${selectedIndex ?? ""}`,
            );
            expect(stateVariables["/pCat"].stateValues.text).eq(
                `Selected cat: ${selectedValue === "cat"}`,
            );
            expect(stateVariables["/pDog"].stateValues.text).eq(
                `Selected dog: ${selectedValue === "dog"}`,
            );
            expect(stateVariables["/pMonkey"].stateValues.text).eq(
                `Selected monkey: ${selectedValue === "monkey"}`,
            );
            expect(stateVariables["/pMouse"].stateValues.text).eq(
                `Selected mouse: ${selectedValue === "mouse"}`,
            );

            expect(stateVariables["/ci"].stateValues.selectedValues).eqls(
                selectedValue ? [selectedValue] : [],
            );
            expect(stateVariables["/ci"].stateValues.selectedIndices).eqls(
                selectedIndex ? [selectedIndex] : [],
            );
            expect(stateVariables["/choice1"].stateValues.selected).eq(
                selectedValue === "mouse",
            );
            expect(stateVariables["/choice2"].stateValues.selected).eq(
                selectedValue === "dog",
            );
            expect(stateVariables["/choice3"].stateValues.selected).eq(
                selectedValue === "cat",
            );
            expect(stateVariables["/choice4"].stateValues.selected).eq(
                selectedValue === "monkey",
            );
        }

        await check_items();

        // select options in order

        for (let i = 0; i < 4; i++) {
            let selectedValue = sortedChoices[i];
            let selectedIndex = choiceTexts.indexOf(selectedValue) + 1;
            await updateSelectedIndices({
                name: "/ci",
                selectedIndices: [selectedIndex],
                core,
            });
            await check_items(selectedIndex, selectedValue);
        }
    });

    it("copy choices", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <choice name="cat0">cat</choice>
    </setup>
    <choiceInput name="ci1">
      <choice copySource="cat0" name="cat1" />
      <choice name="dog1">dog</choice>
      <choice name="monkey1">monkey</choice>
    </choiceInput>

    <choiceInput name="ci2">
      <choice copySource="cat1" name="cat2" />
      <choice copySource="dog1" name="dog2" />
      <choice name="monkey2">monkey</choice>
    </choiceInput>

    <p name="psv1">Selected value 1: $ci1.selectedValue</p>
    <p name="psi1">Selected index 1: $ci1.selectedIndex</p>

    <p name="psv2">Selected value 2: $ci2.selectedValue</p>
    <p name="psi2">Selected index 2: $ci2.selectedIndex</p>

    <p name="pCat0">Selected cat0: $cat0.selected</p>

    <p name="pCat1">Selected cat1: $cat1.selected</p>
    <p name="pDog1">Selected dog1: $dog1.selected</p>
    <p name="pMonkey1">Selected monkey1: $monkey1.selected</p>

    <p name="pCat2">Selected cat2: $cat2.selected</p>
    <p name="pDog2">Selected dog2: $dog2.selected</p>
    <p name="pMonkey2">Selected monkey2: $monkey2.selected</p>

    `,
        });

        let choices = ["cat", "dog", "monkey"];

        async function check_items(
            selectedIndex1?: number,
            selectedIndex2?: number,
        ) {
            let selectedValue1 = selectedIndex1
                ? choices[selectedIndex1 - 1]
                : "";
            let selectedValue2 = selectedIndex2
                ? choices[selectedIndex2 - 1]
                : "";

            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/psv1"].stateValues.text).eq(
                `Selected value 1: ${selectedValue1}`,
            );
            expect(stateVariables["/psi1"].stateValues.text).eq(
                `Selected index 1: ${selectedIndex1 ?? ""}`,
            );
            expect(stateVariables["/psv2"].stateValues.text).eq(
                `Selected value 2: ${selectedValue2}`,
            );
            expect(stateVariables["/psi2"].stateValues.text).eq(
                `Selected index 2: ${selectedIndex2 ?? ""}`,
            );

            expect(stateVariables["/pCat0"].stateValues.text).eq(
                `Selected cat0: false`,
            );
            expect(stateVariables["/pCat1"].stateValues.text).eq(
                `Selected cat1: ${selectedValue1 === "cat"}`,
            );
            expect(stateVariables["/pCat2"].stateValues.text).eq(
                `Selected cat2: ${selectedValue2 === "cat"}`,
            );
            expect(stateVariables["/pDog1"].stateValues.text).eq(
                `Selected dog1: ${selectedValue1 === "dog"}`,
            );
            expect(stateVariables["/pDog2"].stateValues.text).eq(
                `Selected dog2: ${selectedValue2 === "dog"}`,
            );
            expect(stateVariables["/pMonkey1"].stateValues.text).eq(
                `Selected monkey1: ${selectedValue1 === "monkey"}`,
            );
            expect(stateVariables["/pMonkey2"].stateValues.text).eq(
                `Selected monkey2: ${selectedValue2 === "monkey"}`,
            );

            expect(stateVariables["/ci1"].stateValues.selectedValues).eqls(
                selectedValue1 ? [selectedValue1] : [],
            );
            expect(stateVariables["/ci1"].stateValues.selectedIndices).eqls(
                selectedIndex1 ? [selectedIndex1] : [],
            );
            expect(stateVariables["/ci2"].stateValues.selectedValues).eqls(
                selectedValue2 ? [selectedValue2] : [],
            );
            expect(stateVariables["/ci2"].stateValues.selectedIndices).eqls(
                selectedIndex2 ? [selectedIndex2] : [],
            );
        }

        await check_items();

        // select options 1 in order

        for (let i = 1; i <= 3; i++) {
            await updateSelectedIndices({
                name: "/ci1",
                selectedIndices: [i],
                core,
            });
            await check_items(i);
        }

        // select options 2 in order

        for (let i = 1; i <= 3; i++) {
            await updateSelectedIndices({
                name: "/ci2",
                selectedIndices: [i],
                core,
            });
            await check_items(3, i);
        }
    });

    it("valueChanged", async () => {
        let doenetML = `
    <p><choiceInput name="ci1" inline><choice>Yes</choice><choice>No</choice></choiceInput>
      <text copySource="ci1" name="ci1a" /> <boolean copySource="ci1.valueChanged" name="ci1changed" /></p>
    <p><choiceInput name="ci2" preselectChoice="2"><choice>Yes</choice><choice>No</choice></choiceInput>
      <text copySource="ci2" name="ci2a" /> <boolean copySource="ci2.valueChanged" name="ci2changed" /></p>
    <p><choiceInput name="ci3" bindValueTo="$ci1.values" ><choice>Yes</choice><choice>No</choice></choiceInput>
      <text copySource="ci3" name="ci3a" /> <boolean copySource="ci3.valueChanged" name="ci3changed" /></p>
    <p><choiceInput name="ci4" inline bindValueTo="$ci2.values"><choice>Yes</choice><choice>No</choice></choiceInput
      <text copySource="ci4" name="ci4a" /> <boolean copySource="ci4.valueChanged" name="ci4changed" /></p>

    `;

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci1changed"].stateValues.value).eq(false);
        expect(stateVariables["/ci2changed"].stateValues.value).eq(false);
        expect(stateVariables["/ci3changed"].stateValues.value).eq(false);
        expect(stateVariables["/ci4changed"].stateValues.value).eq(false);

        expect(stateVariables["/ci1a"].stateValues.value).eq("");
        expect(stateVariables["/ci2a"].stateValues.value).eq("No");
        expect(stateVariables["/ci3a"].stateValues.value).eq("");
        expect(stateVariables["/ci4a"].stateValues.value).eq("No");

        // selecting from first and second marks only them as changed

        await updateSelectedIndices({
            name: "/ci1",
            selectedIndices: [1],
            core,
        });
        await updateSelectedIndices({
            name: "/ci2",
            selectedIndices: [1],
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci1changed"].stateValues.value).eq(true);
        expect(stateVariables["/ci2changed"].stateValues.value).eq(true);
        expect(stateVariables["/ci3changed"].stateValues.value).eq(false);
        expect(stateVariables["/ci4changed"].stateValues.value).eq(false);

        expect(stateVariables["/ci1a"].stateValues.value).eq("Yes");
        expect(stateVariables["/ci2a"].stateValues.value).eq("Yes");
        expect(stateVariables["/ci3a"].stateValues.value).eq("Yes");
        expect(stateVariables["/ci4a"].stateValues.value).eq("Yes");

        // selecting from third and fourth marks them as changed

        await updateSelectedIndices({
            name: "/ci3",
            selectedIndices: [2],
            core,
        });
        await updateSelectedIndices({
            name: "/ci4",
            selectedIndices: [2],
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci1changed"].stateValues.value).eq(true);
        expect(stateVariables["/ci2changed"].stateValues.value).eq(true);
        expect(stateVariables["/ci3changed"].stateValues.value).eq(true);
        expect(stateVariables["/ci4changed"].stateValues.value).eq(true);

        expect(stateVariables["/ci1a"].stateValues.value).eq("No");
        expect(stateVariables["/ci2a"].stateValues.value).eq("No");
        expect(stateVariables["/ci3a"].stateValues.value).eq("No");
        expect(stateVariables["/ci4a"].stateValues.value).eq("No");

        // reload

        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci1changed"].stateValues.value).eq(false);
        expect(stateVariables["/ci2changed"].stateValues.value).eq(false);
        expect(stateVariables["/ci3changed"].stateValues.value).eq(false);
        expect(stateVariables["/ci4changed"].stateValues.value).eq(false);

        expect(stateVariables["/ci1a"].stateValues.value).eq("");
        expect(stateVariables["/ci2a"].stateValues.value).eq("No");
        expect(stateVariables["/ci3a"].stateValues.value).eq("");
        expect(stateVariables["/ci4a"].stateValues.value).eq("No");

        // selecting from fourth marks second and fourth as changed

        await updateSelectedIndices({
            name: "/ci4",
            selectedIndices: [1],
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci1changed"].stateValues.value).eq(false);
        expect(stateVariables["/ci2changed"].stateValues.value).eq(true);
        expect(stateVariables["/ci3changed"].stateValues.value).eq(false);
        expect(stateVariables["/ci4changed"].stateValues.value).eq(true);

        expect(stateVariables["/ci1a"].stateValues.value).eq("");
        expect(stateVariables["/ci2a"].stateValues.value).eq("Yes");
        expect(stateVariables["/ci3a"].stateValues.value).eq("");
        expect(stateVariables["/ci4a"].stateValues.value).eq("Yes");

        // selecting from third marks first and third as changed

        await updateSelectedIndices({
            name: "/ci3",
            selectedIndices: [2],
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci1changed"].stateValues.value).eq(true);
        expect(stateVariables["/ci2changed"].stateValues.value).eq(true);
        expect(stateVariables["/ci3changed"].stateValues.value).eq(true);
        expect(stateVariables["/ci4changed"].stateValues.value).eq(true);

        expect(stateVariables["/ci1a"].stateValues.value).eq("No");
        expect(stateVariables["/ci2a"].stateValues.value).eq("Yes");
        expect(stateVariables["/ci3a"].stateValues.value).eq("No");
        expect(stateVariables["/ci4a"].stateValues.value).eq("Yes");
    });

    it("label", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><choiceInput name="ci1" inline><label name="label1">Select an option</label><choice>Yes</choice><choice>No</choice></choiceInput>
      <choiceInput copySource="ci1" name="ci1a" /> </p>
    <p><choiceInput name="ci2"><choice>Yes</choice><choice>No</choice><label name="label2">Select another option</label></choiceInput>
      <choiceInput copySource="ci2" name="ci2a" /> </p>

    <p><updateValue target="label1.hide" newValue="!$label1.hide" type="boolean" name="toggleLabels"><label>Toggle labels</label></updateValue>
    <updateValue triggerWith="toggleLabels" target="label2.hide" newValue="!$label2.hide" type="boolean" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci1"].stateValues.label).eq("Select an option");
        expect(stateVariables["/ci1a"].stateValues.label).eq(
            "Select an option",
        );
        expect(stateVariables["/ci2"].stateValues.label).eq(
            "Select another option",
        );
        expect(stateVariables["/ci2a"].stateValues.label).eq(
            "Select another option",
        );

        // hide labels
        await updateValue({ name: "/toggleLabels", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci1"].stateValues.label).eq("");
        expect(stateVariables["/ci1a"].stateValues.label).eq("");
        expect(stateVariables["/ci2"].stateValues.label).eq("");
        expect(stateVariables["/ci2a"].stateValues.label).eq("");

        // show labels again
        await updateValue({ name: "/toggleLabels", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ci1"].stateValues.label).eq("Select an option");
        expect(stateVariables["/ci1a"].stateValues.label).eq(
            "Select an option",
        );
        expect(stateVariables["/ci2"].stateValues.label).eq(
            "Select another option",
        );
        expect(stateVariables["/ci2a"].stateValues.label).eq(
            "Select another option",
        );
    });

    it("change choice input from copied value, text", async () => {
        let doenetML = `
  <choiceInput name="ci">
    <choice>yes</choice>
    <choice>no</choice>
    <choice>maybe</choice>
  </choiceInput>
  
  <p>Change from text of ci: <textInput name="fromTextCi"><text copySource="ci" /></textInput></p>
  <p>Change from text of ci.selectedValue: <textInput name="fromTextSelectedValue"><text copySource="ci.selectedValue" /></textInput></p>
  <p>Change from macro of &dollar;ci: <textInput name="fromMacroCi">$ci</textInput></p>
  <p>Change from macro of &dollar;ci.selectedValue: <textInput name="fromMacroSelectedValue">$ci.selectedValue</textInput></p>
  <p>Change from math of ci.selectedIndices: <mathInput name="fromMathSelectedIndices"><math copySource="ci.selectedIndices" /></mathInput></p>
  <p>Change from math of ci.selectedIndex: <mathInput name="fromMathSelectedIndex"><math copySource="ci.selectedIndex" /></mathInput></p>
  <p>Change from macro of &dollar;ci.selectedIndices: <mathInput name="fromMacroSelectedIndices">$ci.selectedIndices</mathInput></p>
  <p>Change from macro of &dollar;ci.selectedIndex: <mathInput name="fromMacroSelectedIndex">$ci.selectedIndex</mathInput></p>

  <p name="p">Selected value: <text copySource="ci" name="selectedValue" /></p>
    `;

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // typing in wrong value doesn't do anything
        await updateTextInputValue({
            text: "nothing",
            name: "/fromTextCi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // Select value from text ci
        await updateTextInputValue({
            text: "maybe",
            name: "/fromTextCi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected value: maybe`,
        );

        // Change value from text ci.selectedValue
        await updateTextInputValue({
            text: "no",
            name: "/fromTextSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: no`);

        // Invalid value into text ci.selectedValue does nothing
        await updateTextInputValue({
            text: "bad",
            name: "/fromTextSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: no`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // Can change value from one macro after starting afresh
        await updateTextInputValue({
            text: "yes",
            name: "/fromMacroCi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: yes`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // Can change value from other macro after starting afresh
        await updateTextInputValue({
            text: "no",
            name: "/fromMacroSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: no`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // Change value from text ci.selectedValue works after starting afresh
        await updateTextInputValue({
            text: "maybe",
            name: "/fromTextSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected value: maybe`,
        );

        // We can now change from macros
        await updateTextInputValue({
            text: "yes",
            name: "/fromMacroCi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: yes`);

        await updateTextInputValue({
            text: "no",
            name: "/fromMacroSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: no`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // Change value from math ci.selectedIndices works after starting afresh
        await updateMathInputValue({
            latex: "3",
            name: "/fromMathSelectedIndices",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected value: maybe`,
        );

        // Invalid value into from math ci.selectedIndex deselects all option
        await updateMathInputValue({
            latex: "4",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // Enter valid value into from math ci.selectedIndex
        await updateMathInputValue({
            latex: "3",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected value: maybe`,
        );

        // Enter value into from macro ci.selectedIndices
        await updateMathInputValue({
            latex: "2",
            name: "/fromMacroSelectedIndices",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: no`);

        // Enter value into from macro ci.selectedIndex
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: yes`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // Can change value from macros ci.selectedIndices after starting afresh
        await updateMathInputValue({
            latex: "2",
            name: "/fromMacroSelectedIndices",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: no`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // Can change value from macro ci.selectedIndex after starting afresh
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: yes`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: `);

        // can add value into from math ci.selectedIndex even after starting afresh
        await updateMathInputValue({
            latex: "2",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: no`);
    });

    it("change choice input from copied value, text, select multiple", async () => {
        let doenetML = `
  <choiceInput name="ci" selectMultiple>
    <choice>yes</choice>
    <choice>no</choice>
    <choice>maybe</choice>
  </choiceInput>
  
  <p>Change from text of ci.selectedValue: <textInput name="fromTextSelectedValue"><text copySource="ci.selectedValue" /></textInput></p>
  <p>Change from text of ci.selectedValue2: <textInput name="fromTextSelectedValue2"><text copySource="ci.selectedValue2" /></textInput></p>
  <p>Change from macro of &dollar;ci.selectedValue: <textInput name="fromMacroSelectedValue">$ci.selectedValue</textInput></p>
  <p>Change from macro of &dollar;ci.selectedValue2: <textInput name="fromMacroSelectedValue2">$ci.selectedValue2</textInput></p>
  <p>Change from math of ci.selectedIndex: <mathInput name="fromMathSelectedIndex"><math copySource="ci.selectedIndex" /></mathInput></p>
  <p>Change from math of ci.selectedIndex2: <mathInput name="fromMathSelectedIndex2"><math copySource="ci.selectedIndex2" /></mathInput></p>
  <p>Change from macro of &dollar;ci.selectedIndex: <mathInput name="fromMacroSelectedIndex">$ci.selectedIndex</mathInput></p>
  <p>Change from macro of &dollar;ci.selectedIndex2: <mathInput name="fromMacroSelectedIndex2">$ci.selectedIndex2</mathInput></p>

  <p name="p">Selected values: $ci.selectedValues</p>
    `;

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // typing in wrong value doesn't do anything
        await updateTextInputValue({
            text: "nothing",
            name: "/fromTextSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Select value from text ci.selectedValue
        await updateTextInputValue({
            text: "maybe",
            name: "/fromTextSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: maybe`,
        );

        // Add second value from text ci.selectedValue2
        await updateTextInputValue({
            text: "no",
            name: "/fromTextSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: no, maybe`,
        );

        // Invalid value into text ci.selectedValue does nothing
        await updateTextInputValue({
            text: "bad",
            name: "/fromTextSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: no, maybe`,
        );

        // Repeat first value from text ci.selectedValue2 reduces to one value
        await updateTextInputValue({
            text: "no",
            name: "/fromTextSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: no`);

        // Add second value from text ci.selectedValue2
        await updateTextInputValue({
            text: "yes",
            name: "/fromTextSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: yes, no`,
        );

        // Repeat second value from text ci.selectedValue reduces to one value
        await updateTextInputValue({
            text: "no",
            name: "/fromTextSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: no`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Can change value from macros after starting afresh
        await updateTextInputValue({
            text: "yes",
            name: "/fromMacroSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: yes`,
        );

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Can change value from macros after starting afresh
        await updateTextInputValue({
            text: "no",
            name: "/fromMacroSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: no`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Change value from text ci.selectedValue2 works after starting afresh
        await updateTextInputValue({
            text: "maybe",
            name: "/fromTextSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: maybe`,
        );

        // Add second value from text ci.selectedValue2
        await updateTextInputValue({
            text: "yes",
            name: "/fromTextSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: yes, maybe`,
        );

        // We can change from macros
        await updateTextInputValue({
            text: "no",
            name: "/fromMacroSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: no, maybe`,
        );

        await updateTextInputValue({
            text: "yes",
            name: "/fromMacroSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: yes, no`,
        );

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Change value from math ci.selectedIndex works after starting afresh
        await updateMathInputValue({
            latex: "3",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: maybe`,
        );

        // Invalid value into from math ci.selectedIndex is reverted
        await updateMathInputValue({
            latex: "4",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: maybe`,
        );

        // Enter valid value into from math ci.selectedIndex2
        await updateMathInputValue({
            latex: "1",
            name: "/fromMathSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: yes, maybe`,
        );

        // Enter value into from macro ci.selectedIndex
        await updateMathInputValue({
            latex: "2",
            name: "/fromMacroSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: no, maybe`,
        );

        // Enter value into from macro ci.selectedIndex2
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: yes, no`,
        );

        // Enter repeated value into from macro ci.selectedIndex2 selects just one
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: yes`,
        );

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Can change value from macro ci.selectedIndex after starting afresh
        await updateMathInputValue({
            latex: "2",
            name: "/fromMacroSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: no`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Can change value from macro ci.selectedIndex2 after starting afresh
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: yes`,
        );

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // can add value into from math ci.selectedIndex2 even after starting afresh
        await updateMathInputValue({
            latex: "2",
            name: "/fromMathSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: no`);
    });

    it("change choice input from copied value, math", async () => {
        let doenetML = `
  <choiceInput name="ci">
    <choice><math>x</math></choice>
    <choice><math>y</math></choice>
    <choice><math>z</math></choice>
  </choiceInput>
  
  <p>Change from math of ci: <mathInput name="fromMathCi"><math copySource="ci" /></mathInput></p>
  <p>Change from math of ci.selectedValue: <mathInput name="fromMathSelectedValue"><math copySource="ci.selectedValue" /></mathInput></p>
  <p>Change from macro of &dollar;ci: <mathInput name="fromMacroCi">$ci</mathInput></p>
  <p>Change from macro of &dollar;ci.selectedValue: <mathInput name="fromMacroSelectedValue">$ci.selectedValue</mathInput></p>
  <p>Change from math of ci.selectedIndices: <mathInput name="fromMathSelectedIndices"><math copySource="ci.selectedIndices" /></mathInput></p>
  <p>Change from math of ci.selectedIndex: <mathInput name="fromMathSelectedIndex"><math copySource="ci.selectedIndex" /></mathInput></p>
  <p>Change from macro of &dollar;ci.selectedIndices: <mathInput name="fromMacroSelectedIndices">$ci.selectedIndices</mathInput></p>
  <p>Change from macro of &dollar;ci.selectedIndex: <mathInput name="fromMacroSelectedIndex">$ci.selectedIndex</mathInput></p>

  <p name="p">Selected value: $ci.selectedValue</p>
    `;

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // typing in wrong value doesn't do anything
        await updateMathInputValue({
            latex: "a",
            name: "/fromMathCi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // Select value from math ci
        await updateMathInputValue({
            latex: "z",
            name: "/fromMathCi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: z`);

        // Change value from math ci.selectedValue
        await updateMathInputValue({
            latex: "y",
            name: "/fromMathSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: y`);

        // Invalid value into math ci.selectedValue does nothing
        await updateMathInputValue({
            latex: "bad",
            name: "/fromMathSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: y`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // Can change value from one macro after starting afresh
        await updateMathInputValue({
            latex: "x",
            name: "/fromMacroCi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: x`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // Can change value from other macro after starting afresh
        await updateMathInputValue({
            latex: "y",
            name: "/fromMacroSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: y`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // Change value from math ci.selectedValue works after starting afresh
        await updateMathInputValue({
            latex: "z",
            name: "/fromMathSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: z`);

        // We can change from macros
        await updateMathInputValue({
            latex: "x",
            name: "/fromMacroCi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: x`);

        await updateMathInputValue({
            latex: "y",
            name: "/fromMacroSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: y`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // Change value from math ci.selectedIndices works after starting afresh
        await updateMathInputValue({
            latex: "3",
            name: "/fromMathSelectedIndices",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: z`);

        // Invalid value into from math ci.selectedIndex deselects all option
        await updateMathInputValue({
            latex: "4",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // Enter valid value into from math ci.selectedIndex
        await updateMathInputValue({
            latex: "3",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: z`);

        // Enter value into from macro ci.selectedIndices
        await updateMathInputValue({
            latex: "2",
            name: "/fromMacroSelectedIndices",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: y`);

        // Enter value into from macro ci.selectedIndex
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: x`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // Can change value from macros ci.selectedIndices after starting afresh
        await updateMathInputValue({
            latex: "2",
            name: "/fromMacroSelectedIndices",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: y`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // Can change value from macro ci.selectedIndex after starting afresh
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: x`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("Selected value: ");

        // can add value into from math ci.selectedIndex even after starting afresh
        await updateMathInputValue({
            latex: "2",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected value: y`);
    });

    it("change choice input from copied value, math, select multiple", async () => {
        let doenetML = `
  <choiceInput name="ci" selectMultiple>
    <choice><math>x</math></choice>
    <choice><math>y</math></choice>
    <choice><math>z</math></choice>
  </choiceInput>
  
  <p>Change from math of ci.selectedValue: <mathInput name="fromMathSelectedValue"><math copySource="ci.selectedValue" /></mathInput></p>
  <p>Change from math of ci.selectedValue2: <mathInput name="fromMathSelectedValue2"><math copySource="ci.selectedValue2" /></mathInput></p>
  <p>Change from macro of &dollar;ci.selectedValue: <mathInput name="fromMacroSelectedValue">$ci.selectedValue</mathInput></p>
  <p>Change from macro of &dollar;ci.selectedValue2: <mathInput name="fromMacroSelectedValue2">$ci.selectedValue2</mathInput></p>
  <p>Change from math of ci.selectedIndex: <mathInput name="fromMathSelectedIndex"><math copySource="ci.selectedIndex" /></mathInput></p>
  <p>Change from math of ci.selectedIndex2: <mathInput name="fromMathSelectedIndex2"><math copySource="ci.selectedIndex2" /></mathInput></p>
  <p>Change from macro of &dollar;ci.selectedIndex: <mathInput name="fromMacroSelectedIndex">$ci.selectedIndex</mathInput></p>
  <p>Change from macro of &dollar;ci.selectedIndex2: <mathInput name="fromMacroSelectedIndex2">$ci.selectedIndex2</mathInput></p>

  <p name="p">Selected values: $ci.selectedValues</p>
    `;

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // typing in wrong value doesn't do anything
        await updateMathInputValue({
            latex: "nothing",
            name: "/fromMathSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Select value from text ci.selectedValue
        await updateMathInputValue({
            latex: "z",
            name: "/fromMathSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: z`);

        // Add second value from text ci.selectedValue2
        await updateMathInputValue({
            latex: "y",
            name: "/fromMathSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: y, z`,
        );

        // Invalid value into text ci.selectedValue does nothing
        await updateMathInputValue({
            latex: "bad",
            name: "/fromMathSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: y, z`,
        );

        // Repeat first value from text ci.selectedValue2 reduces to one value
        await updateMathInputValue({
            latex: "y",
            name: "/fromMathSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: y`);

        // Add second value from text ci.selectedValue2
        await updateMathInputValue({
            latex: "x",
            name: "/fromMathSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: x, y`,
        );

        // Repeat second value from text ci.selectedValue reduces to one value
        await updateMathInputValue({
            latex: "y",
            name: "/fromMathSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: y`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Can change value from macros after starting afresh
        await updateMathInputValue({
            latex: "x",
            name: "/fromMacroSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: x`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Can change value from macros after starting afresh
        await updateMathInputValue({
            latex: "y",
            name: "/fromMacroSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: y`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Change value from text ci.selectedValue2 works after starting afresh
        await updateMathInputValue({
            latex: "z",
            name: "/fromMathSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: z`);

        // Add second value from text ci.selectedValue2
        await updateMathInputValue({
            latex: "x",
            name: "/fromMathSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: x, z`,
        );

        // We can change from macros
        await updateMathInputValue({
            latex: "y",
            name: "/fromMacroSelectedValue",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: y, z`,
        );

        await updateMathInputValue({
            latex: "x",
            name: "/fromMacroSelectedValue2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: x, y`,
        );

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Change value from math ci.selectedIndex works after starting afresh
        await updateMathInputValue({
            latex: "3",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: z`);

        // Invalid value into from math ci.selectedIndex is reverted
        await updateMathInputValue({
            latex: "4",
            name: "/fromMathSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: z`);

        // Enter valid value into from math ci.selectedIndex2
        await updateMathInputValue({
            latex: "1",
            name: "/fromMathSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: x, z`,
        );

        // Enter value into from macro ci.selectedIndex
        await updateMathInputValue({
            latex: "2",
            name: "/fromMacroSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: y, z`,
        );

        // Enter value into from macro ci.selectedIndex2
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(
            `Selected values: x, y`,
        );

        // Enter repeated value into from macro ci.selectedIndex2 selects just one
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: x`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Can change value from macro ci.selectedIndex after starting afresh
        await updateMathInputValue({
            latex: "2",
            name: "/fromMacroSelectedIndex",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: y`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // Can change value from macro ci.selectedIndex2 after starting afresh
        await updateMathInputValue({
            latex: "1",
            name: "/fromMacroSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: x`);

        // reload
        core = await createTestCore({
            doenetML,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: `);

        // can add value into from math ci.selectedIndex2 even after starting afresh
        await updateMathInputValue({
            latex: "2",
            name: "/fromMathSelectedIndex2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(`Selected values: y`);
    });
});
