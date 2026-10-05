import BaseComponent from "./BaseComponent";
import me from "math-expressions";
import {
    convertValueToMathExpression,
    normalizeMathExpression,
    returnSelectedStyleStateVariableDefinition,
    returnTextStyleDescriptionDefinitions,
} from "@doenet/utils";
import {
    buildNumberDisplayParameters,
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../../utils/numberDisplay";
import {
    numberToMathExpression,
    plainComplex,
    roundForDisplay,
    superSubscriptsToUnicode,
    textToMathFactory,
} from "../../utils/math";
import { returnMathVectorMatrixStateVariableDefinitions } from "../../utils/mathVectorMatrixStateVariables";
import { booleanFromWord, booleanWord } from "../../utils/booleanWords";
import {
    contentTranslator,
    returnContentLocaleDependencies,
} from "../../utils/contentLocale";

/**
 * Base class for a list component: one component that holds a list of values,
 * which a parent sees, and the viewer draws, as one child per value, of
 * type `listEntryComponentType` (see `BaseComponent`). Part of
 * Doenet/DoenetML#2157.
 *
 * A composite that makes one component per value costs those components and
 * everything a parent reads from each of them. Here the values stay in one
 * array, and a parent's child dependency reads the whole array once and hands
 * the parent's definitions one record per entry (`childDependencies.ts`), so
 * `<sum>$l</sum>`, `<math>$l</math>` and `<numberList>$l</numberList>` read
 * the entries as they read a composite's replacements.
 *
 * A subclass names, in `listEntryValuesVariable`, the state variable that
 * computes the values as a plain array; this class keeps them in the array
 * `maths`, `numbers` or `texts` (`ENTRY_TYPES`), which `$l[2]` indexes, and
 * computes from them what a parent reads of an entry: its text, its latex,
 * and its value as another type. An entry reads its display settings,
 * `hidden` and `fixed` from the list.
 *
 * The entries are `fixed` unless the list's `fixed` is set to false, by its
 * own attribute or by an ancestor's, as the components a composite created
 * were. A value written to an entry that is not fixed, of a list that takes
 * writes (`listEntriesTakeWrites`), is kept, entry by entry, over the value
 * the list computes (`entryWrites`) while the list computes the value it was
 * written over there.
 *
 * A subclass whose entries' type a primitive attribute decides
 * (`listEntryTypeAttribute`, `<sequence type="letters">`) is created as a
 * subclass for that type (`classForSerializedComponent`).
 */
export default class ValueListComponent extends BaseComponent {
    static componentType = "_valueList";
    // The list is drawn as its entries, each by the renderer of its type
    // (`RendererInstructionBuilder`), so it has no renderer of its own; this
    // is the type its entries need.
    static get rendererType() {
        return ENTRY_TYPES[this.listEntryComponentType]?.rendererType;
    }

    // `$l[2]` picks an entry.
    static takesIndex = true;

    // A reference to the whole list shadows its values and their number
    // (`maths` or `numbers`, `numEntries`), so it needs none of the
    // children they were computed from.
    static serializeChildrenOnlyIfUnlinked = true;

    // A type of `ENTRY_TYPES`; set by a subclass.
    static listEntryComponentType = undefined;

    // The state variable of the subclass that computes the values, as an
    // array (or `null`, for no values).
    static listEntryValuesVariable = undefined;

    // Whether an entry that is not fixed takes a value written to it, as the
    // components a composite created did (`<sequence fixed="false">`). The
    // results of an operator are computed, and take none.
    static listEntriesTakeWrites = false;

    // Whether the entries are fixed unless the list's `fixed` is set to
    // false. The entries of a list an author writes out (`<numberList>`) are
    // not fixed unless the list is.
    static listEntriesFixedByDefault = true;

    // A state variable of the subclass holding, for each entry, the display
    // settings it is shown with (`displayDigits`, …), or `null` for the
    // list's own. An entry that is an authored child of the list shows the
    // settings the child sets.
    static listEntryDisplaySettingsVariable = undefined;

    // An array of the list holding the value of an entry property for each
    // entry, by the property (`displayDigits` of each entry), which a
    // reference to that property of an entry reads (`$l[2].displayDigits`)
    // and which travels with the entry's other properties.
    static get listEntryOwnArrays() {
        return {};
    }

    // A state variable of the subclass whose value is what a written value
    // stands over (`entryWrites`) in place of the value the list computed
    // for the entry, when the subclass recomputes every value whenever it
    // changes (a `<sequence>`'s `from` and `step`).
    static listEntryWriteBasisVariable = undefined;

    // The primitive attribute that decides the entries' type, when one does
    // (`listEntryTypeFromAttribute`).
    static listEntryTypeAttribute = undefined;

    static get listValuesArrayName() {
        return ENTRY_TYPES[this.listEntryComponentType].arrayName;
    }

    /**
     * The type of the entries that the value of the attribute
     * `listEntryTypeAttribute` gives (`undefined` for its default, or when
     * it is not a primitive). Set by a subclass that has the attribute.
     */
    static listEntryTypeFromAttribute(attribute) {
        return undefined;
    }

    static classForSerializedComponent(serializedComponent) {
        if (this.listEntryTypeAttribute === undefined) {
            return this;
        }
        const entryType = this.listEntryTypeFromAttribute(
            serializedComponent.attributes?.[this.listEntryTypeAttribute],
        );
        return entryType === undefined
            ? this
            : this.classForEntryType(entryType);
    }

    /**
     * The class of this list whose entries are of `entryType`: this one, or
     * a subclass made for that type once and kept. It keeps this class's
     * `componentType`, so the document, references and the schema see one
     * component type, and differs only in what its entries are.
     */
    static classForEntryType(entryType) {
        if (entryType === this.listEntryComponentType) {
            return this;
        }
        const base = this.listEntryTypeBaseClass ?? this;
        if (entryType === base.listEntryComponentType) {
            return base;
        }
        if (!Object.hasOwn(base, "listEntryTypeClasses")) {
            base.listEntryTypeClasses = {};
        }
        if (!base.listEntryTypeClasses[entryType]) {
            base.listEntryTypeClasses[entryType] = class extends base {
                static listEntryComponentType = entryType;
                static listEntryTypeBaseClass = base;
            };
        }
        return base.listEntryTypeClasses[entryType];
    }

    static listEntryCountVariable = "numEntries";

    static get variableForIndexAsProp() {
        return this.listValuesArrayName;
    }

    // Built once for each list class.
    static get listEntryStateVariables() {
        if (!Object.hasOwn(this, "builtListEntryStateVariables")) {
            this.builtListEntryStateVariables = Object.freeze(
                this.buildListEntryStateVariables(),
            );
        }
        return this.builtListEntryStateVariables;
    }

    static buildListEntryStateVariables() {
        const kind = entryKind(this.listEntryComponentType);
        const typeVariables =
            kind === "text"
                ? {
                      text: "entryTexts",
                      math: "entryTextMaths",
                      number: "entryTextNumbers",
                  }
                : kind === "boolean"
                  ? { text: "entryTexts" }
                  : {
                        [kind === "math" ? "number" : "math"]:
                            "entryOtherTypeValues",
                        text: "entryTexts",
                        latex: "entryLatexes",
                        isNumber: "entryIsNumbers",
                        valueForDisplay: "entryValuesForDisplay",
                    };
        const variables = {
            value: this.listValuesArrayName,
            ...typeVariables,
            hidden: "hidden",
            fixed: "entriesFixed",
            canBeModified: "entriesCanBeModified",
            unordered: "entriesUnordered",
            inUnorderedList: "entriesInUnorderedList",
            entryOfReference: "entriesOfReference",
            disabled: "disabled",
            fixLocation: "fixLocation",
            selectedStyle: "selectedStyle",
            styleNumber: "styleNumber",
            doenetML: "doenetML",
        };
        for (const name in returnTextStyleDescriptionDefinitions()) {
            variables[name] = name;
        }
        for (const name in ENTRY_RENDERER_DEFAULTS) {
            variables[name] = name;
        }
        if (hasNumberDisplay(kind)) {
            for (const name in returnNumberDisplayAttributes()) {
                variables[name] = name;
            }
            // The display settings an entry is shown with when they are its
            // own (`listEntryDisplaySettingsVariable`), which a list holding
            // this one reads.
            if (this.listEntryDisplaySettingsVariable !== undefined) {
                variables.displaySettings =
                    this.listEntryDisplaySettingsVariable;
            }
        }
        return variables;
    }

    // A reference to the whole list reads these of the list itself
    // (`$l.styleNumber` is the style of the list as a whole).
    static listOwnProperties = [
        "styleNumber",
        "hide",
        "modifyIndirectly",
        "isResponse",
        "permid",
        "doenetML",
    ];

    // The properties of a `<math>` entry that a `<math>` computes from its
    // value (`$l[2].numDimensions`, `$l[2].x`), computed from the entry's
    // value in the same way, and the `math` of a `<number>` entry, computed
    // from the entry's value alone, so that a reference to it (`$l[$i]` in a
    // `<math>`) follows that entry and no other.
    static get listEntryDerivedProperties() {
        const kind = entryKind(this.listEntryComponentType);
        if (kind === "math") {
            return MATH_ENTRY_DERIVED_PROPERTIES;
        }
        return kind === "number" ? NUMBER_ENTRY_DERIVED_PROPERTIES : {};
    }

    // A coordinate of a `<math>` entry (`x2`, `$l[2].x3`) is its component
    // at that index, as for a `<math>`, besides the properties listed.
    static derivedEntryProperty(name) {
        const derived = super.derivedEntryProperty(name);
        if (derived !== undefined) {
            return derived;
        }
        // `x1`, `x2`, … are made here, one for each index asked for.
        const match = /^x([1-9]\d*)$/.exec(name);
        if (match && entryKind(this.listEntryComponentType) === "math") {
            return entryCoordinateProperty(Number(match[1]));
        }
        return undefined;
    }

    static get listPerEntryVariables() {
        const kind = entryKind(this.listEntryComponentType);
        if (kind === "boolean") {
            return [this.listValuesArrayName, "entryTexts"];
        }
        if (kind === "text") {
            return [
                this.listValuesArrayName,
                "entryTexts",
                "entryTextMaths",
                "entryTextNumbers",
            ];
        }
        return [
            this.listValuesArrayName,
            "entryOtherTypeValues",
            "entryTexts",
            "entryLatexes",
            "entryIsNumbers",
            "entryValuesForDisplay",
            ...(this.listEntryDisplaySettingsVariable === undefined
                ? []
                : [this.listEntryDisplaySettingsVariable]),
        ];
    }

    /**
     * The variables of the blank component of `componentType` (a `<math>` or
     * a `<text>`) that a parent that must have a replacement
     * (`descendantCompositesMustHaveAReplacement`) sees in place of a
     * reference to a list with no entries, as a copy of an empty composite
     * gives it one (`utils/copy.js`), by the name of each entry variable.
     */
    static listBlankEntryStateValues(componentType) {
        if (componentType === "text") {
            return { value: "", text: "" };
        }
        const blank = me.fromAst("\uff3f");
        const params = buildNumberDisplayParameters({});
        return {
            value: blank,
            math: blank,
            number: NaN,
            isNumber: false,
            text: mathText(blank, params),
            latex: mathLatex(blank, params),
        };
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(attributes, returnNumberDisplayAttributes());

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
            highlighted: true,
            forRenderer: true,
            description:
                "Whether to render the items separated by commas (true) or with no separator (false).",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        const entryType = this.listEntryComponentType;
        const valuesVariable = this.listEntryValuesVariable;
        const entriesTakeWrites = this.listEntriesTakeWrites;
        const entriesFixedByDefault = this.listEntriesFixedByDefault;
        const displaySettingsVariable = this.listEntryDisplaySettingsVariable;
        const kind = entryKind(entryType);
        const writeBasisVariable = this.listEntryWriteBasisVariable;
        const arrayName = this.listValuesArrayName;
        const entryPrefix = entryType;

        // A reference to the whole list (`$l`), and a `<collect>` that
        // gathers the list by the type of its entries, show the entries,
        // which the list's own `hide` does not hide, as the copies of a
        // composite's replacements were not hidden by the composite's `hide`.
        // So does a copy of such a reference, made by referencing something
        // that holds it (`$p` for `<p name="p">$l</p>`, or `$g` for
        // `<group name="g">$l</group>`). Such a list is hidden only by a
        // `hide` of its own, its parent or its source composite. A copy that
        // is another list of this type (`<cumulativeSum extend="$l">`,
        // `<collect componentType="cumulativeSum">`), or a reference to
        // something holding the list itself (`$g` for
        // `<group name="g"><cumulativeSum hide>…</cumulativeSum></group>`),
        // is hidden with the list.
        const listComponentType = this.componentType;
        stateVariableDefinitions.hideIsOwn = {
            returnDependencies: () => ({
                shadowSource: {
                    dependencyType: "shadowSource",
                },
                shadowSourceHideIsOwn: {
                    dependencyType: "shadowSourceStateVariable",
                    variableName: "hideIsOwn",
                },
                sourceComposite: {
                    dependencyType: "sourceCompositeIdentity",
                },
                sourceCompositeExtends: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "extendIdx",
                },
                sourceCompositeCreatesType: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "createComponentOfType",
                },
                sourceCompositeCollectsType: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "componentTypeToCollect",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                let hideIsOwn = false;
                if (dependencyValues.shadowSource !== null) {
                    const sourceType =
                        dependencyValues.sourceComposite?.componentType;
                    const shadowsShownList = Boolean(
                        dependencyValues.shadowSourceHideIsOwn,
                    );
                    if (sourceType === "_copy") {
                        hideIsOwn =
                            dependencyValues.sourceCompositeCreatesType ==
                                null &&
                            (dependencyValues.sourceCompositeExtends ===
                                dependencyValues.shadowSource.componentIdx ||
                                shadowsShownList);
                    } else if (sourceType === "collect") {
                        const collected =
                            dependencyValues.sourceCompositeCollectsType;
                        hideIsOwn =
                            collected != null &&
                            !componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: listComponentType,
                                baseComponentType: collected,
                            });
                    } else {
                        hideIsOwn = shadowsShownList;
                    }
                }
                return { setValue: { hideIsOwn } };
            },
        };

        const baseHidden = stateVariableDefinitions.hidden;
        stateVariableDefinitions.hidden = {
            ...baseHidden,
            returnDependencies: (args) => ({
                ...baseHidden.returnDependencies(args),
                ownHide: {
                    dependencyType: "attributeComponent",
                    attributeName: "hide",
                    variableNames: ["value"],
                    dontRecurseToShadows: true,
                },
                hideIsOwn: {
                    dependencyType: "stateVariable",
                    variableName: "hideIsOwn",
                },
            }),
            definition(args) {
                const { dependencyValues } = args;
                if (!dependencyValues.hideIsOwn) {
                    return baseHidden.definition(args);
                }
                return baseHidden.definition({
                    ...args,
                    dependencyValues: {
                        ...dependencyValues,
                        hide: Boolean(
                            dependencyValues.ownHide?.stateValues.value,
                        ),
                    },
                });
            },
        };

        Object.assign(
            stateVariableDefinitions,
            returnSelectedStyleStateVariableDefinition(),
        );

        // How the text of every entry is styled, which a reference to an
        // entry reads (`$l[2].textColor`).
        for (const [name, definition] of Object.entries(
            returnTextStyleDescriptionDefinitions(),
        )) {
            stateVariableDefinitions[name] = { ...definition, public: false };
        }

        // The entries were `<math>` and `<number>` components with no
        // children, so they take no display settings from the list's
        // children.
        Object.assign(
            stateVariableDefinitions,
            returnNumberDisplayStateVariableDefinitions(),
        );

        // How many values there are, recounted whenever they change. Going
        // stale queues the list, as a composite is queued to update its
        // replacements (`EssentialValueWriter.updateListEntryCount`).
        stateVariableDefinitions.computedNumEntries = {
            returnDependencies: () => ({
                values: {
                    dependencyType: "stateVariable",
                    variableName: valuesVariable,
                },
            }),
            markStale: () => ({ updateReplacements: true }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        computedNumEntries:
                            dependencyValues.values?.length ?? 0,
                    },
                };
            },
        };

        // The number of entries, which a parent's child dependency and the
        // size of the array of values read. It does not go stale when the
        // values change, only when the queued list finds that their number
        // did (`entryCountChanged`), so that a change of values alone leaves the entries
        // and what depends on them where they are. A reference to the whole
        // list reads the number of the list it references.
        stateVariableDefinitions.numEntries = {
            shadowVariable: true,
            returnDependencies: () => ({
                computedNumEntries: {
                    dependencyType: "stateVariable",
                    variableName: "computedNumEntries",
                },
            }),
            markStale() {
                // A reference's `numEntries` is the shadow of the list's,
                // which goes stale only when it changed. Either way, the
                // parent now renders another number of entries.
                return this.svComponent.entryCountChanged ||
                    this.shadowOfComponentIdx !== undefined
                    ? { updateParentRenderedChildren: true }
                    : { fresh: { numEntries: true } };
            },
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numEntries: dependencyValues.computedNumEntries,
                    },
                };
            },
        };

        // Not a property an author names: `$l[2]` and `$l[2].value` read it
        // (`listEntryPropertyPath`), as does a reference to the whole list.
        stateVariableDefinitions[arrayName] = {
            isArray: true,
            entryPrefixes: [entryPrefix],
            // A reference to the whole list is a shadow that reads the values
            // from the list it references rather than computing them.
            shadowVariable: true,
            // An answer that reads an entry sees it as a value the entry
            // holds, as the components a composite created held theirs:
            // a change elsewhere in the list (its length) leaves the entry
            // as it was (`recursiveDependencyValues`).
            recursiveDependencyBoundary: true,
            // An entry's display settings are the list's, for a reference to
            // one entry as for the entries a parent sees. A copy of an entry
            // (`<math copy="$l[2]"/>`) takes the list's display attributes as
            // written, so one given as a reference (`displayDigits="$dd"`)
            // keeps following it. It is fixed as the entry is.
            shadowingInstructions: {
                createComponentOfType: entryType,
                addAttributeComponentsShadowingStateVariables: {
                    ...(hasNumberDisplay(kind)
                        ? returnNumberDisplayAttributeComponentShadowing()
                        : {}),
                    fixed: { stateVariableToShadow: "entriesFixed" },
                },
                attributesToShadow: hasNumberDisplay(kind)
                    ? Object.keys(returnNumberDisplayAttributes())
                    : [],
            },
            returnArraySizeDependencies: () => ({
                numEntries: {
                    dependencyType: "stateVariable",
                    variableName: "numEntries",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numEntries];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                // A list whose entries take no writes has no `entryWrites`,
                // so its entries depend on its values alone.
                const dependenciesByKey = {};
                for (const arrayKey of entriesTakeWrites ? arrayKeys : []) {
                    dependenciesByKey[arrayKey] = {
                        write: {
                            dependencyType: "stateVariable",
                            variableName: `entryWrite${Number(arrayKey) + 1}`,
                        },
                    };
                }
                return {
                    globalDependencies: {
                        values: {
                            dependencyType: "stateVariable",
                            variableName: valuesVariable,
                        },
                        entriesFixed: {
                            dependencyType: "stateVariable",
                            variableName: "entriesFixed",
                        },
                        ...(writeBasisVariable === undefined
                            ? {}
                            : {
                                  writeBasis: {
                                      dependencyType: "stateVariable",
                                      variableName: writeBasisVariable,
                                  },
                              }),
                    },
                    dependenciesByKey,
                };
            },
            arrayDefinitionByKey({
                globalDependencyValues,
                dependencyValuesByKey,
                arrayKeys,
            }) {
                // The array is sized by `numEntries`, which catches up with
                // the number of values only once a change is done, so it
                // can briefly be longer than the values; an entry past them
                // is blank until then.
                // An entry whose value did not change is reported unchanged,
                // so that what reads that entry alone (`$l[$i]`) is not
                // recomputed when another one changes.
                const values = globalDependencyValues.values ?? [];
                let entries = {};
                let unchangedChecks = {};
                for (let arrayKey of arrayKeys) {
                    const write = restoredEntryWrite(
                        dependencyValuesByKey[arrayKey]?.write,
                        entryType,
                        writeBasisVariable === undefined,
                    );
                    const over =
                        writeBasisVariable === undefined
                            ? values[arrayKey]
                            : globalDependencyValues.writeBasis;
                    entries[arrayKey] =
                        write && sameEntryValue(over, write.over)
                            ? write.value
                            : (values[arrayKey] ?? blankEntryValue(entryType));
                    unchangedChecks[arrayKey] = true;
                }
                return {
                    setValue: { [arrayName]: entries },
                    checkForActualChange: { [arrayName]: unchangedChecks },
                };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyNamesByKey,
            }) {
                if (!entriesTakeWrites || globalDependencyValues.entriesFixed) {
                    return { success: false };
                }
                const values = globalDependencyValues.values ?? [];
                const instructions = [];
                for (const arrayKey in desiredStateVariableValues[arrayName]) {
                    if (
                        Number(arrayKey) >= values.length ||
                        !dependencyNamesByKey[arrayKey]
                    ) {
                        continue;
                    }
                    instructions.push({
                        setDependency: dependencyNamesByKey[arrayKey].write,
                        desiredValue: {
                            value: entryValueOfType(
                                desiredStateVariableValues[arrayName][arrayKey],
                                entryType,
                            ),
                            over:
                                writeBasisVariable === undefined
                                    ? values[arrayKey]
                                    : globalDependencyValues.writeBasis,
                        },
                    });
                }
                return { success: true, instructions };
            },
        };

        // The value written to each entry (`$l[2]`, a dragged entry), with
        // what it was written over: the value the list computed for the
        // entry then, or the subclass's `listEntryWriteBasisVariable`. A
        // written value stands in for the entry while that is unchanged, as
        // a composite left the value of a component it created until it
        // computed a new one: the entries a `<sequence>` keeps when it grows
        // keep what was written to them, and all of them lose it when its
        // `from` changes. Kept entry by entry, so that a write to one entry
        // leaves the others, and what reads them, as they were. A reader's
        // writes are saved and read back on load. Only a list whose entries
        // take writes (`listEntriesTakeWrites`) has it.
        if (entriesTakeWrites) {
            stateVariableDefinitions.entryWrites = {
                isArray: true,
                entryPrefixes: ["entryWrite"],
                // A reference to the whole list reads the list's.
                shadowVariable: true,
                hasEssential: true,
                defaultValueByArrayKey: () => null,
                returnArraySizeDependencies: () => ({
                    numEntries: {
                        dependencyType: "stateVariable",
                        variableName: "numEntries",
                    },
                }),
                returnArraySize({ dependencyValues }) {
                    return [dependencyValues.numEntries];
                },
                returnArrayDependenciesByKey: () => ({}),
                arrayDefinitionByKey({ arrayKeys }) {
                    const useEssential = {};
                    for (const arrayKey of arrayKeys) {
                        useEssential[arrayKey] = true;
                    }
                    return {
                        useEssentialOrDefaultValue: {
                            entryWrites: useEssential,
                        },
                    };
                },
                inverseArrayDefinitionByKey: ({
                    desiredStateVariableValues,
                }) => ({
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "entryWrites",
                            value: desiredStateVariableValues.entryWrites,
                        },
                    ],
                }),
            };
        }

        // The entries are fixed unless the list's `fixed` was set to false,
        // by its own attribute or by an ancestor's, as the components a
        // composite created were. Fixed by default, which an unlinked copy of an entry
        // (`<number copy="$s[1]"/>`) does not take.
        stateVariableDefinitions.entriesFixed = {
            hasEssential: true,
            defaultValue: true,
            returnDependencies: () => ({
                fixed: {
                    dependencyType: "stateVariable",
                    variableName: "fixed",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (usedDefault.fixed && entriesFixedByDefault) {
                    return {
                        useEssentialOrDefaultValue: { entriesFixed: true },
                    };
                }
                return { setValue: { entriesFixed: dependencyValues.fixed } };
            },
        };

        stateVariableDefinitions.entriesCanBeModified = {
            returnDependencies: () => ({
                entriesFixed: {
                    dependencyType: "stateVariable",
                    variableName: "entriesFixed",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entriesCanBeModified:
                        entriesTakeWrites && !dependencyValues.entriesFixed,
                },
            }),
        };

        // Where a write to the coordinates of math entries (`x1`, `x2` of an
        // entry read as a point) is gathered: one write can set several
        // coordinates of an entry, each through an array of its own
        // (`entryCoordinateProperty`), and the entry takes them together.
        if (kind === "math") {
            stateVariableDefinitions.entryCoordinateWrites = {
                returnDependencies: () => ({
                    values: {
                        dependencyType: "stateVariable",
                        variableName: arrayName,
                    },
                }),
                definition: () => ({
                    setValue: { entryCoordinateWrites: null },
                }),
                inverseDefinition({
                    desiredStateVariableValues,
                    dependencyValues,
                    workspace,
                }) {
                    if (!workspace.coordinates) {
                        workspace.coordinates = {};
                    }
                    const desiredValue = {};
                    for (const [entryKey, coordinates] of Object.entries(
                        desiredStateVariableValues.entryCoordinateWrites,
                    )) {
                        workspace.coordinates[entryKey] = {
                            ...workspace.coordinates[entryKey],
                            ...coordinates,
                        };
                        desiredValue[entryKey] = withCoordinates(
                            dependencyValues.values[entryKey],
                            workspace.coordinates[entryKey],
                        );
                    }
                    return {
                        success: true,
                        instructions: [
                            { setDependency: "values", desiredValue },
                        ],
                    };
                },
            };
        }

        stateVariableDefinitions.entriesUnordered = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { entriesUnordered: false } }),
        };

        // Whether the entries are the items of a list whose order does not
        // matter, which a comparison reads (`<boolean>$l = $m</boolean>`).
        stateVariableDefinitions.entriesInUnorderedList = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { entriesInUnorderedList: false },
            }),
        };

        // Whether the entries are those of a reference to a list (`$l`), or
        // of a copy of one (`<mathList copy="$l" />` holds such a copy), so
        // that a list holding it shows them with the display settings it
        // sets (`AuthoredValueList`).
        stateVariableDefinitions.entriesOfReference = {
            returnDependencies: () => ({
                shadowSource: {
                    dependencyType: "shadowSource",
                },
                sourceComposite: {
                    dependencyType: "sourceCompositeIdentity",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    entriesOfReference:
                        dependencyValues.shadowSource !== null ||
                        dependencyValues.sourceComposite?.componentType ===
                            "_copy",
                },
            }),
        };

        if (kind === "boolean") {
            // A boolean entry's text is its value as a word of the
            // document's language, as a `<boolean>` shows it.
            stateVariableDefinitions.entryTexts = {
                forRenderer: true,
                returnDependencies: () => ({
                    values: {
                        dependencyType: "stateVariable",
                        variableName: arrayName,
                    },
                    ...returnContentLocaleDependencies(),
                }),
                definition({ dependencyValues }) {
                    const t = contentTranslator(dependencyValues);
                    return {
                        setValue: {
                            entryTexts: dependencyValues.values.map((value) =>
                                booleanWord(value, t),
                            ),
                        },
                    };
                },
                inverseDefinition({
                    desiredStateVariableValues,
                    dependencyValues,
                }) {
                    const t = contentTranslator(dependencyValues);
                    const desiredValue = {};
                    for (const key in desiredStateVariableValues.entryTexts) {
                        const value = booleanFromWord(
                            desiredStateVariableValues.entryTexts[key],
                            t,
                        );
                        if (value === undefined) {
                            return { success: false };
                        }
                        desiredValue[key] = value;
                    }
                    return {
                        success: true,
                        instructions: [
                            { setDependency: "values", desiredValue },
                        ],
                    };
                },
            };
        } else if (kind === "text") {
            // A text entry's text is its value; its `math` and `number`
            // are the text parsed, as a `<text>` parses it.
            stateVariableDefinitions.entryTexts = {
                forRenderer: true,
                returnDependencies: () => ({
                    values: {
                        dependencyType: "stateVariable",
                        variableName: arrayName,
                    },
                }),
                definition: ({ dependencyValues }) => ({
                    setValue: { entryTexts: [...dependencyValues.values] },
                }),
                inverseDefinition: ({ desiredStateVariableValues }) =>
                    writeEntries(
                        desiredStateVariableValues.entryTexts,
                        (text) => entryValueOfType(text, "text"),
                    ),
            };

            stateVariableDefinitions.entryTextMaths = {
                returnDependencies: () => ({
                    values: {
                        dependencyType: "stateVariable",
                        variableName: arrayName,
                    },
                }),
                definition({ dependencyValues }) {
                    const parser = textToMathFactory();
                    const entryTextMaths = dependencyValues.values.map(
                        (value) => {
                            try {
                                return parser(value);
                            } catch (e) {
                                return me.fromAst("\uff3f");
                            }
                        },
                    );
                    return { setValue: { entryTextMaths } };
                },
                inverseDefinition: ({ desiredStateVariableValues }) =>
                    writeEntries(
                        desiredStateVariableValues.entryTextMaths,
                        (math) => entryValueOfType(math, "text"),
                    ),
            };

            stateVariableDefinitions.entryTextNumbers = {
                returnDependencies: () => ({
                    entryTextMaths: {
                        dependencyType: "stateVariable",
                        variableName: "entryTextMaths",
                    },
                }),
                definition: ({ dependencyValues }) => ({
                    setValue: {
                        entryTextNumbers: dependencyValues.entryTextMaths.map(
                            (math) =>
                                plainComplex(
                                    math.evaluate_to_constant() ?? NaN,
                                ),
                        ),
                    },
                }),
                inverseDefinition: ({ desiredStateVariableValues }) =>
                    writeEntries(
                        desiredStateVariableValues.entryTextNumbers,
                        (number) => entryValueOfType(number, "math"),
                        "entryTextMaths",
                    ),
            };
        } else {
            const displayDependencies = {
                displayDigits: {
                    dependencyType: "stateVariable",
                    variableName: "displayDigits",
                },
                displayDecimals: {
                    dependencyType: "stateVariable",
                    variableName: "displayDecimals",
                },
                displaySmallAsZero: {
                    dependencyType: "stateVariable",
                    variableName: "displaySmallAsZero",
                },
                padZeros: {
                    dependencyType: "stateVariable",
                    variableName: "padZeros",
                },
                avoidScientificNotation: {
                    dependencyType: "stateVariable",
                    variableName: "avoidScientificNotation",
                },
                ...(displaySettingsVariable === undefined
                    ? {}
                    : {
                          entryDisplaySettings: {
                              dependencyType: "stateVariable",
                              variableName: displaySettingsVariable,
                          },
                      }),
            };

            // What `valueForDisplay` is for each entry: the value rounded for
            // display, as `<math>` and `<number>` round it.
            stateVariableDefinitions.entryValuesForDisplay = {
                returnDependencies: () => ({
                    values: {
                        dependencyType: "stateVariable",
                        variableName: arrayName,
                    },
                    ...displayDependencies,
                }),
                definition({ dependencyValues }) {
                    const entryValuesForDisplay = dependencyValues.values.map(
                        (value, ind) => {
                            const settings = entrySettings(
                                dependencyValues,
                                ind,
                            );
                            return kind === "math"
                                ? mathValueForDisplay(value, settings)
                                : numberValueForDisplay(value, settings);
                        },
                    );
                    return { setValue: { entryValuesForDisplay } };
                },
            };

            stateVariableDefinitions.entryTexts = {
                forRenderer: true,
                returnDependencies: () => ({
                    entryValuesForDisplay: {
                        dependencyType: "stateVariable",
                        variableName: "entryValuesForDisplay",
                    },
                    ...displayDependencies,
                }),
                definition({ dependencyValues }) {
                    const entryTexts =
                        dependencyValues.entryValuesForDisplay.map(
                            (value, ind) => {
                                const params = buildNumberDisplayParameters(
                                    entrySettings(dependencyValues, ind),
                                );
                                return kind === "math"
                                    ? mathText(value, params)
                                    : numberToMathExpression(value).toString(
                                          params,
                                      );
                            },
                        );
                    return { setValue: { entryTexts } };
                },
            };

            stateVariableDefinitions.entryLatexes = {
                forRenderer: true,
                returnDependencies: () => ({
                    entryValuesForDisplay: {
                        dependencyType: "stateVariable",
                        variableName: "entryValuesForDisplay",
                    },
                    ...displayDependencies,
                }),
                definition({ dependencyValues }) {
                    const entryLatexes =
                        dependencyValues.entryValuesForDisplay.map(
                            (value, ind) => {
                                const params = buildNumberDisplayParameters(
                                    entrySettings(dependencyValues, ind),
                                );
                                return kind === "math"
                                    ? mathLatex(value, params)
                                    : numberToMathExpression(value).toLatex(
                                          params,
                                      );
                            },
                        );
                    return { setValue: { entryLatexes } };
                },
            };

            // The value of each entry as the other type: an entry `<math>`'s
            // `number`, or an entry `<number>`'s `math`.
            stateVariableDefinitions.entryOtherTypeValues = {
                returnDependencies: () => ({
                    values: {
                        dependencyType: "stateVariable",
                        variableName: arrayName,
                    },
                }),
                definition({ dependencyValues }) {
                    const entryOtherTypeValues = dependencyValues.values.map(
                        (value) =>
                            kind === "math"
                                ? (plainComplex(value.evaluate_to_constant()) ??
                                  NaN)
                                : numberToMathExpression(value),
                    );
                    return { setValue: { entryOtherTypeValues } };
                },
                inverseDefinition: ({ desiredStateVariableValues }) =>
                    writeEntries(
                        desiredStateVariableValues.entryOtherTypeValues,
                        (value) => entryValueOfType(value, entryType),
                    ),
            };

            stateVariableDefinitions.entryIsNumbers = {
                returnDependencies: () => ({
                    values: {
                        dependencyType: "stateVariable",
                        variableName: arrayName,
                    },
                }),
                definition({ dependencyValues }) {
                    const entryIsNumbers = dependencyValues.values.map(
                        (value) =>
                            kind === "math"
                                ? Number.isFinite(value.tree)
                                : Number.isFinite(value),
                    );
                    return { setValue: { entryIsNumbers } };
                },
            };
        }

        // What the renderer of an entry reads beyond its value, at the
        // values a `<math>` or `<number>` has by default.
        for (const [name, value] of Object.entries(ENTRY_RENDERER_DEFAULTS)) {
            stateVariableDefinitions[name] = {
                forRenderer: true,
                returnDependencies: () => ({}),
                definition: () => ({ setValue: { [name]: value() } }),
            };
        }

        return stateVariableDefinitions;
    }
}

