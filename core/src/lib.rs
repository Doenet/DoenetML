
#![allow(dead_code)] 
#![allow(unused_variables)] 

use std::cell::{RefCell};
use std::collections::HashMap;
use std::rc::Rc;
use std::fmt;


/*
Why we need RefCells: the Rc does not allow mutability in the
thing it wraps. If it any point we might want to mutate a field, its value should be wrapped in a RefCell
*/

// 'Object' refers to a component or string

pub mod state_variable_setup;
pub mod text;
pub mod number;



use text::{Text};

use number::Number;

use state_variable_setup::*;


#[derive(Debug)]
pub struct DoenetCore {
    pub components: HashMap<String, Component>,
    pub dependencies: Vec<Dependency>,
}



pub trait ComponentSpecificBehavior {
    fn get_trait_names(&self) -> Vec<ObjectTraitName>;

    /// Capitalize names, eg, Text.
    fn get_component_type(&self) -> &'static str;

    /// This function should never use self in the function body.
    /// Treat as if this is a constant.
    fn state_variable_instructions(&self) -> &phf::Map<&'static str, StateVarVariant>;

    fn state_var(&self, name: &'static str) -> Option<StateVarAccess>;


    fn set_state_var_string(&self, name: &'static str, val: String) {

        match self.state_var(name).unwrap() {
            StateVarAccess::String(sva) => { sva.replace(val); }
            _ => { unreachable!(); }
        }
    }

    fn set_state_var_integer(&self, name: &'static str, val: i64) {

        match self.state_var(name).unwrap() {
            StateVarAccess::Integer(sva) => { sva.replace(val); }
            _ => { unreachable!(); }
        }
    }

    fn set_state_var_number(&self, name: &'static str, val: f64) {

        match self.state_var(name).unwrap() {
            StateVarAccess::Number(sva) => { sva.replace(val); }
            _ => { unreachable!(); }
        }
    }

    fn set_state_var_bool(&self, name: &'static str, val: bool) {

        match self.state_var(name).unwrap() {
            StateVarAccess::Bool(sva) => { sva.replace(val); }
            _ => { unreachable!(); }
        }
    }
    
}


pub enum StateVarAccess<'a> {
    String(&'a StateVar<String>),
    Number(&'a StateVar<f64>),
    Integer(&'a StateVar<i64>),
    Bool(&'a StateVar<bool>),
}


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
    fn add_one(&self) -> i64;
}


#[derive(Clone, PartialEq, Debug)]
pub enum ObjectTraitName {
    TextLike,
    NumberLike,
    ComponentLike,
}



#[derive(Debug, Clone)]
pub enum Component {
    Text(Rc<Text>),
    Number(Rc<Number>),
}



impl Component {

    pub fn component(&self) -> Rc<dyn ComponentLike> {
        match self {
            Component::Text(comp) => Rc::clone(comp) as Rc<dyn ComponentLike>,
            Component::Number(comp) => Rc::clone(comp) as Rc<dyn ComponentLike>,
        }
    }
}


#[derive(Debug, Clone)]
pub enum ComponentChild {
    String(String),
    Component(Rc<dyn ComponentLike>),
}




pub fn create_all_dependencies_for_component(component: &Rc<dyn ComponentLike>) -> Vec<Dependency> {
        
        let mut dependencies: Vec<Dependency> = vec![];

        let my_definitions = component.state_variable_instructions();

        for (&state_var_name, state_var_def) in my_definitions.entries() {

            // Eventually, call state_vars_to_determine_dependencies() and go calculate those values

            let dependency_instructions_hashmap = match state_var_def {
                StateVarVariant::String(def)  => (def.return_dependency_instructions)(StateVarValuesMap::new()),
                StateVarVariant::Bool(def)    => (def.return_dependency_instructions)(StateVarValuesMap::new()),
                StateVarVariant::Number(def)  => (def.return_dependency_instructions)(StateVarValuesMap::new()),
                StateVarVariant::Integer(def) => (def.return_dependency_instructions)(StateVarValuesMap::new()),
            };
            
            
            for (_, dep_instruction) in dependency_instructions_hashmap.into_iter() {

                let dependency =  create_dependency_from_instruction(component, state_var_name, dep_instruction);

                dependencies.push(dependency);
            }
        

        }

        dependencies

}


fn create_dependency_from_instruction(component: &Rc<dyn ComponentLike>, state_var: &'static str, instruction: DependencyInstruction) -> Dependency {

    let mut dependency = Dependency {
        component: component.name().clone().to_owned(),
        state_var: state_var,        
        // instruction: instruction,
        variables_optional: false,

        // We will fill in these fields next
        depends_on_components_and_strings: vec![],
        depends_on_state_vars: vec![],
    };

    match instruction {

        DependencyInstruction::StateVarVariant(state_var_instruction) => {

                dependency.depends_on_components_and_strings = if let Option::Some(name) = state_var_instruction.component_name {
                    vec![ObjectName::Component(name)]
                } else {
                    vec![ObjectName::Component(component.name().clone().to_owned())]
                };
            dependency.depends_on_state_vars = vec![state_var_instruction.state_var];
        },

        DependencyInstruction::Child(child_instruction) => {
            let all_children = component.children().borrow();

            let mut depends_on_children: Vec<ObjectName> = vec![];
            for child in all_children.iter() {

                for desired_child_type in child_instruction.desired_children.iter() {
                    match child {
                        ComponentChild::Component(child_component) => {
                            if child_component.get_trait_names().contains(desired_child_type) {
                                //If not already in list, add it to the list
                                if !depends_on_children.contains(&ObjectName::Component(child_component.name().to_owned())) {
                                    depends_on_children.push(ObjectName::Component(child_component.name().to_owned()));
                                }
                            }
                        },

                        ComponentChild::String(string_value) => {
                            if desired_child_type == &ObjectTraitName::TextLike {
                                
                                //or do nothing here?
                                depends_on_children.push(ObjectName::String(string_value.to_owned()));

                            }
                        },
                    }

                }
            }

            dependency.depends_on_components_and_strings = depends_on_children;
            dependency.depends_on_state_vars = child_instruction.desired_state_vars;

        },
        DependencyInstruction::Parent(_) => {

        },
    };

    dependency
}





pub fn resolve_state_variable(core: &DoenetCore, component: &Rc<dyn ComponentLike>, name: &'static str) -> StateVarValue {

    let mut map: HashMap<StateVarAddress, StateVarValue> = HashMap::new();

    let my_dependencies = core.dependencies.iter().filter(|dep| dep.component == component.name() && dep.state_var == name);

    for dep in my_dependencies {

        for depends_on in &dep.depends_on_components_and_strings {
            match depends_on {
                ObjectName::String(string) => {
                    if dep.depends_on_state_vars.contains(&"value") {

                        map.insert(
                            // TODO: what to call the state var address of a string
                            StateVarAddress::new("string".to_owned(), "value"),

                            StateVarValue::String(string.to_string())
                        );
               
                    }
                },
                ObjectName::Component(component_name) => {
                    let depends_on_component = &core.components.get(component_name).unwrap().component();
                    for state_var_name in &dep.depends_on_state_vars {
                        let state_var_value = resolve_state_variable(core, depends_on_component, name);

                        map.insert(
                            StateVarAddress::new(component_name.clone(), state_var_name),
                            state_var_value
                        );
                    }
                }
            }
        }
    }

    let definition = component.state_variable_instructions().get(name).unwrap();

    match definition {
        StateVarVariant::String(def) => {
            let update_instruction = (def.determine_state_var_from_dependencies)(map);
            match update_instruction {
                StateVarUpdateInstruction::NoChange => {
                    StateVarValue::String("no change".to_owned())
                },
                StateVarUpdateInstruction::UseDefault => {
                    StateVarValue::String("string default".to_owned())
                },
                StateVarUpdateInstruction::SetValue(v) => {
                    StateVarValue::String(v)
                }
            }
        },
        StateVarVariant::Integer(def) => {
            let update_instruction = (def.determine_state_var_from_dependencies)(map);
            match update_instruction {
                StateVarUpdateInstruction::NoChange => {
                    StateVarValue::Integer(0)
                },
                StateVarUpdateInstruction::UseDefault => {
                    StateVarValue::Integer(0)
                },
                StateVarUpdateInstruction::SetValue(v) => {
                    StateVarValue::Integer(v)
                }
            }
        },
        StateVarVariant::Number(def) => {
            let update_instruction = (def.determine_state_var_from_dependencies)(map);
            match update_instruction {
                StateVarUpdateInstruction::NoChange => {
                    StateVarValue::Number(0.0)
                },
                StateVarUpdateInstruction::UseDefault => {
                    StateVarValue::Number(0.0)
                },
                StateVarUpdateInstruction::SetValue(v) => {
                    StateVarValue::Number(v)
                }
            }
        }
        StateVarVariant::Bool(def) => {
            let update_instruction = (def.determine_state_var_from_dependencies)(map);
            match update_instruction {
                StateVarUpdateInstruction::NoChange => {
                    StateVarValue::Boolean(false)
                },
                StateVarUpdateInstruction::UseDefault => {
                    StateVarValue::Boolean(false)
                },
                StateVarUpdateInstruction::SetValue(v) => {
                    StateVarValue::Boolean(v)
                }
            }
        },
    }

}





// Implement Debug for trait objects.
impl fmt::Debug for dyn ComponentLike {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.name())
    }
}
impl fmt::Debug for dyn TextLikeComponent {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let debug_text = format!("{}:{}", self.name(), self.text_value());
        f.write_str(&debug_text)
    }
}
impl fmt::Debug for dyn NumberLikeComponent {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.name())
    }
}


#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use super::*;
    


    #[test]
    fn test_core() {

        //Setup Tree
        let mut components: HashMap<String, Component> = HashMap::new();

        let text2 = Rc::new(Text {
            name: "text2".to_owned(),
            value: RefCell::new("hi there".to_owned()),
            hide: RefCell::new(false),
            parent: RefCell::new(String::new()),
            children: RefCell::new(vec![]),
        });
        components.insert(text2.name(), Component::Text(Rc::clone(&text2)));


        let text1 = Rc::new(Text {
            name: "text1".to_owned(),
            value: RefCell::new("banana".to_owned()),
            hide: RefCell::new(false),
            parent: RefCell::new(String::new()),
            children: RefCell::new(vec![]),
        });
        components.insert(text1.name(), Component::Text(Rc::clone(&text1)));


        text1.add_as_child(ComponentChild::Component(text2));


        //Create dependencies
        let dependencies = create_all_dependencies_for_component(& (text1 as Rc<dyn ComponentLike>) );

        println!("Components\n{:#?}", components);
        println!("Dependencies\n{:#?}", dependencies);

        assert!(true);


    }


}
