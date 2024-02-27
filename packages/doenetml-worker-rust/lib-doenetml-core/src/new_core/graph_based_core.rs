//! A version of `Core` based on `DirectedGraph`

use std::{collections::HashMap, str::FromStr};

use anyhow::anyhow;

use crate::{
    components::{
        ComponentEnum,
        _error::_Error,
        _external::_External,
        prelude::{ComponentState, FlatAttribute, KeyValueIgnoreCase, UntaggedContent},
        ComponentAttributes, ComponentNode,
    },
    dast::{
        flat_dast::{Index, NormalizedNode, NormalizedRoot, Source},
        ref_resolve::RefResolution,
    },
    graph::directed_graph::DirectedGraph,
    state::PropPointer,
    ComponentIdx, Extending, PropSource,
};

use super::graph_node::{GraphNode, GraphNodeLookup};

/// Core stores all hydrated components, keeps track of caching data, and tracks dependencies.
/// It is also in charge of marking nodes as dirty when they need to be recalculated and calling
/// functions to recalculate in the appropriate order.
pub struct Core {
    /// A graph that stores the structure of the document. This graph keeps
    /// track of children, attributes, props, and state.
    pub structure_graph: DirectedGraph<GraphNode, GraphNodeLookup<usize>>,
    /// A graph that stores the active dependencies between nodes. The nodes
    /// of this graph are the same as the nodes of `structure_graph`, but edges
    /// are only added to this graph if if one node must be updated when another changes.
    pub dependency_graph: DirectedGraph<GraphNode, GraphNodeLookup<usize>>,
    /// The reified components. These can be queried for information about their attributes/props/state
    /// as well as asked to calculate/recalculate props.
    pub components: Vec<ComponentEnum>,
    /// A list of all strings in the document. Strings are stored here once and referenced when they appear as children.
    pub strings: Vec<String>,
    /// A counter for the number of virtual nodes created. Every virtual node needs to be unique (so that
    /// it can be referenced), but we don't store any information about virtual nodes themselves.
    virtual_node_count: usize,
    // XXX: fill these in
    props: Vec<()>,
    #[allow(dead_code)]
    states: Vec<()>,
    #[allow(dead_code)]
    queries: Vec<()>,
}

impl Default for Core {
    fn default() -> Self {
        Self::new()
    }
}

impl Core {
    pub fn new() -> Self {
        Core {
            structure_graph: DirectedGraph::new(),
            dependency_graph: DirectedGraph::new(),
            components: Vec::new(),
            strings: Vec::new(),
            props: Vec::new(),
            states: Vec::new(),
            queries: Vec::new(),
            virtual_node_count: 0,
        }
    }

    /// Generate a new `VirtualNode` with a unique id.
    fn new_virtual_node(&mut self) -> GraphNode {
        let node = GraphNode::Virtual(self.virtual_node_count);
        self.virtual_node_count += 1;
        node
    }

    fn new_string_node(&mut self, s: String) -> GraphNode {
        let node = GraphNode::String(self.strings.len());
        self.strings.push(s);
        node
    }

