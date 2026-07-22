import React from "react";
import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
// @ts-ignore
import { DoenetViewer } from "@doenet/doenetml/doenetml-inline-worker.js";
import "./App.css";
import "@doenet/doenetml/style.css";
import { onClassChange, setColorStyle } from "./utilities/dark-mode-monitor";

/**
 * How long (ms) to keep re-applying the saved scroll position while the
 * viewer re-renders after a source change. The viewer rebuilds its DOM
 * asynchronously (worker boot + progressive render), so the content
 * collapses and grows back over an unknown time span.
 */
const SCROLL_RESTORE_WINDOW_MS = 4000;

/**
 * Keep `container`'s scroll position at (as close as possible to) its
 * current value while the content inside it is torn down and rebuilt.
 *
 * Every animation frame, scroll to the saved position, clamped to the
 * current content height. Stops after `SCROLL_RESTORE_WINDOW_MS`, or as soon
 * as the user scrolls or interacts with the container themselves.
 *
 * Returns a function that cancels the restoration.
 */
function keepScrollPosition(container: HTMLElement): () => void {
    const target = container.scrollTop;
    let rafId = 0;

    const userEvents = ["wheel", "touchstart", "mousedown", "keydown"] as const;
    const cancel = () => {
        cancelAnimationFrame(rafId);
        for (const eventName of userEvents) {
            container.removeEventListener(eventName, cancel);
        }
    };

    if (target <= 0) {
        return cancel;
    }
    for (const eventName of userEvents) {
        container.addEventListener(eventName, cancel, { passive: true });
    }

    const deadline = Date.now() + SCROLL_RESTORE_WINDOW_MS;
    const tick = () => {
        const maxScroll = Math.max(
            0,
            container.scrollHeight - container.clientHeight,
        );
        const desired = Math.min(target, maxScroll);
        if (Math.abs(container.scrollTop - desired) > 1) {
            container.scrollTop = desired;
        }
        if (Date.now() >= deadline) {
            cancel();
        } else {
            rafId = requestAnimationFrame(tick);
        }
    };
    rafId = requestAnimationFrame(tick);

    return cancel;
}

function App() {
    const [source, setSource] = React.useState(
        "Sample Source\n<graph><line /></graph>",
    );
    const [dirty, setDirty] = React.useState(false);
    const [darkMode, setDarkMode] = React.useState(false);
    const previewContainerRef = React.useRef<HTMLDivElement>(null);
    const cancelScrollRestoreRef = React.useRef<(() => void) | null>(null);

    React.useEffect(() => {
        const callback = (event: MessageEvent) => {
            const message = event.data; // The JSON data our extension sent
            switch (message.command) {
                case "setSource":
                    // Changing the source rebuilds the viewer's DOM, which
                    // would otherwise reset the scroll position to the top.
                    if (previewContainerRef.current) {
                        cancelScrollRestoreRef.current?.();
                        cancelScrollRestoreRef.current = keepScrollPosition(
                            previewContainerRef.current,
                        );
                    }
                    setSource(message.text);
                    setDirty(false);
                    break;
                case "dirty":
                    setDirty(true);
                    break;
            }
        };

        const bodyElm = document.querySelector("body");
        if (!bodyElm) {
            throw new Error("body element not found");
        }
        if (bodyElm.classList.contains("vscode-dark")) {
            setDarkMode(true);
        }
        const observer = onClassChange(bodyElm, () => {
            if (bodyElm.classList.contains("vscode-dark")) {
                setDarkMode(true);
            } else {
                setDarkMode(false);
            }
        });

        window.addEventListener("message", callback);
        return () => {
            window.removeEventListener("message", callback);
            observer.disconnect();
        };
    });

    React.useEffect(() => {
        setColorStyle(darkMode ? "dark" : "light");
    }, [darkMode]);

    React.useLayoutEffect(() => {
        vscode.postMessage({ command: "ui-loaded" });
    }, []);

    function refreshClick() {
        vscode.postMessage({
            command: "refresh",
            text: "",
        });
    }

    return (
        <div className="main">
            <div className="header">
                <h1>DoenetML Preview</h1>
                <VSCodeButton
                    onClick={refreshClick}
                    title="Force a refresh of the DoenetML source"
                >
                    Force Refresh{dirty ? " *" : ""}
                </VSCodeButton>
            </div>
            <div className="doenet-preview" ref={previewContainerRef}>
                <DoenetViewer
                    doenetML={source}
                    darkMode={darkMode ? "dark" : "light"}
                />
            </div>
        </div>
    );
}

export default App;
