
pub mod state_variables;
pub mod state_var;
pub mod parse_json;
pub mod text;
pub mod number;
pub mod text_input;
pub mod document;

use std::{cell::RefCell};
use std::collections::HashMap;
use std::rc::Rc;
use std::fmt::Debug;

use state_variables::*;
use state_var::{StateVar, State, EssentialStateVar};

use crate::parse_json::Action;



#[derive(Debug)]
pub struct DoenetCore {
    pub components: HashMap<String, Rc<dyn ComponentLike>>,
    pub dependencies: Vec<Dependency>,
    pub root_component_name: String,
}




pub trait ComponentSpecificBehavior: Debug {

    /// This function should never use self in the body.
    fn state_variable_instructions(&self) -> &HashMap<StateVarName, StateVarVariant>;

    // fn get_state_var_access(&self, name: StateVarName) -> Option<StateVarAccess>;

    fn get_state_var(&self, name: StateVarName) -> Option<&StateVar>;

    fn get_essential_state_vars(&self) -> &HashMap<StateVarName, EssentialStateVar>;


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


    /// Lower case name.
    /// This function should never use self in the body.
    fn get_component_type(&self) -> &'static str;


    /// This function should never use self in the body.
    fn should_render_children(&self) -> bool;
    
    /// This function should never use self in the body.
    fn get_trait_names(&self) -> Vec<ObjectTraitName>;

}



fn set_state_var(
    component: &Rc<dyn ComponentLike>,
    name: StateVarName,
    val: StateVarValue)
-> Result<(), String>    
{
    let state_var = component.get_state_var(name).expect(
        &format!("Component {} of type {} does not have state var {}",
        component.name(), component.get_component_type(), name)
    );

    state_var.set_value(val)
        
}


/// Struct that derive this must have the correct fields: name, parent, and child.
pub trait ComponentLike: ComponentSpecificBehavior {
    fn name(&self) -> &str;
    fn children(&self) -> &RefCell<Vec<ComponentChild>>;
    fn parent(&self) -> &RefCell<String>;
    fn parent_name(&self) -> Option<String>;
    fn add_as_child(&self, child: ComponentChild);

}





trait TextLikeComponent: ComponentLike {
    fn text_value(&self) -> String;
}
trait NumberLikeComponent: ComponentLike {
    fn add_one(&self) -> f64;
}


#[derive(Clone, PartialEq, Debug)]
pub enum ObjectTraitName {
    TextLike,
    NumberLike,
    ComponentLike,
}




#[derive(Debug, Clone)]
pub enum ComponentChild {
    String(String),
    Component(Rc<dyn ComponentLike>),
}


pub fn create_doenet_core(json_deserialized: serde_json::Value) -> DoenetCore {

    // let components: HashMap<String, Rc<dyn ComponentLike>>;
    // let root_component_name: String;

    let possible_components_tree = parse_json::create_components_tree_from_json(&json_deserialized)
        .expect("Error parsing json for components");

    let root_component = possible_components_tree;
    let root_component_name = root_component.name().to_string();

    let mut uncreated_blocking_components: HashMap<String, Vec<DepInstructAddress>> = HashMap::new();

    // Indexed by component name / state var name
    let mut blocked_dependency_instructions: HashMap<DepInstructAddress, Vec<Block>> = HashMap::new();

    let mut components: HashMap<String, Rc<dyn ComponentLike>> = HashMap::new();

    let dependencies: Vec<Dependency> = create_all_dependencies_for_component(root_component, &mut uncreated_blocking_components, &mut components, &mut blocked_dependency_instructions);
    
    // for (_, component) in components.iter() {

    //     let dependencies_for_this_component = create_all_dependencies_for_component(&component, &mut uncreated_blocking_components, &components, &mut blocked_components);

    //     for dependency in dependencies_for_this_component {
    //         dependencies.push(dependency);
    //     }
        
    // }

    
    // let json_tree = package_subtree_as_json(components.get(&root_component_name).unwrap());
    // unsafe {
        // log_json(json_tree);
    // }



    // Return Doenet Core structure
    DoenetCore {
        components,
        dependencies,
        root_component_name
    }
}


