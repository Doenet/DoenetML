pub mod prelude;

pub mod state_variables;
pub mod component;

pub mod state_var;
pub mod parse_json;
pub mod utils;

use lazy_static::lazy_static;
use state_var::StateForStateVar;
use std::collections::HashMap;
use std::fmt::Debug;
use std::{error::Error, fmt::Display};


use crate::prelude::*;
use crate::component::*;

use state_var::{State, EssentialStateVar};
use state_variables::*;


/// A static DoenetCore is created from parsed DoenetML at the beginning.
/// While `component_states` and `essential_data` can update using
/// internal mutability (the RefCell), the over-arching HashMaps do not.
#[derive(Debug)]
pub struct DoenetCore {
    pub component_nodes: HashMap<ComponentName, ComponentNode>,
    pub component_states: HashMap<ComponentName, HashMap<StateVarName, StateForStateVar>>,
    pub root_component_name: ComponentName,

    /// The Dependency Graph
    /// A DAC whose vertices are every component's state variables.
    ///
    /// Indexed by:
    /// 1. the name of the component
    /// 2. the name of a state variable group
    ///    which allows for two kinds of dependencies:
    ///      - direct dependency: when a single state var depends on something
    ///      - indirect dependency: when a group depends on something,
    ///        and members of the group inherit the dependency.
    ///        The motivation for indirect dependencies is that
    ///        the size of groups can change (e.g. an array changes size).
    ///        To keep the dependency graph static, we do not update
    ///        individual dependencies but simply apply the group dependency.
    /// 3. the instruction name, given by the state variable to track where
    ///    dependecy values came from.
    pub dependencies:
        HashMap<ComponentName,
            HashMap<StateVarGroup,
                HashMap<InstructionName,
                    Vec<Dependency>>>>,

    /// States that the user can change (e.g. the contents of an input dialogue).
    /// Each datum is associated with the state variable of a particular component.
    pub essential_data: HashMap<ComponentName, HashMap<StateVarName, EssentialStateVar>>,

    /// We send components to the renderer that do not exists
    /// - the inherited children of a copy
    ///
    /// The renderer needs to recognize these as a different component so we alias its name.
    /// This maps the name the renderer is given to the actual name.
    pub aliases: HashMap<String, ComponentName>,
}



/// A collection of edges on the dependency tree
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize)]
pub enum Dependency {
    StateVar {
        component_name: ComponentName,
        state_var_ref: StateVarReference,
    },
    Essential {
        component_name: ComponentName,
        state_var_name: StateVarName,
    },

    String {
        value: String,
    },

    /// This represents multiple edges on the dependency graph,
    /// since it references multiple state variables.
    StateVarArray {
        component_name: String,
        array_state_var_name: StateVarName,
    },
}



const SHADOW_INSTRUCTION_NAME: &'static str = "shadow_instruction";




/// An error that is caused by the user inputting invalid DoenetML.
/// It is thrown only on core creation.
#[derive(Debug)]
pub enum DoenetMLError {
    ComponentDoesNotExist {
        comp_name: String
    },
    StateVarDoesNotExist {
        comp_name: String,
        sv_name: String,
    },
    AttributeDoesNotExist {
        comp_name: String,
        attr_name: String,
    },
    InvalidComponentType {
        comp_type: String,
    },

    ComponentCopiesAncestor {
        comp_name: String,
        ancestor_name: String,
    }
}

impl Error for DoenetMLError {}
impl Display for DoenetMLError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use DoenetMLError::*;

        match self {
            ComponentDoesNotExist { comp_name } => 
                write!(f, "Component {} does not exist", comp_name),
            StateVarDoesNotExist { comp_name, sv_name } =>
                write!(f, "State variable {} does not exist on {}", sv_name, comp_name),
            AttributeDoesNotExist { comp_name, attr_name } =>
                write!(f, "Attribute {} does not exist on {}", attr_name, comp_name),
            InvalidComponentType { comp_type } => 
                write!(f, "Component type {} does not exist", comp_type),
            ComponentCopiesAncestor { comp_name, ancestor_name } => 
                write!(f, "Component {} copies ancestor {}", comp_name, ancestor_name),
        }
    }
}



pub fn create_doenet_core(program: &str) -> (DoenetCore, Vec<DoenetMLError>) {

    // Create component nodes.
    let (mut component_nodes, root_component_name, mut doenet_ml_errors) = 
        parse_json::create_components_tree_from_json(program);

    
    // Parse macros and generate components from them
    replace_macros_with_copies(&mut component_nodes);


    let mut aliases: HashMap<String, ComponentName> = HashMap::new();

    doenet_ml_errors.extend(
        copy_sources_add_aliases_or_invalidate(&mut component_nodes, &mut aliases)
    );

    // Fill in component_states and dependencies HashMaps for every component
    // and supply essential_data required by any Essential Dependency.

    let mut component_states = HashMap::new();
    let mut dependencies = HashMap::new();
    let mut essential_data = HashMap::new();

    for (component_name, component_node) in component_nodes.iter() {

        let dependencies_for_this_component = create_all_dependencies_for_component(
            &component_nodes,
            component_node,
            &mut essential_data
        );

        let state_for_this_component: HashMap<StateVarName, StateForStateVar> =
            component_node.definition.state_var_definitions()
            .iter()
            .map(|(&sv_name, sv_variant)| (sv_name, StateForStateVar::new(&sv_variant)))
            .collect();


        dependencies.insert(
            component_name.clone(),
            dependencies_for_this_component
        );

        component_states.insert(
            component_name.clone(),
            state_for_this_component,
        );
    }


    log_json!("Components upon core creation",
        utils::json_components(&component_nodes, &component_states));

    log_json!("Dependencies upon core creation",
        utils::json_dependencies(&dependencies));

    log_debug!("Essential data upon core creation {:?}",
        essential_data);


    (DoenetCore {
        component_nodes,
        component_states,
        root_component_name,
        dependencies,
        essential_data,
        aliases,
    }, doenet_ml_errors)
}


