//! The two recompute strategies agree: every golden document, loaded twice,
//! one ticking through every instruction and one through the dirty closure
//! (what the browser runs), is taken through the golden script (point and
//! sticky drags, inputs, answers, rebuilds), and after every step the two
//! hold the same bits in every cell and report the same changed cells.

use cells_bench::script::{apply, describe, plan, sources};
use cells_core::Document;

#[test]
fn full_and_dirty_closure_recompute_agree() {
    let root = cells_core::testing::test_utils::repo_root();
    let docs = sources(&root);
    assert!(docs.len() >= 30, "the golden set is missing");
    let mut steps = 0;
    for (name, path) in docs {
        let json =
            cells_core::testing::test_utils::dast_json(&std::fs::read_to_string(&path).unwrap());
        let Ok(mut full) = Document::from_bytes(json.as_bytes()) else {
            continue;
        };
        let mut dirty = Document::from_bytes(json.as_bytes()).unwrap();
        assert!(full.set_evaluator("full"));
        assert_eq!(dirty.evaluator(), "dirty-closure");
        for (path, action) in plan(&full) {
            let at = format!("{name}: {path}: {}", describe(&action));
            let (Some(a), Some(b)) = (
                apply(&mut full, &path, &action),
                apply(&mut dirty, &path, &action),
            ) else {
                continue;
            };
            steps += 1;
            assert_eq!(a.rebuilt, b.rebuilt, "{at}");
            assert_eq!(a.dropped.len(), b.dropped.len(), "{at}");
            let sorted = |mut c: Vec<u32>| {
                c.sort_unstable();
                c
            };
            assert_eq!(sorted(a.changed), sorted(b.changed), "{at}: changed cells");
            let bits = |d: &Document| d.cells.iter().map(|v| v.to_bits()).collect::<Vec<_>>();
            assert!(bits(&full) == bits(&dirty), "{at}: the cells differ");
        }
    }
    assert!(steps >= 120, "only {steps} steps ran");
}
