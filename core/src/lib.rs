pub mod prelude;

pub mod state_variables;
pub mod component;

pub mod state_var;
pub mod parse_json;
pub mod utils;

use std::collections::HashMap;
use std::fmt::Debug;

use crate::prelude::*;
use crate::component::*;

use state_variables::*;
use state_var::{StateVar, State, EssentialStateVar};


#[derive(Debug)]
pub struct DoenetCore {
    pub component_nodes: HashMap<String, ComponentNode>,
    pub component_states: HashMap<String, ComponentState>,
    pub dependencies: Vec<Dependency>,
    pub root_component_name: String,
}


/// This stores some of the state variables (or strings) that a state variable depends on.
#[derive(Debug)]
pub struct Dependency {

    pub component: String,
    pub state_var: StateVarName,

    pub name: InstructionName,


    // We will use outer product of entries (except for the strings, which don't have state vars)
    pub depends_on_objects: Vec<ObjectName>,
    pub depends_on_state_vars: Vec<StateVarName>,

    // TODO: Do we really need this field? It would be easier if we didn't
    // pub instruction: DependencyInstruction,


    pub variables_optional: bool,
}





/// This trait holds equivalent functions for every component, suitable for a derive macro.
/// To derive this, a struct must 
///     - have the fields: name, parent, child, and essential_state_vars
///     - have fields of type StateVar
pub trait ComponentLike: ComponentSpecificBehavior {

    fn name(&self) -> &str;

    fn children(&self) -> &Vec<ComponentChild>;

    fn parent(&self) -> &Option<String>;

    fn get_state_var(&self, name: StateVarName) -> Option<&StateVar>;

    fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar>;

    /// Return the name (lower case).
    fn get_component_type(&self) -> &'static str;
}


/// This trait holds functions that are defined differently for every component.
/// None of these functions should use the self parameter.
pub trait ComponentSpecificBehavior: Debug {

    /// This function should never use self in the body.
    fn state_variable_instructions(&self) -> &'static HashMap<StateVarName, StateVarVariant>;

    fn attribute_instructions(&self) -> &'static HashMap<&'static str, AttributeDefinition>;

    fn attributes(&self) -> &HashMap<AttributeName, Attribute>;

    fn get_copy_target_if_exists(&self) -> &Option<String>;


    // fn get_state_var_access(&self, name: StateVarName) -> Option<StateVarAccess>;

    // fn actions(&self) -> &phf::Map<&'static str, fn(HashMap<String, StateVarValue>) -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>>> {
    //     &phf_map! {}
    // }

    fn action_names(&self) -> Vec<&'static str>;


    fn on_action<'a>(
        &'a self, _action_name: &str, _args: HashMap<String, StateVarValue>,
        _resolve_and_retrieve_state_var: &'a dyn Fn(StateVarName) -> StateVarValue
    ) -> HashMap<StateVarName, StateVarValue>
    {

        HashMap::new()
    }

    /// This function should never use self in the body.
    fn should_render_children(&self) -> bool;
    
    /// This function should never use self in the body.
    fn get_trait_names(&self) -> Vec<ObjectTraitName>;

}


// lazy_static! {

//     pub static ref COMPONENT_TYPES: HashSet<ComponentType> = HashSet::from([
//         "text",
//         "number",
//         "textInput",
//         "document",
//         "boolean",
//     ]);
    
// }

