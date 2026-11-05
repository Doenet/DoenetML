//! Print the Rust core's component inventory (see
//! `doenetml_core::components::inventory`) as JSON.

fn main() {
    let inventory = doenetml_core::components::inventory::component_inventory();
    println!("{}", serde_json::to_string_pretty(&inventory).unwrap());
}
