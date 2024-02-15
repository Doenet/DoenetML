use enum_dispatch::enum_dispatch;

use crate::components::prelude::{PropView, PropViewEnum, QueryUpdateRequests, TryFromState};

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

/// A boolean or string prop view
#[derive(Debug)]
#[enum_dispatch(QueryUpdateRequests)]
pub enum BooleanOrString {
    Boolean(PropView<bool>),
    String(PropView<String>),
}

// We implement TryFromState
// because all RequiredData must implement this trait.
// (Needed to create the RequiredData from the information sent the prop)
impl TryFromState<PropViewEnum> for BooleanOrString {
    type Error = &'static str;

    fn try_from_state(value: &PropViewEnum) -> Result<Self, Self::Error> {
        match value {
            PropViewEnum::Boolean(boolean_prop) => Ok(BooleanOrString::Boolean(
                boolean_prop.create_new_read_only_view(),
            )),
            PropViewEnum::String(string_prop) => Ok(BooleanOrString::String(
                string_prop.create_new_read_only_view(),
            )),
            _ => Err("BooleanOrString can only be a boolean or string prop"),
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
