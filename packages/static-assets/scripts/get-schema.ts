import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
    AliasDescription,
    createComponentInfoObjects,
    SchemaSubarrayDescription,
} from "../../doenetml-worker-javascript/src/utils/componentInfoObjects";
import type { MathDefaultValue, ValidValueEntry } from "../src/schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REFERENCE_DOCS_DIR = path.resolve(
    __dirname,
    "../../docs-nextra/pages/reference",
);

/**
 * Resolved set of doc slugs that have an actual `.mdx` page on disk.
 * Computed lazily so this module can be imported without filesystem access
 * (e.g., in environments where the docs package is absent).
 */
let _existingDocSlugs: Set<string> | null = null;
export function getExistingDocSlugs(): Set<string> {
    if (_existingDocSlugs !== null) return _existingDocSlugs;
    try {
        _existingDocSlugs = new Set(
            fs
                .readdirSync(REFERENCE_DOCS_DIR)
                .filter((f) => f.endsWith(".mdx"))
                .map((f) => f.slice(0, -".mdx".length)),
        );
    } catch {
        _existingDocSlugs = new Set();
    }
    return _existingDocSlugs;
}

/**
 * Encode a `defaultValue` for inclusion in the schema JSON.
 *
 * - JSON has no representation for `Infinity`, `-Infinity`, or `NaN` —
 *   `JSON.stringify` silently rewrites them to `null`, which is
 *   indistinguishable from an explicit `null` default. To preserve the
 *   distinction, encode each non-finite number as a sentinel string. Help
 *   consumers render strings as-is, so `<booleanList maxNumber>` surfaces as
 *   `"Infinity"` instead of being silently dropped as `null`.
 *
 * - `math-expressions` `Expression` objects (e.g. the default of the `<math>`
 *   `assumptions` attribute) round-trip through `JSON.stringify` as
 *   `{ objectType: "math-expression", tree: ... }`, which is opaque to a
 *   reader. Replace them with a `{ type: "math", latex }` sentinel so the
 *   docs UI can render the LaTeX with MathJax.
 */
function encodeDefaultValueForJson(val: unknown): unknown {
    if (isMathExpression(val)) {
        const sentinel: MathDefaultValue = {
            type: "math",
            latex: val.toLatex(),
        };
        return sentinel;
    }
    if (typeof val !== "number" || Number.isFinite(val)) return val;
    if (Number.isNaN(val)) return "NaN";
    return val > 0 ? "Infinity" : "-Infinity";
}

/**
 * `math-expressions` exports its `Expression` class as the default export
 * of `math-expressions`. Instances carry a `tree` (own property), a
 * prototype `toLatex()`, and a `toJSON()` that writes the
 * `{ objectType: "math-expression", tree }` shape that shows up in the
 * default schema serialization — but `objectType` is only present on the
 * `toJSON` output, not on the instance itself. So we probe for the
 * instance shape (`toLatex` + `tree`) rather than the serialized one, and
 * stay free of a direct `math-expressions` dependency in this module.
 */
function isMathExpression(
    val: unknown,
): val is { toLatex: () => string; tree: unknown } {
    return (
        typeof val === "object" &&
        val !== null &&
        typeof (val as { toLatex?: unknown }).toLatex === "function" &&
        "tree" in val
    );
}

/**
 * The slug declared by a component class (or its default).
 * - undefined `docsSlug` field (or missing) → falls back to the component type.
 * - explicit `null` → intentionally undocumented.
 * - explicit string → override (e.g. `"answer1"` for `<answer>`).
 *
 * Explicit `undefined` (e.g. `{ ...other, docsSlug: undefined }` from a spread)
 * is treated the same as a missing field — only `null` reserves the
 * "intentionally undocumented" semantics.
 *
 * This is the *declared* value; whether the page actually exists is a
 * separate concern (see `getExistingDocSlugs`).
 */
export function getDeclaredDocsSlug(
    componentDocs: { docsSlug?: string | null } | undefined,
    componentType: string,
): string | null {
    const slug = componentDocs?.docsSlug;
    if (slug === null) return null;
    if (typeof slug === "string") return slug;
    return componentType;
}

// Create schema of DoenetML by extracting component, attributes and children
// from component classes.
// CodeMirror.jsx reads in the json file to form its autocompletion scheme.

type AttributeObject = {
    createPrimitiveOfType: string;
    createStateVariable: string;
    createComponentOfType: string;
    createReferences?: boolean;
    allowStrings?: boolean;
    defaultValue: unknown;
    public: boolean;
    excludeFromSchema: boolean;
    validValues?: ValidValueEntry[];
    valueForTrue?: unknown;
    valueForFalse?: unknown;
    description: string;
};

