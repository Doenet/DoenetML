// @ts-nocheck
import React, { useContext } from "react";
import { DocContext, getURLFromRef } from "../DocViewer";
import useDoenetRenderer from "../useDoenetRenderer";
import styled from "styled-components";

// const LinkStyling = styled.a`
//     color: var(--mainBlue);
//     border-radius: 5px;
//     &: focus {
//       outline: 2px solid var(--mainBlue);
//     }
//   `;

const RefButton = styled.button`
    position: relative;
    height: 24px;
    display: inline-block;
    color: white;
    color: ${(props) =>
        props.disabled ? "var(--canvastext)" : "var(--canvas)"};
    background-color: ${(props) =>
        props.disabled ? "var(--mainGray)" : "var(--mainBlue)"};

    padding: 2px;
    border: none;
    border-radius: var(--mainBorderRadius);
    cursor: pointer;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    padding: 1px 6px 1px 6px;

    &:hover {
        background-color: ${(props) =>
            props.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
        color: ${(props) =>
            props.disabled ? "var(--canvastext)" : "var(--canvas)"};
    }

    &:focus {
        outline: 2px solid var(--mainBlue);
        outline-offset: 2px;
    }
`;

export default React.memo(function Ref(props) {
    let { name, id, SVs, children } = useDoenetRenderer(props);

    let { location = {}, linkSettings } = useContext(DocContext) || {};

    let search = location.search || "";

    if (SVs.hidden) {
        return null;
    }

    let linkContent = children;
    if (children.length === 0) {
        linkContent = SVs.linkText;
    }

    let { targetForATag, url, haveValidTarget, externalUri } = getURLFromRef({
        cid: SVs.cid,
        activityId: SVs.activityId,
        variantIndex: SVs.variantIndex,
        edit: SVs.edit,
        hash: SVs.hash,
        givenUri: SVs.uri,
        targetIdx: SVs.targetIdx,
        linkSettings,
        search,
        id,
    });

    if (SVs.createButton) {
        if (targetForATag === "_blank") {
            return (
                <span id={id}>
                    <a name={id} />
                    <RefButton
                        id={id + "_button"}
                        onClick={() => window.open(url, targetForATag)}
                        disabled={SVs.disabled}
                    >
                        {SVs.linkText}
                    </RefButton>
                </span>
            );
        } else {
            return (
                <span id={id}>
                    <a name={id} />
                    <RefButton
                        id={id + "_button"}
                        onClick={() => {
                            window.location.href = url;
                        }}
                        disabled={SVs.disabled}
                    >
                        {SVs.linkText}
                    </RefButton>
                </span>
            );
        }
    } else {
        if (haveValidTarget) {
            // TODO: we cannot use a `<Link>` since component is not necessarily contained in a <Router>.
            // We need a solution for proper behavior of scrolling
            return (
                <a
                    style={{
                        color: "var(--mainBlue)",
                        borderRadius: "5px",
                    }}
                    target={targetForATag}
                    id={id}
                    name={id}
                    href={url}
                >
                    {linkContent}
                </a>
            );
        } else {
            return <span id={id}>{linkContent}</span>;
        }
    }
});
