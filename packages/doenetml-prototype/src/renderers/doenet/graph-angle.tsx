import React from "react";
import type * as JSG from "jsxgraph";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import {
    finite,
    isPoints,
    refresh,
    setCoords,
    setVisible,
    useGraphObjects,
} from "./jsxgraph/use-graph-objects";
import { look } from "./jsxgraph/look";

type AngleData = {
    props: {
        /** A point on the ray it turns from. */
        numericalFirstPoint: [number, number];
        /** Its vertex. */
        numericalVertex: [number, number];
        /** Its measure, counterclockwise from the first ray. */
        radians: number;
        /** The arc's radius. */
        radius: number;
    };
};

/**
 * An angle: an arc at its vertex, from the ray through its first point,
 * turning counterclockwise by its measure. It follows what it is measured
 * from, and is not dragged itself.
 */
export const AngleInGraph: BasicComponent<AngleData> = ({ node }) => {
    const board = React.useContext(GraphContext);

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalFirstPoint, numericalVertex, radians }) =>
            isPoints([numericalFirstPoint, numericalVertex]) &&
            typeof radians === "number",
        create: (board, _props, _resync) => {
            const [first, vertex, last] = [0, 1, 2].map((): JSG.Point =>
                board.create("point", [0, 0], look.hiddenPoint()),
            );
            // The radius is read from `radius.current`, so a change is drawn
            // with the next redraw like any other change.
            const radius = { current: 1 };
            const angle: JSG.Angle = board.create(
                "angle",
                [first, vertex, last],
                { ...look.angle(), radius: () => radius.current },
            );
            return {
                objects: [angle, last, vertex, first],
                angle,
                first,
                vertex,
                last,
                radius,
            };
        },
        update: (
            { angle, first, vertex, last, radius },
            {
                numericalFirstPoint: [x1, y1],
                numericalVertex: [vx, vy],
                radians,
                radius: r,
            },
        ) => {
            // The ray it turns to: the first ray turned by the measure.
            const [dx, dy] = [x1 - vx, y1 - vy];
            const [c, s] = [Math.cos(radians), Math.sin(radians)];
            setCoords(first, x1, y1);
            setCoords(vertex, vx, vy);
            setCoords(last, vx + c * dx - s * dy, vy + s * dx + c * dy);
            radius.current = r;
            setVisible(
                angle,
                finite(x1, y1, vx, vy, radians) && (dx !== 0 || dy !== 0),
            );
            refresh(angle);
        },
    });
    return null;
};
