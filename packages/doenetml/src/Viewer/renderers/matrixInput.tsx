// @ts-nocheck
import React, { useContext, useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
// import me from 'math-expressions';
import { ActionButton } from "@doenet/ui-components";
import { ActionButtonGroup } from "@doenet/ui-components";

import "./matrixInput.css";
import "./mathInput.css";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";

export default React.memo(function MatrixInput(props) {
    let { id, SVs, actions, children, callAction } = useDoenetRenderer(props);

    // need to use a ref for validation state as handlePressEnter
    // does not update to current values
    let validationState = useRef<
        "unvalidated" | "correct" | "incorrect" | "partialcorrect"
    >("unvalidated");

    const updateValidationState = () => {
        validationState.current = calculateValidationState(SVs);
    };

    if (SVs.hidden) {
        return null;
    }

    updateValidationState();

    const disabled = SVs.disabled;

    // const inputKey = id + '_input';

    let surroundingBorderColor = getComputedStyle(
        document.documentElement,
    ).getPropertyValue("--mainGray");
    // if (this.focused) {
    //   surroundingBorderColor = "#82a5ff";
    // }

    const submitAnswer = () =>
        callAction({
            action: actions.submitAnswer,
        });

    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState.current,
        submitAnswer,
        false,
    );

    let matrixInputs = [];

    for (let rowInd = 0; rowInd < SVs.numRows; rowInd++) {
        let mathinputRow = [];

        for (let colInd = 0; colInd < SVs.numColumns; colInd++) {
            mathinputRow.push(
                <td
                    key={colInd}
                    className="matrixCell"
                    id={id + "_component_" + rowInd + "_" + colInd}
                >
                    {children[rowInd * SVs.numColumns + colInd]}
                </td>,
            );
        }

        matrixInputs.push(<tr key={rowInd}>{mathinputRow}</tr>);
    }

    let rowNumControls = null;
    if (SVs.showSizeControls) {
        rowNumControls = (
            <span style={{ margin: "0px 4px 4px 0px" }}>
                <ActionButtonGroup>
                    <ActionButton
                        id={id + "_rowDecrement"}
                        value="r-"
                        onClick={() =>
                            callAction({
                                action: actions.updateNumRows,
                                args: { numRows: SVs.numRows - 1 },
                            })
                        }
                        disabled={SVs.numRows < 2 || disabled}
                    >
                        r-
                    </ActionButton>
                    <ActionButton
                        id={id + "_rowIncrement"}
                        value="r+"
                        onClick={() =>
                            callAction({
                                action: actions.updateNumRows,
                                args: { numRows: SVs.numRows + 1 },
                            })
                        }
                        disabled={disabled}
                    >
                        r+
                    </ActionButton>
                </ActionButtonGroup>
            </span>
        );
    }
    let colNumControls = null;
    if (SVs.showSizeControls) {
        colNumControls = (
            <span style={{ margin: "0px 4px 4px 0px" }}>
                <ActionButtonGroup>
                    <ActionButton
                        id={id + "_columnDecrement"}
                        value="c-"
                        onClick={() =>
                            callAction({
                                action: actions.updateNumColumns,
                                args: { numColumns: SVs.numColumns - 1 },
                            })
                        }
                        disabled={SVs.numColumns < 2 || disabled}
                    >
                        c-
                    </ActionButton>
                    <ActionButton
                        id={id + "_columnIncrement"}
                        value="c+"
                        onClick={() =>
                            callAction({
                                action: actions.updateNumColumns,
                                args: { numColumns: SVs.numColumns + 1 },
                            })
                        }
                        disabled={disabled}
                    >
                        c+
                    </ActionButton>
                </ActionButtonGroup>
            </span>
        );
    }

    return (
        <React.Fragment>
            <a name={id} />
            <div style={{ display: "inline-flex", margin: "0px 4px 4px 4px" }}>
                <div className="matrix-input" id={id}>
                    <table>
                        <tbody>{matrixInputs}</tbody>
                    </table>
                </div>
                <div style={{ marginRight: "4px" }}></div>
                {rowNumControls}
                {colNumControls}
                {checkWorkComponent}
            </div>
        </React.Fragment>
    );
});
