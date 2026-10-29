//! The promise of ADR 0017, step 5, checked independently of how
//! `compare_versions` keeps it: an edit it calls safe harms no student.
//!
//! Every document of the golden set (`crates/cells-bench/golden`) and the
//! documents below gets generated edits:
//! literals changed, paragraphs and inputs inserted, elements removed and
//! renamed, points added that read an input. Each version that loads is
//! compared with the original, and for every edit called safe, generated
//! sessions of requests and submits run on the original. The session's
//! saved state, restored into the edited version, must show every old
//! input with the values it had, every point inside its new graph's bounds
//! if it was inside the old one's, and every new point inside its graph if
//! a fresh load puts it there. A failure is a hole in the check, found
//! before a student finds it.
//!
//! `SAFE_EDITS_LONG=1` runs many more edits and sessions per document, and
//! `fixtures/sir.doenet` too.

use cells_core::CompIdx;
use std::path::Path;

use cells_core::build::signature::Signature;
use cells_core::components::ComponentType;
use cells_core::dast::Dast;
use cells_core::testing::test_utils::{dast_json, repo_root};
use cells_core::testing::{compile, inputs};
use cells_core::{Document, LoadOptions, Request, ValueType, compare_signatures, input_signature};

/// Documents with inputs of every kind, beside the golden set.
const DOCS: &[(&str, &str)] = &[
    (
        "inputs",
        r#"<numberInput name="n" value="1"/><mathInput name="mi" prefill="x"/><textInput name="ti"/>
<booleanInput name="b"/><slider name="s" from="0" to="10"/>
<choiceInput name="c"><choice>a</choice><choice>b</choice><choice>c</choice></choiceInput>
<number name="k">2</number><number name="twice">$k $n</number>"#,
    ),
    (
        "graph",
        r#"<numberInput name="n" value="1"/><number name="k">2</number>
<graph name="g" xmin="-10" xmax="10" ymin="-10" ymax="10">
  <point name="p" x="1" y="2"/><point name="q" x="$k $n" y="3"/>
  <point name="c" extend="$p"/><polygon name="poly" vertices="(0,0) (1,0) (0,1)"/>
</graph>"#,
    ),
    (
        "repeat",
        r#"<numberInput name="n" value="2"/>
<repeatForSequence name="r" length="$n"><numberInput name="x" value="0"/></repeatForSequence>"#,
    ),
    (
        "answer",
        r#"<answer name="a"><mathInput name="mi"/><award><math>x+1</math></award></answer>
<answer name="t" type="text"><textInput name="ti"/><award>yes</award></answer>"#,
    ),
    (
        "choice",
        r#"<numberInput name="n" value="5"/>
<conditionalContent name="cc">
  <case name="pos" condition="$n > 0"><numberInput name="w" value="1"/></case>
  <else><numberInput name="w" value="2"/></else>
</conditionalContent>
<select name="sel"><option><numberInput name="v" value="1"/></option><option><numberInput name="v" value="2"/></option></select>"#,
    ),
];

/// A small deterministic generator: the test is the same every run.
struct Rng(u64);

impl Rng {
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_add(0x9e37_79b9_7f4a_7c15);
        let mut z = self.0;
        z = (z ^ (z >> 30)).wrapping_mul(0xbf58_476d_1ce4_e5b9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94d0_49bb_1331_11eb);
        z ^ (z >> 31)
    }
    fn below(&mut self, n: usize) -> usize {
        (self.next() % n.max(1) as u64) as usize
    }
}

fn long() -> bool {
    std::env::var_os("SAFE_EDITS_LONG").is_some()
}

