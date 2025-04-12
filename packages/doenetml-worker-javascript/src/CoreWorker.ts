import Core from "./Core";
import { removeFunctionsMathExpressionClass } from "./utils/math";
import { createComponentInfoObjects } from "./utils/componentInfoObjects";
import {
    addDocumentIfItsMissing,
    expandDoenetMLsToFullSerializedComponents,
} from "./utils/expandDoenetML";
import { returnAllPossibleVariants } from "./utils/returnAllPossibleVariants";
// import { dastToSerialized } from "./utils/dastToSerializedComponents";

export class PublicDoenetMLCore {
    core: Core | null = null;
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

    async createCoreGenerateDast(
        args: {
            coreId: string;
            userId?: string;
            cid: string | null;
            theme?: "dark" | "light";
            requestedVariant?: Record<string, any>;
            stateVariableChanges?: string;
            initializeCounters: Record<string, number>;
        },
        updateRenderersCallback: (arg: {
            updateInstructions: Record<string, any>[];
            actionId?: string;
            errorWarnings?: { errors: any[]; warnings: any[] };
            init?: boolean;
        }) => void,
        reportScoreAndStateCallback: (data: unknown) => void,
        requestAnimationFrame: (args: {
            action: { actionName: string; componentName?: string };
            actionArgs: Record<string, any>;
            delay?: number;
            animationId: string;
        }) => void,
        cancelAnimationFrame: (animationId: string) => void,
        copyToClipboard: (args: { text: string; actionId?: string }) => void,
    ) {
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

        let coreArgs = {
            ...this.coreBaseArgs!,
            ...args,
            updateRenderersCallback,
            reportScoreAndStateCallback,
            requestAnimationFrame,
            cancelAnimationFrame,
            copyToClipboard,
        };

        if (this.initializeResult?.success) {
            //@ts-ignore
            this.core = new Core(coreArgs);
            try {
                const result = await this.core.generateDast();
                return { success: true as const, ...result };
            } catch (e) {
                // throw e;
                return {
                    success: false as const,
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
                    ? this.initializeResult?.errMsg ?? "Error initializing core"
                    : "Internal error. Cannot create document. Core not initialized.";

            return {
                success: false as const,
                coreId: coreArgs.coreId,
                errMsg,
            };
        }
    }
    async requestAction(actionArgs: {
        actionName: string;
        componentName: string | undefined;
        args: Record<string, any>;
    }) {
        if (!this.core) {
            return {
                success: false,
                errMsg: "Cannot request action before core is created",
            };
        }
        return await this.core.requestAction(actionArgs);
    }

    async returnAllStateVariables(dontRemoveFunctionsMath = false) {
        if (!this.core?.components) {
            return {};
        }

        const componentsObj: Record<
            string,
            {
                componentName: string;
                componentType: string;
                stateValues: Record<string, any>;
                activeChildren: any[];
                replacements?: any[];
                replacementsToWithhold?: number;
                replacementOf?: string;
                sharedParameters: any;
            }
        > = {};
        const components = this.core.components as Record<string, any>;
        for (let componentName in components) {
            let component = components[componentName];
            componentsObj[componentName] = {
                componentName,
                componentType: component.componentType,
                stateValues: {},
                activeChildren: [],
                sharedParameters: null,
            };
            let compObj = componentsObj[componentName];
            for (let vName in component.state) {
                if (
                    [
                        "replacements",
                        "recursiveReplacements",
                        "fullRecursiveReplacements",
                    ].includes(vName) &&
                    this.core.componentInfoObjects.isCompositeComponent({
                        componentType: component.componentType,
                    }) &&
                    !component.isExpanded
                ) {
                    // don't expand a composite to get these replacement state variables
                    continue;
                }
                const value = await component.state[vName].value;
                compObj.stateValues[vName] = dontRemoveFunctionsMath
                    ? value
                    : removeFunctionsMathExpressionClass(value);
            }
            compObj.activeChildren = component.activeChildren.map((x: any) =>
                x.componentName
                    ? {
                          componentName: x.componentName,
                          componentType: x.componentType,
                      }
                    : x,
            );
            if (component.replacements) {
                compObj.replacements = component.replacements.map((x: any) =>
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

    async terminate() {
        if (this.core) {
            await this.core.terminate();
            this.core = null;
        }
    }
}

// globalThis.onmessage = function (e) {
//     if (e.data.messageType === "visibilityChange") {
//         core?.handleVisibilityChange(e.data.args);
//     } else if (e.data.messageType === "navigatingToComponent") {
//         core?.handleNavigatingToComponent(e.data.args);
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
