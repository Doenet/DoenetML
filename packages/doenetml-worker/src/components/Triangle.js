import Polygon from "./Polygon";
import me from "math-expressions";

export default class Triangle extends Polygon {
    static componentType = "triangle";
    static rendererType = "polygon";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let styleDescriptionWithNounDef =
            stateVariableDefinitions.styleDescriptionWithNoun.definition;

        stateVariableDefinitions.styleDescriptionWithNoun.definition =
            function ({ dependencyValues }) {
                let styleDescriptionWithNoun = styleDescriptionWithNounDef({
                    dependencyValues,
                }).setValue.styleDescriptionWithNoun;
                styleDescriptionWithNoun = styleDescriptionWithNoun.replaceAll(
                    "polygon",
                    "triangle",
                );

                return { setValue: { styleDescriptionWithNoun } };
            };

        stateVariableDefinitions.unconstrainedVertices.hasEssential = true;

        stateVariableDefinitions.unconstrainedVertices.defaultValueByArrayKey =
            function (arrayKey) {
                if (["0,1", "1,0"].includes(arrayKey)) {
                    return me.fromAst(1);
                } else {
                    return me.fromAst(0);
                }
            };

        stateVariableDefinitions.unconstrainedVertices.returnArraySizeDependencies =
            () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            });
        stateVariableDefinitions.unconstrainedVertices.returnArraySize =
            function ({ dependencyValues }) {
                return [3, dependencyValues.numDimensions];
            };

        stateVariableDefinitions.unconstrainedVertices.arrayDefinitionByKey =
            function ({ dependencyValuesByKey, arrayKeys }) {
                // console.log('array definition of triangle unconstrainedVertices');
                // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
                // console.log(arrayKeys);

                let unconstrainedVertices = {};
                let useEssential = {};

                for (let arrayKey of arrayKeys) {
                    let [pointInd, dim] = arrayKey.split(",");
                    let varEnding =
                        Number(pointInd) + 1 + "_" + (Number(dim) + 1);

                    let verticesAttr = dependencyValuesByKey[arrayKey].vertices;
                    if (
                        verticesAttr !== null &&
                        verticesAttr.stateValues["pointX" + varEnding]
                    ) {
                        unconstrainedVertices[arrayKey] =
                            verticesAttr.stateValues["pointX" + varEnding];
                    } else {
                        useEssential[arrayKey] = true;
                    }
                }

                return {
                    setValue: { unconstrainedVertices },
                    useEssentialOrDefaultValue: {
                        unconstrainedVertices: useEssential,
                    },
                };
            };

        stateVariableDefinitions.unconstrainedVertices.inverseArrayDefinitionByKey =
            async function ({
                desiredStateVariableValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                initialChange,
                stateValues,
            }) {
                // console.log(`inverseArrayDefinition of unconstrainedVertices of triangle`);
                // console.log(desiredStateVariableValues)
                // console.log(JSON.parse(JSON.stringify(stateValues)))
                // console.log(dependencyValuesByKey);

                // if not draggable, then disallow initial change
                if (initialChange && !(await stateValues.draggable)) {
                    return { success: false };
                }

                let instructions = [];
                let essentialVertices = {};
                for (let arrayKey in desiredStateVariableValues.unconstrainedVertices) {
                    let [pointInd, dim] = arrayKey.split(",");
                    let varEnding =
                        Number(pointInd) + 1 + "_" + (Number(dim) + 1);

                    if (
                        dependencyValuesByKey[arrayKey].vertices !== null &&
                        dependencyValuesByKey[arrayKey].vertices.stateValues[
                            "pointX" + varEnding
                        ]
                    ) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].vertices,
                            desiredValue:
                                desiredStateVariableValues
                                    .unconstrainedVertices[arrayKey],
                            variableIndex: 0,
                        });
                    } else {
                        essentialVertices[arrayKey] =
                            desiredStateVariableValues.unconstrainedVertices[
                                arrayKey
                            ].simplify();
                    }

                    instructions.push({
                        setDependency:
                            dependencyNamesByKey[arrayKey]
                                .desiredUnconstrainedVertices,
                        desiredValue:
                            desiredStateVariableValues.unconstrainedVertices[
                                arrayKey
                            ],
                    });
                }

                instructions.push({
                    setEssentialValue: "unconstrainedVertices",
                    value: essentialVertices,
                });

                return {
                    success: true,
                    instructions,
                };
            };

        stateVariableDefinitions.numVertices = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            forRenderer: true,
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { numVertices: 3 } }),
        };

        return stateVariableDefinitions;
    }
}
