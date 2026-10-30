import React from "react";
import { BasicComponent } from "../types";

type FootnoteData = {
    props: {
        /** Its number among the document's footnotes. */
        footnoteTag: string;
        text: string;
    };
};

/** Footnote: its number, with its text as the tooltip. */
export const Footnote: BasicComponent<FootnoteData> = ({ node, htmlId }) => {
    const { footnoteTag, text } = node.data.props;
    return (
        <sup className="footnote" id={htmlId} title={text}>
            [{footnoteTag}]
        </sup>
    );
};
