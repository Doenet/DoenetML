use std::{cell::RefCell, rc::Rc};

use crate::{
    components::types::PropPointer,
    core::document_structure::DocumentStructure,
    graph_node::GraphNode,
    props::{BindableAsGraphNodeFilter, PropComponent},
    DocumentModel,
};

/// Process a `DataQuery::FilteredChildren`.
///
/// Returns a vector of edges (of the form `(from, to)`) that should be added to the dependency graph.
#[allow(clippy::too_many_arguments)]
pub fn process_data_query_component_refs<'a>(
    container: PropComponent,
    filters: Rc<dyn BindableAsGraphNodeFilter<'a>>,
    prop_pointer: PropPointer,
    query_node: GraphNode,
    document_structure: &'a RefCell<DocumentStructure>,
    document_model: &'a DocumentModel,
) -> Vec<(GraphNode, GraphNode)> {
    let mut ret = Vec::new();

    let component_idx = match container {
        PropComponent::Me => prop_pointer.component_idx,
        PropComponent::Parent => document_structure
            .borrow()
            .get_true_component_parent(prop_pointer.component_idx)
            .unwrap(),
        PropComponent::ByIdx(component_idx) => component_idx,
    };

    let content_children = document_structure
        .borrow()
        .get_component_content_children(component_idx);

    let bound_filter = filters.bind(query_node, document_model);

    for node in content_children {
        let deps = bound_filter.accumulate_deps(&node);
        // deps consists of everything that the filter could possibly depend on.
        // We need to link each dep to the query node.
        for dep in deps {
            ret.push((query_node, dep));
        }
    }

    ret
}
