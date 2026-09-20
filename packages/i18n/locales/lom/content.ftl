# Loma content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `lom` is Loma — Löömàgòòi to its Liberian speakers, Toma across the border in
# Guinea — Southwestern Mande, spoken in Lofa and Gbarpolu counties and in
# Guinea's Macenta and Nzérékoré prefectures. It is seeded beside `locales/kpe`
# (Kpelle), the other Southwestern Mande catalog in this batch, and the two
# headers cross-reference each other for what the subgroup shares.
#
# Loma has no grammatical gender, no article and no case, so `$gender` and
# `$role` go unused exactly as they do in English, in `locales/bm`, in
# `locales/dyu` and in `locales/mnk`. It also has **no adjective-agreement
# marking of any kind** — not even the qualifier suffix (`locales/bm`, `-man`)
# or the definite suffix (`locales/mnk`, `-o`) that the three Manding
# catalogs carry. `Intl.PluralRules('lom')` resolves to the same two
# categories English uses, `one` and `other`, so the `[one]`/`*[other]`
# branches below are as close to the source shape as this batch gets.
# Adjectives follow the noun, exactly as they do in the three Manding
# catalogs, so composition messages put the noun first.
#
# `Intl.DisplayNames` has no entry for `lom` — it echoes the tag back rather
# than answering `undefined`, which reads the same as no answer at all — so
# `LOCALE_NAME_FALLBACKS` needs a manual English name; "Loma" is correct and
# unambiguous, and no endonym is supplied here with enough confidence to add
# one (Löömàgòòi names the language as spoken in Liberia specifically, and a
# speaker should be the one to decide whether the label should say that or
# stay with the cover term).
#
# This is the least digitized language in the batch: `locales/bm`, `locales/dyu`
# and `locales/mnk` all had a body of existing text to draw from, and Loma does
# not. The vocabulary here is built from the handful of published word lists —
# Sadler's grammar and Omniglot's phrase list are what confirm «ɔɔi» yes, «bha»
# no, and a few more — extended by calque for everything the source lists do
# not cover. A speaker's first pass should treat every word not in that short
# list as a guess.
#
# `element-name` and `element-anion-name` are left out, so those 130 keys fall
# back to English. This is the school-system case, but Loma's own range makes
# it two school systems rather than one: Liberian secondary science is taught
# in English, and Guinean secondary science in French, so a single fallback
# cannot be the curriculum on both sides of the border the way it is for a
# language spoken inside one country. Leaving both keys out lets each side's
# reader meet the vocabulary their own textbook already used — the same
# reasoning `locales/mnk`'s header gives for a language spanning several
# mediums at once — rather than this seed asserting a nomenclature belonging
# to only one of the two.


## Style vocabulary

color =
    .black = wulewule
    .white = gɛlɛgɛlɛ
    .gray = kpuluwoo
    .red = woilei
    .orange = wolombo-kolo
    .yellow = pɛlɛnyɛ
    .green = kpokolo
    .cyan = jii-kolo kpokolo
    .blue = jii-kolo
    .purple = kula-kolo
    .pink = woilei-fanyi
    .brown = ndunya-kolo
line-width =
    .thick = gbagba
    .thin = kpinkpin
line-style =
    .dashed = tɛgɛlen
    .dotted = kɛlɛ-kɛlɛ
fill-style =
    .horizontal = laa-laa
    .vertical = kologboo-kologboo
    .diagonal = gbaalen
    .backdiagonal = gbaalen-kpogbo
    .dots = kɛlɛ-nu
    .diamonds = kula-taamaa-nu
noun =
    .line = tan
    .line-segment = tan-kunkun
    .ray = tan-bin
    .vector = tan-woo
    .curve = tan-gbaalen
    .function = kɛli
    .parabola = parabola
    .polyline = tan-caa
    .polygon = fan-caa
    .triangle = fan-saba
    .rectangle = fan-naani
    .circle = kulundu
    .region = yɔrɔ
    .point = kɛlɛ
    .square = fan-naani-lɔnni
    .diamond = kula-taamaa
    .cross = kula-fele
    .plus = pulusi
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] fan-caa { $numSides } lɔnni
    }
noun-gender = neuter

## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $lineStyle } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = fanla
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } nun
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } nun
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } nun
       *[plain] { $filled } { $color } { $noun }
    }
style-border-clause =
    { $parts ->
        [with-article] { $border } gbansan nun
        [and] nun { $border } gbansan
        [and-article] nun { $border } gbansan
       *[with] { $border } gbansan nun
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = fanla gaa
style-text =
    { $parts ->
        [background] { $color } nun kpogbo-kolo { $background } nun
       *[plain] { $color }
    }
style-background-none = ɓoyi

## Boolean words

boolean-true = true
boolean-false = false

## Answer buttons

answer-submit-label = Jaabi kɔlɔ
answer-submit-label-no-correctness = Jaabi ci

## Sectional blocks

section-name =
    .activity = Kɛta
    .aside = Kpɛlɛ-kuma
    .cascade = Suuli-suuli
    .definition = Fɔlɔ-kuma
    .example = Misaali
    .exercise = Kɛcogo
    .exercises = Kɛcogo-nu
    .given-answer = Jaabi
    .note = Sɛbɛ-kunkun
    .objectives = Kɔɔlu-nu
    .paragraphs = Kunkun-nu
    .part = Yɔrɔ
    .problem = Ɲininka
    .problems = Ɲininka-nu
    .proof = Jɛnjɛn
    .question = Ɲininka
    .section = Yɔrɔ-baa
    .solution = Jaabi-jɛnjɛn
    .task = Kɛta-baalu
    .theorem = Sɛbɛ-tigi-kuma
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Nɔnabɔli

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabali { $enumeration }
        [numbered-title] Tabali { $enumeration }{ ": " }
        [unnumbered-title] Tabali{ ": " }
       *[unnumbered] Tabali
    }
figure-name =
    { $parts ->
        [numbered] Ja { $enumeration }
        [numbered-caption] Ja { $enumeration }{ ": " }
        [unnumbered-caption] Ja{ ": " }
       *[unnumbered] Ja
    }

## Paginator controls

paginator-previous = Kɔrɔ
paginator-next = Nata
paginator-page = Peji
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = wala
piecewise-condition-if = ni
piecewise-condition-otherwise = fɛn gbɛtɛ bɛɛ na

## Chemistry
##
## Left out — see this file's header for why the two-country school-system
## split makes a single fallback the wrong shape here.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Elemɛn-taamaa Sɔsɔlen
chemistry-invalid-ionic-compound = Yɛlɛma-fan Sɔsɔlen
