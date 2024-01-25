use crate::{
    components::prelude::{DependencyInstruction, StateVarIdx},
    ExtendSource,
};

pub fn create_dependency_instruction_if_match_extend_source(
    extending: Option<ExtendSource>,
    is_primary_state_variable: bool,
    state_var_idx: StateVarIdx,
) -> Option<DependencyInstruction> {
    extending.and_then(|extend_source| match extend_source {
        ExtendSource::StateVar(description) => description
            .state_variable_matching
            .iter()
            .find(|state_var_match| {
                // We look for a state variable match where shadowing_idx is state_var_idx.
                // If shadowing_idx is None, then check if is_primary_state_variable,
                // because shadowing_idx==None means match the primary state variable.
                state_var_match
                    .shadowing_idx
                    .map(|sv_idx| sv_idx == state_var_idx)
                    .unwrap_or(is_primary_state_variable)
            })
            // Either
            // 1. shadowing index was supplied and it matches the index of the state variable, or
            // 2. shadowing index was not supplied and this variable is the primary state variable.
            // Therefore, we shadow the extend source.
            .map(|var| DependencyInstruction::StateVar {
                component_idx: Some(description.component_idx),
                state_var_idx: var.shadowed_idx,
            }),
        _ => None,
    })
}

/// Convert string to boolean
///
/// The word "true" (case-insensitive) or an empty string become true.
/// All other strings become false.
///
/// TODO: the empty string is try so that attribute="" sets the boolean attribute to true.
/// Are there other cases where we'd want the empty string to be false?
/// For example, an empty `<textInput>` becomes true with this algorithm,
/// which may be confusing for authors. Not sure how to treat that case differently.
pub fn string_to_boolean(s: &str) -> bool {
    s.eq_ignore_ascii_case("true") || s.is_empty()
}
