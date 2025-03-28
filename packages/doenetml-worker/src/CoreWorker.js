import Core from "./Core";
import { removeFunctionsMathExpressionClass } from "./utils/math";
import { createComponentInfoObjects } from "./utils/componentInfoObjects";
import {
    addDocumentIfItsMissing,
    expandDoenetMLsToFullSerializedComponents,
} from "./utils/expandDoenetML";
import { returnAllPossibleVariants } from "./utils/returnAllPossibleVariants";
import { countComponentTypes } from "@doenet/utils";

let core = null;

let queuedRequestActions = [];

let coreBaseArgs = {};
let initializeResult = {};

globalThis.onmessage = function (e) {
    if (e.data.messageType === "requestAction") {
        if (core?.initialized) {
            // setTimeout(() => core.requestAction(e.data.args), 1000)
            core.requestAction(e.data.args);
        } else {
            queuedRequestActions.push(e.data.args);
        }
    } else if (e.data.messageType === "visibilityChange") {
        core?.handleVisibilityChange(e.data.args);
    } else if (e.data.messageType === "navigatingToComponent") {
        core?.handleNavigatingToComponent(e.data.args);
    } else if (e.data.messageType === "initializeWorker") {
        initializeWorker(e.data.args);
    } else if (e.data.messageType === "createCore") {
        createCore(e.data.args);
    } else if (e.data.messageType === "returnAllPossibleVariants") {
        if (initializeResult.success) {
            returnAllPossibleVariants(
                coreBaseArgs.serializedDocument,
                coreBaseArgs.componentInfoObjects,
            ).then((allPossibleVariants) => {
                postMessage({
                    messageType: "allPossibleVariants",
                    args: { success: true, allPossibleVariants },
                });
            });
        } else {
            postMessage({
                messageType: "allPossibleVariants",
                args: { success: false },
            });
        }
    } else if (e.data.messageType === "returnComponentCounts") {
        if (initializeResult.success) {
            let documentChildren = coreBaseArgs.serializedDocument.children;
            let componentTypeCounts = countComponentTypes(documentChildren);

            postMessage({
                messageType: "componentTypeCounts",
                args: { success: true, componentTypeCounts },
            });
        } else {
            postMessage({
                messageType: "componentTypeCounts",
                args: { success: false },
            });
        }
    } else if (e.data.messageType === "returnAllStateVariables") {
        if (core) {
            console.log("all components");
            console.log(core._components);
            returnAllStateVariables(core).then((componentsObj) => {
                postMessage({
                    messageType: "returnAllStateVariables",
                    args: componentsObj,
                });
            });
        } else {
            console.log("Cannot return state variables as core is not created");
            postMessage({
                messageType: "returnAllStateVariables",
                args: {},
            });
        }
    } else if (e.data.messageType === "returnErrorWarnings") {
        if (core) {
            postMessage({
                messageType: "returnErrorWarnings",
                args: core.errorWarnings,
            });
        } else {
            console.log(
                "Cannot return errors and warnings as core is not created",
            );
            postMessage({
                messageType: "returnErrorWarnings",
                args: {},
            });
        }
    } else if (e.data.messageType === "terminate") {
        if (core) {
            core.terminate()
                .then(() => {
                    core = null;
                    postMessage({ messageType: "terminated" });
                })
                .catch(() => {
                    postMessage({ messageType: "terminateFailed" });
                });
        } else {
            postMessage({ messageType: "terminated" });
        }
    } else if (e.data.messageType === "submitAllAnswers") {
        core?.requestAction({
            componentName: core.documentName,
            actionName: "submitAllAnswers",
            args: e.data.args,
        });
    } else if (e.data.messageType === "saveImmediately") {
        core.saveImmediately();
    }
};

