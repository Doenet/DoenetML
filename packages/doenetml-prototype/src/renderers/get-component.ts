import { BasicComponent, BasicComponentWithPassthroughChildren } from "./types";
import { Document, Graph, M, P } from "./components";
import type { FlatDastElement } from "@doenet/doenetml-worker-rust";

type Component = {
    component: BasicComponent;
    passthroughChildren?: false;
};
type ComponentWithPassthroughChildren = {
    component: BasicComponentWithPassthroughChildren;
    passthroughChildren: true;
};

/**
 * A map of tag names to components. This is used for naive component rendering, where the
 * tag name uniquely determines the component to render.
 */
const COMPONENTS: Record<string, Component | ComponentWithPassthroughChildren> =
    {
        p: { component: P, passthroughChildren: true },
        document: { component: Document, passthroughChildren: true },
        m: { component: M, passthroughChildren: true },
        graph: { component: Graph },
    };

/**
 * Generate a component that will render nothing but will log a warning to the console.
 */
function makeNullComponentWithMessage(message: string) {
    return function NullComponent() {
        console.warn(message);
        return null;
    };
}

/**
 * Get the component to render a given node. This function is safe to use on all inputs.
 * If no component is found, a component that will log a warning to the console is returned.
 */
export function getComponent(
    node: FlatDastElement,
): (typeof COMPONENTS)[keyof typeof COMPONENTS] {
    const component = COMPONENTS[node?.name];
    if (!component) {
        return {
            component: makeNullComponentWithMessage(
                `No component for node ${node?.name}`,
            ),
        };
    }
    return component;
}
