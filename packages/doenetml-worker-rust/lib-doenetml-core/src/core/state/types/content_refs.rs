use anyhow::anyhow;

use crate::{
    components::types::{ComponentIdx, StringIdx},
    graph_node::GraphNode,
};

use super::component_refs::ComponentRef;

/// A vector of references to components or strings
#[derive(Debug, Clone, Default, PartialEq, serde::Serialize, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub struct ContentRefs(pub Vec<ContentRef>);

impl ContentRefs {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn into_vec(self) -> Vec<ContentRef> {
        self.0
    }

    pub fn as_slice(&self) -> &[ContentRef] {
        &self.0
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }
}

impl From<Vec<ContentRef>> for ContentRefs {
    fn from(t: Vec<ContentRef>) -> Self {
        ContentRefs(t)
    }
}

/// A reference to a single component or string. If you want a reference to just a component,
/// use `ComponentRef` instead.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub enum ContentRef {
    Component(ComponentIdx),
    String(StringIdx),
}

impl From<ComponentIdx> for ContentRef {
    fn from(t: ComponentIdx) -> Self {
        ContentRef::Component(t)
    }
}

impl From<StringIdx> for ContentRef {
    fn from(t: StringIdx) -> Self {
        ContentRef::String(t)
    }
}

impl From<ComponentRef> for ContentRef {
    fn from(t: ComponentRef) -> Self {
        let idx = t.0;
        ContentRef::Component(idx)
    }
}

impl TryFrom<GraphNode> for ContentRef {
    type Error = anyhow::Error;

    fn try_from(node: GraphNode) -> Result<Self, Self::Error> {
        match node {
            GraphNode::Component(idx) => Ok(ContentRef::Component(idx.into())),
            GraphNode::String(idx) => Ok(ContentRef::String(idx.into())),
            _ => Err(anyhow!(
                "Expected GraphNode::Component or GraphNode::String, but found {:?}",
                node
            )),
        }
    }
}

impl From<ContentRef> for GraphNode {
    fn from(t: ContentRef) -> Self {
        match t {
            ContentRef::Component(idx) => GraphNode::Component(idx.into()),
            ContentRef::String(idx) => GraphNode::String(idx.into()),
        }
    }
}