pub fn create_new_component_of_type(component_type: ComponentType, name: &str, parent_name: Option<&str>, children: Vec<ComponentChild>, attributes: HashMap<AttributeName, Attribute>, copy_target: Option<String>) -> Result<Box<dyn ComponentLike>, String> {

    // Before we create the component, we have to figure out which of its 
    // state vars are essential state vars. Note that we're technically doing more
    // work than we have to because we're doing all the work for each component,
    // rather than each component type

    let state_var_definitions: &HashMap<StateVarName, StateVarVariant> = match component_type {
        "text" =>       &crate::text::MY_STATE_VAR_DEFINITIONS,
        "number" =>     &crate::number::MY_STATE_VAR_DEFINITIONS,
        "textInput" =>  &crate::text_input::MY_STATE_VAR_DEFINITIONS,
        "document" =>   &crate::document::MY_STATE_VAR_DEFINITIONS,
        "boolean" =>    &crate::boolean::MY_STATE_VAR_DEFINITIONS,

        _ => {
            return Err(format!("Unrecognized component type {}", component_type));
        }
    };

    let mut essential_state_vars = HashMap::new();
    for (&state_var_name, state_var_def) in state_var_definitions {
        
        if state_var_def.has_essential() {
            essential_state_vars.insert(state_var_name, EssentialStateVar::derive_from(
                
                // TODO: This is hacky. We should create the actual StateVars first
                match state_var_def {
                    StateVarVariant::String(_) => StateVar::new(StateVarValueType::String),
                    StateVarVariant::Integer(_) => StateVar::new(StateVarValueType::Integer),
                    StateVarVariant::Number(_) => StateVar::new(StateVarValueType::Number),
                    StateVarVariant::Boolean(_) => StateVar::new(StateVarValueType::Boolean),
                }
            ));
        }
    }


    let name = name.to_string();
    let parent_name = if let Some(par_name) = parent_name {
        Some(par_name.to_string())
    } else {
        None
    };

    match component_type {

        "text" => Ok(text::Text::create(
            name,
            parent_name,
            children,
            essential_state_vars,
            attributes,
            copy_target,
            None,
        )),
        "number" => Ok(number::Number::create(
            name,
            parent_name,
            children,
            essential_state_vars,
            attributes,
            copy_target,
        )),
        "textInput" => Ok(text_input::TextInput::create(
            name,
            parent_name,
            children,
            essential_state_vars,
            attributes,
            copy_target,
        )),
        "document" => Ok(document::Document::create(
            name,
            parent_name,
            children,
            essential_state_vars,
            attributes,
            copy_target,
        )),
        "boolean" => Ok(boolean::Boolean::create(
            name,
            parent_name,
            children,
            essential_state_vars,
            attributes,
            copy_target,
        )),

        // Add components to this match here

        _ => {
            return Err(format!("Unrecognized component type {}", component_type));
        }
    }
}


fn set_state_var(
    component: &ComponentNode,
    component_state_vars: &dyn ComponentStateVars,
    name: StateVarName,
    val: StateVarValue)
-> Result<(), String>
{
    let state_var = component_state_vars.get(name).expect(
        &format!("Component {} of type {} does not have state var {}",
        component.name, component.component_type, name)
    );

    state_var.set_value(val)
        
}







