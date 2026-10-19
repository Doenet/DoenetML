import React, { useEffect } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { Button } from "@doenet/ui-components";
import { useT } from "../../utils/i18n";
import "./drill.css";

interface DrillSVs {
    [key: string]: any;
    hidden: boolean;
    phase: "notStarted" | "running" | "succeeded" | "expired";
    roundStatus: "answering" | "feedback";
    lastRoundCorrect: boolean | null;
    timeText: string;
    elapsedText: string;
    numCorrect: number;
    numRequired: number;
    bestNumCorrect: number;
    attemptNumber: number;
    canStart: boolean;
}

export default React.memo(function Drill(props: UseDoenetRendererProps) {
    const { id, SVs, children, actions, callAction } =
        useDoenetRenderer<DrillSVs>(props);

    const t = useT();

    // As for `<timer>`: ticks requested while the viewer was rebuilding the
    // core are dropped, so a run already in progress asks for them again.
    useEffect(() => {
        if (SVs.phase === "running") {
            callAction({ action: actions.ensureTicking });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (SVs.hidden) {
        return null;
    }

    const running = SVs.phase === "running";

    let status = "";
    if (running) {
        if (SVs.lastRoundCorrect === true) {
            status = t("drill-correct");
        } else if (SVs.lastRoundCorrect === false) {
            status =
                SVs.roundStatus === "feedback"
                    ? t("drill-incorrect")
                    : t("drill-incorrect-retry");
        }
    } else if (SVs.phase === "succeeded") {
        status = t("drill-succeeded", {
            numRequired: SVs.numRequired,
            time: SVs.elapsedText,
        });
    } else if (SVs.phase === "expired") {
        status = t("drill-expired", {
            numCorrect: SVs.numCorrect,
            numRequired: SVs.numRequired,
        });
    }

    let startButton = null;
    if (!running) {
        startButton = (
            <Button
                id={id + "_start"}
                value={
                    SVs.attemptNumber === 0
                        ? t("drill-start")
                        : t("drill-try-again")
                }
                disabled={!SVs.canStart}
                onClick={() => callAction({ action: actions.start })}
            />
        );
    }

    const progress = t("drill-progress", {
        numCorrect: SVs.numCorrect,
        numRequired: SVs.numRequired,
    });

    return (
        <section id={id} className="doenet-drill">
            <div className="doenet-drill-header">
                <span
                    role="timer"
                    className="doenet-drill-time"
                    data-test="drill-time"
                >
                    {SVs.timeText}
                </span>
                <span
                    role="progressbar"
                    className="doenet-drill-progress"
                    aria-valuemin={0}
                    aria-valuemax={SVs.numRequired}
                    aria-valuenow={SVs.numCorrect}
                    aria-valuetext={progress}
                    data-test="drill-progress"
                >
                    <span className="doenet-drill-progress-bar">
                        <span
                            className="doenet-drill-progress-fill"
                            style={{
                                width: `${Math.min(100, (100 * SVs.numCorrect) / SVs.numRequired)}%`,
                            }}
                        />
                    </span>
                    {progress}
                </span>
                {startButton}
                {SVs.attemptNumber > 0 && !running ? (
                    <span className="doenet-drill-best">
                        {t("drill-best", {
                            numCorrect: SVs.bestNumCorrect,
                            numRequired: SVs.numRequired,
                        })}
                    </span>
                ) : null}
            </div>
            <div
                className={
                    "doenet-drill-status" +
                    (SVs.lastRoundCorrect === false && running
                        ? " doenet-drill-status-incorrect"
                        : "")
                }
                aria-live="polite"
                data-test="drill-status"
            >
                {status}
            </div>
            {running ? (
                <div className="doenet-drill-question">{children}</div>
            ) : null}
        </section>
    );
});
