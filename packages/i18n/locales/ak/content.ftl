# Akan content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `ak` is the macrolanguage, and the catalog is written in **Asante Twi**, the
# variety Ghanaian schooling and publishing use most and the one CLDR fills a
# bare `ak` in as. `tw` — the retired code for Twi — reaches this file through
# `LANGUAGE_ALIASES` in `negotiate.ts`, because nothing canonicalizes it on its
# own. Fante readers arriving under `fat` reach English rather than this, and
# deliberately so: a second catalog beside this one is the answer, not a
# widening of this one.
#
# Akan has no grammatical gender, no article and no case, so `$gender` and
# `$role` go unused here exactly as they do in English.
#
# Adjectives follow the noun — «nsensanee kɛseɛ kɔkɔɔ» — so the composition
# messages put the noun first and keep the English order among the adjectives
# themselves.
#
# The geometric nouns are the Twi ones Ghanaian school mathematics uses, and
# they are built rather than borrowed: «ahinasa» a triangle, «ahinanan» a
# four-sided figure, «ahinapii» a polygon, all on «ahina», a side. Where no
# such word has settled the catalog borrows and spells the loan the way Twi
# writes it — «vɛkta», «parabola», «fankshɔn».
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = tuntum
    .white = fitaa
    .gray = nsõ
    .red = kɔkɔɔ
    .orange = ankaa
    .yellow = akokɔsradeɛ
    .green = ahabammono
    .cyan = siyan
    .blue = bruu
    .purple = beredum
    .pink = pinki
    .brown = dɔteɛ
line-width =
    .thick = kɛseɛ
    .thin = ketewa
# Written as «a ɛwɔ …» relative phrases rather than as adjectives, so that they
# can close the description. `style-stroke` puts them last for that reason.
line-style =
    .dashed = a ɛwɔ ntwaa
    .dotted = a ɛwɔ nsɛnkyerɛnne
fill-style =
    .horizontal = nsensanee a ɛdeda hɔ
    .vertical = nsensanee a ɛgyina
    .diagonal = nsensanee a ɛkyea
    .backdiagonal = nsensanee a ɛkyea kɔ akyire
    .dots = nsɛnkyerɛnne
    .diamonds = daemɔn
noun =
    .line = nsensanee
    .line-segment = nsensanee fã
    .ray = nsensanee-kwan
    .vector = vɛkta
    .curve = nkyea
    .function = fankshɔn
    .parabola = parabola
    .polyline = nsensanee pii
    .polygon = ahinapii
    .triangle = ahinasa
    .rectangle = ahinanan tenten
    .circle = kanko
    .region = beaeɛ
    .point = pɔint
    .square = ahinanan pɛ
    .diamond = daemɔn
    .cross = mmeamudua
    .plus = kabom sɛnkyerɛnne
# The side count follows the adjectives, behind «a ɛwɔ», because Twi closes a
# noun phrase with a relative rather than opening one: «ahinapii pɛpɛɛpɛ kɔkɔɔ
# a ɛwɔ ahina 5».
noun-regular-polygon =
    { $part ->
        [tail] a ɛwɔ ahina { $numSides }
       *[head] ahinapii pɛpɛɛpɛ
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
style-filled-word = a wɔahyɛ mu ma
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } a ɛwɔ { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } a ɛwɔ { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } a ɛwɔ { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Twi has no article and joins the complement with the invariable «a ɛwɔ», so
# all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] a ɛwɔ ano { $border }
        [and] a ɛwɔ ano { $border }
        [and-article] a ɛwɔ ano { $border }
       *[with] a ɛwɔ ano { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = a wɔnhyɛɛ mu ma
style-text =
    { $parts ->
        [background] { $color } wɔ akyire { $background } so
       *[plain] { $color }
    }
style-background-none = biara nni hɔ

## Boolean words

boolean-true = nokware
boolean-false = atorɔ

## Answer buttons

answer-submit-label = Hwɛ Adwuma No
answer-submit-label-no-correctness = Fa Mmuaeɛ No Kɔ

## Sectional blocks

section-name =
    .activity = Dwumadie
    .aside = Nkyɛn asɛm
    .cascade = Nsuotene
    .definition = Nkyerɛaseɛ
    .example = Nhwɛsoɔ
    .exercise = Nsɔhwɛ
    .exercises = Nsɔhwɛ
    .given-answer = Mmuaeɛ
    .note = Nkaeɛ
    .objectives = Botaeɛ
    .paragraphs = Nkyekyɛmu
    .part = Ɔfa
    .problem = Ɔhaw
    .problems = Nhaw
    .proof = Adanseɛ
    .question = Asɛmmisa
    .section = Ɔfa
    .solution = Nsɛmmuaeɛ
    .task = Adwuma
    .theorem = Teɔrɛm
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Akwankyerɛ

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabo { $enumeration }
        [numbered-title] Tabo { $enumeration }{ ": " }
        [unnumbered-title] Tabo{ ": " }
       *[unnumbered] Tabo
    }
figure-name =
    { $parts ->
        [numbered] Mfoni { $enumeration }
        [numbered-caption] Mfoni { $enumeration }{ ": " }
        [unnumbered-caption] Mfoni{ ": " }
       *[unnumbered] Mfoni
    }

## Paginator controls

paginator-previous = Deɛ ɛdi kan
paginator-next = Deɛ ɛdi soɔ
paginator-page = Kratafa
paginator-page-status = { $pageLabel } { $currentPage } wɔ { $numPages } mu

## Piecewise functions

piecewise-condition-or = anaasɛ
piecewise-condition-if = sɛ
piecewise-condition-otherwise = sɛ ɛnte saa a

## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Ghanaian secondary science is
# taught in English throughout, so a student meeting these words meets them in
# English already, and the seed has no settled Twi list to reproduce. A speaker
# adding one should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kemikal Sɛnkyerɛnne A Ɛnteɛ
chemistry-invalid-ionic-compound = Ayɔn Nkabom A Ɛnteɛ
