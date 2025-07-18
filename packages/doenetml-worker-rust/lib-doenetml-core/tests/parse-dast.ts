/**
 * Script to convert a doenetml string into a DAST tree.
 */
import {
    lezerToDast,
    DastNodes,
    DastAttribute,
    DastMacroPathPart,
    filterPositionInfo,
    normalizeDocumentDast,
} from "../../../parser/dist";
import fs from "node:fs";
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
    .option("fileInput", {
        alias: "f",
        description: "Read input from a file",
        type: "string",
    })
    .option("strip-position", {
        description: "Strip position data from the DAST tree",
        type: "boolean",
    }).argv;

// Do the actual processing
if (argv.input == null && argv.fileInput == null) {
    throw new Error("Must provide an input via -i or -f");
}
const input = argv.input ?? fs.readFileSync(argv.fileInput, "utf8");
const parsed = toDast(input);
if (argv.stripPosition) {
    filterPositionInfo(parsed);
}
// Call toDast with the input and write the result to stdout
console.log(JSON.stringify(parsed));