pub fn create_all_dependencies_for_component(
    component: Rc<dyn ComponentLike>,
    uncreated_blocking_components: &mut HashMap<String, Vec<DepInstructAddress>>,
    components: &mut HashMap<String, Rc<dyn ComponentLike>>,
    blocked_dependency_instructions: &mut HashMap<DepInstructAddress, Vec<Block>>,
) -> Vec<Dependency>

{

    log!("Creating depencies for {:?}", component.name());
    let mut dependencies: Vec<Dependency> = vec![];

    // First create dependencies for all (component) children
    for child in &*component.children().borrow() {
        
        if let ComponentChild::Component(child_component) = child {
            let mut child_dependencies = create_all_dependencies_for_component(Rc::clone(child_component), uncreated_blocking_components, components, blocked_dependency_instructions);

            dependencies.append(&mut child_dependencies);

        }

    }


    // Create me
    components.insert(component.name().to_string(), Rc::clone(&component));




    // let mut will_be_unblocked_dep_instructions: Vec<(InstructionName, DependencyInstruction)> = vec![];


    if let Some(instructions_blocked_by_me) = uncreated_blocking_components.get(component.name()) {

        for instruction_address in instructions_blocked_by_me {

            // These are all the blocks on one particular dep instruct.
            // At least one of the blocks is due to me
            let blocks = blocked_dependency_instructions.get(instruction_address).unwrap();

            if blocks.len() == 1 {

                match &blocks[0] {

                    Block::UncreatedComponent(block) => {

                        // I should be the only block
                        debug_assert_eq!(
                            block.blocked_by_uncreated_component,
                            UncreatedComponentName(component.name().to_string())
                        );

                        // Resolve the dep instruct.
                        log!("Mark dep instruct {:?} to be resolved", instruction_address);

                        // will_be_unblocked_dep_instructions.push(
                        //     (block.blocked_dependency_instruction_name, block.blocked_dependency_instruction)
                        // );

                        let component_of_instruction = components.get(&instruction_address.component_name).unwrap();

                        // create_dependency_from_instruction(
                        //     component_of_instruction, instruction_address.state_var_name,
                        //     block.blocked_dependency_instruction, block.blocked_dependency_instruction_name,
                        //     uncreated_blocking_components, blocked_dependency_instructions
                        // );

                    }

                }
            } 
            
            let mut blocks = blocked_dependency_instructions.get_mut(instruction_address).unwrap();

            // Remove all the entries that said I blocked the instruction
            blocks.retain(|block| {
                match block {
                    Block::UncreatedComponent(uncreated_comp_block) => {
                        uncreated_comp_block.blocked_by_uncreated_component != UncreatedComponentName(component.name().to_string())
                    }
                }           
            });
            log!("Filtered blocks on state var, {:#?}", blocks);


            if blocks.is_empty() {
                blocked_dependency_instructions.remove(instruction_address);
            }


            log!("{} should no longer block {:?}", component.name(), instruction_address);
            log!("Blocked components: {:#?}", blocked_dependency_instructions);
        }

        uncreated_blocking_components.remove(component.name());

        // log!("Uncreated blocking components: {:#?}", uncreated_blocking_components);


    }


    let my_definitions = component.state_variable_instructions();

    for (&state_var_name, state_var_def) in my_definitions {

        // Eventually, call state_vars_to_determine_dependencies() and go calculate those values

        let dependency_instructions_hashmap = match state_var_def {
            StateVarVariant::String(def)  => (def.return_dependency_instructions)(HashMap::new()),
            StateVarVariant::Boolean(def)    => (def.return_dependency_instructions)(HashMap::new()),
            StateVarVariant::Number(def)  => (def.return_dependency_instructions)(HashMap::new()),
            StateVarVariant::Integer(def) => (def.return_dependency_instructions)(HashMap::new()),
        };
        
        
        for (dep_name, dep_instruction) in dependency_instructions_hashmap.into_iter() {

            let dependency =  create_dependency_from_instruction(&component, state_var_name, dep_instruction, dep_name, uncreated_blocking_components, blocked_dependency_instructions);


            let mut blocked = false;
            for depends_on_object in &dependency.depends_on_objects {
                if let ObjectName::Component(depends_on_component) = depends_on_object {

                    if !components.contains_key(depends_on_component) {
                        // Blocked!!
                        log!("{}:{}:{} is blocked by {}", component.name(), state_var_name, dep_name, depends_on_component);

                        blocked = true;
                    }

                }
            }

            if blocked == false {
                dependencies.push(dependency);
            }
        }
    

    }

    dependencies

}


