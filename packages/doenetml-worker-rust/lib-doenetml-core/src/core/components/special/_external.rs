use crate::components::preamble::*;

#[derive(Debug, Default, RenderedComponentNode, ComponentNodeStateVariables)]
pub struct _External {
    pub common: ComponentCommonData,

    pub name: String,
}

impl ComponentNode for _External {
    fn get_idx(&self) -> ComponentIdx {
        self.common.idx
    }
    fn get_parent(&self) -> Option<ComponentIdx> {
        self.common.parent
    }
    fn get_children(&self) -> &Vec<ComponentChild> {
        &self.common.children
    }
    fn set_children(&mut self, children: Vec<ComponentChild>) {
        self.common.children = children;
    }
    fn replace_children(&mut self, new_children: Vec<ComponentChild>) -> Vec<ComponentChild> {
        std::mem::replace(&mut self.common.children, new_children)
    }

    fn initialize(
        &mut self,
        idx: ComponentIdx,
        parent: Option<ComponentIdx>,
        _extend_source: Option<ExtendSource>,
        position: Option<DastPosition>,
    ) {
        self.common.idx = idx;
        self.common.parent = parent;
        self.common.position = position;

        self.initialize_state_variables();

        self.common.rendered_state_variable_indices = self
            .get_state_variables()
            .iter()
            .enumerate()
            .filter_map(|(ind, state_var)| state_var.get_for_renderer().then(|| ind))
            .collect();

        self.common.public_state_variable_indices = self
            .get_state_variables()
            .iter()
            .enumerate()
            .filter_map(|(ind, state_var)| state_var.get_is_public().then(|| ind))
            .collect();

        self.common.state_variable_name_to_index = HashMap::new();

        let name_to_index_pairs: Vec<_> = self
            .get_state_variables()
            .iter()
            .enumerate()
            .map(|(sv_idx, state_var)| (state_var.get_name().to_string(), sv_idx))
            .collect();

        self.common
            .state_variable_name_to_index
            .extend(name_to_index_pairs);
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

    fn get_num_state_variables(&self) -> usize {
        self.common.state_variables.len()
    }

    fn get_state_variables(&self) -> &Vec<StateVar> {
        &self.common.state_variables
    }

    fn get_state_variables_mut(&mut self) -> &mut Vec<StateVar> {
        &mut self.common.state_variables
    }

    fn get_rendered_state_variable_indices(&self) -> &Vec<usize> {
        &self.common.rendered_state_variable_indices
    }

    fn get_public_state_variable_indices(&self) -> &Vec<usize> {
        &self.common.public_state_variable_indices
    }

    fn get_state_variable_index_from_name(&self, name: &String) -> Option<usize> {
        self.common.state_variable_name_to_index.get(name).copied()
    }

    fn get_state_variable_index_from_name_case_insensitive(&self, name: &String) -> Option<usize> {
        self.common
            .state_variable_name_to_index
            .get_key_value_ignore_case(name)
            .map(|(_k, v)| *v)
    }

    fn get_component_profile_state_variables(&self) -> &Vec<ComponentProfileStateVariable> {
        &self.common.component_profile_state_variables
    }
}
