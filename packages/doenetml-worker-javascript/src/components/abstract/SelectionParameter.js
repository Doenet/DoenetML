import BaseComponent from "./BaseComponent";
import {
    asStateValue,
    parameterValue,
    slotValue,
} from "../../utils/selectionParameters";

/**
 * A random selection's parameter, compiled when the document loads, in place
 * of the attribute component the parameter was written as
 * (`utils/selectionParameters.ts`). Its children are its slots, each a
 * `_selectionParameterSlot` holding one reference; the template it computes
 * the parameter from is `doenetAttributes.selectionParameter`. The value is
 * `parameterValue`, the function the load-time check proves the selection
 * with, so the check and the selection read the parameter alike.
 *
 * It holds what the attribute component it replaces held, by the variable
 * the selection reads: `value`, `values` (a sequence's `exclude`), `numbers`
 * (a `<numberList>`'s, a prime's `exclude`) and `lists`
 * (`excludeCombinations`).
 */
export class SelectionParameter extends BaseComponent {
    static componentType = "_selectionParameter";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "slots",
                componentTypes: ["_selectionParameterSlot"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.parameterValue = {
            additionalStateVariablesDefined: [
                "value",
                "values",
                "numbers",
                "lists",
            ],
            returnDependencies: () => ({
                parameter: {
                    dependencyType: "doenetAttribute",
                    attributeName: "selectionParameter",
                },
                slots: {
                    dependencyType: "child",
                    childGroups: ["slots"],
                    variableNames: ["slotValues"],
                },
            }),
            definition({ dependencyValues }) {
                const parameter = dependencyValues.parameter;
                const slots = dependencyValues.slots;
                const value = parameterValue(
                    parameter,
                    (k) =>
                        slots[k]?.stateValues.slotValues ?? {
                            value: NaN,
                            values: [],
                        },
                );
                const state = asStateValue(value, parameter.output);
                return {
                    setValue: {
                        parameterValue: value,
                        value: parameter.kind === "scalar" ? state : null,
                        values: parameter.kind === "list" ? state : [],
                        numbers: parameter.kind === "list" ? state : [],
                        lists: parameter.kind === "lists" ? state : [],
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

/**
 * A slot of a `_selectionParameter`: one reference, as its child, and what
 * it holds (`slotValues`): its value, and, for a reference to a selection of
 * several, each of them, as `slotValue` reads each.
 */
export class SelectionParameterSlot extends BaseComponent {
    static componentType = "_selectionParameterSlot";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.slotValues = {
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["value", "selectedValues"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                const values = [];
                for (const child of dependencyValues.children) {
                    const selected = child.stateValues?.selectedValues;
                    if (Array.isArray(selected)) {
                        values.push(...selected.map(slotValue));
                    } else {
                        values.push(slotValue(child.stateValues?.value));
                    }
                }
                return {
                    setValue: {
                        slotValues: {
                            value: values.length > 0 ? values[0] : NaN,
                            values,
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
