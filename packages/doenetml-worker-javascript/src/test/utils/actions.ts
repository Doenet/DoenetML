import { PublicDoenetMLCore } from "../../CoreWorker";

export async function submitAnswer({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "submitAnswer",
        args: {},
    });
}

export async function callAction({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "callAction",
        args: {},
    });
}

export async function updateValue({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateValue",
        args: {},
    });
}

export async function triggerActions({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "triggerActions",
        args: {},
    });
}

export async function updateTextInputValue({
    text,
    componentIdx,
    core,
}: {
    text: string;
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateImmediateValue",
        args: { text },
    });
    await core.requestAction({
        componentIdx,
        actionName: "updateValue",
        args: {},
    });
}

export async function updateTextInputImmediateValue({
    text,
    componentIdx,
    core,
}: {
    text: string;
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateImmediateValue",
        args: { text },
    });
}

export async function updateTextInputValueToImmediateValue({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateValue",
        args: {},
    });
}

export async function updateMathInputValue({
    latex,
    componentIdx,
    core,
}: {
    latex: string;
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
    });
    await core.requestAction({
        componentIdx,
        actionName: "updateValue",
        args: {},
    });
}

export async function updateMathInputImmediateValue({
    latex,
    componentIdx,
    core,
}: {
    latex: string;
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
    });
}

export async function updateMathInputValueToImmediateValue({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateValue",
        args: {},
    });
}

export async function updateBooleanInputValue({
    boolean,
    componentIdx,
    core,
}: {
    boolean: boolean;
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateBoolean",
        args: { boolean },
    });
}

export async function updateMatrixInputValue({
    latex,
    componentIdx,
    rowInd,
    colInd,
    core,
    stateVariables,
}: {
    latex: string;
    componentIdx: number;
    rowInd: number;
    colInd: number;
    core: PublicDoenetMLCore;
    stateVariables?: any;
}) {
    if (stateVariables === undefined) {
        stateVariables = await core.returnAllStateVariables(false, true);
    }

    let matrixInput = stateVariables[componentIdx];
    let numColumns = matrixInput.stateValues.numColumns;
    let childInd = colInd + numColumns * rowInd;

    let matrixInputCellIdx = matrixInput.activeChildren[childInd]?.componentIdx;

    if (matrixInputCellIdx) {
        await core.requestAction({
            componentIdx: matrixInputCellIdx,
            actionName: "updateRawValue",
            args: { rawRendererValue: latex },
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        await core.requestAction({
            componentIdx: matrixInputCellIdx,
            actionName: "updateValue",
            args: {},
        });

        stateVariables = await core.returnAllStateVariables(false, true);
    }
}

export async function updateMatrixInputImmediateValue({
    latex,
    componentIdx,
    rowInd,
    colInd,
    core,
    stateVariables,
}: {
    latex: string;
    componentIdx: number;
    rowInd: number;
    colInd: number;
    core: PublicDoenetMLCore;
    stateVariables?: any;
}) {
    if (stateVariables === undefined) {
        stateVariables = await core.returnAllStateVariables(false, true);
    }

    let matrixInput = stateVariables[componentIdx];
    let numColumns = matrixInput.stateValues.numColumns;
    let childInd = colInd + numColumns * rowInd;

    let matrixInputCellIdx = matrixInput.activeChildren[childInd]?.componentIdx;

    if (matrixInputCellIdx) {
        await core.requestAction({
            componentIdx: matrixInputCellIdx,
            actionName: "updateRawValue",
            args: { rawRendererValue: latex },
        });
    }
}

export async function updateMatrixInputValueToImmediateValue({
    componentIdx,
    rowInd,
    colInd,
    core,
    stateVariables,
}: {
    componentIdx: number;
    rowInd: number;
    colInd: number;
    core: PublicDoenetMLCore;
    stateVariables?: any;
}) {
    if (stateVariables === undefined) {
        stateVariables = await core.returnAllStateVariables(false, true);
    }

    let matrixInput = stateVariables[componentIdx];
    let numColumns = matrixInput.stateValues.numColumns;
    let childInd = colInd + numColumns * rowInd;

    let matrixInputCellIdx = matrixInput.activeChildren[childInd]?.componentIdx;

    if (matrixInputCellIdx) {
        await core.requestAction({
            componentIdx: matrixInputCellIdx,
            actionName: "updateValue",
            args: {},
        });
    }
}

export async function updateMatrixInputNumRows({
    numRows,
    componentIdx,
    core,
}: {
    numRows: number;
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateNumRows",
        args: { numRows },
    });
}

export async function updateMatrixInputNumColumns({
    numColumns,
    componentIdx,
    core,
}: {
    numColumns: number;
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateNumColumns",
        args: { numColumns },
    });
}

