import {
    RegisteredNumberEntries,
    reorderedValueListClass,
} from "./abstract/ReorderedValueList";
import Shuffle from "./Shuffle";

/**
 * The list form of `<shuffle>` (`reorderedValueListClass`): the values of
 * its children in the order `<shuffle>` gives its children, which is part of
 * the variant (`componentOrder`), drawn as `<shuffle>` draws it.
 */
function shuffleListClass(Base) {
    return class ShuffleList extends reorderedValueListClass(Base) {
        static componentType = "_shuffleList";

        static createsVariants = true;

        static createAttributesObject() {
            let attributes = super.createAttributesObject();
            attributes.type = Shuffle.createAttributesObject().type;
            return attributes;
        }

        static reorderedListClassFor(ListBase) {
            return shuffleListClass(ListBase);
        }

        static returnEntryOrderDefinitions() {
            const shuffleDefinitions = Shuffle.returnStateVariableDefinitions();
            const componentOrder = shuffleDefinitions.componentOrder;

            return {
                // The number of values shuffled, which the order is drawn
                // for.
                numValuesShuffled: {
                    returnDependencies: () => ({
                        childOrderEntryStructure: {
                            dependencyType: "stateVariable",
                            variableName: "childOrderEntryStructure",
                        },
                    }),
                    definition: ({ dependencyValues }) => ({
                        setValue: {
                            numValuesShuffled:
                                dependencyValues.childOrderEntryStructure
                                    .length,
                        },
                    }),
                },
                componentOrder: {
                    ...componentOrder,
                    returnDependencies(args) {
                        return {
                            ...componentOrder.returnDependencies(args),
                            numComponents: {
                                dependencyType: "stateVariable",
                                variableName: "numValuesShuffled",
                            },
                        };
                    },
                },
                generatedVariantInfo: shuffleDefinitions.generatedVariantInfo,
                entryOrder: {
                    returnDependencies: () => ({
                        componentOrder: {
                            dependencyType: "stateVariable",
                            variableName: "componentOrder",
                        },
                    }),
                    definition: ({ dependencyValues }) => ({
                        setValue: {
                            entryOrder: dependencyValues.componentOrder.map(
                                (ind) => ind - 1,
                            ),
                        },
                        checkForActualChange: { entryOrder: true },
                    }),
                },
            };
        }

        static setUpVariant(args) {
            return Shuffle.setUpVariant(args);
        }

        static getUniqueVariant(args) {
            return Shuffle.getUniqueVariant(args);
        }

        static determineNumberOfUniqueVariants(args) {
            return Shuffle.determineNumberOfUniqueVariants.call(this, args);
        }

        // Each piece of text is a value shuffled.
        static numberOfShuffledChildren({
            serializedComponent,
            componentInfoObjects,
        }) {
            let numPieces = 0;
            const components = [];
            for (const child of serializedComponent.children) {
                if (typeof child === "string") {
                    numPieces += this.splitTextIntoPieces(child)?.length ?? 0;
                } else {
                    components.push(child);
                }
            }
            const numComponents = Shuffle.numberOfShuffledChildren({
                serializedComponent: {
                    ...serializedComponent,
                    children: components,
                },
                componentInfoObjects,
            });
            return numComponents === undefined
                ? undefined
                : numComponents + numPieces;
        }
    };
}

export default class ShuffleList extends shuffleListClass(
    RegisteredNumberEntries,
) {}
