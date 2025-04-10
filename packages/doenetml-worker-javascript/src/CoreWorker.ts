import Core from "./Core";
import { removeFunctionsMathExpressionClass } from "./utils/math";
import { createComponentInfoObjects } from "./utils/componentInfoObjects";
import {
    addDocumentIfItsMissing,
    expandDoenetMLsToFullSerializedComponents,
} from "./utils/expandDoenetML";
import { returnAllPossibleVariants } from "./utils/returnAllPossibleVariants";
// import { countComponentTypes } from "@doenet/utils";
// import { dastToSerialized } from "./utils/dastToSerializedComponents";

export class PublicDoenetMLCore {
    core?: Core;
    queuedRequestActions = [];
    coreBaseArgs?: {
        doenetML: string;
        flags: Record<string, unknown>;
        activityId: string;
        docId: string;
        requestedVariantIndex: number;
        serializedDocument: any;
        allDoenetMLs: any;
        preliminaryErrors: any;
        preliminaryWarnings: any;
        componentInfoObjects: any;
    };
    initializeResult?: { success: boolean; errMsg?: string };
    doenetML = "";
    flags: Record<string, unknown> = {};

    setSource(doenetML: string) {
        this.doenetML = doenetML;
    }

    setFlags(flags: Record<string, unknown>) {
        this.flags = flags;
    }

    async initializeWorker({
        activityId,
        docId,
        requestedVariantIndex,
    }: {
        activityId: string;
        docId: string;
        requestedVariantIndex: number;
    }) {
        let componentInfoObjects = createComponentInfoObjects();

        let expandResult;
        try {
            expandResult = await expandDoenetMLsToFullSerializedComponents({
                doenetMLs: [this.doenetML],
                componentInfoObjects,
            });
        } catch (e) {
            // throw e;
            const errMsg =
                typeof e === "object" &&
                e &&
                "message" in e &&
                typeof e.message === "string"
                    ? e.message
                    : "";
            this.initializeResult = {
                success: false,
                errMsg,
            };

            return { success: false as const, errMsg };
        }

        this.coreBaseArgs = {
            doenetML: this.doenetML,
            flags: this.flags,
            activityId,
            docId,
            requestedVariantIndex,
            serializedDocument: addDocumentIfItsMissing(
                expandResult.fullSerializedComponents[0],
            )[0],
            allDoenetMLs: expandResult.allDoenetMLs,
            preliminaryErrors: expandResult.errors,
            preliminaryWarnings: expandResult.warnings,
            componentInfoObjects,
        };

        console.log({
            serializedDocument: JSON.parse(
                JSON.stringify(this.coreBaseArgs.serializedDocument),
            ),
        });

        // const serializedDocument2 = dastToSerialized(normalizedDast);
        // console.log({ serializedDocument2 });

        this.initializeResult = { success: true as const };

        let allPossibleVariants = await returnAllPossibleVariants(
            this.coreBaseArgs.serializedDocument,
            this.coreBaseArgs.componentInfoObjects,
        );

        // count the number of occurrences of each component type from the document's immediate children
        const baseComponentCounts =
            this.coreBaseArgs.serializedDocument.children.reduce(
                (a: any, c: any) => {
                    if (typeof c === "object") {
                        a[c.componentType] = (a[c.componentType] ?? 0) + 1;
                    }
                    return a;
                },
                {},
            );

        return {
            success: true as const,
            allPossibleVariants,
            baseComponentCounts,
        };
    }