/**
 * The types an entry can have, with the array of the list that holds the
 * values of entries of that type and the renderer that draws one.
 */
const ENTRY_TYPES = {
    math: { arrayName: "maths", rendererType: "math", kind: "math" },
    interval: { arrayName: "intervals", rendererType: "math", kind: "math" },
    number: { arrayName: "numbers", rendererType: "number", kind: "number" },
    integer: { arrayName: "numbers", rendererType: "number", kind: "number" },
    text: { arrayName: "texts", rendererType: "text", kind: "text" },
    boolean: {
        arrayName: "booleans",
        rendererType: "boolean",
        kind: "boolean",
    },
};

/**
 * How the values of entries of `entryType` are held and shown: `math` (a
 * math expression, also an interval), `number`, `text` or `boolean`.
 */
export function entryKind(entryType) {
    return ENTRY_TYPES[entryType]?.kind;
}

/** Whether entries of `kind` take the number display settings. */
function hasNumberDisplay(kind) {
    return kind === "math" || kind === "number";
}

/**
 * The display settings entry `ind` is shown with: its own
 * (`listEntryDisplaySettingsVariable`), or the list's.
 */
function entrySettings(dependencyValues, ind) {
    return dependencyValues.entryDisplaySettings?.[ind] ?? dependencyValues;
}

