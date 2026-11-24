//! `<summaryStatistics>`: statistics of the finite values among its
//! operands.

use crate::spec;

spec! {
    summary_statistics;

    case "of numbers, with the sample formulas" {
        doenet r#"<summaryStatistics name="s">2 4 4 10</summaryStatistics>"#;
        expect {
            "s.count" = 4, "s.sum" = 20, "s.mean" = 5, "s.minimum" = 2, "s.maximum" = 10,
            "s.median" = 4, "s.range" = 8, "s.variance" = 12, "s.stdev" = 12f64.sqrt(),
            "s.stderr" = 12f64.sqrt() / 2.0, "s.quartile1" = 3.5, "s.quartile3" = 5.5,
        }
    }

    case "interpolated quartiles, and a median at either end of the double range" {
        doenet r#"<summaryStatistics name="s">4 1 3 2</summaryStatistics>
                  <summaryStatistics name="top">1E308 1.5E308</summaryStatistics>
                  <summaryStatistics name="bottom">5E-324 5E-324</summaryStatistics>"#;
        expect {
            "s.median" = 2.5, "s.quartile1" = 1.75, "s.quartile3" = 3.25,
            "top.median" = 1.25e308, "bottom.median" = 5e-324,
        }
    }

    case "one value: no spread" {
        doenet r#"<summaryStatistics name="s"><number>7</number></summaryStatistics>"#;
        expect { "s.variance" = 0, "s.stdev" = 0, "s.stderr" = 0, "s.quartile1" = 7, "s.range" = 0 }
    }

    case "math children by their value, a value that is no finite number passed over" {
        doenet r#"<summaryStatistics name="s"><math>1+1</math><math>x</math><math>3^2</math><math>1/0</math></summaryStatistics>"#;
        expect { "s.count" = 2, "s.sum" = 11, "s.maximum" = 9 }
    }

    case "a text is data when it reads as a number" {
        doenet r#"<summaryStatistics name="a">72 91 65 <text>absent</text></summaryStatistics>
                  <summaryStatistics name="n">72 91 65 <text> 88 </text></summaryStatistics>"#;
        expect { "a.count" = 3, "n.count" = 4, "n.sum" = 316 }
    }

    case "none: a count of 0 and no value for the rest" {
        doenet r#"<numberList name="none"/><summaryStatistics name="s">$none</summaryStatistics>"#;
        expect { "s.count" = 0, "s.mean" = f64::NAN, "s.range" = f64::NAN }
    }

    case "follows its operands" {
        doenet r#"<mathInput name="mi" prefill="3"><label>a</label></mathInput>
                  <summaryStatistics name="s">1 $mi</summaryStatistics>"#;
        expect { "s.sum" = 4, "s.maximum" = 3 }
        request { "mi.value" = 5 }
        expect { "s.sum" = 6, "s.maximum" = 5 }
    }

    case "which statistics show: the default, a selection unioned, in order" {
        doenet r#"<summaryStatistics name="d">1 2</summaryStatistics>
                  <summaryStatistics name="s" statisticsToDisplay="median MEAN">1 2</summaryStatistics>
                  <summaryStatistics name="f" statisticsToDisplay="fiveNumberSummary sum">1 2</summaryStatistics>
                  <summaryStatistics name="a" statisticsToDisplay="all">1 2</summaryStatistics>"#;
        expect {
            "d.statisticsShown" = 0b0011_1111_0011, "s.statisticsShown" = 0b1000_0001,
            "f.statisticsShown" = 0b1011_1110_0000, "a.statisticsShown" = 0b1111_1111_1111,
        }
    }
}
