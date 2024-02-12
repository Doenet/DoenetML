use crate::{components::prelude::*, dast::flat_dast::FlatAttribute};

#[derive(
    Debug, Default, RenderedChildren, ComponentState, ComponentActions, ComponentAttributes,
)]
#[pass_through_children]
pub struct _External {
    pub common: ComponentCommonData,

    pub name: String,
    pub state: _ExternalState,
}

#[derive(Debug, Default, ComponentState)]
pub struct _ExternalState {}

impl ComponentNode for _External {
    fn get_idx(&self) -> ComponentIdx {
        self.common.idx
    }
    fn get_parent(&self) -> Option<ComponentIdx> {
        self.common.parent
    }
    fn get_children(&self) -> &Vec<UntaggedContent> {
        &self.common.children
    }
    fn set_children(&mut self, children: Vec<UntaggedContent>) {
        self.common.children = children;
    }
    fn replace_children(&mut self, new_children: Vec<UntaggedContent>) -> Vec<UntaggedContent> {
        std::mem::replace(&mut self.common.children, new_children)
    }

    fn initialize(
        &mut self,
        idx: ComponentIdx,
        parent: Option<ComponentIdx>,
        _extending: Option<Extending>,
        unrecognized_attributes: HashMap<String, FlatAttribute>,
        position: Option<DastPosition>,
    ) {
        self.common.idx = idx;
        self.common.parent = parent;
        self.common.position = position;
        self.common.unrecognized_attributes = unrecognized_attributes;
    }

    fn get_extending(&self) -> Option<&Extending> {
        None
    }

    fn set_extending(&mut self, _extending: Option<Extending>) {
        // External components cannot extend anything, so this is a no-op
    }

    // The main reason we customize the implementation of ComponentNode
    // is to use this custom component type coming from name
    fn get_component_type(&self) -> &str {
        &self.name
    }
    fn get_descendant_matches(&self, name: &str) -> Option<&Vec<ComponentIdx>> {
        self.common.descendant_names.get(name)
    }
    fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentIdx>>) {
        self.common.descendant_names = descendant_names;
    }

    fn get_position(&self) -> Option<&DastPosition> {
        self.common.position.as_ref()
    }

    fn set_position(&mut self, position: Option<DastPosition>) {
        self.common.position = position;
    }

    fn set_attribute_children(
        &mut self,
        attribute_children: HashMap<AttributeName, Vec<UntaggedContent>>,
    ) {
        self.common.attribute_children = attribute_children;
    }

    fn get_attribute_children_for_attribute(
        &self,
        attribute: AttributeName,
    ) -> Option<&Vec<UntaggedContent>> {
        self.common.attribute_children.get(attribute)
    }

    fn get_unrecognized_attributes(&self) -> &HashMap<String, FlatAttribute> {
        &self.common.unrecognized_attributes
    }

    fn get_unrecognized_attributes_mut(&mut self) -> &mut HashMap<String, FlatAttribute> {
        &mut self.common.unrecognized_attributes
    }

    fn get_is_in_render_tree(&self) -> bool {
        self.common.is_in_render_tree
    }

    fn set_is_in_render_tree(&mut self, is_in_render_tree: bool) {
        self.common.is_in_render_tree = is_in_render_tree;
    }
}
