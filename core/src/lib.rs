
#![allow(dead_code)] 
#![allow(unused_variables)] 

use std::cell::RefCell;
use std::rc::Rc;
use std::collections::HashMap;
use std::fmt;


/**
Why we need RefCells: the Rc does not allow mutability in the
thing it wraps. If it any point we might want to mutate a field, its value should be wrapped in a RefCell
**/



pub mod text;
use text::{Text};

pub mod number;
use number::Number;

// use crate::Component;


#[macro_export]
macro_rules! state_var_access {
    ($component_type:ident, $state_var_field:ident, $state_var_type:ty) => {

        |component: crate::Component| -> RefCell<$state_var_type> {

            match component {
                crate::Component::$component_type(my_component) => {
                    my_component.$state_var_field.clone()
                },
                _ => {
                    panic!("State var access used wrong Component type argument for $component_type");
                }
            }
        }
        
    }
}



trait StateVariable<T> {

    fn state_vars_to_determine_dependencies() -> Vec<String> {
        vec![]
    }
    fn return_dependency_instructions(
        prerequisite_state_values: HashMap<String, StateVarValue>
    ) -> HashMap<String, DependencyInstruction>;

    fn determine_state_var_from_dependencies(
        dependency_values: HashMap<String, StateVarValue>
    ) -> StateVarUpdateInstruction<T>;
}


type StateVarValuesMap = HashMap<String, StateVarValue>;
type DependencyInstructionMap = HashMap<String, DependencyInstruction>;


#[derive(Debug)]
pub struct StateVarDef<T> {
    // name: &'static str,
    state_vars_to_determine_dependencies: fn() -> Vec<String>,
    return_dependency_instructions: fn(StateVarValuesMap) -> DependencyInstructionMap,
    determine_state_var_from_dependencies:fn(StateVarValuesMap) -> StateVarUpdateInstruction<T>,
    access: fn(Component) -> RefCell<T>,
    // associated_field: fn(Rc<ComponentType>) -> RefCell<StateVarType>,
}


pub fn default_state_vars_for_dependencies() -> Vec<String> { vec![] }


// impl<T> Default for StateVarDef<T> {
//     fn default() -> Self {
//         fn state_vars_to_det_deps() -> Vec<String> { vec![] }
//         fn return_dep(_: StateVarValuesMap) -> DependencyInstructionMap { DependencyInstructionMap::new() }
//         fn determine_values<T>(_: StateVarValuesMap) -> StateVarUpdateInstruction<T> {
//             StateVarUpdateInstruction::NoChange
//         }
//         StateVarDef {
//             name: "",
//             state_vars_to_determine_dependencies: state_vars_to_det_deps,
//             return_dependency_instructions: return_dep,
//             determine_state_var_from_dependencies: determine_values,
//         }    
//     }
// }


#[derive(Debug)]
pub enum StateVar {
    String(StateVarDef<String>),
    Bool(StateVarDef<bool>),
    Number(StateVarDef<f64>),
    Integer(StateVarDef<i64>),
}



enum StateVarValue {
    Text(String),
    Number(f64),
    Integer(i64),
    Boolean(bool),
}

#[derive(Clone, Debug)]
enum DependencyInstruction {
    Child(ChildDependencyInstruction),
    StateVar(StateVarDependencyInstruction),
    Parent(ParentDependencyInstruction),
}

#[derive(Clone, Debug)]
struct ChildDependencyInstruction {
    desired_children: Vec<ComponentTraitName>,
    desired_state_vars: Vec<String>,
}

#[derive(Default, Clone, Debug)]
struct StateVarDependencyInstruction {
    component_name: Option<String>, //default: Option::None
    state_var: String, //default: ""
}

#[derive(Clone, Debug)]
struct ParentDependencyInstruction {
    parent_trait: ComponentTraitName,
    state_var: String,
}




enum StateVarUpdateInstruction<T> {
    SetValue(T),
    UseDefault,
    NoChange,
}


pub trait HasStateVariables {
    fn define_state_variables() -> HashMap<&'static str, StateVar>;
}


pub trait HasComponentTraits {
    fn get_trait_names(&self) -> Vec<ComponentTraitName>;
    // fn state_vars(&self) -> Vec<Rc<dyn StateVariable>>;

}


pub trait ComponentLike: HasComponentTraits {
    fn name(&self) -> String;
    fn children(&self) -> RefCell<Vec<ComponentChild>>;
    fn parent(&self) -> RefCell<String>;
    fn parent_name(&self) -> Option<String>;
    fn add_as_child(&self, child: ComponentChild);

}





trait TextLikeComponent: ComponentLike {
    fn text_value(&self) -> String;
}
trait NumberLikeComponent: ComponentLike {
    fn add_one(&self) -> i32;
}

#[derive(Clone, PartialEq, Debug)]
pub enum ComponentTraitName {
    TextLikeComponent,
    NumberLikeComponent,
    ComponentLike,
}



#[derive(Debug, Clone)]
pub enum Component {
    Text(Rc<Text>),
    Number(Rc<Number>),
}



impl Component {

    //Note: this method consumes self
    pub fn to_component_like(self) -> Rc<dyn ComponentLike> {
        match self {
            Component::Text(comp) => comp as Rc<dyn ComponentLike>,
            Component::Number(comp) => comp as Rc<dyn ComponentLike>,
        }
    }


    pub fn name(&self) -> String {
        match self {
            Component::Text(comp) => comp.name(),
            Component::Number(comp) => comp.name(),
        }
    }

}


#[derive(Debug, Clone)]
pub enum ComponentChild {
    String(String),
    Component(Rc<dyn ComponentLike>),
}


