import CompositeComponent from "./abstract/CompositeComponent";
import {
    returnSequenceValues,
    returnSequenceValueForIndex,
    returnStandardSequenceAttributes,
    returnStandardSequenceStateVariableDefinitions,
} from "../utils/sequence";
import { returnRoundingAttributes } from "../utils/rounding";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";

export default class Sequence extends CompositeComponent {
    static componentType = "sequence";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static allowInSchemaAsComponent = ["number", "math", "text"];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.fixed = {
            leaveRaw: true,
        };

        for (let attrName in returnRoundingAttributes()) {
            attributes[attrName] = {
                leaveRaw: true,
            };
        }

        let sequenceAttributes = returnStandardSequenceAttributes();
        Object.assign(attributes, sequenceAttributes);

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let sequenceDefs = returnStandardSequenceStateVariableDefinitions();
        Object.assign(stateVariableDefinitions, sequenceDefs);

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                from: {
                    dependencyType: "stateVariable",
                    variableName: "from",
                },
                length: {
                    dependencyType: "stateVariable",
                    variableName: "length",
                },
                step: {
                    dependencyType: "stateVariable",
                    variableName: "step",
                },
                type: {
                    dependencyType: "stateVariable",
                    variableName: "type",
                },
                exclude: {
                    dependencyType: "stateVariable",
                    variableName: "exclude",
                },
            }),
            // when this state variable is marked stale
            // it indicates we should update replacements.
            // For this to work, must get value in replacement functions
            // so that the variable is marked fresh
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                // even with invalid sequence, still ready to expand
                // (it will just expand with zero replacements)
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        workspace,
        componentInfoObjects,
        nComponents,
    }) {
        // console.log(`create serialized replacements for ${component.componentIdx}`)

        let errors = [];
        let warnings = [];

        if (!(await component.stateValues.validSequence)) {
            workspace.lastReplacementParameters = {
                from: null,
                length: null,
                step: null,
                type: null,
                exclude: null,
            };
            return { replacements: [], errors, warnings, nComponents };
        }

        let from = await component.stateValues.from;
        let length = await component.stateValues.length;
        let step = await component.stateValues.step;
        let type = await component.stateValues.type;
        let exclude = await component.stateValues.exclude;

        workspace.lastReplacementParameters = {
            from,
            length,
            step,
            type,
            exclude,
        };

        let sequenceValues = returnSequenceValues({
            from,
            step,
            length,
            exclude,
            type,
            lowercase: await component.stateValues.lowercase,
        });

        let componentType = type;
        if (type === "letters") {
            componentType = "text";
        }

        // if (type === "number" || type === "letters") {
        //   return { replacements: sequenceValues };
        // }

        let replacements = [];

        let attributesToConvert = {};
        for (let attr of [
            "fixed",
            ...Object.keys(returnRoundingAttributes()),
        ]) {
            if (attr in component.attributes) {
                attributesToConvert[attr] = component.attributes[attr];
            }
        }

        for (let componentValue of sequenceValues) {
            // allow one to override the fixed (default true) attribute
            // as well as rounding settings
            // by specifying it on the sequence
            let attributesFromComposite = {};

            if (Object.keys(attributesToConvert).length > 0) {
                const res = convertUnresolvedAttributesForComponentType({
                    attributes: attributesToConvert,
                    componentType,
                    componentInfoObjects,
                    nComponents,
                });

                nComponents = res.nComponents;
                attributesFromComposite = res.attributes;
            }

            let serializedComponent = {
                type: "serialized",
                componentType,
                componentIdx: nComponents++,
                attributes: attributesFromComposite,
                doenetAttributes: {},
                children: [],
                state: { value: componentValue, fixed: true },
            };
            replacements.push(serializedComponent);
        }

        // console.log(`replacements for ${component.componentIdx}`);
        // console.log(replacements);

        return {
            replacements,
            errors,
            warnings,
            nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        workspace,
        componentInfoObjects,
        nComponents,
    }) {
        // console.log(`calculate replacement changes for ${component.componentIdx}`);

        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        let lrp = { ...workspace.lastReplacementParameters };

        let replacementChanges = [];

        // if invalid, withhold any previous replacements
        if (!(await component.stateValues.validSequence)) {
            let currentReplacementsWithheld = component.replacementsToWithhold;
            if (!currentReplacementsWithheld) {
                currentReplacementsWithheld = 0;
            }

            if (
                component.replacements.length - currentReplacementsWithheld >
                0
            ) {
                let replacementsToWithhold = component.replacements.length;
                let replacementInstruction = {
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold,
                };
                replacementChanges.push(replacementInstruction);
            }

            // leave all previous replacement parameters as they were before
            // except make length zero.
            // That way, if later restore to previous parameter set,
            // we can restore the old replacements
            lrp.length = 0;
            workspace.lastReplacementParameters = lrp;

            return { replacementChanges };
        }

        let from = await component.stateValues.from;
        let length = await component.stateValues.length;
        let step = await component.stateValues.step;
        let type = await component.stateValues.type;
        let exclude = await component.stateValues.exclude;
        let lowercase = await component.stateValues.lowercase;

        // check if changed type
        // or have excluded elements
        // TODO: don't completely recreate if have excluded elements
        if (lrp.type !== type || lrp.exclude.length > 0 || exclude.length > 0) {
            // calculate new serialized replacements
            let replacementResults = await this.createSerializedReplacements({
                component,
                workspace,
                componentInfoObjects,
                nComponents,
            });

            let newSerializedReplacements = replacementResults.replacements;
            errors.push(...replacementResults.errors);
            warnings.push(...replacementResults.warnings);
            nComponents = replacementResults.nComponents;

            let replacementInstruction = {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: newSerializedReplacements,
                replacementsToWithhold: 0,
            };

            replacementChanges.push(replacementInstruction);
        } else {
            let modifyExistingValues = false;
            if (type === "math") {
                if (!(from.equals(lrp.from) && step.equals(lrp.step))) {
                    modifyExistingValues = true;
                }
            } else {
                if (from !== lrp.from || step !== lrp.step) {
                    modifyExistingValues = true;
                }
            }

            let prevLength = lrp.length;
            let numReplacementsToAdd = 0;
            let numToModify = 0;
            let firstToModify = prevLength;
            let newReplacementsToWithhold;

            // if have fewer replacements than before
            // mark old replacements as hidden
            if (length < prevLength) {
                newReplacementsToWithhold =
                    component.replacements.length - length;

                let replacementInstruction = {
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold: newReplacementsToWithhold,
                };
                replacementChanges.push(replacementInstruction);
            } else if (length > prevLength) {
                numReplacementsToAdd = length - prevLength;

                if (component.replacementsToWithhold > 0) {
                    if (
                        component.replacementsToWithhold >= numReplacementsToAdd
                    ) {
                        newReplacementsToWithhold =
                            component.replacementsToWithhold -
                            numReplacementsToAdd;
                        numToModify += numReplacementsToAdd;
                        prevLength += numReplacementsToAdd;
                        numReplacementsToAdd = 0;

                        let replacementInstruction = {
                            changeType: "changeReplacementsToWithhold",
                            replacementsToWithhold: newReplacementsToWithhold,
                        };
                        replacementChanges.push(replacementInstruction);
                    } else {
                        numReplacementsToAdd -=
                            component.replacementsToWithhold;
                        numToModify += component.replacementsToWithhold;
                        prevLength += component.replacementsToWithhold;
                        newReplacementsToWithhold = 0;
                        // don't need to send changedReplacementsToWithhold instructions
                        // since will send add instructions,
                        // which will also recalculate replacements in parent
                    }
                }
            }

            if (modifyExistingValues === true) {
                numToModify = prevLength;
                firstToModify = 0;
            }

            if (numToModify > 0) {
                // need to modify values of the first prevLength components

                for (
                    let ind = firstToModify;
                    ind < firstToModify + numToModify;
                    ind++
                ) {
                    let componentValue = returnSequenceValueForIndex({
                        index: ind,
                        from,
                        step,
                        exclude: [],
                        type,
                        lowercase,
                    });

                    let replacementInstruction = {
                        changeType: "updateStateVariables",
                        component: component.replacements[ind],
                        stateChanges: { value: componentValue },
                    };
                    replacementChanges.push(replacementInstruction);
                }
            }

            if (numReplacementsToAdd > 0) {
                // Need to add more replacement components

                let newSerializedReplacements = [];

                let attributesToConvert = {};
                for (let attr of [
                    "fixed",
                    ...Object.keys(returnRoundingAttributes()),
                ]) {
                    if (attr in component.attributes) {
                        attributesToConvert[attr] = component.attributes[attr];
                    }
                }

                for (
                    let ind = prevLength;
                    ind < (await component.stateValues.length);
                    ind++
                ) {
                    let componentValue = returnSequenceValueForIndex({
                        index: ind,
                        from,
                        step,
                        exclude: [],
                        type,
                        lowercase,
                    });

                    let componentType = await component.stateValues.type;
                    if (componentType === "letters") {
                        componentType = "text";
                    }

                    // allow one to override the fixed (default true) attribute
                    // as well as rounding settings
                    // by specifying it on the sequence
                    let attributesFromComposite = {};

                    if (Object.keys(attributesToConvert).length > 0) {
                        const res = convertUnresolvedAttributesForComponentType(
                            {
                                attributes: attributesToConvert,
                                componentType,
                                componentInfoObjects,
                                nComponents,
                            },
                        );

                        nComponents = res.nComponents;
                        attributesFromComposite = res.attributes;
                    }

                    let serializedComponent = {
                        type: "serialized",
                        componentType,
                        componentIdx: nComponents++,
                        attributes: attributesFromComposite,
                        state: { value: componentValue, fixed: true },
                        doenetAttributes: {},
                        children: [],
                    };

                    newSerializedReplacements.push(serializedComponent);
                }

                let replacementInstruction = {
                    changeType: "add",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: prevLength,
                    serializedReplacements: newSerializedReplacements,
                    replacementsToWithhold: 0,
                };
                replacementChanges.push(replacementInstruction);
            }
        }

        lrp.type = type;
        lrp.from = from;
        lrp.length = length;
        lrp.step = step;
        lrp.exclude = exclude;

        workspace.lastReplacementParameters = lrp;

        return { replacementChanges, nComponents };
    }

    get allPotentialRendererTypes() {
        let allPotentialRendererTypes = super.allPotentialRendererTypes;

        let type = "number";
        if (this.attributes.type && this.attributes.type.primitive) {
            type = this.attributes.type.primitive.value.toLowerCase();
        }
        if (!["number", "math", "letters"].includes(type)) {
            type = "number";
        }

        let rendererType =
            this.componentInfoObjects.allComponentClasses[
                type === "letters" ? "text" : type
            ].rendererType;
        if (!allPotentialRendererTypes.includes(rendererType)) {
            allPotentialRendererTypes.push(rendererType);
        }

        return allPotentialRendererTypes;
    }
}