/// For every copy either invalidate it and make it not a copy
/// or add the necessary aliases for the renderers to use
fn copy_sources_add_aliases_or_invalidate(
    component_nodes: &mut HashMap<ComponentName, ComponentNode>,
    aliases: &mut HashMap<String, ComponentName>,
) -> Vec<DoenetMLError> {
    let copies = component_nodes.iter().filter_map(|(_, c)| match c.copy_source {
        Some(CopySource::Component(ref source)) => Some((c, source)),
        _ => None,
    });

    let mut doenet_ml_errors = Vec::new();
    let mut invalid_copies: Vec<String> = vec![];

    for (copy, source_name) in copies {

        // Find all ancestors (parents)
        let mut ancestors: Vec<String> = vec![];
        let mut possible_parent = &copy.parent;
        while let Some(parent) = possible_parent {
            ancestors.push(parent.clone());
            possible_parent = &component_nodes.get(parent).unwrap().parent;
        }

        if !component_nodes.contains_key(source_name) {

            // The component tried to copy a non-existent component.
            // Log an error and pretend it didn't copy anything.
            doenet_ml_errors.push(DoenetMLError::ComponentDoesNotExist {
                comp_name: source_name.to_string()
            });
            invalid_copies.push(copy.name.to_string());

        } else if ancestors.contains(source_name) {

            // The component tried to copy its ancestor.
            // Log an error and pretend it doesn't copy anything
            doenet_ml_errors.push(DoenetMLError::ComponentCopiesAncestor {
                comp_name: copy.name.clone(),
                ancestor_name: source_name.clone(),
            });
            invalid_copies.push(copy.name.to_string());

        } else {
            add_alias_for_children(aliases, copy, &component_nodes, &copy.name);
        }
    }

    // Remove invalid copy references
    for invalid_copy in invalid_copies {
        let culprit_component = component_nodes.get_mut(&invalid_copy).unwrap();
        culprit_component.copy_source = None;
    }

    doenet_ml_errors
}

fn name_child_of_copy(child: &str, copy: &str) -> ComponentName {
    format!("__cp:{}({})", child, copy)
}

fn add_alias_for_children(
    aliases: &mut HashMap<String, ComponentName>,
    component: &ComponentNode,
    component_nodes: &HashMap<ComponentName, ComponentNode>,
    copy: &String,
) {
    for (child, _) in get_children_including_copy(component_nodes, component).iter() {
        if let ComponentChild::Component(child_comp) = child {
            aliases.insert(name_child_of_copy(child_comp, copy), child_comp.to_string());
        }
    }
}


