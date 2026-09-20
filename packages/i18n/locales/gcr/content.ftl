# Guianese Creole French (kriyòl gwiyanè) content catalog: the prose the core
# computes into the document. Selected by `documentLocale` — the language the
# activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The orthography of French Guiana, as `chrome.ftl` sets it
# out letter by letter: «kriyòl», «kaz», «lò», «roun», «répons». It is written
# on the same principles as GEREC's Guadeloupean and Martinican spelling and
# as the Saint Lucian one, and looks much like them on the page; what parts
# them is the language — Guianese has the pronouns «mo to li nou zòt yé», the
# indefinite article «roun», and a single postposed definite «-a» («-an» after
# a nasal vowel) where the Antilles have the four-way «a / la / an / lan». The
# French-etymological spelling is **not mixed into this file**.
#
# **Word order: the modifier follows the noun.** Guianese puts an attributive
# adjective after its head — «liy wouj épé» is *thick red line*, noun first —
# so the composition messages **reverse** the English order.
# `style-with-noun` and `style-filled-with-noun` put «{ $noun }» in front of
# «{ $description }», and `style-fill` postposes the pattern word onto the
# colour («dyaman blé» for *blue diamonds*).
#
# **Nothing agrees, so nothing selects.** Guianese has no grammatical gender,
# no case and no adjective agreement: an adjective is one invariable word
# wherever it stands. So not one message here forks on `$gender` or on
# `$role`, and `noun-gender` answers a single token that nothing downstream
# reads. What the composition messages do is order and choose, and that is the
# whole of the work.
#
# `noun-regular-polygon` splits the way `locales/es` does, but for word order
# rather than for agreement: the head is «poligòn régilyé» and the side count
# follows the adjectives as a relative clause, «ki ni N koté». That is the
# `[noun-tail]` branch of `style-with-noun`.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `gcr`, and there is
# nothing for it to have: a noun has one form for one and for many. The plural
# is the preposed «sé» with the postposed determiner («sé pwen-an»), and a
# numeral in front of a bare noun does the job alone. No message in this file
# writes a `[one]`/`[other]` select, and `noun-regular-polygon` says «ki ni 1
# koté» and «ki ni 5 koté» with the same word. `.exercise` and `.exercises`,
# and `.problem` and `.problems`, are therefore the same word twice: that is
# the language's nominal morphology, not a copy-paste slip.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Science in French Guiana is schooled in French, from the French national
# curriculum and French textbooks, so the periodic table a Guianese pupil
# reads is `locales/fr`'s. There is no published Guianese list of the hundred
# and eighteen element names, and writing one would be respelling the French
# list and calling the result a Guianese nomenclature. `lint:i18n` reports the
# two keys as missing coverage and that is the correct report.
# `ion-name-oxidation-state` and the two invalid-symbol messages **are**
# covered — they are frames, not vocabulary.
#
# **Loans.** French, respelled: «poligòn», «parabòl», «vektè», «fonksyon»,
# «rektang», «triyang», «segman», «dimi-dwat», «réjyon», «vyolèt»,
# «orizontal», «vètikal», «dyagonal», «aktivité», «définisyon», «egzanp»,
# «egzèsis», «objektif», «paragraf», «téyorèm», «solisyon», «kaskad»,
# «tablo», «figi», «senbòl», «chimik», «yonik», «konpozé». «siyan» is the
# weakest word in the file: Guianese has «blé» and no settled word for cyan,
# and a speaker may well prefer «blé kler». Everything around the loans is
# creole — «ki ni» for the relative clause, «épi» for *with*, «san» for
# *without*, «sé» for the plural, «pa» for negation.
#
# **Confidence.** The colour words, the shape nouns and the section words are
# ordinary Guianese and are the least doubtful thing here. The style
# composition is a judgement about word order that a speaker should read
# aloud; «siyan» and «kaskad» are the two entries most likely to be replaced.


## Style vocabulary

color =
    .black = nwè
    .white = blan
    .gray = gri
    .red = wouj
    .orange = zoranj
    .yellow = jòn
    .green = vèt
    .cyan = siyan
    .blue = blé
    .purple = vyolèt
    .pink = woz
    .brown = maron
