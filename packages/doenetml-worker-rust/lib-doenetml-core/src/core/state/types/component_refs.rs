use super::content_refs::ContentRef;
use crate::{components::types::ComponentIdx, graph_node::GraphNode};
use anyhow::anyhow;

/// A vector of references to components
///
/// TODO: when have array props, turn this into just `ComponentRef`, which is a reference to a single component
/// and then use the general array prop mechanism to refer to multiple components
#[derive(Debug, Clone, Default, PartialEq, serde::Serialize, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub struct ComponentRefs(pub Vec<ComponentIdx>);
impl ComponentRefs {
    pub fn iter(&'_ self) -> std::slice::Iter<'_, ComponentIdx> {
        self.0.iter()
    }
}

/// A reference to a single component
#[derive(Debug, Clone, Default, PartialEq, serde::Serialize, serde::Deserialize)]
// TODO: currently, the type exposed to the JS side is an `Option<ComponentRef>`, not a `ComponentRef`,
// so this generates the wrong Typescript types
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub struct ComponentRef(pub ComponentIdx);

impl ComponentRef {
    pub fn iter(&self) -> std::iter::Once<ComponentIdx> {
        std::iter::once(self.0)
    }
    pub fn as_content_ref(&self) -> ContentRef {
        ContentRef::Component(self.0)
    }
    pub fn as_graph_node(&self) -> crate::graph_node::GraphNode {
        GraphNode::Component(self.0.as_usize())
    }
}

impl<T> From<T> for ComponentRef
where
    T: Into<ComponentIdx>,
{
    fn from(t: T) -> Self {
        ComponentRef(t.into())
    }
}

impl TryFrom<ContentRef> for ComponentRef {
    type Error = anyhow::Error;

    fn try_from(value: ContentRef) -> Result<Self, Self::Error> {
        match value {
            ContentRef::Component(e) => Ok(e.into()),
            _ => Err(anyhow!("Cannot convert {:?} into ContentRef", value)),
        }
    }
}
