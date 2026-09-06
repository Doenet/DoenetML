import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import GraphFrame, { GraphFrameSVs } from "./GraphFrame";
import Prefigure from "./prefigure";
import { useRecordVisibilityChanges } from "../../utils/visibility";

interface BarChartSVs extends GraphFrameSVs {
    prefigureXML: string | null;
    hasAuthorAnnotations: boolean;
}

/**
 * `<barChart>` renders through PreFigure, which is already a general
 * "compile this diagram XML" renderer: its whole input is `prefigureXML`.
 *
 * So this is a frame and a hand-off. `GraphFrame` supplies the sizing, border,
 * background and accessible description that `<graph>` gets, which is why
 * `<barChart>` declares the framing state variables `GraphFrameSVs` asks for
 * rather than inventing its own — and nothing else of a graph's.
 */
export default React.memo(function BarChart(props: UseDoenetRendererProps) {
    const { id, SVs, actions, callAction } =
        useDoenetRenderer<BarChartSVs>(props);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(containerRef, callAction, actions);

    return (
        <GraphFrame
            id={id}
            SVs={SVs}
            isPrefigureRenderer={true}
            containerRef={containerRef}
            descriptionChild={false}
            hasInteractiveControls={false}
        >
            {(surfaceStyle) => (
                <Prefigure id={id} SVs={SVs} surfaceStyle={surfaceStyle} />
            )}
        </GraphFrame>
    );
});
