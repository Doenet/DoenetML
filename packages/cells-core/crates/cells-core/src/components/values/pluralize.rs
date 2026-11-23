//! `<pluralize>`: a word in its singular or its plural, as the current
//! core's `Pluralize.js` (English only), its definition and its planner.
//!
//! The current core runs an English part-of-speech model over the text to
//! find its nouns and the numbers before them. Here the plural is found
//! when the document is compiled, by the spelling rules of English and a
//! small table of irregular nouns ([`plural_of`]), and the text is one of
//! two shapes: one word, taken to be the noun, made plural unless
//! `basedOnNumber` is 1; or a number (`2`, `0.5`, `one thousand`) and then
//! the noun, made plural unless the number is 1, or, with
//! `basedOnNumber`, unless that is. `pluralForm` is the plural instead of
//! the rules'. Other text, or text that is not literal, is refused: which
//! word of it is a noun needs the model. A single word is always taken to
//! be a noun, where the model leaves a word that is none (`only`) as it is.
//!
//! The two forms are given text values; `value` chooses between them by
//! `basedOnNumber`, which may change, or is the one the text calls for.

use crate::compile::api::*;
use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};
use crate::program::VecOp;

component! {
    /// `<pluralize>`: `value` is the string id of its text with its noun
    /// singular or plural; `basedOnNumber` the number that decides, NaN
    /// when the author gave none.
    tags: ["pluralize"],
    flags: [copyable],
    text: Text(value),
    extend_value: Scalar(value),
    default_prop: value,
    props {
        value: by_planner { text, rendered },
        basedOnNumber: by_planner,
    }
    attributes {
        pluralForm: Text,
        basedOnNumber: Scalar,
    }
    children: Value,
    planner: Plan(plan),
}

/// Plans the two forms from the literal text, and `value` as the one the
/// text or `basedOnNumber` calls for.
pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
    let at = Props::PORTS;
    let attrs = Attrs::of(ctx.record());
    let children = attrs.children;
    let text = match children.value {
        _ if children.element.is_some() => return Err(not_literal()),
        ChildValue::Blank => String::new(),
        ChildValue::Text { text, .. } => text,
        ChildValue::Reference(_) | ChildValue::Math => return Err(not_literal()),
    };
    let phrase = Phrase::of(&text)?;
    let plural = match (&phrase, &attrs.pluralForm) {
        (None, _) => text.clone(),
        (Some(p), Some(form)) => p.with_noun(&text, form),
        (Some(p), None) => p.with_noun(&text, &plural_of(&text[p.noun.clone()])),
    };
    let singular = Wire::given_text(GivenId::Children(0), ctx.intern(&text));
    let plural = Wire::given_text(GivenId::Children(1), ctx.intern(&plural));
    let mut wiring = ElemWiring::of(ComponentType::Pluralize);
    let (value, based_on_number) = match attrs.basedOnNumber {
        // Plural unless the text's own number is 1; one word is plural.
        None => {
            let by_text = phrase.as_ref().is_some_and(|p| p.number != Some(1.0));
            (if by_text { plural } else { singular }, Wire::absent())
        }
        // Branch 1 is the plural, 2 the singular, chosen by whether
        // `basedOnNumber` is 1.
        Some(source) => {
            let plural = wiring.hidden_wire(plural);
            let singular = wiring.hidden_wire(singular);
            let one = wiring.hidden(Source::computed_k(OpSpec::Eq, at.basedOnNumber, 1.0));
            let choice = wiring.hidden(Source::computed_k(OpSpec::Add, one, 1.0));
            (
                Source::vector(VecOp::Choose { n: 2 }, vec![choice, plural, singular]).into(),
                Wire::scalar(source, GivenId::Attr(attr::basedOnNumber, 0)),
            )
        }
    };
    wiring.set_public(Props {
        value,
        basedOnNumber: based_on_number,
    });
    Ok(wiring)
}

fn not_literal() -> Error {
    Error::Unsupported("<pluralize> whose content is not literal text".into())
}

