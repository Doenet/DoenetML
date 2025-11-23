import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TestViewer from "./test/testViewer";
// XXX: this file is currently not in @doenet/doenetml-prototype. Uncomment import when that is fixed.
import "@doenet/doenetml-prototype/style.css";

const root = createRoot(document.getElementById("root"));

window.addEventListener("message", (event) => {
    if (event.data.subject == "SPLICE.reportScoreAndState") {
        console.log(event.data.score);
        console.log(event.data.state);
    } else if (event.data.subject == "SPLICE.sendEvent") {
        console.log(event.data.name);
        console.log(event.data.data);
    }
});

root.render(<TestViewer />);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
    // console.log(">>>import.meta.hot")
    // import.meta.hot.accept(({module}) => {
    //   console.log(">>>ACCEPT CALLED!!!!!!!!!")
    // }
    // );
    import.meta.hot.accept();
}
