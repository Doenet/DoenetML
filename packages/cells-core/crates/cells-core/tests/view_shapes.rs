//! The viewer's copy of the view shapes (ADR 0016):
//! `packages/cells-viewer/src/generated/shapes.ts`, written from the
//! component tables so the viewer binds props by the positions the core
//! lays them out at. Fails when the file is stale; `SHAPES_UPDATE=1`
//! rewrites it.

use cells_core::components::ComponentType;
use cells_core::components::view::Prim;
use std::fmt::Write as _;
use std::path::Path;

fn render() -> String {
    let mut out = String::from(
        "// Generated from the cells core's component tables by\n\
         // `crates/cells-core/tests/view_shapes.rs`; do not edit.\n\
         // `SHAPES_UPDATE=1 cargo test --test view_shapes` rewrites it.\n\n\
         /** Each primitive's slots, in the order a shape binds them. */\n\
         export const PRIM_SLOTS = {\n",
    );
    for p in Prim::ALL {
        let slots: Vec<String> = p.slots().iter().map(|s| format!("{s:?}")).collect();
        writeln!(out, "    {}: [{}],", p.name(), slots.join(", ")).unwrap();
    }
    out.push_str(
        "} as const;\n\nexport type Prim = keyof typeof PRIM_SLOTS;\n\n\
         /** A primitive and the position, in its component's props, of the\n \
         * prop each of its slots binds. */\n\
         export type PrimUse = { prim: Prim; at: readonly number[] };\n\
         export type Shape = { name: string; nodes: readonly PrimUse[] };\n\n\
         /** By component tag, the type's shapes: a component's shape column\n \
         * indexes this list (255: none). */\n\
         export const SHAPES: Record<string, readonly Shape[]> = {\n",
    );
    for &k in ComponentType::ALL {
        if k.shapes().is_empty() {
            continue;
        }
        writeln!(out, "    {}: [", k.tag()).unwrap();
        for s in k.shapes() {
            writeln!(out, "        {{").unwrap();
            writeln!(out, "            name: {:?},", s.name).unwrap();
            writeln!(out, "            nodes: [").unwrap();
            for n in s.nodes {
                let at: Vec<String> = n.props().iter().map(|a| a.to_string()).collect();
                writeln!(
                    out,
                    "                {{ prim: {:?}, at: [{}] }},",
                    n.prim.name(),
                    at.join(", ")
                )
                .unwrap();
            }
            writeln!(out, "            ],").unwrap();
            writeln!(out, "        }},").unwrap();
        }
        writeln!(out, "    ],").unwrap();
    }
    out.push_str("};\n");
    out
}

#[test]
fn the_viewers_shapes_are_current() {
    let path =
        Path::new(env!("CARGO_MANIFEST_DIR")).join("../../../cells-viewer/src/generated/shapes.ts");
    let want = render();
    if std::env::var_os("SHAPES_UPDATE").is_some() {
        std::fs::create_dir_all(path.parent().unwrap()).unwrap();
        std::fs::write(&path, &want).unwrap();
        return;
    }
    let got = std::fs::read_to_string(&path).unwrap_or_default();
    assert!(
        got == want,
        "{} is stale: rerun with SHAPES_UPDATE=1",
        path.display()
    );
}
