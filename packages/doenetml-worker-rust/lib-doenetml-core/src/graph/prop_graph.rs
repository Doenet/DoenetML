use std::{cell::RefCell, rc::Rc};

use crate::{
    components::{
        prelude::{ComponentState, DataQuery, UntaggedContent},
        ComponentEnum, ComponentNode, ComponentProfile,
    },
    Extending,
};

use super::directed_graph::{DirectedGraph, Taggable};

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

    pub fn get_parent(&self, component_idx: usize) -> Option<usize> {
        self.components[component_idx].borrow().get_parent()
    }

    pub fn get_prop_by_name(&self, component_idx: usize, prop_name: &str) -> Option<usize> {
        self.components[component_idx]
            .borrow()
            .get_prop_index_from_name(prop_name)
    }

    /// Get the local children of a component. This _excludes_ any "virtual" children coming
    /// from the `extend` attribute.
    pub fn get_local_children(&self, component_idx: usize) -> Vec<UntaggedContent> {
        self.components[component_idx]
            .borrow()
            .get_children()
            .clone()
    }

    /// Returns _all_ children of the specified component. This includes "virtual" children,
    /// i.e., the children of the referent if the component is extending another.
    /// The order of children is always `[<referent component children>..., <direct children>...]`
    ///
    /// Returns a tuple `(component_idx, child_idx, child)` where `component_idx` is the index of the component
    /// that `child` belongs to and `child_idx` is the index of the child within that component.
    pub fn get_all_children(&self, component_idx: usize) -> Vec<(usize, usize, UntaggedContent)> {
        let component = self.components[component_idx].borrow();
        let local_children = || {
            component
                .get_children()
                .iter()
                .enumerate()
                .map(|(child_idx, c)| (component_idx, child_idx, c.clone()))
        };
        match component.get_extending() {
            None => local_children().collect(),
            Some(&Extending::Component(referent_idx)) => {
                // XXX: If a component `extend`s a parent, it could cause an infinite loop here.
                let mut children = self.get_all_children(referent_idx);
                children.extend(local_children());
                children
            }
            _ => Vec::new(),
        }
    }
}

pub struct PropGraph {
    pub graph: DirectedGraph<DataPointer, PropLookup<usize>>,
}
impl Default for PropGraph {
    fn default() -> Self {
        Self::new()
    }
}