/// The shape of a `<pluralize>`'s text: where its noun is, and the number
/// before it, if any.
#[derive(Debug, Clone, PartialEq)]
struct Phrase {
    /// The noun's byte range in the text.
    noun: std::ops::Range<usize>,
    /// The number written before the noun; none for a single word.
    number: Option<f64>,
}

impl Phrase {
    /// The phrase `text` is: none when it has no word; an error when it is
    /// neither one word nor a number and a word.
    fn of(text: &str) -> Result<Option<Phrase>> {
        let words = words(text);
        let Some((noun, before)) = words.split_last() else {
            return Ok(None);
        };
        let number = if before.is_empty() {
            None
        } else {
            let before: Vec<&str> = before.iter().map(|r| &text[r.clone()]).collect();
            Some(number_of(&before).ok_or_else(|| {
                Error::Unsupported(format!(
                    "<pluralize> of `{}`: its text is one word, or a number and a word",
                    text.trim()
                ))
            })?)
        };
        Ok(Some(Phrase {
            noun: noun.clone(),
            number,
        }))
    }

    /// `text` with its noun replaced by `noun`.
    fn with_noun(&self, text: &str, noun: &str) -> String {
        format!(
            "{}{noun}{}",
            &text[..self.noun.start],
            &text[self.noun.end..]
        )
    }
}

/// The byte ranges of the words of `text`, split at whitespace.
fn words(text: &str) -> Vec<std::ops::Range<usize>> {
    let mut out = Vec::new();
    let mut start = None;
    for (i, ch) in text.char_indices() {
        match (ch.is_whitespace(), start) {
            (true, Some(s)) => {
                out.push(s..i);
                start = None;
            }
            (false, None) => start = Some(i),
            _ => {}
        }
    }
    if let Some(s) = start {
        out.push(s..text.len());
    }
    out
}

/// The number the words spell: one numeral (`2`, `-1`, `0.5`, `1,000`) or
/// English number words (`one thousand`, `twenty-one`); none for anything
/// else.
fn number_of(words: &[&str]) -> Option<f64> {
    if let [word] = words
        && let Ok(v) = word.replace(',', "").parse::<f64>()
    {
        return Some(v);
    }
    let (mut total, mut current) = (0.0, 0.0);
    for word in words.iter().flat_map(|w| w.split('-')) {
        let word = word.to_lowercase();
        if word == "and" {
            continue;
        }
        let units = [
            "zero",
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            "nine",
            "ten",
            "eleven",
            "twelve",
            "thirteen",
            "fourteen",
            "fifteen",
            "sixteen",
            "seventeen",
            "eighteen",
            "nineteen",
        ];
        let tens = [
            "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
        ];
        let scales = [
            ("thousand", 1e3),
            ("million", 1e6),
            ("billion", 1e9),
            ("trillion", 1e12),
        ];
        if let Some(k) = units.iter().position(|&u| u == word) {
            current += k as f64;
        } else if let Some(k) = tens.iter().position(|&t| t == word) {
            current += 10.0 * (k as f64 + 2.0);
        } else if word == "hundred" {
            current = current.max(1.0) * 100.0;
        } else if let Some(&(_, scale)) = scales.iter().find(|(s, _)| *s == word) {
            total += current.max(1.0) * scale;
            current = 0.0;
        } else {
            return None;
        }
    }
    Some(total + current)
}

