import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    clickComponent,
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * References drawn inline (Doenet/DoenetML#2128, step 3): a bare `$n` in a
 * component that renders its children, such as `<p>The value is $n.</p>`, is
 * drawn by the renderer of the referenced value's type.
 *
 * These tests pin what the reader sees, what a `<collect>` finds and what
 * happens to the rest of the document. They read the renderer instructions
 * the core sends, so the suite does not run on the Rust core.
 */
describe.skipIf(process.env.DOENET_TEST_CORE === "rust")(
    "Drawn value references @group2",
    () => {
        /**
         * What `parentName` draws, in order: each string, and for each
         * renderer `[rendererType, componentType, the text or LaTeX it is
         * sent]`.
         */
        async function drawn(
            core: any,
            resolvePathToNodeIdx: any,
            name: string,
        ) {
            const rendererState =
                core.core.rendererInstructionBuilder.rendererState;
            return rendererState[
                await resolvePathToNodeIdx(name)
            ].childrenInstructions
                .filter((child: any) => child !== null)
                .map((child: any) => {
                    if (typeof child === "string") {
                        return child;
                    }
                    const stateValues =
                        rendererState[child.componentIdx].stateValues;
                    return [
                        child.rendererType,
                        child.componentType,
                        stateValues.latex ?? stateValues.text,
                    ];
                });
        }

        /** The renderer state sent for each renderer `name` draws. */
        async function drawnStates(
            core: any,
            resolvePathToNodeIdx: any,
            name: string,
        ) {
            const rendererState =
                core.core.rendererInstructionBuilder.rendererState;
            return rendererState[
                await resolvePathToNodeIdx(name)
            ].childrenInstructions
                .filter((child: any) => child?.componentIdx !== undefined)
                .map(
                    (child: any) =>
                        rendererState[child.componentIdx].stateValues,
                );
        }

        async function textOf(
            core: any,
            resolvePathToNodeIdx: any,
            name: string,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .text;
        }

        it("a reference in a paragraph, label, cell or the document is drawn as its value's type", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n" displayDigits="2">5.4321</number>
    <math name="m">x+1</math>
    <text name="t">hi</text>
    <boolean name="b">true</boolean>
    <mathInput name="mi" prefill="y" />
    <p name="p">A $n B $m C $t D $b E $mi F $n.value</p>
    <booleanInput name="bi"><label name="l">Check $n</label></booleanInput>
    <tabular><row><cell name="c">$m</cell></row></tabular>
    <section name="s">$t</section>
    $b
    `,
            });

            expect(await drawn(core, resolvePathToNodeIdx, "p")).eqls([
                "A ",
                ["number", "number", "5.4"],
                " B ",
                ["math", "math", "x + 1"],
                " C ",
                ["text", "text", "hi"],
                " D ",
                ["boolean", "boolean", "true"],
                " E ",
                ["math", "math", "y"],
                " F ",
                ["number", "number", "5.4"],
            ]);
            expect(await textOf(core, resolvePathToNodeIdx, "p")).eq(
                "A 5.4 B x + 1 C hi D true E y F 5.4",
            );
            expect(await textOf(core, resolvePathToNodeIdx, "l")).eq(
                "Check 5.4",
            );
            expect(await drawn(core, resolvePathToNodeIdx, "c")).eqls([
                ["math", "math", "x + 1"],
            ]);
            expect(await drawn(core, resolvePathToNodeIdx, "s")).eqls([
                ["text", "text", "hi"],
            ]);
            // the document's last child is the `$b` written in it
            expect(
                (await drawn(core, resolvePathToNodeIdx, "_document1")).at(-1),
            ).eqls(["boolean", "boolean", "true"]);
        });

        it("what is drawn follows the referent", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi" prefill="x" />
    <mathInput name="dd" prefill="3" />
    <number name="n" displayDigits="$dd">3.14159</number>
    <booleanInput name="bi" />
    <p name="p">$mi and $n and $bi</p>
    `,
            });

            expect(await drawn(core, resolvePathToNodeIdx, "p")).eqls([
                ["math", "math", "x"],
                " and ",
                ["number", "number", "3.14"],
                " and ",
                ["boolean", "boolean", "false"],
            ]);

            await updateMathInputValue({
                latex: "y^2",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("dd"),
                core,
            });
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("bi"),
                core,
            });

            expect(await drawn(core, resolvePathToNodeIdx, "p")).eqls([
                ["math", "math", "y^{2}"],
                " and ",
                ["number", "number", "3.1416"],
                " and ",
                ["boolean", "boolean", "true"],
            ]);
            expect(await textOf(core, resolvePathToNodeIdx, "p")).eq(
                "y² and 3.1416 and true",
            );
        });

        it("a reference is shown as its referent is: hidden with it, in its style and typesetting", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <booleanInput name="h" prefill="true" />
    <text name="t" hide="$h">secret</text>
    <number name="n" renderAsMath styleNumber="2">5</number>
    <math name="m" renderMode="display">x</math>
    <p name="pHidden">A $t B $t.value</p>
    <p name="pStyle">$n $n.value $m</p>
    `,
            });

            expect(await textOf(core, resolvePathToNodeIdx, "pHidden")).eq(
                "A  B secret",
            );
            expect(await drawn(core, resolvePathToNodeIdx, "pHidden")).eqls([
                "A ",
                " B ",
                ["text", "text", "secret"],
            ]);

            await updateBooleanInputValue({
                boolean: false,
                componentIdx: await resolvePathToNodeIdx("h"),
                core,
            });
            expect(await textOf(core, resolvePathToNodeIdx, "pHidden")).eq(
                "A secret B secret",
            );

            // `$n` is a copy of `n`, with its attributes; `$n.value` is a
            // number holding `n`'s value, with none of them
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const nStyle =
                stateVariables[await resolvePathToNodeIdx("n")].stateValues
                    .selectedStyle;
            const [nState, nValueState, mState] = await drawnStates(
                core,
                resolvePathToNodeIdx,
                "pStyle",
            );
            expect(nState.renderAsMath).eq(true);
            expect(nState.selectedStyle).eqls(nStyle);
            expect(nValueState.renderAsMath).eq(false);
            expect(nValueState.selectedStyle).not.eqls(nStyle);
            expect(mState.renderMode).eq("display");
        });

        it("a reference with nothing to read draws nothing, until it has something", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">1 2</numberList>
    <mathInput name="i" prefill="3" />
    <p name="p">[$l[$i]]</p>
    `,
            });

            expect(await textOf(core, resolvePathToNodeIdx, "p")).eq("[]");
            expect(await drawn(core, resolvePathToNodeIdx, "p")).eqls([
                "[",
                "]",
            ]);

            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("i"),
                core,
            });
            expect(await textOf(core, resolvePathToNodeIdx, "p")).eq("[2]");
            expect(await drawn(core, resolvePathToNodeIdx, "p")).eqls([
                "[",
                ["number", "number", "2"],
                "]",
            ]);
        });

        it("a collect finds an inline reference as a component of its type", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n" displayDigits="2">3.14159</number>
    <p name="p">The value is $n.</p>
    <collect name="c" componentType="number" from="$p" />
    <p name="pc">$c</p>
    <math name="m">$c + 1</math>
    `,
            });

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const collected =
                stateVariables[await resolvePathToNodeIdx("c")].replacements;
            expect(collected).toHaveLength(1);
            expect(collected[0].componentType).eq("number");
            expect(
                stateVariables[collected[0].componentIdx].stateValues.value,
            ).eq(3.14159);
            expect(
                stateVariables[collected[0].componentIdx].stateValues.text,
            ).eq("3.1");
            expect(await textOf(core, resolvePathToNodeIdx, "pc")).eq("3.1");
            expect(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .value.tree,
            ).eqls(["+", 3.14159, 1]);
        });

        it("a collect of a reference to a component takes the referent's settings, and its copies keep its value", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <booleanInput name="h" />
    <math name="m" hide="$h" styleNumber="3" renderMode="display">x+1</math>
    <text name="t" hide="$h" styleNumber="4">hi</text>
    <mathInput name="mi" prefill="y" />
    <p name="p">$m $t $mi</p>
    <collect name="cm" componentType="math" from="$p" />
    <collect name="ct" componentType="text" from="$p" />
    <math name="copied" copy="$cm[2]" />
    `,
            });

            async function collected(name: string) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return stateVariables[
                    await resolvePathToNodeIdx(name)
                ].replacements!.map((r: any) => {
                    const { hidden, styleNumber, renderMode, text } =
                        stateVariables[r.componentIdx].stateValues;
                    return { hidden, styleNumber, renderMode, text };
                });
            }

            expect(await collected("cm")).eqls([
                {
                    hidden: false,
                    styleNumber: 3,
                    renderMode: "display",
                    text: "x + 1",
                },
                {
                    hidden: false,
                    styleNumber: 1,
                    renderMode: "inline",
                    text: "y",
                },
            ]);
            expect(await collected("ct")).eqls([
                {
                    hidden: false,
                    styleNumber: 4,
                    renderMode: undefined,
                    text: "hi",
                },
            ]);
            // an unlinked copy of what was collected for `$mi`
            expect(await textOf(core, resolvePathToNodeIdx, "copied")).eq("y");

            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("h"),
                core,
            });
            expect((await collected("cm")).map((c: any) => c.hidden)).eqls([
                true,
                false,
            ]);
            expect((await collected("ct")).map((c: any) => c.hidden)).eqls([
                true,
            ]);
        });

        it("a collect does not find a reference with nothing to read", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">7 8</numberList>
    <mathInput name="i" prefill="2" />
    <p name="p">[$l[$i]]</p>
    <collect name="c" componentType="number" from="$p" />
    <p name="pc">[$c]</p>
    `,
            });

            expect(await textOf(core, resolvePathToNodeIdx, "pc")).eq("[8]");

            await updateMathInputValue({
                latex: "3",
                componentIdx: await resolvePathToNodeIdx("i"),
                core,
            });
            expect(await textOf(core, resolvePathToNodeIdx, "p")).eq("[]");
            expect(await textOf(core, resolvePathToNodeIdx, "pc")).eq("[]");

            await updateMathInputValue({
                latex: "1",
                componentIdx: await resolvePathToNodeIdx("i"),
                core,
            });
            expect(await textOf(core, resolvePathToNodeIdx, "pc")).eq("[7]");
        });

        it("a click on a reference to a click target is a click on it, and a focus a focus", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">7</number>
    <number name="count">0</number>
    <p name="p">$n</p>
    <number name="focusCount">0</number>
    <updateValue target="$count" newValue="$count+1" triggerWhenObjectsClicked="$n" />
    <updateValue target="$focusCount" newValue="$focusCount+1" triggerWhenObjectsFocused="$n" />
    `,
            });

            const rendererState = (core as any).core.rendererInstructionBuilder
                .rendererState;
            const instruction = rendererState[
                await resolvePathToNodeIdx("p")
            ].childrenInstructions.find((child: any) => child?.componentIdx);
            expect(
                rendererState[instruction.componentIdx].stateValues.clickTarget,
            ).eq(true);

            await clickComponent({
                componentIdx: instruction.actions.numberClicked.componentIdx,
                actionName: "numberClicked",
                core,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("count")].stateValues
                    .value,
            ).eq(1);

            // and a focus on it is a focus on it
            await clickComponent({
                componentIdx: instruction.actions.numberFocused.componentIdx,
                actionName: "numberFocused",
                core,
            });
            const afterFocus = await core.returnAllStateVariables(false, true);
            expect(
                afterFocus[await resolvePathToNodeIdx("focusCount")].stateValues
                    .value,
            ).eq(1);
        });

        it("an index written as an element finds its entry in a paragraph and in a math", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">100 300 200 50</numberList>
    <p name="p">$l[<indexOf target="200">$l</indexOf>]</p>
    <math name="m">$l[<indexOf target="300">$l</indexOf>]</math>
    `,
            });

            expect(await textOf(core, resolvePathToNodeIdx, "p")).eq("200");
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .value.tree,
            ).eq(300);
        });

        it("an answer in a repeat iteration with a drawn reference keeps its submission when the iteration is withheld", async () => {
            const doenetML = `
    <mathInput name="n" prefill="1" />
    <repeatForSequence valueName="v" length="$n" name="r">
        <p name="p">$v + $v = <answer name="ans">2$v</answer></p>
    </repeatForSequence>
    `;
            let { core, resolvePathToNodeIdx, scoreState } =
                await createTestCore({ doenetML });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const ansIdx = await resolvePathToNodeIdx("r[1].ans");
            await updateMathInputValue({
                latex: "2",
                componentIdx:
                    stateVariables[ansIdx].activeChildren[0].componentIdx,
                core,
            });
            await submitAnswer({ componentIdx: ansIdx, core });

            ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
                doenetML,
                initialState: scoreState.state,
            }));
            await updateMathInputValue({
                latex: "0",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            await core.saveImmediately();

            ({ core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                initialState: scoreState.state,
            }));
            await updateMathInputValue({
                latex: "1",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            const ans = stateVariables[await resolvePathToNodeIdx("r[1].ans")];
            expect(ans.stateValues.creditAchieved).eq(1);
            expect(ans.stateValues.justSubmitted).eq(true);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("r[1].p")
                ].stateValues.text.trim(),
            ).eq("1 + 1 =");
        });

        it("an unlinked copy of a drawn reference takes its value and settings as they are", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l" displayDigits="2">5.1234 9.1234 7.1234</numberList>
    <mathList name="ml">x y+1</mathList>
    <textList name="tl">b a</textList>
    <p><sort name="s">$l</sort> <sort name="sm">$ml</sort> <sort name="st">$tl</sort></p>
    <number name="u1" copy="$s[2]" />
    <math name="u2" copy="$sm[2]" />
    <text name="u3" copy="$st[2]" />
    <p name="pu">$u1 | $u2 | $u3</p>
    `,
            });

            expect(await textOf(core, resolvePathToNodeIdx, "pu")).eq(
                "7.1 | y + 1 | b",
            );
        });

        it("an unlinked copy of a drawn copy of a component keeps that component's settings, and does not follow it", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi" prefill="x+x" />
    <math name="m" simplify styleNumber="3" renderMode="display" hide>$mi</math>
    <text name="t" styleNumber="4">hi</text>
    <p><group name="gm">$m</group> <group name="gt">$t</group></p>
    <math name="um" copy="$gm[1]" />
    <text name="ut" copy="$gt[1]" />
    `,
            });

            async function copies() {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const um =
                    stateVariables[await resolvePathToNodeIdx("um")]
                        .stateValues;
                const ut =
                    stateVariables[await resolvePathToNodeIdx("ut")]
                        .stateValues;
                return [
                    um.latex,
                    um.simplify,
                    um.styleNumber,
                    um.renderMode,
                    um.hidden,
                    ut.value,
                    ut.styleNumber,
                    ut.hidden,
                ];
            }
            const expected = [
                "2 x",
                "full",
                3,
                "display",
                true,
                "hi",
                4,
                false,
            ];

            expect(await copies()).eqls(expected);
            await updateMathInputValue({
                latex: "y",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            expect(await copies()).eqls(expected);
        });

        it("a drawn reference is updated in place, not drawn anew, when its value changes", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi" prefill="x" />
    <p name="p">A $mi B</p>
    `,
            });

            const builder = (core as any).core.rendererInstructionBuilder;
            const pIdx = await resolvePathToNodeIdx("p");
            const instructions =
                builder.rendererState[pIdx].childrenInstructions;

            for (const latex of ["y", "z"]) {
                await updateMathInputValue({
                    latex,
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
            }

            expect(builder.rendererState[pIdx].childrenInstructions).eq(
                instructions,
            );
            expect(await drawn(core, resolvePathToNodeIdx, "p")).eqls([
                "A ",
                ["math", "math", "z"],
                " B",
            ]);
        });
    },
);
