import { PublicDoenetMLCore } from "../../CoreWorker";

export async function submitAnswer({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "submitAnswer",
        args: {},
    });
}

export async function callAction({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "callAction",
        args: {},
    });
}

export async function updateValue({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateValue",
        args: {},
    });
}

export async function triggerActions({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "triggerActions",
        args: {},
    });
}

export async function updateTextInputValue({
    text,
    name,
    core,
}: {
    text: string;
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateImmediateValue",
        args: { text },
    });
    await core.requestAction({
        componentIdx: name,
        actionName: "updateValue",
        args: {},
    });
}

export async function updateTextInputImmediateValue({
    text,
    name,
    core,
}: {
    text: string;
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateImmediateValue",
        args: { text },
    });
}

export async function updateTextInputValueToImmediateValue({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateValue",
        args: {},
    });
}

export async function updateMathInputValue({
    latex,
    name,
    core,
}: {
    latex: string;
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
    });
    await core.requestAction({
        componentIdx: name,
        actionName: "updateValue",
        args: {},
    });
}

export async function updateMathInputImmediateValue({
    latex,
    name,
    core,
}: {
    latex: string;
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
    });
}

export async function updateMathInputValueToImmediateValue({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateValue",
        args: {},
    });
}

export async function updateBooleanInputValue({
    boolean,
    name,
    core,
}: {
    boolean: boolean;
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateBoolean",
        args: { boolean },
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
    core: PublicDoenetMLCore;
    stateVariables?: any;
}) {
    if (stateVariables === undefined) {
        stateVariables = await core.returnAllStateVariables(false, true);
    }

    let matrixInput = stateVariables[name];
    let numColumns = matrixInput.stateValues.numColumns;
    let childInd = colInd + numColumns * rowInd;

    let matrixInputCellName =
        matrixInput.activeChildren[childInd]?.componentIdx;

    if (matrixInputCellName) {
        await core.requestAction({
            componentIdx: matrixInputCellName,
            actionName: "updateRawValue",
            args: { rawRendererValue: latex },
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        await core.requestAction({
            componentIdx: matrixInputCellName,
            actionName: "updateValue",
            args: {},
        });

        stateVariables = await core.returnAllStateVariables(false, true);
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
    core: PublicDoenetMLCore;
    stateVariables?: any;
}) {
    if (stateVariables === undefined) {
        stateVariables = await core.returnAllStateVariables(false, true);
    }

    let matrixInput = stateVariables[name];
    let numColumns = matrixInput.stateValues.numColumns;
    let childInd = colInd + numColumns * rowInd;

    let matrixInputCellName =
        matrixInput.activeChildren[childInd]?.componentIdx;

    if (matrixInputCellName) {
        await core.requestAction({
            componentIdx: matrixInputCellName,
            actionName: "updateRawValue",
            args: { rawRendererValue: latex },
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
    core: PublicDoenetMLCore;
    stateVariables?: any;
}) {
    if (stateVariables === undefined) {
        stateVariables = await core.returnAllStateVariables(false, true);
    }

    let matrixInput = stateVariables[name];
    let numColumns = matrixInput.stateValues.numColumns;
    let childInd = colInd + numColumns * rowInd;

    let matrixInputCellName =
        matrixInput.activeChildren[childInd]?.componentIdx;

    if (matrixInputCellName) {
        await core.requestAction({
            componentIdx: matrixInputCellName,
            actionName: "updateValue",
            args: {},
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateNumRows",
        args: { numRows },
    });
}

export async function updateMatrixInputNumColumns({
    numColumns,
    name,
    core,
}: {
    numColumns: number;
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateNumColumns",
        args: { numColumns },
    });
}

export async function focusPoint({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "pointFocused",
        args: { name },
    });
}

export async function clickPoint({
    name,
    core,
}: {
    name: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "pointClicked",
        args: { name },
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
    x?: number;
    y?: number;
    z?: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "movePoint",
        args: { x, y, z },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveVector",
        args: { headcoords, tailcoords },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveRay",
        args: { endpointcoords, throughcoords },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveLine",
        args: { point1coords, point2coords },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveLineSegment",
        args: { point1coords, point2coords },
    });
}

export async function movePolyline({
    name,
    pointCoords,
    core,
}: {
    name: string;
    pointCoords: Record<number, number[]>;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "movePolyline",
        args: { pointCoords },
    });
}

export async function movePolygon({
    name,
    pointCoords,
    core,
}: {
    name: string;
    pointCoords: Record<number, number[]>;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "movePolygon",
        args: { pointCoords },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveCircle",
        args: { center: [cx, cy] },
    });
}

export async function moveControlVector({
    name,
    controlVectorInds,
    controlVector,
    core,
}: {
    name: string;
    controlVectorInds: number[];
    controlVector: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveControlVector",
        args: { controlVectorInds, controlVector },
    });
}

export async function moveThroughPoint({
    name,
    throughPointInd,
    throughPoint,
    core,
}: {
    name: string;
    throughPointInd: number;
    throughPoint: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveThroughPoint",
        args: { throughPointInd, throughPoint },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveButton",
        args: { x, y },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveInput",
        args: { x, y },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveText",
        args: { x, y },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveMath",
        args: { x, y },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveNumber",
        args: { x, y },
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
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "moveLabel",
        args: { x, y },
    });
}

export async function updateSelectedIndices({
    name,
    selectedIndices,
    core,
}: {
    name: string;
    selectedIndices: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx: name,
        actionName: "updateSelectedIndices",
        args: { selectedIndices },
    });
}
