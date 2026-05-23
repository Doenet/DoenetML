import {
    SectioningComponent,
    SectioningComponentNumberWithSiblings,
    UnnumberedSectioningComponent,
} from "./abstract/SectioningComponent";

export class Section extends SectioningComponentNumberWithSiblings {
    static componentType = "section";

    static componentDocs = {
        summary:
            "A section of a document, with a title (auto-generated or custom) and content",
    };
    static rendererType = "section";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.includeParentNumber.defaultValue = true;
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        return stateVariableDefinitions;
    }
}

export class Subsection extends Section {
    static componentType = "subsection";

    static componentDocs = {
        summary:
            "A sectional component nested one heading level deeper than `<section>`",
    };
    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.sectionName.definition = () => ({
            setValue: { sectionName: "Section" },
        });

        return stateVariableDefinitions;
    }
}
export class Subsubsection extends Section {
    static componentType = "subsubsection";

    static componentDocs = {
        summary:
            "A sectional component nested one heading level deeper than `<subsection>`",
    };
    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.sectionName.definition = () => ({
            setValue: { sectionName: "Section" },
        });

        return stateVariableDefinitions;
    }
}

export class Paragraphs extends SectioningComponentNumberWithSiblings {
    static componentType = "paragraphs";

    static componentDocs = {
        summary: "A subsection of paragraphs (rendered at heading level 4)",
    };
    static rendererType = "section";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.level.definition = () => ({
            setValue: { level: 4 },
        });

        return stateVariableDefinitions;
    }
}

export class Aside extends SectioningComponentNumberWithSiblings {
    static componentType = "aside";

    static componentDocs = {
        summary: "A note set off from the main flow of the document",
    };
    static rendererType = "section";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.postponeRendering = {
            createPrimitiveOfType: "boolean",
            description:
                "Whether to delay rendering this section's contents until expanded.",
        };

        attributes.collapsible = {
            description: "Whether the section can be collapsed and expanded.",
            createComponentOfType: "boolean",
            createStateVariable: "collapsible",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.startOpen = {
            createComponentOfType: "boolean",
            createStateVariable: "startOpen",
            defaultValue: false,
            description:
                "Whether the collapsible section starts in the open state.",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        delete stateVariableDefinitions.collapsible;

        stateVariableDefinitions.open.returnDependencies = () => ({
            startOpen: {
                dependencyType: "stateVariable",
                variableName: "startOpen",
            },
        });

        stateVariableDefinitions.open.definition = ({ dependencyValues }) => ({
            useEssentialOrDefaultValue: {
                open: {
                    defaultValue: dependencyValues.startOpen,
                },
            },
        });

        stateVariableDefinitions.rendered.returnDependencies = () => ({
            startOpen: {
                dependencyType: "stateVariable",
                variableName: "startOpen",
            },
        });

        stateVariableDefinitions.rendered.definition = ({
            dependencyValues,
        }) => ({
            useEssentialOrDefaultValue: {
                rendered: {
                    defaultValue: dependencyValues.startOpen,
                },
            },
        });

        stateVariableDefinitions.level.definition = () => ({
            setValue: { level: 3 },
        });

        stateVariableDefinitions.containerTag.definition = () => ({
            setValue: { containerTag: "aside" },
        });

        return stateVariableDefinitions;
    }
}

export class Objectives extends SectioningComponentNumberWithSiblings {
    static componentType = "objectives";

    static componentDocs = {
        summary: "A section listing learning objectives",
    };
    static rendererType = "section";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.boxed.defaultValue = true;

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.level.definition = () => ({
            setValue: { level: 3 },
        });

        stateVariableDefinitions.containerTag.definition = () => ({
            setValue: { containerTag: "article" },
        });

        return stateVariableDefinitions;
    }
}

export class Problem extends SectioningComponentNumberWithSiblings {
    static componentType = "problem";

    static componentDocs = {
        summary: "A sectional component that defines a scored problem",
    };
    static rendererType = "section";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.aggregateScores.defaultValue = true;

        attributes.isDistractor = {
            createPrimitiveOfType: "boolean",
            description:
                "Whether this section is a distractor (e.g. a wrong-answer choice for matching).",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.containerTag.definition = () => ({
            setValue: { containerTag: "article" },
        });

        return stateVariableDefinitions;
    }
}

export class Exercise extends Problem {
    static componentType = "exercise";

    static componentDocs = {
        summary: "A sectional component that defines a scored exercise",
    };
}

export class Question extends Problem {
    static componentType = "question";

    static componentDocs = {
        summary:
            "A sectional component that defines a scored question; similar to a `<problem>`",
    };
}

