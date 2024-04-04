use anyhow::anyhow;

use crate::{
    components::types::{ComponentIdx, StringIdx},
    graph_node::GraphNode,
};

use super::element_refs::ElementRef;

/// A vector of references to components or strings
#[derive(Debug, Clone, Default, PartialEq, serde::Serialize, serde::Deserialize)]
pub struct ContentRefs(pub Vec<ContentRef>);

impl ContentRefs {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn into_vec(self) -> Vec<ContentRef> {
        self.0
    }
}

impl From<Vec<ContentRef>> for ContentRefs {
    fn from(t: Vec<ContentRef>) -> Self {
        ContentRefs(t)
    }
}

/// A reference to a single component or string. If you want a reference to just a component,
/// use `ElementRef` instead.
#[derive(Debug, Clone, Copy, PartialEq, serde::Serialize, serde::Deserialize)]
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

impl From<ElementRef> for ContentRef {
    fn from(t: ElementRef) -> Self {
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
