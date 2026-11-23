//! `<triggerSet>`: a button pressing the buttons inside it.

use crate::spec;

spec! {
    trigger_set;

    case "a press presses every button inside it, in one tick" {
        doenet r#"<number name="n">1</number><number name="np">$n + 1</number>
                  <boolean name="b"/><not name="nb">$b</not>
                  <triggerSet name="ts"><label>both</label>
                    <updateValue target="$n" newValue="$np"/>
                    <updateValue target="$b" newValue="$nb"/>
                  </triggerSet>"#;
        expect { "ts.hide" = 0 }
        act("ts", "trigger")
        expect { "n.value" = 2, "b.value" = 1 }
        act("ts", "triggerActions")
        expect { "n.value" = 3, "b.value" = 0 }
    }

    case "its condition's rise presses it" {
        doenet r#"<mathInput name="mi" prefill="0"><label>m</label></mathInput>
                  <number name="n">1</number><number name="np">$n + 1</number>
                  <triggerSet name="ts" triggerWhen="$mi > 2">
                    <updateValue target="$n" newValue="$np"/>
                  </triggerSet>"#;
        expect { "ts.hide" = 1 }
        request { "mi.value" = 3 }
        expect { "n.value" = 2 }
        request { "mi.value" = 4 }
        expect { "n.value" = 2 }
    }

    case "a button waiting on it is pressed after it" {
        doenet r#"<number name="n">1</number><number name="np">$n + 1</number>
                  <number name="m">1</number><number name="mp">$m + $n</number>
                  <triggerSet name="ts"><label>go</label>
                    <updateValue target="$n" newValue="$np"/>
                  </triggerSet>
                  <updateValue name="after" target="$m" newValue="$mp" triggerWith="$ts"/>"#;
        act("ts", "trigger")
        expect { "n.value" = 2, "m.value" = 3 }
    }
}
