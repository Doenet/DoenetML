# Tuvaluan (te ggana Tuvalu) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Dialect: southern (Funafuti–Vaitupu)**, the variety printed Tuvaluan is
# written in. The northern islands (Nanumea, Nanumaga, Niutao) differ in the
# lexicon; a northern reviewer should expect to change words, not spellings.
#
# **Orthography: geminate consonants are written double** — «ggana», «ttau»,
# «ttou» — and they are phonemic, not emphasis. Long vowels are left unmarked,
# the everyday printed practice; Besnier's dictionary doubles them and a
# reviewer preferring that should convert the whole file rather than mix.
#
# **Relation to `locales/sm`.** Samoan is Tuvaluan's nearest catalogued
# relative and this seed read it, writing what Samoan writes only where
# Tuvaluan genuinely writes it too. The colour table is the clearest place the
# two part company and not by sound change: «kena» for white where Samoan has
# «paʻepaʻe», «kula» for red where Samoan has «mūmū», «matolu» for thick where
# Samoan has «mafiafia». Where a Samoan form *was* used as a bridge it was by
# the regular correspondence «faʻa-» → «faka-» and Samoan's «ʻ» → «k», and every
# word reached that way rather than attested is flagged below.
#
# **`locales/tkl` (Tokelauan) is a sibling in this batch** and is closer to
# Tuvaluan than Samoan is, so the two catalogs are expected to look alike.
# Their agreement is not evidence that either is right — one process produced
# both, from one set of inferences, so they can be wrong together. Read each
# against its own language.
#
# **No grammatical gender**, so `noun-gender` answers one token and no
# adjective here forks on `$gender`. **No `$role` fork**: nothing changes shape
# between standing alone and sitting in a clause, so the two `-article`
# branches read like the ones without.
#
# **Number.** A numeral in front of a Tuvaluan noun does not change the noun:
# «lua poini», «lima poini». Tuvaluan does mark plural on a family of
# adjectives and nouns, and it marks it *inside* the word — by consonant
# gemination or by reduplication («matua» → «mmatua») — never by an ending. So
# a plural here would be a different word rather than a suffix, and since every
# description built below is of a single thing the singular is right
# throughout. A message about several things would need the other form and
# nothing in these arguments would say so.
#
# **Word order: the describing words follow the noun** — «laina matolu kula»,
# «poligona tutusa» — so the composition messages at the foot of this file put
# `{ $noun }` first and its adjectives behind it, and `style-fill` puts the
# pattern ahead of its colour for the same reason. That reordering is the part
# of this catalog most likely to survive review.
#
# **`noun-regular-polygon` uses the tail, and `locales/sm` does not.** The side
# count is a following clause in Tuvaluan — «poligona tutusa e lima ona tafa» —
# so the head carries the noun, the adjectives land beside it, and the count
# follows the whole phrase through `[noun-tail]`. Samoan folds the count into
# the head instead. That is a deliberate disagreement with the sibling, and it
# is the first thing to check if it is wrong.
#
# **Loans and flagged words.** Tuvalu teaches mathematics in English from the
# middle primary grades, and Tuvaluan takes loans readily, so the technical
# nouns below are loans where no Tuvaluan word could be established:
# «matematika», «poini», «laina», «poligona», «palapola», «veketa», «koluma»,
# «palakalafa», «taimane», «numela», «vaioleti». Tuvaluan has no /r/, so an
# adapted loan is spelled with «l».
#
# The words this seed is least sure of, so a reviewer can start here:
#   «liko»            circle. Reached from Samoan «liʻo» by the ʻ→k rule. That
#                     rule is regular for the ʻ that continues *k and this seed
#                     could not confirm that this one does. Unattested; check
#                     it first.
#   «laina fakasino»  ray. A coinage — "pointing line" — not a found word.
#   «laina sokosoko»  polyline. A coinage from «soko», to join.
#   «malae fakasolo»  slope field, and «malae veketa» vector field. «malae» is
#                     the open ground of a village; using it for a mathematical
#                     field is this seed's extension.
#   «galuega»         function. The Samoan calque (work → function); Tuvaluan
#                     «galuega» means work and nothing mathematical yet.
#   «mataupu»         section, against «vaega» for part. Both words are
#                     Tuvaluan; which of them a section heading should use is a
#                     judgement this seed made rather than found.
#   «fofo»            solution, and «tulafono» theorem. The first stretches a
#                     word for healing, the second a word for law.
#   «avanoa»          the blank in an embedded input. «avanoa» is an opening or
#                     an opportunity; whether it reads as a gap to fill is
#                     exactly what a speaker should say.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are not written here, so their 130 keys fall back to
# English and `lint:i18n` reports the gap. Secondary science in Tuvalu is
# taught in English, and there is no settled Tuvaluan list of the 118 elements
# to seed from; a column of invented names would report a fact about a
# curriculum that does not exist rather than a fact about the language. The
# fallback is the vocabulary a Tuvaluan student meets in their own classroom.
# Every other key in `locales/en/content.ftl` is covered, including the two new
# `math-embedded-input-blank` keys.