pub fn create_doenet_core(json_deserialized: serde_json::Value) -> DoenetCore {

    // log!("Received json {:#?}", json_deserialized);

    let possible_components_tree = parse_json::create_components_tree_from_json(&json_deserialized)
        .expect("Error parsing json for components");

    let (component_nodes, root_component_name) = possible_components_tree;

    log!("Component nodes {:#?}", component_nodes);


    // let mut new_components_from_copies = HashMap::new();

    // Component name, new child name
    let mut components_to_add: Vec<ComponentNode> = vec![];

    // Names already exist in hashmap, but will replace it with these structs
    let mut component_states_structs_to_change: Vec<ComponentNode> = vec![];

    for (component_name, component) in &component_nodes {

        if let Some(ref target_name) = component.copy_target {
            let target_component = component_nodes.get(target_name).unwrap();

            debug_assert_eq!(component.component_type, target_component.component_type);

            // Copy the target into the component

            // ...


            let mut children_copy = vec![];

            // Shadow copy the children
            for child in &target_component.children {
                match child {
                    ComponentChild::Component(child_comp_name) => {
                        let child_comp = component_nodes.get(child_comp_name).unwrap();
                        copy_subtree(&component_nodes, child_comp, &mut children_copy);
                    },
                    ComponentChild::String(str_child) => {

                    },
                }
            }


            // First, we mark that they are shadowing the original names
            // We will change the copies' names next so they're not actually shadowing themselves
            for shadow_component in children_copy.iter_mut() {

                let is_shadow_field = &mut shadow_component.is_shadow_for;
                *is_shadow_field = Some(shadow_component.name.clone());
            }


            // Transform the names so that they don't collide with existing names
            // If it used to refer to the target, we want it to refer to the copier
            let name_transform = |name: &String| {
                if name == target_name {
                    component_name.to_string()
                } else {
                    format!("__cp:{}({})", name, component_name)
                }
            };

            for shadow_component in children_copy.iter_mut() {

                // Transform the names of components, including parent_name and children fields

                let name = &mut shadow_component.name;
                *name = name_transform(name);

                let parent_name = shadow_component.parent.as_mut().unwrap();
                *parent_name = name_transform(parent_name);

                let child_names = &mut shadow_component.children;
                for child_name in child_names {
                    if let ComponentChild::Component(name) = child_name {
                        *name = name_transform(name);
                    }
                }
            }


            log!("Copied components, {:#?}", children_copy);

            components_to_add.extend(children_copy);


        }
    }


    let mut component_nodes = component_nodes;
    add_component_nodes_using_parent_field(&mut component_nodes, components_to_add);
    let component_nodes = component_nodes;


//    let mut new_components_from_copies = HashMap::new();
//     }

//     let mut components = components;

//     for (new_comp_name, new_comp) in new_components_from_copies {

//         assert!( !components.contains_key(&new_comp_name));
//         components.insert(new_comp_name, new_comp);
//     }


//     for (component_name, child_name) in components_to_add_child {
//         replace_component_with_added_child(&mut components, &component_name, &child_name);
//     }



//     let components = components;




    let mut component_states: HashMap<String, ComponentState> = HashMap::new();

    let mut dependencies: Vec<Dependency> = vec![];
    
    for (component_name, component_node) in component_nodes.iter() {

        if let Some(ref shadow_target_name) = component_node.is_shadow_for {
            
            debug_assert!( component_nodes.contains_key(shadow_target_name));

            component_states.insert(component_name.clone(),
                ComponentState::Shadowing(shadow_target_name.clone())
            );

        } else {
            let mut dependencies_for_this_component = create_all_dependencies_for_component(&component_nodes, component_node);
            dependencies.append(&mut dependencies_for_this_component);

            component_states.insert(component_name.clone(), ComponentState::State(
                component_node.definition.new_stale_component_state_vars()
            ));
        }

    }


    // log!("component nodes {:#?}", component_nodes);
    // log!("component states {:#?}", component_states);

    // Return the DoenetCore structure
    DoenetCore {
        component_nodes,
        component_states,
        dependencies: dependencies,
        root_component_name
    }
}


fn add_component_nodes_using_parent_field(component_nodes: &mut HashMap<String, ComponentNode>, new_components: Vec<ComponentNode>) {

    let new_component_names: Vec<String> = new_components.iter().map(|new_comp| new_comp.name.clone()).collect();

    for comp in new_components.into_iter() {
        
        if component_nodes.contains_key(&comp.name) {
            panic!("New component {} already exists", comp.name);
        }

        component_nodes.insert(comp.name.clone(), comp);
    }


    // After we've added all the new components, hook them to their parents
    for name in new_component_names {

        // Cloning because we can't have a reference here, due to mutable reference later
        let component = component_nodes.get(&name).unwrap().clone();

        let parent_name = component.parent.as_ref().expect(&format!("New component {} has no parent", name));

        let parent = component_nodes.get_mut(parent_name).expect(
            &format!("Parent component {} doesn't exist for {}", parent_name, component.name)
        );

        // Update parent's children
        if !parent.children.contains(&ComponentChild::Component(name.to_string())) {
            parent.children.push(ComponentChild::Component(name.to_string()));
        }

    }
}





pub fn create_all_dependencies_for_component(
    components: &HashMap<String, ComponentNode>,
    component: &ComponentNode,
) -> Vec<Dependency>

{

    log!("Creating depencies for {:?}", component.name);
    let mut dependencies: Vec<Dependency> = vec![];

    let my_definitions = component.definition.state_var_definitions();

    for (&state_var_name, state_var_def) in my_definitions {

        let dependency_instructions_hashmap = state_var_def.return_dependency_instructions(HashMap::new());


        for (dep_name, dep_instruction) in dependency_instructions_hashmap.into_iter() {

            let dependency =  create_dependency_from_instruction(&components, component, state_var_name, dep_instruction, dep_name);

            dependencies.push(dependency);

        }



    }

    dependencies

}


