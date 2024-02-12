//! This file contains utilities for testing DoenetMLCore.
use doenetml_core::dast::{DastRoot, FlatDastRoot};
use serde_json;
pub use serde_json::{json, Value};
use std::process::Command;
use std::str;

/// Execute the command `node ./tests/dist/parse-dast.js -i <dast>`.
/// This returns a JSON string of the parsed DAST. Node must be installed and properly configured.
///
/// If `strip_position` is true, the position field will be stripped from the output.
pub fn evaluate_dast_via_node(dast: &str, strip_position: bool) -> std::io::Result<Value> {
    evaluate_dast_via_node_to_json(dast, strip_position)
        .map(|val| serde_json::from_str(&val).unwrap())
}

/// Execute the command `node ./tests/dist/parse-dast.js -i <dast>`.
/// This returns a JSON string of the parsed DAST. Node must be installed and properly configured.
///
/// If `strip_position` is true, the position field will be stripped from the output.
pub fn evaluate_dast_via_node_to_json(dast: &str, strip_position: bool) -> std::io::Result<String> {
    let mut command = Command::new("node");
    command
        .arg("./tests/dist/parse-dast.js")
        .arg("-i")
        .arg(dast);
    if strip_position {
        command.arg("--strip-position");
    }
    let output = command.output()?;

    match output.status.success() {
        true => Ok(str::from_utf8(&output.stdout).unwrap().to_string()),
        false => Err(std::io::Error::new(
            std::io::ErrorKind::Other,
            str::from_utf8(&output.stderr).unwrap().to_string(),
        )),
    }
}

/// Expand the string containing DoenetML into a JSON string of the parsed DAST
/// omitting the position props.
#[allow(unused)]
pub fn dast_no_position(str: &str) -> String {
    evaluate_dast_via_node_to_json(str, true).unwrap()
}

/// Expand the string containing DoenetML into a JSON string of the parsed DAST
#[allow(unused)]
pub fn dast(str: &str) -> String {
    evaluate_dast_via_node_to_json(str, false).unwrap()
}

/// Expand the string containing DoenetML into a serde `Value`
/// omitting the position props.
#[allow(unused)]
pub fn dast_no_position_as_serde_value(str: &str) -> Value {
    evaluate_dast_via_node(str, true).unwrap()
}

/// Expand the string containing DoenetML into a serde `Value`
#[allow(unused)]
pub fn dast_as_serde_value(str: &str) -> Value {
    evaluate_dast_via_node(str, false).unwrap()
}

/// Expand the string containing DoenetML into `DastRoot`
#[allow(unused)]
pub fn dast_root(str: &str) -> DastRoot {
    let root: DastRoot =
        serde_json::from_str(&evaluate_dast_via_node_to_json(str, false).unwrap()).unwrap();
    root
}

/// Expand the string containing DoenetML into `DastRoot`
/// omitting the position props.
#[allow(unused)]
pub fn dast_root_no_position(str: &str) -> DastRoot {
    let root: DastRoot =
        serde_json::from_str(&evaluate_dast_via_node_to_json(str, true).unwrap()).unwrap();
    root
}

#[allow(unused)]
pub fn to_serde_value(val: &FlatDastRoot) -> Value {
    let val: serde_json::Value =
        serde_json::from_str(&serde_json::to_string(val).unwrap()).unwrap();
    val
}
