//! Parse the `mod component {...}` module.

use darling::FromAttributes;
use proc_macro2::{Ident, TokenStream};
use quote::{format_ident, quote};

use crate::component_module::utils::doc_comment_from_attrs;

use super::{actions::ActionsEnum, attributes::AttributesEnum, props::PropsEnum};

/// A parsed `mod component {...}` module that has been decorated with a `#[component(...)]` macro.
#[derive(Debug)]
pub struct ComponentModule {
    /// The name of the module itself. E.g., the `foo` in `mod foo { ... }`
    module_name: String,
    /// The content of the module that has not been extracted to produce the structs/enums.
    /// This contains, for example, the `use` import statements.
    remaining_module_content: syn::ItemMod,

    //
    // The content defined in the `#[component(...)]` macro's arguments
    //
    /// The component name (in PascalCase).
    pub name: String,
    /// The value of the `ref_transmutes_to` field.
    pub ref_transmutes_to: Option<String>,
    /// The value of the `extend_via_default_prop` field.
    pub extend_via_default_prop: bool,

    //
    // The content defined _inside_ the module
    //
    /// The `enum Actions` that was defined in the module.
    pub actions: ActionsEnum,
    /// The `enum Attributes` that was defined in the module.
    pub attributes: AttributesEnum,
    /// The `enum Props` that was defined in the module.
    pub props: PropsEnum,
}

/// This defines the `#[component(name = "...")]` macro
/// that is placed in front of the `component` module.
#[derive(Debug, FromAttributes)]
#[darling(attributes(component))]
pub struct ComponentMacroVariant {
    name: Ident,
    ref_transmutes_to: Option<Ident>,
    #[darling(default)]
    extend_via_default_prop: bool,
}

impl ComponentModule {
    /// Parse the `#[component(...)] mod component {...}` macro and the module content to produce a `ComponentModule`.
    pub fn from_module(mut module: syn::ItemMod) -> syn::Result<Self> {
        let component_macro: ComponentMacroVariant =
            ComponentMacroVariant::from_attributes(&module.attrs)?;
        let name = component_macro.name.to_string();

        let props = PropsEnum::extract_from_module(&mut module)?;
        let actions = ActionsEnum::extract_from_module(&mut module)?;
        let attributes = AttributesEnum::extract_from_module(&mut module)?;

        let module_name = module.ident.to_string();

        Ok(Self {
            module_name,
            remaining_module_content: module,
            name,
            ref_transmutes_to: component_macro.ref_transmutes_to.map(|x| x.to_string()),
            extend_via_default_prop: component_macro.extend_via_default_prop,
            props,
            actions,
            attributes,
        })
    }

    /// Re-export the named structs with generic names `Component`, `Actions`, `Attributes`, and `Props`.
    pub fn get_type_aliases(&self) -> TokenStream {
        let (component_name, actions_name, attributes_name, props_name) =
            self.get_component_idents();

        quote! {
            pub type Component = #component_name;
            pub type Actions = #actions_name;
            pub type Attributes = #attributes_name;
            pub type Props = #props_name;
        }
    }

    /// Returns the `Ident` of `(Component, Actions, Attributes, Props)`, in that order.
    /// `Component` is the name of the component. Other names are all prefixed with the component name.
    /// e.g., if the component name was `Text`, this would return `(Text, TextActions, TextAttributes, TextProps)`.
    pub fn get_component_idents(&self) -> (Ident, Ident, Ident, Ident) {
        let component_name = format_ident!("{}", self.name);
        let actions_name = format_ident!("{}Actions", self.name);
        let attributes_name = format_ident!("{}Attributes", self.name);
        let props_name = format_ident!("{}Props", self.name);

        (component_name, actions_name, attributes_name, props_name)
    }

    /// Generate the actual `mod component {...}` module.
    pub fn generate_module(&self) -> syn::Result<TokenStream> {
        let module_name = format_ident!("{}", &self.module_name);
        // Whether it is `pub mod` or not
        let module_vis = &self.remaining_module_content.vis;
        let empty_vec = vec![];
        let remaining_module_content =
            extract_content(&self.remaining_module_content).unwrap_or(&empty_vec);

        let component = self.generate_component_and_impls();
        let component_doc_comments = self.generate_component_doc_comments();
        let actions = self.generate_actions_and_impls();
        let attributes = self.generate_attributes_and_impls();
        let props = self.generate_props_and_impls();

        let type_aliases = self.get_type_aliases();

        Ok(quote! {
            // TODO: whether or not component is pub should depend one what was entered.
            // Also, presumably the name should the original name and not be hard-coded as `component`
            #module_vis mod #module_name {
                #(#remaining_module_content)*

                use crate::components::prelude::*;

                #[doc = #component_doc_comments]
                #component
                #actions
                #attributes
                #props

                #type_aliases
            }
        })
    }

    fn generate_component_doc_comments(&self) -> String {
        let mut doc_comments =
            doc_comment_from_attrs(&self.remaining_module_content.attrs).unwrap_or_default();

        match (
            self.extend_via_default_prop,
            self.props.get_default_prop_local_index(),
        ) {
            (true, Some(idx)) => {
                let default_prop = &self.props.get_prop_names()[idx];
                doc_comments.push_str(&format!("\n\nWhen this component is extended by a different component, the `{default_prop}` prop is implicitly used."));
            }
            _ => {
                // No explanation needed
            }
        }

        match self.ref_transmutes_to.as_ref() {
            Some(ref_transmutes_to) => {
                doc_comments.push_str(&format!(
                    r#"Bare references to this component are rendered as the <{}> component. E.g., `<{} name="a"/>$a` becomes `<{} name="a"/><{} extend="$a"/>`"#,
                    ref_transmutes_to, &self.name, &self.name, ref_transmutes_to
                ));
            }
            None => {
                // No explanation needed
            }
        }
        doc_comments
    }
}

/// Get the `...` contents inside a `mod foo {...}`.
fn extract_content(item_mod: &syn::ItemMod) -> Option<&Vec<syn::Item>> {
    item_mod.content.as_ref().map(|(_, items)| items)
}
