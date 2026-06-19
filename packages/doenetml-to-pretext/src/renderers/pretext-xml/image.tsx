import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type ImageData = {
    props: {
        source: string;
        shortDescription?: string;
        decorative: boolean;
        rotate: number;
    };
};

export const Image: BasicComponentWithPassthroughChildren<ImageData> = ({
    node,
    children,
}) => {
    return (
        <image
            {...({
                source: node.data.props.source,
                decorative: node.data.props.decorative ? "yes" : undefined,
                rotate:
                    node.data.props.rotate !== 0
                        ? String(node.data.props.rotate)
                        : undefined,
                // We do a typecast because this is a PreTeXt <image> not an svg image, so Typescript is confused on the types.
            } as any)}
        >
            {node.data.props.shortDescription && (
                <shortdescription>
                    {node.data.props.shortDescription}
                </shortdescription>
            )}
            {children}
        </image>
    );
};
