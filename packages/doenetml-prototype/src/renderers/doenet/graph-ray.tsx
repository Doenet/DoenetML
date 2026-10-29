import React from "react";
import type * as JSG from "jsxgraph";
import { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import {
    finite,
    isPoints,
    refresh,
    setCoords,
    setVisible,
    useGraphObjects,
    xy,
} from "./jsxgraph/use-graph-objects";
import { look } from "./jsxgraph/look";

type RayData = {
    props: {
        numericalEndpoint: [number, number];
        /** A point the ray passes through. */
        numericalThroughpoint: [number, number];
    };
};

/** A ray from its endpoint through a point. Dragging it moves both. */
export const RayInGraph: BasicComponent<RayData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalEndpoint, numericalThroughpoint }) =>
            isPoints([numericalEndpoint, numericalThroughpoint]),
        create: (board, _props, resync) => {
            const ray: JSG.Line = board.create(
                "line",
                [
                    [0, 0],
                    [1, 0],
                ],
                { ...look.line(), straightFirst: false, straightLast: true },
            );
            ray.on("drag", () => {
                const action: Action = {
                    component: "ray",
                    actionName: "moveRay",
                    componentIdx: id,
                    args: {
                        endpointcoords: xy(ray.point1),
                        throughcoords: xy(ray.point2),
                    },
                };
                dispatch(coreActions.dispatchAction(action));
            });
            ray.on("up", resync);
            return { objects: [ray], ray };
        },
        update: (
            { ray },
            { numericalEndpoint: [x1, y1], numericalThroughpoint: [x2, y2] },
        ) => {
            setVisible(ray, finite(x1, y1, x2, y2));
            setCoords(ray.point1, x1, y1);
            setCoords(ray.point2, x2, y2);
            refresh(ray);
        },
    });
    return null;
};
