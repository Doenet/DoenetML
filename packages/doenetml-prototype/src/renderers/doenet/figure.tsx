import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { Element } from "../element";

type FigureData = {
    props: {
        /** The caption as text, when there is no `<caption>` child. */
        caption: string;
        /** The `<caption>` child, drawn in the caption; null without one. */
        captionChild: number | null;
        /** "Figure 2" and "Figure 2: ", as the core composes them. */
        figureName: string;
        figureNamePrefix: string;
        suppressFigureNameInCaption: boolean;
    };
};

/** Figure: its content, then its caption under the figure's name. */
export const Figure: BasicComponentWithPassthroughChildren<FigureData> = ({
    node,
    children,
    htmlId,
    ancestors,
}) => {
    const {
        caption,
        captionChild,
        figureName,
        figureNamePrefix,
        suppressFigureNameInCaption,
    } = node.data.props;
    const name = suppressFigureNameInCaption
        ? ""
        : captionChild != null
          ? figureNamePrefix
          : figureName;
    return (
        <figure className="figure" id={htmlId}>
            {children}
            {name || captionChild != null || caption ? (
                <figcaption>
                    {name ? <strong>{name}</strong> : null}
                    {captionChild != null ? (
                        <Element id={captionChild} ancestors={ancestors} />
                    ) : (
                        caption
                    )}
                </figcaption>
            ) : null}
        </figure>
    );
};