#[test]
fn every_edit_called_safe_restores_every_students_work() {
    let mut docs: Vec<(String, String)> = DOCS
        .iter()
        .map(|(n, s)| (n.to_string(), s.to_string()))
        .collect();
    let root = repo_root();
    let golden = root.join("crates/cells-bench/golden");
    let mut paths: Vec<_> = std::fs::read_dir(&golden)
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .collect();
    paths.sort();
    if long() {
        paths.push(root.join("fixtures/sir.doenet"));
    }
    for p in &paths {
        docs.push((stem(p), std::fs::read_to_string(p).unwrap()));
    }
    let (mut compared, mut safe, mut sessions) = (0, 0, 0);
    let mut holes = Vec::new();
    for (name, src) in &docs {
        let Some(old) = Version::new(src) else {
            continue;
        };
        if old.load(0).is_none() {
            continue;
        }
        let mut rng = Rng(name.bytes().map(u64::from).sum());
        for (what, edited) in edits(src, &mut rng) {
            let Some(new) = Version::new(&edited) else {
                continue;
            };
            let report = compare_signatures(&old.signature, &new.signature);
            compared += 1;
            if !report.safe() {
                continue;
            }
            safe += 1;
            for seed in 0..if long() { 6 } else { 1 } {
                sessions += 1;
                if let Err(e) = check(&old, &new, seed, &mut rng) {
                    holes.push(format!(
                        "{name}, {what}, session {seed}: {e}\n--- after ---\n{edited}"
                    ));
                }
            }
        }
    }
    assert!(
        holes.is_empty(),
        "{} edits called safe harmed a student:\n\n{}",
        holes.len(),
        holes.join("\n\n")
    );
    // The test checks something: edits are found safe and unsafe.
    assert!(
        compared > 100 && safe > 20 && safe < compared,
        "compared {compared}, safe {safe}"
    );
    eprintln!("safe_edits: {compared} edits compared, {safe} safe, {sessions} sessions");
}

fn stem(p: &Path) -> String {
    p.file_stem().unwrap().to_string_lossy().into_owned()
}

/// One version of a document: its source, its DAST and its compile.
struct Version {
    /// The DAST as JSON, parsed once: parsing runs the parser in node.
    json: String,
    compiled: std::sync::Arc<cells_core::Compiled>,
    signature: Signature,
}

impl Version {
    fn new(src: &str) -> Option<Version> {
        let json = dast_json(src);
        let dast = Dast::from_json(&json).ok()?;
        let compiled = compile(&dast).ok()?;
        let signature = input_signature(&dast).ok()?;
        Some(Version {
            json,
            compiled,
            signature,
        })
    }

    fn load(&self, seed: u64) -> Option<Document> {
        let options = LoadOptions {
            seed,
            ..Default::default()
        };
        Some(Document::load(self.json.as_bytes(), options).ok()?.0)
    }
}

/// A session on `old` at `seed`, restored into `new`. Each prop of every
/// old input shows what it showed, or, where the student left it as it
/// started, the new version's start; a point the student left inside its
/// graph stays inside; a new point that starts inside its graph does.
fn check(old: &Version, new: &Version, seed: u64, rng: &mut Rng) -> Result<(), String> {
    let mut doc = old.load(seed).ok_or("the original did not load")?;
    let started = inputs(&doc, &old.compiled);
    session(&mut doc, rng);
    let before = inputs(&doc, &old.compiled);
    let saved = doc.save_state();
    let touched = saved_entries(&saved);
    let mut after = new.load(seed).ok_or("the edit did not load")?;
    let fresh = inputs(&after, &new.compiled);
    after
        .restore_state(&saved)
        .map_err(|e| format!("restore failed: {e}"))?;
    let restored = inputs(&after, &new.compiled);
    for (key, b) in &before {
        let Some(r) = restored.get(key) else {
            return Err(format!("{key} is gone"));
        };
        // An iteration the session added has no fresh counterpart: the
        // same element in another iteration starts the same way.
        let element = key.rsplit(' ').next().unwrap();
        let f = fresh.get(key).or_else(|| {
            fresh
                .iter()
                .find(|(k, _)| k.rsplit(' ').next() == Some(element))
                .map(|(_, v)| v)
        });
        let s = started.get(key);
        for (i, (prop, was)) in b.values.iter().enumerate() {
            let now = r.values.get(i).map(|v| &v.1);
            // Left as it started: as the load showed it, or for an input of
            // an iteration the session added, not in the saved state.
            let untouched = match s {
                Some(s) => s.values.get(i).map(|v| &v.1) == Some(was),
                None => !touched.contains(&(key.clone(), prop.clone())),
            };
            // A graph's own bounds are view state: the author's new
            // bounds win over a student's pan.
            let view =
                r.bounds.is_none() && matches!(prop.as_str(), "xmin" | "xmax" | "ymin" | "ymax");
            let restarted = f.and_then(|f| f.values.get(i)).map(|v| &v.1) == now;
            if now != Some(was) && !((untouched || view) && restarted) {
                return Err(format!("{key}.{prop} was {was}, restored as {now:?}"));
            }
        }
        if let (Some(old), Some(new)) = (b.bounds, r.bounds) {
            for (&p, &q) in b.points.iter().zip(&r.points) {
                if p == q && inside(p, old) && !inside(p, new) {
                    return Err(format!("{key} at {p:?} left its graph {new:?}"));
                }
            }
        }
    }
    for (key, r) in &restored {
        if before.contains_key(key) {
            continue;
        }
        if let (Some(bounds), Some(f)) = (r.bounds, fresh.get(key)) {
            for (&p, &fp) in r.points.iter().zip(&f.points) {
                if inside(fp, bounds) && !inside(p, bounds) {
                    return Err(format!(
                        "new input {key} starts at {p:?}, outside {bounds:?}"
                    ));
                }
            }
        }
    }
    Ok(())
}

