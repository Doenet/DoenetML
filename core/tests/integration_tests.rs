

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

    assert_eq!(dc.component_nodes.len(), 1);

}
