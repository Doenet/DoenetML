import React, { useContext, useRef } from "react";
import { DocContext } from "../DocViewer";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import "./ref.css";

export default React.memo(function Ref(props: UseDoenetRendererProps) {
    const { id, SVs, children, requestScrollTo } = useDoenetRenderer(props);

    const { doenetViewerUrl } = useContext(DocContext) || {};

    const aRef = useRef<HTMLAnchorElement>(null);

    const { targetForATag, url, scrollOnlyLink } = getURLFromRef({
        url: SVs.url,
        activityId: SVs.activityId,
        activityUrlPostfix: SVs.activityUrlPostfix,
        targetRendererId: SVs.targetRendererId,
        doenetViewerUrl,
    });

    function handleLinkClick(
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) {
        if (!scrollOnlyLink) {
            return;
        }

        // If requestScrollTo is defined,
        // then use requestScrollTo to achieve scrolling rather than the default effect of the link.
        // This is needed, in particular, if doenetml is running inside an iframe
        if (requestScrollTo) {
            e.preventDefault();

            const targetId = url.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                requestScrollTo(targetElement.offsetTop);
            }
        }
    }

    if (SVs.hidden) {
        return null;
    }

    let linkContent = children;
    if (children.length === 0) {
        linkContent = SVs.linkText;
    }

    if (SVs.createButton) {
        const refClass =
            "ref-button" + (SVs.disabled ? " ref-button-disabled" : "");

        if (targetForATag === "_blank") {
            return (
                <span id={id}>
                    <button
                        id={id + "_button"}
                        onClick={() =>
                            window.open(url, targetForATag || undefined)
                        }
                        disabled={SVs.disabled}
                        className={refClass}
                    >
                        {SVs.linkText}
                    </button>
                </span>
            );
        } else {
            return (
                <span id={id}>
                    <button
                        id={id + "_button"}
                        onClick={() => {
                            window.location.href = url;
                        }}
                        disabled={SVs.disabled}
                        className={refClass}
                    >
                        {SVs.linkText}
                    </button>
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
                onClick={handleLinkClick}
                ref={aRef}
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
    let scrollOnlyLink = false;

    if (targetRendererId) {
        url = `#${targetRendererId}`;
        scrollOnlyLink = true;
    } else if (activityId) {
        url = `${doenetViewerUrl}/${activityId}${activityUrlPostfix}`;
        targetForATag = "_blank";
    } else {
        scrollOnlyLink = url.startsWith("#");
        targetForATag = scrollOnlyLink ? null : "_blank";
    }

    return { targetForATag, url, scrollOnlyLink };
}
