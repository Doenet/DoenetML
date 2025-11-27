import Core from "./Core";
import { removeFunctionsMathExpressionClass } from "./utils/math";
import { createComponentInfoObjects } from "./utils/componentInfoObjects";
export { createComponentInfoObjects } from "./utils/componentInfoObjects";
import { returnAllPossibleVariants } from "./utils/returnAllPossibleVariants";
import {
    FlatFragment,
    NormalizedRoot,
    PathToCheck,
    NodeList,
    RefResolution,
    IndexResolution,
    ContentVector,
    RootNames,
} from "@doenet/doenetml-worker";
import { normalizedDastToSerializedComponents } from "./utils/dast/convertNormalizedDast";

// Type signatures for callbacks
export type UpdateRenderersCallback = (arg: {
    updateInstructions: Record<string, any>[];
    actionId?: string;
    errorWarnings?: { errors: any[]; warnings: any[] };
    init?: boolean;
}) => void;
export type ReportScoreAndStateCallback = (data: {
    score: number;
    state: unknown;
}) => void;
export type RequestAnimationFrame = (args: {
    action: { actionName: string; componentIdx?: string };
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
export type RequestSolutionView = (componentIdx: number) => Promise<{
    allowView: boolean;
}>;

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
        nComponentsInit: number;
        allDoenetMLs: any;
        preliminaryErrors: any;
        preliminaryWarnings: any;
        componentInfoObjects: any;
    };
    // The result from calling `initializeWorker`
    initializeResult?: { success: boolean; errMsg?: string };
    doenetML = "";
    flags: Record<string, unknown> = {};
    addNodesToResolver?: (
        flat_fragment: FlatFragment,
        index_resolution: IndexResolution,
    ) => void;
    replaceIndexResolutionsInResolver?: (
        components: ContentVector,
        index_resolution: IndexResolution,
    ) => void;
    deleteNodesFromResolver?: (node_list: NodeList) => void;
    resolvePath?: (
        path: PathToCheck,
        origin: number,
        skip_parent_search: boolean,
    ) => RefResolution;
    calculateRootNames?: () => RootNames;

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
        normalizedRoot,
        addNodesToResolver,
        replaceIndexResolutionsInResolver,
        deleteNodesFromResolver,
        resolvePath,
        calculateRootNames,
    }: {
        activityId: string;
        docId: string;
        requestedVariantIndex: number;
        attemptNumber: number;
        normalizedRoot: NormalizedRoot;
        addNodesToResolver: (
            flat_fragment: FlatFragment,
            index_resolution: IndexResolution,
        ) => void;
        replaceIndexResolutionsInResolver?: (
            components: ContentVector,
            index_resolution: IndexResolution,
        ) => void;
        deleteNodesFromResolver: (node_list: NodeList) => void;
        resolvePath: (
            path: PathToCheck,
            origin: number,
            skip_parent_search: boolean,
        ) => RefResolution;
        calculateRootNames?: () => RootNames;
    }) {
        this.addNodesToResolver = addNodesToResolver;
        this.replaceIndexResolutionsInResolver =
            replaceIndexResolutionsInResolver;
        this.deleteNodesFromResolver = deleteNodesFromResolver;
        this.resolvePath = resolvePath;
        this.calculateRootNames = calculateRootNames;

        let componentInfoObjects = createComponentInfoObjects();

        const {
            document: root,
            nComponents: nComponentsInit,
            errors,
            warnings,
            sources,
        } = await normalizedDastToSerializedComponents(
            normalizedRoot,
            componentInfoObjects,
            addNodesToResolver,
        );

        this.coreBaseArgs = {
            doenetML: this.doenetML,
            flags: this.flags,
            activityId,
            docId,
            requestedVariantIndex,
            attemptNumber,
            serializedDocument: root,
            nComponentsInit,
            allDoenetMLs: sources,
            preliminaryErrors: errors,
            preliminaryWarnings: warnings,
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
        requestSolutionView: RequestSolutionView,
    ) {
        let coreArgs = {
            ...this.coreBaseArgs!,
            ...args,
            addNodesToResolver: this.addNodesToResolver,
            replaceIndexResolutionsInResolver:
                this.replaceIndexResolutionsInResolver,
            deleteNodesFromResolver: this.deleteNodesFromResolver,
            resolvePath: this.resolvePath,
            calculateRootNames: this.calculateRootNames,
            updateRenderersCallback,
            reportScoreAndStateCallback,
            requestAnimationFrame,
            cancelAnimationFrame,
            copyToClipboard,
            sendEvent,
            requestSolutionView,
        };

        if (this.initializeResult?.success) {
            //@ts-ignore
            this.core = new Core(coreArgs);
            try {
                const result = await this.core.generateDast();
                return { success: true as const, ...result };
            } catch (e) {
                console.error(e);
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
     * Add the action `actionName` of `componentIdx` to the queue to be executed.
     */
    async requestAction(actionArgs: {
        actionName: string;
        componentIdx: number | undefined;
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
            console.error(e);
            return {
                success: false,
                errMsg:
                    typeof e === "object" &&
                    e &&
                    "message" in e &&
                    typeof e.message === "string"
                        ? e.message
                        : "",
                actionId: actionArgs.args?.actionId,
            };
        }
    }

    /**
     * A debugging function that returns a list of all components in the document,
     * all their states variables, and additional information about their children,
     * replacements, and shared parameters.
     *
     * If `consoleLogComponents` is `true`, then console.log the entire component tree,
     * which can be useful when debugging in the console.
     *
     * Unless `dontRemoveFunctionsMath` is set, clean state variables that can't be conveniently serialized,
     * i.e., remove functions and replace math-expressions with their tree.
     */
    async returnAllStateVariables(
        consoleLogComponents = false,
        dontRemoveFunctionsMath = false,
    ) {
        if (!this.core?.components) {
            return {};
        }

        const componentsObj: Record<
            string,
            {
                componentIdx: number;
                componentType: string;
                stateValues: Record<string, any>;
                activeChildren: any[];
                replacements?: any[];
                replacementsToWithhold?: number;
                replacementOf?: number;
                sharedParameters: any;
            }
        > = {};
        const components = this.core.components as Record<string, any>;

        if (consoleLogComponents) {
            // console.log the entire components tree so that, when called from the console,
            // one can examine the actual components without serialization, if desired.
            console.log(components);
        }

        for (let componentIdxStr in components) {
            const componentIdx = Number(componentIdxStr);
            let component = components[componentIdx];
            if (!component) {
                continue;
            }
            componentsObj[componentIdx] = {
                componentIdx,
                componentType: component.componentType,
                stateValues: {},
                activeChildren: [],
                sharedParameters: null,
            };
            let compObj = componentsObj[componentIdx];
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
                x.componentIdx
                    ? {
                          componentIdx: x.componentIdx,
                          componentType: x.componentType,
                      }
                    : x,
            );
            if (component.replacements) {
                compObj.replacements = component.replacements.map((x: any) =>
                    x.componentIdx
                        ? {
                              componentIdx: x.componentIdx,
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
                compObj.replacementOf = component.replacementOf.componentIdx;
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
     * so that the worker can be terminated without losing data.
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
    navigatingToComponent(componentIdx: number, hash: string) {
        // This function no longer works
        this.core?.handleNavigatingToComponent({ componentIdx, hash });
    }

    /**
     * Call submitAnswer on all answers in the document,
     * then immediately save all document state to the database
     */
    async submitAllAnswers() {
        await this.core?.requestAction({
            componentIdx: this.core.documentIdx,
            actionName: "submitAllAnswers",
            args: {},
        });

        await this.core?.saveImmediately();
    }

    /**
     * Immediately save all document state to the database,
     * ignoring any timeouts
     */
    async saveImmediately() {
        await this.core?.saveImmediately();
    }
}
