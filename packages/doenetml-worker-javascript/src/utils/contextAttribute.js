import {
    listEntrySourceDependencies,
    listEntrySourceValue,
} from "./listEntrySource";
import { isReferenceShadow } from "./referenceShadow";

/**
 * `fixed` and `fixLocation` describe where a component is, not what it
 * shows, so a component gets them the same way however it was made. Its own
 * attribute, where it has one, decides. Otherwise it is fixed when anything
 * it sits in or stands for is: its parent, the composite that made it, the
 * component it is an adapter of, the component it is a reference to (its
 * shadow source, or the referent of a value reference), the source of the
 * list entry it was made from, and, for an unlinked copy, what the document
 * set on its source when the copy was made (`copySourceContext`). A
 * setting of false in any of these only stops that one from fixing it. When
 * none of them sets anything, it keeps its own essential value (a write to
 * it, or what the composite that made it gave it), or the default.
 *
 * A reference does not take its source's attribute as its own (the
 * attribute is `notFromReferenceSource`), as an attribute would decide over
 * where the reference sits; it reads its source's value alongside the rest.
 * A component inside a copied one keeps the attribute written on it, and
 * reads what its source is a reference to, if anything, but takes its
 * source's own value only where nothing else sets one, as it sits in the
 * copy in place of where its source sat.
 * A reference to the variable itself (`<boolean extend="$P.fixed"/>`) does
 * not read it, so that the value it shows can be changed.
 *
 * A prop names, in its `shadowingInstructions.contextVariables`, a variable
 * of its source to read in place of the source's own, as an entry of a list
 * is fixed as the list's entries are (`entriesFixed`), not as the list is.
 */
export const CONTEXT_ATTRIBUTES = ["fixed", "fixLocation"];

/**
 * The dependencies of `attributeName` of `component`, as described above.
 * `source`, when given, is the dependency on what the component is a
 * reference to, in place of its shadow source (`null` for none); a value
 * reference reads its referent. Without `ownAttribute`, the component has
 * no attribute for it.
 */
function contextAttributeDependencies({
    component,
    attributeName,
    source,
    ownAttribute,
}) {
    const dependencies = {
        parent: {
            dependencyType: "parentStateVariable",
            variableName: attributeName,
        },
        sourceComposite: {
            dependencyType: "sourceCompositeStateVariable",
            variableName: attributeName,
        },
        adapterSource: {
            dependencyType: "adapterSourceStateVariable",
            variableName: attributeName,
        },
        ...listEntrySourceDependencies(component, attributeName),
    };
    if (ownAttribute) {
        dependencies.own = {
            dependencyType: "stateVariable",
            variableName: `${attributeName}Preliminary`,
            variablesOptional: true,
        };
    }
    if (source !== undefined) {
        if (source) {
            dependencies.source = source;
        }
    } else if (component?.shadows?.propVariable !== attributeName) {
        // A component inside a copied one (a shadow that is neither of a
        // prop nor the reference itself, `isReferenceShadow`) sits in the
        // copy in place of where its source
        // sat, so its source's value, which came from there, only stands
        // where nothing else sets one.
        if (
            component?.shadows &&
            component.shadows.propVariable === undefined &&
            !isReferenceShadow(component)
        ) {
            dependencies.sourceOnlyIfUnset = {
                dependencyType: "value",
                value: true,
            };
            // What its source is a reference to still fixes it, as the
            // copy stands for that reference too.
            dependencies.referenceSource = {
                dependencyType: "shadowSourceStateVariable",
                variableName: attributeName,
                contextVariableOfProp: true,
                throughCopiedComponents: true,
            };
        }
        dependencies.source = {
            dependencyType: "shadowSourceStateVariable",
            variableName: attributeName,
            contextVariableOfProp: true,
        };
    }
    if (component?.doenetAttributes?.copySourceContext) {
        dependencies.copySource = {
            dependencyType: "value",
            value: component.doenetAttributes.copySourceContext[attributeName],
        };
    }
    if (attributeName === "fixed") {
        dependencies.ignoreParent = {
            dependencyType: "doenetAttribute",
            attributeName: "ignoreParentFixed",
        };
    }
    return dependencies;
}

/**
 * The value the dependencies give, or `null` where none of them sets one. A
 * default of true fixes: a component fixed by what made it (the entries of a
 * `<sequence>`, `entriesFixed`).
 */
