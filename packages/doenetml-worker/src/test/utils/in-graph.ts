import { expect } from "vitest";
import { createTestCore, returnAllStateVariables } from "./test-core";
import Core from "../../Core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
} from "./actions";

export async function test_in_graph(
    doenetMLsnippet: string,
    moveCommand: ({
        name,
        x,
        y,
        core,
    }: {
        name: string;
        x: number;
        y: number;
        core: Core;
    }) => Promise<void>,
) {
    let doenetML = `
    ${doenetMLsnippet}
    
    <p name="pAnchor1">Anchor 1 coordinates: $item1.anchor</p>
    <p name="pAnchor2">Anchor 2 coordinates: $item2.anchor</p>
    <p name="pChangeAnchor1">Change anchor 1 coordinates: <mathInput name="anchorCoords1" prefill="(1,3)" /></p>
    <p name="pChangeAnchor2">Change anchor 2 coordinates: <mathInput name="anchorCoords2" bindValueTo="$item2.anchor" /></p>
    <p name="pPositionFromAnchor1">Position from anchor 1: $item1.positionFromAnchor</p>
    <p name="pPositionFromAnchor2">Position from anchor 2: $item2.positionFromAnchor</p>
    <p>Change position from anchor 1
    <choiceInput inline preselectChoice="1" name="positionFromAnchor1">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceInput>
    </p>
    <p>Change position from anchor 2
    <choiceInput inline name="positionFromAnchor2" bindValueTo="$item2.positionFromAnchor">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
      <choice>left</choice>
      <choice>right</choice>
      <choice>top</choice>
      <choice>bottom</choice>
      <choice>center</choice>
    </choiceInput>
    </p>
    <p name="pDraggable1">Draggable 1: $draggable1</p>
    <p name="pDraggable2">Draggable 2: $draggable2</p>
    <p>Change draggable 1 <booleanInput name="draggable1" prefill="true" /></p>
    <p>Change draggable 2 <booleanInput name="draggable2" bindValueTo="$item2.draggable" /></p>
    <p name="pDisabled1">Disabled 1: $disabled1</p>
    <p name="pDisabled2">Disabled 2: $disabled2</p>
    <p>Change disabled 1 <booleanInput name="disabled1" prefill="true" /></p>
    <p>Change disabled 2 <booleanInput name="disabled2" bindValueTo="$item2.disabled" /></p>
    <p name="pFixed1">Fixed 1: $fixed1</p>
    <p name="pFixed2">Fixed 2: $fixed2</p>
    <p>Change fixed 1 <booleanInput name="fixed1" prefill="false" /></p>
    <p>Change fixed 2 <booleanInput name="fixed2" bindValueTo="$item2.fixed" /></p>
    <p name="pFixLocation1">FixLocation 1: $fixLocation1</p>
    <p name="pFixLocation2">FixLocation 2: $fixLocation2</p>
    <p>Change fixLocation 1 <booleanInput name="fixLocation1" prefill="false" /></p>
    <p>Change fixLocation 2 <booleanInput name="fixLocation2" bindValueTo="$item2.fixLocation" /></p>

    `;

    let core = await createTestCore({ doenetML });

    let stateVariables = await returnAllStateVariables(core);
    expect(stateVariables["/pAnchor1"].stateValues.text).eq(
        "Anchor 1 coordinates: ( 1, 3 )",
    );
    expect(stateVariables["/pAnchor2"].stateValues.text).eq(
        "Anchor 2 coordinates: ( 0, 0 )",
    );
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
    expect(stateVariables["/pFixed1"].stateValues.text).eq("Fixed 1: false");
    expect(stateVariables["/pFixed2"].stateValues.text).eq("Fixed 2: false");
    expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
        "FixLocation 1: false",
    );
    expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
        "FixLocation 2: false",
    );

    // move items by dragging

    await moveCommand({ name: "/item1", x: -2, y: 3, core });
    await moveCommand({ name: "/item2", x: 4, y: -5, core });

    stateVariables = await returnAllStateVariables(core);
    expect(stateVariables["/pAnchor1"].stateValues.text).eq(
        "Anchor 1 coordinates: ( -2, 3 )",
    );
    expect(stateVariables["/pAnchor2"].stateValues.text).eq(
        "Anchor 2 coordinates: ( 4, -5 )",
    );

    // move items by entering coordinates

    await updateMathInputValue({
        latex: "(6,7)",
        name: "/anchorCoords1",
        core,
    });
    await updateMathInputValue({
        latex: "(8,9)",
        name: "/anchorCoords2",
        core,
    });

    stateVariables = await returnAllStateVariables(core);
    expect(stateVariables["/pAnchor1"].stateValues.text).eq(
        "Anchor 1 coordinates: ( 6, 7 )",
    );
    expect(stateVariables["/pAnchor2"].stateValues.text).eq(
        "Anchor 2 coordinates: ( 8, 9 )",
    );

    // change position from anchor
    await updateSelectedIndices({
        name: "/positionFromAnchor1",
        selectedIndices: [4],
        core,
    });
    await updateSelectedIndices({
        name: "/positionFromAnchor2",
        selectedIndices: [3],
        core,
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
        name: "/draggable1",
        core,
    });
    await updateBooleanInputValue({
        boolean: false,
        name: "/draggable2",
        core,
    });
    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pDraggable1"].stateValues.text).eq(
        "Draggable 1: false",
    );
    expect(stateVariables["/pDraggable2"].stateValues.text).eq(
        "Draggable 2: false",
    );

    // cannot move items by dragging
    await moveCommand({ name: "/item1", x: -10, y: -9, core });
    await moveCommand({ name: "/item2", x: -8, y: -7, core });
    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pAnchor1"].stateValues.text).eq(
        "Anchor 1 coordinates: ( 6, 7 )",
    );
    expect(stateVariables["/pAnchor2"].stateValues.text).eq(
        "Anchor 2 coordinates: ( 8, 9 )",
    );

    // make draggable again
    await updateBooleanInputValue({
        boolean: true,
        name: "/draggable1",
        core,
    });
    await updateBooleanInputValue({
        boolean: true,
        name: "/draggable2",
        core,
    });
    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pDraggable1"].stateValues.text).eq(
        "Draggable 1: true",
    );
    expect(stateVariables["/pDraggable2"].stateValues.text).eq(
        "Draggable 2: true",
    );

    await moveCommand({ name: "/item1", x: -10, y: -9, core });
    await moveCommand({ name: "/item2", x: -8, y: -7, core });
    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pAnchor1"].stateValues.text).eq(
        "Anchor 1 coordinates: ( -10, -9 )",
    );
    expect(stateVariables["/pAnchor2"].stateValues.text).eq(
        "Anchor 2 coordinates: ( -8, -7 )",
    );

    // fix location
    await updateBooleanInputValue({
        boolean: true,
        name: "/fixLocation1",
        core,
    });
    await updateBooleanInputValue({
        boolean: true,
        name: "/fixLocation2",
        core,
    });
    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pFixLocation1"].stateValues.text).eq(
        "FixLocation 1: true",
    );
    expect(stateVariables["/pFixLocation2"].stateValues.text).eq(
        "FixLocation 2: true",
    );

    // can change coordinates entering coordinates only for button 1
    await updateMathInputValue({
        latex: "(1,2)",
        name: "/anchorCoords1",
        core,
    });
    await updateMathInputValue({
        latex: "(3,4)",
        name: "/anchorCoords2",
        core,
    });

    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pAnchor1"].stateValues.text).eq(
        "Anchor 1 coordinates: ( 1, 2 )",
    );
    expect(stateVariables["/pAnchor2"].stateValues.text).eq(
        "Anchor 2 coordinates: ( -8, -7 )",
    );

    // cannot move items by dragging
    await moveCommand({ name: "/item1", x: 4, y: 6, core });
    await moveCommand({ name: "/item2", x: 7, y: 8, core });

    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pAnchor1"].stateValues.text).eq(
        "Anchor 1 coordinates: ( 1, 2 )",
    );
    expect(stateVariables["/pAnchor2"].stateValues.text).eq(
        "Anchor 2 coordinates: ( -8, -7 )",
    );

    // can change position from anchor only for button 1
    await updateSelectedIndices({
        name: "/positionFromAnchor1",
        selectedIndices: [7],
        core,
    });
    await updateSelectedIndices({
        name: "/positionFromAnchor2",
        selectedIndices: [8],
        core,
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
        name: "/disabled1",
        core,
    });
    await updateBooleanInputValue({
        boolean: true,
        name: "/disabled2",
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
        name: "/fixed1",
        core,
    });
    await updateBooleanInputValue({
        boolean: true,
        name: "/fixed2",
        core,
    });
    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pFixed1"].stateValues.text).eq("Fixed 1: true");
    expect(stateVariables["/pFixed2"].stateValues.text).eq("Fixed 2: true");

    // can change coordinates entering coordinates only for button 1
    await updateMathInputValue({
        latex: "(5,6)",
        name: "/anchorCoords1",
        core,
    });
    await updateMathInputValue({
        latex: "(7,8)",
        name: "/anchorCoords2",
        core,
    });

    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pAnchor1"].stateValues.text).eq(
        "Anchor 1 coordinates: ( 5, 6 )",
    );
    expect(stateVariables["/pAnchor2"].stateValues.text).eq(
        "Anchor 2 coordinates: ( -8, -7 )",
    );

    // can change position from anchor only for button 1
    await updateSelectedIndices({
        name: "/positionFromAnchor1",
        selectedIndices: [6],
        core,
    });
    await updateSelectedIndices({
        name: "/positionFromAnchor2",
        selectedIndices: [5],
        core,
    });
    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pPositionFromAnchor1"].stateValues.text).eq(
        "Position from anchor 1: right",
    );
    expect(stateVariables["/pPositionFromAnchor2"].stateValues.text).eq(
        "Position from anchor 2: lowerright",
    );

    // can change disabled attribute only for button 1

    await updateBooleanInputValue({
        boolean: true,
        name: "/disabled1",
        core,
    });
    await updateBooleanInputValue({
        boolean: false,
        name: "/disabled2",
        core,
    });
    stateVariables = await returnAllStateVariables(core);

    expect(stateVariables["/pDisabled1"].stateValues.text).eq(
        "Disabled 1: true",
    );
    expect(stateVariables["/pDisabled2"].stateValues.text).eq(
        "Disabled 2: true",
    );
}
