/**
 * Whether `component`, a shadow, is the component a reference made: the
 * first-level replacement of the composite it shadows through, not a
 * component inside a copied one (a child of a copied paragraph, or a
 * replacement of a copied group, whose `replacementOf` is that group).
 */
export function isReferenceShadow(component: any) {
    return Boolean(
        component.shadows?.firstLevelReplacement &&
        component.replacementOf?.componentIdx ===
            component.shadows.compositeIdx,
    );
}
