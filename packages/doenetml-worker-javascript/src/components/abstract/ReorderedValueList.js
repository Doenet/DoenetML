import AuthoredValueList, { blankValue } from "./AuthoredValueList";
import { entryKind, entryValueOfType } from "./ValueListComponent";
import NumberList from "../NumberList";
import MathList from "../MathList";
import TextList from "../TextList";
import BooleanList from "../BooleanList";

/**
 * The lists, by the type of their entries, that the list forms of `<sort>`
 * and `<shuffle>` are built on: their children are read as these lists read
 * theirs.
 */
export const REORDERED_LIST_BASES = {
    number: NumberList,
    math: MathList,
    text: TextList,
    boolean: BooleanList,
};

/**
 * The list form of `<sort>` or `<shuffle>` (Doenet/DoenetML#2161): one list
 * component holding the values of its children in another order, which a
 * parent reads, and the viewer draws, as one child per value. The document
 * pass `utils/dast/listForms.ts` makes a `<sort>` or `<shuffle>` this
 * instead of a composite when its children are values of one type known
 * from the document, and records that type in its `type` attribute.
 *
 * The children are read as the list of that type (`REORDERED_LIST_BASES`)
 * reads them: text as values the list parses, an authored child as its value,
 * a reference as a value reference, a list as its entries. Where each entry
 * comes from, in the order of the children (`childOrderEntryStructure`), is
 * put in the order `entryOrder` gives (`entryStructure`), so the value, the
 * display settings and a write of each entry go to the child it comes from,
 * as they went to the copy of that child the composite made. Each entry is
 * shown as its source shows itself (`listEntriesShownAsSources`).
 *
 * A subclass gives `entryOrder`, from the values in the order of the
 * children (`childOrderValues`). The class for each type of entries is made
 * once (`classForSerializedComponent`) and keeps the `componentType` of the
 * one registered, which is built on a list of numbers.
 */
