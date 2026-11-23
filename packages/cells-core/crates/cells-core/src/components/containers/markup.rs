//! Text markup: the inline tags around text (`<em>`, `<q>`, `<c>`, ...),
//! the single characters (`<mdash/>`, `<lq/>`, ...) with the line break and
//! the rule, the plain blocks (`<div>`, `<pre>`, `<blockQuote>`), and the
//! ordered list. None has props: what each looks like is its renderer's.
//! Each tag is a type of its own, built from one of three definitions, so
//! a renderer is told which tag it draws.
//!
//! What each shows in text is the current core's `text`: an inline tag
//! its children's, a `<q>`, `<sq>` or `<tag>` between its delimiters, a
//! character the character, a break or a rule nothing.

use crate::components::{ComponentDef, TextKind};

/// The definition every inline tag is: a container around its children.
mod inline {
    use crate::components::define::*;

    component! {
        /// An inline tag around text.
        tags: ["em"],
        flags: [container],
        planner: Props,
    }
}

/// The definition every character, break and rule is: no children, no
/// props.
mod character {
    use crate::components::define::*;

    component! {
        /// An empty element: a character, a break or a rule.
        tags: ["ndash"],
        children: None,
        planner: Props,
    }
}

/// The definition every plain block is: a container around its children.
mod block {
    use crate::components::define::*;

    component! {
        /// A block around its children.
        tags: ["div"],
        flags: [container],
        planner: Props,
    }
}

/// `<em>`: emphasized text.
pub(crate) const EM: ComponentDef = inline::DEFINITION;
/// `<alert>`: bold text.
pub(crate) const ALERT: ComponentDef = inline::DEFINITION.with_tags(&["alert"]);
/// `<term>`: a term being defined, drawn as an `<alert>`.
pub(crate) const TERM: ComponentDef = inline::DEFINITION.with_tags(&["term"]);
/// `<q>`: double-quoted text; its text is between straight quotes, as the
/// current core's.
pub(crate) const Q: ComponentDef = inline::DEFINITION
    .with_tags(&["q"])
    .text(TextKind::Delimited("\"", "\""));
/// `<sq>`: single-quoted text.
pub(crate) const SQ: ComponentDef = inline::DEFINITION
    .with_tags(&["sq"])
    .text(TextKind::Delimited("'", "'"));
/// `<c>`: inline code.
pub(crate) const C: ComponentDef = inline::DEFINITION.with_tags(&["c"]);
/// `<attr>`: an attribute name, drawn as code.
pub(crate) const ATTR: ComponentDef = inline::DEFINITION.with_tags(&["attr"]);
/// `<span>`: an inline container with no look of its own.
pub(crate) const SPAN: ComponentDef = inline::DEFINITION.with_tags(&["span"]);
/// `<tag>`: its text as an opening tag, `<text>`.
pub(crate) const TAG: ComponentDef = inline::DEFINITION
    .with_tags(&["tag"])
    .text(TextKind::Delimited("<", ">"));
/// `<tagc>`: its text as a closing tag, `</text>`.
pub(crate) const TAGC: ComponentDef = inline::DEFINITION
    .with_tags(&["tagc"])
    .text(TextKind::Delimited("</", ">"));
/// `<tage>`: its text as a self-closing tag, `<text/>`.
pub(crate) const TAGE: ComponentDef = inline::DEFINITION
    .with_tags(&["tage"])
    .text(TextKind::Delimited("<", "/>"));

/// The definition of the character `tag` stands for.
const fn character(tag: &'static [&'static str], text: &'static str) -> ComponentDef {
    character::DEFINITION
        .with_tags(tag)
        .text(TextKind::Delimited(text, ""))
}

