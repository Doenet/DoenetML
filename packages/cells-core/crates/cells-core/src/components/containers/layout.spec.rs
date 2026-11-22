//! The layout and presentation containers (`<table>`, `<sbsGroup>`,
//! `<asList>`, `<latex>`, the axis labels and the PreTeXt wrappers): none
//! has props, so a case checks that each loads with no diagnostic, that
//! what it holds computes and inverts as anywhere else, and where the
//! sections inside it are numbered (`sectioning.test.ts`, "figures and
//! tables are numbered in their own sequence"). What they show in text is
//! checked by the tests in `layout.rs`.

use crate::spec;

spec! {
    layout;

    case "a table takes no place among the divisions" {
        doenet r#"<section name="a"/>
                  <table suppressTableNameInTitle number="false">
                    <title>Values</title>
                    <tabular><row><cell><number name="n">2</number></cell></row></tabular>
                  </table>
                  <section name="b"/>"#;
        expect { "a.number" = 1, "b.number" = 2, "n.value" = 2 }
    }

    case "a section inside a table is numbered from 1" {
        doenet r#"<section name="a"/><section name="b"/>
                  <table><section name="c"/></table>"#;
        expect { "b.number" = 2, "c.number" = 1 }
    }

    case "an input in a side-by-side of a group" {
        doenet r#"<sbsGroup widths="30% 70%">
                    <sideBySide>
                      <p><numberInput name="k" value="2"><label>k</label></numberInput></p>
                      <p><number name="d">2$k</number></p>
                    </sideBySide>
                    <sideBySide widths="50% 50%"><p>a</p><p>b</p></sideBySide>
                  </sbsGroup>"#;
        expect { "d.value" = 4 }
        request { "k.value" = 5 }
        expect { "d.value" = 10 }
    }

    case "values in an asList and a latex snippet" {
        doenet r#"<p><asList><number name="a">1</number><number name="b">$a+1</number></asList></p>
                  <p><latex>\frac{<number name="c">$b+1</number>}{2}</latex></p>"#;
        expect { "a.value" = 1, "b.value" = 2, "c.value" = 3 }
    }

    case "the PreTeXt wrappers are looked through" {
        doenet r#"<section name="a"/>
                  <pretext><book><section name="b"/></book><article><section name="c"/></article></pretext>"#;
        expect { "a.number" = 1, "b.number" = 2, "c.number" = 3 }
    }

    case "a graph's axis labels load" {
        doenet r#"<graph name="g" xmin="-3"><xLabel>x</xLabel><yLabel><m>y</m></yLabel>
                    <point name="P">(1,2)</point></graph>"#;
        expect { "g.xmin" = -3, "P.x" = 1 }
    }
}
