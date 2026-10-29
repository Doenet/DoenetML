import React from "react";
import { BasicComponent } from "../types";
import { GraphContext, LAYER_OFFSETS } from "./graph";
import * as JSG from "jsxgraph";
import {
    attachStandardGraphListeners,
    GraphListeners,
    removeStandardGraphListeners,
} from "./jsxgraph/listeners";
import { Action } from "@doenet/doenetml-worker";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { styleToDash } from "./graph-line";

type PolygonData = {
    props: {
        numericalVertices: [number, number][];
    };
};

type PolygonObjects = {
    polygon: JSG.Polygon;
    vertices: JSG.Point[];
};

/**
 * A polygon. Dragging it moves every vertex; dragging a vertex moves that
 * one. A change in the number of vertices draws it anew.
 */
export const PolygonInGraph: BasicComponent<PolygonData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const polygonRef = React.useRef<PolygonObjects | null>(null);
    const polygonListenersAttached = React.useRef<GraphListeners>({});
    const verticesListenersAttached = React.useRef<GraphListeners[]>([]);
    const id = node.data.id;

    const dispatch = useAppDispatch();

    const numericalVertices = node.data.props.numericalVertices;
    const numVertices = Array.isArray(numericalVertices)
        ? numericalVertices.length
        : 0;

    React.useEffect(() => {
        if (!board) {
            polygonRef.current = null;
            return;
        }
        if (polygonRef.current) {
            return;
        }
        const objects = createPolygon(board, {
            numericalVertices,
            labelForGraph: "",
            lineColor: "var(--mainGreen)",
            hidden: false,
            fixed: false,
            draggable: true,
            fixLocation: false,
            layer: 0,
            selectedStyle: { lineStyle: "solid", lineOpacity: 1, lineWidth: 2 },
            dashed: false,
        });
        polygonRef.current = objects;
        if (!objects) {
            return;
        }
        const { polygon, vertices } = objects;

        function movePolygon(pointCoords: Record<number, [number, number]>) {
            const action: Action = {
                component: "polygon",
                actionName: "movePolygon",
                componentIdx: id,
                args: { pointCoords },
            };
            dispatch(coreActions.dispatchAction(action));
        }

        polygonListenersAttached.current = attachStandardGraphListeners(
            polygon,
            {
                drag: function (e, interactionState) {
                    movePolygon(
                        Object.fromEntries(
                            vertices.map((v, i) => [i, [v.X(), v.Y()]]),
                        ),
                    );
                },
            },
        );
        verticesListenersAttached.current = vertices.map((vertex, i) =>
            attachStandardGraphListeners(vertex, {
                drag: function (e, interactionState) {
                    movePolygon({ [i]: [vertex.X(), vertex.Y()] });
                },
            }),
        );

        return () => {
            removeStandardGraphListeners(
                polygon,
                polygonListenersAttached.current,
            );
            vertices.forEach((vertex, i) =>
                removeStandardGraphListeners(
                    vertex,
                    verticesListenersAttached.current[i],
                ),
            );
            board.removeObject(polygon);
            for (const vertex of vertices) {
                board.removeObject(vertex);
            }
            polygonRef.current = null;
        };
    }, [board, polygonRef, numVertices]);

    if (
        !board ||
        !polygonRef.current ||
        polygonRef.current.vertices.length !== numVertices
    ) {
        return null;
    }

    // We have a pre-existing polygon. Update the rendered polygon so that it matches values from the props.

    const { polygon, vertices } = polygonRef.current;
    vertices.forEach((vertex, i) => {
        vertex.coords.setCoordinates(JXG.COORDS_BY_USER, [
            1,
            ...numericalVertices[i],
        ]);
        vertex.needsUpdate = true;
        vertex.update();
    });

    // update the polygon and the board so the polygon actually moves to the specified location
    // JSXGraph's typings leave out a polygon's borders.
    for (const border of (polygon as any).borders as JSG.Segment[]) {
        border.needsUpdate = true;
        border.update();
    }
    polygon.needsUpdate = true;
    polygon.update();
    board.updateRenderer();

    return null;
};

function createPolygon(
    board: JSG.Board,
    props: {
        numericalVertices: [number, number][];
        labelForGraph: string;
        lineColor: string;
        hidden: boolean;
        fixed: boolean;
        draggable: boolean;
        fixLocation: boolean;
        layer: number;
        selectedStyle: {
            lineStyle: string;
            lineOpacity: number;
            lineWidth: number;
        };
        dashed: boolean;
    },
): PolygonObjects | null {
    if (
        !Array.isArray(props.numericalVertices) ||
        props.numericalVertices.length === 0
    ) {
        return null;
    }

    const lineColor = props.lineColor;

    // The polygon's sides
    const jsxBorderAttributes: JSG.GeometryElementAttributes &
        JSG.SegmentAttributes = {
        visible: !props.hidden,
        fixed: props.fixed,
        layer: 10 * props.layer + LAYER_OFFSETS.line,
        strokeColor: lineColor,
        strokeOpacity: props.selectedStyle.lineOpacity,
        highlightStrokeColor: lineColor,
        highlightStrokeOpacity: props.selectedStyle.lineOpacity * 0.5,
        strokeWidth: props.selectedStyle.lineWidth,
        highlightStrokeWidth: props.selectedStyle.lineWidth,
        dash: styleToDash(props.selectedStyle.lineStyle, props.dashed),
        highlight: !props.fixLocation,
    };

    // Things to be passed to JSXGraph as attributes
    const jsxPolygonAttributes: JSG.PolygonAttributes = {
        name: props.labelForGraph,
        visible: !props.hidden,
        fixed: props.fixed,
        layer: 10 * props.layer + LAYER_OFFSETS.line,
        fillColor: lineColor,
        fillOpacity: 0.1,
        highlightFillColor: lineColor,
        highlightFillOpacity: 0.05,
        highlight: !props.fixLocation,
        borders: jsxBorderAttributes,
        vertices: { visible: false },
    };

    // The vertices, drawn as small handles that can be dragged
    const jsxPointAttributes: JSG.PointAttributes = {
        name: "",
        withLabel: false,
        visible: !props.hidden,
        fixed: props.fixed || !props.draggable,
        layer: 10 * props.layer + LAYER_OFFSETS.vertex,
        size: 3,
        fillColor: lineColor,
        strokeColor: lineColor,
        highlightFillColor: lineColor,
        highlightStrokeColor: lineColor,
        showInfobox: false,
        highlight: !props.fixLocation,
    };

    const vertices: JSG.Point[] = props.numericalVertices.map((v) =>
        board.create("point", [...v], jsxPointAttributes),
    );
    const polygon: JSG.Polygon = board.create(
        "polygon",
        vertices,
        jsxPolygonAttributes,
    );

    return { polygon, vertices };
}
