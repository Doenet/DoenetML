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

    case "each category's mean and variance, its named sequences" {
        doenet r#"<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="4"/>
                  <number name="m2" extend="$s.means[2]"/>
                  <sampleMultivariateRandomNumber name="one" type="hypergeometric" numInCategories="1 0" numDraws="1"/>
                  <sampleMultivariateRandomNumber name="empty" type="hypergeometric" numInCategories="0 0" numDraws="0"/>"#;
        expect {
            "s.means" = [2.0, 1.2, 0.8], "s.variances" = [0.6666666666666666, 0.56, 0.42666666666666666],
            "m2.value" = 1.2,
            "one.means" = [1.0, 0.0], "one.variances" = [0.0, 0.0],
            "empty.means" = [0.0, 0.0], "empty.variances" = [0.0, 0.0],
        }
    }

    case "no moments where the parameters describe no population" {
        doenet r#"<sampleMultivariateRandomNumber name="over" type="hypergeometric" numInCategories="5 3" numDraws="11"/>
                  <sampleMultivariateRandomNumber name="none" type="hypergeometric" numInCategories="5 3"/>"#;
        expect {
            "over.means" = [f64::NAN, f64::NAN], "over.variances" = [f64::NAN, f64::NAN],
            "none.means" = [f64::NAN, f64::NAN],
        }
    }
}
