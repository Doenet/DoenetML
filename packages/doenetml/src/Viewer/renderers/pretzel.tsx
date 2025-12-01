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

    const submitAnswer = () =>
        callAction({
            action: actions.submitAnswer,
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
                >
                    <div className="pretzelAnswerInput">
                        <div>
                            <b>Answer</b>: {answer}
                        </div>
                        <div>
                            <span className="pretzelInput">{input}</span>
                        </div>
                    </div>
                    <div className="pretzelStatement">{statement}</div>
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

    const validationState = calculateValidationState(SVs);
    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitAnswer,
        true,
    );

    return (
        <span id={id} style={{ marginBottom: "4px" }}>
            {problemGrids}
            {checkWorkComponent}
            {answerResponseButton}
        </span>
    );
});
