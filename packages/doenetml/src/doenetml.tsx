import "./DoenetML.css";
// @ts-ignore
import { prng_alea } from "esm-seedrandom";
import React, { useRef } from "react";
import { ActivityViewer } from "./Viewer/ActivityViewer";
import { RecoilRoot } from "recoil";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig, ErrorDescription } from "@doenet/utils";
import { VirtualKeyboard } from "@doenet/virtual-keyboard";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@doenet/virtual-keyboard/style.css";
import { EditorViewer } from "./EditorViewer/EditorViewer.js";

export const version: string = DOENETML_VERSION;

export type DoenetMLFlags = {
    showCorrectness: boolean;
    readOnly: boolean;
    solutionDisplayMode: string;
    showFeedback: boolean;
    showHints: boolean;
    allowLoadState: boolean;
    allowSaveState: boolean;
    allowLocalState: boolean;
    allowSaveSubmissions: boolean;
    allowSaveEvents: boolean;
    autoSubmit: boolean;
};

type DoenetMLFlagsSubset = Partial<DoenetMLFlags>;

export const defaultFlags: DoenetMLFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveSubmissions: false,
    allowSaveEvents: false,
    autoSubmit: false,
};

let rngClass = prng_alea;

/**
 * this is a hack for react-mathqill
 * error: global is not defined
 */
window.global = window.global || window;

const theme = extendTheme({
    fonts: {
        body: "Jost",
    },
    textStyles: {
        primary: {
            fontFamily: "Jost",
        },
    },
    config: {
        initialColorMode: "light",
        useSystemColorMode: false,
        // initialColorMode: "system",
        // useSystemColorMode: true,
    },
    colors: {
        doenet: {
            mainBlue: "#1a5a99",
            lightBlue: "#b8d2ea",
            solidLightBlue: "#8fb8de",
            mainGray: "#e3e3e3",
            mediumGray: "#949494",
            lightGray: "#e7e7e7",
            donutBody: "#eea177",
            donutTopping: "#6d4445",
            mainRed: "#c1292e",
            lightRed: "#eab8b8",
            mainGreen: "#459152",
            canvas: "#ffffff",
            canvastext: "#000000",
            lightGreen: "#a6f19f",
            lightYellow: "#f5ed85",
            whiteBlankLink: "#6d4445",
            mainYellow: "#94610a",
            mainPurple: "#4a03d9",
        },
    },
});

export function DoenetViewer({
    doenetML,
    flags: specifiedFlags = {},
    cid,
    activityId,
    userId,
    attemptNumber = 1,
    requestedVariantIndex,
    updateCreditAchievedCallback,
    updateActivityStatusCallback,
    updateAttemptNumber,
    pageChangedCallback,
    paginate = false,
    showFinishButton,
    cidChangedCallback,
    checkIfCidChanged,
    setActivityAsCompleted,
    setIsInErrorState,
    apiURLs,
    generatedVariantCallback,
    setErrorsAndWarningsCallback,
    forceDisable = false,
    forceShowCorrectness = false,
    forceShowSolution = false,
    forceUnsuppressCheckwork = false,
    addVirtualKeyboard = true,
    addBottomPadding = false,
    location,
    navigate,
    updateDataOnContentChange = false,
    idsIncludeActivityId = true,
    linkSettings,
    scrollableContainer,
    darkMode,
    showAnswerTitles = false,
}: {
    doenetML: string;
    flags?: DoenetMLFlagsSubset;
    cid?: string;
    activityId?: string;
    userId?: string;
    attemptNumber?: number;
    requestedVariantIndex?: number;
    updateCreditAchievedCallback?: Function;
    updateActivityStatusCallback?: Function;
    updateAttemptNumber?: Function;
    pageChangedCallback?: Function;
    paginate?: boolean;
    showFinishButton?: boolean;
    cidChangedCallback?: Function;
    checkIfCidChanged?: Function;
    setActivityAsCompleted?: Function;
    setIsInErrorState?: Function;
    apiURLs?: any;
    generatedVariantCallback?: Function;
    setErrorsAndWarningsCallback?: Function;
    forceDisable?: boolean;
    forceShowCorrectness?: boolean;
    forceShowSolution?: boolean;
    forceUnsuppressCheckwork?: boolean;
    addVirtualKeyboard?: boolean;
    addBottomPadding?: boolean;
    location?: any;
    navigate?: any;
    updateDataOnContentChange?: boolean;
    idsIncludeActivityId?: boolean;
    linkSettings?: { viewURL: string; editURL: string };
    scrollableContainer?: HTMLDivElement | Window;
    darkMode?: string;
    showAnswerTitles?: boolean;
}) {
    const thisPropSet = [
        doenetML,
        cid,
        activityId,
        userId,
        requestedVariantIndex,
    ];
    const lastPropSet = useRef<any[]>([]);

    const variantIndex = useRef(1);

    const flags: DoenetMLFlags = { ...defaultFlags, ...specifiedFlags };

    if (userId) {
        // if userId was specified, then we're viewing results of someone other than the logged in person
        // so disable saving state
        // and disable even looking up state from local storage (as we want to get the state from the database)
        flags.allowLocalState = false;
        flags.allowSaveState = false;
    } else if (flags.allowSaveState) {
        // allowSaveState implies allowLoadState
        // Rationale: saving state will result in loading a new state if another device changed it
        flags.allowLoadState = true;
    }

    // Normalize variant index to an integer.
    // Generate a random variant index if the requested variant index is undefined.
    // To preserve the generated variant index on rerender,
    // regenerate only if one of the props in propSet has changed
    if (thisPropSet.some((v, i) => v !== lastPropSet.current[i])) {
        if (requestedVariantIndex === undefined) {
            let rng = new rngClass(new Date());
            requestedVariantIndex = Math.floor(rng() * 1000000) + 1;
        }
        variantIndex.current = Math.round(requestedVariantIndex);
        if (!Number.isInteger(variantIndex.current)) {
            variantIndex.current = 1;
        }
        lastPropSet.current = thisPropSet;
    }

    const keyboard = addVirtualKeyboard ? <VirtualKeyboard /> : null;

    const viewer = (
        <ActivityViewer
            doenetML={doenetML}
            updateDataOnContentChange={updateDataOnContentChange}
            flags={flags}
            cid={cid}
            activityId={activityId}
            userId={userId}
            attemptNumber={attemptNumber}
            requestedVariantIndex={variantIndex.current}
            updateCreditAchievedCallback={updateCreditAchievedCallback}
            updateActivityStatusCallback={updateActivityStatusCallback}
            updateAttemptNumber={updateAttemptNumber}
            pageChangedCallback={pageChangedCallback}
            paginate={paginate}
            showFinishButton={showFinishButton}
            cidChangedCallback={cidChangedCallback}
            checkIfCidChanged={checkIfCidChanged}
            setActivityAsCompleted={setActivityAsCompleted}
            setIsInErrorState={setIsInErrorState}
            apiURLs={apiURLs}
            generatedVariantCallback={generatedVariantCallback}
            setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
            forceDisable={forceDisable}
            forceShowCorrectness={forceShowCorrectness}
            forceShowSolution={forceShowSolution}
            forceUnsuppressCheckwork={forceUnsuppressCheckwork}
            location={location}
            navigate={navigate}
            idsIncludeActivityId={idsIncludeActivityId}
            linkSettings={linkSettings}
            addBottomPadding={addBottomPadding}
            scrollableContainer={scrollableContainer}
            darkMode={darkMode}
            showAnswerTitles={showAnswerTitles}
        />
    );

    return (
        <ChakraProvider
            theme={theme}
            resetScope=".before-keyboard"
            disableGlobalStyle
        >
            <RecoilRoot>
                <MathJaxContext version={3} config={mathjaxConfig}>
                    {viewer}
                    <div className="before-keyboard" />
                    {keyboard}
                </MathJaxContext>
            </RecoilRoot>
        </ChakraProvider>
    );
}

