import React, { useRef, useContext, ReactElement } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { DocContext } from "../DocViewer";
import { AnswerResponseMenu } from "./utils/AnswerResponseMenu";
import "./pretzel.css";
import { createCheckworkComponent } from "../../utils/checkwork";

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
    } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    const { showAnswerResponseMenu, answerResponseCounts } =
        useContext(DocContext) || {};

    if (SVs.hidden) {
        return null;
    }

    let disabled = SVs.disabled;

    let submitAnswer = () =>
        callAction({
            action: actions.submitAnswer,
        });

    let answerResponseMenu = null;
    if (showAnswerResponseMenu) {
        answerResponseMenu = (
            <AnswerResponseMenu
                answerId={id}
                answerComponentIdx={componentIdx}
                docId={docId}
                activityId={activityId}
                numResponses={answerResponseCounts?.[componentIdx]}
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

    if (!SVs.suppressCheckwork) {
        const checkworkComponent = createCheckworkComponent(
            SVs,
            disabled,
            id,
            submitAnswer,
        );

        return (
            <div id={id} ref={ref} style={{ marginBottom: "4px" }}>
                {problemGrids}
                {checkworkComponent}
                {answerResponseMenu}
            </div>
        );
    } else {
        return (
            <div id={id} ref={ref} style={{ marginBottom: "4px" }}>
                {problemGrids}
                {answerResponseMenu}
            </div>
        );
    }
});
