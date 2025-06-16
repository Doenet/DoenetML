import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { atomDatabase } from "@doenet/static-assets";
//@ts-ignore
import me from "math-expressions";
import { superSubscriptsToUnicode } from "../../utils/math";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Atom tests", async () => {
    it("information on atom", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <title>Information on atom</title>

  <setup>
    <atom atomicNumber="$aNum" name="atom" />
  </setup>
  
  <p>Atomic number: <mathInput name="aNum" prefill="1" /></p>
  
  <p>Name: <text extend="$atom.name" name="name" /></p>
  <p>Symbol: <text extend="$atom.symbol" name="symbol" /></p>
  <p>Atomic number: <number extend="$atom.atomicNumber" name="atomicNumber" /></p>
  <p>Group: <integer extend="$atom.group" name="group" /></p>
  <p>Group Name: <text extend="$atom.groupName" name="groupName" /></p>
  <p>Atomic mass: <number extend="$atom.atomicMass" name="atomicMass" displayDigits="10" /></p>
  <p>Phase at STP: <text extend="$atom.phaseAtSTP" name="phaseAtSTP" displayDigits="10" /></p>
  <p>Charge of common ion: <integer extend="$atom.chargeOfCommonIon" name="chargeOfCommonIon" displayDigits="10" /></p>
  <p>Metal category: <text extend="$atom.metalCategory" name="metalCategory" displayDigits="10" /></p>
  <p>Period: <integer extend="$atom.period" name="period" displayDigits="10" /></p>
  <p>Ionization energy: <number extend="$atom.ionizationEnergy" name="ionizationEnergy" displayDigits="10" /></p>
  <p>Melting point: <number extend="$atom.meltingPoint" name="meltingPoint" displayDigits="10" /></p>
  <p>Boiling point: <number extend="$atom.boilingPoint" name="boilingPoint" displayDigits="10" /></p>
  <p>Atomic radius: <integer extend="$atom.atomicRadius" name="atomicRadius" displayDigits="10" /></p>
  <p>Density: <number extend="$atom.density" name="density" displayDigits="10" /></p>
  <p>Electronegativity: <number extend="$atom.electronegativity" name="electronegativity" displayDigits="10" /></p>
  <p>Electron configuration: <electronConfiguration extend="$atom.electronConfiguration" name="electronConfiguration" /></p>
  Orbital diagram: <orbitalDiagram extend="$atom.orbitalDiagram" name="orbitalDiagram" />
    `,
        });

        let to_number = (x: string) => (x ? Number(x) : NaN);

        async function check_atom(atomicNumber: number) {
            const data = atomDatabase[atomicNumber - 1];

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const symbol = data["Symbol"];
            expect(
                stateVariables[await resolvePathToNodeIdx("atom")].stateValues
                    .latex,
            ).eq(`\\text{${symbol}}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("atom")].stateValues
                    .text,
            ).eq(symbol);
            expect(
                stateVariables[await resolvePathToNodeIdx("atom")].stateValues
                    .math.tree,
            ).eq(symbol);

            expect(
                stateVariables[await resolvePathToNodeIdx("name")].stateValues
                    .value,
            ).eq(data["Name"]);
            expect(
                stateVariables[await resolvePathToNodeIdx("symbol")].stateValues
                    .value,
            ).eq(symbol);
            expect(
                stateVariables[await resolvePathToNodeIdx("atomicNumber")]
                    .stateValues.value,
            ).eq(atomicNumber);
            expect(
                stateVariables[await resolvePathToNodeIdx("group")].stateValues
                    .value,
            ).eqls(to_number(data["Group"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("groupName")]
                    .stateValues.value,
            ).eq(data["Group Name"]);
            expect(
                stateVariables[await resolvePathToNodeIdx("atomicMass")]
                    .stateValues.value,
            ).eqls(to_number(data["Atomic Mass"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("phaseAtSTP")]
                    .stateValues.value,
            ).eq(data["Phase at STP"]);
            expect(
                stateVariables[await resolvePathToNodeIdx("chargeOfCommonIon")]
                    .stateValues.value,
            ).eqls(to_number(data["Charge of Common Ion"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("metalCategory")]
                    .stateValues.value,
            ).eq(data["Metal/Nonmetal/Metalloid"]);
            expect(
                stateVariables[await resolvePathToNodeIdx("period")].stateValues
                    .value,
            ).eqls(to_number(data["Period"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("ionizationEnergy")]
                    .stateValues.value,
            ).eqls(to_number(data["Ionization Energy"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("period")].stateValues
                    .value,
            ).eqls(to_number(data["Period"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("meltingPoint")]
                    .stateValues.value,
            ).eqls(to_number(data["Melting Point"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("boilingPoint")]
                    .stateValues.value,
            ).eqls(to_number(data["Boiling Point"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("atomicRadius")]
                    .stateValues.value,
            ).eqls(to_number(data["Atomic Radius"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("density")]
                    .stateValues.value,
            ).eqls(to_number(data["Density"]));
            expect(
                stateVariables[await resolvePathToNodeIdx("electronegativity")]
                    .stateValues.value,
            ).eqls(to_number(data["Electronegativity"]));
            let eConfig = data["Electron Configuration"];
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("electronConfiguration")
                ].stateValues.value.tree,
            ).eqls(me.fromText(eConfig).tree);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("electronConfiguration")
                ].stateValues.latex
                    .replaceAll(" ", "")
                    .replaceAll("~", " "),
            ).eq(eConfig.replaceAll(/\^(\d+)/g, "^{$1}"));
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("electronConfiguration")
                ].stateValues.text,
            ).eq(superSubscriptsToUnicode(eConfig));
        }

        let aNum = 1;
        await check_atom(aNum);

        aNum = 2;
        await updateMathInputValue({
            latex: `${aNum}`,
            componentIdx: await resolvePathToNodeIdx("aNum"),
            core,
        });
        await check_atom(aNum);

        aNum = 12;
        await updateMathInputValue({
            latex: `${aNum}`,
            componentIdx: await resolvePathToNodeIdx("aNum"),
            core,
        });
        await check_atom(aNum);

        aNum = 52;
        await updateMathInputValue({
            latex: `${aNum}`,
            componentIdx: await resolvePathToNodeIdx("aNum"),
            core,
        });
        await check_atom(aNum);
    });

    it("sort atoms", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Originals: <group name="original" asList>
    <atom symbol="C" />
    <atom symbol="He" />
    <atom symbol="as" />
    <atom symbol="o" />
  </group></p>

  <p name="pAn">Sort by atomic number: <sort sortByProp="atomicNumber">$original</sort></p>
  <p name="pAr">Sort by atomic radius: <sort sortByProp="atomicRadius">$original</sort></p>
  <p name="pIe">Sort by ionization energy: <sort sortByProp="ionizationEnergy">$original</sort></p>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pAn")].stateValues.text,
        ).eq("Sort by atomic number: He, C, O, As");
        expect(
            stateVariables[await resolvePathToNodeIdx("pAr")].stateValues.text,
        ).eq("Sort by atomic radius: He, O, C, As");
        expect(
            stateVariables[await resolvePathToNodeIdx("pIe")].stateValues.text,
        ).eq("Sort by ionization energy: As, C, O, He");
    });
});
