extern crate proc_macro2;

use component::parse_module::parse_module;
use component_attributes::attribute_prop_derive;
use proc_macro::TokenStream;
use quote::quote;

mod component;
mod component_attributes;

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

/// Derives an implementation of the `ComponentProps` trait and auxillary functions.
///
/// The derive macro is designed to be applied to the struct defining the DoenetML component itself
/// as well as the struct defining the component's props.
///
/// The macro assumes that the component struct has a field `props` that contains
/// the component props struct.
///
/// The macro assumes all fields of the component props struct are props `Prop<T>`.
///
//#[proc_macro_derive(
//    ComponentProps,
//    attributes(for_renderer, is_public, component_profile_prop, default_prop)
//)]
//pub fn component_props_derive_wrapper(input: TokenStream) -> TokenStream {
//    component_props_derive(input)
//}

/// The building blocks of a component
/// ## Options
///  - `#[component(ref_transmutes_to = "...")]` - The name of the component that should be used to
///    render a direct reference to this component. E.g. in `<textInput name="i"/>$i`, the `$i`
///    should be rendered as a `<text extend="$i"/>` rather than a `<textInput extend="$i"/>`.
///    Setting `#[component(ref_transmutes_to = "Text")]` will do this.
///    
///
/// FROM OLD DOCSTRING:
/// ```text
/// The following attributes specify properties of props in the component props structure.
/// - #\[for_renderer\]
///
///   Designate the prop as one that will be sent to the renderer.
///   If `for_renderer` is set, the value of the prop will be added to the `RenderedProps`
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
///   
///
/// Accessible with `#[component(ref_transmutes_to = "new_name")]`.
/// Indicates what component a reference should become. For example
/// `<textInput name="a"/>$a`, one may want `$a` to appear as a `Text` by default,
/// rather than a `TextInput`. In this case, you would set `ref_transmutes_to = "Text"`.
///
/// Accessible via `#[component(extend_via_default_prop)]`.
/// Indicates that, when a component is extended into a different component type,
/// it should use its default prop to create an `Extending::Prop` link
/// rather than an `Extending::Component` link.
///
/// For example, with `<textInput name="a"/><text extend="$a" />`,
/// the extension to `<text>` uses the `value` prop of the textInput,
/// i.e., equivalent `<textInput name="a"/><text extend="$a.value" />`.
///```
/// XXX: Finish doc.
#[proc_macro_attribute]
pub fn component(attr: TokenStream, item: TokenStream) -> TokenStream {
    let item = proc_macro2::TokenStream::from(item);
    let attr = proc_macro2::TokenStream::from(attr);

    // The function is meant to be called on the full tree with the
    // `#[component(...)]` intact. So, we reconstruct it here.
    let combined = quote! {
        #[component(#attr)]
        #item
    };

    //panic!("{}", attr);

    parse_module(combined).into()
}
