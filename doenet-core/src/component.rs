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
pub mod collect;
pub mod section;
pub mod line;

use crate::math_expression::MathExpression;
use enum_as_inner::EnumAsInner;
use serde::Serialize;

use crate::state_variables::*;

use std::collections::HashMap;
use std::fmt::{Debug, self};



/// camelCase
pub type ComponentType = &'static str;

/// camelCase
pub type AttributeName = &'static str;

/// A ComponentName is not static because it cannot be known at compile time.
pub type ComponentName = String;

/// camelCase
pub type CollectionName = &'static str;

lazy_static! {
    pub static ref COMPONENT_DEFINITIONS: HashMap<ComponentType, &'static ComponentDefinition> = {

        let defs: Vec<&'static ComponentDefinition> = vec![
            &crate::text         ::MY_COMPONENT_DEFINITION,
            &crate::number       ::MY_COMPONENT_DEFINITION,
            &crate::text_input   ::MY_COMPONENT_DEFINITION,
            &crate::document     ::MY_COMPONENT_DEFINITION,
            &crate::boolean      ::MY_COMPONENT_DEFINITION,
            &crate::p            ::MY_COMPONENT_DEFINITION,
            &crate::number_input ::MY_COMPONENT_DEFINITION,
            &crate::boolean_input::MY_COMPONENT_DEFINITION,
            &crate::sequence     ::MY_COMPONENT_DEFINITION,
            &crate::graph        ::MY_COMPONENT_DEFINITION,
            &crate::point        ::MY_COMPONENT_DEFINITION,
            &crate::collect      ::MY_COMPONENT_DEFINITION,
            &crate::section      ::MY_COMPONENT_DEFINITION,
            &crate::line         ::MY_COMPONENT_DEFINITION,
        ];

        defs.into_iter().map(|def| (def.component_type, def)).collect()
    };
}

pub trait KeyValueIgnoreCase<K, V> {
    fn get_key_value_ignore_case<'a>(&'a self, key: &str) -> Option<(&'a K, &'a V)>;
}

impl<K, V> KeyValueIgnoreCase<K,V> for HashMap<K, V>
where
    K: ToString + std::cmp::Eq + std::hash::Hash,
{
    fn get_key_value_ignore_case<'a>(&'a self, key: &str) -> Option<(&'a K, &'a V)> {
        let lowercase_to_normalized: HashMap<String, &K> = self
            .keys()
            .into_iter()
            .map(|k| (k.to_string().to_lowercase(), k))
            .collect();

        lowercase_to_normalized
            .get(&key.to_string().to_lowercase())
            .and_then(|k| self.get_key_value(k))
    }
}



#[derive(Debug, Clone)]
pub struct ComponentNode {

    pub name: ComponentName,
    pub parent: Option<ComponentName>,
    pub children: Vec<ComponentChild>,

    pub copy_source: Option<CopySource>,
    pub static_attributes: HashMap<AttributeName, String>,

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
    Component(ComponentRef),
    StateVar(ComponentRef, StateRef),
    DynamicElement(ComponentName, StateVarName, MathExpression, Vec<ComponentName>),
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

    pub valid_children_profiles: ValidChildTypes,

    pub attribute_names: Vec<AttributeName>,

    pub static_attribute_names: Vec<AttributeName>,

    pub array_aliases: HashMap<&'static str, StateRef>,

    /// Process an action and return the state variables to change.
    /// The update requests will be processed in the order returned.
    pub on_action: for<'a> fn(
        action_name: &str,
        args: HashMap<String, Vec<StateVarValue>>,
        resolve_and_retrieve_state_var: &'a dyn Fn(&'a StateRef) -> Option<StateVarValue>
    ) -> Vec<(StateRef, StateVarValue)>,

    pub should_render_children: bool,

    /// These have to match `on_action` and with what the renderers have
    pub action_names: fn() -> Vec<&'static str>,


    /// The primary input is a state variable, except it gets overridden if 
    /// the component is being copied from another state var
    pub primary_input_state_var: Option<StateVarName>,

    pub renderer_type: RendererType,

    /// If specified, the component's parent will treat this as multiple components.
    pub replacement_children: Option<GroupOrCollection>,

    /// These collections that are not used as replacement children.
    pub collections: HashMap<CollectionName, CollectionDefinition>,

    pub component_type: ComponentType,

}

pub enum GroupOrCollection {
    Group(GroupDefinition),
    Collection(CollectionDefinition),
}


// Like CopySource exepct multiple components
pub struct GroupDefinition {
    pub group_dependencies: fn(
        node: &ComponentNode,
        component_nodes: &HashMap<ComponentName, ComponentNode>,
    ) -> Vec<ComponentName>,

    pub member_definition: fn(
        static_attributes: &HashMap<AttributeName, String>,
    ) -> &'static ComponentDefinition,
}

// Packaging a components state variables to appear like many components.
// - ex: <line/> has a collection named "points"
// - ex: <sequence/> has a collection used as its replacement children
pub struct CollectionDefinition {

    pub member_definition: &'static ComponentDefinition,

    pub group_size: StateRef,

    pub member_state_var:
        for<'a> fn(
            index: usize,
            state_var_slice: &'a StateVarSlice,
            state_var_resolver: &'a dyn Fn(&'a StateRef) -> Option<StateVarValue>,
        ) -> Option<StateVarSlice>,
}


/// A component or a member of a group.
/// Note that a group can still be referenced as a basic component
/// in addition to referencing its group members.
#[derive(PartialEq, Serialize, Eq, Clone, Debug, Hash, enum_as_inner::EnumAsInner)]
pub enum ComponentRef {
    Basic(ComponentName),

    /// No collection name means use replacement children.
    GroupMember(ComponentName, Option<CollectionName>, usize),
}

impl std::fmt::Display for ComponentRef {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}


#[derive(PartialEq, Serialize, Eq, Clone, Debug)]
pub enum ComponentGroup {
    Single(ComponentRef),
    Group(ComponentName),
}

impl ComponentRef {
    pub fn name(&self) -> ComponentName {
        match self {
            Self::Basic(name) => name.clone(),
            Self::GroupMember(name, _, _) => name.clone(),
        }
    }
}
impl ComponentGroup {
    /// Group name
    pub fn name(&self) -> ComponentName {
        match self {
            Self::Single(comp_ref) => comp_ref.name(),
            Self::Group(name) => name.clone(),
        }
    }
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
            static_attribute_names: Vec::new(),
            array_aliases: HashMap::new(),
            should_render_children: false,
            renderer_type: RendererType::Myself,
            primary_input_state_var: None,
            component_profiles: vec![],
            valid_children_profiles: ValidChildTypes::ValidProfiles(vec![]),
            action_names: || Vec::new(),
            on_action: |_, _, _| vec![],
            replacement_children: None,
            collections: HashMap::new(),
            component_type: "default_invalid",
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
#[derive(Debug, PartialEq, Eq, Hash, Clone, serde::Serialize, EnumAsInner)]
pub enum ObjectName {
    Component(ComponentName),
    String(String),
}

pub enum ValidChildTypes {
    AllComponents,
    /// All children need to match one of the given profiles
    ValidProfiles(Vec<ComponentProfile>)
}

#[derive(Debug)]
pub enum RendererType {
    Myself,
    Special {
        component_type: &'static str,
        state_var_aliases: HashMap<StateVarName, StateVarName>,
    },
    // DoNotRender,
}

