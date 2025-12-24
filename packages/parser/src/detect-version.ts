import { lezerToDast } from "./lezer-to-dast";
import { DastElement } from "./types";

/**
 * If doenetML consists of a single `<document>` component with,
 * for example, `xmlns="https://doenet.org/spec/doenetml/v0.7.0-alpha44"` set,
 * attempt to extract the DoenetML version from that prop.
 * Returns the version if found, else returns null.
 */
export function detectVersionFromDoenetML(
    doenetML: string,
): { version: string; position: { begin: number; end: number } } | null {
    const parsed = lezerToDast(doenetML);
    // Find the first document child and look for the xmlns attribute
    const documentElement = parsed.children.find(
        (e) => e.type === "element" && e.name === "document",
    ) as DastElement;
    if (!documentElement || !("xmlns" in documentElement.attributes)) {
        return null;
    }
    const xmlnsValue = documentElement.attributes["xmlns"];
    if (
        xmlnsValue.type !== "attribute" ||
        xmlnsValue.children.length !== 1 ||
        xmlnsValue.children[0].type !== "text"
    ) {
        return null;
    }
    // Should now be a URL like https://doenet.org/spec/doenetml/v0.7.0-alpha44
    const xmlnsTextNode = xmlnsValue.children[0];
    const xmlnsText = xmlnsValue.children[0].value;

    const match = xmlnsText.match(
        /^https:\/\/doenet\.org\/spec\/doenetml\/v([0-9a-zA-Z\.\-]+)$/,
    );

    const documentTag = match ? match[0] : null;
    const versionString = match ? match[1] : null;
    if (match && documentTag && versionString != null) {
        // Calculate the offset of the match
        const offsetStart =
            (match.index || 0) + documentTag.indexOf(versionString);
        const offsetEnd = offsetStart + versionString.length;
        return {
            version: versionString,
            position: {
                begin: xmlnsTextNode.position?.start.offset! + offsetStart,
                end: xmlnsTextNode.position?.start.offset! + offsetEnd,
            },
        };
    }

    return null;
}
