# Kpelle content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kpe` is Kpelle (Kpɛlɛwoo), Southwestern Mande, spoken across central
# Liberia (Bong, Lofa, and Nimba counties, among the largest language
# communities in the country) and in a smaller area of south-eastern Guinea.
# It is seeded beside `locales/lom` (Loma), the other Southwestern Mande
# catalog in this batch, and the two headers cross-reference each other.
#
# Kpelle has no grammatical gender, no article and no case, so `$gender` and
# `$role` go unused exactly as they do in `locales/lom`. It also has no
# adjective-agreement marking of any kind, and adjectives/descriptions follow
# the noun, so composition messages put the noun first, again matching
# `locales/lom`. `Intl.PluralRules('kpe')` has no dedicated data in Node's
# ICU build and falls back to the generic `one`/`other` categories, so the
# `[one]`/`*[other]` branches below use that shape rather than any Kpelle
# specific one.
#
# This seed has less to draw on than `locales/lom`: Loma at least has
# Sadler's grammar and an Omniglot phrase list to confirm a few words
# directly; no comparable source was available here. What differs from a
# plain copy of `locales/lom` is: the numerals (Kpelle `tao`/`feere`/`saba`/
# `naa` for one/two/three/four, not Loma's Manding-shaped `kelen`/`fila`/
# `naani`), the verb `kɛ` "to do, become" (independently attested for Kpelle
# in Welmers's grammar and not merely assumed from Loma), and — for register
# neither source list covers, like "accessibility" — an English loanword
# rather than a Loma-style calque, since Liberian English rather than
# Guinean French/Maninka is the contact language a Kpelle reader is more
# likely to already have technical vocabulary from. The color terms, the
# plural shape `-ŋa`, and the grammatical particles reused from `locales/lom`
# on the cognate assumption are all uncertain calques; a speaker's first pass
# should treat everything except the numerals and `kɛ` as a guess.
#
# `Intl.DisplayNames` has no entry for `kpe` — it echoes the tag back rather
# than answering `undefined`, which reads the same as no answer at all — so
# `LOCALE_NAME_FALLBACKS` needs a manual English name; "Kpelle" is correct and
# unambiguous, and no endonym is supplied here with enough confidence to add
# one, for the same reason `locales/lom`'s header gives.
#
# `element-name` and `element-anion-name` are left out, so those 130 keys fall
# back to English, the same reasoning `locales/lom`'s header gives: Liberian
# secondary science is taught in English, so a hand-built Kpelle nomenclature
# this seed cannot verify would compete with, rather than match, the
# vocabulary a reader's own textbook already used.


## Style vocabulary

color =
    .black = kpuu-kpuu
    .white = faa-faa
    .gray = kpuu-faa
    .red = wɔlɔ-wɔlɔ
    .orange = wɔlɔ-pɛlɛ
    .yellow = pɛlɛ-pɛlɛ
    .green = gbo-gbo
    .cyan = jii-wɔlɔ gbo-gbo
    .blue = jii-wɔlɔ
    .purple = fuu-wɔlɔ
    .pink = wɔlɔ-faa
    .brown = ndunia-wɔlɔ

line-width =
    .thick = gbagba
    .thin = kpinkpin

line-style =
    .dashed = tɛgɛli
    .dotted = kɛlɛ-kɛlɛ

fill-style =
    .horizontal = laa-laa
    .vertical = kologboo-kologboo
    .diagonal = gbaali
    .backdiagonal = gbaali-kpogbo
    .dots = kɛlɛ-ŋa
    .diamonds = kula-taamaa-ŋa

noun =
    .line = tan
    .line-segment = tan-kunkun
    .ray = tan-bin
    .vector = tan-kwaa
    .curve = tan-gbaali
    .function = kɛli
    .parabola = parabola
    .polyline = tan-caa
    .polygon = fan-caa
    .triangle = fan-saba
    .rectangle = fan-naa
    .circle = kulundu
    .region = yɔrɔ
    .point = kɛlɛ
    .square = fan-naa-lɔnni
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
        [pattern] { $filled } { $color } { $pattern } nda
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern } nda
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern } nda
       *[plain] { $filled } { $color } { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] { $border } gbansan nda
        [and] nda { $border } gbansan
        [and-article] nda { $border } gbansan
       *[with] { $border } gbansan nda
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = fanla gaa

style-text =
    { $parts ->
        [background] { $color } nda kpogbo-kolo { $background } nda
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
    .exercises = Kɛcogo-ŋa
    .given-answer = Jaabi
    .note = Sɛbɛ-kunkun
    .objectives = Kɔɔlu-ŋa
    .paragraphs = Kunkun-ŋa
    .part = Yɔrɔ
    .problem = Ɲininka
    .problems = Ɲininka-ŋa
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

chemistry-invalid-symbol = Elemɛn-taamaa Sɔsɔi
chemistry-invalid-ionic-compound = Yɛlɛma-fan Sɔsɔi
