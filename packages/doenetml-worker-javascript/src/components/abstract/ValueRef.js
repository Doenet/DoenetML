import BaseComponent from "./BaseComponent";

/**
 * A value reference: the component a bare `$n` becomes when it stands where
 * only a value is read, such as inside `<math>$n+1</math>` or in the content
 * of an attribute (`displayDigits="$n"`).
 *
 * It shadows one state variable of its referent (`shadows.propVariable`) and
 * takes the place, in its parent's child groups, of a component of
 * `presentedComponentType`: `number` for `$n` in a `<number>`, `math` for the
 * same `$n` in a `<math>`, where it reads `n.math` instead of `n.value`.
 * `Copy.js` decides both when it creates the reference
 * (`planValueReference` in `utils/valueReference.ts`), and `ChildMatcher`
 * matches it by the presented type.
 *
 * It defines almost no state of its own. Whatever its parent asks of it that
 * it does not define (`displayDigits`, `text`, `latex`, …) is made on demand
 * from the presented type's definitions, redirected to the referent for the
 * settings that travel with the referenced variable
 * (`createOnDemandStateVariableDefinitions`), so a reference costs the
 * variables that are actually read and nothing else. It has no attributes
 * and no `fixed` of its own: a write through it lands on the referent, whose
 * own `fixed` refuses it there. It has no renderer either; `Copy.js` does not
 * create one in a position whose parent renders its children.
 *
 * Part of Doenet/DoenetML#2128.
 */
export default class ValueRef extends BaseComponent {
    static componentType = "_ref";
    static rendererType = undefined;
    static excludeFromSchema = true;
    static primaryStateVariableForDefinition = "value";

    constructor(args) {
        super(args);

        // When the referent's variable has no value (a `<choiceInput>`'s
        // `selectedValue` once the selected choice is gone), a component of
        // the presented type would hold its own default: `＿` for a math,
        // `NaN` for a number. The shadow definition asks the type that holds
        // values of this variable's kind for that empty value
        // (`_emptyPrimaryValue` in `StateVariableDefinitionFactory`), and
        // for a reference that type is the presented one.
        this.state.value.shadowingInstructions = {
            createComponentOfType: this.presentedComponentType,
        };
    }

    static createAttributesObject() {
        return {};
    }

    static returnChildGroups() {
        return [];
    }

    /**
     * The component type this reference stands in for when its parent matches
     * children to child groups, and that its parent's definitions see as its
     * `componentType`.
     */
    get presentedComponentType() {
        return this.doenetAttributes.presentedComponentType;
    }

    /**
     * Whether this reference stands in for an adapter of its referent: it
     * presents as a type the referent adapts to and reads the adapter's
     * variable (`n.math` for `$n` in a `<math>`), so for anything that asks
     * about an adapter's source, the referent is that source.
     */
    get presentsAsAdapter() {
        return (
            this.doenetAttributes.refVariable !==
            this.doenetAttributes.referencedVariable
        );
    }

    /**
     * The component whose variable this reference ultimately reads, and the
     * variable the author referenced on it. Usually the component `shadows`
     * names. When the component holding the reference is extended, the
     * copy's reference is made as a whole shadow of the original reference
     * rather than of the referent, so the chain is followed through any
     * references to the component at its end. Also what the adapter-source
     * dependencies take as the source of a reference that presents as an
     * adapter's type.
     */
    ultimateReferent(components) {
        let referent = this.shadows && components[this.shadows.componentIdx];
        let referencedVariable = this.doenetAttributes.referencedVariable;
        while (referent?.componentType === "_ref") {
            referencedVariable = referent.doenetAttributes.referencedVariable;
            referent =
                referent.shadows && components[referent.shadows.componentIdx];
        }
        return { referent, referencedVariable };
    }

