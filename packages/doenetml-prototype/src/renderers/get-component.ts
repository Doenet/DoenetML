import type { FlatDastElement } from "@doenet/doenetml-worker-rust";
import {
    GRAPH_MODE_COMPONENTS,
    RendererObject,
    TEXT_MODE_COMPONENTS,
} from "./renderers";

export type ComponentConstraint = "text" | "graph" | undefined | null;

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
 *
 * The `constraint` parameter can be used to specify a constraint on the type of component. By default
 * the constraint is `"text"` and elements rendering in text mode will be selected.
 */
export function getComponent(
    node: FlatDastElement,
    constraint?: ComponentConstraint,
    renderers: {
        textMode: RendererObject;
        graphMode: RendererObject;
    } = { textMode: TEXT_MODE_COMPONENTS, graphMode: GRAPH_MODE_COMPONENTS },
): RendererObject[keyof RendererObject] {
    constraint = constraint ?? "text";
    const TEXT_MODE_COMPONENTS = renderers.textMode;
    const GRAPH_MODE_COMPONENTS = renderers.graphMode;

    const componentLookup =
        constraint === "text"
            ? TEXT_MODE_COMPONENTS
            : constraint === "graph"
              ? GRAPH_MODE_COMPONENTS
              : TEXT_MODE_COMPONENTS;

    const component = componentLookup[node?.name];
    if (!component) {
        return {
            component: makeNullComponentWithMessage(
                `No component for element <${node?.name}>${
                    constraint ? ` satisfying constraint "${constraint}"` : ""
                }`,
            ),
        };
    }
    return component;
}