fn replace_macros_with_copies(components: &mut HashMap<ComponentName, ComponentNode>) {

    use regex::Regex;
    use std::iter::repeat;


    // One or two $ followed by either
    //   - the following combination without parenthesis:
    //     - a word (starting with a letter or underscore), capturing word as fourth group, 
    //     - optionally followed by anything in square brackets (6th group)
    //     - optionally followed by:
    //       - a period
    //       - followed by a word (9th group)
    //       - optionally followed by anything in square brackets (11th group)
    //   or
    //   - the following combination in parenthesis
    //     where the closing parenthesis could be replaced by an open brace,
    //     (capturing the open brace or closing parens as 21st group):
    //     - an identifier (containing word characters, slash, hyphen, or "../") (12th group)
    //     - optionally followed by anything in square brackets (15th group)
    //     - optionally followed by:
    //       - a period
    //       - followed by a word (including hyphens) (18th group)
    //       - optionally followed by anything in square brackets (20th group)

    lazy_static! {

        // NOTE: It took around ~100ms on a fast computer to create this regex (not including searching with it)
        static ref MACRO_SEARCH: Regex = Regex::new(r"(?x) #flag that ignores whitespace and comments
  
        (\$) # for now, just one $
        (
            (([a-zA-Z_]\w*)(\[([^\[^\]]+)\])?((\.([a-zA-Z]\w*))(\[([^\[^\]]+)\])?)?)
            |
            \(
                (([\w/-]|\.\./)+)(\[([^\[^\]]+)\])?((\.([\w\-]+))(\[([^\[^\]]+)\])?)?\s*
            ( \) | \{ )
        )
    
        ").unwrap();
    
    }

    lazy_static! {
        static ref POSSIBLE_MACRO: Regex = Regex::new("$").unwrap();
    }



    // Keyed by the component name and by the original position of the child we are replacing
    let mut replacement_children: HashMap<ComponentName, HashMap<usize, Vec<ObjectName>>> = HashMap::new();

    let mut components_to_add: Vec<ComponentNode> = vec![];

    // Keyed on the source component names, or the source (component name, state var)
    let mut macro_copy_counter: HashMap<ComponentName, u32> = HashMap::new();
    

    // This iterator gives info for every string child
    // (original index of child, string value, component)
    let all_string_children = components.iter()
        .flat_map(|(_, comp)|
            comp.children.iter()
                .enumerate()
                .filter_map(|(id, child)| {
                    match child {
                        ObjectName::String(string_val) => Some((id, string_val)),
                        _ => None,
                    }
                })
                .zip(repeat(comp))
                .map(|((id, val), comp)| (id, val, comp))
            );


    for (child_id, string_val, component) in all_string_children {
        let mut new_children = vec![];
        let mut previous_end = 0;

        if ! POSSIBLE_MACRO.is_match(string_val) {
            continue;
        }


        for capture in MACRO_SEARCH.captures_iter(string_val) {

            log_debug!("capture {:#?}", capture);

            let start = capture.get(0).unwrap().start();
            let end = capture.get(0).unwrap().end();

            if start == 0 || string_val.chars().nth(start-1).unwrap_or_default() != '$' {

                // Append the regular string from last endpoint up until start of macro
                let before = &string_val[previous_end..start];
                if !before.trim().is_empty() {
                    new_children.push(ComponentChild::String(before.to_string()));
                }


                let (macro_comp, macro_prop_option) =
                    match capture.get(12) {
                        Some(comp) => (comp, capture.get(18)),
                        None => (capture.get(4).unwrap(), capture.get(9)),
                    };

                if let Some(ending_delim) = capture.get(21) {
                    if ending_delim.as_str() == "{" {
                        panic!("Haven't implemented macros with curly braces");
                    }
                }

                let source_name = macro_comp.as_str();


                let source_comp = components.get(source_name).expect(
                    &format!("Macro for {}, but this component does not exist", source_name)
                );


                let macro_copy: ComponentNode = if let Some(macro_prop) = macro_prop_option {

                    let (prop_name, _) = source_comp.definition.state_var_definitions()
                        .get_key_value(macro_prop.as_str())
                        .expect(&format!("Macro asks for {} property, which does not exist", macro_prop.as_str()));

                    let source_comp_sv_name = format!("{}:{}", source_name, prop_name);

                    let copy_comp_type = default_component_type_for_state_var(source_comp, prop_name)
                        .expect(&format!("could not create component for state var copy macro"));
                    let copy_def = component::generate_component_definitions().get(copy_comp_type).unwrap().clone();

                    let copy_num = macro_copy_counter.entry(source_comp_sv_name.clone()).or_insert(0);
                    *copy_num += 1;

                    let copy_name = format!("__mcr:{}({})_{}", source_comp_sv_name, component.name, copy_num);

                    ComponentNode {
                        name: copy_name,
                        parent: Some(component.name.clone()),
                        children: vec![],
    
                        copy_source: Some(CopySource::StateVar(
                            // TODO: non-basic copies
                            source_comp.name.clone(), StateVarReference::Basic(prop_name))),

                        attributes: HashMap::new(),
                        component_type: copy_comp_type,
                        definition: copy_def,
                    }


                } else {

                    let copy_num = macro_copy_counter.entry(source_name.to_string()).or_insert(0);
                    *copy_num += 1;
    
                    let copy_name = format!("__mcr:{}({})_{}", source_name, component.name, copy_num);
    
                    ComponentNode {
                        name: copy_name,
                        parent: Some(component.name.clone()),
                        children: vec![],
    
                        copy_source: Some(CopySource::Component(source_comp.name.clone())),
                        attributes: HashMap::new(),
    
                        .. source_comp.clone()
                    }
                };

                new_children.push(ComponentChild::Component(macro_copy.name.clone()));
                components_to_add.push(macro_copy);

                previous_end = end;

            }

        }

        if previous_end > 0 {

            // There was at least one macro

            let last = &string_val[previous_end..];
            if !last.trim().is_empty() {
                new_children.push(ComponentChild::String(last.to_string()));
            }

            replacement_children.entry(component.name.clone()).or_insert(HashMap::new())
                .entry(child_id).or_insert(new_children);
        }
    }


    log_debug!("Components to add from macros: {:#?}", components_to_add);

    for new_component in components_to_add {

        debug_assert!( !components.contains_key(&new_component.name) );
        components.insert(new_component.name.clone(), new_component);
    }


    log_debug!("Replacement children {:#?}", replacement_children);

    for (component_name, new_children_hashmap) in replacement_children {
        
        let component = components.get_mut(&component_name).unwrap();

        for (original_child_id, new_children) in new_children_hashmap {

            // Remove the original element, and add the new children (in order) in its place
            component.children.splice(
                original_child_id..original_child_id + 1,
                new_children
            );
        }
    }

}


fn default_component_type_for_state_var(component: &ComponentNode, state_var: StateVarName)
    -> Result<ComponentType, String> {

    let state_var_def = component.definition.state_var_definitions().get(state_var).unwrap();
    match state_var_def {
        StateVarVariant::Boolean(_) => Ok("boolean"),
        StateVarVariant::Integer(_) => Ok("number"),
        StateVarVariant::Number(_) => Ok("number"),
        StateVarVariant::String(_) => Ok("text"),
        StateVarVariant::NumberArray(_) => Err(
            format!("no component for NumberArray state variable")
        ),
    }
}




fn create_all_dependencies_for_component(
    components: &HashMap<ComponentName, ComponentNode>,
    component: &ComponentNode,
    essential_data: &mut HashMap<ComponentName, HashMap<StateVarName, EssentialStateVar>>,
) -> HashMap<StateVarGroup, HashMap<InstructionName, Vec<Dependency>>> {

    log_debug!("Creating dependencies for {}", component.name);
    let mut dependencies: HashMap<StateVarGroup, HashMap<InstructionName, Vec<Dependency>>> = HashMap::new();


    let my_definitions = component.definition.state_var_definitions();
    for (&state_var_name, state_var_variant) in my_definitions.iter() {

        if state_var_variant.is_array() {

            let size_dep_instructions = state_var_variant.return_size_dependency_instructions(HashMap::new());
            let mut instruction_dependencies = HashMap::new();

            for (dep_name, ref dep_instruction) in size_dep_instructions.into_iter() {
                let dependency = create_dependencies_from_instruction(
                    &components, component, &&StateVarReference::SizeOf(state_var_name),
                    dep_instruction, dep_name, essential_data,
                );

                instruction_dependencies.insert(
                    dep_name,
                    dependency ,  
                );

            }

            dependencies.insert(
                StateVarGroup::Single(StateVarReference::SizeOf(state_var_name)),
                instruction_dependencies,
            );


            let array_dep_instructions = state_var_variant.return_array_dependency_instructions(HashMap::new());
            let mut instruction_dependencies = HashMap::new();

            for (dep_name, ref dep_instruction) in array_dep_instructions.into_iter() {
                let dependency = create_dependencies_from_instruction(
                    &components, component, &&StateVarReference::SizeOf(state_var_name),
                    dep_instruction, dep_name, essential_data
                );

                instruction_dependencies.insert(
                    dep_name,
                    dependency,
                );

            }

            dependencies.insert(
                StateVarGroup::Array(state_var_name),
                instruction_dependencies,
            );

        } else {

            let dependency_instructions = return_dependency_instruction_including_shadowing(component, &StateVarReference::Basic(state_var_name));

            let mut instruction_dependencies = HashMap::new();

            for (dep_name, ref dep_instruction) in dependency_instructions.into_iter() {
                let dependency = create_dependencies_from_instruction(
                    &components, component, &StateVarReference::Basic(state_var_name),
                    dep_instruction, dep_name, essential_data
                );

                instruction_dependencies.insert(
                    dep_name,
                    dependency   
                );
            }

            dependencies.insert(
                StateVarGroup::Single(StateVarReference::Basic(state_var_name)),
                instruction_dependencies
            );

        }
    }

    dependencies

}

/// Get the specified attribute if it exists on this component.
/// If not, and if the component is a copy, recursively search for one
/// in the source (and the source's source if it has one, etc).
fn get_attribute_including_copy<'a>(
    components: &'a HashMap<ComponentName, ComponentNode>,
    component: &'a ComponentNode,
    attribute_name: AttributeName
)-> Option<&'a Attribute> {

    if let Some(attribute) = component.attributes.get(attribute_name) {
        Some(attribute)

    } else if let Some(CopySource::Component(ref source_name)) = component.copy_source {

        if attribute_name == "hide" {
            // The hide attribute is an exception: we don't inherit it
            None
        } else {
            let source = components.get(source_name).unwrap();
            get_attribute_including_copy(components, source, attribute_name)
        }
    } else {
        None
    }
}


