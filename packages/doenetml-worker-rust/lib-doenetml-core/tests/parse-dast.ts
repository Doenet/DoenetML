/**
 * Script to convert a doenetml string into a DAST tree.
 */
import {
    lezerToDast,
    DastNodes,
    DastAttribute,
    DastMacroPathPart,
    filterPositionInfo,
} from "../../../parser/dist";
import { normalizeDocumentDast } from "../../../doenetml-prototype/src/state/redux-slices/dast/utils/normalize-dast";
import yargs from "yargs";

function toDast(source: string) {
    return normalizeDocumentDast(lezerToDast(source));
}

type AnyNode = DastNodes | DastAttribute | DastMacroPathPart;

// Parse command-line arguments with yargs
const argv = yargs(process.argv.slice(2))
    .usage(`Usage: $0 -i '<document>My DoenetML</document>'`)
    .option("input", {
        alias: "i",
        description: "Input for toDast function",
        type: "string",
    })
    .option("strip-position", {
        description: "Strip position data from the DAST tree",
        type: "boolean",
    })
    .demandOption("input").argv;

// Do the actual processing
const parsed = toDast(argv.input);
if (argv.stripPosition) {
    filterPositionInfo(parsed);
}
// Call toDast with the input and write the result to stdout
console.log(JSON.stringify(parsed));
