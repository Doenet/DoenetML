import React from "react";
import { useAppSelector } from "../state/hooks";
import { elementsArraySelector } from "../state/redux-slices/dast";
import { DastErrorComponent } from "./error";
import { getComponent } from "./get-component";
import { VisibilitySensor } from "./visibility-sensor";

/**
 * Render a DoenetML element by id. This assumes that the element exists in the Redux store.
 */
export const Element = React.memo(({ id }: { id: number }) => {
    const value = useAppSelector((state) => {
        return elementsArraySelector(state)[id];
    });

    if (value == null) {
        console.warn(`No element with id ${id}`);
        return null;
    }

    if (value.type === "error") {
        return <DastErrorComponent errorNode={value} />;
    }

    const Component = getComponent(value);

    // We should render the children and pass them into the component
    const children = Component.passthroughChildren
        ? value.children.map((child) => {
              if (typeof child === "number") {
                  return <Element key={child} id={child} />;
              } else {
                  return child;
              }
          })
        : undefined;

    if (Component.monitorVisibility) {
        return (
            <VisibilitySensor
                component={Component.component}
                id={id}
                node={value}
                children={children}
            />
        );
    }

    // If we make it here, the component will handle the rendering of its own children.
    return <Component.component node={value} children={children} />;
});
