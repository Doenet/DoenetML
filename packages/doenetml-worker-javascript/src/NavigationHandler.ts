/**
 * Handles navigation actions: revealing closed sections in the ancestor chain
 * before navigating to a target component, and posting `navigateToTarget`
 * messages back to the host.
 *
 * Stateless — holds a back-reference to Core to read `_components`,
 * dispatch `performAction`, and read `coreId`.
 */
export class NavigationHandler {
    core: any;

    constructor({ core }: { core: any }) {
        this.core = core;
    }

    async handleNavigatingToComponent({
        componentIdx,
        hash,
    }: {
        componentIdx: number;
        hash: string;
    }): Promise<void> {
        let component = this.core._components[componentIdx];
        if (!component) {
            return;
        }
        let componentAndAncestors = [
            componentIdx,
            ...component.ancestors.map((x: any) => x.componentIdx),
        ];
        let openedParent = false;
        for (let cIdx of componentAndAncestors) {
            let comp = this.core._components[cIdx];
            if (comp.actions?.revealSection) {
                let isOpen = await comp.stateValues.open;

                if (isOpen === false) {
                    await this.core.performAction({
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

    navigateToTarget(args: any): void {
        postMessage({
            messageType: "navigateToTarget",
            coreId: this.core.coreId,
            args,
        });
    }
}
