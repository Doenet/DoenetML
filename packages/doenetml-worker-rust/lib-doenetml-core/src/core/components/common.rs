use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use enum_dispatch::enum_dispatch;
use strum_macros::EnumString;

use crate::dast::{
    ElementData, FlatDastElement, FlatDastElementContent, FlatDastElementUpdate,
    Position as DastPosition,
};
use crate::state::{
    StateVar, StateVarName, StateVarReadOnlyView, StateVarReadOnlyViewTyped, StateVarValue,
};
use crate::{ComponentChild, ComponentIdx, ExtendSource};

use super::_error::_Error;
use super::_external::_External;
use super::doenet::document::Document;
use super::doenet::p::P;
use super::doenet::section::Section;
use super::doenet::text::Text;
use super::doenet::text_input::TextInput;

/// camelCase
pub type AttributeName = &'static str;

/// A enum that can contain a component of any possible component type.
///
/// The component node traits are implemented on the `ComponentEnum`
/// to allow easy access to the methods.
///
/// Each component type added to `ComponentEnum` must implement that component node traits.

#[derive(Debug, EnumString)]
#[enum_dispatch(ComponentNode, ComponentNodeStateVariables, RenderedComponentNode)]
#[strum(ascii_case_insensitive)]
pub enum ComponentEnum {
    Text(Text),
    TextInput(TextInput),
    Section(Section),
    Document(Document),
    P(P),
    _Error(_Error),
    _External(_External),
}

#[derive(Debug, Default)]
pub struct ComponentCommonData {
    pub idx: ComponentIdx,
    pub parent: Option<ComponentIdx>,
    pub children: Vec<ComponentChild>,

    pub extend: Option<ExtendSource>,

    // map of descendant names to their indices
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

    pub position: Option<DastPosition>,

    pub state_variables: Vec<StateVar>,

    pub rendered_state_variable_indices: Vec<usize>,

    pub public_state_variable_indices: Vec<usize>,

    pub state_variable_name_to_index: HashMap<String, usize>,

    pub component_profile_state_variables: Vec<ComponentProfileStateVariable>,
}

/// The Component trait specifies methods that will, in general, be implemented by deriving them.
/// It depends on the ComponentNodeStateVariables trait, which will be implemented
/// individually for each component type.
#[enum_dispatch]
pub trait ComponentNode: ComponentNodeStateVariables {
    /// Get the index of the component, which is its index in the `components` vector of `DoenetMLCore`.
    fn get_idx(&self) -> ComponentIdx;
    /// Get the index of the parent node
    fn get_parent(&self) -> Option<ComponentIdx>;
    /// Get the vector containing the indices of all child component nodes and the literal string children.
    fn get_children(&self) -> &Vec<ComponentChild>;
    /// Set the vector containing the indices of all child component nodes and the literal string children.
    fn set_children(&mut self, children: Vec<ComponentChild>);
    /// Replace with new values the vector containing the indices of all child component nodes and the literal string children.
    fn replace_children(&mut self, new_children: Vec<ComponentChild>) -> Vec<ComponentChild>;

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

    /// Return the number of state variables for the component.
    fn get_num_state_variables(&self) -> usize;

    /// Return a vector of all the state variables for the component.
    ///
    /// The index of a state variable in this vector is state variable's index.
    fn get_state_variables(&self) -> &Vec<StateVar>;

    /// Return a mutable vector of all the state variables for the component.
    ///
    /// The index of a state variable in this vector is state variable's index.
    ///
    /// Since the state variable value and most meta data are behind a RefCell,
    /// a mutable view is not needed even to set the value. A mutable view is needed
    /// only to set values that are on the StateVar that aren't behind the RefCell.
    /// Currently, the methods needing mut are those involving dependencies:
    /// - `record_all_dependencies_viewed()`
    /// - `set_dependencies()`
    fn get_state_variables_mut(&mut self) -> &mut Vec<StateVar>;

    /// Return a vector of the indices of each state variable that is sent to the renderer,
    /// i.e., that has the `for_renderer` parameter set to true.
    fn get_rendered_state_variable_indices(&self) -> &Vec<usize>;

    /// Return a vector of the indices of each state variable that is public,
    /// i.e., that can be referenced with a macro.
    fn get_public_state_variable_indices(&self) -> &Vec<usize>;

    /// Attempt to match `name` to the name of a state variable and return its index if found.
    fn get_state_variable_index_from_name(&self, name: &String) -> Option<usize>;

    /// Attempt to match `name` to the name of a state variable using a case-insensitive match
    /// and return its index if found.
    fn get_state_variable_index_from_name_case_insensitive(&self, name: &String) -> Option<usize>;

    /// Return a vector of all component profile state variables of this component.
    fn get_component_profile_state_variables(&self) -> &Vec<ComponentProfileStateVariable>;
}

