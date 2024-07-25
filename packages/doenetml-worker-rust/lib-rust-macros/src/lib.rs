extern crate proc_macro2;

use component_module::generate_component_module;
use data_query_results::{generate_into_data_query_results, generate_try_from_data_query_results};
use proc_macro::TokenStream;
use quote::quote;
use test_data_query_types::test_data_query_types_derive;

mod component_module;
mod data_query_results;
mod test_data_query_types;
mod try_from_ref;

/// Create a _DoenetML_ _Component_ from a decorated module. This macro creates required structs/enums
/// from a module containing a declaration of a _DoenetML_ component.
///
/// By decorating a "component-description" module with `#[component(name = Foo, ...)]`,
/// this macro will create the component struct `Foo` as well as enums `FooProps`, `FooAttributes`, and `FooActions`
/// corresponding to the props, attributes, and actions of the component that were specified (or empty enum if nothing
/// was specified). These generated structs/enums should be re-exported by component authors.
///
/// ### Example (Basic)
/// ```ignore
/// #[component(name = MyComponent)]
/// mod component {}
///
/// pub use component::MyComponent;
/// pub use component::MyComponentActions;
/// pub use component::MyComponentAttributes;
/// pub use component::MyComponentProps;
/// ```
/// Note the re-exporting of the generated structs/enums. This is good practice to be consistent
/// with the rest of the DoenetML Rust code.
///
/// ### Example (With Props)
/// ```ignore
/// #[component(name = MyComponent)]
/// mod component {
///    enum Props {
///      #[prop(
///          value_type = PropValueType::String,
///          is_public,
///          profile = PropProfile::String,
///          default
///      )]
///      Value,
///   }
/// }
/// pub use component::MyComponent;
/// pub use component::MyComponentActions;
/// pub use component::MyComponentAttributes;
/// pub use component::MyComponentProps;
/// ```
/// In this example, `MyComponent` will have a prop `value` (note how Rust's PascalCase is converted to camelCase).
/// Its value type is String that is marked as public, and it satisfies the `PropProfile::String` profile. It is also
/// marked as the (unique) default prop.
///
/// ## Usage
///
/// ### `#[component(name = ...)]`
///
/// This macro annotates a module (normally called `component`). For example
/// ```ignore
/// #[component(name = MyComponent)]
/// mod component {
///   // ...
/// }
/// ```
///  It has the following options:
/// - `name = ...` - Required; the name of your component in PascalCase supplied as an unquoted string. E.g. `name = MyComponent`.
/// - `ref_transmutes_to = ...` - Optional; supplied as an unquoted string. If this component is used directly as a reference (i.e. using `$foo`
///   syntax), then instead of creating a component `<self>`, create the component specified by `ref_transmutes_to`.
///   This is used, for example, in the `textInput` component where the code `<textInput name="a"/>$a` should render as
///   `<textInput name="a"/><text extend="$a"/>` rather than `<textInput name="a"/><textInput extend="$a"/>`.
///
/// ### `#[attribute(...)]`
///
/// This macro is used to decorate an attribute inside the `Attributes` struct. For example
/// ```ignore
/// #[component(name = MyComponent)]
/// mod component {
///   enum Attributes {
///     #[attribute(prop = BooleanProp, default = false)]
///     Disabled,
///   }
/// }
/// ```
///
/// It has the following options:
/// - `prop = ...` - Required; the prop that will process this attribute's value. It can be a general prop (e.g. `BooleanProp` or
///   `StringProp`) or a custom prop defined elsewhere.
/// - `default = ...` - Required; the default value of the attribute. For strings use `String::new()`, for other types, you can specify
///   their value literally.
/// - `explicit_type = ...` - Optional; the type of the attribute. If not provided, the type will be inferred from the `prop` attribute.
/// - `preserve_refs` - Optional; if set, the references in this attribute will not be expanded into components. Instead, they will become
///   an internal-use-only `_ref` component which preserves a pointer back to the referent component.
///
/// ### `#[prop(...)]`
///
/// This macro is used to decorate a prop inside the `Props` struct. For example
/// ```ignore
/// #[component(name = MyComponent)]
/// mod component {
///   enum Props {
///     #[prop(
///       value_type = PropValueType::String,
///       is_public,
///       profile = PropProfile::String
///     )]
///     Value,
///   }
/// }
/// ```
///
/// It has the following options:
/// - `value_type = ...` - Required; the type of the prop. It should be specified as one of the `PropValueType::...` variants.
/// - `is_public` - Optional; if set, the prop will be accessible by a ref in the document. E.g. with `$foo.prop`.
/// - `profile = ...` - Optional; the profile that the prop satisfies. It should be specified as one of the `PropProfile::...` variants.
///   If set, this prop will match [`DataQuery`]s for the specified profile.
/// - `default` - Optional; if set, this prop will be the default prop for the component. Only **one** prop can be the default prop.
/// - `for_render` or `for_render(...)` - Optional. If specify `for_render` without arguments, this prop will always be sent to the renderer, whether in a graph or in text.
///   If specify `for_render(in_graph)` or `for_render(in_text)`, the prop will be sent to the renderer only if the component is in a graph or in text.
///   If `for_render` is not given, this prop will be not included in data sent to the UI.
///
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

    match generate_component_module(combined) {
        Ok(tokens) => tokens.into(),
        Err(e) => e.to_compile_error().into(),
    }
}

