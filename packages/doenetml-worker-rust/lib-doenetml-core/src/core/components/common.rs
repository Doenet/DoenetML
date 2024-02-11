use std::collections::HashMap;

use enum_dispatch::enum_dispatch;
use strum_macros::EnumString;

use crate::attribute::{AttributeName, AttributeType};
use serde::{Deserialize, Serialize};

use crate::dast::{DastAttribute, Position as DastPosition};
use crate::state::{ComponentState, StateVarIdx, StateVarValue};
use crate::{ComponentIdx, ComponentPointerTextOrMacro, ExtendSource};

use doenetml_derive::RenderedState;

use super::_error::*;
use super::_external::*;
use super::actions::UpdateFromAction;
use super::doenet::boolean::*;
use super::doenet::document::*;
use super::doenet::p::*;
use super::doenet::section::*;
use super::doenet::text::*;
use super::doenet::text_input::*;

/// A enum that can contain a component of any possible component type.
///
/// The component node traits are implemented on the `ComponentEnum`
/// to allow easy access to the methods.
///
/// Each component type added to `ComponentEnum` must implement that component node traits.
#[derive(Debug, EnumString, RenderedState)]
#[enum_dispatch(
    ComponentNode,
    ComponentState,
    RenderedChildren,
    ComponentAttributes,
    ComponentActions
)]
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

/// A set of fields that are common to all DoenetML components.
/// To derive the `ComponentNode` trait, a component should have
/// `ComponentCommonData` in a field named `common`.
#[derive(Debug, Default)]
pub struct ComponentCommonData {
    /// The index of this component, which is its index
    /// in the `components` vector on core.
    pub idx: ComponentIdx,

    /// The index of this component's parent
    pub parent: Option<ComponentIdx>,

    /// The vector of this component's children,
    /// where components are specified by their index and strings contain their literal values.
    ///
    /// Macros remain in this vector only if they couldn't be expanded.
    /// TODO: implement function macros so they don't stay in this vector
    pub children: Vec<ComponentPointerTextOrMacro>,

    /// If this component is extending another component or state variable,
    /// then the `extending` field gives the source that it is extending.
    pub extending: Option<ExtendSource>,

    /// A map of descendant names to their indices.
    ///
    /// In particular, if a name appears exactly once (i.e., the vector is length 1),
    /// then a macro referencing that name can be expanded into a component the extends
    /// that descendant
    pub descendant_names: HashMap<String, Vec<ComponentIdx>>,

    /// The position of the component in the original DoenetML string
    pub position: Option<DastPosition>,

    pub attribute_types: HashMap<AttributeName, AttributeType>,

    /// The vector of all the attribute children that have been created for this attribute.
    pub attribute_children: HashMap<AttributeName, Vec<ComponentPointerTextOrMacro>>,

    /// Any remaining attributes that appeared in the DoenetML
    /// but where not defined in the component
    pub unevaluated_attributes: HashMap<String, DastAttribute>,

    /// Whether or not this component is to be rendered, i.e.,
    /// whether or not it is in the tree of rendered components.
    ///
    /// Used to determine if its rendered state variables need to be freshened and set to the renderer.
    pub is_in_render_tree: bool,
}

/// The Component trait specifies methods that will, in general, be implemented by deriving them.
/// It depends on the ComponentState trait, which will be derived
/// for each component type based on its state variable structure.
#[enum_dispatch]
pub trait ComponentNode: ComponentState {
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

    /// Set component's index, parent, extending, and position in the original DoenetML string.
    ///
    /// This is a separate step from creation because we create it using EnumString's from_str,
    /// which assigns values based on the Default trait
    fn initialize(
        &mut self,
        idx: ComponentIdx,
        parent: Option<ComponentIdx>,
        extending: Option<ExtendSource>,
        attributes: HashMap<String, DastAttribute>,
        position: Option<DastPosition>,
    );

    /// Get the extend source of this component,
    /// indicating any component or state variable that this component extends.
    fn get_extending(&self) -> Option<&ExtendSource>;

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

    /// Set the hash map containing for each attribute the vector of
    /// indices of all child component nodes and the literal string children.
    fn set_attribute_children(
        &mut self,
        attribute_children: HashMap<AttributeName, Vec<ComponentPointerTextOrMacro>>,
    );

