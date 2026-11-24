//! `<matrixInput>`: its grid of boxes, sized by `numRows` and
//! `numColumns`, and the matrix they make (ADR 0045; `matrixinput.test.ts`).
//! Typing and resizing are in `tests/matrix_input.rs`.

use crate::spec;

spec! {
    matrix_input;

    case "no attributes: one blank box" {
        doenet r#"<matrixInput name="mi"/>"#;
        expect { "mi.expr" = "[[＿]]", "mi.numRows" = 1, "mi.numColumns" = 1 }
    }

    case "a prefill gives the size and the boxes" {
        doenet r#"<matrixInput name="mi" prefill="(a,b)"/>"#;
        expect { "mi.expr" = "[[a], [b]]", "mi.matrixSize" = [2, 1] }
    }

    case "a size larger than the prefill fills with the default entry" {
        doenet r#"<matrixInput name="mi" prefill="(a,b)^T" numRows="2" numColumns="3" defaultEntry="0"/>"#;
        expect { "mi.expr" = "[[a, b, 0], [0, 0, 0]]" }
    }
}