export async function focusPoint({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "pointFocused",
        args: { componentIdx },
    });
}

export async function clickPoint({
    componentIdx,
    core,
}: {
    componentIdx: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "pointClicked",
        args: { componentIdx },
    });
}

export async function movePoint({
    componentIdx,
    x,
    y,
    z,
    core,
}: {
    componentIdx: number;
    x?: number;
    y?: number;
    z?: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "movePoint",
        args: { x, y, z },
    });
}

export async function moveVector({
    componentIdx,
    headcoords,
    tailcoords,
    core,
}: {
    componentIdx: number;
    headcoords?: number[];
    tailcoords?: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveVector",
        args: { headcoords, tailcoords },
    });
}

export async function moveRay({
    componentIdx,
    endpointcoords,
    throughcoords,
    core,
}: {
    componentIdx: number;
    endpointcoords?: number[];
    throughcoords?: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveRay",
        args: { endpointcoords, throughcoords },
    });
}

export async function moveLine({
    componentIdx,
    point1coords,
    point2coords,
    core,
}: {
    componentIdx: number;
    point1coords: number[];
    point2coords: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveLine",
        args: { point1coords, point2coords },
    });
}

export async function moveLineSegment({
    componentIdx,
    point1coords,
    point2coords,
    core,
}: {
    componentIdx: number;
    point1coords?: number[];
    point2coords?: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveLineSegment",
        args: { point1coords, point2coords },
    });
}

export async function movePolyline({
    componentIdx,
    pointCoords,
    core,
}: {
    componentIdx: number;
    pointCoords: Record<number, number[]>;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "movePolyline",
        args: { pointCoords },
    });
}

export async function movePolygon({
    componentIdx,
    pointCoords,
    core,
}: {
    componentIdx: number;
    pointCoords: Record<number, number[]>;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "movePolygon",
        args: { pointCoords },
    });
}

export async function moveCircle({
    componentIdx,
    cx,
    cy,
    core,
}: {
    componentIdx: number;
    cx: number;
    cy: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveCircle",
        args: { center: [cx, cy] },
    });
}

export async function moveControlVector({
    componentIdx,
    controlVectorInds,
    controlVector,
    core,
}: {
    componentIdx: number;
    controlVectorInds: number[];
    controlVector: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveControlVector",
        args: { controlVectorInds, controlVector },
    });
}

export async function moveThroughPoint({
    componentIdx,
    throughPointInd,
    throughPoint,
    core,
}: {
    componentIdx: number;
    throughPointInd: number;
    throughPoint: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveThroughPoint",
        args: { throughPointInd, throughPoint },
    });
}

export async function moveButton({
    componentIdx,
    x,
    y,
    core,
}: {
    componentIdx: number;
    x: number;
    y: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveButton",
        args: { x, y },
    });
}

export async function moveInput({
    componentIdx,
    x,
    y,
    core,
}: {
    componentIdx: number;
    x: number;
    y: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveInput",
        args: { x, y },
    });
}

export async function moveText({
    componentIdx,
    x,
    y,
    core,
}: {
    componentIdx: number;
    x: number;
    y: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveText",
        args: { x, y },
    });
}

export async function moveMath({
    componentIdx,
    x,
    y,
    core,
}: {
    componentIdx: number;
    x: number;
    y: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveMath",
        args: { x, y },
    });
}

export async function moveNumber({
    componentIdx,
    x,
    y,
    core,
}: {
    componentIdx: number;
    x: number;
    y: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveNumber",
        args: { x, y },
    });
}

export async function moveLabel({
    componentIdx,
    x,
    y,
    core,
}: {
    componentIdx: number;
    x: number;
    y: number;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "moveLabel",
        args: { x, y },
    });
}

export async function updateSelectedIndices({
    componentIdx,
    selectedIndices,
    core,
}: {
    componentIdx: number;
    selectedIndices: number[];
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "updateSelectedIndices",
        args: { selectedIndices },
    });
}