function contextAttributeValue({ dependencyValues, usedDefault }) {
    const own = dependencyValues.own;
    if (own !== null && own !== undefined && !usedDefault.own) {
        return own;
    }

    let value = null;
    for (const name of [
        "parent",
        "sourceComposite",
        "adapterSource",
        "copySource",
        "referenceSource",
        "source",
    ]) {
        if (
            name === "source" &&
            dependencyValues.sourceOnlyIfUnset &&
            value !== null
        ) {
            continue;
        }
        if (name === "parent" && dependencyValues.ignoreParent) {
            continue;
        }
        const setting = dependencyValues[name];
        if (setting === null || setting === undefined) {
            continue;
        }
        if (!usedDefault[name] || setting === true) {
            value = Boolean(value) || Boolean(setting);
        }
    }
    if (listEntrySourceValue(dependencyValues) === true) {
        value = true;
    }
    return value;
}

/**
 * The definition of `attributeName` (`fixed` or `fixLocation`), as described
 * above. `base` holds its flags and description.
 * `sourceDependency(component, stateValues)`, when given, returns the
 * dependency on what the component is a reference to (`null` for none), in
 * place of its shadow source, from the variables in
 * `stateVariablesDeterminingDependencies`. Without `ownAttribute`, the
 * component has no attribute for it.
 */
export function contextAttributeDefinition({
    attributeName,
    base,
    sourceDependency,
    stateVariablesDeterminingDependencies,
    ownAttribute = true,
}) {
    const definition = {
        ...base,
        returnDependencies({ stateValues = {} } = {}) {
            return contextAttributeDependencies({
                component: this.svComponent,
                attributeName,
                source: sourceDependency?.(this.svComponent, stateValues),
                ownAttribute,
            });
        },
        definition({ dependencyValues, usedDefault }) {
            const value = contextAttributeValue({
                dependencyValues,
                usedDefault,
            });
            if (value === null) {
                return {
                    useEssentialOrDefaultValue: { [attributeName]: true },
                };
            }
            return { setValue: { [attributeName]: value } };
        },
        inverseDefinition({ dependencyValues, desiredStateVariableValues }) {
            // A reference with no attribute of its own for it passes a write
            // to its source, as it did when it took its source's attribute,
            // so that what turned its source's `fixed` on through it can turn
            // it off again. A component inside a copied one keeps the value
            // its source is given (`EssentialValueWriter`), so the write
            // changes it wherever it sits.
            const attribute = this?.svComponent?.attributes?.[attributeName];
            const written =
                attribute?.component !== undefined ||
                attribute?.primitive !== undefined;
            if (
                !written &&
                dependencyValues.source !== null &&
                dependencyValues.source !== undefined
            ) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "source",
                            desiredValue:
                                desiredStateVariableValues[attributeName],
                        },
                    ],
                };
            }
            if (
                dependencyValues.own !== null &&
                dependencyValues.own !== undefined
            ) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "own",
                            desiredValue:
                                desiredStateVariableValues[attributeName],
                        },
                    ],
                };
            }
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: attributeName,
                        value: desiredStateVariableValues[attributeName],
                    },
                ],
            };
        },
    };
    if (stateVariablesDeterminingDependencies) {
        definition.stateVariablesDeterminingDependencies =
            stateVariablesDeterminingDependencies;
    }
    return definition;
}

/**
 * Give `stateVariableDefinitions`, which define `attributeName` (`fixed` or
 * `fixLocation`) with its description and flags, the definition of
 * `contextAttributeDefinition`.
 */
export function addContextAttributeDefinitions({
    stateVariableDefinitions,
    attributeName,
}) {
    stateVariableDefinitions[attributeName] = contextAttributeDefinition({
        attributeName,
        base: stateVariableDefinitions[attributeName],
    });
}

/**
 * `attributeName` of `component` as the document sets it, the same as its
 * definition above gives except `null` where nothing sets it and reading the
 * same of what the component is a reference to: no default, no essential
 * value. It is what an unlinked copy takes from its source, so that a
 * component fixed by the composite that made it, as a `<sequence>` makes its
 * entries and a `<repeat>` its index, does not make a copy of itself fixed.
 * Worked out when a copy is made, as no definition needs it.
 */
