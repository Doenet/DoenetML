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
use crate::state_var::StateVar;
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
    Component(String),
    Primitive(StateVarValue)
}

#[derive(Debug, Clone)]
pub struct ComponentNode {

    pub name: String,
    pub parent: Option<String>,
    pub children: Vec<ComponentChild>,
    pub component_type: ComponentType,

    pub attributes: Box<dyn AttributeData>, //assuming the AttributeData type matches with the component_type

    // Flags
    pub copy_target: Option<CopyTarget>,

    pub definition: Box<dyn ComponentDefinition>,
}


pub trait AttributeData: Debug + CloneAttributeData {
    // attributes(&self)  -> HashMap

    fn get(&self, name: AttributeName) -> &Option<Attribute>;

    fn add_attribute(&mut self, name: AttributeName, attribute: Attribute) -> Result<(), String>;

    // fn add_if_exists(&self, attribute_name: AttributeName, attribute_value: StateVarValue) -> Option<String>
}


pub trait ComponentStateVars: Debug {
    fn get(&self, state_var_name: StateVarName) -> Result<&StateVar, String>;
}

/// How a CopyTarget affects its component
///
/// Component:
/// - This only works if the target component is the same type.
/// - In a `ChildUpdateInstruction`, the target's children are included before 
///   including its own. So without its own children, many of component'struct
///   state variables become exactly the same as the target's.
/// - For the renderer, these 'inherited' children are copied but need
///   a different name supplied by core's `aliases` HashMap. When the renderer 
///   sends an action that involves an alias, it is redirected
///   to the target's existing child.
/// - An `EssentialDependencyInstruction` will point to the target's
///   essential variables. The compnent does not have essential data for itself.
/// - Attributes are inherited from the target but are overridden when specified.
///
/// StateVar:
/// - Three `StateVariableDefinition` functions are overridden for the component's
///   'primary input' state variable (usually called 'value'):
///   - `return_dependency_instructions`
///   - `determine_state_var_from_dependencies`
///   - `request_dependencies_to_update_value`
///   These overrides cause the primary variable to depend on and copy the target.
/// - If the component type has no primary input, a StateVar CopyTarget will not work.
#[derive(Debug, Clone)]
pub enum CopyTarget {
    Component(String),
    StateVar(String, StateVarName),
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

    fn empty_attribute_data(&self) -> Box<dyn AttributeData>;
    fn new_stale_component_state_vars(&self) -> Box<dyn ComponentStateVars>;

    /// Process an action and return the state variables to change.
    fn on_action<'a>(
        &'a self,
        _action_name: &str,
        _args: HashMap<String, StateVarValue>,
        _resolve_and_retrieve_state_var: &'a dyn Fn(StateVarName) -> StateVarValue
    ) -> HashMap<StateVarName, StateVarValue> {
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
    Component(String),
    String(String),
}











// trait StateVariableDefinition<T> 
// where T:Default
// {

//     /// Some state variable's dependencies change based on other variables.
//     // pub state_vars_to_determine_dependencies: fn() -> Vec<StateVarName>,

//     /// Return the instructions that core can use to make Dependency structs.
//     fn return_dependency_instructions() -> HashMap<InstructionName, DependencyInstruction>;
    
//     /// Determine the value and return that to core as an update instruction.
//     fn determine_state_var_from_dependencies(dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
//     ) -> StateVarUpdateInstruction<T>;

//     fn for_renderer() -> bool {
//         false
//     }

//     fn default_value() -> T {
//         T::default()
//     }

//     // arg is desired value
//     fn request_dependencies_to_update_value(desired_value: T) -> Vec<UpdateRequest>;
// }



// struct Value(StateVar);
// impl StateVariableDefinition<String> for Value {

//     fn return_dependency_instructions() -> HashMap<InstructionName, DependencyInstruction> {
//         HashMap::new()
//     }

//     fn determine_state_var_from_dependencies(_dependency_values: HashMap<InstructionName, Vec<DependencyValue>>
//         ) -> StateVarUpdateInstruction<String> {
//         StateVarUpdateInstruction::SetValue("hi there".to_string())
//     }

//     fn request_dependencies_to_update_value(_desired_value: String) -> Vec<UpdateRequest> {
//         vec![]
//     }
// }











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


