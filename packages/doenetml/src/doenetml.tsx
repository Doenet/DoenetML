import "./DoenetML.css";
// @ts-ignore
import { prng_alea } from "esm-seedrandom";
import React, { useCallback, useRef, useState } from "react";
import { DocViewer } from "./Viewer/DocViewer";
import { RecoilRoot } from "recoil";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "@doenet/utils";
import type { ErrorDescription, WarningDescription } from "@doenet/utils";
import { VirtualKeyboard } from "@doenet/virtual-keyboard";
import { Box, ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@doenet/virtual-keyboard/style.css";
import { EditorViewer } from "./EditorViewer/EditorViewer.js";
import VariantSelect from "./EditorViewer/VariantSelect";

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
    activityId = "a",
    docId = "1",
    prefixForIds = "",
    userId,
    attemptNumber = 1,
    rendered = true,
    hidden = false,
    requestedVariantIndex,
    updateCreditAchievedCallback,
    setIsInErrorState,
    generatedVariantCallback: specifiedGeneratedVariantCallback,
    setErrorsAndWarningsCallback,
    forceDisable = false,
    forceShowCorrectness = false,
    forceShowSolution = false,
    forceUnsuppressCheckwork = false,
    addVirtualKeyboard = true,
    externalVirtualKeyboardProvided = false,
    location,
    navigate,
    linkSettings,
    scrollableContainer,
    darkMode = "light",
    showAnswerTitles = false,
    includeVariantSelector = false,
}: {
    doenetML: string;
    flags?: DoenetMLFlagsSubset;
    activityId?: string;
    docId?: string;
    prefixForIds?: string;
    userId?: string;
    attemptNumber?: number;
    rendered?: boolean;
    hidden?: boolean;
    requestedVariantIndex?: number;
    updateCreditAchievedCallback?: Function;
    setIsInErrorState?: Function;
    generatedVariantCallback?: Function;
    setErrorsAndWarningsCallback?: Function;
    forceDisable?: boolean;
    forceShowCorrectness?: boolean;
    forceShowSolution?: boolean;
    forceUnsuppressCheckwork?: boolean;
    addVirtualKeyboard?: boolean;
    externalVirtualKeyboardProvided?: boolean;
    location?: any;
    navigate?: any;
    linkSettings?: { viewURL: string; editURL: string };
    scrollableContainer?: HTMLDivElement | Window;
    darkMode?: "dark" | "light";
    showAnswerTitles?: boolean;
    includeVariantSelector?: boolean;
}) {
    const [variants, setVariants] = useState({
        index: 1,
        numVariants: 1,
        allPossibleVariants: ["a"],
    });

    const thisPropSet = [doenetML, activityId, userId, requestedVariantIndex];
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

    const generatedVariantCallback = useCallback(
        (newVariants: any) => {
            specifiedGeneratedVariantCallback?.(newVariants);
            if (includeVariantSelector) {
                setVariants(newVariants);
            }
        },
        [specifiedGeneratedVariantCallback, includeVariantSelector],
    );

    let variantSelector = null;
    if (includeVariantSelector) {
        // if we use a variant selector, then we ignore requestedVariant index
        // and just the index from variants, which will be changed the variant selector
        variantIndex.current = variants.index;

        if (variants.numVariants > 1) {
            variantSelector = (
                <Box bg="doenet.mainGray" h="32px" width="100%">
                    <VariantSelect
                        size="sm"
                        menuWidth="140px"
                        array={variants.allPossibleVariants}
                        syncIndex={variants.index}
                        onChange={(index: number) =>
                            setVariants((prev) => {
                                let next = { ...prev };
                                next.index = index + 1;
                                return next;
                            })
                        }
                    />
                </Box>
            );
        }
    } else {
        // Normalize variant index to an integer.
        // Generate a random variant index if the requested variant index is undefined.
        // To preserve the generated variant index on rerender,
        // regenerate only if one of the props in propSet has changed
        if (thisPropSet.some((v, i) => v !== lastPropSet.current[i])) {
            if (requestedVariantIndex === undefined) {
                let rng = new rngClass();
                requestedVariantIndex = Math.floor(rng() * 1000000) + 1;
            }
            variantIndex.current = Math.round(requestedVariantIndex);
            if (!Number.isInteger(variantIndex.current)) {
                variantIndex.current = 1;
            }
            lastPropSet.current = thisPropSet;
        }
    }

    const keyboard = addVirtualKeyboard ? (
        <VirtualKeyboard
            externalVirtualKeyboardProvided={externalVirtualKeyboardProvided}
        />
    ) : null;

    const viewer = (
        <DocViewer
            doenetML={doenetML}
            flags={flags}
            activityId={activityId}
            docId={docId}
            prefixForIds={prefixForIds}
            userId={userId}
            attemptNumber={attemptNumber}
            rendered={rendered}
            hidden={hidden}
            requestedVariantIndex={variantIndex.current}
            updateCreditAchievedCallback={updateCreditAchievedCallback}
            setIsInErrorState={setIsInErrorState}
            generatedVariantCallback={generatedVariantCallback}
            setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
            forceDisable={forceDisable}
            forceShowCorrectness={forceShowCorrectness}
            forceShowSolution={forceShowSolution}
            forceUnsuppressCheckwork={forceUnsuppressCheckwork}
            location={location}
            navigate={navigate}
            linkSettings={linkSettings}
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
                    {variantSelector}
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
    activityId = "a",
    prefixForIds = "",
    addVirtualKeyboard = true,
    externalVirtualKeyboardProvided = false,
    location,
    navigate,
    linkSettings,
    darkMode = "light",
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
    initialWarnings = [],
}: {
    doenetML: string;
    activityId?: string;
    prefixForIds?: string;
    addVirtualKeyboard?: boolean;
    externalVirtualKeyboardProvided?: boolean;
    location?: any;
    navigate?: any;
    linkSettings?: { viewURL: string; editURL: string };
    darkMode?: "dark" | "light";
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
    initialWarnings?: WarningDescription[];
}) {
    const keyboard = addVirtualKeyboard ? (
        <VirtualKeyboard
            externalVirtualKeyboardProvided={externalVirtualKeyboardProvided}
        />
    ) : null;

    const editor = (
        <EditorViewer
            doenetML={doenetML}
            activityId={activityId}
            location={location}
            navigate={navigate}
            prefixForIds={prefixForIds}
            linkSettings={linkSettings}
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
            initialWarnings={initialWarnings}
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
