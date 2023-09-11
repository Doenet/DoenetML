// @ts-ignore
import me from "math-expressions";

import { vectorOperators } from "@doenet/utils";

export async function preprocessMathInverseDefinition({
    desiredValue,
    stateValues,
    variableName = "value",
    arrayKey,
    workspace,
}) {
    if (
        !vectorOperators.includes(desiredValue.tree[0]) ||
        !desiredValue.tree.includes()
    ) {
        return { desiredValue };
    }

    // have a desiredValue that is a vector that is missing some entries

    let valueAst;

    let workspaceKey = variableName + "Ast";
    if (arrayKey !== undefined) {
        workspaceKey += `_${arrayKey}`;
    }

    if (workspace[workspaceKey]) {
        // if have value from workspace
        // we will merge components from desired value into workspace value
        valueAst = workspace[workspaceKey].slice(0, desiredValue.tree.length);
    } else {
        let currentValue = await stateValues[variableName];

        currentValue = currentValue.expand().simplify();

        if (currentValue && arrayKey !== undefined) {
            // TODO: generalize to multi-dimensional arrays?
            currentValue = currentValue[arrayKey];
        }

        if (currentValue && vectorOperators.includes(currentValue.tree[0])) {
            // if we have a currentValue that is a vector
            // we will merge components from desired value into current value
            valueAst = currentValue.tree.slice(0, desiredValue.tree.length);
        }
    }

    if (valueAst) {
        // have a vector that we'll merge desiredValue into

        let vectorComponentsNotAffected = [];
        let foundNotAffected = false;
        for (let [ind, value] of desiredValue.tree.entries()) {
            if (value === undefined) {
                foundNotAffected = true;
                vectorComponentsNotAffected.push(ind);
            } else {
                valueAst[ind] = value;
            }
        }
        desiredValue = me.fromAst(valueAst);
        workspace[workspaceKey] = valueAst;

        if (foundNotAffected) {
            return {
                desiredValue,
                vectorComponentsNotAffected,
            };
        } else {
            return { desiredValue };
        }
    } else {
        // don't have a vector to merge desiredValue into
        // but desiredValue has undefined entries
        // desired expression could have undefined entries
        // fill in with \uff3f
        let desiredOperands = [];
        for (let val of desiredValue.tree.slice(1)) {
            if (val === undefined) {
                desiredOperands.push("\uff3f");
            } else {
                desiredOperands.push(val);
            }
        }

        desiredValue = me.fromAst([desiredValue.tree[0], ...desiredOperands]);

        return { desiredValue };
    }
}