export function DoenetEditor({
    doenetML,
    activityId,
    paginate = false,
    addVirtualKeyboard = true,
    addBottomPadding = false,
    location,
    navigate,
    idsIncludeActivityId = true,
    linkSettings,
    darkMode,
    showAnswerTitles = false,
    width,
    height,
    viewerLocation,
    backgroundColor,
    showViewer,
    doenetmlChangeCallback,
    immediateDoenetmlChangeCallback,
    id,
    readOnly = false,
    showFormatter = true,
    showErrorsWarnings = true,
    border = "1px solid",
    initialErrors = [],
}: {
    doenetML: string;
    activityId?: string;
    paginate?: boolean;
    addVirtualKeyboard?: boolean;
    addBottomPadding?: boolean;
    location?: any;
    navigate?: any;
    idsIncludeActivityId?: boolean;
    linkSettings?: { viewURL: string; editURL: string };
    darkMode?: string;
    showAnswerTitles?: boolean;
    width?: string;
    height?: string;
    viewerLocation?: "left" | "right" | "top" | "bottom";
    backgroundColor?: string;
    showViewer?: boolean;
    doenetmlChangeCallback?: Function;
    immediateDoenetmlChangeCallback?: Function;
    id?: string;
    readOnly?: boolean;
    showFormatter?: boolean;
    showErrorsWarnings?: boolean;
    border?: string;
    initialErrors?: ErrorDescription[];
}) {
    const keyboard = addVirtualKeyboard ? <VirtualKeyboard /> : null;

    const editor = (
        <EditorViewer
            doenetML={doenetML}
            activityId={activityId}
            paginate={paginate}
            location={location}
            navigate={navigate}
            idsIncludeActivityId={idsIncludeActivityId}
            linkSettings={linkSettings}
            addBottomPadding={addBottomPadding}
            darkMode={darkMode}
            showAnswerTitles={showAnswerTitles}
            width={width}
            height={height}
            viewerLocation={viewerLocation}
            backgroundColor={backgroundColor}
            showViewer={showViewer}
            doenetmlChangeCallback={doenetmlChangeCallback}
            immediateDoenetmlChangeCallback={immediateDoenetmlChangeCallback}
            id={id}
            readOnly={readOnly}
            showFormatter={showFormatter}
            showErrorsWarnings={showErrorsWarnings}
            border={border}
            initialErrors={initialErrors}
        />
    );

    return (
        <ChakraProvider
            theme={theme}
            resetScope=".before-keyboard"
            disableGlobalStyle
        >
            <RecoilRoot>
                <MathJaxContext version={3} config={mathjaxConfig}>
                    {editor}
                    <div className="before-keyboard" />
                    {keyboard}
                </MathJaxContext>
            </RecoilRoot>
        </ChakraProvider>
    );
}
