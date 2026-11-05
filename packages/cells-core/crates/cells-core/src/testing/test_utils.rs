//! Helpers for tests and benches: turn DoenetML source into DAST JSON by
//! running the TypeScript parser through node, mirroring how the current core
//! gets its DAST.
//!
//! Starting node costs about 60 ms, far more than a parse, and the suite
//! parses thousands of sources. So a process keeps `parse-dast.mjs --serve`
//! running and sends it each source (`Parser`), one parser per thread that
//! parses at once, and remembers every source it parsed (`CACHE`): a sweep
//! that loads a document at several seeds parses it once.

use std::collections::HashMap;
use std::io::{BufRead, BufReader, Read, Write};
use std::path::PathBuf;
use std::process::{Child, ChildStdin, ChildStdout, Command, Stdio};
use std::sync::{Arc, LazyLock, Mutex};

pub fn repo_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../..")
        .canonicalize()
        .unwrap()
}

/// Parse DoenetML source to DAST JSON via `scripts/parse-dast.mjs`.
pub fn dast_json(source: &str) -> String {
    String::from_utf8(parse_dast(source, Format::Json).to_vec()).unwrap()
}

/// Parse DoenetML source to the binary wire format via
/// `scripts/parse-dast.mjs --binary` (the JavaScript encoder,
/// `scripts/cdast-encode.mjs`), to check against `Dast::to_binary`.
pub fn dast_binary(source: &str) -> Vec<u8> {
    parse_dast(source, Format::Binary).to_vec()
}

#[derive(Clone, Copy, PartialEq, Eq, Hash)]
enum Format {
    Json,
    Binary,
}

/// Every source this process parsed, by format: the DAST it parsed to.
type Parsed = HashMap<(Format, String), Arc<[u8]>>;
static CACHE: LazyLock<Mutex<Parsed>> = LazyLock::new(Default::default);

/// The parsers no thread is using: a thread takes one, or starts one when
/// none is free, and puts it back after its parse.
static IDLE: Mutex<Vec<Parser>> = Mutex::new(Vec::new());

fn parse_dast(source: &str, format: Format) -> Arc<[u8]> {
    let key = (format, source.to_string());
    if let Some(dast) = CACHE.lock().unwrap().get(&key) {
        return dast.clone();
    }
    let idle = IDLE.lock().unwrap().pop();
    let mut parser = idle.unwrap_or_else(Parser::start);
    let dast: Arc<[u8]> = parser.parse(source, format).into();
    IDLE.lock().unwrap().push(parser);
    CACHE.lock().unwrap().insert(key, dast.clone());
    dast
}

/// A running `parse-dast.mjs --serve`. It exits when its stdin closes, so
/// with the test process.
struct Parser {
    _child: Child,
    stdin: ChildStdin,
    stdout: BufReader<ChildStdout>,
}

impl Parser {
    fn start() -> Parser {
        let script = repo_root().join("scripts/parse-dast.mjs");
        let mut child = Command::new("node")
            .arg(&script)
            .arg("--serve")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::inherit())
            .spawn()
            .expect("node must be on PATH to parse DoenetML");
        Parser {
            stdin: child.stdin.take().unwrap(),
            stdout: BufReader::new(child.stdout.take().unwrap()),
            _child: child,
        }
    }

    /// One request: `<json|binary> <length>` and the source; one reply:
    /// `<ok|error> <length>` and the DAST or the error.
    fn parse(&mut self, source: &str, format: Format) -> Vec<u8> {
        let format = match format {
            Format::Json => "json",
            Format::Binary => "binary",
        };
        let failed = "parse-dast.mjs --serve exited; is the parser built?";
        writeln!(self.stdin, "{format} {}", source.len()).expect(failed);
        self.stdin.write_all(source.as_bytes()).expect(failed);
        self.stdin.flush().expect(failed);
        let mut header = String::new();
        self.stdout.read_line(&mut header).expect(failed);
        let (status, len) = header.trim_end().split_once(' ').expect(failed);
        let mut out = vec![0; len.parse().expect(failed)];
        self.stdout.read_exact(&mut out).expect(failed);
        assert!(
            status == "ok",
            "parse-dast.mjs failed: {}",
            String::from_utf8_lossy(&out)
        );
        out
    }
}

/// Parse and load a document from DoenetML source.
pub fn load(source: &str) -> crate::Result<crate::Document> {
    crate::Document::from_bytes(dast_json(source).as_bytes())
}

/// `load`, with every prop computed (`LoadOptions::prune` off, ADR 0019):
/// for a test that reads a prop no renderer reads (a circle's area, a
/// line's slope), as the current core's state variables let a reader.
pub fn load_unpruned(source: &str) -> crate::Result<crate::Document> {
    let json = dast_json(source);
    let (doc, _) = crate::Document::load(
        json.as_bytes(),
        crate::LoadOptions {
            prune: false,
            ..Default::default()
        },
    )?;
    Ok(doc)
}

/// The first error the load reported (ADR 0013): its code and message.
/// An element that cannot be built does not fail the load; it becomes
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