fn create_dependency_from_instruction(
    components: &HashMap<String, ComponentNode>,
    component: &ComponentNode,
    state_var_name: StateVarName,
    instruction: DependencyInstruction,
    instruction_name: InstructionName,

) -> Dependency {

    let depends_on_objects: Vec<ObjectName>;
    let depends_on_state_vars: Vec<StateVarName>;

    log!("Creating dependency {}:{}:{}", component.name, state_var_name, instruction_name);


    match &instruction {

        DependencyInstruction::StateVar(state_var_instruction) => {

            depends_on_objects = if let Option::Some(ref name) = state_var_instruction.component_name {
                    vec![ObjectName::Component(name.to_string())]
                } else {
                    vec![ObjectName::Component(component.name.clone())]
                };
            depends_on_state_vars = vec![state_var_instruction.state_var];
        },

        DependencyInstruction::Child(child_instruction) => {

            let mut depends_on_children: Vec<ObjectName> = vec![];
            for child in component.children.iter() {

                for desired_child_type in child_instruction.desired_children.iter() {
                    match child {
                        ComponentChild::Component(child_component_name) => {
                            let child_component = components.get(child_component_name).unwrap();

                            if child_component.definition.get_trait_names().contains(desired_child_type) {
                                // If not already in list, add it to the list
                                if !depends_on_children.contains(&ObjectName::Component(child_component.name.clone())) {
                                    depends_on_children.push(ObjectName::Component(child_component.name.clone()));
                                }
                            }
                        },

                        ComponentChild::String(string_value) => {
                            if desired_child_type == &ObjectTraitName::TextLike ||
                                desired_child_type == &ObjectTraitName::NumberLike {
                                
                                depends_on_children.push(ObjectName::String(string_value.to_owned()));

                            }
                        },
                    }

                }
            }

            depends_on_objects = depends_on_children;
            depends_on_state_vars = child_instruction.desired_state_vars.clone();

        },
        DependencyInstruction::Parent(parent_instruction) => {
            // Parent doesn't exist yet

            let parent_name = component.parent.clone().expect(&format!(
                "Component {} doesn't have a parent, but the dependency instruction {}:{} asks for one.",component.name, state_var_name, instruction_name
            ));

            depends_on_objects = vec![ObjectName::Component(parent_name)];
            depends_on_state_vars = vec![parent_instruction.state_var];
        },


        DependencyInstruction::Attribute(attribute_instruction) => {

            log!("attribute instruction {:#?}", attribute_instruction);
            // log!("component attributes {:#?}", component.attributes());

            if let Some(attribute) = component.attributes.get(attribute_instruction.attribute_name) {
                match attribute {
                    Attribute::Component(attr_comp_name) => {
                        depends_on_objects = vec![ObjectName::Component(attr_comp_name.to_string())];

                        // hard code this for now
                        depends_on_state_vars = vec!["value"];
                    },

                    Attribute::Primitive(attr_primitive_value) => {
                        depends_on_objects = vec![ObjectName::String(

                            // for now, convert it to a string
                            match attr_primitive_value {
                                StateVarValue::String(v) => v.to_string(),
                                StateVarValue::Boolean(v) => v.to_string(),
                                StateVarValue::Number(v) => v.to_string(),
                                StateVarValue::Integer(v) => v.to_string(),
                            }
                        )];

                        depends_on_state_vars = vec![];
                    }
                }

            } else {
                // Attribute doesn't exist
                depends_on_objects = vec![];
                depends_on_state_vars = vec![];
            }

        }
    };


    Dependency {
        name: instruction_name,
        component: component.name.clone(),
        state_var: state_var_name,
        variables_optional: false,

        depends_on_objects,
        depends_on_state_vars,
    }


}





pub fn dependencies_for_component<'a>(
    core: &'a DoenetCore,
    component_name: &str,
    state_var_name: StateVarName) -> Vec<&'a Dependency>
{
    core.dependencies.iter().filter(
        |dep| dep.component == component_name && dep.state_var == state_var_name
    ).collect()
}