/// This function also creates essential data when a DependencyInstruction asks for it.
fn create_dependencies_from_instruction(
    components: &HashMap<ComponentName, ComponentNode>,
    component: &ComponentNode,
    state_var_reference: &StateVarReference,
    instruction: &DependencyInstruction,
    instruction_name: InstructionName,
    essential_data: &mut HashMap<ComponentName, HashMap<StateVarName, EssentialStateVar>>,
) -> Vec<Dependency> {

    log_debug!("Creating dependency {}:{}:{}", component.name, state_var_reference, instruction_name);

    let mut dependencies: Vec<Dependency> = Vec::new();

    match &instruction {

        DependencyInstruction::Essential => {

            let component_name = get_name_of_original(components, component);
            let state_var_name = state_var_reference.name();

            let variant = component.definition.state_var_definitions().get(state_var_name).unwrap();
            let essential_datum = EssentialStateVar::new(variant.initial_essential_value());

            // A copy uses the same essential data, so `insert` would be called twice
            // with the same key, but that's ok.
            essential_data
                .entry(component_name.clone())
                .or_insert(HashMap::new())
                .insert(
                    state_var_name,
                    essential_datum,
                );

            dependencies.push(Dependency::Essential {
                component_name,
                state_var_name,
            });

        },

        DependencyInstruction::StateVar { component_name, state_var } => {

            let name = if let Some(ref name) = component_name {
                name.to_string()
            } else {
                component.name.clone()
            };

            dependencies.push(match state_var {

                StateVarGroup::Single(state_var_ref) => {
                    Dependency::StateVar {
                        component_name: name,
                        state_var_ref: state_var_ref.clone()
                    }
                },
                StateVarGroup::Array(array_sv_name) => {
                    Dependency::StateVarArray {
                        component_name: name,
                        array_state_var_name: array_sv_name,
                    }
                },
            });

        },

        DependencyInstruction::Child { desired_children, desired_state_vars } => {

        
            // let mut depends_on_children: Vec<ObjectName> = vec![];
            for (child, _) in get_children_including_copy(components, component).iter() {

                match child {
                    ComponentChild::Component(child_component_name) => {
                        let child_component = components.get(child_component_name).unwrap();

                        let child_is_in_desired_type = desired_children.iter().fold(
                            false,
                            |accum, desired_type| {
                                accum || child_component.definition.get_trait_names().contains(desired_type)
                        });

                        if child_is_in_desired_type {
                            for desired_state_var in desired_state_vars.iter() {

                                let sv_def = child_component.definition
                                    .state_var_definitions()
                                    .get(desired_state_var)
                                    .unwrap();

                                if sv_def.is_array() {
                                    dependencies.push(Dependency::StateVarArray {
                                        component_name: child_component_name.to_string(),
                                        array_state_var_name: desired_state_var,
                                    });

                                } else {
                                    dependencies.push(Dependency::StateVar {
                                        component_name: child_component_name.to_string(),
                                        state_var_ref: StateVarReference::Basic(desired_state_var),
                                    });
    
                                }



                            }
                        }

                    },

                    ComponentChild::String(string_value) => {
                        if desired_children.contains(&ObjectTraitName::TextLike)
                        || desired_children.contains(&ObjectTraitName::NumberLike) {

                            dependencies.push(Dependency::String { value: string_value.to_string() });
                        }
                    },

                }
            }
            

        },
        DependencyInstruction::Parent { state_var } => {

            let desired_state_var = state_var;

            let parent_name = component.parent.clone().expect(&format!(
                "Component {} doesn't have a parent, but the dependency instruction {}:{} asks for one.",
                    component.name, state_var_reference, instruction_name
            ));

            let parent_component = components.get(&parent_name).unwrap();

            // Look up what kind of child state var it is
            // If the state var is an array, depend on the array, otherwise as normal

            let sv_def = parent_component.definition.state_var_definitions().get(desired_state_var).unwrap();

            if sv_def.is_array() {
                dependencies.push(Dependency::StateVarArray {
                    component_name: parent_name.to_string(),
                    array_state_var_name: desired_state_var,
                });

            } else {
                dependencies.push(Dependency::StateVar {
                    component_name: parent_name.to_string(),
                    state_var_ref: StateVarReference::Basic(desired_state_var),
                });

            }

        },


        DependencyInstruction::Attribute { attribute_name } => {

            if let Some(attribute) = get_attribute_including_copy(components, component, attribute_name) {
                match attribute {
                    Attribute::Component(attr_comp_name) => {

                        dependencies.push(Dependency::StateVar {
                            component_name: attr_comp_name.to_string(),

                            // hard code this for now
                            state_var_ref: StateVarReference::Basic("value"),
                        });
                    },

                    Attribute::Primitive(attr_primitive_value) => {
                        dependencies.push(Dependency::String { value:
                            // for now, convert it to a string
                            match attr_primitive_value {
                                StateVarValue::String(v) => v.to_string(),
                                StateVarValue::Boolean(v) => v.to_string(),
                                StateVarValue::Number(v) => v.to_string(),
                                StateVarValue::Integer(v) => v.to_string(),
                            }
                        });

                    },
                }

            }

        },

    }
    dependencies
}


