import ValueListComponent from "./abstract/ValueListComponent";
import { sequenceEntryComponentType } from "../utils/sequence";

/**
 * The values of the iterations a `<repeatForSequence>` shows (`forValues`),
 * held once for the whole repeat. Part of
 * Doenet/DoenetML#2128 (the iteration scaffold).
 *
 * The repeat's `valueName` (`$v`) is the entry of this list for the
 * iteration it is read in, a value reference (`_ref`) to `$v[k]`, where an
 * iteration otherwise names its value with a component of its own. The pass
 * that makes value references (`utils/dast/valueReferences.ts`) turns the
 * `_placeholder` the repeat's sugar made for `valueName` into this list when
 * every reference to it is a value reference and no path names it past its
 * first part, as one from outside the iterations does (`$r[2].v`, or `$g.v`
 * for a `<group extend="$r[2]" name="g"/>`); the repeat creates it as a
 * child of its own, and points each iteration's references at its entry
 * (`remapExtendIndices` in `Repeat.js`). Its entries are of the repeat's
 * `type`, which the pass copies to it, and are fixed.
 */
export class RepeatValues extends ValueListComponent {
    static componentType = "_repeatValues";
    static excludeFromSchema = true;

    static listEntryComponentType = "number";

    static listEntryValuesVariable = "repeatValues";

    static listEntryTypeAttribute = "type";

    static listEntryTypeFromAttribute(attribute) {
        return sequenceEntryComponentType(attribute);
    }

    static createAttributesObject() {
        const attributes = super.createAttributesObject();
        attributes.type = {
            createPrimitiveOfType: "string",
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.repeatValues = {
            returnDependencies: () => ({
                forValues: {
                    dependencyType: "parentStateVariable",
                    variableName: "forValues",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    repeatValues: dependencyValues.forValues ?? [],
                },
            }),
        };

        return stateVariableDefinitions;
    }
}

/**
 * The indices of a `<repeat>` or `<repeatForSequence>`, 1 to the number of
 * iterations it shows (`numIterates`), held once for the whole repeat: the
 * repeat's `indexName` (`$i`) is the entry of this list for the iteration it
 * is read in, as `RepeatValues` is for `valueName`. The pass that makes value
 * references turns the `integer` the repeat's sugar made for `indexName` into
 * this list; its entries are integers (`listEntryComponentType`) and fixed.
 *
 * Neither list holds an entry for an iteration the repeat withholds while it
 * has fewer items. Such an iteration reads nothing until it is shown again,
 * as the components it read before did.
 */
export class RepeatIndices extends ValueListComponent {
    static componentType = "_repeatIndices";
    static excludeFromSchema = true;

    static listEntryComponentType = "integer";

    static listEntryValuesVariable = "repeatIndices";

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.repeatIndices = {
            returnDependencies: () => ({
                numIterates: {
                    dependencyType: "parentStateVariable",
                    variableName: "numIterates",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    repeatIndices: [
                        ...Array(dependencyValues.numIterates ?? 0).keys(),
                    ].map((ind) => ind + 1),
                },
            }),
        };

        return stateVariableDefinitions;
    }
}
