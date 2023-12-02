import {
    DastRoot,
    DastElement,
    DastElementContent,
    extractDastErrors,
    isDastElement,
    isDastElementContent,
    lezerToDast,
} from "@doenet/parser";
import { doenetGlobalConfig } from "../global-config";
import { DoenetMLFlags } from "../DoenetML";

export function normalizeDocumentDast(dast: DastRoot) {
    // TODO: for now, ignoring docType children. Should we do something with them?
    let elementContentChildren = dast.children.filter(isDastElementContent);

    elementContentChildren = removeOuterBlankTexts(elementContentChildren);

    let serializedDocument: DastElement;

    if (
        elementContentChildren.length === 1 &&
        isDastElement(elementContentChildren[0]) &&
        elementContentChildren[0].name.toLowerCase() === "document"
    ) {
        serializedDocument = elementContentChildren[0];
    } else {
        serializedDocument = {
            type: "element",
            name: "document",
            children: elementContentChildren,
            attributes: {},
        };
    }

    dast.children = [serializedDocument];

    return dast;
}

function removeOuterBlankTexts(serializedComponents: DastElementContent[]) {
    let firstNonBlankInd: number | undefined,
        lastNonBlankInd: number | undefined;

    // find any beginning or ending blank texts
    for (let ind = 0; ind < serializedComponents.length; ind++) {
        let comp = serializedComponents[ind];
        if (comp.type !== "text" || /\S/.test(comp.value)) {
            if (firstNonBlankInd === undefined) {
                firstNonBlankInd = ind;
            }
            lastNonBlankInd = ind;
        }
    }

    if (lastNonBlankInd !== undefined) {
        serializedComponents = serializedComponents.slice(
            firstNonBlankInd,
            lastNonBlankInd + 1,
        );
    }

    return serializedComponents;
}

export function createCoreWorker() {
    return new Worker(doenetGlobalConfig.doenetWorkerUrl, {
        type: "module",
    });
}

export function initializeCoreWorker({
    coreWorker,
    doenetML,
    dast,
    flags,
}: {
    coreWorker: Worker;
    doenetML: string;
    dast: DastRoot;
    flags: DoenetMLFlags;
}) {
    // Initializes core worker with the given arguments.
    // Returns a promise.
    // If the worker is successfully initialized, the promise is resolved
    // If an error was encountered while initializing, the promise is rejected

    let resolveInitializePromise: Function;
    let rejectInitializePromise: Function;

    let initializePromise = new Promise((resolve, reject) => {
        resolveInitializePromise = resolve;
        rejectInitializePromise = reject;
    });

    let initializeListener = function (e: MessageEvent) {
        if (e.data.messageType === "initialized") {
            coreWorker.removeEventListener("message", initializeListener);

            resolveInitializePromise();
        }
    };

    coreWorker.addEventListener("message", initializeListener);

    coreWorker.postMessage({
        messageType: "initializeWorker",
        args: {
            doenetML,
            dast,
            flags,
        },
    });

    return initializePromise;
}
