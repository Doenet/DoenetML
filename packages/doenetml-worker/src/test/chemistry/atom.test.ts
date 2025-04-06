import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
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
        const core = await createTestCore({
            doenetML: `
  <title>Information on atom</title>

  <setup>
    <atom atomicNumber="$aNum" name="atom" />
  </setup>
  
  <p>Atomic number: <mathInput name="aNum" prefill="1" /></p>
  
  <p>Name: $atom.name{assignNames="name"}</p>
  <p>Symbol: $atom.symbol{assignNames="symbol"}</p>
  <p>Atomic number: $atom.atomicNumber{assignNames="atomicNumber"}</p>
  <p>Group: $atom.group{assignNames="group"}</p>
  <p>Group Name: $atom.groupName{assignNames="groupName"}</p>
  <p>Atomic mass: $atom.atomicMass{assignNames="atomicMass" displayDigits="10"}</p>
  <p>Phase at STP: $atom.phaseAtSTP{assignNames="phaseAtSTP" displayDigits="10"}</p>
  <p>Charge of common ion: $atom.chargeOfCommonIon{assignNames="chargeOfCommonIon" displayDigits="10"}</p>
  <p>Metal category: $atom.metalCategory{assignNames="metalCategory" displayDigits="10"}</p>
  <p>Period: $atom.period{assignNames="period" displayDigits="10"}</p>
  <p>Ionization energy: $atom.ionizationEnergy{assignNames="ionizationEnergy" displayDigits="10"}</p>
  <p>Melting point: $atom.meltingPoint{assignNames="meltingPoint" displayDigits="10"}</p>
  <p>Boiling point: $atom.boilingPoint{assignNames="boilingPoint" displayDigits="10"}</p>
  <p>Atomic radius: $atom.atomicRadius{assignNames="atomicRadius" displayDigits="10"}</p>
  <p>Density: $atom.density{assignNames="density" displayDigits="10"}</p>
  <p>Electronegativity: $atom.electronegativity{assignNames="electronegativity" displayDigits="10"}</p>
  <p>Electron configuration: $atom.electronConfiguration{assignNames="electronConfiguration"}</p>
  Orbital diagram: $atom.orbitalDiagram{assignNames="orbitalDiagram"}
    `,
        });

        let to_number = (x: string) => (x ? Number(x) : NaN);

        async function check_atom(atomicNumber: number) {
            const data = atomDatabase[atomicNumber - 1];

            const stateVariables = await returnAllStateVariables(core);
            const symbol = data["Symbol"];
            expect(stateVariables["/atom"].stateValues.latex).eq(
                `\\text{${symbol}}`,
            );
            expect(stateVariables["/atom"].stateValues.text).eq(symbol);
            expect(stateVariables["/atom"].stateValues.math.tree).eq(symbol);

            expect(stateVariables["/name"].stateValues.value).eq(data["Name"]);
            expect(stateVariables["/symbol"].stateValues.value).eq(symbol);
            expect(stateVariables["/atomicNumber"].stateValues.value).eq(
                atomicNumber,
            );
            expect(stateVariables["/group"].stateValues.value).eqls(
                to_number(data["Group"]),
            );
            expect(stateVariables["/groupName"].stateValues.value).eq(
                data["Group Name"],
            );
            expect(stateVariables["/atomicMass"].stateValues.value).eqls(
                to_number(data["Atomic Mass"]),
            );
            expect(stateVariables["/phaseAtSTP"].stateValues.value).eq(
                data["Phase at STP"],
            );
            expect(stateVariables["/chargeOfCommonIon"].stateValues.value).eqls(
                to_number(data["Charge of Common Ion"]),
            );
            expect(stateVariables["/metalCategory"].stateValues.value).eq(
                data["Metal/Nonmetal/Metalloid"],
            );
            expect(stateVariables["/period"].stateValues.value).eqls(
                to_number(data["Period"]),
            );
            expect(stateVariables["/ionizationEnergy"].stateValues.value).eqls(
                to_number(data["Ionization Energy"]),
            );
            expect(stateVariables["/period"].stateValues.value).eqls(
                to_number(data["Period"]),
            );
            expect(stateVariables["/meltingPoint"].stateValues.value).eqls(
                to_number(data["Melting Point"]),
            );
            expect(stateVariables["/boilingPoint"].stateValues.value).eqls(
                to_number(data["Boiling Point"]),
            );
            expect(stateVariables["/atomicRadius"].stateValues.value).eqls(
                to_number(data["Atomic Radius"]),
            );
            expect(stateVariables["/density"].stateValues.value).eqls(
                to_number(data["Density"]),
            );
            expect(stateVariables["/electronegativity"].stateValues.value).eqls(
                to_number(data["Electronegativity"]),
            );
            let eConfig = data["Electron Configuration"];
            expect(
                stateVariables["/electronConfiguration"].stateValues.value.tree,
            ).eqls(me.fromText(eConfig).tree);
            expect(
                stateVariables["/electronConfiguration"].stateValues.latex
                    .replaceAll(" ", "")
                    .replaceAll("~", " "),
            ).eq(eConfig.replaceAll(/\^(\d+)/g, "^{$1}"));
            expect(
                stateVariables["/electronConfiguration"].stateValues.text,
            ).eq(superSubscriptsToUnicode(eConfig));
        }

        let aNum = 1;
        await check_atom(aNum);

        aNum = 2;
        await updateMathInputValue({ latex: `${aNum}`, name: "/aNum", core });
        await check_atom(aNum);

        aNum = 12;
        await updateMathInputValue({ latex: `${aNum}`, name: "/aNum", core });
        await check_atom(aNum);

        aNum = 52;
        await updateMathInputValue({ latex: `${aNum}`, name: "/aNum", core });
        await check_atom(aNum);
    });

    it("sort atoms", async () => {
        const core = await createTestCore({
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

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pAn"].stateValues.text).eq(
            "Sort by atomic number: He, C, O, As",
        );
        expect(stateVariables["/pAr"].stateValues.text).eq(
            "Sort by atomic radius: He, O, C, As",
        );
        expect(stateVariables["/pIe"].stateValues.text).eq(
            "Sort by ionization energy: As, C, O, He",
        );
    });
});
