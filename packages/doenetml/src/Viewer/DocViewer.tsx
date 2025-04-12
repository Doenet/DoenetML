import React, {
    createContext,
    ErrorInfo,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { nanoid } from "nanoid";
import {
    serializedComponentsReplacer,
    serializedComponentsReviver,
    cesc,
    data_format_version,
    cidFromText,
} from "@doenet/utils";
import * as Comlink from "comlink";

import { MdError } from "react-icons/md";
import { rendererState } from "./useDoenetRenderer";
import { atom, atomFamily, useRecoilCallback, useRecoilValue } from "recoil";
import { get as idb_get } from "idb-keyval";
import { createCoreWorker, initializeCoreWorker } from "../utils/docUtils";
import type { CoreWorker } from "@doenet/doenetml-worker";
import { DoenetMLFlags } from "../doenetml";
import { Icon } from "@chakra-ui/react";
import { Remote } from "comlink";

const rendererUpdatesToIgnore = atomFamily({
    key: "rendererUpdatesToIgnore",
    default: {},
});

export const DocContext = createContext<{
    navigate?: any;
    location?: any;
    linkSettings?: { viewURL: string; editURL: string };
    scrollableContainer?: HTMLDivElement | Window;
    darkMode?: "dark" | "light";
    showAnswerResponseMenu?: boolean;
    answerResponseCounts?: Record<string, number>;
}>({});

export function DocViewer({
    doenetML,
    userId,
    activityId = "a",
    docId = "1",
    render = true,
    hidden = false,
    attemptNumber = 1,
    forceDisable = false,
    forceShowCorrectness = false,
    forceShowSolution = false,
    forceUnsuppressCheckwork = false,
    generatedVariantCallback,
    flags,
    requestedVariantIndex,
    initialState,
    setErrorsAndWarningsCallback,
    reportScoreAndStateCallback: specifiedReportScoreAndStateCallback,
    documentStructureCallback,
    initializedCallback,
    setIsInErrorState,
    prefixForIds = "",
    location = {},
    navigate,
    linkSettings = { viewURL: "/portfolioviewer", editURL: "/publiceditor" },
    scrollableContainer,
    darkMode,
    showAnswerResponseMenu = false,
    answerResponseCounts = {},
    initializeCounters: prescribedInitializeCounters = {},
}: {
    doenetML: string;
    userId?: string;
    activityId?: string;
    docId?: string;
    render?: boolean;
    hidden?: boolean;
    attemptNumber?: number;
    forceDisable?: boolean;
    forceShowCorrectness?: boolean;
    forceShowSolution?: boolean;
    forceUnsuppressCheckwork?: boolean;
    generatedVariantCallback?: Function;
    flags: DoenetMLFlags;
    requestedVariantIndex: number;
    initialState?: Record<string, any> | null;
    setErrorsAndWarningsCallback?: Function;
    reportScoreAndStateCallback?: Function;
    documentStructureCallback?: Function;
    initializedCallback?: Function;
    setIsInErrorState?: Function;
    prefixForIds?: string;
    location?: any;
    navigate?: any;
    linkSettings?: { viewURL: string; editURL: string };
    scrollableContainer?: HTMLDivElement | Window;
    darkMode?: "dark" | "light";
    showAnswerResponseMenu?: boolean;
    answerResponseCounts?: Record<string, number>;
    initializeCounters?: Record<string, number>;
}) {
    const updateRendererSVsWithRecoil = useRecoilCallback(
        ({ snapshot, set }) =>
            async ({
                coreId,
                componentName,
                stateValues,
                childrenInstructions,
                sourceOfUpdate,
                baseStateVariable,
                actionId,
            }: {
                coreId: string;
                componentName: string;
                stateValues: Record<string, any>;
                childrenInstructions?: Record<string, any>[];
                sourceOfUpdate?: Record<string, any>;
                baseStateVariable?: string;
                actionId?: string;
            }) => {
                let ignoreUpdate = false;

                let rendererName = coreId + componentName;

                if (baseStateVariable) {
                    let updatesToIgnore = snapshot.getLoadable(
                        rendererUpdatesToIgnore(rendererName),
                    ).contents;

                    if (Object.keys(updatesToIgnore).length > 0) {
                        let valueFromRenderer = updatesToIgnore[actionId || ""];
                        let valueFromCore = stateValues[baseStateVariable];
                        if (
                            valueFromRenderer === valueFromCore ||
                            (Array.isArray(valueFromRenderer) &&
                                Array.isArray(valueFromCore) &&
                                valueFromRenderer.length ==
                                    valueFromCore.length &&
                                valueFromRenderer.every(
                                    (v, i) => valueFromCore[i] === v,
                                ))
                        ) {
                            // console.log(`ignoring update of ${componentName} to ${valueFromCore}`)
                            ignoreUpdate = true;
                            set(
                                rendererUpdatesToIgnore(rendererName),
                                (was: Record<string, any>) => {
                                    let newUpdatesToIgnore = { ...was };
                                    if (actionId) {
                                        delete newUpdatesToIgnore[actionId];
                                    }
                                    return newUpdatesToIgnore;
                                },
                            );
                        } else {
                            // since value was changed from the time the update was created
                            // don't ignore the remaining pending changes in updatesToIgnore
                            // as we changed the state used to determine they could be ignored
                            set(rendererUpdatesToIgnore(rendererName), {});
                        }
                    }
                }

                let childrenInstructions2: Record<string, any>[];

                if (childrenInstructions === undefined) {
                    let previousRendererState = snapshot.getLoadable(
                        rendererState(rendererName),
                    ).contents;
                    childrenInstructions2 =
                        previousRendererState.childrenInstructions;
                } else {
                    childrenInstructions2 = childrenInstructions;
                }

                let newRendererState = {
                    stateValues,
                    childrenInstructions: childrenInstructions2,
                    sourceOfUpdate,
                    ignoreUpdate,
                    prefixForIds,
                };

                set(rendererState(rendererName), newRendererState);
            },
    );
    const updateRendererUpdatesToIgnore = useRecoilCallback(
        ({ snapshot, set }) =>
            async ({ coreId, componentName, baseVariableValue, actionId }) => {
                let rendererName = coreId + componentName;

                // add to updates to ignore so don't apply change again
                // if it comes back from core without any changes
                // (possibly after a delay)
                set(
                    rendererUpdatesToIgnore(rendererName),
                    (was: Record<string, any>) => {
                        let newUpdatesToIgnore = { ...was };
                        newUpdatesToIgnore[actionId] = baseVariableValue;
                        return newUpdatesToIgnore;
                    },
                );
            },
    );

    const [errMsg, setErrMsg] = useState<string | null>(null);

    const cid = useRef<string | null>(null);
    const lastDoenetML = useRef<string | null>(null);
    const lastActivityId = useRef<string | null>(null);
    const lastDocId = useRef<string | null>(null);
    const lastAttemptNumber = useRef<number | null>(null);
    const lastRequestedVariantIndex = useRef<number | null>(null);

    const [stage, setStage] = useState("initial");

    const [documentRenderer, setDocumentRenderer] =
        useState<ReactElement | null>(null);

    const initialCoreData = useRef<{
        coreState: Record<string, any>;
        requestedVariant: Record<string, any>;
    } | null>(null);

    const initializeCounters = useRef<Record<string, number>>(
        prescribedInitializeCounters,
    );
    useEffect(() => {
        initializeCounters.current = prescribedInitializeCounters;
    }, [prescribedInitializeCounters]);

    const rendererClasses = useRef<Record<string, any>>({});
    const coreInfo = useRef<Record<string, any> | null>(null);
    const coreCreated = useRef(false);
    const coreCreationInProgress = useRef(false);
    const coreId = useRef<string>("");
    const errorWarnings = useRef<{
        errors: any[];
        warnings: any[];
    }>({ errors: [], warnings: [] });

    const resolveAllStateVariables = useRef<((value: unknown) => void) | null>(
        null,
    );
    const resolveErrorWarnings = useRef<((value: unknown) => void) | null>(
        null,
    );
    const actionsBeforeCoreCreated = useRef<
        {
            actionName: string;
            componentName?: string;
            args: Record<string, any>;
        }[]
    >([]);

    const preventMoreAnimations = useRef(false);
    const animationInfo = useRef<
        Record<string, { animationFrameID?: number; timeoutId?: number }>
    >({});

    const resolveActionPromises = useRef<Record<string, (value: any) => void>>(
        {},
    );
    const actionTentativelySkipped = useRef<{
        action: { actionName: string; componentName?: string };
        args: Record<string, any>;
        baseVariableValue?: any;
        componentName?: string;
        rendererType?: string;
        promiseResolve?: (value: any) => void;
    } | null>(null);

    const saveStatePromises = useRef<
        Record<
            string,
            {
                resolve: (value: Record<string, any>) => void;
                reject: (value: unknown) => void;
            }
        >
    >({});

    const previousLocationKeys = useRef<any[]>([]);

    const errorInitializingRenderers = useRef(false);
    const errorInsideRenderers = useRef(false);

    const [ignoreRendererError, setIgnoreRendererError] = useState(false);

    const coreWorker = useRef<Remote<CoreWorker> | null>(null);

    let hash = location.hash;

    const contextForRenderers = {
        navigate,
        location,
        linkSettings,
        scrollableContainer,
        darkMode,
        showAnswerResponseMenu,
        answerResponseCounts,
    };

    const postfixForWindowFunctions =
        prefixForIds
            .replaceAll("/", "")
            .replaceAll("\\", "")
            .replaceAll("-", "_") || "1";

    useEffect(() => {
        if (!coreWorker.current) {
            return;
        }
        // coreWorker.current.onmessage = function (e) {
        //     // console.log("message from core", e.data);
        //  if (e.data.messageType === "sendAlert") {
        //         console.log(`Sending alert message: ${e.data.args.message}`);
        //         // sendAlert(e.data.args.message, e.data.args.alertType);
        //     } lse if (e.data.messageType === "copyToClipboard") {
        //         copyToClipboard(e.data.args);
        //     } else if (e.data.messageType === "navigateToTarget") {
        //         navigateToTarget(e.data.args);
        //     } else if (e.data.messageType === "navigateToHash") {
        //         navigate(location.search + e.data.args.hash, {
        //             replace: true,
        //         });
        //     } else if (e.data.messageType === "recordSolutionView") {
        //         window.postMessage({
        //             ...e.data,
        //             subject: "SPLICE.recordSolutionView",
        //             activityId,
        //             docId,
        //         });
        //     } else if (e.data.messageType === "sendEvent") {
        //         window.postMessage({
        //             ...e.data,
        //             subject: "SPLICE.sendEvent",
        //             activityId,
        //             docId,
        //         });
        //     }
        // };
    }, [coreWorker, location]);

    useEffect(() => {
        return () => {
            coreWorker.current?.terminate();
        };
    }, []);

    useEffect(() => {
        const listener = function (e: MessageEvent) {
            if (
                e.origin !== window.location.origin &&
                e.origin !== window.parent.location.origin
            ) {
                return;
            }
            if (typeof e.data !== "object") {
                return;
            }
            if (e.data.subject === "SPLICE.getState.response") {
                let promiseInfo = saveStatePromises.current[e.data.messageId];
                if (!promiseInfo) {
                    return;
                }
                delete saveStatePromises.current[e.data.messageId];

                if (e.data.success) {
                    promiseInfo.resolve(e.data);
                } else {
                    promiseInfo.reject(e.data);
                }
            }
        };

        window.addEventListener("message", listener);

        return () => {
            window.removeEventListener("message", listener);
        };
    }, []);

    useEffect(() => {
        if (!coreWorker.current) {
            return;
        }
        if (docId !== null) {
            (window as any)[
                "returnAllStateVariables" + postfixForWindowFunctions
            ] = async function () {
                const allStateVariables =
                    await coreWorker.current?.returnAllStateVariables();
                console.log(allStateVariables);
                return allStateVariables;
            };

            (window as any)["returnErrorWarnings" + postfixForWindowFunctions] =
                function () {
                    return errorWarnings.current;
                };

            (window as any)["callAction" + postfixForWindowFunctions] =
                async function ({
                    actionName,
                    componentName,
                    args,
                }: {
                    actionName: string;
                    componentName: string;
                    args: Record<string, any>;
                }) {
                    return await callAction({
                        action: { actionName, componentName },
                        args,
                    });
                };
        }
    }, [docId, coreWorker.current]);

    useEffect(() => {
        return () => {
            preventMoreAnimations.current = true;
            for (let id in animationInfo.current) {
                cancelAnimationFrame(id);
            }
            animationInfo.current = {};
        };
    }, []);

    useEffect(() => {
        if (!coreWorker) {
            return;
        }
        // document.addEventListener("visibilitychange", () => {
        //     coreWorker.postMessage({
        //         messageType: "visibilityChange",
        //         args: {
        //             visible: document.visibilityState === "visible",
        //         },
        //     });
        // });
    }, [coreWorker]);

    useEffect(() => {
        if (hash && coreCreated.current && coreWorker) {
            let anchor = hash.slice(1);
            if (anchor.substring(0, prefixForIds.length) === prefixForIds) {
                // coreWorker.postMessage({
                //     messageType: "navigatingToComponent",
                //     args: {
                //         componentName: anchor
                //             .substring(prefixForIds.length)
                //             .replaceAll("\\/", "/"),
                //         hash,
                //     },
                // });
            }
        }
    }, [location, hash, coreCreated.current, coreWorker]);

    useEffect(() => {
        if (hash && documentRenderer && render) {
            let anchor = hash.slice(1);
            if (
                (!previousLocationKeys.current.includes(location.key) ||
                    location.key === "default") &&
                anchor.length > prefixForIds.length &&
                anchor.substring(0, prefixForIds.length) === prefixForIds
            ) {
                document.getElementById(anchor)?.scrollIntoView();
            }
            previousLocationKeys.current.push(location.key);
        }
    }, [location, hash, documentRenderer, render]);

    useEffect(() => {
        callAction({
            action: { actionName: "setTheme" },
            args: { theme: darkMode, doNotIgnore: true },
        });
    }, [darkMode]);

    // TODO: fix this function as it uses conventions that are no longer valid
    const navigateToTarget = useCallback(
        async ({
            cid,
            activityId,
            variantIndex,
            edit,
            hash,
            uri,
            targetName,
            actionId,
            componentName,
            effectiveName,
        }: {
            cid?: string;
            activityId?: string;
            variantIndex?: number;
            edit?: boolean;
            hash?: string;
            uri?: string;
            targetName?: string;
            actionId?: string;
            componentName?: string;
            effectiveName: string;
        }) => {
            let id = prefixForIds + cesc(effectiveName);
            let { targetForATag, url, haveValidTarget, externalUri } =
                getURLFromRef({
                    cid,
                    activityId,
                    variantIndex,
                    edit,
                    hash,
                    givenUri: uri,
                    targetName,
                    linkSettings,
                    search: location.search,
                    id,
                });

            if (haveValidTarget) {
                if (targetForATag === "_blank") {
                    window.open(url, targetForATag);
                } else {
                    // TODO: when fix regular ref navigation to scroll back to previous scroll position
                    // when click the back button
                    // add that ability to this navigation as well

                    // let scrollAttribute = scrollableContainer === window ? "scrollY" : "scrollTop";
                    // let stateObj = { fromLink: true }
                    // Object.defineProperty(stateObj, 'previousScrollPosition', { get: () => scrollableContainer?.[scrollAttribute], enumerable: true });

                    navigate?.(url);
                }
            }

            resolveAction({ actionId });
        },
        [location],
    );

    async function reinitializeCoreAndTerminateAnimations() {
        preventMoreAnimations.current = true;
        await coreWorker.current?.terminate();
        const newCoreWorker = createCoreWorker();
        coreWorker.current = newCoreWorker;

        coreCreated.current = false;
        coreCreationInProgress.current = false;
        for (let id in animationInfo.current) {
            cancelAnimationFrame(id);
        }
        animationInfo.current = {};
        actionsBeforeCoreCreated.current = [];

        const initializeResult = await initializeCoreWorker({
            coreWorker: newCoreWorker,
            doenetML,
            flags,
            activityId,
            docId,
            requestedVariantIndex,
            documentStructureCallback,
        });

        if (initializeResult.success === false) {
            setErrMsg(
                `Error initializing activity: ${initializeResult.errMsg}`,
            );
        }

        return newCoreWorker;
    }

    function callAction({
        action,
        args,
        baseVariableValue,
        componentName,
        rendererType,
        promiseResolve,
    }: {
        action: { actionName: string; componentName?: string };
        args: Record<string, any>;
        baseVariableValue?: any;
        componentName?: string;
        rendererType?: string;
        promiseResolve?: (value: any) => void;
    }) {
        // Note: the reason we check both the renderer class and .type
        // is that if the renderer was memoized, then the renderer class itself is on .type,
        // Otherwise, the renderer class is the value of the rendererClasses entry.
        let ignoreActionsWithoutCore =
            rendererClasses.current[rendererType ?? ""]
                ?.ignoreActionsWithoutCore ||
            rendererClasses.current[rendererType ?? ""]?.type
                ?.ignoreActionsWithoutCore;
        if (
            !coreCreated.current &&
            (ignoreActionsWithoutCore?.(action.actionName) ||
                !coreCreationInProgress.current) &&
            !args?.doNotIgnore
        ) {
            // The action is being skipped because core has not been created
            // and either the action must be ignored without core or core isn't actually
            // in the process of being created (relevant case is that core has been terminated).
            // Also, don't ignore if the doNotIgnore argument has been set
            // (used for actions called directly from DocViewer for initialization)

            if (promiseResolve) {
                // if were given promiseResolve, then action was called from resolveAction
                // where the return value is being ignored.
                // Resolve promise as false as action will be skipped
                promiseResolve(false);
                return;
            } else {
                // Action was called normally where it is expecting a promise to be returned.
                // A promise resolved as false indicates action was skipped.
                return Promise.resolve(false);
            }
        }

        if (actionTentativelySkipped.current) {
            // we are for sure skipping the actionTentativelySkipped,
            // so resolve its promise as false
            actionTentativelySkipped.current.promiseResolve?.(false);
            actionTentativelySkipped.current = null;
        }

        if (args?.skippable) {
            let nActionsInProgress = Object.keys(
                resolveActionPromises.current,
            ).length;

            if (nActionsInProgress > 0) {
                // Since another action is currently in progress,
                // we will (at least initially) skip this skippable action.
                // If the currently running action is resolved while this action
                // is still the last skipped action, then this action might be executed.

                // If promiseResolve is undefined, then it's the original call of this action.
                // Create a promise that will be returned.
                // It will be resolved with false when this action is definitely skipped,
                // or it will be resolved with true if this action ends up being executed.
                let newPromise;
                if (!promiseResolve) {
                    newPromise = new Promise((resolve, reject) => {
                        promiseResolve = resolve;
                    });
                }

                actionTentativelySkipped.current = {
                    action,
                    args,
                    baseVariableValue,
                    componentName,
                    rendererType,
                    promiseResolve,
                };

                if (newPromise) {
                    return newPromise;
                } else {
                    // if we don't have a newPromise, that means that we were given a promiseResolve
                    // as an argument to callAction,
                    // which happens when we are being called from within resolveAction
                    // and the return value is ignored
                    return;
                }
            }
        }

        // If we made it here, then we're definitely going to call the action
        // (though if core isn't created yet, we might queue it to be called once core is created)

        let actionId = nanoid();
        args = { ...args };
        args.actionId = actionId;

        if (baseVariableValue !== undefined && componentName) {
            // Update the bookkeeping variables for the optimistic UI that will tell the renderer
            // whether or not to ignore the information core sends when it finishes the action
            updateRendererUpdatesToIgnore({
                coreId: coreId.current,
                componentName,
                baseVariableValue,
                actionId,
            });
        }

        let actionArgs = {
            actionName: action.actionName,
            componentName: action.componentName,
            args,
        };

        executeAction(actionArgs);

        if (promiseResolve) {
            // If we were sent promiseResolve as an argument,
            // then the promise for this action has already been returned to the original caller
            // and we are just being called inside resolveAction
            // (where the return is being ignored).
            // Simply set it up so that promiseResolve will be called when the action is resolved
            resolveActionPromises.current[actionId] = promiseResolve;
            return;
        } else {
            return new Promise((resolve, reject) => {
                resolveActionPromises.current[actionId] = resolve;
            });
        }
    }

    async function executeAction(actionArgs: {
        actionName: string;
        componentName: string | undefined;
        args: Record<string, any>;
    }) {
        if (!coreCreated.current) {
            // If core has not yet been created,
            // queue the action to be sent once core is created
            actionsBeforeCoreCreated.current.push(actionArgs);
            return;
        }

        // Note: it is possible that core has been terminated, so we need the question mark
        const actionResult =
            await coreWorker.current?.dispatchActionJavascript(actionArgs);

        resolveAction(actionResult);
    }

    function forceRendererState({
        rendererState,
        forceDisable,
        forceShowCorrectness,
        forceShowSolution,
        forceUnsuppressCheckwork,
    }: {
        rendererState: Record<string, Record<string, any>>;
        forceDisable: boolean;
        forceShowCorrectness: boolean;
        forceShowSolution: boolean;
        forceUnsuppressCheckwork: boolean;
    }) {
        for (let componentName in rendererState) {
            let stateValues = rendererState[componentName].stateValues;
            if (forceDisable && stateValues.disabled === false) {
                stateValues.disabled = true;
            }
            if (forceShowCorrectness && stateValues.showCorrectness === false) {
                stateValues.showCorrectness = true;
            }
            if (
                forceUnsuppressCheckwork &&
                stateValues.suppressCheckwork === true
            ) {
                stateValues.suppressCheckwork = false;
            }
            if (
                forceShowSolution &&
                rendererState[componentName].childrenInstructions?.length > 0
            ) {
                // look for a child that has a componentType solution
                for (let childInst of rendererState[componentName]
                    .childrenInstructions) {
                    if (childInst.componentType === "solution") {
                        let solComponentName = childInst.componentName;
                        if (
                            rendererState[solComponentName].stateValues.hidden
                        ) {
                            rendererState[solComponentName].stateValues.hidden =
                                false;
                        }
                    }
                }
            }
        }
    }

    function initializeRenderers(args: Record<string, any>) {
        if (args.rendererState) {
            delete args.rendererState.__componentNeedingUpdateValue;
            if (
                forceDisable ||
                forceShowCorrectness ||
                forceShowSolution ||
                forceUnsuppressCheckwork
            ) {
                forceRendererState({
                    rendererState: args.rendererState,
                    forceDisable,
                    forceShowCorrectness,
                    forceShowSolution,
                    forceUnsuppressCheckwork,
                });
            }
            for (let componentName in args.rendererState) {
                updateRendererSVsWithRecoil({
                    coreId: coreId.current,
                    componentName,
                    stateValues: args.rendererState[componentName].stateValues,
                    childrenInstructions:
                        args.rendererState[componentName].childrenInstructions,
                });
            }
        }

        coreInfo.current = args.coreInfo;

        if (!coreInfo.current) {
            return;
        }

        generatedVariantCallback?.({
            variantInfo: JSON.parse(
                coreInfo.current.generatedVariantString,
                serializedComponentsReviver,
            ),
            allPossibleVariants: coreInfo.current.allPossibleVariants,
            activityId,
            docId,
        });

        let renderPromises = [];
        let rendererClassNames = [];
        // console.log('rendererTypesInDocument');
        // console.log(">>>core.rendererTypesInDocument",core.rendererTypesInDocument);
        for (let rendererClassName of coreInfo.current
            .rendererTypesInDocument) {
            rendererClassNames.push(rendererClassName);
            let extension = "jsx";
            const CONVERTED_TO_TSX = new Set([
                "_error",
                "alert",
                "angle",
                "answer",
                "asList",
                "blockQuote",
                "boolean",
                "booleanInput",
                "button",
                "point",
                "math",
                "c",
                "cell",
                "choiceInput",
                "circle",
                "cobwebPolyline",
                "codeEditor",
                "codeViewer",
                "containerBlock",
                "containerInline",
                "contentBrowser",
                "contentPicker",
                "curve",
            ]);
            if (CONVERTED_TO_TSX.has(rendererClassName)) {
                extension = "tsx";
            }
            renderPromises.push(
                import(`./renderers/${rendererClassName}.${extension}`),
            );
        }

        let documentComponentInstructions = coreInfo.current.documentToRender;

        renderersLoadComponent(renderPromises, rendererClassNames)
            .then((newRendererClasses) => {
                rendererClasses.current = newRendererClasses;
                let documentRendererClass =
                    newRendererClasses[
                        documentComponentInstructions.rendererType
                    ];

                setDocumentRenderer(
                    React.createElement(documentRendererClass, {
                        key:
                            coreId.current +
                            documentComponentInstructions.componentName,
                        componentInstructions: documentComponentInstructions,
                        rendererClasses: newRendererClasses,
                        flags,
                        coreId: coreId.current,
                        docId,
                        activityId,
                        callAction,
                        navigate,
                        location,
                        linkSettings,
                        scrollableContainer,
                    }),
                );

                // renderersInitializedCallback?.();
            })
            .catch((e) => {
                errorInitializingRenderers.current = true;
            });
    }

    //offscreen then postpone that one
    function updateRenderers({
        updateInstructions,
        actionId,
        errorWarnings: newErrorWarnings,
        init = false,
    }: {
        updateInstructions: Record<string, any>[];
        actionId?: string;
        errorWarnings?: {
            errors: any[];
            warnings: any[];
        };
        init?: boolean;
    }) {
        if (newErrorWarnings) {
            errorWarnings.current = newErrorWarnings;
            setErrorsAndWarningsCallback?.(errorWarnings.current);
        }

        if (
            init &&
            coreInfo.current &&
            !errorInitializingRenderers.current &&
            !errorInsideRenderers.current &&
            !hidden
        ) {
            // we don't update renderer state values if already have a coreInfo
            // and no errors were encountered
            // as we must have already gotten the renderer information before core was created.
            // Exception if doc is hidden,
            // then we still update the renderers.
            // This exception is important because, in this case,
            // the renderers have not yet been rendered, so any errors would not yet have revealed
            // (and for the same reason, there cannot have been any user actions queued)
            return;
        }

        for (let instruction of updateInstructions) {
            if (instruction.instructionType === "updateRendererStates") {
                for (let {
                    componentName,
                    stateValues,
                    rendererType,
                    childrenInstructions,
                } of instruction.rendererStatesToUpdate) {
                    updateRendererSVsWithRecoil({
                        coreId: coreId.current,
                        componentName,
                        stateValues,
                        childrenInstructions,
                        sourceOfUpdate: instruction.sourceOfUpdate,
                        // Note: the reason we check both the renderer class and .type
                        // is that if the renderer was memoized, then the renderer class itself is on .type,
                        // Otherwise, the renderer class is the value of the rendererClasses entry.
                        baseStateVariable:
                            rendererClasses.current[rendererType]
                                ?.baseStateVariable ||
                            rendererClasses.current[rendererType]?.type
                                ?.baseStateVariable,
                        actionId,
                    });
                }
            }
        }

        resolveAction({ actionId });
    }

    function resolveAction({ actionId }: { actionId?: string }) {
        if (actionId) {
            resolveActionPromises.current[actionId]?.(true);
            delete resolveActionPromises.current[actionId];

            if (
                actionTentativelySkipped.current &&
                Object.keys(resolveActionPromises.current).length === 0
            ) {
                let actionToCall = actionTentativelySkipped.current;
                actionTentativelySkipped.current = null;
                callAction(actionToCall);
            }
        }
    }

    function reportScoreAndStateCallback(data: unknown) {
        if (specifiedReportScoreAndStateCallback) {
            specifiedReportScoreAndStateCallback({
                data,
                activityId,
                docId,
            });
        } else {
            window.postMessage({
                data,
                subject: "SPLICE.reportScoreAndState",
                activityId,
                docId,
            });
        }
    }

    async function loadStateAndInitialize() {
        const coreIdWhenCalled = coreId.current;
        let loadedState = false;

        cid.current = await cidFromText(doenetML);

        if (flags.allowLocalState) {
            let localInfo;

            try {
                localInfo = await idb_get(
                    `${activityId}|${docId}|${attemptNumber}|${cid.current}`,
                );
                if (localInfo.data_format_version !== data_format_version) {
                    // the data saved does not match the current version, so we ignore it
                    localInfo = undefined;
                }
            } catch (e) {
                // ignore error
            }

            if (localInfo) {
                const coreState = JSON.parse(
                    localInfo.coreState,
                    serializedComponentsReviver,
                );
                const rendererState = JSON.parse(
                    localInfo.rendererState,
                    serializedComponentsReviver,
                );
                const coreInfo = JSON.parse(
                    localInfo.coreInfo,
                    serializedComponentsReviver,
                );

                if (rendererState.__componentNeedingUpdateValue) {
                    callAction({
                        action: {
                            actionName: "updateValue",
                            componentName:
                                rendererState.__componentNeedingUpdateValue,
                        },
                        args: { doNotIgnore: true },
                    });
                }

                initializeRenderers({
                    rendererState,
                    coreInfo,
                });

                initialCoreData.current = {
                    coreState,
                    requestedVariant: JSON.parse(
                        coreInfo.generatedVariantString,
                        serializedComponentsReviver,
                    ),
                };

                loadedState = true;
            }
        }

        if (!loadedState) {
            if (flags.allowLoadState) {
                try {
                    // Note: initialState === null means don't attempt to load in any state
                    if (initialState) {
                        processLoadedDocState(initialState);
                    } else if (initialState === undefined) {
                        let resp = await getStateViaSplice({
                            cid: cid.current,
                            activityId,
                            docId,
                            attemptNumber,
                            userId,
                        });
                        if (resp.loadedState) {
                            if (resp.state) {
                                processLoadedDocState(resp.state);
                            }
                        }
                    }
                } catch (e: any) {
                    setIsInErrorState?.(true);

                    let message = "";
                    if ("message" in e) {
                        message = e.message;
                    }
                    setErrMsg(`Error loading doc state: ${message}`);
                    return;
                }
            }
        }

        //Guard against the possibility that parameters changed while waiting
        if (coreIdWhenCalled === coreId.current) {
            if (render) {
                startCore();
            } else {
                setStage("readyToCreateCore");
            }
        }
    }

    function getStateViaSplice({
        cid,
        activityId,
        docId,
        attemptNumber,
        userId,
    }: {
        cid: string;
        activityId: string;
        docId: string;
        attemptNumber: number;
        userId?: string;
    }) {
        let messageId = nanoid();
        let savePromiseResolve: (value: Record<string, any>) => void,
            savePromiseReject: (value: unknown) => void;

        let savePromise = new Promise<Record<string, any>>(
            (resolve, reject) => {
                savePromiseResolve = resolve;
                savePromiseReject = reject;
                window.postMessage({
                    subject: "SPLICE.getState",
                    messageId,
                    cid,
                    activityId,
                    docId,
                    attemptNumber,
                    userId,
                });
            },
        );

        saveStatePromises.current[messageId] = {
            resolve: savePromiseResolve!,
            reject: savePromiseReject!,
        };

        const MESSAGE_TIMEOUT = 15000;

        setTimeout(() => {
            if (!saveStatePromises.current[messageId]) {
                return;
            }
            delete saveStatePromises.current[messageId];
            savePromiseReject({ message: "Time out loading doc state" });
        }, MESSAGE_TIMEOUT);

        return savePromise;
    }

    function processLoadedDocState(data: Record<string, any>) {
        let coreInfo = JSON.parse(data.coreInfo, serializedComponentsReviver);

        let rendererState = JSON.parse(
            data.rendererState,
            serializedComponentsReviver,
        );

        if (rendererState.__componentNeedingUpdateValue) {
            callAction({
                action: {
                    actionName: "updateValue",
                    componentName: rendererState.__componentNeedingUpdateValue,
                },
                args: { doNotIgnore: true },
            });
        }

        initializeRenderers({
            rendererState,
            coreInfo,
        });

        initialCoreData.current = {
            coreState: JSON.parse(data.coreState, serializedComponentsReviver),
            requestedVariant: JSON.parse(
                coreInfo.generatedVariantString,
                serializedComponentsReviver,
            ),
        };
        initializeCounters.current = data.initializeCounters;
    }

    async function startCore() {
        let thisCoreWorker = coreWorker.current;

        if (coreCreated.current || !thisCoreWorker) {
            //Kill the current core if it exists
            thisCoreWorker = await reinitializeCoreAndTerminateAnimations();
        } else {
            // otherwise, initialize core worker to give it the current DoenetML

            let initializeResult = await initializeCoreWorker({
                coreWorker: thisCoreWorker,
                doenetML,
                flags,
                activityId,
                docId,
                requestedVariantIndex,
                documentStructureCallback,
            });

            if (initializeResult.success === false) {
                setErrMsg(
                    `Error initializing activity: ${initializeResult.errMsg}`,
                );
                return;
            }
        }

        resolveActionPromises.current = {};

        coreCreationInProgress.current = true;

        const dastResult = await thisCoreWorker.generateJavascriptDast(
            {
                coreId: coreId.current,
                userId,
                cid: cid.current,
                theme: darkMode,
                requestedVariant: initialCoreData.current?.requestedVariant,
                stateVariableChanges: initialCoreData.current?.coreState
                    ? JSON.stringify(
                          initialCoreData.current.coreState,
                          serializedComponentsReplacer,
                      )
                    : undefined,
                initializeCounters: initializeCounters.current,
            },
            Comlink.proxy(updateRenderers),
            Comlink.proxy(reportScoreAndStateCallback),
            Comlink.proxy(requestAnimationFrame),
            Comlink.proxy(cancelAnimationFrame),
        );

        if (dastResult.success) {
            if (
                coreInfo.current &&
                JSON.stringify(coreInfo.current) ===
                    JSON.stringify(dastResult.coreInfo) &&
                !errorInitializingRenderers.current &&
                !errorInsideRenderers.current
            ) {
                // we already initialized renderers before core was created and no errors were encountered
                // so don't initialize them again when core sends the initializeRenderers message
            } else {
                initializeRenderers({ coreInfo: dastResult.coreInfo });
                if (errorInsideRenderers.current) {
                    setIgnoreRendererError(true);
                    setIsInErrorState?.(false);
                }
            }

            if (dastResult.errorWarnings) {
                errorWarnings.current = dastResult.errorWarnings;
                setErrorsAndWarningsCallback?.(errorWarnings.current);
            }

            (window as any)["componentRangePieces" + docId] =
                dastResult.componentRangePieces;
        } else {
            setIsInErrorState?.(true);
            setErrMsg(dastResult.errMsg);
        }

        coreCreated.current = true;
        coreCreationInProgress.current = false;
        preventMoreAnimations.current = false;
        // for (let actionArgs of actionsBeforeCoreCreated.current) {
        //     coreWorker.postMessage({
        //         messageType: "requestAction",
        //         args: actionArgs,
        //     });
        // }
        setStage("coreCreated");
        initializedCallback?.({ activityId, docId });
    }

    function requestAnimationFrame({
        action,
        actionArgs,
        delay,
        animationId,
    }: {
        action: { actionName: string; componentName?: string };
        actionArgs: Record<string, any>;
        delay?: number;
        animationId: string;
    }) {
        if (!preventMoreAnimations.current) {
            // create new animationId

            if (delay) {
                // set a time out to call actual request animation frame after a delay
                let timeoutId = window.setTimeout(
                    () =>
                        _requestAnimationFrame({
                            action,
                            actionArgs,
                            animationId,
                        }),
                    delay,
                );
                animationInfo.current[animationId] = { timeoutId };
            } else {
                // call actual request animation frame right away
                animationInfo.current[animationId] = {};
                _requestAnimationFrame({ action, actionArgs, animationId });
            }
        }
    }

    function _requestAnimationFrame({
        action,
        actionArgs,
        animationId,
    }: {
        action: { actionName: string; componentName?: string };
        actionArgs: Record<string, any>;
        animationId: string;
    }) {
        let animationFrameID = window.requestAnimationFrame(() =>
            callAction({
                action,
                args: actionArgs,
            }),
        );

        let animationInfoObj = animationInfo.current[animationId];
        delete animationInfoObj.timeoutId;
        animationInfoObj.animationFrameID = animationFrameID;
    }

    async function cancelAnimationFrame(animationId: string) {
        let animationInfoObj = animationInfo.current[animationId];
        let timeoutId = animationInfoObj?.timeoutId;
        if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
        }
        let animationFrameID = animationInfoObj?.animationFrameID;
        if (animationFrameID !== undefined) {
            window.cancelAnimationFrame(animationFrameID);
        }
        delete animationInfo.current[animationId];
    }

    // TODO: not functioning properly but not currently called anywhere
    async function copyToClipboard({
        text,
        actionId,
    }: {
        text: string;
        actionId?: string;
    }) {
        await navigator.clipboard.writeText(text);

        resolveAction({ actionId });
    }

    function errorHandler() {
        errorInsideRenderers.current = true;

        if (ignoreRendererError) {
            setIgnoreRendererError(false);
        }
    }

    // first, if last parameters don't match props
    // set state to props and record that that need a new core

    let changedState = false;

    const initialPass = lastDoenetML.current === null;

    // if we are just starting and the document isn't being rendered,
    // then just initialize the core worker so that can return document structure
    // but core itself won't actually start
    if (initialPass && !render) {
        let newCoreWorker = createCoreWorker();
        coreWorker.current = newCoreWorker;
        initializeCoreWorker({
            coreWorker: newCoreWorker,
            doenetML,
            flags,
            activityId,
            docId,
            requestedVariantIndex,
            documentStructureCallback,
        });
        return null;
    }

    if (lastDoenetML.current !== doenetML) {
        lastDoenetML.current = doenetML;
        changedState = true;
    }

    if (lastDocId.current !== docId) {
        lastDocId.current = docId;
        changedState = true;
    }

    if (lastActivityId.current !== activityId) {
        lastActivityId.current = activityId;
        changedState = true;
    }

    if (lastAttemptNumber.current !== attemptNumber) {
        lastAttemptNumber.current = attemptNumber;
        changedState = true;
    }

    if (lastRequestedVariantIndex.current !== requestedVariantIndex) {
        lastRequestedVariantIndex.current = requestedVariantIndex;
        changedState = true;
    }

    if (changedState) {
        // Reset error messages, core.
        // Then load state and initialize

        if (errMsg !== null) {
            setErrMsg(null);
            setIsInErrorState?.(false);
        }

        coreId.current = nanoid();
        initialCoreData.current = null;
        coreInfo.current = null;
        setDocumentRenderer(null);
        coreCreated.current = false;
        coreCreationInProgress.current = false;

        setStage("wait");

        loadStateAndInitialize();

        return null;
    }

    if (errMsg !== null) {
        let errorIcon = (
            <Icon
                fontSize="24pt"
                color="red.800"
                as={MdError}
                verticalAlign="middle"
                marginRight="5px"
            />
        );
        return (
            <div
                style={{
                    fontSize: "1.3em",
                    marginLeft: "20px",
                    marginTop: "20px",
                }}
            >
                {errorIcon} {errMsg}
            </div>
        );
    }

    if (stage === "wait") {
        return null;
    }

    if (stage === "readyToCreateCore" && render) {
        startCore();
    } else if (stage === "waitingOnCore" && !render && !coreCreated.current) {
        // we've moved off this doc, but core is still being created
        // so reinitialize core
        reinitializeCoreAndTerminateAnimations();

        setStage("readyToCreateCore");
    }

    if (hidden || !render) {
        return null;
    }

    let noCoreWarning = null;
    let viewerStyle = {
        maxWidth: "850px",
        paddingLeft: "20px",
        paddingRight: "20px",
        backgroundColor: "inherit",
    };
    if (!coreCreated.current) {
        if (!documentRenderer) {
            noCoreWarning = (
                <div style={{ backgroundColor: "lightCyan" }}>
                    <p>Initializing....</p>
                </div>
            );
        }
        viewerStyle.backgroundColor = "#F0F0F0";
    }

    let errorOverview = null;
    if (documentRenderer && errorWarnings.current?.errors.length > 0) {
        let errorStyle = {
            backgroundColor: "#ff9999",
            textAlign: "center" as const,
            borderWidth: 3,
            borderStyle: "solid",
        };
        errorOverview = (
            <div style={errorStyle}>
                <b>This document contains errors!</b>
            </div>
        );
    }

    //Spacing around the whole doenetML document
    return (
        <ErrorBoundary
            setIsInErrorState={setIsInErrorState}
            errorHandler={errorHandler}
            ignoreError={ignoreRendererError}
            coreCreated={coreCreated.current}
        >
            {noCoreWarning}
            <div style={viewerStyle} className="doenet-viewer">
                {errorOverview}
                <DocContext.Provider value={contextForRenderers}>
                    {documentRenderer}
                </DocContext.Provider>
            </div>
        </ErrorBoundary>
    );
}

