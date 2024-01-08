import React from "react";
import { useAppSelector } from "../state/hooks";
import { elementsArraySelector } from "../state/redux-slices/dast";
import { DastErrorComponent } from "./error";
import { ComponentConstraint, getComponent } from "./get-component";
import { VisibilitySensor } from "./visibility-sensor";

const NO_ELEMENTS = Symbol("NO_ELEMENTS");

/**
 * Render a DoenetML element by id. This assumes that the element exists in the Redux store.
 */
export const Element = React.memo(
    ({ id, constraint }: { id: number; constraint?: ComponentConstraint }) => {
        const value = useAppSelector((state) => {
            const elementsArray = elementsArraySelector(state);
            if (elementsArray.length === 0) {
                return NO_ELEMENTS;
            }
            return elementsArray[id];
        });

        if (value === NO_ELEMENTS) {
            // If there are no elements at all, we silently do nothing (we're probably waiting for
            // the worker to start)
            return null;
        }

        if (value == null) {
            console.warn(`No element with id ${id}`);
            return null;
        }

        if (value.type === "error") {
            return <DastErrorComponent errorNode={value} />;
        }

        const Component = getComponent(value, constraint);

        // We should render the children and pass them into the component
        const children = Component.passthroughChildren
            ? flatDastChildrenToReactChildren(value.children, constraint)
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
    },
);

/**
 * Return `React.ReactNode`'s created from a `FlatDastElement`'s children.
 */
export function flatDastChildrenToReactChildren(
    children: (number | string)[],
    constraint?: ComponentConstraint,
): React.ReactNode {
    return children.map((child) => {
        if (typeof child === "number") {
            return <Element key={child} id={child} constraint={constraint} />;
        } else {
            return child;
        }
    });
}
