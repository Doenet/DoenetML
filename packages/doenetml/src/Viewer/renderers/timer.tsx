import React, { useEffect, useRef, useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { Button } from "@doenet/ui-components";
import { useT } from "../../utils/i18n";
import "./timer.css";

interface TimerSVs {
    [key: string]: any;
    hidden: boolean;
    text: string;
    running: boolean;
    paused: boolean;
    expired: boolean;
    showControls: boolean;
    disabled: boolean;
}

export default React.memo(function Timer(props: UseDoenetRendererProps) {
    const { id, SVs, actions, callAction } = useDoenetRenderer<TimerSVs>(
        props,
        false,
    );

    const t = useT();

    // Ticks the core requested while the viewer was rebuilding it are
    // dropped, so a clock that is already running when this mounts asks for
    // its ticks again. The clock itself is timestamp-based; this only keeps
    // the display moving.
    useEffect(() => {
        if (SVs.running) {
            callAction({ action: actions.ensureTicking });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // The ticking text is deliberately not a live region, or a screen reader
    // would read every second. Only running out is announced, and only when
    // it happens while the page is open.
    const wasExpired = useRef(SVs.expired);
    const [announcement, setAnnouncement] = useState("");
    useEffect(() => {
        if (SVs.expired && !wasExpired.current) {
            setAnnouncement(t("timer-expired"));
        } else if (!SVs.expired) {
            setAnnouncement("");
        }
        wasExpired.current = SVs.expired;
    }, [SVs.expired, t]);

    if (SVs.hidden) {
        return null;
    }

    let controls = null;
    if (SVs.showControls) {
        const toggleLabel = SVs.running
            ? t("timer-pause")
            : SVs.paused
              ? t("timer-resume")
              : t("timer-start");
        const atStart = !SVs.running && !SVs.paused && !SVs.expired;
        controls = (
            <>
                <Button
                    id={id + "_toggle"}
                    value={toggleLabel}
                    disabled={SVs.disabled}
                    onClick={() =>
                        callAction({
                            action: SVs.running ? actions.pause : actions.start,
                        })
                    }
                />
                <Button
                    id={id + "_reset"}
                    value={t("timer-reset")}
                    disabled={SVs.disabled || atStart}
                    onClick={() => callAction({ action: actions.reset })}
                />
            </>
        );
    }

    return (
        <span id={id} className="doenet-timer">
            <span
                role="timer"
                className={
                    "doenet-timer-display" +
                    (SVs.expired ? " doenet-timer-expired" : "")
                }
                data-test="timer-display"
            >
                {SVs.text}
            </span>
            {controls}
            <span className="doenet-timer-announcer" aria-live="polite">
                {announcement}
            </span>
        </span>
    );
});
