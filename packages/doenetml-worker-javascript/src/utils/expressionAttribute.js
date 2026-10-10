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
 *   point whose coordinates those are; for a reference to a list of values
 *   (an `<indexOf>`'s `target`), which has no template, an empty
 *   `_componentListWithSelectableType`;
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
 * `math1`, `math2`, … of `xs`; `values` of a `target`), which the
 * `attributeComponent` dependency reads in their place
 * (`expressionAttributeVariable`).
 */
import me from "math-expressions";
import { expressionAttributePrefix } from "./expressionAttributeNames";
import {
    analyzeRepeatTemplate,
    evaluateRepeatTemplate,
    invertRepeatTemplate,
} from "./repeatTemplate";
import {
    emptyValueOfType,
    referenceSlotDefinitions,
    unorderedDefinition,
    valueMissingDefinition,
} from "../components/abstract/referenceSlotDefinitions";
import { buildParsedExpression } from "./booleanLogic";
import { convertValueToType } from "./selectableType";
import { booleanValueFromCodes } from "./valueFunctions/boolean";
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
        valueMissing: `${prefix}valueMissing`,
        unordered: `${prefix}unordered`,
    };
}

/**
 * The state variables of a component for its expression attribute
 * `attribute`: coordinates (`mathList`), a `math` or `boolean` expression,
 * or a reference to a list of values (`valueListDefinitions`) or of points
 * (`pointListDefinitions`).
 */
export function expressionAttributeDefinitions(attribute) {
    if (attribute.componentType === "_componentListWithSelectableType") {
        return valueListDefinitions(attribute);
    }
    if (attribute.componentType === "pointList") {
        return pointListDefinitions(attribute);
    }
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
        // what a comparison reads of each reference besides its value
        // (`booleanLogic.js`)
        definitions[slotNames(name, k).valueMissing] = valueMissingDefinition(
            slotNames(name, k),
        );
        definitions[slotNames(name, k).unordered] = unorderedDefinition({
            names: slotNames(name, k),
            fixedReferentOf: () => undefined,
        });
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
        // A value written is the text of the nodes it changes. The writes
        // of one request are taken together (`workspace`): a drag of a point
        // in space writes its `y` and its `z` through separate inverses.
        async inverseDefinition({
            desiredStateVariableValues,
            stateValues,
            workspace,
        }) {
            if (!workspace.writes) {
                workspace.writes = {
                    ...(await stateValues[`${prefix}writes`]),
                };
            }
            Object.assign(
                workspace.writes,
                desiredStateVariableValues[`${prefix}writes`],
            );
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: `${prefix}writes`,
                        value: { ...workspace.writes },
                    },
                ],
            };
        },
    };

    if (attribute.componentType === "mathList") {
        addCoordinateDefinitions(definitions, name);
    } else if (attribute.componentType === "math") {
        addMathDefinitions(definitions, name);
    } else {
        addBooleanDefinitions(definitions, name, attribute.slots.length);
    }

    return normalizedDefinitions(definitions);
}

/**
 * `definitions` normalized as the definitions of a class are
 * (`getClassStateVariableDefinitions`,
 * `returnNormalizedStateVariableDefinitions`): each variable a definition
 * also defines has an entry of its own, defined with it.
 */
