use std::collections::HashMap;

use doenetml_derive::ComponentNode;

use crate::dast::Position as DastPosition;
use crate::{ComponentChild, ComponentInd, ExtendSource};

use super::ComponentNode;

#[derive(Debug, Default, ComponentNode)]
pub struct _Root {
    pub ind: ComponentInd,
    pub parent: Option<ComponentInd>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentInd>>,

    pub position: Option<DastPosition>,
}

impl _Root {
    pub fn new(
        ind: ComponentInd,
        parent: Option<ComponentInd>,
        extend: Option<ExtendSource>,
        position: Option<DastPosition>,
    ) -> Self {
        _Root {
            ind,
            parent,
            children: Vec::new(),
            extend,
            descendant_names: HashMap::new(),
            position,
        }
    }
}