fn create_dependency_from_instruction(

    component: &Rc<dyn ComponentLike>,
    state_var: StateVarName,
    instruction: DependencyInstruction,
    instruction_name: InstructionName,
    // Components that don't exist yet, but that state vars of created components depend on
    uncreated_blocking_components: &mut HashMap<String, Vec<DepInstructAddress>>,
    blocked_dependency_instructions: &mut HashMap<DepInstructAddress, Vec<Block>>,

    // blocking_component_state_vars: &mut HashMap<StateVarAddress, 

) -> Dependency {

    // Outside of this function, we will check to see if all these
    // component names are valid

    let depends_on_objects: Vec<ObjectName>;
    let depends_on_state_vars: Vec<StateVarName>;

    match &instruction {

        DependencyInstruction::StateVar(state_var_instruction) => {

            depends_on_objects = if let Option::Some(ref name) = state_var_instruction.component_name {
                    vec![ObjectName::Component(name.to_string())]
                } else {
                    vec![ObjectName::Component(component.name().clone().to_owned())]
                };
            depends_on_state_vars = vec![state_var_instruction.state_var];
        },

        DependencyInstruction::Child(child_instruction) => {
            let all_children = component.children().borrow();

            let mut depends_on_children: Vec<ObjectName> = vec![];
            for child in all_children.iter() {

                for desired_child_type in child_instruction.desired_children.iter() {
                    match child {
                        ComponentChild::Component(child_component) => {
                            if child_component.get_trait_names().contains(desired_child_type) {
                                // If not already in list, add it to the list
                                if !depends_on_children.contains(&ObjectName::Component(child_component.name().to_owned())) {
                                    depends_on_children.push(ObjectName::Component(child_component.name().to_owned()));
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

            let parent_name = component.parent_name().expect(&format!(
                "Component {} doesn't have a parent, but the dependency instruction {}:{} asks for one.",component.name(), state_var, instruction_name
            ));


            // let my_new_block = Block::UncreatedComponent(UncreatedComponentBlock {
            //     blocked_component: component.name().to_string(),
            //     blocked_dependency_instruction: instruction.clone(),
            //     blocked_dependency_instruction_name: instruction_name,
            //     blocked_by_uncreated_component: UncreatedComponentName(parent_name.to_string()),
            // });

            // log!("Block on {} by {}", component.name(), parent_name);
            // // log!("{:#?}", my_new_block);

            // let instruction_address = DepInstructAddress {
            //     component_name: component.name().to_string(),
            //     state_var_name: state_var,
            //     instruction_name: instruction_name,
            // };

            // // Add this block to the blocked dep instructs map
            // if let Some(existing_blocks) = blocked_dependency_instructions.get_mut(&instruction_address) {

            //     existing_blocks.push(my_new_block);

            // } else {
            //     blocked_dependency_instructions.insert(
            //         instruction_address.clone(), 
            //         vec![my_new_block]
            //     );
            // }


            // // Add that this block was caused by parent component
            // if let Some(parent_already_blocking) = uncreated_blocking_components.get_mut(&parent_name) {
            //     parent_already_blocking.push(instruction_address);
            // } else {
            //     uncreated_blocking_components.insert(
            //         parent_name.to_string(),
            //         vec![instruction_address]
            //     );
            // }


            // log!("Updated block book-keeping");
            // log!("Blocked instructions: {:#?}", blocked_dependency_instructions);
            // log!("Uncreated blocking components: {:#?}", uncreated_blocking_components);


            // Note that here we're referring to the parent even though it doesn't exist yet
            depends_on_objects = vec![ObjectName::Component(parent_name)];
            depends_on_state_vars = vec![parent_instruction.state_var];

        },
    };

    Dependency {
        name: instruction_name,
        component: component.name().clone().to_owned(),
        state_var,
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








/// Ensure a state variable is not stale and can be safely unwrapped.
pub fn resolve_state_variable(core: &DoenetCore, component: &Rc<dyn ComponentLike>, state_var_name: StateVarName) {

    // log!("Resolving state variable {}:{}", component.name(), state_var_name);

    let mut dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>> = HashMap::new();

    let my_dependencies = dependencies_for_component(core, component.name(), state_var_name);


    for dep in my_dependencies {

        let mut values_for_this_dep: Vec<(ComponentType, StateVarName, StateVarValue)> = Vec::new();

        for depends_on in &dep.depends_on_objects {

            match depends_on {
                ObjectName::String(string) => {

                    // Right now, the only thing you can get from a string is its faked 'value' state var
                    if dep.depends_on_state_vars.contains(&"value") {
                        values_for_this_dep.push((
                            "string",
                            "value",
                            StateVarValue::String(string.to_string())
                    ));
               
                    }
                },
                ObjectName::Component(component_name) => {

                    let depends_on_component = &core.components.get(component_name).unwrap();
                    for &dep_state_var_name in &dep.depends_on_state_vars {

                        // log!("About to recurse and resolve {}:{}", depends_on_component.name(), dep_state_var_name);

                        resolve_state_variable(core, depends_on_component, dep_state_var_name);
                        let state_var = depends_on_component.get_state_var(dep_state_var_name).unwrap();
                        let state_var_value = state_var.get_state();


                        if let State::Resolved(state_var_value) = state_var_value {
                            values_for_this_dep.push((
                                core.components.get(component_name).unwrap().get_component_type(),
                                dep_state_var_name,
                                state_var_value
                            ));
    
                        } else {
                            panic!("Tried to access stale state var {}:{} (component type {})", depends_on_component.name(), dep_state_var_name, depends_on_component.get_component_type());
                        }

                    }
                }
            }
        }

        // log!("dep name {}", dep.name);
        dependency_values.insert(dep.name, values_for_this_dep);
    }

    let definition = component.state_variable_instructions().get(state_var_name).unwrap();

    let update_instruction = definition.determine_state_var_from_dependencies(dependency_values);
    
    handle_update_instruction(component, state_var_name, update_instruction);

    // log!("{}:{} resolved", component.name(), state_var_name);
    // log!("{:?}", component);
    
}



pub fn mark_stale_state_var_and_dependencies(
    core: &DoenetCore,
    component: &Rc<dyn ComponentLike>,
    state_var_name: StateVarName)
{

    // log!("Marking stale {}:{}", component.name(), state_var_name);

    let state_var = component.get_state_var(state_var_name).unwrap();
    state_var.mark_stale();

    let my_dependencies = dependencies_for_component(core, component.name(), state_var_name);
    for dependency in my_dependencies {

        for depends_on in &dependency.depends_on_objects {
            match depends_on {
                ObjectName::String(_) => {
                    // do nothing
                },
                ObjectName::Component(dep_comp_name) => {
                    let dep_component = core.components.get(dep_comp_name).unwrap();

                    for &dep_state_var_name in &dependency.depends_on_state_vars {

                        mark_stale_state_var_and_dependencies(core, dep_component, dep_state_var_name);
                    }
                }
            }
        }
    }

}

pub fn handle_update_instruction(
    component: &Rc<dyn ComponentLike>,
    name: StateVarName,
    instruction: StateVarUpdateInstruction<StateVarValue>)
{
    let definition = component.state_variable_instructions().get(name).unwrap();
    match instruction {
        StateVarUpdateInstruction::NoChange => {
            let current_value = component.get_state_var(name).unwrap().get_state();

            if let State::Resolved(_) = current_value {
                // Do nothing. It's resolved, so we can use it as is
            } else {
                panic!("Cannot use NoChange update instruction on a stale value");
            }

        },
        StateVarUpdateInstruction::UseEssentialOrDefault => {
            if definition.has_essential() == false {
                panic!(
                    "Cannot UseEssentialOrDefault on {}:{},
                    which has no essential (Component type {}) ",
                    component.name(), name, component.get_component_type()
                );
            }

            let possible_essential_val = component.get_essential_state_vars().get(name).unwrap().get_value();
            let new_state_var_value = if let Some(actual_val) = possible_essential_val {
                actual_val
            } else {
                definition.default_value()
            };
            

            set_state_var(component, name, new_state_var_value).expect(
                &format!("Failed to set {}:{}", component.name(), name)
            );

        },
        StateVarUpdateInstruction::SetValue(new_value) => {

            let new_state_var_value = new_value;
            set_state_var(component, name, new_state_var_value).expect(
                &format!("Failed to set {}:{}", component.name(), name)
            );
        }

    };
}




pub fn handle_action_from_json(core: &DoenetCore, action_obj: serde_json::Value) {
    
    let action = parse_json::parse_action_from_json(action_obj)
        .expect("Error parsing json action");

    handle_action(core, action);
}


// This should be private eventually
pub fn handle_action<'a>(core: &'a DoenetCore, action: Action) {

    // log!("Handling action {:#?}", action);
    let component = core.components.get(&action.component_name)
        .expect(&format!("Can't handle action on {} which doesn't exist", action.component_name));

    let state_var_resolver = | state_var_name | {
        resolve_state_variable(core, component, state_var_name);
        component.get_state_var(state_var_name).unwrap().copy_value_if_resolved().unwrap()
    };

    let state_vars_to_update = component.on_action(&action.action_name, action.args, &state_var_resolver);

    for (name, requested_value) in state_vars_to_update {

        let definition = component.state_variable_instructions().get(name).unwrap();
        let requests = definition.request_dependencies_to_update_value(requested_value);

        for request in requests {
            process_update_request(core, &component, name, request);

        }
    }

}


pub fn process_update_request(
    core: &DoenetCore,
    component: &Rc<dyn ComponentLike>,
    state_var_name: StateVarName,
    update_request: UpdateRequest) 
{

    // log!("Processing update request for {}:{}", component.name(), state_var_name);

    match update_request {
        UpdateRequest::SetEssentialValue(their_name, requested_value) => {

            let essential_var = component.get_essential_state_vars().get(their_name).unwrap();
            essential_var.set_value(requested_value).expect(
                &format!("Failed to set essential value for {}:{}", component.name(), their_name)
            );
        },

        UpdateRequest::SetStateVarDependingOnMe(their_name, requested_value) => {

            log!("desired value {:?}", requested_value);


            let state_var_definition = component.state_variable_instructions().get(their_name).unwrap();

            let their_update_requests = state_var_definition.request_dependencies_to_update_value(requested_value);

            for their_update_request in their_update_requests {
                process_update_request(core, component, their_name, their_update_request);
            }

        }
    }

    mark_stale_state_var_and_dependencies(core, component, state_var_name);


}







pub fn update_renderers(core: &DoenetCore) -> serde_json::Value {
    let json_obj = generate_render_tree(core);
    json_obj
}


pub fn generate_render_tree(core: &DoenetCore) -> serde_json::Value {

    let root_node = core.components.get(&core.root_component_name).unwrap();
    let mut json_obj: Vec<serde_json::Value> = vec![];

    generate_render_tree_internal(core, &root_node, &mut json_obj);

    serde_json::json!(json_obj)
}


fn generate_render_tree_internal(core: &DoenetCore, component: &Rc<dyn ComponentLike>, json_obj: &mut Vec<serde_json::Value>) {

    use serde_json::Value;
    use serde_json::json;

    let state_vars = component.state_variable_instructions();

    let renderered_state_vars = state_vars.into_iter().filter(|kv| match kv.1 {
        StateVarVariant::Integer(sv) => sv.for_renderer,
        StateVarVariant::Number(sv) => sv.for_renderer,
        StateVarVariant::String(sv) => sv.for_renderer,
        StateVarVariant::Boolean(sv) => sv.for_renderer,
    });

    let mut state_values = serde_json::Map::new();
    for (name, _variant) in renderered_state_vars {

        resolve_state_variable(core, component, name);

        let state_var_value = component.get_state_var(name).unwrap().copy_value_if_resolved();

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


    let children_instructions = if component.should_render_children() {
        let children = component.children().borrow();
        children.iter().map(|child| match child {
            ComponentChild::Component(comp) => {
                // recurse for children
                generate_render_tree_internal(core, comp, json_obj);

                let mut child_actions = serde_json::Map::new();
                for action_name in comp.action_names() {
                    child_actions.insert(action_name.to_string(), json!({
                        "actionName": action_name,
                        "componentName": comp.name(),
                    }));
                }

                json!({
                    "actions": child_actions,
                    "componentName": comp.name().to_string(),
                    "componentType": comp.get_component_type().to_string(),
                    "effectiveName": comp.name().to_string(),
                    "rendererType": comp.get_component_type().to_string(),
                })},
            ComponentChild::String(string) => {
                json!(string)
            },
        }).collect()
    } else {
        vec![]
    };

    json_obj.push(json!({
        "componentName": component.name(),
        "stateValues": Value::Object(state_values),
        "childrenInstructions": json!(children_instructions),
    }));

}




pub fn package_subtree_as_json(component: &Rc<dyn ComponentLike>) -> serde_json::Value {

    use serde_json::Value;
    use serde_json::json;

    let mut children: Vec<Value> = vec![];

    let children_normal_ref = &*component.children().borrow();
    for child in children_normal_ref {

        let child_json = match child {
            ComponentChild::Component(comp_child) => package_subtree_as_json(comp_child),
            ComponentChild::String(str) => Value::String(str.to_string()),
        };
        children.push(child_json);
    }


    // let mut my_json_props: serde_json::Map<String, Value> = serde_json::Map::new();

    // my_json_props.insert("name".into(), json!(component.name()));
    // my_json_props.insert("parent".into(), json!(*component.parent().borrow()));
    // my_json_props.insert("children".into(), Value::Array(children));  
    
    let mut my_json_props: serde_json::Map<String, Value> = serde_json::Map::new();

    my_json_props.insert("children".to_string(), Value::Array(children));
    my_json_props.insert("parent".to_string(), Value::String(component.parent_name().unwrap_or_default()));
    my_json_props.insert("type".to_string(), Value::String(component.get_component_type().to_string()));


    for &state_var_name in component.state_variable_instructions().keys() {
        let state_var = component.get_state_var(state_var_name).unwrap();

        my_json_props.insert(

            format!("sv: {}", state_var_name),

            match state_var.get_state() {
                State::Resolved(value) => match value {
                    StateVarValue::String(v) => json!(v),
                    StateVarValue::Number(v) => json!(v),
                    StateVarValue::Integer(v) => json!(v),
                    StateVarValue::Boolean(v) => json!(v),
                },
                State::Stale => Value::Null,
            }
        );

    }

    for (esv_name, essential_state_var) in component.get_essential_state_vars() {

        my_json_props.insert(

            format!("essen: {}", esv_name),

            match essential_state_var.get_value() {
                Some(value) => match value {
                    StateVarValue::String(v) => json!(v),
                    StateVarValue::Number(v) => json!(v),
                    StateVarValue::Integer(v) => json!(v),
                    StateVarValue::Boolean(v) => json!(v),
                },
                None => Value::Null,
            }
        );

    }

    Value::Object(my_json_props)

}



impl DoenetCore {
    pub fn json_components(&self) -> serde_json::Value {

        let mut json_components = serde_json::Map::new();
    
        for component in self.components.values() {
            json_components.insert(
                component.name().to_string(),
                package_subtree_as_json(component)
            );
        }
    
    
        serde_json::Value::Object(json_components)
    }
}

