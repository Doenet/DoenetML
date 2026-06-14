import React from "react";
import { DoenetMLFlags } from "../DoenetML";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { dastActions, errorsSelector } from "../state/redux-slices/dast";
import { Element } from "../renderers";
import { globalActions } from "../state/redux-slices/global";
import type { CoreType } from "../state/redux-slices/core/slice";

export function PageViewer({
    source,
    flags,
    darkMode,
    coreType = "rust",
}: {
    source: string;
    flags: DoenetMLFlags;
    darkMode: string;
    coreType?: CoreType;
}) {
    const dispatch = useAppDispatch();
    const errors = useAppSelector(errorsSelector);
    const isInErrorState = errors.length > 0;

    // Register the dark-mode watcher once. It adds a `matchMedia` listener
    // that is never removed, so it must not run on every `source`/`coreType`
    // change (that would register duplicate listeners).
    React.useEffect(() => {
        dispatch(globalActions.watchForDarkModePreferenceChange());
    }, []);

    React.useEffect(() => {
        dispatch(
            dastActions.setSourceAndStartWorker({ source, flags, coreType }),
        );
    }, [source, coreType]);

    if (isInErrorState) {
        return `Error: ${JSON.stringify(errors)}`;
    }

    // Render the document element
    return <Element id={0} ancestors="" annotation="original" />;
}
