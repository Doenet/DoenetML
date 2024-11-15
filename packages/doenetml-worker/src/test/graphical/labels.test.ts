import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { updateTextInputValue } from "../utils/actions";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Label tests", async () => {
    async function test_labelIsName_preserved_shadowed_or_no_link(core: Core) {
        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/Plabel"].stateValues.value).eq("P");
        expect(stateVariables["/Qlabel"].stateValues.value).eq("Q");
        expect(stateVariables["/Rlabel"].stateValues.value).eq("R");
        expect(stateVariables["/Slabel"].stateValues.value).eq("S");
        expect(stateVariables["/g2Plabel"].stateValues.value).eq("P");
        expect(stateVariables["/g2Qlabel"].stateValues.value).eq("Q");
        expect(stateVariables["/g2Rlabel"].stateValues.value).eq("R");
        expect(stateVariables["/g2Slabel"].stateValues.value).eq("S");
        expect(stateVariables["/Q3label"].stateValues.value).eq("Q");
        expect(stateVariables["/S3label"].stateValues.value).eq("S");
        expect(stateVariables["/Q4label"].stateValues.value).eq("Q");
        expect(stateVariables["/S4label"].stateValues.value).eq("S");
        expect(stateVariables["/g5Plabel"].stateValues.value).eq("P");
        expect(stateVariables["/g5Qlabel"].stateValues.value).eq("Q");
        expect(stateVariables["/g5Rlabel"].stateValues.value).eq("R");
        expect(stateVariables["/g5Slabel"].stateValues.value).eq("S");
        expect(stateVariables["/g5Plabel"].stateValues.value).eq("P");
        expect(stateVariables["/g6Qlabel"].stateValues.value).eq("Q");
        expect(stateVariables["/g6Slabel"].stateValues.value).eq("S");
        expect(stateVariables["/g7Qlabel"].stateValues.value).eq("Q");
        expect(stateVariables["/g7Slabel"].stateValues.value).eq("S");

        let P2Name = stateVariables["/g2"].activeChildren[0].componentName;
        let Q2Name = stateVariables["/g2"].activeChildren[1].componentName;
        let R2Name = stateVariables["/g2"].activeChildren[2].componentName;
        let S2Name = stateVariables["/g2"].activeChildren[3].componentName;
        let P3Name = stateVariables["/g3"].activeChildren[0].componentName;
        let Q3Name = stateVariables["/g3"].activeChildren[1].componentName;
        let R3Name = stateVariables["/g3"].activeChildren[2].componentName;
        let S3Name = stateVariables["/g3"].activeChildren[3].componentName;
        let P4Name = stateVariables["/g4"].activeChildren[0].componentName;
        let Q4Name = stateVariables["/g4"].activeChildren[1].componentName;
        let R4Name = stateVariables["/g4"].activeChildren[2].componentName;
        let S4Name = stateVariables["/g4"].activeChildren[3].componentName;
        let P5Name = stateVariables["/g5"].activeChildren[0].componentName;
        let Q5Name = stateVariables["/g5"].activeChildren[1].componentName;
        let R5Name = stateVariables["/g5"].activeChildren[2].componentName;
        let S5Name = stateVariables["/g5"].activeChildren[3].componentName;
        let P6Name = stateVariables["/g6"].activeChildren[0].componentName;
        let Q6Name = stateVariables["/g6"].activeChildren[1].componentName;
        let R6Name = stateVariables["/g6"].activeChildren[2].componentName;
        let S6Name = stateVariables["/g6"].activeChildren[3].componentName;
        let P7Name = stateVariables["/g7"].activeChildren[0].componentName;
        let Q7Name = stateVariables["/g7"].activeChildren[1].componentName;
        let R7Name = stateVariables["/g7"].activeChildren[2].componentName;
        let S7Name = stateVariables["/g7"].activeChildren[3].componentName;

        expect(stateVariables["/P"].stateValues.label).eq("P");
        expect(stateVariables["/P"].stateValues.labelForGraph).eq("P");
        expect(stateVariables["/Q"].stateValues.label).eq("Q");
        expect(stateVariables["/Q"].stateValues.labelForGraph).eq("Q");
        expect(stateVariables["/R"].stateValues.label).eq("R");
        expect(stateVariables["/R"].stateValues.labelForGraph).eq("R");
        expect(stateVariables["/S"].stateValues.label).eq("S");
        expect(stateVariables["/S"].stateValues.labelForGraph).eq("S");
        expect(stateVariables[P2Name].stateValues.label).eq("P");
        expect(stateVariables[P2Name].stateValues.labelForGraph).eq("P");
        expect(stateVariables[Q2Name].stateValues.label).eq(`Q`);
        expect(stateVariables[Q2Name].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables[R2Name].stateValues.label).eq(`R`);
        expect(stateVariables[R2Name].stateValues.labelForGraph).eq(`R`);
        expect(stateVariables[S2Name].stateValues.label).eq(`S`);
        expect(stateVariables[S2Name].stateValues.labelForGraph).eq(`S`);
        expect(stateVariables["/Q3"].stateValues.label).eq(`Q`);
        expect(stateVariables["/Q3"].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables["/S3"].stateValues.label).eq(`S`);
        expect(stateVariables["/S3"].stateValues.labelForGraph).eq(`S`);
        expect(stateVariables[P3Name].stateValues.label).eq("P");
        expect(stateVariables[P3Name].stateValues.labelForGraph).eq("P");
        expect(stateVariables[Q3Name].stateValues.label).eq(`Q`);
        expect(stateVariables[Q3Name].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables[R3Name].stateValues.label).eq(`R`);
        expect(stateVariables[R3Name].stateValues.labelForGraph).eq(`R`);
        expect(stateVariables[S3Name].stateValues.label).eq(`S`);
        expect(stateVariables[S3Name].stateValues.labelForGraph).eq(`S`);
        expect(stateVariables["/Q4"].stateValues.label).eq(`Q`);
        expect(stateVariables["/Q4"].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables["/S4"].stateValues.label).eq(`S`);
        expect(stateVariables["/S4"].stateValues.labelForGraph).eq(`S`);
        expect(stateVariables[P4Name].stateValues.label).eq("P");
        expect(stateVariables[P4Name].stateValues.labelForGraph).eq("P");
        expect(stateVariables[Q4Name].stateValues.label).eq(`Q`);
        expect(stateVariables[Q4Name].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables[R4Name].stateValues.label).eq(`R`);
        expect(stateVariables[R4Name].stateValues.labelForGraph).eq(`R`);
        expect(stateVariables[S4Name].stateValues.label).eq(`S`);
        expect(stateVariables[S4Name].stateValues.labelForGraph).eq(`S`);
        expect(stateVariables[P5Name].stateValues.label).eq("P");
        expect(stateVariables[P5Name].stateValues.labelForGraph).eq("P");
        expect(stateVariables[Q5Name].stateValues.label).eq(`Q`);
        expect(stateVariables[Q5Name].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables[R5Name].stateValues.label).eq(`R`);
        expect(stateVariables[R5Name].stateValues.labelForGraph).eq(`R`);
        expect(stateVariables[S5Name].stateValues.label).eq(`S`);
        expect(stateVariables[S5Name].stateValues.labelForGraph).eq(`S`);
        expect(stateVariables[P6Name].stateValues.label).eq("P");
        expect(stateVariables[P6Name].stateValues.labelForGraph).eq("P");
        expect(stateVariables[Q6Name].stateValues.label).eq(`Q`);
        expect(stateVariables[Q6Name].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables[R6Name].stateValues.label).eq(`R`);
        expect(stateVariables[R6Name].stateValues.labelForGraph).eq(`R`);
        expect(stateVariables[S6Name].stateValues.label).eq(`S`);
        expect(stateVariables[S6Name].stateValues.labelForGraph).eq(`S`);
        expect(stateVariables[P7Name].stateValues.label).eq("P");
        expect(stateVariables[P7Name].stateValues.labelForGraph).eq("P");
        expect(stateVariables[Q7Name].stateValues.label).eq(`Q`);
        expect(stateVariables[Q7Name].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables[R7Name].stateValues.label).eq(`R`);
        expect(stateVariables[R7Name].stateValues.labelForGraph).eq(`R`);
        expect(stateVariables[S7Name].stateValues.label).eq(`S`);
        expect(stateVariables[S7Name].stateValues.labelForGraph).eq(`S`);
    }

    it("labels from labelIsName are preserved when shadowed", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g">
    <point name="P" labelIsName>(1,2)</point>
    <point name="Q" labelIsName>(3,4)</point>
    <point name="R" labelIsName>(5,6)</point>
    <point name="S" labelIsName>(7,8)</point>
  </graph>

  <graph name="g2" copySource="g" newNamespace />

  <graph name="g3">
     $P
     $Q{name="Q3"}
     <point copySource="R" />
     <point name="S3" copySource="S" />
  </graph>

  <graph name="g4">
     $P{labelIsName="false"}
     $Q{name="Q4" labelIsName="false"}
     <point copySource="R" labelIsName="false" />
     <point name="S4" copySource="S" labelIsName="false" />
  </graph>

  <graph copySource="g2" name="g5" newNamespace />
  <graph copySource="g3" name="g6" newNamespace />
  <graph copySource="g4" name="g7" newNamespace />

  <p>P label: <label copySource="P.label" name="Plabel" /></p>
  <p>Q label: <label copySource="Q.label" name="Qlabel" /></p>
  <p>R label: <label copySource="R.label" name="Rlabel" /></p>
  <p>S label: <label copySource="S.label" name="Slabel" /></p>
  <p>g2/P label: <label copySource="g2/P.label" name="g2Plabel" /></p>
  <p>g2/Q label: <label copySource="g2/Q.label" name="g2Qlabel" /></p>
  <p>g2/R label: <label copySource="g2/R.label" name="g2Rlabel" /></p>
  <p>g2/S label: <label copySource="g2/S.label" name="g2Slabel" /></p>
  <p>Q3 label: <label copySource="Q3.label" name="Q3label" /></p>
  <p>S3 label: <label copySource="S3.label" name="S3label" /></p>
  <p>Q4 label: <label copySource="Q4.label" name="Q4label" /></p>
  <p>S4 label: <label copySource="S4.label" name="S4label" /></p>
  <p>g5/P label: <label copySource="g5/P.label" name="g5Plabel" /></p>
  <p>g5/Q label: <label copySource="g5/Q.label" name="g5Qlabel" /></p>
  <p>g5/R label: <label copySource="g5/R.label" name="g5Rlabel" /></p>
  <p>g5/S label: <label copySource="g5/S.label" name="g5Slabel" /></p>
  <p>g6/Q3 label: <label copySource="g6/Q3.label" name="g6Qlabel" /></p>
  <p>g6/S3 label: <label copySource="g6/S3.label" name="g6Slabel" /></p>
  <p>g7/Q4 label: <label copySource="g7/Q4.label" name="g7Qlabel" /></p>
  <p>g7/S4 label: <label copySource="g7/S4.label" name="g7Slabel" /></p>

    `,
        });

        await test_labelIsName_preserved_shadowed_or_no_link(core);
    });

    it("labels from labelIsName are preserved when copy with link=false", async () => {
        let core = await createTestCore({
            doenetML: `
<graph name="g">
  <point name="P" labelIsName>(1,2)</point>
  <point name="Q" labelIsName>(3,4)</point>
  <point name="R" labelIsName>(5,6)</point>
  <point name="S" labelIsName>(7,8)</point>
</graph>

<graph name="g2" copySource="g" newNamespace link="false" />

<graph name="g3">
  $P{link="false"}
  $Q{name="Q3" link="false"}
  <point copySource="R" link="false" />
  <point name="S3" copySource="S" link="false" />
</graph>

<graph name="g4">
  $P{labelIsName="false" link="false"}
  $Q{name="Q4" labelIsName="false" link="false"}
  <point copySource="R" labelIsName="false" link="false" />
  <point name="S4" copySource="S" labelIsName="false" link="false" />
</graph>

<graph copySource="g2" name="g5" newNamespace link="false" />
<graph copySource="g3" name="g6" newNamespace link="false" />
<graph copySource="g4" name="g7" newNamespace link="false" />

<p>P label: <label copySource="P.label" name="Plabel" /></p>
<p>Q label: <label copySource="Q.label" name="Qlabel" /></p>
<p>R label: <label copySource="R.label" name="Rlabel" /></p>
<p>S label: <label copySource="S.label" name="Slabel" /></p>
<p>g2/P label: <label copySource="g2/P.label" name="g2Plabel" /></p>
<p>g2/Q label: <label copySource="g2/Q.label" name="g2Qlabel" /></p>
<p>g2/R label: <label copySource="g2/R.label" name="g2Rlabel" /></p>
<p>g2/S label: <label copySource="g2/S.label" name="g2Slabel" /></p>
<p>Q3 label: <label copySource="Q3.label" name="Q3label" /></p>
<p>S3 label: <label copySource="S3.label" name="S3label" /></p>
<p>Q4 label: <label copySource="Q4.label" name="Q4label" /></p>
<p>S4 label: <label copySource="S4.label" name="S4label" /></p>
<p>g5/P label: <label copySource="g5/P.label" name="g5Plabel" /></p>
<p>g5/Q label: <label copySource="g5/Q.label" name="g5Qlabel" /></p>
<p>g5/R label: <label copySource="g5/R.label" name="g5Rlabel" /></p>
<p>g5/S label: <label copySource="g5/S.label" name="g5Slabel" /></p>
<p>g6/Q3 label: <label copySource="g6/Q3.label" name="g6Qlabel" /></p>
<p>g6/S3 label: <label copySource="g6/S3.label" name="g6Slabel" /></p>
<p>g7/Q4 label: <label copySource="g7/Q4.label" name="g7Qlabel" /></p>
<p>g7/S4 label: <label copySource="g7/S4.label" name="g7Slabel" /></p>

    `,
        });

        await test_labelIsName_preserved_shadowed_or_no_link(core);
    });

    it("labelIsName in map", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <map>
      <template><point name="P" labelIsName>($v,1)</point></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g2" newNamespace>
    <map>
      <template newNamespace><vector name="P" labelIsName>($v,1)</vector></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g3" newNamespace>
    <map assignNames="(A) (B) (C)">
      <template><circle name="P" labelIsName center="($v,1)" /"></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g4" newNamespace>
    <map assignNames="(A) (B) (C)">
      <template newNamespace><line name="P" labelIsName through="($v,1)" /></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g5" newNamespace>
    <map assignNames="A B C">
      <template><triangle name="P" labelIsName vertex="($v,1)" /></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>

  <graph name="g6" newNamespace>
    <map assignNames="A B C">
      <template newNamespace><lineSegment name="P" labelIsName endPoint="($v,1)" /></template>
      <sources alias="v"><sequence from="-2" to="2" /></sources>
    </map>
  </graph>


  $g1{name="g7"}
  $g2{name="g8"}
  $g3{name="g9"}
  $g4{name="g10"}
  $g5{name="g11"}
  $g6{name="g12"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let g1ChildNames = stateVariables["/g1"].activeChildren.map(
            (x) => x.componentName,
        );
        let g2ChildNames = stateVariables["/g2"].activeChildren.map(
            (x) => x.componentName,
        );
        let g3ChildNames = stateVariables["/g3"].activeChildren.map(
            (x) => x.componentName,
        );
        let g4ChildNames = stateVariables["/g4"].activeChildren.map(
            (x) => x.componentName,
        );
        let g5ChildNames = stateVariables["/g5"].activeChildren.map(
            (x) => x.componentName,
        );
        let g6ChildNames = stateVariables["/g6"].activeChildren.map(
            (x) => x.componentName,
        );
        let g7ChildNames = stateVariables["/g7"].activeChildren.map(
            (x) => x.componentName,
        );
        let g8ChildNames = stateVariables["/g8"].activeChildren.map(
            (x) => x.componentName,
        );
        let g9ChildNames = stateVariables["/g9"].activeChildren.map(
            (x) => x.componentName,
        );
        let g10ChildNames = stateVariables["/g10"].activeChildren.map(
            (x) => x.componentName,
        );
        let g11ChildNames = stateVariables["/g11"].activeChildren.map(
            (x) => x.componentName,
        );
        let g12ChildNames = stateVariables["/g12"].activeChildren.map(
            (x) => x.componentName,
        );

        let g1ChildLabels = Array(5).fill("");
        let g2ChildLabels = Array(5).fill("P");
        let g3ChildLabels = ["A", "B", "C", "", ""];
        let g4ChildLabels = ["A", "B", "C", "P", "P"];
        let g5ChildLabels = Array(5).fill("");
        let g6ChildLabels = Array(5).fill("P");

        for (let [ind, name] of g1ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g1ChildLabels[ind],
            );
        }
        for (let [ind, name] of g2ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g2ChildLabels[ind],
            );
        }
        for (let [ind, name] of g3ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g3ChildLabels[ind],
            );
        }
        for (let [ind, name] of g4ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g4ChildLabels[ind],
            );
        }
        for (let [ind, name] of g5ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g5ChildLabels[ind],
            );
        }
        for (let [ind, name] of g6ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g6ChildLabels[ind],
            );
        }

        for (let [ind, name] of g7ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g1ChildLabels[ind],
            );
        }
        for (let [ind, name] of g8ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g2ChildLabels[ind],
            );
        }
        for (let [ind, name] of g9ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g3ChildLabels[ind],
            );
        }
        for (let [ind, name] of g10ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g4ChildLabels[ind],
            );
        }
        for (let [ind, name] of g11ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g5ChildLabels[ind],
            );
        }
        for (let [ind, name] of g12ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                g6ChildLabels[ind],
            );
        }
    });

    it("labelIsName in newNamespace", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g" newNamespace>
    <point name="P" labelIsName>(5,6)</point>
  </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/g/P"].stateValues.label).eq("P");
    });

    it("labelIsName converts case", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="the_first_point" labelIsName>(5,6)</point>
    <point name="the-second-point" labelIsName>(1,3)</point>
    <point name="theThirdPoint" labelIsName>(-2,1)</point>
    <point name="TheFourthPoint" labelIsName>(7,-5)</point>
    <point name="the-FIFTH_Point" labelIsName>(-6,-8)</point>
    <point name="the_SiXiTH-Point" labelIsName>(9,0)</point>
  </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/the_first_point"].stateValues.label).eq(
            "the first point",
        );
        expect(stateVariables["/the-second-point"].stateValues.label).eq(
            "the second point",
        );
        expect(stateVariables["/theThirdPoint"].stateValues.label).eq(
            "the third point",
        );
        expect(stateVariables["/TheFourthPoint"].stateValues.label).eq(
            "The Fourth Point",
        );
        expect(stateVariables["/the-FIFTH_Point"].stateValues.label).eq(
            "the FIFTH Point",
        );
        expect(stateVariables["/the_SiXiTH-Point"].stateValues.label).eq(
            "the SiXiTH Point",
        );
    });

    it("labelIsName and copies", async () => {
        // Note: we add groups just so that we can reference the children
        // inside the DoenetML
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="A" labelIsName />
  </graph>
  <graph>
    <point copySource="A" name="B" />
  </graph>
  <graph>
    $A{name="C"}
  </graph>
  <graph>
    <point copySource="A" name="D" labelIsName/>
  </graph>
  <graph>
    $A{name="E" labelIsName}
  </graph>
  <graph name="g6">
    <group name="grp1"><point copySource="A" labelIsName/></group>
  </graph>
  <graph name="g7">
    <group name="grp2">$A{labelIsName}</group>
  </graph>

  <p><text copySource="A" copyProp="label" name="lA" /></p>
  <p><label copySource="B" copyProp="label" name="lB" /></p>
  <p><text copySource="C" copyProp="label" name="lC" /></p>
  <p><label copySource="D" copyProp="label" name="lD" /></p>
  <p><text copySource="E" copyProp="label" name="lE" /></p>
  <p><label copySource="grp1[1].label" name="lp6" /></p>
  <p><label copySource="grp2[1].label" name="lp7" /></p>

  <p><textInput bindValueTo="$A.label" name="tiA" /></p>
  <p><textInput bindValueTo="$B.label" name="tiB" /></p>
  <p><textInput bindValueTo="$C.label" name="tiC" /></p>
  <p><textInput bindValueTo="$D.label" name="tiD" /></p>
  <p><textInput bindValueTo="$E.label" name="tiE" /></p>
  <p><textInput bindValueTo="$grp1[1].label" name="tip6" /></p>
  <p><textInput bindValueTo="$grp2[1].label" name="tip7" /></p>
    `,
        });

        async function check_items({ lA, lD, lE, l6, l7 }) {
            const stateVariables = await returnAllStateVariables(core);
            const p6Name =
                stateVariables["/g6"].activeChildren[0].componentName;
            const p7Name =
                stateVariables["/g7"].activeChildren[0].componentName;

            expect(stateVariables["/lA"].stateValues.value).eq(lA);
            expect(stateVariables["/lB"].stateValues.value).eq(lA);
            expect(stateVariables["/lC"].stateValues.value).eq(lA);
            expect(stateVariables["/lD"].stateValues.value).eq(lD);
            expect(stateVariables["/lE"].stateValues.value).eq(lE);
            expect(stateVariables["/lp6"].stateValues.value).eq(l6);
            expect(stateVariables["/lp7"].stateValues.value).eq(l7);

            expect(stateVariables["/A"].stateValues.label).eq(lA);
            expect(stateVariables["/A"].stateValues.labelForGraph).eq(lA);
            expect(stateVariables["/B"].stateValues.label).eq(lA);
            expect(stateVariables["/B"].stateValues.labelForGraph).eq(lA);
            expect(stateVariables["/C"].stateValues.label).eq(lA);
            expect(stateVariables["/C"].stateValues.labelForGraph).eq(lA);
            expect(stateVariables["/D"].stateValues.label).eq(lD);
            expect(stateVariables["/D"].stateValues.labelForGraph).eq(lD);
            expect(stateVariables["/E"].stateValues.label).eq(lE);
            expect(stateVariables["/E"].stateValues.labelForGraph).eq(lE);
            expect(stateVariables[p6Name].stateValues.label).eq(l6);
            expect(stateVariables[p6Name].stateValues.labelForGraph).eq(l6);
            expect(stateVariables[p7Name].stateValues.label).eq(l7);
            expect(stateVariables[p7Name].stateValues.labelForGraph).eq(l7);
        }

        let lA = "A",
            lD = "D",
            lE = "E",
            l6 = "A",
            l7 = "A";
        await check_items({ lA, lD, lE, l6, l7 });

        lA = "F";
        await updateTextInputValue({ text: lA, name: "/tiA", core });
        await check_items({ lA, lD, lE, l6, l7 });

        lA = "G";
        await updateTextInputValue({ name: "/tiB", text: lA, core });
        await check_items({ lA, lD, lE, l6, l7 });

        lA = "H";
        await updateTextInputValue({ name: "/tiC", text: lA, core });
        await check_items({ lA, lD, lE, l6, l7 });

        lD = "I";
        await updateTextInputValue({ name: "/tiD", text: lD, core });
        await check_items({ lA, lD, lE, l6, l7 });

        lE = "J";
        await updateTextInputValue({ name: "/tiE", text: lE, core });
        await check_items({ lA, lD, lE, l6, l7 });

        l6 = "K";
        await updateTextInputValue({ name: "/tip6", text: l6, core });
        await check_items({ lA, lD, lE, l6, l7 });

        l7 = "L";
        await updateTextInputValue({ name: "/tip7", text: l7, core });
        await check_items({ lA, lD, lE, l6, l7 });
    });

    it("copy and add labelIsName", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="A" />
  </graph>
  <graph>
    <point copySource="A" name="B" labelIsName />
  </graph>
  <graph>
    $A{name="C" labelIsName}
  </graph>
  <graph name="g4">
    <group name="grp1"><point copySource="A" labelIsName/></group>
  </graph>
  <graph name="g5">
    <group name="grp2">$A{labelIsName}</group>
  </graph>

  <p><text copySource="A" copyProp="label" name="lA" /></p>
  <p><label copySource="B" copyProp="label" name="lB" /></p>
  <p><text copySource="C" copyProp="label" name="lC" /></p>
  <p><label copySource="grp1[1].label" name="lp4" /></p>
  <p><label copySource="grp2[1].label" name="lp5" /></p>

  <p><textInput bindValueTo="$A.label" name="tiA" /></p>
  <p><textInput bindValueTo="$B.label" name="tiB" /></p>
  <p><textInput bindValueTo="$C.label" name="tiC" /></p>
  <p><textInput bindValueTo="$grp1[1].label" name="tip4" /></p>
  <p><textInput bindValueTo="$grp2[1].label" name="tip5" /></p>
`,
        });

        async function check_items({ lA, lB, lC, l4, l5 }) {
            const stateVariables = await returnAllStateVariables(core);
            const p4Name =
                stateVariables["/g4"].activeChildren[0].componentName;
            const p5Name =
                stateVariables["/g5"].activeChildren[0].componentName;

            expect(stateVariables["/lA"].stateValues.value).eq(lA);
            expect(stateVariables["/lB"].stateValues.value).eq(lB);
            expect(stateVariables["/lC"].stateValues.value).eq(lC);
            expect(stateVariables["/lp4"].stateValues.value).eq(l4);
            expect(stateVariables["/lp5"].stateValues.value).eq(l5);

            expect(stateVariables["/A"].stateValues.label).eq(lA);
            expect(stateVariables["/A"].stateValues.labelForGraph).eq(lA);
            expect(stateVariables["/B"].stateValues.label).eq(lB);
            expect(stateVariables["/B"].stateValues.labelForGraph).eq(lB);
            expect(stateVariables["/C"].stateValues.label).eq(lC);
            expect(stateVariables["/C"].stateValues.labelForGraph).eq(lC);
            expect(stateVariables[p4Name].stateValues.label).eq(l4);
            expect(stateVariables[p4Name].stateValues.labelForGraph).eq(l4);
            expect(stateVariables[p5Name].stateValues.label).eq(l5);
            expect(stateVariables[p5Name].stateValues.labelForGraph).eq(l5);
        }

        let lA = "",
            lB = "B",
            lC = "C",
            l4 = "A",
            l5 = "A";
        await check_items({ lA, lB, lC, l4, l5 });

        lA = "F";
        await updateTextInputValue({ text: lA, name: "/tiA", core });
        await check_items({ lA, lB, lC, l4, l5 });

        lB = "G";
        await updateTextInputValue({ name: "/tiB", text: lB, core });
        await check_items({ lA, lB, lC, l4, l5 });

        lC = "H";
        await updateTextInputValue({ name: "/tiC", text: lC, core });
        await check_items({ lA, lB, lC, l4, l5 });

        l4 = "I";
        await updateTextInputValue({ name: "/tip4", text: l4, core });
        await check_items({ lA, lB, lC, l4, l5 });

        l5 = "J";
        await updateTextInputValue({ name: "/tip5", text: l5, core });
        await check_items({ lA, lB, lC, l4, l5 });
    });

    async function test_label_labelIsName_copies(
        doenetMLForA: string,
        useLabelCopies = false,
    ) {
        const labelD = useLabelCopies
            ? `<label copySource="Dl"/>`
            : `<label>D</label>`;
        const labelG = useLabelCopies
            ? `<label copySource="Gl"/>`
            : `<label>G</label>`;
        const labelJ = useLabelCopies
            ? `<label copySource="Jl"/>`
            : `<label>J</label>`;

        let labelDefinitions = "";
        if (useLabelCopies) {
            labelDefinitions = `
      <label name="Al0">A</label>
      <label name="Al" copySource="Al0" />
      <label name="Dl">D</label>
      <label name="Gl0">G</label>
      <label name="Gl" copySource="Gl0" />
      <label name="Jl0">J</label>
      <label name="Jl1" copySource="Jl0" />
      <label name="Jl" copySource="Jl1" />
            `;
        }

        let core = await createTestCore({
            doenetML: `
    <graph>

        ${doenetMLForA}
        <point copySource="A" name="B" x="1" />
        <point copySource="A" labelIsName name="C" x="2" />
        <point copySource="A" name="D" x="3">${labelD}</point>

        <point copySource="B" name="E" x="1" y="1" />
        <point copySource="B" labelIsName name="F" x="2" y="1" />
        <point copySource="B" name="G" x="3" y="1">${labelG}</point>

        <point copySource="C" name="H" x="1" y="2" />
        <point copySource="C" labelIsName name="I" x="2" y="2" />
        <point copySource="C" name="J" x="3" y="2">${labelJ}</point>

        <point copySource="D" name="K" x="1" y="3" />
        <point copySource="D" labelIsName name="L" x="2" y="3" />
        <point copySource="D" name="M" x="3" y="3"><label>M</label></point>

    </graph>

    ${labelDefinitions}

    <p><text copySource="A.label" name="lA" /></p>
    <p><text copySource="B.label" name="lB" /></p>
    <p><text copySource="C.label" name="lC" /></p>
    <p><text copySource="D.label" name="lD" /></p>
    <p><text copySource="E.label" name="lE" /></p>
    <p><text copySource="F.label" name="lF" /></p>
    <p><text copySource="G.label" name="lG" /></p>
    <p><text copySource="H.label" name="lH" /></p>
    <p><text copySource="I.label" name="lI" /></p>
    <p><text copySource="J.label" name="lJ" /></p>
    <p><text copySource="K.label" name="lK" /></p>
    <p><text copySource="L.label" name="lL" /></p>
    <p><text copySource="M.label" name="lM" /></p>

    <p>Change label of A: <textInput bindValueTo="$A.label" name="tiA" /></p>
    <p>Change label of B: <textInput bindValueTo="$B.label" name="tiB" /></p>
    <p>Change label of C: <textInput bindValueTo="$C.label" name="tiC" /></p>
    <p>Change label of D: <textInput bindValueTo="$D.label" name="tiD" /></p>
    <p>Change label of E: <textInput bindValueTo="$E.label" name="tiE" /></p>
    <p>Change label of F: <textInput bindValueTo="$F.label" name="tiF" /></p>
    <p>Change label of G: <textInput bindValueTo="$G.label" name="tiG" /></p>
    <p>Change label of H: <textInput bindValueTo="$H.label" name="tiH" /></p>
    <p>Change label of I: <textInput bindValueTo="$I.label" name="tiI" /></p>
    <p>Change label of J: <textInput bindValueTo="$J.label" name="tiJ" /></p>
    <p>Change label of K: <textInput bindValueTo="$K.label" name="tiK" /></p>
    <p>Change label of L: <textInput bindValueTo="$L.label" name="tiL" /></p>
    <p>Change label of M: <textInput bindValueTo="$M.label" name="tiM" /></p>

    `,
        });

        async function check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM }) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/lA"].stateValues.value).eq(lA);
            expect(stateVariables["/lB"].stateValues.value).eq(lA);
            expect(stateVariables["/lC"].stateValues.value).eq(lC);
            expect(stateVariables["/lD"].stateValues.value).eq(lD);
            expect(stateVariables["/lE"].stateValues.value).eq(lA);
            expect(stateVariables["/lF"].stateValues.value).eq(lF);
            expect(stateVariables["/lG"].stateValues.value).eq(lG);
            expect(stateVariables["/lH"].stateValues.value).eq(lC);
            expect(stateVariables["/lI"].stateValues.value).eq(lI);
            expect(stateVariables["/lJ"].stateValues.value).eq(lJ);
            expect(stateVariables["/lK"].stateValues.value).eq(lD);
            expect(stateVariables["/lL"].stateValues.value).eq(lL);
            expect(stateVariables["/lM"].stateValues.value).eq(lM);
        }

        let lA = "A",
            lC = "C",
            lD = "D",
            lF = "F",
            lG = "G",
            lI = "I",
            lJ = "J",
            lL = "L",
            lM = "M";

        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lA = "N";
        await updateTextInputValue({ name: "/tiA", text: lA, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lA = "O";
        await updateTextInputValue({ name: "/tiB", text: lA, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lC = "P";
        await updateTextInputValue({ name: "/tiC", text: lC, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lD = "Q";
        await updateTextInputValue({ name: "/tiD", text: lD, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lA = "R";
        await updateTextInputValue({ name: "/tiE", text: lA, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lF = "S";
        await updateTextInputValue({ name: "/tiF", text: lF, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lG = "T";
        await updateTextInputValue({ name: "/tiG", text: lG, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lC = "U";
        await updateTextInputValue({ name: "/tiH", text: lC, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lI = "V";
        await updateTextInputValue({ name: "/tiI", text: lI, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lJ = "W";
        await updateTextInputValue({ name: "/tiJ", text: lJ, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lD = "X";
        await updateTextInputValue({ name: "/tiK", text: lD, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lL = "Y";
        await updateTextInputValue({ name: "/tiL", text: lL, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lM = "Z";
        await updateTextInputValue({ name: "/tiM", text: lM, core });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });
    }

    it("label, labelIsName and copies, start with label", async () => {
        const doenetMLForA = `<point name="A"><label>A</label></point>`;

        await test_label_labelIsName_copies(doenetMLForA);
    });

    it("label, labelIsName and copies, start with labelIsName", async () => {
        const doenetMLForA = `<point name="A" labelIsName />`;

        await test_label_labelIsName_copies(doenetMLForA);
    });

    it("label, labelIsName and copies, copy in labels", async () => {
        const doenetMLForA = `<point name="A"><label copySource="Al" /></point>`;

        await test_label_labelIsName_copies(doenetMLForA, true);
    });

    it("escape underscore and caret in labelForGraph except if math", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="A" >
      <label>x_1</label>
      (0,0)
    </point>
    <point name="B" >
      <label><m>x_1</m></label>
      (1,1)
    </point>
    <point name="C" >
      <label>x^1</label>
      (2,2)
    </point>
    <point name="D" >
      <label><m>x^1</m></label>
      (3,3)
    </point>
    <point name="E" >
      <label>x^1 or <m>x^2</m> or x_3 or <m>x_4</m></label>
      (4,4)
    </point>
    <point name="F" >
      <label>x_a^b or <m>x_c^d</m></label>
      (5,5)
    </point>
  </graph>


    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/A"].stateValues.label).eq("x_1");
        expect(stateVariables["/A"].stateValues.labelForGraph).eq(
            "x&UnderBar;1",
        );
        expect(stateVariables["/B"].stateValues.label).eq("\\(x_1\\)");
        expect(stateVariables["/B"].stateValues.labelForGraph).eq("\\(x_1\\)");
        expect(stateVariables["/C"].stateValues.label).eq("x^1");
        expect(stateVariables["/C"].stateValues.labelForGraph).eq("x&Hat;1");
        expect(stateVariables["/D"].stateValues.label).eq("\\(x^1\\)");
        expect(stateVariables["/D"].stateValues.labelForGraph).eq("\\(x^1\\)");
        expect(stateVariables["/E"].stateValues.label).eq(
            "x^1 or \\(x^2\\) or x_3 or \\(x_4\\)",
        );
        expect(stateVariables["/E"].stateValues.labelForGraph).eq(
            "x&Hat;1 or \\(x^2\\) or x&UnderBar;3 or \\(x_4\\)",
        );
        expect(stateVariables["/F"].stateValues.label).eq(
            "x_a^b or \\(x_c^d\\)",
        );
        expect(stateVariables["/F"].stateValues.labelForGraph).eq(
            "x&UnderBar;a&Hat;b or \\(x_c^d\\)",
        );
    });
});
