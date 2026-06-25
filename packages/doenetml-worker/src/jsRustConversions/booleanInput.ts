/**
 * Conversion from javascript to rust for the booleanInput component
 */
export function booleanInputJsToRust(props: Record<string, any>) {
    props.immediateValue = props.value;
}