/// The (input key, prop) of every entry of saved state, named as `inputs`
/// names an input.
fn saved_entries(saved: &str) -> std::collections::HashSet<(String, String)> {
    let saved: serde_json::Value = serde_json::from_str(saved).unwrap();
    saved["state"]
        .as_array()
        .unwrap()
        .iter()
        .map(|e| {
            let path = &e[0];
            let elem = e[1].as_str().unwrap();
            let key = if path.as_array().unwrap().is_empty() {
                elem.to_string()
            } else {
                format!("{path} {elem}")
            };
            (key, e[2].as_str().unwrap().to_string())
        })
        .collect()
}

fn inside((x, y): (f64, f64), [x0, x1, y0, y1]: [f64; 4]) -> bool {
    x0 <= x && x <= x1 && y0 <= y && y <= y1
}

/// Requests on interactive cells, with values of their types, a submit
/// of every answer and a press of every trigger: the actions, whose cells
/// are not interactive (ADR 0018).
fn session(doc: &mut Document, rng: &mut Rng) {
    let n = if long() { 24 } else { 8 };
    for _ in 0..n {
        // A request may rebuild, which numbers the cells anew.
        let cells = doc.interactive_cells();
        if cells.is_empty() {
            break;
        }
        let cell = cells[rng.below(cells.len())];
        let k = rng.below(17) as f64 / 2.0 - 4.0;
        let value = match doc.value_types[cell.index()] {
            ValueType::Number => k,
            ValueType::Text => doc.intern(&format!("t{k}")),
            ValueType::Math => match doc.parse_math(&format!("x+{k}")) {
                Ok(h) => h,
                Err(_) => continue,
            },
        };
        doc.request(&[Request { cell, value }]);
    }
    let answers: Vec<_> = CompIdx::below(doc.n_components())
        .filter(|&c| doc.component_type(c) == ComponentType::Answer)
        .collect();
    for a in answers {
        doc.submit(a);
    }
    let triggers: Vec<_> = CompIdx::below(doc.n_components())
        .filter(|&c| match doc.component_type(c) {
            ComponentType::TriggerSet => true,
            ComponentType::UpdateValue => doc
                .parent(c)
                .is_none_or(|p| doc.component_type(p) != ComponentType::TriggerSet),
            _ => false,
        })
        .collect();
    for t in triggers {
        // A press may rebuild, which numbers the components anew.
        if t.index() < doc.n_components() {
            doc.trigger(t);
        }
    }
}

