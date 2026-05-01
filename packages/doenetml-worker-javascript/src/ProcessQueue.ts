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
    core: any;
    queue: QueueEntry[];
    processing: boolean;
    stopProcessingRequests: boolean;

    constructor({ core }: { core: any }) {
        this.core = core;
        this.queue = [];
        this.processing = false;
        this.stopProcessingRequests = false;
    }

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

            if (!this.processing) {
                this.processing = true;
                this.executeProcesses();
            }
        });
    }

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

            if (!this.processing) {
                this.processing = true;
                this.executeProcesses();
            }
        });
    }

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

            if (!this.processing) {
                this.processing = true;
                this.executeProcesses();
            }
        });
    }
}
