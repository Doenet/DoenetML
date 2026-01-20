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
    return <DoenetViewerOrig doenetML={source} doenetmlVersion="dev" />;
}

export function DoenetEditor({
    source,
    showFormatter = false,
    viewerLocation = "right",
    height = "500px",
}: React.PropsWithChildren<{
    source: string;
    showFormatter?: boolean;
    viewerLocation?: "left" | "right" | "top" | "bottom";
    height?: string;
}>) {
    return (
        <div className="doenet-editor-container">
            <DoenetEditorOrig
                doenetML={source}
                showFormatter={showFormatter}
                viewerLocation={viewerLocation}
                height={height}
                doenetmlVersion="dev"
            />
        </div>
    );
}