    /// Get the vector of all the attribute children that have been created for this attribute.
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

    /// Get whether or not this component is to be rendered, i.e.,
    /// whether or not it is in the tree of rendered components.
    ///
    /// Used to determine if its rendered state variables need to be freshened and set to the renderer.
    fn get_is_in_render_tree(&self) -> bool;

    /// Set whether or not this component is to be rendered, i.e.,
    /// whether or not it is in the tree of rendered components.
    ///
    /// Used to determine if its rendered state variables need to be freshened and set to the renderer.
    fn set_is_in_render_tree(&mut self, is_in_render_tree: bool);

    /// The name of the component that a direct reference should transmute to.
    /// For example in `<textInput name="i"/>$i`, the `$i` should be rendered as a `<text extend="$i"/>`
    /// rather than a `<textInput extend="$i"/>`. In this case `self.ref_transmutes_to()` should return `Some("Text")`.
    ///
    /// If `None` is returned, no transmutation will occur.
    fn ref_transmutes_to(&self) -> Option<&'static str> {
        None
    }

    fn extends_component_profiles(&self) -> Vec<(ComponentProfile, StateVarIdx)> {
        vec![]
    }
}

/// Specifies the children that will be sent to the renderer.
///
/// Two behaviors can be automatically derived by the `RenderedChildren` macro
/// based on helper attributes applied to the struct.
/// - `#[pass_through_children]`: all children are passed through as the rendered children (default if no attributes)
/// - `#[no_rendered_children]`: no children are passed to the renderer
#[enum_dispatch]
pub trait RenderedChildren {
    /// Return the children that will be used in the flat dast sent to the renderer.
    fn get_rendered_children(&self) -> &Vec<ComponentPointerTextOrMacro>;
}

/// The ComponentAttributes trait can be derived for a component,
/// giving it the default implementation of ignoring all attributes.
/// To add attributes to be processed by core, a component type can implement the trait.
#[enum_dispatch]
pub trait ComponentAttributes: ComponentNode {
    /// Return a list of the attribute names that the component will accept
    fn get_attribute_names(&self) -> Vec<AttributeName> {
        // TODO: add default attribute names, like hide and disabled?
        // If so, should provide a mechanism for including default state variables depending on them.
        vec![]
    }
}

/// The ComponentActions trait can be derived for a component,
/// giving it the default implementation of no actions.
/// To add actions, a component type can implement the trait to override the defaults.
#[enum_dispatch]
pub trait ComponentActions: ComponentNode {
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
        resolve_and_retrieve_state_var: &mut dyn FnMut(StateVarIdx) -> StateVarValue,
    ) -> Result<Vec<UpdateFromAction>, String> {
        Err(format!(
            "Unknown action '{:?}' called on {}",
            action,
            self.get_component_type()
        ))
    }
}

/// A `ComponentProfile` is used in a `DataQuery` specifying children or attribute children.
/// A component profile will match children that have a state variable of the corresponding type
/// that has been designated with `#[component_profile_state_variable]`.
/// When a state variable from a child is matched, the value of that state variable is returned.
#[derive(Debug, Clone, PartialEq)]
pub enum ComponentProfile {
    /// Matches String state variables as well as literal string children
    String,
    /// Matches literal string children. Use if wish to exclude String state variables.
    /// Use the `String` variant to also match string state variables.
    LiteralString,
    /// Matches Number state variables
    Number,
    /// Matches Integer state variables
    Integer,
    /// Matches Boolean state variables
    Boolean,
}

// TODO: implement with macro?
impl ComponentProfile {
    /// Return the default value that is associated with the type of state variable
    /// represented by the component profile.
    pub fn default(&self) -> StateVarValue {
        match self {
            ComponentProfile::Boolean => StateVarValue::Boolean(bool::default()),
            ComponentProfile::Integer => StateVarValue::Integer(i64::default()),
            ComponentProfile::Number => StateVarValue::Number(f64::default()),
            ComponentProfile::LiteralString | ComponentProfile::String => {
                StateVarValue::String(String::default())
            }
        }
    }
}
