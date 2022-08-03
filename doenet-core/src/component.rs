pub mod text;
pub mod number;
pub mod text_input;
pub mod document;
pub mod boolean;
pub mod p;
pub mod number_input;
pub mod boolean_input;
pub mod sequence;

use crate::prelude::*;
use crate::state_variables::{StateVarValue, StateVarValueType, StateVarVariant};

use std::collections::HashMap;
use std::fmt::{Debug, self};



pub fn generate_component_definitions() -> HashMap<ComponentType, Box<dyn ComponentDefinition>> {
    HashMap::from([
        ("text",         Box::new(crate::text         ::MyComponentDefinition) as Box<dyn ComponentDefinition>),
        ("number"   ,    Box::new(crate::number       ::MyComponentDefinition) as Box<dyn ComponentDefinition>),
        ("textInput",    Box::new(crate::text_input   ::MyComponentDefinition) as Box<dyn ComponentDefinition>),
        ("document",     Box::new(crate::document     ::MyComponentDefinition) as Box<dyn ComponentDefinition>),
        ("boolean",      Box::new(crate::boolean      ::MyComponentDefinition) as Box<dyn ComponentDefinition>),
        ("p",            Box::new(crate::p            ::MyComponentDefinition) as Box<dyn ComponentDefinition>),
        ("numberInput",  Box::new(crate::number_input ::MyComponentDefinition) as Box<dyn ComponentDefinition>),
        ("booleanInput", Box::new(crate::boolean_input::MyComponentDefinition) as Box<dyn ComponentDefinition>),
        ("sequence",     Box::new(crate::sequence     ::MyComponentDefinition) as Box<dyn ComponentDefinition>),
    ])
}


pub enum AttributeDefinition {
    Component(ComponentType),
    Primitive(StateVarValueType),
}

#[derive(Debug, Clone)]
pub enum Attribute {
    Component(ComponentName), // attribute component
    Primitive(StateVarValue)
}

#[derive(Debug, Clone)]
pub struct ComponentNode {

    pub name: ComponentName,
    pub parent: Option<ComponentName>,
    pub children: Vec<ComponentChild>,
    pub component_type: ComponentType,

    // assuming the AttributeData type matches with the component_type
    pub attributes: HashMap<AttributeName, Attribute>,

    // Flags
    pub copy_source: Option<CopySource>,

    pub definition: Box<dyn ComponentDefinition>,
}



/// How a CopySource affects its component
///
/// Component:
/// - This only works if the source component is the same type.
/// - In a `ChildUpdateInstruction`, the source's children are included before 
///   including its own. So without its own children, many of component'struct
///   state variables become exactly the same as the source's.
/// - For the renderer, these 'inherited' children are copied but need
///   a different name supplied by core's `aliases` HashMap. When the renderer 
///   sends an action that involves an alias, it is redirected
///   to the source's existing child.
/// - An `EssentialDependencyInstruction` will point to the source's
///   essential variables. The component does not have essential data for itself.s
/// - Attributes are inherited from the source but are overridden when specified.
///
/// StateVar:
/// - Three `StateVariableDefinition` functions are overridden for the component's
///   'primary input' state variable (usually called 'value'):
///   - `return_dependency_instructions`
///   - `determine_state_var_from_dependencies`
///   - `request_dependencies_to_update_value`
///   These overrides cause the primary variable to depend on and copy the source.
/// - If the component type has no primary input, a StateVar CopySource will not work.
#[derive(Debug, Clone)]
pub enum CopySource {
    Component(ComponentName),
    StateVar(ComponentName, StateVarReference),
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

    //TODO: Do we really need this?
    fn get_trait_names(&self) -> Vec<ObjectTraitName>;

    /// Process an action and return the state variables to change.
    fn on_action<'a>(
        &'a self,
        _action_name: &str,
        _args: HashMap<String, StateVarValue>,
        _resolve_and_retrieve_state_var: &'a dyn Fn(&'a StateVarReference) -> StateVarValue
    ) -> HashMap<StateVarReference, StateVarValue> {
        HashMap::new()
    }

    fn should_render_children(&self) -> bool;

    /// These have to match `on_action` and with what the renderers have
    fn action_names(&self) -> Vec<&'static str> {
        vec![]
    }


    /// The primary input is a state variable, except it gets overridden if 
    /// the component is being copied from another state var
    fn primary_input_state_var(&self) -> Option<StateVarName> {
        None
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



pub type ComponentChild = ObjectName;

/// An object refers to either a component or a string child.
#[derive(Debug, PartialEq, Eq, Hash, Clone, serde::Serialize)]
pub enum ObjectName {
    Component(ComponentName),
    String(String),
}



// Boiler plate to allow cloning of trait objects

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