    /// Initialize `structure_graph`, `state_graph`, and other data
    /// from `dast`.
    ///
    /// This function relies upon the fact that `dast.nodes` will be the same length as `self.components`
    /// and exactly mirror it's structure (i.e., `dast.nodes[i].idx == self.components[i].idx`).
    pub fn init_from_normalized_root(&mut self, dast: &NormalizedRoot) {
        self.init_normalized_root_without_extending(dast);

        for idx in 0..self.components.len() {
            let elm = match &dast.nodes[idx] {
                NormalizedNode::Element(elm) => elm,
                _ => continue,
            };
            if elm.extending.is_none() {
                continue;
            }

            let ref_source = elm.extending.clone().unwrap();
            let component = &self.components[idx];
            let referent = &self.components[ref_source.idx()];

            match Self::determine_extending(ref_source, component, referent) {
                Ok(extending) => {
                    match extending {
                        Extending::Component(referent_idx) => {
                            self.add_component_extending_structure(idx, referent_idx);
                        }
                        Extending::Prop(prop_source) => {
                            self.add_prop_extending_structure(idx, prop_source);

                            // Check if we are extending from prop where
                            // the reference was inside the `extend` attribute.
                            // In that case, prepend a child corresponding to that prop.
                            let new_child = self.create_implicit_child_from_prop_source(
                                &self.components[idx],
                                prop_source,
                            );
                            if let Some(new_child) = new_child {
                                let new_child_idx = new_child.get_idx();
                                self.add_component_to_structure_graph(&new_child, &[], &[]);
                                self.prepend_child_to_structure_graph(idx, new_child_idx);
                                self.components.push(new_child);

                                // For the new child, we mark the `prop_source` with `from_direct_ref`,
                                // so that it will have a child pointing to the referent's prop.
                                let mut new_prop_source = prop_source;
                                new_prop_source.from_direct_ref = true;
                                self.add_prop_extending_structure(new_child_idx, new_prop_source);
                            }
                        }
                    }

                    // TODO: do we even need to set extending anymore?
                    self.components[idx].set_extending(Some(extending));
                }
                Err(err) => {
                    self.components[idx] = ComponentEnum::_Error(_Error {
                        message: format!("Error while extending: {}", err),
                        ..Default::default()
                    });
                    self.components[idx].set_idx(elm.idx);
                    self.components[idx].initialize(
                        elm.parent,
                        None,
                        HashMap::new(),
                        elm.position.clone(),
                    );
                }
            }
        }
    }

    /// DoenetML coerces the type of `extending` to allow users to be sloppy with types.
    ///
    /// The default behavior is to ignore the fact that the type changed,
    /// and simply copy children and attributes in the same way as when the type didn't change.
    ///
    /// For example, with
    /// ```xml
    /// <text name="t">x</text><math extend="$t">y</math>
    /// ```
    /// the `<math>` extends the `<text>` by taking its child `x` and essentially becoming `<math>xy</math>`.
    ///
    /// The `<textInput>` component, however, set the `extend_via_default_prop` flag
    /// and set its `default_prop` to be its `value` prop. Therefore,
    /// ```xml
    /// <textInput name="i" /><text extend="$i" />
    /// ```
    /// would be coerced to essentially becoming
    /// ```xml
    /// <textInput name="i" /><text extend="$i.value" />
    /// ```
    fn determine_extending(
        ref_source: Source<RefResolution>,
        component: &ComponentEnum,
        referent: &ComponentEnum,
    ) -> Result<Extending, anyhow::Error> {
        // If the referent is an error or external, we're immediately done.
        match referent {
            ComponentEnum::_Error(_) => {
                return Err(anyhow!(
                    "Attempted to extend component from an error component"
                ))
            }
            ComponentEnum::_External(_) => {
                return Err(anyhow!(
                    "Attempted to extend component from an external component"
                ))
            }
            _ => {}
        }

        // We need to keep track if the extension was from a direct ref
        // because the children were already copied to the component if it came from an attribute,
        // but not if it came from a direct ref.
        let from_direct_ref = match ref_source {
            Source::Attribute(..) => false,
            Source::Ref(..) => true,
        };

        let ref_resolution = ref_source.take_resolution();

        // Handle the case where there is a remaining path
        if let Some(unresolved_path) = &ref_resolution.unresolved_path {
            if unresolved_path.len() != 1 {
                return Err(anyhow!("Nested props not implemented yet"));
            }
            if !unresolved_path[0].index.is_empty() {
                return Err(anyhow!("Path indices not yet supported"));
            }
            let referenced_prop_name = &unresolved_path[0].name;

            // Look to see if there is a public prop with a matching name on `referent`
            return match referent
                .get_public_prop_index_from_name_case_insensitive(referenced_prop_name)
            {
                Some(referent_prop_idx) => Ok(Extending::Prop(PropSource {
                    prop_pointer: PropPointer {
                        component_idx: referent.get_idx(),
                        prop_idx: referent_prop_idx,
                    },
                    from_direct_ref,
                })),
                None => Err(anyhow!(
                    "prop {} not found on component {}",
                    referenced_prop_name,
                    referent.get_component_type()
                )),
            };
        }
        // If we're here, there is no remaining path.

        // If we are extending a component of the same type,
        // the component did not specify that it should extend via default prop,
        // then this is a "component extension",
        // which is treated differently than extending by a prop.
        if component.get_component_type() == referent.get_component_type()
            || !referent.extend_via_default_prop()
        {
            Ok(Extending::Component(referent.get_idx()))
        } else {
            // Since we are extending a component to a different type via default prop,
            // the component should have specified a default prop
            match referent.get_default_prop() {
                Some(default_prop) => Ok(Extending::Prop(PropSource {
                    prop_pointer: PropPointer {
                        component_idx: referent.get_idx(),
                        prop_idx: default_prop,
                    },
                    from_direct_ref,
                })),
                None => Err(anyhow!(
                    "Cannot extend {} via default prop because a default prop was not defined.",
                    referent.get_component_type()
                )),
            }
        }
    }

