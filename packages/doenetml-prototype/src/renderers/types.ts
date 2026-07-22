import { ElementRefAnnotation, FlatDastElement } from "@doenet/doenetml-worker";
import { AncestorChain } from "./utils";

export type BasicComponentProps<Data = {}> = {
    // XXX: flatDastFromJS.ts declares an `interface ElementData` which gets merged with this type definition.
    // We want to use strict types only, so we omit it here. When flatDastFromJS.ts is no longer needed, this type narrowing
    // can be removed.
    node: Omit<FlatDastElement, "data"> & {
        data: { id: number; action_names?: string[] } & Data;
    };
    /**
     * If you want to track the visibility of this component. Set it to a ref object which
     * will be forwarded to the actual dom node of the child component (if there is any dom node rendered).
     */
    visibilityRef?: React.ForwardedRef<
        HTMLDivElement & HTMLSpanElement & HTMLDetailsElement
    >;
    /**
     * Additional information provided to this element. Even if two elements have the same id, they
     * may have different information provided in the annotation.
     */
    annotation?: ElementRefAnnotation;
    /**
     * The ancestors of this node, with the closest ancestor first.
     */
    ancestors: AncestorChain;
    /**
     * If this element can be referenced in HTML, the `id` attribute to use for this element.
     */
    htmlId?: string;
};
export type BasicComponent<Data = {}> = React.FunctionComponent<
    BasicComponentProps<Data>
>;
export type BasicComponentWithPassthroughChildren<Data = {}> =
    React.FunctionComponent<React.PropsWithChildren<BasicComponentProps<Data>>>;
