//! Helpers for tests and benches: turn DoenetML source into DAST JSON by
//! running the TypeScript parser through node, mirroring how the current core
//! gets its DAST.

use std::io::Write;
use std::path::PathBuf;
use std::process::{Command, Stdio};

pub fn repo_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../..")
        .canonicalize()
        .unwrap()
}

/// Parse DoenetML source to DAST JSON via `scripts/parse-dast.mjs`.
pub fn dast_json(source: &str) -> String {
    String::from_utf8(parse_dast(source, &[])).unwrap()
}

/// Parse DoenetML source to the binary wire format via
/// `scripts/parse-dast.mjs --binary` (the JavaScript encoder,
/// `scripts/cdast-encode.mjs`), to check against `Dast::to_binary`.
pub fn dast_binary(source: &str) -> Vec<u8> {
    parse_dast(source, &["--binary"])
}

fn parse_dast(source: &str, args: &[&str]) -> Vec<u8> {
    let script = repo_root().join("scripts/parse-dast.mjs");
    let mut child = Command::new("node")
        .arg(&script)
        .args(args)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::inherit())
        .spawn()
        .expect("node must be on PATH to parse DoenetML");
    child
        .stdin
        .take()
        .unwrap()
        .write_all(source.as_bytes())
        .unwrap();
    let out = child.wait_with_output().unwrap();
    assert!(out.status.success(), "parse-dast.mjs failed");
    out.stdout
}

/// Parse and load a document from DoenetML source.
pub fn load(source: &str) -> crate::Result<crate::Document> {
    crate::Document::from_bytes(dast_json(source).as_bytes())
}

/// The first error the load reported (ADR 0013): its code and message.
/// An element that cannot be built no longer fails the load; it becomes
/// an `_error` component with this diagnostic. Panics when the document
/// loads without one, or does not load at all.
pub fn load_error(source: &str) -> (&'static str, String) {
    let doc = load(source).unwrap_or_else(|e| panic!("{source}: did not load: {e}"));
    doc.diagnostics()
        .iter()
        .find(|d| d.kind == crate::DiagnosticKind::Error)
        .map(|d| (d.code, d.message.clone()))
        .unwrap_or_else(|| panic!("{source}: loaded without an error"))
}

/// Parse to DAST JSON, convert to the binary wire format in Rust, and load
/// from that; lets tests check both loaders agree.
pub fn load_via_binary(source: &str) -> crate::Result<crate::Document> {
    let dast = crate::dast::Dast::from_json(&dast_json(source))?;
    let bytes = dast.to_binary();
    crate::Document::from_bytes(&bytes)
}

/// `load` with a document seed (ADR 0009), for load-time choices.
pub fn load_with_seed(source: &str, seed: u64) -> crate::Result<crate::Document> {
    let json = dast_json(source);
    let (doc, _) = crate::Document::load(
        json.as_bytes(),
        crate::LoadOptions {
            seed,
            ..Default::default()
        },
    )?;
    Ok(doc)
}
