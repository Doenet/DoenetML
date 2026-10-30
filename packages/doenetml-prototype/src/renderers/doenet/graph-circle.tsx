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

type CircleData = {
    props: {
        numericalCenter: [number, number];
        numericalRadius: number;
    };
};

/** A circle. Dragging it moves its center. */
export const CircleInGraph: BasicComponent<CircleData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalCenter, numericalRadius }) =>
            isPoints([numericalCenter]) && typeof numericalRadius === "number",
        create: (board, _props, resync) => {
            // The center is not drawn; the circle is dragged by its curve.
            const center: JSG.Point = board.create(
                "point",
                [0, 0],
                look.hiddenPoint(),
            );
            // The radius is read from `radius.current`, so a change of radius
            // is drawn with the next redraw like any other change.
            const radius = { current: 1 };
            const circle: JSG.Circle = board.create(
                "circle",
                [center, () => radius.current],
                look.line(),
            );
            circle.on("drag", () => {
                const action: Action = {
                    component: "circle",
                    actionName: "moveCircle",
                    componentIdx: id,
                    args: { center: xy(center) },
                };
                dispatch(coreActions.dispatchAction(action));
            });
            circle.on("up", resync);
            return { objects: [circle, center], circle, center, radius };
        },
        update: (
            { circle, center, radius },
            { numericalCenter: [cx, cy], numericalRadius: r },
        ) => {
            setVisible(circle, finite(cx, cy, r));
            setCoords(center, cx, cy);
            radius.current = r;
            refresh(circle);
        },
    });
    return null;
};
