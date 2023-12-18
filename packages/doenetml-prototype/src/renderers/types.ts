import { FlatDastElement } from "@doenet/doenetml-worker-rust";

export type BasicComponentProps<Data = {}> = {
    node: FlatDastElement & { data: Data };
};
export type BasicComponent<Data = {}> = React.FunctionComponent<
    BasicComponentProps<Data>
>;
export type BasicComponentWithPassthroughChildren<Data = {}> =
    React.FunctionComponent<React.PropsWithChildren<BasicComponentProps<Data>>>;
