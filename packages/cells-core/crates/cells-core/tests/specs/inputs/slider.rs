//! `<slider>` in numeric mode: a value on the grid `from + k * step`,
//! within `[from, to]`.

use cells_core::spec;

spec! {
    slider;

    case "defaults: from 0 to 10 by 1, at 0" {
        doenet r#"<slider name="s"/>"#;
        expect { "s.from" = 0, "s.to" = 10, "s.step" = 1, "s.value" = 0, "s.index" = 0 }
    }

    case "without an initialValue: at `from`, wherever that is" {
        doenet r#"<slider name="s" from="3" to="9" step="2"/>"#;
        expect { "s.value" = 3, "s.index" = 0 }
        request { "s.value" = 6.2 }
        expect { "s.value" = 7, "s.index" = 2 }
    }

    case "starts at initialValue" {
        doenet r#"<slider name="s" from="0" to="10" step="1" initialValue="3"/>"#;
        expect { "s.value" = 3, "s.index" = 3, "s.maxIndex" = 10 }
    }

    case "an initialValue off the grid shows snapped" {
        doenet r#"<slider name="s" from="0" to="10" step="2" initialValue="3"/>"#;
        expect { "s.value" = 4, "s.index" = 2 }
    }

    case "a request snaps to the nearest step and clamps to the range" {
        doenet r#"<slider name="s" from="0" to="10" step="1"/>"#;
        request { "s.value" = 3.7 }
        expect { "s.value" = 4, "s.preliminaryValue" = 4 }
        request { "s.value" = 15 }
        expect { "s.value" = 10 }
        request { "s.value" = -3 }
        expect { "s.value" = 0 }
        // Half rounds away from zero, as Math.round does for positives.
        request { "s.value" = 2.5 }
        expect { "s.value" = 3 }
    }

    // Without an initialValue the slider starts at `from`.
    case "a range that does not start at zero" {
        doenet r#"<slider name="s" from="-5" to="5" step="2.5"/>"#;
        expect { "s.value" = -5, "s.index" = 0, "s.maxIndex" = 4 }
        request { "s.value" = 1 }
        expect { "s.value" = 0, "s.index" = 2 }
    }

    case "non-finite requests are dropped" {
        doenet r#"<slider name="s" initialValue="2"/>"#;
        request { "s.value" = f64::NAN }
        dropped(1)
        expect { "s.value" = 2 }
        request { "s.value" = f64::INFINITY }
        dropped(1)
        request { "s.value" = f64::NEG_INFINITY }
        dropped(1)
        expect { "s.value" = 2 }
    }

    case "a fractional step counts its items as the current core does" {
        // (0.7 - 0) / 0.1 is 6.999999999999999; the nudge before the floor
        // makes it 7.
        doenet r#"<slider name="s" from="0" to="0.7" step="0.1"/>"#;
        expect { "s.maxIndex" = 7 }
        request { "s.value" = 0.66 }
        expect { "s.value" = 0.7 }
    }

    case "a request on index snaps too" {
        // The current core rejects a non-integer index; the projection that
        // snaps value snaps index. A recorded, benign deviation.
        // No renderer requests the index: an input bound to it does.
        doenet r#"<slider name="s" from="0" to="10"/><mathInput name="i" bindValueTo="$s.index"/>"#;
        request { "i.value" = 3.4 }
        expect { "s.index" = 3, "s.value" = 3 }
        request { "i.value" = 40 }
        expect { "s.index" = 10, "s.value" = 10 }
    }

    case "bindValueTo an input: the input receives the snapped value" {
        doenet r#"<numberInput name="n" value="2"/>
                  <slider name="s" from="0" to="20" step="1" bindValueTo="$n"/>"#;
        expect { "s.value" = 2 }
        request { "s.value" = 7.4 }
        expect { "n.value" = 7, "s.value" = 7 }
        // An off-grid value typed into the input stays there; the slider
        // shows it snapped, and nothing writes back.
        request { "n.value" = 7.4 }
        expect { "n.value" = 7.4, "s.value" = 7 }
        // An emptied input puts the slider at `from`.
        request { "n.value" = f64::NAN }
        expect { "n.value" = f64::NAN, "s.value" = 0 }
    }

    case "bindValueTo a derived value: the request continues down the chain" {
        doenet r#"<numberInput name="n" value="1"/>
                  <number name="d">2 * $n</number>
                  <slider name="s" from="0" to="20" step="1" bindValueTo="$d"/>"#;
        expect { "s.value" = 2 }
        request { "s.value" = 7.4 }
        expect { "s.value" = 7, "d.value" = 7, "n.value" = 3.5 }
    }

    case "bound to a sum with an emptied input: the request is dropped, not written as NaN" {
        doenet r#"<numberInput name="x" value="2"/><numberInput name="y"/>
                  <number name="sum">$x + $y</number>
                  <slider name="s" from="0" to="10" bindValueTo="$sum"/>"#;
        expect { "y.value" = f64::NAN, "s.value" = 0 }
        request { "s.value" = 5 }
        dropped(1)
        expect { "x.value" = 2 }
        request { "y.value" = 1 }
        request { "s.value" = 5 }
        expect { "x.value" = 4, "sum.value" = 5 }
    }

    case "a slider bound to a slider with another step" {
        doenet r#"<slider name="fine" from="0" to="10" step="0.5" initialValue="3"/>
                  <slider name="coarse" from="0" to="10" step="2" bindValueTo="$fine"/>"#;
        // 3 snaps up to 4 on the coarse grid.
        expect { "coarse.value" = 4 }
        request { "coarse.value" = 5.3 }
        expect { "coarse.value" = 6, "fine.value" = 6, "fine.preliminaryValue" = 6 }
        request { "fine.value" = 3.6 }
        expect { "fine.value" = 3.5, "coarse.value" = 4 }
    }

    case "step from another slider" {
        doenet r#"<slider name="st" from="1" to="4" step="1" initialValue="2"/>
                  <slider name="s" from="0" to="10" step="$st" initialValue="7"/>"#;
        // 7 on a step-2 grid shows 8.
        expect { "s.value" = 8 }
        // The stored 7 is unchanged; on a step-3 grid it shows 6.
        request { "st.value" = 3 }
        expect { "s.maxIndex" = 3, "s.value" = 6 }
    }

    case "a point whose x is a slider drags the slider" {
        doenet r#"<slider name="s" from="-5" to="5" step="1" initialValue="1"/>
                  <graph><point name="p" x="$s" y="0"/></graph>"#;
        expect { "p.x" = 1 }
        request { "p.x" = 2.6 }
        expect { "p.x" = 3, "s.value" = 3 }
    }
}
