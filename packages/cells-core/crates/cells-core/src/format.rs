//! Numbers as text (ADR 0016): the one formatter, for where values go out
//! (the viewer, export, answer checking) and never in the tick; nothing
//! calls it yet. It writes what the current viewer and the JavaScript core
//! write, character for character: JavaScript's `String(n)`, `toPrecision`
//! and `toFixed`, which `tests/format_parity.rs` checks against node.

/// Digits beyond the ones kept that rounding reads. Rust's exact formatting
/// rounds at its last digit; a double whose exact expansion has this many
/// nines in a row past the kept digits would round wrongly, and none does
/// in practice.
const EXTRA: usize = 40;

/// How a component shows a number: the viewer's default, or a fixed number
/// of decimals (`displayDecimals`).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum NumberFormat {
    /// An integer as itself, anything else to four significant digits.
    #[default]
    Default,
    /// This many decimals, 0 to 20 (`toFixed`).
    Decimals(u8),
}

impl NumberFormat {
    /// The format a literal `displayDecimals` asks for: an integer from 0
    /// to 20, else the default.
    pub fn from_decimals(text: Option<&str>) -> NumberFormat {
        match text.map(str::trim).and_then(|t| t.parse::<f64>().ok()) {
            Some(d) if d.fract() == 0.0 && (0.0..=20.0).contains(&d) => {
                NumberFormat::Decimals(d as u8)
            }
            _ => NumberFormat::Default,
        }
    }

    pub fn apply(self, v: f64) -> String {
        match self {
            NumberFormat::Decimals(d) if v.is_finite() => fixed(v, d as usize),
            _ => number(v),
        }
    }
}

/// The viewer's default: `NaN`, an integer as `String(n)`, anything else
/// as `toPrecision(4)`.
pub fn number(v: f64) -> String {
    if v.is_finite() && v.fract() == 0.0 {
        js_string(v)
    } else {
        precision(v, 4)
    }
}

/// JavaScript's `String(n)`: the shortest digits that read back as `n`,
/// in fixed notation from 1e-6 up to 1e21, else exponential.
pub fn js_string(v: f64) -> String {
    if v.is_nan() {
        return "NaN".into();
    }
    if v.is_infinite() {
        return if v > 0.0 { "Infinity" } else { "-Infinity" }.into();
    }
    if v == 0.0 {
        return "0".into();
    }
    let sign = if v < 0.0 { "-" } else { "" };
    let (digits, n) = shortest(v.abs());
    let k = digits.len() as i32;
    let body = if k <= n && n <= 21 {
        format!("{digits}{}", "0".repeat((n - k) as usize))
    } else if 0 < n && n <= 21 {
        format!("{}.{}", &digits[..n as usize], &digits[n as usize..])
    } else if -6 < n && n <= 0 {
        format!("0.{}{digits}", "0".repeat((-n) as usize))
    } else {
        let e = n - 1;
        let e = if e < 0 {
            format!("-{}", -e)
        } else {
            format!("+{e}")
        };
        if k == 1 {
            format!("{digits}e{e}")
        } else {
            format!("{}.{}e{e}", &digits[..1], &digits[1..])
        }
    };
    format!("{sign}{body}")
}

/// The shortest digits that read back as `x` (positive), and the exponent
/// `n` with `x` near `0.digits × 10^n`. Where two such digit strings are as
/// near `x` as each other, JavaScript takes the one ending in an even
/// digit, which Rust's shortest printing does not always do.
fn shortest(x: f64) -> (String, i32) {
    let s = format!("{:e}", x);
    let (mantissa, exp) = s.split_once('e').unwrap();
    let mut digits: String = mantissa.chars().filter(|c| *c != '.').collect();
    let e: i32 = exp.parse().unwrap();
    let k = digits.len();
    // Two candidates as near as each other are a unit of the k-th digit
    // apart, which only an ulp that wide can hold both of: never within
    // 15 digits.
    if k <= 15 && x.is_normal() {
        return (digits, e + 1);
    }
    let exact = format!("{:.*e}", k - 1 + EXTRA, x);
    let (m, ex) = exact.split_once('e').unwrap();
    let all: Vec<u8> = m
        .bytes()
        .filter(u8::is_ascii_digit)
        .map(|b| b - b'0')
        .collect();
    // Exactly halfway between the k digits it starts with and the next.
    if ex.parse::<i32>().unwrap() == e && all[k] == 5 && all[k + 1..].iter().all(|&d| d == 0) {
        let mut lo = all[..k].to_vec();
        let pick = if lo[k - 1].is_multiple_of(2) {
            lo
        } else {
            round_up(&mut lo);
            lo
        };
        let candidate = text(&pick);
        let reads_back = format!("{}.{}e{e}", &candidate[..1], &candidate[1..])
            .parse::<f64>()
            .is_ok_and(|y| y == x);
        if pick.len() == k && reads_back {
            digits = candidate;
        }
    }
    (digits, e + 1)
}

/// `x` (not negative) to `sig` significant digits, ties away from zero, as
/// JavaScript rounds: the digits, and the exponent of the first.
fn round_significant(x: f64, sig: usize) -> (Vec<u8>, i32) {
    // Fifteen digits leave an ulp well under the last one's unit, unless
    // `x` is subnormal, with fewer bits.
    if sig <= 15 && x.is_normal() {
        let (digits, e) = shortest_digits(x);
        if let Some(r) = round_digits(digits, e, sig) {
            return r;
        }
    }
    let s = format!("{:.*e}", sig - 1 + EXTRA, x);
    let (mantissa, exp) = s.split_once('e').unwrap();
    let mut e: i32 = exp.parse().unwrap();
    let all: Vec<u8> = mantissa
        .bytes()
        .filter(u8::is_ascii_digit)
        .map(|b| b - b'0')
        .collect();
    let mut digits = all[..sig].to_vec();
    if all[sig] >= 5 && round_up(&mut digits) {
        digits.insert(0, 1);
        digits.pop();
        e += 1;
    }
    (digits, e)
}

