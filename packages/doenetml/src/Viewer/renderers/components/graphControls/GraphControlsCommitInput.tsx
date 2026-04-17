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
    hasDraft?: boolean;
    isCommitting?: boolean;
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
    hasDraft = true,
    isCommitting = false,
}: GraphControlsCommitInputProps) {
    const suppressNextBlurCommitRef = React.useRef(false);

    function commitValue(rawValue: string) {
        if (!hasDraft || isCommitting) {
            return;
        }

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
                suppressNextBlurCommitRef.current = false;
                onChange(event.target.value);
            }}
            onBlur={(event) => {
                if (suppressNextBlurCommitRef.current) {
                    suppressNextBlurCommitRef.current = false;
                    return;
                }

                commitValue(event.target.value);
            }}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    suppressNextBlurCommitRef.current = true;
                    commitValue(event.currentTarget.value);
                }
            }}
        />
    );
}
