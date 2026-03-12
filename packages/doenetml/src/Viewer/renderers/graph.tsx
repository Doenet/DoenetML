// @ts-nocheck
import React, { useEffect, useRef, createContext } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { JXGBoard } from "./jsxgraph-distrib/types";
import Prefigure from "./prefigure";
import GraphFrame from "./GraphFrame";
import JSXGraphRenderer from "./JSXGraphRenderer";

export const BoardContext = createContext<JXGBoard | null>(null);

export default React.memo(function Graph(props) {
    let { id, SVs, children, ignoreUpdate, actions, callAction } =
        useDoenetRenderer(props);

    Graph.baseStateVariable = "boundingbox";

    const graphRenderer = SVs.effectiveRenderer ?? SVs.renderer;
    const isPrefigureRenderer = graphRenderer === "prefigure";

    const containerRef = useRef(null);

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

    return (
        <GraphFrame
            id={id}
            SVs={SVs}
            isPrefigureRenderer={isPrefigureRenderer}
            containerRef={containerRef}
            descriptionChild={descriptionChild}
        >
            {(surfaceStyle) =>
                isPrefigureRenderer ? (
                    <Prefigure id={id} SVs={SVs} surfaceStyle={surfaceStyle} />
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
                )
            }
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