/// Allow a typed struct to be created from [`DataQueryResults`].
///
/// You must specify the `query_trait = ...` attribute. If you specify
/// `#[data_query(query_trait = Foo)]`, then a `Foo` trait will be created.
/// You must implement this trait for your struct.
///
/// The trait will define a `*_query` function for each field of your struct,
/// and your implementation must return a `DataQuery` corresponding to each field.
///
/// ### Options
/// - `query_trait = ...` - Required; the name of the trait that will be created.
/// - `pass_data = ...` - Optional; the type of data that should be passed to each `*_query` functions.
///   If provided, the `*_query` functions will have the signature `*_query(&self, arg: <PassDataType>)`,
///   and you must pass in the specified data when calling `to_data_queries(...)`.
///
/// ## Example
/// ```ignore
/// #[derive(TryFromDataQueryResults)]
/// #[data_query(query_trait = CreateDataQueries)]
/// struct RequiredData {
///     foo: PropView<String>,
///     bar: PropView<f32>,
/// }
/// // You must implement the `CreateDataQueries` trait for the struct
/// // to specify the data queries used for each field.
/// impl CreateDataQueries for RequiredData {
///     fn foo_query(&self) -> DataQuery {
///         // The simplest `DataQuery`
///         DataQuery::State
///     }
///     fn bar_query(&self) -> DataQuery {
///         DataQuery::State
///     }
/// }
/// ```
///
#[proc_macro_derive(TryFromDataQueryResults, attributes(data_query))]
pub fn try_from_data_query_results(input: TokenStream) -> TokenStream {
    match generate_try_from_data_query_results(input.into()) {
        Ok(tokens) => tokens.into(),
        Err(e) => e.to_compile_error().into(),
    }
}

/// Allow a typed struct to be converted into [`DataQueryResults`].
/// The struct should have been created with [`TryFromDataQueryResults::try_from_data_query_results`].
///
///
/// ## Example
/// ```ignore
/// #[derive(IntoDataQueryResults, TryFromDataQueryResults)]
/// #[data_query(query_trait = CreateDataQueries)]
/// struct RequiredData {
///     foo: PropView<String>,
///     bar: PropView<f32>,
/// }
/// // You must implement the `CreateDataQueries` trait for the struct
/// // to specify the data queries used for each field.
/// impl CreateDataQueries for RequiredData {
///     fn foo_query(&self) -> DataQuery {
///         // The simplest `DataQuery`
///         DataQuery::State
///     }
///     fn bar_query(&self) -> DataQuery {
///         DataQuery::State
///     }
/// }
///
/// fn main(d: DataQueryResults) {
///     let required_data = RequiredData::try_from_data_query_results(d);
///     // You can convert back to `DataQueryResults`.
///     let data_query_results = required_data.into_data_query_results();
/// }
/// ```
///
#[proc_macro_derive(IntoDataQueryResults)]
pub fn into_data_query_results(input: TokenStream) -> TokenStream {
    match generate_into_data_query_results(input.into()) {
        Ok(tokens) => tokens.into(),
        Err(e) => e.to_compile_error().into(),
    }
}

/// On an enum, implement `TryFrom<&Inner> for &Inner`. For example
/// ```ignore
/// #[derive(TryFromRef)]
/// enum MyEnum {
///   A(i32),
///   B(String),
/// }
///
/// let a = MyEnum::A(5);
/// let a_inner: &i32 = (&a).try_into().unwrap();
/// ```
///
/// This function is used for `PropValue` conversion and produces implementations similar to
/// ```ignore
/// impl<'a> TryFrom<&'a PropValue> for &'a i64 {
///     type Error = anyhow::Error;
///
///     fn try_from(value: &'a PropValue) -> Result<Self, Self::Error> {
///         match value {
///             PropValue::Integer(x) => Ok(x),
///             _ => Err(anyhow::anyhow!("Expected Integer")),
///         }
///     }
/// }
/// ```
#[proc_macro_derive(TryFromRef)]
pub fn try_from_ref_derive_wrapper(item: TokenStream) -> TokenStream {
    let item = proc_macro2::TokenStream::from(item);

    match try_from_ref::try_from_ref_derive(item) {
        Ok(tokens) => tokens.into(),
        Err(e) => e.to_compile_error().into(),
    }
}

/// On a struct, implement the `TestDataQueryTypes` trait. In addition to the trait implementation,
/// this macro also implements a `#[test]` test function that checks the consistency between the
/// declared types of a `PropView<T>` and the types that the specified data queries return.
///
/// When not running tests, this macro does nothing.
///
/// ## Example
/// ```ignore
/// #[derive(TestDataQueryTypes, TryFromDataQueryResults)]
/// #[data_query(query_trait = RequiredDataQueries)]
/// #[owning_component(MyComponent)]
/// struct RequiredData {
///    rendered_children: PropView<component::props::types::RenderedChildren>,
/// }
///
/// impl RequiredDataQueries for RequiredData {
///  // ...
/// }
/// ```
///
/// This macro wll then produce code similar to
/// ```ignore
/// impl TestDataQueryTypes for RequiredData {
///   const _DECLARED_DATA_QUERY_TYPES: &'static [(&'static str, Option<PropValueType>)] = &[
///       ("rendered_children", <PropView<component::props::types::RenderedChildren>>::PROP_VALUE_TYPE),
///   ];
///   const _STRUCT_NAME: &'static str = "RequiredData";
/// }
/// #[cfg(test)]
/// #[test]
/// fn test_data_query_types() {
///    RequiredData::_test_data_query_types::<MyComponent>();
/// }
/// ```
#[proc_macro_derive(TestDataQueryTypes, attributes(owning_component))]
pub fn test_data_query_types_wrapper(item: TokenStream) -> TokenStream {
    let item = proc_macro2::TokenStream::from(item);

    match test_data_query_types_derive(item) {
        Ok(tokens) => tokens.into(),
        Err(e) => e.to_compile_error().into(),
    }
}
