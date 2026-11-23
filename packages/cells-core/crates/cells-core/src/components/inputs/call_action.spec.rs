//! `<callAction>`: a button calling another component's action.

use crate::spec;

spec! {
    call_action;

    case "submits the answer it names" {
        doenet r#"<mathInput name="mi"><label>m</label></mathInput>
                  <answer name="a" response="$mi">2</answer>
                  <callAction name="ca" target="$a" actionName="submitAnswer"><label>Check</label></callAction>"#;
        request { "mi.value" = 2 }
        expect { "a.credit" = 0, "a.numSubmissions" = 0 }
        act("ca", "trigger")
        expect { "a.credit" = 1, "a.numSubmissions" = 1 }
        act("ca", "callAction")
        expect { "a.numSubmissions" = 2 }
    }

    case "presses the update value it names" {
        doenet r#"<number name="n">1</number><number name="np">$n + 1</number>
                  <updateValue name="uv" target="$n" newValue="$np"><label>add</label></updateValue>
                  <callAction name="ca" target="$uv" actionName="UPDATEVALUE"><label>go</label></callAction>"#;
        act("ca", "trigger")
        expect { "n.value" = 2 }
        act("uv", "trigger")
        expect { "n.value" = 3 }
    }

    case "presses the trigger set it names, and a trigger set presses it" {
        doenet r#"<number name="n">1</number><number name="np">$n + 1</number>
                  <boolean name="b"/><not name="nb">$b</not>
                  <triggerSet name="ts"><label>both</label>
                    <updateValue target="$n" newValue="$np"/>
                    <updateValue target="$b" newValue="$nb"/>
                  </triggerSet>
                  <callAction name="ca" target="$ts" actionName="triggerActions"><label>go</label></callAction>
                  <triggerSet name="outer"><label>outer</label>
                    <callAction target="$ts" actionName="triggerActions"/>
                  </triggerSet>"#;
        act("ca", "trigger")
        expect { "n.value" = 2, "b.value" = 1 }
        act("outer", "trigger")
        expect { "n.value" = 3, "b.value" = 0 }
    }

    case "an action its target does not have is a warning, and does nothing" {
        doenet r#"<number name="n">1</number>
                  <point name="p">(1, 2)</point>
                  <callAction name="ca" target="$p" actionName="notAnAction"><label>go</label></callAction>"#;
        diagnostics["cells-no-such-action"]
        act("ca", "trigger")
        expect { "p.x" = 1, "n.value" = 1 }
    }

    case "an action that would change which components exist is a warning" {
        doenet r#"<sampleRandomNumbers name="s" numSamples="2" from="1" to="6" type="discreteUniform"/>
                  <callAction name="ca" target="$s" actionName="resample"><label>roll</label></callAction>"#;
        diagnostics["cells-action-unsupported"]
        act("ca", "trigger")
    }

    case "with no target it does nothing" {
        doenet r#"<number name="n">1</number>
                  <callAction name="ca" actionName="submitAnswer"><label>go</label></callAction>"#;
        act("ca", "trigger")
        expect { "n.value" = 1 }
    }
}
