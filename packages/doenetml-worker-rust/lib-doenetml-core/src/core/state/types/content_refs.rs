use anyhow::anyhow;

use crate::{
    components::types::{ComponentIdx, StringIdx},
    dast::ElementRefAnnotation,
    graph_node::GraphNode,
    props::prop_type,
};

use super::component_refs::{ComponentRef, ComponentRefs};

/// A vector of references to components or strings
#[derive(Debug, Clone, Default, PartialEq)]
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

    pub fn iter(&'_ self) -> std::slice::Iter<'_, ContentRef> {
        self.0.iter()
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

impl serde::Serialize for ContentRefs {
    fn serialize<S: serde::Serializer>(&self, _serializer: S) -> Result<S::Ok, S::Error> {
        // We cannot properly serialize `ContentRef::String` because we don't have access to the string table here.
        Err(serde::ser::Error::custom(
            "ContentRefs should not be serialized directly. They should be converted to `FlatDastElementContent` first.",
        ))
    }
}

/// A vector of references to components or strings along with
/// an annotation indicating whether the reference is "original" or whether
/// it is a duplicate (e.g., arising from because a component was extended.)
#[derive(Debug, Clone, Default, PartialEq)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub struct AnnotatedContentRefs(pub Vec<(ContentRef, ElementRefAnnotation)>);

impl AnnotatedContentRefs {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn from_vec(vec: Vec<(ContentRef, ElementRefAnnotation)>) -> Self {
        AnnotatedContentRefs(vec)
    }

    pub fn into_vec(self) -> Vec<(ContentRef, ElementRefAnnotation)> {
        self.0
    }

    pub fn as_slice(&self) -> &[(ContentRef, ElementRefAnnotation)] {
        &self.0
    }

    pub fn iter(&'_ self) -> std::slice::Iter<'_, (ContentRef, ElementRefAnnotation)> {
        self.0.iter()
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }
}

impl From<Vec<(ContentRef, ElementRefAnnotation)>> for AnnotatedContentRefs {
    fn from(t: Vec<(ContentRef, ElementRefAnnotation)>) -> Self {
        AnnotatedContentRefs(t)
    }
}

impl serde::Serialize for AnnotatedContentRefs {
    fn serialize<S: serde::Serializer>(&self, _serializer: S) -> Result<S::Ok, S::Error> {
        // We cannot properly serialize `ContentRef::String` because we don't have access to the string table here.
        Err(serde::ser::Error::custom(
            "AnnotatedContentRefs should not be serialized directly. They should be converted to `FlatDastElementContent` first.",
        ))
    }
}

/// A reference to a single component or string. If you want a reference to just a component,
/// use `ComponentRef` instead.
#[derive(Debug, Clone, Copy, PartialEq)]
// Note: we do not do `#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]` here because `ContentRef` is never actually
// serialized. Instead it is swapped out for `FlatDastElementContent` before serialization. In order to keep the correct types,
// we manually override.
pub enum ContentRef {
    Component(ComponentIdx),
    String(StringIdx),
}

#[cfg(feature = "web")]
const _: () = {
    use crate::components::prelude::FlatDastElementContent;
    use tsify_next::declare;

    // Manually declare the type of `ContentRef` for Typescript. This is a workaround because we intercept the serialization
    // process and turn all `ContentRef` into `FlatDastElementContent` before serializing.
    #[declare]
    #[allow(unused)]
    type ContentRef = FlatDastElementContent;
    #[declare]
    #[allow(unused)]
    type AnnotatedContentRefs = Vec<FlatDastElementContent>;
};

impl serde::Serialize for ContentRef {
    fn serialize<S: serde::Serializer>(&self, _serializer: S) -> Result<S::Ok, S::Error> {
        // We cannot properly serialize `ContentRef::String` because we don't have access to the string table here.
        Err(serde::ser::Error::custom(
            "ContentRefs should not be serialized directly. They should be converted to `FlatDastElementContent` first.",
        ))
    }
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

impl From<ComponentRefs> for ContentRefs {
    fn from(t: ComponentRefs) -> Self {
        let indices = t.0;
        ContentRefs(indices.into_iter().map(|idx| idx.into()).collect())
    }
}
impl From<prop_type::ComponentRefs> for ContentRefs {
    fn from(t: prop_type::ComponentRefs) -> Self {
        let indices = &t.0;
        ContentRefs(indices.iter().map(|idx| (*idx).into()).collect())
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
