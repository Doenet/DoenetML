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

ReactDOM.createRoot(document.getElementById("root")!).render(
    <ChakraProvider>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </ChakraProvider>,
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

    return (
        <div>
            <h4>Test the VirtualKeyboard</h4>
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
