use enum_dispatch::enum_dispatch;

use crate::{
    components::{prelude::ComponentIdx, ComponentEnum, ComponentNode},
    new_core::{
        graph_based_core::Core,
        graph_node::{GraphNode, StructureGraph},
    },
};

/// Object that lets you query for some information about your children.
#[derive(Debug)]
pub struct ChildQueryObject<'a> {
    /// The graph node of `self`. All data about children that is returned will be in the context of this node.
    self_graph_node: GraphNode,
    components: &'a [ComponentEnum],
    strings: &'a [String],
    structure_graph: &'a StructureGraph,
}

impl<'a> ChildQueryObject<'a> {
    pub fn new(
        component_idx: ComponentIdx,
        components: &'a [ComponentEnum],
        strings: &'a [String],
        structure_graph: &'a StructureGraph,
    ) -> Self {
        ChildQueryObject {
            self_graph_node: GraphNode::Component(component_idx),
            components,
            strings,
            structure_graph,
        }
    }

    /// Create a new `Self` with appropriate data extracted from an instance of `Core`.
    pub fn new_from_core(component_idx: ComponentIdx, core: &'a Core) -> Self {
        ChildQueryObject {
            self_graph_node: GraphNode::Component(component_idx),
            components: &core.components,
            strings: &core.strings,
            structure_graph: &core.structure_graph,
        }
    }

    /// Get an iterator that will iterate through your children in order.
    pub fn child_iter(&self) -> impl Iterator<Item = GraphNode> + 'a {
        self.structure_graph.content_children(self.self_graph_node)
    }

    /// Get the type of the component specified by `node`. `node` must
    /// be a `GraphNode::Component`.
    pub fn get_component_type(&self, node: GraphNode) -> &str {
        match node {
            GraphNode::Component(idx) => self.components[idx].get_component_type(),
            _ => panic!(
                "Can only get the type of a GraphNode::Component, not {:?}",
                node
            ),
        }
    }

    /// Get the string contents of the component specified by `node`. `node` must
    /// be a `GraphNode::String`.
    pub fn get_string(&self, node: GraphNode) -> &str {
        match node {
            GraphNode::String(idx) => &self.strings[idx],
            _ => panic!(
                "Can only get the string of a GraphNode::String, not {:?}",
                node
            ),
        }
    }
}

/// All components that can be rendered must implement this trait.
/// It instructs Core how to render the children of a component.
#[enum_dispatch]
pub trait ComponentChildren {
    /// The children this component should render. `child_query_object` can be used to iterate through
    /// and seek information about your children. To seek more complex information, you must create
    /// a prop based on a `DataQuery` for the desired information. (This allows Core to appropriately call this function
    /// again in case any dependencies change.)
    fn get_rendered_children(&self, child_query_object: ChildQueryObject) -> Vec<GraphNode>;
}
