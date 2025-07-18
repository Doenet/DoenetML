/// A list marker. This is used by both `<ol>` and `<ul>` elements.
/// They are named similarly to their [HTML equivalents](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type).
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub enum ListMarker {
    // Ordered list
    /// Label with a number, starting at `start`. e.g. `1`, `2`, `3`, ...
    Decimal { start: u8 },
    /// Label with lower case letters. e.g. `a`, `b`, `c`, ...
    LowerAlpha,
    /// Label with lower case roman numerals. e.g. `i`, `ii`, `iii`, ...
    LowerRoman,
    /// Label with upper case letters. e.g. `A`, `B`, `C`, ...
    UpperAlpha,
    /// Label with upper case roman numerals. e.g. `I`, `II`, `III`, ...
    UpperRoman,
    // Unordered lists
    /// A filled circle.
    Disc,
    /// A hollow circle.
    Circle,
    /// A filled square.
    Square,
}

impl ListMarker {
    /// Get the next list marker in the sequence.
    pub fn next_marker(&self) -> Self {
        match self {
            ListMarker::Decimal { .. } => Self::LowerAlpha,
            ListMarker::LowerAlpha => Self::LowerRoman,
            ListMarker::LowerRoman => Self::UpperAlpha,
            ListMarker::UpperAlpha => Self::UpperRoman,
            ListMarker::UpperRoman => Self::Decimal { start: 1 },
            ListMarker::Disc => Self::Circle,
            ListMarker::Circle => Self::Square,
            ListMarker::Square => Self::Disc,
        }
    }

    /// Convert `index` into the string representation given by this marker.
    /// `0` maps to the number `"0"`. Lists are assumed to start indexing at `1`,
    /// though when using `ListMarker::Decimal`, any integer value of `index` can be used.
    ///
    /// If `0` or negative numbers are used for any method other than `ListMarker::Decimal`,
    /// the function will not error, but results may vary. (`ListMarker::*Alpha` will return an empty string,
    /// `ListMarker::*Roman` will prefix the result with `-`.)
    pub fn index_to_string(&self, index: i64) -> String {
        match self {
            ListMarker::Decimal { .. } => index.to_string(),
            ListMarker::LowerAlpha => {
                let mut index = index - 1;
                let mut result = String::new();
                while index >= 0 {
                    result.insert(0, ((index % 26) as u8 + b'a') as char);
                    index /= 26;
                    if index == 0 {
                        break;
                    }
                    index -= 1;
                }
                result
            }
            ListMarker::UpperAlpha => ListMarker::LowerAlpha.index_to_string(index).to_uppercase(),
            ListMarker::LowerRoman => ListMarker::UpperRoman.index_to_string(index).to_lowercase(),
            ListMarker::UpperRoman => {
                let mut result = if index >= 0 {
                    String::new()
                } else {
                    "-".to_string()
                };
                let mut index = index.abs();
                if index == 0 {
                    // No Roman numeral for 0, but we make do.
                    return "o".to_string();
                }
                let roman_numerals = [
                    (1000, "M"),
                    (900, "CM"),
                    (500, "D"),
                    (400, "CD"),
                    (100, "C"),
                    (90, "XC"),
                    (50, "L"),
                    (40, "XL"),
                    (10, "X"),
                    (9, "IX"),
                    (5, "V"),
                    (4, "IV"),
                    (1, "I"),
                ];
                for &(value, numeral) in roman_numerals.iter() {
                    while index >= value {
                        result.push_str(numeral);
                        index -= value;
                    }
                }
                result
            }
            ListMarker::Circle => "◦".to_string(),
            ListMarker::Square => "□".to_string(),
            ListMarker::Disc => "•".to_string(),
        }
    }

    /// Like [`index_to_string`] but adds a `.` to the end of the string if needed.
    pub fn index_to_formatted_string(&self, index: i64) -> String {
        let marker = self.index_to_string(index);
        let needs_decimal = match self {
            ListMarker::Circle | ListMarker::Square | ListMarker::Disc => false,
            _ => {
                // All other types are for `<ol>` lists.
                true
            }
        };

        if needs_decimal {
            format!("{marker}.")
        } else {
            marker
        }
    }

