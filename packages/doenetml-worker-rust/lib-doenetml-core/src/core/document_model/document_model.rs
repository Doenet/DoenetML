//! # DocumentModel
//!
//! This module contains information about the structure of the document as well as the state of the document.
//! It can be queried for information about the document and its components.

use crate::{
    component_builder::ComponentBuilder,
    graph_node::DependencyGraph,
    props::{cache::PropCache, DataQuery, StateCache},
};

use super::super::document_structure::DocumentStructure;

#[derive(Debug)]
pub struct DocumentModel {
    /// Information about the structure of the document. This includes components, props, and children.
    pub document_structure: DocumentStructure,
    /// A graph that stores the active dependencies between nodes. The nodes
    /// of this graph are the same as the nodes of `structure_graph`, but edges
    /// are only added to this graph if if one node must be updated when another changes.
    pub dependency_graph: DependencyGraph,
    /// States that are stored for the document. States are the roots/leaves of when computing the value
    /// of props.
    pub states: StateCache,
    /// DataQueries that have been made by props.
    pub queries: Vec<DataQuery>,
    /// Cache of prop values. The only way core should ever access prop values is through the cache.
    pub prop_cache: PropCache,
}

impl DocumentModel {
    /// Create a new `DocumentModel` with default values.
    pub fn new() -> Self {
        Self {
            document_structure: DocumentStructure::new(),
            dependency_graph: DependencyGraph::new(),
            states: StateCache::new(),
            queries: Vec::new(),
            prop_cache: PropCache::new(),
        }
    }

    /// Create a new `DocumentModel` with default values and
    /// the `queries` vec initialized to have a `DataQuery::Null`
    /// as its first item.
    pub fn new_with_root_data_query() -> Self {
        let mut document_model = Self::new();
        document_model.queries.push(DataQuery::Null);
        document_model
    }

    /// Initialize Self based on the values from a `ComponentBuilder`
    pub fn init_from_builder(&mut self, builder: ComponentBuilder) {
        self.document_structure.init_from_builder(builder);
    }
}

impl Default for DocumentModel {
    fn default() -> Self {
        Self::new()
    }
}
