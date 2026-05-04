import { reportTimerError, TimerLabels } from "../utils/timerErrors";
import type Core from "../Core";
import type { TimerHandle } from "@doenet/utils";

/**
 * Owns the debounced auto-submit-answer queue. When state changes record an
 * answer that should be submitted, the manager batches them and dispatches
 * `submitAnswer` actions after a short debounce.
 *
 * Holds a back-reference to Core to look up components and dispatch actions.
 */
export class AutoSubmitManager {
    core: Core;
    answersToSubmit: number[];
    submitAnswersTimeout: TimerHandle;

    constructor({ core }: { core: Core }) {
        this.core = core;
        this.answersToSubmit = [];
        this.submitAnswersTimeout = null;
    }

    recordAnswer(componentIdx: number): void {
        if (!this.answersToSubmit.includes(componentIdx)) {
            this.answersToSubmit.push(componentIdx);
        }

        if (this.submitAnswersTimeout !== null) {
            clearTimeout(this.submitAnswersTimeout);
        }

        //Debounce the submit answers
        this.submitAnswersTimeout = setTimeout(() => {
            this.submitAnswersTimeout = null;
            this.submitNow().catch(reportTimerError(TimerLabels.autoSubmit));
        }, 1000);
    }

    async submitNow(): Promise<void> {
        let toSubmit = this.answersToSubmit;
        this.answersToSubmit = [];
        for (let componentIdx of toSubmit) {
            let component = this.core._components[componentIdx];

            if (component.actions.submitAnswer) {
                await this.core.requestAction({
                    componentIdx,
                    actionName: "submitAnswer",
                });
            }
        }
    }

    /**
     * Cancel any pending debounce and submit immediately. Used during
     * `Core.terminate()` to flush queued answers before shutdown.
     */
    async flush(): Promise<void> {
        if (this.submitAnswersTimeout !== null) {
            clearTimeout(this.submitAnswersTimeout);
            this.submitAnswersTimeout = null;
            await this.submitNow();
        }
    }
}
