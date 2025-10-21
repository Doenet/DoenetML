import * as JSG from "jsxgraph";

type InteractionState = {
    dragActive: boolean;
    pointerAtDown: [number, number];
    pointerIsDown: boolean;
};

export function attachStandardGraphListeners<T extends JSG.GeometryElement>(
    obj: T,
) {
    const interactionState: InteractionState = {
        dragActive: false,
        pointerAtDown: [0, 0],
        pointerIsDown: false,
    };

    obj.on("drag", function (_e) {
        const e = _e as MouseEvent;
        const viaPointer = e.type === "pointermove";

        // Protect against very small unintended drags
        if (
            !viaPointer ||
            Math.abs(e.x - interactionState.pointerAtDown[0]) > 1 ||
            Math.abs(e.y - interactionState.pointerAtDown[1]) > 1
        ) {
            interactionState.dragActive = true;
        }
        console.log("dragging", obj.elType, { interactionState, obj });
    });
    obj.on("down", function (_e) {
        const e = _e as MouseEvent;
        interactionState.pointerAtDown = [e.x, e.y];
        console.log("down", obj.elType, { interactionState, obj });
    });
    obj.on("hit", function (_e) {
        interactionState.dragActive = false;
        console.log("hit", obj.elType, { interactionState, obj });
    });
    obj.on("up", function (_e) {
        interactionState.dragActive = false;
        console.log("up", obj.elType, { interactionState, obj });
    });
    obj.on("keyfocusout", function (_e) {
        interactionState.dragActive = false;
        console.log("keyfocusout", obj.elType, { interactionState, obj });
    });
    obj.on("keydown", function (_e) {
        const e = _e as KeyboardEvent;
        if (e.key === "Enter") {
            interactionState.dragActive = false;
        }
        console.log("keydown", obj.elType, { interactionState, obj });
    });
}