/// The RenderedComponentNode trait can be derived for a component, giving it the default implementations.
/// To add actions or what information is sent when rendering, a component type can implement
/// the trait to override the defaults.
#[enum_dispatch]
pub trait RenderedComponentNode: ComponentNode {
    /// Return the children that will be used in the flat dast sent to the renderer.
    fn get_rendered_children(&self) -> &Vec<ComponentChild> {
        self.get_children()
    }

    /// Return the flat dast element sent to the renderer.
    fn to_flat_dast(&mut self, components: &Vec<Rc<RefCell<ComponentEnum>>>) -> FlatDastElement {
        // TODO: components should not be able to override the entire to_flat_dast method,
        // but instead just methods like .get_rendered_children that can be called in all places
        // where one is making calculations about what will be rendered.

        // if extending a source that is a component,
        // add children from that source first
        let mut children = if let Some(ExtendSource::Component(source_idx)) = self.get_extend() {
            let source_dast = components[*source_idx]
                .borrow_mut()
                .to_flat_dast(components);

            source_dast.children
        } else {
            Vec::new()
        };

        // children from the component itself come after children the extend source
        let mut children2: Vec<FlatDastElementContent> = self
            .get_rendered_children()
            .iter()
            .filter_map(|child| match child {
                ComponentChild::Component(comp_idx) => {
                    Some(FlatDastElementContent::Element(*comp_idx))
                }
                ComponentChild::Text(s) => Some(FlatDastElementContent::Text(s.to_string())),
                ComponentChild::Macro(_the_macro) => None,
                ComponentChild::FunctionMacro(_function_macro) => None,
            })
            .collect();

        children.append(&mut children2);

        // TODO: attributes

        FlatDastElement {
            name: self.get_component_type().to_string(),
            attributes: HashMap::new(),
            children,
            data: ElementData {
                id: self.get_idx(),
                ..Default::default()
            },
            position: self.get_position().cloned(),
        }
    }

    /// Return a FlatDastElementUpdate that gives information about what elements of the rendered component
    /// have changed since the component was last rendered,
    /// i.e., since `to_flat_dast()` or `get_flat_dast_update()` have been called.`
    fn get_flat_dast_update(&mut self) -> Option<FlatDastElementUpdate> {
        None
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
    fn on_action<'a>(
        &self,
        action_name: &str,
        args: HashMap<String, Vec<StateVarValue>>,
        resolve_and_retrieve_state_var: &'a mut dyn FnMut(usize) -> StateVarValue,
    ) -> Vec<(usize, StateVarValue)> {
        panic!(
            "Unknown action '{}' called on {}",
            action_name,
            self.get_component_type()
        );
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
}

/// A `ComponentProfile` is used in the `DependencyInstruction` specifying children.
/// A component profile will match children that have a `ComponentProfileStateVariable` of the corresponding type,
/// and the resulting dependency will give the value of that state variable.
#[derive(Debug, PartialEq)]
pub enum ComponentProfile {
    Text,
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
#[derive(Debug)]
pub enum ComponentProfileStateVariable {
    Text(StateVarReadOnlyViewTyped<String>, StateVarName),
    Number(StateVarReadOnlyViewTyped<f64>, StateVarName),
    Integer(StateVarReadOnlyViewTyped<i64>, StateVarName),
    Boolean(StateVarReadOnlyViewTyped<bool>, StateVarName),
}

// TODO: derive these with macro?
impl ComponentProfileStateVariable {
    /// Return the ComponentProfile that matches this ComponentProfileStateVariable
    /// so that it can be matched with the ComponentProfiles of a child dependency instruction.
    pub fn get_matching_profile(&self) -> ComponentProfile {
        match self {
            ComponentProfileStateVariable::Text(..) => ComponentProfile::Text,
            ComponentProfileStateVariable::Number(..) => ComponentProfile::Number,
            ComponentProfileStateVariable::Integer(..) => ComponentProfile::Integer,
            ComponentProfileStateVariable::Boolean(..) => ComponentProfile::Boolean,
        }
    }

    /// Return a state variable view of the component profile state variable as well as the state variable's name.
    ///
    /// Used to create the dependency matching ComponentProfile of a child dependency instruction.
    ///
    /// In this way, the state variable depending on the children can calculate its value
    /// from the state variable value of the ComponentProfileStateVariable.
    pub fn return_untyped_state_variable_view_and_name(
        &self,
    ) -> (StateVarReadOnlyView, StateVarName) {
        match self {
            ComponentProfileStateVariable::Text(sv, name) => (
                StateVarReadOnlyView::String(sv.create_new_read_only_view()),
                name,
            ),
            ComponentProfileStateVariable::Number(sv, name) => (
                StateVarReadOnlyView::Number(sv.create_new_read_only_view()),
                name,
            ),
            ComponentProfileStateVariable::Integer(sv, name) => (
                StateVarReadOnlyView::Integer(sv.create_new_read_only_view()),
                name,
            ),
            ComponentProfileStateVariable::Boolean(sv, name) => (
                StateVarReadOnlyView::Boolean(sv.create_new_read_only_view()),
                name,
            ),
        }
    }
}
