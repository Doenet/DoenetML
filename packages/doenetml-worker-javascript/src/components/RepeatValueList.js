import ValueListComponent from "./abstract/ValueListComponent";
import MathComponent from "./Math";
import {
    REPEAT_LIST_STATICS,
    addRepeatListAttributes,
    addRepeatListDefinitions,
    repeatTemplateEntriesDefinition,
} from "./abstract/repeatList";
import { mathValueForDisplay } from "../utils/valueFunctions/math";
import { templateCanBeModified } from "../utils/repeatTemplate";

/**
 * A `<repeat>` or `<repeatForSequence>` whose template is one value, made a
 * list component by the pass in `utils/dast/repeatLists.ts`, which decides
 * which qualify. Part of Doenet/DoenetML#2163 (F6); see
 * `docs/f6-repeat-templates-as-lists.md`.
 *
 * Where the repeat made a copy of its template for each iteration, the list
 * keeps the template serialized (`repeatTemplate`) and computes entry k from
 * it with what the template reads at index k (`utils/repeatTemplate.js`):
 * - entry k of a list (`$i`, `$v`, `$l[$i]`; `repeatEntry`), each a
 *   dependency of that entry alone;
 * - a value that is the same at every index, which a child of the list reads
 *   once (`repeatTemplateConstant`).
 *
 * The number of entries is the number of iterations the repeat had: the
 * length of its sequence, or the number of items it iterates `for`. Its value
 * and index stay the lists the value-reference pass made them
 * (`_repeatValues`, `_repeatIndices`), children of the list that read its
 * `forValues` and `numIterates`.
 *
 * A value written to an entry is written to what the template reads at that
 * index, as a write to the iteration's component was: to entry k of a list it
 * reads, or to a value it reads at every index, which changes every entry.
 * Where a component of the template takes it by changing its text, as
 * `<math>($v, 0)</math>` takes `(2, 5)` by changing its `0`, that entry's own
 * copy of the text is changed (`entryWrites`, by the component's node), as
 * the iteration's component's was, and is kept while the repeat has fewer
 * iterations, as the iteration it withheld kept it.
 *
 * It draws its variant seed from its parent as the repeat did, so the random
 * values after it in the document are those the repeat left them.
 */
export default class RepeatValueList extends ValueListComponent {
    static componentType = "_repeatValueList";

    static listEntryComponentType = "math";

    static listEntryTypeAttribute = "entryType";

    static listEntryTypeFromAttribute(attribute) {
        return attribute?.type === "primitive"
            ? String(attribute.primitive.value)
            : undefined;
    }

    // An entry is fixed only as the template was, by its own `fixed` or an
    // ancestor's.
    static listEntriesFixedByDefault = false;

    static createAttributesObject() {
        const attributes = super.createAttributesObject();
        addRepeatListAttributes(attributes);
        attributes.entryType = {
            createPrimitiveOfType: "string",
        };
        // the template's own, which the list holds when it is a `<math>`
        const mathAttributes = MathComponent.createAttributesObject();
        attributes.simplify = mathAttributes.simplify;
        attributes.expand = mathAttributes.expand;
        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "iterationLists",
                componentTypes: ["_repeatValues", "_repeatIndices"],
            },
            {
                group: "constants",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        const entryType = this.listEntryComponentType;
        const arrayName = this.listValuesArrayName;

        addRepeatListDefinitions(stateVariableDefinitions);

        // An entry takes a write when the template does, as the iteration's
        // component reported, so that what reads it (`$r[2] + $c`) writes
        // elsewhere when it does not (`<math>$v</math>`).
        stateVariableDefinitions.entriesCanBeModified = {
            // A reference to the whole list, which holds no template, reads
            // the list's.
            shadowVariable: true,
            returnDependencies: () => ({
                entriesFixed: {
                    dependencyType: "stateVariable",
                    variableName: "entriesFixed",
                },
                templateAnalysis: {
                    dependencyType: "stateVariable",
                    variableName: "templateAnalysis",
                },
                constants: {
                    dependencyType: "child",
                    childGroups: ["constants"],
                    variableNames: ["canBeModified"],
                    variablesOptional: true,
                },
                entryListsCanBeModified: {
                    dependencyType: "stateVariable",
                    variableName: "entryListsCanBeModified",
                },
                fixLocation: {
                    dependencyType: "stateVariable",
                    variableName: "fixLocation",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entriesCanBeModified:
                        !dependencyValues.entriesFixed &&
                        templateCanBeModified({
                            analysis: dependencyValues.templateAnalysis,
                            fixLocation: dependencyValues.fixLocation,
                            codeCanBeModified: (code) =>
                                code.entry !== undefined
                                    ? dependencyValues.entryListsCanBeModified[
                                          code.entry
                                      ]
                                    : dependencyValues.constants[code.constant]
                                          ?.stateValues.canBeModified === true,
                        }),
                },
            }),
        };

        const settingsDependencies = {
            simplify: {
                dependencyType: "stateVariable",
                variableName: "simplify",
            },
            expand: {
                dependencyType: "stateVariable",
                variableName: "expand",
            },
        };

        // Entry k is the template's value with what it reads at index k.
        stateVariableDefinitions[arrayName] = repeatTemplateEntriesDefinition({
            baseValues: stateVariableDefinitions[arrayName],
            arrayName,
            entryType,
            settingsDependencies,
        });

        if (entryType === "math") {
            // As a `<math>` shows its value: rounded, then simplified and
            // expanded as its value is.
            const base = stateVariableDefinitions.entryValuesForDisplay;
            stateVariableDefinitions.entryValuesForDisplay = {
                ...base,
                returnDependencies: (args) => ({
                    ...base.returnDependencies(args),
                    ...settingsDependencies,
                }),
                definition({ dependencyValues }) {
                    const values = dependencyValues.values;
                    return {
                        setValue: {
                            entryValuesForDisplay: values.map((value) =>
                                mathValueForDisplay({
                                    ...dependencyValues,
                                    value,
                                }),
                            ),
                        },
                    };
                },
            };
        }

        return stateVariableDefinitions;
    }
}

Object.assign(RepeatValueList, REPEAT_LIST_STATICS);
