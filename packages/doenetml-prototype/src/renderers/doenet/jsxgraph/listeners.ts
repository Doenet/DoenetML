import * as JSG from "jsxgraph";

export type InteractionState = {
    dragActive: boolean;
    pointerAtDown: [number, number];
    pointerIsDown: boolean;
};

/**
 * Functions giving that actions to be performed within the listeners
 */
export type GraphListenerActions = {
    drag?: (e: MouseEvent, interactionState: InteractionState) => void;
    down?: (e: MouseEvent, interactionState: InteractionState) => void;
    up?: (e: MouseEvent, interactionState: InteractionState) => void;
    hit?: (e: Event, interactionState: InteractionState) => void;
    keyfocusout?: (
        e: KeyboardEvent,
        interactionState: InteractionState,
    ) => void;
    keydown?: (e: KeyboardEvent, interactionState: InteractionState) => void;
};

/**
 * The actual listener functions that were attached
 */
export type GraphListeners = {
    drag?: (e: Event) => void;
    down?: (e: Event) => void;
    up?: (e: Event) => void;
    hit?: (e: Event) => void;
    keyfocusout?: (e: Event) => void;
    keydown?: (e: Event) => void;
};

export function attachStandardGraphListeners<T extends JSG.GeometryElement>(
    obj: T,
    listenerActions: GraphListenerActions,
) {
    const interactionState: InteractionState = {
        dragActive: false,
        pointerAtDown: [0, 0],
        pointerIsDown: false,
    };

    const listenersAdded: GraphListeners = {};

    if (listenerActions.drag) {
        const drag = listenerActions.drag;
        const dragListener = function (_e: Event) {
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
            drag(e, interactionState);
        };

        obj.on("drag", dragListener);
        listenersAdded.drag = dragListener;
    }

    if (listenerActions.down) {
        const down = listenerActions.down;
        const downListener = function (_e: Event) {
            const e = _e as MouseEvent;
            interactionState.pointerAtDown = [e.x, e.y];
            interactionState.pointerIsDown = true;
            down(e, interactionState);
        };
        obj.on("down", downListener);
        listenersAdded.down = downListener;
    }

    if (listenerActions.up) {
        const up = listenerActions.up;
        const upListener = function (_e: Event) {
            const e = _e as MouseEvent;
            interactionState.dragActive = false;
            interactionState.pointerIsDown = false;
            up(e, interactionState);
        };
        obj.on("up", upListener);
        listenersAdded.up = upListener;
    }

    if (listenerActions.hit) {
        const hit = listenerActions.hit;
        const hitListener = function (e: Event) {
            interactionState.dragActive = false;
            hit(e, interactionState);
        };
        obj.on("hit", hitListener);
        listenersAdded.hit = hitListener;
    }

    if (listenerActions.keyfocusout) {
        const keyfocusout = listenerActions.keyfocusout;
        const keyfocusoutListener = function (_e: Event) {
            const e = _e as KeyboardEvent;
            interactionState.dragActive = false;
            keyfocusout(e, interactionState);
        };
        obj.on("keyfocusout", keyfocusoutListener);
        listenersAdded.keyfocusout = keyfocusoutListener;
    }

    if (listenerActions.keydown) {
        const keydown = listenerActions.keydown;
        const keydownListener = function (_e: Event) {
            const e = _e as KeyboardEvent;
            if (e.key === "Enter") {
                interactionState.dragActive = false;
            }
            keydown(e, interactionState);
        };
        obj.on("keydown", keydownListener);
        listenersAdded.keydown = keydownListener;
    }

    return listenersAdded;
}

export function removeStandardGraphListeners<T extends JSG.GeometryElement>(
    obj: T,
    listenerFunctions: GraphListeners,
) {
    if (listenerFunctions.drag) {
        obj.off("drag", listenerFunctions.drag);
    }
    if (listenerFunctions.down) {
        obj.off("down", listenerFunctions.down);
    }
    if (listenerFunctions.up) {
        obj.off("up", listenerFunctions.up);
    }
    if (listenerFunctions.hit) {
        obj.off("hit", listenerFunctions.hit);
    }
    if (listenerFunctions.keyfocusout) {
        obj.off("keyfocusout", listenerFunctions.keyfocusout);
    }
    if (listenerFunctions.keydown) {
        obj.off("keydown", listenerFunctions.keydown);
    }
}
