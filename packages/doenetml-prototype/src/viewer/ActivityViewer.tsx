import React, { useCallback, useEffect, useRef, useState } from "react";
import { DoenetMLFlags } from "../DoenetML";
import {
    extractDastErrors,
    lezerToDast,
    DastRoot,
    DastError,
} from "@doenet/parser";
import {
    createCoreWorker,
    initializeCoreWorker,
    normalizeDocumentDast,
} from "../utils/activityUtils";
import { doenetGlobalConfig } from "../global-config";

export function ActivityViewer({
    doenetML: doenetMLFromProps,
    flags,
    cid: cidFromProps,
    activityId,
    userId,
    attemptNumber: attemptNumberFromProps,
    requestedVariantIndex: requestedVariantIndexFromProps,
    apiURLs = {},
    generatedVariantCallback,
    setErrorsAndWarningsCallback,
    forceDisable,
    forceShowCorrectness,
    forceShowSolution,
    forceUnsuppressCheckwork,
    idsIncludeActivityId = true,
    addBottomPadding = true,
    darkMode,
}: {
    doenetML: string;
    flags: DoenetMLFlags;
    cid: string;
    activityId: string;
    userId: string;
    attemptNumber: number;
    requestedVariantIndex: number;
    apiURLs: {};
    generatedVariantCallback: Function;
    setErrorsAndWarningsCallback: Function;
    forceDisable: boolean;
    forceShowCorrectness: boolean;
    forceShowSolution: boolean;
    forceUnsuppressCheckwork: boolean;
    idsIncludeActivityId: boolean;
    addBottomPadding: boolean;
    darkMode: string;
}) {
    const [coreWorker, setCoreWorker] = useState(createCoreWorker());

    const [dast, setDast]: [DastRoot | undefined, Function] =
        useState(undefined);

    const [dastErrors, setDastErrors]: [DastError[] | undefined, Function] =
        useState(undefined);

    const [coreInitialized, setCoreInitialized] = useState(false);

    const [isInErrorState, setIsInErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // For now, just take DoenetML from props and ignore cid

    const doenetML = doenetMLFromProps;

    useEffect(() => {
        return () => {
            coreWorker.postMessage({
                messageType: "terminate",
            });
        };
    }, []);

    useEffect(() => {
        let new_dast = normalizeDocumentDast(lezerToDast(doenetML));
        let new_errors = extractDastErrors(new_dast);
        setDast(new_dast);
        setDastErrors(new_errors);

        console.log("dast:", new_dast);

        console.log("errors:", new_errors);
    }, [doenetML]);

    useEffect(() => {
        if (dast) {
            initializeCoreWorker({
                coreWorker,
                doenetML,
                dast,
                flags,
            })
                .then(() => {
                    setCoreInitialized(true);
                })
                .catch((e: Error) => {
                    setIsInErrorState(true);
                    setErrorMsg(e.message);
                });
        }
    }, [dast, coreWorker]);

    useEffect(() => {
        coreWorker.onmessage = function (e) {
            // console.log("message from core", e.data);
            if (e.data.messageType === "updateRenderers") {
                // if (
                //     e.data.init &&
                //     coreInfo.current &&
                //     !errorInitializingRenderers.current &&
                //     !errorInsideRenderers.current &&
                //     !(hideWhenNotCurrent && !pageIsCurrent)
                // ) {
                //     // we don't initialize renderer state values if already have a coreInfo
                //     // and no errors were encountered
                //     // as we must have already gotten the renderer information before core was created.
                //     // Exception if page is not current and we hide the page when it is not current,
                //     // then we still update the renderers.
                //     // This exception is important because, in this case,
                //     // the renderers have not yet been rendered, so any errors would not yet have revealed
                //     // (and for the same reason, there cannot have been any user actions queued)
                // } else {
                //     updateRenderers(e.data.args);
                //     if (errorInsideRenderers.current) {
                //         setIgnoreRendererError(true);
                //         setIsInErrorState?.(false);
                //     }
                // }
            } else if (e.data.messageType === "coreCreated") {
                // coreCreated.current = true;
                // coreCreationInProgress.current = false;
                // preventMoreAnimations.current = false;
                // for (let actionArgs of actionsBeforeCoreCreated.current) {
                //     coreWorkerInfo.coreWorker.postMessage({
                //         messageType: "requestAction",
                //         args: actionArgs,
                //     });
                // }
                // setStage("coreCreated");
                // coreCreatedCallback?.();
            } else if (e.data.messageType === "initializeRenderers") {
                // if (
                //     coreInfo.current &&
                //     JSON.stringify(coreInfo.current) ===
                //         JSON.stringify(e.data.args.coreInfo) &&
                //     !errorInitializingRenderers.current &&
                //     !errorInsideRenderers.current
                // ) {
                //     // we already initialized renderers before core was created and no errors were encountered
                //     // so don't initialize them again when core sends the initializeRenderers message
                // } else {
                //     initializeRenderers(e.data.args);
                //     if (errorInsideRenderers.current) {
                //         setIgnoreRendererError(true);
                //         setIsInErrorState?.(false);
                //     }
                // }
            } else if (e.data.messageType === "sendAlert") {
                console.log(`Sending alert message: ${e.data.args.message}`);
                // sendAlert(e.data.args.message, e.data.args.alertType);
            } else if (e.data.messageType === "resolveAction") {
                // resolveAction(e.data.args);
            } else if (e.data.messageType === "inErrorState") {
                setIsInErrorState(true);
                setErrorMsg(e.data.args.errMsg);
            } else if (e.data.messageType === "terminated") {
                // reinitializeCoreAndTerminateAnimations();
            }
        };
    }, [coreWorker]);

    useEffect(() => {
        if (coreInitialized) {
            coreWorker.postMessage({
                messageType: "createCore",
                args: {
                    // coreId: coreId.current,
                    userId,
                    // cid,
                    activityId,
                    // previousComponentTypeCounts,
                    // cidForActivity,
                    theme: darkMode,
                    // requestedVariantIndex,
                    // pageNumber,
                    // attemptNumber,
                    // itemNumber,
                    // requestedVariant: initialCoreData.current.requestedVariant,
                    // stateVariableChanges: initialCoreData.current.coreState
                    //     ? initialCoreData.current.coreState
                    //     : undefined,
                    apiURLs: apiURLs,
                },
            });
        }
    }, [coreInitialized]);

    if (isInErrorState) {
        return `Error: ${errorMsg}`;
    }

    return <p>Hello!</p>;
}