function normalizedDefinitions(definitions) {
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

/**
 * The state variables that resolve the one reference of the expression
 * attribute `name`, a reference to the whole of a list (`WHOLE_LISTS`,
 * `utils/dast/expressionAttributes.ts`), and `list`, the list it names:
 * its index, or `null` while it names nothing, or a withheld replacement of
 * a composite, which a slot reads nothing of (`targetDependencies`). A
 * slot's `referentInfo` and `value` are not among them: the list is read
 * whole, or by its own variables, which a `referent` dependency does not
 * read.
 */
function wholeListDefinitions(name) {
    const names = slotNames(name, 0);
    const slotDefinitions = referenceSlotDefinitions({
        names,
        slot: { attributeName: name, index: 0 },
        fixedReferentOf: () => undefined,
        readPlanOf: (component) => component.attributes[name].slots[0].readPlan,
        emptyValueOf: () => null,
    });
    const definitions = {};
    for (const variable of [
        names.refResolutionIndexDependencies,
        names.refResolutionIndexDependencyValues,
        names.extendIdx,
    ]) {
        definitions[variable] = slotDefinitions[variable];
    }

    const listName = `${expressionAttributePrefix(name)}list`;
    definitions[listName] = {
        stateVariablesDeterminingDependencies: [names.extendIdx],
        returnDependencies({ stateValues }) {
            const extendIdx = stateValues[names.extendIdx];
            if (extendIdx == null || extendIdx === -1) {
                return {};
            }
            return {
                listInactive: {
                    dependencyType: "stateVariable",
                    componentIdx: extendIdx,
                    variableName: "isInactiveCompositeReplacement",
                    variablesOptional: true,
                },
                extendIdx: {
                    dependencyType: "stateVariable",
                    variableName: names.extendIdx,
                },
            };
        },
        definition({ dependencyValues }) {
            const extendIdx = dependencyValues.extendIdx;
            return {
                setValue: {
                    [listName]:
                        extendIdx == null ||
                        extendIdx === -1 ||
                        dependencyValues.listInactive
                            ? null
                            : extendIdx,
                },
            };
        },
    };
    return { definitions, listName };
}

/**
 * The state variables of a component for its expression attribute
 * `attribute` that is one reference to the whole of a value list (an
 * `<indexOf>`'s `target="$l"`): those that resolve the reference
 * (`wholeListDefinitions`), and `values`, the list's values
 * (`readPlan.listVariable`) as the type the component reads them as, its
 * `type` or `number`, as the attribute component
 * (`_componentListWithSelectableType`) held them, one for each entry of the
 * list it made. No values while the reference names no list; withheld with
 * the list, the attribute component kept what its remaining entries held,
 * which nothing reads.
 */
function valueListDefinitions(attribute) {
    const name = attribute.name;
    const { definitions, listName } = wholeListDefinitions(name);

    const valuesName = `${expressionAttributePrefix(name)}values`;
    definitions[valuesName] = {
        stateVariablesDeterminingDependencies: [listName],
        returnDependencies({ stateValues }) {
            const dependencies = {
                type: { dependencyType: "stateVariable", variableName: "type" },
            };
            const list = stateValues[listName];
            if (list !== null) {
                dependencies.list = {
                    dependencyType: "stateVariable",
                    componentIdx: list,
                    variableName:
                        this.svComponent.attributes[name].slots[0].readPlan
                            .listVariable,
                    variablesOptional: true,
                };
            }
            return dependencies;
        },
        definition({ dependencyValues }) {
            const type = dependencyValues.type || "number";
            return {
                setValue: {
                    [valuesName]: (dependencyValues.list ?? []).map((value) =>
                        convertValueToType(value, type),
                    ),
                },
            };
        },
    };

    return normalizedDefinitions(definitions);
}

/**
 * The state variables of a component for its expression attribute
 * `attribute` that is one reference to the whole of a list of points (a
 * `<polyline>`'s `vertices="$points"`): those that resolve the reference
 * (`wholeListDefinitions`), and what a reader of a `<pointList>` reads,
 * read from the list: `numPoints`, `numDimensions`, and each coordinate of
 * each point, `pointX1_1`, `pointX1_2`, …, whose inverse writes the
 * list's, as the attribute component's linked copy of the list wrote it.
 * No points while the reference names no list.
 */
function pointListDefinitions(attribute) {
    const name = attribute.name;
    const prefix = expressionAttributePrefix(name);
    const { definitions, listName } = wholeListDefinitions(name);

    // `numPoints` read as the variable it is an alias of, which every list
    // of points has: an alias is looked up by the list's type, and the
    // types of a `<collect>` made a list share one
    for (const [variable, listVariable] of [
        ["numPoints", "numComponents"],
        ["numDimensions", "numDimensions"],
    ]) {
        definitions[`${prefix}${variable}`] = {
            stateVariablesDeterminingDependencies: [listName],
            returnDependencies({ stateValues }) {
                const list = stateValues[listName];
                return list === null
                    ? {}
                    : {
                          fromList: {
                              dependencyType: "stateVariable",
                              componentIdx: list,
                              variableName: listVariable,
                              variablesOptional: true,
                          },
                      };
            },
            definition: ({ dependencyValues }) => ({
                setValue: {
                    [`${prefix}${variable}`]: dependencyValues.fromList ?? 0,
                },
            }),
        };
    }

    const arrayName = `${prefix}points`;
    const entryPrefix = `${prefix}pointX`;
    definitions[arrayName] = {
        isArray: true,
        isLocation: true,
        numDimensions: 2,
        entryPrefixes: [entryPrefix],
        // `pointX1_2` is the second coordinate of the first point
        getArrayKeysFromVarName({ varEnding, arraySize }) {
            const indices = varEnding.split("_").map((x) => Number(x) - 1);
            if (
                indices.length !== 2 ||
                !indices.every((x) => Number.isInteger(x) && x >= 0) ||
                (arraySize && !indices.every((x, i) => x < arraySize[i]))
            ) {
                return [];
            }
            return [String(indices)];
        },
        returnArraySizeDependencies: () => ({
            numPoints: {
                dependencyType: "stateVariable",
                variableName: `${prefix}numPoints`,
            },
            numDimensions: {
                dependencyType: "stateVariable",
                variableName: `${prefix}numDimensions`,
            },
        }),
        returnArraySize: ({ dependencyValues }) => [
            dependencyValues.numPoints,
            dependencyValues.numDimensions,
        ],
        stateVariablesDeterminingDependencies: [listName],
        returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
            const list = stateValues[listName];
            const dependenciesByKey = {};
            for (const arrayKey of arrayKeys) {
                const [pointInd, dim] = arrayKey.split(",").map(Number);
                dependenciesByKey[arrayKey] =
                    list === null
                        ? {}
                        : {
                              coordinate: {
                                  dependencyType: "stateVariable",
                                  componentIdx: list,
                                  variableName: `pointX${pointInd + 1}_${dim + 1}`,
                                  variablesOptional: true,
                              },
                          };
            }
            return { dependenciesByKey };
        },
        arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
            const points = {};
            for (const arrayKey of arrayKeys) {
                points[arrayKey] = dependencyValuesByKey[arrayKey].coordinate;
            }
            return { setValue: { [arrayName]: points } };
        },
        inverseArrayDefinitionByKey({
            desiredStateVariableValues,
            dependencyNamesByKey,
        }) {
            const instructions = [];
            for (const arrayKey in desiredStateVariableValues[arrayName]) {
                const dependencyName =
                    dependencyNamesByKey[arrayKey]?.coordinate;
                if (dependencyName === undefined) {
                    return { success: false };
                }
                instructions.push({
                    setDependency: dependencyName,
                    desiredValue:
                        desiredStateVariableValues[arrayName][arrayKey],
                });
            }
            return { success: true, instructions };
        },
    };

    return normalizedDefinitions(definitions);
}

