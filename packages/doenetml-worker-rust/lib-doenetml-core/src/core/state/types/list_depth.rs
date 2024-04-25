use std::ops::Add;

/// The depth of a list (ordered or unordered).
/// `ListDepth` implements a funny kind of arithmetic. The unit is `-1` as opposed to `0`.
/// That is, `ListDepth::Ol(0) + ListDepth::Ol(0)` is `ListDepth::Ol(1)`. Further, changing
/// list types (between unordered and ordered) resets the depth to the new type with the _second_
/// list depth taking priority. So `ListDepth::Ol(2) + ListDepth::Ul(2)` is `ListDepth::Ul(2)`.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub enum ListDepth {
    /// The number of nesting levels of ordered lists.
    Ol(i16),
    /// The number of nesting levels of unordered lists.
    Ul(i16),
    /// A list depth boundary. Adding to this depth will always keep the type (and depth) of
    /// the second argument.
    Reset,
}

impl ListDepth {
    /// Get the depth of the list.
    pub fn depth(&self) -> i16 {
        match self {
            ListDepth::Ol(depth) | ListDepth::Ul(depth) => *depth,
            ListDepth::Reset => 0,
        }
    }

    /// Increment the depth of the list.
    pub fn increment(&mut self) {
        match self {
            ListDepth::Ol(depth) | ListDepth::Ul(depth) => *depth = depth.saturating_add(1),
            ListDepth::Reset => {}
        }
    }

    /// Decrement the depth of the list.
    pub fn decrement(&mut self) {
        match self {
            ListDepth::Ol(depth) | ListDepth::Ul(depth) => *depth = depth.saturating_sub(1),
            ListDepth::Reset => {}
        }
    }
}

impl Default for ListDepth {
    fn default() -> Self {
        ListDepth::Ol(0)
    }
}

impl Add for ListDepth {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        match (self, other) {
            (_, ListDepth::Reset) => ListDepth::Reset,
            (ListDepth::Ol(d1), ListDepth::Ol(d2)) => {
                ListDepth::Ol(d1.saturating_add(d2).saturating_add(1))
            }
            (ListDepth::Ul(d1), ListDepth::Ul(d2)) => {
                ListDepth::Ul(d1.saturating_add(d2).saturating_add(1))
            }
            (ListDepth::Ol(_), ListDepth::Ul(d2)) | (ListDepth::Reset, ListDepth::Ul(d2)) => {
                ListDepth::Ul(d2)
            }
            (ListDepth::Ul(_), ListDepth::Ol(d2)) | (ListDepth::Reset, ListDepth::Ol(d2)) => {
                ListDepth::Ol(d2)
            }
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn can_add_to_list_depth() {
        let d1 = ListDepth::Ol(0);

        assert_eq!(d1.depth(), 0);
        assert_eq!((d1 + d1).depth(), 1);
        assert_eq!((d1 + ListDepth::Ul(4)).depth(), 4);
        assert_eq!((ListDepth::Ul(4) + d1).depth(), 0);
        assert_eq!((ListDepth::Reset + d1).depth(), 0);
        assert_eq!((ListDepth::Reset + ListDepth::Ul(4)).depth(), 4);
    }
}