#[derive(Debug)]
struct Dependency {
    component: String,
    state_var: &'static str,

    // We will use outer product of entries
    depends_on_components: Vec<String>,
    depends_on_state_vars: Vec<String>,

    instruction: DependencyInstruction,
    variables_optional: bool,
}





fn load_state_var_definitions_for_component_type(
    state_var_definitions: &mut HashMap<&'static str, HashMap<&'static str, StateVar>>,
    component_name: &'static str) {

    let definitions_from_component = match component_name {
        "text" => Text::define_state_variables(),
        _ => panic!("Invalid component name"),
    };

    state_var_definitions.insert(component_name, definitions_from_component);
}




fn create_all_dependencies_for_component(
    state_var_definitions: &HashMap<&'static str, HashMap<&'static str, StateVar>>, 
    component: &Component) -> Vec<Dependency> {
        
        let mut dependencies: Vec<Dependency> = vec![];


        let my_definitions = state_var_definitions.get(
            match component {
                Component::Text(_) => "text",
                Component::Number(_) => "number",
            }
        ).unwrap();


        for (&state_var_name, state_var_def) in my_definitions.iter() {

            //Eventually, call state_vars_to_determine_dependencies() and go calculate those values

            let dependency_instructions_hashmap = match state_var_def {
                StateVar::String(def)  => (def.return_dependency_instructions)(StateVarValuesMap::new()),
                StateVar::Bool(def)    => (def.return_dependency_instructions)(StateVarValuesMap::new()),
                StateVar::Number(def)  => (def.return_dependency_instructions)(StateVarValuesMap::new()),
                StateVar::Integer(def) => (def.return_dependency_instructions)(StateVarValuesMap::new()),
            };
            
            
            for (_, dep_instruction) in dependency_instructions_hashmap.into_iter() {


                let dependency;
                match component {
                    Component::Text(ref text) => {
                        dependency = create_dependency_from_instruction(
                            &text, state_var_name, dep_instruction
                        );
                    },
                    Component::Number(ref number) => {
                        dependency = create_dependency_from_instruction(
                            &number, state_var_name, dep_instruction
                        );
                    },

                }
                dependencies.push(dependency);
            }
        

        }

        dependencies

}


fn create_dependency_from_instruction(component: &Rc<impl ComponentLike>, state_var: &'static str, instruction: DependencyInstruction) -> Dependency {
    let mut dependency = Dependency {
        component: component.name(),
        state_var: state_var,
        depends_on_components: vec![],
        depends_on_state_vars: vec![],
        instruction: instruction.clone(),
        variables_optional: false,
    };

    match instruction {
        DependencyInstruction::StateVar(state_var_instruction) => {

            if let Option::Some(name) = state_var_instruction.component_name {
                dependency.depends_on_components = vec![name];
            } else {
                dependency.depends_on_components = vec![component.name()];
            }
            dependency.depends_on_state_vars = vec![state_var_instruction.state_var];
        },

        DependencyInstruction::Child(child_instruction) => {
            let all_children = component.children();

            let mut depends_on_children: Vec<String> = vec![];
            for child in all_children.borrow().iter() {
                for desired_child_type in child_instruction.desired_children.iter() {
                    match child {
                        ComponentChild::Component(child_component) => {
                            if child_component.get_trait_names().contains(desired_child_type) {
                                //If not already in list, add it to the list
                                if !depends_on_children.contains(&child_component.name()) {
                                    depends_on_children.push(child_component.name());
                                }
                            }
                        },

                        ComponentChild::String(string_value) => {
                            if desired_child_type == &ComponentTraitName::TextLikeComponent {
                                depends_on_children.push(format!("#{}", string_value));
                            }
                        },
                    }

                }
            }

            dependency.depends_on_components = depends_on_children;
            dependency.depends_on_state_vars = child_instruction.desired_state_vars;

        },
        DependencyInstruction::Parent(parent_instruction) => {

        },
    };

    dependency
}





/** Implement Debug for trait objects **/
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




#[test]
fn test_core() {

    //Setup Tree
    let mut components: HashMap<String, Component> = HashMap::new();

    let text2 = Rc::new(Text {
        name: "text2".to_string(),
        value: RefCell::new("hi there".to_string()),
        hide: RefCell::new(false),
        parent: RefCell::new(String::new()),
        children: RefCell::new(vec![]),
    });
    components.insert(text2.name(), Component::Text(Rc::clone(&text2)));


    let text1 = Rc::new(Text {
        name: "text1".to_string(),
        value: RefCell::new("banana".to_string()),
        hide: RefCell::new(false),
        parent: RefCell::new(String::new()),
        children: RefCell::new(vec![]),
    });
    components.insert(text1.name(), Component::Text(Rc::clone(&text1)));


    text1.add_as_child(ComponentChild::Component(text2));


    //Load state var definitions
    let mut state_var_definitions: HashMap<&str, HashMap<&str, StateVar>> = HashMap::new();
    load_state_var_definitions_for_component_type(&mut state_var_definitions, "text");


    //Create dependencies
    let dependencies = create_all_dependencies_for_component(&state_var_definitions,
        components.get(&text1.name).unwrap());

    println!("Components\n{:#?}", components);
    println!("State var definitions\n{:#?}", state_var_definitions);
    println!("Dependencies\n{:#?}", dependencies);

    assert!(true);

    // let dep_instructions_hashmap = text1.value.return_dependency_instructions(HashMap::new());
    // for (_, dep_instruction) in dep_instructions_hashmap.into_iter() {
    //     let dependency = create_dependency_from_instruction(
    //         Rc::clone(&text1), "value", dep_instruction
    //     );

    //     println!("{:#?}\n", dependency);
    
    // }



}