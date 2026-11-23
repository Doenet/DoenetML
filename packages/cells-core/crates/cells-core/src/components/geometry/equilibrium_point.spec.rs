//! `<equilibriumPoint>`: a point with a `stable` flag, as the current
//! core's tests (`equilibriumpoint.test.ts`) set and switch it: by its
//! attribute, through a bound input, and by the renderer's switch, which
//! requests the flag flipped.

use crate::spec;

spec! {
    equilibrium_point;

    case "stable by default; a point to drag" {
        doenet r#"<graph><equilibriumPoint name="A">(4,0)</equilibriumPoint></graph>"#;
        expect { "A.coords" = (4, 0), "A.stable" = 1 }
        request { "A.coords" = (2, -3) }
        expect { "A.coords" = (2, -3), "A.stable" = 1 }
        // The switch flips it.
        request { "A.stable" = 0 }
        expect { "A.stable" = 0, "A.coords" = (2, -3) }
    }

    case "not stable" {
        doenet r#"<graph><equilibriumPoint name="B" stable="false" x="7" y="0"/></graph>"#;
        expect { "B.coords" = (7, 0), "B.stable" = 0 }
    }

    case "stable from an input, which the switch writes" {
        doenet r#"<graph><equilibriumPoint name="C" stable="$b1">(-9,0)</equilibriumPoint></graph>
                  <booleanInput name="b1"/>"#;
        expect { "C.stable" = 0, "b1.value" = 0 }
        request { "b1.value" = 1 }
        expect { "C.stable" = 1 }
        request { "C.stable" = 0 }
        expect { "b1.value" = 0 }
    }

    case "a copy shares its point and its flag" {
        doenet r#"<graph name="g"><equilibriumPoint name="A">(4,0)</equilibriumPoint></graph>
                  <graph extend="$g" name="g2"/>"#;
        expect { "g2.A.coords" = (4, 0), "g2.A.stable" = 1 }
        request { "g2.A.stable" = 0 }
        expect { "A.stable" = 0 }
        request { "A.coords" = (1, 1) }
        expect { "g2.A.coords" = (1, 1) }
    }
}
