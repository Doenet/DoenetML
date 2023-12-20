import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestViewer from "./test/testViewer";
// XXX: this file is currently not in @doenet/doenetml-prototype. Uncomment import when that is fixed.
//import "@doenet/doenetml/style.css";

const root = createRoot(document.getElementById("root"));
root.render(
    <Router>
        <Routes>
            <Route path="*" element={<TestViewer />} />
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
