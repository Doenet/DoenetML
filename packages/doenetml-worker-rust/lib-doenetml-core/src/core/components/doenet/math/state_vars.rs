mod latex;

pub use latex::LatexValueStateVar;

use crate::components::prelude::*;
use crate::general_state_var::{MathStateVar, StateVarAlias};
use crate::state::types::math_expr::{MathExpr, MathParser};

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
    #[component_profile_state_variable]
    value: StateVar<MathExpr>,

    /// An alias to the `value` state variable.
    ///
    /// It is marked `is_public` so that it can be referenced in DoenetML via `.math`.
    #[is_public]
    math: StateVar<MathExpr>,

    #[is_public]
    #[for_renderer]
    latex: StateVar<String>,
}

impl MathState {
    fn new() -> Self {
        MathState {
            value: MathStateVar::new_from_children(
                MathExpr::default(),
                MathParser::Text,
                true,
                vec![],
            )
            .into_state_var(),
            math: StateVarAlias::new(MathState::get_value_state_variable_index()).into_state_var(),
            latex: LatexValueStateVar::new().into_state_var(),
        }
    }
}

impl Default for MathState {
    fn default() -> Self {
        MathState::new()
    }
}
