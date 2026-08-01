import InlineComponent from "../abstract/InlineComponent";
import me from "@doenet/math";
import {
    contentTranslator,
    returnContentLocaleDependencies,
} from "../../utils/contentLocale";
const { gcd } = me.math;
import {
    returnSelectedStyleStateVariableDefinition,
    returnTextStyleDescriptionDefinitions,
} from "@doenet/utils";
import { codedDiagnostic } from "../../utils/diagnostics";

export default class IonicCompound extends InlineComponent {
    static componentType = "ionicCompound";
    static rendererType = "math";

    static componentDocs = {
        summary:
            "Forms a balanced ionic compound from constituent ions and renders its chemical formula",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.symbol = {
            createComponentOfType: "text",
            description: "The chemical symbol of an element in the compound.",
        };

        attributes.atomicNumber = {
            createComponentOfType: "integer",
            description: "The atomic number of an element in the compound.",
        };

        attributes.charge = {
            createComponentOfType: "integer",
            description: "The charge of an ion in the compound.",
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "ions",
                componentTypes: ["ion"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let selectedStyleDefinition =
            returnSelectedStyleStateVariableDefinition();
        Object.assign(stateVariableDefinitions, selectedStyleDefinition);

        let styleDescriptionDefinitions =
            returnTextStyleDescriptionDefinitions();
        Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

        stateVariableDefinitions.ionicCompound = {
            // public: true,
            // shadowingInstructions: {
            //   createComponentOfType: "integer",
            // },
            returnDependencies: () => ({
                ionChildren: {
                    dependencyType: "child",
                    childGroups: ["ions"],
                    variableNames: ["symbol", "charge", "atomicNumber", "name"],
                },
            }),
            definition({ dependencyValues }) {
                let charges = dependencyValues.ionChildren.map(
                    (child) => child.stateValues.charge,
                );

                if (charges.length !== 2) {
                    let warning = codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0053",
                    });
                    return {
                        setValue: { ionicCompound: null },
                        sendDiagnostics: [warning],
                    };
                }

                if (!(charges[0] * charges[1] < 0)) {
                    let warning = codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0054",
                    });
                    return {
                        setValue: { ionicCompound: null },
                        sendDiagnostics: [warning],
                    };
                }

                let n1 = Math.abs(charges[1]);
                let n2 = Math.abs(charges[0]);

                let computedGcd = gcd(n1, n2);
                n1 /= computedGcd;
                n2 /= computedGcd;

                let ionicCompound = [
                    {
                        symbol: dependencyValues.ionChildren[0].stateValues
                            .symbol,
                        atomicNumber:
                            dependencyValues.ionChildren[0].stateValues
                                .atomicNumber,
                        name: dependencyValues.ionChildren[0].stateValues.name,
                        charge: charges[0],
                        count: n1,
                    },
                    {
                        symbol: dependencyValues.ionChildren[1].stateValues
                            .symbol,
                        atomicNumber:
                            dependencyValues.ionChildren[1].stateValues
                                .atomicNumber,
                        name: dependencyValues.ionChildren[1].stateValues.name,
                        charge: charges[1],
                        count: n2,
                    },
                ];

                return { setValue: { ionicCompound } };
            },
        };

        stateVariableDefinitions.math = {
            description:
                "The ionic compound rendered as a math expression of its chemical formula.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
            },
            returnDependencies: () => ({
                ionicCompound: {
                    dependencyType: "stateVariable",
                    variableName: "ionicCompound",
                },
            }),
            definition({ dependencyValues }) {
                let tree;

                if (dependencyValues.ionicCompound) {
                    tree = [];
                    for (let piece of dependencyValues.ionicCompound) {
                        let pieceTree = piece.symbol;
                        if (piece.count > 1) {
                            pieceTree = ["_", pieceTree, piece.count];
                        }
                        tree.push(pieceTree);
                    }
                    if (tree.length > 1) {
                        tree = ["*", ...tree];
                    } else if (tree.length === 1) {
                        tree = tree[0];
                    } else {
                        tree = "\uff3f";
                    }
                } else {
                    tree = "\uff3f";
                }
                return {
                    setValue: { math: me.fromAst(tree) },
                };
            },
        };

        stateVariableDefinitions.latex = {
            description: "The ionic compound rendered as a LaTeX string.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "latex",
            },
            returnDependencies: () => ({
                ionicCompound: {
                    dependencyType: "stateVariable",
                    variableName: "ionicCompound",
                },
                ...returnContentLocaleDependencies(),
            }),
            definition({ dependencyValues }) {
                let latex;

                if (dependencyValues.ionicCompound) {
                    let parts = [];
                    for (let piece of dependencyValues.ionicCompound) {
                        let part = `\\text{${piece.symbol}}`;
                        if (piece.count > 1) {
                            part += `_{${piece.count}}`;
                        }
                        parts.push(part);
                    }
                    latex = parts.join(" ");
                } else {
                    const t = contentTranslator(dependencyValues);
                    latex = `[\\text{${t("chemistry-invalid-ionic-compound")}}]`;
                }
                return {
                    setValue: { latex },
                };
            },
        };

        stateVariableDefinitions.text = {
            description: "The ionic compound rendered as a plain text string.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                ionicCompound: {
                    dependencyType: "stateVariable",
                    variableName: "ionicCompound",
                },
                ...returnContentLocaleDependencies(),
            }),
            definition({ dependencyValues }) {
                let text;

                if (dependencyValues.ionicCompound) {
                    let parts = [];
                    for (let piece of dependencyValues.ionicCompound) {
                        let part = piece.symbol;
                        if (piece.count > 1) {
                            part += `_${piece.count}`;
                        }
                        parts.push(part);
                    }
                    text = parts.join(" ");
                } else {
                    const t = contentTranslator(dependencyValues);
                    text = `[${t("chemistry-invalid-ionic-compound")}]`;
                }
                return {
                    setValue: { text },
                };
            },
        };

        return stateVariableDefinitions;
    }

    static adapters = ["math"];
}