type ComponentClass = {
    componentType: string;
    renderChildren: boolean;
    canDisplayChildErrors: boolean;
    includeBlankStringChildren: boolean;
    returnChildGroups: () => {
        group: string;
        componentTypes: string[];
        excludeFromSchema?: boolean;
    }[];
    returnStateVariableDefinitions: () => Record<string, unknown>;
    /**
     * If a component class has the static variable excludeFromSchema set,
     * then we ignore it completely in the schema.
     */
    excludeFromSchema: boolean;
    /**
     * If a composite component class has the static variable allowInSchemaAnywhere set to true,
     * then we will treat it as though it were any component type when determining schema relationships.
     */
    allowInSchemaAnywhere?: boolean;
    /**
     * If a composite component class has the static variable allowInSchemaAsComponent set
     * then we will treat it as though it were any of those
     * component types (as well as its actual component type)
     * when determining schema relationships
     */
    allowInSchemaAsComponent?: string[];
    createAttributesObject: () => Record<string, AttributeObject>;
    /**
     * If set, then for the purpose of generating the schema,
     * this component will act as though it could only be inherited from the specified component types.
     * If an empty array, then it will be treated as though it did not inherit from any other component type.
     * (It is assumed, but not checked, that the component actually does inherit from those types.)
     */
    inSchemaOnlyInheritAs?: string[];
    /**
     * If true, descendants are accessible only via index (e.g. $name[1].member).
     * Autocomplete uses this to decide whether `$name.` offers descendant names.
     */
    takesIndex?: boolean;
    getAdapterComponentType: (...args: any[]) => string;
    numAdapters: number;
    /**
     * The static variable additionalSchemaChildren on a component class
     * can be used to add children to the schema that wouldn't show up otherwise.
     * Two uses are:
     * 1. to include children that are accepted by sugar but are not in a child group
     *    because the sugar moves them to no longer be children.
     * 2. to add composite children to the schema even though they should be expanded.
     *    (Typically composite children are not added to a child group,
     *    as that would prevent the composite from being expanded)
     */
    additionalSchemaChildren?: string[];
    /** If `true` and `additionalSchemaChildren` is set, then those children will not be inherited by subclasses */
    additionalSchemaChildrenDoNotInherit?: boolean;
    /** Class-level help metadata. */
    componentDocs?: {
        /** A one-sentence summary of the component. */
        summary: string;
        /**
         * Reference-page slug for this component, used to link from editor help.
         * - Undefined → default to the component type (e.g. "abs" → /reference/abs).
         * - String → explicit override (e.g. "answer" → /reference/answer1).
         * - null → component is intentionally undocumented; no link is shown.
         */
        docsSlug?: string | null;
        /**
         * Author-facing tag name to show in the docs index instead of the
         * internal `componentType`. Set on alias targets (e.g. `matrixRow` has
         * `displayName: "row"`) so the index displays the user-written tag
         * rather than the implementation-detail componentType. When undefined,
         * the docs renderer falls back to `componentType`.
         */
        displayName?: string;
        /**
         * Disambiguation phrase appended in parentheses after the displayed
         * tag in the docs index — e.g. `<row>` gets `displayContext: "in a
         * table"` and `matrixRow` gets `displayContext: "in a matrix"` so the
         * two entries render as `<row> (in a table)` and `<row> (in a matrix)`.
         */
        displayContext?: string;
        /**
         * Map from child component type → alias target component type. When
         * the editor shows help for a child whose component type is in this
         * map, the help is taken from the alias target instead. Used to
         * redirect e.g. `<row>` inside `<matrix>` to the `<matrixRow>` help,
         * mirroring the runtime sugar. The alias targets may be
         * `excludeFromSchema` components — their help payloads are emitted in
         * the schema's `aliasedElements` registry.
         */
        childAliases?: Record<string, string>;
    };
};

interface ComponentInfoObjects extends ReturnType<
    typeof createComponentInfoObjects
> {
    allComponentClasses: Record<string, ComponentClass>;
}

type PropertyDescription = {
    name: string;
    /** Component type the property resolves to. Optional because some
     * public state variables (mainly array slots) don't declare a
     * `createComponentOfType`. */
    type?: string;
    isArray: boolean;
    numDimensions?: number;
    indexedArrayDescription?: ArrayElementDescription[];
    description: string;
    fromAttribute?: boolean;
};

type ArrayElementDescription = {
    /** Component type at this dimension. Optional for the same reason as
     * `PropertyDescription.type`: an unwrapped array slot whose parent
     * state variable lacks `createComponentOfType` has no type. */
    type?: string;
    isArray: boolean;
    numDimensions?: number;
};

type WrappingComponentElement =
    | string
    | { componentType: string; isAttributeNamed: string };

type ArrayEntryPrefixDescription = {
    arrayVariableName: string;
    numDimensions: number;
    wrappingComponents: WrappingComponentElement[][];
};

type StateVariableDescription = {
    public: boolean;
    createComponentOfType?: string;
    isArray: boolean;
    numDimensions?: number;
    schemaSubarrays?: Record<string, SchemaSubarrayDescription>;
    wrappingComponents?: WrappingComponentElement[][];
    getArrayKeysFromVarName?: Function;
    arrayVarNameFromPropIndex?: Function;
    description: string;
    fromAttribute?: boolean;
};

type PublicStateVariableDescription = {
    public: boolean;
    /** Some public state variables (mainly array slots) don't declare a
     * `createComponentOfType` — kept optional to match the underlying
     * `StateVariableDescription`. The ternary in `singlePropFromDescription`
     * is load-bearing for these cases. */
    createComponentOfType?: string;
    isArray: boolean;
    numDimensions?: number;
    schemaSubarrays?: Record<string, SchemaSubarrayDescription>;
    wrappingComponents?: WrappingComponentElement[][];
    getArrayKeysFromVarName?: Function;
    arrayVarNameFromPropIndex?: Function;
    description: string;
    fromAttribute?: boolean;
    /**
     * Resting value the runtime uses when nothing else (attribute, child,
     * parent) sets the state variable. Surfaced here by
     * `BaseComponent.returnStateVariableInfo` from each state def's
     * `hasEssential` + `defaultValue` pair. Used by the attribute loop to
     * fall back when an attribute declaration does not carry its own
     * `defaultValue` (e.g. number-display attrs like `padZeros`,
     * `displayDigits`, whose default lives on the state variable).
     */
    defaultValue?: unknown;
};

