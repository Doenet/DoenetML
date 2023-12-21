import React from "react";
import { DoenetMLFlags } from "../DoenetML";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { dastActions, errorsSelector } from "../state/redux-slices/dast";
import { Element } from "../renderers";

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
        dispatch(dastActions.setSourceAndStartWorker({ source, flags }));
    }, [source]);

    if (isInErrorState) {
        return `Error: ${JSON.stringify(errors)}`;
    }

    // Render the document element
    return <Element id={0} />;
}
