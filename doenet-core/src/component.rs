use crate::{CollectionMembers, ComponentRefRelative, ComponentRefStateRelative, ComponentNode, ComponentName, ComponentRefStateArrayRelative, ComponentInstanceRelative};
use crate::math_expression::MathExpression;
use enum_as_inner::EnumAsInner;
use serde::Serialize;
use crate::state_variables::*;
use std::collections::HashMap;
use std::fmt::{Debug, self};


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
pub mod map;
pub mod template;
pub mod sources;
pub mod conditional_content;
pub mod case;

lazy_static! {
    pub static ref COMPONENT_DEFINITIONS: HashMap<ComponentType, &'static ComponentDefinition> = {

        let defs: Vec<&'static ComponentDefinition> = vec![
            &crate::text               ::MY_COMPONENT_DEFINITION,
            &crate::number             ::MY_COMPONENT_DEFINITION,
            &crate::text_input         ::MY_COMPONENT_DEFINITION,
            &crate::document           ::MY_COMPONENT_DEFINITION,
            &crate::boolean            ::MY_COMPONENT_DEFINITION,
            &crate::p                  ::MY_COMPONENT_DEFINITION,
            &crate::number_input       ::MY_COMPONENT_DEFINITION,
            &crate::boolean_input      ::MY_COMPONENT_DEFINITION,
            &crate::sequence           ::MY_COMPONENT_DEFINITION,
            &crate::graph              ::MY_COMPONENT_DEFINITION,
            &crate::point              ::MY_COMPONENT_DEFINITION,
            &crate::collect            ::MY_COMPONENT_DEFINITION,
            &crate::section            ::MY_COMPONENT_DEFINITION,
            &crate::line               ::MY_COMPONENT_DEFINITION,
            &crate::map                ::MY_COMPONENT_DEFINITION,
            &crate::template           ::MY_COMPONENT_DEFINITION,
            &crate::sources            ::MY_COMPONENT_DEFINITION,
            &crate::conditional_content::MY_COMPONENT_DEFINITION,
            &crate::case               ::MY_COMPONENT_DEFINITION,
        ];

        defs.into_iter().map(|def| (def.component_type, def)).collect()
    };
}


/// camelCase
pub type ComponentType = &'static str;

/// camelCase
pub type AttributeName = &'static str;

/// camelCase
pub type BatchName = &'static str;




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
    Component(ComponentRefRelative),
    StateVar(ComponentRefStateRelative),
    MapSources(ComponentName),
    DynamicElement(ComponentRefStateArrayRelative, MathExpression, Vec<ComponentName>),
}


#[derive(Clone, PartialEq, Eq, Debug, Hash, Serialize)]
pub enum ComponentProfile {
    Text,
    Number,
    Boolean,
    Math,
    // Graphical,
}

/// The definition of a component type.
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
    pub replacement_components: Option<ReplacementComponents>,

    /// These collections that are not used as replacement children.
    pub batches: HashMap<BatchName, BatchDefinition>,

    pub component_type: ComponentType,

}

/// A collection is a way to group several existing components of the same type under one component
/// It is like a CopySource with multiple sources.
pub struct CollectionDefinition {
    pub group_dependencies: fn(
        node: &ComponentNode,
        component_nodes: &HashMap<ComponentName, ComponentNode>,
    ) -> Vec<CollectionMembersOrCollection>,

    pub member_definition: fn(
        static_attributes: &HashMap<AttributeName, String>,
    ) -> &'static ComponentDefinition,
}

pub enum CollectionMembersOrCollection {
    Members(CollectionMembers),
    Collection(ComponentInstanceRelative),
}

/// A batch is a way to make one component appear like several non-existent components
/// For example, a <sequence> has a batch of <number> components which it sends to the renderer instead of itself.
/// These non-existent components do not exist as ComponentNodes, and they don't have any ComponentState either.
/// They derive all their state from the one actual component's state.
// - ex: <line/> has a batch named "points"
pub struct BatchDefinition {

    /// Component definition of the batch members. All batch members share the same component type.
    pub member_definition: &'static ComponentDefinition,

    /// A reference to a state var which stores the number of members in this batch.
    /// The numbers of members can change, so it needs to be stored as a state var.
    pub size: StateRef,

    /// Route a supposed state var of a member component to the actual component's state var
    pub member_state_var:
        for<'a> fn(
            index: usize,
            state_var_slice: &'a StateVarSlice,
            // state_var_resolver: &'a dyn Fn(&'a StateRef) -> Option<StateVarValue>,
        ) -> Option<StateVarSlice>,
}


pub enum ReplacementComponents {
    Collection(CollectionDefinition),
    Batch(BatchDefinition),
    // Unlike the previous, Children cannot form a component group
    // because they may be of different types.
    Children,
}


impl ComponentDefinition {
    pub fn unwrap_batch_def(&self, name: &Option<BatchName>) -> &BatchDefinition{
        match name {
            Some(n) => self.batches.get(n).unwrap(),
            None => match &self.replacement_components {
                Some(ReplacementComponents::Batch(def)) => def,
                _ => panic!(),
            }
        }
        
    }
    pub fn unwrap_collection_def(&self) -> &CollectionDefinition {
        match &self.replacement_components {
            Some(ReplacementComponents::Collection(def)) => def,
            _ => panic!(),
        }
    }


    /// Returns component definition of members, or itself if there are no replacement components
    /// Pass the static_attributes as a parameter
    pub fn definition_as_replacement_children(
        &self,
        static_attributes: &HashMap<AttributeName, String>,
    ) -> Option<&ComponentDefinition> {

        match &self.replacement_components {
            Some(ReplacementComponents::Batch(def))  => Some(def.member_definition),
            Some(ReplacementComponents::Collection(def))  => Some((def.member_definition)(static_attributes)),
            Some(ReplacementComponents::Children)  => None,
            None  => Some(self),
        }        
    }

    pub fn component_profile_match(
        &self,
        desired_profiles: &Vec<ComponentProfile>,
    ) -> Option<StateVarSlice> {
        for profile in self.component_profiles.iter() {
            if desired_profiles.contains(&profile.0) {

                let profile_state_var = profile.1;

                let sv_def = self
                    .state_var_definitions
                    .get(&profile_state_var)
                    .unwrap();

                let profile_sv_slice = if sv_def.is_array() {
                    StateVarSlice::Array(profile_state_var)
                } else {
                    StateVarSlice::Single(StateRef::Basic(profile_state_var))
                };

                return Some(profile_sv_slice);
            }
        }
        None
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
            replacement_components: None,
            batches: HashMap::new(),
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