/// Recurse for a copy until the original source is found
fn get_name_of_original(
    components: &HashMap<ComponentName, ComponentNode>,
    component: &ComponentNode,
) -> ComponentName {
    match &component.copy_source {
        Some(CopySource::Component(source)) =>
            get_name_of_original(components, components.get(source).unwrap()),
        _ => component.name.clone(),
    }
} 


/// Calculate all the (normal) state vars that depend on the given state var
fn get_state_variables_depending_on_me(
    core: &DoenetCore,
    sv_component_name: &ComponentName,
    sv_reference: &StateVarReference,
) -> Vec<(ComponentName, StateVarGroup)> {

    let mut depending_on_me = vec![];

    for (comp_name, comp_deps) in core.dependencies.iter() {
        for (sv_ref, sv_dependencies) in comp_deps {

            for (_, deps) in sv_dependencies {
                for dependency in deps {

                    match dependency {
                        Dependency::StateVar { component_name, state_var_ref } => {
                            if component_name == sv_component_name
                            && state_var_ref == sv_reference {
                                depending_on_me.push((comp_name.clone(), sv_ref.clone()));
                            }
                        },

                        Dependency::StateVarArray { component_name, array_state_var_name } => {
                            // check if the state variables is in this group
                            if component_name == sv_component_name
                            && *array_state_var_name == sv_reference.name() {
                                depending_on_me.push((comp_name.clone(), sv_ref.clone()));
                            }
                        },

                        // Essential and String dependencies are endpoints
                        _ => {},

                    }
                }
            }
        }
    }

    depending_on_me
}



fn resolve_state_variable(
    core: &DoenetCore,
    component: &ComponentNode,
    state_var_ref: &StateVarReference,
) -> StateVarValue {
        
    let state_vars = core.component_states.get(&component.name).unwrap();

    // No need to continue if the state var is already resolved
    let current_state = state_vars.get(state_var_ref.name()).unwrap().get_single_state(state_var_ref);
    if let State::Resolved(current_value) = current_state {
        return current_value;
    }

    log_debug!("Resolving {}:{}", component.name, state_var_ref);

    let mut dependency_values: HashMap<InstructionName, Vec<DependencyValue>> = HashMap::new();
    let empty_hash = HashMap::new();

    let my_dependencies_direct = core.dependencies
        .get(&component.name)
        .unwrap()
        .get(&StateVarGroup::Single(state_var_ref.clone()))
        .unwrap_or(&empty_hash);

    log_debug!("{}:{} direct depedencies {:#?}", component.name, state_var_ref, my_dependencies_direct);

    // find what groups the state var is a part of
    let my_dependencies_indirect = match state_var_ref {
        StateVarReference::ArrayElement(_, _) => {
            core.dependencies
            .get(&component.name)
            .unwrap()
            .get(&StateVarGroup::Array(state_var_ref.name()))
            .unwrap_or(&empty_hash)
        },
        _ => &empty_hash,
    };


    log_debug!("{}:{} indirect depedencies {:#?}", component.name, state_var_ref, my_dependencies_indirect);


    // combine HashMaps
    let mut my_dependencies: HashMap<InstructionName, Vec<Dependency>> = my_dependencies_direct.clone();
    for (instruct_name, deps) in my_dependencies_indirect.into_iter() {
        if let Some(existing_deps) = my_dependencies.get_mut(instruct_name) {

            existing_deps.extend(
                deps.clone().into_iter().filter(|dep| {
                    !existing_deps.contains(dep)
                }).collect::<Vec<Dependency>>()
            );


        } else {
            // Didn't have instruction name
            my_dependencies.insert(instruct_name, deps.clone());
        }
    }

    // let my_dependencies: HashMap<InstructionName, Vec<Dependency>> =
    //     my_dependencies_direct.clone()
    //     .into_iter()
    //     .map(|(k, mut v)| {
    //         v.extend(
    //             my_dependencies_indirect.get(k).unwrap().clone()
    //             .into_iter()
    //             .filter(|dep| !v.contains(dep))
    //             .collect::<Vec<Dependency>>());
    //         (k, v)
    //     })
    //     .chain(
    //         my_dependencies_indirect.clone()
    //         .into_iter()
    //         .filter(|(k, _)| !my_dependencies_direct.contains_key(*k))
    //     )
    //     .collect();

    // log_debug!("{}:{} depedencies (de-duplicated) {:#?}", component.name, state_var_ref, my_dependencies);
    
    for (dep_name, deps) in my_dependencies {

        let mut values_for_this_dep: Vec<DependencyValue> = Vec::new();

        for dep in deps {
            match dep {

                Dependency::StateVar { component_name, state_var_ref } => {

                    let depends_on_component = core.component_nodes.get(&component_name).unwrap();
                    let depends_on_value = resolve_state_variable(core, depends_on_component, &state_var_ref);

                    values_for_this_dep.push(DependencyValue {
                        component_type: depends_on_component.component_type,
                        state_var_name: state_var_ref.name(),
                        value: depends_on_value.clone(),
                    });
                },
                Dependency::String { value } => {

                    values_for_this_dep.push(DependencyValue {
                        component_type: "string",
                        state_var_name: "value",
                        value: StateVarValue::String(value.to_string()),
                    });

                },

                Dependency::Essential { component_name, state_var_name } => {

                    let value = core.essential_data
                        .get(&component_name).unwrap()
                        .get(&state_var_name).unwrap()
                        .clone()
                        .get_value(get_essential_datum_index(state_var_ref));
    
                    values_for_this_dep.push(DependencyValue {
    
                        value,
    
                        // We don't really need these fields in this case (?)
                        component_type: "essential_data",
                        state_var_name: "",
                    })
                },

                Dependency::StateVarArray { component_name, array_state_var_name } => {

                    let depends_on_component = core.component_nodes.get(&component_name).unwrap();

                    // important to resolve the size before the elements
                    let size_value = resolve_state_variable(
                        core,
                        depends_on_component,
                        &StateVarReference::SizeOf(array_state_var_name)
                    );
                    
                    for id in 0 as usize..i64::try_from(size_value).unwrap() as usize {
                        let element_value = resolve_state_variable(
                            core,
                            depends_on_component,
                            &StateVarReference::ArrayElement(array_state_var_name, id)
                        );

                        values_for_this_dep.push(DependencyValue {
                            component_type: depends_on_component.component_type,
                            state_var_name: &array_state_var_name,
                            value: element_value.clone(),
                        });
    
                    }

                }
            }
        }
       
        dependency_values.insert(dep_name, values_for_this_dep);
    }


    log_debug!("Dependency values for {}:{}: {:#?}", component.name, state_var_ref, dependency_values);


    let update_instruction = generate_update_instruction_including_shadowing(
        component, state_var_ref, dependency_values
    ).expect(&format!("Can't resolve {}:{} (a {} component type)",
        component.name, state_var_ref, component.component_type)
    );


    let new_value = handle_update_instruction(component, state_vars, state_var_ref, update_instruction);

    return new_value;

}

