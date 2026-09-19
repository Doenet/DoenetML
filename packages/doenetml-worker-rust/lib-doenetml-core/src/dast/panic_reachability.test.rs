//! Whether an author's markup can reach a `panic!` on the document-build path.
//!
//! A panic in wasm is a trap, so it takes the whole document down rather than
//! producing a diagnostic, and the instance is poisoned afterwards -- there is
//! no rendering the rest of the document and no reporting the error next to the
//! markup that caused it. A condition an author can cause therefore has to be a
//! `Result` that becomes a diagnostic; only a broken internal invariant may
//! panic (#1921).
//!
//! `ParentIterator` panicked on `<function name="f" variables="x">x^2</function>
//! <p>$$f(<math>3</math>)</p>` until #1912, for years, because nothing had ever
//! run that shape end to end -- the only test asserted the DAST. This file is
//! the standing answer to "are there more of those?": it runs documents through
//! `FlatRoot::from_dast`, `Expander::expand` and `calculate_root_names` -- the
//! three the viewer runs before any component exists -- and asserts what each
//! one does with them.
//!
//! The audit found one. `ref_expand.rs`'s "Expected an element" is reachable
//! from ordinary markup, and `an_index_into_a_composite_of_refs_traps` pins the
//! shapes that reach it. It fails the same way on `main` and is tracked in
//! #1942, which is where the choice between reporting it and resolving it
//! whatever the order belongs -- so #1921's own instruction, to convert the
//! reachable ones, is not carried out here and #1921 stays open.

use std::panic;

use super::*;
use crate::dast::flat_dast::FlatRoot;
use crate::test_utils::*;

/// Run `source` through `FlatRoot::from_dast`, `Expander::expand` and
/// `calculate_root_names`, returning the panic message if it panics.
///
/// `calculate_root_names` is here because it is the only caller of
/// `breadth_first_traversal`, which holds the "Cycles detected in references"
/// panic. Without it the corpus would say nothing at all about that site, while
/// reading as though it did. The viewer calls it for every document
/// (`ResolverAdapter.ts`), so running it is what the corpus already claimed to
/// be doing.
///
/// The panic hook is deliberately left alone. Silencing it would print less on
/// a failing run, but `panic::set_hook` is process-global while `cargo test`
/// runs tests on several threads, so swapping it here would reach into every
/// test running alongside. libtest captures each test's output and discards it
/// on a pass, so a caught panic costs nothing on a green run either way.
fn panic_message_for(source: &str) -> Option<String> {
    let dast_root = dast_root_no_position(source);

    let result = panic::catch_unwind(panic::AssertUnwindSafe(|| {
        let mut flat_root = FlatRoot::from_dast(&dast_root);
        let resolver = Expander::expand(&mut flat_root);
        resolver.calculate_root_names();
    }));

    result.err().map(|payload| {
        payload
            .downcast_ref::<&str>()
            .map(|s| s.to_string())
            .or_else(|| payload.downcast_ref::<String>().cloned())
            .unwrap_or_else(|| "<non-string panic payload>".to_string())
    })
}

/// The harness has to be able to see a panic, or "nothing panicked" below means
/// only that nothing was looked at. Without this, a `catch_unwind` that stopped
/// working -- or a build with `panic = "abort"`, where it cannot work -- would
/// turn the corpus into a test that passes by doing nothing.
///
/// The panic it provokes goes to the hook, which prints -- but libtest captures
/// a test's output and discards it when the test passes, so a green run is
/// silent and only a failing one shows it. Measured: this test prints the
/// message once under `--nocapture` and not at all without it.
#[test]
fn the_probe_detects_a_panic() {
    let result = panic::catch_unwind(|| panic!("deliberate probe panic"));

    let message = result
        .err()
        .and_then(|payload| payload.downcast_ref::<&str>().map(|s| s.to_string()));

    assert_eq!(message.as_deref(), Some("deliberate probe panic"));
}