export function reorderedValueListClass(Base) {
    return class ReorderedValueList extends Base {
        static excludeFromSchema = true;

        static listEntriesShownAsSources = true;

        // A `copy=` of the list is made from the same children and
        // attributes, so it reads the same sources.
        static serializeUnlinkedAsValues = false;

        // The type of the entries, which the document pass records.
        static listEntryTypeAttribute = "type";

        static listEntryTypeFromAttribute(attribute) {
            const type =
                attribute?.type === "primitive"
                    ? attribute.primitive.value
                    : undefined;
            return type in REORDERED_LIST_BASES ? type : undefined;
        }

        static classForSerializedComponent(serializedComponent) {
            const entryType = this.listEntryTypeFromAttribute(
                serializedComponent.attributes?.type,
            );
            return this.classForEntryType(entryType ?? "number");
        }

        static classForEntryType(entryType) {
            const registered = this.reorderedListRegisteredClass ?? this;
            if (!Object.hasOwn(registered, "reorderedListClasses")) {
                registered.reorderedListClasses = {};
            }
            const classes = registered.reorderedListClasses;
            if (!classes[entryType]) {
                classes[entryType] = registered.reorderedListClassFor(
                    REORDERED_LIST_BASES[entryType],
                );
                classes[entryType].reorderedListRegisteredClass = registered;
            }
            return classes[entryType];
        }

        /**
         * This list form for entries of the type of `ListBase`, one of
         * `REORDERED_LIST_BASES`. Set by the registered class.
         */
        static reorderedListClassFor(ListBase) {
            throw Error(
                `${this.componentType} must define reorderedListClassFor`,
            );
        }

        // A math whose value is a list (`1, 2, 3`) is one value, as it was
        // one child the composite reordered.
        static mergesMathChild() {
            return false;
        }

        static returnStateVariableDefinitions() {
            let stateVariableDefinitions =
                super.returnStateVariableDefinitions();

            const listClass = this;
            const entryType = this.listEntryComponentType;
            const componentGroups = this.listChildGroups.map((x) => x.group);

            // Where each entry comes from, in the order of the children.
            stateVariableDefinitions.childOrderEntryStructure =
                renamedDefinition(
                    stateVariableDefinitions.entryStructure,
                    "entryStructure",
                    "childOrderEntryStructure",
                );

            // The value of each entry, in the order of the children, from
            // which the order is computed.
            stateVariableDefinitions.childOrderValues = {
                returnDependencies: () => ({
                    entryStructure: {
                        dependencyType: "stateVariable",
                        variableName: "childOrderEntryStructure",
                    },
                    children: {
                        dependencyType: "child",
                        childGroups: componentGroups,
                        variableNames: ["value"],
                        variablesOptional: true,
                    },
                    textPieceEntryValues: {
                        dependencyType: "stateVariable",
                        variableName: "textPieceEntryValues",
                    },
                }),
                definition({ dependencyValues }) {
                    const childOrderValues =
                        dependencyValues.entryStructure.map((source) => {
                            const value =
                                source.pieceInd !== undefined
                                    ? dependencyValues.textPieceEntryValues[
                                          source.pieceInd
                                      ]
                                    : source.componentInd !== undefined
                                      ? dependencyValues.children[
                                            source.componentInd
                                        ]?.stateValues.value
                                      : undefined;
                            return value === undefined
                                ? blankValue(entryKind(entryType))
                                : entryValueOfType(value, entryType);
                        });
                    return { setValue: { childOrderValues } };
                },
            };

            Object.assign(
                stateVariableDefinitions,
                listClass.returnEntryOrderDefinitions(),
            );

            // Where each entry comes from, in the order given.
            stateVariableDefinitions.entryStructure = {
                returnDependencies: () => ({
                    childOrderEntryStructure: {
                        dependencyType: "stateVariable",
                        variableName: "childOrderEntryStructure",
                    },
                    entryOrder: {
                        dependencyType: "stateVariable",
                        variableName: "entryOrder",
                    },
                }),
                definition({ dependencyValues }) {
                    const childOrder =
                        dependencyValues.childOrderEntryStructure;
                    const order = dependencyValues.entryOrder;
                    const entryStructure =
                        order.length !== childOrder.length
                            ? childOrder
                            : order.map((ind) => childOrder[ind]);
                    return {
                        setValue: { entryStructure },
                        checkForActualChange: { entryStructure: true },
                    };
                },
            };

            return stateVariableDefinitions;
        }

        /**
         * The definition of `entryOrder`: the position, in the order of the
         * children, of the entry at each position of the list
         * (`childOrderValues` are the values in the order of the children),
         * and of anything it needs.
         */
        static returnEntryOrderDefinitions() {
            throw Error(
                `${this.componentType} must define returnEntryOrderDefinitions`,
            );
        }
    };
}

/**
 * `definition`, a state variable definition setting `from`, made to set `to`
 * instead.
 */
function renamedDefinition(definition, from, to) {
    return {
        ...definition,
        definition(args) {
            const result = definition.definition(args);
            const { [from]: value, ...otherValues } = result.setValue;
            return {
                ...result,
                setValue: { ...otherValues, [to]: value },
            };
        },
    };
}

/**
 * The registered class of a list form of `<sort>` or `<shuffle>`, built on
 * a list of numbers, which the document's attributes and the schema checks
 * see, and which makes the class for the type its `type` attribute gives
 * (`reorderedValueListClass`). It extends no authored list type, so that a
 * `<collect componentType="numberList">`, or a parent whose child group
 * names a list type, does not take it for one.
 */
export class RegisteredNumberEntries extends AuthoredValueList {
    static listEntryComponentType = "number";
    static listChildGroups = NumberList.listChildGroups;
    static parseTextPiece(text, settings) {
        return NumberList.parseTextPiece(text, settings);
    }
}
