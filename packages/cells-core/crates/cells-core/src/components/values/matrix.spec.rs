//! `<matrix>`: a math holding a matrix of its rows or columns, `<row>` and
//! `<column>` under it its own types (ADR 0055; `matrix.test.ts`).

use crate::spec;

spec! {
    matrix;

    case "by rows" {
        doenet r#"<matrix name="A"><row>a b c</row><row>d e f</row></matrix>"#;
        expect {
            "A.expr" = "[[a, b, c], [d, e, f]]",
            "A.numRows" = 2, "A.numColumns" = 3, "A.matrixSize" = [2, 3],
        }
    }

    case "by columns" {
        doenet r#"<matrix name="A"><column>a d</column><column>b e</column><column>c f</column></matrix>"#;
        expect { "A.expr" = "[[a, b, c], [d, e, f]]", "A.numRows" = 2 }
    }

    case "a size fills with the default entry and cuts" {
        doenet r#"<matrix name="A" numRows="3" numColumns="2" defaultEntry="z"><row>a b c</row><row>d e f</row></matrix>"#;
        expect { "A.expr" = "[[a, b], [d, e], [z, z]]", "A.numColumns" = 2 }
    }

    case "nothing given, and a size alone" {
        doenet r#"<matrix name="A"/><matrix name="B" numRows="2"/>"#;
        expect { "A.numRows" = 0, "B.expr" = "[[0], [0]]", "B.numColumns" = 1 }
    }

    case "an entry that reads a value, and children that are one entry" {
        doenet r#"<number name="n">5</number>
                  <matrix name="A"><row>$n x</row></matrix>
                  <matrix name="B" simplify>2<math>x</math></matrix>"#;
        expect { "A.expr" = "[[5, x]]", "B.expr" = "[[2 x]]" }
    }

    case "a size that follows a value is refused" {
        doenet r#"<number name="n">2</number><matrix name="A" numRows="$n"/>"#;
        diagnostics["cells-unsupported"]
    }
}
