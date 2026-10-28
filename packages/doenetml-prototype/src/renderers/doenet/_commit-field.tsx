import React from "react";
import { processLabelWithMath } from "./text-input";
import "./text-input.css";

export type InputLabelProps = {
    label: string;
    labelHasLatex: boolean;
    labelPosition: "start" | "end";
    shortDescription: string;
};

/**
 * A labelled text field whose text is sent when the student commits it (on
 * Enter or blur), not on every keystroke: what a `numberInput` or a
 * `mathInput` holds is what the text parses to. When the value the core
 * holds changes, the field shows it.
 */
export function CommitField({
    current,
    commit,
    labelProps,
    htmlId,
    className,
}: {
    /** The value the core holds, as text. */
    current: string;
    commit: (text: string) => void;
    labelProps: InputLabelProps;
    htmlId?: string;
    className: string;
}) {
    const [text, setText] = React.useState(current);
    React.useEffect(() => setText(current), [current]);
    const send = () => {
        if (text !== current) commit(text);
    };
    const hasLabel = !!labelProps.label;
    return (
        <span className={`text-input input ${className}`} id={htmlId}>
            <label className={`input-label-${labelProps.labelPosition}`}>
                <span className="input-label">
                    {processLabelWithMath(
                        labelProps.label,
                        labelProps.labelHasLatex,
                    )}
                </span>
                <input
                    type="text"
                    value={text}
                    aria-label={
                        hasLabel ? undefined : labelProps.shortDescription
                    }
                    aria-description={
                        hasLabel ? labelProps.shortDescription : undefined
                    }
                    onChange={(e) => setText(e.target.value)}
                    onBlur={send}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") send();
                    }}
                />
            </label>
        </span>
    );
}
