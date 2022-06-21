
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
use text::{Text, TextValue};

pub mod number;
use number::Number;





trait StateVariable {
    type Type;

    fn state_vars_to_determine_dependencies() -> Vec<String> {
        vec![]
    }
    fn return_dependency_instructions(
        prerequisite_state_values: HashMap<String, StateVarValue>
    ) -> HashMap<String, DependencyInstruction>;

    fn determine_state_var_from_dependencies(
        dependency_values: HashMap<String, StateVarValue>
    ) -> StateVarUpdateInstruction<Self::Type>;
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



pub trait HasComponentTraits {
    fn get_trait_names(&self) -> Vec<ComponentTraitName>;
}

pub trait ComponentLike: HasComponentTraits {
    fn name(&self) -> String;
    fn children(&self) -> RefCell<Vec<Rc<dyn ComponentLike>>>;
    fn parent(&self) -> RefCell<String>;
    fn parent_name(&self) -> Option<String>;
    fn add_as_child(&self, child: Rc<dyn ComponentLike>);
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



#[derive(Debug)]
pub enum Component {
    Text(Rc<Text>),
    Number(Rc<Number>),
}



impl Component {
    pub fn name(&self) -> String {
        match self {
            Component::Text(comp) => comp.name(),
            Component::Number(comp) => comp.name(),
        }
    }

    // fn children(&self) -> Vec<dyn ComponentLike> {
    //     match self {
    //         Component::Text(comp) => comp.children,
    //         Component::Number(comp) => comp.children,
    //     }
    // }
}


#[derive(Debug)]
struct Dependency {
    component: String,
    state_var: String,

    // We will use outer product of entries
    depends_on_components: Vec<String>,
    depends_on_state_vars: Vec<String>,

    instruction: DependencyInstruction,
    variables_optional: bool,
}





fn create_dependency_from_instruction(component: Rc<impl ComponentLike>, state_var: String, instruction: DependencyInstruction) -> Dependency {
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
                    if child.get_trait_names().contains(desired_child_type) {
                        //If not already in list, add it to the list
                        if !depends_on_children.contains(&child.name()) {
                            depends_on_children.push(child.name());
                        }
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

    let mut components: HashMap<String, Component> = HashMap::new();

    let text2 = Rc::new(Text {
        name: "text2".to_string(),
        value: TextValue("hi there".to_string()),
        parent: RefCell::new(String::new()),
        children: RefCell::new(vec![]),
    });
    components.insert(text2.name(), Component::Text(Rc::clone(&text2)));


    let text1 = Rc::new(Text {
        name: "text1".to_string(),
        value: TextValue("banana".to_string()),
        parent: RefCell::new(String::new()),
        children: RefCell::new(vec![]),
    });
    components.insert(text1.name(), Component::Text(Rc::clone(&text1)));


    text1.add_as_child(Text::to_component_like(text2));





    let dep_instructions_hashmap = TextValue::return_dependency_instructions(HashMap::new());
    for (_, dep_instruction) in dep_instructions_hashmap.into_iter() {
        let dependency = create_dependency_from_instruction(
            Rc::clone(&text1), "value".to_string(), dep_instruction
        );

        println!("{:#?}\n", dependency);
    
    }



}