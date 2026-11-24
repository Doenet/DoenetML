import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An answer's type comes from its input (ANS-4, D55, #2608): the input
 * written inside it decides; with none, its awards' typed content does,
 * references included; plain text in every award is read as that type, and
 * `type` is needed only when nothing else decides.
 */
describe("An answer's type comes from its input (D55) @group4", () => {
    function coded(core: any, kind: "errors" | "warnings") {
        return getDiagnosticsByType(core)
            [kind].filter((d) =>
                /doenet-(e0092|w0078|w0205|w0206|w0207)/.test(d.code ?? ""),
            )
            .map((d) => `${d.code}: ${d.message}`);
    }

    /**
     * Load `doenetML`, enter `value` in the input named `input` (a math,
     * text or boolean input, by `kind`), submit the answer `a`, and return
     * its credit and the core.
     */
    async function creditFor({
        doenetML,
        kind,
        value,
        input = "in",
    }: {
        doenetML: string;
        kind: "math" | "text" | "boolean";
        value: string | boolean;
        input?: string;
    }) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const inputIdx = await resolvePathToNodeIdx(input);
        if (kind === "math") {
            await updateMathInputValue({
                latex: value as string,
                componentIdx: inputIdx,
                core,
            });
        } else if (kind === "text") {
            await updateTextInputValue({
                text: value as string,
                componentIdx: inputIdx,
                core,
            });
        } else {
            await updateBooleanInputValue({
                boolean: value as boolean,
                componentIdx: inputIdx,
                core,
            });
        }
        const answerIdx = await resolvePathToNodeIdx("a");
        await submitAnswer({ componentIdx: answerIdx, core });
        const stateVariables = await core.returnAllStateVariables(false, true);
        return {
            credit: stateVariables[answerIdx].stateValues.creditAchieved,
            core,
            stateVariables,
            resolvePathToNodeIdx,
        };
    }

    /** The tag of the first input of the answer `a`. */
    async function inputTagOf(stateVariables: any, answerIdx: number) {
        const answer = stateVariables[answerIdx];
        const input = answer.activeChildren.find(
            (child: any) =>
                typeof child === "object" && /Input$/.test(child.componentType),
        );
        return input?.componentType;
    }

    it("a text input inside reads the answer's text as a text", async () => {
        for (const doenetML of [
            `<answer name="a"><textInput name="in"/>hello there</answer>`,
            `<answer name="a"><textInput name="in"/><award>hello there</award></answer>`,
        ]) {
            const { credit, core } = await creditFor({
                doenetML,
                kind: "text",
                value: "hello there",
            });
            expect(credit).eq(1);
            expect(coded(core, "warnings")).eqls([]);
            expect(coded(core, "errors")).eqls([]);
        }

        const { credit } = await creditFor({
            doenetML: `<answer name="a"><textInput name="in"/>hello there</answer>`,
            kind: "text",
            value: "hello",
        });
        expect(credit).eq(0);
    });

    it("a boolean input inside reads the answer's text as a boolean", async () => {
        let { credit } = await creditFor({
            doenetML: `<answer name="a"><booleanInput name="in"/>true</answer>`,
            kind: "boolean",
            value: true,
        });
        expect(credit).eq(1);
        ({ credit } = await creditFor({
            doenetML: `<answer name="a"><booleanInput name="in"/>true</answer>`,
            kind: "boolean",
            value: false,
        }));
        expect(credit).eq(0);
    });

    it("with no input, one award's typed content decides every award's type", async () => {
        const doenetML = `<answer name="a"><award><text>hello</text></award><award credit="0.5">hi</award></answer>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const answerIdx = await resolvePathToNodeIdx("a");
        let stateVariables = await core.returnAllStateVariables(false, true);
        const inputIdx =
            stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;
        expect(stateVariables[inputIdx].componentType).eq("textInput");

        await updateTextInputValue({
            text: "hi",
            componentIdx: inputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(0.5);

        await updateTextInputValue({
            text: "hello",
            componentIdx: inputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(1);
        expect(coded(core, "warnings")).eqls([]);
    });

    it("with no input, a reference's type decides, and picks the input added", async () => {
        for (const [doenetML, inputType, value, kind] of [
            [
                `<text name="t">hello</text><answer name="a">$t</answer>`,
                "textInput",
                "hello",
                "text",
            ],
            [
                `<text name="t">hello</text><answer name="a"><award>$t</award></answer>`,
                "textInput",
                "hello",
                "text",
            ],
            [
                `<boolean name="b">true</boolean><answer name="a">$b</answer>`,
                "booleanInput",
                true,
                "boolean",
            ],
            [
                `<textInput name="ti" prefill="hello"/><answer name="a">$ti</answer>`,
                "textInput",
                "hello",
                "text",
            ],
            [
                `<math name="m">x+1</math><answer name="a">$m</answer>`,
                "mathInput",
                "x+1",
                "math",
            ],
        ] as const) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            const answerIdx = await resolvePathToNodeIdx("a");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const inputIdx =
                stateVariables[answerIdx].stateValues.inputChildren[0]
                    .componentIdx;
            expect(stateVariables[inputIdx].componentType, doenetML).eq(
                inputType,
            );
            if (kind === "text") {
                await updateTextInputValue({
                    text: value as string,
                    componentIdx: inputIdx,
                    core,
                });
            } else if (kind === "boolean") {
                await updateBooleanInputValue({
                    boolean: value as boolean,
                    componentIdx: inputIdx,
                    core,
                });
            } else {
                await updateMathInputValue({
                    latex: value as string,
                    componentIdx: inputIdx,
                    core,
                });
            }
            await submitAnswer({ componentIdx: answerIdx, core });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[answerIdx].stateValues.creditAchieved,
                doenetML,
            ).eq(1);
            expect(coded(core, "warnings"), doenetML).eqls([]);
        }
    });

    it("type is needed only when nothing else decides, and one that agrees is allowed", async () => {
        for (const doenetML of [
            `<answer name="a" type="text"><textInput name="in"/>hello there</answer>`,
            `<answer name="a" type="text">hello there</answer>`,
            `<answer name="a"><text>hello there</text></answer>`,
            `<answer name="a"><textInput name="in"/><award><text>hello there</text></award></answer>`,
        ]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            const answerIdx = await resolvePathToNodeIdx("a");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const inputIdx =
                stateVariables[answerIdx].stateValues.inputChildren[0]
                    .componentIdx;
            await updateTextInputValue({
                text: "hello there",
                componentIdx: inputIdx,
                core,
            });
            await submitAnswer({ componentIdx: answerIdx, core });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[answerIdx].stateValues.creditAchieved,
                doenetML,
            ).eq(1);
            expect(coded(core, "errors"), doenetML).eqls([]);
            expect(coded(core, "warnings"), doenetML).eqls([]);
        }
    });

    it("plain text with nothing to decide its type is still a math", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<answer name="a">x+1</answer>`,
        });
        const answerIdx = await resolvePathToNodeIdx("a");
        let stateVariables = await core.returnAllStateVariables(false, true);
        const inputIdx =
            stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;
        expect(stateVariables[inputIdx].componentType).eq("mathInput");
        await updateMathInputValue({
            latex: "1+x",
            componentIdx: inputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(1);
    });

    it("a type that disagrees with the input is an error at load, and the input's type is used", async () => {
        const { credit, core } = await creditFor({
            doenetML: `<answer name="a" type="math"><textInput name="in"/>hello there</answer>`,
            kind: "text",
            value: "hello there",
        });
        expect(credit).eq(1);
        expect(coded(core, "errors")).eqls([
            'doenet-e0092: This `<answer>` has `type="math"`, but the `<textInput>` written in it gives a `text`, and its awards compare their content with that input. The `type` is ignored: remove it, or use an input that gives a `math`.',
        ]);
        const [error] = getDiagnosticsByType(core).errors.filter(
            (e) => e.code === "doenet-e0092",
        );
        // at the attribute
        expect(error.position?.start.column).eq(18);
    });

    it("a type in another case is read as its keyword, and one that names no type is still a warning", async () => {
        for (const doenetML of [
            `<answer name="a" type="Text"><textInput name="in"/>hello</answer>`,
            `<answer name="a" type="TEXT">hello<textInput name="in"/></answer>`,
        ]) {
            const { credit, core } = await creditFor({
                doenetML,
                kind: "text",
                value: "hello",
            });
            expect(credit, doenetML).eq(1);
            expect(coded(core, "warnings"), doenetML).eqls([]);
            expect(coded(core, "errors"), doenetML).eqls([]);
        }

        // with no input, it picks the input added
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<answer name="a" type="TEXT">hello</answer>`,
        });
        const answerIdx = await resolvePathToNodeIdx("a");
        const stateVariables = await core.returnAllStateVariables(false, true);
        const inputIdx =
            stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;
        expect(stateVariables[inputIdx].componentType).eq("textInput");
        expect(coded(core, "warnings")).eqls([]);

        // the input decides, and the `type` that names no type is reported
        const { credit, core: core2 } = await creditFor({
            doenetML: `<answer name="a" type="bogus"><textInput name="in"/>hello</answer>`,
            kind: "text",
            value: "hello",
        });
        expect(credit).eq(1);
        expect(coded(core2, "warnings")).eqls([
            "doenet-w0078: Invalid type for answer: bogus",
        ]);

        // also when nothing is decided (more than one input)
        const { core: core3 } = await createTestCore({
            doenetML: `<answer name="a" type="Text"><textInput name="t1"/><textInput name="t2"/><award><when>$t1 = $t2</when></award></answer>`,
        });
        expect(coded(core3, "warnings")).eqls([]);
    });

    it("a type with spaces around it is read as its keyword", async () => {
        // `type` trims, as its valid values do
        const { credit, core, stateVariables, resolvePathToNodeIdx } =
            await creditFor({
                doenetML: `<answer name="a" type="text "><textInput name="in"/>hello</answer>`,
                kind: "text",
                value: "hello",
            });
        expect(credit).eq(1);
        expect(coded(core, "warnings")).eqls([]);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.type,
        ).eq("text");

        // with no input, it picks the input added
        const { core: core2, resolvePathToNodeIdx: resolve2 } =
            await createTestCore({
                doenetML: `<answer name="a" type=" Text ">hello</answer>`,
            });
        const stateVariables2 = await core2.returnAllStateVariables(
            false,
            true,
        );
        expect(await inputTagOf(stateVariables2, await resolve2("a"))).eq(
            "textInput",
        );
        expect(coded(core2, "warnings")).eqls([]);

        // and one that disagrees with the input is still the error
        const { core: core3 } = await createTestCore({
            doenetML: `<answer name="a" type=" math"><textInput/>hello</answer>`,
        });
        expect(coded(core3, "errors").map((e) => e.slice(0, 12))).eqls([
            "doenet-e0092",
        ]);
        expect(coded(core3, "warnings")).eqls([]);
    });

    it("a reference to an input written in the answer is content, not an input written inside", async () => {
        // `$ti` is wrapped in an award and compared with the input the
        // answer has or adds, not taken for a `<textInput>` written inside
        const { core } = await createTestCore({
            doenetML: `<textInput name="ti"/>
<answer name="a" type="math">$ti</answer>
<answer name="b"><mathInput/>$ti</answer>`,
        });
        expect(coded(core, "errors")).eqls([]);
        expect(coded(core, "warnings")).eqls([
            "doenet-w0205: `$ti` gives a `text`, which is compared with the answer's `<mathInput>`, which gives a `math`, so it can never earn credit. Compare a `math`, or use an input that gives a `text`.",
            "doenet-w0205: `$ti` gives a `text`, which is compared with the answer's `<mathInput>`, which gives a `math`, so it can never earn credit. Compare a `math`, or use an input that gives a `text`.",
        ]);

        // and the one input written inside still decides
        const { credit } = await creditFor({
            doenetML: `<booleanInput name="b"/><answer name="a"><booleanInput name="in"/>$b</answer>`,
            kind: "boolean",
            value: false,
        });
        expect(credit).eq(1);
    });

    it("a reference to a property of a subtype of text is a text", async () => {
        // `$m.latex` reads a `<latex>`, which is a text
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<math name="m">x</math><answer name="a">$m.latex</answer>
<answer name="b"><mathInput/><award>$m.latex</award></answer>`,
        });
        const answerIdx = await resolvePathToNodeIdx("a");
        let stateVariables = await core.returnAllStateVariables(false, true);
        const inputIdx =
            stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;
        expect(stateVariables[inputIdx].componentType).eq("textInput");
        await updateTextInputValue({ text: "x", componentIdx: inputIdx, core });
        await submitAnswer({ componentIdx: answerIdx, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(1);
        expect(coded(core, "warnings")).eqls([
            "doenet-w0205: `$m.latex` gives a `text`, which is compared with the answer's `<mathInput>`, which gives a `math`, so it can never earn credit. Compare a `math`, or use an input that gives a `text`.",
        ]);
    });

    it("award content of another type than the input is a warning at load", async () => {
        const { credit, core } = await creditFor({
            doenetML: `<answer name="a"><textInput name="in"/><math>2</math></answer>`,
            kind: "text",
            value: "2",
        });
        expect(credit).eq(0);
        expect(coded(core, "warnings")).eqls([
            "doenet-w0205: This `<math>` is compared with the answer's `<textInput>`, which gives a `text`, so it can never earn credit. Write it as a `text`, or use an input of its type.",
        ]);

        // also for an input the answer adds, and for a reference
        const { core: core2 } = await createTestCore({
            doenetML: `<text name="t">hi</text>
<answer name="a" type="math"><award><number>2</number></award><award>$t</award></answer>
<answer name="b"><booleanInput/><award><number>1</number></award></answer>`,
        });
        expect(coded(core2, "warnings")).eqls([
            "doenet-w0205: `$t` gives a `text`, which is compared with the answer's `<mathInput>`, which gives a `math`, so it can never earn credit. Compare a `math`, or use an input that gives a `text`.",
            "doenet-w0205: This `<number>` is compared with the answer's `<booleanInput>`, which gives a `boolean`, so it can never earn credit. Write it as a `boolean`, or use an input of its type.",
        ]);
    });

    it("a typed component with other content is read as the answer's type, not warned of", async () => {
        // the award's sugar wraps content of more than one child in the
        // answer's type, so it can earn credit: no type-mix warning
        const { credit, core } = await creditFor({
            doenetML: `<answer name="a"><mathInput name="in"/><award><text>x</text>y</award></answer>`,
            kind: "math",
            value: "xy",
        });
        expect(credit).eq(1);
        expect(coded(core, "warnings")).eqls([]);

        const { credit: credit2, core: core2 } = await creditFor({
            doenetML: `<answer name="a"><textInput name="in"/><math>x</math> y</answer>`,
            kind: "text",
            value: "x y",
        });
        expect(credit2).eq(1);
        expect(coded(core2, "warnings")).eqls([]);
    });

    it("only the content the answer's sugar wraps in an award is compared", async () => {
        // The sugar wraps one run of content, up to the next award, input
        // or `<considerAsResponses>` after it; what follows is an invalid
        // child of the answer, compared with nothing.
        const { core } = await createTestCore({
            doenetML: `<answer name="a"><textInput/> <award><text>hello</text></award> <math>x</math></answer>`,
        });
        expect(coded(core, "warnings")).eqls([]);

        const { core: core2 } = await createTestCore({
            doenetML: `<answer name="a"><textInput/> <math>x</math> <award><text>hello</text></award> <math>y</math></answer>`,
        });
        expect(coded(core2, "warnings")).eqls([
            "doenet-w0205: This `<math>` is compared with the answer's `<textInput>`, which gives a `text`, so it can never earn credit. Write it as a `text`, or use an input of its type.",
        ]);

        // and only it decides the type: the `<math>` left after the award
        // is not compared
        const { core: core3, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<answer name="a"><text>hello</text><award><text>hi</text></award><math>y</math></answer>`,
        });
        const stateVariables3 = await core3.returnAllStateVariables(
            false,
            true,
        );
        expect(
            await inputTagOf(stateVariables3, await resolvePathToNodeIdx("a")),
        ).eq("textInput");
        expect(coded(core3, "warnings")).eqls([]);
    });

    it("an award with content and no when, in an answer with more than one input, is a warning", async () => {
        const { credit, core } = await creditFor({
            doenetML: `<answer name="a"><textInput name="in"/><mathInput/><award>hello</award></answer>`,
            kind: "text",
            value: "hello",
        });
        expect(credit).eq(0);
        expect(coded(core, "warnings")).eqls([
            "doenet-w0206: This `<award>`'s content is compared with none of the answer's 2 inputs, so it can never earn credit. Compare the inputs in a `<when>`: `<award><when>…</when></award>`.",
        ]);

        const { core: core2 } = await createTestCore({
            doenetML: `<answer name="a"><textInput/><mathInput/>hello</answer>
<answer name="b"><textInput name="ti"/><mathInput name="mi"/><award><when>$ti = hello and $mi = x</when></award></answer>`,
        });
        expect(coded(core2, "warnings")).eqls([
            "doenet-w0206: This `<answer>` has 2 inputs, so the content written in it is compared with none of them and can never earn credit. Compare the inputs in a `<when>`: `<award><when>…</when></award>`.",
        ]);
    });

    it("an answer with a forAnswer input whose award has content and no when is a warning", async () => {
        const { core } = await createTestCore({
            doenetML: `<textInput name="ti" forAnswer="$a"/>
<answer name="a">hello</answer>
<textInput name="ti2" forAnswer="$b"/>
<answer name="b"><award><when>$ti2 = hello</when></award></answer>
<textInput name="ti3" forAnswer="$c"/>
<answer name="c"><award><text>hello</text></award></answer>`,
        });
        expect(coded(core, "warnings")).eqls([
            "doenet-w0207: The content written in this `<answer>` is compared with a `<mathInput>` the answer adds, not with the input written with `forAnswer`, which is reached only through a `<when>`. Move that input inside the `<answer>`, or compare it in a `<when>`.",
            "doenet-w0207: This `<award>`'s content is compared with a `<textInput>` the answer adds, not with the input written with `forAnswer`, which is reached only through a `<when>`. Move that input inside the `<answer>`, or compare it in a `<when>`.",
        ]);
    });

    it("a when written directly in the answer is its award's condition, not content", async () => {
        // two inputs: the sugar wraps the `<when>` in an award, which earns credit
        const { credit, core } = await creditFor({
            doenetML: `<answer name="a"><mathInput name="in"/><mathInput/><when>$in = x</when></answer>`,
            kind: "math",
            value: "x",
        });
        expect(credit).eq(1);
        expect(coded(core, "warnings")).eqls([]);

        // a `forAnswer` input, compared in the `<when>`
        const { credit: credit2, core: core2 } = await creditFor({
            doenetML: `<mathInput name="in" forAnswer="$a"/><answer name="a"><when>$in = x</when></answer>`,
            kind: "math",
            value: "x",
        });
        expect(credit2).eq(1);
        expect(coded(core2, "warnings")).eqls([]);

        // with other content, the award's sugar wraps the `<when>` in the
        // answer's type, so it is content, compared with neither input
        const { credit: credit3, core: core3 } = await creditFor({
            doenetML: `<answer name="a"><mathInput name="in"/><mathInput/><award><when>$in = x</when> y</award></answer>`,
            kind: "math",
            value: "x",
        });
        expect(credit3).eq(0);
        expect(coded(core3, "warnings")).eqls([
            "doenet-w0206: This `<award>`'s content is compared with none of the answer's 2 inputs, so it can never earn credit. Compare the inputs in a `<when>`: `<award><when>…</when></award>`.",
        ]);
    });

    it("a when inside a composite is its award's condition, not content", async () => {
        // the award's sugar keeps one composite unwrapped, and the `<when>`
        // it expands to is the award's condition
        for (const doenetML of [
            `<answer name="a"><mathInput name="in"/><mathInput/><award><group><when>$in = x</when></group></award></answer>`,
            `<answer name="a"><mathInput name="in"/><mathInput/><group><when>$in = x</when></group></answer>`,
            `<answer name="a"><mathInput name="in"/><mathInput/><award><conditionalContent condition="true"><when>$in = x</when></conditionalContent></award></answer>`,
            `<group name="g"><when>$in = x</when></group><answer name="a"><mathInput name="in"/><mathInput/><award>$g</award></answer>`,
            `<mathInput name="in" forAnswer="$a"/><answer name="a"><award><group><when>$in = x</when></group></award></answer>`,
        ]) {
            const { credit, core } = await creditFor({
                doenetML,
                kind: "math",
                value: "x",
            });
            expect(credit, doenetML).eq(1);
            expect(coded(core, "warnings"), doenetML).eqls([]);
        }

        // a composite with no `<when>` is still content
        const { credit, core } = await creditFor({
            doenetML: `<answer name="a"><mathInput name="in"/><mathInput/><award><group><math>x</math></group></award></answer>`,
            kind: "math",
            value: "x",
        });
        expect(credit).eq(0);
        expect(coded(core, "warnings")).eqls([
            "doenet-w0206: This `<award>`'s content is compared with none of the answer's 2 inputs, so it can never earn credit. Compare the inputs in a `<when>`: `<award><when>…</when></award>`.",
        ]);
    });

    it("a reference to a when is its value, a boolean compared with the input", async () => {
        const when = `<number name="n">1</number><when name="w">$n = 1</when>`;

        // with no input, it decides a boolean, so a `<booleanInput>` is added
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `${when}<answer name="a">$w</answer>`,
        });
        const answerIdx = await resolvePathToNodeIdx("a");
        let stateVariables = await core.returnAllStateVariables(false, true);
        const inputIdx =
            stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;
        expect(stateVariables[inputIdx].componentType).eq("booleanInput");
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: inputIdx,
            core,
        });
        await submitAnswer({ componentIdx: answerIdx, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[answerIdx].stateValues.creditAchieved).eq(1);
        expect(coded(core, "warnings")).eqls([]);

        // beside a text input, it can never earn credit
        const { credit, core: core2 } = await creditFor({
            doenetML: `${when}<answer name="a"><textInput name="in"/><award>$w</award></answer>`,
            kind: "text",
            value: "true",
        });
        expect(credit).eq(0);
        expect(coded(core2, "warnings")).eqls([
            "doenet-w0205: `$w` gives a `boolean`, which is compared with the answer's `<textInput>`, which gives a `text`, so it can never earn credit. Compare a `text`, or use an input that gives a `boolean`.",
        ]);

        // with two inputs, it is compared with neither
        const { credit: credit3, core: core3 } = await creditFor({
            doenetML: `${when}<answer name="a"><mathInput name="in"/><mathInput/><award>$w</award></answer>`,
            kind: "math",
            value: "x",
        });
        expect(credit3).eq(0);
        expect(coded(core3, "warnings")).eqls([
            "doenet-w0206: This `<award>`'s content is compared with none of the answer's 2 inputs, so it can never earn credit. Compare the inputs in a `<when>`: `<award><when>…</when></award>`.",
        ]);
    });

    it("a when comparing a text input is unchanged", async () => {
        const { credit, core } = await creditFor({
            doenetML: `<answer name="a"><textInput name="in"/><award><when>$in = hello</when></award></answer>`,
            kind: "text",
            value: "hello",
        });
        expect(credit).eq(1);
        expect(coded(core, "warnings")).eqls([]);
    });

    it("a choice answer and type=videoWatched are unchanged", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<answer name="a"><choice credit="1">yes</choice><choice>no</choice></answer>
<video name="v" youtube="tJ4ypc5L6uU" />
<answer name="b" type="videoWatched" video="$v" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const answerIdx = await resolvePathToNodeIdx("a");
        const inputIdx =
            stateVariables[answerIdx].stateValues.inputChildren[0].componentIdx;
        expect(stateVariables[inputIdx].componentType).eq("choiceInput");
        expect(coded(core, "errors")).eqls([]);
        expect(coded(core, "warnings")).eqls([]);
    });

    it("an award copied into an answer with a text input is read as a text", async () => {
        const { credit, core } = await creditFor({
            doenetML: `<answer name="a"><textInput name="in"/><award name="aw">hello</award><award copy="$aw" credit="0.5"/></answer>`,
            kind: "text",
            value: "hello",
        });
        expect(credit).eq(1);
        expect(coded(core, "warnings")).eqls([]);
    });
});

/**
 * The leftovers of #2648 (#2657): D67 decisions 2–5, an `<award copy>` from
 * outside the answer, false `w0206`/`w0207`, wording, and the warnings
 * through composites and an `<answer copy>`.
 */
describe("An answer's type, after #2648 (#2657) @group4", () => {
    function codedOf(core: any, codes: RegExp) {
        const { warnings, errors } = getDiagnosticsByType(core);
        return [...errors, ...warnings]
            .filter((d) => codes.test(d.code ?? ""))
            .map((d) => `${d.code}: ${d.message}`);
    }

    async function answerCredit({
        doenetML,
        kind,
        value,
    }: {
        doenetML: string;
        kind: "math" | "text" | "boolean";
        value: string | boolean;
    }) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const answerIdx = await resolvePathToNodeIdx("a");
        let stateVariables = await core.returnAllStateVariables(false, true);
        const inputs = stateVariables[answerIdx].stateValues.inputChildren;
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
        await submitAnswer({ componentIdx: answerIdx, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        return {
            core,
            credit: stateVariables[answerIdx].stateValues.creditAchieved,
            inputTypes: inputs.map((input: any) => input.componentType),
        };
    }

    it("item 1: a type of videoWatched is trimmed", async () => {
        const { core } = await createTestCore({
            doenetML: `<video name="v" youtube="tJ4ypc5L6uU" />
            <answer name="a" type=" videoWatched " video="$v" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            Object.values(stateVariables).filter(
                (c: any) => c.componentType === "award",
            ).length,
        ).eq(1);
        expect(codedOf(core, /doenet-w0078/)).eqls([]);
    });

    it("item 2: a boolean–number mix of another type than the input gets only w0205", async () => {
        const { core } = await createTestCore({
            doenetML: `<boolean name="b">true</boolean>
            <answer name="a"><booleanInput/><number>$b</number></answer>`,
        });
        expect(codedOf(core, /doenet-w020[35]/)).eqls([
            "doenet-w0205: This `<number>` is compared with the answer's `<booleanInput>`, which gives a `boolean`, so it can never earn credit. Write it as a `boolean`, or use an input of its type.",
        ]);
    });

    it("item 3: a warning about a reference names its value", async () => {
        const { core } = await createTestCore({
            doenetML: `<textInput name="ti"/>
            <answer name="a"><mathInput/><award>$ti</award></answer>`,
        });
        expect(codedOf(core, /doenet-w0205/)).eqls([
            "doenet-w0205: `$ti` gives a `text`, which is compared with the answer's `<mathInput>`, which gives a `math`, so it can never earn credit. Compare a `math`, or use an input that gives a `text`.",
        ]);
    });

    it("item 4: w0078 is at the type attribute, in a choice answer too", async () => {
        const doenetML = `<answer name="a" type="banana"><choice credit="1">x</choice></answer>`;
        const { core } = await createTestCore({ doenetML });
        const w0078 = getDiagnosticsByType(core).warnings.filter(
            (d) => d.code === "doenet-w0078",
        );
        expect(w0078.length).eq(1);
        const start = w0078[0].position!.start.offset!;
        const end = w0078[0].position!.end.offset!;
        expect(doenetML.slice(start, end)).eqls(`type="banana"`);
    });

    it("item 5: an award copied from outside the answer reads its text as the answer's type", async () => {
        const { credit, core } = await answerCredit({
            doenetML: `<award name="aw">hello</award>
            <answer name="a"><textInput/><award copy="$aw"/></answer>`,
            kind: "text",
            value: "hello",
        });
        expect(credit).eq(1);
        expect(codedOf(core, /doenet-w020/)).eqls([]);

        // a math in a math answer is unchanged
        const { credit: credit2 } = await answerCredit({
            doenetML: `<award name="aw">x+x</award>
            <answer name="a"><mathInput/><award copy="$aw"/></answer>`,
            kind: "math",
            value: "2x",
        });
        expect(credit2).eq(1);
    });

    it("item 6: an indexed reference to a repeat of whens is a condition", async () => {
        const { core } = await createTestCore({
            doenetML: `<repeat name="r" for="1 2" valueName="v"><when>$mi1 = $v</when></repeat>
            <answer name="a"><mathInput name="mi1"/><mathInput/><award>$r[1]</award></answer>`,
        });
        expect(codedOf(core, /doenet-w020[67]/)).eqls([]);
    });

    it("item 7: with no input added, no input is named", async () => {
        const { core } = await createTestCore({
            doenetML: `<mathInput name="mi" forAnswer="$a"/>
            <answer name="a"><considerAsResponses>$mi</considerAsResponses><award>1</award></answer>`,
        });
        expect(codedOf(core, /doenet-w020[57]/)).eqls([
            "doenet-w0207: This `<award>`'s content is compared with no input: the answer adds none, and the input written with `forAnswer` is reached only through a `<when>`. Compare that input in a `<when>`, or move it inside the `<answer>`.",
        ]);
    });

    it("item 7: e0092 quotes the type as written", async () => {
        const { core } = await createTestCore({
            doenetML: `<answer name="a" type="Math"><textInput/>x</answer>`,
        });
        expect(codedOf(core, /doenet-e0092/)).eqls([
            'doenet-e0092: This `<answer>` has `type="Math"`, but the `<textInput>` written in it gives a `text`, and its awards compare their content with that input. The `type` is ignored: remove it, or use an input that gives a `math`.',
        ]);
    });

    it("item 8: content of another type inside a composite gets w0205", async () => {
        const { core } = await createTestCore({
            doenetML: `<answer name="a"><textInput/><group><math>x</math></group></answer>`,
        });
        expect(codedOf(core, /doenet-w0205/)).eqls([
            "doenet-w0205: This `<math>` is compared with the answer's `<textInput>`, which gives a `text`, so it can never earn credit. Write it as a `text`, or use an input of its type.",
        ]);
    });

    it("item 9: an answer copy with an award of its own uses its source's input", async () => {
        const { credit, inputTypes } = await answerCredit({
            doenetML: `<answer name="a1"><textInput/><award>hi</award></answer>
            <answer name="a" copy="$a1"><award>yo</award></answer>`,
            kind: "text",
            value: "yo",
        });
        expect(inputTypes).eqls(["textInput"]);
        expect(credit).eq(1);

        const { credit: credit2, inputTypes: inputTypes2 } = await answerCredit(
            {
                doenetML: `<answer name="a1"><award>1</award></answer>
            <answer name="a" copy="$a1"><award>2</award></answer>`,
                kind: "math",
                value: "2",
            },
        );
        expect(inputTypes2).eqls(["mathInput"]);
        expect(credit2).eq(1);
    });

    it("item 10: a copy of a composite with no when, and a when inside a p, are not conditions", async () => {
        const { core } = await createTestCore({
            doenetML: `<group name="g"><math>1</math></group>
            <answer name="a"><mathInput/><mathInput/><award><group copy="$g"/></award></answer>
            <answer name="b"><mathInput/><mathInput/><award><group><p><when>true</when></p></group></award></answer>`,
        });
        expect(codedOf(core, /doenet-w0206/).map((m) => m.slice(0, 12))).eqls([
            "doenet-w0206",
            "doenet-w0206",
        ]);

        // a copy of a composite holding a when may be a condition
        const { core: core2 } = await createTestCore({
            doenetML: `<group name="g"><when>$mi1 = 1</when></group>
            <answer name="a"><mathInput name="mi1"/><mathInput/><award><group copy="$g"/></award></answer>`,
        });
        expect(codedOf(core2, /doenet-w0206/)).eqls([]);
    });

    it("item 13: w0203 for an answer's own content is at the content", async () => {
        const doenetML = `<number name="n">1</number>
<answer name="a"><booleanInput/>$n and true</answer>`;
        const { core } = await createTestCore({ doenetML });
        const w0203 = getDiagnosticsByType(core).warnings.filter(
            (d) => d.code === "doenet-w0203",
        );
        expect(w0203.length).eq(1);
        const start = w0203[0].position!.start.offset!;
        const end = w0203[0].position!.end.offset!;
        expect(doenetML.slice(start, end)).eqls("$n");
    });

    it("item 13: text alone is located between the components written around it, not at a label after it", async () => {
        for (const [doenetML, located] of [
            [
                `<answer name="a"><booleanInput/><label>L</label>1 and true<award><when>true</when></award></answer>`,
                "1 and true",
            ],
            // the label is written after the text, so it doesn't bound it:
            // the whole answer, never an empty range
            [
                `<answer name="a">1 and true<label>L</label><booleanInput/></answer>`,
                `<answer name="a">1 and true<label>L</label><booleanInput/></answer>`,
            ],
        ]) {
            const { core } = await createTestCore({ doenetML });
            const w0203 = getDiagnosticsByType(core).warnings.filter(
                (d) => d.code === "doenet-w0203",
            );
            expect(w0203.length).eq(1);
            const start = w0203[0].position!.start.offset!;
            const end = w0203[0].position!.end.offset!;
            expect(doenetML.slice(start, end)).eqls(located);
        }
    });
});
