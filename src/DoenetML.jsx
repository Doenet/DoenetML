import "./DoenetML.css";
import React from "react";
import ActivityViewer from "./Viewer/ActivityViewer.jsx";
import { RecoilRoot } from "recoil";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "./Core/utils/math.js";
import DarkmodeController from "./Tools/DarkmodeController.jsx";
import VirtualKeyboard from "./Tools/Footers/VirtualKeyboard";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

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
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
        letterSpacing: ".5px",
        _focus: {
          outline: "2px solid #2D5994",
          outlineOffset: "2px",
        },
        _disabled: {
          bg: "#E2E2E2",
          color: "black",
          cursor: "none",
        },
      },
      variants: {
        // We can override existing variants
        solid: {
          bg: "doenet.mainBlue",
          color: "white",
          _hover: {
            bg: "doenet.solidLightBlue",
            color: "black",
          },
        },
        outline: {
          borderColor: "#2D5994",
          _hover: {
            bg: "solidLightBlue",
          },
        },
        ghost: {
          _hover: {
            bg: "solidLightBlue",
          },
        },
        link: {
          color: "solidLightBlue",
        },
      },
    },
  },
});

export default function DoenetML({
  doenetML,
  flags = {},
  cid,
  activityId = "",
  userId,
  attemptNumber,
  requestedVariantIndex,
  updateCreditAchievedCallback,
  updateActivityStatusCallback,
  updateAttemptNumber,
  pageChangedCallback,
  paginate,
  showFinishButton,
  cidChangedCallback,
  checkIfCidChanged,
  setActivityAsCompleted,
  setIsInErrorState,
  apiURLs,
  generatedVariantCallback,
  forceDisable,
  forceShowCorrectness,
  forceShowSolution,
  forceUnsuppressCheckwork,
  addVirtualKeyboard = true,
  location,
  navigate,
  allowMultipageActivities = true,
  updateDataOnContentChange = false,
  idsIncludeActivityId = true,
}) {
  const defaultFlags = {
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

  flags = { ...defaultFlags, ...flags };

  let keyboard = null;

  if (addVirtualKeyboard) {
    keyboard = <VirtualKeyboard />;
  }

  return (
    <ChakraProvider
      theme={theme}
      resetScope=".before-keyboard"
      disableGlobalStyle
    >
      <RecoilRoot>
        <DarkmodeController>
          <MathJaxContext
            version={2}
            config={mathjaxConfig}
            onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
          >
            <ActivityViewer
              activityDefinition={doenetML}
              updateDataOnContentChange={updateDataOnContentChange}
              flags={flags}
              cid={cid}
              activityId={activityId}
              userId={userId}
              attemptNumber={attemptNumber}
              requestedVariantIndex={requestedVariantIndex}
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
              forceDisable={forceDisable}
              forceShowCorrectness={forceShowCorrectness}
              forceShowSolution={forceShowSolution}
              forceUnsuppressCheckwork={forceUnsuppressCheckwork}
              location={location}
              navigate={navigate}
              allowMultipageActivities={allowMultipageActivities}
              idsIncludeActivityId={idsIncludeActivityId}
            />
            <div className="before-keyboard" />
            {keyboard}
          </MathJaxContext>
        </DarkmodeController>
      </RecoilRoot>
    </ChakraProvider>
  );
}
