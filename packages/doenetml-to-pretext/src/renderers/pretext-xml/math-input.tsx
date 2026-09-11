import React from "react";
import { BasicComponent } from "../types";
import { AnswerLabelContext } from "./answer-label-context";

type MathInputData = { props: { label?: string } };

export const MathInput: BasicComponent<MathInputData> = ({ node }) => {
    const characters = 8;
    const ownLabel = node.data.props.label?.trim() || "";
    // Drop the label the answer around it already rendered; keep one written here.
    const answerLabel = React.useContext(AnswerLabelContext);
    const inheritedFromAnswer = Boolean(ownLabel) && ownLabel === answerLabel;
    const label = inheritedFromAnswer ? "" : ownLabel;
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
        : // The answer rendered the label instead, but the space that separated it from
          // the blank was this component's, so it still has to be supplied.
          inheritedFromAnswer
          ? " "
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
