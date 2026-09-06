import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Boolean Operator tag tests @group4", async () => {
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
    it("allowUnits excludes quantities written with a unit", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n"/>
    <isNumber name="num">$n</isNumber>
    <isNumber name="numNoUnits" allowUnits="false">$n</isNumber>
    <boolean name="numFn">isnumber($n)</boolean>
    <boolean name="numFnNoUnits" allowUnits="false">isnumber($n)</boolean>
    <isInteger name="int">$n</isInteger>
    <isInteger name="intNoUnits" allowUnits="false">$n</isInteger>
    <boolean name="intFn">isinteger($n)</boolean>
    <boolean name="intFnNoUnits" allowUnits="false">isinteger($n)</boolean>
    `,
        });

        // The component and function spellings of each check must agree, so
        // every expectation is asserted against both.
        async function check_items({
            isNumber,
            isNumberNoUnits,
            isInteger,
            isIntegerNoUnits,
        }: {
            isNumber: boolean;
            isNumberNoUnits: boolean;
            isInteger: boolean;
            isIntegerNoUnits: boolean;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const expected = {
                num: isNumber,
                numFn: isNumber,
                numNoUnits: isNumberNoUnits,
                numFnNoUnits: isNumberNoUnits,
                int: isInteger,
                intFn: isInteger,
                intNoUnits: isIntegerNoUnits,
                intFnNoUnits: isIntegerNoUnits,
            };
            for (const [name, value] of Object.entries(expected)) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .value,
                    name,
                ).eq(value);
            }
        }

        async function set_input(latex: string) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
        }

        // A percent evaluates to a number, so only `allowUnits="false"`
        // rejects it.
        await set_input("50\\%");
        await check_items({
            isNumber: true,
            isNumberNoUnits: false,
            isInteger: false,
            isIntegerNoUnits: false,
        });

        // `100%` is 1, an integer, until units are excluded.
        await set_input("100\\%");
        await check_items({
            isNumber: true,
            isNumberNoUnits: false,
            isInteger: true,
            isIntegerNoUnits: false,
        });

        // A unit anywhere in the expression is enough to reject it.
        await set_input("50\\%+0");
        await check_items({
            isNumber: true,
            isNumberNoUnits: false,
            isInteger: false,
            isIntegerNoUnits: false,
        });

        // The decimal a percent equals is still accepted, which is the whole
        // point of the attribute.
        await set_input("0.5");
        await check_items({
            isNumber: true,
            isNumberNoUnits: true,
            isInteger: false,
            isIntegerNoUnits: false,
        });

        // As is any other unit-free way of writing it.
        await set_input("\\frac{1}{2}");
        await check_items({
            isNumber: true,
            isNumberNoUnits: true,
            isInteger: false,
            isIntegerNoUnits: false,
        });

        await set_input("3");
        await check_items({
            isNumber: true,
            isNumberNoUnits: true,
            isInteger: true,
            isIntegerNoUnits: true,
        });

        // `allowUnits` changes nothing about what is not a number at all.
        await set_input("x");
        await check_items({
            isNumber: false,
            isNumberNoUnits: false,
            isInteger: false,
            isIntegerNoUnits: false,
        });
    });

    it("allowUnits on an answer reaches isnumber inside a when", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <answer name="ans">
      <mathInput name="mi"/>
      <award name="award"><when>isnumber($mi) and 0 <= $mi <= 1</when></award>
    </answer>
    <answer name="ansNoUnits" allowUnits="false">
      <mathInput name="miNoUnits"/>
      <award name="awardNoUnits"><when>isnumber($miNoUnits) and 0 <= $miNoUnits <= 1</when></award>
    </answer>
    `,
        });

        async function check_credit(award: number, awardNoUnits: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("award")].stateValues
                    .creditAchievedIfSubmit,
                "award",
            ).eq(award);
            expect(
                stateVariables[await resolvePathToNodeIdx("awardNoUnits")]
                    .stateValues.creditAchievedIfSubmit,
                "awardNoUnits",
            ).eq(awardNoUnits);
        }

        async function set_inputs(latex: string) {
            for (const name of ["mi", "miNoUnits"]) {
                await updateMathInputValue({
                    latex,
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            }
        }

        // `allowUnits` set on the answer reaches the `<when>` through the
        // `<award>`, so only the second answer rejects a percent.
        await set_inputs("50\\%");
        await check_credit(1, 0);

        await set_inputs("0.5");
        await check_credit(1, 1);
    });
    it("isNumber and isInteger inherit allowUnits from an enclosing component", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <answer name="ans" allowUnits="false">
      <mathInput name="mi" prefill="100%"/>
      <award><when><isNumber name="numInWhen">$mi</isNumber></when></award>
      <award><when><isInteger name="intInWhen">$mi</isInteger></when></award>
    </answer>
    <boolean name="wrapper" allowUnits="false"><isNumber name="numInBoolean">100%</isNumber></boolean>
    <p><isNumber name="numOutside">100%</isNumber></p>
    <p><isInteger name="intOutside">100%</isInteger></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        async function value(name: string) {
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .value;
        }

        // The tag spelling follows the same answer -> award -> when chain the
        // `isnumber(...)` function spelling follows, so both react to
        // `allowUnits` on the answer.
        expect(await value("numInWhen"), "numInWhen").eq(false);
        expect(await value("intInWhen"), "intInWhen").eq(false);

        // The fall-back is to whatever component encloses the tag, not to the
        // answer specifically.
        expect(await value("numInBoolean"), "numInBoolean").eq(false);

        // Nothing encloses these but a `<p>`, which has no `allowUnits`, so
        // they keep their own default of allowing units.
        expect(await value("numOutside"), "numOutside").eq(true);
        expect(await value("intOutside"), "intOutside").eq(true);
    });

    it("allowUnits looks at the expression as written, before simplification", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="cancelingUnits">isnumber(50% - 50%)</boolean>
    <boolean name="cancelingUnitsNoUnits" allowUnits="false">isnumber(50% - 50%)</boolean>
    <isNumber name="tagSimplifies">x-x</isNumber>
    <boolean name="fnSimplifies">isnumber(x-x)</boolean>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        async function value(name: string) {
            return stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .value;
        }

        // The function spelling simplifies before evaluating, so `50% - 50%`
        // is worth 0. `allowUnits="false"` still refuses it, because the unit
        // test runs against the expression as written.
        expect(await value("cancelingUnits"), "cancelingUnits").eq(true);
        expect(
            await value("cancelingUnitsNoUnits"),
            "cancelingUnitsNoUnits",
        ).eq(false);

        // That simplification is the one respect in which the two spellings
        // still differ: `x-x` has no numeric value until it is simplified, so
        // only the function spelling calls it a number.
        expect(await value("tagSimplifies"), "tagSimplifies").eq(false);
        expect(await value("fnSimplifies"), "fnSimplifies").eq(true);
    });
});
