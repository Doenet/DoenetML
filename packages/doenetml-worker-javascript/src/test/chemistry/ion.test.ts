import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Ion tests", async () => {
    it("ion names and charges", async () => {
        const core = await createTestCore({
            doenetML: `
  <section name="H" newNamespace><title>Hydrogen</title>

    <p>Atom: <atom symbol="H" name="Hatom" /></p>
    <p>Symbol: <ion symbol="H" name="H" />, 
      name: <text copySource="H" name="Hname" />, 
      charge: <integer copySource="H.charge" name="Hcharge" />
    </p>

    <p>Symbol: 
      <ion charge="-1" name="Hminus" >$Hatom</ion>,
      name: <text copySource="Hminus" name="Hminusname" />
      charge: <integer copySource="Hminus.charge" name="Hminuscharge" />
    </p>

    <p>Symbol: 
      <ion charge="10" name="Hcrazy" atomicNumber="1" />,
      name: <text copySource="Hcrazy" name="Hcrazyname" />
      charge: <integer copySource="Hcrazy.charge" name="Hcrazycharge" />
    </p>

  </section>


  <section name="Cl" newNamespace><title>Chloride</title>

    <p>Atom: <atom symbol="Cl" name="Clatom" /></p>
    <p>Symbol: <ion symbol="Cl" name="Cl" />, 
      name: <text copySource="Cl" name="Clname" />, 
      charge: <integer copySource="Cl.charge" name="Clcharge" />
    </p>

    <p>Symbol: <ion charge="-1" name="Clminus" >$Clatom</ion>,
      name: <text copySource="Clminus" name="Clminusname" />
      charge: <integer copySource="Clminus.charge" name="Clminuscharge" />
    </p>

    <p>Symbol: <ion symbol="Cl" name="Clplus" charge="1" />, 
      name: <text copySource="Clplus" name="Clplusname" />, 
      charge: <integer copySource="Clplus.charge" name="Clpluscharge" />
    </p>

  </section>

  <section name="Fe" newNamespace><title>Iron</title>

    <p>Atom: <atom symbol="Fe" name="Featom" /></p>
    <p>Symbol: <ion symbol="Fe" name="Fe" />, 
      name: <text copySource="Fe" name="Fename" />, 
      charge: <integer copySource="Fe.charge" name="Fecharge" />
    </p>

    <p>Symbol: 
      <ion charge="1" name="Fe1" >$Featom</ion>,
      name: <text copySource="Fe1" name="Fe1name" />,
      charge: <integer copySource="Fe1.charge" name="Fe1charge" />
    </p>

    <p>Symbol: 
      <ion charge="2" name="Fe2" atomicNumber="26" />,
      name: <text copySource="Fe2" name="Fe2name" />,
      charge: <integer copySource="Fe2.charge" name="Fe2charge" />
    </p>

    <p>Symbol: 
      <ion charge="3" name="Fe3" symbol="Fe" />,
      name: <text copySource="Fe3" name="Fe3name" />,
      charge: <integer copySource="Fe3.charge" name="Fe3charge" />
    </p>

    <p>Symbol: 
      <ion charge="4" name="Fe4" >$Featom</ion>,
      name: <text copySource="Fe4" name="Fe4name" />,
      charge: <integer copySource="Fe4.charge" name="Fe4charge" />
    </p>

    <p>Symbol: 
      <ion charge="5" name="Fe5" atomicNumber="26" />,
      name: <text copySource="Fe5" name="Fe5name" />,
      charge: <integer copySource="Fe5.charge" name="Fe5charge" />
    </p>

    <p>Symbol: 
      <ion charge="6" name="Fe6" >$Featom</ion>,
      name: <text copySource="Fe6" name="Fe6name" />,
      charge: <integer copySource="Fe6.charge" name="Fe6charge" />
    </p>

    <p>Symbol: 
      <ion charge="7" name="Fe7" >$Featom</ion>,
      name: <text copySource="Fe7" name="Fe7name" />,
      charge: <integer copySource="Fe7.charge" name="Fe7charge" />
    </p>

    <p>Symbol: 
      <ion charge="8" name="Fe8" >$Featom</ion>,
      name: <text copySource="Fe8" name="Fe8name" />,
      charge: <integer copySource="Fe8.charge" name="Fe8charge" />
    </p>

    <p>Symbol: 
      <ion charge="-1" name="Fen1" >$Featom</ion>,
      name: <text copySource="Fen1" name="Fen1name" />,
      charge: <integer copySource="Fen1.charge" name="Fen1charge" />
    </p>

  </section>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/H/H"].stateValues.latex).eq("\\text{H}^+");
        expect(stateVariables["/H/H"].stateValues.text).eq("H^+");
        expect(stateVariables["/H/H"].stateValues.math.tree).eqls([
            "^",
            "H",
            "+",
        ]);
        expect(stateVariables["/H/Hname"].stateValues.value).eq("Hydrogen");
        expect(stateVariables["/H/Hcharge"].stateValues.value).eq(1);

        expect(stateVariables["/H/Hminus"].stateValues.latex).eq("\\text{H}^-");
        expect(stateVariables["/H/Hminus"].stateValues.text).eq("H^-");
        expect(stateVariables["/H/Hminus"].stateValues.math.tree).eqls([
            "^",
            "H",
            "-",
        ]);
        expect(stateVariables["/H/Hminusname"].stateValues.value).eq("Hydride");
        expect(stateVariables["/H/Hminuscharge"].stateValues.value).eq(-1);

        expect(stateVariables["/H/Hcrazy"].stateValues.latex).eq(
            "\\text{H}^{10+}",
        );
        expect(stateVariables["/H/Hcrazy"].stateValues.text).eq("H^(10+)");
        expect(stateVariables["/H/Hcrazy"].stateValues.math.tree).eqls([
            "^",
            "H",
            "10+",
        ]);
        expect(stateVariables["/H/Hcrazyname"].stateValues.value).eq(
            "Hydrogen",
        );
        expect(stateVariables["/H/Hcrazycharge"].stateValues.value).eq(10);

        expect(stateVariables["/Cl/Cl"].stateValues.latex).eq("\\text{Cl}^-");
        expect(stateVariables["/Cl/Cl"].stateValues.text).eq("Cl^-");
        expect(stateVariables["/Cl/Cl"].stateValues.math.tree).eqls([
            "^",
            "Cl",
            "-",
        ]);
        expect(stateVariables["/Cl/Clname"].stateValues.value).eq("Chloride");
        expect(stateVariables["/Cl/Clcharge"].stateValues.value).eq(-1);

        expect(stateVariables["/Cl/Clminus"].stateValues.latex).eq(
            "\\text{Cl}^-",
        );
        expect(stateVariables["/Cl/Clminus"].stateValues.text).eq("Cl^-");
        expect(stateVariables["/Cl/Clminus"].stateValues.math.tree).eqls([
            "^",
            "Cl",
            "-",
        ]);
        expect(stateVariables["/Cl/Clminusname"].stateValues.value).eq(
            "Chloride",
        );
        expect(stateVariables["/Cl/Clminuscharge"].stateValues.value).eq(-1);

        expect(stateVariables["/Cl/Clplus"].stateValues.latex).eq(
            "\\text{Cl}^+",
        );
        expect(stateVariables["/Cl/Clplus"].stateValues.text).eq("Cl^+");
        expect(stateVariables["/Cl/Clplus"].stateValues.math.tree).eqls([
            "^",
            "Cl",
            "+",
        ]);
        expect(stateVariables["/Cl/Clplusname"].stateValues.value).eq(
            "Chlorine",
        );
        expect(stateVariables["/Cl/Clpluscharge"].stateValues.value).eq(1);

        expect(stateVariables["/Fe/Fe"].stateValues.latex).eq("\\text{Fe}");
        expect(stateVariables["/Fe/Fe"].stateValues.text).eq("Fe");
        expect(stateVariables["/Fe/Fe"].stateValues.math.tree).eqls("Fe");
        expect(stateVariables["/Fe/Fename"].stateValues.value).eq("Iron");
        expect(stateVariables["/Fe/Fecharge"].stateValues.value).eq(0);

        expect(stateVariables["/Fe/Fe1"].stateValues.latex).eq("\\text{Fe}^+");
        expect(stateVariables["/Fe/Fe1"].stateValues.text).eq("Fe^+");
        expect(stateVariables["/Fe/Fe1"].stateValues.math.tree).eqls([
            "^",
            "Fe",
            "+",
        ]);
        expect(stateVariables["/Fe/Fe1name"].stateValues.value).eq("Iron (I)");
        expect(stateVariables["/Fe/Fe1charge"].stateValues.value).eq(1);

        expect(stateVariables["/Fe/Fe2"].stateValues.latex).eq(
            "\\text{Fe}^{2+}",
        );
        expect(stateVariables["/Fe/Fe2"].stateValues.text).eq("Fe^(2+)");
        expect(stateVariables["/Fe/Fe2"].stateValues.math.tree).eqls([
            "^",
            "Fe",
            "2+",
        ]);
        expect(stateVariables["/Fe/Fe2name"].stateValues.value).eq("Iron (II)");
        expect(stateVariables["/Fe/Fe2charge"].stateValues.value).eq(2);

        expect(stateVariables["/Fe/Fe3"].stateValues.latex).eq(
            "\\text{Fe}^{3+}",
        );
        expect(stateVariables["/Fe/Fe3"].stateValues.text).eq("Fe^(3+)");
        expect(stateVariables["/Fe/Fe3"].stateValues.math.tree).eqls([
            "^",
            "Fe",
            "3+",
        ]);
        expect(stateVariables["/Fe/Fe3name"].stateValues.value).eq(
            "Iron (III)",
        );
        expect(stateVariables["/Fe/Fe3charge"].stateValues.value).eq(3);

        expect(stateVariables["/Fe/Fe4"].stateValues.latex).eq(
            "\\text{Fe}^{4+}",
        );
        expect(stateVariables["/Fe/Fe4"].stateValues.text).eq("Fe^(4+)");
        expect(stateVariables["/Fe/Fe4"].stateValues.math.tree).eqls([
            "^",
            "Fe",
            "4+",
        ]);
        expect(stateVariables["/Fe/Fe4name"].stateValues.value).eq("Iron (IV)");
        expect(stateVariables["/Fe/Fe4charge"].stateValues.value).eq(4);

        expect(stateVariables["/Fe/Fe5"].stateValues.latex).eq(
            "\\text{Fe}^{5+}",
        );
        expect(stateVariables["/Fe/Fe5"].stateValues.text).eq("Fe^(5+)");
        expect(stateVariables["/Fe/Fe5"].stateValues.math.tree).eqls([
            "^",
            "Fe",
            "5+",
        ]);
        expect(stateVariables["/Fe/Fe5name"].stateValues.value).eq("Iron (V)");
        expect(stateVariables["/Fe/Fe5charge"].stateValues.value).eq(5);

        expect(stateVariables["/Fe/Fe6"].stateValues.latex).eq(
            "\\text{Fe}^{6+}",
        );
        expect(stateVariables["/Fe/Fe6"].stateValues.text).eq("Fe^(6+)");
        expect(stateVariables["/Fe/Fe6"].stateValues.math.tree).eqls([
            "^",
            "Fe",
            "6+",
        ]);
        expect(stateVariables["/Fe/Fe6name"].stateValues.value).eq("Iron (VI)");
        expect(stateVariables["/Fe/Fe6charge"].stateValues.value).eq(6);

        expect(stateVariables["/Fe/Fe7"].stateValues.latex).eq(
            "\\text{Fe}^{7+}",
        );
        expect(stateVariables["/Fe/Fe7"].stateValues.text).eq("Fe^(7+)");
        expect(stateVariables["/Fe/Fe7"].stateValues.math.tree).eqls([
            "^",
            "Fe",
            "7+",
        ]);
        expect(stateVariables["/Fe/Fe7name"].stateValues.value).eq(
            "Iron (VII)",
        );
        expect(stateVariables["/Fe/Fe7charge"].stateValues.value).eq(7);

        expect(stateVariables["/Fe/Fe8"].stateValues.latex).eq(
            "\\text{Fe}^{8+}",
        );
        expect(stateVariables["/Fe/Fe8"].stateValues.text).eq("Fe^(8+)");
        expect(stateVariables["/Fe/Fe8"].stateValues.math.tree).eqls([
            "^",
            "Fe",
            "8+",
        ]);
        expect(stateVariables["/Fe/Fe8name"].stateValues.value).eq(
            "Iron (VIII)",
        );
        expect(stateVariables["/Fe/Fe8charge"].stateValues.value).eq(8);

        expect(stateVariables["/Fe/Fen1"].stateValues.latex).eq("\\text{Fe}^-");
        expect(stateVariables["/Fe/Fen1"].stateValues.text).eq("Fe^-");
        expect(stateVariables["/Fe/Fen1"].stateValues.math.tree).eqls([
            "^",
            "Fe",
            "-",
        ]);
        expect(stateVariables["/Fe/Fen1name"].stateValues.value).eq("Iron");
        expect(stateVariables["/Fe/Fen1charge"].stateValues.value).eq(-1);
    });

    it("anion names", async () => {
        const core = await createTestCore({
            doenetML: `
  <text>a</text>

  <p>Symbol: 
    <ion charge="-1" name="Hminus" symbol="H"/>,
    name: <text copySource="Hminus" name="Hminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Cminus" symbol="C"/>,
    name: <text copySource="Cminus" name="Cminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Nminus" symbol="N"/>,
    name: <text copySource="Nminus" name="Nminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Ominus" symbol="O"/>,
    name: <text copySource="Ominus" name="Ominusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Fminus" symbol="F"/>,
    name: <text copySource="Fminus" name="Fminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Pminus" symbol="P"/>,
    name: <text copySource="Pminus" name="Pminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Sminus" symbol="S"/>,
    name: <text copySource="Sminus" name="Sminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Clminus" symbol="Cl"/>,
    name: <text copySource="Clminus" name="Clminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Brminus" symbol="Br"/>,
    name: <text copySource="Brminus" name="Brminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Iminus" symbol="I"/>,
    name: <text copySource="Iminus" name="Iminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Atminus" symbol="At"/>,
    name: <text copySource="Atminus" name="Atminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Tsminus" symbol="Ts"/>,
    name: <text copySource="Tsminus" name="Tsminusname" />
  </p>

  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/Hminusname"].stateValues.value).eq("Hydride");
        expect(stateVariables["/Cminusname"].stateValues.value).eq("Carbide");
        expect(stateVariables["/Nminusname"].stateValues.value).eq("Nitride");
        expect(stateVariables["/Ominusname"].stateValues.value).eq("Oxide");
        expect(stateVariables["/Fminusname"].stateValues.value).eq("Fluoride");
        expect(stateVariables["/Pminusname"].stateValues.value).eq("Phosphide");
        expect(stateVariables["/Sminusname"].stateValues.value).eq("Sulfide");
        expect(stateVariables["/Clminusname"].stateValues.value).eq("Chloride");
        expect(stateVariables["/Brminusname"].stateValues.value).eq("Bromide");
        expect(stateVariables["/Iminusname"].stateValues.value).eq("Iodide");
        expect(stateVariables["/Atminusname"].stateValues.value).eq("Astatide");
        expect(stateVariables["/Tsminusname"].stateValues.value).eq(
            "Tennesside",
        );
    });

    it("caion name suffixes", async () => {
        const core = await createTestCore({
            doenetML: `
  <text>a</text>

  <p>Symbol: 
    <ion charge="1" name="Sc" symbol="Sc"/>,
    name: <text copySource="Sc" name="Scname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Ti" symbol="Ti"/>,
    name: <text copySource="Ti" name="Tiname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="V" symbol="V"/>,
    name: <text copySource="V" name="Vname" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Cr" symbol="Cr"/>,
    name: <text copySource="Cr" name="Crname" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="Mn" symbol="Mn"/>,
    name: <text copySource="Mn" name="Mnname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Fe" symbol="Fe"/>,
    name: <text copySource="Fe" name="Fename" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Co" symbol="Co"/>,
    name: <text copySource="Co" name="Coname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Ni" symbol="Ni"/>,
    name: <text copySource="Ni" name="Niname" />
  </p>

  <p>Symbol: 
    <ion charge="1" name="Cu" symbol="Cu"/>,
    name: <text copySource="Cu" name="Cuname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Zn" symbol="Zn"/>,
    name: <text copySource="Zn" name="Znname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="Al" symbol="Al"/>,
    name: <text copySource="Al" name="Alname" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Ga" symbol="Ga"/>,
    name: <text copySource="Ga" name="Ganame" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="In" symbol="In"/>,
    name: <text copySource="In" name="Inname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Sn" symbol="Sn"/>,
    name: <text copySource="Sn" name="Snname" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Tl" symbol="Tl"/>,
    name: <text copySource="Tl" name="Tlname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Pb" symbol="Pb"/>,
    name: <text copySource="Pb" name="Pbname" />
  </p>

  <p>Symbol: 
    <ion charge="1" name="Bi" symbol="Bi"/>,
    name: <text copySource="Bi" name="Biname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Po" symbol="Po"/>,
    name: <text copySource="Po" name="Poname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="Ce" symbol="Ce"/>,
    name: <text copySource="Ce" name="Cename" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Tm" symbol="Tm"/>,
    name: <text copySource="Tm" name="Tmname" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="Lu" symbol="Lu"/>,
    name: <text copySource="Lu" name="Luname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Th" symbol="Th"/>,
    name: <text copySource="Th" name="Thname" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Es" symbol="Es"/>,
    name: <text copySource="Es" name="Esname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Lr" symbol="Lr"/>,
    name: <text copySource="Lr" name="Lrname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Ca" symbol="Ca"/>,
    name: <text copySource="Ca" name="Caname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Si" symbol="Si"/>,
    name: <text copySource="Si" name="Siname" />
  </p>

  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/Scname"].stateValues.value).eq("Scandium (I)");
        expect(stateVariables["/Tiname"].stateValues.value).eq("Titanium (II)");
        expect(stateVariables["/Vname"].stateValues.value).eq("Vanadium (III)");
        expect(stateVariables["/Crname"].stateValues.value).eq("Chromium (IV)");
        expect(stateVariables["/Mnname"].stateValues.value).eq("Manganese (V)");
        expect(stateVariables["/Fename"].stateValues.value).eq("Iron (VI)");
        expect(stateVariables["/Coname"].stateValues.value).eq("Cobalt (VII)");
        expect(stateVariables["/Niname"].stateValues.value).eq("Nickel (VIII)");
        expect(stateVariables["/Cuname"].stateValues.value).eq("Copper (I)");
        expect(stateVariables["/Znname"].stateValues.value).eq("Zinc (II)");
        expect(stateVariables["/Alname"].stateValues.value).eq(
            "Aluminum (III)",
        );
        expect(stateVariables["/Ganame"].stateValues.value).eq("Gallium (IV)");
        expect(stateVariables["/Inname"].stateValues.value).eq("Indium (V)");
        expect(stateVariables["/Snname"].stateValues.value).eq("Tin (VI)");
        expect(stateVariables["/Tlname"].stateValues.value).eq(
            "Thallium (VII)",
        );
        expect(stateVariables["/Pbname"].stateValues.value).eq("Lead (VIII)");
        expect(stateVariables["/Biname"].stateValues.value).eq("Bismuth (I)");
        expect(stateVariables["/Poname"].stateValues.value).eq("Polonium (II)");
        expect(stateVariables["/Cename"].stateValues.value).eq("Cerium (III)");
        expect(stateVariables["/Tmname"].stateValues.value).eq("Thulium (IV)");
        expect(stateVariables["/Luname"].stateValues.value).eq("Lutetium (V)");
        expect(stateVariables["/Thname"].stateValues.value).eq("Thorium (VI)");
        expect(stateVariables["/Esname"].stateValues.value).eq(
            "Einsteinium (VII)",
        );
        expect(stateVariables["/Lrname"].stateValues.value).eq(
            "Lawrencium (VIII)",
        );
        expect(stateVariables["/Caname"].stateValues.value).eq("Calcium");
        expect(stateVariables["/Siname"].stateValues.value).eq("Silicon");
    });

    it("answer ion symbols", async () => {
        const core = await createTestCore({
            doenetML: `
  <p>Enter symbol for common ion of <atom name="Cl" symbol="Cl" />.  
    <answer name="ansCl" splitSymbols="false"><math><ion>$Cl</ion></math></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="H" symbol="H" />.  
    <answer name="ansH" splitSymbols="false"><math><ion copySource="H" /></math></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="Mg" symbol="Mg" />.  
    <answer name="ansMg" splitSymbols="false"><extract prop="math"><ion copySource="Mg" /></extract></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="P" symbol="P" />.  
    <answer name="ansP" splitSymbols="false"><ion>$P</ion></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="S" symbol="S" />.  
    <answer name="ansS" splitSymbols="false"><ion copySource="S" /></answer>
  </p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let mathinputClName =
            stateVariables["/ansCl"].stateValues.inputChildren[0].componentName;

        let mathinputHName =
            stateVariables["/ansH"].stateValues.inputChildren[0].componentName;

        let mathinputMgName =
            stateVariables["/ansMg"].stateValues.inputChildren[0].componentName;

        let mathinputPName =
            stateVariables["/ansP"].stateValues.inputChildren[0].componentName;

        let mathinputSName =
            stateVariables["/ansS"].stateValues.inputChildren[0].componentName;

        await updateMathInputValue({
            name: mathinputClName,
            latex: "Cl",
            core,
        });
        await submitAnswer({ name: "/ansCl", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansCl"].stateValues.creditAchieved).eq(0);

        await updateMathInputValue({
            name: mathinputClName,
            latex: "Cl^-",
            core,
        });
        await submitAnswer({ name: "/ansCl", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansCl"].stateValues.creditAchieved).eq(1);

        await updateMathInputValue({
            name: mathinputHName,
            latex: "H",
            core,
        });
        await submitAnswer({ name: "/ansH", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansH"].stateValues.creditAchieved).eq(0);

        await updateMathInputValue({
            name: mathinputHName,
            latex: "H^+",
            core,
        });
        await submitAnswer({ name: "/ansH", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansH"].stateValues.creditAchieved).eq(1);

        await updateMathInputValue({
            name: mathinputMgName,
            latex: "Mg",
            core,
        });
        await submitAnswer({ name: "/ansMg", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansMg"].stateValues.creditAchieved).eq(0);

        await updateMathInputValue({
            name: mathinputMgName,
            latex: "Mg^{2+}",
            core,
        });
        await submitAnswer({ name: "/ansMg", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansMg"].stateValues.creditAchieved).eq(1);

        await updateMathInputValue({
            name: mathinputPName,
            latex: "P",
            core,
        });
        await submitAnswer({ name: "/ansP", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansP"].stateValues.creditAchieved).eq(0);

        await updateMathInputValue({
            name: mathinputPName,
            latex: "P^{3-}",
            core,
        });
        await submitAnswer({ name: "/ansP", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansP"].stateValues.creditAchieved).eq(1);

        await updateMathInputValue({
            name: mathinputSName,
            latex: "S",
            core,
        });
        await submitAnswer({ name: "/ansS", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansS"].stateValues.creditAchieved).eq(0);

        await updateMathInputValue({
            name: mathinputSName,
            latex: "S^{2-}",
            core,
        });
        await submitAnswer({ name: "/ansS", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/ansS"].stateValues.creditAchieved).eq(1);
    });
});