    /// The default value of an unordered list.
    pub fn default_ul() -> Self {
        Self::Disc
    }
    /// The default value of an ordered list.
    pub fn default_ol() -> Self {
        Self::Decimal { start: 1 }
    }
    /// Whether this list marker is ordered.
    pub fn is_ordered(&self) -> bool {
        matches!(
            self,
            ListMarker::Decimal { .. }
                | ListMarker::LowerAlpha
                | ListMarker::LowerRoman
                | ListMarker::UpperAlpha
                | ListMarker::UpperRoman
        )
    }
}

impl Default for ListMarker {
    fn default() -> Self {
        Self::Decimal { start: 1 }
    }
}

impl From<&str> for ListMarker {
    fn from(s: &str) -> Self {
        match s {
            "1" => Self::Decimal { start: 1 },
            "0" => Self::Decimal { start: 0 },
            "a" => Self::LowerAlpha,
            "i" => Self::LowerRoman,
            "A" => Self::UpperAlpha,
            "I" => Self::UpperRoman,
            "decimal" => Self::Decimal { start: 1 },
            "lower-alpha" => Self::LowerAlpha,
            "lower-roman" => Self::LowerRoman,
            "upper-alpha" => Self::UpperAlpha,
            "upper-roman" => Self::UpperRoman,
            "disc" => Self::Disc,
            "circle" => Self::Circle,
            "square" => Self::Square,
            _ => Self::Decimal { start: 1 },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_list_marker_from_str() {
        assert_eq!(ListMarker::from("1"), ListMarker::Decimal { start: 1 },);
        assert_eq!(ListMarker::from("0"), ListMarker::Decimal { start: 0 });
        assert_eq!(ListMarker::from("a"), ListMarker::LowerAlpha);
        assert_eq!(
            ListMarker::from("INVALID"),
            ListMarker::Decimal { start: 1 }
        );
    }

    #[test]
    fn test_list_marker_next() {
        assert_eq!(
            ListMarker::Decimal { start: 1 }.next_marker(),
            ListMarker::LowerAlpha
        );
        assert_eq!(ListMarker::LowerAlpha.next_marker(), ListMarker::LowerRoman);
        assert_eq!(ListMarker::LowerRoman.next_marker(), ListMarker::UpperAlpha);
        assert_eq!(ListMarker::UpperAlpha.next_marker(), ListMarker::UpperRoman);
    }

    #[test]
    fn can_convert_to_strings() {
        assert_eq!(ListMarker::Decimal { start: 1 }.index_to_string(1), "1");
        assert_eq!(ListMarker::Decimal { start: 1 }.index_to_string(-4), "-4");
        assert_eq!(ListMarker::LowerAlpha.index_to_string(1), "a");
        assert_eq!(ListMarker::LowerAlpha.index_to_string(60), "bh");
        assert_eq!(ListMarker::UpperAlpha.index_to_string(60), "BH");
        assert_eq!(ListMarker::UpperAlpha.index_to_formatted_string(60), "BH.");
        assert_eq!(ListMarker::LowerAlpha.index_to_string(-10), "");
        assert_eq!(ListMarker::LowerRoman.index_to_string(60), "lx");
        assert_eq!(ListMarker::LowerRoman.index_to_string(3), "iii");
        assert_eq!(ListMarker::LowerRoman.index_to_string(4), "iv");
        assert_eq!(ListMarker::LowerRoman.index_to_string(5), "v");
        assert_eq!(ListMarker::LowerRoman.index_to_string(7), "vii");
        assert_eq!(ListMarker::LowerRoman.index_to_string(8), "viii");
        assert_eq!(ListMarker::LowerRoman.index_to_string(9), "ix");
        assert_eq!(ListMarker::LowerRoman.index_to_string(24), "xxiv");
        assert_eq!(ListMarker::LowerRoman.index_to_string(-4), "-iv");
    }
}
