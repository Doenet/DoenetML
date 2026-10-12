//! Load a fixture and print its components and the first cells, for debugging.
use cells_core::{Child, Document};
fn main() {
    let spec = std::env::args().nth(1).unwrap();
    let json = cells_bench::fixture_json(&spec);
    let doc = Document::from_bytes(json.as_bytes()).unwrap();
    println!(
        "cells={} essential={} fixed={} instrs={} comps={}",
        doc.cells.len(),
        doc.n_essential,
        doc.n_fixed,
        doc.program.len(),
        doc.n_components()
    );
    for c in 0..doc.n_components().min(12) as u32 {
        let kids: Vec<String> = doc
            .children(c)
            .take(5)
            .map(|k| match k {
                Child::Component(i) => format!("#{i}"),
                Child::Text(t) => format!("{t:?}"),
            })
            .collect();
        let cells: Vec<String> = doc
            .comp_cells(c)
            .iter()
            .map(|&i| format!("{}={}", i, doc.cells[i as usize]))
            .collect();
        println!(
            "#{c} {:?} name={:?} parent={:?} cells=[{}] kids={:?}",
            doc.component_type(c),
            doc.name(c),
            doc.parent(c),
            cells.join(" "),
            kids
        );
    }
    if let Some(p) = doc.component("p") {
        println!(
            "p: {:?}",
            doc.comp_cells(p)
                .iter()
                .map(|&i| doc.cells[i as usize])
                .collect::<Vec<_>>()
        );
    }
}
