import React, { useCallback, useEffect, useRef, useState } from "react";
import { DoenetMLFlags } from "../doenet-applet";
import {
    extractDastErrors,
    lezerToDast,
    DastRoot,
    DastError,
} from "@doenet/parser";
import { normalizeDocumentDast } from "../utils/activityUtils";
import { createWrappedCoreWorker, useCoreWorker } from "../core-worker";

export function PageViewer({
    source,
    flags,
    darkMode,
}: {
    source: string;
    flags: DoenetMLFlags;
    darkMode: string;
}) {
    const [dast, setDast] = useState<DastRoot>({ type: "root", children: [] });

    const [dastErrors, setDastErrors]: [DastError[] | undefined, Function] =
        useState(undefined);

    const { coreWorker } = useCoreWorker({ dast, source, flags });

    const [coreInitialized, setCoreInitialized] = useState(false);

    const [isInErrorState, setIsInErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        let new_dast = normalizeDocumentDast(lezerToDast(source));
        let new_errors = extractDastErrors(new_dast);
        setDast(new_dast);
        setDastErrors(new_errors);

        console.log("dast:", new_dast);

        console.log("errors:", new_errors);
    }, [source]);

    if (isInErrorState) {
        return `Error: ${errorMsg}`;
    }

    return <p>Hello!</p>;
}
