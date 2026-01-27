//! Build the `structure_graph` and initialize `components`.

use std::collections::HashMap;

use anyhow::anyhow;
use typed_index_collections::TiVec;

use crate::{
    components::{
        _Ref, Component, ComponentAttributes, ComponentCommon, ComponentCommonData, ComponentEnum,
        ComponentNode, ComponentProps,
        prelude::{
            ComponentIdx, Extending, ExtendingPropSource, FlatAttribute, KeyValueIgnoreCase,
            UntaggedContent,
        },
        types::{PropDefinitionIdx, PropPointer},
    },
    dast::{
        flat_dast::{Index, NormalizedNode, NormalizedRoot, Source},
        ref_resolve::RefResolution,
    },
    graph::directed_graph::{DirectedGraph, Taggable},
};

use super::{
    graph_node::{GraphNode, GraphNodeLookup},
    props::{PropDefinition, StringCache},
};

/// Initialize `structure_graph` and `components` based on a provided `normalized_root`.
/// This is a utility to assist in the initialization of `Core`.
pub struct ComponentBuilder {
    /// A graph that stores the structure of the document. This graph keeps
    /// track of children, attributes, props, and state.
    pub structure_graph: DirectedGraph<GraphNode, GraphNodeLookup<usize>>,
    /// The reified components. These can be queried for information about their attributes/props/state
    /// as well as asked to calculate/recalculate props.
    pub components: TiVec<ComponentIdx, Component>,
    /// Some components should not be expanded when they are extending something else. Instead they should be
    /// turned into the internal `_ref` component. This vec stores whether an _extend_ing component should be
    /// turned into a `_ref` component.
    component_preserve_refs: TiVec<ComponentIdx, bool>,
    /// A list of all strings in the document. Strings are stored here once and referenced when they appear as children.
    pub strings: StringCache,
    /// A counter for the number of virtual nodes created. Every virtual node needs to be unique (so that
    /// it can be referenced), but we don't store any information about virtual nodes themselves.
    pub virtual_node_count: usize,
    // Information about each prop sufficient for resolving `DataQuery`s.
    pub props: TiVec<PropDefinitionIdx, PropDefinition>,
    /// Stores whether a particular virtual node was created to house the children coming from another component
    /// because it was `extend`ing another component.
    pub children_came_from_extending_marker: GraphNodeLookup<bool>,
}

impl Default for ComponentBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl ComponentBuilder {
    pub fn new() -> Self {
        ComponentBuilder {
            structure_graph: DirectedGraph::new(),
            components: TiVec::new(),
            component_preserve_refs: TiVec::new(),
            strings: StringCache::new(),
            props: TiVec::new(),
            virtual_node_count: 0,
            children_came_from_extending_marker: GraphNodeLookup::new(),
        }
    }

    pub fn from_normalized_root(normalized_root: &NormalizedRoot) -> Self {
        let mut builder = Self::new();
        builder.init_from_normalized_root(normalized_root);
        builder
    }

    /// Generate a new `VirtualNode` with a unique id.
    fn new_virtual_node(&mut self) -> GraphNode {
        let node = GraphNode::Virtual(self.virtual_node_count);
        self.virtual_node_count += 1;
        node
    }

    fn new_string_node(&mut self, s: String) -> GraphNode {
        let idx = self.strings.add_string(s);
        GraphNode::String(idx)
    }

