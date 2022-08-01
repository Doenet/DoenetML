use core::{DoenetCore};

type SVV = core::state_variables::StateVarValue;


fn assert_state_var_is(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: SVV) {
    let state_value = dc.component_states.get(comp_name).unwrap()
        .get(sv_name).unwrap().copy_value_if_resolved().unwrap();

    // println!("{}", state_value);
    // println!("{}", value);

    assert_eq!(state_value, value);
}

fn assert_state_var_is_string(dc: &DoenetCore, comp_name: &'static str, sv_name: &'static str, value: &'static str) {
    assert_state_var_is(dc, comp_name, sv_name, SVV::String(value.into()));
}

#[test]
fn p_preserves_spaces_between_text_tags() {

    // <document><p><text>Hello</text> <text>there</text>!</p>
    // <p><text>We <text>could</text> be <text copySource="/_text2" />.</text></p></document>

    let data = r#"
    [{"componentType":"document","props":{},"children":[{"componentType":"p","props":{},"children":[{"componentType":"text","props":{},"children":["Hello"],"range":{"openBegin":14,"openEnd":18,"closeBegin":24,"closeEnd":31}}," ",{"componentType":"text","props":{},"children":["there"],"range":{"openBegin":33,"openEnd":37,"closeBegin":43,"closeEnd":50}},"!"],"range":{"openBegin":11,"openEnd":12,"closeBegin":51,"closeEnd":55}},"\n",{"componentType":"p","props":{},"children":[{"componentType":"text","props":{},"children":["We ",{"componentType":"text","props":{},"children":["could"],"range":{"openBegin":69,"openEnd":73,"closeBegin":79,"closeEnd":86}}," be ",{"componentType":"text","props":{"copySource":"/_text2"},"children":[],"range":{"selfCloseBegin":96,"selfCloseEnd":117}},"."],"range":{"openBegin":60,"openEnd":64,"closeBegin":120,"closeEnd":127}}],"range":{"openBegin":57,"openEnd":58,"closeBegin":127,"closeEnd":131}}],"range":{"openBegin":1,"openEnd":9,"closeBegin":131,"closeEnd":142}},"\n"]
    "#;

    // let program = serde_json::from_str(data).unwrap();
    let dc = core::create_doenet_core(data);
    core::update_renderers(&dc);

    // println!("core {:#?}", dc);

    assert_state_var_is_string(&dc, "/_p1", "value", "Hello there!");
    assert_state_var_is_string(&dc, "/_p2", "value", "We could be there.");
}

