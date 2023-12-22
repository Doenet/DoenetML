import React from "react";
import { DoenetMLFlags } from "../DoenetML";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { dastActions, errorsSelector } from "../state/redux-slices/dast";
import { Element } from "../renderers";
import { globalActions } from "../state/redux-slices/global";

export function PageViewer({
    source,
    flags,
    darkMode,
}: {
    source: string;
    flags: DoenetMLFlags;
    darkMode: string;
}) {
    const dispatch = useAppDispatch();
    const errors = useAppSelector(errorsSelector);
    const isInErrorState = errors.length > 0;

    React.useEffect(() => {
        dispatch(globalActions.watchForDarkModePreferenceChange());
        dispatch(dastActions.setSourceAndStartWorker(source));
    }, [source]);

    if (isInErrorState) {
        return `Error: ${JSON.stringify(errors)}`;
    }

    // Render the document element
    return <Element id={0} />;
}
