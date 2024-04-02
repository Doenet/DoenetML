use crate::components::types::ComponentIdx;

/// A vector of references to components
///
/// TODO: when have array props, turn this into just `ElementRef`, which is a reference to a single component
/// and then use the general array prop mechanism to refer to multiple components
#[derive(Debug, Clone, Default, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct ElementRefs(pub Vec<ComponentIdx>);

/// A reference to a single component
#[derive(Debug, Clone, Default, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct ElementRef(pub ComponentIdx);