pub fn resolve_unshadowing_state_variable(
    core: &DoenetCore,
    component: &ComponentNode,
    state_vars: &dyn ComponentStateVars,
    state_var_name: StateVarName) -> StateVarValue {
        
    let mut dependency_values: HashMap<InstructionName, Vec<DependencyValue>> = HashMap::new();

    
    let my_dependencies = dependencies_for_component(core, &component.name, state_var_name);

    for dep in my_dependencies {

        let mut values_for_this_dep: Vec<DependencyValue> = Vec::new();

        for depends_on in &dep.depends_on_objects {

            match depends_on {
                ObjectName::String(string) => {

                    // Right now, the only thing you can get from a string is its faked 'value' state var
                    if dep.depends_on_state_vars.contains(&"value") {
                        values_for_this_dep.push(DependencyValue {
                            component_type: "string",
                            state_var_name: "value",
                            value: StateVarValue::String(string.to_string()),
                        });
               
                    }
                },
                ObjectName::Component(depends_on_name) => {

                    let depends_on_component = core.component_nodes.get(depends_on_name).unwrap();

                    for &dep_state_var_name in &dep.depends_on_state_vars {

                        // log!("About to recurse and resolve {}:{}", depends_on_component.name(), dep_state_var_name);

                        let depends_on_value = resolve_state_variable(core, depends_on_component, dep_state_var_name);

                        values_for_this_dep.push(DependencyValue {
                            component_type: core.component_nodes.get(depends_on_name).unwrap().component_type,
                            state_var_name: dep_state_var_name,
                            value: depends_on_value.clone(),
                        });

                    }
                }
            }
        }

        // log!("dep name {}", dep.name);
        dependency_values.insert(dep.name, values_for_this_dep);
    }

    let definition = component.definition.state_var_definitions().get(state_var_name).unwrap();

    let update_instruction = definition.determine_state_var_from_dependencies(dependency_values);
    let new_value = handle_update_instruction(component, state_vars, state_var_name, update_instruction);

    return new_value;

}


/// Ensure a state variable is not stale and can be safely unwrapped.
pub fn resolve_state_variable(
    core: &DoenetCore,
    component: &ComponentNode,
    state_var_name: StateVarName) -> StateVarValue {

    // log!("Resolving state variable {}:{}", component.name(), state_var_name);

    let component_state = core.component_states.get(&component.name).unwrap();

    match component_state {
        ComponentState::Shadowing(target_name) => {
            let target_comp = core.component_nodes.get(target_name).unwrap();
            resolve_state_variable(core, target_comp, state_var_name)
        },

        ComponentState::State(state_vars) => {
            resolve_unshadowing_state_variable(core, component, state_vars.as_ref(), state_var_name)
    }
}



    // if component.get_copy_target_if_exists().is_some() && state_var_def.shadow_variable() {
    //     // This state variable should copy the target's sv value

    //     let copy_target = component.get_copy_target_if_exists().as_ref().unwrap();

    //     let target_component = core.components.get(copy_target).expect(
    //         &format!("Component '{}' doesn't exist, but '{}' tries to copy from it", copy_target, component.name())
    //     ).as_ref();

    //     // Resolved the target sv
    //     resolve_state_variable(core, target_component, state_var_name);

    //     let state_var = target_component.get_state_var(state_var_name).unwrap();
    //     let state_var_value = state_var.get_state();

    //     if let State::Resolved(state_var_value) = state_var_value {

    //         let update_instruction = StateVarUpdateInstruction::SetValue(state_var_value);
    //         handle_update_instruction(component, state_var_name, update_instruction);

    //     } else {
    //         panic!("Tried to access stale state var {}:{} (component type {})",
    //             target_component.name(), state_var_name, target_component.get_component_type()
    //         );
    //     }
        


    // } else {




    
        // log!("{}:{} resolved", component.name(), state_var_name);
        // log!("{:?}", component);






    // }



    
}