/**
 * The inverse of a variable of a list holding a plain array of one value per
 * entry, given the values desired at some entries (`{ [index]: value }`; a
 * write through an entry, `EssentialValueWriter`): those entries of the
 * array dependency `dependencyName`, as `convert` makes them.
 */
function writeEntries(desired, convert, dependencyName = "values") {
    const desiredValue = {};
    for (const key in desired) {
        desiredValue[key] = convert(desired[key]);
    }
    return {
        success: true,
        instructions: [{ setDependency: dependencyName, desiredValue }],
    };
}

/**
 * Whether two values the list computed for an entry are the same, as a
 * number, a string or a math expression written the same way.
 */
function sameEntryValue(a, b) {
    if (a instanceof me.class || b instanceof me.class) {
        return (
            a instanceof me.class &&
            b instanceof me.class &&
            JSON.stringify(a.tree) === JSON.stringify(b.tree)
        );
    }
    return Object.is(a, b);
}

/**
 * A value written to an entry (`entryWrites`) as the entry holds it. A saved
 * state keeps a math as its tree, so a write read back from one has a tree
 * for a math entry's value and, when it was written over the value the list
 * computed (`overIsValue`), for what it was written over.
 */
function restoredEntryWrite(write, entryType, overIsValue) {
    if (!write || entryKind(entryType) !== "math") {
        return write;
    }
    const restore = (value) =>
        value instanceof me.class ? value : convertValueToMathExpression(value);
    return {
        value: restore(write.value),
        over: overIsValue ? restore(write.over) : write.over,
    };
}

