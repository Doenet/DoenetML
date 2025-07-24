//! This file contains utilities for testing DoenetMLCore. It is a duplicate of `tests/test_utils/mod.rs`, made available for internal testing purposes.
use crate::dast::flat_dast::{FlatAttribute, FlatNode, FlatRoot, UntaggedContent};
use crate::dast::{DastRoot, FlatDastRoot};
use serde_json;
pub use serde_json::{Value, json};
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

pub fn to_serde_value(val: &FlatDastRoot) -> Value {
    let val: serde_json::Value =
        serde_json::from_str(&serde_json::to_string(val).unwrap()).unwrap();
    val
}

impl FlatRoot {
    /// Convert the `FlatRoot` to an XML string. This function should not be relied upon to create
    /// valid XML. It is intended for debugging and testing.
    pub fn to_xml(&self) -> String {
        let nodes = &self.nodes;
        fn node_to_xml(nodes: &[FlatNode], node: &UntaggedContent) -> String {
            match node {
                UntaggedContent::Text(txt) => txt.into(),
                UntaggedContent::Ref(idx) => {
                    let node = &nodes[*idx];
                    match node {
                        FlatNode::Element(elm) => {
                            let children = String::from_iter(
                                elm.children.iter().map(|c| node_to_xml(nodes, c)),
                            );
                            // attributes are printed with a space in front, so we can join them with a space
                            let mut attrs: Vec<String> = elm
                                .attributes
                                .iter()
                                .map(|a| attribute_to_xml(nodes, a))
                                .collect();
                            // Attributes are sorted to ensure stable printing
                            attrs.sort();
                            let attributes = attrs.join("");
                            if children.is_empty() {
                                format!("<{}{} />", elm.name, attributes)
                            } else {
                                format!("<{}{}>{}</{}>", elm.name, attributes, children, elm.name)
                            }
                        }
                        FlatNode::Error(err) => format!("<_error message=\"{}\"/>", err.message),
                        FlatNode::Ref(_) => "[REF PRINTING NOT IMPLEMENTED]".to_string(),
                        FlatNode::FunctionRef(_) => {
                            "[FUNCTION REF PRINTING NOT IMPLEMENTED]".to_string()
                        }
                    }
                }
            }
        }
        fn attribute_to_xml(nodes: &[FlatNode], attr: &FlatAttribute) -> String {
            let children = attr
                .children
                .iter()
                .map(|c| node_to_xml(nodes, c))
                .collect::<Vec<_>>()
                .join("");
            format!(" {}=\"{}\"", attr.name, children)
        }
        String::from_iter(self.children.iter().map(|c| node_to_xml(nodes, c)))
    }
}

/// If the `codelldb` extension is installed in VSCode,
/// add this function to your test and set a breakpoint to debug a rust test.
///
/// You may need to run `sudo sysctl -w kernel.yama.ptrace_scope=0` on linux
/// to allow vscode to attach to the process.
#[allow(unused)]
pub fn attach_codelldb_debugger() {
    let url = format!(
        "vscode://vadimcn.vscode-lldb/launch/config?{{'request':'attach','pid':{}}}",
        std::process::id()
    );
    std::process::Command::new("code")
        .arg("--open-url")
        .arg(url)
        .output()
        .unwrap();
    std::thread::sleep(std::time::Duration::from_millis(1000)); // Wait for debugger to attach
}