/**
 * Add to `definitions` those of the coordinates of the expression attribute
 * `name`, a point's or vector's `xs`: their number, `numComponents`, and
 * each coordinate, `math1`, `math2`, ….
 */
function addCoordinateDefinitions(definitions, name) {
    const prefix = expressionAttributePrefix(name);
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
            // the text of the nodes this write changes
            const newTexts = {};
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
                    Object.assign(newTexts, inverse.texts);
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
            if (Object.keys(newTexts).length > 0) {
                instructions.push({
                    setDependency: "writes",
                    desiredValue: newTexts,
                });
            }
            return { success: true, instructions };
        },
    };
}

/**
 * Add to `definitions` the `value` of the expression attribute `name`, a
 * `math` (a line's `equation`): the template's math evaluated with the
 * values its slots read, as an attribute component's `<math>` computed it,
 * with its defaults (`simplify="none"`). A value written to it is inverted to
 * its slots, or to its text (`invertRepeatTemplate`).
 */
function addMathDefinitions(definitions, name) {
    const prefix = expressionAttributePrefix(name);
    definitions[`${prefix}value`] = {
        stateVariablesDeterminingDependencies: [`${prefix}analysis`],
        returnDependencies({ stateValues }) {
            const analysis = stateValues[`${prefix}analysis`];
            const dependencies = {
                analysis: {
                    dependencyType: "stateVariable",
                    variableName: `${prefix}analysis`,
                },
                writes: {
                    dependencyType: "stateVariable",
                    variableName: `${prefix}writes`,
                },
            };
            for (const c of analysis.nodes[0]?.constantCodes ?? []) {
                dependencies[`slot${c}`] = {
                    dependencyType: "stateVariable",
                    variableName: slotNames(name, c).value,
                };
            }
            return dependencies;
        },
        definition({ dependencyValues }) {
            return {
                setValue: {
                    [`${prefix}value`]: evaluateRepeatTemplate({
                        analysis: dependencyValues.analysis,
                        codeValue: (code) =>
                            dependencyValues[`slot${code.constant}`],
                        settings: MATH_SETTINGS,
                        texts: dependencyValues.writes,
                        evaluators: {},
                    }),
                },
            };
        },
        async inverseDefinition({
            desiredStateVariableValues,
            dependencyValues,
            stateValues,
        }) {
            const { analysis } = dependencyValues;
            const canBeModified = {};
            for (const c of analysis.nodes[0]?.constantCodes ?? []) {
                canBeModified[c] =
                    await stateValues[slotNames(name, c).canBeModified];
            }
            const inverse = invertRepeatTemplate({
                analysis,
                desiredValue: desiredStateVariableValues[`${prefix}value`],
                codeValue: (code) => dependencyValues[`slot${code.constant}`],
                codeCanBeModified: (code) =>
                    canBeModified[code.constant] === true,
                settings: MATH_SETTINGS,
                texts: dependencyValues.writes,
                evaluators: {},
            });
            if (!inverse.success) {
                return { success: false };
            }
            const instructions = inverse.writes.map(
                ({ code, desiredValue }) => ({
                    setDependency: `slot${code.constant}`,
                    desiredValue,
                }),
            );
            if (Object.keys(inverse.texts).length > 0) {
                instructions.push({
                    setDependency: "writes",
                    desiredValue: inverse.texts,
                });
            }
            return { success: true, instructions };
        },
    };
}

