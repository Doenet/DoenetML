use anyhow::Result;
use doenetml_core::{dast::DastRoot, DoenetMLCore};

fn main() -> Result<()> {
    println!("Running DoenetML Core in Standalone Mode");

    let program = r#"{"type":"root","children":[{"type":"element","name":"document","attributes":{},"children":[{"type":"element","name":"text","attributes":{},"children":[{"type":"text","value":"hello "},{"type":"element","name":"text","attributes":{},"children":[{"type":"text","value":"there"}]}]}]}]}"#;
    let dast_root: DastRoot = serde_json::from_str(program)?;

    let mut core = DoenetMLCore::new(dast_root, "", "", None);

    let result = core.to_flat_dast();

    let processed_string = serde_json::to_string(&result)?;
    println!("{}", processed_string);

    Ok(())
}
