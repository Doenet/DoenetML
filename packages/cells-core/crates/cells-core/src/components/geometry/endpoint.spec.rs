//! `<endpoint>`: a point with an `open` flag, as the current core's tests
//! (`endpoint.test.ts`) set and switch it: by its attribute, through a
//! bound input, and by the renderer's switch, which requests the flag
//! flipped.

use crate::spec;

spec! {
    endpoint;

    case "closed by default; a point to drag" {
        doenet r#"<graph><endpoint name="B">(7,0)</endpoint></graph>"#;
        expect { "B.coords" = (7, 0), "B.open" = 0 }
        request { "B.coords" = (5, 1) }
        expect { "B.coords" = (5, 1) }
        request { "B.open" = 1 }
        expect { "B.open" = 1 }
    }

    case "open as a bare flag" {
        doenet r#"<graph><endpoint name="A" open>(4,0)</endpoint></graph>"#;
        expect { "A.open" = 1, "A.coords" = (4, 0) }
    }

    case "open from an input, which the switch writes" {
        doenet r#"<graph><endpoint name="D" open="$b2">(-3,0)</endpoint></graph>
                  <booleanInput name="b2"/>"#;
        expect { "D.open" = 0 }
        request { "b2.value" = 1 }
        expect { "D.open" = 1 }
        request { "D.open" = 0 }
        expect { "b2.value" = 0 }
    }
}