pub fn mark_stale_state_var_and_dependencies(
    core: &DoenetCore,
    component: &ComponentNode,
    component_state: &ComponentState,
    state_var_name: StateVarName)
{

    // log!("Marking stale {}:{}", component.name(), state_var_name);

    let comp_state_vars = if let ComponentState::State(svs) = component_state {
        svs
    } else {
        panic!("assuming not shadowing");
    };

    let state_var = comp_state_vars.get(state_var_name).unwrap();
    state_var.mark_stale();

    let my_dependencies = dependencies_for_component(core, &component.name, state_var_name);
    for dependency in my_dependencies {

        for depends_on in &dependency.depends_on_objects {
            match depends_on {
                ObjectName::String(_) => {
                    // do nothing
                },
                ObjectName::Component(dep_comp_name) => {
                    let dep_component = core.component_nodes.get(dep_comp_name).unwrap();

                    for &dep_state_var_name in &dependency.depends_on_state_vars {

                        let dep_comp_state = core.component_states.get(dep_comp_name).unwrap();

                        mark_stale_state_var_and_dependencies(core, dep_component, dep_comp_state, dep_state_var_name);
                    }
                }
            }
        }
    }

}


/// Sets the state var and returns the new value
pub fn handle_update_instruction<'a>(
    component: &'a ComponentNode,
    component_state_vars: &dyn ComponentStateVars,
    name: StateVarName,
    instruction: StateVarUpdateInstruction<StateVarValue>) -> StateVarValue

{

    log!("Updating {}:{}", component.name, name);

    let definition = component.definition.state_var_definitions().get(name).unwrap();

    let updated_value: StateVarValue;

    match instruction {
        StateVarUpdateInstruction::NoChange => {
            let current_value = component_state_vars.get(name).unwrap().get_state();

            if let State::Resolved(current_resolved_value) = current_value {
                // Do nothing. It's resolved, so we can use it as is
                updated_value = current_resolved_value;

            } else {
                panic!("Cannot use NoChange update instruction on a stale value");
            }

        },
        StateVarUpdateInstruction::UseEssentialOrDefault => {
            if definition.has_essential() == false {
                panic!(
                    "Cannot UseEssentialOrDefault on {}:{},
                    which has no essential (Component type {}) ",
                    component.name, name, component.component_type
                );
            }

            let possible_essential_val = component_state_vars.get_essential_state_vars().get(name).unwrap().get_value();
            let new_state_var_value = if let Some(actual_val) = possible_essential_val {
                actual_val
            } else {
                definition.default_value()
            };
            

            set_state_var(component, component_state_vars, name, new_state_var_value.clone()).expect(
                &format!("Failed to set {}:{}", component.name, name)
            );
            updated_value = new_state_var_value;

        },
        StateVarUpdateInstruction::SetValue(new_value) => {

            let new_state_var_value = new_value;
            set_state_var(component, component_state_vars, name, new_state_var_value.clone()).expect(
                &format!("Failed to set {}:{}", component.name, name)
            );

            updated_value = new_state_var_value;
        }

    };


    return updated_value;
}




#[derive(Debug)]
pub struct Action {
    // pub component: Box<dyn ComponentLike>,
    pub component_name: String,
    pub action_name: String,
    // pub action_func: fn(HashMap<String, StateVarValue>)
        // -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>>,
    pub args: HashMap<String, StateVarValue>,
}


pub fn handle_action_from_json(core: &DoenetCore, action_obj: serde_json::Value) {
    
    let action = parse_json::parse_action_from_json(action_obj)
        .expect("Error parsing json action");

    handle_action(core, action);
}


// This should be private eventually
pub fn handle_action<'a>(core: &'a DoenetCore, action: Action) {

    // log!("Handling action {:#?}", action);
    let component = core.component_nodes.get(&action.component_name)
        .expect(&format!("{} doesn't exist, but action {} uses it", action.component_name, action.action_name));

    let component_state = core.component_states.get(&action.component_name).unwrap();

    let component_state_vars = if let ComponentState::State(svs) = component_state {
        svs
    } else {
        panic!("Assuming comp state is not shadowing for now");
    };

    let state_var_resolver = | state_var_name | {
        resolve_state_variable(core, component, state_var_name)
    };

    let state_vars_to_update = component.definition.on_action(&action.action_name, action.args, &state_var_resolver);

    for (name, requested_value) in state_vars_to_update {

        let definition = component.definition.state_var_definitions().get(name).unwrap();
        let requests = definition.request_dependencies_to_update_value(requested_value);

        for request in requests {
            process_update_request(core, component, component_state, name, request);

        }
    }

}