    static returnStateVariableDefinitions() {
        const baseDefinitions = super.returnStateVariableDefinitions();
        const stateVariableDefinitions = {};

        // Redefined when the component is built: its `referenceShadow`
        // dependency makes `value` a shadow of the referent's variable, with
        // an inverse that writes there
        // (`createReferenceShadowStateVariableDefinitions`).
        stateVariableDefinitions.value = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { value: null } }),
        };

        // A reference is hidden with its parent or with the copy that made
        // it, never with its referent: `$n` shows the value of a hidden `n`.
        stateVariableDefinitions.hidden = {
            returnDependencies: () => ({
                parentHidden: {
                    dependencyType: "parentStateVariable",
                    variableName: "hidden",
                },
                sourceCompositeHidden: {
                    dependencyType: "sourceCompositeStateVariable",
                    variableName: "hidden",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    hidden: Boolean(
                        dependencyValues.parentHidden ||
                        dependencyValues.sourceCompositeHidden,
                    ),
                },
            }),
            markStale: () => ({ updateParentRenderedChildren: true }),
        };

        // The composite expander sets this directly on every replacement of
        // a copy that withholds some of them, so it must exist here.
        stateVariableDefinitions.isInactiveCompositeReplacement =
            baseDefinitions.isInactiveCompositeReplacement;

        // Three variables a parent reads from every `math` or `number` child
        // before using it. When the reference is to the referent's own value
        // and the referent has the variable, the referent answers; otherwise
        // the reference answers as a component of the presented type holding
        // this value would.

        // Whether a write through this reference can succeed. Inputs have no
        // `canBeModified`; a `math` standing in for one answers from the
        // referent's `fixed` and from `modifyIndirectly`, which an attribute
        // dependency reads off the referent (it is marked `propagateToProps`,
        // so the shadow walk in `AttributeComponentDependency` follows the
        // reference to its referent's attribute).
        stateVariableDefinitions.canBeModified = referentOrFallback({
            stateVariable: "canBeModified",
            fallbackDependencies: (targetIdx) => ({
                targetFixed: {
                    dependencyType: "stateVariable",
                    componentIdx: targetIdx,
                    variableName: "fixed",
                    variablesOptional: true,
                },
                modifyIndirectly: {
                    dependencyType: "stateVariable",
                    variableName: "modifyIndirectly",
                    variablesOptional: true,
                },
            }),
            fallback: (dependencyValues) =>
                !dependencyValues.targetFixed &&
                dependencyValues.modifyIndirectly !== false,
        });

        // A `math` with no `unordered` attribute and no math children is
        // ordered.
        stateVariableDefinitions.unordered = referentOrFallback({
            stateVariable: "unordered",
            fallback: () => false,
        });

        // `Math.js`: whether the value is a finite number.
        stateVariableDefinitions.isNumber = referentOrFallback({
            stateVariable: "isNumber",
            fallbackDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            fallback: ({ value }) =>
                Number.isFinite(
                    typeof value === "number" ? value : value?.tree,
                ),
        });

        return stateVariableDefinitions;
    }

    /**
     * A value reference has no children, so a child dependency of a
     * definition it borrows from its presented type finds none, whatever the
     * group.
     */
    returnMatchedChildIndices() {
        return [];
    }

    /**
     * The definitions to give this reference for a state variable it was not
     * built with, asked for by a dependency of its parent. Returned as
     * `[name, definition]` pairs: usually the one variable, sometimes more
     * (the array an entry name belongs to, or a whole group of variables one
     * definition computes together); empty when nothing fits.
     *
     * The definition is the presented type's own
     * (`classDefinitions(presentedClass)`), so the reference derives `text`,
     * `latex`, `isNumber`, a `matrixEntry`, … from its value exactly as a
     * component of that type would, with no attributes and no children. When
     * the shadowing instructions of the referenced variable name a companion
     * for it on the referent (`_referentVariableFor`), the definition is
     * redirected to the referent instead, the way `modifyStateDefsToBeShadows`
     * plans a shadow; the `displayDigits` of `$n` are then `n`'s, mirroring its
     * `usedDefault`, so a parent falling through to a sole child's display
     * settings sees what it would see on the referent. A variable only the
     * referent has becomes a plain shadow of it.
     */
    createOnDemandStateVariableDefinitions({
        stateVariable,
        components,
        classDefinitions,
    }) {
        const { referent: target, referencedVariable } =
            this.ultimateReferent(components);
        if (!target) {
            return [];
        }

        const presentedClass =
            this.componentInfoObjects.allComponentClasses[
                this.presentedComponentType
            ];
        const presentedDefinitions = presentedClass
            ? classDefinitions(presentedClass)
            : {};

        // The name of an array entry (`matrixEntry1_1`) asks for its array.
        let name = stateVariable;
        if (!presentedDefinitions[name] && presentedClass) {
            const arrayEntryPrefixes =
                this.componentInfoObjects.stateVariableInfo[
                    this.presentedComponentType
                ].arrayEntryPrefixes;
            const prefix = Object.keys(arrayEntryPrefixes)
                .filter((p) => name.startsWith(p))
                .sort((a, b) => b.length - a.length)[0];
            if (prefix !== undefined) {
                name = arrayEntryPrefixes[prefix].arrayVariableName;
                if (name in this.state) {
                    return [];
                }
            }
        }

        const classDef = presentedDefinitions[name];
        if (classDef?.isAlias) {
            // an alias is substituted by the dependency before it gets here;
            // one that was not is left missing rather than built from a
            // definition that has no dependencies of its own
            return [];
        }
        const targetVariable = this._referentVariableFor(
            name,
            target,
            referencedVariable,
        );
        const targetObj =
            targetVariable === undefined
                ? undefined
                : target.state[targetVariable];
        const referentHasIt =
            targetObj !== undefined &&
            !targetObj.isArrayEntry &&
            // an array is redirected only to the referent's array of the
            // same name: the shadow reads each entry by the entry's own name
            Boolean(targetObj.isArray) === Boolean(classDef?.isArray) &&
            (!targetObj.isArray || targetVariable === name);

        if (classDef) {
            const group = [
                name,
                ...(classDef.additionalStateVariablesDefined ?? []),
            ];
            const definitions = group.map((varName) => [
                varName,
                Object.create(presentedDefinitions[varName]),
            ]);
            if (referentHasIt && group.length === 1) {
                const definition = definitions[0][1];
                definition.isShadow = true;
                definition.svShadowParams = {
                    targetComponentIdx: target.componentIdx,
                    overrideVarName:
                        targetVariable === name ? undefined : targetVariable,
                    keepOriginalDependencies: false,
                };
            }
            return definitions;
        }

        if (referentHasIt && !targetObj.isArray) {
            const definition = {
                isShadow: true,
                returnDependencies: () => ({}),
                definition: () => ({ setValue: { [name]: null } }),
                svShadowParams: {
                    targetComponentIdx: target.componentIdx,
                    overrideVarName:
                        targetVariable === name ? undefined : targetVariable,
                    keepOriginalDependencies: false,
                },
            };
            if (targetObj.defaultValue !== undefined) {
                definition.defaultValue = targetObj.defaultValue;
                definition.hasEssential = true;
            }
            return [[name, definition]];
        }

        return [];
    }

    /**
     * The referent's variable that stands for `stateVariable` here, or
     * `undefined` when none does and the presented type's own definition is
     * to be used.
     *
     * Only the companions that the shadowing instructions of the referenced
     * variable name travel with it (`fixed` and the display settings with a
     * number's `value`, the display settings with a point's `xs`, through
     * `addAttributeComponentsShadowingStateVariables` or
     * `addStateVariablesShadowingStateVariables`). Everything else a parent
     * reads, `text`, `latex`, `isNumber`, …, describes a value, and is
     * derived here from this reference's own `value` by the presented type's
     * definition. The referent's variable of the same name would describe
     * the referent's own value, which is this reference's value only for a
     * reference to its implicit prop, and even then it would not take a
     * write: a `<textInput>` bound to `$ti` writes the `text` of the `text`
     * it stands in for, which inverts to `value` and so to `ti.value`,
     * whereas `ti.text` inverts to nothing.
     */
    _referentVariableFor(stateVariable, target, referencedVariable) {
        const propObj = target.state[referencedVariable];
        const instructions = (
            propObj?.isArrayEntry
                ? target.state[propObj.arrayStateVariable]
                : propObj
        )?.shadowingInstructions;
        return (
            instructions?.addStateVariablesShadowingStateVariables?.[
                stateVariable
            ]?.stateVariableToShadow ??
            instructions?.addAttributeComponentsShadowingStateVariables?.[
                stateVariable
            ]?.stateVariableToShadow
        );
    }
}

