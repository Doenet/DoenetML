/**
 * Control over the order in which the viewer hears back from core, for tests
 * of races between core's reply to an action and the renderer update core sent
 * for that action.
 *
 * Core sends the renderer update for an action and then replies to the action,
 * but the two travel on different message channels: the reply on the core
 * worker's own endpoint, the update on the port Comlink set up for the
 * viewer's `updateRenderers` callback. The browser does not keep messages on
 * different channels in order, so the reply can be handled first. That is
 * rare at human typing speed and common in a burst of keys, which makes it a
 * poor thing to wait for in a test. This helper makes it certain instead: while
 * `hold` is on, renderer updates are held back (in order) and replies go
 * through, so the test can wait until core has replied to every action it was
 * sent, then release the updates where it chooses.
 *
 * Call `controlCoreMessages(win)` before posting the document, so that the
 * update port's listener is installed through the patched method. It returns
 * an object with:
 *   - `hold`: set to `true` to start holding renderer updates.
 *   - `held`: the renderer updates held so far, oldest first, as
 *     `{ actionId, actionName }`.
 *   - `allActionsAnswered()`: whether core has replied to every action sent
 *     to it so far.
 *   - `release(count)`: hand the oldest `count` held updates (all of them if
 *     omitted) to the viewer, in order.
 *
 * Only the Comlink message shapes are relied on: an APPLY message carrying an
 * object with `updateInstructions` is a renderer update, an APPLY message
 * whose path ends in `dispatchActionJavascript` is an action, and the message
 * that comes back with the same `id` is core's reply to it.
 */
export function controlCoreMessages(win) {
    const control = {
        hold: false,
        held: [],
        allActionsAnswered() {
            return unanswered.size === 0;
        },
        release(count = control.held.length) {
            const toRelease = control.held.splice(0, count);
            for (const update of toRelease) {
                update.deliver();
            }
        },
    };

    // Comlink message id of each action sent to core, to the action's name.
    const unanswered = new Map();
    // Action id (ours, from `callAction`) to the action's name, so a held
    // update can say which action it answers.
    const actionNames = new Map();
    const listeningForReplies = new WeakSet();

    function listenForReplies(endpoint) {
        if (listeningForReplies.has(endpoint)) {
            return;
        }
        listeningForReplies.add(endpoint);
        // Added after Comlink's own listener on this endpoint, so it runs once
        // the viewer has handled the reply.
        originalAddEventListener.call(endpoint, "message", (event) => {
            const id = event.data?.id;
            if (id !== undefined && event.data.type !== "APPLY") {
                unanswered.delete(id);
            }
        });
    }

    for (const Endpoint of [win.Worker, win.MessagePort]) {
        const originalPostMessage = Endpoint.prototype.postMessage;
        Endpoint.prototype.postMessage = function (message, ...rest) {
            const path = message?.path;
            if (
                message?.type === "APPLY" &&
                path?.[path.length - 1] === "dispatchActionJavascript"
            ) {
                const actionArgs = message.argumentList?.[0]?.value;
                unanswered.set(message.id, actionArgs?.actionName);
                if (actionArgs?.args?.actionId) {
                    actionNames.set(
                        actionArgs.args.actionId,
                        actionArgs.actionName,
                    );
                }
                listenForReplies(this);
            }
            return originalPostMessage.call(this, message, ...rest);
        };
    }

    const originalAddEventListener = win.EventTarget.prototype.addEventListener;
    const originalRemoveEventListener =
        win.EventTarget.prototype.removeEventListener;
    const wrappedListeners = new WeakMap();

    win.EventTarget.prototype.addEventListener = function (
        type,
        listener,
        ...rest
    ) {
        if (
            type !== "message" ||
            !(this instanceof win.MessagePort) ||
            typeof listener !== "function"
        ) {
            return originalAddEventListener.call(this, type, listener, ...rest);
        }
        const wrapped = function (event) {
            const data = event.data;
            const update =
                data?.type === "APPLY" ? data.argumentList?.[0]?.value : null;
            if (
                control.hold &&
                update &&
                Array.isArray(update.updateInstructions) &&
                !update.init
            ) {
                control.held.push({
                    actionId: update.actionId,
                    actionName: actionNames.get(update.actionId),
                    deliver: () => listener.call(this, event),
                });
                return;
            }
            return listener.call(this, event);
        };
        wrappedListeners.set(listener, wrapped);
        return originalAddEventListener.call(this, type, wrapped, ...rest);
    };

    win.EventTarget.prototype.removeEventListener = function (
        type,
        listener,
        ...rest
    ) {
        return originalRemoveEventListener.call(
            this,
            type,
            wrappedListeners.get(listener) ?? listener,
            ...rest,
        );
    };

    return control;
}