/// Nouns whose plural no rule gives, lowercase.
const IRREGULAR: &[(&str, &str)] = &[
    ("alumnus", "alumni"),
    ("analysis", "analyses"),
    ("axis", "axes"),
    ("bacterium", "bacteria"),
    ("basis", "bases"),
    ("cactus", "cacti"),
    ("calf", "calves"),
    ("child", "children"),
    ("criterion", "criteria"),
    ("crisis", "crises"),
    ("datum", "data"),
    ("die", "dice"),
    ("echo", "echoes"),
    ("elf", "elves"),
    ("foot", "feet"),
    ("fungus", "fungi"),
    ("goose", "geese"),
    ("half", "halves"),
    ("hero", "heroes"),
    ("hypothesis", "hypotheses"),
    ("knife", "knives"),
    ("leaf", "leaves"),
    ("life", "lives"),
    ("loaf", "loaves"),
    ("louse", "lice"),
    ("man", "men"),
    ("matrix", "matrices"),
    ("medium", "media"),
    ("mouse", "mice"),
    ("nucleus", "nuclei"),
    ("ox", "oxen"),
    ("parenthesis", "parentheses"),
    ("person", "people"),
    ("phenomenon", "phenomena"),
    ("potato", "potatoes"),
    ("radius", "radii"),
    ("self", "selves"),
    ("shelf", "shelves"),
    ("stimulus", "stimuli"),
    ("thesis", "theses"),
    ("thief", "thieves"),
    ("tomato", "tomatoes"),
    ("tooth", "teeth"),
    ("vertex", "vertices"),
    ("wife", "wives"),
    ("wolf", "wolves"),
    ("woman", "women"),
];

/// Nouns that are their own plural, lowercase.
const INVARIANT: &[&str] = &[
    "aircraft",
    "bison",
    "deer",
    "fish",
    "moose",
    "news",
    "offspring",
    "salmon",
    "series",
    "sheep",
    "species",
    "swine",
    "trout",
];

/// The English plural of `noun`: from the tables, else by the spelling
/// rules (`bus` → `buses`, `pony` → `ponies`, `dog` → `dogs`), in the
/// noun's case (`Mouse` → `Mice`, `DOG` → `DOGS`).
fn plural_of(noun: &str) -> String {
    let lower = noun.to_lowercase();
    let plural = if let Some(&(_, p)) = IRREGULAR.iter().find(|(s, _)| *s == lower) {
        p.to_string()
    } else if INVARIANT.contains(&lower.as_str()) {
        lower.clone()
    } else if ["s", "x", "z", "ch", "sh"]
        .iter()
        .any(|e| lower.ends_with(e))
    {
        format!("{lower}es")
    } else if let Some(stem) = lower.strip_suffix('y')
        && stem
            .chars()
            .last()
            .is_some_and(|c| c.is_alphabetic() && !"aeiou".contains(c))
    {
        format!("{stem}ies")
    } else {
        format!("{lower}s")
    };
    let mut chars = noun.chars();
    if noun.chars().count() > 1 && noun.chars().all(|c| !c.is_lowercase()) {
        plural.to_uppercase()
    } else if chars.next().is_some_and(char::is_uppercase) {
        let mut out = String::new();
        let mut p = plural.chars();
        out.extend(p.next().map(|c| c.to_ascii_uppercase()));
        out.extend(p);
        out
    } else {
        plural
    }
}

#[cfg(all(test, feature = "testing"))]
#[path = "pluralize.spec.rs"]
mod spec;

#[cfg(all(test, feature = "testing"))]
mod shows {
    use crate::Request;
    use crate::testing::test_utils::load;

    /// The text each `<p>` of `source` shows, in order.
    fn texts(source: &str, names: &[&str]) -> Vec<String> {
        let doc = load(source).unwrap();
        names
            .iter()
            .map(|n| doc.rendered_text(doc.resolve_path(n).unwrap()))
            .collect()
    }

    #[test]
    fn a_number_before_the_noun_decides() {
        assert_eq!(
            texts(
                r#"<p name="p1"><pluralize>one dog</pluralize></p>
                   <p name="p2"><pluralize>two dog</pluralize></p>
                   <p name="p3"><pluralize>zero dog</pluralize></p>
                   <p name="p4"><pluralize>1 mouse</pluralize></p>
                   <p name="p5"><pluralize>2 mouse</pluralize></p>
                   <p name="p6"><pluralize>one thousand bus</pluralize></p>
                   <p name="p7"><pluralize>0.5 bus</pluralize></p>"#,
                &["p1", "p2", "p3", "p4", "p5", "p6", "p7"]
            ),
            [
                "one dog",
                "two dogs",
                "zero dogs",
                "1 mouse",
                "2 mice",
                "one thousand buses",
                "0.5 buses"
            ]
        );
    }

