//! The standing round trip of ADR 0024: every interactive number cell of
//! the golden set (`crates/cells-bench/golden`) and `fixtures/sir.doenet`
//! is requested at several values, an x/y pair as a point group
//! (`testing::round_trip`). Each request must come out exact, projected,
//! unchanged, dropped or rebuilt, except the ones [`KNOWN_UNSTABLE`] lists.
//!
//! The list may only shrink. It holds the requests a composed inverse gets
//! wrong today because the value it writes reaches the requested cell along
//! more than one path (ADR 0024's fix 2 refuses them), counted by document
//! and by the row `testing::round_trip` gives them. The test fails when a
//! row has more unstable requests than listed, or fewer: a fix removes its
//! row with it. And every unstable request must be multipath, as the
//! survey found (`docs/composed-inverses.md`).
//!
//! The generated fixtures (`npm run fixtures`) are left out: each is one
//! synthetic shape at up to 100,000 elements, where a sweep, a copy of the
//! document per request, costs the square of the size.

use cells_core::testing::round_trip::{Class, sweep};
use cells_core::testing::test_utils::{load, repo_root};
use std::collections::BTreeMap;

/// Unstable requests by document and row, as of ADR 0024's step 3.
const KNOWN_UNSTABLE: &[(&str, &str, usize)] = &[
    // `i = max(f / b, n) + a`, where `a`, `b` and `f` are computed from `n`.
    ("ops", "number value", 5),
    // The point whose x is `$i`.
    ("ops", "point (x, y)", 4),
    // The iterates `S − b·S·I` and its kin reach S and I along many paths.
    ("sir", "point (x, y)", 3044),
    ("sir", "tuple x1", 4000),
    ("sir", "tuple x2", 3680),
];

#[test]
fn every_request_round_trips_but_the_known_unstable() {
    let root = repo_root();
    let mut paths: Vec<_> = std::fs::read_dir(root.join("crates/cells-bench/golden"))
        .unwrap()
        .flatten()
        .map(|e| e.path())
        .filter(|p| p.extension().is_some_and(|x| x == "doenet"))
        .collect();
    paths.sort();
    assert!(paths.len() >= 11, "the golden set is missing");
    paths.push(root.join("fixtures/sir.doenet"));

    let mut unstable: BTreeMap<(String, String), usize> = BTreeMap::new();
    let mut failures = Vec::new();
    let mut requests = 0;
    for path in &paths {
        let name = path.file_stem().unwrap().to_string_lossy().to_string();
        let doc = load(&std::fs::read_to_string(path).unwrap())
            .unwrap_or_else(|e| panic!("{name} does not load: {e}"));
        for o in sweep(&doc) {
            requests += 1;
            if o.class != Class::Unstable {
                continue;
            }
            if !o.multipath {
                failures.push(format!(
                    "{name}: {} asked {:?} got {:?}: unstable without reaching its source twice",
                    o.row, o.asked, o.got
                ));
            }
            *unstable.entry((name.clone(), o.row)).or_default() += 1;
        }
    }
    let known: BTreeMap<(String, String), usize> = KNOWN_UNSTABLE
        .iter()
        .map(|&(d, r, n)| ((d.to_string(), r.to_string()), n))
        .collect();
    for (key, &n) in &unstable {
        match known.get(key) {
            None => failures.push(format!("{}: {}: {n} unstable requests", key.0, key.1)),
            Some(&k) if k != n => failures.push(format!(
                "{}: {}: {n} unstable requests, {k} listed (a fix removes or lowers its row)",
                key.0, key.1
            )),
            _ => {}
        }
    }
    for (key, k) in &known {
        if !unstable.contains_key(key) {
            failures.push(format!(
                "{}: {}: none unstable, {k} listed (remove its row)",
                key.0, key.1
            ));
        }
    }
    assert!(requests > 18_000, "only {requests} requests were swept");
    assert!(
        failures.is_empty(),
        "{} failures in {requests} requests:\n{}",
        failures.len(),
        failures.join("\n")
    );
}
