import React from "react";
import { Button as AriakitButton } from "@ariakit/react";

const CLASS_NAME = "doenet-ui-button";

/**
 * A button for use in the Doenet UI (e.g., authoring UI) as opposed to in a doenet exercise.
 */
export function UiButton(props: React.ComponentProps<typeof AriakitButton>) {
    let className = props.className
        ? `${CLASS_NAME} ${props.className}`
        : CLASS_NAME;
    return <AriakitButton {...props} className={className} />;
}
