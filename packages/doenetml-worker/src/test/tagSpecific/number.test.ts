import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveNumber,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
} from "../utils/actions";
import { test_in_graph } from "../utils/in-graph";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Number tag tests", async () => {
    it("1+1", async () => {
        let core = await createTestCore({
            doenetML: `
      $_number1{name="num"}
      <number>1+1</number>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/num"].stateValues.value).eq(2);
        expect(stateVariables["/_number1"].stateValues.value).eq(2);
    });

    it(`number that isn't a number`, async () => {
        let core = await createTestCore({
            doenetML: `
      $_number1{name="num"}
      <number>x+1</number>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/num"].stateValues.value).eqls(NaN);
        expect(stateVariables["/_number1"].stateValues.value).eqls(NaN);
    });

    it(`number becomes non-numeric through inverse`, async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="n">5</number>
      <mathinput name="mi" bindValueTo="$n" />
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(5);

        await updateMathInputValue({ latex: "x", name: "/mi", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eqls(NaN);

        await updateMathInputValue({ latex: "9", name: "/mi", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(9);
    });

    it("number in math", async () => {
        let core = await createTestCore({
            doenetML: `
      <math>x+<number>3</number></math>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            "x",
            3,
        ]);
        expect(stateVariables["/_number1"].stateValues.value).to.eq(3);
    });

    it("math in number", async () => {
        let core = await createTestCore({
            doenetML: `
      <number><math>5+<math>3</math></math></number>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_math1"].stateValues.value.tree).eqls([
            "+",
            5,
            3,
        ]);
        expect(stateVariables["/_math2"].stateValues.value.tree).eq(3);
        expect(stateVariables["/_number1"].stateValues.value).eq(8);
    });

    it("number converts to decimals", async () => {
        let core = await createTestCore({
            doenetML: `
      <number>log(0.5/0.3)</number>, 
      <math>$_number1</math>
      `,
        });

        let num = Math.log(0.5 / 0.3);

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/_math1"].stateValues.value.tree).closeTo(
            num,
            1e-14,
        );
        expect(stateVariables["/_number1"].stateValues.value).closeTo(
            num,
            1e-14,
        );
    });

    it("rounding", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="n1">234234823.34235235324</number>
      <number name="n2">5.4285023408250342</number>
      <number name="n3">0.000000000000005023481340324</number>
      $n1{displayDigits='5' name="n1a"}
      $n1{displayDecimals='3' name="n1b"}
      $n1{displayDigits='5' displayDecimals='3' displaySmallAsZero="false" name="n1c"}
      $n2{displayDigits='5' name="n2a"}
      $n2{displayDecimals='3' name="n2b"}
      $n2{displayDigits='5' displayDecimals='3' displaySmallAsZero="false" name="n2c"}
      $n3{displayDigits='5' name="n3a"}
      $n3{displayDecimals='3' name="n3b"}
      $n3{displayDigits='5' displayDecimals='3' displaySmallAsZero="false" name="n3c"}

      $n1a{name="n1aa"}
      $n1a{displayDecimals='3' name="n1ab"}
      $n2a{name="n2aa"}
      $n2a{displayDecimals='3' name="n2ab"}
      $n3a{displaySmallAsZero="false" name="n3aa"}
      $n3a{displayDecimals='3' displaySmallAsZero="false" name="n3ab"}

      $n1b{name="n1ba"}
      $n1b{displayDigits='5'  name="n1bb"}
      $n2b{name="n2ba"}
      $n2b{displayDigits='5' name="n2bb"}
      $n3b{displaySmallAsZero="false" name="n3ba"}
      $n3b{displayDigits='5' displayDecimals='3' displaySmallAsZero="false" name="n3bb"}

      <m name="n1am">$n1a</m>
      <m name="n1bm">$n1b</m>
      <m name="n1cm">$n1c</m>
      <m name="n2am">$n2a</m>
      <m name="n2bm">$n2b</m>
      <m name="n2cm">$n2c</m>
      <m name="n3am">$n3a</m>
      <m name="n3bm">$n3b</m>
      <m name="n3cm">$n3c</m>

      <m name="n1aam">$n1aa</m>
      <m name="n1abm">$n1ab</m>
      <m name="n2aam">$n2aa</m>
      <m name="n2abm">$n2ab</m>
      <m name="n3aam">$n3aa</m>
      <m name="n3abm">$n3ab</m>

      <m name="n1bam">$n1ba</m>
      <m name="n1bbm">$n1bb</m>
      <m name="n2bam">$n2ba</m>
      <m name="n2bbm">$n2bb</m>
      <m name="n3bam">$n3ba</m>
      <m name="n3bbm">$n3bb</m>
      
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n1"].stateValues.text).eq("234234823.34");
        expect(stateVariables["/n1a"].stateValues.text).eq("234230000");
        expect(stateVariables["/n1b"].stateValues.text).eq("234234823.342");
        expect(stateVariables["/n1c"].stateValues.text).eq("234234823.342");

        expect(cleanLatex(stateVariables["/n1am"].stateValues.latex)).eq(
            "234230000",
        );
        expect(cleanLatex(stateVariables["/n1bm"].stateValues.latex)).eq(
            "234234823.342",
        );
        expect(cleanLatex(stateVariables["/n1cm"].stateValues.latex)).eq(
            "234234823.342",
        );

        expect(stateVariables["/n2"].stateValues.text).eq("5.43");
        expect(stateVariables["/n2a"].stateValues.text).eq("5.4285");
        expect(stateVariables["/n2b"].stateValues.text).eq("5.429");
        expect(stateVariables["/n2c"].stateValues.text).eq("5.4285");
        expect(cleanLatex(stateVariables["/n2am"].stateValues.latex)).eq(
            "5.4285",
        );
        expect(cleanLatex(stateVariables["/n2bm"].stateValues.latex)).eq(
            "5.429",
        );
        expect(cleanLatex(stateVariables["/n2cm"].stateValues.latex)).eq(
            "5.4285",
        );

        expect(stateVariables["/n3"].stateValues.text).eq("0");
        expect(stateVariables["/n3a"].stateValues.text).eq("0");
        expect(stateVariables["/n3b"].stateValues.text).eq("0");
        expect(stateVariables["/n3c"].stateValues.text).eq("5.0235 * 10^(-15)");
        expect(cleanLatex(stateVariables["/n3am"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/n3bm"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/n3cm"].stateValues.latex)).eq(
            "5.0235\\cdot10^{-15}",
        );

        expect(stateVariables["/n1aa"].stateValues.text).eq("234230000");
        expect(stateVariables["/n1ab"].stateValues.text).eq("234234823.342");
        expect(cleanLatex(stateVariables["/n1aam"].stateValues.latex)).eq(
            "234230000",
        );
        expect(cleanLatex(stateVariables["/n1abm"].stateValues.latex)).eq(
            "234234823.342",
        );

        expect(stateVariables["/n2aa"].stateValues.text).eq("5.4285");
        expect(stateVariables["/n2ab"].stateValues.text).eq("5.429");
        expect(cleanLatex(stateVariables["/n2aam"].stateValues.latex)).eq(
            "5.4285",
        );
        expect(cleanLatex(stateVariables["/n2abm"].stateValues.latex)).eq(
            "5.429",
        );

        expect(stateVariables["/n3aa"].stateValues.text).eq(
            "5.0235 * 10^(-15)",
        );
        expect(stateVariables["/n3ab"].stateValues.text).eq("0");
        expect(cleanLatex(stateVariables["/n3aam"].stateValues.latex)).eq(
            "5.0235\\cdot10^{-15}",
        );
        expect(cleanLatex(stateVariables["/n3abm"].stateValues.latex)).eq("0");

        expect(stateVariables["/n1ba"].stateValues.text).eq("234234823.342");
        expect(stateVariables["/n1bb"].stateValues.text).eq("234230000");
        expect(cleanLatex(stateVariables["/n1bam"].stateValues.latex)).eq(
            "234234823.342",
        );
        expect(cleanLatex(stateVariables["/n1bbm"].stateValues.latex)).eq(
            "234230000",
        );

        expect(stateVariables["/n2ba"].stateValues.text).eq("5.429");
        expect(stateVariables["/n2bb"].stateValues.text).eq("5.4285");
        expect(cleanLatex(stateVariables["/n2bam"].stateValues.latex)).eq(
            "5.429",
        );
        expect(cleanLatex(stateVariables["/n2bbm"].stateValues.latex)).eq(
            "5.4285",
        );

        expect(stateVariables["/n3ba"].stateValues.text).eq("0");
        expect(stateVariables["/n3bb"].stateValues.text).eq(
            "5.0235 * 10^(-15)",
        );
        expect(cleanLatex(stateVariables["/n3bam"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/n3bbm"].stateValues.latex)).eq(
            "5.0235\\cdot10^{-15}",
        );

        expect(stateVariables["/n1"].stateValues.value).eq(
            234234823.34235235324,
        );
        expect(stateVariables["/n1a"].stateValues.value).eq(
            234234823.34235235324,
        );
        expect(stateVariables["/n1b"].stateValues.value).eq(
            234234823.34235235324,
        );
        expect(stateVariables["/n1c"].stateValues.value).eq(
            234234823.34235235324,
        );
        expect(
            stateVariables[
                stateVariables["/n1am"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(234234823.34235235324);
        expect(
            stateVariables[
                stateVariables["/n1bm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(234234823.34235235324);
        expect(
            stateVariables[
                stateVariables["/n1cm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(234234823.34235235324);
        expect(stateVariables["/n2"].stateValues.value).eq(5.4285023408250342);
        expect(stateVariables["/n2a"].stateValues.value).eq(5.4285023408250342);
        expect(stateVariables["/n2b"].stateValues.value).eq(5.4285023408250342);
        expect(stateVariables["/n2c"].stateValues.value).eq(5.4285023408250342);
        expect(
            stateVariables[
                stateVariables["/n2am"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(5.4285023408250342);
        expect(
            stateVariables[
                stateVariables["/n2bm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(5.4285023408250342);
        expect(
            stateVariables[
                stateVariables["/n2cm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(5.4285023408250342);
        expect(stateVariables["/n3"].stateValues.value).eq(
            0.000000000000005023481340324,
        );
        expect(stateVariables["/n3a"].stateValues.value).eq(
            0.000000000000005023481340324,
        );
        expect(stateVariables["/n3b"].stateValues.value).eq(
            0.000000000000005023481340324,
        );
        expect(stateVariables["/n3c"].stateValues.value).eq(
            0.000000000000005023481340324,
        );
        expect(
            stateVariables[
                stateVariables["/n3am"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(0.000000000000005023481340324);
        expect(
            stateVariables[
                stateVariables["/n3bm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(0.000000000000005023481340324);
        expect(
            stateVariables[
                stateVariables["/n3cm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(0.000000000000005023481340324);

        expect(stateVariables["/n1aa"].stateValues.value).eq(
            234234823.34235235324,
        );
        expect(stateVariables["/n1ab"].stateValues.value).eq(
            234234823.34235235324,
        );
        expect(
            stateVariables[
                stateVariables["/n1aam"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(234234823.34235235324);
        expect(
            stateVariables[
                stateVariables["/n1abm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(234234823.34235235324);
        expect(stateVariables["/n2aa"].stateValues.value).eq(
            5.4285023408250342,
        );
        expect(stateVariables["/n2ab"].stateValues.value).eq(
            5.4285023408250342,
        );
        expect(
            stateVariables[
                stateVariables["/n2aam"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(5.4285023408250342);
        expect(
            stateVariables[
                stateVariables["/n2abm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(5.4285023408250342);
        expect(stateVariables["/n3aa"].stateValues.value).eq(
            0.000000000000005023481340324,
        );
        expect(stateVariables["/n3ab"].stateValues.value).eq(
            0.000000000000005023481340324,
        );
        expect(
            stateVariables[
                stateVariables["/n3aam"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(0.000000000000005023481340324);
        expect(
            stateVariables[
                stateVariables["/n3abm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(0.000000000000005023481340324);

        expect(stateVariables["/n1ba"].stateValues.value).eq(
            234234823.34235235324,
        );
        expect(stateVariables["/n1bb"].stateValues.value).eq(
            234234823.34235235324,
        );
        expect(
            stateVariables[
                stateVariables["/n1bam"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(234234823.34235235324);
        expect(
            stateVariables[
                stateVariables["/n1bbm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(234234823.34235235324);
        expect(stateVariables["/n2ba"].stateValues.value).eq(
            5.4285023408250342,
        );
        expect(stateVariables["/n2bb"].stateValues.value).eq(
            5.4285023408250342,
        );
        expect(
            stateVariables[
                stateVariables["/n2bam"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(5.4285023408250342);
        expect(
            stateVariables[
                stateVariables["/n2bbm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(5.4285023408250342);
        expect(stateVariables["/n3ba"].stateValues.value).eq(
            0.000000000000005023481340324,
        );
        expect(stateVariables["/n3bb"].stateValues.value).eq(
            0.000000000000005023481340324,
        );
        expect(
            stateVariables[
                stateVariables["/n3bam"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(0.000000000000005023481340324);
        expect(
            stateVariables[
                stateVariables["/n3bbm"].activeChildren[0].componentName
            ].stateValues.value,
        ).eq(0.000000000000005023481340324);
    });

    it("pad zeros with rounding", async () => {
        let core = await createTestCore({
            doenetML: `
      <number name="n1">22</number>
      <number name="n2" displaySmallAsZero="false">0.000000000000005</number>
      $n1{displayDigits='4' name="n1a"}
      $n1{displayDigits='4' name="n1apad" padZeros}
      $n1{displayDecimals='3' name="n1b"}
      $n1{displayDecimals='3' name="n1bpad" padZeros}
      $n1{displayDigits='4' displaySmallAsZero name="n1c"}
      $n1{displayDigits='4' displaySmallAsZero name="n1cpad" padZeros}
      $n2{displayDigits='4' name="n2a"}
      $n2{displayDigits='4' name="n2apad" padZeros}
      $n2{displayDecimals='3' name="n2b"}
      $n2{displayDecimals='3' name="n2bpad" padZeros}
      $n2{displayDigits='4' displaySmallAsZero name="n2c"}
      $n2{displayDigits='4' displaySmallAsZero name="n2cpad" padZeros}

      <m name="n1am">$n1a</m>
      <m name="n1apadm">$n1apad</m>
      <m name="n1bm">$n1b</m>
      <m name="n1bpadm">$n1bpad</m>
      <m name="n1cm">$n1c</m>
      <m name="n1cpadm">$n1cpad</m>
      <m name="n2am">$n2a</m>
      <m name="n2apadm">$n2apad</m>
      <m name="n2bm">$n2b</m>
      <m name="n2bpadm">$n2bpad</m>
      <m name="n2cm">$n2c</m>
      <m name="n2cpadm">$n2cpad</m>

      <number name="n1aNumber">$n1a</number>
      <number name="n1apadNumber">$n1apad</number>
      <number name="n1bNumber">$n1b</number>
      <number name="n1bpadNumber">$n1bpad</number>
      <number name="n1cNumber">$n1c</number>
      <number name="n1cpadNumber">$n1cpad</number>
      <number name="n2aNumber">$n2a</number>
      <number name="n2apadNumber">$n2apad</number>
      <number name="n2bNumber">$n2b</number>
      <number name="n2bpadNumber">$n2bpad</number>
      <number name="n2cNumber">$n2c</number>
      <number name="n2cpadNumber">$n2cpad</number>

      <math name="n1aMath">$n1a</math>
      <math name="n1apadMath">$n1apad</math>
      <math name="n1bMath">$n1b</math>
      <math name="n1bpadMath">$n1bpad</math>
      <math name="n1cMath">$n1c</math>
      <math name="n1cpadMath">$n1cpad</math>
      <math name="n2aMath">$n2a</math>
      <math name="n2apadMath">$n2apad</math>
      <math name="n2bMath">$n2b</math>
      <math name="n2bpadMath">$n2bpad</math>
      <math name="n2cMath">$n2c</math>
      <math name="n2cpadMath">$n2cpad</math>

      $n1a.value{assignNames="n1aValue"}
      $n1apad.value{assignNames="n1apadValue"}
      $n1b.value{assignNames="n1bValue"}
      $n1bpad.value{assignNames="n1bpadValue"}
      $n1c.value{assignNames="n1cValue"}
      $n1cpad.value{assignNames="n1cpadValue"}
      $n2a.value{assignNames="n2aValue"}
      $n2apad.value{assignNames="n2apadValue"}
      $n2b.value{assignNames="n2bValue"}
      $n2bpad.value{assignNames="n2bpadValue"}
      $n2c.value{assignNames="n2cValue"}
      $n2cpad.value{assignNames="n2cpadValue"}

      $n1a.text{assignNames="n1aText"}
      $n1apad.text{assignNames="n1apadText"}
      $n1b.text{assignNames="n1bText"}
      $n1bpad.text{assignNames="n1bpadText"}
      $n1c.text{assignNames="n1cText"}
      $n1cpad.text{assignNames="n1cpadText"}
      $n2a.text{assignNames="n2aText"}
      $n2apad.text{assignNames="n2apadText"}
      $n2b.text{assignNames="n2bText"}
      $n2bpad.text{assignNames="n2bpadText"}
      $n2c.text{assignNames="n2cText"}
      $n2cpad.text{assignNames="n2cpadText"}

      $n1a.math{assignNames="n1aMath2"}
      $n1apad.math{assignNames="n1apadMath2"}
      $n1b.math{assignNames="n1bMath2"}
      $n1bpad.math{assignNames="n1bpadMath2"}
      $n1c.math{assignNames="n1cMath2"}
      $n1cpad.math{assignNames="n1cpadMath2"}
      $n2a.math{assignNames="n2aMath2"}
      $n2apad.math{assignNames="n2apadMath2"}
      $n2b.math{assignNames="n2bMath2"}
      $n2bpad.math{assignNames="n2bpadMath2"}
      $n2c.math{assignNames="n2cMath2"}
      $n2cpad.math{assignNames="n2cpadMath2"}

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n1"].stateValues.text).eq("22");
        expect(stateVariables["/n1a"].stateValues.text).eq("22");
        expect(stateVariables["/n1apad"].stateValues.text).eq("22.00");
        expect(stateVariables["/n1b"].stateValues.text).eq("22");
        expect(stateVariables["/n1bpad"].stateValues.text).eq("22.000");
        expect(stateVariables["/n1c"].stateValues.text).eq("22");
        expect(stateVariables["/n1cpad"].stateValues.text).eq("22.00");
        expect(stateVariables["/n2"].stateValues.text).eq("5 * 10^(-15)");
        expect(stateVariables["/n2a"].stateValues.text).eq("5 * 10^(-15)");
        expect(stateVariables["/n2apad"].stateValues.text).eq(
            "5.000 * 10^(-15)",
        );
        expect(stateVariables["/n2b"].stateValues.text).eq("0");
        expect(stateVariables["/n2bpad"].stateValues.text).eq("0.000");
        expect(stateVariables["/n2c"].stateValues.text).eq("0");
        expect(stateVariables["/n2cpad"].stateValues.text).eq("0.000");

        expect(cleanLatex(stateVariables["/n1am"].stateValues.latex)).eq("22");
        expect(cleanLatex(stateVariables["/n1apadm"].stateValues.latex)).eq(
            "22.00",
        );
        expect(cleanLatex(stateVariables["/n1bm"].stateValues.latex)).eq("22");
        expect(cleanLatex(stateVariables["/n1bpadm"].stateValues.latex)).eq(
            "22.000",
        );
        expect(cleanLatex(stateVariables["/n1cm"].stateValues.latex)).eq("22");
        expect(cleanLatex(stateVariables["/n1cpadm"].stateValues.latex)).eq(
            "22.00",
        );
        expect(cleanLatex(stateVariables["/n2am"].stateValues.latex)).eq(
            "5\\cdot10^{-15}",
        );
        expect(cleanLatex(stateVariables["/n2apadm"].stateValues.latex)).eq(
            "5.000\\cdot10^{-15}",
        );
        expect(cleanLatex(stateVariables["/n2bm"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/n2bpadm"].stateValues.latex)).eq(
            "0.000",
        );
        expect(cleanLatex(stateVariables["/n2cm"].stateValues.latex)).eq("0");
        expect(cleanLatex(stateVariables["/n2cpadm"].stateValues.latex)).eq(
            "0.000",
        );

        expect(stateVariables["/n1aNumber"].stateValues.text).eq("22");
        expect(stateVariables["/n1apadNumber"].stateValues.text).eq("22.00");
        expect(stateVariables["/n1bNumber"].stateValues.text).eq("22");
        expect(stateVariables["/n1bpadNumber"].stateValues.text).eq("22.000");
        expect(stateVariables["/n1cNumber"].stateValues.text).eq("22");
        expect(stateVariables["/n1cpadNumber"].stateValues.text).eq("22.00");
        expect(stateVariables["/n2aNumber"].stateValues.text).eq(
            "5 * 10^(-15)",
        );
        expect(stateVariables["/n2apadNumber"].stateValues.text).eq(
            "5.000 * 10^(-15)",
        );
        expect(stateVariables["/n2bNumber"].stateValues.text).eq("0");
        expect(stateVariables["/n2bpadNumber"].stateValues.text).eq("0.000");
        expect(stateVariables["/n2cNumber"].stateValues.text).eq("0");
        expect(stateVariables["/n2cpadNumber"].stateValues.text).eq("0.000");

        expect(cleanLatex(stateVariables["/n1aMath"].stateValues.latex)).eq(
            "22",
        );
        expect(cleanLatex(stateVariables["/n1apadMath"].stateValues.latex)).eq(
            "22.00",
        );
        expect(cleanLatex(stateVariables["/n1bMath"].stateValues.latex)).eq(
            "22",
        );
        expect(cleanLatex(stateVariables["/n1bpadMath"].stateValues.latex)).eq(
            "22.000",
        );
        expect(cleanLatex(stateVariables["/n1cMath"].stateValues.latex)).eq(
            "22",
        );
        expect(cleanLatex(stateVariables["/n1cpadMath"].stateValues.latex)).eq(
            "22.00",
        );
        expect(cleanLatex(stateVariables["/n2aMath"].stateValues.latex)).eq(
            "5\\cdot10^{-15}",
        );
        expect(cleanLatex(stateVariables["/n2apadMath"].stateValues.latex)).eq(
            "5.000\\cdot10^{-15}",
        );
        expect(cleanLatex(stateVariables["/n2bMath"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/n2bpadMath"].stateValues.latex)).eq(
            "0.000",
        );
        expect(cleanLatex(stateVariables["/n2cMath"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/n2cpadMath"].stateValues.latex)).eq(
            "0.000",
        );

        expect(stateVariables["/n1aValue"].stateValues.text).eq("22");
        expect(stateVariables["/n1apadValue"].stateValues.text).eq("22.00");
        expect(stateVariables["/n1bValue"].stateValues.text).eq("22");
        expect(stateVariables["/n1bpadValue"].stateValues.text).eq("22.000");
        expect(stateVariables["/n1cValue"].stateValues.text).eq("22");
        expect(stateVariables["/n1cpadValue"].stateValues.text).eq("22.00");
        expect(stateVariables["/n2aValue"].stateValues.text).eq("5 * 10^(-15)");
        expect(stateVariables["/n2apadValue"].stateValues.text).eq(
            "5.000 * 10^(-15)",
        );
        expect(stateVariables["/n2bValue"].stateValues.text).eq("0");
        expect(stateVariables["/n2bpadValue"].stateValues.text).eq("0.000");
        expect(stateVariables["/n2cValue"].stateValues.text).eq("0");
        expect(stateVariables["/n2cpadValue"].stateValues.text).eq("0.000");

        expect(stateVariables["/n1aText"].stateValues.text).eq("22");
        expect(stateVariables["/n1apadText"].stateValues.text).eq("22.00");
        expect(stateVariables["/n1bText"].stateValues.text).eq("22");
        expect(stateVariables["/n1bpadText"].stateValues.text).eq("22.000");
        expect(stateVariables["/n1cText"].stateValues.text).eq("22");
        expect(stateVariables["/n1cpadText"].stateValues.text).eq("22.00");
        expect(stateVariables["/n2aText"].stateValues.text).eq("5 * 10^(-15)");
        expect(stateVariables["/n2apadText"].stateValues.text).eq(
            "5.000 * 10^(-15)",
        );
        expect(stateVariables["/n2bText"].stateValues.text).eq("0");
        expect(stateVariables["/n2bpadText"].stateValues.text).eq("0.000");
        expect(stateVariables["/n2cText"].stateValues.text).eq("0");
        expect(stateVariables["/n2cpadText"].stateValues.text).eq("0.000");

        expect(cleanLatex(stateVariables["/n1aMath2"].stateValues.latex)).eq(
            "22",
        );
        expect(cleanLatex(stateVariables["/n1apadMath2"].stateValues.latex)).eq(
            "22.00",
        );
        expect(cleanLatex(stateVariables["/n1bMath2"].stateValues.latex)).eq(
            "22",
        );
        expect(cleanLatex(stateVariables["/n1bpadMath2"].stateValues.latex)).eq(
            "22.000",
        );
        expect(cleanLatex(stateVariables["/n1cMath2"].stateValues.latex)).eq(
            "22",
        );
        expect(cleanLatex(stateVariables["/n1cpadMath2"].stateValues.latex)).eq(
            "22.00",
        );
        expect(cleanLatex(stateVariables["/n2aMath2"].stateValues.latex)).eq(
            "5\\cdot10^{-15}",
        );
        expect(cleanLatex(stateVariables["/n2apadMath2"].stateValues.latex)).eq(
            "5.000\\cdot10^{-15}",
        );
        expect(cleanLatex(stateVariables["/n2bMath2"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/n2bpadMath2"].stateValues.latex)).eq(
            "0.000",
        );
        expect(cleanLatex(stateVariables["/n2cMath2"].stateValues.latex)).eq(
            "0",
        );
        expect(cleanLatex(stateVariables["/n2cpadMath2"].stateValues.latex)).eq(
            "0.000",
        );
    });

    it("dynamic rounding", async () => {
        let core = await createTestCore({
            doenetML: `
      <p>Number: <number name="n">35203423.02352343201</number></p>
      <p>Number of digits: <mathinput name="ndigits" prefill="3" /></p>
      <p>Number of decimals: <mathinput name="ndecimals" prefill="3" /></p>
      <p>$n{displayDigits='$ndigits' displayDecimals='$ndecimals' name="na"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n"].stateValues.text).eq("35203423.02");
        expect(stateVariables["/na"].stateValues.text).eq("35203423.024");

        // only digits
        await updateMathInputValue({
            latex: "-\\infty",
            name: "/ndecimals",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/na"].stateValues.text).eq("35200000");

        // more digits
        await updateMathInputValue({
            latex: "12",
            name: "/ndigits",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/na"].stateValues.text).eq("35203423.0235");

        // remove digits
        await updateMathInputValue({
            latex: "0",
            name: "/ndigits",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/na"].stateValues.text).eq("35203423.023523435");

        // Fewer digits than have
        await updateMathInputValue({
            latex: "-10",
            name: "/ndecimals",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/na"].stateValues.text).eq("0");

        // add one digit
        await updateMathInputValue({
            latex: "1",
            name: "/ndigits",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/na"].stateValues.text).eq("40000000");

        // invalid precision means no rounding
        await updateMathInputValue({
            latex: "x",
            name: "/ndigits",
            core,
        });
        await updateMathInputValue({
            latex: "y",
            name: "/ndecimals",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/na"].stateValues.text).eq("35203423.023523435");

        // add a decimal
        await updateMathInputValue({
            latex: "1",
            name: "/ndecimals",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/na"].stateValues.text).eq("35203423");

        // negative precision, ignores display digits
        await updateMathInputValue({
            latex: "-3",
            name: "/ndigits",
            core,
        });
        await updateMathInputValue({
            latex: "-3",
            name: "/ndecimals",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/na"].stateValues.text).eq("35203000");
    });

    it("infinity and nan", async () => {
        let core = await createTestCore({
            doenetML: `
      <text>a</text>
      <number name="inf1">Infinity</number>
      <number name="inf2">Infinity+Infinity</number>
      <number name="inf3">1/0</number>
      <number name="inf4">-2/-0</number>
      <number name="inf5"><math>Infinity</math></number>
      <number name="inf6"><math>Infinity</math>+<math>Infinity</math></number>
      <number name="inf7"><math>5/0</math></number>
      <number name="inf8"><math>-6</math>/<math>-0</math></number>

      <number name="ninf1">-Infinity</number>
      <number name="ninf2">-3/0</number>
      <number name="ninf3">4/-0</number>
      <number name="ninf4"><math>-Infinity</math></number>
      <number name="ninf5"><math>-8/0</math></number>
      <number name="ninf6"><math>7</math>/<math>-0</math></number>

      <number name="nan1">Infinity-Infinity</number>
      <number name="nan2">Infinity/Infinity</number>
      <number name="nan3">0/0</number>
      <number name="nan4">-0/0</number>
      <number name="nan5"><math>-Infinity</math>+<math>Infinity</math></number>
      <number name="nan6"><math>Infinity/Infinity</math></number>
      <number name="nan7"><math>0/0</math></number>
      <number name="nan8"><math>0</math>/<math>-0</math></number>


    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/inf1"].stateValues.value).eq(Infinity);
        expect(stateVariables["/inf2"].stateValues.value).eq(Infinity);
        expect(stateVariables["/inf3"].stateValues.value).eq(Infinity);
        expect(stateVariables["/inf4"].stateValues.value).eq(Infinity);
        expect(stateVariables["/inf5"].stateValues.value).eq(Infinity);
        expect(stateVariables["/inf6"].stateValues.value).eq(Infinity);
        expect(stateVariables["/inf7"].stateValues.value).eq(Infinity);
        expect(stateVariables["/inf8"].stateValues.value).eq(Infinity);

        expect(stateVariables["/ninf1"].stateValues.value).eq(-Infinity);
        expect(stateVariables["/ninf2"].stateValues.value).eq(-Infinity);
        expect(stateVariables["/ninf3"].stateValues.value).eq(-Infinity);
        expect(stateVariables["/ninf4"].stateValues.value).eq(-Infinity);
        expect(stateVariables["/ninf5"].stateValues.value).eq(-Infinity);
        expect(stateVariables["/ninf6"].stateValues.value).eq(-Infinity);

        expect(stateVariables["/nan1"].stateValues.value).eqls(NaN);
        expect(stateVariables["/nan2"].stateValues.value).eqls(NaN);
        expect(stateVariables["/nan3"].stateValues.value).eqls(NaN);
        expect(stateVariables["/nan4"].stateValues.value).eqls(NaN);
        expect(stateVariables["/nan5"].stateValues.value).eqls(NaN);
        expect(stateVariables["/nan6"].stateValues.value).eqls(NaN);
        expect(stateVariables["/nan7"].stateValues.value).eqls(NaN);
        expect(stateVariables["/nan8"].stateValues.value).eqls(NaN);
    });

    it("copy value prop copies attributes", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><number name="n1" displayDigits="2">8.5203845251</number>
  $n1.value{assignNames="n1a"}
  $n1.value{displayDigits="5" assignNames="n1b"}
  $n1.value{link="false" assignNames="n1c"}
  $n1.value{link="false" displayDigits="5" assignNames="n1d"}
  </p>

  <p><number name="n2" displayDecimals="0">8.5203845251</number>
  $n2.value{assignNames="n2a"}
  $n2.value{displayDecimals="6" assignNames="n2b"}
  $n2.value{link="false" assignNames="n2c"}
  $n2.value{link="false" displayDecimals="6" assignNames="n2d"}
  </p>

  <p><number name="n3" displaySmallAsZero="false">0.000000000000000015382487</number>
  $n3.value{assignNames="n3a"}
  $n3.value{displaySmallAsZero assignNames="n3b"}
  $n3.value{link="false" assignNames="n3c"}
  $n3.value{link="false" displaySmallAsZero assignNames="n3d"}
  </p>

  <p><number name="n4" padZeros>8</number>
  $n4.value{assignNames="n4a"}
  $n4.value{padZeros="false" assignNames="n4b"}
  $n4.value{link="false" assignNames="n4c"}
  $n4.value{link="false" padZeros="false" assignNames="n4d"}
  </p>

  `,
        });
        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n1"].stateValues.text).eq("8.5");
        expect(stateVariables["/n1a"].stateValues.text).eq("8.5");
        expect(stateVariables["/n1b"].stateValues.text).eq("8.5204");
        expect(stateVariables["/n1c"].stateValues.text).eq("8.5");
        expect(stateVariables["/n1d"].stateValues.text).eq("8.5204");

        expect(stateVariables["/n2"].stateValues.text).eq("9");
        expect(stateVariables["/n2a"].stateValues.text).eq("9");
        expect(stateVariables["/n2b"].stateValues.text).eq("8.520385");
        expect(stateVariables["/n2c"].stateValues.text).eq("9");
        expect(stateVariables["/n2d"].stateValues.text).eq("8.520385");

        expect(stateVariables["/n3"].stateValues.text).eq("1.54 * 10^(-17)");
        expect(stateVariables["/n3a"].stateValues.text).eq("1.54 * 10^(-17)");
        expect(stateVariables["/n3b"].stateValues.text).eq("0");
        expect(stateVariables["/n3c"].stateValues.text).eq("1.54 * 10^(-17)");
        expect(stateVariables["/n3d"].stateValues.text).eq("0");

        expect(stateVariables["/n4"].stateValues.text).eq("8.00");
        expect(stateVariables["/n4a"].stateValues.text).eq("8.00");
        expect(stateVariables["/n4b"].stateValues.text).eq("8");
        expect(stateVariables["/n4c"].stateValues.text).eq("8.00");
        expect(stateVariables["/n4d"].stateValues.text).eq("8");
    });

    it("display rounding preserved when only one number or math child", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><number name="m1"><math displayDigits="2">8.5203845251</math></number>
    <number name="m1a"><number displayDigits="2">8.5203845251</number></number>
    <number name="m1b"><math displayDigits="2">8.5203845251</math>2.8392634947</number>
    <number name="m1c"><number displayDigits="2">8.5203845251</number>2.8392634947</number>
    <number name="m1d"><math displayDigits="2">8.5203845251</math><math displayDigits="2">2.8392634947</math></number>
    <number name="m1e"><number displayDigits="2">8.5203845251</number><math displayDigits="2">2.8392634947</math></number>
    <number name="m1f" displayDigits="1"><math displayDigits="2">8.5203845251</math></number>
    <number name="m1g" displayDecimals="8"><math displayDigits="2">8.5203845251</math></number>
  </p>

  <p><number name="m1_v" copySource="m1.value" />
    <number name="m1a_v" copySource="m1a.value" />
    <number name="m1b_v" copySource="m1b.value" />
    <number name="m1c_v" copySource="m1c.value" />
    <number name="m1d_v" copySource="m1d.value" />
    <number name="m1e_v" copySource="m1e.value" />
    <number name="m1f_v" copySource="m1f.value" />
    <number name="m1g_v" copySource="m1g.value" />
  </p>

  <p><number name="m2"><math displayDecimals="4">8.5203845251</math></number>
    <number name="m2a"><number displayDecimals="4">8.5203845251</number></number>
    <number name="m2b"><math displayDecimals="4">8.5203845251</math>2.8392634947</number>
    <number name="m2c"><number displayDecimals="4">8.5203845251</number>2.8392634947</number>
    <number name="m2d"><math displayDecimals="4">8.5203845251</math><math displayDecimals="4">2.8392634947</math></number>
    <number name="m2e"><number displayDecimals="4">8.5203845251</number><math displayDecimals="4">2.8392634947</math></number>
    <number name="m2f" displayDecimals="6"><math displayDecimals="4">8.5203845251</math></number>
    <number name="m2g" displayDigits="8"><math displayDecimals="4">8.5203845251</math></number>
  </p>

  <p><number name="m2_v" copySource="m2.value" />
    <number name="m2a_v" copySource="m2a.value" />
    <number name="m2b_v" copySource="m2b.value" />
    <number name="m2c_v" copySource="m2c.value" />
    <number name="m2d_v" copySource="m2d.value" />
    <number name="m2e_v" copySource="m2e.value" />
    <number name="m2f_v" copySource="m2f.value" />
    <number name="m2g_v" copySource="m2g.value" />
  </p>

  <p><number name="m3"><math displaySmallAsZero="false">0.000000000000000015382487</math></number>
    <number name="m3a"><number displaySmallAsZero="false">0.000000000000000015382487</number></number>
    <number name="m3b"><math displaySmallAsZero="false">0.000000000000000015382487</math>2.8392634947</number>
    <number name="m3c"><number displaySmallAsZero="false">0.000000000000000015382487</number>2.8392634947</number>
    <number name="m3d"><math displaySmallAsZero="false">0.000000000000000015382487</math><math displaySmallAsZero="false">2.8392634947</math></number>
    <number name="m3e"><number displaySmallAsZero="false">0.000000000000000015382487</number><math displaySmallAsZero="false">2.8392634947</math></number>
    <number name="m3f" displaySmallAsZero="false"><math displaySmallAsZero="true">0.000000000000000015382487</math></number>
  </p>

  <p><number name="m3_v" copySource="m3.value" />
    <number name="m3a_v" copySource="m3a.value" />
    <number name="m3b_v" copySource="m3b.value" />
    <number name="m3c_v" copySource="m3c.value" />
    <number name="m3d_v" copySource="m3d.value" />
    <number name="m3e_v" copySource="m3e.value" />
    <number name="m3f_v" copySource="m3f.value" />
  </p>

  <p><number name="m4"><math displayDigits="3" padZeros>8</math></number>
    <number name="m4a"><number displayDigits="3" padZeros>8</number></number>
    <number name="m4b"><math displayDigits="3" padZeros>8</math>2</number>
    <number name="m4c"><number displayDigits="3" padZeros>8</number>2</number>
    <number name="m4d"><math displayDigits="3" padZeros>8</math><math displayDigits="3" padZeros>2</math></number>
    <number name="m4e"><number displayDigits="3" padZeros>8</number><math displayDigits="3" padZeros>2</math></number>
    <number name="m4f" padZeros="false"><math displayDigits="3" padZeros>8</math></number>
  </p>

  <p><number name="m4_v" copySource="m4.value" />
    <number name="m4a_v" copySource="m4a.value" />
    <number name="m4b_v" copySource="m4b.value" />
    <number name="m4c_v" copySource="m4c.value" />
    <number name="m4d_v" copySource="m4d.value" />
    <number name="m4e_v" copySource="m4e.value" />
    <number name="m4f_v" copySource="m4f.value" />
  </p>


  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m1"].stateValues.text).eq("8.5");
        expect(stateVariables["/m1a"].stateValues.text).eq("8.5");
        expect(stateVariables["/m1b"].stateValues.text).eq("24.19");
        expect(stateVariables["/m1c"].stateValues.text).eq("24.19");
        expect(stateVariables["/m1d"].stateValues.text).eq("24.19");
        expect(stateVariables["/m1e"].stateValues.text).eq("24.19");
        expect(stateVariables["/m1f"].stateValues.text).eq("9");
        expect(stateVariables["/m1g"].stateValues.text).eq("8.52038453");

        expect(stateVariables["/m1_v"].stateValues.text).eq("8.5");
        expect(stateVariables["/m1a_v"].stateValues.text).eq("8.5");
        expect(stateVariables["/m1b_v"].stateValues.text).eq("24.19");
        expect(stateVariables["/m1c_v"].stateValues.text).eq("24.19");
        expect(stateVariables["/m1d_v"].stateValues.text).eq("24.19");
        expect(stateVariables["/m1e_v"].stateValues.text).eq("24.19");
        expect(stateVariables["/m1f_v"].stateValues.text).eq("9");
        expect(stateVariables["/m1g_v"].stateValues.text).eq("8.52038453");

        expect(stateVariables["/m2"].stateValues.text).eq("8.5204");
        expect(stateVariables["/m2a"].stateValues.text).eq("8.5204");
        expect(stateVariables["/m2b"].stateValues.text).eq("24.19");
        expect(stateVariables["/m2c"].stateValues.text).eq("24.19");
        expect(stateVariables["/m2d"].stateValues.text).eq("24.19");
        expect(stateVariables["/m2e"].stateValues.text).eq("24.19");
        expect(stateVariables["/m2f"].stateValues.text).eq("8.520385");
        expect(stateVariables["/m2g"].stateValues.text).eq("8.5203845");

        expect(stateVariables["/m2_v"].stateValues.text).eq("8.5204");
        expect(stateVariables["/m2a_v"].stateValues.text).eq("8.5204");
        expect(stateVariables["/m2b_v"].stateValues.text).eq("24.19");
        expect(stateVariables["/m2c_v"].stateValues.text).eq("24.19");
        expect(stateVariables["/m2d_v"].stateValues.text).eq("24.19");
        expect(stateVariables["/m2e_v"].stateValues.text).eq("24.19");
        expect(stateVariables["/m2f_v"].stateValues.text).eq("8.520385");
        expect(stateVariables["/m2g_v"].stateValues.text).eq("8.5203845");

        expect(stateVariables["/m3"].stateValues.text).eq("1.54 * 10^(-17)");
        expect(stateVariables["/m3a"].stateValues.text).eq("1.54 * 10^(-17)");
        expect(stateVariables["/m3b"].stateValues.text).eq("0");
        expect(stateVariables["/m3c"].stateValues.text).eq("0");
        expect(stateVariables["/m3d"].stateValues.text).eq("0");
        expect(stateVariables["/m3e"].stateValues.text).eq("0");
        expect(stateVariables["/m3f"].stateValues.text).eq("1.54 * 10^(-17)");

        expect(stateVariables["/m3_v"].stateValues.text).eq("1.54 * 10^(-17)");
        expect(stateVariables["/m3a_v"].stateValues.text).eq("1.54 * 10^(-17)");
        expect(stateVariables["/m3b_v"].stateValues.text).eq("0");
        expect(stateVariables["/m3c_v"].stateValues.text).eq("0");
        expect(stateVariables["/m3d_v"].stateValues.text).eq("0");
        expect(stateVariables["/m3e_v"].stateValues.text).eq("0");
        expect(stateVariables["/m3f_v"].stateValues.text).eq("1.54 * 10^(-17)");

        expect(stateVariables["/m4"].stateValues.text).eq("8.00");
        expect(stateVariables["/m4a"].stateValues.text).eq("8.00");
        expect(stateVariables["/m4b"].stateValues.text).eq("16");
        expect(stateVariables["/m4c"].stateValues.text).eq("16");
        expect(stateVariables["/m4d"].stateValues.text).eq("16");
        expect(stateVariables["/m4e"].stateValues.text).eq("16");
        expect(stateVariables["/m4f"].stateValues.text).eq("8");

        expect(stateVariables["/m4_v"].stateValues.text).eq("8.00");
        expect(stateVariables["/m4a_v"].stateValues.text).eq("8.00");
        expect(stateVariables["/m4b_v"].stateValues.text).eq("16");
        expect(stateVariables["/m4c_v"].stateValues.text).eq("16");
        expect(stateVariables["/m4d_v"].stateValues.text).eq("16");
        expect(stateVariables["/m4e_v"].stateValues.text).eq("16");
        expect(stateVariables["/m4f_v"].stateValues.text).eq("8");
    });

    it("value on NaN", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><text>a</text></p>
  
  <p>
    <mathinput name="mi1" />
    <number name="n1">$mi1</number>
  </p>
  
  <p>
    <mathinput name="mi2" />
    <number name="n2" valueOnNaN="3">$mi2</number>
  </p>

  <p>
    <mathinput name="mi3" bindValueTo="$n3" hideNaN="false" />
    <number name="n3" />
  </p>

  <p>
    <mathinput name="mi4" bindValueTo="$n4" />
    <number name="n4" valueOnNan="5" />
  </p>


  <p>
    <mathinput name="mi1a" />
    <number name="n1a"><number>$mi1a</number></number>
  </p>
  
  <p>
    <mathinput name="mi2a" />
    <number name="n2a" valueOnNaN="3"><number>$mi2a</number></number>
  </p>
  
  <p>
    <mathinput name="mi2b" />
    <number name="n2b"><number valueOnNaN="3">$mi2b</number></number>
  </p>

  <p>
    <mathinput name="mi3a" bindValueTo="$n3a" />
    <number name="n3a"><number /></number>
  </p>

  <p>
    <mathinput name="mi4a" bindValueTo="$n4a" />
    <number name="n4a" valueOnNan="5"><number/></number>
  </p>

  <p>
    <mathinput name="mi4b" bindValueTo="$n4b" />
    <number name="n4b"><number valueOnNan="5"/></number>
  </p>


  <p>
    <number name="n5">8/</number>
    <number name="n6" valueOnNan="7">8/</number>
  </p>

  <p>
    <boolean name="b" hide />
    <number name="n7" convertBoolean>$b>y</number>
    <number name="n8" convertBoolean valueOnNaN="9">$b>y</number>
  </p>

  <p>
    <number name="n9">x>y</number>
    <number name="n10" valueOnNaN="-9">x>y</number>
  </p>

  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi1"].stateValues.rawRendererValue).eq("");
        expect(stateVariables["/n1"].stateValues.value).eqls(NaN);

        expect(stateVariables["/mi2"].stateValues.rawRendererValue).eq("");
        expect(stateVariables["/n2"].stateValues.value).eq(3);

        expect(stateVariables["/mi3"].stateValues.rawRendererValue).eq("NaN");
        expect(stateVariables["/n3"].stateValues.value).eqls(NaN);

        expect(stateVariables["/mi4"].stateValues.rawRendererValue).eq("5");
        expect(stateVariables["/n4"].stateValues.value).eq(5);

        expect(stateVariables["/mi1a"].stateValues.rawRendererValue).eq("");
        expect(stateVariables["/n1a"].stateValues.value).eqls(NaN);

        expect(stateVariables["/mi2a"].stateValues.rawRendererValue).eq("");
        expect(stateVariables["/n2a"].stateValues.value).eq(3);

        expect(stateVariables["/mi3a"].stateValues.rawRendererValue).eq("");
        expect(stateVariables["/n3a"].stateValues.value).eqls(NaN);

        expect(stateVariables["/mi4a"].stateValues.rawRendererValue).eq("5");
        expect(stateVariables["/n4a"].stateValues.value).eq(5);

        expect(stateVariables["/mi2b"].stateValues.rawRendererValue).eq("");
        expect(stateVariables["/n2b"].stateValues.value).eq(3);

        expect(stateVariables["/mi4b"].stateValues.rawRendererValue).eq("5");
        expect(stateVariables["/n4b"].stateValues.value).eq(5);

        expect(stateVariables["/n5"].stateValues.value).eqls(NaN);
        expect(stateVariables["/n6"].stateValues.value).eq(7);

        expect(stateVariables["/n7"].stateValues.value).eqls(NaN);
        expect(stateVariables["/n8"].stateValues.value).eq(9);

        expect(stateVariables["/n9"].stateValues.value).eqls(NaN);
        expect(stateVariables["/n10"].stateValues.value).eq(-9);

        await updateMathInputValue({
            latex: "3/4",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "3/4",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "3/4",
            name: "/mi3",
            core,
        });
        await updateMathInputValue({
            latex: "3/4",
            name: "/mi4",
            core,
        });
        await updateMathInputValue({
            latex: "3/4",
            name: "/mi1a",
            core,
        });
        await updateMathInputValue({
            latex: "3/4",
            name: "/mi2a",
            core,
        });
        await updateMathInputValue({
            latex: "3/4",
            name: "/mi3a",
            core,
        });
        await updateMathInputValue({
            latex: "3/4",
            name: "/mi4a",
            core,
        });
        await updateMathInputValue({
            latex: "3/4",
            name: "/mi2b",
            core,
        });
        await updateMathInputValue({
            latex: "3/4",
            name: "/mi4b",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi1"].stateValues.rawRendererValue).eq("3/4");
        expect(stateVariables["/n1"].stateValues.value).eq(0.75);

        expect(stateVariables["/mi2"].stateValues.rawRendererValue).eq("3/4");
        expect(stateVariables["/n2"].stateValues.value).eq(0.75);

        expect(stateVariables["/mi3"].stateValues.rawRendererValue).eq("0.75");
        expect(stateVariables["/n3"].stateValues.value).eq(0.75);

        expect(stateVariables["/mi4"].stateValues.rawRendererValue).eq("0.75");
        expect(stateVariables["/n4"].stateValues.value).eq(0.75);

        expect(stateVariables["/mi1a"].stateValues.rawRendererValue).eq("3/4");
        expect(stateVariables["/n1a"].stateValues.value).eq(0.75);

        expect(stateVariables["/mi2a"].stateValues.rawRendererValue).eq("3/4");
        expect(stateVariables["/n2a"].stateValues.value).eq(0.75);

        expect(stateVariables["/mi3a"].stateValues.rawRendererValue).eq("0.75");
        expect(stateVariables["/n3a"].stateValues.value).eq(0.75);

        expect(stateVariables["/mi4a"].stateValues.rawRendererValue).eq("0.75");
        expect(stateVariables["/n4a"].stateValues.value).eq(0.75);

        expect(stateVariables["/mi2b"].stateValues.rawRendererValue).eq("3/4");
        expect(stateVariables["/n2b"].stateValues.value).eq(0.75);

        expect(stateVariables["/mi4b"].stateValues.rawRendererValue).eq("0.75");
        expect(stateVariables["/n4b"].stateValues.value).eq(0.75);

        await updateMathInputValue({
            latex: "x",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "x",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "x",
            name: "/mi3",
            core,
        });
        await updateMathInputValue({
            latex: "x",
            name: "/mi4",
            core,
        });
        await updateMathInputValue({
            latex: "x",
            name: "/mi1a",
            core,
        });
        await updateMathInputValue({
            latex: "x",
            name: "/mi2a",
            core,
        });
        await updateMathInputValue({
            latex: "x",
            name: "/mi3a",
            core,
        });
        await updateMathInputValue({
            latex: "x",
            name: "/mi4a",
            core,
        });
        await updateMathInputValue({
            latex: "x",
            name: "/mi2b",
            core,
        });
        await updateMathInputValue({
            latex: "x",
            name: "/mi4b",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/mi1"].stateValues.rawRendererValue).eq("x");
        expect(stateVariables["/n1"].stateValues.value).eqls(NaN);

        expect(stateVariables["/mi2"].stateValues.rawRendererValue).eq("x");
        expect(stateVariables["/n2"].stateValues.value).eq(3);

        expect(stateVariables["/mi3"].stateValues.rawRendererValue).eq("NaN");
        expect(stateVariables["/n3"].stateValues.value).eqls(NaN);

        expect(stateVariables["/mi4"].stateValues.rawRendererValue).eq("5");
        expect(stateVariables["/n4"].stateValues.value).eq(5);

        expect(stateVariables["/mi1a"].stateValues.rawRendererValue).eq("x");
        expect(stateVariables["/n1a"].stateValues.value).eqls(NaN);

        expect(stateVariables["/mi2a"].stateValues.rawRendererValue).eq("x");
        expect(stateVariables["/n2a"].stateValues.value).eq(3);

        expect(stateVariables["/mi3a"].stateValues.rawRendererValue).eq("");
        expect(stateVariables["/n3a"].stateValues.value).eqls(NaN);

        expect(stateVariables["/mi4a"].stateValues.rawRendererValue).eq("5");
        expect(stateVariables["/n4a"].stateValues.value).eq(5);

        expect(stateVariables["/mi2b"].stateValues.rawRendererValue).eq("x");
        expect(stateVariables["/n2b"].stateValues.value).eq(3);

        expect(stateVariables["/mi4b"].stateValues.rawRendererValue).eq("5");
        expect(stateVariables["/n4b"].stateValues.value).eq(5);
    });

    it("indeterminate forms give NaN", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><number name="if1">0^0</number></p>
  <p><number name="if2">Infinity^0</number></p>
  <p><number name="if3">0/0</number></p>
  <p><number name="if4">Infinity/Infinity</number></p>
  <p><number name="if5">0*Infinity</number></p>
  <p><number name="if6">Infinity-Infinity</number></p>
  <p><number name="if7">1^Infinity</number></p>
  <p><number name="ifalt"><number>0^0</number>^0</number></p>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/if1"].stateValues.value).eqls(NaN);
        expect(stateVariables["/if2"].stateValues.value).eqls(NaN);
        expect(stateVariables["/if3"].stateValues.value).eqls(NaN);
        expect(stateVariables["/if4"].stateValues.value).eqls(NaN);
        expect(stateVariables["/if5"].stateValues.value).eqls(NaN);
        expect(stateVariables["/if6"].stateValues.value).eqls(NaN);
        expect(stateVariables["/if7"].stateValues.value).eqls(NaN);
        expect(stateVariables["/ifalt"].stateValues.value).eqls(NaN);
    });

    it("complex numbers", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><number name="i1">i</number></p>
  <p><math name="i1a">$i1</math></p>
  <p><number name="i2" displaySmallAsZero>sqrt(-1)</number></p>
  <p><number name="i3" displaySmallAsZero>exp(pi i/2)</number></p>
  <p><number name="i4">$ni1^3</number></p>
  <p><number name="i5">$ni2^3</number></p>
  <p><number name="i6" displaySmallAsZero>$ni3^3</number></p>
  <p><number name="i7">1/-i</number></p>
  <p><number name="i8" displaySmallAsZero>1/$ni4</number></p>
  <p><number name="i9">1/$ni5</number></p>
  <p><number name="i10" displaySmallAsZero>1/$ni6</number></p>
  <p><number name="i11">0+i</number></p>
  <p><number name="i12">1i</number></p>

  <p><number name="ni1">-i</number></p>
  <p><math name="ni1a">$ni1</math></p>
  <p><number name="ni2">i^3</number></p>
  <p><number name="ni3" displaySmallAsZero>(-1)^(3/2)</number></p>
  <p><number name="ni4" displaySmallAsZero>exp(3 pi i/2)</number></p>
  <p><number name="ni5">$i1^3</number></p>
  <p><number name="ni6" displaySmallAsZero>$i2^3</number></p>
  <p><number name="ni7" displaySmallAsZero>$i3^3</number></p>
  <p><number name="ni8">1/i</number></p>
  <p><number name="ni9">1/$i4</number></p>
  <p><number name="ni10">1/$i5</number></p>
  <p><number name="ni11" displaySmallAsZero>1/$i6</number></p>
  <p><number name="ni12">0-i</number></p>
  <p><number name="ni13">-1i</number></p>

  <p><number name="c1">2+3i</number></p>
  <p><number name="c2"><math>2+3i</math></number></p>
  <p><number name="c3">(2+3i)/(3+i)</number></p>
  <p><number name="c4"><math>2+3i</math>/<number>3+i</number></number></p>
  <p><number name="c5">Infinity i</number></p>
  <p><number name="c6"><math format="latex">\\infty i</math></number></p>
  <p><number name="c7">5+0i</number></p>
  <p><number name="c8"><math>5+0i</math></number></p>

  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/i1"].stateValues.text).eq("i");
        expect(cleanLatex(stateVariables["/i1a"].stateValues.latex)).eq("i");
        expect(stateVariables["/i2"].stateValues.text).eq("i");
        expect(stateVariables["/i3"].stateValues.text).eq("i");
        expect(stateVariables["/i4"].stateValues.text).eq("i");
        expect(stateVariables["/i5"].stateValues.text).eq("i");
        expect(stateVariables["/i6"].stateValues.text).eq("i");
        expect(stateVariables["/i7"].stateValues.text).eq("i");
        expect(stateVariables["/i8"].stateValues.text).eq("i");
        expect(stateVariables["/i9"].stateValues.text).eq("i");
        expect(stateVariables["/i10"].stateValues.text).eq("i");
        expect(stateVariables["/i11"].stateValues.text).eq("i");
        expect(stateVariables["/i12"].stateValues.text).eq("i");

        expect(stateVariables["/ni1"].stateValues.text).eq("-i");
        expect(cleanLatex(stateVariables["/ni1a"].stateValues.latex)).eq("-i");
        expect(stateVariables["/ni2"].stateValues.text).eq("-i");
        expect(stateVariables["/ni3"].stateValues.text).eq("-i");
        expect(stateVariables["/ni4"].stateValues.text).eq("-i");
        expect(stateVariables["/ni5"].stateValues.text).eq("-i");
        expect(stateVariables["/ni6"].stateValues.text).eq("-i");
        expect(stateVariables["/ni7"].stateValues.text).eq("-i");
        expect(stateVariables["/ni8"].stateValues.text).eq("-i");
        expect(stateVariables["/ni9"].stateValues.text).eq("-i");
        expect(stateVariables["/ni10"].stateValues.text).eq("-i");
        expect(stateVariables["/ni11"].stateValues.text).eq("-i");
        expect(stateVariables["/ni12"].stateValues.text).eq("-i");
        expect(stateVariables["/ni13"].stateValues.text).eq("-i");

        expect(stateVariables["/c1"].stateValues.text).eq("2 + 3 i");
        expect(stateVariables["/c2"].stateValues.text).eq("2 + 3 i");
        expect(stateVariables["/c3"].stateValues.text).eq("0.9 + 0.7 i");
        expect(stateVariables["/c4"].stateValues.text).eq("0.9 + 0.7 i");
        expect(stateVariables["/c5"].stateValues.text).eq("NaN + NaN i");
        expect(stateVariables["/c6"].stateValues.text).eq("NaN + NaN i");
        expect(stateVariables["/c7"].stateValues.text).eq("5");
        expect(stateVariables["/c8"].stateValues.text).eq("5");

        expect(stateVariables["/i1"].stateValues.value).eqls({
            re: 0,
            im: 1,
        });
        expect(stateVariables["/i1a"].stateValues.value.tree).eqls("i");
        expect(stateVariables["/i2"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/i2"].stateValues.value.im).eq(1);
        expect(stateVariables["/i3"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/i3"].stateValues.value.im).eq(1);
        expect(stateVariables["/i4"].stateValues.value.re).eq(0);
        expect(stateVariables["/i4"].stateValues.value.im).eq(1);
        expect(stateVariables["/i5"].stateValues.value.re).eq(0);
        expect(stateVariables["/i5"].stateValues.value.im).eq(1);
        expect(stateVariables["/i6"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/i6"].stateValues.value.im).eq(1);
        expect(stateVariables["/i7"].stateValues.value.re).eq(0);
        expect(stateVariables["/i7"].stateValues.value.im).eq(1);
        expect(stateVariables["/i8"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/i8"].stateValues.value.im).eq(1);
        expect(stateVariables["/i9"].stateValues.value.re).eq(0);
        expect(stateVariables["/i9"].stateValues.value.im).eq(1);
        expect(stateVariables["/i10"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/i10"].stateValues.value.im).eq(1);
        expect(stateVariables["/i11"].stateValues.value.re).eq(0);
        expect(stateVariables["/i11"].stateValues.value.im).eq(1);
        expect(stateVariables["/i12"].stateValues.value.re).eq(0);
        expect(stateVariables["/i12"].stateValues.value.im).eq(1);

        expect(stateVariables["/ni1"].stateValues.value.re).eq(0);
        expect(stateVariables["/ni1"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni1a"].stateValues.value.tree).eqls(["-", "i"]);
        expect(stateVariables["/ni2"].stateValues.value.re).eq(0);
        expect(stateVariables["/ni2"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni3"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/ni3"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni4"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/ni4"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni5"].stateValues.value.re).eq(0);
        expect(stateVariables["/ni5"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni6"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/ni6"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni7"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/ni7"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni8"].stateValues.value.re).eq(0);
        expect(stateVariables["/ni8"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni9"].stateValues.value.re).eq(0);
        expect(stateVariables["/ni9"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni10"].stateValues.value.re).eq(0);
        expect(stateVariables["/ni10"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni11"].stateValues.value.re).closeTo(0, 1e-14);
        expect(stateVariables["/ni11"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni12"].stateValues.value.re).eq(0);
        expect(stateVariables["/ni12"].stateValues.value.im).eq(-1);
        expect(stateVariables["/ni13"].stateValues.value.re).eq(0);
        expect(stateVariables["/ni13"].stateValues.value.im).eq(-1);

        expect(stateVariables["/c1"].stateValues.value.re).eq(2);
        expect(stateVariables["/c1"].stateValues.value.im).eq(3);
        expect(stateVariables["/c2"].stateValues.value.re).eq(2);
        expect(stateVariables["/c2"].stateValues.value.im).eq(3);
        expect(stateVariables["/c3"].stateValues.value.re).closeTo(0.9, 1e-14);
        expect(stateVariables["/c3"].stateValues.value.im).closeTo(0.7, 1e-14);
        expect(stateVariables["/c4"].stateValues.value.re).closeTo(0.9, 1e-14);
        expect(stateVariables["/c4"].stateValues.value.im).closeTo(0.7, 1e-14);
        expect(stateVariables["/c5"].stateValues.value.re).eqls(NaN);
        expect(stateVariables["/c5"].stateValues.value.im).eqls(NaN);
        expect(stateVariables["/c6"].stateValues.value.re).eqls(NaN);
        expect(stateVariables["/c6"].stateValues.value.im).eqls(NaN);
        expect(stateVariables["/c7"].stateValues.value).eq(5);
        expect(stateVariables["/c8"].stateValues.value).eq(5);
    });

    it("complex numbers and inverse definition", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><number name="n1">1</number> <mathinput bindValueto="$n1" name="mi1" /></p>
  <p><number name="n2"><number>1</number></number> <mathinput bindValueto="$n2" name="mi2" /></p>
  <p><number name="n3"></number> <mathinput bindValueto="$n3" name="mi3" /></p>

  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/n1"].stateValues.value).eqls(1);
        expect(stateVariables["/n2"].stateValues.value).eqls(1);
        expect(stateVariables["/n3"].stateValues.value).eqls(NaN);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls(1);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls(1);
        expect(stateVariables["/mi3"].stateValues.value.tree).eqls(NaN);

        await updateMathInputValue({ latex: "i", name: "/mi1", core });
        await updateMathInputValue({ latex: "i", name: "/mi2", core });
        await updateMathInputValue({ latex: "i", name: "/mi3", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n1"].stateValues.value).eqls({
            re: 0,
            im: 1,
        });
        expect(stateVariables["/n2"].stateValues.value).eqls({
            re: 0,
            im: 1,
        });
        expect(stateVariables["/n3"].stateValues.value).eqls({
            re: 0,
            im: 1,
        });
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("i");
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls("i");
        expect(stateVariables["/mi3"].stateValues.value.tree).eqls("i");

        await updateMathInputValue({
            latex: "i+2",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "i+2",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "i+2",
            name: "/mi3",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n1"].stateValues.value.re).eq(2);
        expect(stateVariables["/n1"].stateValues.value.im).eq(1);
        expect(stateVariables["/n2"].stateValues.value.re).eq(2);
        expect(stateVariables["/n2"].stateValues.value.im).eq(1);
        expect(stateVariables["/n3"].stateValues.value.re).eq(2);
        expect(stateVariables["/n3"].stateValues.value.im).eq(1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls([
            "+",
            2,
            "i",
        ]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls([
            "+",
            2,
            "i",
        ]);
        expect(stateVariables["/mi3"].stateValues.value.tree).eqls([
            "+",
            2,
            "i",
        ]);

        await updateMathInputValue({
            latex: "3+0i",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "3+0i",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "3+0i",
            name: "/mi3",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n1"].stateValues.value).eq(3);
        expect(stateVariables["/n2"].stateValues.value).eq(3);
        expect(stateVariables["/n3"].stateValues.value).eq(3);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls(3);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls(3);
        expect(stateVariables["/mi3"].stateValues.value.tree).eqls(3);

        await updateMathInputValue({
            latex: "1i",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "1i",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "1i",
            name: "/mi3",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n1"].stateValues.value).eqls({
            re: 0,
            im: 1,
        });
        expect(stateVariables["/n2"].stateValues.value).eqls({
            re: 0,
            im: 1,
        });
        expect(stateVariables["/n3"].stateValues.value).eqls({
            re: 0,
            im: 1,
        });
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls("i");
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls("i");
        expect(stateVariables["/mi3"].stateValues.value.tree).eqls("i");

        await updateMathInputValue({
            latex: "-1i+0",
            name: "/mi1",
            core,
        });
        await updateMathInputValue({
            latex: "-1i+0",
            name: "/mi2",
            core,
        });
        await updateMathInputValue({
            latex: "-1i+0",
            name: "/mi3",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n1"].stateValues.value.re).eq(0);
        expect(stateVariables["/n1"].stateValues.value.im).eq(-1);
        expect(stateVariables["/n2"].stateValues.value.re).eq(0);
        expect(stateVariables["/n2"].stateValues.value.im).eq(-1);
        expect(stateVariables["/n3"].stateValues.value.re).eq(0);
        expect(stateVariables["/n3"].stateValues.value.im).eq(-1);
        expect(stateVariables["/mi1"].stateValues.value.tree).eqls(["-", "i"]);
        expect(stateVariables["/mi2"].stateValues.value.tree).eqls(["-", "i"]);
        expect(stateVariables["/mi3"].stateValues.value.tree).eqls(["-", "i"]);
    });

    it("complex numbers, re and im", async () => {
        let core = await createTestCore({
            doenetML: `
  <p><number name="n1">re(2-4i)</number></p>
  <p><number name="n2">im(2-4i)</number></p>
  <p><number name="n3">re((2-4i)(3-i))</number></p>
  <p><number name="n4">im((2-4i)(3-i))</number></p>
  <p><number name="n1a"><math>re(2-4i)</math></number></p>
  <p><number name="n2a"><math>im(2-4i)</math></number></p>
  <p><number name="n3a"><math>re((2-4i)(3-i))</math></number></p>
  <p><number name="n4a"><math>im((2-4i)(3-i))</math></number></p>
  <p><number name="n1b"><math format="latex">\\Re(2-4i)</math></number></p>
  <p><number name="n2b"><math format="latex">\\Im(2-4i)</math></number></p>
  <p><number name="n3b"><math format="latex">\\Re((2-4i)(3-i))</math></number></p>
  <p><number name="n4b"><math format="latex">\\Im((2-4i)(3-i))</math></number></p>

  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n1"].stateValues.value).eq(2);
        expect(stateVariables["/n2"].stateValues.value).eq(-4);
        expect(stateVariables["/n3"].stateValues.value).eq(2);
        expect(stateVariables["/n4"].stateValues.value).eq(-14);
        expect(stateVariables["/n1a"].stateValues.value).eq(2);
        expect(stateVariables["/n2a"].stateValues.value).eq(-4);
        expect(stateVariables["/n3a"].stateValues.value).eq(2);
        expect(stateVariables["/n4a"].stateValues.value).eq(-14);
        expect(stateVariables["/n1b"].stateValues.value).eq(2);
        expect(stateVariables["/n2b"].stateValues.value).eq(-4);
        expect(stateVariables["/n3b"].stateValues.value).eq(2);
        expect(stateVariables["/n4b"].stateValues.value).eq(-14);
    });

    it("number in graph", async () => {
        const doenetMLsnippet = `
    <graph >
      <number anchor="$anchorCoords1" name="item1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" fixed="$fixed1" fixLocation="$fixLocation1">$content1</number>
      <number name="item2">-17</number>
    </graph>
        `;

        await test_in_graph(doenetMLsnippet, moveNumber);
    });
});
