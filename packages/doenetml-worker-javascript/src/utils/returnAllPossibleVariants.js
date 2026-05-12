import { numberToLetters } from "@doenet/utils";
import { getNumVariants } from "./variants";

export async function returnAllPossibleVariants(
    serializedDocument,
    componentInfoObjects,
    infoDiagnostics,
) {
    let results = getNumVariants({
        serializedComponent: serializedDocument,
        componentInfoObjects,
        infoDiagnostics,
    });

    let numVariants = results.numVariants;

    let allPossibleVariants;

    if (serializedDocument.variants?.allPossibleVariants) {
        allPossibleVariants = serializedDocument.variants.allPossibleVariants;
    } else {
        allPossibleVariants = [...Array(numVariants).keys()].map((x) =>
            indexToLowercaseLetters(x + 1),
        );
    }

    return allPossibleVariants;
}

function indexToLowercaseLetters(index) {
    return numberToLetters(index, true);
}
