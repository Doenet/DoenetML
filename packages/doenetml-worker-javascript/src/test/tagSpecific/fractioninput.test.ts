import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    submitAnswer,
    updateBooleanInputValue,
    updateFractionInputImmediateValue,
    updateFractionInputValue,
    updateFractionInputValueToImmediateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("FractionInput tag tests @group3", async () => {
    it("numerator, denominator, and value", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <fractionInput name="fi" />
    <p>Numerator: <math extend="$fi.numerator" name="num" /></p>
    <p>Denominator: <math extend="$fi.denominator" name="den" /></p>
    <p>Value: <math extend="$fi.value" name="val" /></p>
    `,
        });

        async function check_items(numerator: any, denominator: any) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                    .numerator.tree,
            ).eqls(numerator);
            expect(
                stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                    .denominator.tree,
            ).eqls(denominator);
            const expectedValue =
                numerator === "＿" && denominator === "＿"
                    ? "＿"
                    : ["/", numerator, denominator];
            expect(
                stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                    .value.tree,
            ).eqls(expectedValue);
            expect(
                stateVariables[await resolvePathToNodeIdx("num")].stateValues
                    .value.tree,
            ).eqls(numerator);
            expect(
                stateVariables[await resolvePathToNodeIdx("den")].stateValues
                    .value.tree,
            ).eqls(denominator);
            expect(
                stateVariables[await resolvePathToNodeIdx("val")].stateValues
                    .value.tree,
            ).eqls(expectedValue);
        }

        await check_items("＿", "＿");

        await updateFractionInputValue({
            latex: "2",
            part: "numerator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });
        await check_items(2, "＿");

        await updateFractionInputValue({
            latex: "3",
            part: "denominator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });
        await check_items(2, 3);

        await updateFractionInputValue({
            latex: "x+1",
            part: "numerator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });
        await check_items(["+", "x", 1], 3);
    });

    it("prefill numerator and denominator", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <fractionInput name="fi" prefillNumerator="5" prefillDenominator="x" />
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .numerator.tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .denominator.tree,
        ).eqls("x");
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls(["/", 5, "x"]);
    });

    it("immediate value updates separately from value", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <fractionInput name="fi" />
    `,
        });

        await updateFractionInputImmediateValue({
            latex: "7",
            part: "numerator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .immediateValue.tree,
        ).eqls(["/", 7, "＿"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls("＿");

        await updateFractionInputValueToImmediateValue({
            part: "numerator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls(["/", 7, "＿"]);
    });

    it("fraction input in answer", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <answer name="ans">
        <fractionInput name="fi" />
        <award><math>2/3</math></award>
    </answer>
    `,
        });

        await updateFractionInputValue({
            latex: "2",
            part: "numerator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });
        await updateFractionInputValue({
            latex: "3",
            part: "denominator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);

        await updateFractionInputValue({
            latex: "1",
            part: "numerator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
    });

    it("bindValueTo a fraction, two-way", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="src">2/3</math>
    <fractionInput name="fi" bindValueTo="$src" />
    `,
        });

        async function check(numerator: any, denominator: any) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                    .numerator.tree,
            ).eqls(numerator);
            expect(
                stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                    .denominator.tree,
            ).eqls(denominator);
            expect(
                stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                    .value.tree,
            ).eqls(["/", numerator, denominator]);
            expect(
                stateVariables[await resolvePathToNodeIdx("src")].stateValues
                    .value.tree,
            ).eqls(["/", numerator, denominator]);
        }

        // bound value seeds the two boxes
        await check(2, 3);

        // editing the denominator flows back to the bound math
        await updateFractionInputValue({
            latex: "5",
            part: "denominator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });
        await check(2, 5);
    });

    it("bindValueTo a negative fraction keeps the sign in the numerator", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="src">-2/3</math>
    <fractionInput name="fi" bindValueTo="$src" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .numerator.tree,
        ).eqls(["-", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .denominator.tree,
        ).eqls(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls(["/", ["-", 2], 3]);

        await updateFractionInputValue({
            latex: "5",
            part: "denominator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls(["/", ["-", 2], 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("src")].stateValues.value
                .tree,
        ).eqls(["/", ["-", 2], 5]);
    });

    it("bindValueTo a non-fraction puts it over a denominator of 1", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="src">5</math>
    <fractionInput name="fi" bindValueTo="$src" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .numerator.tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .denominator.tree,
        ).eqls(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls(["/", 5, 1]);

        // filling in the denominator turns it into a fraction, flowing back
        await updateFractionInputValue({
            latex: "2",
            part: "denominator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls(["/", 5, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("src")].stateValues.value
                .tree,
        ).eqls(["/", 5, 2]);
    });

    it("editing the numerator keeps the denominator of 1", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="src">5</math>
    <fractionInput name="fi" bindValueTo="$src" />
    `,
        });

        // denominator seeds to 1; the value stays a fraction (not collapsed),
        // so changing the numerator keeps a denominator of 1
        await updateFractionInputValue({
            latex: "6",
            part: "numerator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls(["/", 6, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("src")].stateValues.value
                .tree,
        ).eqls(["/", 6, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .denominator.tree,
        ).eqls(1);
    });

    it("math child links the value", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <fractionInput name="fi"><math>a/b</math></fractionInput>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .numerator.tree,
        ).eqls("a");
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .denominator.tree,
        ).eqls("b");
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls(["/", "a", "b"]);
    });

    it("reference child links the value two-way", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="src" prefill="2/3" />
    <fractionInput name="fi">$src</fractionInput>
    `,
        });

        async function check(numerator: any, denominator: any) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                    .numerator.tree,
            ).eqls(numerator);
            expect(
                stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                    .denominator.tree,
            ).eqls(denominator);
            expect(
                stateVariables[await resolvePathToNodeIdx("src")].stateValues
                    .value.tree,
            ).eqls(["/", numerator, denominator]);
        }

        await check(2, 3);

        await updateFractionInputValue({
            latex: "5",
            part: "denominator",
            componentIdx: await resolvePathToNodeIdx("fi"),
            core,
        });
        await check(2, 5);
    });

    it("math child with a negative fraction keeps the sign in the numerator", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <fractionInput name="fi"><math>-4/5</math></fractionInput>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .numerator.tree,
        ).eqls(["-", 4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues
                .denominator.tree,
        ).eqls(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("fi")].stateValues.value
                .tree,
        ).eqls(["/", ["-", 4], 5]);
    });

    it("colorInputsSeparately colors numerator and denominator sub-boxes independently", async () => {
        // With colorInputsSeparately, the numerator and denominator boxes
        // of a fractionInput should each be colored based on their respective
        // covering award's result.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <answer name="ans" numAwardsCredited="2" colorInputsSeparately>
    <fractionInput name="fi" />
    <award name="numAward" credit="0.5"><when>$fi.numerator = 2</when></award>
    <award name="denAward" credit="0.5"><when>$fi.denominator = 3</when></award>
  </answer>
  `,
        });

        const ansIdx = await resolvePathToNodeIdx("ans");
        const fiIdx = await resolvePathToNodeIdx("fi");

        // Find the _fractionInputComponent children (numerator and denominator boxes)
        let sv = await core.returnAllStateVariables(false, true);
        const fiAllChildren = sv[fiIdx].activeChildren as {
            componentIdx: number;
            componentType: string;
        }[];
        const subBoxes = fiAllChildren.filter(
            (c) => c.componentType === "_fractionInputComponent",
        );
        expect(subBoxes.length).eq(2);
        const numBoxIdx = subBoxes[0].componentIdx;
        const denBoxIdx = subBoxes[1].componentIdx;

        async function checkBoxCredit(
            numLatex: string,
            denLatex: string,
            expectedNumCredit: number,
            expectedDenCredit: number,
            expectedParentCredit: number,
        ) {
            await updateFractionInputValue({
                latex: numLatex,
                componentIdx: fiIdx,
                part: "numerator",
                core,
            });
            await updateFractionInputValue({
                latex: denLatex,
                componentIdx: fiIdx,
                part: "denominator",
                core,
            });
            await submitAnswer({ componentIdx: ansIdx, core });
            sv = await core.returnAllStateVariables(false, true);
            expect(sv[numBoxIdx].stateValues.creditAchieved).closeTo(
                expectedNumCredit,
                1e-12,
                `numerator credit: expected ${expectedNumCredit}`,
            );
            expect(sv[denBoxIdx].stateValues.creditAchieved).closeTo(
                expectedDenCredit,
                1e-12,
                `denominator credit: expected ${expectedDenCredit}`,
            );
            expect(sv[fiIdx].stateValues.creditAchieved).closeTo(
                expectedParentCredit,
                1e-12,
                `parent fractionInput credit: expected ${expectedParentCredit}`,
            );
        }

        // Both correct: both green (credit=1)
        await checkBoxCredit("2", "3", 1, 1, 1);

        // Only numerator correct: numerator green, denominator red, but the
        // parent fractionInput remains partially correct overall.
        await checkBoxCredit("2", "5", 1, 0, 0.5);

        // Only denominator correct: numerator red, denominator green, but the
        // parent fractionInput remains partially correct overall.
        await checkBoxCredit("7", "3", 0, 1, 0.5);

        // Both wrong: both red
        await checkBoxCredit("7", "5", 0, 0, 0);
    });

    it("colorInputsSeparately works when fractionInput is outside answer via forAnswer", async () => {
        // fractionInput linked to an answer via forAnswer rather than being
        // a direct child — sub-boxes should still be colored independently.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <fractionInput name="fi" forAnswer="$ans" />
  <answer name="ans" numAwardsCredited="2" colorInputsSeparately>
    <award credit="0.5"><when>$fi.numerator = 2</when></award>
    <award credit="0.5"><when>$fi.denominator = 3</when></award>
  </answer>
  `,
        });

        const ansIdx = await resolvePathToNodeIdx("ans");
        const fiIdx = await resolvePathToNodeIdx("fi");

        let sv = await core.returnAllStateVariables(false, true);
        const subBoxes = (
            sv[fiIdx].activeChildren as {
                componentIdx: number;
                componentType: string;
            }[]
        ).filter((c) => c.componentType === "_fractionInputComponent");
        expect(subBoxes.length).eq(2);
        const numBoxIdx = subBoxes[0].componentIdx;
        const denBoxIdx = subBoxes[1].componentIdx;

        async function checkBoxCredit(
            numLatex: string,
            denLatex: string,
            expectedNum: number,
            expectedDen: number,
            expectedParentCredit: number,
        ) {
            await updateFractionInputValue({
                latex: numLatex,
                componentIdx: fiIdx,
                part: "numerator",
                core,
            });
            await updateFractionInputValue({
                latex: denLatex,
                componentIdx: fiIdx,
                part: "denominator",
                core,
            });
            await submitAnswer({ componentIdx: ansIdx, core });
            sv = await core.returnAllStateVariables(false, true);
            expect(sv[numBoxIdx].stateValues.creditAchieved).closeTo(
                expectedNum,
                1e-12,
                `numerator credit: expected ${expectedNum}`,
            );
            expect(sv[denBoxIdx].stateValues.creditAchieved).closeTo(
                expectedDen,
                1e-12,
                `denominator credit: expected ${expectedDen}`,
            );
            expect(sv[fiIdx].stateValues.creditAchieved).closeTo(
                expectedParentCredit,
                1e-12,
                `parent fractionInput credit: expected ${expectedParentCredit}`,
            );
        }

        await checkBoxCredit("2", "3", 1, 1, 1);
        await checkBoxCredit("2", "5", 1, 0, 0.5);
        await checkBoxCredit("7", "3", 0, 1, 0.5);
        await checkBoxCredit("7", "5", 0, 0, 0);
    });

    it("colorInputsSeparately: a correct box is fully credited when its award's credit is above 1", async () => {
        // Each award caps its earned credit at 1, so a satisfied award with
        // credit="2" must give its box credit 1, not 1/2.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <fractionInput name="fi" forAnswer="$ans" />
  <answer name="ans" numAwardsCredited="2" colorInputsSeparately>
    <award credit="2"><when>$fi.numerator = 2</when></award>
    <award credit="2"><when>$fi.denominator = 3</when></award>
  </answer>
  `,
        });

        const ansIdx = await resolvePathToNodeIdx("ans");
        const fiIdx = await resolvePathToNodeIdx("fi");

        let sv = await core.returnAllStateVariables(false, true);
        const subBoxes = (
            sv[fiIdx].activeChildren as {
                componentIdx: number;
                componentType: string;
            }[]
        ).filter((c) => c.componentType === "_fractionInputComponent");
        expect(subBoxes.length).eq(2);
        const numBoxIdx = subBoxes[0].componentIdx;
        const denBoxIdx = subBoxes[1].componentIdx;

        await updateFractionInputValue({
            latex: "2",
            componentIdx: fiIdx,
            part: "numerator",
            core,
        });
        await updateFractionInputValue({
            latex: "5",
            componentIdx: fiIdx,
            part: "denominator",
            core,
        });
        await submitAnswer({ componentIdx: ansIdx, core });

        sv = await core.returnAllStateVariables(false, true);
        expect(sv[ansIdx].stateValues.creditAchieved).eq(1);
        expect(sv[numBoxIdx].stateValues.creditAchieved).eq(1);
        expect(sv[denBoxIdx].stateValues.creditAchieved).eq(0);
    });

    // A `<fractionInput>` with `copy`, `copyWithState` or `extend` has its
    // source's two boxes, and no more (#2614 item 3). It was given two of
    // its own besides, so a copy had four, and an extend reported them as
    // children it ignores.
    describe("made from another fraction input", () => {
        async function setupCopy(attribute: string) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <fractionInput name="fr" />
    <booleanInput name="show" />
    <conditionalContent name="cc">
      <case condition="$show"><fractionInput name="c" ${attribute}="$fr" /></case>
    </conditionalContent>
    `,
            });
            async function sv(name: string) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return stateVariables[await resolvePathToNodeIdx(name)];
            }
            async function parts(name: string) {
                return (await sv(name)).activeChildren.map(
                    (child: any) => child.componentType,
                );
            }
            async function value(name: string) {
                return (await sv(name)).stateValues.value.tree;
            }
            await updateFractionInputValue({
                latex: "2",
                part: "numerator",
                componentIdx: await resolvePathToNodeIdx("fr"),
                core,
            });
            await updateFractionInputValue({
                latex: "3",
                part: "denominator",
                componentIdx: await resolvePathToNodeIdx("fr"),
                core,
            });
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("show"),
                core,
            });
            return { core, resolvePathToNodeIdx, parts, value };
        }

        const twoParts = ["_fractionInputComponent", "_fractionInputComponent"];

        it("copyWithState starts with its source's value, and is typed into on its own", async () => {
            const { core, resolvePathToNodeIdx, parts, value } =
                await setupCopy("copyWithState");
            expect(await parts("cc.c")).eqls(twoParts);
            expect(await value("cc.c")).eqls(["/", 2, 3]);

            await updateFractionInputValue({
                latex: "5",
                part: "numerator",
                componentIdx: await resolvePathToNodeIdx("cc.c"),
                core,
            });
            expect(await value("cc.c")).eqls(["/", 5, 3]);
            expect(await value("fr")).eqls(["/", 2, 3]);
            expect(getDiagnosticsByType(core).warnings).eqls([]);
        });

        it("copy starts blank, and is typed into on its own", async () => {
            const { core, resolvePathToNodeIdx, parts, value } =
                await setupCopy("copy");
            expect(await parts("cc.c")).eqls(twoParts);
            expect(await value("cc.c")).eq("＿");

            await updateFractionInputValue({
                latex: "5",
                part: "denominator",
                componentIdx: await resolvePathToNodeIdx("cc.c"),
                core,
            });
            expect(await value("cc.c")).eqls(["/", "＿", 5]);
            expect(await value("fr")).eqls(["/", 2, 3]);
            expect(getDiagnosticsByType(core).warnings).eqls([]);
        });

        it("extend shows its source's value, with no warning", async () => {
            const { core, resolvePathToNodeIdx, parts, value } =
                await setupCopy("extend");
            expect(await parts("cc.c")).eqls(twoParts);
            expect(await value("cc.c")).eqls(["/", 2, 3]);

            await updateFractionInputValue({
                latex: "7",
                part: "numerator",
                componentIdx: await resolvePathToNodeIdx("cc.c"),
                core,
            });
            expect(await value("cc.c")).eqls(["/", 7, 3]);
            expect(await value("fr")).eqls(["/", 7, 3]);
            // no `doenet-w0169` for children it ignores
            expect(getDiagnosticsByType(core).warnings).eqls([]);
        });
    });

    // A `<fractionInput>` made from a property of another, a math, had no
    // boxes and showed `＿` (#2623 item 4). It is what the same tag made from
    // any math gives, as for `<mathInput extend="$g.value"/>`: an input isn't
    // the same thing as its value, an error that says how to edit the value
    // (`doenet-e0062`, REF-5).
    describe("made from a property of another fraction input", () => {
        for (const [tag, written] of [
            ["fractionInput", `extend="$g.value"`],
            ["fractionInput", `copy="$g.numerator"`],
            ["fractionInput", `copyWithState="$g.denominator"`],
            ["mathInput", `extend="$g.value"`],
        ]) {
            it(`<${tag} ${written}/> is an error, as from a math`, async () => {
                const source = written.split('"')[1];
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
<fractionInput name="g"/>
<${tag} name="f" ${written}/>
<math name="m">1/2</math>
<${tag} name="fm" extend="$m"/>
`,
                });
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                expect(
                    stateVariables[await resolvePathToNodeIdx("f")]
                        .componentType,
                ).eq("_error");
                const { errors, warnings } = getDiagnosticsByType(core);
                expect(warnings).eqls([]);
                expect(errors.map((e) => e.code)).eqls([
                    "doenet-e0062",
                    "doenet-e0062",
                ]);
                expect(errors[0].message).contains(
                    `A \`<${tag}>\` can't be made from \`${source}\`, a \`<math>\`: an input isn't the same thing as its value. To edit \`${source}\`, write \`<${tag} bindValueTo="${source}"/>\`.`,
                );
                expect(errors[0].position?.start.line).eq(3);
            });
        }

        it("from the fraction input itself it has its two boxes", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
<fractionInput name="g"/>
<fractionInput name="f" extend="$g"/>
`,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("f")
                ].activeChildren.map((child: any) => child.componentType),
            ).eqls(["_fractionInputComponent", "_fractionInputComponent"]);
            expect(getDiagnosticsByType(core).errors).eqls([]);
        });
    });
});
