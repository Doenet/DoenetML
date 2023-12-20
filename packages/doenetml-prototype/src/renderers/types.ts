import { FlatDastElement } from "@doenet/doenetml-worker-rust";

export type BasicComponentProps<Data = {}> = {
    node: FlatDastElement & {
        data: Data;
    };
    /**
     * If you want to track the visibility of this component. Set it to a ref object which
     * will be forwarded to the actual dom node of the child component (if there is any dom node rendered).
     */
    visibilityRef?: React.ForwardedRef<HTMLDivElement>;
};
export type BasicComponent<Data = {}> = React.FunctionComponent<
    BasicComponentProps<Data>
>;
export type BasicComponentWithPassthroughChildren<Data = {}> =
    React.FunctionComponent<React.PropsWithChildren<BasicComponentProps<Data>>>;
