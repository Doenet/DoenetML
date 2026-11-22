import BaseComponent from "./abstract/BaseComponent";

export default class Markers extends BaseComponent {
    static componentType = "markers";

    // TODO: <markers> is currently non-functional — examples crash with
    // "tA.returnDependencies is not a function" because the recent <slider>
    // rework dropped the supporting infrastructure. Excluded from the schema
    // until that is restored; tracked in
    // https://github.com/Doenet/DoenetML/issues/1164.
    static excludeFromSchema = true;

    static componentDocs = {
        summary:
            "A list of text or number markers used by graphical components (e.g. axis tick labels).",
    };
    static returnChildGroups() {
        return [
            {
                group: "texts",
                componentTypes: ["text"],
            },
            {
                group: "numbers",
                componentTypes: ["number"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.markerType = {
            description: 'The type of markers ("text", "number", or "empty").',
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                // decided from what is written when the document loaded
                // (TYPE, D45, `propertyTypesAtLoad.ts`)
                propertyTypes: {
                    dependencyType: "doenetAttribute",
                    attributeName: "propertyTypes",
                },
                textChildren: {
                    dependencyType: "child",
                    childGroups: ["texts"],
                },
                numberChildren: {
                    dependencyType: "child",
                    childGroups: ["numbers"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let markerType;
                const atLoad = dependencyValues.propertyTypes?.markers;
                if (
                    atLoad !== undefined &&
                    (dependencyValues.textChildren.length > 0 ||
                        dependencyValues.numberChildren.length > 0)
                ) {
                    markerType = atLoad;
                } else if (dependencyValues.textChildren.length > 0) {
                    markerType = "text";
                } else if (dependencyValues.numberChildren.length > 0) {
                    markerType = "number";
                } else {
                    markerType = "empty";
                }
                return { setValue: { markerType } };
            },
        };

        stateVariableDefinitions.markers = {
            description: "The list of marker values.",
            public: true,
            isArray: true,
            // its type is decided when the document loads (TYPE, D45,
            // `propertyTypesAtLoad.ts`): a text when any marker is one,
            // else a number
            shadowingInstructions: {},
            entryPrefixes: ["item"],
            returnDependencies: () => ({
                markerType: {
                    dependencyType: "stateVariable",
                    variableName: "markerType",
                },
                textChildren: {
                    dependencyType: "child",
                    childGroups: ["texts"],
                    variableNames: ["value"],
                },
                numberChildren: {
                    dependencyType: "child",
                    childGroups: ["numbers"],
                    variableNames: ["value"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let markers = [];

                if (dependencyValues.markerType === "text") {
                    markers = dependencyValues.textChildren.map(
                        (x) => x.stateValues.value,
                    );
                } else if (dependencyValues.markerType === "number") {
                    markers = dependencyValues.numberChildren.map(
                        (x) => x.stateValues.value,
                    );
                    markers.sort((a, b) => {
                        return a - b;
                    }); //sort in number order
                }

                return { setValue: { markers } };
            },
        };

        return stateVariableDefinitions;
    }
}