pub fn process_update_request(
    core: &DoenetCore,
    component: &ComponentNode,
    component_state: &ComponentState,
    state_var_name: StateVarName,
    update_request: UpdateRequest) 
{

    // log!("Processing update request for {}:{}", component.name(), state_var_name);

    match update_request {
        UpdateRequest::SetEssentialValue(their_name, requested_value) => {

            panic!();

            // let essential_var = component.get_essential_state_vars().get(their_name).unwrap();
            // essential_var.set_value(requested_value).expect(
            //     &format!("Failed to set essential value for {}:{}", component.name(), their_name)
            // );
        },

        UpdateRequest::SetStateVarDependingOnMe(their_name, requested_value) => {

            log!("desired value {:?}", requested_value);


            let state_var_definition = component.definition.state_var_definitions().get(their_name).unwrap();

            let their_update_requests = state_var_definition.request_dependencies_to_update_value(requested_value);

            for their_update_request in their_update_requests {
                process_update_request(core, component, component_state, their_name, their_update_request);
            }

        }
    }

    mark_stale_state_var_and_dependencies(core, component, component_state, state_var_name);

}


fn copy_target_into_component(components: &HashMap<String, Box<dyn ComponentLike>>, component: &dyn ComponentLike) {

    let target_name = component.get_copy_target_if_exists().as_ref()
        .expect("Can't fill in copy component on component without copyTarget");

    let target_component = components.get(target_name).expect("Copy target doesn't exist");
}



/// Note: this function destroys the component instance and creates another one !!! 
fn replace_component_with_added_child(components: &mut HashMap<String, Box<dyn ComponentLike>>, component_name: &str, child_name: &str) {

    log!("Trying to add {} to {}", child_name, component_name);

    let component = components.get(component_name).unwrap().as_ref();


    let child = components.get(child_name).unwrap();
    let child_obj = ComponentChild::Component(child.name().to_string());

    debug_assert!( !component.children().contains(&child_obj));

    let mut new_children: Vec<ComponentChild> = component.children().clone();
    new_children.push(child_obj);


    // The only difference is the new child
    let component_with_child = create_new_component_of_type(
        component.get_component_type(),
        component.name(),
        match component.parent() {
            Some(p) => Some(&p),
            None => None,
        },
        new_children,
        component.attributes().clone(),
        component.get_copy_target_if_exists().clone()
    ).unwrap();

    
    components.remove(component_name);
    components.insert(component_with_child.name().to_string(), component_with_child);

}




fn copy_children_names_recursive(
    component_nodes: &HashMap<String, ComponentNode>,
    component: &ComponentNode) -> Vec<ComponentChild>
{
    let mut children = vec![];
    copy_children_names_recursive_internal(component_nodes, component, &mut children);

    children
}


fn copy_children_names_recursive_internal(
    component_nodes: &HashMap<String, ComponentNode>,
    component: &ComponentNode,
    children_names: &mut Vec<ComponentChild>)
{
    for child in &component.children {
        children_names.push(child.clone());

        if let ComponentChild::Component(comp_name) = child {
            let child_comp = component_nodes.get(comp_name).unwrap();
            copy_children_names_recursive_internal(component_nodes, child_comp, children_names);
        }
    }
}



/// Does not copy attributes
/// Duplicates the name of the children with no modification
fn copy_subtree(
    component_nodes: &HashMap<String, ComponentNode>,
    component: &ComponentNode,
    // new_parent_name: String,
    new_named_components: &mut Vec<ComponentNode>)
{

    
    let mut children: Vec<ComponentChild> = vec![];

    for child in &component.children {

        match child {

            ComponentChild::String(string_child) => {
                children.push(ComponentChild::String(string_child.to_string()));
            },

            ComponentChild::Component(child_comp_name) => {

                children.push(ComponentChild::Component(child_comp_name.to_string()));

                let child_component = component_nodes.get(child_comp_name).unwrap();
                copy_subtree(component_nodes, child_component, new_named_components);

            }
        }
    }

    let component_copy = ComponentNode {
        // parent: Some(new_parent_name),
        attributes: component.definition.empty_attribute_data(),
        .. component.clone()
    };

    new_named_components.push(component_copy);    

}


