import React from "react";
import { useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { _ServerSafeMath } from "./_server-safe-math";
import "./text-input.css";

/** The fields every input renderer takes for its label and Aria state. */
export type InputLabelProps = {
    label: string;
    labelHasLatex: boolean;
    labelPosition: "start" | "end";
    /** Description used for Aria state. */
    shortDescription?: string;
};

/** The Aria attributes of a control with these label props: the
 * description names the control when it has no label. */
export function ariaProps({ label, shortDescription }: InputLabelProps) {
    const hasLabel = !!label?.trim();
    return {
        "aria-label": hasLabel ? undefined : shortDescription,
        "aria-description": hasLabel ? shortDescription : undefined,
    };
}

/**
 * A control beside its label. On a server it renders as `server`, what the
 * control shows as text, with no control.
 */
export function LabeledInput({
    className,
    htmlId,
    labelProps,
    server,
    children,
}: React.PropsWithChildren<{
    className: string;
    htmlId?: string;
    labelProps: InputLabelProps;
    server: React.ReactNode;
}>) {
    const onServer = useAppSelector(renderingOnServerSelector);
    if (onServer) {
        return (
            <span className={className} id={htmlId}>
                {server}
            </span>
        );
    }
    return (
        <span className={`${className} input`} id={htmlId}>
            <label className={`input-label-${labelProps.labelPosition}`}>
                <span className="input-label">
                    {processLabelWithMath(
                        labelProps.label,
                        labelProps.labelHasLatex,
                    )}
                </span>
                {children}
            </label>
        </span>
    );
}

/**
 * A labeled text field whose text is sent when the student commits it (on
 * Enter or blur), not on every keystroke: what a `numberInput` or a
 * `mathInput` holds is what the text parses to. When the value the core
 * holds changes, the field shows it.
 */
export function CommitField({
    className,
    htmlId,
    labelProps,
    current,
    commit,
}: {
    className: string;
    htmlId?: string;
    labelProps: InputLabelProps;
    /** The value the core holds, as text. */
    current: string;
    commit: (text: string) => void;
}) {
    // What the student has typed and not yet committed
    const [text, setText] = React.useState(current);
    React.useEffect(() => setText(current), [current]);
    const send = () => {
        if (text !== current) {
            commit(text);
        }
    };
    return (
        <LabeledInput
            className={className}
            htmlId={htmlId}
            labelProps={labelProps}
            server={current}
        >
            <input
                type="text"
                value={text}
                {...ariaProps(labelProps)}
                onChange={(e) => setText(e.target.value)}
                onBlur={send}
                onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        send();
                    }
                }}
            />
        </LabeledInput>
    );
}

/**
 * Creates a React node out of a label string that (possibly) contains math.
 * If `labelHasLatex` is false, no math processing is attempted.
 */
export function processLabelWithMath(
    label: string | undefined,
    labelHasLatex: boolean,
): React.ReactNode {
    label = label?.trim() || "";
    if (!label) {
        return null;
    }
    if (!labelHasLatex) {
        return label;
    }
    // If a label contains math, it is delimted by `\(` and `\)`.
    // We split the label on those delimiters, and wrap the math parts in a math component.
    const labelParts = label.split(/\\\(|\\\)/);
    return labelParts.map((part, index) => {
        if (index % 2 === 0) {
            return part;
        } else {
            return <_ServerSafeMath key={index}>{part}</_ServerSafeMath>;
        }
    });
}
