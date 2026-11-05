//! The round trip over every interactive number cell of the golden set and
//! `sir.doenet`: each request must come out exact, projected, unchanged,
//! dropped or rebuilt, never unstable. The generated fixtures are left out,
//! as a sweep costs the square of a document's size.

use cells_core::testing::round_trip::{Class, sweep};
use cells_core::testing::test_utils::{load, repo_root};

#[test]
fn every_request_round_trips() {
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

    let mut failures = Vec::new();
    let mut requests = 0;
    for path in &paths {
        let name = path.file_stem().unwrap().to_string_lossy().to_string();
        let doc = load(&std::fs::read_to_string(path).unwrap())
            .unwrap_or_else(|e| panic!("{name} does not load: {e}"));
        for o in sweep(&doc) {
            requests += 1;
            if o.class == Class::Unstable {
                failures.push(format!(
                    "{name}: {} asked {:?} got {:?}: asking again moves it",
                    o.row, o.asked, o.got
                ));
            }
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
