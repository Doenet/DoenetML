import { printDoenetMLrange } from "@doenet/utils";
import BlockComponent from "./BlockComponent";

export default class ErrorComponent extends BlockComponent {
    static componentType = "_error";
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.message = {
            createComponentOfType: "text",
            createStateVariable: "message",
            defaultValue: "",
            public: true,
            forRenderer: true,
            description: "The error message describing what went wrong.",
        };

        return attributes;
    }

    static returnChildGroups() {
        let childGroups = [
            {
                group: "errors",
                componentTypes: ["_error"],
            },
            {
                group: "any",
                componentTypes: ["_base"],
            },
        ];

        return childGroups;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // error components can never be hidden
        stateVariableDefinitions.hidden = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { hidden: false } }),
        };

        // The code naming the diagnostic this error came from, and the
        // arguments filling that code's message in. `convertToErrorComponent`
        // and its relatives put both on the component's `state` (#1556); these
        // are what read them back, and `forRenderer` is what carries them to
        // `_error.tsx`, which renders the message in the reader's language
        // rather than showing the English the worker wrote. Not `public`:
        // `message` is the author-facing form of this, and these are the
        // plumbing behind it.
        //
        // An error that arrived with no code — anything not yet migrated to
        // the catalogs (#1518) — leaves both `null`, and the renderer falls
        // back to `message` exactly as before.
        stateVariableDefinitions.code = {
            forRenderer: true,
            hasEssential: true,
            defaultValue: null,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { code: true },
            }),
        };

        stateVariableDefinitions.args = {
            forRenderer: true,
            hasEssential: true,
            defaultValue: null,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { args: true },
            }),
        };

        stateVariableDefinitions.rangeMessage = {
            description:
                "A message describing where in the source document the error was found.",
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                position: {
                    dependencyType: "position",
                },
            }),
            definition({ dependencyValues }) {
                let rangeMessage = "";

                let position = dependencyValues.position;
                if (position?.start.line !== undefined) {
                    rangeMessage =
                        "Found on " + printDoenetMLrange(position) + ".";
                }

                return { setValue: { rangeMessage } };
            },
        };

        // The same location as `rangeMessage`, taken apart so the renderer can
        // say it in the reader's language instead of showing the sentence
        // assembled here.
        //
        // `rangeMessage` stays as it is rather than being replaced: it is a
        // public state variable, so `$err.rangeMessage` is an author-facing
        // string that has to keep working, and it is the fallback if the
        // catalog somehow can't answer. What changed is that the renderer no
        // longer *reads* it.
        //
        // The line numbers are strings on purpose. Fluent formats a numeric
        // argument through `Intl.NumberFormat`, which would group line 1234 as
        // "1,234" — a line number is an identifier, not a quantity.
        stateVariableDefinitions.rangeArgs = {
            forRenderer: true,
            returnDependencies: () => ({
                position: {
                    dependencyType: "position",
                },
            }),
            definition({ dependencyValues }) {
                let position = dependencyValues.position;
                if (position?.start.line === undefined) {
                    return { setValue: { rangeArgs: null } };
                }

                return {
                    setValue: {
                        rangeArgs: {
                            // Which sentence to select, as a key rather than a
                            // phrase, so a translation can reorder the whole
                            // of it.
                            span:
                                position.start.line === position.end.line
                                    ? "line"
                                    : "lines",
                            startLine: String(position.start.line),
                            endLine: String(position.end.line),
                        },
                    },
                };
            },
        };

        // If this error message is just a repeat of one of its children's messages,
        // then don't display the error again.
        stateVariableDefinitions.showMessage = {
            forRenderer: true,
            returnDependencies: () => ({
                childErrors: {
                    dependencyType: "child",
                    childGroups: ["errors"],
                    variableNames: ["message"],
                },
                message: {
                    dependencyType: "stateVariable",
                    variableName: "message",
                },
            }),
            definition({ dependencyValues }) {
                let showMessage = !dependencyValues.childErrors.some(
                    (child) =>
                        child.stateValues.message === dependencyValues.message,
                );

                return { setValue: { showMessage } };
            },
        };

        return stateVariableDefinitions;
    }
}