/// The shortest digits of `x` (not negative) and the exponent of the
/// first, as `{:e}` writes them.
fn shortest_digits(x: f64) -> (Vec<u8>, i32) {
    let s = format!("{:e}", x);
    let (mantissa, exp) = s.split_once('e').unwrap();
    let digits = mantissa
        .bytes()
        .filter(u8::is_ascii_digit)
        .map(|b| b - b'0')
        .collect();
    (digits, exp.parse().unwrap())
}

/// Shortest digits `(digits, e)` rounded to `n` (at least 1), ties away
/// from zero, as the exact expansion (`EXTRA`) would round them at several
/// times the cost. The two agree when an ulp is well under a unit of the
/// `n`-th digit, which the caller ensures: a halfway point strictly between
/// the shortest digits and the exact value would be a string as short that
/// reads back nearer. Only a halfway point the shortest digits are
/// themselves, `n` digits and a 5, may not round alike, and gives None.
fn round_digits(mut digits: Vec<u8>, mut e: i32, n: usize) -> Option<(Vec<u8>, i32)> {
    if digits.len() <= n {
        digits.resize(n, 0);
        return Some((digits, e));
    }
    if digits.len() == n + 1 && digits[n] == 5 {
        return None;
    }
    let up = digits[n] >= 5;
    digits.truncate(n);
    if up && round_up(&mut digits) {
        digits.insert(0, 1);
        digits.pop();
        e += 1;
    }
    Some((digits, e))
}

/// Add one at the last digit; true when it carries out of the first.
fn round_up(digits: &mut [u8]) -> bool {
    for d in digits.iter_mut().rev() {
        if *d == 9 {
            *d = 0;
        } else {
            *d += 1;
            return false;
        }
    }
    true
}

fn text(digits: &[u8]) -> String {
    digits.iter().map(|d| char::from(b'0' + d)).collect()
}

/// JavaScript's `toPrecision(p)`: `p` significant digits, in exponential
/// notation when the exponent is below -6 or not below `p`.
pub fn precision(v: f64, p: usize) -> String {
    if !v.is_finite() {
        return js_string(v);
    }
    let sign = if v < 0.0 { "-" } else { "" };
    let (digits, e) = if v == 0.0 {
        (vec![0; p], 0)
    } else {
        round_significant(v.abs(), p)
    };
    let d = text(&digits);
    let body = if e < -6 || e >= p as i32 {
        let ex = if e < 0 {
            format!("-{}", -e)
        } else {
            format!("+{e}")
        };
        if p == 1 {
            format!("{d}e{ex}")
        } else {
            format!("{}.{}e{ex}", &d[..1], &d[1..])
        }
    } else if e == p as i32 - 1 {
        d
    } else if e >= 0 {
        let at = e as usize + 1;
        format!("{}.{}", &d[..at], &d[at..])
    } else {
        format!("0.{}{d}", "0".repeat((-e - 1) as usize))
    };
    format!("{sign}{body}")
}

/// JavaScript's `toFixed(f)`: `f` decimals, ties away from zero; `String(n)`
/// from 1e21 up.
pub fn fixed(v: f64, f: usize) -> String {
    if !v.is_finite() || v.abs() >= 1e21 {
        return js_string(v);
    }
    let sign = if v < 0.0 { "-" } else { "" };
    // Below 2^50 units of the last decimal, an ulp is under a quarter of
    // one.
    let x = v.abs();
    if x * 10f64.powi(f as i32) < (1u64 << 50) as f64 {
        let (mut digits, mut e) = shortest_digits(x);
        // Rounding at a digit before the first: lead with zeros up to it.
        let first = -(f as i32);
        if e < first {
            let pad = (first - e) as usize;
            digits.splice(0..0, std::iter::repeat_n(0, pad));
            e = first;
        }
        let n = (e - first + 1) as usize;
        if let Some((mut digits, e)) = round_digits(digits, e, n) {
            // A carry out of the first digit moved the last up one place.
            digits.resize((e - first + 1) as usize, 0);
            let mut out = String::from(sign);
            if e >= 0 {
                out.push_str(&text(&digits[..=e as usize]));
            } else {
                out.push('0');
            }
            if f > 0 {
                out.push('.');
                if e < 0 {
                    out.extend(std::iter::repeat_n('0', (-e - 1) as usize));
                }
                out.push_str(&text(&digits[(e + 1).max(0) as usize..]));
            }
            return out;
        }
    }
    let s = format!("{:.*}", f + EXTRA, v.abs());
    let (int, frac) = s.split_once('.').unwrap();
    let mut digits: Vec<u8> = int
        .bytes()
        .chain(frac.bytes().take(f))
        .map(|b| b - b'0')
        .collect();
    if frac.as_bytes()[f] - b'0' >= 5 && round_up(&mut digits) {
        digits.insert(0, 1);
    }
    let d = text(&digits);
    let at = d.len() - f;
    let body = if f == 0 {
        d
    } else {
        format!("{}.{}", &d[..at], &d[at..])
    };
    format!("{sign}{body}")
}
