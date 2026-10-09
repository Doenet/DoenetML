/**
 * An attribute held by its component as text and references, with no
 * attribute component (Doenet/DoenetML#2252, B4; see
 * `docs/b4-coordinate-attributes.md`). The pass that makes one is
 * `utils/dast/expressionAttributes.ts`.
 *
 * `{ type: "expression", name, componentType, template, slots, writes? }`:
 * - `template`: what the attribute component held, with each reference
 *   replaced by a constant code (`repeatTemplateConstant`), as a template of
 *   a repeat made a list holds a value it reads at every index; for `xs`, a
 *   point whose coordinates those are;
 * - `slots`: for each reference, its `refResolution` and how it is read
 *   (`readPlan`), resolved and read by the slot's state variables
 *   (`referenceSlotDefinitions`);
 * - `writes`: the text written to its nodes that an unlinked copy holds
 *   (`copyOfExpressionAttribute`).
 *
 * The component holding it has, for it, the state variables
 * `expressionAttributeDefinitions` makes, under `__<name>_`: one slot per
 * reference, the template's analysis, the text written to its nodes, and
 * what readers of the attribute component read (`numComponents` and
 * `math1`, `math2`, … of `xs`), which the `attributeComponent` dependency
 * reads in their place (`expressionAttributeVariable`).
 */
import { expressionAttributePrefix } from "./expressionAttributeNames";
import {
    analyzeRepeatTemplate,
    evaluateRepeatTemplate,
    invertRepeatTemplate,
} from "./repeatTemplate";
import {
    emptyValueOfType,
    referenceSlotDefinitions,
} from "../components/abstract/referenceSlotDefinitions";
import { normalizeArrayStateVariableDefaults } from "../core/StateVariableInitializer";

/** The names of the state variables of slot `k` of the attribute `name`. */
function slotNames(name, k) {
    const prefix = `${expressionAttributePrefix(name)}ref${k}_`;
    return {
        refResolutionIndexDependencies: `${prefix}refResolutionIndexDependencies`,
        refResolutionIndexDependencyValues: `${prefix}refResolutionIndexDependencyValues`,
        extendIdx: `${prefix}extendIdx`,
        unresolvedPath: `${prefix}unresolvedPath`,
        originalPath: `${prefix}originalPath`,
        referentInfo: `${prefix}referentInfo`,
        value: `${prefix}value`,
        canBeModified: `${prefix}canBeModified`,
    };
}

/**
 * The state variables of a component for its expression attribute
 * `attribute` (of type `mathList`, the coordinates of a point).
 */