type SchemaAttribute = {
    name: string;
    /**
     * The attribute's own type, derived from its `createComponentOfType` /
     * `createPrimitiveOfType` declaration (`string` is normalized to `text`).
     * An attribute with a list of valid values has type `keyword`.
     */
    type?: string;
    /** Values accepted by validation/schema checks. */
    values?: string[];
    /**
     * Optional author-facing subset used for autocomplete suggestions. Each
     * entry carries the literal value plus an optional human-readable
     * description. Boolean aliases injected via `valueForTrue`/`valueForFalse`
     * are intentionally kept out of this list and live only in `values`.
     */
    autocompleteValues?: ValidValueEntry[];
    /** One-sentence description of the attribute, surfaced in editor help and docs. */
    description: string;
    /** Default value for the attribute (if defined). */
    defaultValue?: unknown;
};

type SchemaElement = {
    /** The component type of this component */
    name: string;
    /** The types of children this component can have */
    children: string[];
    /** The attributes that can be specified on this component */
    attributes: SchemaAttribute[];
    /** The properties (public state variables) that this component has */
    properties: PropertyDescription[];
    /** Whether this component can be a top-level component */
    top: boolean;
    /** Whether this component accepts string children */
    acceptsStringChildren: boolean;
    /** Whether descendants are accessible only via index */
    takesIndex: boolean;
    /** One-sentence summary of the component, surfaced in editor help and docs. */
    summary: string;
    /**
     * Reference-page slug for this component, or `null` when no docs page
     * exists for it. The generator always emits this field — either a string
     * (resolved from the `componentDocs.docsSlug` declared on the class, or
     * the component type when none is declared) or `null` (intentionally
     * undocumented or no `.mdx` page on disk). Editor help reads this
     * directly; an absent field would be a bug.
     */
    docsSlug: string | null;
    /**
     * Author-facing tag name shown in the docs index in place of `name`.
     * Present only when the class declares `componentDocs.displayName` (e.g.
     * `matrixRow → "row"`). Undefined means "use `name` as-is".
     */
    displayName?: string;
    /**
     * Parenthetical disambiguator appended to the displayed tag in the docs
     * index, e.g. `displayContext: "in a table"` renders as `<row> (in a
     * table)`. Used alongside `displayName` to distinguish multiple entries
     * that share an author-facing tag.
     */
    displayContext?: string;
    /**
     * Map from child component type → alias element name in `aliasedElements`.
     * When editor help is computed for a child of this element whose
     * component type is in this map, the help is read from the alias instead.
     */
    childContextHelp?: Record<string, string>;
};

/**
 * Help payload for an alias-only component (e.g. one with
 * `excludeFromSchema = true` but referenced via `childAliases`). Mirrors the
 * help-relevant fields of `SchemaElement`.
 */
type AliasedSchemaElement = {
    name: string;
    summary: string;
    docsSlug: string | null;
    /** See `SchemaElement.displayName`. */
    displayName?: string;
    /** See `SchemaElement.displayContext`. */
    displayContext?: string;
    attributes: SchemaAttribute[];
    properties: PropertyDescription[];
};

/**
 * Generates a comprehensive schema of all DoenetML components and their metadata.
 *
 * This function creates a schema that includes:
 * - All non-abstract, non-excluded component types
 * - Component attributes with their valid values
 * - Component children relationships (including inherited/adapted types)
 * - Public state variables (i.e., properties)
 * - Array entry prefixes and property aliases
 *
 * The schema generation process:
 * 1. Creates component info objects and filters out excluded components
 * 2. Builds a map of inherited and adapted component types
 * 3. Removes abstract components (prefixed with "_")
 * 4. For each component, collects:
 *    - Attributes from the component's attribute object
 *    - Valid child component types from child groups
 *    - String children acceptance flags
 *    - Additional schema children from component class metadata
 *    - Public state variable descriptions and aliases
 *
 * @returns {Object} An object containing an `elements` array of {@link SchemaElement} objects,
 *          where each element represents a component type with its full schema definition
 *          including name, children, attributes, properties, and string acceptance
 */
