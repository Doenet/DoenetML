/**
 * Conversion from javascript to rust for the ref component
 */
export function refJsToRust(
    props: Record<string, any>,
    doenetIdToComponentIdx: Record<string, number>,
) {
    props.referent = doenetIdToComponentIdx[props.targetRendererId];
}
