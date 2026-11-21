//! `<proof>`: a division that takes no number, whose sections are numbered
//! among themselves (`sectioning.test.ts`, "a <proof> bounds the sequence").

use crate::spec;

spec! {
    proof;

    case "a proof bounds the sequence and takes no place in it" {
        doenet r#"<section name="s">
                    <subsection name="a"/>
                    <proof startOpen><subsection name="inProof" includeParentNumber="false"/></proof>
                    <subsection name="b"/>
                  </section>"#;
        expect { "a.number" = 1, "inProof.number" = 1, "b.number" = 2 }
    }

    case "a theorem after a proof follows the theorem before it" {
        doenet r#"<theorem name="t1"/><proof boxed><title>Proof of the first</title><p>Clear.</p></proof><theorem name="t2"/>"#;
        expect { "t1.number" = 1, "t2.number" = 2 }
    }
}