## Style vocabulary

color =
    .black = uliuli
    .white = kena
    .gray = efuefu
    .red = kula
    .orange = lanu moli
    .yellow = samasama
    .green = lanu meamata
    .cyan = lanu moana meamata
    .blue = lanu moana
    .purple = vaioleti
    .pink = piniki
    .brown = lanu kelekele
line-width =
    .thick = matolu
    .thin = manifi
line-style =
    .dashed = motumotu
    .dotted = togitogi
# Noun phrases: they follow «mo» and modify nothing.
fill-style =
    .horizontal = laina fakalava
    .vertical = laina fakatu
    .diagonal = laina fakapiko
    .backdiagonal = laina fakapiko fakafeagai
    .dots = togitogi
    .diamonds = taimane
noun =
    .line = laina
    .line-segment = vaega laina
    .ray = laina fakasino
    .vector = veketa
    .curve = piko
    .function = galuega
    .slope-field = malae fakasolo
    .vector-field = malae veketa
    .parabola = palapola
    .polyline = laina sokosoko
    .polygon = poligona
    .triangle = tafatolu
    .rectangle = tafafa fakaloa
    .circle = liko
    .region = koga
    .point = poini
    .square = tafafa tutusa
    .diamond = taimane
    .cross = koluse
    .plus = fakailoga fakaopoopo
# The side count is a following clause, so the head carries the noun and the
# count goes in the tail, behind the adjectives: «poligona tutusa matolu kula e
# lima ona tafa». `locales/sm` folds the count into the head instead.
noun-regular-polygon =
    { $part ->
        [tail] e { $numSides } ona tafa
       *[head] poligona tutusa
    }
# Tuvaluan has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
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
# The noun leads and its describing words follow: «laina matolu motumotu kula».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = fakafonu
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } mo { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } mo { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } mo { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Tuvaluan has no article to place, so the two `-article` branches read like
# the ones without; «kae» is what separates a further clause from the first.
style-border-clause =
    { $parts ->
        [with-article] mo se tuakoi { $border }
        [and] kae mo se tuakoi { $border }
        [and-article] kae mo se tuakoi { $border }
       *[with] mo se tuakoi { $border }
    }
# The pattern is a noun and its colour follows it, as everywhere else here.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = e se fakafonu
style-text =
    { $parts ->
        [background] { $color } i luga o se koga tua { $background }
       *[plain] { $color }
    }
style-background-none = seai

## Boolean words

boolean-true = moni
boolean-false = sē

## Answer buttons

answer-submit-label = Siaki te galuega
answer-submit-label-no-correctness = Kave te tali

## Sectional blocks

section-name =
    .activity = Galuega
    .aside = Tala i tafa
    .cascade = Fakasologa
    .definition = Fakauigaga
    .example = Fakatakitakiga
    .exercise = Fakaakoakoga
    .exercises = Fakaakoakoga
    .given-answer = Tali
    .note = Manatua
    .objectives = Fakamoemoega
    .paragraphs = Palakalafa
    .part = Vaega
    .problem = Fakalavelave
    .problems = Fakalavelave
    .proof = Fakamaoniga
    .question = Fesili
    .section = Mataupu
    .solution = Fofo
    .task = Tiute
    .theorem = Tulafono
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Fesoasoani

## Tables and figures

table-name =
    { $parts ->
        [numbered] Laulau { $enumeration }
        [numbered-title] Laulau { $enumeration }{ ": " }
        [unnumbered-title] Laulau{ ": " }
       *[unnumbered] Laulau
    }
figure-name =
    { $parts ->
        [numbered] Ata { $enumeration }
        [numbered-caption] Ata { $enumeration }{ ": " }
        [unnumbered-caption] Ata{ ": " }
       *[unnumbered] Ata
    }

## Paginator controls

paginator-previous = Muamua
paginator-next = Mulimuli
paginator-page = Itulau
paginator-page-status = { $pageLabel } { $currentPage } mai te { $numPages }

## Piecewise functions

piecewise-condition-or = io
piecewise-condition-if = kafai
piecewise-condition-otherwise = kafai seai

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap — see the header.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Fakailoga kemikale e se tonu
chemistry-invalid-ionic-compound = Tuufakatasiga ionika e se tonu

## Inputs embedded in math

math-embedded-input-blank = avanoa
math-embedded-input-blank-ordinal = avanoa { $ordinal } mai te { $total }
