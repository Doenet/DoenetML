import React, { useRef, useContext, ReactElement } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { DocContext } from "../DocViewer";
import { AnswerResponseButton } from "./utils/AnswerResponseButton";
import "./pretzel.css";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";

export default React.memo(function Pretzel(props: UseDoenetRendererProps) {
    let {
        componentIdx,
        id,
        SVs,
        docId,
        activityId,
        children,
        actions,
        callAction,
        flags,
    } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    const { showAnswerResponseButton, answerResponseCounts } =
        useContext(DocContext) || {};

    if (SVs.hidden) {
        return null;
    }

    const validationState = calculateValidationState(SVs);
    const { isPending, submitActionWithPending } =
        useSubmitActionWithDelay({
            actionKey: "submitAnswer",
            actions,
            callAction,
            validationState,
            justSubmitted: SVs.justSubmitted,
        });

    let answerResponseButton = null;
    if (showAnswerResponseButton) {
        answerResponseButton = (
            <AnswerResponseButton
                answerId={id}
                answerComponentIdx={componentIdx}
                docId={docId}
                activityId={activityId}
                numResponses={answerResponseCounts?.[id]}
                flags={flags}
            />
        );
    }

    const numProblems = SVs.numProblems;
    const numGroups = Math.ceil(numProblems / 12);

    const problemGrids: ReactElement[] = [];

    for (let grp = 0; grp < numGroups; grp++) {
        const problems: ReactElement[] = [];

        for (
            let prob = grp * 12;
            prob < Math.min((grp + 1) * 12, numProblems);
            prob++
        ) {
            const answer = children[3 * prob];
            const input = children[3 * prob + 1];
            const statement = children[3 * prob + 2];
            const gridIdx = prob % 12;

            const problem = (
                <div
                    className={`pretzel${gridIdx + 1} pretzelProblem`}
                    key={prob}
                    data-test="pretzel-problem-row"
                    data-row-index={prob}
                >
                    <div
                        className="pretzelAnswer"
                        data-test="pretzel-row-answer"
                    >
                        <b>Answer</b>: {answer}
                    </div>
                    <div
                        className="pretzelInputStatement"
                        data-test="pretzel-row-input-statement"
                    >
                        <div data-test="pretzel-row-input">
                            <span>{input}</span>
                        </div>
                        <div data-test="pretzel-row-statement">{statement}</div>
                    </div>
                </div>
            );

            problems.push(problem);
        }

        let gridClasses = `pretzelWrapper pretzelWrapper${SVs.maxNumColumns}`;
        if (grp === 0) {
            gridClasses += " pretzelWrapperTop";
        }
        if (grp === numGroups - 1) {
            gridClasses += " pretzelWrapperBottom";
        }

        const grid = (
            <div className={gridClasses} key={grp}>
                {problems}
            </div>
        );
        problemGrids.push(grid);
    }

    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitActionWithPending,
        true,
        isPending,
    );

    return (
        <span id={id} style={{ marginBottom: "4px" }} data-test="pretzel-root">
            {problemGrids}
            {checkWorkComponent}
            {answerResponseButton}
        </span>
    );
});
