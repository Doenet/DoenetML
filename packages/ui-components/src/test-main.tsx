/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "./uiComponents/Button";
import { ActionButton } from "./uiComponents/ActionButton";
import { ActionButtonGroup } from "./uiComponents/ActionButtonGroup";
import { ToggleButton } from "./uiComponents/ToggleButton";
import { ToggleButtonGroup } from "./uiComponents/ToggleButtonGroup";
import { MathJaxContext } from "better-react-mathjax";
import "@doenet/doenetml/style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <MathJaxContext
        version={3}
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js"
        config={{
            startup: {
                typeset: true,
            },
        }}
    >
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </MathJaxContext>,
);

function App() {
    const [toggleState, setToggleState] = React.useState(false);

    return (
        <div
            style={{
                padding: "20px",
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f0f0",
            }}
        >
            <h3>Button</h3>
            <Button
                id="test-button"
                onClick={() => console.log("Button clicked!")}
                disabled={false}
                value={"$\\frac{2}{2}$"}
                valueHasLatex={true}
                //fillColor="#888"
            />
            <h3>ActionButton</h3>
            <ActionButton
                id="test-action-button"
                onClick={() => console.log("ActionButton clicked!")}
                disabled={false}
                value={"Hi there"}
            />
            <h3>ActionButtonGroup</h3>
            <ActionButtonGroup vertical={true}>
                <ActionButton
                    id="action-button-1"
                    onClick={() => console.log("ActionButton 1 clicked!")}
                    disabled={false}
                    value={"Prev"}
                />
                <ActionButton
                    id="action-button-2"
                    onClick={() => console.log("ActionButton 2 clicked!")}
                    disabled={false}
                    value={"Next"}
                />
            </ActionButtonGroup>
            <ActionButtonGroup vertical={false}>
                <ActionButton
                    id="action-button-1"
                    onClick={() => console.log("ActionButton 1 clicked!")}
                    disabled={false}
                    value={"Prev"}
                />
                <ActionButton
                    id="action-button-2"
                    onClick={() => console.log("ActionButton 2 clicked!")}
                    disabled={false}
                    value={"Next"}
                />
            </ActionButtonGroup>
            <h3>ToggleButton</h3>
            <ToggleButton
                id="test-toggle-button"
                onClick={() => {
                    setToggleState(!toggleState);
                    console.log("ToggleButton clicked!", toggleState);
                }}
                disabled={false}
                value={"Toggle Me"}
                isSelected={toggleState}
            />
            <h3>ToggleButtonGroup</h3>
            <ToggleButtonGroup
                onClick={(e) => console.log("ToggleButtonGroup clicked!", e)}
            >
                <ToggleButton value="Add/Remove points"></ToggleButton>
                <ToggleButton value="Toggle points and intervals"></ToggleButton>
                <ToggleButton value="Move Points"></ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
