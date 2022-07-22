
use crate::prelude::*;
use crate::state_var::{StateVar, EssentialStateVar};
use crate::state_variables::{StateVarValue, StateVarValueType, StateVarVariant};

use std::collections::HashMap;
use std::fmt::{Debug, self};




pub enum AttributeDefinition {
    Component(ComponentType),
    Primitive(StateVarValueType),
}

#[derive(Debug, Clone)]
pub enum Attribute {
    Component(String),
    Primitive(StateVarValue)
}

#[derive(Debug, Clone)]
pub struct ComponentNode {

    pub name: String,
    pub parent: Option<String>,
    pub children: Vec<ComponentChild>,
    pub component_type: ComponentType,

    // Technically, a shadowing node should not have attributes

    pub attributes: Box<dyn AttributeData>, //assuming the AttributeData type matches with the component_type

    // Flags
    pub copy_target: Option<String>,
    pub is_shadow_for: Option<String>,

    pub definition: Box<dyn ComponentDefinition>,
}


pub trait AttributeData: Debug + CloneAttributeData {
    // attributes(&self)  -> HashMap

    fn get(&self, name: AttributeName) -> &Option<Attribute>;

    fn add_attribute(&mut self, name: AttributeName, attribute: Attribute) -> Result<(), String>;

    // fn add_if_exists(&self, attribute_name: AttributeName, attribute_value: StateVarValue) -> Option<String>
}



#[derive(Debug)]
pub enum ComponentState {
    State(Box<dyn ComponentStateVars>),
    Shadowing(String),
}

pub trait ComponentStateVars: Debug {
    fn get(&self, state_var_name: StateVarName) -> Result<&StateVar, String>;
    fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar>;
}


#[derive(Clone, PartialEq, Debug)]
pub enum ObjectTraitName {
    TextLike,
    NumberLike,
    ComponentLike,
}

pub trait ComponentDefinition: CloneComponentDefinition {
    fn attribute_definitions(&self) -> &'static HashMap<AttributeName, AttributeDefinition>;
    fn state_var_definitions(&self) -> &'static HashMap<StateVarName, StateVarVariant>;

    // Do we really need this?
    fn get_trait_names(&self) -> Vec<ObjectTraitName>;

    fn empty_attribute_data(&self) -> Box<dyn AttributeData>;
    fn new_stale_component_state_vars(&self) -> Box<dyn ComponentStateVars>;

    fn on_action<'a>(
        &'a self, _action_name: &str, _args: HashMap<String, StateVarValue>,
        _resolve_and_retrieve_state_var: &'a dyn Fn(StateVarName) -> StateVarValue
    ) -> HashMap<StateVarName, StateVarValue>
    {

        HashMap::new()
    }

    fn should_render_children(&self) -> bool;

    fn action_names(&self) -> Vec<&'static str> {
        vec![]
    }

}

impl Debug for dyn ComponentDefinition {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // f.debug_struct("Point")
        //  .field("x", &self.x)
        //  .field("y", &self.y)
        //  .finish()
        f.debug_struct("").finish()
    }
}


#[derive(Debug, PartialEq, Clone)]
pub enum ComponentChild {
    String(String),
    Component(String),
}





// Boiler plate to allow cloning of trait objects


pub trait CloneAttributeData {
    fn clone_attribute_data<'a>(&self) -> Box<dyn AttributeData>;
}

impl<T> CloneAttributeData for T
where
    T: AttributeData + Clone + 'static,
{
    fn clone_attribute_data<'a>(&self) -> Box<dyn AttributeData> {
        Box::new(self.clone())
    }
}

impl Clone for Box<dyn AttributeData> {
    fn clone(&self) -> Self {
        self.clone_attribute_data()
    }
}




pub trait CloneComponentDefinition {
    fn clone_comp_def<'a>(&self) -> Box<dyn ComponentDefinition>;
}

impl<T> CloneComponentDefinition for T
where
    T: ComponentDefinition + Clone + 'static,
{
    fn clone_comp_def<'a>(&self) -> Box<dyn ComponentDefinition> {
        Box::new(self.clone())
    }
}

impl Clone for Box<dyn ComponentDefinition> {
    fn clone(&self) -> Self {
        self.clone_comp_def()
    }
}


