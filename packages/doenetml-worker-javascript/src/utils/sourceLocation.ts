/**
 * Find the nearest available source position/sourceDoc for a component,
 * walking up `parentIdx` ancestors when the component itself has no
 * position. Used by diagnostics and other surfaces that need to attribute
 * a problem to a location in the source DoenetML.
 *
 * Pulled out of `DiagnosticsManager` because it is not diagnostic-specific
 * — diagnostics happens to be its primary caller.
 */
export function getSourceLocationForComponent(
    component: any,
    components: any[],
): { position: any; sourceDoc: number | undefined } {
    let position = component.position;
    let sourceDoc = component.sourceDoc;
    let comp = component;

    while (position === undefined) {
        if (!(comp.parentIdx > 0)) {
            break;
        }
        comp = components[comp.parentIdx];
        position = comp.position;
        sourceDoc = comp.sourceDoc;
    }

    return { position, sourceDoc };
}
