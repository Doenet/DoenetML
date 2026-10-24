//! Usage: cells-docgen <spec>     print one document (e.g. chain-1000)
//!        cells-docgen --sweep    print the default sweep specs, one per line
fn main() {
    let arg = std::env::args().nth(1).unwrap_or_default();
    if arg == "--sweep" {
        for s in cells_docgen::DEFAULT_SWEEP {
            println!("{s}");
        }
        return;
    }
    match cells_docgen::from_spec(&arg) {
        Some(doc) => print!("{doc}"),
        None => {
            eprintln!("usage: cells-docgen <shape>-<N> | grid-<N>x<L> | --sweep");
            std::process::exit(2);
        }
    }
}
