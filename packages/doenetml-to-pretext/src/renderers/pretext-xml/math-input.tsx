import React from "react";
import { BasicComponent } from "../types";

type MathInputData = { props: { label?: string } };

export const MathInput: BasicComponent<MathInputData> = ({ node }) => {
    const characters = 8;
    const label = node.data.props.label?.trim() || "";
    // It is possible the label has math in it, delimited by \( and \). Split the label by these delimiters
    const labelParts = label.split(/\\\(|\\\)/);
    // Every odd-indexed part is math and should be wrapped in <m> tags.
    const displayLabel = label
        ? [
              ...labelParts.map((part, index) => {
                  if (index % 2 === 0) {
                      return part;
                  } else {
                      return <m key={index}>{part}</m>;
                  }
              }),
              // Add an extra space at the end if we actually have a label.
              " ",
          ]
        : null;

    return (
        <React.Fragment>
            {displayLabel}
            <m>
                <fillin characters={characters} />
            </m>
        </React.Fragment>
    );
};
