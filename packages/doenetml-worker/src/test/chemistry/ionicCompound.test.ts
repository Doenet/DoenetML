import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Ionic Compounds tests", async () => {
    it("answer compounds from atom and ions", async () => {
        const core = await createTestCore({
            doenetML: `
  <p>What is the ionic compound from <atom name="Li" symbol="Li" /> and <atom name="O" symbol="O" />?
    <answer name="ansLiO" splitSymbols="false"><ionicCompound name="LiO">$Li$O</ionicCompound></answer>
  </p>

  <p>What is the ionic compound from <atom name="Ca" symbol="Ca" /> and <atom name="P" symbol="P" />?
    <answer name="ansCaP" splitSymbols="false"><math><ionicCompound name="CaP">$Ca<ion>$P</ion></ionicCompound></math></answer>
  </p>
 
  <p>What is the ionic compound from <atom name="Mg" symbol="Mg" /> and <atom name="S" symbol="S" />?
    <answer name="ansMgS" splitSymbols="false"><ionicCompound name="MgS"><ion>$Mg</ion><ion>$S</ion></ionicCompound></answer>
  </p>
 
  <p>What is the ionic compound from <atom name="Sr" symbol="Sr" /> and <atom name="I" symbol="I" />?
    <answer name="ansSrI" splitSymbols="false"><ionicCompound name="SrI"><ion>$Sr</ion>$I</ionicCompound></answer>
  </p>

  `,
        });

        async function test_ionic_compound({
            name,
            responseCredits,
            text,
            latex,
            math,
        }: {
            name: string;
            responseCredits: Record<string, number>;
            text: string;
            latex: string;
            math: any;
        }) {
            let stateVariables = await returnAllStateVariables(core);
            let mi =
                stateVariables[`/ans${name}`].stateValues.inputChildren[0]
                    .componentName;

            expect(stateVariables[`/${name}`].stateValues.latex).eq(latex);
            expect(stateVariables[`/${name}`].stateValues.text).eq(text);
            expect(stateVariables[`/${name}`].stateValues.math.tree).eqls(math);

            for (let resp in responseCredits) {
                await updateMathInputValue({ name: mi, latex: resp, core });
                await submitAnswer({ name: `/ans${name}`, core });
                stateVariables = await returnAllStateVariables(core);
                expect(
                    stateVariables[`/ans${name}`].stateValues.creditAchieved,
                ).eq(responseCredits[resp]);
            }
        }

        await test_ionic_compound({
            name: "LiO",
            responseCredits: { LiO: 0, "Li O": 0, Li_2O: 1 },
            latex: "\\text{Li}_{2} \\text{O}",
            text: "Li_2 O",
            math: ["*", ["_", "Li", 2], "O"],
        });

        await test_ionic_compound({
            name: "CaP",
            responseCredits: { CaP: 0, Ca_3P: 0, Ca_3P_2: 1 },
            latex: "\\text{Ca}_{3} \\text{P}_{2}",
            text: "Ca_3 P_2",
            math: ["*", ["_", "Ca", 3], ["_", "P", 2]],
        });

        await test_ionic_compound({
            name: "MgS",
            responseCredits: { MgS: 0, "Mg S": 1 },
            latex: "\\text{Mg} \\text{S}",
            text: "Mg S",
            math: ["*", "Mg", "S"],
        });

        await test_ionic_compound({
            name: "SrI",
            responseCredits: { SrI: 0, SrI_2: 0, "Sr I_2": 1 },
            latex: "\\text{Sr} \\text{I}_{2}",
            text: "Sr I_2",
            math: ["*", "Sr", ["_", "I", 2]],
        });
    });

    it("warnings", async () => {
        const core = await createTestCore({
            doenetML: `
  <atom name="Li" symbol="Li" /> <atom name="O" symbol="O" /> <atom name="Ca" symbol="Ca" />

  <ionicCompound>$Li$O$Ca</ionicCompound>
  <ionicCompound>$Li$Ca</ionicCompound>
  `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        expect(errorWarnings.warnings[0].message).contain(
            `Have not implemented ionic compound for anything other than two ions`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(41);

        expect(errorWarnings.warnings[1].message).contain(
            `Ionic compound implemented only for one cation and one anion`,
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(5);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(5);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(39);
    });
});