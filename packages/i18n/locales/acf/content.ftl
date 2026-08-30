# Saint Lucian Creole French (Kwéyòl) content catalog: the prose the core
# computes into the document. Selected by `documentLocale` — the language the
# activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Saint Lucian and Dominican standard, as `chrome.ftl`
# sets it out letter by letter: «Kwéyòl», «wéponn», «yo», «sé». It is very
# close to the Martinican and Guadeloupean spelling; the two conventions that
# differ are that every etymological French /r/ is written «w» («kwéyé»,
# «kwedi», «gwi», «twiyang», «wektang», «pawabòl»), and that the determiner is
# a separate word taking «a» after an oral vowel, «la» after an oral
# consonant, «an» after a nasal vowel and «lan» after a nasal consonant, where
# GEREC hyphenates a generalized «-la». The French-etymological spelling is
# **not mixed into this file**.
#
# **Word order: the modifier follows the noun.** Saint Lucian puts an
# attributive adjective after its head — «liy wouj épé» is *thick red line*,
# noun first — so the composition messages **reverse** the English order.
# `style-with-noun` and `style-filled-with-noun` put «{ $noun }» in front of
# «{ $description }», and `style-fill` postposes the pattern word onto the
# colour («dyaman blé» for *blue diamonds*).
#
# **Nothing agrees, so nothing selects.** Saint Lucian has no grammatical
# gender, no case and no adjective agreement: an adjective is one invariable
# word wherever it stands. So not one message here forks on `$gender` or on
# `$role`, and `noun-gender` answers a single token that nothing downstream
# reads. What the composition messages do is order and choose, and that is the
# whole of the work.
#
# `noun-regular-polygon` splits the way `locales/es` does, but for word order
# rather than for agreement: the head is «poligòn wégilyé» and the side count
# follows the adjectives as a relative clause, «ki ni N koté». That is the
# `[noun-tail]` branch of `style-with-noun`.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `acf`, and there is
# nothing for it to have: a noun has one form for one and for many. The plural
# is the preposed «sé» with the postposed determiner («sé pwen an»), and a
# numeral in front of a bare noun does the job alone. No message in this file
# writes a `[one]`/`[other]` select, and `noun-regular-polygon` says «ki ni 1
# koté» and «ki ni 5 koté» with the same word. `.exercise` and `.exercises`,
# and `.problem` and `.problems`, are therefore the same word twice: that is
# the language's nominal morphology, not a copy-paste slip.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Saint Lucia schools its science in English, from an English curriculum and
# English textbooks, so the periodic table a Saint Lucian pupil reads is
# `locales/en`'s — which is what these two keys already fall back to. (In
# Dominica, where the same orthography is used, the schooling is English as
# well.) There is no published Kwéyòl list of the hundred and eighteen element
# names, and writing one would be respelling somebody else's list and calling
# the result a Kwéyòl nomenclature. `lint:i18n` reports the two keys as
# missing coverage and that is the correct report. `ion-name-oxidation-state`
# and the two invalid-symbol messages **are** covered — they are frames, not
# vocabulary.
#
# **Loans.** French, respelled by the Saint Lucian rules: «poligòn»,
# «pawabòl», «vektè», «fonksyon», «wektang», «twiyang», «segman», «dimi-dwat»,
# «wéjyon», «vyolèt», «owizontal», «vètikal», «dyagonal», «aktivité»,
# «définisyon», «egzanp», «egzèsis», «objektif», «pawagwaf», «Téyowèm»,
# «solisyon», «kaskad», «tablo», «figi», «senbòl», «chimik», «yonik»,
# «konpozé». «siyan» is the weakest word in the file: Saint Lucian has «blé»
# and no settled word for cyan, and a speaker may well prefer «blé kléwé» or
# simply the English. Everything around the loans is creole — «ki ni» for the
# relative clause, «épi» for *with*, «san» for *without*, «sé» for the plural
# and for the copula, «pa» for negation.
#
# **Confidence.** The colour words, the shape nouns and the section words are
# ordinary Kwéyòl and are the least doubtful thing here. The style composition
# is a judgement about word order that a speaker should read aloud; «siyan»
# and «kaskad» are the two entries most likely to be replaced, and the
# determiner allomorph on each noun is worth a second look.


## Style vocabulary

color =
    .black = nwè
    .white = blan
    .gray = gwi
    .red = wouj
    .orange = zowanj
    .yellow = jòn
    .green = vèt
    .cyan = siyan
    .blue = blé
    .purple = vyolèt
    .pink = woz
    .brown = mawon
line-width =
    .thick = épé
    .thin = fen
line-style =
    .dashed = an tiwè
    .dotted = an pwentiyé
# Noun phrases. «liy» is one word for one line and for many, so these are not
# plurals of anything — they are what the language says in both places.
fill-style =
    .horizontal = liy owizontal
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
    .parabola = pawabòl
    .polyline = liy bwizé
    .polygon = poligòn
    .triangle = twiyang
    .rectangle = wektang
    .circle = sèk
    .region = wéjyon
    .point = pwen
    .square = kawé
    .diamond = dyaman
    .cross = kwa
    .plus = plis
# The head is the bare noun and the side count follows the adjectives as a
# relative clause, so that the adjectives stay beside the noun they describe.
# «koté» is invariant: «ki ni 1 koté», «ki ni 5 koté».
noun-regular-polygon =
    { $part ->
        [tail] ki ni { $numSides } koté
       *[head] poligòn wégilyé
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
style-filled-word = wanpli
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
        [with-article] épi on bòdi { $border }
        [and] é bòdi { $border }
        [and-article] é on bòdi { $border }
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
style-unfilled = san wanpli
style-text =
    { $parts ->
        [background] { $color } épi on fon { $background }
       *[plain] { $color }
    }
style-background-none = anyen

## Boolean words

boolean-true = vwé
boolean-false = fo

## Answer buttons

answer-submit-label = Véwifyé twavay la
answer-submit-label-no-correctness = Voyé wéponn lan

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are the same
# word: the plural is the preposed «sé», and a heading does not carry it. Two
# ids with one translation is what a language with no plural suffix looks like
# here, not a copy-paste.
section-name =
    .activity = Aktivité
    .aside = Nòt asi koté
    .cascade = Kaskad
    .definition = Définisyon
    .example = Egzanp
    .exercise = Egzèsis
    .exercises = Egzèsis
    .given-answer = Wéponn
    .note = Nòt
    .objectives = Objektif
    .paragraphs = Pawagwaf
    .part = Pati
    .problem = Pwoblèm
    .problems = Pwoblèm
    .proof = Pwèv
    .question = Kèsyon
    .section = Seksyon
    .solution = Solisyon
    .task = Twavay
    .theorem = Téyowèm
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
paginator-next = Apwé
paginator-page = Paj
paginator-page-status = { $pageLabel } { $currentPage } asi { $numPages }

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
math-embedded-input-blank-ordinal = blan { $ordinal } asi { $total }
