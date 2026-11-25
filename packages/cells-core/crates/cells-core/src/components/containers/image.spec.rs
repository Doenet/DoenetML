//! `<image>`: its size, width, alignment and rotation (`image.test.ts`).
//! The texts of its settings are checked in `tests/media.rs`.

use crate::spec;

spec! {
    image;

    case "a width in pixels or percent is the nearest preset's" {
        doenet r#"<image name="i"><shortDescription>i</shortDescription></image>
                  <image name="tiny" size="tiny" decorative />
                  <image name="w500" width="500" decorative />
                  <image name="p30" width="30%" decorative />
                  <image name="big" width="10000" decorative />"#;
        expect {
            "i.width" = 425, "tiny.width" = 70, "w500.width" = 425,
            "p30.width" = 255, "big.width" = 850, "tiny.decorative" = 1,
        }
    }

    case "an invalid setting is its default, with a warning" {
        doenet r#"<image name="i" size="huge" horizontalAlign="up" decorative />"#;
        expect { "i.width" = 425 }
        diagnostics["cells-invalid-attribute-value", "cells-invalid-attribute-value"]
    }

    case "its rotation follows a value" {
        doenet r#"<mathInput name="r" prefill="1"><label>r</label></mathInput>
                  <image name="i" rotate="$r" decorative />"#;
        expect { "i.rotate" = 1 }
        request { "r.value" = 2 }
        expect { "i.rotate" = 2 }
    }
}
