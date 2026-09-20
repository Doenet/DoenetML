# Baoulé content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Baoulé (`bci`) is a Kwa language of the Tano branch, spoken in central Côte
# d'Ivoire and closely related to Anyin and to Akan/Twi (`locales/ak`), the
# nearest catalog in this roster to compare against. `Intl.Locale('bci').maximize()`
# resolves to `bci-Latn-CI`.
#
# **Orthography.** Written in the standard practical Baoulé Latin orthography
# (the alphabet used in SIL/Ivorian literacy materials: ɛ, ɔ, ŋ, and the
# apostrophe marking vowel elision, e.g. «i ti kpa»/«i timan kpa»). Baoulé is
# a tonal language and this seed **omits tone marks** throughout: the seed's
# author (a machine translation process, not a speaker) has enough confidence
# in segmental spelling to commit to it but not enough in tone placement to
# mark tones without risking a wrong mark being worse than none — the same
# choice practical/non-academic Baoulé writing (newspapers, church material)
# usually makes. A speaker restoring tones has a blank page to work from
# rather than marks to correct.
#
# **Agreement — the Akan/Twi comparison.** Like Akan, Baoulé is Kwa and has no
# grammatical gender, no article, and no case, so `$gender` and `$role` go
# unused here exactly as in English and in `locales/ak`. `Intl.PluralRules('bci')`
# reports the same two categories Akan has, `one` and `other` — but unlike Akan,
# where CLDR puts **zero** in `one`, Baoulé's `one` is the ordinary singular and
# `attempts-remaining`'s `[0]` branch is (as everywhere else) an exact-value
# match ahead of the category rather than a look at what `one` covers. Akan
# marks a noun's plural with a **prefix** («kratafa» a page → «nkratafa»
# pages); Baoulé instead marks it with a **suffix**, «mun», added after the
# noun («sran» a person → «sran mun» people) — the same direction Dyula's
# qualifier suffix points, though unrelated to it in cause. The nouns this
# catalog counts — «wafa» an attempt/way, «tɛlɛ» an answer/response — keep one
# shape whether singular or plural in ordinary speech (the way Akan's counted
# nouns do, for a different structural reason: Akan's counted nouns already
# carry their plural prefix in the singular; Baoulé's simply do not obligatorily
# take «mun» in this counting context), so the `[one]`/`[other]` selects collapse
# to a single wording exactly as `locales/ak` collapses them, and only an
# exact-match `[0]` branch survives where English has one.
#
# **Verbal morphology — an explicit caveat.** Baoulé negates a verb with a
# suffix, «-man» (used throughout this catalog: «i ti kpa» it is correct /
# «i timan kpa» it is not correct), and this seed applies that consistently.
# Beyond negation, though, Baoulé's aspect and tense marking is richer than
# this seed's author can place with confidence sentence by sentence, so verbs
# here are kept in their simplest, least-inflected form rather than guessed
# at with a specific aspect marker — a deliberate simplification, not a claim
# that Baoulé lacks tense/aspect marking. A speaker's first pass should expect
# to add aspect marking a machine pass could not respect.
#
# Adjectives, as in Akan, are said to modify a noun already named, mostly
# following it or joining it with a relative-like connector rather than
# preceding it as English does; this catalog keeps that order throughout.
#
# **Vocabulary policy.** Everyday and grammatical vocabulary (numerals,
# pronouns, «kpa» good/correct, «sa» a thing/matter, «sa tɛ» a fault/error,
# «tɛlɛ» a reply/answer, «wafa» an attempt/way, «nian» to look/check, «klɛ» to
# write, «kanngan» to read) is native Baoulé. Technical vocabulary that names a
# DoenetML/mathematics/programming concept and has no settled Baoulé word —
# "attribute", "element" (the schema sense), "function", "expression",
# "variable", "matrix" and the like — is rendered with a French loanword
# (spelled the way Baoulé practical orthography spells a loan, e.g. «atribi»,
# «fɔnksiɔn», «varyabli»), the same choice `locales/dyu`'s header explains for
# its own mathematical nouns: Ivorian schooling, Baoulé country included, is
# French-medium, so a Baoulé-speaking student already meets this vocabulary in
# French and a coined native alternative would be inventing a word no
# classroom uses. The geometric noun a document draws is «liɲ» (also a French
# loan, from "ligne"), kept distinct from «layin», the source-code line
# `chrome.ftl`, `diagnostics.ftl` and `editor.ftl` refer to (an English/French
# loan those catalogs use, matching `locales/ak`'s and `locales/dyu`'s own
# distinction between the two "line"s).
#
# **Chemistry.** `element-name` and `element-anion-name` are left out, so
# those 118 + 12 keys fall back to English and `lint:i18n` reports the gap.
# Côte d'Ivoire's official language is French and its secondary science
# curriculum, chemistry included, is French-medium — the same situation
# Malagasy's catalog documents for Madagascar and `locales/dyu` documents for
# Dyula's own country. A Baoulé-speaking student already meets the periodic
# table in French, not in a Baoulé nomenclature that does not exist to seed
# from, so the English fallback (itself a stand-in until a French catalog
# exists to be the more relevant fallback) is not a regression from what that
# student's classroom already uses.