/** The value of an entry of `entryType` past the end of the values. */
function blankEntryValue(entryType) {
    const kind = entryKind(entryType);
    if (kind === "math") {
        return me.fromAst("\uff3f");
    }
    if (kind === "boolean") {
        return false;
    }
    return kind === "text" ? "" : NaN;
}

/**
 * `value`, written to an entry of `entryType`, as a value of that type, as
 * a component of that type takes it: a number from a math, a math from a
 * number, a text from either, and an integer rounded.
 */
export function entryValueOfType(value, entryType) {
    const kind = entryKind(entryType);
    if (kind === "boolean") {
        if (typeof value === "boolean") {
            return value;
        }
        if (typeof value === "string") {
            return value.trim().toLowerCase() === "true";
        }
        return Boolean(value);
    }
    if (kind === "math") {
        if (value instanceof me.class) {
            return value;
        }
        return typeof value === "number"
            ? numberToMathExpression(value)
            : textToMathFactory()(String(value));
    }
    if (kind === "text") {
        return value instanceof me.class ? value.toString() : String(value);
    }
    // A number is kept, and so is a complex number (math.js's `Complex`),
    // which a `<number>` holds as it is.
    let number =
        value instanceof me.class
            ? (plainComplex(value.evaluate_to_constant()) ?? NaN)
            : typeof value === "number" || isComplex(value)
              ? value
              : Number(value);
    if (entryType === "integer" && typeof number === "number") {
        number = Math.round(number);
    }
    return number;
}

