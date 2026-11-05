import React, { useContext } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext } from "./graph";
import { useContentT } from "../../utils/i18n";

interface BlankSVs {
    hidden: boolean;
}

/**
 * What is missing (D37): a reference to one thing that is not there, or a
 * tag whose source is missing. It is shown as a blank, `＿`, inline, and
 * announced as a blank; none of its children are drawn. In a graph it is not
 * drawn at all, as a hidden component is not, so a missing point is not
 * drawn and cannot be dragged.
 */
export default React.memo(function Blank(props: UseDoenetRendererProps) {
    const { id, SVs } = useDoenetRenderer<BlankSVs>(props, false);
    const board = useContext(BoardContext);
    const tContent = useContentT();

    if (SVs.hidden || board) {
        return null;
    }

    const label = tContent("missing-value-blank", undefined, "blank");

    return (
        <span id={id} role="img" aria-label={label}>
            <span aria-hidden="true">{"＿"}</span>
        </span>
    );
});
