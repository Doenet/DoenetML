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
