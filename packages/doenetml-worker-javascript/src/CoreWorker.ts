import Core from "./Core";
import { removeFunctionsMathExpressionClass } from "./utils/math";
import { createComponentInfoObjects } from "./utils/componentInfoObjects";
import {
    addDocumentIfItsMissing,
    expandDoenetMLsToFullSerializedComponents,
} from "./utils/expandDoenetML";
import { returnAllPossibleVariants } from "./utils/returnAllPossibleVariants";

// Type signatures for callbacks
export type UpdateRenderersCallback = (arg: {
    updateInstructions: Record<string, any>[];
    actionId?: string;
    errorWarnings?: { errors: any[]; warnings: any[] };
    init?: boolean;
}) => void;
export type ReportScoreAndStateCallback = (data: unknown) => void;
export type RequestAnimationFrame = (args: {
    action: { actionName: string; componentName?: string };
    actionArgs: Record<string, any>;
    delay?: number;
    animationId: string;
}) => void;
export type CancelAnimationFrame = (animationId: string) => void;
export type CopyToClipboard = (args: {
    text: string;
    actionId?: string;
}) => void;
export type SendEvent = (data: any) => void;

/**
 * A wrapper around `Core` that contains the arguments for constructing
 * core that are determined from the initial call to `initializeWorker`.
 *
 * TODO: add real types to the pieces that won't be soon obsoleted
 */
export class PublicDoenetMLCore {
    core: Core | null = null;
    // The argument with which to call the Core constructor.
    // TODO: determine which of these are likely to stick around
    // and better document those
    coreBaseArgs?: {
        doenetML: string;
        flags: Record<string, unknown>;
        activityId: string;
        docId: string;
        requestedVariantIndex: number;
        attemptNumber: number;
        serializedDocument: any;
        allDoenetMLs: any;
        preliminaryErrors: any;
        preliminaryWarnings: any;
        componentInfoObjects: any;
    };
    // The result from calling `initializeWorker`
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
        attemptNumber,
    }: {
        activityId: string;
        docId: string;
        requestedVariantIndex: number;
        attemptNumber: number;
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
            attemptNumber,
            serializedDocument: addDocumentIfItsMissing(
                expandResult.fullSerializedComponents[0],
            )[0],
            allDoenetMLs: expandResult.allDoenetMLs,
            preliminaryErrors: expandResult.errors,
            preliminaryWarnings: expandResult.warnings,
            componentInfoObjects,
        };

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

    /**
     * Create the Javascript core, create all the components and resolve all the state variables
     * need to generated the dast for the renderer.
     *
     * Note: the return type for this function is currently in flux as it is a work in progress.
     *
     * TODO: clean up this function
     */
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
        updateRenderersCallback: UpdateRenderersCallback,
        reportScoreAndStateCallback: ReportScoreAndStateCallback,
        requestAnimationFrame: RequestAnimationFrame,
        cancelAnimationFrame: CancelAnimationFrame,
        copyToClipboard: CopyToClipboard,
        sendEvent: SendEvent,
    ) {
        let coreArgs = {
            ...this.coreBaseArgs!,
            ...args,
            updateRenderersCallback,
            reportScoreAndStateCallback,
            requestAnimationFrame,
            cancelAnimationFrame,
            copyToClipboard,
            sendEvent,
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
                    ? (this.initializeResult?.errMsg ??
                      "Error initializing core")
                    : "Internal error. Cannot create document. Core not initialized.";

            return {
                success: false as const,
                coreId: coreArgs.coreId,
                errMsg,
            };
        }
    }

    /**
     * Add the action `actionName` of `componentName` to the queue to be executed.
     */
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

        try {
            return await this.core.requestAction(actionArgs);
        } catch (e) {
            return {
                success: false,
                errMsg:
                    typeof e === "object" &&
                    e &&
                    "message" in e &&
                    typeof e.message === "string"
                        ? e.message
                        : "",
            };
        }
    }

    /**
     * A debugging function that returns a list of all components in the document,
     * all their states variables, and additional information about their children,
     * replacements, and shared parameters.
     *
     * Unless `dontRemoveFunctionsMath` is set, clean state variables that can't be conveniently serialized,
     * i.e., remove functions and replace math-expressions with their tree.
     */
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

        // console.log the entire components tree so that, when called from the console,
        // one can examine the actual components without serialization, if desired.
        console.log(components);

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
            compObj.sharedParameters = dontRemoveFunctionsMath
                ? component.sharedParameters
                : removeFunctionsMathExpressionClass(
                      component.sharedParameters,
                  );
        }

        return componentsObj;
    }
    /**
     * Submit any answers that are waiting to auto-submitted and save all state
     * so that the worker can be terminate without losing data
     */
    async terminate() {
        if (this.core) {
            await this.core.terminate();
            this.core = null;
        }
    }

    // Turn on or off recording of the visibility of document components,
    // depending if the document itself is visible
    handleVisibilityChange(documentIsVisible: boolean) {
        this.core?.handleVisibilityChange(documentIsVisible);
    }

    // TODO: restore functionality that opens collapsible sections
    // when navigating to them or to items inside them
    navigatingToComponent(componentName: string, hash: string) {
        // This function no longer works
        this.core?.handleNavigatingToComponent({ componentName, hash });
    }

    /**
     * Call submitAnswer on all answers in the document
     */
    async submitAllAnswer() {
        return await this.core?.requestAction({
            componentName: this.core.documentName,
            actionName: "submitAllAnswers",
            args: {},
        });
    }

    /**
     * Immediately save all document state to the database,
     * ignoring any timeouts
     */
    async saveImmediately() {
        await this.core?.saveImmediately();
    }
}
