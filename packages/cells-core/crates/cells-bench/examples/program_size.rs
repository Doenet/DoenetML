//! The size of each golden document's program (and the smallest fixture of
//! each shape): cells, essential cells and instructions, as a Markdown
//! table. For comparing what an alternative in
//! `docs/tick-design-decisions.md` does to real documents' programs:
//! run it on each side.
//!
//!   cargo run --release -p cells-bench --example program_size

use cells_bench::script::sources;
use cells_core::testing::test_utils::{load, repo_root};

fn main() {
    println!("| document | cells | essential | instructions |");
    println!("|---|---:|---:|---:|");
    for (name, path) in sources(&repo_root()) {
        let doc = load(&std::fs::read_to_string(&path).unwrap()).unwrap();
        println!(
            "| {name} | {} | {} | {} |",
            doc.cells.len(),
            doc.n_essential,
            doc.program.len()
        );
    }
}
