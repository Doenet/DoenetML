use enum_dispatch::enum_dispatch;

use crate::components::prelude::{
    QueryUpdateRequests, StateVarView, StateVarViewEnum, TryFromState,
};

/// Convert string to boolean
///
/// The word "true" (case-insensitive) becomes `true`.
/// If `empty_is_true` is `true`, then an empty string also becomes `true`.
/// All other strings become `false`.
pub fn string_to_boolean(s: &str) -> bool {
    s.eq_ignore_ascii_case("true")
}

/// Convert string to boolean
///
/// The word "true" (case-insensitive) becomes `true`.
/// If `empty_is_true` is `true`, then an empty string also becomes `true`.
/// All other strings become `false`.
pub fn string_attr_to_boolean(s: &str) -> bool {
    s.eq_ignore_ascii_case("true") || (s.is_empty())
}

/// A boolean or string state var view
#[derive(Debug)]
#[enum_dispatch(QueryUpdateRequests)]
pub enum BooleanOrString {
    Boolean(StateVarView<bool>),
    String(StateVarView<String>),
}

// We implement TryFromState
// because all RequiredData must implement this trait.
// (Needed to create the RequiredData from the information sent the state variable)
impl TryFromState<StateVarViewEnum> for BooleanOrString {
    type Error = &'static str;

    fn try_from_state(value: &StateVarViewEnum) -> Result<Self, Self::Error> {
        match value {
            StateVarViewEnum::Boolean(boolean_sv) => Ok(BooleanOrString::Boolean(
                boolean_sv.create_new_read_only_view(),
            )),
            StateVarViewEnum::String(string_sv) => Ok(BooleanOrString::String(
                string_sv.create_new_read_only_view(),
            )),
            _ => Err("BooleanOrString can only be a boolean or string state variable"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_string_to_boolean() {
        assert_eq!(string_to_boolean(""), false);
        assert_eq!(string_to_boolean(" "), false);
        assert_eq!(string_to_boolean("true"), true);
        assert_eq!(string_to_boolean("tRUe"), true);
        assert_eq!(string_to_boolean("false"), false);
        assert_eq!(string_to_boolean("t"), false);
        assert_eq!(string_to_boolean("T"), false);
    }

    #[test]
    fn test_string_attr_to_boolean() {
        assert_eq!(string_attr_to_boolean(""), true);
        assert_eq!(string_attr_to_boolean(" "), false);
        assert_eq!(string_attr_to_boolean("true"), true);
        assert_eq!(string_attr_to_boolean("tRUe"), true);
        assert_eq!(string_attr_to_boolean("false"), false);
        assert_eq!(string_attr_to_boolean("t"), false);
        assert_eq!(string_attr_to_boolean("T"), false);
    }
}
