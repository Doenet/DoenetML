//! `<sampleMultivariateRandomNumber>`: one number per category, drawn
//! together.

use crate::spec;

spec! {
    sample_multivariate_random_number;

    case "every item drawn: each category's size" {
        doenet r#"<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="10"/>"#;
        expect {
            "s.numComponents" = 3, "s.number1" = 5, "s.number2" = 3, "s.number3" = 2,
            "s.numCategories" = 3, "s.numTotal" = 10, "s.numDraws" = 10,
        }
    }

    case "none drawn, and an empty category" {
        doenet r#"<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="0"/>
                  <sampleMultivariateRandomNumber name="e" type="hypergeometric" numInCategories="6 0 4" numDraws="10"/>"#;
        expect {
            "s.number1" = 0, "s.number2" = 0, "s.number3" = 0,
            "e.number1" = 6, "e.number2" = 0, "e.number3" = 4,
        }
    }

    case "parameters that describe no population: no value" {
        doenet r#"<sampleMultivariateRandomNumber name="over" type="hypergeometric" numInCategories="5 3 2" numDraws="11"/>
                  <sampleMultivariateRandomNumber name="half" type="hypergeometric" numInCategories="5.5 3" numDraws="2"/>
                  <sampleMultivariateRandomNumber name="none" type="hypergeometric" numInCategories="5 3 2"/>"#;
        expect {
            "over.number1" = f64::NAN, "half.number2" = f64::NAN, "none.number3" = f64::NAN,
            "none.numCategories" = 3,
        }
    }
}
