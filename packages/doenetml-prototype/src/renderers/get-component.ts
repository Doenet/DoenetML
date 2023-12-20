import { BasicComponent, BasicComponentWithPassthroughChildren } from "./types";
import {
    Answer,
    Document,
    Graph,
    M,
    P,
    Problem,
    Section,
    TextInput,
} from "./components";
import type { FlatDastElement } from "@doenet/doenetml-worker-rust";
import { ChoiceInput } from "./components/choice-input";

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
const COMPONENTS: Record<string, Component | ComponentWithPassthroughChildren> =
    {
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
                `No component for element <${node?.name}>`,
            ),
        };
    }
    return component;
}
