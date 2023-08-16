import React from "react";
import DoenetML from "./DoenetML.jsx";
import ReactDOM from "react-dom/client";
console.log("odule loaded");
window.importDoenet = function (domId, variantIndex, doenetML) {
    console.log("trying to replace", document.getElementById(domId));
    ReactDOM.createRoot(document.getElementById(domId)).render(
        /* @__PURE__ */ React.createElement(DoenetML, {
            doenetML,
            flags: {
                showCorrectness: true,
                readOnly: false,
                showFeedback: true,
                showHints: true,
            },
            requestedVariantIndex: variantIndex,
            addVirtualKeyboard: true,
        })
    );
};
