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

    // Re-run when the source, core, or any flag *value* changes. The parent
    // rebuilds the `flags` object on every render, so depend on a serialized
    // key of its values rather than its identity to avoid re-initializing the
    // worker on unrelated re-renders while still picking up real flag changes.
    const flagsKey = JSON.stringify(flags);
    React.useEffect(() => {
        dispatch(
            dastActions.setSourceAndStartWorker({ source, flags, coreType }),
        );
        // `flags` is intentionally tracked via `flagsKey`, not by object identity.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source, coreType, flagsKey]);

    if (isInErrorState) {
        return `Error: ${JSON.stringify(errors)}`;
    }

    // Render the document element
    return <Element id={0} ancestors="" annotation="original" />;
}
