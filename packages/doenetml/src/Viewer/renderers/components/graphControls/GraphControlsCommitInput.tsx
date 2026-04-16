import React from "react";

type GraphControlsCommitInputProps = {
    id?: string;
    value: string;
    ariaLabel: string;
    ariaInvalid: boolean;
    ariaDescribedBy?: string;
    onChange: (value: string) => void;
    onCommit: (value: string) => Promise<void>;
    commitErrorContext: string;
};

export default function GraphControlsCommitInput({
    id,
    value,
    ariaLabel,
    ariaInvalid,
    ariaDescribedBy,
    onChange,
    onCommit,
    commitErrorContext,
}: GraphControlsCommitInputProps) {
    function commitValue(rawValue: string) {
        onCommit(rawValue).catch((error) => {
            console.error(commitErrorContext, error);
        });
    }

    return (
        <input
            id={id}
            type="text"
            value={value}
            aria-label={ariaLabel}
            aria-invalid={ariaInvalid ? true : undefined}
            aria-describedby={ariaDescribedBy}
            onChange={(event) => {
                onChange(event.target.value);
            }}
            onBlur={(event) => {
                commitValue(event.target.value);
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    commitValue(event.currentTarget.value);
                }
            }}
        />
    );
}
