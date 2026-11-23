//! Layout and presentation containers beside the text markup: a titled
//! `<table>` around a `<tabular>`, an `<sbsGroup>` of side-by-sides, an
//! `<asList>`, a `<latex>` snippet, the graph's axis labels, and the
//! PreTeXt wrappers `<pretext>`, `<article>` and `<book>`.
//!
//! None has props: what each looks like is its renderer's, from its
//! children and its attributes. What the core cares about is where its
//! sections are numbered, and what it shows in text. A table numbers the
//! sections inside it among themselves, as a figure does, and is itself
//! unnumbered: its number ("Table 2") runs through the document apart from
//! the sections in the current core, which the core here does not keep
//! (see [`blocks`](super::blocks)). An sbsGroup, an asList and the PreTeXt
//! wrappers are looked through: a section inside one is numbered among the
//! sections around it.

use crate::components::{ComponentDef, TextKind};

/// The definition of `<table>`.
mod table {
    use crate::components::define::*;

    component! {
        /// A table: its `<title>`, under the word "Table", then its
        /// content, usually a `<tabular>`.
        tags: ["table"],
        flags: [container],
        presentation { suppressTableNameInTitle, number }
        planner: Props,
    }
}

/// The definition of `<sbsGroup>`.
mod sbs_group {
    use crate::components::define::*;

    component! {
        /// A group of `<sideBySide>`s, one above the other, sharing the
        /// `widths` a side-by-side gives none of.
        tags: ["sbsGroup"],
        flags: [container],
        structure: Transparent,
        presentation { widths }
        planner: Props,
    }
}

/// The definition of `<latex>`.
mod latex {
    use crate::components::define::*;

    component! {
        /// A snippet of LaTeX: its text as written, and the LaTeX of the
        /// values inside it.
        tags: ["latex"],
        flags: [container],
        planner: Props,
    }
}

/// The definition every PreTeXt wrapper is.
mod wrapper {
    use crate::components::define::*;

    component! {
        /// A PreTeXt wrapper around a document's content, looked through.
        tags: ["pretext"],
        flags: [container],
        structure: Transparent,
        planner: Props,
    }
}

/// The definition of the axis labels.
mod axis_label {
    use crate::components::define::*;

    component! {
        /// `<xLabel>` and `<yLabel>`: a graph's axis labels, which the
        /// prototype's graph does not draw.
        tags: ["xLabel", "yLabel"],
        flags: [container],
        renders: Never,
        planner: Props,
    }
}

/// `<table>`.
pub(crate) const TABLE: ComponentDef = table::DEFINITION;
/// `<sbsGroup>`.
pub(crate) const SBS_GROUP: ComponentDef = sbs_group::DEFINITION;
/// `<asList>`: a `<group asList>`, its children shown separated by commas;
/// its text is theirs, so separated.
pub(crate) const AS_LIST: ComponentDef = super::group::DEFINITION
    .with_tags(&["asList"])
    .text(TextKind::Separated(", "));
/// `<latex>`.
pub(crate) const LATEX: ComponentDef = latex::DEFINITION;
/// `<pretext>`: the root of a PreTeXt document.
pub(crate) const PRETEXT: ComponentDef = wrapper::DEFINITION;
/// `<article>`: a PreTeXt article.
pub(crate) const ARTICLE: ComponentDef = wrapper::DEFINITION.with_tags(&["article"]);
/// `<book>`: a PreTeXt book.
pub(crate) const BOOK: ComponentDef = wrapper::DEFINITION.with_tags(&["book"]);
/// `<xLabel>` and `<yLabel>`.
pub(crate) const AXIS_LABEL: ComponentDef = axis_label::DEFINITION;

#[cfg(all(test, feature = "testing"))]
#[path = "layout.spec.rs"]
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
    fn an_as_list_shows_its_children_separated_by_commas() {
        assert_eq!(
            text(
                r#"<p name="p">s = <asList><number>1</number> <number>2</number><text>three</text></asList></p>"#,
                "p"
            ),
            "s = 1, 2, three"
        );
    }

    #[test]
    fn a_table_shows_its_title_and_content() {
        assert_eq!(
            text(
                r#"<table name="t"><title>Data</title><tabular><row><cell>1</cell></row></tabular></table>"#,
                "t"
            ),
            "Data1"
        );
    }
}
