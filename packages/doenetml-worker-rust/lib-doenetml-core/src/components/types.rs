use serde::{Deserialize, Serialize};

use crate::{
    DocumentModel, core::props::PropValue, graph_node::GraphNode, props::cache::PropWithMeta,
};

use super::ActionsEnum;

/// The local index of a prop relative to the component to which it belongs.
#[derive(Debug, Clone, Copy, PartialEq, Eq, derive_more::From, derive_more::Into)]
pub struct LocalPropIdx(usize);

impl LocalPropIdx {
    pub const fn new(idx: usize) -> Self {
        Self(idx)
    }
    #[inline(always)]
    pub fn as_usize(&self) -> usize {
        self.0
    }
}

/// The index of a PropDefinition in `DocumentStructure.prop_definitions`
#[derive(Debug, Clone, Copy, PartialEq, Eq, derive_more::From, derive_more::Into)]
pub struct PropDefinitionIdx(usize);

impl PropDefinitionIdx {
    pub const fn new(idx: usize) -> Self {
        Self(idx)
    }
    #[inline(always)]
    pub fn as_usize(&self) -> usize {
        self.0
    }
}

impl From<PropDefinitionIdx> for GraphNode {
    fn from(idx: PropDefinitionIdx) -> Self {
        GraphNode::Prop(idx.into())
    }
}

impl<T: IntoGraphNode> From<T> for PropDefinitionIdx {
    fn from(node: T) -> Self {
        match node.into() {
            GraphNode::Prop(idx) => idx.into(),
            node => panic!("Expected GraphNode::Component, not {node:?}"),
        }
    }
}

/// The index of the component in `DocumentStructure.components`
#[derive(
    Debug,
    Clone,
    Copy,
    PartialEq,
    Eq,
    derive_more::From,
    derive_more::Into,
    Serialize,
    Deserialize,
    Default,
    Hash,
)]
#[serde(transparent)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub struct ComponentIdx(usize);

impl ComponentIdx {
    pub const fn new(idx: usize) -> Self {
        Self(idx)
    }
    #[inline(always)]
    pub fn as_usize(self) -> usize {
        self.0
    }
    pub fn as_graph_node(self) -> GraphNode {
        GraphNode::Component(self.0)
    }
}

impl From<ComponentIdx> for GraphNode {
    fn from(idx: ComponentIdx) -> Self {
        Self::Component(idx.into())
    }
}

// Helper trait
pub trait IntoGraphNode: Into<GraphNode> + Copy {}
impl IntoGraphNode for GraphNode {}
impl IntoGraphNode for &GraphNode {}

impl<T: IntoGraphNode> From<T> for ComponentIdx {
    fn from(node: T) -> Self {
        match node.into() {
            GraphNode::Component(idx) => idx.into(),
            node => panic!("Expected GraphNode::Component, not {node:?}"),
        }
    }
}

/// The index of the component in `Core.components`
#[derive(
    Debug,
    Clone,
    Copy,
    PartialEq,
    Eq,
    derive_more::From,
    derive_more::Into,
    Serialize,
    Deserialize,
    Default,
)]
#[serde(transparent)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
pub struct StringIdx(usize);

impl StringIdx {
    pub const fn new(idx: usize) -> Self {
        Self(idx)
    }
    #[inline(always)]
    pub fn as_usize(self) -> usize {
        self.0
    }
    pub fn as_graph_node(self) -> GraphNode {
        GraphNode::String(self.0)
    }
}

impl From<StringIdx> for GraphNode {
    fn from(idx: StringIdx) -> Self {
        Self::String(idx.into())
    }
}

impl<T: IntoGraphNode> From<T> for StringIdx {
    fn from(node: T) -> Self {
        match node.into() {
            GraphNode::String(idx) => idx.into(),
            node => panic!("Expected GraphNode::Component, not {node:?}"),
        }
    }
}

/// Information of the source that a component is extending, which is currently
/// either another component or a prop.
#[derive(Debug, Clone)]
pub enum Extending {
    /// The component is extending another entire component, given by the component index
    Component(ComponentIdx),
    // TODO: what about array props?
    /// The component is extending the prop of another component
    Prop(ExtendingPropSource),
}

#[derive(Debug, Clone, Copy)]
pub struct ExtendingPropSource {
    /// The prop being extended
    pub prop_pointer: PropPointer,

    /// If true, the source of the extending was due to a direct reference,
    /// as opposed to being in an extend attribute.
    ///
    /// For example, given `<textInput name="i"/>`, a direct ref would be `$i.value` by itself,
    /// unlike `<text extend="$i.value"/>`.
    ///
    /// If we are extending from a direct ref (e.g., the user specified `$i`),
    /// the expansion behavior is slightly different. We keep track of whether or not this `extend`
    /// is from a direct ref or not.
    pub from_direct_ref: bool,
}

/// Pointer to a component's prop
#[derive(Debug, Clone, Copy)]
pub struct PropPointer {
    /// The index of the component in `Core.components`
    pub component_idx: ComponentIdx,
    /// The local index of the prop relative to the component to which
    /// it belongs. This is _not_ the offset of the prop in `Core.props`.
    pub local_prop_idx: LocalPropIdx,
}

/// The body of an [`Action`].
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub struct ActionBody<T> {
    pub args: T,
}

/// An _action_ sent from the UI to `Core`.
#[derive(Debug, Deserialize, Serialize)]
#[cfg_attr(feature = "web", derive(tsify_next::Tsify))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub struct Action {
    pub component_idx: ComponentIdx,
    #[serde(flatten)]
    pub action: ActionsEnum,
}

/// A requested update to a prop of a component coming from an action
#[derive(Debug)]
pub struct UpdateFromAction {
    pub local_prop_idx: LocalPropIdx,
    pub requested_value: PropValue,
}

/// An object that can be used to get the value of any prop of a component.
/// Used for allow actions to query any value.
pub struct ActionQueryProp<'a> {
    component_idx: ComponentIdx,
    document_model: &'a DocumentModel,
}

impl<'a> ActionQueryProp<'a> {
    pub fn new(component_idx: ComponentIdx, document_model: &'a DocumentModel) -> Self {
        ActionQueryProp {
            component_idx,
            document_model,
        }
    }

    /// Get the PropWithMeta of prop with local_prop_idx of this component.
    ///
    /// **Note**: the `changed` meta data indicates whether or not this prop has changed
    /// since *any* action of this component called `get_local_prop()`.
    pub fn get_local_prop(&self, local_prop_idx: LocalPropIdx) -> PropWithMeta {
        let prop_pointer = PropPointer {
            component_idx: self.component_idx,
            local_prop_idx,
        };
        let prop_node = self.document_model.prop_pointer_to_prop_node(prop_pointer);

        let origin = GraphNode::Component(self.component_idx.as_usize());

        self.document_model.get_prop(prop_node, origin)
    }
}

/// The `camelCase` name of an attribute.
#[cfg_attr(feature = "web", tsify_next::declare)]
pub type AttributeName = &'static str;
