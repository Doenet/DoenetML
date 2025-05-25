/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { VirtualKeyboard } from "./virtual-keyboard";
import { MathJaxContext } from "better-react-mathjax";
import { ChakraProvider } from "@chakra-ui/react";
import { ManagedKeyboard } from "./virtual-keyboard";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.Fragment>
        <ManagedKeyboard onClick={(e) => console.log("keyboard event", e)} />
        <ChakraProvider>
            <App />
        </ChakraProvider>
    </React.Fragment>,
);

function App() {
    const [text, setText] = React.useState("Some Text");
    const [lastCommand, setLastCommand] = React.useState("");

    return (
        <div>
            <h4>Test the VirtualKeyboard</h4>
            <p>
                Last command received from the VirtualKeyboard:{" "}
                <code style={{ fontWeight: "bold", color: "#f8a" }}>
                    {JSON.stringify(lastCommand)}
                </code>
            </p>
            <textarea
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                }}
            />
            <MathJaxContext>
                <VirtualKeyboard
                    onClick={(e) =>
                        setLastCommand(JSON.stringify(e).replace(/"/g, "'"))
                    }
                />
            </MathJaxContext>
        </div>
    );
}
