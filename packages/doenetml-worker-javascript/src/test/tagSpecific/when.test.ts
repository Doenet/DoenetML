import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("When tag tests", async () => {
    it("value, fractionSatisfied, conditionSatisfied are public", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <text>a</text>
  <mathInput name="n" />
  <when matchPartial name="w">
    $n > 0 and $n > 1
  </when>

  <p>Value: <when extend="$w.value" name="v" /></p>
  <p>Condition satisfied: <boolean extend="$w.conditionSatisfied" name="cs" /></p>
  <p>Fraction satisfied: <number extend="$w.fractionSatisfied" name="fs" /></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("cs")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("fs")].stateValues.value,
        ).eq(0);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("cs")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("fs")].stateValues.value,
        ).eq(0.5);

        await updateMathInputValue({
            latex: "11",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("cs")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("fs")].stateValues.value,
        ).eq(1);

        await updateMathInputValue({
            latex: "-11",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("v")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("cs")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("fs")].stateValues.value,
        ).eq(0);
    });

    it("fraction satisfied on 2x2 matrix compare", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="A" format="latex">\\begin{pmatrix}1 & 2\\\\ 3 & 4\\end{pmatrix}</math>
  <math name="B" format="latex">\\begin{pmatrix}5 & 6\\\\ 7 & 8\\end{pmatrix}</math>
  <math name="C" format="latex">\\begin{pmatrix}1 & 6\\\\ 7 & 8\\end{pmatrix}</math>
  <math name="D" format="latex">\\begin{pmatrix}1 & 6\\\\ 4 & 7\\end{pmatrix}</math>

  <when matchPartial name="AA">$A = $A</when>
  <when matchPartial name="AB">$A = $B</when>
  <when matchPartial name="AC">$A = $C</when>
  <when matchPartial name="AD">$A = $D</when>
  <when matchPartial name="BA">$B = $A</when>
  <when matchPartial name="BB">$B = $B</when>
  <when matchPartial name="BC">$B = $C</when>
  <when matchPartial name="BD">$B = $D</when>
  <when matchPartial name="CA">$C = $A</when>
  <when matchPartial name="CB">$C = $B</when>
  <when matchPartial name="CC">$C = $C</when>
  <when matchPartial name="CD">$C = $D</when>
  <when matchPartial name="DA">$D = $A</when>
  <when matchPartial name="DB">$D = $B</when>
  <when matchPartial name="DC">$D = $C</when>
  <when matchPartial name="DD">$D = $D</when>

  <p>Fraction satisfied AA: <number name="fsAA" extend="$AA.fractionSatisfied" /></p>
  <p>Fraction satisfied AB: <number name="fsAB" extend="$AB.fractionSatisfied" /></p>
  <p>Fraction satisfied AC: <number name="fsAC" extend="$AC.fractionSatisfied" /></p>
  <p>Fraction satisfied AD: <number name="fsAD" extend="$AD.fractionSatisfied" /></p>
  <p>Fraction satisfied BA: <number name="fsBA" extend="$BA.fractionSatisfied" /></p>
  <p>Fraction satisfied BB: <number name="fsBB" extend="$BB.fractionSatisfied" /></p>
  <p>Fraction satisfied BC: <number name="fsBC" extend="$BC.fractionSatisfied" /></p>
  <p>Fraction satisfied BD: <number name="fsBD" extend="$BD.fractionSatisfied" /></p>
  <p>Fraction satisfied CA: <number name="fsCA" extend="$CA.fractionSatisfied" /></p>
  <p>Fraction satisfied CB: <number name="fsCB" extend="$CB.fractionSatisfied" /></p>
  <p>Fraction satisfied CC: <number name="fsCC" extend="$CC.fractionSatisfied" /></p>
  <p>Fraction satisfied CD: <number name="fsCD" extend="$CD.fractionSatisfied" /></p>
  <p>Fraction satisfied DA: <number name="fsDA" extend="$DA.fractionSatisfied" /></p>
  <p>Fraction satisfied DB: <number name="fsDB" extend="$DB.fractionSatisfied" /></p>
  <p>Fraction satisfied DC: <number name="fsDC" extend="$DC.fractionSatisfied" /></p>
  <p>Fraction satisfied DD: <number name="fsDD" extend="$DD.fractionSatisfied" /></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("fsAA")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsAB")].stateValues
                .value,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsAC")].stateValues
                .value,
        ).eq(0.25);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsAD")].stateValues
                .value,
        ).eq(0.25);

        expect(
            stateVariables[await resolvePathToNodeIdx("fsBA")].stateValues
                .value,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsBB")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsBC")].stateValues
                .value,
        ).eq(0.75);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsBD")].stateValues
                .value,
        ).eq(0.25);

        expect(
            stateVariables[await resolvePathToNodeIdx("fsCA")].stateValues
                .value,
        ).eq(0.25);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsCB")].stateValues
                .value,
        ).eq(0.75);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsCC")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsCD")].stateValues
                .value,
        ).eq(0.5);

        expect(
            stateVariables[await resolvePathToNodeIdx("fsDA")].stateValues
                .value,
        ).eq(0.25);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsDB")].stateValues
                .value,
        ).eq(0.25);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsDC")].stateValues
                .value,
        ).eq(0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsDD")].stateValues
                .value,
        ).eq(1);
    });

    it("fraction satisfied on mismatched size matrix compare", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="A" format="latex">\\begin{pmatrix}1\\end{pmatrix}</math>
  <math name="B" format="latex">\\begin{pmatrix}1 & 8\\end{pmatrix}</math>
  <math name="C" format="latex">\\begin{pmatrix}1\\\\8\\end{pmatrix}</math>
  <math name="D" format="latex">\\begin{pmatrix}1 & 6\\\\ 8 & 7\\end{pmatrix}</math>

  <when matchPartial name="AA">$A = $A</when>
  <when matchPartial name="AB">$A = $B</when>
  <when matchPartial name="AC">$A = $C</when>
  <when matchPartial name="AD">$A = $D</when>
  <when matchPartial name="BA">$B = $A</when>
  <when matchPartial name="BB">$B = $B</when>
  <when matchPartial name="BC">$B = $C</when>
  <when matchPartial name="BD">$B = $D</when>
  <when matchPartial name="CA">$C = $A</when>
  <when matchPartial name="CB">$C = $B</when>
  <when matchPartial name="CC">$C = $C</when>
  <when matchPartial name="CD">$C = $D</when>
  <when matchPartial name="DA">$D = $A</when>
  <when matchPartial name="DB">$D = $B</when>
  <when matchPartial name="DC">$D = $C</when>
  <when matchPartial name="DD">$D = $D</when>

  <p>Fraction satisfied AA: <number name="fsAA" extend="$AA.fractionSatisfied" /></p>
  <p>Fraction satisfied AB: <number name="fsAB" extend="$AB.fractionSatisfied" /></p>
  <p>Fraction satisfied AC: <number name="fsAC" extend="$AC.fractionSatisfied" /></p>
  <p>Fraction satisfied AD: <number name="fsAD" extend="$AD.fractionSatisfied" /></p>
  <p>Fraction satisfied BA: <number name="fsBA" extend="$BA.fractionSatisfied" /></p>
  <p>Fraction satisfied BB: <number name="fsBB" extend="$BB.fractionSatisfied" /></p>
  <p>Fraction satisfied BC: <number name="fsBC" extend="$BC.fractionSatisfied" /></p>
  <p>Fraction satisfied BD: <number name="fsBD" extend="$BD.fractionSatisfied" /></p>
  <p>Fraction satisfied CA: <number name="fsCA" extend="$CA.fractionSatisfied" /></p>
  <p>Fraction satisfied CB: <number name="fsCB" extend="$CB.fractionSatisfied" /></p>
  <p>Fraction satisfied CC: <number name="fsCC" extend="$CC.fractionSatisfied" /></p>
  <p>Fraction satisfied CD: <number name="fsCD" extend="$CD.fractionSatisfied" /></p>
  <p>Fraction satisfied DA: <number name="fsDA" extend="$DA.fractionSatisfied" /></p>
  <p>Fraction satisfied DB: <number name="fsDB" extend="$DB.fractionSatisfied" /></p>
  <p>Fraction satisfied DC: <number name="fsDC" extend="$DC.fractionSatisfied" /></p>
  <p>Fraction satisfied DD: <number name="fsDD" extend="$DD.fractionSatisfied" /></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("fsAA")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsAB")].stateValues
                .value,
        ).eq(0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsAC")].stateValues
                .value,
        ).eq(0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsAD")].stateValues
                .value,
        ).eq(0.25);

        expect(
            stateVariables[await resolvePathToNodeIdx("fsBA")].stateValues
                .value,
        ).eq(0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsBB")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsBC")].stateValues
                .value,
        ).eq(0.25);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsBD")].stateValues
                .value,
        ).eq(0.25);

        expect(
            stateVariables[await resolvePathToNodeIdx("fsCA")].stateValues
                .value,
        ).eq(0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsCB")].stateValues
                .value,
        ).eq(0.25);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsCC")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsCD")].stateValues
                .value,
        ).eq(0.5);

        expect(
            stateVariables[await resolvePathToNodeIdx("fsDA")].stateValues
                .value,
        ).eq(0.25);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsDB")].stateValues
                .value,
        ).eq(0.25);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsDC")].stateValues
                .value,
        ).eq(0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("fsDD")].stateValues
                .value,
        ).eq(1);
    });
});