    /// If component `component_idx` extended a prop using the `extend` attribute,
    /// then create a child corresponding to that prop
    /// that should be prepended to the children of the component.
    ///
    /// For example, if `<textInput name="i"/>`, then we create a child corresponding to `$i.value`
    /// in the cases of `<text extend="$i.value>more text</text>` or `<p extend="$i.value">more text</p>`
    /// but not in the case of text component from `$i.value` that occurs outside the `extend` attribute.
    fn create_implicit_child_from_prop_source(
        &self,
        component: &ComponentEnum,
        prop_source: PropSource,
    ) -> Option<ComponentEnum> {
        if !prop_source.from_direct_ref {
            // the `Extending` was due to specifying a prop inside the `extend` attribute

            let prop_pointer = prop_source.prop_pointer;
            let referent = &self.components[prop_pointer.component_idx];

            // The creation of the new child mimics `create_component()`
            // for the case where there is a remaining path corresponding to the prop
            let new_component_type = referent
                .get_prop(prop_pointer.prop_idx)
                .unwrap()
                .preferred_component_type();

            let mut new_child = ComponentEnum::from_str(new_component_type).unwrap();

            new_child.set_idx(self.components.len());

            new_child.initialize(
                Some(component.get_idx()),
                Some(Extending::Prop(PropSource {
                    prop_pointer,
                    from_direct_ref: true,
                })),
                HashMap::new(),
                None,
            );
            Some(new_child)
        } else {
            None
        }
    }

    /// Creates all `components` but sets all their `extending` fields to `None`.
    /// This is an intermediate step that needs to be done before resolving references in `extending`.
    fn init_normalized_root_without_extending(&mut self, normalized_root: &NormalizedRoot) {
        // We are going to create components possibly out of order. We will track which components are created
        // and which are in the process of being created.
        let mut components: Vec<Option<ComponentEnum>> = std::iter::repeat_with(|| None)
            .take(normalized_root.nodes.len())
            .collect();

        // Creating the nodes lowest-index first should lead to less queueing than the other way around.
        let mut queue: Vec<usize> = Vec::from_iter((0..components.len()).rev());

        while let Some(idx) = queue.pop() {
            // In the worst case scenario, every node gets queued twice. If we do more than that, there
            // must be a circular dependency.
            if queue.len() > 2 * components.len() {
                panic!("Circular dependency while expanding nodes");
            }

            if components[idx].is_some() {
                // No need to remake a component.
                continue;
            }

            let node = &normalized_root.nodes[idx];
            match self.create_component(node, &components) {
                Ok(component) => {
                    components[idx] = Some(component);
                }
                Err(dependency_idx) => {
                    // If we have a dependency that needs to be created first, then we need to queue this node again.
                    queue.push(idx);
                    queue.push(dependency_idx);
                }
            }
        }

        // Every component should now be created, so this unwrap should be safe.
        self.components = components.into_iter().map(|c| c.unwrap()).collect();
    }

