import React from "react";
import * as JSG from "jsxgraph";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import { Action } from "@doenet/doenetml-worker";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import {
    finite,
    refresh,
    setVisible,
    useGraphObjects,
} from "./jsxgraph/use-graph-objects";
import { CURVE_ATTRIBUTES, HIDDEN_POINT_ATTRIBUTES } from "./jsxgraph/look";

type CircleData = {
    props: { numericalCenter: [number, number]; numericalRadius: number };
};

/** A circle. Dragging it moves its center. */
export const CircleInGraph: BasicComponent<CircleData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    useGraphObjects(
        board,
        node.data.props,
        (board, _props, resync) => {
            const center: JSG.Point = board.create(
                "point",
                [0, 0],
                HIDDEN_POINT_ATTRIBUTES,
            );
            // The radius is read from `radius.current`, so a change of radius
            // is drawn with the next redraw like any other change.
            const radius = { current: 1 };
            const circle: JSG.Circle = board.create(
                "circle",
                [center, () => radius.current],
                CURVE_ATTRIBUTES,
            );
            circle.on("drag", () => {
                const action = {
                    component: "circle",
                    actionName: "moveCircle",
                    componentIdx: node.data.id,
                    args: { center: [center.X(), center.Y()] },
                } as unknown as Action;
                dispatch(coreActions.dispatchAction(action));
            });
            circle.on("up", resync);
            return { objects: [circle, center], circle, center, radius };
        },
        (
            { circle, center, radius },
            { numericalCenter: [cx, cy], numericalRadius: r },
        ) => {
            const ok = finite(cx, cy, r);
            center.coords.setCoordinates(
                JSG.COORDS_BY_USER,
                ok ? [1, cx, cy] : [1, 0, 0],
            );
            radius.current = ok ? r : 1;
            setVisible(circle, ok);
            refresh(center);
            refresh(circle);
        },
    );
    return null;
};
