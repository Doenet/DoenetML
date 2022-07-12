
use core::{self, ComponentChild, state_variables::StateVar};
use std::cell::RefCell;

#[test]
fn it_works() {

    let data = r#"
    {
        "componentType": "text",
        "props": {
            "name": "hello_text"
        },
        "children": [
            "hello"
        ]
    }
    "#;

    let program = serde_json::from_str(data).unwrap();
    let dc = core::create_doenet_core(program);

    assert_eq!(dc.components.len(), 1);

}

#[test]
fn state_var_depends_on_another_state_var_of_same_component() {

    use crate::core::ComponentLike;
    use core_derive::ComponentLike;

    // #[derive(Debug, ComponentLike)]
    struct TestComponent {
        pub name: String,
        pub parent: RefCell<String>,
        pub children: RefCell<Vec<ComponentChild>>,
    
        // State variables
        value: StateVar<String>,
        hidden: StateVar<bool>,
        disabled: StateVar<bool>,
        fixed: StateVar<bool>,
        // text is same as value state var, but this one gets sent to rendere
        text: StateVar<String>, 
    }
}