    #[test]
    fn one_word_is_plural() {
        assert_eq!(
            texts(
                r#"<p name="p1"><pluralize>dog</pluralize></p>
                   <p name="p2"><pluralize>goose</pluralize></p>
                   <p name="p3"><pluralize>pony</pluralize></p>"#,
                &["p1", "p2", "p3"]
            ),
            ["dogs", "geese", "ponies"]
        );
    }

    #[test]
    fn a_plural_form_replaces_the_noun() {
        assert_eq!(
            texts(
                r#"<p name="p1"><pluralize pluralForm="cheetahs">one dog</pluralize></p>
                   <p name="p2"><pluralize pluralForm="cheetahs">two dog</pluralize></p>
                   <p name="p3"><pluralize pluralForm="cheetahs">mouse</pluralize></p>"#,
                &["p1", "p2", "p3"]
            ),
            ["one dog", "two cheetahs", "cheetahs"]
        );
    }

    #[test]
    fn based_on_number_decides_over_the_text() {
        assert_eq!(
            texts(
                r#"<p name="p1"><pluralize basedOnNumber="3">one dog</pluralize></p>
                   <p name="p2"><pluralize basedOnNumber="1">two dog</pluralize></p>
                   <p name="p3"><pluralize basedOnNumber="1.6">mouse</pluralize></p>
                   <p name="p4"><pluralize basedOnNumber="1">mouse</pluralize></p>
                   <p name="p5"><pluralize basedOnNumber="-1">pony</pluralize></p>"#,
                &["p1", "p2", "p3", "p4", "p5"]
            ),
            ["one dogs", "two dog", "mice", "mouse", "ponies"]
        );
    }

    #[test]
    fn based_on_number_follows_what_it_refers_to() {
        let mut doc = load(
            r#"<numberInput name="k" value="1"><label>k</label></numberInput>
               <p name="p">I have <pluralize basedOnNumber="$k">goose</pluralize></p>"#,
        )
        .unwrap();
        let p = doc.resolve_path("p").unwrap();
        assert_eq!(doc.rendered_text(p), "I have goose");
        let k = crate::testing::spec::cells(&doc, "k.value").unwrap()[0];
        doc.request(&[Request {
            cell: k,
            value: 3.0,
        }]);
        assert_eq!(doc.rendered_text(p), "I have geese");
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_noun_takes_its_plural_by_the_rules_or_the_tables() {
        for (singular, plural) in [
            ("dog", "dogs"),
            ("bus", "buses"),
            ("box", "boxes"),
            ("church", "churches"),
            ("pony", "ponies"),
            ("day", "days"),
            ("mouse", "mice"),
            ("goose", "geese"),
            ("tooth", "teeth"),
            ("sheep", "sheep"),
            ("Mouse", "Mice"),
            ("DOG", "DOGS"),
        ] {
            assert_eq!(plural_of(singular), plural, "{singular}");
        }
    }

    #[test]
    fn number_words_and_numerals_read_as_their_number() {
        let n = |s: &str| number_of(&s.split(' ').collect::<Vec<_>>());
        assert_eq!(n("one"), Some(1.0));
        assert_eq!(n("zero"), Some(0.0));
        assert_eq!(n("one thousand"), Some(1000.0));
        assert_eq!(n("one hundred and five"), Some(105.0));
        assert_eq!(n("twenty-one"), Some(21.0));
        assert_eq!(n("0.5"), Some(0.5));
        assert_eq!(n("1,000"), Some(1000.0));
        assert_eq!(n("green"), None);
        assert_eq!(n("one big"), None);
    }

    #[test]
    fn a_phrase_is_one_word_or_a_number_and_a_word() {
        let p = Phrase::of("two dog").unwrap().unwrap();
        assert_eq!(p.number, Some(2.0));
        assert_eq!(p.with_noun("two dog", "dogs"), "two dogs");
        assert_eq!(Phrase::of("dog").unwrap().unwrap().number, None);
        assert_eq!(Phrase::of("  ").unwrap(), None);
        assert!(Phrase::of("big dog").is_err());
    }
}
