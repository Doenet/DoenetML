import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Boolean Operator tag tests", async () => {
    it("isinteger, is number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n"/>
    <number name="asNum">$n</number>
    <p>
    <isInteger name="int1">$n</isInteger>
    <isInteger name="int2">$asNum</isInteger>
    <boolean name="int3">isinteger($n)</boolean>
    <boolean name="int4">isinteger($asNum)</boolean>
    <isInteger name="int5">$n/2</isInteger>
    <isInteger name="int6">$asNum/2</isInteger>
    <isInteger name="int7">5</isInteger>
    <isInteger name="int8">5.3</isInteger>
    <isNumber name="num1">$n</isNumber>
    <isNumber name="num2">$asNum</isNumber>
    <boolean name="num3">isnumber($n)</boolean>
    <boolean name="num4">isnumber($asNum)</boolean>
    <isNumber name="num5">$n/2</isNumber>
    <isNumber name="num6">$asNum/2</isNumber>
    <isNumber name="num7">5</isNumber>
    <isNumber name="num8">5.3</isNumber>
    </p>
    `,
        });

        async function check_items(
            isNumber: boolean,
            isInteger: boolean,
            isEven: boolean,
        ) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("int1")].stateValues
                    .value,
            ).eq(isInteger);
            expect(
                stateVariables[await resolvePathToNodeIdx("int2")].stateValues
                    .value,
            ).eq(isInteger);
            expect(
                stateVariables[await resolvePathToNodeIdx("int3")].stateValues
                    .value,
            ).eq(isInteger);
            expect(
                stateVariables[await resolvePathToNodeIdx("int4")].stateValues
                    .value,
            ).eq(isInteger);
            expect(
                stateVariables[await resolvePathToNodeIdx("int5")].stateValues
                    .value,
            ).eq(isEven);
            expect(
                stateVariables[await resolvePathToNodeIdx("int6")].stateValues
                    .value,
            ).eq(isEven);
            expect(
                stateVariables[await resolvePathToNodeIdx("int7")].stateValues
                    .value,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("int8")].stateValues
                    .value,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("num1")].stateValues
                    .value,
            ).eq(isNumber);
            expect(
                stateVariables[await resolvePathToNodeIdx("num2")].stateValues
                    .value,
            ).eq(isNumber);
            expect(
                stateVariables[await resolvePathToNodeIdx("num3")].stateValues
                    .value,
            ).eq(isNumber);
            expect(
                stateVariables[await resolvePathToNodeIdx("num4")].stateValues
                    .value,
            ).eq(isNumber);
            expect(
                stateVariables[await resolvePathToNodeIdx("num5")].stateValues
                    .value,
            ).eq(isNumber);
            expect(
                stateVariables[await resolvePathToNodeIdx("num6")].stateValues
                    .value,
            ).eq(isNumber);
            expect(
                stateVariables[await resolvePathToNodeIdx("num7")].stateValues
                    .value,
            ).eq(true);
            expect(
                stateVariables[await resolvePathToNodeIdx("num8")].stateValues
                    .value,
            ).eq(true);
        }

        let isNumber = false;
        let isInteger = false;
        let isEven = false;

        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "36",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = true;
        isInteger = true;
        isEven = true;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "37",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = true;
        isInteger = true;
        isEven = false;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "37.1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = true;
        isInteger = false;
        isEven = false;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "42/3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = true;
        isInteger = true;
        isEven = true;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "-39.6/3.3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = true;
        isInteger = true;
        isEven = true;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = false;
        isInteger = false;
        isEven = false;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "\\sqrt{4}",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = true;
        isInteger = true;
        isEven = true;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "2\\sin(\\pi/4)^2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = true;
        isInteger = true;
        isEven = false;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "1E-300",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = true;
        isInteger = false;
        isEven = false;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "-0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = true;
        isInteger = true;
        isEven = true;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "0/0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = false;
        isInteger = false;
        isEven = false;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "10/0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = false;
        isInteger = false;
        isEven = false;
        await check_items(isNumber, isInteger, isEven);

        await updateMathInputValue({
            latex: "10/-0",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        isNumber = false;
        isInteger = false;
        isEven = false;
        await check_items(isNumber, isInteger, isEven);
    });
    it("isinteger, is number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="x"/>
    <mathInput name="x1"/>
    <mathInput name="x2"/>
    <booleanInput name="strict" />

    <isBetween name="ib" limits="$x1 $x2" strict="$strict">$x</isBetween>
    `,
        });

        async function check_items(
            x: number,
            x1: number,
            x2: number,
            strict: boolean,
        ) {
            let xMin = Math.min(x1, x2);
            let xMax = Math.max(x1, x2);

            let isBetween = strict
                ? xMin < x && x < xMax
                : xMin <= x && x <= xMax;
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("ib")].stateValues
                    .value,
            ).eq(isBetween);
        }

        // non-numerical values
        let x = NaN,
            x1 = NaN,
            x2 = NaN,
            strict = false;
        await check_items(x, x1, x2, strict);

        // (3,3,3,false)
        x = 3;
        x1 = 3;
        x2 = 3;
        await updateMathInputValue({
            latex: x.toString(),
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });
        await updateMathInputValue({
            latex: x1.toString(),
            componentIdx: await resolvePathToNodeIdx("x1"),
            core,
        });
        await updateMathInputValue({
            latex: x2.toString(),
            componentIdx: await resolvePathToNodeIdx("x2"),
            core,
        });
        await check_items(x, x1, x2, strict);

        // (3,3,3,true)
        strict = true;
        await updateBooleanInputValue({
            boolean: strict,
            componentIdx: await resolvePathToNodeIdx("strict"),
            core,
        });
        await check_items(x, x1, x2, strict);

        // (3,3,5,true)
        x2 = 5;
        await updateMathInputValue({
            latex: x2.toString(),
            componentIdx: await resolvePathToNodeIdx("x2"),
            core,
        });
        await check_items(x, x1, x2, strict);

        // (3,3,5,false)
        strict = false;
        await updateBooleanInputValue({
            boolean: strict,
            componentIdx: await resolvePathToNodeIdx("strict"),
            core,
        });
        await check_items(x, x1, x2, strict);

        // (3,4,5,false)
        x = 4;
        await updateMathInputValue({
            latex: x.toString(),
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });
        await check_items(x, x1, x2, strict);

        // (3,4,5,true)
        strict = true;
        await updateBooleanInputValue({
            boolean: strict,
            componentIdx: await resolvePathToNodeIdx("strict"),
            core,
        });
        await check_items(x, x1, x2, strict);

        // (3,8,5,true)
        x1 = 8;
        await updateMathInputValue({
            latex: x1.toString(),
            componentIdx: await resolvePathToNodeIdx("x1"),
            core,
        });
        await check_items(x, x1, x2, strict);

        // (7,8,5,true)
        x = 7;
        await updateMathInputValue({
            latex: x.toString(),
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });
        await check_items(x, x1, x2, strict);

        // (7,8,8,true)
        x2 = 8;
        await updateMathInputValue({
            latex: x2.toString(),
            componentIdx: await resolvePathToNodeIdx("x2"),
            core,
        });
        await check_items(x, x1, x2, strict);

        // (7,8,8,false)
        strict = false;
        await updateBooleanInputValue({
            boolean: strict,
            componentIdx: await resolvePathToNodeIdx("strict"),
            core,
        });
        await check_items(x, x1, x2, strict);
    });
});
