import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    callAction,
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/** The coded warnings and errors of `core` matching `codes`, as `code: message`. */
function coded(core: any, codes: RegExp) {
    const { warnings, errors } = getDiagnosticsByType(core);
    return [...errors, ...warnings]
        .filter((d) => codes.test(d.code ?? ""))
        .map((d) => `${d.code}: ${d.message}`);
}

/**
 * Load `doenetML`, enter `value` in the first input of the answer `a` (a
 * math, text or boolean input, by `kind`), submit `a`, and return its
 * credit, its awards and inputs, and the core.
 */
async function submit({
    doenetML,
    value,
    kind = "math",
}: {
    doenetML: string;
    value?: string | boolean;
    kind?: "math" | "text" | "boolean";
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const answerIdx = await resolvePathToNodeIdx("a");
    let stateVariables = await core.returnAllStateVariables(false, true);
    const inputs = stateVariables[answerIdx].stateValues.inputChildren;
    if (value !== undefined) {
        const componentIdx = inputs[0].componentIdx;
        if (kind === "math") {
            await updateMathInputValue({
                latex: value as string,
                componentIdx,
                core,
            });
        } else if (kind === "text") {
            await updateTextInputValue({
                text: value as string,
                componentIdx,
                core,
            });
        } else {
            await updateBooleanInputValue({
                boolean: value as boolean,
                componentIdx,
                core,
            });
        }
    }
    await submitAnswer({ componentIdx: answerIdx, core });
    stateVariables = await core.returnAllStateVariables(false, true);
    return {
        core,
        resolvePathToNodeIdx,
        stateVariables,
        credit: stateVariables[answerIdx].stateValues.creditAchieved,
        numAwards: Object.values(stateVariables).filter(
            (c: any) => c.componentType === "award",
        ).length,
        inputTypes: inputs.map((input: any) => input.componentType),
    };
}

describe("An answer's awards inside a composite (#1874, COMP-1) @group4", () => {
    it.each([
        ["a group", `<group><award><math>1</math></award></group>`, "1", 1],
        [
            "an option of a select",
            `<select numToSelect="1"><option><award><math>1</math></award></option></select>`,
            "1",
            1,
        ],
        [
            "a repeat",
            `<repeat for="1 2" valueName="v"><award>$v</award></repeat>`,
            "2",
            2,
        ],
        [
            "a case",
            `<conditionalContent condition="true"><award><math>1</math></award></conditionalContent>`,
            "1",
            1,
        ],
    ])(
        "an award in %s is the answer's award, and grades",
        async (_, content, value, numAwards) => {
            const result = await submit({
                doenetML: `<answer name="a">${content}</answer>`,
                value,
            });
            expect(result.credit).toBe(1);
            expect(result.numAwards).toBe(numAwards);
            expect(result.inputTypes).toEqual(["mathInput"]);
            expect(coded(result.core, /doenet-w0107/)).toEqual([]);
        },
    );

    it("a setup beside an award is not wrapped in an award of its own", async () => {
        const result = await submit({
            doenetML: `<answer name="a"><setup><number name="n">1</number></setup><award>$n</award></answer>`,
            value: "1",
        });
        expect(result.credit).toBe(1);
        expect(result.numAwards).toBe(1);
    });

    it("content written on both sides of a setup is wrapped as one", async () => {
        const result = await submit({
            doenetML: `<answer name="a">x <setup><math name="m">y</math></setup> + $m</answer>`,
            value: "x+y",
        });
        expect(result.credit).toBe(1);
        expect(result.numAwards).toBe(1);
        expect(result.inputTypes).toEqual(["mathInput"]);
        expect(coded(result.core, /doenet-w0107/)).toEqual([]);
    });

    it("an award in a composite reads its text as the answer's type", async () => {
        const result = await submit({
            doenetML: `<answer name="a"><textInput/><group><award>hello</award></group></answer>`,
            value: "hello",
            kind: "text",
        });
        expect(result.credit).toBe(1);
    });

    it("an answer whose awards are in a composite and that has no input records its references", async () => {
        const result = await submit({
            doenetML: `<mathInput name="mi" prefill="2"/>
            <answer name="a"><group><award><when>$mi = 2</when></award></group></answer>`,
        });
        const { stateVariables, resolvePathToNodeIdx } = result;
        expect(result.credit).toBe(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .submittedResponses.length,
        ).toBe(1);
    });
});

describe("A matrix's rows from a composite (#1873, COMP-1) @group4", () => {
    async function matrixOf(content: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<matrix name="M">${content}</matrix>`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        return {
            matrix: stateVariables[
                await resolvePathToNodeIdx("M")
            ].stateValues.matrix.map((row: any[]) =>
                row.map((entry) => entry.toString()),
            ),
            core,
        };
    }

    it.each([
        [
            "a repeat",
            `<repeat for="1 2" valueName="v"><row><math>$v</math> <math>2$v</math></row></repeat>`,
            [
                ["1", "2 * 1"],
                ["2", "2 * 2"],
            ],
        ],
        [
            "a group",
            `<group><row><math>1</math> <math>2</math></row></group>`,
            [["1", "2"]],
        ],
        [
            "a case",
            `<conditionalContent condition="true"><row><math>1</math> <math>2</math></row></conditionalContent>`,
            [["1", "2"]],
        ],
        [
            "an option, beside a row written out",
            `<row><math>1</math> <math>2</math></row><select><option><row><math>3</math> <math>4</math></row></option></select>`,
            [
                ["1", "2"],
                ["3", "4"],
            ],
        ],
    ])("rows in %s are the matrix's rows", async (_, content, expected) => {
        const { matrix, core } = await matrixOf(content);
        expect(matrix).toEqual(expected);
        expect(coded(core, /doenet-w0107/)).toEqual([]);
    });

    it("columns in a group are the matrix's columns", async () => {
        const { matrix } = await matrixOf(
            `<group><column><math>1</math> <math>2</math></column></group>`,
        );
        expect(matrix).toEqual([["1"], ["2"]]);
    });

    it("a math beside rows in a group is reported as ignored", async () => {
        const { matrix, core } = await matrixOf(
            `<group><row><math>1</math> <math>2</math></row><math>5</math></group>`,
        );
        expect(matrix).toEqual([["1", "2"]]);
        expect(coded(core, /doenet-w0194/)).toEqual([
            "doenet-w0194: A `<math>` written beside the `<row>` or `<column>` children of a `<matrix>` is ignored: the rows or columns give the matrix its entries.",
        ]);
    });

    it("rows in a setup are not the matrix's rows", async () => {
        const { matrix, core } = await matrixOf(
            `<setup><row name="r"><math>1</math> <math>2</math></row></setup><math>x</math>`,
        );
        expect(matrix).toEqual([["x"]]);
        expect(coded(core, /doenet-w0194/)).toEqual([]);

        const copied = await matrixOf(
            `<setup><row name="r"><math>1</math> <math>2</math></row></setup>$r`,
        );
        expect(copied.matrix).toEqual([["1", "2"]]);

        // text beside rows only in a setup is the matrix's value, as when
        // there are no rows
        const text = await matrixOf(
            `<setup><row name="r"><math>1</math> <math>2</math></row></setup>x`,
        );
        expect(text.matrix).toEqual([["x"]]);
        expect(coded(text.core, /doenet-w0107|doenet-w0194/)).toEqual([]);
    });
});

describe("A reference to a choice in a choice input (#2097) @group4", () => {
    it("warns, suggesting a copy, and adds no boolean", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<choice name="c1" credit="1">cat</choice>
            <choice name="c2">dog</choice>
            <answer name="a"><choiceInput name="ci">$c1 $c2</choiceInput></answer>`,
        });
        expect(coded(core, /doenet-w0210|doenet-w0107/)).toEqual([
            'doenet-w0210: `$c1` is whether that `<choice>` was submitted, not the choice, so it adds no choice to this `<choiceInput>`. To include the choice, write `<choice copy="$c1"/>`.',
            'doenet-w0210: `$c2` is whether that `<choice>` was submitted, not the choice, so it adds no choice to this `<choiceInput>`. To include the choice, write `<choice copy="$c2"/>`.',
        ]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ci")].stateValues
                .choiceTexts,
        ).toEqual([]);
    });

    it("the suggested copy works", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<choice name="c1" credit="1">cat</choice>
            <answer name="a"><choiceInput name="ci"><choice copy="$c1"/><choice>dog</choice></choiceInput></answer>`,
        });
        expect(coded(core, /doenet-w0210/)).toEqual([]);
        const ciIdx = await resolvePathToNodeIdx("ci");
        await updateSelectedIndices({
            componentIdx: ciIdx,
            selectedIndices: [1],
            core,
        });
        const aIdx = await resolvePathToNodeIdx("a");
        await submitAnswer({ componentIdx: aIdx, core });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[aIdx].stateValues.creditAchieved).toBe(1);
    });

    it("an index past the choices is not selected", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<choiceInput name="ci"><choice>cat</choice><choice>dog</choice></choiceInput>
            <choiceInput name="empty" />`,
        });
        const ciIdx = await resolvePathToNodeIdx("ci");
        await updateSelectedIndices({
            componentIdx: ciIdx,
            selectedIndices: [3, 0, 2],
            core,
        });
        const emptyIdx = await resolvePathToNodeIdx("empty");
        await updateSelectedIndices({
            componentIdx: emptyIdx,
            selectedIndices: [1],
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[ciIdx].stateValues.selectedIndices).toEqual([2]);
        expect(stateVariables[emptyIdx].stateValues.selectedIndices).toEqual(
            [],
        );
    });
});

