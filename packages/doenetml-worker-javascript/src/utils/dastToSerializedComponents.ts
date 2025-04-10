import type {
    FlatAttribute,
    NormalizedRoot,
    Position,
    RefResolution,
    Source,
} from "@doenet/doenetml-worker";

type SerializedComponent = {
    componentType: string;
    position?: Position;
    idx: number;
    attributes?: FlatAttribute[];
    children: (SerializedComponent | string)[];
    extending?: Source<RefResolution>;
    message?: string;
};

export function dastToSerialized(
    normalizedDast: NormalizedRoot,
    idx = 0,
): SerializedComponent {
    const dastNode = normalizedDast.nodes[idx];

    if (dastNode.type === "Element") {
        const component = {
            componentType: dastNode.name,
            position: dastNode.position,
            idx,
            attributes: dastNode.attributes,
            parent: dastNode.parent,
            children: dastNode.children.map((child) => {
                if (typeof child === "string") {
                    return child;
                } else {
                    return dastToSerialized(normalizedDast, child);
                }
            }),
            extending: dastNode.extending,
        };
        return component;
    } else {
        // Error
        const errorComponent = {
            componentType: "_error",
            position: dastNode.position,
            idx,
            parent: dastNode.parent,
            children: [],
            message: dastNode.message,
        };
        return errorComponent;
    }
}
