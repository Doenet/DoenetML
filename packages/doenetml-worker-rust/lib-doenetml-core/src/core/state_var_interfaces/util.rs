use crate::{
    components::prelude::{DependencyInstruction, StateVarIdx, StateVarParameters},
    ExtendSource,
};

pub fn create_dependency_instruction_from_extend_source(
    extending: Option<&ExtendSource>,
    parameters: &StateVarParameters,
    state_var_idx: StateVarIdx,
) -> Option<DependencyInstruction> {
    if let Some(ExtendSource::StateVar(extend_state_var_description)) = extending {
        for state_var_match in extend_state_var_description.state_variable_matching.iter() {
            if state_var_match
                .shadowing_idx
                .map(|sv_idx| sv_idx == state_var_idx)
                .unwrap_or(parameters.is_primary_state_variable_for_shadowing_extend_source)
            {
                // Either
                // 1. shadowing index was supplied and it matches the index of the state variable, or
                // 2. shadowing index was not supplied and this variable is the primary state variable
                //    for use when shadowing extend sources.
                // Therefore, we shadow the extend source.

                return Some(DependencyInstruction::StateVar {
                    component_idx: Some(extend_state_var_description.component_idx),
                    state_var_idx: state_var_match.shadowed_idx,
                });
            }
        }
    }
    None
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