describe("References that name nothing are not responses of each other (#1853, VAL-5) @group4", () => {
    it.each([
        [
            "two references",
            `<award referencesAreResponses="$nope1"><when>$nope2 = 1</when></award>`,
        ],
        [
            "two indices",
            `<award referencesAreResponses="$mis[$nope1]"><when>$mis[$nope2] = 1</when></award>`,
        ],
    ])("%s that name nothing record no response", async (_, award) => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="mi1" /><mathList name="mis">1 2</mathList>
            <answer name="ans">${award}</answer>`,
        });
        const ansIdx = await resolvePathToNodeIdx("ans");
        await submitAnswer({ componentIdx: ansIdx, core });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[ansIdx].stateValues.currentResponses).toEqual([]);
        expect(stateVariables[ansIdx].stateValues.creditAchieved).toBe(0);
    });
});

describe("An answer's label labels its one input (#1674, D66 decision 2) @group4", () => {
    it.each([
        ["mathInput", "<mathInput name='in'/><award>2</award>"],
        ["mathInput, with no award", "<mathInput name='in'/>"],
        ["textInput", "<textInput name='in'/><award>hello</award>"],
        [
            "choiceInput",
            "<choiceInput name='in'><choice credit='1'>A</choice><choice>B</choice></choiceInput>",
        ],
    ])("a written %s takes the answer's label", async (_, content) => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<answer name="a"><label>the label</label>${content}</answer>`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const input = stateVariables[await resolvePathToNodeIdx("in")];
        expect(input.stateValues.label).toBe("the label");
        expect(input.stateValues.labelFromParent).toBe(true);
        expect(coded(core, /doenet-w0209/)).toEqual([]);
    });

    it("an input with a label of its own keeps it, with a warning", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<answer name="a"><label>the label</label><mathInput name="in"><label>own</label></mathInput><award>2</award></answer>`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("in")].stateValues.label,
        ).toBe("own");
        expect(coded(core, /doenet-w0209/)).toEqual([
            "doenet-w0209: The `<mathInput>` in this `<answer>` has a `<label>` of its own, so the answer's `<label>` is not shown. Remove one of the two labels.",
        ]);
    });

    it("with several inputs, a warning, and no input takes the label", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<answer name="a"><label>the label</label><mathInput name="in1"/><mathInput name="in2"/><award><when>$in1 = $in2</when></award></answer>`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("in1")].stateValues.label,
        ).toBe("");
        expect(coded(core, /doenet-w0209/)).toEqual([
            "doenet-w0209: This `<answer>` has 2 inputs, so its `<label>` labels none of them; it is shown only beside the answer's own check-work button, if it has one. Give each input a `<label>` of its own.",
        ]);
    });
});

