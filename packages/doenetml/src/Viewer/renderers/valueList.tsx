import React, { useContext } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { DynamicMath } from "./utils/DynamicMath";
import { textRendererStyle } from "@doenet/utils";
import type { ResolvedStyleDefinition } from "@doenet/utils";
import { BoardContext } from "./graph";
import { DocContext } from "../DocViewer";
import { ChoiceInputInlineContext } from "./choiceInput";
import { InputLabelContext } from "./utils/inputLabel";

interface ValueListSVs {
    hidden: boolean;
    asList: boolean;
    entryType: "math" | "number";
    entryLatexes: string[];
    entryTexts: string[];
    selectedStyle: ResolvedStyleDefinition;
}

/**
 * A list component (`ValueListComponent` in the worker): one component that
 * holds a list of maths or numbers and draws each of them as a `<math>` or a
 * `<number>` would, separated by commas unless `asList` is false.
 */
export default React.memo(function ValueList(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer<ValueListSVs>(props);

    const board = useContext(BoardContext);
    const choiceInputInlineContext = useContext(ChoiceInputInlineContext);
    const { inheritTextColor } = useContext(InputLabelContext);
    const { darkMode } = useContext(DocContext) || {};

    if (board || SVs.hidden) {
        return null;
    }

    const style =
        !choiceInputInlineContext.inOption && !inheritTextColor
            ? textRendererStyle(darkMode ?? "light", SVs.selectedStyle)
            : undefined;

    const entries = (
        (SVs.entryType === "math" ? SVs.entryLatexes : SVs.entryTexts) ?? []
    ).map((value, ind) => (
        <span key={ind} style={style}>
            <DynamicMath
                latex={SVs.entryType === "math" ? "\\(" + value + "\\)" : value}
            />
        </span>
    ));

    const withSeparators = SVs.asList
        ? entries.flatMap((entry, ind) => (ind > 0 ? [", ", entry] : [entry]))
        : entries;

    return <span id={id}>{withSeparators}</span>;
});