/// `<ndash/>`: an en dash.
pub(crate) const NDASH: ComponentDef = character(&["ndash"], "–");
/// `<mdash/>`: an em dash.
pub(crate) const MDASH: ComponentDef = character(&["mdash"], "—");
/// `<nbsp/>`: a non-breaking space.
pub(crate) const NBSP: ComponentDef = character(&["nbsp"], "\u{a0}");
/// `<ellipsis/>`: a horizontal ellipsis.
pub(crate) const ELLIPSIS: ComponentDef = character(&["ellipsis"], "…");
/// `<lq/>`: a left double quotation mark.
pub(crate) const LQ: ComponentDef = character(&["lq"], "“");
/// `<rq/>`: a right double quotation mark.
pub(crate) const RQ: ComponentDef = character(&["rq"], "”");
/// `<lsq/>`: a left single quotation mark.
pub(crate) const LSQ: ComponentDef = character(&["lsq"], "‘");
/// `<rsq/>`: a right single quotation mark.
pub(crate) const RSQ: ComponentDef = character(&["rsq"], "’");
/// `<br/>`: a line break; no text.
pub(crate) const BR: ComponentDef = character::DEFINITION.with_tags(&["br"]);
/// `<hr/>`: a horizontal rule, a block; no text.
pub(crate) const HR: ComponentDef = character::DEFINITION.with_tags(&["hr"]);

/// `<div>`: a block with no look of its own.
pub(crate) const DIV: ComponentDef = block::DEFINITION;
/// `<pre>`: preformatted text, its whitespace kept.
pub(crate) const PRE: ComponentDef = block::DEFINITION.with_tags(&["pre"]);
/// `<blockQuote>`: a quotation set off as a block.
pub(crate) const BLOCK_QUOTE: ComponentDef = block::DEFINITION.with_tags(&["blockQuote"]);

/// `<ol>`: an `<ul>` whose items are numbered, which is the renderer's.
pub(crate) const OL: ComponentDef = super::list::DEFINITION.with_tags(&["ol"]);

#[cfg(all(test, feature = "testing"))]
#[path = "markup.spec.rs"]
mod spec;

#[cfg(all(test, feature = "testing"))]
mod tests {
    use crate::testing::test_utils::load;

    /// The text the component named `name` shows.
    fn text(source: &str, name: &str) -> String {
        let doc = load(source).unwrap();
        doc.rendered_text(doc.resolve_path(name).unwrap())
    }

    #[test]
    fn a_character_shows_as_itself() {
        assert_eq!(
            text(r#"<p name="p">1 <ndash/> 2 <mdash/> that's it</p>"#, "p"),
            "1 – 2 — that's it"
        );
        assert_eq!(
            text(r#"<p name="p">act<nbsp/>like<nbsp/>one</p>"#, "p"),
            "act\u{a0}like\u{a0}one"
        );
        assert_eq!(
            text(r#"<p name="p">we could do that<ellipsis/></p>"#, "p"),
            "we could do that…"
        );
        assert_eq!(
            text(r#"<p name="p"><rq/><lq/><rsq/><lsq/></p>"#, "p"),
            "”“’‘"
        );
    }

    #[test]
    fn a_break_or_a_rule_shows_nothing() {
        assert_eq!(text(r#"<p name="p">a<br/>b</p>"#, "p"), "ab");
        assert_eq!(text(r#"<div name="d">a<hr/>b</div>"#, "d"), "ab");
    }

    #[test]
    fn an_inline_tag_shows_its_children_between_its_delimiters() {
        assert_eq!(
            text(
                r#"<p name="p"><em>a</em> <alert>b</alert> <term>c</term> <c>d</c> <attr>e</attr> <span>f</span></p>"#,
                "p"
            ),
            "a b c d e f"
        );
        assert_eq!(
            text(r#"<p name="p"><q>hi</q> <sq>there</sq></p>"#, "p"),
            "\"hi\" 'there'"
        );
        assert_eq!(
            text(
                r#"<p name="p"><tag>p</tag><tagc>p</tagc><tage>br</tage></p>"#,
                "p"
            ),
            "<p></p><br/>"
        );
    }

    #[test]
    fn a_value_inside_markup_shows_its_value() {
        assert_eq!(
            text(
                r#"<blockQuote name="b"><em><number>3</number></em> and <q><text>x</text></q></blockQuote>"#,
                "b"
            ),
            "3 and \"x\""
        );
    }
}