describe("One submitLabel (#349, D66 decision 15) @group4", () => {
    it("its default depends on showCorrectness, and an authored one is used either way", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<answer name="a1">x</answer>
            <answer name="a2" showCorrectness="false">x</answer>
            <answer name="a3" submitLabel="Go">x</answer>
            <answer name="a4" submitLabel="Go" showCorrectness="false">x</answer>
            <problem name="prob" sectionWideCheckWork showCorrectness="false"><answer>x</answer></problem>
            <text name="t" extend="$a2.submitLabel" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const label = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .submitLabel;
        expect(await label("a1")).toBe("Check Work");
        expect(await label("a2")).toBe("Submit Response");
        expect(await label("a3")).toBe("Go");
        expect(await label("a4")).toBe("Go");
        expect(await label("prob")).toBe("Submit Response");
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.value,
        ).toBe("Submit Response");
    });

    it("submitLabelNoCorrectness is read as submitLabel, with a warning", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<answer name="a" submitLabelNoCorrectness="Guess" showCorrectness="false">x</answer>`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .submitLabel,
        ).toBe("Guess");
        expect(coded(core, /doenet-w0108/)).toEqual([
            "doenet-w0108: [deprecation] Attribute `submitLabelNoCorrectness` is deprecated; use `submitLabel` instead.",
        ]);
    });
});

describe("Labels on an orbital diagram input and a subset input (#1279, CTX-11) @group4", () => {
    it.each(["orbitalDiagramInput", "subsetOfRealsInput"])(
        "a <%s> takes a label",
        async (tag) => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<${tag} name="i"><label>Draw it</label></${tag}>
                <${tag} name="j" labelIsName />
                <p name="p">$i.label</p>`,
            });
            expect(coded(core, /doenet-w0107|doenet-w0104/)).toEqual([]);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("i")].stateValues
                    .label,
            ).toBe("Draw it");
            expect(
                stateVariables[await resolvePathToNodeIdx("j")].stateValues
                    .label,
            ).toBe("j");
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
            ).toBe("Draw it");
        },
    );
});

