import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import GraphFrame, { GraphFrameSVs } from "./GraphFrame";
import Prefigure from "./prefigure";
import { useRecordVisibilityChanges } from "../../utils/visibility";

interface ChartSVs extends GraphFrameSVs {
    prefigureXML: string | null;
    hasAuthorAnnotations: boolean;
}

/**
 * `<chart>` renders through PreFigure, which is already a general "compile this
 * diagram XML" renderer: its whole input is `prefigureXML`. So this is a frame
 * and a hand-off, and it stays one however many chart types the worker learns
 * to draw — a pie chart differs from a bar chart in the XML it produces, not in
 * what surrounds it.
 *
 * `GraphFrame` supplies the sizing, border, background and accessible
 * description that `<graph>` gets, which is why `<chart>` declares the framing
 * state variables `GraphFrameSVs` asks for rather than inventing its own — and
 * nothing else of a graph's.
 */
export default React.memo(function Chart(props: UseDoenetRendererProps) {
    const { id, SVs, actions, callAction } = useDoenetRenderer<ChartSVs>(props);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(containerRef, callAction, actions);

    // A null `prefigureXML` is the worker saying there is no chart here — no
    // `type`, or one it does not know how to draw. It has already warned, so
    // nothing goes on the page: an empty bordered box the size of the chart
    // would read as a chart that failed to load rather than as one that was
    // never asked for.
    if (SVs.prefigureXML === null) {
        return null;
    }

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
