# Niuean (ko e vagahau Niue) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Orthography, the absence of the glottal stop, and the departures from Tongan
# are set out in `chrome.ftl`'s header. **This file's `noun` and `color` tables
# are canonical**: a word fixed here should be fixed in the other three files
# to match.
#
# **Word order.** The describing word **follows** the noun — «laini kula», a red
# line; «laini matolu kula», a thick red line — so every composition message
# inverts the English order, as `locales/to`, `locales/sm`, `locales/ty` and
# `locales/fj` do. Within the string of describing words this file keeps
# English's order (width, dash, colour), which is what Tongan does too.
#
# **No grammatical gender.** Niuean has none, so `noun-gender` answers one token
# for every noun and nothing here selects on `$gender`.
#
# **No `$role` fork, and the reason is worth stating**, because Niuean is
# ergative–absolutive and does mark case. It marks it with **preposed particles**
# on the noun phrase — «e» absolutive, «he» ergative and genitive, «ke he»
# directional, «a» before personal names — and those particles attach at the
# front of the phrase, to its head. A colour word here is a stative verb used
# attributively: it sits *after* the head noun, inside the phrase, and takes no
# particle of its own. So «kula» is «kula» standing alone as
# `backgroundColor` reports it and «kula» inside `style-text`'s clause, and a
# `$role` fork would write four identical branches. The particles the catalog
# does need it supplies itself, in `style-border-clause` and `style-text`, where
# it can see the whole phrase; it never welds one onto a placeable whose shape
# it cannot check, and it does not need to, since a Niuean particle is a
# separate word with one shape.
#
# **The colour table is where Niuean does not fit English's twelve keys**, in
# the way most Pacific languages do not: «lanu» plus a thing of that colour is
# the productive pattern, so blue is «lanu moana», the colour of the deep sea,
# and green is «lanu mata», the colour of raw or unripe growth — and the
# boundary between them is the reef rather than the place English puts it.
# `.cyan` has no answer at all: it falls inside «lanu moana» with nothing to
# separate it, and «saiana» written below is a transliteration standing in for a
# word, which a speaker should replace or delete. `.purple` and `.pink` are
# loans, which is what Niuean writing uses. `.brown` is written «lanu kelekele»,
# the colour of earth, by the same productive rule — a coinage of this seed
# rather than an attested entry, and flagged as one.
#
# Where the seed could not establish a real Niuean word it says so at the
# message rather than inventing quietly. The two coinages it does make —
# «lanu kelekele» above and «fakamooliaga» for *proof*, by the ordinary
# `faka-` … `-aga` nominalizer — are marked where they appear.
#
# **Chemistry is left out.** The 118 `element-name` entries and the 12
# `element-anion-name` entries fall back to English. Secondary science on Niue
# and in the Niuean-medium schooling in Aotearoa New Zealand is taught in
# English, so the fallback *is* the curriculum, and Niuean has no settled list
# of all 118 to seed from: what exists is everyday vocabulary for the substances
# known long before the elements were. That is the Tongan, Samoan and Hawaiian
# case in `locales/to`, `locales/sm` and `locales/haw`, and it is a fact about a
# syllabus rather than about the language.


## Style vocabulary

color =
    .black = uli
    .white = tea
    .gray = efuefu
    .red = kula
    .orange = moli
    .yellow = enga
    .green = lanu mata
    .cyan = saiana
    .blue = lanu moana
    .purple = viole
    .pink = piniki
    .brown = lanu kelekele
line-width =
    .thick = matolu
    .thin = manifi
line-style =
    .dashed = motumotu
    .dotted = tuitui
# Noun phrases. Niuean marks plural with a preposed «tau», and these
# descriptions are read as a kind rather than as a count, so the bare noun
# stands: «laini fakalalo» is horizontal lines as well as one of them.
fill-style =
    .horizontal = laini fakalalo
    .vertical = laini fakatū
    .diagonal = laini fakahagahaga
    .backdiagonal = laini fakahagahaga liliu
    .dots = tau tuitui
    .diamonds = tau taimane
