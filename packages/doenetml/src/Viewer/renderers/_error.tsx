import React from "react";
import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useT, useUiLocale } from "../../utils/i18n";
import { useDiagnosticFormatter } from "../../utils/diagnostics";

interface ErrorSVs {
    hidden: boolean;
    showMessage: boolean;
    rangeMessage?: string;
    /** `{span, startLine, endLine}`, or `null` when the source position is unknown. */
    rangeArgs?: {
        span: "line" | "lines";
        startLine: string;
        endLine: string;
    } | null;
    message: string;
    /** The diagnostic this error came from, when it has migrated to the catalogs. */
    code?: DiagnosticCode | null;
    args?: DiagnosticArgs | null;
}

export default React.memo(function Error(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer<ErrorSVs>(props);

    const t = useT();
    // The same formatter the Diagnostics panel renders with, over the same
    // translator: one diagnostic now reads the same in both places, where this
    // box used to show the English the worker wrote beside a panel showing the
    // reader's language.
    const formatDiagnostic = useDiagnosticFormatter(t, useUiLocale());

    let displayedMessage = null;

    if (SVs.showMessage) {
        let errorStyle: React.CSSProperties = {
            backgroundColor: "var(--lightRed)",
            color: "var(--canvasText)",
            textAlign: "center",
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: "var(--mainRed)",
        };
        // An error with no code — anything not yet migrated (#1518) — has
        // nothing to render from, and the formatter hands `message` straight
        // back. So does one whose code the negotiated catalogs don't answer
        // for: the English travels on the record as the fallback.
        const message = formatDiagnostic({
            message: SVs.message,
            code: SVs.code,
            args: SVs.args,
        });
        let rangeMessage = null;
        if (SVs.rangeMessage) {
            rangeMessage = (
                <>
                    <br />
                    <em>
                        {SVs.rangeArgs
                            ? t(
                                  "error-found-at",
                                  SVs.rangeArgs,
                                  SVs.rangeMessage,
                              )
                            : SVs.rangeMessage}
                    </em>
                </>
            );
        }
        displayedMessage = (
            <div style={errorStyle}>
                <b>{t("error-heading", undefined, "Error")}</b>: {message}
                {rangeMessage}
            </div>
        );
    }

    return (
        <div id={id}>
            {displayedMessage}
            {children}
        </div>
    );
});
