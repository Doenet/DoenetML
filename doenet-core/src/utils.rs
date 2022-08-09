use std::collections::HashMap;

use crate::DependencyKey;
use crate::StateForStateVar;
use crate::Dependency;
use crate::component::*;
use crate::state::State;
use crate::state_variables::StateVarName;
use crate::state_variables::StateVarSlice;

use serde_json::{Value, Map, json};



/// Macros for logging.
macro_rules! log {
    ( $( $t:tt )* ) => {

        #[cfg(feature = "web")]
        web_sys::console::log_1(&format!( $( $t )* ).into());

        #[cfg(not(feature = "web"))]
        println!( $( $t )* )
    }
}
macro_rules! log_json {
    ( $label:expr, $a:expr ) => {

        #[cfg(feature = "web")]
        web_sys::console::log_2(&$label.into(), &wasm_bindgen::JsValue::from_serde(&$a).unwrap());
    }
}
macro_rules! log_debug {
    ( $( $t:tt )* ) => {

        #[cfg(feature = "web")]
        web_sys::console::debug_1(&format!( $( $t )* ).into());

        #[cfg(not(feature = "web"))]
        println!( $( $t )* )
    }
}

pub(crate) use log;
pub(crate) use log_json;
pub(crate) use log_debug;



/// List components and children in a JSON array
pub fn json_components(
    components: &HashMap<ComponentName, ComponentNode>,
    component_states: &HashMap<ComponentName, HashMap<StateVarName, StateForStateVar>>
) -> Value {

    let json_components: Map<String, Value> = components
        .values()
        .map(|component| (component.name.to_string(),
                package_subtree_as_json(
                    &components,
                    &&component_states,
                    component)))
        .collect();

    Value::Object(json_components)
}


pub fn package_subtree_as_json(
    components: &HashMap<ComponentName, ComponentNode>,
    component_states: &HashMap<ComponentName, HashMap<StateVarName, StateForStateVar>>,
    component: &ComponentNode
) -> Value {


    let children: Map<String, Value> = component.children.iter()
        .enumerate()
        .map(|(child_num, child)| 
             match child {
                 ComponentChild::Component(comp_child_name) => {
                     let comp_child = components.get(comp_child_name).unwrap();
                     (format!("{} {}", child_num, comp_child_name),
                     package_subtree_as_json(components, component_states, comp_child))
                 },
                 ComponentChild::String(str) => {
                     (format!("{}", child_num), Value::String(str.to_string()))
                 }
             }
        )
        .collect();


    let mut my_json_props: Map<String, Value> = Map::new();

    my_json_props.insert("children".to_owned(), json!(children));
    my_json_props.insert("parent".to_owned(),
        match component.parent {
            Some(ref parent_name) => Value::String(parent_name.into()),
            None => Value::Null,
        });
    my_json_props.insert("type".to_owned(), Value::String(component.component_type.to_string()));
    my_json_props.insert("copySource".to_owned(),
        match &component.copy_source {
            Some(CopySource::Component(copy_source_name)) => Value::String(copy_source_name.to_string()),
            Some(CopySource::StateVar(source_name, source_state_var)) => Value::String(
                format!("{} {:?}", source_name, source_state_var)
            ),
            None => Value::Null,
        });

    let component_state = component_states.get(&component.name).unwrap();

    for &state_var_name in component.definition.state_var_definitions.keys() {

        let state_for_state_var = component_state.get(state_var_name).unwrap();

        match state_for_state_var {

            StateForStateVar::Single(state_var) => {
                my_json_props.insert(

                    format!("sv: {}", state_var_name),
        
                    match state_var.get_state() {
                        State::Resolved(value) => value.into(),
                        State::Stale => Value::Null,
                    }
                );
            },


            StateForStateVar::Array { size, elements } => {
                my_json_props.insert(

                    format!("sv: {} size", state_var_name),
        
                    match size.get_state() {
                        State::Resolved(value) => value.into(),
                        State::Stale => Value::Null,
                    }
                );

                for (id, element) in elements.borrow().iter().enumerate() {
                    my_json_props.insert(

                        format!("sv: {} element {}", state_var_name, id),
            
                        match element.get_state() {
                            State::Resolved(value) => value.into(),
                            State::Stale => Value::Null,
                        }
                    );
                }
            }

        }
    }

    Value::Object(my_json_props)
}




// pub fn json_dependencies(
//     dependencies: &HashMap<DependencyKey, Vec<Dependency>>,
// ) -> HashMap<String, Vec<Dependency>> {

//     dependencies
//         .iter()
//         .map(|(k, deps)| {
//             (format!("{:?}", k), deps.clone())
//         })
//         .collect()
// }


pub fn json_dependencies(
    dependencies: &HashMap<DependencyKey, Vec<Dependency>>,
) -> HashMap<String, HashMap<String,Vec<Dependency>>> {

    let mut display_deps = HashMap::new();


    for (key, deps) in dependencies {
        let display_key = match key {
            DependencyKey::StateVar(_, StateVarSlice::Single(single), instruct) => {
                format!("{} {}", single, instruct)
            },
            DependencyKey::StateVar(_, StateVarSlice::Array(array), instruct) => {
                format!("{} {}", array, instruct)
            }
        };

        display_deps.entry(key.component_name().to_string()).or_insert(HashMap::new())
            .entry(display_key).or_insert(deps.clone());

    }

    display_deps
}