import Core from "../../Core";

export async function updateTextInputValue({
    text,
    componentName,
    core,
}: {
    text: string;
    componentName: string;
    core: Core;
}) {
    await core.requestAction({
        componentName,
        actionName: "updateImmediateValue",
        args: { text },
        event: null,
    });
    await core.requestAction({
        componentName,
        actionName: "updateValue",
        args: {},
        event: null,
    });
}

export async function updateTextInputImmediateValue({
    text,
    componentName,
    core,
}: {
    text: string;
    componentName: string;
    core: Core;
}) {
    await core.requestAction({
        componentName,
        actionName: "updateImmediateValue",
        args: { text },
        event: null,
    });
}

export async function updateTextInputValueToImmediateValue({
    componentName,
    core,
}: {
    componentName: string;
    core: Core;
}) {
    await core.requestAction({
        componentName,
        actionName: "updateValue",
        args: {},
        event: null,
    });
}

export async function updateMathInputValue({
    latex,
    componentName,
    core,
}: {
    latex: string;
    componentName: string;
    core: Core;
}) {
    await core.requestAction({
        componentName,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
        event: null,
    });
    await core.requestAction({
        componentName,
        actionName: "updateValue",
        args: {},
        event: null,
    });
}

export async function updateMathInputImmediateValue({
    latex,
    componentName,
    core,
}: {
    latex: string;
    componentName: string;
    core: Core;
}) {
    await core.requestAction({
        componentName,
        actionName: "updateRawValue",
        args: { rawRendererValue: latex },
        event: null,
    });
}

export async function updateMathInputValueToImmediateValue({
    componentName,
    core,
}: {
    componentName: string;
    core: Core;
}) {
    await core.requestAction({
        componentName,
        actionName: "updateValue",
        args: {},
        event: null,
    });
}

export async function updateBooleanInputValue({
    boolean,
    componentName,
    core,
}: {
    boolean: boolean;
    componentName: string;
    core: Core;
}) {
    await core.requestAction({
        componentName,
        actionName: "updateBoolean",
        args: { boolean },
        event: null,
    });
}

export async function updateMatrixInputValue({
    latex,
    componentName,
    rowInd,
    colInd,
    core,
    stateVariables,
}: {
    latex: string;
    componentName: string;
    rowInd: number;
    colInd: number;
    core: Core;
    stateVariables: any;
}) {
    let matrixInput = stateVariables[componentName];
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
        await core.requestAction({
            componentName: matrixInputCellName,
            actionName: "updateValue",
            args: {},
            event: null,
        });
    }
}
