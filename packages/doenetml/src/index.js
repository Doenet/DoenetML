export { DoenetML } from "./DoenetML.jsx";

export { mathjaxConfig } from "./Core/utils/math.js";
export { cidFromText } from "./Core/utils/cid.js";
export { retrieveTextFileForCid } from "./Core/utils/retrieveTextFile.js";
export {
    calculateOrderAndVariants,
    determineNumberOfActivityVariants,
    parseActivityDefinition,
    returnNumberOfActivityVariantsForCid,
} from "./utils/activityUtils.js";
export {
    serializedComponentsReplacer,
    serializedComponentsReviver,
} from "./Core/utils/serializedStateProcessing.js";
export { returnAllPossibleVariants } from "./Core/utils/returnAllPossibleVariants.js";
export { CodeMirror } from "@doenet/codemirror";
