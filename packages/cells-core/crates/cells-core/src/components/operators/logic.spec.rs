//! `<and>`, `<or>`, `<xor>`, `<iff>` and `<implies>`: a boolean over their
//! operands, text pieces and references (ADR 0041).

use crate::spec;

spec! {
    logic;

    case "over boolean inputs, and a literal among them" {
        doenet r#"<booleanInput name="b1"><label>1</label></booleanInput>
                  <booleanInput name="b2"><label>2</label></booleanInput>
                  <and name="and1">$b1 $b2</and>
                  <and name="and2">$b1 $b2 true</and>
                  <or name="or1">$b1 $b2</or>
                  <or name="or2">$b1 $b2 true</or>
                  <xor name="xor1">$b1 $b2</xor>
                  <xor name="xor2">$b1 $b2 true</xor>
                  <iff name="iff">$b1 $b2</iff>
                  <implies name="imp">$b1 $b2</implies>"#;
        expect {
            "and1.value" = 0, "and2.value" = 0, "or1.value" = 0, "or2.value" = 1,
            "xor1.value" = 0, "xor2.value" = 1, "iff.value" = 1, "imp.value" = 1,
        }
        request { "b1.value" = 1 }
        expect {
            "and1.value" = 0, "or1.value" = 1, "xor1.value" = 1, "xor2.value" = 0,
            "iff.value" = 0, "imp.value" = 0,
        }
        request { "b2.value" = 1 }
        expect {
            "and1.value" = 1, "and2.value" = 1, "xor1.value" = 0, "iff.value" = 1,
            "imp.value" = 1,
        }
    }

    case "literals, whatever their case, and numbers true only at 1" {
        doenet r#"<and name="a">TRUE true 1</and>
                  <or name="o">false False 0 2</or>"#;
        expect { "a.value" = 1, "o.value" = 0 }
    }

    case "of no operands, and of one or several implications" {
        doenet r#"<and name="a"/><or name="o"/><xor name="x"/><iff name="i"/>
                  <implies name="i0"/><implies name="i1">true</implies>
                  <implies name="i3">false false false</implies>"#;
        expect {
            "a.value" = 1, "o.value" = 0, "x.value" = 0, "i.value" = 1,
            "i0.value" = 1, "i1.value" = 0, "i3.value" = 0,
        }
    }

    // A boolean cannot hold a blank, so one made from a missing operand is
    // missing, whatever the other operands are (D40, ADR 0046).
    case "a missing operand makes the value missing" {
        doenet r#"<booleanList name="l">true</booleanList>
                  <and name="a">$l[2] true</and>
                  <or name="o">$l[2] true</or>"#;
        expect { "a.value" = crate::program::MISSING, "o.value" = crate::program::MISSING }
    }

    case "a copy has its value" {
        doenet r#"<or name="o">false true</or><or name="c" extend="$o"/>
                  <boolean name="b">$o</boolean>"#;
        expect { "c.value" = 1, "b.value" = 1 }
    }

    case "a piece that is no boolean is refused" {
        doenet r#"<and name="a">true x</and>"#;
        diagnostics["cells-unsupported"]
    }
}