fn get_essential_datum_index(state_var_ref: &StateVarReference) -> usize {
    match state_var_ref {
        StateVarReference::Basic(_) => 0,
        StateVarReference::SizeOf(_) => 0,
        StateVarReference::ArrayElement(_, i) => i+1,
    }
}

fn references_from_group(
    core: &DoenetCore,
    sv_component: &ComponentNode,
    sv_name: &StateVarName,
) -> Vec<StateVarReference> {

    let state_var = core.component_states.get(&sv_component.name).unwrap().get(sv_name).unwrap();

    let existing_elements = (0..state_var.elements_len())
        .map(|i|
            StateVarReference::ArrayElement(sv_name, i)
        );

    let specific_deps = core.dependencies.get(&sv_component.name).unwrap()
        .iter()
        .filter_map(|(g, _)|
            match g {
                StateVarGroup::Single(StateVarReference::SizeOf(s)) => {
                    Some(StateVarReference::SizeOf(s))
                },
                StateVarGroup::Single(StateVarReference::ArrayElement(s, i)) => {
                    Some(StateVarReference::ArrayElement(s, *i))
                },
                _ => None,
        }
    );

    // combine vectors without redundancy
    let mut all_elements = Vec::new();
    for elem in existing_elements.chain(specific_deps) {
        if !all_elements.contains(&elem) {
            all_elements.push(elem);
        }
    }
    all_elements
}


fn mark_stale_state_var_and_dependencies(
    core: &DoenetCore,
    component: &ComponentNode,
    state_var_ref: &StateVarReference)
{

    log_debug!("Marking stale {}:{}", component.name, state_var_ref);

    let component_state = core.component_states.get(&component.name).unwrap();

    let state_var = component_state.get(state_var_ref.name()).unwrap();
    state_var.mark_single_stale(state_var_ref);

    let depending_on_me = get_state_variables_depending_on_me(core, &component.name, state_var_ref);
    
    for (depending_comp_name, depending_group) in depending_on_me {
        let depending_comp = core.component_nodes.get(&depending_comp_name).unwrap();

        match depending_group {
            StateVarGroup::Single(sv_ref) => {
                mark_stale_state_var_and_dependencies(core, depending_comp, &sv_ref);
            },
            StateVarGroup::Array(sv_name) => {
                let members = references_from_group(core, component, &sv_name);
                for member in members {
                    mark_stale_state_var_and_dependencies(core, depending_comp, &member);
                }
            }
        }
    }
}




fn mark_stale_essential_datum_and_dependencies(
    core: &DoenetCore,
    component_name: ComponentName,
    state_var: &StateVarReference,
) {

    log_debug!("Marking stale essential {}:{}", component_name, state_var);

    let search_for = Dependency::Essential {
        component_name,
        state_var_name: state_var.name(),
    };

    // tuples of component and state var that depend on this essential datum
    let my_dependencies: Vec<(ComponentName, StateVarReference)> = core.dependencies.iter()
        .flat_map(|(component_name, h)|
            h.iter()
            .filter_map(|(sv_group, deps)|
                match sv_group {
                    StateVarGroup::Single(s) => {
                        Some(
                            deps.iter()
                            .flat_map(|(_name, ds)|
                                ds.iter()
                                .filter_map(|d|
                                    if *d == search_for {
                                        Some((component_name.clone(), s.clone()))
                                    } else {
                                        None
                                    }
                                ).collect::<Vec<(ComponentName, StateVarReference)>>()
                            ).collect::<Vec<(ComponentName, StateVarReference)>>()
                        )
                    },
                    _ => None, // group dependencies should not have essential data (for now)
                }
            ).flatten().collect::<Vec<(ComponentName, StateVarReference)>>()
        ).collect();

    for (component_name, state_var_ref) in my_dependencies {
        let component = core.component_nodes.get(&component_name).unwrap();
        mark_stale_state_var_and_dependencies(core, &component, &state_var_ref);
    }
}



/// Sets the state var and returns the new value
fn handle_update_instruction<'a>(
    component: &'a ComponentNode,
    component_state_vars: &HashMap<StateVarName, StateForStateVar>,
    state_var_ref: &StateVarReference,
    instruction: StateVarUpdateInstruction<StateVarValue>
) -> StateVarValue {

    log_debug!("Updating state var {}:{}", component.name, state_var_ref);

    let state_var = component_state_vars.get(state_var_ref.name()).unwrap();

    let updated_value: StateVarValue;

    match instruction {
        StateVarUpdateInstruction::NoChange => {
            let current_value= component_state_vars.get(state_var_ref.name()).unwrap().get_single_state(state_var_ref);


            if let State::Resolved(current_resolved_value) = current_value {
                // Do nothing. It's resolved, so we can use it as is
                updated_value = current_resolved_value;

            } else {
                panic!("Cannot use NoChange update instruction on a stale value");
            }

        },
        StateVarUpdateInstruction::SetValue(new_value) => {

            state_var.set_single_state(state_var_ref, new_value.clone()).expect(
                &format!("Failed to set {}:{} while handling SetValue update instruction", component.name, state_var_ref)
            );

            updated_value = new_value;
        }

    };

    log_debug!("Updated to {}", updated_value);

    return updated_value;
}





