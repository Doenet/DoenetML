// @ts-nocheck
import React from "react";
import { sizeToCSS } from "./utils/css";
import { DescriptionAsDetails, DescriptionPopover } from "./utils/Description";

export default function GraphFrame({
    id,
    SVs,
    isPrefigureRenderer,
    containerRef,
    descriptionChild,
    hasInteractiveControls,
    children,
}) {
    const contentStyle: React.CSSProperties = {
        width: sizeToCSS(SVs.width),
        aspectRatio: String(SVs.aspectRatio),
        maxWidth: "100%",
    };

    let outerStyle: React.CSSProperties = {};
    let innerStyle: React.CSSProperties = {};

    if (SVs.hidden) {
        contentStyle.display = "none";
    } else if (SVs.displayMode === "inline") {
        outerStyle = { display: "inline-block", verticalAlign: "middle" };
        innerStyle = {
            display: "inline-flex",
            alignItems: "start",
            width: "100%",
        };
    } else {
        outerStyle = { display: "flex", justifyContent: SVs.horizontalAlign };
        innerStyle = { maxWidth: "100%" };
    }

    if (SVs.showBorder) {
        contentStyle.border = "2px solid var(--canvasText)";
    } else {
        contentStyle.border = "none";
    }
    contentStyle.marginBottom = "12px";
    contentStyle.marginTop = "12px";
    contentStyle.backgroundColor = "var(--canvas)";
    contentStyle.color = "var(--canvasText)";

    let ariaLabel: string | undefined = SVs.shortDescription;
    let role: string | undefined =
        isPrefigureRenderer || hasInteractiveControls ? "group" : "img";
    let ariaHidden = false;
    if (SVs.decorative) {
        ariaLabel = undefined;
        role = undefined;
        ariaHidden = true;
    }

    let descriptionId: string | undefined = undefined;
    let description: React.ReactNode | null = null;

    if (descriptionChild) {
        descriptionId = `${id}-description-content`;
        description =
            SVs.displayMode === "inline" ? (
                <DescriptionPopover>
                    <div id={descriptionId}>{descriptionChild}</div>
                </DescriptionPopover>
            ) : (
                <DescriptionAsDetails>
                    <div id={descriptionId}>{descriptionChild}</div>
                </DescriptionAsDetails>
            );
    }

    const content =
        typeof children === "function" ? children(contentStyle) : children;

    return (
        <div style={outerStyle} ref={containerRef} id={`${id}-container`}>
            <div style={innerStyle}>
                <div
                    id={`${id}-description`}
                    aria-label={ariaLabel}
                    role={role}
                    aria-hidden={ariaHidden}
                    style={{ maxWidth: "100%" }}
                    aria-details={descriptionId}
                >
                    {content}
                </div>
                {description}
            </div>
        </div>
    );
}
