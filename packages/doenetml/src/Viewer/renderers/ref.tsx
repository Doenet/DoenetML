import React, { useContext } from "react";
import { DocContext } from "../DocViewer";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import styled from "styled-components";

const RefButton = styled.button`
    position: relative;
    height: 24px;
    display: inline-block;
    color: white;
    color: ${(props) =>
        props.disabled ? "var(--canvasText)" : "var(--canvas)"};
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
            props.disabled ? "var(--canvasText)" : "var(--canvas)"};
    }

    &:focus {
        outline: 2px solid var(--mainBlue);
        outline-offset: 2px;
    }
`;

export default React.memo(function Ref(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer(props);

    let { doenetViewerUrl } = useContext(DocContext) || {};

    if (SVs.hidden) {
        return null;
    }

    let linkContent = children;
    if (children.length === 0) {
        linkContent = SVs.linkText;
    }

    let { targetForATag, url } = getURLFromRef({
        url: SVs.url,
        activityId: SVs.activityId,
        activityUrlPostfix: SVs.activityUrlPostfix,
        targetRendererId: SVs.targetRendererId,
        doenetViewerUrl,
    });

    if (SVs.createButton) {
        if (targetForATag === "_blank") {
            return (
                <span id={id}>
                    <RefButton
                        id={id + "_button"}
                        onClick={() =>
                            window.open(url, targetForATag || undefined)
                        }
                        disabled={SVs.disabled}
                    >
                        {SVs.linkText}
                    </RefButton>
                </span>
            );
        } else {
            return (
                <span id={id}>
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
        // TODO: we cannot use a `<Link>` since component is not necessarily contained in a <Router>.
        // We need a solution for proper behavior of scrolling
        return (
            <a
                style={{
                    color: "var(--mainBlue)",
                    borderRadius: "5px",
                }}
                target={targetForATag || undefined}
                id={id}
                href={url}
            >
                {linkContent}
            </a>
        );
    }
});

export function getURLFromRef({
    url,
    activityId,
    activityUrlPostfix,
    targetRendererId,
    doenetViewerUrl = "https://doenet.org/activityViewer",
}: {
    url: string;
    activityId: string;
    activityUrlPostfix: string;
    targetRendererId?: number;
    doenetViewerUrl?: string;
}) {
    let targetForATag: string | null = null;

    if (targetRendererId) {
        url = `#${targetRendererId}`;
    } else if (activityId) {
        url = `${doenetViewerUrl}/${activityId}${activityUrlPostfix}`;
        targetForATag = "_blank";
    } else {
        targetForATag = url.startsWith("#") ? null : "_blank";
    }

    return { targetForATag, url };
}
