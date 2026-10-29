import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import "./side-by-side.css";

type SideBySideData = {
    props: {
        /** Widths in percent of the row; NaN shares what is left. */
        widths: number[];
    };
};

/**
 * SideBySide renders its children in a row, each its width.
 *
 * Sample code
 * -----------
 * ```
   <sideBySide widths="40% 60%"><p>left</p><p>right</p></sideBySide>
  ```
 */
export const SideBySide: BasicComponentWithPassthroughChildren<
    SideBySideData
> = ({ node, children, htmlId }) => {
    const widths = node.data.props.widths ?? [];

    return (
        <div className="side-by-side" id={htmlId}>
            {React.Children.toArray(children)
                .filter((child) => typeof child !== "string" || child.trim())
                .map((child, i) => (
                    <div
                        key={i}
                        style={{
                            flex: Number.isFinite(widths[i])
                                ? `0 0 ${widths[i]}%`
                                : "1 1 0",
                        }}
                    >
                        {child}
                    </div>
                ))}
        </div>
    );
};
