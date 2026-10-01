import React from "react";
import type { TextInputPropsInText } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { TEXT_FILLIN_CHARACTERS } from "./fillin-width";
import { useInputLabel } from "./use-input-label";

type ComponentSize = { size: number; isAbsolute: boolean };

type TextInputData = {
    props: TextInputPropsInText & {
        label?: string;
        labelElementId?: number;
        width?: ComponentSize;
    };
};

/**
 * How wide PreTeXt draws a text blank of one character: `5/11` of an em
 * (`pretext-html.xsl`), at the 16px its theme sets text in.
 */
const PIXELS_PER_CHARACTER = (16 * 5) / 11;

/**
 * The width the core gives a text input that was given none (`TextInput.js`). The
 * converter sees only the resolved width, so an input at exactly this width is taken to
 * have been left at the default.
 */
const DEFAULT_WIDTH_PIXELS = 100;

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const {
        immediateValue: value,
        width,
        label,
        labelElementId,
    } = node.data.props;
    // An input given a width of its own prints that wide. One left at the default, or
    // given a share of the page, which says nothing about paper, gets the blank that is
    // as long as a math blank, so the two read as the same kind of answer space.
    const authoredPixels =
        width?.isAbsolute &&
        width.size > 0 &&
        width.size !== DEFAULT_WIDTH_PIXELS
            ? width.size
            : undefined;
    const fromWidth =
        authoredPixels !== undefined
            ? Math.round(authoredPixels / PIXELS_PER_CHARACTER)
            : TEXT_FILLIN_CHARACTERS;
    // Wide enough, too, for what is already in it.
    const characters = Math.max(value?.length || 0, fromWidth);
    const displayLabel = useInputLabel(label, labelElementId);

    return (
        <React.Fragment>
            {displayLabel}
            <fillin characters={characters} />
        </React.Fragment>
    );
};
