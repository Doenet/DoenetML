extern crate proc_macro2;

use component_attributes::attribute_prop_derive;
use component_node::{
    component_actions_derive, component_attributes_derive, component_node_derive,
    rendered_children_derive, rendered_state_derive,
};
use component_state_methods::{
    add_dependency_data_impl, component_state_derive, prop_data_queries_derive,
    prop_dependencies_derive,
};
use proc_macro::TokenStream;
use prop_methods::{
    into_prop_enum_refs_derive, prop_methods_derive, prop_methods_mut_derive,
    prop_mutable_view_methods_derive, prop_read_only_view_methods_derive,
};

mod component_attributes;
mod component_node;
mod component_state_methods;
mod prop_methods;
mod util;

/// Use on the Enum that lists the attributes of your component.
/// Every variant should be annotated with a `#[attribute(...)]` annotation.
///
/// The options available to `attribute(...)` are:
///  - `prop` - The prop that will be created for this attribute. The prop **must**
///    have a `new_from_attribute(attr_name, default_value)` method.
/// - `default` - The default value for the attribute.
/// - `explicit_type` (optional) - The type of the prop that will be created for the attribute.
///    For example, if you expect a `Prop<bool>` to be created, then `explicit_type=bool`.
///    This can be inferred if the value of `prop` is a commonly-recognized prop type.
///
/// Example:
/// ```ignore
/// #[derive(Debug, AttributeProp)]
/// pub enum MyComponentAttributes {
///   #[attribute(prop = BooleanProp, default = false)]
///   Foo,
///   #[attribute(prop = CustomProp, default = Vec::new(), explicit_type = Vec<String>)]
///   Bar,
/// }
/// ```
///
/// Note: Enum variants are specified in PascalCase, but attribute names are always converted to camelCase.
#[proc_macro_derive(AttributeProp, attributes(attribute))]
pub fn attribute_prop_derive_wrapper(input: TokenStream) -> TokenStream {
    attribute_prop_derive(input)
}

/// Derive functions needed to be initialized as a component.
///
/// Options can be set using the `#[component(...)]` attribute.
///
/// ## Options
///  - `#[component(ref_transmutes_to = "...")]` - The name of the component that should be used to
///    render a direct reference to this component. E.g. in `<textInput name="i"/>$i`, the `$i`
///    should be rendered as a `<text extend="$i"/>` rather than a `<textInput extend="$i"/>`.
///    Setting `#[component(ref_transmutes_to = "Text")]` will do this.
#[proc_macro_derive(ComponentNode, attributes(component))]
pub fn component_node_derive_wrapper(input: TokenStream) -> TokenStream {
    component_node_derive(input)
}

#[proc_macro_derive(
    RenderedChildren,
    attributes(pass_through_children, no_rendered_children)
)]
pub fn rendered_children_derive_wrapper(input: TokenStream) -> TokenStream {
    rendered_children_derive(input)
}

#[proc_macro_derive(ComponentAttributes)]
pub fn component_attributes_derive_wrapper(input: TokenStream) -> TokenStream {
    component_attributes_derive(input)
}

#[proc_macro_derive(ComponentActions)]
pub fn component_actions_derive_wrapper(input: TokenStream) -> TokenStream {
    component_actions_derive(input)
}

#[proc_macro_derive(PropMethods)]
pub fn prop_methods_derive_wrapper(input: TokenStream) -> TokenStream {
    prop_methods_derive(input)
}

#[proc_macro_derive(PropMethodsMut)]
pub fn prop_methods_mut_derive_wrapper(input: TokenStream) -> TokenStream {
    prop_methods_mut_derive(input)
}

#[proc_macro_derive(PropViewMutMethods)]
pub fn prop_mutable_view_methods_derive_wrapper(input: TokenStream) -> TokenStream {
    prop_mutable_view_methods_derive(input)
}

#[proc_macro_derive(PropViewMethods)]
pub fn prop_read_only_view_methods_derive_wrapper(input: TokenStream) -> TokenStream {
    prop_read_only_view_methods_derive(input)
}

#[proc_macro_derive(FromPropIntoPropEnumRefs)]
pub fn into_prop_enum_refs_derive_wrapper(input: TokenStream) -> TokenStream {
    into_prop_enum_refs_derive(input)
}

/// Derives an implementation of the `ComponentState` trait and auxillary functions.
///
/// The derive macro is designed to be applied to the struct defining the DoenetML component itself
/// as well as the struct defining the component's props.
///
/// The macro assumes that the component struct has a field `state` that contains
/// the component props struct.
///
/// The macro assumes all fields of the component props struct are props `Prop<T>`.
///
/// The following attributes specify properties of props in the component props structure.
/// - #\[for_renderer\]
///
///   Designate the prop as one that will be sent to the renderer.
///   If `for_renderer` is set, the value of the prop will be added to the `RenderedState`
///   structure for the component that is sent to the renderer
///
/// - #\[is_public\]
///
///   Designate that the prop is public, in the sense that it can be
///   accessed by a ref in the document.
///
/// - #\[component_profile_prop\]
///
///   Designate that the prop can be used to satisfy the [`ComponentProfile`]
///   that corresponds to the prop's type.
///
///   If a parent has a `Child` or `AttributeChild` data query, it will request
///   a particular profile type, and this prop could be returned.
///
///   Currently, the `component_profile props` does not have a mechanism for specifying
///   priority in case more than one prop matches what a parent is requesting.
///   If there is more than one match, the prop that appears first in the ordering of
///   the fields of the struct will be selected.
#[proc_macro_derive(
    ComponentState,
    attributes(for_renderer, is_public, component_profile_prop, default_prop)
)]
pub fn component_state_derive_wrapper(input: TokenStream) -> TokenStream {
    component_state_derive(input)
}

/// Derives the RenderedState enum
///
/// This derive macro is designed to be applied to the `ComponentEnum` listing all component types.
///
/// It creates a parallel `RenderedState` enum whose variant names and field types
/// are based on the variant names from the `ComponentEnum`.
///
/// The variant names append `State` to the variant from `ComponentEnum`.
///
/// The field types prepend `Rendered` to the variant names. These structures
/// are created by the `ComponentState` macro applied
/// to the components prop struct.
///
/// For example, the component type `Text` has a `TextState` struct,
/// and the `ComponentState` macro creates the `RenderedTextState` struct.
/// Since the `ComponentEnum` has a `Text` variant, the `RenderedState` macros
/// adds the variant `TextState(RenderedTextState)`
/// to the `RenderedState` enum.
#[proc_macro_derive(RenderedState)]
pub fn rendered_state_derive_wrapper(input: TokenStream) -> TokenStream {
    rendered_state_derive(input)
}

#[proc_macro_derive(PropDependencies)]
pub fn prop_dependencies_derive_wrapper(input: TokenStream) -> TokenStream {
    prop_dependencies_derive(input)
}

#[proc_macro_derive(PropDataQueries)]
pub fn prop_data_queries_derive_wrapper(input: TokenStream) -> TokenStream {
    prop_data_queries_derive(input)
}

#[proc_macro_attribute]
pub fn add_dependency_data(attr: TokenStream, item: TokenStream) -> TokenStream {
    add_dependency_data_impl(attr, item)
}
