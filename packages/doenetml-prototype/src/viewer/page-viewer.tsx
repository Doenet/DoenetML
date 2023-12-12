import React from "react";
import { DoenetMLFlags } from "../doenet-applet";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { dastActions, errorsSelector } from "../state/redux-slices/dast";

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
        dispatch(dastActions.setSourceAndStartWorker(source));
    }, [source]);

    if (isInErrorState) {
        return `Error: ${JSON.stringify(errors)}`;
    }

    return <p>Hello!</p>;
}