export function getSchema(
    componentInfoObjects: ComponentInfoObjects = createComponentInfoObjects() as ComponentInfoObjects,
) {
    // Work on a shallow copy so the schema filtering doesn't mutate the
    // shared registry (`publicStateVariableInfo` reads classes lazily from
    // it, so deletions break later property lookups for excluded classes
    // referenced via `childAliases`).
    let componentClasses = { ...componentInfoObjects.allComponentClasses };
    const allClassesIncludingExcluded =
        componentInfoObjects.allComponentClasses;

    // If a component class has the static variable excludeFromSchema set,
    // then we ignore it completely.
    for (const type in componentClasses) {
        const cClass = componentClasses[type];
        if (cClass.excludeFromSchema) {
            delete componentClasses[type];
        }
    }

    /**
     * A record of, for each component type, the list of all component types that
     * inherit from or adapt to that component type.
     */
    const inheritedOrAdaptedTypes: Record<string, string[]> = {};

    for (const type1 in componentClasses) {
        const inherited: string[] = [];
        for (const type2 in componentClasses) {
            // Skip abstract components
            if (type2[0] === "_") {
                continue;
            }

            if (
                checkIfInheritOrAdapt({
                    startingType: type2,
                    destinationType: type1,
                    componentInfoObjects,
                })
            ) {
                inherited.push(type2);
                continue;
            }

            // If a composite component class has the static variable allowInSchemaAsComponent set
            // then we will, in addition, treat is as though it were any of those
            // component types when determining schema relationships

            const cClass = componentClasses[type2];
            if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: type2,
                    baseComponentType: "_composite",
                }) &&
                cClass.allowInSchemaAsComponent
            ) {
                for (let alt_type of cClass.allowInSchemaAsComponent) {
                    if (
                        checkIfInheritOrAdapt({
                            startingType: alt_type,
                            destinationType: type1,
                            componentInfoObjects,
                        })
                    ) {
                        inherited.push(type2);
                        break;
                    }
                }
            }

            // If a composite component class has the static variable allowInSchemaAnywhere set to true,
            // then we will, in addition, treat it as though it were any component type when determining schema relationships.
            // The one exception is that we don't want to treat it as though it were an _error component type,
            // as that would cause it to show up in the schema as a possible child of even components with no children.

            if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: type2,
                    baseComponentType: "_composite",
                }) &&
                cClass.allowInSchemaAnywhere &&
                type1 !== "_error"
            ) {
                inherited.push(type2);
            }
        }
        inheritedOrAdaptedTypes[type1] = inherited;
    }

    // Remove abstract components from the schema
    // (Use shallow copy as we still need them in componentInfoObjects for other functionality.)
    componentClasses = { ...componentClasses };
    for (const type in componentClasses) {
        if (type[0] === "_") {
            delete componentClasses[type];
        }
    }

    function determineChildren(cClass: ComponentClass) {
        let children: string[] = [];
        let acceptsStringChildren = false;

        const childGroups = cClass.returnChildGroups();

        for (const groupObj of childGroups) {
            // one can add a excludeFromSchema to a child group
            // to keep it from showing up in the schema
            if (!groupObj.excludeFromSchema) {
                for (const type2 of groupObj.componentTypes) {
                    if (type2 in inheritedOrAdaptedTypes) {
                        children.push(...inheritedOrAdaptedTypes[type2]);
                    }
                    if (
                        type2 === "string" ||
                        type2 === "_base" ||
                        type2 === "_inline"
                    ) {
                        acceptsStringChildren = true;
                    }
                }
            }
        }

        // The static variable additionalSchemaChildren on a component class
        // can be used to add children to the schema that wouldn't show up otherwise.
        // Two uses are:
        // 1. to include children that are accepted by sugar but are not in a child group
        //    because the sugar moves them to no longer be children
        // 2. to add composite children to the schema even though they should be expanded,
        //    (as adding a composite child to a child group will prevent it from being expanded)
        if (cClass.additionalSchemaChildren) {
            for (const type2 of cClass.additionalSchemaChildren) {
                if (type2 in inheritedOrAdaptedTypes) {
                    if (cClass.additionalSchemaChildrenDoNotInherit) {
                        children.push(type2);
                    } else {
                        children.push(...inheritedOrAdaptedTypes[type2]);
                    }
                }
                if (
                    type2 === "string" ||
                    type2 === "_base" ||
                    type2 === "_inline"
                ) {
                    acceptsStringChildren = true;
                }
            }
        }

        children = [...new Set(children)];
        return { children, acceptsStringChildren };
    }

    const { children: documentChildren } = determineChildren(
        componentClasses["document"],
    );

    const documentChildrenSet = new Set(documentChildren);

    /**
     * Extract attributes, properties, summary, and docsSlug for a class.
     * Used for both regular schema elements and alias-target help payloads.
     */
    function buildHelpPayloadForClass(
        type: string,
        cClass: ComponentClass,
    ): Pick<
        SchemaElement,
        "attributes" | "properties" | "summary" | "docsSlug"
    > {
        const attributes: SchemaAttribute[] = [];
        const attrObj = cClass.createAttributesObject();
        // Collect state-variable names produced by attributes that are
        // themselves excluded from the schema. Their companion properties
        // should be excluded too — otherwise `<booleanInput>`'s already
        // hidden `collaborateGroups` attribute leaks back into the schema
        // as a property. Tracked in #1089; the broader proposal is to also
        // honor an explicit `excludeFromSchema` flag on state-variable
        // definitions for properties not derived from attributes.
        const excludedStateVariableNames = new Set<string>();
        for (const attrName in attrObj) {
            const attrDef = attrObj[attrName];
            if (attrDef.excludeFromSchema && attrDef.createStateVariable) {
                excludedStateVariableNames.add(attrDef.createStateVariable);
            }
        }
        // Map state variable name → its essential `defaultValue`, when the
        // state def declares one. Used below to surface a default for
        // attributes (e.g. `padZeros`, `displayDigits`) whose attribute
        // declaration omits `defaultValue` because the actual resting value
        // is defined on the state variable, not the attribute. We read from
        // the *full* (non-public-only) state variable info so non-public
        // state defs can still donate a default to a public attribute.
        const stateVarDefaults: Record<string, unknown> = {};
        const stateVarInfo =
            componentInfoObjects.stateVariableInfo[type]
                ?.stateVariableDescriptions;
        if (stateVarInfo) {
            for (const varName in stateVarInfo) {
                const svDesc = stateVarInfo[varName] as {
                    defaultValue?: unknown;
                };
                if (svDesc.defaultValue !== undefined) {
                    stateVarDefaults[varName] = svDesc.defaultValue;
                }
            }
        }
        for (const attrName in attrObj) {
            const attrDef = attrObj[attrName];
            if (attrDef.excludeFromSchema) continue;

            // Hard-fail on missing description. Mirrors the validValues
            // guard below and the per-component summary guard further on.
            if (
                typeof attrDef.description !== "string" ||
                attrDef.description.trim() === ""
            ) {
                throw new Error(
                    `Invalid description for attribute \`${type}.${attrName}\`: every non-excluded attribute must declare a non-empty \`description\`. Got: ${JSON.stringify(attrDef.description)}`,
                );
            }

            const attrSpec: SchemaAttribute = {
                name: attrName,
                description: attrDef.description,
            };
            // Prefer the default declared on the attribute itself. When it
            // doesn't declare one, fall back to the matching state
            // variable's default — this covers number-display attributes
            // like `padZeros`, `displayDigits`, `displayDecimals`, etc.
            // whose actual resting value is defined on the state variable
            // (so the runtime can also inherit it from a child/parent)
            // rather than on the attribute. The matching state variable is
            // the one named by `createStateVariable`, or — when the
            // attribute doesn't even declare a `createStateVariable` — a
            // state variable with the same name as the attribute.
            //
            // The attribute-name fallback relies on a codebase convention:
            // when a `returnXxxAttributes()` helper omits both
            // `defaultValue` and `createStateVariable` from an attribute
            // declaration, the attribute and its backing state variable
            // share a name (e.g. `padZeros` → `padZeros`). If that
            // convention is ever broken — an attribute happens to share a
            // name with an unrelated state variable — this would silently
            // pull in the wrong default. We accept that risk because the
            // alternative (a heavier explicit mapping) would force every
            // attribute declaration to wire up a state variable name even
            // when the existing convention already pairs them.
            const fallbackStateVarName =
                attrDef.createStateVariable ?? attrName;
            const fallbackDefault = stateVarDefaults[fallbackStateVarName];
            const resolvedDefault =
                attrDef.defaultValue !== undefined
                    ? attrDef.defaultValue
                    : fallbackDefault;
            if (resolvedDefault !== undefined) {
                attrSpec.defaultValue =
                    encodeDefaultValueForJson(resolvedDefault);
            }

            const booleanAliasValues: string[] = [];
            if (attrDef.valueForTrue !== undefined)
                booleanAliasValues.push("true");
            if (attrDef.valueForFalse !== undefined)
                booleanAliasValues.push("false");

            if (attrDef.validValues) {
                for (const entry of attrDef.validValues) {
                    // Hard-fail if the type contract is bypassed (e.g. a bare
                    // string sneaks through plain-JS component declarations).
                    // Every enumerated value must ship with author-facing
                    // help text.
                    if (
                        typeof entry !== "object" ||
                        entry === null ||
                        typeof entry.value !== "string" ||
                        typeof entry.description !== "string" ||
                        entry.description.trim() === ""
                    ) {
                        throw new Error(
                            `Invalid validValues entry for \`${type}.${attrName}\`: every entry must be a {value, description} object with a non-empty description. Got: ${JSON.stringify(entry)}`,
                        );
                    }
                }
                const validValueStrings = attrDef.validValues.map(
                    (v) => v.value,
                );
                attrSpec.values =
                    booleanAliasValues.length > 0
                        ? [
                              ...new Set([
                                  ...validValueStrings,
                                  ...booleanAliasValues,
                              ]),
                          ]
                        : validValueStrings;
                attrSpec.autocompleteValues = attrDef.validValues;
            } else if (
                attrDef.createPrimitiveOfType === "boolean" ||
                attrDef.createComponentOfType === "boolean"
            ) {
                attrSpec.values = ["true", "false"];
            }

            // The attribute's type comes from its own declaration, not from a
            // mapping to a same-named property. A `string` primitive is
            // surfaced as `text`; an attribute that enumerates valid values is
            // surfaced as `keyword`; a reference-creating attribute is
            // surfaced as `reference` — or `referenceOrText` when it also sets
            // `allowStrings` (e.g. `<ref to>`, which accepts a URL string in
            // addition to a component reference).
            if (attrDef.validValues) {
                attrSpec.type = "keyword";
            } else if (attrDef.createReferences) {
                attrSpec.type = attrDef.allowStrings
                    ? "referenceOrText"
                    : "reference";
            } else {
                const rawType =
                    attrDef.createComponentOfType ??
                    attrDef.createPrimitiveOfType;
                if (rawType) {
                    attrSpec.type = rawType === "string" ? "text" : rawType;
                }
            }

            attributes.push(attrSpec);
        }

        const properties = buildPropertiesForType(
            type,
            excludedStateVariableNames,
        );

        // Hard-fail on missing summary. Fires for every class that reaches
        // the schema, plus alias targets promoted via `childAliases`
        // (e.g. `<row>` → `<matrixRow>`) — those are `excludeFromSchema`
        // but still emit help payloads here.
        const summary = cClass.componentDocs?.summary;
        if (typeof summary !== "string" || summary.trim() === "") {
            throw new Error(
                `Invalid componentDocs.summary for \`${type}\`: every component reaching the schema must declare a non-empty \`static componentDocs = { summary: "..." }\`. Got: ${JSON.stringify(summary)}`,
            );
        }

        const out: Pick<
            SchemaElement,
            | "attributes"
            | "properties"
            | "summary"
            | "docsSlug"
            | "displayName"
            | "displayContext"
        > = {
            attributes,
            properties,
            docsSlug: null,
            summary,
        };

        const declaredSlug = getDeclaredDocsSlug(cClass.componentDocs, type);
        if (declaredSlug !== null && getExistingDocSlugs().has(declaredSlug)) {
            out.docsSlug = declaredSlug;
        }
        // Author-facing label overrides for the docs index. Both are optional
        // and only emitted when declared on the class — most components leave
        // `name` as the displayed tag and have no parenthetical disambiguator.
        if (typeof cClass.componentDocs?.displayName === "string") {
            out.displayName = cClass.componentDocs.displayName;
        }
        if (typeof cClass.componentDocs?.displayContext === "string") {
            out.displayContext = cClass.componentDocs.displayContext;
        }
        return out;
    }

    function buildPropertiesForType(
        type: string,
        excludedStateVariableNames: ReadonlySet<string> = new Set(),
    ): PropertyDescription[] {
        const info = componentInfoObjects.publicStateVariableInfo[type];
        if (!info) return [];
        const {
            stateVariableDescriptions,
            arrayEntryPrefixes,
            aliases,
        }: {
            stateVariableDescriptions: Record<string, StateVariableDescription>;
            arrayEntryPrefixes: Record<string, ArrayEntryPrefixDescription>;
            aliases: Record<string, AliasDescription>;
        } = info;

        const publicStateVariableDescriptions =
            stateVariableDescriptions as Record<
                string,
                PublicStateVariableDescription
            >;

        const properties: PropertyDescription[] = [];

        for (const varName in publicStateVariableDescriptions) {
            if (excludedStateVariableNames.has(varName)) continue;
            const description = publicStateVariableDescriptions[varName];
            properties.push(
                ...propFromDescription({
                    parentType: type,
                    varName,
                    description,
                    arrayEntryPrefixes,
                    includeSchemaSubarrays: true,
                }),
            );
        }

        const arrayEntryPrefixesLongestToShortest = Object.keys(
            arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);

        for (const aliasName in aliases) {
            const aliasInfo = aliases[aliasName];
            const aliasTargetName = aliasInfo.target;
            // Skip aliases that point at an excluded state variable; they
            // would otherwise act as a backdoor for the same excluded property.
            if (excludedStateVariableNames.has(aliasTargetName)) continue;
            if (excludedStateVariableNames.has(aliasName)) continue;
            const aliasTarget =
                publicStateVariableDescriptions[aliasTargetName];
            if (aliasTarget) {
                const aliasDescription: PublicStateVariableDescription = {
                    ...aliasTarget,
                    fromAttribute: false,
                };
                if (aliasInfo.description !== undefined) {
                    aliasDescription.description = aliasInfo.description;
                }
                properties.push(
                    ...propFromDescription({
                        parentType: type,
                        varName: aliasName,
                        description: aliasDescription,
                        arrayEntryPrefixes,
                        includeSchemaSubarrays: false,
                    }),
                );
            } else {
                for (const prefix of arrayEntryPrefixesLongestToShortest) {
                    if (
                        aliasTargetName.substring(0, prefix.length) === prefix
                    ) {
                        const arrayEntry = arrayEntryPrefixes[prefix];
                        const arrayVariableName = arrayEntry.arrayVariableName;
                        const arrayStateVarDescription =
                            publicStateVariableDescriptions[arrayVariableName];

                        const arrayEntryDescription: PublicStateVariableDescription =
                            {
                                public: true,
                                createComponentOfType:
                                    arrayStateVarDescription.createComponentOfType,
                                description:
                                    aliasInfo.description ??
                                    arrayStateVarDescription.description,
                                isArray: arrayEntry.numDimensions > 0,
                                numDimensions: arrayEntry.numDimensions,
                                wrappingComponents:
                                    arrayEntry.wrappingComponents ||
                                    arrayStateVarDescription.wrappingComponents,
                                getArrayKeysFromVarName:
                                    arrayStateVarDescription.getArrayKeysFromVarName,
                                arrayVarNameFromPropIndex:
                                    arrayStateVarDescription.arrayVarNameFromPropIndex,
                            };

                        properties.push(
                            ...propFromDescription({
                                parentType: type,
                                varName: aliasName,
                                description: arrayEntryDescription,
                                arrayEntryPrefixes,
                                includeSchemaSubarrays: false,
                            }),
                        );
                        break;
                    }
                }
            }
        }

        return properties;
    }

    const elements: SchemaElement[] = [];

    for (const type in componentClasses) {
        const cClass = componentClasses[type];

        const helpPayload = buildHelpPayloadForClass(type, cClass);
        const { children, acceptsStringChildren } = determineChildren(cClass);

        const element: SchemaElement = {
            name: type,
            children,
            attributes: helpPayload.attributes,
            properties: helpPayload.properties,
            top:
                cClass.componentType === "document" ||
                documentChildrenSet.has(cClass.componentType),
            acceptsStringChildren,
            takesIndex: cClass.takesIndex ?? false,
            docsSlug: helpPayload.docsSlug,
            summary: helpPayload.summary,
        };
        if (helpPayload.displayName !== undefined) {
            element.displayName = helpPayload.displayName;
        }
        if (helpPayload.displayContext !== undefined) {
            element.displayContext = helpPayload.displayContext;
        }

        elements.push(element);
    }

    // Resolve `childAliases`: for each parent that declares them, populate
    // `childContextHelp` and emit help payloads for any alias targets that
    // are excluded from the main schema.
    const aliasedElements: Record<string, AliasedSchemaElement> = {};
    for (const el of elements) {
        const cClass = allClassesIncludingExcluded[el.name];
        const childAliases = cClass?.componentDocs?.childAliases;
        if (!childAliases) continue;

        el.childContextHelp = { ...childAliases };

        for (const targetName of Object.values(childAliases)) {
            if (
                aliasedElements[targetName] ||
                elements.some((e) => e.name === targetName)
            ) {
                continue; // already emitted
            }
            const targetClass = allClassesIncludingExcluded[targetName];
            if (!targetClass) continue;
            const payload = buildHelpPayloadForClass(targetName, targetClass);
            const aliased: AliasedSchemaElement = {
                name: targetName,
                attributes: payload.attributes,
                properties: payload.properties,
                docsSlug: payload.docsSlug,
                summary: payload.summary,
            };
            if (payload.displayName !== undefined) {
                aliased.displayName = payload.displayName;
            }
            if (payload.displayContext !== undefined) {
                aliased.displayContext = payload.displayContext;
            }
            aliasedElements[targetName] = aliased;
        }
    }

    return { elements, aliasedElements };
}

