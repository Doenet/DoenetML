/*
 * This file is for running a dev test of the standalone doenet viewer and editor.
 * It does not show up in the bundled package.
 */
import {
    renderDoenetViewerToContainer,
    renderDoenetEditorToContainer,
} from "./index";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".doenetml-viewer").forEach((container) => {
        console.log("Rendering doenet viewer to container", container);
        renderDoenetViewerToContainer(container);
    });
    document.querySelectorAll(".doenetml-editor").forEach((container) => {
        console.log("Rendering doenet editor to container", container);
        renderDoenetEditorToContainer(container);
    });
});