/// Documents aimed at each explicit `panic!` remaining under `dast/`:
///
/// - `ref_resolve/node_traversal.rs` "Cycles detected in references"
/// - `ref_expand.rs` (x2) "Expected an element"
/// - `flat_dast/untagged_flat_dast_merge.rs` (x3) `set_*` on the wrong node kind
///
/// One shape does reach the first of the two `ref_expand.rs` sites; it is
/// pinned separately in `an_index_into_a_composite_of_refs_traps` rather than
/// left here to fail.
///
/// Every one is a shape the parser accepts, which is what makes running
/// documents the right way to probe them rather than reasoning per site.
#[test]
fn no_document_reaches_a_panic() {
    let sources = vec![
        // Reference cycles, for `node_traversal`'s cycle guard.
        r#"<math name="a" extend="$b" /><math name="b" extend="$a" />"#,
        r#"<math name="a" extend="$a" />"#,
        r#"<math name="a" extend="$b" /><math name="b" extend="$c" /><math name="c" extend="$a" />"#,
        r#"<group name="g">$g</group>"#,
        r#"<group name="g"><p>$g</p></group>"#,
        r#"<p name="p">$p</p>"#,
        r#"<section name="s">$s</section>"#,
        r#"<repeat name="r" for="1 2" valueName="v">$r</repeat>"#,
        r#"<module name="m"><p>$m</p></module>"#,
        r#"<a name="x">$y</a><a name="y">$x</a>"#,
        r#"<point name="p" /><point name="q" extend="$p.x" /><point name="p2" extend="$q" />"#,
        // A referent that is not an element, for `ref_expand`'s two sites.
        r#"$p"#,
        r#"<p name="p">x</p>$p.nonexistent"#,
        r#"<p name="p" bogus="1">x</p>$p"#,
        r#"<point name="p" />$p.x.y.z"#,
        r#"<point name="p" />$p[1][2][3]"#,
        r#"<point name="p" />$p[<point/>]"#,
        r#"<point name="p" />$p{link="false"}"#,
        // Function references, which build an `<ol>` of `<li>` per input.
        r#"<function name="f" variables="x y">x+y</function>$$f(1,2)"#,
        r#"<function name="f" variables="x y">x+y</function>$$f(<math>1</math>,<math>2</math>)"#,
        r#"<function name="f" variables="x">x</function>$$f()"#,
        r#"<function name="f" variables="x">x</function>$$f($$f(1))"#,
        r#"<function name="f" variables="x">x</function>$$f(<p>a</p>,<p>b</p>,<p>c</p>)"#,
        r#"<function name="f" variables="x">x</function>$$f[1](2,3)"#,
        r#"<function name="f" variables="x">x</function>$$f[<math>1</math>](2,3)"#,
        // A function reference with no function, and non-function referents,
        // for the `set_*`-on-the-wrong-node-kind sites.
        r#"$$f(1,2)"#,
        r#"<p>$$f(1,2)</p>"#,
        r#"<math name="m">1</math>$$m(2)"#,
        r#"<text name="t">a</text>$$t(1,2)"#,
        // The shape that panicked in `ParentIterator` until #1912: an element
        // written as a function reference's argument.
        r#"<function name="f" variables="x">x^2</function><p>$$f(<math>3</math>)</p>"#,
        // Half-typed markup, which is where the parser's own throws lived.
        r#"<p>$a[<n/>][</p>"#,
        r#"<p>$$g($$f(<n/>)</p>"#,
    ];

    let reached: Vec<String> = sources
        .iter()
        .filter_map(|source| {
            panic_message_for(source).map(|message| format!("{source}\n    -> {message}"))
        })
        .collect();

    assert!(
        reached.is_empty(),
        "documents reached a panic on the build path:\n  {}",
        reached.join("\n  ")
    );
}

/// The one the audit found: `ref_expand.rs`'s first "Expected an element" is
/// reachable from ordinary markup, so it is not the internal invariant the
/// other five are.
///
/// `resolve` follows index resolutions as well as names, and an index
/// resolution is recorded for whatever a composite's child happens to be
/// (`ref_resolve/index_resolutions.rs`) -- no element check, unlike the name
/// side. `expand_refs` walks nodes in ascending index order, so an `$g[1]`
/// written *before* the group resolves to a child that is still a
/// `FlatNode::Ref`, and traps. Writing the group first expands the child before
/// the index reaches it, which is why the shape is order-dependent and why the
/// corpus above misses it.
///
/// This is pinned rather than fixed. It traps identically on `main`, and
/// turning it into a `FlatError` means choosing a message and a diagnostic code
/// for it, which is a change of its own. The assertion is the wrong way round
/// on purpose: the day the site becomes a diagnostic, this test fails and says
/// what to delete.
#[test]
fn an_index_into_a_composite_of_refs_traps() {
    let sources = vec![
        r#"$g[1]<group name="g">$x</group><p name="x">hello</p>"#,
        r#"$g[1]<group name="g">$nothere</group>"#,
        r#"$g[1]<group name="g">$$f(1)</group>"#,
        r#"$g[1].y<group name="g">$x</group><p name="x">hello</p>"#,
    ];

    for source in &sources {
        assert_eq!(
            panic_message_for(source).as_deref(),
            Some("Expected an element"),
            "expected this shape to still trap: {source}"
        );
    }

    // The control: the same document with the group written before the index
    // expands the child first, and does not trap. Without it, the assertions
    // above would also pass if every document panicked for some unrelated
    // reason.
    assert_eq!(
        panic_message_for(r#"<p name="x">hello</p><group name="g">$x</group>$g[1]"#),
        None
    );
}
