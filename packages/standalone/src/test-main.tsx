/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */
import { renderDoenetToContainer } from "./index";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".doenetml-applet").forEach((container) => {
        console.log("Rendering doenetml to container", container);
        renderDoenetToContainer(container);
    });
});