#[derive(Debug)]
pub struct Action {
    pub component_name: ComponentName,
    pub action_name: String,

    /// The keys are not strictly state variable names.
    /// They are whatever name the renderer calls the new value.
    pub args: HashMap<String, StateVarValue>,
}


/// Internal struct used to track changes
#[derive(Debug, Clone)]
enum UpdateRequest {
    SetEssentialValue(ComponentName, StateVarReference, StateVarValue),
    SetStateVar(ComponentName, StateVarReference, StateVarValue),
}


/// Among other things, this produces info about the component name based on
/// the dependency instruction.
fn convert_dependency_values_to_update_request(
    core: &DoenetCore,
    component: &ComponentNode,
    state_var: &StateVarReference,
    requests: HashMap<InstructionName, Vec<DependencyValue>>
) -> Vec<UpdateRequest> {

    let instruction_names = core.dependencies
        .get(&component.name).unwrap()
        .get(&StateVarGroup::Single(state_var.clone())).unwrap();

    requests.iter()
        .flat_map(|(instruction_name, values)|
            values.iter()
            .flat_map(|value|
                instruction_names.get(instruction_name).unwrap()
                .iter()
                .filter_map(|instruction|
                    match instruction {
                        Dependency::Essential { component_name, state_var_name: _ } => {
                            Some(UpdateRequest::SetEssentialValue(
                                component_name.clone(),
                                state_var.clone(),
                                value.value.clone(),
                            ))
                        },
                        Dependency::StateVar { component_name, state_var_ref } => {
                            Some(UpdateRequest::SetStateVar(
                                component_name.clone(),
                                state_var_ref.clone(),
                                value.value.clone(),
                            ))
                        },
                        _ => None,
                    }
                ).collect::<Vec<UpdateRequest>>()
            ).collect::<Vec<UpdateRequest>>()
        ).collect()
}

pub fn handle_action_from_json(core: &DoenetCore, action: &str) {

    let action = parse_json::parse_action_from_json(action)
        .expect(&format!("Error parsing json action: {}", action));

    log_debug!("Handling action {:#?}", action);

    // Apply alias to get the original component name
    let component_name = core.aliases.get(&action.component_name).unwrap_or(&action.component_name);

    let component = core.component_nodes.get(component_name)
        .expect(&format!("{} doesn't exist, but action {} uses it", action.component_name, action.action_name));

    let state_var_resolver = | state_var_ref | {
        resolve_state_variable(core, component, state_var_ref)
    };

    let state_vars_to_update = component.definition.on_action(
        &action.action_name,
        action.args,
        &state_var_resolver
    );

    for (state_var_ref, requested_value) in state_vars_to_update {

        let request = UpdateRequest::SetStateVar(component_name.clone(), state_var_ref.clone(), requested_value);
        process_update_request(core, &request);
    }

    log_json!("Updated component tree", utils::json_components(&core.component_nodes, &core.component_states));
}


fn process_update_request(
    core: &DoenetCore,
    update_request: &UpdateRequest
) {

    log_debug!("Processing update request {:?}", update_request);

    match update_request {
        UpdateRequest::SetEssentialValue(component_name, state_var_ref, requested_value) => {

            let essential_var = core.essential_data
                .get(component_name).unwrap()
                .get(state_var_ref.name()).unwrap();

            essential_var.set_value(
                    get_essential_datum_index(state_var_ref),
                    requested_value.clone()
                ).expect(
                    &format!("Failed to set essential value for {}, {}", component_name, state_var_ref)
                );

            log_debug!("Updated essential data {:?}", core.essential_data);

            mark_stale_essential_datum_and_dependencies(core, component_name.clone(), state_var_ref);
        },

        UpdateRequest::SetStateVar(component_name, state_var_ref, requested_value) => {

            let dep_comp = core.component_nodes.get(component_name).unwrap();

            let dep_update_requests = request_dependencies_to_update_value_including_shadow(
                core,
                dep_comp,
                state_var_ref,
                requested_value.clone(),
            );

            for dep_update_request in dep_update_requests {
                process_update_request(core, &dep_update_request);
            }

            let component = core.component_nodes.get(component_name).unwrap();
            mark_stale_state_var_and_dependencies(core, component, &state_var_ref);
        }
    }
}





pub fn update_renderers(core: &DoenetCore) -> String {
    let json_obj = generate_render_tree(core);
    serde_json::to_string(&json_obj).unwrap()
}


fn generate_render_tree(core: &DoenetCore) -> serde_json::Value {

    let root_node = core.component_nodes.get(&core.root_component_name).unwrap();
    let mut json_obj: Vec<serde_json::Value> = vec![];

    generate_render_tree_internal(core, root_node, &mut json_obj, None);

    serde_json::Value::Array(json_obj)
}

