import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "./utils/test-core";
import { updateMathInputValue } from "./utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("When tag tests", async () => {
    it("value, fractionSatisfied, conditionSatisfied are public", async () => {
        let core = await createTestCore({
            doenetML: `
  <text>a</text>
  <mathInput name="n" />
  <when matchPartial name="w">
    $n > 0 and $n > 1
  </when>

  <p>Value: $w.value{assignNames="v"}</p>
  <p>Condition satisfied: $w.conditionSatisfied{assignNames="cs"}</p>
  <p>Fraction satisfied: $w.fractionSatisfied{assignNames="fs"}</p>

  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/v"].stateValues.value).eq(false);
        expect(stateVariables["/cs"].stateValues.value).eq(false);
        expect(stateVariables["/fs"].stateValues.value).eq(0);

        await updateMathInputValue({ latex: "1", componentName: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/v"].stateValues.value).eq(false);
        expect(stateVariables["/cs"].stateValues.value).eq(false);
        expect(stateVariables["/fs"].stateValues.value).eq(0.5);

        await updateMathInputValue({ latex: "11", componentName: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/v"].stateValues.value).eq(true);
        expect(stateVariables["/cs"].stateValues.value).eq(true);
        expect(stateVariables["/fs"].stateValues.value).eq(1);

        await updateMathInputValue({ latex: "-11", componentName: "/n", core });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/v"].stateValues.value).eq(false);
        expect(stateVariables["/cs"].stateValues.value).eq(false);
        expect(stateVariables["/fs"].stateValues.value).eq(0);
    });

    it("fraction satisfied on 2x2 matrix compare", async () => {
        let core = await createTestCore({
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

  <p>Fraction satisfied AA: <number name="fsAA" copySource="AA.fractionSatisfied" /></p>
  <p>Fraction satisfied AB: <number name="fsAB" copySource="AB.fractionSatisfied" /></p>
  <p>Fraction satisfied AC: <number name="fsAC" copySource="AC.fractionSatisfied" /></p>
  <p>Fraction satisfied AD: <number name="fsAD" copySource="AD.fractionSatisfied" /></p>
  <p>Fraction satisfied BA: <number name="fsBA" copySource="BA.fractionSatisfied" /></p>
  <p>Fraction satisfied BB: <number name="fsBB" copySource="BB.fractionSatisfied" /></p>
  <p>Fraction satisfied BC: <number name="fsBC" copySource="BC.fractionSatisfied" /></p>
  <p>Fraction satisfied BD: <number name="fsBD" copySource="BD.fractionSatisfied" /></p>
  <p>Fraction satisfied CA: <number name="fsCA" copySource="CA.fractionSatisfied" /></p>
  <p>Fraction satisfied CB: <number name="fsCB" copySource="CB.fractionSatisfied" /></p>
  <p>Fraction satisfied CC: <number name="fsCC" copySource="CC.fractionSatisfied" /></p>
  <p>Fraction satisfied CD: <number name="fsCD" copySource="CD.fractionSatisfied" /></p>
  <p>Fraction satisfied DA: <number name="fsDA" copySource="DA.fractionSatisfied" /></p>
  <p>Fraction satisfied DB: <number name="fsDB" copySource="DB.fractionSatisfied" /></p>
  <p>Fraction satisfied DC: <number name="fsDC" copySource="DC.fractionSatisfied" /></p>
  <p>Fraction satisfied DD: <number name="fsDD" copySource="DD.fractionSatisfied" /></p>

  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/fsAA"].stateValues.value).eq(1);
        expect(stateVariables["/fsAB"].stateValues.value).eq(0);
        expect(stateVariables["/fsAC"].stateValues.value).eq(0.25);
        expect(stateVariables["/fsAD"].stateValues.value).eq(0.25);

        expect(stateVariables["/fsBA"].stateValues.value).eq(0);
        expect(stateVariables["/fsBB"].stateValues.value).eq(1);
        expect(stateVariables["/fsBC"].stateValues.value).eq(0.75);
        expect(stateVariables["/fsBD"].stateValues.value).eq(0.25);

        expect(stateVariables["/fsCA"].stateValues.value).eq(0.25);
        expect(stateVariables["/fsCB"].stateValues.value).eq(0.75);
        expect(stateVariables["/fsCC"].stateValues.value).eq(1);
        expect(stateVariables["/fsCD"].stateValues.value).eq(0.5);

        expect(stateVariables["/fsDA"].stateValues.value).eq(0.25);
        expect(stateVariables["/fsDB"].stateValues.value).eq(0.25);
        expect(stateVariables["/fsDC"].stateValues.value).eq(0.5);
        expect(stateVariables["/fsDD"].stateValues.value).eq(1);
    });

    it("fraction satisfied on mismatched size matrix compare", async () => {
        let core = await createTestCore({
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

  <p>Fraction satisfied AA: <number name="fsAA" copySource="AA.fractionSatisfied" /></p>
  <p>Fraction satisfied AB: <number name="fsAB" copySource="AB.fractionSatisfied" /></p>
  <p>Fraction satisfied AC: <number name="fsAC" copySource="AC.fractionSatisfied" /></p>
  <p>Fraction satisfied AD: <number name="fsAD" copySource="AD.fractionSatisfied" /></p>
  <p>Fraction satisfied BA: <number name="fsBA" copySource="BA.fractionSatisfied" /></p>
  <p>Fraction satisfied BB: <number name="fsBB" copySource="BB.fractionSatisfied" /></p>
  <p>Fraction satisfied BC: <number name="fsBC" copySource="BC.fractionSatisfied" /></p>
  <p>Fraction satisfied BD: <number name="fsBD" copySource="BD.fractionSatisfied" /></p>
  <p>Fraction satisfied CA: <number name="fsCA" copySource="CA.fractionSatisfied" /></p>
  <p>Fraction satisfied CB: <number name="fsCB" copySource="CB.fractionSatisfied" /></p>
  <p>Fraction satisfied CC: <number name="fsCC" copySource="CC.fractionSatisfied" /></p>
  <p>Fraction satisfied CD: <number name="fsCD" copySource="CD.fractionSatisfied" /></p>
  <p>Fraction satisfied DA: <number name="fsDA" copySource="DA.fractionSatisfied" /></p>
  <p>Fraction satisfied DB: <number name="fsDB" copySource="DB.fractionSatisfied" /></p>
  <p>Fraction satisfied DC: <number name="fsDC" copySource="DC.fractionSatisfied" /></p>
  <p>Fraction satisfied DD: <number name="fsDD" copySource="DD.fractionSatisfied" /></p>

  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/fsAA"].stateValues.value).eq(1);
        expect(stateVariables["/fsAB"].stateValues.value).eq(0.5);
        expect(stateVariables["/fsAC"].stateValues.value).eq(0.5);
        expect(stateVariables["/fsAD"].stateValues.value).eq(0.25);

        expect(stateVariables["/fsBA"].stateValues.value).eq(0.5);
        expect(stateVariables["/fsBB"].stateValues.value).eq(1);
        expect(stateVariables["/fsBC"].stateValues.value).eq(0.25);
        expect(stateVariables["/fsBD"].stateValues.value).eq(0.25);

        expect(stateVariables["/fsCA"].stateValues.value).eq(0.5);
        expect(stateVariables["/fsCB"].stateValues.value).eq(0.25);
        expect(stateVariables["/fsCC"].stateValues.value).eq(1);
        expect(stateVariables["/fsCD"].stateValues.value).eq(0.5);

        expect(stateVariables["/fsDA"].stateValues.value).eq(0.25);
        expect(stateVariables["/fsDB"].stateValues.value).eq(0.25);
        expect(stateVariables["/fsDC"].stateValues.value).eq(0.5);
        expect(stateVariables["/fsDD"].stateValues.value).eq(1);
    });
});
