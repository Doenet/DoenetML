pub mod text;
pub mod number;
pub mod text_input;
pub mod document;
pub mod boolean;
pub mod p;
pub mod number_input;
pub mod boolean_input;
pub mod sequence;
pub mod graph;
pub mod point;

use crate::prelude::*;
use crate::state_variables::{StateVarValue, StateVarVariant};

use std::collections::HashMap;
use std::fmt::{Debug, self};



pub fn generate_component_definitions() -> HashMap<ComponentType, &'static ComponentDefinition> {
    let mut defs: HashMap<ComponentType, &'static ComponentDefinition> = HashMap::new();
    defs.insert("text",         &crate::text         ::MY_COMPONENT_DEFINITION);
    defs.insert("number"   ,    &crate::number       ::MY_COMPONENT_DEFINITION);
    defs.insert("textInput",    &crate::text_input   ::MY_COMPONENT_DEFINITION);
    defs.insert("document",     &crate::document     ::MY_COMPONENT_DEFINITION);
    defs.insert("boolean",      &crate::boolean      ::MY_COMPONENT_DEFINITION);
    defs.insert("p",            &crate::p            ::MY_COMPONENT_DEFINITION);
    defs.insert("numberInput",  &crate::number_input ::MY_COMPONENT_DEFINITION);
    defs.insert("booleanInput", &crate::boolean_input::MY_COMPONENT_DEFINITION);
    defs.insert("sequence",     &crate::sequence     ::MY_COMPONENT_DEFINITION);
    defs.insert("graph",        &crate::graph        ::MY_COMPONENT_DEFINITION);
    defs.insert("point",        &crate::point        ::MY_COMPONENT_DEFINITION);
    defs
}


#[derive(Debug, Clone)]
pub struct ComponentNode {

    pub name: ComponentName,
    pub parent: Option<ComponentName>,
    pub children: Vec<ComponentChild>,
    pub component_type: ComponentType,

    pub attributes: HashMap<String, Vec<ObjectName>>, // raw DoenetML

    // Flags
    pub copy_source: Option<CopySource>,

    pub definition: &'static ComponentDefinition,
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


#[derive(Clone, PartialEq, Eq, Debug, Hash)]
pub enum ComponentProfile {
    Text,
    Number,
    Boolean,
    Math,
    // Graphical,
}


pub struct ComponentDefinition {
    pub state_var_definitions: &'static HashMap<StateVarName, StateVarVariant>,

    /// An ordered list of which profiles this component fulfills, along with the name of the
    /// state variable that fulfills it.
    /// The first element in the list is the profile most preferred by this component
    pub component_profiles: Vec<(ComponentProfile, StateVarName)>,

    pub attribute_names: Vec<AttributeName>,

    /// Process an action and return the state variables to change.
    pub on_action: for<'a> fn(
        action_name: &str,
        args: HashMap<String, StateVarValue>,
        resolve_and_retrieve_state_var: &'a dyn Fn(&'a StateVarReference) -> StateVarValue
    ) -> HashMap<StateVarReference, StateVarValue>,

    pub should_render_children: bool,

    /// These have to match `on_action` and with what the renderers have
    pub action_names: fn() -> Vec<&'static str>,


    /// The primary input is a state variable, except it gets overridden if 
    /// the component is being copied from another state var
    pub primary_input_state_var: Option<StateVarName>,

    pub renderer_type: RendererType,
}



use crate::lazy_static;
lazy_static! {
    static ref EMPTY_STATE_VARS: HashMap<StateVarName, StateVarVariant> = {
        HashMap::new()
    };
}


impl Default for ComponentDefinition {
    fn default() -> Self {
        ComponentDefinition {
            state_var_definitions: &EMPTY_STATE_VARS,

            attribute_names: Vec::new(),

            should_render_children: false,

            renderer_type: RendererType::Myself,

            primary_input_state_var: None,

            component_profiles: vec![],

            action_names: || Vec::new(),

            on_action: |_, _, _| HashMap::new(),
        }
    }
}

impl Debug for ComponentDefinition {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("ComponentDefinition")
            .field("state_var_definitions", &self.state_var_definitions)
            .field("should_render_children", &self.should_render_children)
            .field("renderer_type", &self.renderer_type)
            .field("primary_input_state_var", &self.primary_input_state_var)
            .field("primary_output_traits", &self.component_profiles)
            .field("action_names", &(self.action_names)())
            .finish()
    }
}

pub type ComponentChild = ObjectName;

/// An object refers to either a component or a string child.
#[derive(Debug, PartialEq, Eq, Hash, Clone, serde::Serialize)]
pub enum ObjectName {
    Component(ComponentName),
    String(String),
}



#[derive(Debug)]
pub enum RendererType {
    Myself,
    Special(&'static str),
    // DoNotRender,
}

