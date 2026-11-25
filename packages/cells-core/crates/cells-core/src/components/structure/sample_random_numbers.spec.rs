//! `<sampleRandomNumbers>`: `numSamples` numbers drawn at load from the
//! document seed (`selectsamplerandomnumbers.test.ts`).

use crate::spec;

spec! {
    sample_random_numbers;

    case "samples of a discrete uniform" {
        doenet r#"<sampleRandomNumbers name="s" type="discreteUniform" from="10" step="10" to="30" numSamples="5"/>"#;
        expect { "s.numComponents" = 5, "s.numbers" = [30, 30, 20, 30, 30] }
    }

    case "one sample by default" {
        doenet r#"<sampleRandomNumbers name="s" from="-1" to="1"/>
                  <isBetween name="in" limits="-1 1">$s</isBetween>"#;
        expect { "s.numComponents" = 1, "in.value" = 1 }
    }

    case "a sample count that is no whole number is refused" {
        doenet r#"<sampleRandomNumbers name="s" numSamples="2.5"/>"#;
        diagnostics["cells-bad-attribute-value"]
    }

    case "the distribution's moments" {
        doenet r#"<sampleRandomNumbers name="s" type="discreteUniform" from="2" to="8" step="2" numSamples="3"/>"#;
        expect { "s.mean" = 5, "s.variance" = 5, "s.numComponents" = 3 }
    }

    case "a hypergeometric drawing the whole population (ADR 0079)" {
        doenet r#"<sampleRandomNumbers name="s" type="hypergeometric" numTotal="10" numSuccesses="4" numDraws="10" numSamples="3"/>"#;
        expect { "s.numbers" = [4, 4, 4], "s.mean" = 4, "s.variance" = 0, "s.numTotal" = 10, "s.numSuccesses" = 4, "s.numDraws" = 10 }
    }

    case "a binomial is a fair trial by default (ADR 0079)" {
        doenet r#"<sampleRandomNumbers name="s" type="binomial" numSamples="2"/>
                  <sampleRandomNumbers name="t" type="binomial" numTrials="6" probability="1" numSamples="2"/>"#;
        expect { "s.mean" = 0.5, "s.variance" = 0.25, "t.numbers" = [6, 6] }
    }

    case "a poisson's mean is 1 by default (ADR 0079)" {
        doenet r#"<sampleRandomNumbers name="s" type="poisson" numSamples="2"/>
                  <sampleRandomNumbers name="t" type="poisson" mean="0" numSamples="2"/>"#;
        expect { "s.mean" = 1, "s.variance" = 1, "t.numbers" = [0, 0] }
    }

    case "a log-normal with no spread is one value (ADR 0079)" {
        doenet r#"<sampleRandomNumbers name="s" type="logNormal" logMean="2" logStandardDeviation="0" numSamples="2"/>
                  <sampleRandomNumbers name="t" type="logNormal" logMean="2" logVariance="4"/>"#;
        expect {
            "s.numbers" = [2f64.exp(), 2f64.exp()], "s.mean" = 2f64.exp(), "s.variance" = 0,
            "t.logStandardDeviation" = 2, "t.logVariance" = 4, "t.mean" = 4f64.exp()
        }
    }

    case "a normal mixture's moments, a single spread for every component (ADR 0079)" {
        doenet r#"<sampleRandomNumbers name="s" type="normalMixture" means="-4 6" standardDeviations="1 2" weights="1 3" numSamples="2"/>
                  <sampleRandomNumbers name="t" type="normalMixture" means="5 5" standardDeviations="0" numSamples="2"/>"#;
        expect { "s.mean" = 3.5, "s.variance" = 22, "t.numbers" = [5, 5], "t.variance" = 0 }
    }

    case "parameters that describe no distribution are the current core's warning (ADR 0079)" {
        doenet r#"<sampleRandomNumbers name="s" type="hypergeometric" numTotal="10" numSuccesses="11" numDraws="4"/>"#;
        diagnostics["doenet-w0127"]
    }

    case "a normal mixture's lists of other lengths are its warning (ADR 0079)" {
        doenet r#"<sampleRandomNumbers name="s" type="normalMixture" means="0 5" weights="1 2 3"/>"#;
        diagnostics["doenet-w0166"]
    }
}
