mod latex;

pub use latex::LatexValueProp;

use crate::components::prelude::*;
use crate::general_prop::MathProp;
use crate::state::types::math_expr::{MathExpr, MathParser};

use super::MathAttribute;

/// The state variables that underlie the `<math>` component.
#[derive(Debug, ComponentState)]
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
    #[is_public]
    #[component_profile_prop]
    value: Prop<MathExpr>,

    #[is_public]
    #[for_renderer]
    latex: Prop<String>,

    #[is_public]
    split_symbols: Prop<bool>,
}

impl MathState {
    fn new() -> Self {
        MathState {
            value: MathProp::new_from_children(
                MathExpr::default(),
                MathParser::Text,
                MathState::get_split_symbols_data_query(),
                vec![],
            )
            .into_prop(),
            latex: LatexValueProp::new().into_prop(),
            split_symbols: MathAttribute::SplitSymbols.prop(),
        }
    }
}

impl Default for MathState {
    fn default() -> Self {
        MathState::new()
    }
}
