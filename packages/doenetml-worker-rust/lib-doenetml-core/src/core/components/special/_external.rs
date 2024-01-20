use crate::components::prelude::*;

#[derive(Debug, Default, RenderedComponentNode, ComponentStateVariables)]
pub struct _External {
    pub common: ComponentCommonData,

    pub name: String,
    pub state: _ExternalStateVariables,
}

#[derive(Debug, Default)]
pub struct _ExternalStateVariables {}

// TODO: derive via macros
impl ComponentStateVariables for _ExternalStateVariables {
    fn get_num_state_variables(&self) -> StateVarIdx {
        0
    }
    fn get_state_variable(&self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRef> {
        None
    }

    fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRefMut> {
        None
    }

    fn get_state_variable_index_from_name(&self, name: &str) -> Option<StateVarIdx> {
        None
    }

    fn get_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx> {
        None
    }

    fn get_component_profile_state_variables(&self) -> Vec<ComponentProfileStateVariable> {
        vec![]
    }

    fn get_public_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx> {
        None
    }

    fn get_rendered_state_variable_indices(&self) -> Vec<StateVarIdx> {
        vec![]
    }

    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        None
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        None
    }
}

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
        _extend_source: Option<ExtendSource>,
        attributes: HashMap<String, DastAttribute>,
        position: Option<DastPosition>,
    ) {
        self.common.idx = idx;
        self.common.parent = parent;
        self.common.position = position;
        self.common.unevaluated_attributes = attributes;
    }

    fn get_extend(&self) -> Option<&ExtendSource> {
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

    fn get_is_rendered(&self) -> bool {
        self.common.is_rendered
    }

    fn set_is_rendered(&mut self, is_rendered: bool) {
        self.common.is_rendered = is_rendered;
    }
}
