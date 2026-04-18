import React from "react";
import CommitTextInput from "./CommitTextInput";
import { GRAPH_CONTROL_ERROR_TEXT_STYLE } from "./styles";

type InputWithErrorProps = {
    id?: string;
    value: string;
    ariaLabel: string;
    error: string | undefined;
    errorId: string;
    onDraftChange: (value: string) => void;
    onCommit: (rawValue: string) => Promise<void>;
    hasDraft?: boolean;
    isCommitting?: boolean;
    commitErrorContext: string;
};

export default function InputWithError({
    id,
    value,
    ariaLabel,
    error,
    errorId,
    onDraftChange,
    onCommit,
    hasDraft,
    isCommitting,
    commitErrorContext,
}: InputWithErrorProps) {
    return (
        <>
            <CommitTextInput
                id={id}
                value={value}
                ariaLabel={ariaLabel}
                ariaInvalid={Boolean(error)}
                ariaDescribedBy={error ? errorId : undefined}
                onChange={onDraftChange}
                onCommit={onCommit}
                hasDraft={hasDraft}
                isCommitting={isCommitting}
                commitErrorContext={commitErrorContext}
            />
            {error ? (
                <span id={errorId} style={GRAPH_CONTROL_ERROR_TEXT_STYLE}>
                    {error}
                </span>
            ) : null}
        </>
    );
}
