mod utils;

extern crate web_sys;

use wasm_bindgen::prelude::*;
use serde::Serialize;
use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

use core::Component;
use core::text::{Text, TextValue};
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

// Render Tree Component
#[derive(Serialize, Debug)]
enum RTC {
    String(String),
    Array(Vec<RTC>),
    Object(HashMap<String, RTC>),
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

        log!("test log");
        log!("rust json: {:#?}", json_deserialized);

        let mut components: HashMap<String, Component> = HashMap::new();
        add_json_subtree_to_components(&mut components, json_deserialized, "");

        // let render_tree_base: RTC = RTC::Array(Vec::from([
        //     RTC::String(String::from("Duckling")),
        //     RTC::String(String::from("Quack")),
        //     RTC::Object(HashMap::from([
        //         (String::from("Mercury"), RTC::String(String::from("0.4"))),
        //         (String::from("Earth"), RTC::Array(Vec::from([
        //             RTC::String(String::from("1.0")),
        //             RTC::String(String::from("3.0")),
        //             RTC::String(String::from("5.0")),
        //         ]))),
        //         (String::from("Mars"), RTC::String(String::from("1.5"))),
        //     ])),
        // ]));

        // log!("rust deserialized: {:?}", json_deserialized);
        // log!("render_tree: {:?}", &render_tree_base);

        // DoenetCore {
        //     render_tree_base,
        // }

        let components: HashMap<String, Component> = HashMap::new();

        DoenetCore {
            components
        }
    }
}

fn add_json_subtree_to_components(components: &mut HashMap<String, Component>, json_obj: serde_json::Value, parent_name: &str) {

    match json_obj {
        serde_json::Value::Object(map) => {

            let value = map.get("componentType").unwrap();
            if let Value::String(component_type) = value {

                let component = match component_type.as_str() {
                    "text" => Component::Text( Rc::new(Text{
                        name: "unnamed text object".to_string(),
                        value: TextValue("".to_string()),
                        children: RefCell::new(vec![]),
                        parent: RefCell::new(parent_name.to_string()),
                    })),
                    _ => {panic!("Unrecognized component type")}
                };
                components.insert(component.name(), component);
                

            } else {
                panic!("componentType is not a string");
            }

        },
        _ => {},
    }
}
