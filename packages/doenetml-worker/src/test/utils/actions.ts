import Core from "../../Core";
import { returnAllStateVariables } from "./test-core";

export async function submitAnswer({
    name,
    core,
}: {
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "submitAnswer",
        args: {},
        event: null,
    });
}

export async function callAction({ name, core }: { name: string; core: Core }) {
    await core.requestAction({
        componentName: name,
        actionName: "callAction",
        args: {},
        event: null,
    });
}

export async function updateValue({
    name,
    core,
}: {
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateValue",
        args: {},
        event: null,
    });
}

export async function triggerActions({
    name,
    core,
}: {
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "triggerActions",
        args: {},
        event: null,
    });
}

export async function updateTextInputValue({
    text,
    name,
    core,
}: {
    text: string;
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateImmediateValue",
        args: { text },
        event: null,
    });
    await core.requestAction({
        componentName: name,
        actionName: "updateValue",
        args: {},
        event: null,
    });
}

export async function updateTextInputImmediateValue({
    text,
    name,
    core,
}: {
    text: string;
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateImmediateValue",
        args: { text },
        event: null,
    });
}

export async function updateTextInputValueToImmediateValue({
    name,
    core,
}: {
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateValue",
        args: {},
        event: null,
    });
}

export async function updateMathInputValue({
    latex,
    name,
    core,
}: {
    latex: string;
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
        event: null,
    });
    await core.requestAction({
        componentName: name,
        actionName: "updateValue",
        args: {},
        event: null,
    });
}

export async function updateMathInputImmediateValue({
    latex,
    name,
    core,
}: {
    latex: string;
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
        event: null,
    });
}

export async function updateMathInputValueToImmediateValue({
    name,
    core,
}: {
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateValue",
        args: {},
        event: null,
    });
}

export async function updateBooleanInputValue({
    boolean,
    name,
    core,
}: {
    boolean: boolean;
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateBoolean",
        args: { boolean },
        event: null,
    });
}

export async function updateMatrixInputValue({
    latex,
    name,
    rowInd,
    colInd,
    core,
    stateVariables,
}: {
    latex: string;
    name: string;
    rowInd: number;
    colInd: number;
    core: Core;
    stateVariables?: any;
}) {
    if (stateVariables === undefined) {
        stateVariables = await returnAllStateVariables(core);
    }

    let matrixInput = stateVariables[name];
    let numColumns = matrixInput.stateValues.numColumns;
    let childInd = colInd + numColumns * rowInd;

    let matrixInputCellName =
        matrixInput.activeChildren[childInd]?.componentName;

    if (matrixInputCellName) {
        await core.requestAction({
            componentName: matrixInputCellName,
            actionName: "updateRawValue",
            args: { rawRendererValue: latex },
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);

        await core.requestAction({
            componentName: matrixInputCellName,
            actionName: "updateValue",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
    }
}

export async function updateMatrixInputImmediateValue({
    latex,
    name,
    rowInd,
    colInd,
    core,
    stateVariables,
}: {
    latex: string;
    name: string;
    rowInd: number;
    colInd: number;
    core: Core;
    stateVariables?: any;
}) {
    if (stateVariables === undefined) {
        stateVariables = await returnAllStateVariables(core);
    }

    let matrixInput = stateVariables[name];
    let numColumns = matrixInput.stateValues.numColumns;
    let childInd = colInd + numColumns * rowInd;

    let matrixInputCellName =
        matrixInput.activeChildren[childInd]?.componentName;

    if (matrixInputCellName) {
        await core.requestAction({
            componentName: matrixInputCellName,
            actionName: "updateRawValue",
            args: { rawRendererValue: latex },
            event: null,
        });
    }
}

export async function updateMatrixInputValueToImmediateValue({
    name,
    rowInd,
    colInd,
    core,
    stateVariables,
}: {
    name: string;
    rowInd: number;
    colInd: number;
    core: Core;
    stateVariables?: any;
}) {
    if (stateVariables === undefined) {
        stateVariables = await returnAllStateVariables(core);
    }

    let matrixInput = stateVariables[name];
    let numColumns = matrixInput.stateValues.numColumns;
    let childInd = colInd + numColumns * rowInd;

    let matrixInputCellName =
        matrixInput.activeChildren[childInd]?.componentName;

    if (matrixInputCellName) {
        await core.requestAction({
            componentName: matrixInputCellName,
            actionName: "updateValue",
            args: {},
            event: null,
        });
    }
}

export async function updateMatrixInputNumRows({
    numRows,
    name,
    core,
}: {
    numRows: number;
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateNumRows",
        args: { numRows },
        event: null,
    });
}

export async function updateMatrixInputNumColumns({
    numColumns,
    name,
    core,
}: {
    numColumns: number;
    name: string;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateNumColumns",
        args: { numColumns },
        event: null,
    });
}

export async function focusPoint({ name, core }: { name: string; core: Core }) {
    await core.requestAction({
        componentName: name,
        actionName: "pointFocused",
        args: { name },
        event: null,
    });
}

export async function clickPoint({ name, core }: { name: string; core: Core }) {
    await core.requestAction({
        componentName: name,
        actionName: "pointClicked",
        args: { name },
        event: null,
    });
}

export async function movePoint({
    name,
    x,
    y,
    z,
    core,
}: {
    name: string;
    x: number;
    y: number;
    z?: number;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "movePoint",
        args: { x, y, z },
        event: null,
    });
}

