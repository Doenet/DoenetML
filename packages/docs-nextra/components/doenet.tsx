import React from "react";
import {
    DoenetViewer as DoenetViewerOrig,
    DoenetEditor as DoenetEditorOrig,
} from "@doenet/doenetml-iframe";
import "@doenet/virtual-keyboard/style.css";

/**
 * Render DoenetML in an iframe so that its styling/state is completely isolated from the page.
 */
export function DoenetViewer({
    source,
}: React.PropsWithChildren<{ source: string }>) {
    return <DoenetViewerOrig doenetML={source} />;
}

export function DoenetEditor({
    source,
    showFormatter = false,
}: React.PropsWithChildren<{ source: string; showFormatter?: boolean }>) {
    console.log("source for editor", JSON.stringify(source));
    return (
        <div className="doenet-editor-container">
            <DoenetEditorOrig doenetML={source} showFormatter={showFormatter} />
        </div>
    );
}
