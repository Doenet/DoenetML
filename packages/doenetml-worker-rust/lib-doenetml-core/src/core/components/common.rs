use std::collections::HashMap;

use enum_dispatch::enum_dispatch;
use strum_macros::EnumString;

use crate::attribute::{AttributeName, AttributeType};
use serde::{Deserialize, Serialize};

use crate::dast::{DastAttribute, Position as DastPosition};
use crate::state::{
    ComponentStateVariables, StateVarEnum, StateVarEnumRef, StateVarEnumRefMut, StateVarIdx,
    StateVarName, StateVarReadOnlyView, StateVarReadOnlyViewEnum, StateVarValueEnum,
};
use crate::{ComponentIdx, ComponentPointerTextOrMacro, ExtendSource};

use super::_error::_Error;
use super::_external::_External;
use super::doenet::boolean::{Boolean, BooleanRenderedState};
use super::doenet::document::Document;
use super::doenet::p::P;
use super::doenet::section::Section;
use super::doenet::text::{Text, TextRenderedState};
use super::doenet::text_input::{TextInput, TextInputAction, TextInputRenderedState};

/// A enum that can contain a component of any possible component type.
///
/// The component node traits are implemented on the `ComponentEnum`
/// to allow easy access to the methods.
///
/// Each component type added to `ComponentEnum` must implement that component node traits.
#[derive(Debug, EnumString)]
#[enum_dispatch(ComponentNode, ComponentStateVariables, RenderedComponentNode)]
#[strum(ascii_case_insensitive)]
pub enum ComponentEnum {
    Text(Text),
    TextInput(TextInput),
    Boolean(Boolean),
    Section(Section),
    Document(Document),
    P(P),
    _Error(_Error),
    _External(_External),
}

/// An enum listing the actions that are available for each component type.
/// A deserialized version of this action will be sent to the component.
#[derive(Debug, Deserialize, Serialize, derive_more::TryInto)]
#[serde(tag = "component")]
#[cfg_attr(feature = "web", derive(tsify::Tsify))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub enum ActionsEnum {
    TextInput(TextInputAction),
}

/// A enum listing the renderer data for each component.
///
/// Used for sending initial state to the renderer
///
/// TODO: do we need both RenderedState and RenderedVariable?
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum RenderedState {
    Text(TextRenderedState),
    TextInput(TextInputRenderedState),
    Boolean(BooleanRenderedState),
}

#[derive(Debug, Default)]
pub struct ComponentCommonData {
    pub idx: ComponentIdx,
    pub parent: Option<ComponentIdx>,
    pub children: Vec<ComponentPointerTextOrMacro>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

    pub position: Option<DastPosition>,

    pub rendered_state_variable_indices: Vec<StateVarIdx>,

    pub public_state_variable_indices: Vec<StateVarIdx>,

    pub component_profile_state_variables: Vec<ComponentProfileStateVariable>,

    pub attribute_types: HashMap<AttributeName, AttributeType>,

    pub attribute_children: HashMap<AttributeName, Vec<ComponentPointerTextOrMacro>>,

    pub unevaluated_attributes: HashMap<String, DastAttribute>,

    pub is_rendered: bool,
}

/// The Component trait specifies methods that will, in general, be implemented by deriving them.
/// It depends on the ComponentNodeStateVariables trait, which will be implemented
/// individually for each component type.
#[enum_dispatch]
pub trait ComponentNode: ComponentStateVariables {
    /// Get the index of the component, which is its index in the `components` vector of `DoenetMLCore`.
    fn get_idx(&self) -> ComponentIdx;
    /// Get the index of the parent node
    fn get_parent(&self) -> Option<ComponentIdx>;
    /// Get the vector containing the indices of all child component nodes and the literal string children.
    fn get_children(&self) -> &Vec<ComponentPointerTextOrMacro>;
    /// Set the vector containing the indices of all child component nodes and the literal string children.
    fn set_children(&mut self, children: Vec<ComponentPointerTextOrMacro>);
    /// Replace with new values the vector containing the indices of all child component nodes and the literal string children.
    fn replace_children(
        &mut self,
        new_children: Vec<ComponentPointerTextOrMacro>,
    ) -> Vec<ComponentPointerTextOrMacro>;

    /// Perform the following steps to initialize a component
    /// 1. Set its index, parent, extend source, and position in the original DoenetML string.
    /// 2. Initialize the state variables by calling `initialize_state_variables()`
    ///    from the `ComponentNodeStateVariables` trait.
    /// 3. Calculate the data structures underlying
    ///    - `get_rendered_state_variable_indices()`
    ///    - `get_public_state_variable_indices()`
    ///    - `get_state_variable_index_from_name()`
    fn initialize(
        &mut self,
        idx: ComponentIdx,
        parent: Option<ComponentIdx>,
        extend_source: Option<ExtendSource>,
        attributes: HashMap<String, DastAttribute>,
        position: Option<DastPosition>,
    );