/// Edits of `src`, each with what it did.
fn edits(src: &str, rng: &mut Rng) -> Vec<(String, String)> {
    let mut out = Vec::new();
    // Numeric literals in attributes and text.
    for (start, end) in numbers(src) {
        let v: f64 = src[start..end].parse().unwrap();
        for nv in [v + 1.0, v * 2.0 + 1.0] {
            out.push((
                format!("{} -> {nv} at {start}", &src[start..end]),
                format!("{}{nv}{}", &src[..start], &src[end..]),
            ));
        }
    }
    let tags = tag_starts(src);
    let names = names(src);
    for &at in &tags {
        let insert = |s: &str| format!("{}{s}{}", &src[..at], &src[at..]);
        out.push((format!("a paragraph at {at}"), insert("<p>Inserted</p>")));
        out.push((
            format!("a number input at {at}"),
            insert(r#"<numberInput name="zz9"/>"#),
        ));
        out.push((
            format!("a point at {at}"),
            insert(r#"<point name="zz8" x="1" y="1"/>"#),
        ));
        if let Some(n) = names.get(rng.below(names.len().max(1))) {
            out.push((
                format!("a point reading {n} at {at}"),
                insert(&format!(r#"<point name="zz7" x="${n}" y="0"/>"#)),
            ));
            out.push((
                format!("a number reading {n} at {at}"),
                insert(&format!(r#"<number name="zz6">${n} + 1</number>"#)),
            ));
        }
    }
    // Removing a self-closing element.
    for (start, end) in self_closing(src) {
        out.push((
            format!("removed {}", &src[start..end]),
            format!("{}{}", &src[..start], &src[end..]),
        ));
    }
    // Renaming an element (its references keep the old name).
    for n in &names {
        let from = format!("name=\"{n}\"");
        if let Some(at) = src.find(&from) {
            out.push((
                format!("renamed {n}"),
                format!("{}name=\"{n}x\"{}", &src[..at], &src[at + from.len()..]),
            ));
        }
    }
    // A sample, so the run stays short.
    let keep = if long() { 400 } else { 16 };
    while out.len() > keep {
        let i = rng.below(out.len());
        out.swap_remove(i);
    }
    out
}

/// The byte ranges of numbers standing alone in an attribute value or
/// between tags.
fn numbers(src: &str) -> Vec<(usize, usize)> {
    let b = src.as_bytes();
    let mut out = Vec::new();
    let mut i = 0;
    while i < b.len() {
        let starts = (b[i].is_ascii_digit() || b[i] == b'-')
            && i > 0
            && matches!(b[i - 1], b'"' | b'>' | b' ' | b'(' | b',');
        if starts {
            let mut j = i + 1;
            while j < b.len() && (b[j].is_ascii_digit() || b[j] == b'.') {
                j += 1;
            }
            let text = &src[i..j];
            if j < b.len()
                && matches!(b[j], b'"' | b'<' | b' ' | b')' | b',')
                && text.parse::<f64>().is_ok()
            {
                out.push((i, j));
            }
            i = j;
        } else {
            i += 1;
        }
    }
    out
}

/// Where each tag starts.
fn tag_starts(src: &str) -> Vec<usize> {
    src.match_indices('<').map(|(i, _)| i).collect()
}

/// The byte ranges of self-closing elements.
fn self_closing(src: &str) -> Vec<(usize, usize)> {
    let mut out = Vec::new();
    for (i, _) in src.match_indices('<') {
        if src[i + 1..].starts_with('/') {
            continue;
        }
        if let Some(end) = src[i..].find('>') {
            let tag = &src[i..i + end + 1];
            if tag.ends_with("/>") && !tag[1..].contains('<') {
                out.push((i, i + end + 1));
            }
        }
    }
    out
}

/// The names the document gives.
fn names(src: &str) -> Vec<String> {
    src.match_indices("name=\"")
        .filter_map(|(i, m)| {
            let rest = &src[i + m.len()..];
            let end = rest.find('"')?;
            let n = &rest[..end];
            (!n.is_empty() && n.chars().all(|c| c.is_ascii_alphanumeric() || c == '_'))
                .then(|| n.to_string())
        })
        .collect()
}
