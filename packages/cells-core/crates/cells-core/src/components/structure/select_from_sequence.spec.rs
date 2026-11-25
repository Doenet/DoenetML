//! `<selectFromSequence>`: numbers of a sequence drawn at load from the
//! document seed (`selectfromsequence.test.ts`), the parameters the check
//! refuses (ADR 0037), and what a copy draws (ADR 0059).

use crate::spec;

spec! {
    select_from_sequence;

    case "one number of the sequence, read as a number" {
        doenet r#"<selectFromSequence name="s" from="3" to="3"/>
                  <number name="n">$s + 1</number>
                  <math name="m">$s x + 1</math>"#;
        expect { "s.value" = 3, "s.values" = 3, "s.numComponents" = 1, "n.value" = 4, "m.expr" = "3 x + 1" }
    }

    case "1 to 10 by default" {
        doenet r#"<selectFromSequence name="s"/>
                  <isBetween name="in" limits="1 10">$s</isBetween>"#;
        expect { "in.value" = 1 }
    }

    case "a length counts the sequence" {
        doenet r#"<selectFromSequence name="s" from="5" step="2" length="1"/>"#;
        expect { "s.value" = 5 }
    }

    case "several, no value twice, sorted" {
        doenet r#"<selectFromSequence name="s" from="1" to="3" numToSelect="3" sort="increasing"/>"#;
        expect { "s.values" = [1, 2, 3], "s.numComponents" = 3, "s.value" = 1 }
    }

    case "several, decreasing, less what it excludes" {
        doenet r#"<selectFromSequence name="s" from="-4" to="4" step="2" exclude="0" numToSelect="4" sort="decreasing"/>"#;
        expect { "s.values" = [4, 2, -2, -4] }
    }

    case "with replacement, a value may come again" {
        doenet r#"<selectFromSequence name="s" from="7" to="7" numToSelect="3" withReplacement/>"#;
        expect { "s.values" = [7, 7, 7] }
    }

    case "more than the sequence holds, without replacement, is refused" {
        doenet r#"<selectFromSequence name="s" from="1" to="3" numToSelect="4"/>"#;
        diagnostics["cells-choice-domain"]
    }

    case "a parameter from a constant" {
        doenet r#"<number name="n">10</number>
                  <selectFromSequence name="s" from="$n" to="$n + 2" numToSelect="3" sort/>"#;
        expect { "s.values" = [10, 11, 12] }
    }

    case "a parameter a student can change is refused" {
        doenet r#"<numberInput name="n" value="10"><label>n</label></numberInput>
                  <selectFromSequence name="s" to="$n"/>"#;
        diagnostics["cells-choice-not-constant"]
    }

    case "hidden" {
        doenet r#"<selectFromSequence name="s" from="2" to="2" hide/>"#;
        expect { "s.hide" = 1, "s.value" = 2 }
    }

    case "an entry by index" {
        doenet r#"<selectFromSequence name="s" from="1" to="2" numToSelect="2" sort/>
                  <number name="b">$s[2]</number>"#;
        expect { "b.value" = 2 }
    }

    case "more than sixteen, sorted" {
        doenet r#"<selectFromSequence name="s" numToSelect="20" sort from="1" to="20"/>"#;
        expect { "s.values" = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] }
    }

    case "a math value of the sequence (ADR 0074)" {
        doenet r#"<selectFromSequence name="s" type="math" from="x" step="y" length="1"/>
                  <selectFromSequence name="t" type="math" from="2x" length="1"/>"#;
        expect { "s.value" = "x", "s.number1" = "x", "t.value" = "2 x" }
    }

    case "letters, a draw too large for the run, is refused (ADR 0074)" {
        doenet r#"<selectFromSequence name="s" type="letters" from="a" to="b" numToSelect="3"/>"#;
        diagnostics["cells-choice-domain"]
    }

    case "excluded combinations are avoided, `_` any value (ADR 0079)" {
        doenet r#"<selectFromSequence name="s" from="1" to="2" numToSelect="2" excludeCombinations="(1 2)"/>
                  <selectFromSequence name="t" from="1" to="3" numToSelect="2" excludeCombinations="(1 _) (_ 1)" sort="increasing"/>
                  <numberList name="ec">1 3</numberList>
                  <number name="e">3</number>
                  <selectFromSequence name="u" from="1" to="3" numToSelect="2" excludeCombinations="$ec ($e 1) (2 1) (2 3) (3 2)"/>"#;
        expect { "s.values" = [2, 1], "t.values" = [2, 3], "u.values" = [1, 2] }
    }

    case "combinations excluding over 70% of the draws are refused (ADR 0079)" {
        doenet r#"<selectFromSequence name="s" from="1" to="3" numToSelect="3" excludeCombinations="(1 _ _) (_ 1 _) (_ _ 1)"/>"#;
        diagnostics["cells-choice-domain"]
    }

    case "coprime values share no factor (ADR 0079)" {
        doenet r#"<selectFromSequence name="s" from="2" to="3" numToSelect="2" coprime sort="increasing"/>
                  <selectFromSequence name="t" from="1" to="1" numToSelect="2" coprime withReplacement/>"#;
        expect { "s.values" = [2, 3], "t.values" = [1, 1] }
    }

    case "coprime values from values that all share a factor are refused (ADR 0079)" {
        doenet r#"<selectFromSequence name="s" from="2" to="4" exclude="3" numToSelect="2" coprime/>"#;
        diagnostics["cells-choice-domain"]
    }

    case "coprime beside excludeCombinations or on letters is ignored, with a warning (ADR 0079)" {
        doenet r#"<selectFromSequence name="s" type="letters" from="a" to="b" numToSelect="2" coprime/>"#;
        diagnostics["doenet-w0051"]
    }
}
