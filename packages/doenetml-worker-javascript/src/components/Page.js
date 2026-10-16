import BlockComponent from "./abstract/BlockComponent";
import {
    DIVISION_SEQUENCE,
    LIST_CONTAINER_TYPES,
    LIST_ITEM_SEQUENCE,
    returnSequencePassThroughDefinitions,
} from "../utils/sequenceNumbering";

/**
 * `<page>` marks the content of one printed page. On screen it is nothing but
 * a block around its children; its one effect is on a printout, where each
 * page starts on a fresh sheet (it exports as PreTeXt's `<page>`).
 *
 * Like a `<cascade>` it is not a section: it has no heading, number, box or
 * score, so a section inside it is leveled, numbered and scored exactly as it
 * would be beside it. In particular it passes `asList` through, so that a
 * `<problems>` whose problems are each written in a `<page>` still numbers
 * them as the items of its list.
 */
export default class Page extends BlockComponent {
    static componentType = "page";

    static componentDocs = {
        summary: "The content of one printed page",
    };
    static rendererType = "containerBlock";
    static renderChildren = true;

    static canDisplayChildErrors = true;

    static includeBlankStringChildren = true;

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        /**
         * Which children to render: all of them, except under `asList` (a page
         * in a `<problems>`), where only the children a list shows are
         * rendered, as for the list itself: the sections, cascades, pages,
         * `<introduction>` and `<conclusion>`.
         */
        stateVariableDefinitions.childIndicesToRender = {
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
                asList: {
                    dependencyType: "stateVariable",
                    variableName: "asList",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                const childIndicesToRender = [];

                for (const [
                    ind,
                    child,
                ] of dependencyValues.allChildren.entries()) {
                    if (
                        !dependencyValues.asList ||
                        (typeof child !== "string" &&
                            (LIST_CONTAINER_TYPES.some((baseComponentType) =>
                                componentInfoObjects.isInheritedComponentType({
                                    inheritedComponentType: child.componentType,
                                    baseComponentType,
                                }),
                            ) ||
                                ["introduction", "conclusion"].includes(
                                    child.componentType,
                                )))
                    ) {
                        childIndicesToRender.push(ind);
                    }
                }

                return { setValue: { childIndicesToRender } };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        // A page is a structural container rather than a numbered item, even
        // when it sits inside a list-producing parent such as <problems>.
        stateVariableDefinitions.isListItem = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { isListItem: false } }),
        };

        // A page has no `asList` of its own: it passes its parent's through,
        // so that the sections inside a page in a `<problems>` are items of
        // that list.
        stateVariableDefinitions.asList = {
            description:
                "Whether this page's children are rendered as a list, which is whatever its parent does.",
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                parentAsList: {
                    dependencyType: "parentStateVariable",
                    variableName: "asList",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        asList: Boolean(dependencyValues.parentAsList),
                    },
                };
            },
        };

        // A page is transparent to numbering: the divisions and list items
        // inside it continue the sequences around it rather than starting
        // their own. See `utils/sequenceNumbering.js`.
        Object.assign(
            stateVariableDefinitions,
            returnSequencePassThroughDefinitions(DIVISION_SEQUENCE),
            returnSequencePassThroughDefinitions(LIST_ITEM_SEQUENCE),
        );

        return stateVariableDefinitions;
    }
}
