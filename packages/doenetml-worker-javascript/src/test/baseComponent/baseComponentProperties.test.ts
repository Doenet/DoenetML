import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    updateBooleanInputValue,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Base component property tests", async () => {
    async function test_change_fixed_attribute(
        core: PublicDoenetMLCore,
        start_fixed = false,
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/pCoords"].stateValues.text).eq(
            "Coordinates of P: ( 0, 0 )",
        );

        if (start_fixed) {
            expect(stateVariables["/pIsFixed"].stateValues.text).eq(
                "Is fixed? true",
            );

            // point does not move
            await movePoint({ name: "/P", x: -10, y: -0, core });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables["/pCoords"].stateValues.text).eq(
                "Coordinates of P: ( 0, 0 )",
            );

            // make point not fixed
            await updateValue({ name: "/makeNotFixed", core });
            stateVariables = await core.returnAllStateVariables(false, true);
        }

        expect(stateVariables["/pIsFixed"].stateValues.text).eq(
            "Is fixed? false",
        );

        await movePoint({ name: "/P", x: 1, y: 2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pCoords"].stateValues.text).eq(
            "Coordinates of P: ( 1, 2 )",
        );

        // have point fixed
        await updateValue({ name: "/makeFixed", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pIsFixed"].stateValues.text).eq(
            "Is fixed? true",
        );

        // point does not move
        await movePoint({ name: "/P", x: 3, y: 4, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pCoords"].stateValues.text).eq(
            "Coordinates of P: ( 1, 2 )",
        );

        // have point not fixed
        await updateValue({ name: "/makeNotFixed", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pIsFixed"].stateValues.text).eq(
            "Is fixed? false",
        );

        // point does moves
        await movePoint({ name: "/P", x: 5, y: 6, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pCoords"].stateValues.text).eq(
            "Coordinates of P: ( 5, 6 )",
        );
    }
    it("change the fixed attribute even when fixed", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph><point name="P" /></graph>
  <p><updateValue type="boolean" target='P.fixed' newValue="true" name="makeFixed"><label>Make fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='P.fixed' newValue="false" name="makeNotFixed"><label>Make not fixed</label></updateValue></p>

  <p name="pIsFixed">Is fixed? $P.fixed</p>
  <p name="pCoords">Coordinates of P: $P</p>
  `,
        });

        await test_change_fixed_attribute(core);
    });

    it("change the fixed attribute even when fixed, have attribute", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph><point name="P" fixed="false" /></graph>
  <p><updateValue type="boolean" target='P.fixed' newValue="true" name="makeFixed"><label>Make fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='P.fixed' newValue="false" name="makeNotFixed"><label>Make not fixed</label></updateValue></p>

  <p name="pIsFixed">Is fixed? $P.fixed</p>
  <p name="pCoords">Coordinates of P: $P</p>
  `,
        });

        await test_change_fixed_attribute(core);
    });

    it("change the fixed attribute even when fixed, start out fixed", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph><point name="P" fixed /></graph>
  <p><updateValue type="boolean" target='P.fixed' newValue="true" name="makeFixed"><label>Make fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='P.fixed' newValue="false" name="makeNotFixed"><label>Make not fixed</label></updateValue></p>

  <p name="pIsFixed">Is fixed? $P.fixed</p>
  <p name="pCoords">Coordinates of P: $P</p>
  <p><booleaninput name="bi" /> <boolean name="b" copySource="bi" /></p>
  `,
        });

        await test_change_fixed_attribute(core, true);
    });

    it("can override fixed of parent", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g">
    <point name="A" labelIsName>(1,2)</point>
    <point name="B" fixed="false" labelIsName>(3,4)</point>
    <point name="C" fixed labelIsName>(5,6)</point>
  </graph>

  <p><updateValue type="boolean" target='A.fixed' newValue="true" name="makeAFixed"><label>Make A fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='A.fixed' newValue="false" name="makeANotFixed"><label>Make A not fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='B.fixed' newValue="true" name="makeBFixed"><label>Make B fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='B.fixed' newValue="false" name="makeBNotFixed"><label>Make B not fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='C.fixed' newValue="true" name="makeCFixed"><label>Make C fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='C.fixed' newValue="false" name="makeCNotFixed"><label>Make C not fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='g.fixed' newValue="true" name="makegFixed"><label>Make g fixed</label></updateValue></p>
  <p><updateValue type="boolean" target='g.fixed' newValue="false" name="makegNotFixed"><label>Make g not fixed</label></updateValue></p>

  <p name="pAIsFixed">Is A fixed? $A.fixed</p>
  <p name="pBIsFixed">Is B fixed? $B.fixed</p>
  <p name="pCIsFixed">Is C fixed? $C.fixed</p>
  <p name="pgIsFixed">Is g fixed? $g.fixed</p>
  <p name="pACoords">Coordinates of A: $A</p>
  <p name="pBCoords">Coordinates of B: $B</p>
  <p name="pCCoords">Coordinates of C: $C</p>
  `,
        });

        async function check_items({
            gFixed,
            AFixed,
            BFixed,
            CFixed,
            A,
            B,
            C,
        }: {
            gFixed: boolean;
            AFixed: boolean;
            BFixed: boolean;
            CFixed: boolean;
            A: number[];
            B: number[];
            C: number[];
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/pgIsFixed"].stateValues.text).eq(
                `Is g fixed? ${gFixed}`,
            );
            expect(stateVariables["/pAIsFixed"].stateValues.text).eq(
                `Is A fixed? ${AFixed}`,
            );
            expect(stateVariables["/pBIsFixed"].stateValues.text).eq(
                `Is B fixed? ${BFixed}`,
            );
            expect(stateVariables["/pCIsFixed"].stateValues.text).eq(
                `Is C fixed? ${CFixed}`,
            );

            expect(stateVariables["/pACoords"].stateValues.text).eq(
                `Coordinates of A: ( ${A.join(", ")} )`,
            );
            expect(stateVariables["/pBCoords"].stateValues.text).eq(
                `Coordinates of B: ( ${B.join(", ")} )`,
            );
            expect(stateVariables["/pCCoords"].stateValues.text).eq(
                `Coordinates of C: ( ${C.join(", ")} )`,
            );
        }

        let gFixed = false;
        let AFixed = false;
        let BFixed = false;
        let CFixed = true;

        let A = [1, 2];
        let B = [3, 4];
        let C = [5, 6];

        await check_items({ gFixed, AFixed, BFixed, CFixed, A, B, C });

        A = [-1, 2];
        B = [-3, -4];

        await movePoint({ name: "/A", x: A[0], y: A[1], core });
        await movePoint({ name: "/C", x: -5, y: -6, core });
        await movePoint({ name: "/B", x: B[0], y: B[1], core });
        await check_items({ gFixed, AFixed, BFixed, CFixed, A, B, C });

        // A changes fixed with g

        await updateValue({ name: "/makegFixed", core });
        gFixed = true;
        AFixed = true;
        await check_items({ gFixed, AFixed, BFixed, CFixed, A, B, C });

        B = [8, 7];

        await movePoint({ name: "/A", x: 10, y: 9, core });
        await movePoint({ name: "/C", x: 6, y: 5, core });
        await movePoint({ name: "/B", x: B[0], y: B[1], core });
        await check_items({ gFixed, AFixed, BFixed, CFixed, A, B, C });

        // change fixed of points

        await updateValue({ name: "/makeANotFixed", core });
        await updateValue({ name: "/makeBFixed", core });
        await updateValue({ name: "/makeCNotFixed", core });
        AFixed = false;
        BFixed = true;
        CFixed = false;
        await check_items({ gFixed, AFixed, BFixed, CFixed, A, B, C });

        A = [10, 9];
        C = [6, 5];
        await movePoint({ name: "/B", x: 12, y: 11, core });
        await movePoint({ name: "/A", x: A[0], y: A[1], core });
        await movePoint({ name: "/C", x: C[0], y: C[1], core });
        await check_items({ gFixed, AFixed, BFixed, CFixed, A, B, C });

        // changing fixed of g does not affect points

        await updateValue({ name: "/makegNotFixed", core });
        gFixed = false;
        await check_items({ gFixed, AFixed, BFixed, CFixed, A, B, C });

        await updateValue({ name: "/makegFixed", core });
        gFixed = true;
        await check_items({ gFixed, AFixed, BFixed, CFixed, A, B, C });
    });

    it("fixed propagates to shadow even if essential", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph size="small">
    <point name="A" />
    <point name="B" >(1,2)</point>
    <point name="C" fixed />
    <point name="D" fixed="false">(3,4)</point>
  </graph>
  
  <graph size="small">
    <point copySource="A" name="A2" />
    <point copySource="B" name="B2" />
    <point copySource="C" name="C2" />
    <point copySource="D" name="D2" />
  </graph>
  
  <graph size="small">
    <point copySource="A" name="A3" fixed="false" />
    <point copySource="B" name="B3" fixed="false" />
    <point copySource="C" name="C3" fixed="false" />
    <point copySource="D" name="D3" fixed="false" />
  </graph>
  
  <p><booleanInput bindValueTo="$A.fixed" name="toggleAFixed"><label>A fixed</label></booleanInput>
  </p>
  <p><booleanInput bindValueTo="$B.fixed" name="toggleBFixed"><label>B fixed</label></booleanInput>
  </p>
  <p><booleanInput bindValueTo="$C.fixed" name="toggleCFixed"><label>C fixed</label></booleanInput>
  </p>
  <p><booleanInput bindValueTo="$D.fixed" name="toggleDFixed"><label>D fixed</label></booleanInput>
  </p>

  <p name="pAIsFixed">Is A fixed? $A.fixed</p>
  <p name="pBIsFixed">Is B fixed? $B.fixed</p>
  <p name="pCIsFixed">Is C fixed? $C.fixed</p>
  <p name="pDIsFixed">Is D fixed? $D.fixed</p>
  <p name="pA2IsFixed">Is A2 fixed? $A2.fixed</p>
  <p name="pB2IsFixed">Is B2 fixed? $B2.fixed</p>
  <p name="pC2IsFixed">Is C2 fixed? $C2.fixed</p>
  <p name="pD2IsFixed">Is D2 fixed? $D2.fixed</p>
  <p name="pA3IsFixed">Is A3 fixed? $A3.fixed</p>
  <p name="pB3IsFixed">Is B3 fixed? $B3.fixed</p>
  <p name="pC3IsFixed">Is C3 fixed? $C3.fixed</p>
  <p name="pD3IsFixed">Is D3 fixed? $D3.fixed</p>
  <p name="pACoords">Coordinates of A: $A</p>
  <p name="pBCoords">Coordinates of B: $B</p>
  <p name="pCCoords">Coordinates of C: $C</p>
  <p name="pDCoords">Coordinates of D: $D</p>
  `,
        });

        async function check_items({
            AFixed,
            BFixed,
            CFixed,
            DFixed,
            A,
            B,
            C,
            D,
        }: {
            AFixed: boolean;
            BFixed: boolean;
            CFixed: boolean;
            DFixed: boolean;
            A: number[];
            B: number[];
            C: number[];
            D: number[];
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/pAIsFixed"].stateValues.text).eq(
                `Is A fixed? ${AFixed}`,
            );
            expect(stateVariables["/pBIsFixed"].stateValues.text).eq(
                `Is B fixed? ${BFixed}`,
            );
            expect(stateVariables["/pCIsFixed"].stateValues.text).eq(
                `Is C fixed? ${CFixed}`,
            );
            expect(stateVariables["/pDIsFixed"].stateValues.text).eq(
                `Is D fixed? ${DFixed}`,
            );
            expect(stateVariables["/pA2IsFixed"].stateValues.text).eq(
                `Is A2 fixed? ${AFixed}`,
            );
            expect(stateVariables["/pB2IsFixed"].stateValues.text).eq(
                `Is B2 fixed? ${BFixed}`,
            );
            expect(stateVariables["/pC2IsFixed"].stateValues.text).eq(
                `Is C2 fixed? ${CFixed}`,
            );
            expect(stateVariables["/pD2IsFixed"].stateValues.text).eq(
                `Is D2 fixed? ${DFixed}`,
            );
            expect(stateVariables["/pA3IsFixed"].stateValues.text).eq(
                `Is A3 fixed? false`,
            );
            expect(stateVariables["/pB3IsFixed"].stateValues.text).eq(
                `Is B3 fixed? false`,
            );
            expect(stateVariables["/pC3IsFixed"].stateValues.text).eq(
                `Is C3 fixed? false`,
            );
            expect(stateVariables["/pD3IsFixed"].stateValues.text).eq(
                `Is D3 fixed? false`,
            );

            expect(stateVariables["/pACoords"].stateValues.text).eq(
                `Coordinates of A: ( ${A.join(", ")} )`,
            );
            expect(stateVariables["/pBCoords"].stateValues.text).eq(
                `Coordinates of B: ( ${B.join(", ")} )`,
            );
            expect(stateVariables["/pCCoords"].stateValues.text).eq(
                `Coordinates of C: ( ${C.join(", ")} )`,
            );
            expect(stateVariables["/pDCoords"].stateValues.text).eq(
                `Coordinates of D: ( ${D.join(", ")} )`,
            );
        }

        let AFixed = false;
        let BFixed = false;
        let CFixed = true;
        let DFixed = false;

        let A = [0, 0];
        let B = [1, 2];
        let C = [0, 0];
        let D = [3, 4];

        await check_items({ AFixed, BFixed, CFixed, DFixed, A, B, C, D });

        // can change coords of all but fixed C2

        A = [-1, -2];
        B = [-3, -4];
        D = [-7, -8];

        await movePoint({ name: "/A2", x: A[0], y: A[1], core });
        await movePoint({ name: "/B2", x: B[0], y: B[1], core });
        await movePoint({ name: "/C2", x: -5, y: -6, core });
        await movePoint({ name: "/D2", x: D[0], y: D[1], core });
        await check_items({ AFixed, BFixed, CFixed, DFixed, A, B, C, D });

        // cannot change coords of C3 even though not fixed

        A = [10, 9];
        B = [8, 7];
        D = [4, 3];

        await movePoint({ name: "/A3", x: A[0], y: A[1], core });
        await movePoint({ name: "/B3", x: B[0], y: B[1], core });
        await movePoint({ name: "/C3", x: 6, y: 5, core });
        await movePoint({ name: "/D3", x: D[0], y: D[1], core });
        await check_items({ AFixed, BFixed, CFixed, DFixed, A, B, C, D });

        // toggle fixed

        AFixed = !AFixed;
        BFixed = !BFixed;
        CFixed = !CFixed;
        DFixed = !DFixed;
        await updateBooleanInputValue({
            boolean: AFixed,
            name: "/toggleAFixed",
            core,
        });
        await updateBooleanInputValue({
            boolean: BFixed,
            name: "/toggleBFixed",
            core,
        });
        await updateBooleanInputValue({
            boolean: CFixed,
            name: "/toggleCFixed",
            core,
        });
        await updateBooleanInputValue({
            boolean: DFixed,
            name: "/toggleDFixed",
            core,
        });

        // can only change coords of C2
        C = [9, 8];

        await movePoint({ name: "/A2", x: 15, y: 14, core });
        await movePoint({ name: "/B2", x: 13, y: 12, core });
        await movePoint({ name: "/D2", x: 11, y: 10, core });
        await movePoint({ name: "/C2", x: C[0], y: C[1], core });

        // can only change coords of C3, even though not fixed
        C = [7, -8];

        await movePoint({ name: "/A3", x: 1, y: -2, core });
        await movePoint({ name: "/B3", x: 3, y: -4, core });
        await movePoint({ name: "/D3", x: 5, y: -6, core });
        await movePoint({ name: "/C3", x: C[0], y: C[1], core });
    });

    it("change disabled, inverse direction", async () => {
        let core = await createTestCore({
            doenetML: `
  <textInput name="ti" prefill="a" />
  <p><updateValue type="boolean" target='ti.disabled' newValue="true" name="makeDisabled"><label>Make disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti.disabled' newValue="false" name="makeNotDisabled"><label>Make not disabled</label></updateValue></p>

  <p name="pIsDisabled">Is disabled? $ti.disabled</p>
  <p name="pText">Text: $ti</p>
  `,
        });

        async function check_items(disabled: boolean, text: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/pIsDisabled"].stateValues.text).eq(
                `Is disabled? ${disabled}`,
            );
            expect(stateVariables["/pText"].stateValues.text).eq(
                `Text: ${text}`,
            );
        }

        await check_items(false, "a");

        await updateTextInputValue({ text: "b", name: "/ti", core });
        await check_items(false, "b");

        // disable input
        await updateValue({ name: "/makeDisabled", core });
        await check_items(true, "b");

        // can't change input
        await updateTextInputValue({ text: "no", name: "/ti", core });
        await check_items(true, "b");

        // enable input
        await updateValue({ name: "/makeNotDisabled", core });
        await check_items(false, "b");

        // can change input again
        await updateTextInputValue({ text: "c", name: "/ti", core });
        await check_items(false, "c");
    });

    it("can override disabled of parent", async () => {
        let core = await createTestCore({
            doenetML: `
  <section name="s">
    <textInput name="ti1" prefill="a" />
    <textInput name="ti2" prefill="b" disabled />
    <textInput name="ti3" prefill="c" disabled="false" />
  </section>

  <p><updateValue type="boolean" target='ti1.disabled' newValue="true" name="makeTi1Disabled"><label>Make ti1 disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti1.disabled' newValue="false" name="makeTi1NotDisabled"><label>Make ti1 not disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti2.disabled' newValue="true" name="makeTi2Disabled"><label>Make ti2 disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti2.disabled' newValue="false" name="makeTi2NotDisabled"><label>Make ti2 not disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti3.disabled' newValue="true" name="makeTi3Disabled"><label>Make ti3 disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='ti3.disabled' newValue="false" name="makeTi3NotDisabled"><label>Make ti3 not disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='s.disabled' newValue="true" name="makeSDisabled"><label>Make s disabled</label></updateValue></p>
  <p><updateValue type="boolean" target='s.disabled' newValue="false" name="makeSNotDisabled"><label>Make s not disabled</label></updateValue></p>

  <p name="pti1IsDisabled">Is ti1 disabled? $ti1.disabled</p>
  <p name="pti2IsDisabled">Is ti2 disabled? $ti2.disabled</p>
  <p name="pti3IsDisabled">Is ti3 disabled? $ti3.disabled</p>
  <p name="psIsDisabled">Is s disabled? $s.disabled</p>
  <p name="pti1Text">Text: $ti1</p>
  <p name="pti2Text">Text: $ti2</p>
  <p name="pti3Text">Text: $ti3</p>
  `,
        });

        async function check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
            sDisabled,
            t1,
            t2,
            t3,
        }: {
            ti1Disabled: boolean;
            ti2Disabled: boolean;
            ti3Disabled: boolean;
            sDisabled: boolean;
            t1: string;
            t2: string;
            t3: string;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/pti1IsDisabled"].stateValues.text).eq(
                `Is ti1 disabled? ${ti1Disabled}`,
            );
            expect(stateVariables["/pti2IsDisabled"].stateValues.text).eq(
                `Is ti2 disabled? ${ti2Disabled}`,
            );
            expect(stateVariables["/pti3IsDisabled"].stateValues.text).eq(
                `Is ti3 disabled? ${ti3Disabled}`,
            );
            expect(stateVariables["/psIsDisabled"].stateValues.text).eq(
                `Is s disabled? ${sDisabled}`,
            );
            expect(stateVariables["/pti1Text"].stateValues.text).eq(
                `Text: ${t1}`,
            );
            expect(stateVariables["/pti2Text"].stateValues.text).eq(
                `Text: ${t2}`,
            );
            expect(stateVariables["/pti3Text"].stateValues.text).eq(
                `Text: ${t3}`,
            );
        }

        let ti1Disabled = false;
        let ti2Disabled = true;
        let ti3Disabled = false;
        let sDisabled = false;
        let t1 = "a";
        let t2 = "b";
        let t3 = "c";

        await check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
            sDisabled,
            t1,
            t2,
            t3,
        });

        t1 = "d";
        await updateTextInputValue({ text: t1, name: "/ti1", core });
        await check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
            sDisabled,
            t1,
            t2,
            t3,
        });
        t3 = "e";
        await updateTextInputValue({ text: t3, name: "/ti3", core });
        await check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
            sDisabled,
            t1,
            t2,
            t3,
        });

        // ti1 changed disabled with s
        sDisabled = true;
        ti1Disabled = true;
        await updateValue({ name: "/makeSDisabled", core });
        await check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
            sDisabled,
            t1,
            t2,
            t3,
        });

        t3 = "f";
        await updateTextInputValue({ text: t3, name: "/ti3", core });
        await check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
            sDisabled,
            t1,
            t2,
            t3,
        });

        // change disabled of inputs
        ti1Disabled = false;
        ti2Disabled = false;
        ti3Disabled = true;
        await updateValue({ name: "/makeTi1NotDisabled", core });
        await updateValue({ name: "/makeTi2NotDisabled", core });
        await updateValue({ name: "/makeTi3Disabled", core });
        await check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
            sDisabled,
            t1,
            t2,
            t3,
        });

        // changing fixed of s does not affect inputs
        sDisabled = false;
        await updateValue({ name: "/makeSNotDisabled", core });
        await check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
            sDisabled,
            t1,
            t2,
            t3,
        });

        sDisabled = true;
        await updateValue({ name: "/makeSDisabled", core });
        await check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
            sDisabled,
            t1,
            t2,
            t3,
        });
    });

    it("disabled propagates to shadow even if essential", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>
    <textInput name="ti1" prefill="a" />
    <textInput name="ti2" prefill="b" disabled />
    <textInput name="ti3" prefill="c" disabled="false" />
  </p>

  <p>
    <textInput name="ti12" copySource="ti1" />
    <textInput name="ti22" copySource="ti2" />
    <textInput name="ti32" copySource="ti3" />
  </p>

  <p>
    <textInput name="ti13" copySource="ti1" disabled="false" />
    <textInput name="ti23" copySource="ti2" disabled="false" />
    <textInput name="ti33" copySource="ti3" disabled="false" />
  </p>

  <p><booleanInput bindValueTo="$ti1.disabled" name="toggleTi1Disabled"><label>ti1 disabled</label></booleanInput>
  </p>
  <p><booleanInput bindValueTo="$ti2.disabled" name="toggleTi2Disabled"><label>ti2 disabled</label></booleanInput>
  </p>
  <p><booleanInput bindValueTo="$ti3.disabled" name="toggleTi3Disabled"><label>ti3 disabled</label></booleanInput>
  </p>

  <p name="pti1IsDisabled">Is ti1 disabled? $ti1.disabled</p>
  <p name="pti2IsDisabled">Is ti2 disabled? $ti2.disabled</p>
  <p name="pti3IsDisabled">Is ti3 disabled? $ti3.disabled</p>
  <p name="pti12IsDisabled">Is ti12 disabled? $ti12.disabled</p>
  <p name="pti22IsDisabled">Is ti22 disabled? $ti22.disabled</p>
  <p name="pti32IsDisabled">Is ti32 disabled? $ti32.disabled</p>
  <p name="pti13IsDisabled">Is ti13 disabled? $ti13.disabled</p>
  <p name="pti23IsDisabled">Is ti23 disabled? $ti23.disabled</p>
  <p name="pti33IsDisabled">Is ti33 disabled? $ti33.disabled</p>


  `,
        });

        async function check_items({
            ti1Disabled,
            ti2Disabled,
            ti3Disabled,
        }: {
            ti1Disabled: boolean;
            ti2Disabled: boolean;
            ti3Disabled: boolean;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/pti1IsDisabled"].stateValues.text).eq(
                `Is ti1 disabled? ${ti1Disabled}`,
            );
            expect(stateVariables["/pti2IsDisabled"].stateValues.text).eq(
                `Is ti2 disabled? ${ti2Disabled}`,
            );
            expect(stateVariables["/pti3IsDisabled"].stateValues.text).eq(
                `Is ti3 disabled? ${ti3Disabled}`,
            );
            expect(stateVariables["/pti12IsDisabled"].stateValues.text).eq(
                `Is ti12 disabled? ${ti1Disabled}`,
            );
            expect(stateVariables["/pti22IsDisabled"].stateValues.text).eq(
                `Is ti22 disabled? ${ti2Disabled}`,
            );
            expect(stateVariables["/pti32IsDisabled"].stateValues.text).eq(
                `Is ti32 disabled? ${ti3Disabled}`,
            );
            expect(stateVariables["/pti13IsDisabled"].stateValues.text).eq(
                `Is ti13 disabled? false`,
            );
            expect(stateVariables["/pti23IsDisabled"].stateValues.text).eq(
                `Is ti23 disabled? false`,
            );
            expect(stateVariables["/pti33IsDisabled"].stateValues.text).eq(
                `Is ti33 disabled? false`,
            );
        }

        let ti1Disabled = false;
        let ti2Disabled = true;
        let ti3Disabled = false;

        await check_items({ ti1Disabled, ti2Disabled, ti3Disabled });

        // toggle disabled
        ti1Disabled = true;
        ti2Disabled = false;
        ti3Disabled = true;
        await updateBooleanInputValue({
            boolean: ti1Disabled,
            name: "/toggleTi1Disabled",
            core,
        });
        await updateBooleanInputValue({
            boolean: ti2Disabled,
            name: "/toggleTi2Disabled",
            core,
        });
        await updateBooleanInputValue({
            boolean: ti3Disabled,
            name: "/toggleTi3Disabled",
            core,
        });
        await check_items({ ti1Disabled, ti2Disabled, ti3Disabled });
    });

    it("change hidden, inverse direction", async () => {
        let core = await createTestCore({
            doenetML: `
  <textInput name="ti" prefill="a" />
  <p><updateValue type="boolean" target='ti.hidden' newValue="true" name="makeHidden"><label>Make hidden</label></updateValue></p>
  <p><updateValue type="boolean" target='ti.hidden' newValue="false" name="makeNotHidden"><label>Make not hidden</label></updateValue></p>

  <p name="pIsHidden">Is hidden? $ti.hidden</p>
  <p name="pText">Text: $ti</p>
  `,
        });

        async function check_items(hidden: boolean, text: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/pIsHidden"].stateValues.text).eq(
                `Is hidden? ${hidden}`,
            );
            expect(stateVariables["/pText"].stateValues.text).eq(
                `Text: ${text}`,
            );
        }

        await check_items(false, "a");

        await updateTextInputValue({ text: "b", name: "/ti", core });
        await check_items(false, "b");

        // hide input
        await updateValue({ name: "/makeHidden", core });
        await check_items(true, "b");

        // show input
        await updateValue({ name: "/makeNotHidden", core });
        await check_items(false, "b");

        await updateTextInputValue({ text: "c", name: "/ti", core });
        await check_items(false, "c");
    });

    it("accept permid attribute", async () => {
        let core = await createTestCore({
            doenetML: `
    <section name="section1" permid="s">
      <title>Hello</title>
      <p name="p1" permid="p">Hi</p>
    </section>

    <p name="p2" permid="pids">Permids: $section1.permid, $p1.permid, $p2.permid</p>

  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq("Hi");
        expect(stateVariables["/p2"].stateValues.text).eq(
            "Permids: s, p, pids",
        );
    });
});