function propFromDescription({
    parentType,
    varName,
    description,
    arrayEntryPrefixes,
    includeSchemaSubarrays,
}: {
    parentType: string;
    varName: string;
    description: PublicStateVariableDescription;
    arrayEntryPrefixes: Record<string, ArrayEntryPrefixDescription>;
    includeSchemaSubarrays: boolean;
}): PropertyDescription[] {
    const props = [
        singlePropFromDescription({
            parentType,
            varName,
            description,
            arrayEntryPrefixes,
        }),
    ];

    if (
        includeSchemaSubarrays &&
        description.isArray &&
        description.schemaSubarrays
    ) {
        /*
         * Contract: All entries in schemaSubarrays must have corresponding entries in arrayEntryPrefixes.
         *
         * schemaSubarrays defines alternative array representations with their dimensions,
         * while arrayEntryPrefixes defines the naming convention and wrapping components for accessing array entries.
         * Each subarray name requires both definitions to generate complete schema information.
         */
        for (const subarrayName in description.schemaSubarrays) {
            const schemaSubarrayDescription =
                description.schemaSubarrays[subarrayName];
            const prefixDescription = arrayEntryPrefixes[subarrayName];

            if (!prefixDescription) {
                throw new Error(
                    `schemaSubarray "${subarrayName}" for state variable "${varName}" ` +
                        `is not defined in arrayEntryPrefixes`,
                );
            }

            props.push(
                singlePropFromDescription({
                    parentType,
                    varName: subarrayName,
                    description: {
                        ...description,
                        isArray: schemaSubarrayDescription.numDimensions > 0,
                        numDimensions: schemaSubarrayDescription.numDimensions,
                        wrappingComponents:
                            prefixDescription.wrappingComponents,
                        // Subarray entries have a different name from the
                        // parent array; they're never themselves created
                        // directly from a same-named attribute.
                        fromAttribute: false,
                        // Prefer the subarray's own description; fall back to
                        // the parent array's so something useful surfaces
                        // even when the subarray is undescribed.
                        description:
                            schemaSubarrayDescription.description ??
                            description.description,
                    },
                    arrayEntryPrefixes,
                }),
            );
        }
    }

    return props;
}

