import { FlatDastElement } from "@doenet/doenetml-worker-rust";

export type BasicComponentProps = { node: FlatDastElement };
export type BasicComponent = React.FunctionComponent<BasicComponentProps>;
export type BasicComponentWithPassthroughChildren = React.FunctionComponent<
    React.PropsWithChildren<BasicComponentProps>
>;
