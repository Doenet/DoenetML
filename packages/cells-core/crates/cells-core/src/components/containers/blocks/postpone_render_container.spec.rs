//! `_postponeRenderContainer`: the parser's wrapper around a solution's
//! content, or a proof's with `postponeRendering`. It is looked through, so
//! the sections in it are numbered as if it were not there.

use crate::spec;

spec! {
    postpone_render_container;

    case "the sections a proof postpones count from 1" {
        doenet r#"<section name="s">
                    <subsection name="a"/>
                    <proof postponeRendering><title>Why</title><subsection name="x"/><subsection name="y"/></proof>
                    <subsection name="b"/>
                  </section>"#;
        expect { "a.number" = 1, "x.number" = 1, "y.number" = 2, "b.number" = 2 }
    }

    case "the values a solution postpones are built" {
        doenet r#"<numberInput name="n" value="3"/>
                  <solution><p><number name="sq">$n^2</number></p></solution>"#;
        expect { "sq.value" = 9 }
        request { "n.value" = 4 }
        expect { "sq.value" = 16 }
    }
}
