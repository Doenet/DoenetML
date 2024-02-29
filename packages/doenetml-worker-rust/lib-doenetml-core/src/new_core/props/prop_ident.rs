use crate::{components::ComponentProfile, state::PropPointer};

/// Stores information about a prop for use by Core. This information is minimal but sufficient
/// to compute the result of `DataQuery`s.
#[derive(Debug, Clone)]
pub struct PropIdent {
    pub prop_pointer: PropPointer,
    pub profile: ComponentProfile,
}