    /// Create a component from `node`.
    ///  - `node` - The node to create a component from.
    ///  - `components` - An array of already created components. When there is an `extending` field, the algorithm for deciding
    ///    what component to create is complicated and depends on other existing components.
    ///
    /// Returns:
    ///  - `Ok(component)` - The component created from `node`.
    ///  - `Err(idx)` - The index of a component that must be created before the component for `node` is created.
    fn create_component(
        &mut self,
        node: &NormalizedNode,
        components: &[Option<ComponentEnum>],
    ) -> Result<ComponentEnum, Index> {
        let component = match node {
            NormalizedNode::Element(elm) => {
                let mut component = ComponentEnum::from_str(&elm.name).unwrap_or_else(|_| {
                    // If we didn't find a match, then create a component of type external
                    ComponentEnum::_External(_External {
                        name: elm.name.clone(),
                        ..Default::default()
                    })
                });

                if let Some(Source::Ref(ref_resolution)) = &elm.extending {
                    // Some components specify that when they are referenced with the `$foo` syntax,
                    // a different component should be created in their place. E.g., `<textInput name="i" />$i`
                    // should become `<textInput name="i" /><text extend="$i` />`.
                    // This information is stored in `ref_transmutes_to()`.
                    if ref_resolution.unresolved_path.is_none() {
                        if let Some(name) = component.ref_transmutes_to() {
                            // It is forbidden to expand to an invalid component type, so we do not
                            // have a fallback to `_External` here.
                            component = ComponentEnum::from_str(name).unwrap();
                        }
                    } else {
                        // If there is a remaining path, we may need to further mutate the component.
                        // For example,  `<textInput name="i" />$i.value`
                        // should become `<textInput name="i" /><text extend="$i.value" />`
                        // rather than   `<textInput name="i" /><textInput extend="$i.value" />`
                        let path = ref_resolution.unresolved_path.as_ref().unwrap();
                        if path.len() == 1 && path[0].index.is_empty() {
                            let path_part = &path[0];
                            let referent = components[ref_resolution.node_idx].as_ref();
                            if referent.is_none() {
                                // We need information from this component, so it must be created first.
                                return Err(ref_resolution.node_idx);
                            }
                            let referent = referent.unwrap();
                            let referent_prop_idx = referent
                                .get_public_prop_index_from_name_case_insensitive(&path_part.name);
                            if let Some(referent_prop_idx) = referent_prop_idx {
                                let new_component_type = referent
                                    .get_prop(referent_prop_idx)
                                    .unwrap()
                                    .preferred_component_type();
                                if new_component_type != component.get_component_type() {
                                    component =
                                        ComponentEnum::from_str(new_component_type).unwrap();
                                }
                            }
                        }
                    }
                }

                component.set_idx(elm.idx);

                let unused_attributes = self.add_component_to_structure_graph(
                    &mut component,
                    &elm.children,
                    &elm.attributes,
                );

                // XXX: This should be updated when we update the type of information `component` stores.
                component.initialize(elm.parent, None, unused_attributes, elm.position.clone());

                component
            }
            NormalizedNode::Error(e) => {
                let mut error = _Error::new();
                error.message = e.message.clone();
                error.set_idx(e.idx);
                error.initialize(e.parent, None, HashMap::new(), e.position.clone());
                ComponentEnum::_Error(error)
            }
        };
        Ok(component)
    }

    /// Add `component` to the `structure_graph` along with links to its attributes, children, and props.
    fn add_component_to_structure_graph(
        &mut self,
        component: &ComponentEnum,
        children: &[UntaggedContent],
        attributes: &[FlatAttribute],
    ) -> HashMap<String, FlatAttribute> {
        println!(
            "adding component {} to structure graph",
            component.get_idx()
        );
        let graph_component_node = GraphNode::Component(component.get_idx());
        self.structure_graph.add_node(graph_component_node);

        //
        // Add a virtual node for the children and attach all children to it
        // **MUST** be the **first** child of `graph_component_node`
        //
        let graph_virtual_node = self.new_virtual_node();
        self.structure_graph.add_node(graph_virtual_node);
        self.structure_graph
            .add_edge(&graph_component_node, &graph_virtual_node);
        self.add_content_to_structure_graph(graph_virtual_node, children);

        //
        // Add a virtual node for the attributes and attach all attributes to it
        // **MUST** be the **second** child of `graph_component_node`
        //
        let graph_virtual_node = self.new_virtual_node();
        self.structure_graph.add_node(graph_virtual_node);
        self.structure_graph
            .add_edge(&graph_component_node, &graph_virtual_node);
        // These are the unused attributes that are not recognized by the component
        let mut unused_attributes = HashMap::<String, _>::from_iter(
            attributes
                .iter()
                .map(|attr| (attr.name.clone(), attr.clone())),
        );

        for attr_name in component.get_attribute_names() {
            // Each attribute's content is stored in a virtual node
            let attr_virtual_node = self.new_virtual_node();
            self.structure_graph.add_node(attr_virtual_node);
            self.structure_graph
                .add_edge(&graph_virtual_node, &attr_virtual_node);

            let attr_content = unused_attributes
                .remove_ignore_case(attr_name)
                .map_or_else(Vec::new, |v| v.children);
            self.add_content_to_structure_graph(attr_virtual_node, &attr_content);
        }

        //
        // Add a virtual node for the props and attach all props to it
        // **MUST** be the **third** child of `graph_component_node`
        //
        let graph_virtual_node = self.new_virtual_node();
        self.structure_graph.add_node(graph_virtual_node);
        self.structure_graph
            .add_edge(&graph_component_node, &graph_virtual_node);
        for _ in 0..component.get_num_props() {
            let prop_graph_node = GraphNode::Prop(self.props.len());
            // XXX: right now we don't do any caching or initialization of props, so we just push a placeholder
            self.props.push(());
            self.structure_graph.add_node(prop_graph_node);
            self.structure_graph
                .add_edge(&graph_virtual_node, &prop_graph_node);
        }

        unused_attributes
    }

