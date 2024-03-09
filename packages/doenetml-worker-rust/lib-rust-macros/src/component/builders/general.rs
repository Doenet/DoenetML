//! Methods used in construction of the `component`s module that are common across data structures
//! (i.e., `struct Component`, `enum Actions`, `enum Attributes`, and `enum Props`.

use convert_case::{Case, Casing};
use proc_macro2::Ident;
use quote::format_ident;
use syn::Path;

use super::super::component_mod::ComponentModule;

impl ComponentModule {
    /// The names of all actions defined on this component
    pub fn get_action_names(&self) -> Vec<String> {
        self.actions.as_ref().map_or(vec![], |actions| {
            actions
                .variants
                .iter()
                .map(|x| x.ident.to_string().to_case(Case::Snake))
                .collect()
        })
    }

    /// The names of all props defined on this component
    pub fn get_prop_names(&self) -> Vec<String> {
        self.props.as_ref().map_or(vec![], |props| {
            props
                .variants
                .iter()
                .map(|x| x.ident.to_string().to_case(Case::Camel))
                .collect()
        })
    }

    /// The profile of all props defined on this component
    pub fn get_prop_profiles(&self) -> Vec<Option<Path>> {
        self.props
            .as_ref()
            .map_or(vec![], |props| props.get_prop_profiles())
    }

    /// The `for_render` property of all props defined on this component
    pub fn get_prop_for_renders(&self) -> Vec<bool> {
        self.props
            .as_ref()
            .map_or(vec![], |props| props.get_prop_for_renders())
    }

    /// The `is_public` property of all props defined on this component
    pub fn get_prop_is_publics(&self) -> Vec<bool> {
        self.props
            .as_ref()
            .map_or(vec![], |props| props.get_prop_is_publics())
    }

    /// The `is_public` property of all props defined on this component
    pub fn get_prop_value_types(&self) -> Vec<Path> {
        self.props
            .as_ref()
            .map_or(vec![], |props| props.get_prop_value_types())
    }

    /// The names of all attributes defined on this component
    pub fn get_attribute_names(&self) -> Vec<String> {
        self.attributes.as_ref().map_or(vec![], |attributes| {
            attributes
                .variants
                .iter()
                .map(|x| x.ident.to_string().to_case(Case::Camel))
                .collect()
        })
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
}
