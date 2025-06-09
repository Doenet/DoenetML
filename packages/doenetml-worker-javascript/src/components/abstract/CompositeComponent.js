import BaseComponent from "./BaseComponent";

export default class CompositeComponent extends BaseComponent {
    constructor(args) {
        super(args);

        this.replacementsWorkspace = {};
    }
    static componentType = "_composite";

    static rendererType = undefined;

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // Make private these four public state variables that are found on all components
        // so that references to this props won't stop at the composite but drill down into the replacements
        stateVariableDefinitions.hidden.public = false;
        stateVariableDefinitions.disabled.public = false;
        stateVariableDefinitions.fixed.public = false;
        stateVariableDefinitions.fixLocation.public = false;

        stateVariableDefinitions.replacements = {
            returnDependencies: () => ({
                replacements: {
                    dependencyType: "replacement",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { replacements: dependencyValues.replacements },
            }),
        };

        stateVariableDefinitions.recursiveReplacements = {
            returnDependencies: () => ({
                recursiveReplacements: {
                    dependencyType: "replacement",
                    recursive: true,
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    recursiveReplacements:
                        dependencyValues.recursiveReplacements,
                },
            }),
        };

        stateVariableDefinitions.fullRecursiveReplacements = {
            returnDependencies: () => ({
                recursiveReplacements: {
                    dependencyType: "replacement",
                    recursive: true,
                    recurseNonStandardComposites: true,
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    fullRecursiveReplacements:
                        dependencyValues.recursiveReplacements,
                },
            }),
        };

        return stateVariableDefinitions;
    }

    // This function is called by Core.js in expandCompositeComponent
    // See that invocation for documentation
    static createSerializedReplacements({ nComponents }) {
        return { replacements: [], errors: [], warnings: [], nComponents };
    }

    // This function is called by Core.js in updateCompositeReplacements
    // See that invocation for documentation
    static calculateReplacementChanges({ nComponents }) {
        return { replacementChanges: [], nComponents };
    }

    // serialize(parameters = {}) {

    //   let serializedState = super.serialize(parameters);

    //   if (this.replacements === undefined) {
    //     return serializedState;
    //   }

    //   // also serialize replacements
    //   let serializedReplacements = [];
    //   for (let ind = 0; ind < this.replacements.length; ind++) {
    //     serializedReplacements.push(this.replacements[ind].serialize(parameters));
    //   }
    //   serializedState.replacements = serializedReplacements;

    //   if (this.replacementsToWithhold !== undefined) {
    //     serializedState.replacementsToWithhold = this.replacementsToWithhold;
    //   }

    //   return serializedState;

    // }

    // The array replacements contains the components that are substituted for the composite
    // and become the children of the composite's parent instead of the composite itself.
    // Note: components do not set this variable directly.
    // Instead, core will create the replacements array based on the information given by
    // the static function createSerializedReplacements.
    // Core will also change the replacements array based on the instructions returned by
    // the static function calculateReplacementChanges.
    replacements = [];

    // The integer replacementsToWithhold is the number of replacements at the end of the replacements array
    // that are ignored when inserting replacements as children to composite's parent.
    // It is used so that when a composite reduces the number of replacements, we don't need to delete the components,
    // but we can just withhold them and reveal them when the number of replacement is increased again.
    // For example, if the number of replacements in a sequence is controlled dynamically by a slider,
    // the sequence withholds replacements when the number is reduced.
    // Note: components do not set this variable directly.
    // Instead, core will change the replacementsToWithhold based on the instructions returned by
    // the static function calculateReplacementChanges.
    replacementsToWithhold = 0;

    get allPotentialRendererTypes() {
        let allPotentialRendererTypes = super.allPotentialRendererTypes;

        // we still recurse to all children, even though was skipped at base component
        // due to not having a rendererType
        for (const childIdxStr in this.allChildren) {
            let child = this.allChildren[childIdxStr].component;
            for (let rendererType of child.allPotentialRendererTypes) {
                if (!allPotentialRendererTypes.includes(rendererType)) {
                    allPotentialRendererTypes.push(rendererType);
                }
            }
        }

        if (this.replacements) {
            for (let replacement of this.replacements) {
                if (typeof replacement === "object") {
                    for (let rendererType of replacement.allPotentialRendererTypes) {
                        if (!allPotentialRendererTypes.includes(rendererType)) {
                            allPotentialRendererTypes.push(rendererType);
                        }
                    }
                }
            }
        }

        return allPotentialRendererTypes;
    }
}
