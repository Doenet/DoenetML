import { createComponentInfoObjects } from "../../utils/componentInfoObjects";
import {
    addDocumentIfItsMissing,
    expandDoenetMLsToFullSerializedComponents,
} from "../../utils/expandDoenetML";
import Core from "../../Core";

export async function createTestCore({ doenetML }) {
    let componentInfoObjects = createComponentInfoObjects();

    let expandResult = await expandDoenetMLsToFullSerializedComponents({
        doenetMLs: [doenetML],
        componentInfoObjects,
    });

    let coreBaseArgs = {
        doenetML,
        serializedDocument: addDocumentIfItsMissing(
            expandResult.fullSerializedComponents[0],
        )[0],
        flags: {},
        allDoenetMLs: expandResult.allDoenetMLs,
        preliminaryErrors: expandResult.errors,
        preliminaryWarnings: expandResult.warnings,
        componentInfoObjects,
        activityId: "",
        cid: "",
        cidForActivity: "",
        pageNumber: 1,
        serverSaveId: "",
        activityVariantIndex: 1,
        requestedVariant: 1,
        requestedVariantIndex: 1,
        stateVariableChanges: "",
        coreId: "",
        updateDataOnContentChange: null,
        theme: null,
    };

    let core = new Core(coreBaseArgs);
    await core.getInitializedPromise();

    return core;
}

export async function returnAllStateVariables(core) {
    if (!core?.components) {
        return {};
    }

    let componentsObj = {};
    for (let componentName in core.components) {
        let component = core.components[componentName];
        let compObj = (componentsObj[componentName] = {
            componentName,
            componentType: component.componentType,
            stateValues: {},
            activeChildren: [],
            replacements: null,
            replacementsToWithhold: null,
            replacementOf: null,
            sharedParameters: null,
        });
        for (let vName in component.state) {
            compObj.stateValues[vName] = await component.state[vName].value;
        }
        compObj.activeChildren = component.activeChildren.map((x) =>
            x.componentName
                ? {
                      componentName: x.componentName,
                      componentType: x.componentType,
                  }
                : x,
        );
        if (component.replacements) {
            compObj.replacements = component.replacements.map((x) =>
                x.componentName
                    ? {
                          componentName: x.componentName,
                          componentType: x.componentType,
                      }
                    : x,
            );
            if (component.replacementsToWithhold !== undefined) {
                compObj.replacementsToWithhold =
                    component.replacementsToWithhold;
            }
        }
        if (component.replacementOf) {
            compObj.replacementOf = component.replacementOf.componentName;
        }
        compObj.sharedParameters = component.sharedParameters;
    }

    return componentsObj;
}
