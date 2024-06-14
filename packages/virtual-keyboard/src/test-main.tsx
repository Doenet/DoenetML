/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { focusedMathField } from "./MathInputSelector";
import { VirtualKeyboard } from "./virtual-keyboard";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { MathJaxContext } from "better-react-mathjax";
import { ChakraProvider } from "@chakra-ui/react";
import { Keyboard, ManagedKeyboard } from "./virtual-keyboard-new";
import { UniqueKeyboardTray } from "./virtual-keyboard-new/unique-keyboard-tray";
import { KeyboardTray } from "./virtual-keyboard-new/keyboard-tray";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.Fragment>
        <ManagedKeyboard onClick={(e) => console.log("keyboard event", e)} />
        <ChakraProvider>
            <RecoilRoot>
                <App />
            </RecoilRoot>
        </ChakraProvider>
    </React.Fragment>,
);

function App() {
    const [text, setText] = React.useState("Some Text");
    const [lastCommand, setLastCommand] = React.useState("");
    const setFocusedField = useSetRecoilState(focusedMathField);
    React.useEffect(() => {
        setFocusedField(() => (cmd: string) => {
            setLastCommand(cmd);
        });
    }, []);
    const [firstKeyboardPresent, setFirstKeyboardPresent] =
        React.useState(true);
    const [secondKeyboardPresent, setSecondKeyboardPresent] =
        React.useState(true);

    return (
        <div>
            <h4>Test the VirtualKeyboard</h4>
            <button
                onClick={() => setFirstKeyboardPresent((o) => !o)}
                style={{
                    backgroundColor: "lightgray",
                    border: "1px solid black",
                    borderRadius: 5,
                    margin: 2,
                    padding: 4,
                }}
            >
                First keyboard active {"" + firstKeyboardPresent}
            </button>
            <button
                onClick={() => setSecondKeyboardPresent((o) => !o)}
                style={{
                    backgroundColor: "lightgray",
                    border: "1px solid black",
                    borderRadius: 5,
                    margin: 2,
                    padding: 4,
                }}
            >
                Second keyboard active {"" + secondKeyboardPresent}
            </button>
            {firstKeyboardPresent && (
                <UniqueKeyboardTray
                    onClick={() => console.log("first keyboard was clicked")}
                />
            )}
            {secondKeyboardPresent && (
                <UniqueKeyboardTray
                    onClick={() => console.log("second keyboard was clicked")}
                />
            )}
            <p>
                Last command received from the VirtualKeyboard:{" "}
                <code style={{ fontWeight: "bold", color: "#f8a" }}>
                    {lastCommand}
                </code>
            </p>
            <textarea
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                }}
            />
            <MathJaxContext>
                <VirtualKeyboard />
            </MathJaxContext>
        </div>
    );
}
