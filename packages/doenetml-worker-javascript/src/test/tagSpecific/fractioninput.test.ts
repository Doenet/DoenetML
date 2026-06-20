import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
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
});