    /// Add every node in `content` as a child node of `parent` in `structure_graph`.
    /// If `content` contains string children, they are added to `self.strings`.
    fn add_content_to_structure_graph(&mut self, parent: GraphNode, content: &[UntaggedContent]) {
        for child in content {
            match child {
                UntaggedContent::Ref(idx) => {
                    let graph_child_node = GraphNode::Component(*idx);
                    // `graph_child_node` may already be in the graph or it may be missing.
                    // If it is missing, it is automatically added, so there's no need to check.
                    self.structure_graph.add_edge(&parent, &graph_child_node);
                }
                UntaggedContent::Text(text) => {
                    let graph_string_node = self.new_string_node(text.clone());
                    self.structure_graph.add_node(graph_string_node);
                    self.structure_graph.add_edge(&parent, &graph_string_node);
                }
            }
        }
    }

    /// Add component `child_idx` as the first child of `parent_idx`.
    fn prepend_child_to_structure_graph(
        &mut self,
        parent_idx: ComponentIdx,
        child_idx: ComponentIdx,
    ) {
        let parent_node = GraphNode::Component(parent_idx);
        let child_node = GraphNode::Component(child_idx);

        let children_virtual_node = self.structure_graph.get_nth_child(&parent_node, 0).unwrap();
        self.structure_graph
            .prepend_edge(&children_virtual_node, &child_node);
    }

    /// Add to `structure_graph` the relationships from component `component_idx` extending component `referent_idx`.
    /// - The children of `referent` become the first children of `component` (i.e., become _virtual children_)
    /// - Attributes of `referent` that match attributes of `component` become backup attributes of `component`,
    ///   (i.e., become _virtual_attributes_)
    /// - If the component types of `component` and `referent` are the same,
    ///   then state props of `referent` are used for the state props of `component`
    fn add_component_extending_structure(
        &mut self,
        component_idx: ComponentIdx,
        referent_idx: ComponentIdx,
    ) {
        let component_node = GraphNode::Component(component_idx);
        let referent_node = GraphNode::Component(referent_idx);

        // The virtual node corresponding to `referent`'s children is the first child of `component`,
        // so that `referent`'s children will be the first children of `component`.
        let component_children_virtual_node = self
            .structure_graph
            .get_nth_child(&component_node, 0)
            .unwrap();
        let referent_children_virtual_node = self
            .structure_graph
            .get_nth_child(&referent_node, 0)
            .unwrap();
        self.structure_graph.prepend_edge(
            &component_children_virtual_node,
            &referent_children_virtual_node,
        );

        // Attributes from `referent` with the same name as an attribute from `component`
        // are added as dependency of the attribute from `component`
        // so that they will be used as a fallback if component doesn't have those attributes.

        // TODO: we could check if attributes of `component` were specified and then omit the dependency.
        let component_attributes_virtual_node = self
            .structure_graph
            .get_nth_child(&component_node, 1)
            .unwrap();
        let referent_attributes_virtual_node = self
            .structure_graph
            .get_nth_child(&referent_node, 1)
            .unwrap();

        let referent_attributes = self.components[referent_idx].get_attribute_names();

        for (attr_idx, attr_name) in self.components[component_idx]
            .get_attribute_names()
            .into_iter()
            .enumerate()
        {
            if let Some(ref_attr_idx) = referent_attributes.iter().position(|a| *a == attr_name) {
                // found a matching attribute. Add a link to the attributes
                let comp_attr = self
                    .structure_graph
                    .get_nth_child(&component_attributes_virtual_node, attr_idx)
                    .unwrap();

                let ref_attr = self
                    .structure_graph
                    .get_nth_child(&referent_attributes_virtual_node, ref_attr_idx)
                    .unwrap();

                self.structure_graph.add_edge(&comp_attr, &ref_attr);
            }
        }

        if self.components[component_idx].get_component_type()
            == self.components[referent_idx].get_component_type()
        {
            // Since the component types is the same, we make each prop of `referent` be a dependency
            // of the prop from `component`.
            // This dependency indicates that any state props requested by each prop of `component`
            // should be the corresponding state prop of `referent`.
            let component_props_virtual_node = self
                .structure_graph
                .get_nth_child(&component_node, 2)
                .unwrap();
            let referent_props_virtual_node = self
                .structure_graph
                .get_nth_child(&referent_node, 2)
                .unwrap();

            for prop_idx in 0..self.components[component_idx].get_num_props() {
                let comp_prop = self
                    .structure_graph
                    .get_nth_child(&component_props_virtual_node, prop_idx)
                    .unwrap();

                let ref_prop = self
                    .structure_graph
                    .get_nth_child(&referent_props_virtual_node, prop_idx)
                    .unwrap();

                self.structure_graph.add_edge(&comp_prop, &ref_prop);
            }
        }
    }

