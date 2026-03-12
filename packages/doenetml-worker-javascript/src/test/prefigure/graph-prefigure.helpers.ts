import "./graph-prefigure.setup";

import { createTestCore } from "../utils/test-core";

export const PREFIGURE_BUILD_URL = "https://prefigure.doenet.org/build";
export const RUN_LIVE_PREFIGURE_VALIDATION =
    process.env.RUN_LIVE_PREFIGURE_VALIDATION === "1";

export async function getGraphRendererState(doenetML: string, graphName = "g") {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const graphState =
        stateVariables[await resolvePathToNodeIdx(graphName)].stateValues;

    return {
        core,
        resolvePathToNodeIdx,
        stateVariables,
        graphState,
        prefigureXML: graphState.prefigureXML,
    };
}

export async function getPrefigureXML(doenetML: string, graphName = "g") {
    return (await getGraphRendererState(doenetML, graphName)).prefigureXML;
}

export async function getWarnings(doenetML: string) {
    const { core } = await createTestCore({ doenetML });
    return core.core!.errorWarnings;
}

export async function validatePrefigureXMLAgainstBuildService(xml: string) {
    const response = await fetch(PREFIGURE_BUILD_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/xml",
        },
        body: xml,
    });

    const responseText = await response.text();

    let parsedBody: any = null;
    try {
        parsedBody = JSON.parse(responseText);
    } catch (_e) {
        parsedBody = responseText;
    }

    return {
        ok: response.ok,
        status: response.status,
        body: parsedBody,
    };
}