    /// Get the extend source of this component,
    /// indicating any component or state variable that this component extends.
    fn get_extend(&self) -> Option<&ExtendSource>;

    /// Get the component type, which is the name of the component's struct
    /// converted to camel case.
    fn get_component_type(&self) -> &str;

    /// Get a vector of all the descendants of this component with name matching the `name` argument.
    fn get_descendant_matches(&self, name: &str) -> Option<&Vec<ComponentIdx>>;

    /// Set the information used to calculate `get_descendant_names()`.
    fn set_descendant_names(&mut self, descendant_names: HashMap<String, Vec<ComponentIdx>>);

    /// Get the position of this component in the original DoenetML string
    fn get_position(&self) -> Option<&DastPosition>;

    /// Set the position, which should be the position of this component in the original DoenetML string
    fn set_position(&mut self, position: Option<DastPosition>);

    /// Return a vector of the indices of each state variable that is sent to the renderer,
    /// i.e., that has the `for_renderer` parameter set to true.
    fn get_rendered_state_variable_indices(&self) -> &Vec<StateVarIdx>;

    /// Return a vector of the indices of each state variable that is public,
    /// i.e., that can be referenced with a macro.
    fn get_public_state_variable_indices(&self) -> &Vec<StateVarIdx>;

    /// Set the hash map containing for each attribute the vector of
    /// indices of all child component nodes and the literal string children.
    fn set_attribute_children(
        &mut self,
        attribute_children: HashMap<AttributeName, Vec<ComponentPointerTextOrMacro>>,
    );

    fn get_attribute_children_for_attribute(
        &self,
        attribute: AttributeName,
    ) -> Option<&Vec<ComponentPointerTextOrMacro>>;

    /// Get the hash map of all attributes that have not yet been evaluated to create attribute children.
    ///
    /// The hash map initially contains all attributes received from the dast,
    /// but then attributes that are defined for the component are removed.
    fn get_unevaluated_attributes(&self) -> &HashMap<String, DastAttribute>;

    /// Get a mutable reference to the hash map of all attributes that have not yet been evaluated to create attribute children.
    ///
    /// The hash map initially contains all attributes received from the dast,
    /// but then attributes that are defined for the component are removed.
    fn get_unevaluated_attributes_mut(&mut self) -> &mut HashMap<String, DastAttribute>;

    /// Get whether or not this component is to be rendered.
    ///
    /// Used to determine if its rendered state variables need to be freshened and set to the renderer.
    fn get_is_rendered(&self) -> bool;

    /// Set whether or not this component is to be rendered.
    ///
    /// Used to determine if its rendered state variables need to be freshened and set to the renderer.
    fn set_is_rendered(&mut self, is_rendered: bool);
}

/// The RenderedComponentNode trait can be derived for a component, giving it the default implementations.
/// To add actions or what information is sent when rendering, a component type can implement
/// the trait to override the defaults.
#[enum_dispatch]
pub trait RenderedComponentNode: ComponentNode {
    /// Return the children that will be used in the flat dast sent to the renderer.
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro> {
        self.get_children()
    }

    /// Return object will the values of all the rendered state variables
    fn return_rendered_state(&mut self) -> Option<RenderedState> {
        None
    }

    fn return_rendered_state_update(&mut self) -> Option<RenderedState> {
        None
    }

    /// Return a list of the attribute names that the component will accept
    fn get_attribute_names(&self) -> Vec<AttributeName> {
        // TODO: add default attribute names, like hide and disabled?
        // If so, should provide a mechanism for including default state variables depending on them.
        vec![]
    }

    /// Return a list of the action names that the renderer can call on this component.
    /// The list much match
    fn get_action_names(&self) -> Vec<String> {
        vec![]
    }

    /// The function called when a renderer calls an action on this component.
    /// Given an `action_name` that is in the vector returned by `get_action_names()`,
    /// the function processes the `args` to return a vector where each component
    /// specifies a state variable index and its desired value.
    ///
    /// Panics: if `action_name` is not in the vector returned by `get_action_names()`.
    #[allow(unused)]
    fn on_action(
        &self,
        action: ActionsEnum,
        resolve_and_retrieve_state_var: &mut dyn FnMut(StateVarIdx) -> StateVarValueEnum,
    ) -> Result<Vec<(StateVarIdx, StateVarValueEnum)>, String> {
        Err(format!(
            "Unknown action '{:?}' called on {}",
            action,
            self.get_component_type()
        ))
    }
}

/// The ComponentNodeStateVariables should be implemented individually for each
/// component type, as it will depend on its specific state variables.
#[enum_dispatch]
pub trait ComponentNodeStateVariables {
    /// Create the state variables for the component and save them to the component structure,
    /// along with any other state variable views for internal use by the component.
    ///
    /// Also create any component profile state variables.
    ///
    /// Assuming that the `ComponentNode` trait will be derived for the component, then
    /// - the vector of state variables should be saved to a field named `state_variables`,
    /// - the vector of component profile state variables should be saved to a field named
    ///   `component_profile_state_variables`.
    fn initialize_state_variables(&mut self) {}

