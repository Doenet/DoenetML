use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;
use std::fmt;

#[macro_use]

pub mod state_variable_setup;
pub mod text;
pub mod number;
pub mod text_input;

use phf::phf_map;
use state_variable_setup::*;
use text::Text;
use number::Number;



#[derive(Debug)]
pub struct DoenetCore {
    pub components: HashMap<String, Component>,
    pub dependencies: Vec<Dependency>,
    pub root_component_name: String,
}



pub trait ComponentSpecificBehavior {

    /// This function should never use self in the body.
    fn state_variable_instructions(&self) -> &phf::Map<StateVarName, StateVarVariant>;

    fn state_var(&self, name: StateVarName) -> Option<StateVarAccess>;


    fn actions(&self) -> &phf::Map<&'static str, fn(HashMap<String, StateVarValue>) -> HashMap<StateVarName, StateVarUpdateInstruction<StateVarValue>>> {
        &phf_map! {}
    }




    /// Lower case name.
    /// This function should never use self in the body.
    fn get_component_type(&self) -> &'static str;


    /// This function should never use self in the body.
    fn should_render_children(&self) -> bool;
    
    /// This function should never use self in the body.
    fn get_trait_names(&self) -> Vec<ObjectTraitName>;


    

}




fn set_state_var(component: &Rc<dyn ComponentLike>, name: StateVarName, val: StateVarValue) {
    match component.state_var(name).unwrap() {
        StateVarAccess::String(cell) => {
            if let StateVarValue::String(string_val) = val {
                cell.0.replace(State::Resolved(string_val));
            } else {
                unreachable!();
            }
        },
        StateVarAccess::Integer(cell) => {
            if let StateVarValue::Integer(integer_val) = val {
                cell.0.replace(State::Resolved(integer_val));
            } else {
                unreachable!();
            }
        },
        StateVarAccess::Number(cell) => {
            if let StateVarValue::Number(number_val) = val {
                cell.0.replace(State::Resolved(number_val));
            } else {
                unreachable!();
            }
        },
        StateVarAccess::Bool(cell) => {
            if let StateVarValue::Boolean(bool_val) = val {
                cell.0.replace(State::Resolved(bool_val));
            } else {
                unreachable!();
            }
        }

    }
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


/// A component enum is needed because Rc<dyn ComponentLike> cannot go into a HashMap,
/// but this enum implements a conversion into Rc<dyn ComponentLike>.
#[derive(Debug, Clone)]
pub enum Component {
    Text(Rc<Text>),
    Number(Rc<Number>),
}

impl Component {
    /// Convert Component enum to ComponentLike trait object.
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


fn create_dependency_from_instruction(
    component: &Rc<dyn ComponentLike>,
    state_var: StateVarName,
    instruction: DependencyInstruction,
    instruction_name: InstructionName
) -> Dependency {

    let depends_on_objects: Vec<ObjectName>;
    let depends_on_state_vars: Vec<StateVarName>;

    match instruction {

        DependencyInstruction::StateVar(state_var_instruction) => {

            depends_on_objects = if let Option::Some(name) = state_var_instruction.component_name {
                    vec![ObjectName::Component(name)]
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
            depends_on_state_vars = child_instruction.desired_state_vars;

        },
        DependencyInstruction::Parent(_) => {
            // TODO
            depends_on_objects = vec![];
            depends_on_state_vars = vec![];
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

/// Ensure a state variable is not stale and can be safely unwrapped.
pub fn resolve_state_variable(core: &DoenetCore, component: &Rc<dyn ComponentLike>, name: StateVarName) {

    log!("Resolving state variable {}:{}", component.name(), name);

    let mut dependency_values: HashMap<InstructionName, Vec<(ComponentType, StateVarName, StateVarValue)>> = HashMap::new();


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
                    for &state_var_name in &dep.depends_on_state_vars {

                        resolve_state_variable(core, depends_on_component, name);
                        let state_var_access = depends_on_component.state_var(name).unwrap();
                        let state_var_value = match state_var_access {
                            StateVarAccess::Bool(state_var) => {
                                state_var.get_state()
                            },
                            StateVarAccess::Number(state_var) => {
                                state_var.get_state()   
                            },
                            StateVarAccess::Integer(state_var) => {
                                state_var.get_state()   
                            },
                            StateVarAccess::String(state_var) => {
                                state_var.get_state()   
                            }
                        };


                        if let State::Resolved(state_var_value) = state_var_value {
                            values_for_this_dep.push((
                                core.components.get(component_name).unwrap().component().get_component_type(),
                                state_var_name,
                                state_var_value
                            ));
    
                        } else {
                            panic!("Tried to access stale state var {}", state_var_name);
                        }

                    }
                }
            }
        }

        dependency_values.insert(dep.name, values_for_this_dep);
    }

    let definition = component.state_variable_instructions().get(name).unwrap();

    let update_instruction = definition.determine_state_var_from_dependencies(dependency_values);
    
    handle_update_instruction(component, name, update_instruction);
    
}

pub fn handle_update_instruction(
    component: &Rc<dyn ComponentLike>,
    name: StateVarName,
    instruction: StateVarUpdateInstruction<StateVarValue>)
{
    let definition = component.state_variable_instructions().get(name).unwrap();
    match instruction {
        StateVarUpdateInstruction::NoChange => {
            let current_value = match component.state_var(name).unwrap() {
                StateVarAccess::Bool(v) => v.get_state(),
                StateVarAccess::Number(v) => v.get_state(),
                StateVarAccess::Integer(v) => v.get_state(),
                StateVarAccess::String(v) => v.get_state(),
            };

            if let State::Resolved(_) = current_value {
                // Do nothing. It's resolved, so we can use it as is
            } else {
                panic!("Cannot use NoChange update instruction on a stale value");
            }

        },
        StateVarUpdateInstruction::UseDefault => {
            let new_state_var_value = definition.default_value();
            set_state_var(component, name, new_state_var_value);

        },
        StateVarUpdateInstruction::SetValue(new_value) => {
            let new_state_var_value = new_value;
            set_state_var(component, name, new_state_var_value);
        }

    };
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
