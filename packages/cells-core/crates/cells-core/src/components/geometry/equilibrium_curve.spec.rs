//! `<equilibriumCurve>`: a curve that is stable or not
//! (`equilibriumcurve.test.ts`).

use crate::spec;

spec! {
    equilibrium_curve;

    case "stable by default, or as given, which a switch requests" {
        doenet r#"<graph>
                    <equilibriumCurve name="A" through="(1,2) (3,4) (2,6)"/>
                    <equilibriumCurve name="B" stable="false" through="(3,2) (5,4) (4,6)"/>
                  </graph>"#;
        expect {
            "A.stable" = 1, "B.stable" = 0, "A.curveType" = 2,
            "A.throughPoints" = [1, 2, 3, 4, 2, 6],
        }
        request { "B.stable" = 1 }
        expect { "B.stable" = 1 }
    }
}
