mod utils;

extern crate web_sys;

use wasm_bindgen::prelude::*;
use serde::Serialize;
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use core::Component;
use core::ComponentChild;

use core::text::Text;
use core::number::Number;

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
                
        // log!("core recieved the string: {}", program);

        let json_deserialized: serde_json::Value = serde_json::from_str(program).unwrap();

        log!("rust json: {:#?}", json_deserialized);

        let mut components: HashMap<String, Component> = HashMap::new();
        let mut component_type_counter: HashMap<String, u32> = HashMap::new();
        add_json_subtree_to_components(&mut components, &json_deserialized, "", &mut component_type_counter);

        log!("rust components: {:#?}", components);

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

        let components: HashMap<String, Component> = HashMap::new();

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
                        value: RefCell::new("".to_string()),
                        children: RefCell::new(vec![]),
                        parent: RefCell::new(parent_name.to_string()),
                    })),
                    _ => {panic!("Unrecognized component type")}
                };

                if let Some(parent) = components.get(parent_name) {
                    parent.clone().to_component_like().add_as_child(
                        ComponentChild::Component(component.clone().to_component_like()));
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
                parent.clone().to_component_like().add_as_child(ComponentChild::String(string_value.to_string()));
            }
        },

        _ => {log!("other");},
    }
}
