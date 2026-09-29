import React from "react";
import type { TextInputPropsInText } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { inputLabelContent } from "./utils/input-label";

type ComponentSize = { size: number; isAbsolute: boolean };

type TextInputData = {
    props: TextInputPropsInText & { label?: string; width?: ComponentSize };
};

/**
 * How wide PreTeXt draws a text blank of one character: `5/11` of an em
 * (`pretext-html.xsl`), at the 16px its theme sets text in.
 */
const PIXELS_PER_CHARACTER = (16 * 5) / 11;

/** The blank for an input whose width is a share of the page, which says nothing about it. */
const DEFAULT_CHARACTERS = 8;

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const { immediateValue: value, width, label } = node.data.props;
    // As wide as the input is on screen, and wide enough for what is in it.
    const fromWidth =
        width?.isAbsolute && width.size > 0
            ? Math.round(width.size / PIXELS_PER_CHARACTER)
            : DEFAULT_CHARACTERS;
    const characters = Math.max(value?.length || 0, fromWidth);

    return (
        <React.Fragment>
            {inputLabelContent(label)}
            <fillin characters={characters} />
        </React.Fragment>
    );
};
