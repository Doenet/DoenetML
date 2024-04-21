/// Information for creating a textual reference to a component.
#[derive(Debug, Clone, PartialEq, serde::Serialize, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub enum ListDepth {
    /// The number of nesting levels of ordered lists.
    Ol(i16),
    /// The number of nesting levels of unordered lists.
    Ul(i16),
}

impl ListDepth {
    /// Get the depth of the list.
    pub fn depth(&self) -> i16 {
        match self {
            ListDepth::Ol(depth) | ListDepth::Ul(depth) => *depth,
        }
    }

    /// Increment the depth of the list.
    pub fn increment(&mut self) {
        match self {
            ListDepth::Ol(depth) | ListDepth::Ul(depth) => *depth += 1,
        }
    }

    /// Decrement the depth of the list.
    pub fn decrement(&mut self) {
        match self {
            ListDepth::Ol(depth) | ListDepth::Ul(depth) => *depth -= 1,
        }
    }
}

impl Default for ListDepth {
    fn default() -> Self {
        ListDepth::Ol(0)
    }
}