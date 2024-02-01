import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestViewer from "./test/testViewer.jsx";
import "@doenet/doenetml/style.css";

const root = createRoot(document.getElementById("root"));

window.addEventListener("message", (event) => {
    if (event.data.subject == "SPLICE.reportScoreAndState") {
        console.log(event.data.score);
        console.log(event.data.state);
    } else if (event.data.subject == "SPLICE.sendEvent") {
        console.log(event.data.location);
        console.log(event.data.name);
        console.log(event.data.data);
    }
});

root.render(
    <Router>
        <Routes>
            <Route path="*" element={

            <TestViewer />
            
            } />
        </Routes>
    </Router>,
);

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
