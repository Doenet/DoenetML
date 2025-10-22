// @ts-nocheck
import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faLevelDownAlt,
    faTimes,
    faCloud,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { faCaretRight as twirlIsClosed } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown as twirlIsOpen } from "@fortawesome/free-solid-svg-icons";

import useDoenetRenderer from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { addCommasForCompositeRanges } from "./utils/composites";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";

// Moved most of checkWorkStyle styling into Button
const Button = styled.button`
    position: relative;
    height: 24px;
    display: inline-block;
    color: white;
    background-color: var(--mainBlue);
    padding: 2px;
    /* border: var(--mainBorder); */
    border: none;
    border-radius: var(--mainBorderRadius);
    margin: 0px 4px 4px 0px;

    &:hover {
        background-color: var(--lightBlue);
        color: black;
    }
`;

export default React.memo(function Section(props) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    const submitAllAnswers = () =>
        callAction({
            action: actions.submitAllAnswers,
        });

    let title;
    let removedChildInd = null;
    // BADBADBAD: need to redo how getting the title child
    // getting it using the internal guts of componentInstructions
    // is just asking for trouble
    if (SVs.titleChildName) {
        for (let [ind, child] of children.entries()) {
            //child might be null or a string
            if (
                child?.props?.componentInstructions.componentIdx ===
                SVs.titleChildName
            ) {
                title = children[ind];
                children.splice(ind, 1); // remove title
                removedChildInd = ind;
                break;
            }
        }
    }

    if (title) {
        title = (
            <>
                {SVs.titlePrefix}
                {title}
            </>
        );
    } else if (!SVs.inAList) {
        title = SVs.title;
    }

    let heading = null;
    let headingId = id + "_title";

    if (SVs.collapsible) {
        if (SVs.open) {
            title = (
                <>
                    <FontAwesomeIcon icon={twirlIsOpen} /> {title} (click to
                    close)
                </>
            );
        } else {
            title = (
                <>
                    <FontAwesomeIcon icon={twirlIsClosed} /> {title} (click to
                    open)
                </>
            );
        }
    }

    let headingStyle = {};
    if (SVs.collapsible || SVs.boxed) {
        // remove large margins if heading is in a box
        headingStyle = {
            marginBlockStart: 0,
            marginBlockEnd: 0,
        };
    }

    switch (SVs.level) {
        case 0:
            heading = (
                <h1 id={headingId} style={headingStyle}>
                    {title}
                </h1>
            );
            break;
        case 1:
            heading = (
                <h2 id={headingId} style={headingStyle}>
                    {title}
                </h2>
            );
            break;
        case 2:
            heading = (
                <h3 id={headingId} style={headingStyle}>
                    {title}
                </h3>
            );
            break;
        case 3:
            heading = (
                <h4 id={headingId} style={headingStyle}>
                    {title}
                </h4>
            );
            break;
        case 4:
            heading = (
                <h5 id={headingId} style={headingStyle}>
                    {title}
                </h5>
            );
            break;
        default:
            heading = (
                <h6 id={headingId} style={headingStyle}>
                    {title}
                </h6>
            );
            break;
    }
    // if (SVs.level === 0) {
    //   heading = <span id={headingId} style={{fontSize:'2em'}}>{title}</span>;
    // } else if (SVs.level === 1) {
    //   heading = <span id={headingId} style={{fontSize:'1.5em'}}>{title}</span>;
    // } else if (SVs.level === 2) {
    //   heading = <span id={headingId} style={{fontSize:'1.17em'}}>{title}</span>;
    // } else if (SVs.level === 3) {
    //   heading = <span id={headingId} style={{fontSize:'1em'}}>{title}</span>;
    // } else if (SVs.level === 4) {
    //   heading = <span id={headingId} style={{fontSize:'.83em'}}>{title}</span>;
    // } else if (SVs.level === 5) {
    //   heading = <span id={headingId} style={{fontSize:'.67em'}}>{title}</span>;
    // }

    const validationState = calculateValidationState(SVs);
    let checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitAllAnswers,
        true,
    );

    if (checkWorkComponent) {
        checkWorkComponent = <div>{checkWorkComponent}</div>;
    }

    if (SVs.asList) {
        // If `asList` is specified, then render all children,
        // except for possibly a beginning introduction or ending conclusion,
        // as a list.

        children = children.filter((child) => child !== null);

        const numChildren = children.length;
        let firstInd = SVs.startsWithIntroduction ? 1 : 0;
        let lastInd = SVs.endsWithConclusion
            ? numChildren - 2
            : numChildren - 1;

        const newChildren = [];

        if (SVs.startsWithIntroduction) {
            newChildren.push(children[0]);
        }

        newChildren.push(
            <ol key="list">
                {children.slice(firstInd, lastInd + 1).map((child) => (
                    <li key={child.key}>{child}</li>
                ))}
            </ol>,
        );

        if (SVs.endsWithConclusion) {
            newChildren.push(children[numChildren - 1]);
        }

        children = newChildren;
    } else if (SVs._compositeReplacementActiveRange) {
        children = addCommasForCompositeRanges({
            children,
            compositeReplacementActiveRange:
                SVs._compositeReplacementActiveRange,
            startInd: 0,
            endInd: children.length - 1,
            removedInd: removedChildInd,
        });
    }

    let content = (
        <>
            <a name={id} />
            {heading}
            {children}
            {checkWorkComponent}
        </>
    );

    if (SVs.collapsible) {
        let innerContent = null;
        if (SVs.open) {
            innerContent = (
                <div style={{ display: "block", padding: "6px" }}>
                    {SVs.rendered ? children : <p>Initializing...</p>}
                    {checkWorkComponent}
                </div>
            );
        }
        content = (
            <div
                style={{
                    border: "var(--mainBorder)",
                    borderRadius: "var(--mainBorderRadius)",
                    marginTop: "24px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "var(--mainGray)",
                        cursor: "pointer",
                        padding: "6px",
                        borderBottom: SVs.open ? "var(--mainBorder)" : "none",
                        borderTopLeftRadius: "var(--mainBorderRadius)",
                        borderTopRightRadius: "var(--mainBorderRadius)",
                    }}
                    tabIndex="0"
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            callAction({
                                action: SVs.open
                                    ? actions.closeSection
                                    : actions.revealSection,
                            });
                        }
                    }}
                    onClick={() =>
                        callAction({
                            action: SVs.open
                                ? actions.closeSection
                                : actions.revealSection,
                        })
                    }
                >
                    <a name={id} />
                    {heading}
                </div>
                {innerContent}
            </div>
        );
    } else if (SVs.boxed) {
        content = (
            <div
                style={{
                    border: "var(--mainBorder)",
                    borderRadius: "var(--mainBorderRadius)",
                    marginTop: "24px",
                }}
            >
                <div
                    style={{
                        padding: "6px",
                        borderBottom: "var(--mainBorder)",
                        backgroundColor: "var(--mainGray)",
                        borderTopLeftRadius: "var(--mainBorderRadius)",
                        borderTopRightRadius: "var(--mainBorderRadius)",
                    }}
                >
                    <a name={id} />
                    {heading}
                </div>
                <div style={{ display: "block", padding: "6px" }}>
                    {children}
                    {checkWorkComponent}
                </div>
            </div>
        );
    }

    switch (SVs.containerTag) {
        case "aside":
            return (
                <aside id={id} style={{ margin: "12px 0" }} ref={ref}>
                    {" "}
                    {content}{" "}
                </aside>
            );
        case "article":
            return (
                <article id={id} style={{ margin: "12px 0" }} ref={ref}>
                    {" "}
                    {content}{" "}
                </article>
            );
        case "div":
            return (
                <div id={id} style={{ margin: "12px 0" }} ref={ref}>
                    {" "}
                    {content}{" "}
                </div>
            );
        default:
            return (
                <section id={id} style={{ margin: "12px 0" }} ref={ref}>
                    {" "}
                    {content}{" "}
                </section>
            );
    }
});
