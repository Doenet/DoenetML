import {
    StateVariableDependency,
    StateVariableFromUnresolvedPathDependency,
    MultipleStateVariablesDependency,
    StateVariableComponentTypeDependency,
    StateVariableArraySizeDependency,
    RecursiveDependencyValuesDependency,
} from "./stateVariableDependencies";
import {
    ComponentIdentityDependency,
    AttributeComponentDependency,
} from "./componentIdentityDependencies";
import { ChildDependency, DescendantDependency } from "./childDependencies";
import {
    ParentDependency,
    ParentIdentityDependency,
    AncestorDependency,
} from "./parentDependencies";
import { ReplacementDependency } from "./replacementDependencies";
import {
    RefResolutionIndexDependencies,
    RefResolutionDependency,
    AttributeRefResolutions,
    ComponentsReferencingAttributeDependency,
    StringsFromReferenceAttribute,
    RendererId,
} from "./refResolutionDependencies";
import {
    SourceCompositeStateVariableDependency,
    SourceCompositeIdentityDependency,
    ShadowSourceStateVariableDependency,
    ShadowSourceDependency,
    UnlinkedCopySourceDependency,
    PrimaryShadowDependency,
    ShadowInfoDependency,
} from "./shadowDependencies";
import {
    AdapterSourceStateVariableDependency,
    AdapterSourceDependency,
} from "./adapterDependencies";
import {
    CountAmongSiblingsDependency,
    ValueDependency,
    FlagDependency,
} from "./siblingAndValueDependencies";
import {
    DoenetAttributeDependency,
    ExtendingDependency,
    AttributePrimitiveDependency,
} from "./attributeDependencies";
import {
    SerializedChildrenDependency,
    DoenetMLDependency,
    DoenetMLRangeDependency,
    VariantsDependency,
    CounterDependency,
    DetermineDependenciesDependency,
    FileDependency,
} from "./contentDependencies";

/**
 * Single source of truth for the concrete dependency types. The original
 * `Dependencies.js` registered each subclass via a side-effectful
 * `dependencyTypeArray.push(...)` immediately after the class definition;
 * splitting the file across modules made that registration order
 * load-order dependent, so we collect the classes here explicitly. Order
 * is preserved for parity with the original file but is not load-bearing
 * — `DependencyHandler` indexes by `dependencyType` (the string).
 */
/** Concrete dependency-class constructor as registered with `DependencyHandler`. */
type DependencyClass = (new (args: any) => any) & { dependencyType: string };

export const dependencyTypeClasses: ReadonlyArray<DependencyClass> = [
    StateVariableDependency,
    StateVariableFromUnresolvedPathDependency,
    MultipleStateVariablesDependency,
    StateVariableComponentTypeDependency,
    StateVariableArraySizeDependency,
    RecursiveDependencyValuesDependency,
    ComponentIdentityDependency,
    AttributeComponentDependency,
    ChildDependency,
    DescendantDependency,
    ParentDependency,
    ParentIdentityDependency,
    AncestorDependency,
    ReplacementDependency,
    RefResolutionIndexDependencies,
    RefResolutionDependency,
    AttributeRefResolutions,
    ComponentsReferencingAttributeDependency,
    StringsFromReferenceAttribute,
    RendererId,
    SourceCompositeStateVariableDependency,
    SourceCompositeIdentityDependency,
    ShadowSourceStateVariableDependency,
    ShadowSourceDependency,
    UnlinkedCopySourceDependency,
    PrimaryShadowDependency,
    ShadowInfoDependency,
    AdapterSourceStateVariableDependency,
    AdapterSourceDependency,
    CountAmongSiblingsDependency,
    ValueDependency,
    FlagDependency,
    DoenetAttributeDependency,
    ExtendingDependency,
    AttributePrimitiveDependency,
    SerializedChildrenDependency,
    DoenetMLDependency,
    DoenetMLRangeDependency,
    VariantsDependency,
    CounterDependency,
    DetermineDependenciesDependency,
    FileDependency,
];
