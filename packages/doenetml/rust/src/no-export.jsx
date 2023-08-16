import React from "react";
import DoenetML from "./DoenetML.jsx";
import ReactDOM from "react-dom/client";

// export { mathjaxConfig } from "./Core/utils/math.js";
// export { cidFromText } from "./Core/utils/cid.js";
// export { retrieveTextFileForCid } from "./Core/utils/retrieveTextFile.js";
// export {
//   calculateOrderAndVariants,
//   determineNumberOfActivityVariants,
//   parseActivityDefinition,
//   returnNumberOfActivityVariantsForCid,
// } from "./utils/activityUtils.js";
// export {
//   serializedComponentsReplacer,
//   serializedComponentsReviver,
// } from "./Core/utils/serializedStateProcessing.js";
// export { returnAllPossibleVariants } from "./Core/utils/returnAllPossibleVariants.js";
// export { default as CodeMirror } from "./Tools/CodeMirror.jsx";
// export {
//   default as DarkmodeController,
//   darkModeAtom,
// } from "./Tools/DarkmodeController.jsx";

console.log("odule loaded");

window.importDoenet = function (domId, variantIndex, doenetML) {
    console.log("trying to replace", document.getElementById(domId));
    //return;

    const myelm = (
        <DoenetML
            doenetML={doenetML}
            flags={{
                showCorrectness: true,
                readOnly: false,
                showFeedback: true,
                showHints: true,
            }}
            requestedVariantIndex={variantIndex}
            addVirtualKeyboard={true}
        />
    );
    const root = ReactDOM.createRoot(document.getElementById(domId));
    root.render(myelm);
};
