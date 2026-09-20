# Fijian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Standard Fijian (Bauan); see `chrome.ftl`'s header.
#
# Fijian has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The adjectives **follow** the noun — «laini damudamu», a red line — so every
# composition message inverts the English order.
#
# **The colour words are reduplicated stems**, which is the shape Fijian gives a
# property word: «loaloa», «vulavula», «damudamu», «drokadroka». That is not
# emphasis and not a plural; the reduplicated form *is* the colour word, and a
# corrector who shortens one to its bare stem is writing a different word.
# «karakarawa» is the entry to look at first: it names the blue of deep water
# and reaches into the greens, so the line between it and «drokadroka» does not
# fall where English puts the line between blue and green, and `.cyan` sits
# inside it with nothing of its own — the transliteration written there is a
# placeholder rather than a word.
#
# The geometry vocabulary is largely English-derived, because Fiji teaches
# mathematics in English from the primary grades: «laini», «sekele»,
# «rekitageli». Where Fijian has its own word it is written. That seam is a fact
# about the school system and is the first thing a speaker should judge.


## Style vocabulary

color =
    .black = loaloa
    .white = vulavula
    .gray = kuvukuvu
    .red = damudamu
    .orange = oreni
    .yellow = dromodromo
    .green = drokadroka
    .cyan = saiani
    .blue = karakarawa
    .purple = vaiolete
    .pink = pingi
    .brown = buraunu
line-width =
    .thick = levu
    .thin = lailai
line-style =
    .dashed = musumusu
    .dotted = tokitoki
# Noun phrases. Fijian marks no plural on the noun, so «laini» is the word for
# one line and for many alike.
fill-style =
    .horizontal = laini davo
    .vertical = laini duri
    .diagonal = laini sivia
    .backdiagonal = laini sivia vakasosomi
    .dots = toki
    .diamonds = daimani
noun =
    .line = laini
    .line-segment = iwase ni laini
    .ray = serau
    .vector = vekita
    .curve = kavu
    .function = fanisini
    .parabola = parabola
    .polyline = laini vakabekabe
    .polygon = poligani
    .triangle = taraiageli
    .rectangle = rekitageli
    .circle = sekele
    .region = yasana
    .point = poini
    .square = sikuea
    .diamond = daimani
    .cross = kurusi
    .plus = purasi
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] e { $numSides } na yasana
       *[head] poligani veitautauvata
    }
# One answer for every noun: Fijian has no grammatical gender.
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
# The noun first and the adjectives behind it, which is the opposite of English.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = sinai
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kei na { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } kei na { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } kei na { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Fijian's «na» is the common article and is not what English's "a" is doing
# here, so all four branches read alike but for the connective: «kei na» opens
# the first clause and «kei na tale ga» a further one.
style-border-clause =
    { $parts ->
        [with-article] kei na bati { $border }
        [and] kei na tale ga na bati { $border }
        [and-article] kei na tale ga na bati { $border }
       *[with] kei na bati { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = sega ni sinai
style-text =
    { $parts ->
        [background] { $color } kei na tuvaki { $background }
       *[plain] { $color }
    }
style-background-none = sega

## Boolean words

boolean-true = dina
boolean-false = lasu

## Answer buttons

answer-submit-label = Vakadikeva na cakacaka
answer-submit-label-no-correctness = Vakauta na isau

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Fijian marks no plural on the noun.
section-name =
    .activity = Cakacaka
    .aside = Ivola ni yasana
    .cascade = Kasiketi
    .definition = Ibalebale
    .example = Ivakaraitaki
    .exercise = Ivakatovotovo
    .exercises = Ivakatovotovo
    .given-answer = Isau
    .note = Ivola
    .objectives = Inaki
    .paragraphs = Parakaravu
    .part = Tikina
    .problem = Ituvatuva ni leqa
    .problems = Ituvatuva ni leqa
    .proof = Ivakadinadina
    .question = Taro
    .section = Wase
    .solution = Isolisoli ni leqa
    .task = Itavi
    .theorem = Tioreme
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Idusidusi

## Tables and figures

table-name =
    { $parts ->
        [numbered] Teveli { $enumeration }
        [numbered-title] Teveli { $enumeration }{ ": " }
        [unnumbered-title] Teveli{ ": " }
       *[unnumbered] Teveli
    }
figure-name =
    { $parts ->
        [numbered] Iyaloyalo { $enumeration }
        [numbered-caption] Iyaloyalo { $enumeration }{ ": " }
        [unnumbered-caption] Iyaloyalo{ ": " }
       *[unnumbered] Iyaloyalo
    }

## Paginator controls

paginator-previous = Liu
paginator-next = Tarava
paginator-page = Tabana
paginator-page-status = { $pageLabel } { $currentPage } mai na { $numPages }

## Piecewise functions

piecewise-condition-or = se
piecewise-condition-if = kevaka
piecewise-condition-otherwise = kevaka e sega

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Fiji teaches secondary science in English, and Fijian has no settled
## list of all 118 to seed from — the Samoan, Hawaiian and Tongan case, and for
## the same reason.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ivakatakilakila ni kemikali e sega ni dodonu
chemistry-invalid-ionic-compound = Iwiliwili ni aioni e sega ni dodonu
