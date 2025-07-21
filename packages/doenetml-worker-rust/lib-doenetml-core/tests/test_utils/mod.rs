//! This file contains utilities for testing DoenetMLCore.
use doenetml_core::Core;
use doenetml_core::components::types::{Action, ComponentIdx, LocalPropIdx, PropPointer};
use doenetml_core::dast::flat_dast::FlatPathPart;
use doenetml_core::dast::{DastRoot, FlatDastElementUpdate, FlatDastRoot};
use doenetml_core::props::cache::PropWithMeta;
use doenetml_core::props::traits::IntoPropView;
use doenetml_core::props::{PropValue, PropView};
use serde_json;
#[allow(unused)]
pub use serde_json::{Value, json};
use std::collections::HashMap;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;
use std::process::Command;
use std::str;

const PARSE_DAST_JS_SOURCE: &str = include_str!("../dist/parse-dast.js");

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
    // Save the JS source to a temporary file so that the resulting binary becomes more portable
    let dir = tempfile::tempdir()?;
    let file_path = PathBuf::from(dir.path().join("tempfile.mjs"));
    let mut file = File::create(&file_path)?;
    writeln!(file, "{}", PARSE_DAST_JS_SOURCE)?;

    let mut command = Command::new("node");
    command
        // Instead of `.arg("./tests/dist/parse-dast.js")`
        // we use the tmp file that was created
        .arg(file_path)
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
        serde_json::from_str(&evaluate_dast_via_node_to_json(str, true).expect("Should unwrap 1"))
            .expect("Should unwrap 2");
    root
}

#[allow(unused)]
pub fn to_serde_value(val: &FlatDastRoot) -> Value {
    let val: serde_json::Value =
        serde_json::from_str(&serde_json::to_string(val).unwrap()).unwrap();
    val
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

/// A mirror of `Core` with extra methods for testing.
#[allow(unused)]
pub struct TestCore {
    pub core: doenetml_core::Core,
}
#[allow(unused)]
impl TestCore {
    pub fn new() -> Self {
        Self { core: Core::new() }
    }
    pub fn new_from(core: doenetml_core::Core) -> Self {
        Self { core }
    }
    /// Get a prop from the core without tracking it. It will be resolved and calculated
    /// if it hasn't been already. This function internally uses `get_prop_for_render_untracked`.
    pub fn get_prop<A, B>(&mut self, component_idx: A, local_prop_idx: B) -> PropWithMeta
    where
        ComponentIdx: From<A>,
        LocalPropIdx: From<B>,
    {
        let component_idx = ComponentIdx::from(component_idx);
        let local_prop_idx = LocalPropIdx::from(local_prop_idx);
        let prop_node = self
            .core
            .document_model
            .prop_pointer_to_prop_node(PropPointer {
                component_idx,
                local_prop_idx,
            });
        let prop = self.core.get_prop_for_render_untracked(prop_node);
        prop
    }

    /// Get the value of a prop from the core without tracking it. It will be resolved and calculated
    /// if it hasn't been already. This function internally uses `get_prop_for_render_untracked`.
    pub fn get_prop_value<A, B>(&mut self, component_idx: A, local_prop_idx: B) -> PropValue
    where
        ComponentIdx: From<A>,
        LocalPropIdx: From<B>,
    {
        let prop = self.get_prop(component_idx, local_prop_idx);
        prop.value
    }

    /// Get the value of a prop from the core without tracking it. It will be resolved and calculated
    /// if it hasn't been already. This function internally uses `get_prop_for_render_untracked`.
    /// This function returns a _typed_ value. You may have to annotate your source with the desired type.
    pub fn get_prop_value_typed<A, B, PropType>(
        &mut self,
        component_idx: A,
        local_prop_idx: B,
    ) -> PropType
    where
        ComponentIdx: From<A>,
        LocalPropIdx: From<B>,
        PropType: TryFrom<PropValue>,
        <PropType as TryFrom<PropValue>>::Error: std::fmt::Display + std::fmt::Debug,
    {
        let prop = self.get_prop(component_idx, local_prop_idx);
        let prop_value: PropView<PropType> = prop.try_into_prop_view().unwrap();
        prop_value.value
    }

    /// Get a `PropView` from the core without tracking it. It will be resolved and calculated
    /// if it hasn't been already. This function internally uses `get_prop_for_render_untracked`.
    /// This function returns a _typed_ `PropView`. You may have to annotate your source with the desired type.
    pub fn get_prop_typed<A, B, PropType>(
        &mut self,
        component_idx: A,
        local_prop_idx: B,
    ) -> PropView<PropType>
    where
        ComponentIdx: From<A>,
        LocalPropIdx: From<B>,
        PropType: TryFrom<PropValue>,
        <PropType as TryFrom<PropValue>>::Error: std::fmt::Display + std::fmt::Debug,
    {
        let prop = self.get_prop(component_idx, local_prop_idx);
        prop.try_into_prop_view().unwrap()
    }

    pub fn get_component<A>(&self, component_idx: A) -> doenetml_core::components::Component
    where
        ComponentIdx: From<A>,
    {
        let component_idx = ComponentIdx::from(component_idx);
        self.core.document_model.get_component(component_idx)
    }

    /// Get the index of a component via its assigned name.
    pub fn get_component_index_by_name(&self, name: &str) -> usize {
        if self.core.resolver.is_none() {
            panic!("Resolver is not initialized, must call `init_from_dast_root` first");
        }
        let resolver = self.core.resolver.as_ref().unwrap();
        let resolved = resolver
            .resolve(
                &[FlatPathPart {
                    name: name.to_string(),
                    index: vec![],
                    position: None,
                    source_doc: None,
                }],
                1,
                false,
            )
            .unwrap();

        resolved.node_idx
    }

    pub fn to_flat_dast(&mut self) -> FlatDastRoot {
        self.core.to_flat_dast()
    }
    pub fn init_from_dast_root(&mut self, dast_root: &DastRoot) {
        self.core.init_from_dast_root(dast_root);
    }

    pub fn dispatch_action(
        &mut self,
        action: Action,
    ) -> Result<HashMap<ComponentIdx, FlatDastElementUpdate>, String> {
        self.core.dispatch_action(action)
    }
}