async function initializeWorker({
    doenetML,
    flags,
    activityId,
    docId,
    attemptNumber,
    requestedVariantIndex,
}) {
    let componentInfoObjects = createComponentInfoObjects(flags);

    let expandResult;
    try {
        expandResult = await expandDoenetMLsToFullSerializedComponents({
            doenetMLs: [doenetML],
            componentInfoObjects,
            flags,
        });
    } catch (e) {
        // throw e;
        initializeResult = { success: false, errMsg: e.message };
        postMessage({
            messageType: "initializeResult",
            args: {
                ...initializeResult,
                attemptNumber,
                requestedVariantIndex,
            },
        });
        postMessage({
            messageType: "allPossibleVariants",
            args: {
                success: false,
                attemptNumber,
                requestedVariantIndex,
            },
        });
    }

    coreBaseArgs = {
        doenetML,
        flags,
        activityId,
        docId,
        attemptNumber,
        requestedVariantIndex,
        serializedDocument: addDocumentIfItsMissing(
            expandResult.fullSerializedComponents[0],
        )[0],
        allDoenetMLs: expandResult.allDoenetMLs,
        preliminaryErrors: expandResult.errors,
        preliminaryWarnings: expandResult.warnings,
        componentInfoObjects,
    };

    initializeResult = { success: true };

    postMessage({
        messageType: "initializeResult",
        args: {
            ...initializeResult,
            attemptNumber,
            requestedVariantIndex,
        },
    });

    let allPossibleVariants = await returnAllPossibleVariants(
        coreBaseArgs.serializedDocument,
        coreBaseArgs.componentInfoObjects,
    );

    // count the number of occurrences of each component type from the document's immediate children
    const baseComponentCounts = coreBaseArgs.serializedDocument.children.reduce(
        (a, c) => {
            if (typeof c === "object") {
                a[c.componentType] = (a[c.componentType] ?? 0) + 1;
            }
            return a;
        },
        {},
    );

    postMessage({
        messageType: "documentStructure",
        args: {
            allPossibleVariants,
            baseComponentCounts,
        },
    });
}

async function createCore(args) {
    // Wait for `initializeWorker()` for up to around 2 seconds before failing.
    // (It is possible that its call to `expandDoenetMLsToFullSerializedComponents()`
    // could take time if it needs to retrieve external content.)
    const maxIters = 20;
    let i = 0;
    while (initializeResult.success === undefined) {
        const pause100 = function () {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 100);
            });
        };
        await pause100();
        i++;
        if (i > maxIters) {
            break;
        }
    }

    let coreArgs = Object.assign({}, coreBaseArgs);
    Object.assign(coreArgs, args);

    if (initializeResult.success) {
        core = new Core(coreArgs);

        try {
            await core.getInitializedPromise();
            // console.log('actions to process', queuedRequestActions)
            for (let action of queuedRequestActions) {
                core.requestAction(action);
            }
            queuedRequestActions = [];
        } catch (e) {
            // throw e;
            postMessage({
                messageType: "inErrorState",
                coreId: coreArgs.coreId,
                args: { errMsg: e.message },
            });
        }
    } else {
        let errMsg =
            initializeResult.success === false
                ? initializeResult.errMsg
                : "Internal error. Cannot create document. Core not initialized.";

        postMessage({
            messageType: "inErrorState",
            coreId: coreArgs.coreId,
            args: {
                errMsg,
            },
        });
    }
}

async function returnAllStateVariables(core) {
    if (!core.components) {
        return {};
    }

    let componentsObj = {};
    for (let componentName in core.components) {
        let component = core.components[componentName];
        let compObj = (componentsObj[componentName] = {
            componentName,
            componentType: component.componentType,
            stateValues: {},
        });
        for (let vName in component.state) {
            if (
                [
                    "replacements",
                    "recursiveReplacements",
                    "fullRecursiveReplacements",
                ].includes(vName) &&
                core.componentInfoObjects.isCompositeComponent({
                    componentType: component.componentType,
                }) &&
                !component.isExpanded
            ) {
                // don't expand a composite to get these replacement state variables
                continue;
            }
            compObj.stateValues[vName] = removeFunctionsMathExpressionClass(
                await component.state[vName].value,
            );
        }
        compObj.activeChildren = component.activeChildren.map((x) =>
            x.componentName
                ? {
                      componentName: x.componentName,
                      componentType: x.componentType,
                  }
                : x,
        );
        if (component.replacements) {
            compObj.replacements = component.replacements.map((x) =>
                x.componentName
                    ? {
                          componentName: x.componentName,
                          componentType: x.componentType,
                      }
                    : x,
            );
            if (component.replacementsToWithhold !== undefined) {
                compObj.replacementsToWithhold =
                    component.replacementsToWithhold;
            }
        }
        if (component.replacementOf) {
            compObj.replacementOf = component.replacementOf.componentName;
        }
        compObj.sharedParameters = removeFunctionsMathExpressionClass(
            component.sharedParameters,
        );
    }

    return componentsObj;
}
