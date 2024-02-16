use std::{cell::RefCell, rc::Rc};

use crate::{
    components::{ComponentEnum, ComponentNode},
    Extending,
};

use super::graph::{Graph, Taggable};

pub struct Components<'a> {
    components: &'a Vec<Rc<RefCell<ComponentEnum>>>,
}
impl<'a> Components<'a> {
    pub fn new(components: &'a Vec<Rc<RefCell<ComponentEnum>>>) -> Self {
        Self { components }
    }
    /// Returns the index of the origin of this component:
    ///  - If the component is extending another component, find the terminal referent.
    ///  - Otherwise, return the index of the component itself.
    pub fn origin(&self, component_idx: usize) -> usize {
        match self.components[component_idx].borrow().get_extending() {
            Some(&Extending::Component(source_idx)) => self.origin(source_idx),
            _ => component_idx,
        }
    }
}

pub struct PropGraph {
    pub graph: Graph<PropPointer, PropLookup<usize>>,
}
impl Default for PropGraph {
    fn default() -> Self {
        Self::new()
    }
}

impl PropGraph {
    pub fn new() -> Self {
        Self {
            graph: Graph::new(),
        }
    }
    //    pub fn resolve_prop(
    //        &mut self,
    //        prop_ptr: PropPointer,
    //        components: &mut Vec<Rc<RefCell<ComponentEnum>>>,
    //    ) {
    //        let mut component = components[prop_ptr.component_idx].borrow_mut();
    //        let mut prop = component.get_prop_mut(prop_ptr.prop_idx).unwrap();
    //
    //        let data_queries = prop.return_data_queries();
    //        for query in data_queries {}
    //        let components = Components::new(components);
    //    }
    //    pub fn add_nodes_from_query(
    //        &mut self,
    //        prop_ptr: PropPointer,
    //        query: DataQuery,
    //        components: &Components,
    //    ) {
    //        match query {
    //            DataQuery::State => {
    //                // State is a leaf node, but we if the component is extending another component
    //                // we only want to create a single node on the graph relating to the original parent.
    //                let origin = components.origin(prop_ptr.component_idx);
    //                self.graph.add_node(PropPointer::new(origin, prop_ptr.prop_idx));
    //            },
    //            _ => panic!("Not implemented"),
    //        }
    //    }
}

/// Pointer to a prop on a specific component.
#[derive(PartialEq, Eq, Clone, Copy, Hash)]
pub struct PropPointer {
    pub component_idx: usize,
    pub prop_idx: usize,
}
impl PropPointer {
    pub fn new(component_idx: usize, prop_idx: usize) -> Self {
        Self {
            component_idx,
            prop_idx,
        }
    }
}
impl std::fmt::Debug for PropPointer {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "PropPointer({}, {})", self.component_idx, self.prop_idx)
    }
}

/// `Tagged` implementation for fast lookups of `PropPointer` in a graph.
pub struct PropLookup<T> {
    component_props: Vec<Vec<Option<T>>>,
}

impl<T> Default for PropLookup<T> {
    fn default() -> Self {
        Self {
            component_props: Vec::new(),
        }
    }
}
impl<T> PropLookup<T> {
    pub fn new() -> Self {
        Self::default()
    }
}

impl<T: Clone> Taggable<PropPointer, T> for PropLookup<T> {
    fn get_tag(&self, node: PropPointer) -> &T {
        self.component_props[node.component_idx][node.prop_idx]
            .as_ref()
            .unwrap()
    }

    fn set_tag(&mut self, node: PropPointer, tag: T) {
        // Make sure that there is enough space in `component_props` before we start
        if self.component_props.len() <= node.component_idx {
            self.component_props
                .resize(node.component_idx + 1, Vec::new());
        }

        // Make sure there is enough space for the prop index before we start
        if self.component_props[node.component_idx].len() <= node.prop_idx {
            self.component_props[node.component_idx].resize(node.prop_idx + 1, None);
        }
        self.component_props[node.component_idx][node.prop_idx] = Some(tag);
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_prop_lookup() {
        let mut prop_lookup = PropLookup::new();

        let prop_pointer = PropPointer::new(2, 3);
        prop_lookup.set_tag(prop_pointer, 0);

        assert_eq!(*prop_lookup.get_tag(prop_pointer), 0);
    }

    #[test]
    fn test_graph_with_prop_pointer_nodes() {
        let a = PropPointer::new(0, 0);
        let b = PropPointer::new(1, 0);
        let c = PropPointer::new(2, 0);
        let d = PropPointer::new(2, 1);
        let e = PropPointer::new(2, 2);
        let mut graph = Graph::<PropPointer, PropLookup<_>>::new();
        graph.add_node(a);
        graph.add_node(b);
        graph.add_node(c);
        graph.add_node(d);
        graph.add_node(e);
        graph.add_edge(a, b);
        graph.add_edge(a, c);
        graph.add_edge(c, d);
        graph.add_edge(c, e);
        graph.add_edge(d, e);

        assert_eq!(
            graph.walk_descendants(a).collect::<Vec<_>>(),
            vec![&b, &c, &d, &e]
        );
    }
}
