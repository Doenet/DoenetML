//! Text markup (`<em>`, `<q>`, `<tag>`, ...), the characters (`<mdash/>`,
//! `<lq/>`, ...), `<br/>` and `<hr/>`, the plain blocks (`<div>`, `<pre>`,
//! `<blockQuote>`) and `<ol>`: none has props, so a case checks that the
//! tags load with no diagnostic and that what they hold computes and
//! inverts as anywhere else. What they show in text is checked by the
//! tests in `markup.rs`.

use crate::spec;

spec! {
    markup;

    case "an input and a value inside inline markup" {
        doenet r#"<p>
                    <em><numberInput name="k" value="2"><label>k</label></numberInput></em>
                    <alert><q><number name="d">2$k</number></q></alert>
                    <sq><c><number name="e">$k+1</number></c></sq>
                    <term>t</term> <attr>a</attr> <span>s</span>
                    <tag>p</tag> <tagc>p</tagc> <tage>br</tage>
                  </p>"#;
        expect { "k.value" = 2, "d.value" = 4, "e.value" = 3 }
        request { "k.value" = 5 }
        expect { "d.value" = 10, "e.value" = 6 }
    }

    case "every character, a break and a rule load with nothing to say" {
        doenet r#"<p>1<ndash/>2<mdash/>3<nbsp/>4<ellipsis/>
                    <lq/>q<rq/> <lsq/>s<rsq/><br/><number name="n">1</number></p>
                  <hr/>"#;
        expect { "n.value" = 1 }
    }

    case "values in the plain blocks" {
        doenet r#"<div>
                    <pre><numberInput name="a" value="1"><label>a</label></numberInput></pre>
                    <blockQuote><number name="b">$a+1</number></blockQuote>
                  </div>"#;
        expect { "b.value" = 2 }
        request { "a.value" = 4 }
        expect { "b.value" = 5 }
    }

    case "a value in an ordered list's item" {
        doenet r#"<ol>
                    <li><numberInput name="a" value="3"><label>a</label></numberInput></li>
                    <li><number name="b">2$a</number></li>
                  </ol>"#;
        expect { "b.value" = 6 }
        request { "a.value" = -1 }
        expect { "b.value" = -2 }
    }

    case "an attribute nothing reads is refused" {
        doenet r#"<em color="red">hot</em><number name="n">1</number>"#;
        expect { "n.value" = 1 }
        diagnostics["cells-unsupported-attribute"]
    }
}
