/**
 * Script to convert a doenetml string into a DAST tree.
 */
import {
    lezerToDast,
    DastNodes,
    DastAttribute,
    DastMacroPathPart,
} from "../../../parser/dist";
import { normalizeDocumentDast } from "../../../doenetml-prototype/src/state/redux-slices/dast/utils/normalize-dast";
import yargs from "yargs";

function toDast(source: string) {
    return normalizeDocumentDast(lezerToDast(source));
}

type AnyNode = DastNodes | DastAttribute | DastMacroPathPart;

/**
 * Remove any `position` data from the DAST tree.
 */
function stripPositionData(node: AnyNode): Omit<AnyNode, "position"> {
    delete node.position;
    switch (node.type) {
        case "root":
        case "element":
        case "attribute":
            node.children.forEach((child) => stripPositionData(child));
            break;
        case "macro":
            Object.values(node.attributes).forEach((value) =>
                stripPositionData(value),
            );
            node.path.forEach((child) => stripPositionData(child));
            break;
        case "function":
            if (node.input) {
                node.input.forEach((child) =>
                    child.forEach((x) => stripPositionData(x)),
                );
            }
            node.path.forEach((child) => stripPositionData(child));
            break;
        case "error":
        case "cdata":
        case "comment":
        case "doctype":
        case "instruction":
        case "text":
            break;
        case "pathPart":
            node.index.forEach((child) => {
                // @ts-ignore
                delete child.position;
            });
    }

    return node;
}

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
    stripPositionData(parsed);
}
// Call toDast with the input and write the result to stdout
console.log(JSON.stringify(parsed));
