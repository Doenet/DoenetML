import type Core from "./Core";
import { reportTimerError, TimerLabels } from "./utils/timerErrors";

type VisibilityInfo = {
    componentsCurrentlyVisible: Record<string, Date>;
    infoToSend: Record<string, number>;
    timeLastSent: Date;
    saveDelay: number;
    saveTimerId: ReturnType<typeof setTimeout> | null;
    suspendDelay: number;
    suspendTimerId: ReturnType<typeof setTimeout> | null;
    suspended: boolean;
    documentHasBeenVisible: boolean;
};

/**
 * Tracks per-component visibility durations and emits aggregated
 * `isVisible` events to the host. Owns timer state for the periodic
 * "send" cycle and the auto-suspend after inactivity.
 *
 * Holds a back-reference to Core to push aggregated events onto
 * `core.processQueue` and to call `core.onDocumentFirstVisible()` the
 * first time the document becomes visible.
 */
export class VisibilityTracker {
    core: Core;
    info: VisibilityInfo;

    constructor({ core }: { core: Core }) {
        this.core = core;
        this.info = {
            componentsCurrentlyVisible: {},
            infoToSend: {},
            timeLastSent: new Date(),
            saveDelay: 60000,
            saveTimerId: null,
            suspendDelay: 3 * 60000,
            suspendTimerId: null,
            suspended: false,
            documentHasBeenVisible: false,
        };
    }

    processVisibilityChangedEvent(event: any): void {
        let componentIdx = event.object.componentIdx;
        let isVisible = event.result.isVisible;

        if (isVisible) {
            if (!this.info.componentsCurrentlyVisible[componentIdx]) {
                this.info.componentsCurrentlyVisible[componentIdx] = new Date();
            }
            if (componentIdx === this.core.documentIdx) {
                if (!this.info.documentHasBeenVisible) {
                    this.info.documentHasBeenVisible = true;
                    this.core.onDocumentFirstVisible();
                }
            }
        } else {
            let begin = this.info.componentsCurrentlyVisible[componentIdx];
            if (begin) {
                delete this.info.componentsCurrentlyVisible[componentIdx];

                let timeInSeconds =
                    (new Date().getTime() -
                        Math.max(
                            begin.getTime(),
                            this.info.timeLastSent.getTime(),
                        )) /
                    1000;

                if (this.info.infoToSend[componentIdx]) {
                    this.info.infoToSend[componentIdx] += timeInSeconds;
                } else {
                    this.info.infoToSend[componentIdx] = timeInSeconds;
                }
            }
        }
    }

    sendVisibilityChangedEvents(): Promise<void> | undefined {
        let infoToSend: Record<string, number> = { ...this.info.infoToSend };
        this.info.infoToSend = {};
        let timeLastSent = this.info.timeLastSent;
        this.info.timeLastSent = new Date();
        let currentVisible: Record<string, Date> = {
            ...this.info.componentsCurrentlyVisible,
        };

        for (const componentIdxStr in currentVisible) {
            let timeInSeconds =
                (this.info.timeLastSent.getTime() -
                    Math.max(
                        timeLastSent.getTime(),
                        currentVisible[componentIdxStr].getTime(),
                    )) /
                1000;
            if (infoToSend[componentIdxStr]) {
                infoToSend[componentIdxStr] += timeInSeconds;
            } else {
                infoToSend[componentIdxStr] = timeInSeconds;
            }
        }

        for (const componentIdxStr in infoToSend) {
            infoToSend[componentIdxStr] = Math.round(
                infoToSend[componentIdxStr],
            );
            if (!infoToSend[componentIdxStr]) {
                // delete if rounded down to zero
                delete infoToSend[componentIdxStr];
            }
        }

        let promise: Promise<void> | undefined;

        if (Object.keys(infoToSend).length > 0) {
            let event = {
                object: {
                    componentIdx: this.core.documentIdx,
                    componentType: "document",
                },
                verb: "isVisible",
                result: infoToSend,
            };

            promise = new Promise<void>((resolve, reject) => {
                this.core.processQueue.push({
                    type: "recordEvent",
                    event,
                    resolve,
                    reject,
                });

                if (!this.core.processing) {
                    this.core.processing = true;
                    this.core.executeProcesses();
                }
            });
        }

        if (!this.info.suspended) {
            if (this.info.saveTimerId !== null) {
                clearTimeout(this.info.saveTimerId);
            }
            this.info.saveTimerId = setTimeout(() => {
                this.sendVisibilityChangedEvents()?.catch(
                    reportTimerError(TimerLabels.visibilityPeriodicSend),
                );
            }, this.info.saveDelay);
        }

        return promise;
    }

    async suspendVisibilityMeasuring(): Promise<void> {
        if (this.info.saveTimerId !== null) {
            clearTimeout(this.info.saveTimerId);
        }
        if (this.info.suspendTimerId !== null) {
            clearTimeout(this.info.suspendTimerId);
        }
        if (!this.info.suspended) {
            this.info.suspended = true;
            await this.sendVisibilityChangedEvents();
        }
    }

    resumeVisibilityMeasuring(): void {
        if (this.info.suspended) {
            // restart visibility measuring
            this.info.suspended = false;
            this.info.timeLastSent = new Date();
            if (this.info.saveTimerId !== null) {
                clearTimeout(this.info.saveTimerId);
            }
            this.info.saveTimerId = setTimeout(() => {
                this.sendVisibilityChangedEvents()?.catch(
                    reportTimerError(TimerLabels.visibilityResumeSend),
                );
            }, this.info.saveDelay);
        }

        if (this.info.suspendTimerId !== null) {
            clearTimeout(this.info.suspendTimerId);
        }
        this.info.suspendTimerId = setTimeout(() => {
            this.suspendVisibilityMeasuring().catch(
                reportTimerError(TimerLabels.visibilityAutoSuspend),
            );
        }, this.info.suspendDelay);
    }
}
