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
use state_var::State;


/// This stores the components and dependency graph.
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




pub fn create_doenet_core(program: &str) -> DoenetCore {

    let possible_components_tree = parse_json::create_components_tree_from_json(program)
        .expect("Error parsing json for components");

    let (component_nodes, root_component_name) = possible_components_tree;

    log!("Component nodes {:#?}", component_nodes);

    

    // Fill in copyTargets

    // Key: Component name
    // Value: target name
    let copy_target_info: HashMap<String, String> = component_nodes.iter()
        .filter_map(| (_, comp)| {
            if let Some(ref target_name) = comp.copy_target {

                Some((comp.name.clone(), target_name.clone()))

            } else {
                None
            }
        }).collect();


    // This will keep track of which component we have filled out
    let mut filled_out: HashMap<String, bool> = copy_target_info.keys().map(|comp_name| {
        (comp_name.to_string(), false)
    }).collect();



    let mut component_nodes = component_nodes;

    for (component_name, target_name) in copy_target_info.iter() {
        fill_out_copy_target(&mut component_nodes, &mut filled_out, &copy_target_info, component_name, target_name);
    }

    let component_nodes = component_nodes;



    // Create node states

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
        dependencies,
        root_component_name
    }
}

fn fill_out_copy_target(
    component_nodes: &mut HashMap<String, ComponentNode>,
    filled_out: &mut HashMap<String, bool>,
    copy_target_info: &HashMap<String, String>,
    component_name: &str,
    target_name: &str
) {

    // If this component has already been filled out, don't do it again
    if filled_out.get(component_name).unwrap() == &true {
        return;
    }


    if let Some(target_filled_out) = filled_out.get(target_name) {
        if target_filled_out == &false {

            // If this copy has a target that itself has an unfilled target,
            // fill out the target's target first
            let target_target_name = copy_target_info.get(target_name).unwrap();
            fill_out_copy_target(component_nodes, filled_out, copy_target_info, target_name, &target_target_name);
        }
    }

    // Now that we know that everything this component copies has been filled out,
    // fill out this component and flag it as filled out

    copy_target_from_filled_out_component(component_nodes, component_name, target_name);
    let component_filled_out = filled_out.get_mut(component_name).unwrap();
    *component_filled_out = true;

}





