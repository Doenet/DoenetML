// @ts-nocheck
import React, { useEffect, useRef, useState, createContext } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { JXGBoard } from "./jsxgraph-distrib/types";
import Prefigure from "./prefigure";
import GraphControls from "./GraphControls";
import GraphFrame from "./GraphFrame";
import JSXGraphRenderer from "./JSXGraphRenderer";

export const BoardContext = createContext<JXGBoard | null>(null);

type ControlsPosition = "bottom" | "left" | "right" | "top";

const MIN_GRAPH_WIDTH_FOR_SIDE_LAYOUT_PX = 280;
const SIDE_SLIDER_COLUMN_WIDTH_PX = 220;
const SIDE_LAYOUT_GAP_PX = 12;
const MIN_SIDE_LAYOUT_WIDTH_PX =
    MIN_GRAPH_WIDTH_FOR_SIDE_LAYOUT_PX +
    SIDE_SLIDER_COLUMN_WIDTH_PX +
    SIDE_LAYOUT_GAP_PX;

function normalizeControlsPosition(value: unknown): ControlsPosition {
    if (
        value === "bottom" ||
        value === "left" ||
        value === "right" ||
        value === "top"
    ) {
        return value;
    }

    return "left";
}

export default React.memo(function Graph(props) {
    let { id, SVs, children, ignoreUpdate, actions, callAction } =
        useDoenetRenderer(props);

    Graph.baseStateVariable = "boundingbox";

    const graphRenderer = SVs.effectiveRenderer ?? SVs.renderer;
    const isPrefigureRenderer = graphRenderer === "prefigure";

    const containerRef = useRef(null);
    const [availableWidth, setAvailableWidth] = useState<number | null>(null);

    useRecordVisibilityChanges(
        containerRef,
        callAction,
        actions,
        SVs.haveGraphParent,
    );

    useEffect(() => {
        if (SVs.haveGraphParent) {
            return;
        }
        return () => {
            callAction({
                action: actions.recordVisibilityChange,
                args: { isVisible: false },
            });
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current as HTMLDivElement | null;
        if (!container) {
            return;
        }

        function updateContainerWidth() {
            setAvailableWidth(container.clientWidth);
        }

        updateContainerWidth();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", updateContainerWidth);
            return () => {
                window.removeEventListener("resize", updateContainerWidth);
            };
        }

        const observer = new ResizeObserver(() => {
            updateContainerWidth();
        });
        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, []);

    const graphicalChildren = [...children];
    if (SVs.descriptionChildInd !== -1) {
        graphicalChildren.splice(SVs.descriptionChildInd, 1);
    }

    if (SVs.haveGraphParent) {
        // have have graph parent, then don't render graph
        // but just render children so that will be inside parent graph
        return (
            <>
                <span id={id} />
                {graphicalChildren}
            </>
        );
    }

    const descriptionChild =
        SVs.descriptionChildInd !== -1 && children[SVs.descriptionChildInd];

    const requestedControlsPosition = normalizeControlsPosition(
        SVs.controlsPosition,
    );
    const canUseSideLayout =
        availableWidth === null || availableWidth >= MIN_SIDE_LAYOUT_WIDTH_PX;
    const effectiveControlsPosition: ControlsPosition =
        requestedControlsPosition === "left" && !canUseSideLayout
            ? "top"
            : requestedControlsPosition === "right" && !canUseSideLayout
              ? "bottom"
              : requestedControlsPosition;
    const useSideLayout =
        effectiveControlsPosition === "left" ||
        effectiveControlsPosition === "right";

    const layoutStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: useSideLayout ? "row" : "column",
        alignItems: useSideLayout ? "flex-start" : "stretch",
        gap: `${SIDE_LAYOUT_GAP_PX}px`,
        width: "100%",
        minWidth: 0,
    };

    const graphSectionStyle: React.CSSProperties = {
        order:
            effectiveControlsPosition === "top" ||
            effectiveControlsPosition === "left"
                ? 2
                : 1,
        flex: useSideLayout ? "1 1 auto" : undefined,
        width: useSideLayout ? undefined : "100%",
        minWidth: useSideLayout ? `${MIN_GRAPH_WIDTH_FOR_SIDE_LAYOUT_PX}px` : 0,
    };

    const controlsSectionStyle: React.CSSProperties = {
        order:
            effectiveControlsPosition === "top" ||
            effectiveControlsPosition === "left"
                ? 1
                : 2,
        width: useSideLayout ? `${SIDE_SLIDER_COLUMN_WIDTH_PX}px` : "100%",
        maxWidth: useSideLayout
            ? `${SIDE_SLIDER_COLUMN_WIDTH_PX}px`
            : undefined,
        minWidth: 0,
    };

    return (
        <GraphFrame
            id={id}
            SVs={SVs}
            isPrefigureRenderer={isPrefigureRenderer}
            containerRef={containerRef}
            descriptionChild={descriptionChild}
        >
            {(surfaceStyle) => (
                <div style={layoutStyle}>
                    <div style={graphSectionStyle}>
                        {isPrefigureRenderer ? (
                            <Prefigure
                                id={id}
                                SVs={SVs}
                                surfaceStyle={surfaceStyle}
                            />
                        ) : (
                            <JSXGraphRenderer
                                id={id}
                                SVs={SVs}
                                ignoreUpdate={ignoreUpdate}
                                actions={actions}
                                callAction={callAction}
                                BoardContext={BoardContext}
                                surfaceStyle={surfaceStyle}
                            >
                                {graphicalChildren}
                            </JSXGraphRenderer>
                        )}
                    </div>
                    <div style={controlsSectionStyle}>
                        <GraphControls
                            id={`${id}-controls`}
                            SVs={SVs}
                            callAction={callAction}
                        />
                    </div>
                </div>
            )}
        </GraphFrame>
    );
});

// ticks labels: layer 2 overall

// NOTE: there can be at most 10 different layer offsets,
// given that the DoenetML layer is multiplied by 10 and added to these offsets
let tempCounter = 0;
export const BASE_LAYER_OFFSET = tempCounter++;
export const IMAGE_LAYER_OFFSET = tempCounter++;
export const LINE_LAYER_OFFSET = tempCounter++;
export const VERTEX_LAYER_OFFSET = tempCounter++;
export const CONTROL_POINT_LAYER_OFFSET = tempCounter++;
export const POINT_LAYER_OFFSET = tempCounter++;
export const TEXT_LAYER_OFFSET = tempCounter++;
