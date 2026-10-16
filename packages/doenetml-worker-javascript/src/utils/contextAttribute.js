import {
    listEntrySourceDependencies,
    listEntrySourceValue,
} from "./listEntrySource";
import { isReferenceShadow } from "./referenceShadow";
import { copyOfLiteralAttribute } from "./literalAttribute";

/**
 * `fixed` and `fixLocation` describe where a component is, not what it
 * shows, so a component gets them the same way however it was made. Its own
 * attribute, where it has one, decides. Otherwise it is fixed when anything
 * it sits in or stands for is: its parent, the composite that made it, the
 * component it is an adapter of, the component it is a reference to (its
 * shadow source, or the referent of a value reference), and the source of
 * the list entry it was made from. An unlinked copy, which is its source's
 * DoenetML pasted where it sits, takes the attribute written on its source
 * as its own (`serialize`), and nothing else from it. A
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
    } else if (component?.doenetAttributes?.extendsList !== undefined) {
        // A list made by an `extend` of a list (`convertToCopy`) reads the
        // list it names as a reference reads its source.
        dependencies.source = {
            dependencyType: "stateVariable",
            componentIdx: component.doenetAttributes.extendsList,
            variableName: attributeName,
            variablesOptional: true,
        };
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
                attribute?.primitive !== undefined ||
                attribute?.type === "literal";
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
 * What `component` shadows, when it is a reference or a component inside one
 * (a shadow, not of a prop), or the list it names, when it is a list made by
 * an `extend` of a list (`extendsList`), or the unlinked copy of the list it
 * names, when it is a list made by a `copy` of a list (`copyListViaComposite`),
 * or the composite it names, when that copy copied the composite's
 * replacements, so that a copy of it, pasted as the DoenetML it is linked
 * to, takes the attributes written there; otherwise `undefined`. An extend of a list that
 * names itself makes this a cycle (reported as circular elsewhere), so a walk
 * along it stops at a component it has seen.
 */
export async function pastedShadowSource(component, components) {
    const shadows = component?.shadows;
    if (!shadows) {
        // a list made by an `extend` of a list (`convertToCopy`) stands for
        // the list it names, as a reference does for its source
        const listIdx = component?.doenetAttributes?.extendsList;
        if (listIdx !== undefined) {
            return components?.[listIdx];
        }
        // a list made by a `copy` of a list stands for the unlinked copy of
        // that list its `_copy` makes, which has the list's attributes as
        // pasted, or, when the `_copy` copied the replacements of a
        // composite (`<mathList copy="$g"/>` of a `<group>`), for that
        // composite (`AttributeComponentDependency`)
        const copyComposite =
            components?.[component?.doenetAttributes?.copyListViaComposite];
        if (copyComposite) {
            if (await copyComposite.stateValues.usedReplacements) {
                const named = await copyComposite.stateValues.extendedComponent;
                return named ? components[named.componentIdx] : undefined;
            }
            return copyComposite.replacements?.find(
                (replacement) => typeof replacement === "object",
            );
        }
        return undefined;
    }
    const source = components?.[shadows.componentIdx];
    if (
        shadows.propVariable === undefined ||
        (component.doenetAttributes?.fromImplicitProp &&
            source?.constructor.implicitPropReturnsSameType)
    ) {
        return source;
    }
    return undefined;
}

/**
 * The attribute component written for `attributeName` on `component`, or
 * on what it shadows (`pastedShadowSource`), or, for a component made from a
 * list entry (`listEntrySource`), on the list or the entry's source: what a
 * copy of `component` takes as its own (`serialize`).
 */
async function writtenAttributeComponent(component, attributeName, components) {
    const visited = new Set();
    for (
        let comp = component;
        comp && !visited.has(comp);
        comp = await pastedShadowSource(comp, components)
    ) {
        visited.add(comp);
        const attribute = comp.attributes?.[attributeName];
        if (attribute?.component) {
            return attribute.component;
        }
        if (attribute?.type === "literal") {
            // with what a reader wrote over it, as an attribute component
            // is copied with its state
            return { literal: copyOfLiteralAttribute(attribute, comp) };
        }
        const listEntrySource = comp.doenetAttributes?.listEntrySource;
        if (listEntrySource?.variables[attributeName]) {
            return writtenEntryAttributeComponent({
                list: components?.[listEntrySource.componentIdx],
                index: listEntrySource.index,
                attributeName,
                components,
            });
        }
    }
    return undefined;
}

/**
 * The attribute component for `attributeName` (`fixed` or `fixLocation`),
 * or, for an attribute written as a plain value, `{ literal }`, a copy of
 * that literal (`literalAttribute.ts`), that a copy of entry `index` of
 * `list` takes as its own, as the entry
 * pasted: the one written on the list (`<pointList fixed="$b">`), which
 * fixes its entries, or else the one written on the entry's source (`<point
 * fixed="$b">` in a `<pointList>` or found by a `<collect>`, or, for an entry
 * of a list among the list's children, `<pointList>$pl</pointList>`, that
 * list's entry). Only a list of points or vectors records its entries'
 * sources (`entryChildren`); for another list, as a `<mathList>`, it is only
 * the one written on the list, as for a reference to the entry.
 */
export async function writtenEntryAttributeComponent({
    list,
    index,
    attributeName,
    components,
}) {
    const fromList = await writtenAttributeComponent(
        list,
        attributeName,
        components,
    );
    if (fromList || !list?.state?.entryChildren) {
        return fromList;
    }
    const entrySource = (await list.stateValues.entryChildren)[index];
    const source = components?.[entrySource?.componentIdx];
    if (Number.isInteger(entrySource?.listEntryIndex)) {
        return writtenEntryAttributeComponent({
            list: source,
            index: entrySource.listEntryIndex,
            attributeName,
            components,
        });
    }
    return writtenAttributeComponent(source, attributeName, components);
}