/** The settings of a `<math>` with none of its own. */
const MATH_SETTINGS = { simplify: "none", expand: false };

/**
 * Add to `definitions` the `value` of the expression attribute `name`, a
 * `boolean` (`hide="not $b"`, a case's `condition="$x > 9"`), with
 * `numSlots` slots, computed as an attribute component's `<boolean>` computed
 * it, with the compare settings it has by default
 * (`buildParsedExpression`, `booleanValueFromCodes`). It takes no value
 * written to it, as a `<boolean>` with more than one child takes none.
 */
function addBooleanDefinitions(definitions, name, numSlots) {
    const prefix = expressionAttributePrefix(name);
    // the template's content parsed once, each slot a code
    definitions[`${prefix}parsed`] = {
        returnDependencies: () => ({}),
        definition({ componentInfoObjects }) {
            const template = this.svComponent.attributes[name].template;
            const stringChildren = [];
            const allChildren = [];
            for (const child of template.children) {
                if (typeof child === "string") {
                    stringChildren.push(child);
                    allChildren.push(child);
                } else {
                    allChildren.push({ componentType: child.componentType });
                }
            }
            const { codePre, parsedExpression } = buildParsedExpression({
                dependencyValues: { stringChildren, allChildren },
                componentInfoObjects,
            }).setValue;
            return {
                setValue: {
                    [`${prefix}parsed`]: { codePre, parsedExpression },
                },
            };
        },
    };
    definitions[`${prefix}value`] = {
        returnDependencies() {
            const dependencies = {
                parsed: {
                    dependencyType: "stateVariable",
                    variableName: `${prefix}parsed`,
                },
            };
            for (let k = 0; k < numSlots; k++) {
                const names = slotNames(name, k);
                for (const variable of ["value", "valueMissing", "unordered"]) {
                    dependencies[`slot${k}_${variable}`] = {
                        dependencyType: "stateVariable",
                        variableName: names[variable],
                    };
                }
            }
            return dependencies;
        },
        definition({ dependencyValues, componentInfoObjects }) {
            const template = this.svComponent.attributes[name].template;
            const { codePre, parsedExpression } = dependencyValues.parsed;
            const childrenAndSettings = {
                ...defaultCompareSettings(componentInfoObjects),
                mathChildrenByCode: {},
                numberChildrenByCode: {},
                textChildrenByCode: {},
                booleanChildrenByCode: {},
                otherChildrenByCode: {},
            };
            let k = 0;
            for (const child of template.children) {
                if (typeof child === "string") {
                    continue;
                }
                const code = codePre + k;
                const stateValues = {
                    value: dependencyValues[`slot${k}_value`],
                    unordered: dependencyValues[`slot${k}_unordered`],
                    inUnorderedList: false,
                };
                childrenAndSettings[
                    dependencyValues[`slot${k}_valueMissing`]
                        ? "mathChildrenByCode"
                        : childrenGroupOf(
                              child.componentType,
                              componentInfoObjects,
                          )
                ][code] = dependencyValues[`slot${k}_valueMissing`]
                    ? {
                          componentType: "math",
                          stateValues: { value: BLANK_MATH },
                      }
                    : { componentType: child.componentType, stateValues };
                k++;
            }
            return {
                setValue: {
                    [`${prefix}value`]: booleanValueFromCodes({
                        parsedExpression,
                        childrenAndSettings,
                        canOverrideUnorderedCompare: true,
                    }),
                },
            };
        },
    };
}