export async function moveVector({
    name,
    headcoords,
    tailcoords,
    core,
}: {
    name: string;
    headcoords?: number[];
    tailcoords?: number[];
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveVector",
        args: { headcoords, tailcoords },
        event: null,
    });
}

export async function moveRay({
    name,
    endpointcoords,
    throughcoords,
    core,
}: {
    name: string;
    endpointcoords?: number[];
    throughcoords?: number[];
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveRay",
        args: { endpointcoords, throughcoords },
        event: null,
    });
}

export async function moveLine({
    name,
    point1coords,
    point2coords,
    core,
}: {
    name: string;
    point1coords: number[];
    point2coords: number[];
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveLine",
        args: { point1coords, point2coords },
        event: null,
    });
}

export async function moveLineSegment({
    name,
    point1coords,
    point2coords,
    core,
}: {
    name: string;
    point1coords?: number[];
    point2coords?: number[];
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveLineSegment",
        args: { point1coords, point2coords },
        event: null,
    });
}

export async function movePolyline({
    name,
    pointCoords,
    core,
}: {
    name: string;
    pointCoords: Record<number, number[]>;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "movePolyline",
        args: { pointCoords },
        event: null,
    });
}

export async function movePolygon({
    name,
    pointCoords,
    core,
}: {
    name: string;
    pointCoords: Record<number, number[]>;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "movePolygon",
        args: { pointCoords },
        event: null,
    });
}

export async function moveCircle({
    name,
    cx,
    cy,
    core,
}: {
    name: string;
    cx: number;
    cy: number;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveCircle",
        args: { center: [cx, cy] },
        event: null,
    });
}

export async function moveButton({
    name,
    x,
    y,
    core,
}: {
    name: string;
    x: number;
    y: number;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveButton",
        args: { x, y },
        event: null,
    });
}

export async function moveInput({
    name,
    x,
    y,
    core,
}: {
    name: string;
    x: number;
    y: number;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveInput",
        args: { x, y },
        event: null,
    });
}

export async function moveText({
    name,
    x,
    y,
    core,
}: {
    name: string;
    x: number;
    y: number;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveText",
        args: { x, y },
        event: null,
    });
}

export async function moveMath({
    name,
    x,
    y,
    core,
}: {
    name: string;
    x: number;
    y: number;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveMath",
        args: { x, y },
        event: null,
    });
}

export async function moveNumber({
    name,
    x,
    y,
    core,
}: {
    name: string;
    x: number;
    y: number;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveNumber",
        args: { x, y },
        event: null,
    });
}

export async function moveLabel({
    name,
    x,
    y,
    core,
}: {
    name: string;
    x: number;
    y: number;
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "moveLabel",
        args: { x, y },
        event: null,
    });
}

export async function updateSelectedIndices({
    name,
    selectedIndices,
    core,
}: {
    name: string;
    selectedIndices: number[];
    core: Core;
}) {
    await core.requestAction({
        componentName: name,
        actionName: "updateSelectedIndices",
        args: { selectedIndices },
        event: null,
    });
}