fn generate_render_tree_internal(
    core: &DoenetCore,
    component: &ComponentNode,
    json_obj: &mut Vec<serde_json::Value>,
    came_from_copy: Option<&ComponentName>,
) {
    use serde_json::json;

    let state_vars = component.definition.state_var_definitions();

    let renderered_state_vars = state_vars.into_iter().filter(|kv| kv.1.for_renderer());

    let mut state_values = serde_json::Map::new();
    for (name, variant) in renderered_state_vars {

        if variant.is_array() {
            panic!("Can't render array state variables");
        }

        let state_var_value = resolve_state_variable(core, component, &StateVarReference::Basic(name));

        state_values.insert(name.to_string(), match state_var_value {
            StateVarValue::Integer(v) => json!(v),
            StateVarValue::Number(v) =>  json!(v),
            StateVarValue::String(v) =>  json!(v),
            StateVarValue::Boolean(v) => json!(v),
        });
    }

    let name_to_render = match &came_from_copy {
        Some(copy_name) => name_child_of_copy(&component.name, &copy_name),
        None => component.name.clone(),
    };

    let mut children_instructions = Vec::new();
    if component.definition.should_render_children() {
        for (child, actual_child) in get_children_including_copy(&core.component_nodes, component).iter() {
            match child {
                ComponentChild::Component(comp_name) => {
                    // recurse for children
                    let comp = core.component_nodes.get(comp_name).unwrap();
                    
                    let child_came_from_copy =
                        came_from_copy.or(
                            if *actual_child {
                                None
                            } else {
                                Some(&component.name)
                            });

                    generate_render_tree_internal(core, comp, json_obj, child_came_from_copy); 

                    let mut child_actions = serde_json::Map::new();

                    for action_name in comp.definition.action_names() {
                        child_actions.insert(action_name.to_string(), json!({
                            "actionName": action_name,
                            "componentName": comp.name,
                        }));
                    }

                    let renderer_type = match comp.definition.renderer_type() {
                        RendererType::Special(name) => name,
                        RendererType::Myself => comp.component_type,
                    };

                    children_instructions.push(json!({
                        "actions": child_actions,
                        "componentName": comp.name,
                        "componentType": comp.component_type,
                        "effectiveName": comp.name,
                        "rendererType": renderer_type,
                    }));
                },
                ComponentChild::String(string) => {
                    children_instructions.push(json!(string));
                },
            }
        }
    }

    json_obj.push(json!({
        "componentName": name_to_render,
        "stateValues": serde_json::Value::Object(state_values),
        "childrenInstructions": json!(children_instructions),
    }));

}




////////////// Wrappers providing for CopySource and sequence component //////////////

/// This includes the copy source's children. The flag is false when it is
/// a copy source's child. Also skips sequence components.
fn get_children_including_copy(
    components: &HashMap<ComponentName, ComponentNode>,
    component: &ComponentNode
) -> Vec<(ComponentChild, bool)> {
    let mut children_vec: Vec<(ComponentChild, bool)> = Vec::new();
    if let Some(CopySource::Component(ref source)) = component.copy_source {

        let source_comp = components.get(source).unwrap();
        children_vec = get_children_including_copy(components, source_comp)
            .iter()
            .map(|(c, _)| (c.clone(), false))
            .collect();
    }

    children_vec.extend(
        component.children
        .iter()
        .map(|c| (c.clone(), true))
    );

    children_vec
}


fn return_dependency_instruction_including_shadowing(
    component: &ComponentNode,
    state_var: &StateVarReference,
) -> HashMap<InstructionName, DependencyInstruction> {

    if let Some((source_comp, source_state_var)) = state_var_is_shadowing(component, state_var) {

        HashMap::from([
            (SHADOW_INSTRUCTION_NAME, DependencyInstruction::StateVar {
                component_name: Some(source_comp), //.clone(),
                state_var: StateVarGroup::Single(source_state_var),
            })
        ])

    } else {
        let state_var_def = component.definition.state_var_definitions().get(state_var.name()).unwrap();

        match state_var {
            StateVarReference::Basic(_) => {
                state_var_def.return_dependency_instructions(HashMap::new())
            },
            StateVarReference::SizeOf(_) => {
                state_var_def.return_size_dependency_instructions(HashMap::new())
            },
            StateVarReference::ArrayElement(_, id) => {
                state_var_def.return_element_dependency_instructions(*id, HashMap::new())
            }
        }
    }
}



/// This determines the state var given its dependency values.
fn generate_update_instruction_including_shadowing(
    component: &ComponentNode,
    state_var: &StateVarReference,
    dependency_values: HashMap<InstructionName, Vec<DependencyValue>>

) -> Result<StateVarUpdateInstruction<StateVarValue>, String> {

    if state_var_is_shadowing(component, state_var).is_some() {

        // Assuming that source state var is same type as this state var
        let source_value = dependency_values.dep_value(SHADOW_INSTRUCTION_NAME)?
            .has_exactly_one_element()?
            .value();

        Ok(StateVarUpdateInstruction::SetValue(source_value))

    } else {
        // Otherwise, this state var is not shadowing, so proceed normally
        let state_var_def = component.definition.state_var_definitions().get(state_var.name()).unwrap();

        match state_var {
            StateVarReference::Basic(_) => {
                state_var_def.determine_state_var_from_dependencies(dependency_values)
            },
            StateVarReference::SizeOf(_) => {
                state_var_def.determine_size_from_dependencies(dependency_values)
            },
            StateVarReference::ArrayElement(_, id) => {
                state_var_def.determine_element_from_dependencies(*id, dependency_values)
            }
        }

    }
}



fn request_dependencies_to_update_value_including_shadow(
    core: &DoenetCore,
    component: &ComponentNode,
    state_var_ref: &StateVarReference,
    new_value: StateVarValue,
) -> Vec<UpdateRequest> {

    if let Some((source_comp, source_state_var)) = state_var_is_shadowing(component, state_var_ref) {

        vec![UpdateRequest::SetStateVar(source_comp, source_state_var, new_value)]

    } else {
        let requests = component.definition.state_var_definitions().get(state_var_ref.name()).unwrap()
            .request_dependencies_to_update_value(new_value);

        convert_dependency_values_to_update_request(core, component, state_var_ref, requests)
    }
}

/// Detect if a state var is shadowing because of a CopySource
/// and has a primary input state variable, which is needed.
fn state_var_is_shadowing(component: &ComponentNode, state_var: &StateVarReference)
    -> Option<(ComponentName, StateVarReference)> {

    if let Some(CopySource::StateVar(ref source_comp, ref source_state_var)) = component.copy_source {
        if let Some(primary_input_state_var) = component.definition.primary_input_state_var() {

            if state_var == &StateVarReference::Basic(primary_input_state_var) {
                Some((source_comp.to_string(), source_state_var.clone()))
            } else {
                None
            }
        } else {
            panic!("{} component type doesn't have a primary input state var", component.component_type);
        }

    } else {
        None
    }
}