## Style vocabulary

color =
    .black = koklo
    .white = fitaa
    .gray = fla-fla
    .red = bakabaka
    .orange = alanzi
    .yellow = sunman
    .green = ngole
    .cyan = syan
    .blue = ble
    .purple = vio
    .pink = piŋki
    .brown = ntɔlɛ
line-width =
    .thick = kpanngban
    .thin = kaan
line-style =
    .dashed = mɔ be pɔtɔli i nun
    .dotted = mɔ ndɛnkɛtɛ o i nun
fill-style =
    .horizontal = liɲ mɔ be tɔli i nun i wia bo lɛ
    .vertical = liɲ mɔ be tɔli i nun sinlɛ lɛ
    .diagonal = liɲ mɔ be tɔli i nun kekle
    .backdiagonal = liɲ mɔ be tɔli i nun kekle sin i ekun
    .dots = ndɛnkɛtɛ mun
    .diamonds = diaman mun
noun =
    .line = liɲ
    .line-segment = liɲ i wafa kaan
    .ray = liɲ mɔ ɔ kɔ atin kunngba su
    .vector = vɛktɛr
    .curve = nzo mɔ ɔ kekle
    .function = fɔnksiɔn
    .parabola = parabɔl
    .polyline = liɲ kpanngban
    .polygon = wafa mɔ ɔ wɔ nzo kpanngban
    .triangle = wafa nsan-nzo
    .rectangle = wafa nnan-nzo tenten
    .circle = wafa fɛfɛ
    .region = akpasua
    .point = pwɛn
    .square = wafa nnan-nzo pɛ
    .diamond = diaman
    .cross = kroa
    .plus = kabo sunmanlɛ
# The side count follows the adjectives, joined by «mɔ ɔ wɔ», as the border
# clause below joins its own complement — Baoulé, like Twi, closes the noun
# phrase with a relative rather than opening one.
noun-regular-polygon =
    { $part ->
        [tail] mɔ ɔ wɔ nzo { $numSides }
       *[head] wafa mɔ ɔ ti kpokpo kpa
    }
noun-gender = neuter

## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = mɔ be yili i nun ma
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } mɔ { $pattern } o i nun
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } mɔ { $pattern } o i nun
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } mɔ { $pattern } o i nun
       *[plain] { $noun } { $filled } { $color }
    }
# Baoulé has no article and joins the complement with the invariable «mɔ ɔ wɔ
# i su», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] mɔ ɔ wɔ i su { $border }
        [and] mɔ ɔ wɔ i su { $border }
        [and-article] mɔ ɔ wɔ i su { $border }
       *[with] mɔ ɔ wɔ i su { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = mɔ be yiman i nun ma
style-text =
    { $parts ->
        [background] { $color } mɔ akyi { $background } o
       *[plain] { $color }
    }
style-background-none = fii

## Boolean words

boolean-true = nanwlɛ
boolean-false = ato

## Answer buttons

answer-submit-label = Nian Adwuma'n Su
answer-submit-label-no-correctness = Fa Tɛlɛ'n Kɔ

## Sectional blocks

section-name =
    .activity = Junman
    .aside = Ndɛ nga be fa gua i wun lɛ
    .cascade = Nkanlɛ
    .definition = Nglɛlɛ
    .example = Nnyɛnndɛ
    .exercise = Aja
    .exercises = Aja mun
    .given-answer = Tɛlɛ
    .note = Nzɛnzɛ
    .objectives = Sa nga be kunndɛ
    .paragraphs = Fluwa nun akpasua
    .part = Akpasua
    .problem = Sa ndalɛ
    .problems = Sa ndalɛ mun
    .proof = Sanngan
    .question = Kosan
    .section = Akpasua
    .solution = Tɛlɛ ng'ɔ kle sa'n
    .task = Junman
    .theorem = Nglɛlɛ dan
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ndɛ ɲrɛnnɛn

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tablo { $enumeration }
        [numbered-title] Tablo { $enumeration }{ ": " }
        [unnumbered-title] Tablo{ ": " }
       *[unnumbered] Tablo
    }
figure-name =
    { $parts ->
        [numbered] Fɔto { $enumeration }
        [numbered-caption] Fɔto { $enumeration }{ ": " }
        [unnumbered-caption] Fɔto{ ": " }
       *[unnumbered] Fɔto
    }

## Paginator controls

paginator-previous = Osu
paginator-next = Ɲɛ
paginator-page = Bue
paginator-page-status = { $pageLabel } { $currentPage } (bue { $numPages } nun)

## Piecewise functions

piecewise-condition-or = annzɛ
piecewise-condition-if = sɛ
piecewise-condition-otherwise = sɛ i sɔ timan sa'n

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately omitted. See the
## header's chemistry paragraph.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simii Nzuɛn Nzɛnzɛ Mɔ I Ti Timan Kpa
chemistry-invalid-ionic-compound = Ayɔn Nkabo Mɔ I Ti Timan Kpa
