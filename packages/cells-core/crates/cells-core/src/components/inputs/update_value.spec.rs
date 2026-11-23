//! `<updateValue>`: a button setting another component's value, pressed
//! by a student, by its condition's rise, or after what it waits on.

use crate::spec;

spec! {
    update_value;

    case "a press sets its target to its new value" {
        doenet r#"<number name="n">1</number><number name="np">$n + 1</number>
                  <updateValue name="uv" target="$n" newValue="$np"><label>add</label></updateValue>"#;
        expect { "uv.hide" = 0 }
        act("uv", "trigger")
        expect { "n.value" = 2 }
        act("uv", "updateValue")
        expect { "n.value" = 3 }
    }

    case "its new value may be math, or a condition" {
        doenet r#"<number name="n">1</number><boolean name="b"/>
                  <updateValue name="a" target="$n" newValue="2$n + 1"><label>a</label></updateValue>
                  <updateValue name="f" target="$b" newValue="not $b"><label>f</label></updateValue>
                  <updateValue name="t" target="$b" newValue="true"><label>t</label></updateValue>
                  <updateValue name="tb" target="$b" newValue="not$b" type="boolean"><label>tb</label></updateValue>
                  <updateValue name="tn" target="$n" newValue="$n + 1" type="number"><label>tn</label></updateValue>"#;
        act("a", "trigger")
        expect { "n.value" = 3 }
        act("f", "trigger")
        expect { "b.value" = 1 }
        act("f", "trigger")
        expect { "b.value" = 0 }
        act("t", "trigger")
        expect { "b.value" = 1 }
        act("tb", "trigger")
        expect { "b.value" = 0 }
        act("tn", "trigger")
        expect { "n.value" = 4 }
    }

    case "a condition that becomes true presses it, once per rise" {
        doenet r#"<graph><point name="P">(-1, 2)</point></graph>
                  <number name="n">0</number><number name="np">$n + 1</number>
                  <updateValue name="uv" target="$n" newValue="$np"
                    triggerWhen="$(P.x) > 0 and $(P.y) > 0"/>"#;
        expect { "uv.hide" = 1, "n.value" = 0 }
        request { "P.x" = -1, "P.y" = -7 }
        expect { "n.value" = 0 }
        request { "P.x" = 3, "P.y" = -4 }
        expect { "n.value" = 0 }
        request { "P.x" = 1, "P.y" = 7 }
        expect { "n.value" = 1 }
        // Still true: no rise.
        request { "P.x" = 5, "P.y" = 9 }
        expect { "n.value" = 1 }
        request { "P.x" = -3, "P.y" = 9 }
        expect { "n.value" = 1 }
        request { "P.x" = 4, "P.y" = 2 }
        expect { "n.value" = 2 }
    }

    case "one waiting on another is pressed after it, in a tick of its own" {
        doenet r#"<number name="n">1</number><number name="np">2 * $n</number>
                  <number name="m">1</number><number name="mp">$m + $n</number>
                  <updateValue name="a" target="$n" newValue="$np"><label>a</label></updateValue>
                  <updateValue name="b" target="$m" newValue="$mp" triggerWith="$a"/>"#;
        expect { "a.hide" = 0, "b.hide" = 1 }
        act("a", "trigger")
        // `b` reads the `n` that `a` set.
        expect { "n.value" = 2, "m.value" = 3 }
        // Pressing `b` presses nothing else.
        act("b", "trigger")
        expect { "n.value" = 2, "m.value" = 5 }
    }

    case "a condition given, it waits on nothing else" {
        doenet r#"<number name="n">1</number><number name="np">$n + 1</number>
                  <number name="m">1</number><number name="mp">$m + 1</number>
                  <updateValue name="a" target="$n" newValue="$np"><label>a</label></updateValue>
                  <updateValue name="b" target="$m" newValue="$mp" triggerWith="$a" triggerWhen="false"/>"#;
        act("a", "trigger")
        expect { "n.value" = 2, "m.value" = 1 }
    }

    case "a click on what it names presses it; a focus does not" {
        doenet r#"<graph><point name="P">(1, 2)</point><point name="Q">(3, 4)</point></graph>
                  <number name="n">0</number><number name="np">$n + 1</number>
                  <updateValue name="uv" target="$n" newValue="$np" triggerWhenObjectsClicked="$P"/>
                  <number name="f">0</number><number name="fp">$f + 1</number>
                  <updateValue name="fv" target="$f" newValue="$fp" triggerWhenObjectsFocused="$Q $P"/>"#;
        act("P", "pointClicked")
        expect { "n.value" = 1, "f.value" = 0 }
        act("Q", "pointClicked")
        expect { "n.value" = 1, "f.value" = 0 }
        act("Q", "pointFocused")
        expect { "n.value" = 1, "f.value" = 1 }
        act("P", "pointFocused")
        expect { "n.value" = 1, "f.value" = 2 }
    }

    case "two waiting on each other stop after the cap on follow-ups" {
        doenet r#"<number name="n">0</number><number name="np">$n + 1</number>
                  <updateValue name="a" target="$n" newValue="$np" triggerWith="$b"/>
                  <updateValue name="b" target="$n" newValue="$np" triggerWith="$a"/>"#;
        act("a", "trigger")
        // The press, then 64 follow-ups.
        expect { "n.value" = 65 }
    }

    case "inside a trigger set, only the set presses it" {
        doenet r#"<booleanInput name="bi"><label>go</label></booleanInput>
                  <number name="n">1</number><number name="np">$n + 1</number>
                  <triggerSet name="ts"><label>set</label>
                    <updateValue name="uv" target="$n" newValue="$np" triggerWhen="$bi"/>
                  </triggerSet>"#;
        request { "bi.value" = 1 }
        expect { "n.value" = 1 }
        act("ts", "trigger")
        expect { "n.value" = 2 }
    }
}