const BLANK_MATH = me.fromAst("\uff3f");

/**
 * The group of children by code that a child of `componentType` is in, as
 * `returnChildrenByCodeStateVariableDefinitions` sorts them.
 */
function childrenGroupOf(componentType, componentInfoObjects) {
    for (const [base, group] of [
        ["math", "mathChildrenByCode"],
        ["number", "numberChildrenByCode"],
        ["text", "textChildrenByCode"],
        ["boolean", "booleanChildrenByCode"],
    ]) {
        if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType: base,
            })
        ) {
            return group;
        }
    }
    return "otherChildrenByCode";
}

/**
 * The compare settings of a `<boolean>` with none of its own, which an
 * attribute's `<boolean>` has: it takes none from its parent.
 */
function defaultCompareSettings(componentInfoObjects) {
    const attributes =
        componentInfoObjects.allComponentClasses.boolean.createAttributesObject();
    const settings = {};
    for (const name of COMPARE_SETTINGS) {
        settings[name] = attributes[name]?.defaultValue;
    }
    return settings;
}

/** The compare settings `booleanValueFromCodes` reads. */
const COMPARE_SETTINGS = [
    "symbolicEquality",
    "expandOnCompare",
    "simplifyOnCompare",
    "unorderedCompare",
    "matchByExactPositions",
    "allowedErrorInNumbers",
    "includeErrorInNumberExponents",
    "allowedErrorIsAbsolute",
    "numSignErrorsMatched",
    "numPeriodicSetMatchesRequired",
    "caseInsensitiveMatch",
    "matchBlanks",
    "matchPartial",
];

/** The node of `analysis` that coordinate `arrayKey` (from 0) is. */
function coordinateNode(analysis, arrayKey) {
    return analysis.nodes[0].codes[Number(arrayKey)]?.node;
}
