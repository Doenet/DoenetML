import React, { useState, useEffect, useRef } from "react";
import DoenetML from "../../DoenetML.jsx";
// import testCodeDoenetML from './testCode.doenet';

function Test() {
  // console.log("===Test")

  // console.error("I threw an error");

  const [doenetML, setDoenetML] = useState(null);

  // //New PageViewer when code changes
  // useEffect(() => {
  //   setDoenetML(testCodeDoenetML);
  // }, [testCodeDoenetML]);

  const defaultTestSettings = {
    attemptNumber: 1,
    showCorrectness: true,
    readOnly: false,
    showFeedback: true,
    showHints: true,
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveSubmissions: false,
    allowSaveEvents: false,
  };

  const [controlsVisible, setControlsVisible] = useState(false);
  const [testSettings, setTestSettings] = useState(defaultTestSettings);
  const [updateNumber, setUpdateNumber] = useState(0);

  let {
    attemptNumber,
    showCorrectness,
    readOnly,
    showFeedback,
    showHints,
    allowLoadState,
    allowSaveState,
    allowLocalState,
    allowSaveSubmissions,
    allowSaveEvents,
  } = testSettings;

  // requestedVariantIndex is undefined by default so that viewer
  // will use attemptNumber for variant
  // unless get a message (from cypress) to select a particular variant
  let requestedVariantIndex = useRef(undefined);

  //For Cypress Test Use
  window.onmessage = (e) => {
    if (e.data.doenetML !== undefined) {
      setDoenetML(e.data.doenetML);
    }

    if (e.data.requestedVariantIndex !== undefined) {
      requestedVariantIndex.current = e.data.requestedVariantIndex;
    }
    setUpdateNumber((was) => was + 1);
  };

  let controls = null;
  let buttonText = "show";
  if (controlsVisible) {
    buttonText = "hide";
    controls = (
      <div style={{ padding: "8px" }}>
        <div>
          <Button
            onClick={() => {
              setTestSettings(defaultTestSettings);
              setUpdateNumber((was) => was + 1);
            }}
            value="Reset"
          />
        </div>
        <hr />
        <div>
          <label>
            Attempt Number: {attemptNumber}{" "}
            <button
              id="testRunner_newAttempt"
              onClick={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.attemptNumber = was.attemptNumber + 1;
                  return newObj;
                });
              }}
            >
              New Attempt
            </button>{" "}
            <button
              onClick={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.attemptNumber = 1;
                  return newObj;
                });
              }}
            >
              Reset Attempt Number
            </button>
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_showCorrectness"
              type="checkbox"
              checked={showCorrectness}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.showCorrectness = !was.showCorrectness;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Show Correctness
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_readOnly"
              type="checkbox"
              checked={readOnly}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.readOnly = !was.readOnly;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Read Only
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_showFeedback"
              type="checkbox"
              checked={showFeedback}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.showFeedback = !was.showFeedback;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Show Feedback
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_showHints"
              type="checkbox"
              checked={showHints}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.showHints = !was.showHints;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Show Hints
          </label>
        </div>
        <hr />
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowLoadState"
              type="checkbox"
              checked={allowLoadState}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.allowLoadState = !was.allowLoadState;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Load Page State
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowSaveState"
              type="checkbox"
              checked={allowSaveState}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.allowSaveState = !was.allowSaveState;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Save Page State
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowLocalState"
              type="checkbox"
              checked={allowLocalState}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.allowLocalState = !was.allowLocalState;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Local Page State
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowSaveSubmissions"
              type="checkbox"
              checked={allowSaveSubmissions}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.allowSaveSubmissions = !was.allowSaveSubmissions;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Save Submissions
          </label>
        </div>
        <div>
          <label>
            {" "}
            <input
              id="testRunner_allowSaveEvents"
              type="checkbox"
              checked={allowSaveEvents}
              onChange={() => {
                setTestSettings((was) => {
                  let newObj = { ...was };
                  newObj.allowSaveEvents = !was.allowSaveEvents;
                  return newObj;
                });
                setUpdateNumber((was) => was + 1);
              }}
            />
            Allow Save Events
          </label>
        </div>
      </div>
    );
  }

  let viewer = null;
  if (doenetML !== null) {
    viewer = (
      <DoenetML
        key={"doenetml" + updateNumber}
        doenetML={doenetML}
        // cid={"185fd09b6939d867d4faee82393d4a879a2051196b476acdca26140864bc967a"}
        updateDataOnContentChange={true}
        flags={{
          showCorrectness,
          readOnly,
          solutionDisplayMode: "button",
          showFeedback,
          showHints,
          allowLoadState,
          allowSaveState,
          allowLocalState,
          allowSaveSubmissions,
          allowSaveEvents,
        }}
        attemptNumber={attemptNumber}
        requestedVariantIndex={requestedVariantIndex.current}
        doenetId="doenetIdFromCypress"
      />
    );
  }

  return (
    <>
      <div style={{ backgroundColor: "var(--mainGray)" }}>
        <h3>
          <button
            id="testRunner_toggleControls"
            onClick={() => setControlsVisible((was) => !was)}
          >
            {buttonText} controls
          </button>
          Test Viewer and Core
        </h3>
        {controls}
      </div>
      {viewer}
    </>
  );
}

// if (import.meta.hot) {
//   import.meta.hot.accept();
//   // import.meta.hot.accept(({module}) => {
//   //   Test = module.default;
//   //   console.log(">>>ACCEPT CALLED in test!!!!!!!!!",module.default)
//   //   console.log(">>>module",module)
//   // }
//   // );
// }

export default Test;
