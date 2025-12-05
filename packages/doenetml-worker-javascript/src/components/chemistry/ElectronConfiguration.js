import { superSubscriptsToUnicode } from "../../utils/math";
import MathComponent from "../Math";

export default class ElectronConfiguration extends MathComponent {
    static componentType = "electronConfiguration";
    static rendererType = "math";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.latex = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "latex",
            },
            returnDependencies: () => ({
                valueForDisplay: {
                    dependencyType: "stateVariable",
                    variableName: "valueForDisplay",
                },
            }),
            definition: function ({ dependencyValues }) {
                let latex;
                try {
                    latex = dependencyValues.valueForDisplay.toLatex();
                } catch (e) {
                    latex = "\uff3f";
                }
                latex = latex.replaceAll("\\,", "");
                latex = latex.replaceAll("\\cdot", "~");
                return { setValue: { latex } };
            },
        };

        stateVariableDefinitions.text = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                valueForDisplay: {
                    dependencyType: "stateVariable",
                    variableName: "valueForDisplay",
                },
            }),
            definition: function ({ dependencyValues }) {
                let text;
                try {
                    text = superSubscriptsToUnicode(
                        dependencyValues.valueForDisplay.toString(),
                    );
                } catch (e) {
                    text = "\uff3f";
                }
                text = text.replaceAll(" ", "");
                text = text.replaceAll("*", " ");
                return { setValue: { text } };
            },
        };

        return stateVariableDefinitions;
    }
}