    async createCore(args: {
        coreId: string;
        userId?: string;
        cid: string | null;
        theme?: "dark" | "light";
        requestedVariant?: Record<string, any>;
        stateVariableChanges?: string;
        initializeCounters: Record<string, number>;
    }) {
        // Wait for `initializeWorker()` for up to around 2 seconds before failing.
        // (It is possible that its call to `expandDoenetMLsToFullSerializedComponents()`
        // could take time if it needs to retrieve external content.)
        const maxIters = 20;
        let i = 0;
        while (this.initializeResult?.success === undefined) {
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

        let coreArgs = { ...this.coreBaseArgs!, ...args };

        if (this.initializeResult?.success) {
            //@ts-ignore
            this.core = new Core(coreArgs);

            try {
                await this.core.getInitializedPromise();
                // console.log('actions to process', this.queuedRequestActions)
                for (let action of this.queuedRequestActions) {
                    this.core.requestAction(action);
                }
                this.queuedRequestActions = [];
            } catch (e) {
                // throw e;
                return {
                    inErrorState: true,
                    coreId: coreArgs.coreId,
                    errMsg:
                        typeof e === "object" &&
                        e &&
                        "message" in e &&
                        typeof e.message === "string"
                            ? e.message
                            : "",
                };
            }
        } else {
            let errMsg =
                this.initializeResult?.success === false
                    ? this.initializeResult?.errMsg
                    : "Internal error. Cannot create document. Core not initialized.";

            return {
                inErrorState: true,
                coreId: coreArgs.coreId,
                errMsg,
            };
        }
    }

    // async returnAllStateVariables(core) {
    //     if (!core.components) {
    //         return {};
    //     }

    //     let componentsObj = {};
    //     for (let componentName in core.components) {
    //         let component = core.components[componentName];
    //         let compObj = (componentsObj[componentName] = {
    //             componentName,
    //             componentType: component.componentType,
    //             stateValues: {},
    //         });
    //         for (let vName in component.state) {
    //             if (
    //                 [
    //                     "replacements",
    //                     "recursiveReplacements",
    //                     "fullRecursiveReplacements",
    //                 ].includes(vName) &&
    //                 core.componentInfoObjects.isCompositeComponent({
    //                     componentType: component.componentType,
    //                 }) &&
    //                 !component.isExpanded
    //             ) {
    //                 // don't expand a composite to get these replacement state variables
    //                 continue;
    //             }
    //             compObj.stateValues[vName] = removeFunctionsMathExpressionClass(
    //                 await component.state[vName].value,
    //             );
    //         }
    //         compObj.activeChildren = component.activeChildren.map((x) =>
    //             x.componentName
    //                 ? {
    //                       componentName: x.componentName,
    //                       componentType: x.componentType,
    //                   }
    //                 : x,
    //         );
    //         if (component.replacements) {
    //             compObj.replacements = component.replacements.map((x) =>
    //                 x.componentName
    //                     ? {
    //                           componentName: x.componentName,
    //                           componentType: x.componentType,
    //                       }
    //                     : x,
    //             );
    //             if (component.replacementsToWithhold !== undefined) {
    //                 compObj.replacementsToWithhold =
    //                     component.replacementsToWithhold;
    //             }
    //         }
    //         if (component.replacementOf) {
    //             compObj.replacementOf = component.replacementOf.componentName;
    //         }
    //         compObj.sharedParameters = removeFunctionsMathExpressionClass(
    //             component.sharedParameters,
    //         );
    //     }

    //     return componentsObj;
    // }
}

// globalThis.onmessage = function (e) {
//     if (e.data.messageType === "requestAction") {
//         if (core?.initialized) {
//             // setTimeout(() => core.requestAction(e.data.args), 1000)
//             core.requestAction(e.data.args);
//         } else {
//             this.queuedRequestActions.push(e.data.args);
//         }
//     } else if (e.data.messageType === "visibilityChange") {
//         core?.handleVisibilityChange(e.data.args);
//     } else if (e.data.messageType === "navigatingToComponent") {
//         core?.handleNavigatingToComponent(e.data.args);
//     } else if (e.data.messageType === "initializeWorker") {
//         initializeWorker(e.data.args);
//     } else if (e.data.messageType === "createCore") {
//         createCore(e.data.args);
//     } else if (e.data.messageType === "returnAllPossibleVariants") {
//         if (this.initializeResult.success) {
//             returnAllPossibleVariants(
//                 this.coreBaseArgs.serializedDocument,
//                 this.coreBaseArgs.componentInfoObjects,
//             ).then((allPossibleVariants) => {
//                 postMessage({
//                     messageType: "allPossibleVariants",
//                     args: { success: true, allPossibleVariants },
//                 });
//             });
//         } else {
//             postMessage({
//                 messageType: "allPossibleVariants",
//                 args: { success: false },
//             });
//         }
//     } else if (e.data.messageType === "returnComponentCounts") {
//         if (this.initializeResult.success) {
//             let documentChildren =
//                 this.coreBaseArgs.serializedDocument.children;
//             let componentTypeCounts = countComponentTypes(documentChildren);

//             postMessage({
//                 messageType: "componentTypeCounts",
//                 args: { success: true, componentTypeCounts },
//             });
//         } else {
//             postMessage({
//                 messageType: "componentTypeCounts",
//                 args: { success: false },
//             });
//         }
//     } else if (e.data.messageType === "returnAllStateVariables") {
//         if (core) {
//             console.log("all components");
//             console.log(core._components);
//             returnAllStateVariables(core).then((componentsObj) => {
//                 postMessage({
//                     messageType: "returnAllStateVariables",
//                     args: componentsObj,
//                 });
//             });
//         } else {
//             console.log("Cannot return state variables as core is not created");
//             postMessage({
//                 messageType: "returnAllStateVariables",
//                 args: {},
//             });
//         }
//     } else if (e.data.messageType === "returnErrorWarnings") {
//         if (core) {
//             postMessage({
//                 messageType: "returnErrorWarnings",
//                 args: core.errorWarnings,
//             });
//         } else {
//             console.log(
//                 "Cannot return errors and warnings as core is not created",
//             );
//             postMessage({
//                 messageType: "returnErrorWarnings",
//                 args: {},
//             });
//         }
//     } else if (e.data.messageType === "terminate") {
//         if (core) {
//             core.terminate()
//                 .then(() => {
//                     core = null;
//                     postMessage({ messageType: "terminated" });
//                 })
//                 .catch(() => {
//                     postMessage({ messageType: "terminateFailed" });
//                 });
//         } else {
//             postMessage({ messageType: "terminated" });
//         }
//     } else if (e.data.messageType === "submitAllAnswers") {
//         core?.requestAction({
//             componentName: core.documentName,
//             actionName: "submitAllAnswers",
//             args: e.data.args,
//         });
//     } else if (e.data.messageType === "saveImmediately") {
//         core.saveImmediately();
//     }
// };