impl PropGraph {
    pub fn new() -> Self {
        Self {
            graph: DirectedGraph::new(),
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
    //

    /// Add nodes to the graph for the given query.
    ///
    /// In order to calculate a prop, the prop is allowed to make queries for information about other props/state.
    /// Space for this information is generated as needed.
    pub fn add_nodes_for_query(
        &mut self,
        prop_ptr: PropPointer,
        query: DataQuery,
        components: &Components,
    ) {
        match query {
            DataQuery::State => {
                // State is a leaf node, but we if the component is extending another component
                // we only want to create a single node on the graph relating to the original parent.
                let origin = components.origin(prop_ptr.component_idx);
                self.graph
                    .add_node(DataPointer::state(origin, prop_ptr.prop_idx));
            }
            DataQuery::Prop {
                component_idx,
                prop_idx,
            } => {
                self.graph.add_node(DataPointer::prop(
                    component_idx.unwrap_or(prop_ptr.component_idx),
                    prop_idx,
                ));
            }
            DataQuery::ParentProp { prop_name } => {
                let parent_idx = components
                    .get_parent(prop_ptr.component_idx)
                    .expect("No parent for component");
                let prop_idx = components
                    .get_prop_by_name(parent_idx, &prop_name)
                    .expect(format!("No prop named `{}` in parent", prop_name).as_str());
                self.graph.add_node(DataPointer::prop(parent_idx, prop_idx));
            }
            DataQuery::ChildPropProfile {
                match_profiles,
                always_return_value,
            } => {
                // If we are extending a component, the matched children will be the matched children from
                // the referent followed by our matched children (in that order).

                // XXX: Figure out how to handle `extending`. Something like what's done in
                // `create_dependency_from_extend_source_if_matches_profile()`

                let matches_text = match_profiles.contains(&ComponentProfile::String)
                    || match_profiles.contains(&ComponentProfile::LiteralString);

                for (parent_idx, child_idx, child) in
                    components.get_all_children(prop_ptr.component_idx)
                {
                    match child {
                        UntaggedContent::Ref(component_idx) => {
                            let component = components.components[component_idx].borrow();
                            // We don't actually match the component. We match all props of the component that
                            // match the profiles.
                        }
                        UntaggedContent::Text(_) => {
                            if matches_text {
                                self.graph
                                    .add_node(DataPointer::string(parent_idx, child_idx));
                            }
                        }
                    }
                }
            }
            _ => panic!("Not implemented"),
        }
    }
}

/// A pointer to a particular prop on a particular component.
pub struct PropPointer {
    component_idx: usize,
    prop_idx: usize,
}

/// The different kinds of state that a prop can have.
#[derive(PartialEq, Eq, Clone, Copy, Debug)]
pub enum StateKind {
    /// The state of a prop that was generated because a prop made a `DataQuery::State` query.
    /// Each prop only has one such state instance.
    Component,
    /// The state generated if a component does not have children but the value of its children was requested.
    /// This allows a component to request its children take on particular values even if there are no children.
    Child,
    /// The state generated if a component does not have the requested attribute.
    /// This allows a component to request its attribute take on a particular value even if the attribute doesn't exist.
    Attribute(u16),
}
impl StateKind {
    /// Get a unique index for each kind of state.
    pub fn idx(&self) -> usize {
        match self {
            StateKind::Component => 0,
            StateKind::Child => 1,
            StateKind::Attribute(v) => 2 + *v as usize,
        }
    }
}

/// Pointers to either string children or props of a component.
#[derive(PartialEq, Eq, Clone, Copy)]
pub enum DataPointer {
    /// A pointer to a prop on a specific component.
    Prop {
        component_idx: usize,
        prop_idx: usize,
    },
    /// A pointer to a string child of a specific component.
    String {
        component_idx: usize,
        child_idx: usize,
    },
    /// A pointer to state of a specific prop (of a component).
    /// Every prop can have any of several different kinds of state associated with it.
    State {
        component_idx: usize,
        prop_idx: usize,
        kind: StateKind,
    },
}

impl DataPointer {
    pub fn prop(component_idx: usize, prop_idx: usize) -> Self {
        Self::Prop {
            component_idx,
            prop_idx,
        }
    }
    pub fn string(component_idx: usize, child_idx: usize) -> Self {
        Self::String {
            component_idx,
            child_idx,
        }
    }
    /// Generate a pointer to the unique state associated to the prop.
    pub fn state(component_idx: usize, prop_idx: usize) -> Self {
        Self::State {
            component_idx,
            prop_idx,
            kind: StateKind::Component,
        }
    }
    pub fn component_idx(&self) -> usize {
        match self {
            DataPointer::Prop { component_idx, .. } => *component_idx,
            DataPointer::String { component_idx, .. } => *component_idx,
            DataPointer::State { component_idx, .. } => *component_idx,
        }
    }
}
impl std::fmt::Debug for DataPointer {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DataPointer::Prop {
                component_idx,
                prop_idx,
            } => write!(f, "PropPointer({}, {})", component_idx, prop_idx),
            DataPointer::String {
                component_idx,
                child_idx,
            } => write!(f, "StringPointer({}, {})", component_idx, child_idx),
            DataPointer::State {
                component_idx,
                prop_idx: state_idx,
                kind,
            } => {
                write!(
                    f,
                    "StatePointer({}, {}, {:?})",
                    component_idx, state_idx, kind
                )
            }
        }
    }
}

/// `Tagged` implementation for fast lookups of `PropPointer` in a graph.
pub struct PropLookup<T> {
    /// Tags indexed first by `component_idx` and then by `prop_idx`.
    component_props: Vec<Vec<Option<T>>>,
    /// Tags indexed first by `component_idx` and then by `child_idx` (the location of the string child).
    component_strings: Vec<Vec<Option<T>>>,
    /// Tags indexed first by `component_idx` and then by `prop_idx` then by the `idx` of the state kind.
    component_states: Vec<Vec<Vec<Option<T>>>>,
}

impl<T> Default for PropLookup<T> {
    fn default() -> Self {
        Self {
            component_props: Vec::new(),
            component_strings: Vec::new(),
            component_states: Vec::new(),
        }
    }
}
impl<T> PropLookup<T> {
    pub fn new() -> Self {
        Self::default()
    }
}

