use crate::components::prelude::*;

#[derive(
    Debug, Default, RenderedChildren, ComponentState, ComponentActions, ComponentAttributes,
)]
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
    fn get_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        &self.common.children
    }
    fn set_children(&mut self, children: Vec<ComponentPointerTextOrMacro>) {
        self.common.children = children;
    }
    fn replace_children(
        &mut self,
        new_children: Vec<ComponentPointerTextOrMacro>,
    ) -> Vec<ComponentPointerTextOrMacro> {
        std::mem::replace(&mut self.common.children, new_children)
    }

    fn initialize(
        &mut self,
        idx: ComponentIdx,
        parent: Option<ComponentIdx>,
        _extending: Option<ExtendSource>,
        attributes: HashMap<String, DastAttribute>,
        position: Option<DastPosition>,
    ) {
        self.common.idx = idx;
        self.common.parent = parent;
        self.common.position = position;
        self.common.unevaluated_attributes = attributes;
    }

    fn get_extending(&self) -> Option<&ExtendSource> {
        None
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
        attribute_children: HashMap<AttributeName, Vec<ComponentPointerTextOrMacro>>,
    ) {
        self.common.attribute_children = attribute_children;
    }

    fn get_attribute_children_for_attribute(
        &self,
        attribute: AttributeName,
    ) -> Option<&Vec<ComponentPointerTextOrMacro>> {
        self.common.attribute_children.get(attribute)
    }

    fn get_unevaluated_attributes(&self) -> &HashMap<String, DastAttribute> {
        &self.common.unevaluated_attributes
    }

    fn get_unevaluated_attributes_mut(&mut self) -> &mut HashMap<String, DastAttribute> {
        &mut self.common.unevaluated_attributes
    }

    fn get_is_in_render_tree(&self) -> bool {
        self.common.is_in_render_tree
    }

    fn set_is_in_render_tree(&mut self, is_in_render_tree: bool) {
        self.common.is_in_render_tree = is_in_render_tree;
    }
}
