/**
 * Wrappers (D41): a `<group>`, and the group a repeat, a select or a
 * `<conditionalContent>` makes for an iteration, a pick or the case shown.
 */

/**
 * The components a wrapper holds, as an author counts them (COLL-3): what
 * it made, but not what it withholds, blank text or a `<setup>` (also the
 * one a repeat adds for its names). Text that is not blank counts.
 */
export function componentsOfWrapper(wrapper: any): any[] {
    let replacements: any[] = wrapper.replacements ?? [];
    if (wrapper.replacementsToWithhold > 0) {
        replacements = replacements.slice(0, -wrapper.replacementsToWithhold);
    }
    return replacements.filter((replacement) =>
        typeof replacement === "string"
            ? replacement.trim() !== ""
            : replacement?.componentType !== "setup",
    );
}

/**
 * Whether `component` is a wrapper holding several components: a `<group>`,
 * as written or as made for an iteration of a repeat, a pick of a select or
 * the case a `<conditionalContent>` shows (D41), or a reference to a group
 * that stands for it. Such a wrapper is only a
 * container: a property after it names nothing (D41 decision 3, COLL-3).
 * With one component it stands for it.
 */
export function isWrapperOfSeveral(component: any): boolean {
    return (
        (component?.componentType === "group" ||
            isBareReferenceToGroup(component)) &&
        component.isExpanded &&
        componentsOfWrapper(component).length > 1
    );
}

/**
 * Whether `component` is a reference with no path after the name, written
 * as a child (`$g0` in `<group name="g">$g0</group>`), to a `<group>`: it
 * stands for that group, and makes its components in its place.
 */
function isBareReferenceToGroup(component: any): boolean {
    if (component?.componentType !== "_copy") {
        return false;
    }
    const extended = component.state?.extendedComponent;
    const unresolvedPath = component.state?.unresolvedPath;
    return (
        extended?.isResolved === true &&
        extended.value?.componentType === "group" &&
        unresolvedPath?.isResolved === true &&
        unresolvedPath.value == null
    );
}

/**
 * The settings every component has that a composite keeps private
 * (`CompositeComponent.js`), so that a property after a composite passes
 * into what it holds. A wrapper holding several is only a container, and a
 * property is not passed into it (D41 decision 3), so these are its own
 * (`$g.fixed` is the group's, as `$g.hide` is; COLL-2).
 */
const OWN_SETTINGS_OF_WRAPPERS = ["hidden", "disabled", "fixed", "fixLocation"];

/**
 * The setting `propName` names (matched without regard to case), if it is
 * one a wrapper holding several keeps as its own though a composite keeps it
 * private ({@link OWN_SETTINGS_OF_WRAPPERS}), else `undefined`.
 */
export function ownSettingOfWrapper(propName: unknown): string | undefined {
    if (typeof propName !== "string") {
        return undefined;
    }
    const lower = propName.toLowerCase();
    return OWN_SETTINGS_OF_WRAPPERS.find(
        (setting) => setting.toLowerCase() === lower,
    );
}