    /// Add to `structure_graph` the relationships from component `component_idx` extending the prop from `prop_source`.
    /// If `referent` is the component of `prop_source` and `prop` is its prop, then
    /// - Attributes of `referent` that match attributes of `component` become backup attributes of `component`,
    ///   (i.e., become _virtual_attributes_)
    /// - If `prop_source` is marked `from_direct_ref`, i.e., it came from a reference outside the `extend` attribute,
    ///   then make `prop` of `referent` be the first child of `component`.
    ///
    /// Note: if `prop_source` is not marked `from_direct_ref`, then an implicit child will have been added outside this function,
    /// so no child is added.
    fn add_prop_extending_structure(
        &mut self,
        component_idx: ComponentIdx,
        prop_source: PropSource,
    ) {
        let referent_idx = prop_source.prop_pointer.component_idx;

        let component_node = GraphNode::Component(component_idx);
        let referent_node = GraphNode::Component(referent_idx);

        let component_attributes_virtual_node = self
            .structure_graph
            .get_nth_child(&component_node, 1)
            .unwrap();
        let referent_attributes_virtual_node = self
            .structure_graph
            .get_nth_child(&referent_node, 1)
            .unwrap();

        let referent_attributes = self.components[referent_idx].get_attribute_names();

        for (attr_idx, attr_name) in self.components[component_idx]
            .get_attribute_names()
            .into_iter()
            .enumerate()
        {
            if let Some(ref_attr_idx) = referent_attributes.iter().position(|a| *a == attr_name) {
                // found a matching attribute. Add a link to the attributes
                let comp_attr = self
                    .structure_graph
                    .get_nth_child(&component_attributes_virtual_node, attr_idx)
                    .unwrap();

                let ref_attr = self
                    .structure_graph
                    .get_nth_child(&referent_attributes_virtual_node, ref_attr_idx)
                    .unwrap();

                self.structure_graph.add_edge(&comp_attr, &ref_attr);
            }
        }

        if prop_source.from_direct_ref {
            let component_children_virtual_node = self
                .structure_graph
                .get_nth_child(&component_node, 0)
                .unwrap();

            let referent_props_virtual_node = self
                .structure_graph
                .get_nth_child(&referent_node, 2)
                .unwrap();

            let referent_prop_node = self
                .structure_graph
                .get_nth_child(
                    &referent_props_virtual_node,
                    prop_source.prop_pointer.prop_idx,
                )
                .unwrap();

            self.structure_graph
                .prepend_edge(&component_children_virtual_node, &referent_prop_node);
        }
    }
}
