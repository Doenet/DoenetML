import type Core from "./Core";

/**
 * Reveal any closed sections on the path from the document root to the
 * navigation target. If a closed parent had to be opened, the target was
 * not yet in the DOM, so post a `navigateToHash` message back to the host
 * to retry the scroll/focus once the renderer catches up.
 *
 * Reads `core._components` and dispatches `core.performAction` to fire the
 * `revealSection` actions.
 */
export async function handleNavigatingToComponent({
    core,
    componentIdx,
    hash,
}: {
    core: Core;
    componentIdx: number;
    hash: string;
}): Promise<void> {
    let component = core._components[componentIdx];
    if (!component) {
        return;
    }
    let componentAndAncestors = [
        componentIdx,
        ...component.ancestors.map((x: any) => x.componentIdx),
    ];
    let openedParent = false;
    for (let cIdx of componentAndAncestors) {
        let comp = core._components[cIdx];
        if (comp.actions?.revealSection) {
            let isOpen = await comp.stateValues.open;

            if (isOpen === false) {
                await core.performAction({
                    componentIdx: cIdx,
                    actionName: "revealSection",
                });
                if (cIdx !== componentIdx) {
                    openedParent = true;
                }
            }
        }
    }
    if (openedParent) {
        // If just opened parent, then we couldn't have navigated to target yet
        // as the target didn't exist in the DOM when the parent was closed.
        // Navigate to the specified hash now.
        postMessage({
            messageType: "navigateToHash",
            args: { hash },
        });
    }
}

/**
 * Post a `navigateToTarget` message back to the host. Called from the
 * `Ref` component's action wired into `coreFunctions`.
 */
export function navigateToTarget({
    core,
    args,
}: {
    core: Core;
    args: any;
}): void {
    postMessage({
        messageType: "navigateToTarget",
        coreId: core.coreId,
        args,
    });
}
