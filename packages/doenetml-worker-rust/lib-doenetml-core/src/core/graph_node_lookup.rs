//! Fast hash-map-like data structure for associating data with graph nodes.

use crate::{graph::directed_graph::Taggable, graph_node::GraphNode};

/// Data structure on which a `Taggable<GraphNode, _>` can be implemented.
/// This structure is built for efficiency, exploiting the properties of `GraphNode`.
#[derive(Clone, Debug, Default)]
pub struct GraphNodeLookup<T> {
    components: Vec<Option<T>>,
    strings: Vec<Option<T>>,
    props: Vec<Option<T>>,
    states: Vec<Option<T>>,
    queries: Vec<Option<T>>,
    virtuals: Vec<Option<T>>,
}

impl<T> GraphNodeLookup<T> {
    pub fn new() -> Self {
        Self {
            components: Vec::new(),
            strings: Vec::new(),
            props: Vec::new(),
            states: Vec::new(),
            queries: Vec::new(),
            virtuals: Vec::new(),
        }
    }

    pub fn keys(&self) -> impl Iterator<Item = GraphNode> {
        let all_nodes = std::iter::empty()
            .chain(
                self.components
                    .iter()
                    .enumerate()
                    .filter_map(|(i, item)| item.as_ref().map(|_| GraphNode::Component(i))),
            )
            .chain(
                self.strings
                    .iter()
                    .enumerate()
                    .filter_map(|(i, item)| item.as_ref().map(|_| GraphNode::String(i))),
            )
            .chain(
                self.props
                    .iter()
                    .enumerate()
                    .filter_map(|(i, item)| item.as_ref().map(|_| GraphNode::Prop(i))),
            )
            .chain(
                self.states
                    .iter()
                    .enumerate()
                    .filter_map(|(i, item)| item.as_ref().map(|_| GraphNode::State(i))),
            )
            .chain(
                self.queries
                    .iter()
                    .enumerate()
                    .filter_map(|(i, item)| item.as_ref().map(|_| GraphNode::Query(i))),
            )
            .chain(
                self.virtuals
                    .iter()
                    .enumerate()
                    .filter_map(|(i, item)| item.as_ref().map(|_| GraphNode::Virtual(i))),
            )
            .collect::<Vec<_>>();

        all_nodes.into_iter()
    }

    pub fn iter(&self) -> impl Iterator<Item = (GraphNode, &T)> {
        self.keys().map(|node| (node, self.get_tag(&node).unwrap()))
    }
}

impl<T> Taggable<GraphNode, T> for GraphNodeLookup<T> {
    fn get_tag(&self, node: &GraphNode) -> Option<&T> {
        match node {
            GraphNode::Component(idx) => self.components.get(*idx).and_then(|x| x.as_ref()),
            GraphNode::String(idx) => self.strings.get(*idx).and_then(|x| x.as_ref()),
            GraphNode::Prop(idx) => self.props.get(*idx).and_then(|x| x.as_ref()),
            GraphNode::State(idx) => self.states.get(*idx).and_then(|x| x.as_ref()),
            GraphNode::Query(idx) => self.queries.get(*idx).and_then(|x| x.as_ref()),
            GraphNode::Virtual(idx) => self.virtuals.get(*idx).and_then(|x| x.as_ref()),
        }
    }
    fn set_tag(&mut self, node: GraphNode, tag: T) {
        let idx = node.idx();
        match node {
            GraphNode::Component(_) => {
                if idx >= self.components.len() {
                    self.components.resize_with(idx + 1, || None);
                }
                self.components[idx] = Some(tag);
            }
            GraphNode::String(_) => {
                if idx >= self.strings.len() {
                    self.strings.resize_with(idx + 1, || None);
                }
                self.strings[idx] = Some(tag);
            }
            GraphNode::Prop(_) => {
                if idx >= self.props.len() {
                    self.props.resize_with(idx + 1, || None);
                }
                self.props[idx] = Some(tag);
            }
            GraphNode::State(_) => {
                if idx >= self.states.len() {
                    self.states.resize_with(idx + 1, || None);
                }
                self.states[idx] = Some(tag);
            }
            GraphNode::Query(_) => {
                if idx >= self.queries.len() {
                    self.queries.resize_with(idx + 1, || None);
                }
                self.queries[idx] = Some(tag);
            }
            GraphNode::Virtual(_) => {
                if idx >= self.virtuals.len() {
                    self.virtuals.resize_with(idx + 1, || None);
                }
                self.virtuals[idx] = Some(tag);
            }
        }
    }
}

/// Data structure to allow for lookup up of values keyed by `(GraphNode, GraphNode)`.
#[derive(Clone, Debug, Default)]
pub struct DoubleNodeLookup<T> {
    first: GraphNodeLookup<usize>,
    second: Vec<GraphNodeLookup<T>>,
}

impl<T> DoubleNodeLookup<T> {
    pub fn new() -> Self {
        Self {
            first: GraphNodeLookup::new(),
            second: Vec::new(),
        }
    }

    pub fn get(&self, key: &(GraphNode, GraphNode)) -> Option<&T> {
        let (first, second) = key;
        //let (second, first) = key;
        let idx = self.first.get_tag(first)?;
        // This should be safe because only indices of inserted items appear in `first`.
        self.second[*idx].get_tag(second)
    }

    pub fn insert(&mut self, key: (GraphNode, GraphNode), value: T) {
        let (first, second) = key;
        let idx = self.first.get_tag(&first);
        if let Some(idx) = idx {
            // If the index exists, we're replacing something in an existing lookup.
            self.second[*idx].set_tag(second, value);
        } else {
            // Otherwise, we need to create a new lookup.
            let mut lookup = GraphNodeLookup::new();
            lookup.set_tag(second, value);
            self.first.set_tag(first, self.second.len());
            self.second.push(lookup);
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn double_node_lookup() {
        let mut lookup = DoubleNodeLookup::new();

        let (key1, val1) = ((GraphNode::Component(0), GraphNode::String(0)), 42);
        let (key2, val2) = ((GraphNode::String(0), GraphNode::String(0)), 43);
        let (key3, val3) = ((GraphNode::Virtual(10), GraphNode::Prop(22)), 44);
        let (key4, _val4) = ((GraphNode::Virtual(11), GraphNode::Prop(22)), 44);
        let (key5, _val5) = ((GraphNode::Virtual(10), GraphNode::Prop(20)), 44);
        lookup.insert(key1, val1);
        lookup.insert(key2, val2);
        lookup.insert(key3, val3);

        assert_eq!(lookup.get(&key1), Some(&val1));
        assert_eq!(lookup.get(&key2), Some(&val2));
        assert_eq!(lookup.get(&key3), Some(&val3));

        lookup.insert(key2, 77);
        assert_eq!(lookup.get(&key2), Some(&77));
        assert_eq!(lookup.get(&key4), None);
        assert_eq!(lookup.get(&key5), None);
    }
}
