use crate::{
    components::prelude::{DataQuery, StateVarIdx},
    ExtendSource,
};

/// If `extending` indicates that the state variable with `state_var_idx` is shadowing another variable,
/// then create a `DataQuery` requesting the value of the shadowed variable.
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
/// The word "true" (case-insensitive) becomes `true`.
/// If `empty_is_true` is `true`, then an empty string also becomes `true`.
/// All other strings become `false`.
pub fn string_to_boolean(s: &str, empty_is_true: bool) -> bool {
    s.eq_ignore_ascii_case("true") || (empty_is_true && s.is_empty())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_string_to_boolean() {
        assert_eq!(string_to_boolean("", true), true);
        assert_eq!(string_to_boolean("", false), false);
        assert_eq!(string_to_boolean(" ", true), false);
        assert_eq!(string_to_boolean("true", false), true);
        assert_eq!(string_to_boolean("tRUe", false), true);
        assert_eq!(string_to_boolean("false", false), false);
        assert_eq!(string_to_boolean("t", false), false);
        assert_eq!(string_to_boolean("T", false), false);
    }
}
