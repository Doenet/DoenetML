/**
 * Where a reference that a component resolves for itself is written down
 * (Doenet/DoenetML#2252, `docs/b4-coordinate-attributes.md`).
 *
 * A value reference (`_ref`, `components/abstract/ValueRef.js`) resolves the
 * one reference it carries, its `refResolution`. A component holding an
 * attribute as text and references resolves each of the references in it
 * with the same state variables (`referenceSlotDefinitions`), under names of
 * their own: each is a *slot* of the attribute, whose `refResolution` is kept
 * in the attribute's `slots`. The dependencies that resolve a reference
 * (`refResolution`, `refResolutionIndexDependencies`) read it through
 * `refResolutionAt`, given the slot.
 */

/** A reference of an attribute: the attribute, and its place among them. */
export type ReferenceSlot = { attributeName: string; index: number };

/**
 * The `refResolution` of the reference `slot` of `component`, or, with no
 * slot, the one reference the component carries (`component.refResolution`).
 */
export function refResolutionAt(component: any, slot?: ReferenceSlot) {
    if (slot === undefined) {
        return component?.refResolution;
    }
    return component?.attributes?.[slot.attributeName]?.slots?.[slot.index]
        ?.refResolution;
}
