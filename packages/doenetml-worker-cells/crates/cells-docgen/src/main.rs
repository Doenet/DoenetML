//! Usage: cells-docgen <spec>            print one document (e.g. chain-1000)
//!        cells-docgen --legacy <spec>   the current-core counterpart (see `legacy_from_spec`)
//!        cells-docgen --sweep           print the default sweep specs, one per line
fn main() {
    let mut args = std::env::args().skip(1);
    let mut arg = args.next().unwrap_or_default();
    let legacy = arg == "--legacy";
    if legacy {
        arg = args.next().unwrap_or_default();
    }
    if arg == "--sweep" {
        for s in cells_docgen::DEFAULT_SWEEP {
            println!("{s}");
        }
        return;
    }
    let doc = if legacy {
        cells_docgen::legacy_from_spec(&arg)
    } else {
        cells_docgen::from_spec(&arg)
    };
    match doc {
        Some(doc) => print!("{doc}"),
        None => {
            eprintln!(
                "usage: cells-docgen <points|chain|fanout|aliases>-<N> | grid-<N>x<L> | --sweep"
            );
            std::process::exit(2);
        }
    }
}