function singlePropFromDescription({
    parentType,
    varName,
    description,
    arrayEntryPrefixes,
}: {
    parentType: string;
    varName: string;
    description: PublicStateVariableDescription;
    arrayEntryPrefixes: Record<string, ArrayEntryPrefixDescription>;
}): PropertyDescription {
    const componentType = description.createComponentOfType;

    // Hard-fail on missing description. Single choke point for direct
    // state vars, aliases, and array-entry-prefix aliases — the existing
    // fallback assembly (`aliasInfo.description ?? arrayStateVarDescription.description`)
    // is preserved upstream, so this only fires when *every* candidate is empty.
    if (
        typeof description.description !== "string" ||
        description.description.trim() === ""
    ) {
        throw new Error(
            `Invalid description for property \`${parentType}.${varName}\` (createComponentOfType=${componentType}): every public state variable, alias, or array-entry property feeding the schema must have a non-empty \`description\`. Got: ${JSON.stringify(description.description)}`,
        );
    }

    const prop: PropertyDescription =
        componentType !== undefined
            ? {
                  name: varName,
                  type: componentType,
                  isArray: description.isArray,
                  description: description.description,
              }
            : {
                  name: varName,
                  isArray: description.isArray,
                  description: description.description,
              };

    if (description.fromAttribute) {
        prop.fromAttribute = true;
    }

    if (description.isArray) {
        const numDimensions = description.numDimensions || 1;

        prop.numDimensions = numDimensions;
        prop.indexedArrayDescription = [];

        const wrappingComponents = description.wrappingComponents || [];

        const arrayEntryPrefixesLongestToShortest = Object.keys(
            arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);

        prop.indexedArrayDescription.push(
            createArrayElementDescription(
                wrappingComponents,
                numDimensions,
                componentType,
            ),
        );

        // if the array dimension is two or larger,
        // then we have array elements that are slices of the array
        // but are more than one element
        let propIndexStandin: number[] = [];
        for (let dim = 1; dim < numDimensions; dim++) {
            propIndexStandin.push(1);

            // TODO: fix technical debt so don't have to go through varName
            const varNameForIndexed = description.arrayVarNameFromPropIndex?.(
                propIndexStandin,
                varName,
            ) as string;

            let foundMatch = false;

            for (let prefix of arrayEntryPrefixesLongestToShortest) {
                if (varNameForIndexed.substring(0, prefix.length) === prefix) {
                    const prefixDescription = arrayEntryPrefixes[prefix];

                    const numDimensions = prefixDescription.numDimensions;
                    const wrappingComponents =
                        prefixDescription.wrappingComponents;

                    prop.indexedArrayDescription.push(
                        createArrayElementDescription(
                            wrappingComponents,
                            numDimensions,
                            componentType,
                        ),
                    );

                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch) {
                throw Error(
                    `Invalid array state variable ${varName} as arrayVarNameFromPropIndex didn't return an array entry`,
                );
            }
        }
    }
    return prop;
}

function createArrayElementDescription(
    wrappingComponents: WrappingComponentElement[][],
    numDimensions: number,
    componentType: string | undefined,
): ArrayElementDescription {
    if (wrappingComponents.length === numDimensions) {
        // the last dimension of the array is wrapped,
        // which means the final result isn't actually an array,
        // but a single component of the wrapped type
        const wrapping = wrappingComponents[wrappingComponents.length - 1][0];

        return {
            isArray: false,
            type:
                typeof wrapping === "string"
                    ? wrapping
                    : wrapping.componentType,
        };
    } else if (wrappingComponents.length > 0) {
        // although the last dimension isn't wrapped, some inner dimension is wrapped,
        // which means the final result is an array, but of a lower dimensions,
        // with type given by the last wrapping component
        const wrapping = wrappingComponents[wrappingComponents.length - 1][0];

        return {
            isArray: true,
            type:
                typeof wrapping === "string"
                    ? wrapping
                    : wrapping.componentType,
            numDimensions: numDimensions - wrappingComponents.length,
        };
    } else {
        // array is not wrapped
        return componentType !== undefined
            ? { isArray: true, type: componentType, numDimensions }
            : { isArray: true, numDimensions };
    }
}

/**
 * Determine if `startingType` either inherits from or adapts to `destinationType`.
 *
 * For the purposes of building the schema, inheritance can be overridden by the static variable `inSchemaOnlyInheritAs`
 * on the component class object. (See `checkIfInherit` for details.)
 *
 * Return true if `startingType` inherits from `destinationType` or adapts into a component type that inherits from `destinationType`.
 * Otherwise return false.
 */
function checkIfInheritOrAdapt({
    startingType,
    destinationType,
    componentInfoObjects,
}: {
    startingType: string;
    destinationType: string;
    componentInfoObjects: ComponentInfoObjects;
}) {
    if (
        checkIfInherit({
            startingType,
            destinationType,
            componentInfoObjects,
        })
    ) {
        return true;
    }

    const startingClass =
        componentInfoObjects.allComponentClasses[startingType];
    const numAdapters = startingClass.numAdapters;

    for (let n = 0; n < numAdapters; n++) {
        const adapterComponentType = startingClass.getAdapterComponentType(
            n,
            componentInfoObjects.publicStateVariableInfo,
        );

        if (
            checkIfInherit({
                startingType: adapterComponentType,
                destinationType,
                componentInfoObjects,
            })
        ) {
            return true;
        }
    }

    return false;
}

/**
 * Determine if `startingType` inherits from `destinationType`.
 *
 * For the purposes of building the schema, inheritance can be overridden by the static variable `inSchemaOnlyInheritAs`
 * on the component class object.
 *
 * The rules for determining if component type `startingType` inherits from component type `destinationType`
 * depend on whether the component class of  `startingType` has `inSchemaOnlyInheritAs` set:
 * - if `inSchemaOnlyInheritAs` is not set, `startingType` must inherit from `destinationType` (or be equal to `destinationType`),
 * - if `inSchemaOnlyInheritAs` is set, `destinationType` must be in that list or be equal to `startingType`.
 *
 * Return true if `startingType` inherits from `destinationType`.
 * Otherwise return false.
 */
function checkIfInherit({
    startingType,
    destinationType,
    componentInfoObjects,
}: {
    startingType: string;
    destinationType: string;
    componentInfoObjects: ComponentInfoObjects;
}) {
    const startingClass =
        componentInfoObjects.allComponentClasses[startingType];

    // The static variable inSchemaOnlyInheritAs overrides the standard inheritance
    // rules for determining the children of the schema.
    // If inSchemaOnlyInheritAs is an empty array, then only the actual component type is used.
    // Any component types in inSchemaOnlyInheritAs are not checked to see if
    // startingType actually inherit from them, but the idea is that they should.
    // (Otherwise, the autocompletion will suggest invalid child types.)
    if (startingClass.inSchemaOnlyInheritAs) {
        if (
            startingType === destinationType ||
            startingClass.inSchemaOnlyInheritAs.includes(destinationType)
        ) {
            return true;
        }
    } else if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: startingType,
            baseComponentType: destinationType,
        })
    ) {
        return true;
    }

    return false;
}
