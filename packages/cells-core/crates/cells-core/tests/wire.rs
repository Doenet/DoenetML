//! The binary wire format has two writers: `Dast::to_binary` and
//! `scripts/cdast-encode.mjs` (which `parse-dast.mjs --binary` runs). Both
//! hardcode the layout (magic, version, node kinds, field order, string
//! interning), so they are pinned to each other byte for byte.
use cells_core::dast::Dast;
use cells_core::testing::test_utils::{dast_binary, dast_json};

const SOURCES: &[&str] = &[
    "<point name=\"p\" x=\"1\"/>",
    // Attributes with macros and text, references with indices and props,
    // a macro with a path, nested elements, text children.
    "<numberInput name=\"n\" value=\"3\"/>\n\
<graph name=\"g\">\n\
  <repeatForSequence name=\"r\" from=\"1\" step=\"2\" length=\"$n\" valueName=\"v\" indexName=\"i\">\n\
    <math name=\"h\">0.5 $v + $r[$i-2].h</math>\n\
    <point name=\"p\" x=\"$v\" y=\"$h\"/>\n\
  </repeatForSequence>\n\
</graph>\n\
<number name=\"second\">$r[2].p.x</number>\n\
<p>Value <number>$second</number> and <text>words</text>, $g.r[1].p[1].x</p>\n\
<function name=\"f\" variables=\"S I\">(S - 2 S I, I + S I)</function>\n\
<p><conditionalContent name=\"c\"><case condition=\"$n > 0\">yes <m>x^2</m></case><else>no</else></conditionalContent></p>",
    "<text>unicode: ü ∑ 日本</text>",
    "",
];

#[test]
fn rust_encoder_matches_javascript_encoder_byte_for_byte() {
    for src in SOURCES {
        let dast = Dast::from_json(&dast_json(src)).unwrap();
        let rust = dast.to_binary();
        let js = dast_binary(src);
        assert_eq!(
            rust.len(),
            js.len(),
            "length differs for {src:?}: rust {} bytes, js {} bytes",
            rust.len(),
            js.len()
        );
        if let Some(at) = rust.iter().zip(&js).position(|(a, b)| a != b) {
            panic!(
                "byte {at} differs for {src:?}: rust {:?}, js {:?}",
                &rust[at..(at + 16).min(rust.len())],
                &js[at..(at + 16).min(js.len())]
            );
        }
        // And the Rust decoder reads the JavaScript encoder's bytes back
        // to the same DAST (re-encoded, since `Dast` has no equality).
        assert_eq!(
            Dast::from_binary(&js).unwrap().to_binary(),
            js,
            "decode of {src:?}"
        );
    }
}
