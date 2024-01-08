use std::collections::HashMap;

use crate::dast::Position as DastPosition;
use crate::state::StateVar;
use crate::utils::KeyValueIgnoreCase;
use crate::{ComponentChild, ComponentIdx, ExtendSource};

use super::{
    ComponentNode, ComponentNodeStateVariables, ComponentProfileStateVariable,
    RenderedComponentNode,
};

#[derive(Debug, Default, RenderedComponentNode, ComponentNodeStateVariables)]
pub struct _External {
    pub idx: ComponentIdx,
    pub parent: Option<ComponentIdx>,
    pub children: Vec<ComponentChild>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

    pub position: Option<DastPosition>,

    pub state_variables: Vec<StateVar>,

    pub rendered_state_variable_indices: Vec<usize>,

    pub public_state_variable_indices: Vec<usize>,

    pub state_variable_name_to_index: HashMap<String, usize>,

    pub component_profile_state_variables: Vec<ComponentProfileStateVariable>,

    pub name: String,
}

impl ComponentNode for _External {
    fn get_idx(&self) -> ComponentIdx {
        self.idx
    }
    fn get_parent(&self) -> Option<ComponentIdx> {
        self.parent
    }
    fn get_children(&self) -> &Vec<ComponentChild> {
        &self.children
    }
    fn set_children(&mut self, children: Vec<ComponentChild>) {
        self.children = children;
    }
    fn replace_children(&mut self, new_children: Vec<ComponentChild>) -> Vec<ComponentChild> {
        std::mem::replace(&mut self.children, new_children)
    }

    fn initialize(
        &mut self,
        idx: ComponentIdx,
        parent: Option<ComponentIdx>,
        _extend_source: Option<ExtendSource>,
        position: Option<DastPosition>,
    ) {
        self.idx = idx;
        self.parent = parent;
        self.position = position;

        self.initialize_state_variables();

        self.rendered_state_variable_indices = self
            .get_state_variables()
            .iter()
            .enumerate()
            .filter_map(|(ind, state_var)| state_var.get_for_renderer().then(|| ind))
            .collect();

        self.public_state_variable_indices = self
            .get_state_variables()
            .iter()
            .enumerate()
            .filter_map(|(ind, state_var)| state_var.get_is_public().then(|| ind))
            .collect();

        self.state_variable_name_to_index = HashMap::new();

        let name_to_index_pairs: Vec<_> = self
            .get_state_variables()
            .iter()
            .enumerate()
            .map(|(sv_idx, state_var)| (state_var.get_name().to_string(), sv_idx))
            .collect();

        self.state_variable_name_to_index
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
        self.descendant_names.get(name)
    }
    fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentIdx>>) {
        self.descendant_names = descendant_names;
    }

    fn get_position(&self) -> Option<&DastPosition> {
        self.position.as_ref()
    }

    fn set_position(&mut self, position: Option<DastPosition>) {
        self.position = position;
    }

    fn get_num_state_variables(&self) -> usize {
        self.state_variables.len()
    }

    fn get_state_variables(&self) -> &Vec<StateVar> {
        &self.state_variables
    }

    fn get_state_variables_mut(&mut self) -> &mut Vec<StateVar> {
        &mut self.state_variables
    }

    fn get_rendered_state_variable_indices(&self) -> &Vec<usize> {
        &self.rendered_state_variable_indices
    }

    fn get_public_state_variable_indices(&self) -> &Vec<usize> {
        &self.public_state_variable_indices
    }

    fn get_state_variable_index_from_name(&self, name: &String) -> Option<usize> {
        self.state_variable_name_to_index.get(name).copied()
    }

    fn get_state_variable_index_from_name_case_insensitive(&self, name: &String) -> Option<usize> {
        self.state_variable_name_to_index
            .get_key_value_ignore_case(name)
            .map(|(k, v)| *v)
    }

    fn get_component_profile_state_variables(&self) -> &Vec<ComponentProfileStateVariable> {
        &self.component_profile_state_variables
    }
}