noun =
    .line = laini
    .line-segment = vala laini
    .ray = kaila
    .vector = veketā
    .curve = laini pikopiko
    .function = gahua fika
    .slope-field = mala fakahifo
    .vector-field = mala veketā
    .parabola = palapola
    .polyline = laini fakalauloga
    .polygon = polikone
    .triangle = tapatolu
    .rectangle = tapafā loa
    .circle = fuapotopoto
    .region = matakavi
    .point = poini
    .square = tapafā tatai
    .diamond = taimane
    .cross = koluse
    .plus = lafi
# The side count follows the describing words as a complement, so that they
# stay beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] mo e { $numSides } e tapa
       *[head] polikone tatai
    }
# One answer for every noun: Niuean has no grammatical gender.
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
# The noun first and the describing words behind it, which is the opposite of
# English.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = puke
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } mo e { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } mo e { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } mo e { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Niuean has no indefinite article of English's kind — «taha» counts one rather
# than introducing — so the `-article` branches carry no extra word. What the
# four branches do distinguish is the connective: «mo e» opens the first clause
# and «ti mo e» a further one.
style-border-clause =
    { $parts ->
        [with-article] mo e kapa { $border }
        [and] ti mo e kapa { $border }
        [and-article] ti mo e kapa { $border }
       *[with] mo e kapa { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = nakai puke
style-text =
    { $parts ->
        [background] { $color } mo e tua { $background }
       *[plain] { $color }
    }
style-background-none = nakai fai


## Boolean words

boolean-true = mooli
boolean-false = loi


## Answer buttons

answer-submit-label = Sivi e gahua
answer-submit-label-no-correctness = Fakafano atu e tali


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: a Niuean noun is not marked for number in a heading like these, and the
# plural particle «tau» would say something the English does not.
#
# `.proof` is «fakamooliaga», built from «mooli» (true) by the ordinary
# `faka-` … `-aga` nominalizer. It is this seed's coinage by a productive rule,
# not an attested term; a speaker should confirm or replace it.
section-name =
    .activity = Gahuaaga
    .aside = Talahauaga fakalata
    .cascade = Kasikeiti
    .definition = Fakamaamaaga
    .example = Fakatai
    .exercise = Gahua fakaako
    .exercises = Gahua fakaako
    .given-answer = Tali
    .note = Nota
    .objectives = Taumua
    .paragraphs = Palakalafa
    .part = Vala
    .problem = Palopalema
    .problems = Palopalema
    .proof = Fakamooliaga
    .question = Hūhū
    .section = Vahega
    .solution = Fakatonuaga
    .task = Kotofa
    .theorem = Tioleme
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Tomatoma


## Tables and figures

# «laulau» is the Niuean word for a table, where `locales/to` writes the
# transliteration «Tēpile». The seed prefers the Niuean word.
table-name =
    { $parts ->
        [numbered] Laulau { $enumeration }
        [numbered-title] Laulau { $enumeration }{ ": " }
        [unnumbered-title] Laulau{ ": " }
       *[unnumbered] Laulau
    }
figure-name =
    { $parts ->
        [numbered] Fakatino { $enumeration }
        [numbered-caption] Fakatino { $enumeration }{ ": " }
        [unnumbered-caption] Fakatino{ ": " }
       *[unnumbered] Fakatino
    }


## Paginator controls

paginator-previous = Mua
paginator-next = Hoko
paginator-page = Lau
paginator-page-status = { $pageLabel } { $currentPage } he { $numPages }


## Piecewise functions

piecewise-condition-or = po ke
piecewise-condition-if = kaeke
piecewise-condition-otherwise = ka nakai


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English; the header says why.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Fakamailoga vailakau nakai tonu
chemistry-invalid-ionic-compound = Fakalatahaaga aioni nakai tonu


## Inputs embedded in math

# Read aloud inside the expression, never shown on screen, so it is kept to one
# word. «avanoa» is a gap or opening.
math-embedded-input-blank = avanoa
math-embedded-input-blank-ordinal = avanoa { $ordinal } he { $total }
