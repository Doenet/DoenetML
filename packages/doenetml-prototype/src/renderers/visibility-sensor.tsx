import React from "react";
import { useAppDispatch } from "../state/hooks";
import { analyticsActions } from "../state/redux-slices/analytics";

export function VisibilitySensor({
    component,
    id,
    ...props
}: {
    component: React.FunctionComponent<any>;
    id: number;
    [key: string]: any;
}) {
    const dispatch = useAppDispatch();
    const visibilityRef = React.useRef(null);
    const Component: React.FunctionComponent<any> = component;

    React.useEffect(() => {
        if (visibilityRef.current == null) {
            return;
        }
        const observer = new IntersectionObserver(
            (entries, ob) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        dispatch(
                            analyticsActions.visibilityChange({
                                elementId: id,
                                state: "visible",
                            }),
                        );
                    } else {
                        dispatch(
                            analyticsActions.visibilityChange({
                                elementId: id,
                                state: "invisible",
                            }),
                        );
                    }
                });
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.5,
            },
        );
        observer.observe(visibilityRef.current);
        return () => {
            observer.disconnect();
        };
    }, [visibilityRef]);

    return <Component visibilityRef={visibilityRef} {...props} />;
}