export class Activity extends Problem {
    static componentType = "activity";

    static componentDocs = {
        summary:
            "A sectional component with score aggregation, similar to `<problem>`",
    };
}

export class Example extends SectioningComponentNumberWithSiblings {
    static componentType = "example";

    static componentDocs = {
        summary: "A sectional component that defines an example",
    };
    static rendererType = "section";

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.containerTag.definition = () => ({
            setValue: { containerTag: "article" },
        });

        return stateVariableDefinitions;
    }
}

export class Definition extends Example {
    static componentType = "definition";

    static componentDocs = {
        summary: "A sectional component for defining a term or concept",
    };
}

export class Note extends Example {
    static componentType = "note";

    static componentDocs = {
        summary: "A note section, set off from the main flow of the document",
    };
}

export class Theorem extends Example {
    static componentType = "theorem";

    static componentDocs = {
        summary:
            "A sectional component for the statement of a theorem (or similar formal statement)",
    };
}

export class Part extends SectioningComponentNumberWithSiblings {
    static componentType = "part";
    static rendererType = "section";

    static componentDocs = {
        summary:
            "A subsection-style block rendered as a list item (a part of an exercise or problem)",
    };

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.isListItem.definition = () => ({
            setValue: { isListItem: true },
        });

        stateVariableDefinitions.containerTag.definition = () => ({
            setValue: { containerTag: "div" },
        });

        return stateVariableDefinitions;
    }
}

export class Task extends Part {
    static componentType = "task";

    static componentDocs = {
        summary:
            "A task of a multi-task activity or problem (alias for `<part>`)",
    };
}

export class Proof extends UnnumberedSectioningComponent {
    static componentType = "proof";

    static componentDocs = {
        summary: "A proof section",
    };
    static rendererType = "section";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.postponeRendering = {
            createPrimitiveOfType: "boolean",
            description:
                "Whether to delay rendering this section's contents until expanded.",
        };

        attributes.collapsible = {
            createComponentOfType: "boolean",
            createStateVariable: "collapsible",
            defaultValue: true,
            public: true,
            description: "Whether the section can be collapsed and expanded.",
            forRenderer: true,
        };
        attributes.startOpen = {
            createComponentOfType: "boolean",
            createStateVariable: "startOpen",
            defaultValue: false,
            description:
                "Whether the collapsible section starts in the open state.",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        delete stateVariableDefinitions.collapsible;

        stateVariableDefinitions.open.returnDependencies = () => ({
            startOpen: {
                dependencyType: "stateVariable",
                variableName: "startOpen",
            },
        });

        stateVariableDefinitions.open.definition = ({ dependencyValues }) => ({
            useEssentialOrDefaultValue: {
                open: {
                    defaultValue: dependencyValues.startOpen,
                },
            },
        });

        stateVariableDefinitions.rendered.returnDependencies = () => ({
            startOpen: {
                dependencyType: "stateVariable",
                variableName: "startOpen",
            },
        });

        stateVariableDefinitions.rendered.definition = ({
            dependencyValues,
        }) => ({
            useEssentialOrDefaultValue: {
                rendered: {
                    defaultValue: dependencyValues.startOpen,
                },
            },
        });

        stateVariableDefinitions.level.definition = () => ({
            setValue: { level: 3 },
        });

        stateVariableDefinitions.containerTag.definition = () => ({
            setValue: { containerTag: "article" },
        });

        return stateVariableDefinitions;
    }
}

export class Problems extends SectioningComponent {
    static componentType = "problems";
    static rendererType = "section";

    static componentDocs = {
        summary:
            "A container element grouping `<problem>` components, which are rendered as a list by default",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.asList.defaultValue = true;
        return attributes;
    }
}

export class Exercises extends Problems {
    static componentType = "exercises";

    static componentDocs = {
        summary:
            "A container element grouping `<exercise>` components, which are rendered as a list by default",
    };
}

export class StandinForFutureLayoutTag extends SectioningComponent {
    static componentType = "standinForFutureLayoutTag";
    static rendererType = "section";

    static excludeFromSchema = true;

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.level.definition = () => ({
            setValue: { level: 3 },
        });

        stateVariableDefinitions.containerTag.definition = () => ({
            setValue: { containerTag: "aside" },
        });

        return stateVariableDefinitions;
    }
}

export class externalContent extends SectioningComponent {
    static componentType = "externalContent";
    static rendererType = "section";

    static excludeFromSchema = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.includeAutoNameIfNoTitle.defaultValue = false;
        attributes.includeAutoNumberIfNoTitle.defaultValue = false;
        return attributes;
    }
}
