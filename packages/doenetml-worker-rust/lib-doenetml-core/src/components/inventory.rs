//! A listing of every component the Rust core implements, with its attributes,
//! props and actions, for comparing the Rust core against the JavaScript one.
//!
//! Run `cargo run -p doenetml-core --example component_inventory` to print it
//! as JSON.

use serde::Serialize;
use strum::IntoEnumIterator;

use super::{
    ComponentActions, ComponentAttributes, ComponentEnum, ComponentNode, ComponentVariantProps,
    types::LocalPropIdx,
};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ComponentInventory {
    /// The component's name in DoenetML (camelCase), e.g. `textInput`.
    pub name: String,
    /// Whether this is an internal component (`_error`, `_ref`, ...) that
    /// cannot be authored directly.
    pub internal: bool,
    pub attributes: Vec<String>,
    pub props: Vec<PropInventory>,
    pub actions: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PropInventory {
    pub name: String,
    /// Whether the prop can be referenced from DoenetML, e.g. `$m.latex`.
    pub public: bool,
    pub value_type: String,
}

/// Every component the Rust core implements.
pub fn component_inventory() -> Vec<ComponentInventory> {
    ComponentEnum::iter()
        .map(|component| {
            let name = component.get_component_type().to_string();
            ComponentInventory {
                internal: name.is_empty() || name.starts_with('_'),
                name,
                attributes: component
                    .get_attribute_names()
                    .into_iter()
                    .map(|name| name.to_string())
                    .collect(),
                props: (0..component.get_num_props())
                    .map(|idx| {
                        let idx = LocalPropIdx::new(idx);
                        PropInventory {
                            name: component.get_prop_name(idx).to_string(),
                            public: component.get_prop_is_public(idx),
                            value_type: format!("{:?}", component.get_prop_value_type(idx)),
                        }
                    })
                    .collect(),
                actions: component
                    .get_action_names()
                    .iter()
                    .map(|name| name.to_string())
                    .collect(),
            }
        })
        .collect()
}
