import { codedDiagnostic } from "./diagnostics";

/**
 * The `shortDescription` state variable shared by the components that take a
 * `<shortDescription>` child and are reported as inaccessible without one:
 * `<graph>`, `<chart>` and `<image>`.
 *
 * All three read the child the same way and raise the same accessibility
 * diagnostic, differing only in the tag they name, so the definition lives here
 * rather than as a copy apiece — the arrangement `utils/componentSize` and
 * `utils/axisLabel` already use for the other pieces `<graph>` and `<chart>`
 * hold in common.
 *
 * The *last* child wins, which is what makes a `<shortDescription>` on a
 * component that shadows another override the one it inherited.
 *
 * `componentType` is the tag as an author writes it, and is what the diagnostic
 * names; `componentName` is the same thing in prose, for the public
 * description.
 *
 * A component using this must declare a `shortDescriptions` child group and a
 * `decorative` state variable — a chart or image marked decorative is meant to
 * be skipped by a screen reader, so it needs no description and is not reported
 * for lacking one.
 */
export function returnShortDescriptionStateVariableDefinition({
    componentType,
    componentName,
}) {
    return {
        shortDescription: {
            description: `A short accessibility description of the ${componentName}.`,
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                shortDescriptionChild: {
                    dependencyType: "child",
                    childGroups: ["shortDescriptions"],
                    variableNames: ["text"],
                },
                decorative: {
                    dependencyType: "stateVariable",
                    variableName: "decorative",
                },
            }),
            definition({ dependencyValues }) {
                const children = dependencyValues.shortDescriptionChild;
                const shortDescription =
                    children.length > 0
                        ? children[children.length - 1].stateValues.text.trim()
                        : "";

                const diagnostics = [];
                if (shortDescription === "" && !dependencyValues.decorative) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "accessibility",
                            level: 1,
                            code: "doenet-a0001",
                            args: { component: componentType },
                        }),
                    );
                }

                return {
                    setValue: { shortDescription },
                    sendDiagnostics: diagnostics,
                };
            },
        },
    };
}
