use std::collections::HashMap;

use crate::dast::Position as DastPosition;
use crate::{ComponentChild, ComponentInd, ExtendSource};

use super::ComponentNode;

#[derive(Debug, Default)]
pub struct _External {
    pub idx: ComponentInd,
    pub parent: Option<ComponentInd>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentInd>>,

    pub position: Option<DastPosition>,

    pub name: String,
}

impl ComponentNode for _External {
    fn get_idx(&self) -> ComponentInd {
        self.idx
    }
    fn set_idx(&mut self, idx: ComponentInd) {
        self.idx = idx;
    }
    fn get_parent(&self) -> Option<ComponentInd> {
        self.parent
    }
    fn set_parent(&mut self, parent: Option<ComponentInd>) {
        self.parent = parent;
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
        idx: ComponentInd,
        parent: Option<ComponentInd>,
        position: Option<DastPosition>,
    ) {
        self.idx = idx;
        self.parent = parent;
        self.position = position;
    }

    fn get_extend(&self) -> &Option<ExtendSource> {
        &self.extend
    }
    fn set_extend(&mut self, extend_source: Option<ExtendSource>) {
        self.extend = extend_source;
    }

    // The reason we customize the implementation of ComponentNode
    // is to use this custom component type coming from name
    fn get_component_type(&self) -> &str {
        &self.name
    }
    fn get_descendant_matches(&self, name: &str) -> Option<&Vec<ComponentInd>> {
        self.descendant_names.get(name)
    }
    fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentInd>>) {
        self.descendant_names = descendant_names;
    }

    fn get_position(&self) -> &Option<DastPosition> {
        &self.position
    }

    fn set_position(&mut self, position: Option<DastPosition>) {
        self.position = position;
    }
}
