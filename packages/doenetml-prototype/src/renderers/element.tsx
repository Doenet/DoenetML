import React from "react";
import { useAppSelector } from "../state/hooks";
import { elementsArraySelector } from "../state/redux-slices/dast";
import { DastErrorComponent } from "./error";
import { ComponentConstraint, getComponent } from "./get-component";
import { VisibilitySensor } from "./visibility-sensor";
import {
    ElementRefAnnotation,
    FlatDastElementContent,
} from "@doenet/doenetml-worker-rust";
import { AncestorChain, extendAncestorChain } from "./utils";

const NO_ELEMENTS = Symbol("NO_ELEMENTS");

/**
 * Render a DoenetML element by id. This assumes that the element exists in the Redux store.
 */
export const Element = React.memo(
    ({
        id,
        constraint,
        annotation,
        ancestors,
    }: {
        id: number;
        constraint?: ComponentConstraint;
        annotation?: ElementRefAnnotation;
        ancestors: AncestorChain | undefined;
    }) => {
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

        // XXX: Is this behavior still correct? Do we need to fix the types?
        // @ts-ignore
        if (value.type === "error") {
            // @ts-ignore
            return <DastErrorComponent errorNode={value} />;
        }

        if (ancestors == null) {
            ancestors = "";
        }

        const Component = getComponent(value, constraint);

        // We should render the children and pass them into the component
        const children = Component.passthroughChildren
            ? flatDastChildrenToReactChildren(
                  value.children,
                  constraint,
                  extendAncestorChain(ancestors ?? "", id, annotation),
              )
            : undefined;

        if (Component.monitorVisibility) {
            return (
                <VisibilitySensor
                    component={Component.component}
                    id={id}
                    node={value}
                    children={children}
                    annotation={annotation}
                    ancestors={ancestors}
                />
            );
        }

        // If we make it here, the component will handle the rendering of its own children.
        return (
            <Component.component
                node={value}
                children={children}
                annotation={annotation}
                ancestors={ancestors}
            />
        );
    },
);

/**
 * Return `React.ReactNode`'s created from a `FlatDastElement`'s children.
 */
export function flatDastChildrenToReactChildren(
    children: FlatDastElementContent[],
    constraint: ComponentConstraint | undefined,
    ancestors: AncestorChain | undefined,
): React.ReactNode {
    return children.map((child) => {
        if (typeof child === "string") {
            return child;
        } else {
            ancestors = ancestors ?? "";
            return (
                <Element
                    key={ancestors + child.id}
                    id={child.id}
                    constraint={constraint}
                    annotation={child.annotation}
                    ancestors={ancestors}
                />
            );
        }
    });
}