export async function renderersLoadComponent(
    promises: Promise<any>[],
    rendererClassNames: string[],
) {
    var rendererClasses: Record<string, any> = {};
    for (let [index, promise] of promises.entries()) {
        try {
            let module = await promise;
            rendererClasses[rendererClassNames[index]] = module.default;
        } catch (error) {
            console.log("here:", error);
            throw Error(`loading ${rendererClassNames[index]} failed.`);
        }
    }
    return rendererClasses;
}

type ErrorProps = {
    setIsInErrorState: Function | undefined;
    errorHandler: Function | undefined;
    ignoreError: boolean;
    coreCreated: boolean;
    children?: ReactNode;
};

type ErrorState = { hasError: boolean };

class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
    constructor(props: ErrorProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorState {
        return { hasError: true };
    }
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.setIsInErrorState?.(true);
        this.props.errorHandler?.();
    }
    render() {
        if (this.state.hasError && !this.props.ignoreError) {
            if (!this.props.coreCreated) {
                return null;
            } else {
                return <h1>Something went wrong.</h1>;
            }
        }
        return this.props.children;
    }
}

// TODO: fix this function as it assume conventions that are no longer valid
export function getURLFromRef({
    cid,
    activityId,
    variantIndex,
    edit,
    hash,
    givenUri,
    targetName = "",
    linkSettings,
    search = "",
    id = "",
}: {
    cid?: string;
    activityId?: string;
    variantIndex?: number;
    edit?: boolean;
    hash?: string;
    givenUri?: string;
    targetName?: string;
    linkSettings: Record<string, any>;
    search?: string;
    id?: string;
}) {
    // possible linkSettings
    // - viewURL
    // - editURL
    // - useQueryParameters

    let url = "";
    let targetForATag: string | null = "_blank";
    let haveValidTarget = false;
    let externalUri = false;

    if (cid || activityId) {
        if (cid) {
            if (linkSettings.useQueryParameters) {
                url = `cid=${cid}`;
            } else {
                // TODO: make this URL work for create another URL to reference by cid
                url = `/${cid}`;
            }
        } else {
            if (linkSettings.useQueryParameters) {
                url = `doenetId=${activityId}`;
            } else {
                url = `/${activityId}`;
            }
        }
        if (variantIndex) {
            // TODO: how to specify variant if don't useQueryParameters
            if (linkSettings.useQueryParameters) {
                url += `&variant=${variantIndex}`;
            }
        }

        if (linkSettings.useQueryParameters) {
            let baseUrl =
                edit == true ? linkSettings.editURL : linkSettings.viewURL;
            if (baseUrl.includes("?")) {
                if (baseUrl[baseUrl.length - 1] !== "?") {
                    baseUrl += "&";
                }
            } else {
                baseUrl += "?";
            }
            url = baseUrl + url;
        } else {
            if (edit == true) {
                url = linkSettings.editURL + url;
            } else {
                url = linkSettings.viewURL + url;
            }
        }

        haveValidTarget = true;

        if (hash) {
            url += hash;
        } else {
            if (targetName) {
                url += "#" + cesc(targetName);
            }
        }
    } else if (givenUri) {
        url = givenUri;
        if (
            url.substring(0, 8) === "https://" ||
            url.substring(0, 7) === "http://" ||
            url.substring(0, 7) === "mailto:"
        ) {
            haveValidTarget = true;
            externalUri = true;
        }
    } else {
        url = search;

        let firstSlash = id.indexOf("\\/");
        let prefix = id.substring(0, firstSlash);
        url += "#" + prefix;
        url += cesc(targetName);
        targetForATag = null;
        haveValidTarget = true;
    }
    return { targetForATag, url, haveValidTarget, externalUri };
}
