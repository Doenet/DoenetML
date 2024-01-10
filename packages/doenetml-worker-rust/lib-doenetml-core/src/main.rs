use doenetml_core::{create_doenetml_core, DoenetMLCore};

fn main() {
    println!("Hello, world!");

    let program = r#"{"type":"root","children":[{"type":"element","name":"document","attributes":{},"children":[{"type":"element","name":"text","attributes":{},"children":[{"type":"text","value":"hello "},{"type":"element","name":"text","attributes":{},"children":[{"type":"text","value":"there"}]}]}]}]}"#;

    let result = doenetml_core::create_doenetml_core(&program, "", "");
}
