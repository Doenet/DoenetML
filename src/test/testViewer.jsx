import React, { useState } from "react";
import { DoenetML } from "../../dist/doenetml";
import doenetML from "./testCode.doenet?raw";
import Button from "../uiComponents/Button";

export default function TestViewer() {
  const defaultTestSettings = {
    requestedVariantIndex: 1,
    showCorrectness: true,
    readOnly: false,
    showFeedback: true,
    showHints: true,
  };

  const [controlsVisible, setControlsVisible] = useState(false);
  const [testSettings, setTestSettings] = useState(defaultTestSettings);
  const [updateNumber, setUpdateNumber] = useState(0);

  let {
    requestedVariantIndex,
    showCorrectness,
    readOnly,
    showFeedback,
    showHints,
  } = testSettings;

  let controls = null;
  let buttonText = "show";
  if (controlsVisible) {
    buttonText = "hide";
    controls = (
      <div style={{ padding: "8px" }}>
        <p>
          The DoenetML is displayed is loaded from the file:{" "}
          <code>src/test/testCode.doenet</code>.
        </p>

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
            {" "}
            <input
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
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          backgroundColor: "#e3e3e3",
          marginBottom: "12px",
          padding: "8px",
        }}
      >
        <h3>
          <div style={{ display: "flex" }}>
            Test DoenetML
            <Button
              onClick={() => setControlsVisible((was) => !was)}
              value={buttonText + " controls"}
              style={{ marginLeft: "12px" }}
            />
          </div>
        </h3>
        {controls}
      </div>
      <DoenetML
        key={"doenetml" + updateNumber}
        doenetML={doenetML}
        flags={{
          showCorrectness,
          readOnly,
          showFeedback,
          showHints,
        }}
        addVirtualKeyboard={true}
      />
    </div>
  );
}
