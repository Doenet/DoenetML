use crate::{
    components::prelude::{DataQuery, StateVarIdx},
    ExtendSource,
};

pub fn create_data_query_if_match_extend_source(
    extending: Option<ExtendSource>,
    state_var_idx: StateVarIdx,
) -> Option<DataQuery> {
    extending.and_then(|extend_source| match extend_source {
        ExtendSource::StateVar(description) => description
            .state_variable_matching
            .iter()
            .find(|state_var_match| {
                // We look for a state variable match where shadowing_idx is state_var_idx.
                state_var_match.shadowing_state_var_idx == state_var_idx
            })
            // If found a match to state_var_idx,
            // we shadow component and state variable indicated from the extend source.
            .map(|var| DataQuery::StateVar {
                component_idx: Some(description.component_idx),
                state_var_idx: var.shadowed_state_var_idx,
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
