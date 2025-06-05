import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolveComponentName } from "../utils/test-core";
import { updateTextInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Label tests", async () => {
    async function test_labelIsName_preserved_shadowed_or_no_link(
        core: PublicDoenetMLCore,
        resolveComponentName: ResolveComponentName,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("Plabel")].stateValues.value,
        ).eq("P");
        expect(
            stateVariables[resolveComponentName("Qlabel")].stateValues.value,
        ).eq("Q");
        expect(
            stateVariables[resolveComponentName("Rlabel")].stateValues.value,
        ).eq("R");
        expect(
            stateVariables[resolveComponentName("Slabel")].stateValues.value,
        ).eq("S");
        expect(
            stateVariables[resolveComponentName("g2Plabel")].stateValues.value,
        ).eq("P");
        expect(
            stateVariables[resolveComponentName("g2Qlabel")].stateValues.value,
        ).eq("Q");
        expect(
            stateVariables[resolveComponentName("g2Rlabel")].stateValues.value,
        ).eq("R");
        expect(
            stateVariables[resolveComponentName("g2Slabel")].stateValues.value,
        ).eq("S");
        expect(
            stateVariables[resolveComponentName("Q3label")].stateValues.value,
        ).eq("Q");
        expect(
            stateVariables[resolveComponentName("S3label")].stateValues.value,
        ).eq("S");
        expect(
            stateVariables[resolveComponentName("Q4label")].stateValues.value,
        ).eq("Q");
        expect(
            stateVariables[resolveComponentName("S4label")].stateValues.value,
        ).eq("S");
        expect(
            stateVariables[resolveComponentName("g5Plabel")].stateValues.value,
        ).eq("P");
        expect(
            stateVariables[resolveComponentName("g5Qlabel")].stateValues.value,
        ).eq("Q");
        expect(
            stateVariables[resolveComponentName("g5Rlabel")].stateValues.value,
        ).eq("R");
        expect(
            stateVariables[resolveComponentName("g5Slabel")].stateValues.value,
        ).eq("S");
        expect(
            stateVariables[resolveComponentName("g5Plabel")].stateValues.value,
        ).eq("P");
        expect(
            stateVariables[resolveComponentName("g6Qlabel")].stateValues.value,
        ).eq("Q");
        expect(
            stateVariables[resolveComponentName("g6Slabel")].stateValues.value,
        ).eq("S");
        expect(
            stateVariables[resolveComponentName("g7Qlabel")].stateValues.value,
        ).eq("Q");
        expect(
            stateVariables[resolveComponentName("g7Slabel")].stateValues.value,
        ).eq("S");

        let P2Name =
            stateVariables[resolveComponentName("g2")].activeChildren[0]
                .componentIdx;
        let Q2Name =
            stateVariables[resolveComponentName("g2")].activeChildren[1]
                .componentIdx;
        let R2Name =
            stateVariables[resolveComponentName("g2")].activeChildren[2]
                .componentIdx;
        let S2Name =
            stateVariables[resolveComponentName("g2")].activeChildren[3]
                .componentIdx;
        let P3Name =
            stateVariables[resolveComponentName("g3")].activeChildren[0]
                .componentIdx;
        let Q3Name =
            stateVariables[resolveComponentName("g3")].activeChildren[1]
                .componentIdx;
        let R3Name =
            stateVariables[resolveComponentName("g3")].activeChildren[2]
                .componentIdx;
        let S3Name =
            stateVariables[resolveComponentName("g3")].activeChildren[3]
                .componentIdx;
        let P4Name =
            stateVariables[resolveComponentName("g4")].activeChildren[0]
                .componentIdx;
        let Q4Name =
            stateVariables[resolveComponentName("g4")].activeChildren[1]
                .componentIdx;
        let R4Name =
            stateVariables[resolveComponentName("g4")].activeChildren[2]
                .componentIdx;
        let S4Name =
            stateVariables[resolveComponentName("g4")].activeChildren[3]
                .componentIdx;
        let P5Name =
            stateVariables[resolveComponentName("g5")].activeChildren[0]
                .componentIdx;
        let Q5Name =
            stateVariables[resolveComponentName("g5")].activeChildren[1]
                .componentIdx;
        let R5Name =
            stateVariables[resolveComponentName("g5")].activeChildren[2]
                .componentIdx;
        let S5Name =
            stateVariables[resolveComponentName("g5")].activeChildren[3]
                .componentIdx;
        let P6Name =
            stateVariables[resolveComponentName("g6")].activeChildren[0]
                .componentIdx;
        let Q6Name =
            stateVariables[resolveComponentName("g6")].activeChildren[1]
                .componentIdx;
        let R6Name =
            stateVariables[resolveComponentName("g6")].activeChildren[2]
                .componentIdx;
        let S6Name =
            stateVariables[resolveComponentName("g6")].activeChildren[3]
                .componentIdx;
        let P7Name =
            stateVariables[resolveComponentName("g7")].activeChildren[0]
                .componentIdx;
        let Q7Name =
            stateVariables[resolveComponentName("g7")].activeChildren[1]
                .componentIdx;
        let R7Name =
            stateVariables[resolveComponentName("g7")].activeChildren[2]
                .componentIdx;
        let S7Name =
            stateVariables[resolveComponentName("g7")].activeChildren[3]
                .componentIdx;

        expect(stateVariables[resolveComponentName("P")].stateValues.label).eq(
            "P",
        );
        expect(
            stateVariables[resolveComponentName("P")].stateValues.labelForGraph,
        ).eq("P");
        expect(stateVariables[resolveComponentName("Q")].stateValues.label).eq(
            "Q",
        );
        expect(
            stateVariables[resolveComponentName("Q")].stateValues.labelForGraph,
        ).eq("Q");
        expect(stateVariables[resolveComponentName("R")].stateValues.label).eq(
            "R",
        );
        expect(
            stateVariables[resolveComponentName("R")].stateValues.labelForGraph,
        ).eq("R");
        expect(stateVariables[resolveComponentName("S")].stateValues.label).eq(
            "S",
        );
        expect(
            stateVariables[resolveComponentName("S")].stateValues.labelForGraph,
        ).eq("S");
        expect(stateVariables[P2Name].stateValues.label).eq("P");
        expect(stateVariables[P2Name].stateValues.labelForGraph).eq("P");
        expect(stateVariables[Q2Name].stateValues.label).eq(`Q`);
        expect(stateVariables[Q2Name].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables[R2Name].stateValues.label).eq(`R`);
        expect(stateVariables[R2Name].stateValues.labelForGraph).eq(`R`);
        expect(stateVariables[S2Name].stateValues.label).eq(`S`);
        expect(stateVariables[S2Name].stateValues.labelForGraph).eq(`S`);
        expect(stateVariables[resolveComponentName("Q3")].stateValues.label).eq(
            `Q`,
        );
        expect(
            stateVariables[resolveComponentName("Q3")].stateValues
                .labelForGraph,
        ).eq(`Q`);
        expect(stateVariables[resolveComponentName("S3")].stateValues.label).eq(
            `S`,
        );
        expect(
            stateVariables[resolveComponentName("S3")].stateValues
                .labelForGraph,
        ).eq(`S`);
        expect(stateVariables[P3Name].stateValues.label).eq("P");
        expect(stateVariables[P3Name].stateValues.labelForGraph).eq("P");
        expect(stateVariables[Q3Name].stateValues.label).eq(`Q`);
        expect(stateVariables[Q3Name].stateValues.labelForGraph).eq(`Q`);
        expect(stateVariables[R3Name].stateValues.label).eq(`R`);
        expect(stateVariables[R3Name].stateValues.labelForGraph).eq(`R`);
        expect(stateVariables[S3Name].stateValues.label).eq(`S`);
        expect(stateVariables[S3Name].stateValues.labelForGraph).eq(`S`);
        expect(stateVariables[resolveComponentName("Q4")].stateValues.label).eq(
            `Q`,
        );
        expect(
            stateVariables[resolveComponentName("Q4")].stateValues
                .labelForGraph,
        ).eq(`Q`);
        expect(stateVariables[resolveComponentName("S4")].stateValues.label).eq(
            `S`,
        );
        expect(
            stateVariables[resolveComponentName("S4")].stateValues
                .labelForGraph,
        ).eq(`S`);
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
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <graph name="g">
    <point name="P" labelIsName>(1,2)</point>
    <point name="Q" labelIsName>(3,4)</point>
    <point name="R" labelIsName>(5,6)</point>
    <point name="S" labelIsName>(7,8)</point>
  </graph>

  <graph name="g2" extend="$g" />

  <graph name="g3">
     $P
     <point extend="$Q" name="Q3" />
     <point extend="$R" />
     <point name="S3" extend="$S" />
  </graph>

  <graph name="g4">
     <point extend="$P" labelIsName="false" />
     <point extend="$Q" name="Q4" labelIsName="false" />
     <point extend="$R" labelIsName="false" />
     <point name="S4" extend="$S" labelIsName="false" />
  </graph>

  <graph extend="$g2" name="g5" />
  <graph extend="$g3" name="g6" />
  <graph extend="$g4" name="g7" />

  <p>P label: <label extend="$P.label" name="Plabel" /></p>
  <p>Q label: <label extend="$Q.label" name="Qlabel" /></p>
  <p>R label: <label extend="$R.label" name="Rlabel" /></p>
  <p>S label: <label extend="$S.label" name="Slabel" /></p>
  <p>g2.P label: <label extend="$g2.P.label" name="g2Plabel" /></p>
  <p>g2.Q label: <label extend="$g2.Q.label" name="g2Qlabel" /></p>
  <p>g2.R label: <label extend="$g2.R.label" name="g2Rlabel" /></p>
  <p>g2.S label: <label extend="$g2.S.label" name="g2Slabel" /></p>
  <p>Q3 label: <label extend="$Q3.label" name="Q3label" /></p>
  <p>S3 label: <label extend="$S3.label" name="S3label" /></p>
  <p>Q4 label: <label extend="$Q4.label" name="Q4label" /></p>
  <p>S4 label: <label extend="$S4.label" name="S4label" /></p>
  <p>g5.P label: <label extend="$g5.P.label" name="g5Plabel" /></p>
  <p>g5.Q label: <label extend="$g5.Q.label" name="g5Qlabel" /></p>
  <p>g5.R label: <label extend="$g5.R.label" name="g5Rlabel" /></p>
  <p>g5.S label: <label extend="$g5.S.label" name="g5Slabel" /></p>
  <p>g6.Q3 label: <label extend="$g6.Q3.label" name="g6Qlabel" /></p>
  <p>g6.S3 label: <label extend="$g6.S3.label" name="g6Slabel" /></p>
  <p>g7.Q4 label: <label extend="$g7.Q4.label" name="g7Qlabel" /></p>
  <p>g7.S4 label: <label extend="$g7.S4.label" name="g7Slabel" /></p>

    `,
        });

        await test_labelIsName_preserved_shadowed_or_no_link(
            core,
            resolveComponentName,
        );
    });

    it("labels from labelIsName are preserved when copy unlinked", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
<graph name="g">
  <point name="P" labelIsName>(1,2)</point>
  <point name="Q" labelIsName>(3,4)</point>
  <point name="R" labelIsName>(5,6)</point>
  <point name="S" labelIsName>(7,8)</point>
</graph>

<graph name="g2" copy="$g"/>

<graph name="g3">
  <point copy="$P" />
  <point copy="$Q" name="Q3" />
  <point copy="$R" />
  <point name="S3" copy="$S" />
</graph>

<graph name="g4">
  <point copy="$P" labelIsName="false" />
  <point copy="$Q" name="Q4" labelIsName="false" />
  <point copy="$R" labelIsName="false" />
  <point name="S4" copy="$S" labelIsName="false" />
</graph>

<graph copy="$g2" name="g5" />
<graph copy="$g3" name="g6" />
<graph copy="$g4" name="g7" />

<p>P label: <label extend="$P.label" name="Plabel" /></p>
<p>Q label: <label extend="$Q.label" name="Qlabel" /></p>
<p>R label: <label extend="$R.label" name="Rlabel" /></p>
<p>S label: <label extend="$S.label" name="Slabel" /></p>
<p>g2.P label: <label extend="$g2.P.label" name="g2Plabel" /></p>
<p>g2.Q label: <label extend="$g2.Q.label" name="g2Qlabel" /></p>
<p>g2.R label: <label extend="$g2.R.label" name="g2Rlabel" /></p>
<p>g2.S label: <label extend="$g2.S.label" name="g2Slabel" /></p>
<p>Q3 label: <label extend="$Q3.label" name="Q3label" /></p>
<p>S3 label: <label extend="$S3.label" name="S3label" /></p>
<p>Q4 label: <label extend="$Q4.label" name="Q4label" /></p>
<p>S4 label: <label extend="$S4.label" name="S4label" /></p>
<p>g5.P label: <label extend="$g5.P.label" name="g5Plabel" /></p>
<p>g5.Q label: <label extend="$g5.Q.label" name="g5Qlabel" /></p>
<p>g5.R label: <label extend="$g5.R.label" name="g5Rlabel" /></p>
<p>g5.S label: <label extend="$g5.S.label" name="g5Slabel" /></p>
<p>g6.Q3 label: <label extend="$g6.Q3.label" name="g6Qlabel" /></p>
<p>g6.S3 label: <label extend="$g6.S3.label" name="g6Slabel" /></p>
<p>g7.Q4 label: <label extend="$g7.Q4.label" name="g7Qlabel" /></p>
<p>g7.S4 label: <label extend="$g7.S4.label" name="g7Slabel" /></p>

    `,
        });

        await test_labelIsName_preserved_shadowed_or_no_link(
            core,
            resolveComponentName,
        );
    });

    it("labelIsName in repeat", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <setup><sequence name="s" from="-2" to="2" /></setup>
  <graph name="g1">
    <repeat name="r" for="$s" itemName="v">
      <point name="P" labelIsName>($v,1)</point>
    </repeat>
  </graph>

  <graph name="g2">
    <repeat name="r" for="$s" itemName="v">
      <vector name="P" labelIsName>($v,1)</vector>
    </repeat>
  </graph>

  <graph name="g3">
    <repeat name="r" for="$s" itemName="v">
      <circle name="P" labelIsName center="($v,1)" />
    </repeat>
  </graph>

  <graph name="g4">
    <repeat name="r" for="$s" itemName="v">
      <line name="P" labelIsName through="($v,1)" />
    </repeat>
  </graph>

  <graph name="g5">
    <repeat name="r" for="$s" itemName="v">
      <triangle name="P" labelIsName vertices="($v,1)" />
    </repeat>
  </graph>

  <graph name="g6">
    <repeat name="r" for="$s" itemName="v">
      <lineSegment name="P" labelIsName endPoints="($v,1)" />
    </repeat>
  </graph>


  <graph extend="$g1" name="g7" />
  <graph extend="$g2" name="g8" />
  <graph extend="$g3" name="g9" />
  <graph extend="$g4" name="g10" />
  <graph extend="$g5" name="g11" />
  <graph extend="$g6" name="g12" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let g1ChildNames = stateVariables[
            resolveComponentName("g1")
        ].activeChildren.map((x) => x.componentIdx);
        let g2ChildNames = stateVariables[
            resolveComponentName("g2")
        ].activeChildren.map((x) => x.componentIdx);
        let g3ChildNames = stateVariables[
            resolveComponentName("g3")
        ].activeChildren.map((x) => x.componentIdx);
        let g4ChildNames = stateVariables[
            resolveComponentName("g4")
        ].activeChildren.map((x) => x.componentIdx);
        let g5ChildNames = stateVariables[
            resolveComponentName("g5")
        ].activeChildren.map((x) => x.componentIdx);
        let g6ChildNames = stateVariables[
            resolveComponentName("g6")
        ].activeChildren.map((x) => x.componentIdx);
        let g7ChildNames = stateVariables[
            resolveComponentName("g7")
        ].activeChildren.map((x) => x.componentIdx);
        let g8ChildNames = stateVariables[
            resolveComponentName("g8")
        ].activeChildren.map((x) => x.componentIdx);
        let g9ChildNames = stateVariables[
            resolveComponentName("g9")
        ].activeChildren.map((x) => x.componentIdx);
        let g10ChildNames = stateVariables[
            resolveComponentName("g10")
        ].activeChildren.map((x) => x.componentIdx);
        let g11ChildNames = stateVariables[
            resolveComponentName("g11")
        ].activeChildren.map((x) => x.componentIdx);
        let g12ChildNames = stateVariables[
            resolveComponentName("g12")
        ].activeChildren.map((x) => x.componentIdx);

        let gChildLabels = Array(5).fill("P");

        for (let [ind, name] of g1ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g2ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g3ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g4ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g5ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g6ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }

        for (let [ind, name] of g7ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g8ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g9ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g10ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g11ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
        for (let [ind, name] of g12ChildNames.entries()) {
            expect(stateVariables[name].stateValues.label).eq(
                gChildLabels[ind],
            );
        }
    });

    it("labelIsName converts case", async () => {
        let { core, resolveComponentName } = await createTestCore({
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

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("the_first_point")].stateValues
                .label,
        ).eq("the first point");
        expect(
            stateVariables[resolveComponentName("the-second-point")].stateValues
                .label,
        ).eq("the second point");
        expect(
            stateVariables[resolveComponentName("theThirdPoint")].stateValues
                .label,
        ).eq("the third point");
        expect(
            stateVariables[resolveComponentName("TheFourthPoint")].stateValues
                .label,
        ).eq("The Fourth Point");
        expect(
            stateVariables[resolveComponentName("the-FIFTH_Point")].stateValues
                .label,
        ).eq("the FIFTH Point");
        expect(
            stateVariables[resolveComponentName("the_SiXiTH-Point")].stateValues
                .label,
        ).eq("the SiXiTH Point");
    });

    it("labelIsName and copies", async () => {
        // Note: we add groups just so that we can reference the children
        // inside the DoenetML
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <graph>
    <point name="A" labelIsName />
  </graph>
  <graph>
    <point extend="$A" name="B" />
  </graph>
  <graph>
    <point extend="$A" name="C" labelIsName/>
  </graph>
  <graph name="g4">
    <group name="grp1">$A</group>
  </graph>

  <p><text extend="$A.label" name="lA" /></p>
  <p><label extend="$B.label" name="lB" /></p>
  <p><text extend="$C.label" name="lC" /></p>
  <p><label extend="$grp1[1].label" name="lp4" /></p>

  <p><textInput bindValueTo="$A.label" name="tiA" /></p>
  <p><textInput bindValueTo="$B.label" name="tiB" /></p>
  <p><textInput bindValueTo="$C.label" name="tiC" /></p>
  <p><textInput bindValueTo="$grp1[1].label" name="tip4" /></p>
    `,
        });

        async function check_items({ lA, lC }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const p4Name =
                stateVariables[resolveComponentName("g4")].activeChildren[0]
                    .componentIdx;

            expect(
                stateVariables[resolveComponentName("lA")].stateValues.value,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("lB")].stateValues.value,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("lC")].stateValues.value,
            ).eq(lC);
            expect(
                stateVariables[resolveComponentName("lp4")].stateValues.value,
            ).eq(lA);

            expect(
                stateVariables[resolveComponentName("A")].stateValues.label,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("A")].stateValues
                    .labelForGraph,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("B")].stateValues.label,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("B")].stateValues
                    .labelForGraph,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("C")].stateValues.label,
            ).eq(lC);
            expect(
                stateVariables[resolveComponentName("C")].stateValues
                    .labelForGraph,
            ).eq(lC);
            expect(stateVariables[p4Name].stateValues.label).eq(lA);
            expect(stateVariables[p4Name].stateValues.labelForGraph).eq(lA);
        }

        let lA = "A",
            lC = "C";
        await check_items({ lA, lC });

        lA = "F";
        await updateTextInputValue({
            text: lA,
            componentIdx: resolveComponentName("tiA"),
            core,
        });
        await check_items({ lA, lC });

        lA = "G";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiB"),
            text: lA,
            core,
        });
        await check_items({ lA, lC });

        lC = "I";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiC"),
            text: lC,
            core,
        });
        await check_items({ lA, lC });

        lA = "K";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tip4"),
            text: lA,
            core,
        });
        await check_items({ lA, lC });
    });

    it("copy and add labelIsName", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <graph>
    <point name="A" />
  </graph>
  <graph>
    <point extend="$A" name="B" labelIsName />
  </graph>

  <p><text extend="$A.label" name="lA" /></p>
  <p><label extend="$B.label" name="lB" /></p>

  <p><textInput bindValueTo="$A.label" name="tiA" /></p>
  <p><textInput bindValueTo="$B.label" name="tiB" /></p>
`,
        });

        async function check_items({ lA, lB }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[resolveComponentName("lA")].stateValues.value,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("lB")].stateValues.value,
            ).eq(lB);
            expect(
                stateVariables[resolveComponentName("A")].stateValues.label,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("A")].stateValues
                    .labelForGraph,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("B")].stateValues.label,
            ).eq(lB);
            expect(
                stateVariables[resolveComponentName("B")].stateValues
                    .labelForGraph,
            ).eq(lB);
        }

        let lA = "",
            lB = "B";
        await check_items({ lA, lB });

        lA = "F";
        await updateTextInputValue({
            text: lA,
            componentIdx: resolveComponentName("tiA"),
            core,
        });
        await check_items({ lA, lB });

        lB = "G";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiB"),
            text: lB,
            core,
        });
        await check_items({ lA, lB });
    });

    async function test_label_labelIsName_copies(
        doenetMLForA: string,
        useLabelCopies = false,
    ) {
        const labelD = useLabelCopies
            ? `<label extend="$Dl"/>`
            : `<label>D</label>`;
        const labelG = useLabelCopies
            ? `<label extend="$Gl"/>`
            : `<label>G</label>`;
        const labelJ = useLabelCopies
            ? `<label extend="$Jl"/>`
            : `<label>J</label>`;

        let labelDefinitions = "";
        if (useLabelCopies) {
            labelDefinitions = `
      <label name="Al0">A</label>
      <label name="Al" extend="$Al0" />
      <label name="Dl">D</label>
      <label name="Gl0">G</label>
      <label name="Gl" extend="$Gl0" />
      <label name="Jl0">J</label>
      <label name="Jl1" extend="$Jl0" />
      <label name="Jl" extend="$Jl1" />
            `;
        }

        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph>

        ${doenetMLForA}
        <point extend="$A" name="B" x="1" />
        <point extend="$A" labelIsName name="C" x="2" />
        <point extend="$A" name="D" x="3">${labelD}</point>

        <point extend="$B" name="E" x="1" y="1" />
        <point extend="$B" labelIsName name="F" x="2" y="1" />
        <point extend="$B" name="G" x="3" y="1">${labelG}</point>

        <point extend="$C" name="H" x="1" y="2" />
        <point extend="$C" labelIsName name="I" x="2" y="2" />
        <point extend="$C" name="J" x="3" y="2">${labelJ}</point>

        <point extend="$D" name="K" x="1" y="3" />
        <point extend="$D" labelIsName name="L" x="2" y="3" />
        <point extend="$D" name="M" x="3" y="3"><label>M</label></point>

    </graph>

    ${labelDefinitions}

    <p><text extend="$A.label" name="lA" /></p>
    <p><text extend="$B.label" name="lB" /></p>
    <p><text extend="$C.label" name="lC" /></p>
    <p><text extend="$D.label" name="lD" /></p>
    <p><text extend="$E.label" name="lE" /></p>
    <p><text extend="$F.label" name="lF" /></p>
    <p><text extend="$G.label" name="lG" /></p>
    <p><text extend="$H.label" name="lH" /></p>
    <p><text extend="$I.label" name="lI" /></p>
    <p><text extend="$J.label" name="lJ" /></p>
    <p><text extend="$K.label" name="lK" /></p>
    <p><text extend="$L.label" name="lL" /></p>
    <p><text extend="$M.label" name="lM" /></p>

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
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[resolveComponentName("lA")].stateValues.value,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("lB")].stateValues.value,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("lC")].stateValues.value,
            ).eq(lC);
            expect(
                stateVariables[resolveComponentName("lD")].stateValues.value,
            ).eq(lD);
            expect(
                stateVariables[resolveComponentName("lE")].stateValues.value,
            ).eq(lA);
            expect(
                stateVariables[resolveComponentName("lF")].stateValues.value,
            ).eq(lF);
            expect(
                stateVariables[resolveComponentName("lG")].stateValues.value,
            ).eq(lG);
            expect(
                stateVariables[resolveComponentName("lH")].stateValues.value,
            ).eq(lC);
            expect(
                stateVariables[resolveComponentName("lI")].stateValues.value,
            ).eq(lI);
            expect(
                stateVariables[resolveComponentName("lJ")].stateValues.value,
            ).eq(lJ);
            expect(
                stateVariables[resolveComponentName("lK")].stateValues.value,
            ).eq(lD);
            expect(
                stateVariables[resolveComponentName("lL")].stateValues.value,
            ).eq(lL);
            expect(
                stateVariables[resolveComponentName("lM")].stateValues.value,
            ).eq(lM);
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
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiA"),
            text: lA,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lA = "O";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiB"),
            text: lA,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lC = "P";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiC"),
            text: lC,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lD = "Q";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiD"),
            text: lD,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lA = "R";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiE"),
            text: lA,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lF = "S";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiF"),
            text: lF,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lG = "T";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiG"),
            text: lG,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lC = "U";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiH"),
            text: lC,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lI = "V";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiI"),
            text: lI,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lJ = "W";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiJ"),
            text: lJ,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lD = "X";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiK"),
            text: lD,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lL = "Y";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiL"),
            text: lL,
            core,
        });
        await check_items({ lA, lC, lD, lF, lG, lI, lJ, lL, lM });

        lM = "Z";
        await updateTextInputValue({
            componentIdx: resolveComponentName("tiM"),
            text: lM,
            core,
        });
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
        const doenetMLForA = `<point name="A"><label extend="$Al" /></point>`;

        await test_label_labelIsName_copies(doenetMLForA, true);
    });

    it("escape underscore and caret in labelForGraph except if math", async () => {
        let { core, resolveComponentName } = await createTestCore({
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

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("A")].stateValues.label).eq(
            "x_1",
        );
        expect(
            stateVariables[resolveComponentName("A")].stateValues.labelForGraph,
        ).eq("x&UnderBar;1");
        expect(stateVariables[resolveComponentName("B")].stateValues.label).eq(
            "\\(x_1\\)",
        );
        expect(
            stateVariables[resolveComponentName("B")].stateValues.labelForGraph,
        ).eq("\\(x_1\\)");
        expect(stateVariables[resolveComponentName("C")].stateValues.label).eq(
            "x^1",
        );
        expect(
            stateVariables[resolveComponentName("C")].stateValues.labelForGraph,
        ).eq("x&Hat;1");
        expect(stateVariables[resolveComponentName("D")].stateValues.label).eq(
            "\\(x^1\\)",
        );
        expect(
            stateVariables[resolveComponentName("D")].stateValues.labelForGraph,
        ).eq("\\(x^1\\)");
        expect(stateVariables[resolveComponentName("E")].stateValues.label).eq(
            "x^1 or \\(x^2\\) or x_3 or \\(x_4\\)",
        );
        expect(
            stateVariables[resolveComponentName("E")].stateValues.labelForGraph,
        ).eq("x&Hat;1 or \\(x^2\\) or x&UnderBar;3 or \\(x_4\\)");
        expect(stateVariables[resolveComponentName("F")].stateValues.label).eq(
            "x_a^b or \\(x_c^d\\)",
        );
        expect(
            stateVariables[resolveComponentName("F")].stateValues.labelForGraph,
        ).eq("x&UnderBar;a&Hat;b or \\(x_c^d\\)");
    });

    it("props do not shadow label", async () => {
        const { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph>
        <line name="line" slope="1"><label>L</label></line>
        <line name="l" labelIsName slope="-2" />
        <point name="P1" extend="$line.point1" />
        <point name="P2" extend="$line.point2" />
        <pointList extend="$l.points" name="Ps34" />
        <point name="P5" copy="$line.point1" />
        <point name="P6" copy="$line.point2" />
        <pointList copy="$l.points" name="Ps78" />
    </graph>`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("line")].stateValues.label,
        ).eq("L");
        expect(stateVariables[resolveComponentName("l")].stateValues.label).eq(
            "l",
        );
        expect(stateVariables[resolveComponentName("P1")].stateValues.label).eq(
            "",
        );
        expect(stateVariables[resolveComponentName("P2")].stateValues.label).eq(
            "",
        );
        expect(
            stateVariables[resolveComponentName("Ps34[1]")].stateValues.label,
        ).eq("");
        expect(
            stateVariables[resolveComponentName("Ps34[2]")].stateValues.label,
        ).eq("");
        expect(stateVariables[resolveComponentName("P5")].stateValues.label).eq(
            "",
        );
        expect(stateVariables[resolveComponentName("P6")].stateValues.label).eq(
            "",
        );
        expect(
            stateVariables[resolveComponentName("Ps78[1]")].stateValues.label,
        ).eq("");
        expect(
            stateVariables[resolveComponentName("Ps78[2]")].stateValues.label,
        ).eq("");
    });
});
