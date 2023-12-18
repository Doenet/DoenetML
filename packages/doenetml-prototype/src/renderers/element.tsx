import React from "react";
import { useAppSelector } from "../state/hooks";
import { elementsArraySelector } from "../state/redux-slices/dast";
import { DastError } from "./error";
import { getComponent } from "./get-component";

export const Element = React.memo(({ id }: { id: number }) => {
    const value = useAppSelector((state) => {
        return elementsArraySelector(state)[id];
    });

    if (value == null) {
        console.warn(`No element with id ${id}`);
        return null;
    }

    if (value.type === "error") {
        return <DastError errorNode={value} />;
    }

    const Component = getComponent(value);

    if (Component.passthroughChildren) {
        // We should render the children and pass them into the component
        const children = value.children.map((child) => {
            if (typeof child === "number") {
                return <Element key={child} id={child} />;
            } else {
                return child;
            }
        });
        return (
            <Component.component node={value}>{children}</Component.component>
        );
    }

    // If we make it here, the component will handle the rendering of its own children.
    return <Component.component node={value} />;
});
