import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Ion tests", async () => {
    it("ion names and charges", async () => {
        const { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <section name="H"><title>Hydrogen</title>

    <p>Atom: <atom symbol="H" name="Hatom" /></p>
    <p>Symbol: <ion symbol="H" name="Hion" />, 
      name: <text extend="$Hion" name="Hname" />, 
      charge: <integer extend="$Hion.charge" name="Hcharge" />
    </p>

    <p>Symbol: 
      <ion charge="-1" name="Hminus" >$Hatom</ion>,
      name: <text extend="$Hminus" name="Hminusname" />
      charge: <integer extend="$Hminus.charge" name="Hminuscharge" />
    </p>

    <p>Symbol: 
      <ion charge="10" name="Hcrazy" atomicNumber="1" />,
      name: <text extend="$Hcrazy" name="Hcrazyname" />
      charge: <integer extend="$Hcrazy.charge" name="Hcrazycharge" />
    </p>

  </section>


  <section name="Cl"><title>Chloride</title>

    <p>Atom: <atom symbol="Cl" name="Clatom" /></p>
    <p>Symbol: <ion symbol="Cl" name="Clion" />, 
      name: <text extend="$Clion" name="Clname" />, 
      charge: <integer extend="$Clion.charge" name="Clcharge" />
    </p>

    <p>Symbol: <ion charge="-1" name="Clminus" >$Clatom</ion>,
      name: <text extend="$Clminus" name="Clminusname" />
      charge: <integer extend="$Clminus.charge" name="Clminuscharge" />
    </p>

    <p>Symbol: <ion symbol="Cl" name="Clplus" charge="1" />, 
      name: <text extend="$Clplus" name="Clplusname" />, 
      charge: <integer extend="$Clplus.charge" name="Clpluscharge" />
    </p>

  </section>

  <section name="Fe"><title>Iron</title>

    <p>Atom: <atom symbol="Fe" name="Featom" /></p>
    <p>Symbol: <ion symbol="Fe" name="Feion" />, 
      name: <text extend="$Feion" name="Fename" />, 
      charge: <integer extend="$Feion.charge" name="Fecharge" />
    </p>

    <p>Symbol: 
      <ion charge="1" name="Fe1" >$Featom</ion>,
      name: <text extend="$Fe1" name="Fe1name" />,
      charge: <integer extend="$Fe1.charge" name="Fe1charge" />
    </p>

    <p>Symbol: 
      <ion charge="2" name="Fe2" atomicNumber="26" />,
      name: <text extend="$Fe2" name="Fe2name" />,
      charge: <integer extend="$Fe2.charge" name="Fe2charge" />
    </p>

    <p>Symbol: 
      <ion charge="3" name="Fe3" symbol="Fe" />,
      name: <text extend="$Fe3" name="Fe3name" />,
      charge: <integer extend="$Fe3.charge" name="Fe3charge" />
    </p>

    <p>Symbol: 
      <ion charge="4" name="Fe4" >$Featom</ion>,
      name: <text extend="$Fe4" name="Fe4name" />,
      charge: <integer extend="$Fe4.charge" name="Fe4charge" />
    </p>

    <p>Symbol: 
      <ion charge="5" name="Fe5" atomicNumber="26" />,
      name: <text extend="$Fe5" name="Fe5name" />,
      charge: <integer extend="$Fe5.charge" name="Fe5charge" />
    </p>

    <p>Symbol: 
      <ion charge="6" name="Fe6" >$Featom</ion>,
      name: <text extend="$Fe6" name="Fe6name" />,
      charge: <integer extend="$Fe6.charge" name="Fe6charge" />
    </p>

    <p>Symbol: 
      <ion charge="7" name="Fe7" >$Featom</ion>,
      name: <text extend="$Fe7" name="Fe7name" />,
      charge: <integer extend="$Fe7.charge" name="Fe7charge" />
    </p>

    <p>Symbol: 
      <ion charge="8" name="Fe8" >$Featom</ion>,
      name: <text extend="$Fe8" name="Fe8name" />,
      charge: <integer extend="$Fe8.charge" name="Fe8charge" />
    </p>

    <p>Symbol: 
      <ion charge="-1" name="Fen1" >$Featom</ion>,
      name: <text extend="$Fen1" name="Fen1name" />,
      charge: <integer extend="$Fen1.charge" name="Fen1charge" />
    </p>

  </section>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("H.Hion")].stateValues.latex,
        ).eq("\\text{H}^+");
        expect(
            stateVariables[resolveComponentName("H.Hion")].stateValues.text,
        ).eq("H^+");
        expect(
            stateVariables[resolveComponentName("H.Hion")].stateValues.math
                .tree,
        ).eqls(["^", "H", "+"]);
        expect(
            stateVariables[resolveComponentName("H.Hname")].stateValues.value,
        ).eq("Hydrogen");
        expect(
            stateVariables[resolveComponentName("H.Hcharge")].stateValues.value,
        ).eq(1);

        expect(
            stateVariables[resolveComponentName("H.Hminus")].stateValues.latex,
        ).eq("\\text{H}^-");
        expect(
            stateVariables[resolveComponentName("H.Hminus")].stateValues.text,
        ).eq("H^-");
        expect(
            stateVariables[resolveComponentName("H.Hminus")].stateValues.math
                .tree,
        ).eqls(["^", "H", "-"]);
        expect(
            stateVariables[resolveComponentName("H.Hminusname")].stateValues
                .value,
        ).eq("Hydride");
        expect(
            stateVariables[resolveComponentName("H.Hminuscharge")].stateValues
                .value,
        ).eq(-1);

        expect(
            stateVariables[resolveComponentName("H.Hcrazy")].stateValues.latex,
        ).eq("\\text{H}^{10+}");
        expect(
            stateVariables[resolveComponentName("H.Hcrazy")].stateValues.text,
        ).eq("H^(10+)");
        expect(
            stateVariables[resolveComponentName("H.Hcrazy")].stateValues.math
                .tree,
        ).eqls(["^", "H", "10+"]);
        expect(
            stateVariables[resolveComponentName("H.Hcrazyname")].stateValues
                .value,
        ).eq("Hydrogen");
        expect(
            stateVariables[resolveComponentName("H.Hcrazycharge")].stateValues
                .value,
        ).eq(10);

        expect(
            stateVariables[resolveComponentName("Cl.Clion")].stateValues.latex,
        ).eq("\\text{Cl}^-");
        expect(
            stateVariables[resolveComponentName("Cl.Clion")].stateValues.text,
        ).eq("Cl^-");
        expect(
            stateVariables[resolveComponentName("Cl.Clion")].stateValues.math
                .tree,
        ).eqls(["^", "Cl", "-"]);
        expect(
            stateVariables[resolveComponentName("Cl.Clname")].stateValues.value,
        ).eq("Chloride");
        expect(
            stateVariables[resolveComponentName("Cl.Clcharge")].stateValues
                .value,
        ).eq(-1);

        expect(
            stateVariables[resolveComponentName("Cl.Clminus")].stateValues
                .latex,
        ).eq("\\text{Cl}^-");
        expect(
            stateVariables[resolveComponentName("Cl.Clminus")].stateValues.text,
        ).eq("Cl^-");
        expect(
            stateVariables[resolveComponentName("Cl.Clminus")].stateValues.math
                .tree,
        ).eqls(["^", "Cl", "-"]);
        expect(
            stateVariables[resolveComponentName("Cl.Clminusname")].stateValues
                .value,
        ).eq("Chloride");
        expect(
            stateVariables[resolveComponentName("Cl.Clminuscharge")].stateValues
                .value,
        ).eq(-1);

        expect(
            stateVariables[resolveComponentName("Cl.Clplus")].stateValues.latex,
        ).eq("\\text{Cl}^+");
        expect(
            stateVariables[resolveComponentName("Cl.Clplus")].stateValues.text,
        ).eq("Cl^+");
        expect(
            stateVariables[resolveComponentName("Cl.Clplus")].stateValues.math
                .tree,
        ).eqls(["^", "Cl", "+"]);
        expect(
            stateVariables[resolveComponentName("Cl.Clplusname")].stateValues
                .value,
        ).eq("Chlorine");
        expect(
            stateVariables[resolveComponentName("Cl.Clpluscharge")].stateValues
                .value,
        ).eq(1);

        expect(
            stateVariables[resolveComponentName("Fe.Feion")].stateValues.latex,
        ).eq("\\text{Fe}");
        expect(
            stateVariables[resolveComponentName("Fe.Feion")].stateValues.text,
        ).eq("Fe");
        expect(
            stateVariables[resolveComponentName("Fe.Feion")].stateValues.math
                .tree,
        ).eqls("Fe");
        expect(
            stateVariables[resolveComponentName("Fe.Fename")].stateValues.value,
        ).eq("Iron");
        expect(
            stateVariables[resolveComponentName("Fe.Fecharge")].stateValues
                .value,
        ).eq(0);

        expect(
            stateVariables[resolveComponentName("Fe.Fe1")].stateValues.latex,
        ).eq("\\text{Fe}^+");
        expect(
            stateVariables[resolveComponentName("Fe.Fe1")].stateValues.text,
        ).eq("Fe^+");
        expect(
            stateVariables[resolveComponentName("Fe.Fe1")].stateValues.math
                .tree,
        ).eqls(["^", "Fe", "+"]);
        expect(
            stateVariables[resolveComponentName("Fe.Fe1name")].stateValues
                .value,
        ).eq("Iron (I)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe1charge")].stateValues
                .value,
        ).eq(1);

        expect(
            stateVariables[resolveComponentName("Fe.Fe2")].stateValues.latex,
        ).eq("\\text{Fe}^{2+}");
        expect(
            stateVariables[resolveComponentName("Fe.Fe2")].stateValues.text,
        ).eq("Fe^(2+)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe2")].stateValues.math
                .tree,
        ).eqls(["^", "Fe", "2+"]);
        expect(
            stateVariables[resolveComponentName("Fe.Fe2name")].stateValues
                .value,
        ).eq("Iron (II)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe2charge")].stateValues
                .value,
        ).eq(2);

        expect(
            stateVariables[resolveComponentName("Fe.Fe3")].stateValues.latex,
        ).eq("\\text{Fe}^{3+}");
        expect(
            stateVariables[resolveComponentName("Fe.Fe3")].stateValues.text,
        ).eq("Fe^(3+)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe3")].stateValues.math
                .tree,
        ).eqls(["^", "Fe", "3+"]);
        expect(
            stateVariables[resolveComponentName("Fe.Fe3name")].stateValues
                .value,
        ).eq("Iron (III)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe3charge")].stateValues
                .value,
        ).eq(3);

        expect(
            stateVariables[resolveComponentName("Fe.Fe4")].stateValues.latex,
        ).eq("\\text{Fe}^{4+}");
        expect(
            stateVariables[resolveComponentName("Fe.Fe4")].stateValues.text,
        ).eq("Fe^(4+)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe4")].stateValues.math
                .tree,
        ).eqls(["^", "Fe", "4+"]);
        expect(
            stateVariables[resolveComponentName("Fe.Fe4name")].stateValues
                .value,
        ).eq("Iron (IV)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe4charge")].stateValues
                .value,
        ).eq(4);

        expect(
            stateVariables[resolveComponentName("Fe.Fe5")].stateValues.latex,
        ).eq("\\text{Fe}^{5+}");
        expect(
            stateVariables[resolveComponentName("Fe.Fe5")].stateValues.text,
        ).eq("Fe^(5+)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe5")].stateValues.math
                .tree,
        ).eqls(["^", "Fe", "5+"]);
        expect(
            stateVariables[resolveComponentName("Fe.Fe5name")].stateValues
                .value,
        ).eq("Iron (V)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe5charge")].stateValues
                .value,
        ).eq(5);

        expect(
            stateVariables[resolveComponentName("Fe.Fe6")].stateValues.latex,
        ).eq("\\text{Fe}^{6+}");
        expect(
            stateVariables[resolveComponentName("Fe.Fe6")].stateValues.text,
        ).eq("Fe^(6+)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe6")].stateValues.math
                .tree,
        ).eqls(["^", "Fe", "6+"]);
        expect(
            stateVariables[resolveComponentName("Fe.Fe6name")].stateValues
                .value,
        ).eq("Iron (VI)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe6charge")].stateValues
                .value,
        ).eq(6);

        expect(
            stateVariables[resolveComponentName("Fe.Fe7")].stateValues.latex,
        ).eq("\\text{Fe}^{7+}");
        expect(
            stateVariables[resolveComponentName("Fe.Fe7")].stateValues.text,
        ).eq("Fe^(7+)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe7")].stateValues.math
                .tree,
        ).eqls(["^", "Fe", "7+"]);
        expect(
            stateVariables[resolveComponentName("Fe.Fe7name")].stateValues
                .value,
        ).eq("Iron (VII)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe7charge")].stateValues
                .value,
        ).eq(7);

        expect(
            stateVariables[resolveComponentName("Fe.Fe8")].stateValues.latex,
        ).eq("\\text{Fe}^{8+}");
        expect(
            stateVariables[resolveComponentName("Fe.Fe8")].stateValues.text,
        ).eq("Fe^(8+)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe8")].stateValues.math
                .tree,
        ).eqls(["^", "Fe", "8+"]);
        expect(
            stateVariables[resolveComponentName("Fe.Fe8name")].stateValues
                .value,
        ).eq("Iron (VIII)");
        expect(
            stateVariables[resolveComponentName("Fe.Fe8charge")].stateValues
                .value,
        ).eq(8);

        expect(
            stateVariables[resolveComponentName("Fe.Fen1")].stateValues.latex,
        ).eq("\\text{Fe}^-");
        expect(
            stateVariables[resolveComponentName("Fe.Fen1")].stateValues.text,
        ).eq("Fe^-");
        expect(
            stateVariables[resolveComponentName("Fe.Fen1")].stateValues.math
                .tree,
        ).eqls(["^", "Fe", "-"]);
        expect(
            stateVariables[resolveComponentName("Fe.Fen1name")].stateValues
                .value,
        ).eq("Iron");
        expect(
            stateVariables[resolveComponentName("Fe.Fen1charge")].stateValues
                .value,
        ).eq(-1);
    });

    it("anion names", async () => {
        const { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <text>a</text>

  <p>Symbol: 
    <ion charge="-1" name="Hminus" symbol="H"/>,
    name: <text extend="$Hminus" name="Hminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Cminus" symbol="C"/>,
    name: <text extend="$Cminus" name="Cminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Nminus" symbol="N"/>,
    name: <text extend="$Nminus" name="Nminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Ominus" symbol="O"/>,
    name: <text extend="$Ominus" name="Ominusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Fminus" symbol="F"/>,
    name: <text extend="$Fminus" name="Fminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Pminus" symbol="P"/>,
    name: <text extend="$Pminus" name="Pminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Sminus" symbol="S"/>,
    name: <text extend="$Sminus" name="Sminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Clminus" symbol="Cl"/>,
    name: <text extend="$Clminus" name="Clminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Brminus" symbol="Br"/>,
    name: <text extend="$Brminus" name="Brminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Iminus" symbol="I"/>,
    name: <text extend="$Iminus" name="Iminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Atminus" symbol="At"/>,
    name: <text extend="$Atminus" name="Atminusname" />
  </p>

  <p>Symbol: 
    <ion charge="-1" name="Tsminus" symbol="Ts"/>,
    name: <text extend="$Tsminus" name="Tsminusname" />
  </p>

  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("Hminusname")].stateValues
                .value,
        ).eq("Hydride");
        expect(
            stateVariables[resolveComponentName("Cminusname")].stateValues
                .value,
        ).eq("Carbide");
        expect(
            stateVariables[resolveComponentName("Nminusname")].stateValues
                .value,
        ).eq("Nitride");
        expect(
            stateVariables[resolveComponentName("Ominusname")].stateValues
                .value,
        ).eq("Oxide");
        expect(
            stateVariables[resolveComponentName("Fminusname")].stateValues
                .value,
        ).eq("Fluoride");
        expect(
            stateVariables[resolveComponentName("Pminusname")].stateValues
                .value,
        ).eq("Phosphide");
        expect(
            stateVariables[resolveComponentName("Sminusname")].stateValues
                .value,
        ).eq("Sulfide");
        expect(
            stateVariables[resolveComponentName("Clminusname")].stateValues
                .value,
        ).eq("Chloride");
        expect(
            stateVariables[resolveComponentName("Brminusname")].stateValues
                .value,
        ).eq("Bromide");
        expect(
            stateVariables[resolveComponentName("Iminusname")].stateValues
                .value,
        ).eq("Iodide");
        expect(
            stateVariables[resolveComponentName("Atminusname")].stateValues
                .value,
        ).eq("Astatide");
        expect(
            stateVariables[resolveComponentName("Tsminusname")].stateValues
                .value,
        ).eq("Tennesside");
    });

    it("caion name suffixes", async () => {
        const { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <text>a</text>

  <p>Symbol: 
    <ion charge="1" name="Sc" symbol="Sc"/>,
    name: <text extend="$Sc" name="Scname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Ti" symbol="Ti"/>,
    name: <text extend="$Ti" name="Tiname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="V" symbol="V"/>,
    name: <text extend="$V" name="Vname" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Cr" symbol="Cr"/>,
    name: <text extend="$Cr" name="Crname" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="Mn" symbol="Mn"/>,
    name: <text extend="$Mn" name="Mnname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Fe" symbol="Fe"/>,
    name: <text extend="$Fe" name="Fename" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Co" symbol="Co"/>,
    name: <text extend="$Co" name="Coname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Ni" symbol="Ni"/>,
    name: <text extend="$Ni" name="Niname" />
  </p>

  <p>Symbol: 
    <ion charge="1" name="Cu" symbol="Cu"/>,
    name: <text extend="$Cu" name="Cuname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Zn" symbol="Zn"/>,
    name: <text extend="$Zn" name="Znname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="Al" symbol="Al"/>,
    name: <text extend="$Al" name="Alname" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Ga" symbol="Ga"/>,
    name: <text extend="$Ga" name="Ganame" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="In" symbol="In"/>,
    name: <text extend="$In" name="Inname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Sn" symbol="Sn"/>,
    name: <text extend="$Sn" name="Snname" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Tl" symbol="Tl"/>,
    name: <text extend="$Tl" name="Tlname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Pb" symbol="Pb"/>,
    name: <text extend="$Pb" name="Pbname" />
  </p>

  <p>Symbol: 
    <ion charge="1" name="Bi" symbol="Bi"/>,
    name: <text extend="$Bi" name="Biname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Po" symbol="Po"/>,
    name: <text extend="$Po" name="Poname" />
  </p>

  <p>Symbol: 
    <ion charge="3" name="Ce" symbol="Ce"/>,
    name: <text extend="$Ce" name="Cename" />
  </p>

  <p>Symbol: 
    <ion charge="4" name="Tm" symbol="Tm"/>,
    name: <text extend="$Tm" name="Tmname" />
  </p>

  <p>Symbol: 
    <ion charge="5" name="Lu" symbol="Lu"/>,
    name: <text extend="$Lu" name="Luname" />
  </p>

  <p>Symbol: 
    <ion charge="6" name="Th" symbol="Th"/>,
    name: <text extend="$Th" name="Thname" />
  </p>

  <p>Symbol: 
    <ion charge="7" name="Es" symbol="Es"/>,
    name: <text extend="$Es" name="Esname" />
  </p>

  <p>Symbol: 
    <ion charge="8" name="Lr" symbol="Lr"/>,
    name: <text extend="$Lr" name="Lrname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Ca" symbol="Ca"/>,
    name: <text extend="$Ca" name="Caname" />
  </p>

  <p>Symbol: 
    <ion charge="2" name="Si" symbol="Si"/>,
    name: <text extend="$Si" name="Siname" />
  </p>

  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("Scname")].stateValues.value,
        ).eq("Scandium (I)");
        expect(
            stateVariables[resolveComponentName("Tiname")].stateValues.value,
        ).eq("Titanium (II)");
        expect(
            stateVariables[resolveComponentName("Vname")].stateValues.value,
        ).eq("Vanadium (III)");
        expect(
            stateVariables[resolveComponentName("Crname")].stateValues.value,
        ).eq("Chromium (IV)");
        expect(
            stateVariables[resolveComponentName("Mnname")].stateValues.value,
        ).eq("Manganese (V)");
        expect(
            stateVariables[resolveComponentName("Fename")].stateValues.value,
        ).eq("Iron (VI)");
        expect(
            stateVariables[resolveComponentName("Coname")].stateValues.value,
        ).eq("Cobalt (VII)");
        expect(
            stateVariables[resolveComponentName("Niname")].stateValues.value,
        ).eq("Nickel (VIII)");
        expect(
            stateVariables[resolveComponentName("Cuname")].stateValues.value,
        ).eq("Copper (I)");
        expect(
            stateVariables[resolveComponentName("Znname")].stateValues.value,
        ).eq("Zinc (II)");
        expect(
            stateVariables[resolveComponentName("Alname")].stateValues.value,
        ).eq("Aluminum (III)");
        expect(
            stateVariables[resolveComponentName("Ganame")].stateValues.value,
        ).eq("Gallium (IV)");
        expect(
            stateVariables[resolveComponentName("Inname")].stateValues.value,
        ).eq("Indium (V)");
        expect(
            stateVariables[resolveComponentName("Snname")].stateValues.value,
        ).eq("Tin (VI)");
        expect(
            stateVariables[resolveComponentName("Tlname")].stateValues.value,
        ).eq("Thallium (VII)");
        expect(
            stateVariables[resolveComponentName("Pbname")].stateValues.value,
        ).eq("Lead (VIII)");
        expect(
            stateVariables[resolveComponentName("Biname")].stateValues.value,
        ).eq("Bismuth (I)");
        expect(
            stateVariables[resolveComponentName("Poname")].stateValues.value,
        ).eq("Polonium (II)");
        expect(
            stateVariables[resolveComponentName("Cename")].stateValues.value,
        ).eq("Cerium (III)");
        expect(
            stateVariables[resolveComponentName("Tmname")].stateValues.value,
        ).eq("Thulium (IV)");
        expect(
            stateVariables[resolveComponentName("Luname")].stateValues.value,
        ).eq("Lutetium (V)");
        expect(
            stateVariables[resolveComponentName("Thname")].stateValues.value,
        ).eq("Thorium (VI)");
        expect(
            stateVariables[resolveComponentName("Esname")].stateValues.value,
        ).eq("Einsteinium (VII)");
        expect(
            stateVariables[resolveComponentName("Lrname")].stateValues.value,
        ).eq("Lawrencium (VIII)");
        expect(
            stateVariables[resolveComponentName("Caname")].stateValues.value,
        ).eq("Calcium");
        expect(
            stateVariables[resolveComponentName("Siname")].stateValues.value,
        ).eq("Silicon");
    });

    it("answer ion symbols", async () => {
        const { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <p>Enter symbol for common ion of <atom name="Cl" symbol="Cl" />.  
    <answer name="ansCl" splitSymbols="false"><math><ion>$Cl</ion></math></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="H" symbol="H" />.  
    <answer name="ansH" splitSymbols="false"><math><ion extend="$H" /></math></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="Mg" symbol="Mg" />.  
    <answer name="ansMg" splitSymbols="false"><setup><ion name="Mgion" extend="$Mg" /></setup>$Mgion.math</answer>
  </p>

  <p>Enter symbol for common ion of <atom name="P" symbol="P" />.  
    <answer name="ansP" splitSymbols="false"><ion>$P</ion></answer>
  </p>

  <p>Enter symbol for common ion of <atom name="S" symbol="S" />.  
    <answer name="ansS" splitSymbols="false"><ion extend="$S" /></answer>
  </p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let mathinputClIdx =
            stateVariables[resolveComponentName("ansCl")].stateValues
                .inputChildren[0].componentIdx;

        let mathinputHIdx =
            stateVariables[resolveComponentName("ansH")].stateValues
                .inputChildren[0].componentIdx;

        let mathinputMgIdx =
            stateVariables[resolveComponentName("ansMg")].stateValues
                .inputChildren[0].componentIdx;

        let mathinputPIdx =
            stateVariables[resolveComponentName("ansP")].stateValues
                .inputChildren[0].componentIdx;

        let mathinputSIdx =
            stateVariables[resolveComponentName("ansS")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            componentIdx: mathinputClIdx,
            latex: "Cl",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansCl"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansCl")].stateValues
                .creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            componentIdx: mathinputClIdx,
            latex: "Cl^-",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansCl"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansCl")].stateValues
                .creditAchieved,
        ).eq(1);

        await updateMathInputValue({
            componentIdx: mathinputHIdx,
            latex: "H",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansH"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansH")].stateValues
                .creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            componentIdx: mathinputHIdx,
            latex: "H^+",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansH"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansH")].stateValues
                .creditAchieved,
        ).eq(1);

        await updateMathInputValue({
            componentIdx: mathinputMgIdx,
            latex: "Mg",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansMg"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansMg")].stateValues
                .creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            componentIdx: mathinputMgIdx,
            latex: "Mg^{2+}",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansMg"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansMg")].stateValues
                .creditAchieved,
        ).eq(1);

        await updateMathInputValue({
            componentIdx: mathinputPIdx,
            latex: "P",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansP"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansP")].stateValues
                .creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            componentIdx: mathinputPIdx,
            latex: "P^{3-}",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansP"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansP")].stateValues
                .creditAchieved,
        ).eq(1);

        await updateMathInputValue({
            componentIdx: mathinputSIdx,
            latex: "S",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansS"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansS")].stateValues
                .creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            componentIdx: mathinputSIdx,
            latex: "S^{2-}",
            core,
        });
        await submitAnswer({
            componentIdx: resolveComponentName("ansS"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("ansS")].stateValues
                .creditAchieved,
        ).eq(1);
    });
});
