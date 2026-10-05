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

        it("a click on a reference to a click target is a click on it", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">7</number>
    <number name="count">0</number>
    <p name="p">$n</p>
    <updateValue target="$count" newValue="$count+1" triggerWhenObjectsClicked="$n" />
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
    },
);
