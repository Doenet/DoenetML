//! A Prop is a piece of computed data associated with a component. The value of a Prop
//! is lazily computed and can depend on other Props.

use crate::{
    attribute::AttributeName,
    components::{
        prelude::{ComponentIdx, GraphNode, PropIdx},
        ComponentProfile,
    },
};

use super::cache::PropWithMeta;

/// Data resulting from a `DataQuery`
pub struct DataQueryResult {
    /// The graph `GraphNode::Query` on the dependency graph that specified what data is needed.
    pub graph_node: GraphNode,
    /// The value of the data that was queried for.
    pub values: Vec<PropWithMeta>,
}

/// A DataQuery is used to make a Dependency based on the input document structure
#[derive(Debug, Clone, Default, PartialEq)]
pub enum DataQuery {
    /// Query for all children that match the prescribed `ComponentProfile`s.
    ChildPropProfile {
        /// The data query will match child components that have at least one of these profiles
        match_profiles: Vec<ComponentProfile>,
    },
    /// Query for a particular prop of a component
    Prop {
        /// If None, prop is from the component making the query.
        component_idx: Option<ComponentIdx>,

        /// The prop from component_idx or component making the query.
        prop_idx: PropIdx,
    },
    /// Query for a prop from a parent
    ParentProp { prop_name: &'static str },
    /// Query for all children of an attribute that match the prescribed `ComponentProfile`
    Attribute {
        /// The name of the attribute whose children will be matched.
        attribute_name: AttributeName,

        /// The data query will match child components that have at least one of these profiles.
        match_profiles: Vec<ComponentProfile>,
    },
    #[default]
    /// Will be initialized with the default value of this prop
    /// and will accept any change when inverting.
    State,
}