/** Whether `value` is a complex number as math.js holds one. */
function isComplex(value) {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof value.re === "number" &&
        typeof value.im === "number"
    );
}

/**
 * The variables the renderer of a `<math>`, `<number>` or `<text>` entry
 * reads besides its `latex` or `text`, `hidden`, `disabled`, `fixed`,
 * `fixLocation` and `selectedStyle`, with the values those components have
 * by default.
 */
const ENTRY_RENDERER_DEFAULTS = {
    anchor: () => me.fromAst(["vector", 0, 0]),
    positionFromAnchor: () => "center",
    draggable: () => true,
    layer: () => 0,
    renderMode: () => "inline",
    renderAsMath: () => false,
    clickTarget: () => false,
};

const mathStructure = returnMathVectorMatrixStateVariableDefinitions();

function entryNumDimensions(value) {
    return mathStructure.numDimensions.definition({
        dependencyValues: { value },
    }).setValue.numDimensions;
}

function entryMatrixSize(value) {
    return mathStructure.matrixSize.definition({ dependencyValues: { value } })
        .setValue.matrixSize;
}

// The entry's components as a vector: the value itself when it has one
// dimension, otherwise a tuple of its components.
function entryVector(value) {
    const numDimensions = entryNumDimensions(value);
    const { vector } = mathStructure.vector.arrayDefinitionByKey({
        globalDependencyValues: { value },
        arraySize: [numDimensions],
    }).setValue;
    if (numDimensions === 1) {
        return vector[0];
    }
    return me.fromAst([
        "tuple",
        ...Array.from({ length: numDimensions }, (_, i) => vector[i].tree),
    ]);
}