fn copy_target_from_filled_out_component(
    component_nodes: &mut HashMap<String, ComponentNode>,
    component_name: &str,
    target_name: &str,
) {

    let component = component_nodes.get(component_name).unwrap();
    let target_component = component_nodes.get(target_name).unwrap();

    debug_assert_eq!(component.component_type, target_component.component_type);


    let mut target_direct_children: Vec<ComponentChild> = vec![];
    let mut new_named_components: Vec<ComponentNode> = vec![];

    // Shadow copy the children
    for child in &target_component.children {
        target_direct_children.push(child.clone());

        match child {
            ComponentChild::Component(child_comp_name) => {
                let child_comp = component_nodes.get(child_comp_name).unwrap();
                copy_subtree(&component_nodes, child_comp, &mut new_named_components);
            },

            ComponentChild::String(_) => {
            },
        }
    }


    // First, we mark that they are shadowing the original names
    // We will change the copies' names next so they're not actually shadowing themselves
    for shadow_component in new_named_components.iter_mut() {

        let is_shadow_field = &mut shadow_component.is_shadow_for;
        *is_shadow_field = Some(shadow_component.name.clone());
    }


    // Transform the names so that they don't collide with existing names
    // If it used to refer to the target, we want it to refer to the copier
    let name_transform = |name: &String| {
        if name == target_name {
            component.name.to_string()
        } else {
            format!("__cp:{}({})", name, component.name)
        }
    };

    for shadow_component in new_named_components.iter_mut() {

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


    // //We've also got to change the name of the components in the direct children
    for child in target_direct_children.iter_mut() {
        if let ComponentChild::Component(comp_name) = child {
            *comp_name = name_transform(comp_name);
        }
    }

    // log!("Copied components, {:#?}", new_named_components);

    let component = component_nodes.get_mut(component_name).unwrap();

    let mut new_children = target_direct_children;
    new_children.extend(component.children.clone());
    component.children = new_children;


    // Then add the components to the hashmap. This won't touch the the copyTargets' children field
    // because we've already added them above.
    add_component_nodes_using_parent_field(component_nodes, new_named_components);
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





fn create_all_dependencies_for_component(
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

/// Recursively searches the target (and the target's target if it has one), and finds
/// the nearest attribute to the original node, if any exist
fn fetch_attribute_on_target_if_exists<'a>(components: &'a HashMap<String, ComponentNode>, target_name: &str, attribute_name: AttributeName) -> Option<&'a Attribute> {

    let target = components.get(target_name).unwrap();
    if let Some(attribute) = target.attributes.get(attribute_name) {
        Some(attribute)

    } else if let Some(ref next_target_name) = target.copy_target {
        fetch_attribute_on_target_if_exists(components, next_target_name, attribute_name)

    } else {
        None
    }
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

            let attribute_name = attribute_instruction.attribute_name;

            let possible_attribute: Option<&Attribute> = 
            if let Some(attribute) = component.attributes.get(attribute_name) {
                Some(attribute)

            } else if let Some(ref target_name) = component.copy_target {
                fetch_attribute_on_target_if_exists(components, target_name, attribute_name)

            } else {
                None
            };


            if let Some(attribute) = possible_attribute {
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





fn dependencies_for_component<'a>(
    core: &'a DoenetCore,
    component_name: &str,
    state_var_name: StateVarName) -> Vec<&'a Dependency>
{
    core.dependencies.iter().filter(
        |dep| dep.component == component_name && dep.state_var == state_var_name
    ).collect()
}



fn resolve_unshadowing_state_variable(
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
fn resolve_state_variable(
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



fn mark_stale_state_var_and_dependencies(
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
fn handle_update_instruction<'a>(
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


fn set_state_var(
    component: &ComponentNode,
    component_state_vars: &dyn ComponentStateVars,
    name: StateVarName,
    val: StateVarValue)
-> Result<(), String> {
    let state_var = component_state_vars.get(name).expect(
        &format!("Component {} of type {} does not have state var {}",
        component.name, component.component_type, name)
    );

    state_var.set_value(val)
}





#[derive(Debug)]
pub struct Action {
    pub component_name: String,
    pub action_name: String,
    // pub action_func: fn(HashMap<String, StateVarValue>)
        // -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>>,
    pub args: HashMap<String, StateVarValue>,
}


pub fn handle_action_from_json(core: &DoenetCore, action: &str) {
    
    let action = parse_json::parse_action_from_json(action)
        .expect("Error parsing json action");

    handle_action(core, action);
}


fn handle_action<'a>(core: &'a DoenetCore, action: Action) {

    // log!("Handling action {:#?}", action);
    let component = core.component_nodes.get(&action.component_name)
        .expect(&format!("{} doesn't exist, but action {} uses it", action.component_name, action.action_name));

    let component_state = core.component_states.get(&action.component_name).unwrap();

    let state_var_resolver = | state_var_name | {
        resolve_state_variable(core, component, state_var_name)
    };

    let state_vars_to_update = component.definition.on_action(&action.action_name, action.args, &state_var_resolver);

    for (name, requested_value) in state_vars_to_update {

        let definition = component.definition.state_var_definitions().get(name).unwrap();
        let requests = definition.request_dependencies_to_update_value(requested_value);

        for request in requests {
            process_update_request(core, component, component_state, name, &request);

        }
    }

}


fn process_update_request(
    core: &DoenetCore,
    component: &ComponentNode,
    component_state: &ComponentState,
    state_var_name: StateVarName,
    update_request: &UpdateRequest) 
{

    // log!("Processing update request for {}:{}", component.name(), state_var_name);

    match update_request {
        UpdateRequest::SetEssentialValue(their_name, requested_value) => {

            match component_state {
                ComponentState::Shadowing(target_name) => {
                    let target_comp = core.component_nodes.get(target_name).unwrap();
                    let target_state = core.component_states.get(target_name).unwrap();
    
                    process_update_request(core, target_comp, target_state, state_var_name, update_request);
    
                },
                ComponentState::State(state_vars) => {
                    let essential_var = state_vars.get_essential_state_vars().get(their_name).unwrap();
                    essential_var.set_value(requested_value.clone()).expect(
                        &format!("Failed to set essential value for {}:{}", component.name, their_name)
                    );
        
                }
            }



        },

        UpdateRequest::SetStateVarDependingOnMe(their_name, requested_value) => {

            log!("desired value {:?}", requested_value);


            let state_var_definition = component.definition.state_var_definitions().get(their_name).unwrap();

            let their_update_requests = state_var_definition.request_dependencies_to_update_value(requested_value.clone());

            for their_update_request in their_update_requests {
                process_update_request(core, component, component_state, their_name, &their_update_request);
            }

        }
    }

    mark_stale_state_var_and_dependencies(core, component, component_state, state_var_name);

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


fn get_target_state_vars<'a>(core: &'a DoenetCore, target_name: &str) -> &'a dyn ComponentStateVars {
    let target_state = core.component_states.get(target_name).unwrap();
    match target_state {
        ComponentState::State(state_vars) => state_vars.as_ref(),
        ComponentState::Shadowing(next_target_name) => get_target_state_vars(core, next_target_name)
    }
}







pub fn update_renderers(core: &DoenetCore) -> String {
    let json_obj = generate_render_tree(core);
    serde_json::to_string(&json_obj).unwrap()
}


pub fn generate_render_tree(core: &DoenetCore) -> serde_json::Value {

    let root_node = core.component_nodes.get(&core.root_component_name).unwrap();
    let mut json_obj: Vec<serde_json::Value> = vec![];

    generate_render_tree_internal(core, root_node, &mut json_obj);

    serde_json::Value::Array(json_obj)
}


fn generate_render_tree_internal(core: &DoenetCore, component: &ComponentNode, json_obj: &mut Vec<serde_json::Value>) {

    let component_state = core.component_states.get(&component.name).unwrap();

    let comp_state_vars = match component_state {
        ComponentState::State(svs) => {
            svs.as_ref()
        },
        ComponentState::Shadowing(target_name) => {
            get_target_state_vars(core, target_name)
        }
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

/// List components and children in a JSON array
pub fn json_components(core: &DoenetCore) -> serde_json::Value {

    let json_components: serde_json::Map<String, serde_json::Value> = core.component_nodes
        .values()
        .map(|component| (component.name.to_string(),
                utils::package_subtree_as_json(
                    &core.component_nodes,
                    &&core.component_states,
                    component)))
        .collect();

    serde_json::Value::Object(json_components)
}