impl<T: Clone> Taggable<DataPointer, T> for PropLookup<T> {
    fn get_tag(&self, node: &DataPointer) -> Option<&T> {
        match node {
            DataPointer::Prop {
                component_idx,
                prop_idx,
            } => self
                .component_props
                .get(*component_idx)
                .and_then(|props| props.get(*prop_idx))
                .and_then(|prop_ptr| prop_ptr.as_ref()),
            DataPointer::String {
                component_idx,
                child_idx,
            } => self
                .component_strings
                .get(*component_idx)
                .and_then(|strings| strings.get(*child_idx))
                .and_then(|string_ptr| string_ptr.as_ref()),
            DataPointer::State {
                component_idx,
                prop_idx: state_idx,
                kind,
            } => self
                .component_states
                .get(*component_idx)
                .and_then(|states| states.get(*state_idx))
                .and_then(|state_ptr| state_ptr.get(kind.idx()))
                .and_then(|state_ptr| state_ptr.as_ref()),
        }
    }

    fn set_tag(&mut self, node: DataPointer, tag: T) {
        match node {
            DataPointer::Prop {
                component_idx,
                prop_idx,
            } => {
                // Make sure that there is enough space in `component_props` before we start
                if self.component_props.len() <= component_idx {
                    self.component_props.resize(component_idx + 1, Vec::new());
                }

                // Make sure there is enough space for the prop index before we start
                if self.component_props[component_idx].len() <= prop_idx {
                    self.component_props[component_idx].resize(prop_idx + 1, None);
                }
                self.component_props[component_idx][prop_idx] = Some(tag);
            }
            DataPointer::String {
                component_idx,
                child_idx,
            } => {
                // Make sure that there is enough space in `component_strings` before we start
                if self.component_strings.len() <= component_idx {
                    self.component_strings.resize(component_idx + 1, Vec::new());
                }

                // Make sure there is enough space for the child index before we start
                if self.component_strings[component_idx].len() <= child_idx {
                    self.component_strings[component_idx].resize(child_idx + 1, None);
                }
                self.component_strings[component_idx][child_idx] = Some(tag);
            }
            DataPointer::State {
                component_idx,
                prop_idx: state_idx,
                kind,
            } => {
                // Make sure that there is enough space in `component_states` before we start
                if self.component_states.len() <= component_idx {
                    self.component_states.resize(component_idx + 1, Vec::new());
                }

                // Make sure there is enough space for the prop index before we start
                if self.component_states[component_idx].len() <= state_idx {
                    self.component_states[component_idx].resize(state_idx + 1, Vec::new());
                }

                // Make sure there is enough space for the state kind index before we start
                let kind_idx = kind.idx();
                if self.component_states[component_idx][state_idx].len() <= kind_idx {
                    self.component_states[component_idx][state_idx].resize(kind_idx + 1, None);
                }
                self.component_states[component_idx][state_idx][kind_idx] = Some(tag);
            }
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_prop_lookup() {
        let mut prop_lookup = PropLookup::new();

        let prop_pointer = DataPointer::prop(2, 3);
        prop_lookup.set_tag(prop_pointer, 0);

        assert_eq!(*prop_lookup.get_tag(&prop_pointer).unwrap(), 0);
    }

    #[test]
    fn test_graph_with_prop_pointer_nodes() {
        let a = DataPointer::prop(0, 0);
        let b = DataPointer::prop(1, 0);
        let c = DataPointer::prop(2, 0);
        let d = DataPointer::prop(2, 1);
        let e = DataPointer::prop(2, 2);
        let mut graph = DirectedGraph::<DataPointer, PropLookup<_>>::new();
        graph.add_node(a);
        graph.add_node(b);
        graph.add_node(c);
        graph.add_node(d);
        graph.add_node(e);
        graph.add_edge(&a, &b);
        graph.add_edge(&a, &c);
        graph.add_edge(&c, &d);
        graph.add_edge(&c, &e);
        graph.add_edge(&d, &e);

        assert_eq!(
            graph.walk_descendants(&a).collect::<Vec<_>>(),
            vec![&b, &c, &d, &e]
        );
    }
}
