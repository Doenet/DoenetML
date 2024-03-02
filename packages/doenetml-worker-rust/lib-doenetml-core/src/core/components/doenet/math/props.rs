use crate::components::prelude::*;
use crate::general_prop::{LatexProp, MathProp};
use crate::state::types::math_expr::{MathExpr, MathParser};

use super::MathAttribute;

/// The state variables that underlie the `<math>` component.
#[derive(Debug, ComponentProps)]
pub struct MathState {
    /// The value of the `<math>` component.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.value`.
    ///
    /// It is marked `for_renderer` to send this value to the renderer of the `<math>` component.
    ///
    /// It is marked as a component profile state variable,
    /// which means this state variable will be used if a parent of a `<math>` component
    /// queries for children with the `Math` component profile.
    ///
    /// It is marked `default_prop`, which in combination with the component being marked `extend_via_default_prop`,
    /// means the `value` prop will be used if a `<math>` is extended to another component type.
    #[is_public]
    #[component_profile_prop]
    #[default_prop]
    value: Prop<MathExpr>,

    /// A representation of `value` as a Latex string
    #[is_public]
    #[for_renderer]
    latex: Prop<String>,

    /// If true, then split multi-characters symbols that don't contain numbers into the product of their characters.
    #[is_public]
    split_symbols: Prop<bool>,
}

impl MathState {
    fn new() -> Self {
        MathState {
            value: MathProp::new_from_children(
                MathExpr::default(),
                // TODO: specify parser via attribute once we implement enum attributes and props
                MathParser::Text,
                MathState::get_split_symbols_data_query(),
                // TODO: specify function_symbols via attribute once we implement array attributes and props
                vec!["f".to_string(), "g".to_string()],
            )
            .into_prop(),
            latex: LatexProp::new(MathState::get_value_data_query()).into_prop(),
            split_symbols: MathAttribute::SplitSymbols.prop(),
        }
    }
}

impl Default for MathState {
    fn default() -> Self {
        MathState::new()
    }
}