// The entry as a matrix (a number is a 1 × 1 matrix).
function entryMatrix(value) {
    const [numRows, numColumns] = entryMatrixSize(value);
    const { matrix } = mathStructure.matrix.arrayDefinitionByKey({
        globalDependencyValues: { value },
        arraySize: [numRows, numColumns],
    }).setValue;
    const rows = Array.from({ length: numRows }, (_, i) => [
        "tuple",
        ...Array.from(
            { length: numColumns },
            (_, j) => matrix[`${i},${j}`]?.tree ?? "\uff3f",
        ),
    ]);
    return me.fromAst([
        "matrix",
        ["tuple", numRows, numColumns],
        ["tuple", ...rows],
    ]);
}

/**
 * The properties of a `<math>` entry computed from one of its values (`from`,
 * an entry property), with the type of the component that holds each, and
 * the property of a `<math>` whose display settings it travels with.
 */
const MATH_ENTRY_DERIVED_PROPERTIES = {
    numDimensions: {
        from: "value",
        componentType: "integer",
        compute: entryNumDimensions,
    },
    matrixSize: {
        from: "value",
        componentType: "numberList",
        compute: entryMatrixSize,
    },
    numRows: {
        from: "value",
        componentType: "integer",
        compute: (value) => entryMatrixSize(value)[0],
    },
    numColumns: {
        from: "value",
        componentType: "integer",
        compute: (value) => entryMatrixSize(value)[1],
    },
    isNumeric: {
        from: "number",
        componentType: "boolean",
        compute: (number) => Number.isFinite(number),
    },
    vector: {
        from: "value",
        componentType: "math",
        companionsOf: "vector",
        compute: entryVector,
    },
    list: {
        from: "value",
        componentType: "math",
        companionsOf: "list",
        compute: entryVector,
    },
    matrix: {
        from: "value",
        componentType: "math",
        companionsOf: "matrix",
        compute: entryMatrix,
    },
};

