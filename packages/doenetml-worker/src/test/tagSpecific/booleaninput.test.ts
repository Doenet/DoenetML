import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("BooleanInput tag tests", async () => {
    it("single boolean input", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="bi1" >
      <label>hello</label>
    </booleanInput>
    $bi1{name="v1"}
    $v1{name="v2"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/v1"].stateValues.value).eq(false);
        expect(stateVariables["/v2"].stateValues.value).eq(false);
        expect(stateVariables["/bi1"].stateValues.label).eq("hello");

        // check the box
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/bi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(true);
        expect(stateVariables["/v1"].stateValues.value).eq(true);
        expect(stateVariables["/v2"].stateValues.value).eq(true);

        // uncheck the box
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/bi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/v1"].stateValues.value).eq(false);
        expect(stateVariables["/v2"].stateValues.value).eq(false);
    });

    it("single boolean input, starts checked", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="bi1" prefill="true"/>
    $bi1{name="v1"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(true);
        expect(stateVariables["/v1"].stateValues.value).eq(true);

        // uncheck the box
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/bi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/v1"].stateValues.value).eq(false);

        // recheck the box
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/bi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(true);
        expect(stateVariables["/v1"].stateValues.value).eq(true);
    });

    it("copied boolean input", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pbi1"><booleanInput prefill="true" name="bi1" >
      <label>green</label>
    </booleanInput></p>
    <p name="pbi1a"><booleanInput copySource="bi1" name="bi1a" /></p>
    <p name="pv1">$bi1{name="v1"}</p>
    <p name="pbi2"><booleanInput name="bi2" >
      <label>red</label>
    </booleanInput></p>
    <p name="pv2">$bi2{name="v2"}</p>
    `,
        });

        async function check_items(bi1: boolean, bi2: boolean) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/bi1"].stateValues.value).eq(bi1);
            expect(stateVariables["/bi1a"].stateValues.value).eq(bi1);
            expect(stateVariables["/v1"].stateValues.value).eq(bi1);
            expect(stateVariables["/bi2"].stateValues.value).eq(bi2);
            expect(stateVariables["/v2"].stateValues.value).eq(bi2);

            expect(stateVariables["/bi1"].stateValues.label).eq("green");
            expect(stateVariables["/bi1a"].stateValues.label).eq("green");
            expect(stateVariables["/bi2"].stateValues.label).eq("red");

            expect(stateVariables["/pbi1"].stateValues.text).eq(bi1.toString());
            expect(stateVariables["/pbi1a"].stateValues.text).eq(
                bi1.toString(),
            );
            expect(stateVariables["/pv1"].stateValues.text).eq(bi1.toString());
            expect(stateVariables["/pbi2"].stateValues.text).eq(bi2.toString());
            expect(stateVariables["/pv2"].stateValues.text).eq(bi2.toString());

            expect(stateVariables["/bi1"].componentType).eq("booleanInput");
            expect(stateVariables["/bi1a"].componentType).eq("booleanInput");
            expect(stateVariables["/bi2"].componentType).eq("booleanInput");
            expect(stateVariables["/v1"].componentType).eq("boolean");
            expect(stateVariables["/v2"].componentType).eq("boolean");
        }

        let bi1 = true,
            bi2 = false;

        await check_items(bi1, bi2);

        // uncheck the first input
        bi1 = false;
        await updateBooleanInputValue({
            boolean: bi1,
            componentName: "/bi1",
            core,
        });
        await check_items(bi1, bi2);

        // check the second input
        bi1 = true;
        await updateBooleanInputValue({
            boolean: bi1,
            componentName: "/bi1a",
            core,
        });
        await check_items(bi1, bi2);

        // click the third input
        bi2 = true;
        await updateBooleanInputValue({
            boolean: bi2,
            componentName: "/bi2",
            core,
        });
        await check_items(bi1, bi2);
    });

    it("downstream from booleanInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" bindValueTo="$b1" /></p>
    <p>Copied boolean: $b1{name="b2"}</p>
    <p>Copied boolean input value: $bi1{name="b3"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(true);
        expect(stateVariables["/b1"].stateValues.value).eq(true);
        expect(stateVariables["/b2"].stateValues.value).eq(true);
        expect(stateVariables["/b3"].stateValues.value).eq(true);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/bi1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/b1"].stateValues.value).eq(false);
        expect(stateVariables["/b2"].stateValues.value).eq(false);
        expect(stateVariables["/b3"].stateValues.value).eq(false);
    });

    it("downstream from booleanInput, prefill ignored", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" prefill="false" bindValueTo="$b1" /></p>
    <p>Value: <boolean copySource="bi1" name="b2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(true);
        expect(stateVariables["/b1"].stateValues.value).eq(true);
        expect(stateVariables["/b2"].stateValues.value).eq(true);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/bi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/b1"].stateValues.value).eq(false);
        expect(stateVariables["/b2"].stateValues.value).eq(false);
    });

    it("downstream from booleanInput, values revert if not updatable", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">can't <text>update</text> <text>me</text></boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" bindValueTo="$b1" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/b1"].stateValues.value).eq(false);

        // attempt to change value, but it reverts
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/bi1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/b1"].stateValues.value).eq(false);
    });

    it("downstream from booleanInput via child", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1">$b1</booleanInput></p>
    <p>Copied boolean: $b1{name="b2"}</p>
    <p>Copied boolean input value: $bi1{name="b3"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(true);
        expect(stateVariables["/b1"].stateValues.value).eq(true);
        expect(stateVariables["/b2"].stateValues.value).eq(true);
        expect(stateVariables["/b3"].stateValues.value).eq(true);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/bi1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/b1"].stateValues.value).eq(false);
        expect(stateVariables["/b2"].stateValues.value).eq(false);
        expect(stateVariables["/b3"].stateValues.value).eq(false);
    });

    it("downstream from booleanInput via child, prefill ignored", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" prefill="false">$b1</booleanInput></p>
    <p>Value: <boolean copySource="bi1" name="b2" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(true);
        expect(stateVariables["/b1"].stateValues.value).eq(true);
        expect(stateVariables["/b2"].stateValues.value).eq(true);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/bi1",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/b1"].stateValues.value).eq(false);
        expect(stateVariables["/b2"].stateValues.value).eq(false);
    });

    it("downstream from booleanInput via child, values revert if not updatable", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">can't <text>update</text> <text>me</text></boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" >$b1</boolean></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/b1"].stateValues.value).eq(false);

        // attempt to change value, but it reverts
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/bi1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/b1"].stateValues.value).eq(false);
    });

    it("downstream from booleanInput via child, bindValueTo ignored", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Original boolean: <boolean name="b1">true</boolean></p>
    <p>Not bound: <boolean name="bIgnored">false</boolean></p>
    <p>booleanInput based on boolean: <booleanInput name="bi1" bindValueTo="$bIgnored">$b1</booleanInput></p>
    <p>Copied boolean: $b1{name="b2"}</p>
    <p>Copied boolean input value: $bi1{name="b3"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(true);
        expect(stateVariables["/b1"].stateValues.value).eq(true);
        expect(stateVariables["/b2"].stateValues.value).eq(true);
        expect(stateVariables["/b3"].stateValues.value).eq(true);
        expect(stateVariables["/bIgnored"].stateValues.value).eq(false);

        // change value
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/bi1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi1"].stateValues.value).eq(false);
        expect(stateVariables["/b1"].stateValues.value).eq(false);
        expect(stateVariables["/b2"].stateValues.value).eq(false);
        expect(stateVariables["/b3"].stateValues.value).eq(false);
        expect(stateVariables["/bIgnored"].stateValues.value).eq(false);
    });

    it("chain update off booleanInput", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name="bi" />
    <number name="n">1</number>
    <updateValue triggerWith="bi" target="n" newValue="$n+1" type="number" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(1);

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/bi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(2);

        await updateBooleanInputValue({
            boolean: false,
            componentName: "/bi",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(3);
    });

    it("boolean input with math in label", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><booleanInput name="bi" ><label name="l">It is <m>\\int_a^b f(x)\\,dx</m></label></booleanInput></p>

    <p><updateValue target="l.hide" newValue="!$l.hide" type="boolean" name="toggleLabel"><label>Toggle label</label></updateValue>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi"].stateValues.label).eq(
            "It is \\(\\int_a^b f(x)\\,dx\\)",
        );

        // hide label
        await core.requestAction({
            componentName: "/toggleLabel",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi"].stateValues.label).eq("");

        // show label again
        await core.requestAction({
            componentName: "/toggleLabel",
            actionName: "updateValue",
            args: {},
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/bi"].stateValues.label).eq(
            "It is \\(\\int_a^b f(x)\\,dx\\)",
        );
    });

    it("boolean input with labelIsName", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><booleanInput name="AnInput" labelIsName /></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/AnInput"].stateValues.label).eq("An Input");
    });

    it("boolean input in graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph >
        <booleanInput anchor="$anchorCoords1" name="booleanInput1" positionFromAnchor="$positionFromAnchor1" draggable="$draggable1" disabled="$disabled1" fixed="$fixed1" fixLocation="$fixLocation1"><label>input 1</label></booleanInput>
        <booleanInput name="booleanInput2"><label>input 2</label></booleanInput>
    </graph>
        
    <p name="pAnchor1">Anchor 1 coordinates: <point copySource="booleanInput1.anchor" name="booleanInput1anchor" /></p>
    <p name="pAnchor2">Anchor 2 coordinates: <point copySource="booleanInput2.anchor" name="booleanInput2anchor" /></p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathinput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathinput name="anchorCoords2" bindValueTo="$booleanInput2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $booleanInput1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $booleanInput2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceinput inline preselectChoice="1" name="positionFromAnchor1">
        <choice>upperRight</choice>
        <choice>upperLeft</choice>
        <choice>lowerRight</choice>
        <choice>lowerLeft</choice>
        <choice>left</choice>
        <choice>right</choice>
        <choice>top</choice>
        <choice>bottom</choice>
        <choice>center</choice>
    </choiceinput>
    </p>
    <p>Change position from anchor 2
    <choiceinput inline name="positionFromAnchor2" bindValueTo="$booleanInput2.positionFromAnchor">
        <choice>upperRight</choice>
        <choice>upperLeft</choice>
        <choice>lowerRight</choice>
        <choice>lowerLeft</choice>
        <choice>left</choice>
        <choice>right</choice>
        <choice>top</choice>
        <choice>bottom</choice>
        <choice>center</choice>
    </choiceinput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$booleanInput2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$booleanInput2.disabled" /></p>
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$booleanInput2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$booleanInput2.fixLocation" /></p>
        
            `,
        });

        // TODO: how to click on the checkboxes and test if they are disabled?

        let stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/booleanInput1anchor"].stateValues.latex,
            ),
        ).eq("(1,3)");
        expect(
            cleanLatex(
                stateVariables["/booleanInput2anchor"].stateValues.latex,
            ),
        ).eq("(0,0)");

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: upperright",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: center",
        );
        expect(
            stateVariables["/positionFromAnchor1"].stateValues.selectedIndices,
        ).eqls([1]);
        expect(
            stateVariables["/positionFromAnchor2"].stateValues.selectedIndices,
        ).eqls([9]);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: true",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: true",
        );
        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: true",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: false",
        );
        expect(stateVariables["/pFixed1"].stateValues.text).eq(
            "Fixed 1: false",
        );
        expect(stateVariables["/pFixed2"].stateValues.text).eq(
            "Fixed 2: false",
        );
        expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
            "FixLocation 1: false",
        );
        expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
            "FixLocation 2: false",
        );

        // move booleanInputs by dragging
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/booleanInput1",
            args: { x: -2, y: 3 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/booleanInput2",
            args: { x: 4, y: -5 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/booleanInput1anchor"].stateValues.latex,
            ),
        ).eq("(-2,3)");
        expect(
            cleanLatex(
                stateVariables["/booleanInput2anchor"].stateValues.latex,
            ),
        ).eq("(4,-5)");

        // move booleanInputs by entering coordinates

        await updateMathInputValue({
            latex: "(6,7)",
            componentName: "/anchorCoords1",
            core,
        });
        await updateMathInputValue({
            latex: "(8,9)",
            componentName: "/anchorCoords2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/booleanInput1anchor"].stateValues.latex,
            ),
        ).eq("(6,7)");
        expect(
            cleanLatex(
                stateVariables["/booleanInput2anchor"].stateValues.latex,
            ),
        ).eq("(8,9)");

        // change position from anchor
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor1",
            args: { selectedIndices: [4] },
            event: null,
        });
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor2",
            args: { selectedIndices: [3] },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: lowerleft",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // make not draggable
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: false",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: false",
        );

        // cannot move booleanInputs by dragging
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/booleanInput1",
            args: { x: -10, y: -9 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/booleanInput2",
            args: { x: -8, y: -7 },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/booleanInput1anchor"].stateValues.latex,
            ),
        ).eq("(6,7)");
        expect(
            cleanLatex(
                stateVariables["/booleanInput2anchor"].stateValues.latex,
            ),
        ).eq("(8,9)");

        // make draggable again
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/draggable1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/draggable2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDraggable1"].stateValues.text).eq(
            "Draggable 1: true",
        );
        expect(stateVariables["/pDraggable2"].stateValues.text).eq(
            "Draggable 2: true",
        );

        await core.requestAction({
            actionName: "moveInput",
            componentName: "/booleanInput1",
            args: { x: -10, y: -9 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/booleanInput2",
            args: { x: -8, y: -7 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/booleanInput1anchor"].stateValues.latex,
            ),
        ).eq("(-10,-9)");
        expect(
            cleanLatex(
                stateVariables["/booleanInput2anchor"].stateValues.latex,
            ),
        ).eq("(-8,-7)");

        // fix location
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixLocation1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixLocation2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
            "FixLocation 1: true",
        );
        expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
            "FixLocation 2: true",
        );

        // can change coordinates entering coordinates only for input 1
        await updateMathInputValue({
            latex: "(3,4)",
            componentName: "/anchorCoords2",
            core,
        });
        await updateMathInputValue({
            latex: "(1,2)",
            componentName: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/booleanInput1anchor"].stateValues.latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables["/booleanInput2anchor"].stateValues.latex,
            ),
        ).eq("(-8,-7)");

        // cannot move booleanInputs by dragging
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/booleanInput1",
            args: { x: 4, y: 6 },
            event: null,
        });
        await core.requestAction({
            actionName: "moveInput",
            componentName: "/booleanInput2",
            args: { x: 7, y: 8 },
            event: null,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/booleanInput1anchor"].stateValues.latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables["/booleanInput2anchor"].stateValues.latex,
            ),
        ).eq("(-8,-7)");

        // can change position from anchor only for input 1
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor2",
            args: { selectedIndices: [8] },
            event: null,
        });
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor1",
            args: { selectedIndices: [7] },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: top",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // can change disabled attribute
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/disabled2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: false",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: true",
        );

        // make completely fixed
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixed1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/fixed2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pFixed1"].stateValues.text).eq("Fixed 1: true");
        expect(stateVariables["/pFixed2"].stateValues.text).eq("Fixed 2: true");

        // can change coordinates entering coordinates only for input 1
        await updateMathInputValue({
            latex: "(7,8)",
            componentName: "/anchorCoords2",
            core,
        });
        await updateMathInputValue({
            latex: "(5,6)",
            componentName: "/anchorCoords1",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(
            cleanLatex(
                stateVariables["/booleanInput1anchor"].stateValues.latex,
            ),
        ).eq("(5,6)");
        expect(
            cleanLatex(
                stateVariables["/booleanInput2anchor"].stateValues.latex,
            ),
        ).eq("(-8,-7)");

        // can change position from anchor only for math 1
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor2",
            args: { selectedIndices: [5] },
            event: null,
        });
        await core.requestAction({
            actionName: "updateSelectedIndices",
            componentName: "/positionFromAnchor1",
            args: { selectedIndices: [6] },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
            "Position from anchor 1: right",
        );
        expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
            "Position from anchor 2: lowerright",
        );

        // can change disabled attribute only for input 1

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/disabled1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/disabled2",
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pDisabled1"].stateValues.text).eq(
            "Disabled 1: true",
        );
        expect(stateVariables["/pDisabled2"].stateValues.text).eq(
            "Disabled 2: true",
        );
    });

    it("valueChanged", async () => {
        let doenetML = `
    <p><booleanInput name="bi1" /> <boolean copySource="bi1" name="bi1a" /> <boolean copysource="bi1.valueChanged" name="bi1changed" /></p>
    <p><booleanInput name="bi2" prefill="true" /> <boolean copySource="bi2" name="bi2a" /> <boolean copysource="bi2.valueChanged" name="bi2changed" /></p>
    <p><booleanInput name="bi3" bindValueTo="$bi1" /> <boolean copySource="bi3" name="bi3a" /> <boolean copysource="bi3.valueChanged" name="bi3changed" /></p>
    <p><booleanInput name="bi4">$bi2</booleanInput> <boolean copySource="bi4" name="bi4a" /> <boolean copysource="bi4.valueChanged" name="bi4changed" /></p>

    `;

        async function check_items(
            [bi1, bi2]: [bi1: boolean, bi2: boolean],
            [bi1changed, bi2changed, bi3changed, bi4changed]: [
                bi1changed: boolean,
                bi2changed: boolean,
                bi3changed: boolean,
                bi4changed: boolean,
            ],
        ) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/bi1"].stateValues.value).eq(bi1);
            expect(stateVariables["/bi2"].stateValues.value).eq(bi2);
            expect(stateVariables["/bi3"].stateValues.value).eq(bi1);
            expect(stateVariables["/bi4"].stateValues.value).eq(bi2);

            expect(stateVariables["/bi1a"].stateValues.value).eq(bi1);
            expect(stateVariables["/bi2a"].stateValues.value).eq(bi2);
            expect(stateVariables["/bi3a"].stateValues.value).eq(bi1);
            expect(stateVariables["/bi4a"].stateValues.value).eq(bi2);

            expect(stateVariables["/bi1changed"].stateValues.value).eq(
                bi1changed,
            );
            expect(stateVariables["/bi2changed"].stateValues.value).eq(
                bi2changed,
            );
            expect(stateVariables["/bi3changed"].stateValues.value).eq(
                bi3changed,
            );
            expect(stateVariables["/bi4changed"].stateValues.value).eq(
                bi4changed,
            );
        }

        let core = await createTestCore({
            doenetML,
        });

        let stateVariables = await returnAllStateVariables(core);

        let bi1 = false,
            bi2 = true;
        let bi1changed = false,
            bi2changed = false,
            bi3changed = false,
            bi4changed = false;

        await check_items(
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking first marks only first as changed
        bi1 = true;
        bi1changed = true;
        await updateBooleanInputValue({
            boolean: bi1,
            componentName: "/bi1",
            core,
        });
        await check_items(
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking second marks only second as changed

        bi2 = false;
        bi2changed = true;
        await updateBooleanInputValue({
            boolean: bi2,
            componentName: "/bi2",
            core,
        });
        await check_items(
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking third and fourth

        bi1 = false;
        bi2 = true;
        bi3changed = true;
        bi4changed = true;
        await updateBooleanInputValue({
            boolean: bi1,
            componentName: "/bi3",
            core,
        });
        await updateBooleanInputValue({
            boolean: bi2,
            componentName: "/bi4",
            core,
        });
        await check_items(
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // reload
        core = await createTestCore({
            doenetML,
        });

        bi1 = false;
        bi2 = true;
        bi1changed = false;
        bi2changed = false;
        bi3changed = false;
        bi4changed = false;

        await check_items(
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking third marks first and third as changed

        bi1 = true;
        bi1changed = true;
        bi3changed = true;
        await updateBooleanInputValue({
            boolean: bi1,
            componentName: "/bi3",
            core,
        });
        await check_items(
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking fourth marks only second and fourth as changed

        bi2 = false;
        bi2changed = true;
        bi4changed = true;
        await updateBooleanInputValue({
            boolean: bi2,
            componentName: "/bi4",
            core,
        });
        await check_items(
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );

        // clicking first and second
        bi1 = false;
        bi2 = true;

        await updateBooleanInputValue({
            boolean: bi1,
            componentName: "/bi1",
            core,
        });
        await updateBooleanInputValue({
            boolean: bi2,
            componentName: "/bi2",
            core,
        });
        await check_items(
            [bi1, bi2],
            [bi1changed, bi2changed, bi3changed, bi4changed],
        );
    });
});