export function expressionAttributeDefinitions(attribute) {
    const name = attribute.name;
    const prefix = expressionAttributePrefix(name);
    const definitions = {};
    const slotOf = (component, k) => component.attributes[name].slots[k];

    for (const k of attribute.slots.keys()) {
        Object.assign(
            definitions,
            referenceSlotDefinitions({
                names: slotNames(name, k),
                slot: { attributeName: name, index: k },
                fixedReferentOf: () => undefined,
                readPlanOf: (component) => slotOf(component, k).readPlan,
                emptyValueOf: (component, componentInfoObjects) =>
                    emptyValueOfType(
                        slotOf(component, k).readPlan.presentedComponentType,
                        componentInfoObjects,
                    ),
            }),
        );
    }

    // the template, analysed once
    definitions[`${prefix}analysis`] = {
        returnDependencies: () => ({}),
        definition() {
            return {
                setValue: {
                    [`${prefix}analysis`]: analyzeRepeatTemplate(
                        this.svComponent.attributes[name].template,
                    ),
                },
            };
        },
    };

    // The text written to each node of the template, by its index, for a
    // node that took a value by changing its text (`($a, 0)` dragged to
    // `(2, 5)` makes the `0` a `5`), as each `<math>` kept its own.
    definitions[`${prefix}writes`] = {
        hasEssential: true,
        defaultValue: attribute.writes ?? {},
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: { [`${prefix}writes`]: true },
        }),
        inverseDefinition: ({ desiredStateVariableValues }) => ({
            success: true,
            instructions: [
                {
                    setEssentialValue: `${prefix}writes`,
                    value: desiredStateVariableValues[`${prefix}writes`],
                },
            ],
        }),
    };

    definitions[`${prefix}numComponents`] = {
        returnDependencies: () => ({
            analysis: {
                dependencyType: "stateVariable",
                variableName: `${prefix}analysis`,
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                [`${prefix}numComponents`]:
                    dependencyValues.analysis.nodes[0].codes.length,
            },
        }),
    };

    // Coordinate k: node k of the template evaluated with the values its
    // slots read, and, for a value written to it, inverted to its slots or
    // to its text (`invertRepeatTemplate`).
    const arrayName = `${prefix}maths`;
    definitions[arrayName] = {
        isArray: true,
        entryPrefixes: [`${prefix}math`],
        returnArraySizeDependencies: () => ({
            numComponents: {
                dependencyType: "stateVariable",
                variableName: `${prefix}numComponents`,
            },
        }),
        returnArraySize: ({ dependencyValues }) => [
            dependencyValues.numComponents,
        ],
        stateVariablesDeterminingDependencies: [`${prefix}analysis`],
        returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
            const analysis = stateValues[`${prefix}analysis`];
            const globalDependencies = {
                analysis: {
                    dependencyType: "stateVariable",
                    variableName: `${prefix}analysis`,
                },
                writes: {
                    dependencyType: "stateVariable",
                    variableName: `${prefix}writes`,
                },
            };
            const dependenciesByKey = {};
            for (const arrayKey of arrayKeys) {
                const node = coordinateNode(analysis, arrayKey);
                const dependencies = {};
                for (const c of analysis.nodes[node]?.constantCodes ?? []) {
                    dependencies[`slot${c}`] = {
                        dependencyType: "stateVariable",
                        variableName: slotNames(name, c).value,
                    };
                }
                dependenciesByKey[arrayKey] = dependencies;
            }
            return { globalDependencies, dependenciesByKey };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
            dependencyValuesByKey,
            arrayKeys,
        }) {
            const { analysis, writes } = globalDependencyValues;
            const values = {};
            for (const arrayKey of arrayKeys) {
                values[arrayKey] = evaluateRepeatTemplate({
                    analysis,
                    codeValue: (code) =>
                        dependencyValuesByKey[arrayKey][`slot${code.constant}`],
                    settings: {},
                    texts: writes,
                    evaluators: {},
                    ind: coordinateNode(analysis, arrayKey),
                });
            }
            return { setValue: { [arrayName]: values } };
        },
        async inverseArrayDefinitionByKey({
            desiredStateVariableValues,
            globalDependencyValues,
            dependencyValuesByKey,
            dependencyNamesByKey,
            stateValues,
        }) {
            const { analysis } = globalDependencyValues;
            let writes = globalDependencyValues.writes;
            const instructions = [];
            for (const arrayKey in desiredStateVariableValues[arrayName]) {
                const dependencyValues = dependencyValuesByKey[arrayKey];
                const canBeModified = {};
                for (const c of analysis.nodes[
                    coordinateNode(analysis, arrayKey)
                ]?.constantCodes ?? []) {
                    canBeModified[c] =
                        await stateValues[slotNames(name, c).canBeModified];
                }

                const inverse = invertRepeatTemplate({
                    analysis,
                    desiredValue:
                        desiredStateVariableValues[arrayName][arrayKey],
                    codeValue: (code) =>
                        dependencyValues[`slot${code.constant}`],
                    codeCanBeModified: (code) =>
                        canBeModified[code.constant] === true,
                    settings: {},
                    texts: writes,
                    evaluators: {},
                    ind: coordinateNode(analysis, arrayKey),
                });
                if (!inverse.success) {
                    return { success: false };
                }
                if (Object.keys(inverse.texts).length > 0) {
                    writes = { ...writes, ...inverse.texts };
                }
                for (const { code, desiredValue } of inverse.writes) {
                    instructions.push({
                        setDependency:
                            dependencyNamesByKey[arrayKey][
                                `slot${code.constant}`
                            ],
                        desiredValue,
                    });
                }
            }
            if (writes !== globalDependencyValues.writes) {
                instructions.push({
                    setDependency: "writes",
                    desiredValue: writes,
                });
            }
            return { success: true, instructions };
        },
    };

    // as the definitions of a class are (`getClassStateVariableDefinitions`,
    // `returnNormalizedStateVariableDefinitions`): each variable a definition
    // also defines has an entry of its own, defined with it
    for (const [varName, definition] of Object.entries(definitions)) {
        normalizeArrayStateVariableDefaults(definition, varName);
        for (const [ind, other] of (
            definition.additionalStateVariablesDefined ?? []
        ).entries()) {
            const additional = [...definition.additionalStateVariablesDefined];
            additional[ind] = varName;
            definitions[other] = {
                returnDependencies: definition.returnDependencies,
                definition: definition.definition,
                inverseDefinition: definition.inverseDefinition,
                stateVariablesDeterminingDependencies:
                    definition.stateVariablesDeterminingDependencies,
                additionalStateVariablesDefined: additional,
            };
        }
    }

    return definitions;
}

/** The node of `analysis` that coordinate `arrayKey` (from 0) is. */
function coordinateNode(analysis, arrayKey) {
    return analysis.nodes[0].codes[Number(arrayKey)]?.node;
}