describe("A callAction's target that names a property (#1565, NAME-2) @group4", () => {
    it("warns at load, and a target that names a component does not", async () => {
        const { core } = await createTestCore({
            doenetML: `<point name="p" />
            <pointList name="pl">(1,2) (3,4)</pointList>
            <group name="g"><point name="q"/></group>
            <callAction name="ca1" target="$p.styleDescription[1]" actionName="movePoint" />
            <callAction name="ca2" target="$p.x" actionName="movePoint" />
            <callAction name="ca3" target="$p" actionName="movePoint" />
            <callAction name="ca4" target="$pl[2]" actionName="movePoint" />
            <callAction name="ca5" target="$g.q" actionName="movePoint" />`,
        });
        expect(coded(core, /doenet-w0211/)).toEqual([
            "doenet-w0211: The `target` of this `<callAction>`, `$p.styleDescription[1]`, names a property, not a component, so the action does nothing. Its `target` names the component to act on: remove the property.",
            "doenet-w0211: The `target` of this `<callAction>`, `$p.x`, names a property, not a component, so the action does nothing. Its `target` names the component to act on: remove the property.",
        ]);
    });

    it("no warning for a name after a component made by extend or copy, which may name what it has from its source", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<p name="p0"><point name="Q">(1,2)</point></p>
            <p name="p1" extend="$p0"/>
            <section name="s"><p name="p2" copy="$p0"/></section>
            <callAction name="ca1" target="$p1.Q" actionName="movePoint" />
            <callAction name="ca2" target="$s.p2.Q" actionName="movePoint" />`,
        });
        expect(coded(core, /doenet-w0211/)).toEqual([]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["ca1", "ca2"]) {
            const target =
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .targetComponentIdx;
            expect(stateVariables[target].componentType).toBe("point");
        }
    });

    it("the warning is not repeated when the action is called", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<point name="p" />
            <callAction name="ca" target="$p.x" actionName="movePoint" />`,
        });
        await callAction({
            componentIdx: await resolvePathToNodeIdx("ca"),
            core,
        });
        expect(coded(core, /doenet-w0211/).length).toBe(1);
    });
});
