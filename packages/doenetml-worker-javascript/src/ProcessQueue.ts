import type { CoreBackref } from "./types/coreBackref";
type QueueEntry =
    | {
          type: "update";
          updateInstructions: any;
          transient: boolean;
          event: any;
          skippable: boolean;
          resolve: (v?: any) => void;
          reject: (v?: any) => void;
      }
    | {
          type: "action";
          componentIdx: number;
          actionName: string;
          args: any;
          skippable?: boolean;
          resolve: (v?: any) => void;
          reject: (v?: any) => void;
      }
    | {
          type: "recordEvent";
          event: any;
          resolve: (v?: any) => void;
          reject: (v?: any) => void;
      };

/**
 * Owns the asynchronous request queue: the entry points
 * (`requestAction`, `requestUpdate`, `requestRecordEvent`) push work
 * onto the queue, and `executeProcesses` drains it serially by
 * dispatching to Core's `performAction` / `performUpdate` /
 * `performRecordEvent` (still on Core through Phase 3).
 *
 * Holds a back-reference to Core to read `flags`, invoke the perform
 * methods, run renderer-only short-circuits in read-only mode, resume
 * visibility measuring on event recording, and route visibility events.
 */
export class ProcessQueue {
    core: CoreBackref;
    queue: QueueEntry[];
    processing: boolean;
    stopProcessingRequests: boolean;

    constructor({ core }: { core: CoreBackref }) {
        this.core = core;
        this.queue = [];
        this.processing = false;
        this.stopProcessingRequests = false;
    }

    /**
     * Clear the queue and processing flags. Called from `Core.generateDast`
     * so state from any previous run does not leak in.
     */
    reset(): void {
        this.queue = [];
        this.processing = false;
        this.stopProcessingRequests = false;
    }

    /**
     * Start `executeProcesses` if it's not already draining the queue.
     * Called from each request entry point after the new entry is pushed.
     */
    _kickoff(): void {
        if (!this.processing) {
            this.processing = true;
            this.executeProcesses().catch((e) => console.error(e));
        }
    }

    /**
     * Drain `this.queue` serially, dispatching each entry to Core's
     * `performUpdate`/`performAction`/`performRecordEvent`. `skippable`
     * update/action entries are dropped (without resolving) when more work
     * is already queued behind them, so a flood of intermediate values
     * collapses to the latest.
     *
     * Errors from per-entry dispatch are caught and routed to the entry's
     * `reject`; throws outside that path bubble up via the `_kickoff`
     * `.catch(console.error)` so we don't drop them silently.
     */
    async executeProcesses(): Promise<void> {
        if (this.stopProcessingRequests) {
            return;
        }

        while (this.queue.length > 0) {
            let nextUpdateInfo = this.queue.splice(0, 1)[0];
            let result;
            try {
                if (nextUpdateInfo.type === "update") {
                    if (!nextUpdateInfo.skippable || this.queue.length < 2) {
                        result = await this.core.performUpdate(nextUpdateInfo);
                    }

                    // TODO: if skip an update, presumably we should call reject???

                    // } else if (nextUpdateInfo.type === "getStateVariableValues") {
                    //   result = await this.core.performGetStateVariableValues(nextUpdateInfo);
                } else if (nextUpdateInfo.type === "action") {
                    if (!nextUpdateInfo.skippable || this.queue.length < 2) {
                        result = await this.core.performAction(nextUpdateInfo);
                    }

                    // TODO: if skip an update, presumably we should call reject???
                } else if (nextUpdateInfo.type === "recordEvent") {
                    result = await this.core.performRecordEvent(nextUpdateInfo);
                } else {
                    throw Error(
                        `Unrecognized process type: ${(nextUpdateInfo as any).type}`,
                    );
                }

                nextUpdateInfo.resolve(result);
            } catch (e) {
                console.error(e);
                nextUpdateInfo.reject(
                    typeof e === "object" &&
                        e &&
                        "message" in e &&
                        typeof (e as any).message === "string"
                        ? (e as any).message
                        : "Error in core",
                );
            }
        }

        this.processing = false;
    }

    /**
     * Enqueue a component action (e.g. button click, input commit) and
     * return a Promise that resolves with the action's result once the
     * queue drains to it. `args.skippable === true` lets the queue drop
     * intermediate entries when newer work is queued behind them.
     */
    requestAction({
        componentIdx,
        actionName,
        args,
    }: {
        componentIdx: number;
        actionName: string;
        args?: any;
    }): Promise<any> {
        return new Promise((resolve, reject) => {
            let skippable = args?.skippable;

            this.queue.push({
                type: "action",
                componentIdx,
                actionName,
                args,
                skippable,
                resolve,
                reject,
            });

            this._kickoff();
        });
    }

    /**
     * Enqueue a state-variable update batch and return a Promise that
     * resolves once the queue drains to it. In read-only mode the update
     * is short-circuited to a renderer-only refresh (so the renderer can
     * revert any optimistic UI it showed) and the queue is skipped.
     */
    async requestUpdate({
        updateInstructions,
        transient = false,
        event,
        skippable = false,
        overrideReadOnly = false,
    }: {
        updateInstructions: any[];
        transient?: boolean;
        event?: any;
        skippable?: boolean;
        overrideReadOnly?: boolean;
    }): Promise<any> {
        // Note: the transient flag is now ignored
        // as the debounce is preventing too many updates from occurring

        if (this.core.flags.readOnly && !overrideReadOnly) {
            let sourceInformation: Record<number, any> = {};

            for (let instruction of updateInstructions) {
                let componentSourceInformation =
                    sourceInformation[instruction.componentIdx];
                if (!componentSourceInformation) {
                    componentSourceInformation = sourceInformation[
                        instruction.componentIdx
                    ] = {};
                }

                if (instruction.sourceDetails) {
                    Object.assign(
                        componentSourceInformation,
                        instruction.sourceDetails,
                    );
                }
            }

            await this.core.updateRendererInstructions({
                componentNamesToUpdate: updateInstructions.map(
                    (x) => x.componentIdx,
                ),
                sourceOfUpdate: { sourceInformation },
            });

            return;
        }

        return new Promise((resolve, reject) => {
            this.queue.push({
                type: "update",
                updateInstructions,
                transient,
                event,
                skippable,
                resolve,
                reject,
            });

            this._kickoff();
        });
    }

    /**
     * Enqueue an event for `performRecordEvent`, or for visibility-changed
     * events bypass the queue and route directly to the visibility tracker
     * (which manages its own debounced send). Resuming visibility measuring
     * here piggybacks on every recorded event so suspended documents wake
     * back up on the next interaction.
     */
    requestRecordEvent(event: any): Promise<any> | undefined {
        this.core.resumeVisibilityMeasuring();

        if (event.verb === "visibilityChanged") {
            return this.core.processVisibilityChangedEvent(event);
        }

        return new Promise((resolve, reject) => {
            this.queue.push({
                type: "recordEvent",
                event,
                resolve,
                reject,
            });

            this._kickoff();
        });
    }
}
