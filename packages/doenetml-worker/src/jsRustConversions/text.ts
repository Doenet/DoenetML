/**
 * Conversion from javascript to rust for the text component
 */
export function textJsToRust(props: Record<string, any>) {
    props.value = props.text;
}