    /// Initialize `structure_graph`, `state_graph`, and other data
    /// from `dast`.
    ///
    /// This function relies upon the fact that `dast.nodes` will be the same length as `self.components`
    /// and exactly mirror it's structure (i.e., `dast.nodes[i].idx == self.components[i].idx`).
    fn init_from_normalized_root(&mut self, dast: &NormalizedRoot) {
        self.init_normalized_root_without_extending(dast);

        for idx in 0..self.components.len() {
            let component_idx = ComponentIdx::new(idx);
            let elm = match &dast.nodes[idx] {
                NormalizedNode::Element(elm) => elm,
                _ => continue,
            };
            if elm.extending.is_none() {
                continue;
            }

            let component = &self.components[component_idx];
            if matches!(component.variant, ComponentEnum::_Ref(_)) {
                // The `_Ref` component is special, keeping a pointer to its referent
                // but never getting connected to it.
                continue;
            }
            let ref_source = elm.extending.clone().unwrap();
            let referent = &self.components[ComponentIdx::from(ref_source.idx())];

            match Self::determine_extending(ref_source, component, referent) {
                Ok(extending) => {
                    match extending {
                        Extending::Component(referent_idx) => {
                            self.add_component_extending_structure(component_idx, referent_idx);
                        }
                        Extending::Prop(prop_source) => {
                            self.add_prop_extending_structure(component_idx, prop_source);

                            // Check if we are extending from prop where
                            // the reference was inside the `extend` attribute.
                            // In that case, prepend a child corresponding to that prop.
                            let new_child = self.create_implicit_child_from_prop_source(
                                &self.components[component_idx],
                                prop_source,
                            );
                            if let Some(new_child) = new_child {
                                let new_child_idx = new_child.get_idx();
                                self.add_component_to_structure_graph(&new_child, &[], &[]);

                                self.prepend_component_child(
                                    GraphNode::Component(idx),
                                    new_child_idx.as_graph_node(),
                                );
                                self.components.push(new_child);

                                // For the new child, we mark the `prop_source` with `from_direct_ref`,
                                // so that it will have a child pointing to the referent's prop.
                                let mut new_prop_source = prop_source;
                                new_prop_source.from_direct_ref = true;
                                self.add_prop_extending_structure(new_child_idx, new_prop_source);
                            }
                        }
                    }
                }
                Err(err) => {
                    self.components[component_idx] = Component::new_error(
                        format!("Error while extending: {err}"),
                        ComponentCommonData {
                            idx: component_idx,
                            parent: elm.parent.map(ComponentIdx::from),
                            position: elm.position.clone(),
                            unrecognized_attributes: HashMap::new(),
                        },
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
        component: &Component,
        referent: &Component,
    ) -> Result<Extending, anyhow::Error> {
        // If the referent is an error or external, we're immediately done.
        match referent.variant {
            ComponentEnum::_Error(_) => {
                return Err(anyhow!(
                    "Attempted to extend component from an error component"
                ));
            }
            ComponentEnum::_External(_) => {
                return Err(anyhow!(
                    "Attempted to extend component from an external component"
                ));
            }
            _ => {}
        }

        // We need to keep track if the extension was from a direct ref
        // because the children were already copied to the component if it came from an attribute,
        // but not if it came from a direct ref.
        let from_direct_ref = match ref_source {
            Source::ExtendAttribute(..) => false,
            Source::CopyAttribute(..) => false,
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
                .get_public_local_prop_index_from_name_case_insensitive(referenced_prop_name)
            {
                Some(referent_prop_idx) => Ok(Extending::Prop(ExtendingPropSource {
                    prop_pointer: PropPointer {
                        component_idx: referent.get_idx(),
                        local_prop_idx: referent_prop_idx,
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
            match referent.get_default_prop_local_index() {
                Some(default_prop) => Ok(Extending::Prop(ExtendingPropSource {
                    prop_pointer: PropPointer {
                        component_idx: referent.get_idx(),
                        local_prop_idx: default_prop,
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
    /// then create a child corresponding to that prop that should be prepended to the children of the component.
    ///
    /// For example, if `<textInput name="i"/>`, then we create a child corresponding to `$i.value`
    /// in the cases of `<text extend="$i.value">more text</text>` or `<p extend="$i.value">more text</p>`
    /// but not in the case of text component from `$i.value` that occurs outside the `extend` attribute.
    fn create_implicit_child_from_prop_source(
        &self,
        component: &Component,
        prop_source: ExtendingPropSource,
    ) -> Option<Component> {
        if !prop_source.from_direct_ref {
            // the `Extending` was due to specifying a prop inside the `extend` attribute

            let prop_pointer = prop_source.prop_pointer;

            let prop_idx = self
                .structure_graph
                .get_component_props(prop_pointer.component_idx)[prop_pointer.local_prop_idx]
                .prop_idx();
            let new_component_type = self.props[prop_idx].preferred_component_type();

            let new_child = Component::from_tag_name(
                new_component_type,
                ComponentCommonData {
                    idx: self.components.len().into(),
                    parent: Some(component.get_idx()),
                    position: None,
                    unrecognized_attributes: HashMap::new(),
                },
            );

            Some(new_child)
        } else {
            None
        }
    }

    /// Creates all `components` but sets all their `extending` fields to `None`.
    /// This is an intermediate step that needs to be done before resolving references in `extending`.
    fn init_normalized_root_without_extending(&mut self, normalized_root: &NormalizedRoot) {
        // Keep track of special expanding behavior for components with `extend`.
        self.component_preserve_refs =
            TiVec::from_iter(std::iter::repeat_n(false, normalized_root.nodes.len()));

        // We are going to create components possibly out of order. We will track which components are created
        // and which are in the process of being created.
        let mut components: Vec<Option<Component>> = std::iter::repeat_with(|| None)
            .take(normalized_root.nodes.len())
            .collect();

        // Creating the nodes lowest-index first. This
        //  1. is assumed by the algorithm which specializes the `extend` expansion/resolution, and
        //  2. should lead to less queueing than the other way around.
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
        components: &[Option<Component>],
    ) -> Result<Component, Index> {
        let component = match node {
            NormalizedNode::Element(elm) => {
                let mut component = Component::from_tag_name(
                    &elm.name,
                    ComponentCommonData {
                        idx: elm.idx.into(),
                        parent: elm.parent.map(ComponentIdx::from),
                        position: elm.position.clone(),
                        unrecognized_attributes: HashMap::new(),
                    },
                );

                // Some of a component's attributes may specify that refs in those attributes should not be expanded.
                // We mark the corresponding components.
                // Because the component's attributes have not been processed yet, we need to look up the corresponding
                // attributes from `node`
                for preserve_ref_attr_name in component
                    .get_preserve_ref_attribute_indices()
                    .iter()
                    .map(|idx| component.get_attribute_names()[*idx])
                {
                    let attr = elm
                        .attributes
                        .iter()
                        .find(|a| a.name == preserve_ref_attr_name);
                    if attr.is_none() {
                        continue;
                    }
                    let attr = attr.unwrap();
                    for child in &attr.children {
                        match child {
                            UntaggedContent::Ref(idx) => {
                                self.component_preserve_refs[ComponentIdx::from(*idx)] = true;
                            }
                            _ => {}
                        }
                    }
                }

                if self.component_preserve_refs[component.get_idx()] {
                    // If we're here, we have special expanding behavior.
                    // We want to expand _most_ components that are marked with `extending`, but not all.
                    // Components that are children of an attribute that has the `preserve_refs` flag set
                    // are protected and should be converted into a special `_ref` component instead of being linked
                    // to their extend referent.
                    if let Some(ref_source) = &elm.extending {
                        let ref_resolution = match ref_source {
                            Source::Ref(ref_resolution) => ref_resolution,
                            _ => unreachable!(
                                "Encountered an extend of style <foo extend='$xxx' /> inside of an attribute. It should be syntactically impossible to parse such an element in an attribute."
                            ),
                        };
                        if ref_resolution.unresolved_path.is_some() {
                            // XXX: this should result in the component being converted into an error, not a hard panic.
                            // TODO: Not only should this not be an error, but sometimes it is valid. For example `<point name="p">(3,2)</point><updateValue target="$p.x" newValue="$p.x+1" />`
                            panic!(
                                "Cannot preserve_refs if there is a remaining path part. Remaining: {:?}",
                                ref_resolution.unresolved_path
                            );
                        }
                        // If we made it here, we are a ref pointing to a component and we should not actually be expanded
                        // to a copy of our referent. Instead we should be replaced with a special `_ref` component that preserves the pointer.
                        let referent_idx = ComponentIdx::from(ref_resolution.node_idx);

                        // The new component!
                        component = Component {
                            common: component.common,
                            variant: ComponentEnum::_Ref(_Ref { referent_idx }),
                        };
                    }
                } else if let Some(Source::Ref(ref_resolution)) = &elm.extending {
                    // Some components specify that when they are referenced with the `$foo` syntax,
                    // a different component should be created in their place. E.g., `<textInput name="i" />$i`
                    // should become `<textInput name="i" /><text extend="$i` />`.
                    // This information is stored in `ref_transmutes_to()`.
                    if ref_resolution.unresolved_path.is_none() {
                        if let Some(name) = component.ref_transmutes_to() {
                            // It is forbidden to expand to an invalid component type, so we do not
                            // have a fallback to `_External` here.
                            component = Component::from_tag_name(name, component.common);
                        }
                    } else {
                        // If there is a remaining path, we may need to further mutate the component.
                        // For example,  `<textInput name="i" />$i.value`
                        // should become `<textInput name="i" /><text extend="$i.value" />`
                        // rather than   `<textInput name="i" /><textInput extend="$i.value" />`
                        #[allow(clippy::unnecessary_unwrap)]
                        let path = ref_resolution.unresolved_path.as_ref().unwrap();
                        if path.len() == 1 && path[0].index.is_empty() {
                            let path_part = &path[0];
                            let referent = components[ref_resolution.node_idx].as_ref();
                            if referent.is_none() {
                                // We need information from this component, so it must be created first.
                                return Err(ref_resolution.node_idx);
                            }
                            let referent = referent.unwrap();
                            let referent_local_prop_idx = referent
                                .get_public_local_prop_index_from_name_case_insensitive(
                                    &path_part.name,
                                );
                            if let Some(referent_local_prop_idx) = referent_local_prop_idx {
                                let prop_idx =
                                    self.structure_graph.get_component_props(referent.get_idx())
                                        [referent_local_prop_idx]
                                        .prop_idx();

                                let new_component_type =
                                    self.props[prop_idx].preferred_component_type();
                                if new_component_type != component.get_component_type() {
                                    component = Component::from_tag_name(
                                        new_component_type,
                                        component.common,
                                    );
                                }
                            }
                        }
                    }
                }

                let unrecognized_attributes = self.add_component_to_structure_graph(
                    &component,
                    &elm.children,
                    &elm.attributes,
                );
                component.set_unrecognized_attributes(unrecognized_attributes);

                component
            }
            NormalizedNode::Error(e) => Component::new_error(
                e.message.clone(),
                ComponentCommonData {
                    idx: e.idx.into(),
                    parent: e.parent.map(ComponentIdx::from),
                    position: e.position.clone(),
                    unrecognized_attributes: HashMap::new(),
                },
            ),
        };
        Ok(component)
    }

    /// Add `component` to the `structure_graph` along with links to its attributes, children, and props.
    /// Returns a HashMap of attributes that were not recognized by the component.
    fn add_component_to_structure_graph(
        &mut self,
        component: &Component,
        children: &[UntaggedContent],
        attributes: &[FlatAttribute],
    ) -> HashMap<String, FlatAttribute> {
        let graph_component_node = component.get_idx().as_graph_node();
        self.structure_graph.add_node(graph_component_node);

        //
        // Add a virtual node for the children and attach all children to it
        // **MUST** be the **first** child of `graph_component_node`
        //
        let graph_virtual_node = self.new_virtual_node();
        self.structure_graph.add_node(graph_virtual_node);
        self.structure_graph
            .add_edge(graph_component_node, graph_virtual_node);
        self.add_content_to_structure_graph(graph_virtual_node, children);

        //
        // Add a virtual node for the attributes and attach all attributes to it
        // **MUST** be the **second** child of `graph_component_node`
        //
        let graph_virtual_node = self.new_virtual_node();
        self.structure_graph.add_node(graph_virtual_node);
        self.structure_graph
            .add_edge(graph_component_node, graph_virtual_node);
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
                .add_edge(graph_virtual_node, attr_virtual_node);

            let attr_content =
                unused_attributes
                    .remove_ignore_case(attr_name)
                    .map_or_else(Vec::new, |v| {
                        if v.children.is_empty() {
                            // if an attribute was supplied by given no content,
                            // then make it the same as giving it a empty string
                            // (e.g., `<textInput hide/>` should be the same as `<textInput hide=""/>`)
                            vec![UntaggedContent::Text("".to_string())]
                        } else {
                            v.children
                        }
                    });
            self.add_content_to_structure_graph(attr_virtual_node, &attr_content);
        }

        //
        // Add a virtual node for the props and attach all props to it
        // **MUST** be the **third** child of `graph_component_node`
        //
        let graph_virtual_node = self.new_virtual_node();
        self.structure_graph.add_node(graph_virtual_node);
        self.structure_graph
            .add_edge(graph_component_node, graph_virtual_node);

        for prop in component.generate_props() {
            let prop_graph_node = GraphNode::Prop(self.props.len());
            self.props.push(prop);
            self.structure_graph
                .add_edge(graph_virtual_node, prop_graph_node);
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
                    self.structure_graph.add_edge(parent, graph_child_node);
                }
                UntaggedContent::Text(text) => {
                    let graph_string_node = self.new_string_node(text.clone());
                    self.structure_graph.add_node(graph_string_node);
                    self.structure_graph.add_edge(parent, graph_string_node);
                }
            }
        }
    }

    /// Add component `child_node` as the first child of `parent_node`.
    fn prepend_component_child(&mut self, parent_node: GraphNode, child_node: GraphNode) {
        let children_virtual_node = self
            .structure_graph
            .get_component_children_virtual_node(parent_node);
        self.structure_graph
            .prepend_edge(children_virtual_node, child_node);
    }

    /// Add to `structure_graph` the relationships from when a component extends another component,
    /// such as when, in `<text name="t">hello</text><text extend="$t"> world</text>`,
    /// the second `<text>` extends the first.
    ///
    /// Designating the component of `component_idx` as `component` and the component of `referent_idx` as `referent`,
    /// the following relationships are formed when `component` extends `referent`:
    /// - The children of `referent` become the first children of `component` (i.e., become _virtual children_)
    /// - Attributes of `referent` that match attributes of `component` become backup attributes of `component`,
    ///   (i.e., become _virtual attributes_). If an attribute is specified explicitly, no virtual attribute is created.
    /// - If the component types of `component` and `referent` are the same,
    ///   then state props of `referent` are used for the state props of `component`
    fn add_component_extending_structure(
        &mut self,
        component_idx: ComponentIdx,
        referent_idx: ComponentIdx,
    ) {
        // The virtual node corresponding to `referent`'s children is the first child of `component`,
        // so that `referent`'s children will be the first children of `component`.
        let component_children_virtual_node = self
            .structure_graph
            .get_component_children_virtual_node(component_idx);
        let referent_children_virtual_node = self
            .structure_graph
            .get_component_children_virtual_node(referent_idx);
        // We create an intermediate virtual node so that we can mark it. This will indicate its descendants
        // came from extending another component and aren't "original".
        let intermediate_virtual_node = self.new_virtual_node();
        self.children_came_from_extending_marker
            .set_tag(intermediate_virtual_node, true);
        self.structure_graph
            .prepend_edge(component_children_virtual_node, intermediate_virtual_node);
        self.structure_graph
            .add_edge(intermediate_virtual_node, referent_children_virtual_node);

        // Attributes from `referent` with the same name as an attribute from `component`
        // are added as dependency of the attribute from `component`
        // so that they will be used as a fallback if component doesn't have those attributes.

        let component_attributes = self.structure_graph.get_component_attributes(component_idx);
        let referent_attributes = self.structure_graph.get_component_attributes(referent_idx);

        let referent_attribute_names = self.components[referent_idx].get_attribute_names();

        for (attr_idx, attr_name) in self.components[component_idx]
            .get_attribute_names()
            .into_iter()
            .enumerate()
        {
            // If the attribute already has children, its value will be determined by the children
            // and won't use any information from the referent component.
            if !self
                .structure_graph
                .get_children(component_attributes[attr_idx])
                .is_empty()
            {
                continue;
            }

            if let Some(ref_attr_idx) = referent_attribute_names
                .iter()
                .position(|a| *a == attr_name)
            {
                // found a matching attribute. Add a link to the attributes
                let comp_attr = component_attributes[attr_idx];
                let ref_attr = referent_attributes[ref_attr_idx];
                self.structure_graph.add_edge(comp_attr, ref_attr);
            }
        }

        if self.components[component_idx].get_component_type()
            == self.components[referent_idx].get_component_type()
        {
            // Since the component types is the same, we make each prop of `referent` be a dependency
            // of the prop from `component`.
            // This dependency indicates that any state props requested by each prop of `component`
            // should be the corresponding state prop of `referent`.

            let component_props = self.structure_graph.get_component_props(component_idx);
            let referent_props = self.structure_graph.get_component_props(referent_idx);

            for (comp_prop, ref_prop) in component_props.iter().zip(referent_props.iter()) {
                self.structure_graph.add_edge(comp_prop, ref_prop);
            }
        }
    }

    /// Add to `structure_graph` the relationships from a component extending the prop of another component,
    /// such as when, in `<textInput name="i"/>$i.value`,
    /// the reference `$i.value` becomes a `<text>` that is extending the value prop of the `<textInput>`.
    ///
    /// Designating the component of `component_idx` as `component`,
    /// the component of `prop_source` as `referent`,
    /// and the prop of `prop_source` as `prop`,
    /// the following relationships are formed when `component` extends `prop` of `referent`:
    /// - Attributes of `referent` that match attributes of `component` become backup attributes of `component`,
    ///   (i.e., become _virtual_attributes_)
    /// - If `prop_source` is marked `from_direct_ref`, i.e., it came from a reference outside the `extend` attribute,
    ///   such as in the above example,
    ///   then make `prop` of `referent` be the first child of `component`.
    ///
    /// Note: if `prop_source` is not marked `from_direct_ref`,
    /// then it came from a reference inside the `extend` attribute,
    /// such as in `<textInput name="i"/><text extend="$i.value"/>`.
    /// In this case, an implicit child (corresponding to `$i.value` in the example)
    /// will have been already been added so no additional child is needed.
    fn add_prop_extending_structure(
        &mut self,
        component_idx: ComponentIdx,
        prop_source: ExtendingPropSource,
    ) {
        let referent_idx = prop_source.prop_pointer.component_idx;

        let component_attributes = self.structure_graph.get_component_attributes(component_idx);
        let referent_attributes = self.structure_graph.get_component_attributes(referent_idx);

        let referent_attributes_names = self.components[referent_idx].get_attribute_names();

        for (attr_idx, attr_name) in self.components[component_idx]
            .get_attribute_names()
            .into_iter()
            .enumerate()
        {
            if let Some(ref_attr_idx) = referent_attributes_names
                .iter()
                .position(|a| *a == attr_name)
            {
                // found a matching attribute. Add a link to the attributes
                let comp_attr = component_attributes[attr_idx];
                let ref_attr = referent_attributes[ref_attr_idx];
                self.structure_graph.add_edge(comp_attr, ref_attr);
            }
        }

        if prop_source.from_direct_ref {
            let component_children_virtual_node = self
                .structure_graph
                .get_component_children_virtual_node(component_idx);

            let referent_prop_node = self.structure_graph.get_component_props(referent_idx)
                [prop_source.prop_pointer.local_prop_idx];

            self.structure_graph
                .prepend_edge(component_children_virtual_node, referent_prop_node);
        }
    }
}
