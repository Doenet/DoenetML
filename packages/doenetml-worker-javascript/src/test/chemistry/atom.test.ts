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
        const { core, resolveComponentName } = await createTestCore({
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
                stateVariables[resolveComponentName("atom")].stateValues.latex,
            ).eq(`\\text{${symbol}}`);
            expect(
                stateVariables[resolveComponentName("atom")].stateValues.text,
            ).eq(symbol);
            expect(
                stateVariables[resolveComponentName("atom")].stateValues.math
                    .tree,
            ).eq(symbol);

            expect(
                stateVariables[resolveComponentName("name")].stateValues.value,
            ).eq(data["Name"]);
            expect(
                stateVariables[resolveComponentName("symbol")].stateValues
                    .value,
            ).eq(symbol);
            expect(
                stateVariables[resolveComponentName("atomicNumber")].stateValues
                    .value,
            ).eq(atomicNumber);
            expect(
                stateVariables[resolveComponentName("group")].stateValues.value,
            ).eqls(to_number(data["Group"]));
            expect(
                stateVariables[resolveComponentName("groupName")].stateValues
                    .value,
            ).eq(data["Group Name"]);
            expect(
                stateVariables[resolveComponentName("atomicMass")].stateValues
                    .value,
            ).eqls(to_number(data["Atomic Mass"]));
            expect(
                stateVariables[resolveComponentName("phaseAtSTP")].stateValues
                    .value,
            ).eq(data["Phase at STP"]);
            expect(
                stateVariables[resolveComponentName("chargeOfCommonIon")]
                    .stateValues.value,
            ).eqls(to_number(data["Charge of Common Ion"]));
            expect(
                stateVariables[resolveComponentName("metalCategory")]
                    .stateValues.value,
            ).eq(data["Metal/Nonmetal/Metalloid"]);
            expect(
                stateVariables[resolveComponentName("period")].stateValues
                    .value,
            ).eqls(to_number(data["Period"]));
            expect(
                stateVariables[resolveComponentName("ionizationEnergy")]
                    .stateValues.value,
            ).eqls(to_number(data["Ionization Energy"]));
            expect(
                stateVariables[resolveComponentName("period")].stateValues
                    .value,
            ).eqls(to_number(data["Period"]));
            expect(
                stateVariables[resolveComponentName("meltingPoint")].stateValues
                    .value,
            ).eqls(to_number(data["Melting Point"]));
            expect(
                stateVariables[resolveComponentName("boilingPoint")].stateValues
                    .value,
            ).eqls(to_number(data["Boiling Point"]));
            expect(
                stateVariables[resolveComponentName("atomicRadius")].stateValues
                    .value,
            ).eqls(to_number(data["Atomic Radius"]));
            expect(
                stateVariables[resolveComponentName("density")].stateValues
                    .value,
            ).eqls(to_number(data["Density"]));
            expect(
                stateVariables[resolveComponentName("electronegativity")]
                    .stateValues.value,
            ).eqls(to_number(data["Electronegativity"]));
            let eConfig = data["Electron Configuration"];
            expect(
                stateVariables[resolveComponentName("electronConfiguration")]
                    .stateValues.value.tree,
            ).eqls(me.fromText(eConfig).tree);
            expect(
                stateVariables[
                    resolveComponentName("electronConfiguration")
                ].stateValues.latex
                    .replaceAll(" ", "")
                    .replaceAll("~", " "),
            ).eq(eConfig.replaceAll(/\^(\d+)/g, "^{$1}"));
            expect(
                stateVariables[resolveComponentName("electronConfiguration")]
                    .stateValues.text,
            ).eq(superSubscriptsToUnicode(eConfig));
        }

        let aNum = 1;
        await check_atom(aNum);

        aNum = 2;
        await updateMathInputValue({
            latex: `${aNum}`,
            componentIdx: resolveComponentName("aNum"),
            core,
        });
        await check_atom(aNum);

        aNum = 12;
        await updateMathInputValue({
            latex: `${aNum}`,
            componentIdx: resolveComponentName("aNum"),
            core,
        });
        await check_atom(aNum);

        aNum = 52;
        await updateMathInputValue({
            latex: `${aNum}`,
            componentIdx: resolveComponentName("aNum"),
            core,
        });
        await check_atom(aNum);
    });

    it("sort atoms", async () => {
        const { core, resolveComponentName } = await createTestCore({
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
        expect(stateVariables[resolveComponentName("pAn")].stateValues.text).eq(
            "Sort by atomic number: He, C, O, As",
        );
        expect(stateVariables[resolveComponentName("pAr")].stateValues.text).eq(
            "Sort by atomic radius: He, O, C, As",
        );
        expect(stateVariables[resolveComponentName("pIe")].stateValues.text).eq(
            "Sort by ionization energy: As, C, O, He",
        );
    });
});
