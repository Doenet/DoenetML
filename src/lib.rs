mod utils;

extern crate web_sys;

use wasm_bindgen::prelude::*;
use serde::Serialize;

use core::create_all_dependencies_for_component;
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use core::Component;
use core::ComponentChild;

use core::text::Text;
use core::number::Number;

use core::state_variable_setup::{StateVar, Dependency};

use serde_json::Value;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// A macro to provide println! style syntax for console.log logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}


#[wasm_bindgen]
#[derive(Debug)]
pub struct DoenetCore {
    components: HashMap<String, Component>,
}


#[wasm_bindgen]
impl DoenetCore {
    pub fn new(program: &str) -> DoenetCore {

        utils::set_panic_hook();
                
        // log!("core recieved the string: {}", program);

        let json_deserialized: serde_json::Value = serde_json::from_str(program).unwrap();

        log!("rust json: {:#?}", json_deserialized);

        let mut components: HashMap<String, Component> = HashMap::new();
        let mut component_type_counter: HashMap<String, u32> = HashMap::new();
        add_json_subtree_to_components(&mut components, &json_deserialized, "", &mut component_type_counter);

        let mut dependencies: Vec<Dependency> = vec![];
        
        for (component_name, component) in components.iter() {

            let comp = component.component();
            let dependencies_for_this_component = create_all_dependencies_for_component(&comp);

            for dependency in dependencies_for_this_component {
                dependencies.push(dependency);
            }
            
        }



        for (component_name, component_variant) in components.iter() {

            let component = component_variant.component();

            for (state_var_name, state_var) in component.state_variable_instructions().entries() {

                match state_var {
                    StateVar::String(def) => {

                        component.set_state_var_string(state_var_name, format!("I am string for the state var '{}' of component {}", state_var_name, component_name));

                    }
                    StateVar::Bool(def) => {
                        component.set_state_var_bool(state_var_name, true);
                    }

                    StateVar::Integer(def) => {
                        component.set_state_var_integer(state_var_name, 49);

                    }
                    StateVar::Number(def) => {
                        component.set_state_var_number(state_var_name, 123.456);

                    }
                }

            }
        
        }


        log!("Components: {:#?}", components);
        log!("Dependencies\n{:#?}", dependencies);

        


        //Reference counter testing

        // for (component_name, component) in components.iter() {
        //     if let Component::Text(text) = component {
        //         log!("{} has {} references right now", component_name, Rc::strong_count(&text));
        //     }
        // }
        // for (component_name, component) in components.iter() {
        //     if let Component::Text(text) = component {
        //         let children = text.children.borrow();
        //         for child in children.iter() {
        //             if let ComponentChild::Component(child_comp) = child {
        //                 log!("{}'s child {} has {} references right now",
        //                 component_name, child_comp.name(), Rc::strong_count(&child_comp));
        //             }
        //         }
        //     }
        // }


        DoenetCore {
            components
        }
        
    }
}

fn add_json_subtree_to_components(components: &mut HashMap<String, Component>, json_obj: &serde_json::Value, parent_name: &str, component_type_counter: &mut HashMap<String, u32>) {

    match json_obj {
        serde_json::Value::Array(value_vec) => {
            log!("array");
            for value in value_vec.iter() {
                add_json_subtree_to_components(components, value, parent_name, component_type_counter);
            }
        },

        serde_json::Value::Object(map) => {
            log!("object");
            let component_type_value = map.get("componentType").unwrap();

            if let Value::String(component_type) = component_type_value {


                let count = *component_type_counter.get(component_type).unwrap_or(&0);
                component_type_counter.insert(component_type.to_string(), count + 1);
                let mut component_name =  format!("/_{}{}", component_type, count + 1);

                let props_value = map.get("props").unwrap();
                if let Value::Object(props_map) = props_value {
                    if let Some(name_value) = props_map.get("name") {
                        if let Value::String(name) = name_value {
                            component_name = name.to_string();
                        }
                    }


                }


                let component = match component_type.as_str() {
                    "text" => Component::Text( Rc::new(Text{
                        name: component_name.clone(),
                        hide: RefCell::new(false),
                        value: RefCell::new("".to_owned()),
                        children: RefCell::new(vec![]),
                        parent: RefCell::new(parent_name.to_string()),
                    })),
                    _ => {panic!("Unrecognized component type")}
                };

                if let Some(parent) = components.get(parent_name) {
                    parent.clone().component().add_as_child(
                        ComponentChild::Component(component.clone().component()));
                }

        


                let children_value = map.get("children").unwrap();

                components.insert(component_name.clone(), component);
                add_json_subtree_to_components(components, children_value, &component_name, component_type_counter);

            } else {
                panic!("componentType is not a string");
            }




        },

        Value::String(string_value) => {
            if let Some(parent) = components.get(parent_name) {
                parent.clone().component().add_as_child(ComponentChild::String(string_value.to_string()));
            }
        },

        _ => {log!("other");},
    }
}
