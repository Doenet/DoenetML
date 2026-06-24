/**
 * Reconcile the action names dispatched by `doenetml-prototype` (which uses the
 * rust core's action names) with the names the JavaScript core registers.
 *
 * The prototype renderers were written against the rust core, so most action
 * names already match (e.g. `textInput`'s `updateValue` /
 * `updateImmediateValue`). The graph components are the exceptions: the rust
 * core (and thus the prototype) uses `move` / `changeBoundingBox`, while the JS
 * core registers `movePoint` / `changeAxisLimits`. The args are compatible in
 * both cases (JS `movePoint` accepts `{x, y, z}`, a superset of `{x, y}`; both
 * graph actions take `{xMin, xMax, yMin, yMax}`), so only the name needs
 * translating.
 *
 * This name translation is temporary scaffolding. The differing names are an
 * artifact of the JS and Rust cores being developed separately; once the action
 * names are unified there will be a single name in both cores (the old JS name
 * may linger internally for a while, since the JS core will eventually be
 * replaced by Rust). When that happens this whole module can go away.
 *
 * Keyed by component type, then by the rust/prototype action name. Component
 * types absent here (or action names that aren't overridden) pass through
 * unchanged. Keep this in sync with the rust `Actions` enums in
 * `lib-doenetml-core/src/components/doenet/*` as the prototype gains interactive
 * components.
 */
export const JS_CORE_ACTION_NAME_OVERRIDES: Record<
    string,
    Record<string, string>
> = {
    point: { move: "movePoint" },
    graph: { changeBoundingBox: "changeAxisLimits" },
};

/**
 * Map a rust/prototype action name to the JavaScript core's name for the given
 * component type, using `JS_CORE_ACTION_NAME_OVERRIDES`. An unknown component
 * type or an action name without an override is returned unchanged.
 */
export function translateJsCoreActionName(
    componentType: string | undefined,
    actionName: string,
): string {
    if (componentType == null) {
        return actionName;
    }
    return (
        JS_CORE_ACTION_NAME_OVERRIDES[componentType]?.[actionName] ?? actionName
    );
}
