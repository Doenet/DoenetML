import BaseComponent from "../abstract/BaseComponent";

export class Rubric extends BaseComponent {
    static componentType = "rubric";
    static rendererType = undefined;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.credit = {
            createComponentOfType: "number",
            createStateVariable: "credit",
            defaultValue: 0,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "title",
                componentTypes: ["title"],
            },
            {
                group: "criteria",
                componentTypes: ["criteria"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.data = {
            returnDependencies: () => ({
                titleChildren: {
                    dependencyType: "child",
                    childGroups: ["title"],
                    variableNames: ["text"],
                },
                criteriaChildren: {
                    dependencyType: "child",
                    childGroups: ["criteria"],
                    variableNames: ["text"],
                },
                credit: {
                    dependencyType: "stateVariable",
                    variableName: "credit",
                },
            }),
            definition({ dependencyValues, componentName }) {
                let title = "";
                if (dependencyValues.titleChildren.length > 0) {
                    title =
                        dependencyValues.titleChildren[
                            dependencyValues.titleChildren.length - 1
                        ].stateValues.text;
                }
                let criteria = "";
                if (dependencyValues.criteriaChildren.length > 0) {
                    criteria =
                        dependencyValues.criteriaChildren[
                            dependencyValues.criteriaChildren.length - 1
                        ].stateValues.text;
                }

                const data = {
                    credit: dependencyValues.credit,
                    title,
                    criteria,
                    rubricName: componentName,
                };

                return { setValue: { data } };
            },
        };

        return stateVariableDefinitions;
    }
}

export class Rubrics extends BaseComponent {
    static componentType = "rubrics";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "rubric",
                componentTypes: ["rubric"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.data = {
            returnDependencies: () => ({
                rubricChildren: {
                    dependencyType: "child",
                    childGroups: ["rubric"],
                    variableNames: ["data"],
                },
            }),
            definition({ dependencyValues }) {
                const data = dependencyValues.rubricChildren.map(
                    (c) => c.stateValues.data,
                );

                return { setValue: { data } };
            },
        };

        return stateVariableDefinitions;
    }
}
