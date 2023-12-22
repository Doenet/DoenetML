import { BasicComponent, BasicComponentWithPassthroughChildren } from "./types";
import {
    Answer,
    Document,
    Graph,
    LineInGraph,
    M,
    P,
    PointInGraph,
    Problem,
    Section,
    TextInput,
} from "./components";
import type { FlatDastElement } from "@doenet/doenetml-worker-rust";
import { ChoiceInput } from "./components/choice-input";

export type ComponentConstraint = "text" | "graph" | undefined | null;

type CommonProps = {
    monitorVisibility?: boolean;
};
type Component = {
    component: BasicComponent;
    passthroughChildren?: false;
} & CommonProps;
type ComponentWithPassthroughChildren = {
    component: BasicComponentWithPassthroughChildren;
    passthroughChildren: true;
} & CommonProps;

/**
 * A map of tag names to components. This is used for naive component rendering, where the
 * tag name uniquely determines the component to render.
 */
const TEXT_MODE_COMPONENTS: Record<
    string,
    Component | ComponentWithPassthroughChildren
> = {
    answer: { component: Answer },
    choiceInput: { component: ChoiceInput },
    p: { component: P, passthroughChildren: true },
    document: { component: Document, passthroughChildren: true },
    m: { component: M, passthroughChildren: true },
    graph: { component: Graph },
    section: {
        component: Section,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    problem: {
        component: Problem,
        passthroughChildren: true,
        monitorVisibility: true,
    },
    textInput: { component: TextInput },
};

const GRAPH_MODE_COMPONENTS: Record<
    string,
    Component | ComponentWithPassthroughChildren
> = {
    line: { component: LineInGraph },
    point: { component: PointInGraph },
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
 *
 * The `constraint` parameter can be used to specify a constraint on the type of component. By default
 * the constraint is `"text"` and elements rendering in text mode will be selected.
 */
export function getComponent(
    node: FlatDastElement,
    constraint?: ComponentConstraint,
): (typeof TEXT_MODE_COMPONENTS)[keyof typeof TEXT_MODE_COMPONENTS] {
    constraint = constraint ?? "text";

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