    /// Return the number of state variables for the component.
    fn get_num_state_variables(&self) -> StateVarIdx {
        0
    }

    /// Return the state variable given by `state_var_idx` for this component
    fn get_state_variable(&self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRef> {
        None
    }

    /// Return a mutable view to the state variable given by `state_var_idx` for this component
    ///
    /// Since the state variable value and most meta data are behind a RefCell,
    /// a mutable view is not needed even to set the value. A mutable view is needed
    /// only to set values that are on the StateVarEnum that aren't behind the RefCell.
    /// Currently, the methods needing mut are those involving dependencies:
    /// - `record_all_dependencies_viewed()`
    /// - `set_dependencies()`
    fn get_state_variable_mut(&mut self, state_var_idx: StateVarIdx) -> Option<StateVarEnumRefMut> {
        None
    }

    /// Attempt to match `name` to the name of a state variable and return its index if found.
    fn get_state_variable_index_from_name(&self, name: &str) -> Option<StateVarIdx> {
        None
    }

    /// Attempt to match `name` to the name of a state variable using a case-insensitive match
    /// and return its index if found.
    fn get_state_variable_index_from_name_case_insensitive(
        &self,
        name: &str,
    ) -> Option<StateVarIdx> {
        None
    }
}

/// A `ComponentProfile` is used in the `DependencyInstruction` specifying children.
/// A component profile will match children that have a `ComponentProfileStateVariable` of the corresponding type,
/// and the resulting dependency will give the value of that state variable.
#[derive(Debug, Clone, PartialEq)]
pub enum ComponentProfile {
    Text,   // matched by text state variables, also matched by literal string children
    String, // matched by literal string children only
    Number,
    Integer,
    Boolean,
}

/// When a component designates a component profile state variable,
/// it means that the component can represent a state variable of a given type
/// by using the value of that specified state variable.
///
/// The component profile state variables are used to match the component profiles
/// specified in a dependency instruction requesting children.
///
/// A component specifies a vector of ComponentProfileStateVariables in priority order,
/// where the first ComponentProfileStateVariable matching a ComponentProfile
/// of a dependency instruction will determine the dependency.
#[derive(Debug, Clone)]
pub enum ComponentProfileStateVariable {
    Text(StateVarReadOnlyView<String>, StateVarIdx),
    String(StateVarReadOnlyView<String>, StateVarIdx),
    Number(StateVarReadOnlyView<f64>, StateVarIdx),
    Integer(StateVarReadOnlyView<i64>, StateVarIdx),
    Boolean(StateVarReadOnlyView<bool>, StateVarIdx),
}

// TODO: derive these with macro?
impl ComponentProfileStateVariable {
    /// Return the ComponentProfile that matches this ComponentProfileStateVariable
    /// so that it can be matched with the ComponentProfiles of a child dependency instruction.
    pub fn get_matching_profile(&self) -> ComponentProfile {
        match self {
            ComponentProfileStateVariable::Text(..) => ComponentProfile::Text,
            ComponentProfileStateVariable::String(..) => ComponentProfile::String,
            ComponentProfileStateVariable::Number(..) => ComponentProfile::Number,
            ComponentProfileStateVariable::Integer(..) => ComponentProfile::Integer,
            ComponentProfileStateVariable::Boolean(..) => ComponentProfile::Boolean,
        }
    }

    /// Convert into a state variable view enum of the component profile state variable
    /// as well as the state variable's index.
    ///
    /// Used to create the dependency matching ComponentProfile of a child dependency instruction.
    ///
    /// In this way, the state variable depending on the children can calculate its value
    /// from the state variable value of the ComponentProfileStateVariable.
    pub fn into_state_variable_view_enum_and_idx(self) -> (StateVarReadOnlyViewEnum, StateVarIdx) {
        match self {
            ComponentProfileStateVariable::Text(sv, state_var_idx) => {
                (StateVarReadOnlyViewEnum::String(sv), state_var_idx)
            }
            ComponentProfileStateVariable::String(sv, state_var_idx) => {
                (StateVarReadOnlyViewEnum::String(sv), state_var_idx)
            }
            ComponentProfileStateVariable::Number(sv, state_var_idx) => {
                (StateVarReadOnlyViewEnum::Number(sv), state_var_idx)
            }
            ComponentProfileStateVariable::Integer(sv, state_var_idx) => {
                (StateVarReadOnlyViewEnum::Integer(sv), state_var_idx)
            }
            ComponentProfileStateVariable::Boolean(sv, state_var_idx) => {
                (StateVarReadOnlyViewEnum::Boolean(sv), state_var_idx)
            }
        }
    }
}
