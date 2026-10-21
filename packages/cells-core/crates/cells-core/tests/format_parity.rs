//! The formatter (`cells_core::format`) writes what JavaScript writes:
//! every value of a fixed set and of a generated one is formatted by node
//! too, and the two must agree character for character.

use cells_core::format::{NumberFormat, fixed, js_string, number, precision};
use std::io::Write;
use std::process::{Command, Stdio};

/// Edge values, then doubles spread over magnitudes 1e-12 to 1e25, signs,
/// halves, ties and plain integers.
fn values() -> Vec<f64> {
    let mut v = vec![
        0.0,
        -0.0,
        1.0,
        -1.0,
        0.5,
        1.5,
        2.5,
        -2.5,
        0.125,
        1.005,
        1.0005,
        2.675,
        0.1,
        0.2,
        0.3,
        1e-7,
        1e-6,
        1.5e-6,
        9.9995,
        99.995,
        999.95,
        9999.5,
        9999.7,
        1e21,
        1e20,
        123456789.0,
        1e300,
        5e-324,
        f64::MAX,
        f64::MIN_POSITIVE,
        f64::NAN,
        f64::INFINITY,
        f64::NEG_INFINITY,
        1.0 / 3.0,
        2.0 / 3.0,
        3.14158,
        -0.0004,
        0.00049999,
        12.345,
        1.25,
        1.35,
        8.675,
        1e15 + 0.5,
        4.35,
        0.045,
        1.45,
    ];
    // Short decimals and halves of the last kept digit, where the formatter
    // rounds from the shortest digits or falls back to the exact expansion.
    for i in 0..2000 {
        let i = i as f64;
        v.extend([
            i / 1000.0,
            i * 0.005,
            i / 16.0,
            1e14 + i / 4.0,
            1.0 + i * 1e-4,
        ]);
    }
    let mut s: u64 = 0x9e3779b97f4a7c15;
    let mut next = || {
        s ^= s << 13;
        s ^= s >> 7;
        s ^= s << 17;
        s
    };
    for _ in 0..3000 {
        let r = next();
        let mantissa = (r >> 11) as f64 / (1u64 << 53) as f64;
        let exp = (next() % 38) as i32 - 12;
        let sign = if next() % 2 == 0 { 1.0 } else { -1.0 };
        let x = sign * mantissa * 10f64.powi(exp);
        // Some to few decimals, which make ties of toFixed and toPrecision.
        let x = match next() % 4 {
            0 => (x * 1000.0).round() / 1000.0,
            1 => (x * 8.0).round() / 8.0,
            2 => x.round(),
            _ => x,
        };
        v.push(x);
    }
    v
}

/// For each value: String(v), toPrecision(4), the viewer's default, and
/// toFixed(0), (2), (5), (20) of finite values below 1e21.
const JS: &str = r#"
const lines = require("fs").readFileSync(0, "utf8").trim().split("\n");
const fmt = (v) => Number.isNaN(v) ? "NaN" : Number.isInteger(v) ? String(v) : v.toPrecision(4);
const out = lines.map((hex) => {
    const b = new DataView(new ArrayBuffer(8));
    b.setBigUint64(0, BigInt("0x" + hex));
    const v = b.getFloat64(0);
    const fixed = [0, 2, 5, 20].map((d) => Number.isFinite(v) ? v.toFixed(d) : String(v));
    return [String(v), v.toPrecision(4), fmt(v), ...fixed].join("\t");
});
process.stdout.write(out.join("\n"));
"#;

#[test]
fn the_formatter_writes_what_javascript_writes() {
    let vs = values();
    let input: String = vs
        .iter()
        .map(|v| format!("{:016x}\n", v.to_bits()))
        .collect();
    let mut child = Command::new("node")
        .args(["-e", JS])
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .expect("node must be on PATH");
    child
        .stdin
        .take()
        .unwrap()
        .write_all(input.as_bytes())
        .unwrap();
    let out = child.wait_with_output().unwrap();
    let js = String::from_utf8(out.stdout).unwrap();
    let mut failures = Vec::new();
    for (v, line) in vs.iter().zip(js.lines()) {
        let want: Vec<&str> = line.split('\t').collect();
        let got = [
            js_string(*v),
            precision(*v, 4),
            number(*v),
            fixed(*v, 0),
            fixed(*v, 2),
            fixed(*v, 5),
            fixed(*v, 20),
        ];
        let names = [
            "String",
            "toPrecision(4)",
            "fmt",
            "toFixed(0)",
            "toFixed(2)",
            "toFixed(5)",
            "toFixed(20)",
        ];
        for ((name, g), w) in names.iter().zip(&got).zip(&want) {
            if g != w {
                failures.push(format!(
                    "{v:e} ({:016x}): {name} gives {g}, JavaScript {w}",
                    v.to_bits()
                ));
            }
        }
    }
    assert_eq!(js.lines().count(), vs.len(), "node formatted every value");
    let n = failures.len();
    failures.truncate(30);
    assert!(n == 0, "{n} differences:\n{}", failures.join("\n"));
}

#[test]
fn display_decimals_reads_an_integer_from_0_to_20() {
    assert_eq!(
        NumberFormat::from_decimals(Some(" 2 ")),
        NumberFormat::Decimals(2)
    );
    assert_eq!(
        NumberFormat::from_decimals(Some("20")),
        NumberFormat::Decimals(20)
    );
    for bad in ["21", "-1", "1.5", "two", ""] {
        assert_eq!(
            NumberFormat::from_decimals(Some(bad)),
            NumberFormat::Default,
            "{bad}"
        );
    }
    assert_eq!(NumberFormat::Decimals(2).apply(1.0 / 3.0), "0.33");
    assert_eq!(NumberFormat::Decimals(2).apply(f64::NAN), "NaN");
    assert_eq!(NumberFormat::Default.apply(2.5), "2.500");
}