line-width =
    .thick = épé
    .thin = fen
line-style =
    .dashed = an tirè
    .dotted = an pwentiyé
# Noun phrases. «liy» is one word for one line and for many, so these are not
# plurals of anything — they are what the language says in both places.
fill-style =
    .horizontal = liy orizontal
    .vertical = liy vètikal
    .diagonal = liy dyagonal
    .backdiagonal = liy dyagonal envès
    .dots = pwen
    .diamonds = dyaman
noun =
    .line = liy
    .line-segment = segman
    .ray = dimi-dwat
    .vector = vektè
    .curve = koub
    .function = fonksyon
    .slope-field = chan pant
    .vector-field = chan vektè
    .parabola = parabòl
    .polyline = liy brizé
    .polygon = poligòn
    .triangle = triyang
    .rectangle = rektang
    .circle = sèk
    .region = réjyon
    .point = pwen
    .square = karé
    .diamond = dyaman
    .cross = kwa
    .plus = plis
# The head is the bare noun and the side count follows the adjectives as a
# relative clause, so that the adjectives stay beside the noun they describe.
# «koté» is invariant: «ki ni 1 koté», «ki ni 5 koté».
noun-regular-polygon =
    { $part ->
        [tail] ki ni { $numSides } koté
       *[head] poligòn régilyé
    }
# One answer for every noun: Guadeloupean has no grammatical gender, so
# nothing downstream has anything to agree with.
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
# The noun first and the adjectives after it, which is the opposite of
# English. The regular polygon's relative clause follows both.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = ranpli
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } épi { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } épi { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } épi { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
style-border-clause =
    { $parts ->
        [with-article] épi roun bòdi { $border }
        [and] é bòdi { $border }
        [and-article] é roun bòdi { $border }
       *[with] épi bòdi { $border }
    }
# The pattern word is postposed straight onto the colour — «dyaman blé» — for
# the same reason the adjectives are: the modifier follows its head, and there
# is no agreement for a supporting noun to carry.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = san ranpli
style-text =
    { $parts ->
        [background] { $color } épi roun fon { $background }
       *[plain] { $color }
    }
style-background-none = arien

## Boolean words

boolean-true = vré
boolean-false = fo

## Answer buttons

answer-submit-label = Vérifyé travay-a
answer-submit-label-no-correctness = Voyé répons-a

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are the same
# word: the plural is the preposed «sé», and a heading does not carry it. Two
# ids with one translation is what a language with no plural suffix looks like
# here, not a copy-paste.
section-name =
    .activity = Aktivité
    .aside = Nòt asou koté
    .cascade = Kaskad
    .definition = Définisyon
    .example = Egzanp
    .exercise = Egzèsis
    .exercises = Egzèsis
    .given-answer = Répons
    .note = Nòt
    .objectives = Objektif
    .paragraphs = Paragraf
    .part = Pati
    .problem = Pwoblèm
    .problems = Pwoblèm
    .proof = Prèv
    .question = Kèsyon
    .section = Seksyon
    .solution = Solisyon
    .task = Travay
    .theorem = Téyorèm
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Endikasyon

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
        [numbered] Figi { $enumeration }
        [numbered-caption] Figi { $enumeration }{ ": " }
        [unnumbered-caption] Figi{ ": " }
       *[unnumbered] Figi
    }

## Paginator controls

paginator-previous = Avan
paginator-next = Apré
paginator-page = Paj
paginator-page-status = { $pageLabel } { $currentPage } asou { $numPages }

## Piecewise functions

piecewise-condition-or = oben
piecewise-condition-if = si
piecewise-condition-otherwise = sinon

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Science in Guadeloupe is taught in French, from the French
## curriculum: the periodic table on the classroom wall is French, and there
## is no settled Guadeloupean table for a seed to reproduce. See the header.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Senbòl chimik ki pa valab
chemistry-invalid-ionic-compound = Konpozé yonik ki pa valab

## Inputs embedded in math

math-embedded-input-blank = blan
math-embedded-input-blank-ordinal = blan { $ordinal } asou { $total }