const coordinatePropertiesByIndex = new Map();

/**
 * `value` with the coordinates `coordinates` (`{ 2: 7 }`, from 1) in place
 * of its own: a tuple with those components, or the coordinate itself for
 * a value of one dimension written its first.
 */
function withCoordinates(value, coordinates) {
    const numDimensions = Math.max(
        entryNumDimensions(value),
        ...Object.keys(coordinates).map(Number),
    );
    const components = mathStructure.vector.arrayDefinitionByKey({
        globalDependencyValues: { value },
        arraySize: [entryNumDimensions(value)],
    }).setValue.vector;
    const trees = Array.from({ length: numDimensions }, (_, i) => {
        const coordinate = coordinates[i + 1] ?? components[i];
        return coordinate === undefined
            ? "\uff3f"
            : convertValueToMathExpression(coordinate).tree;
    });
    return me.fromAst(numDimensions === 1 ? trees[0] : ["tuple", ...trees]);
}

/**
 * Coordinate `n` (from 1) of a `<math>` entry, as `MATH_ENTRY_DERIVED_PROPERTIES`
 * describes a property: the entry's component at that index, blank past its
 * dimensions.
 */
function entryCoordinateProperty(n) {
    if (!coordinatePropertiesByIndex.has(n)) {
        coordinatePropertiesByIndex.set(n, {
            from: "value",
            componentType: "math",
            companionsOf: "vector",
            writeThrough: "entryCoordinateWrites",
            writeThroughValue: (coordinate) => ({ [n]: coordinate }),
            compute(value) {
                const numDimensions = entryNumDimensions(value);
                if (n > numDimensions) {
                    return me.fromAst("\uff3f");
                }
                return mathStructure.vector.arrayDefinitionByKey({
                    globalDependencyValues: { value },
                    arraySize: [numDimensions],
                }).setValue.vector[n - 1];
            },
        });
    }
    return coordinatePropertiesByIndex.get(n);
}

/**
 * The properties of a `<number>` entry computed from its value, as
 * `MATH_ENTRY_DERIVED_PROPERTIES` are for a `<math>`; `invert` turns a value
 * written to the property into one for the entry.
 */
const NUMBER_ENTRY_DERIVED_PROPERTIES = {
    math: {
        from: "value",
        componentType: "math",
        companionsOf: "math",
        compute: (value) => numberToMathExpression(value),
        invert: (math) => entryValueOfType(math, "number"),
    },
};

function mathValueForDisplay(value, displaySettings) {
    return normalizeMathExpression({
        value: roundForDisplay({ value, dependencyValues: displaySettings }),
        simplify: "none",
        expand: false,
    });
}

function numberValueForDisplay(value, displaySettings) {
    return plainComplex(
        roundForDisplay({
            value: numberToMathExpression(value),
            dependencyValues: displaySettings,
        }).evaluate_to_constant(),
    );
}

function mathText(valueForDisplay, params) {
    try {
        return superSubscriptsToUnicode(valueForDisplay.toString(params));
    } catch (e) {
        return "＿";
    }
}

function mathLatex(valueForDisplay, params) {
    try {
        return valueForDisplay.toLatex(params);
    } catch (e) {
        return "＿";
    }
}
