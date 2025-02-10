import Template from "./Template";

export default class PostponeRenderContainer extends Template {
    static componentType = "_postponeRenderContainer";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        delete attributes.rendered;
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.rendered = {
            returnDependencies: () => ({
                parentRendered: {
                    dependencyType: "parentStateVariable",
                    variableName: "rendered",
                },
            }),
            markStale: () => ({ updateReplacements: true }),
            definition({ dependencyValues }) {
                let rendered = Boolean(dependencyValues.parentRendered);
                return { setValue: { rendered } };
            },
        };

        return stateVariableDefinitions;
    }

    static async calculateReplacementChanges({
        component,
        componentInfoObjects,
    }) {
        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        // if this is the first time rendered, then create the replacements
        if (
            (await component.stateValues.rendered) &&
            component.replacements.length === 0
        ) {
            let replacementResults = await this.createSerializedReplacements({
                component,
                componentInfoObjects,
            });
            let replacements = replacementResults.replacements;
            errors.push(...replacementResults.errors);
            warnings.push(...replacementResults.warnings);

            if (replacements.length > 0) {
                let replacementInstruction = {
                    changeType: "add",
                    changeTopLevelReplacements: true,
                    firstReplacementInd: 0,
                    numberReplacementsToReplace: 0,
                    serializedReplacements: replacements,
                };

                return [replacementInstruction];
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
}