// fn shadow_essentials_of_copy_target(components: &HashMap<String, Box<dyn ComponentLike>>, component: &dyn ComponentLike) {

//     let target_name = component.get_f_if_exists().as_ref()
//         .expect("Can't fill in copy component on component without copyTarget");

//     let target_component = components.get(target_name).expect("Copy target doesn't exist");

//     // For now, just using the 'value' essential state var as the thing to shadow

//     let target_essential = target_component.get_essential_state_vars().get("value").unwrap();
//     let my_essential = component.get_essential_state_vars().get("value").unwrap();

//     // Mark my essential as shadowing target essential
//     *my_essential.shadowing_component_name.borrow_mut() = Some(target_name.to_string());
//     target_essential.shadowed_by_component_names.borrow_mut().push(component.name().to_string());
    
// }









pub fn update_renderers(core: &DoenetCore) -> serde_json::Value {
    let json_obj = generate_render_tree(core);
    json_obj
}


pub fn generate_render_tree(core: &DoenetCore) -> serde_json::Value {

    let root_node = core.component_nodes.get(&core.root_component_name).unwrap();
    let mut json_obj: Vec<serde_json::Value> = vec![];

    generate_render_tree_internal(core, root_node, &mut json_obj);

    serde_json::json!(json_obj)
}


fn generate_render_tree_internal(core: &DoenetCore, component: &ComponentNode, json_obj: &mut Vec<serde_json::Value>) {

    let component_state = core.component_states.get(&component.name).unwrap();

    let comp_state_vars = if let ComponentState::State(svs) = component_state {
        svs
    } else {
        panic!();
    };

    use serde_json::Value;
    use serde_json::json;

    let state_vars = component.definition.state_var_definitions();

    let renderered_state_vars = state_vars.into_iter().filter(|kv| match kv.1 {
        StateVarVariant::Integer(sv) => sv.for_renderer,
        StateVarVariant::Number(sv) => sv.for_renderer,
        StateVarVariant::String(sv) => sv.for_renderer,
        StateVarVariant::Boolean(sv) => sv.for_renderer,
    });

    let mut state_values = serde_json::Map::new();
    for (name, _variant) in renderered_state_vars {

        resolve_state_variable(core, component, name);

        let state_var_value = comp_state_vars.get(name).unwrap().copy_value_if_resolved();

        let state_var_value = state_var_value.unwrap();

        // log!("components right now {:#?}", core.components);
        // log!("{:#?}", state_var_value);

        state_values.insert(name.to_string(), match state_var_value {
            StateVarValue::Integer(v) => json!(v),
            StateVarValue::Number(v) =>  json!(v),
            StateVarValue::String(v) =>  json!(v),
            StateVarValue::Boolean(v) =>    json!(v),
        });

    }


    let children_instructions = if component.definition.should_render_children() {

        component.children.iter().map(|child| match child {
            ComponentChild::Component(comp_name) => {
                // recurse for children
                let comp = core.component_nodes.get(comp_name).unwrap();

                generate_render_tree_internal(core, comp, json_obj);

                let mut child_actions = serde_json::Map::new();

                for action_name in comp.definition.action_names() {
                    child_actions.insert(action_name.to_string(), json!({
                        "actionName": action_name,
                        "componentName": comp.name,
                    }));
                }

                json!({
                    "actions": child_actions,
                    "componentName": comp.name,
                    "componentType": comp.component_type,
                    "effectiveName": comp.name,
                    "rendererType": comp.component_type,
                })},
            ComponentChild::String(string) => {
                json!(string)
            },
        }).collect()
    } else {
        vec![]
    };

    json_obj.push(json!({
        "componentName": component.name,
        "stateValues": Value::Object(state_values),
        "childrenInstructions": json!(children_instructions),
    }));

}



impl DoenetCore {
    pub fn json_components(&self) -> serde_json::Value {

        let mut json_components = serde_json::Map::new();
    
        for component in self.component_nodes.values() {
            json_components.insert(
                component.name.to_string(),
                utils::package_subtree_as_json(&self.component_nodes, &&self.component_states, component)
            );
        }
    
    
        serde_json::Value::Object(json_components)
    }
}
