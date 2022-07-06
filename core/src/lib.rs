use std::borrow::Borrow;
use std::cell::{RefCell};
use std::collections::HashMap;
use std::rc::Rc;
use std::fmt;




/*
Why we need RefCells: the Rc does not allow mutability in the
thing it wraps. If it any point we might want to mutate a field, its value should be wrapped in a RefCell
*/

// 'Object' refers to a component or string

#[macro_use]

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
    pub root_component_name: String,
}



pub trait ComponentSpecificBehavior {
    fn get_trait_names(&self) -> Vec<ObjectTraitName>;

    /// lower case name
    fn get_component_type(&self) -> &'static str;


    fn should_render_children(&self) -> bool;

    /// This function should never use self in the function body.
    /// Treat as if this is a constant.
    fn state_variable_instructions(&self) -> &phf::Map<StateVarName, StateVarVariant>;

    fn state_var(&self, name: StateVarName) -> Option<StateVarAccess>;





    fn set_state_var(&self, name: StateVarName, val: StateVarValue) {
        match self.state_var(name).unwrap() {
            StateVarAccess::String(sv) => {
                if let StateVarValue::String(string_val) = val {
                    sv.replace(string_val);
                } else {
                    unreachable!();
                }
            },
            StateVarAccess::Integer(sv) => {
                if let StateVarValue::Integer(integer_val) = val {
                    sv.replace(integer_val);
                } else {
                    unreachable!();
                }
            },
            StateVarAccess::Number(sv) => {
                if let StateVarValue::Number(number_val) = val {
                    sv.replace(number_val);
                } else {
                    unreachable!();
                }
            },
            StateVarAccess::Bool(sv) => {
                if let StateVarValue::Boolean(bool_val) = val {
                    sv.replace(bool_val);
                } else {
                    unreachable!();
                }
            }

        }
    }


    fn set_state_var_string(&self, name: StateVarName, val: String) {

        match self.state_var(name).unwrap() {
            StateVarAccess::String(sva) => { sva.replace(val); }
            _ => { unreachable!(); }
        }
    }

    fn set_state_var_integer(&self, name: StateVarName, val: i64) {

        match self.state_var(name).unwrap() {
            StateVarAccess::Integer(sva) => { sva.replace(val); }
            _ => { unreachable!(); }
        }
    }

    fn set_state_var_number(&self, name: StateVarName, val: f64) {

        match self.state_var(name).unwrap() {
            StateVarAccess::Number(sva) => { sva.replace(val); }
            _ => { unreachable!(); }
        }
    }

    fn set_state_var_bool(&self, name: StateVarName, val: bool) {

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
    fn add_one(&self) -> f64;
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
                StateVarVariant::String(def)  => (def.return_dependency_instructions)(HashMap::new()),
                StateVarVariant::Bool(def)    => (def.return_dependency_instructions)(HashMap::new()),
                StateVarVariant::Number(def)  => (def.return_dependency_instructions)(HashMap::new()),
                StateVarVariant::Integer(def) => (def.return_dependency_instructions)(HashMap::new()),
            };
            
            
            for (dep_name, dep_instruction) in dependency_instructions_hashmap.into_iter() {

                let dependency =  create_dependency_from_instruction(component, state_var_name, dep_instruction, dep_name);

                dependencies.push(dependency);
            }
        

        }

        dependencies

}


fn create_dependency_from_instruction(component: &Rc<dyn ComponentLike>, state_var: StateVarName, instruction: DependencyInstruction, instruction_name: InstructionName) -> Dependency {

    let mut dependency = Dependency {
        name: instruction_name,
        component: component.name().clone().to_owned(),
        state_var: state_var,        
        // instruction: instruction,
        variables_optional: false,

        // We will fill in these fields next
        depends_on_objects: vec![],
        depends_on_state_vars: vec![],
    };

    match instruction {

        DependencyInstruction::StateVar(state_var_instruction) => {

                dependency.depends_on_objects = if let Option::Some(name) = state_var_instruction.component_name {
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

            dependency.depends_on_objects = depends_on_children;
            dependency.depends_on_state_vars = child_instruction.desired_state_vars;

        },
        DependencyInstruction::Parent(_) => {

        },
    };

    dependency
}


pub fn resolve_state_variable(core: &DoenetCore, component: &Rc<dyn ComponentLike>, name: StateVarName) {

    let mut map: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>> = HashMap::new();


    let my_dependencies = core.dependencies.iter().filter(|dep| dep.component == component.name() && dep.state_var == name);

    for dep in my_dependencies {

        let mut values_for_this_dep: Vec<(ComponentType, StateVarName, StateVarValue)> = Vec::new();

        for depends_on in &dep.depends_on_objects {

            match depends_on {
                ObjectName::String(string) => {
                    if dep.depends_on_state_vars.contains(&"value") {
                        values_for_this_dep.push((
                            "string",
                            "value",
                            StateVarValue::String(string.to_string())
                    ));
               
                    }
                },
                ObjectName::Component(component_name) => {
                    let depends_on_component = &core.components.get(component_name).unwrap().component();
                    for state_var_name in &dep.depends_on_state_vars {

                        resolve_state_variable(core, depends_on_component, name);
                        let state_var_access = depends_on_component.state_var(name).unwrap();
                        let state_var_value = match state_var_access {
                            StateVarAccess::Bool(val) => StateVarValue::Boolean(*val.borrow()),
                            StateVarAccess::Number(val) => StateVarValue::Number(*val.borrow()),
                            StateVarAccess::Integer(val) => StateVarValue::Integer(*val.borrow()),

                            StateVarAccess::String(val) => {
                                let string_val = &*val.borrow();
                                StateVarValue::String(String::from(string_val))
                            },

                        };

                        values_for_this_dep.push((
                            core.components.get(component_name).unwrap().component().get_component_type(),
                            state_var_name,
                            state_var_value
                        ));

                    }
                }
            }
        }

        map.insert(dep.name, values_for_this_dep);
    }

    let definition = component.state_variable_instructions().get(name).unwrap();


    let new_state_var_value = match definition {

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
    };

    component.set_state_var(name, new_state_var_value);

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
