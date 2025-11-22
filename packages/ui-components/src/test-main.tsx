/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "./components/Button";
import { ActionButton } from "./components/ActionButton";
import { ActionButtonGroup } from "./components/ActionButtonGroup";
import { ToggleButton } from "./components/ToggleButton";
import { ToggleButtonGroup } from "./components/ToggleButtonGroup";
import { MathJaxContext } from "better-react-mathjax";
import { BsChevronBarContract } from "react-icons/bs";
import "@doenet/doenetml/style.css";
import "./test-main.css";
import { ResizablePanelPair } from "./components/ResizablePanelPair";
import { ResizableCollapsiblePanelPair } from "./components/ResizableCollapsiblePanelPair";
import { UiButton } from "./components/UiButton";

// For the CSS
import ".";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <MathJaxContext
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
    const [panelOpenState, setPanelOpenState] = React.useState(false);

    return (
        <div
            style={{
                padding: "20px",
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f0f0",
                boxSizing: "border-box",
            }}
        >
            <h3>UiButton</h3>
            <UiButton onClick={() => console.log("UiButton clicked!")}>
                The UI Button
            </UiButton>
            <h3>Button</h3>
            <Button
                id="test-button"
                onClick={() => console.log("Button clicked!")}
                disabled={false}
                value={"$\\frac{2}{2}$"}
                valueHasLatex={true}
                label={"Hi there"}
                //fillColor="#888"
            />
            <Button
                id="test-button"
                onClick={() => console.log("Button clicked!")}
                disabled={false}
                value={"$\\frac{2}{2}$"}
                valueHasLatex={true}
                label={"Hi there"}
                vertical={true}
                fillColor="#888"
            />
            <Button
                id="test-button"
                onClick={() => console.log("Button clicked!")}
                disabled={false}
                value={"$\\frac{2}{2}$"}
                valueHasLatex={true}
                icon={<BsChevronBarContract />}
                //fillColor="#888"
            />
            <Button
                id="test-button"
                onClick={() => console.log("Button clicked!")}
                disabled={false}
                value={"Alert button"}
                alert={true}
            />
            <Button
                id="test-button"
                onClick={() => console.log("Button clicked!")}
                disabled={false}
                icon={<BsChevronBarContract />}
            />
            <Button
                id="test-button"
                onClick={() => console.log("Button clicked!")}
                disabled={true}
                icon={<BsChevronBarContract />}
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
                    value={"Next one"}
                />
            </ActionButtonGroup>
            <ActionButtonGroup vertical={false}>
                <ActionButton
                    id="action-button-1"
                    onClick={() => console.log("ActionButton 1 clicked!")}
                    disabled={false}
                    value={"Prev"}
                />
                <ActionButton>
                    Middle
                    <br />
                    Tall
                </ActionButton>
                <ActionButton
                    id="action-button-2"
                    onClick={() => console.log("ActionButton 2 clicked!")}
                    disabled={false}
                    value={"Next one"}
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
            <ToggleButtonGroup
                onClick={(e) => console.log("ToggleButtonGroup clicked!", e)}
                vertical={true}
            >
                <ToggleButton value="Add/Remove points"></ToggleButton>
                <ToggleButton value="Toggle points and intervals"></ToggleButton>
                <ToggleButton value="Move Points"></ToggleButton>
            </ToggleButtonGroup>

            <h3>Resizable Pair</h3>

            <div
                style={{
                    height: "100px",
                    width: "100%",
                    boxSizing: "border-box",
                }}
            >
                <ResizablePanelPair
                    panelA={
                        <div>
                            Hi there
                            <br />
                            More stuff
                        </div>
                    }
                    panelB={<div>And here</div>}
                />
            </div>
            <div
                style={{
                    height: "200px",
                    width: "100%",
                    border: "1px dashed black",
                }}
            >
                <ResizableCollapsiblePanelPair
                    mainPanel={<div>I'm the main panel</div>}
                    subPanel={<div>I'm the sub panel</div>}
                    alwaysVisiblePanel={
                        <div style={{ backgroundColor: "#ddd" }}>
                            I'm always visible
                        </div>
                    }
                    setIsOpen={setPanelOpenState}
                    isOpen={panelOpenState}
                />
                <button onClick={() => setPanelOpenState(!panelOpenState)}>
                    Toggle Open State ({"" + panelOpenState})
                </button>
            </div>
        </div>
    );
}