async function fromDocument(component, attributeName, components) {
    if (!component?.state) {
        return null;
    }
    if (component.componentType === "_ref") {
        const referentInfo =
            component.fixedReferent ??
            (await component.stateValues.referentInfo);
        return referentInfo?.variableName === attributeName
            ? null
            : fromDocument(
                  components?.[referentInfo?.componentIdx],
                  attributeName,
                  components,
              );
    }

    const preliminary = `${attributeName}Preliminary`;
    if (component.state[preliminary]) {
        const own = await component.stateValues[preliminary];
        if (
            own !== null &&
            own !== undefined &&
            !component.state[preliminary].usedDefault
        ) {
            return own;
        }
    }

    let value = null;
    async function consider(other) {
        if (!other?.state?.[attributeName]) {
            return;
        }
        const setting = await other.stateValues[attributeName];
        if (
            typeof setting === "boolean" &&
            !other.state[attributeName].usedDefault
        ) {
            value = Boolean(value) || setting;
        }
    }

    if (!(
        attributeName === "fixed" &&
        component.doenetAttributes?.ignoreParentFixed
    )) {
        await consider(components?.[component.parentIdx]);
    }
    await consider(component.replacementOf);
    await consider(component.adaptedFrom);
    const copied =
        component.doenetAttributes?.copySourceContext?.[attributeName];
    if (typeof copied === "boolean") {
        value = Boolean(value) || copied;
    }
    const listEntrySource = component.doenetAttributes?.listEntrySource;
    const arrayName = listEntrySource?.variables[attributeName];
    if (arrayName) {
        const list = components?.[listEntrySource.componentIdx];
        if (
            (await list?.stateValues[arrayName])?.[listEntrySource.index] ===
            true
        ) {
            value = true;
        }
    }
    const insideCopy =
        component.shadows &&
        component.shadows.propVariable === undefined &&
        !isReferenceShadow(component);
    if (insideCopy) {
        // what its source is a reference to, as in its definition
        let copied = components?.[component.shadows.componentIdx];
        while (
            copied?.shadows &&
            copied.shadows.propVariable === undefined &&
            !isReferenceShadow(copied)
        ) {
            copied = components?.[copied.shadows.componentIdx];
        }
        if (copied?.shadows && copied.shadows.propVariable !== attributeName) {
            const setting = await fromDocument(
                components?.[copied.shadows.componentIdx],
                attributeName,
                components,
            );
            if (setting !== null) {
                value = Boolean(value) || setting;
            }
        }
    }
    if (
        component.shadows &&
        component.shadows.propVariable !== attributeName &&
        !(insideCopy && value !== null)
    ) {
        const setting = await fromDocument(
            components?.[component.shadows.componentIdx],
            attributeName,
            components,
        );
        if (setting !== null) {
            value = Boolean(value) || setting;
        }
    }
    return value;
}

/**
 * Make `serializedComponent`, an unlinked copy of `source`, take `fixed` and
 * `fixLocation` from `source` as they are now, alongside where the copy
 * sits. It holds whether the document fixes `source` (`fromDocument`), or
 * `alsoFixed[attributeName]` is true (what the copy of a list entry takes
 * from the entry's source), in `doenetAttributes.copySourceContext`. A copy
 * made by serializing `source` (`removeSourceAttributes`) does not keep
 * `source`'s attributes for them, or the essential values that hold them,
 * which would decide over its parent.
 */
export async function snapshotContextAttributes({
    serializedComponent,
    source,
    components,
    alsoFixed = {},
    removeSourceAttributes = false,
}) {
    if (typeof serializedComponent !== "object") {
        return;
    }
    if (removeSourceAttributes) {
        for (const attributeName of CONTEXT_ATTRIBUTES) {
            delete serializedComponent.attributes?.[attributeName];
            if (serializedComponent.state) {
                delete serializedComponent.state[attributeName];
                delete serializedComponent.state[`${attributeName}Preliminary`];
            }
        }
    }
    const copySourceContext = {};
    for (const attributeName of CONTEXT_ATTRIBUTES) {
        copySourceContext[attributeName] =
            (await fromDocument(source, attributeName, components)) === true ||
            alsoFixed[attributeName] === true;
    }
    serializedComponent.doenetAttributes ??= {};
    serializedComponent.doenetAttributes.copySourceContext = copySourceContext;
}