/**
 * A state variable definition that answers with the referent's variable of
 * the same name when the reference is to the referent's own value
 * (`referencedPrimaryValue`) and the referent has the variable, and with
 * `fallback` otherwise. `fallbackDependencies(targetIdx)` are the
 * dependencies the fallback reads; `fallback(dependencyValues)` computes it.
 * Both are read through `this.svComponent`, the component the state variable
 * belongs to, since the referent is only known once the component is built.
 */
function referentOrFallback({
    stateVariable,
    fallbackDependencies = () => ({}),
    fallback,
}) {
    return {
        returnDependencies() {
            const component = this.svComponent;
            const targetIdx = component?.shadows?.componentIdx;
            const dependencies = fallbackDependencies(targetIdx);
            if (
                targetIdx !== undefined &&
                component.doenetAttributes.referencedPrimaryValue
            ) {
                dependencies.fromReferent = {
                    dependencyType: "stateVariable",
                    componentIdx: targetIdx,
                    variableName: stateVariable,
                    variablesOptional: true,
                };
            }
            return dependencies;
        },
        definition({ dependencyValues }) {
            const fromReferent = dependencyValues.fromReferent;
            const value =
                fromReferent === null || fromReferent === undefined
                    ? fallback(dependencyValues)
                    : fromReferent;
            return { setValue: { [stateVariable]: Boolean(value) } };
        },
    };
}
