# Sranan Tongo (Sranantongo) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in. Translated from `locales/en/content.ftl`, which is the source of
# truth: `lint:i18n` rejects a key that does not exist there, and reports a key
# that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **1986 official Surinamese orthography** — «taki»,
# «wan», «sma», «tu», «puru», «sroto», «koloku». `u` for /u/ and never «oe»,
# `y` for the glide and never «j», `dy` for the voiced affricate, `ky` and `gy`
# for the palatalized stops, and vowel length written with a single letter
# rather than a doubled one. The pre-1986 Dutch-influenced spellings are not
# used anywhere in these four files and must not be mixed into them. The system
# is phonemic Latin with no diacritics at all, so an accented character here
# would be an error. `chrome.ftl`'s header sets the differences out point by
# point.
#
# **Word order: the modifier comes before the noun.** A Sranan Tongo adjective
# normally stands in front of its head, the same order English uses — «bigi
# oso», «redi lin». So every composition message here **keeps the English
# order**: `style-stroke`, `style-with-noun`, `style-filled`,
# `style-filled-with-noun` and `style-fill` put the adjectives first and the
# noun last, exactly as English does. Nothing is reordered.
#
# **No agreement.** Sranan Tongo has no grammatical gender and no adjective
# agreement: an adjective takes no ending and agrees with nothing. So **no
# message forks on `$gender` or `$role`**, and `noun-gender` answers a single
# token that nothing reads.
#
# **Number.** `Intl.PluralRules("srn")` has no CLDR data of its own for `srn`:
# it resolves to `en-US` and answers `['one', 'other']`. Sranan marks the
# plural with the preposed «den», and a noun after a numeral is unmarked — «tu
# pisi», not a pluralized noun — so both branches would be word-for-word
# identical here. That is why **one unselected form** is written wherever
# English selects on a count, and why no count-driven select appears anywhere
# in these four files.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# School science in Suriname is taught in Dutch, from Dutch textbooks; there is
# no Sranan Tongo periodic table in use and no settled Sranan spelling for the
# hundred and eighteen names. Writing one out would be transliterating the
# Dutch list and calling the result a Sranan nomenclature. `lint:i18n` reports
# the two keys as missing coverage and that is the correct report.
# `ion-name-oxidation-state`, `chemistry-invalid-symbol` and
# `chemistry-invalid-ionic-compound` **are** covered — they are frames, not
# vocabulary.
#
# **Loans kept, rather than coined.** Sranan takes its technical words from
# Dutch and English and this seed keeps them, spelled in the 1986 orthography:
# «funksi», «vektor», «parabola», «poligon», «rektangel», «firkanti»,
# «diagonal», «horizontal», «vertikal», «interval», «tafra», «prenki»,
# «definisi», «teorema», «paragraaf», «kaskade», «problema». Sranan words are
# used where Sranan has one: «lin», «punt», «lontu» (circle), «kroktu lin»
# (curve), «kroysi» (cross), «kontren» (region), «blaka weti grei redi geri
# grun blaw brun». The words a reviewer should look at first are «syan» for
# *cyan*, «rosi» for *pink*, «purper» for *purple* and «dul» for *objective* —
# each is a loan or a stretch where Sranan has no settled everyday word. The
# technical vocabulary here is a **lexifier loan set**, Dutch- and
# English-mediated, carried in Sranan Tongo's own grammar and written in the
# 1986 orthography: these loans are the words the language actually uses, and
# the sentences built around them are Sranan, not Dutch.


## Style vocabulary

color =
    .black = blaka
    .white = weti
    .gray = grei
    .red = redi
    .orange = oranya
    .yellow = geri
    .green = grun
    .cyan = syan
    .blue = blaw
    .purple = purper
    .pink = rosi
    .brown = brun

line-width =
    .thick = deki
    .thin = finyi

line-style =
    .dashed = strepistrepi
    .dotted = puntupuntu

fill-style =
    .horizontal = horizontal lin
    .vertical = vertikal lin
    .diagonal = diagonal lin
    .backdiagonal = diagonal lin na tra sei
    .dots = puntu
    .diamonds = dyamanti

noun =
    .line = lin
    .line-segment = pisi lin
    .ray = strali
    .vector = vektor
    .curve = kroktu lin
    .function = funksi
    .slope-field = helingfeld
    .vector-field = vektorfeld
    .parabola = parabola
    .polyline = polilin
    .polygon = poligon
    .triangle = driuku
    .rectangle = rektangel
    .circle = lontu
    .region = kontren
    .point = punt
    .square = firkanti
    .diamond = dyamanti
    .cross = kroysi
    .plus = plus

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelmati poligon nanga { $numSides } sei
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

style-filled-word = furu

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } nanga { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } nanga { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } nanga { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] nanga wan { $border } kanti
        [and] nanga { $border } kanti
        [and-article] nanga wan { $border } kanti
       *[with] nanga { $border } kanti
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = no furu

style-text =
    { $parts ->
        [background] { $color } nanga wan { $background } bakagron
       *[plain] { $color }
    }

style-background-none = no wan


## Boolean words

boolean-true = tru
boolean-false = falsi


## Answer buttons

answer-submit-label = Luku a wroko
answer-submit-label-no-correctness = Seni a piki


## Sectional blocks

section-name =
    .activity = Aktiviteit
    .aside = Seitori
    .cascade = Kaskade
    .definition = Definisi
    .example = Eksempre
    .exercise = Wroko
    .exercises = Den wroko
    .given-answer = Piki
    .note = Nota
    .objectives = Dul
    .paragraphs = Paragraaf
    .part = Pisi
    .problem = Problema
    .problems = Den problema
    .proof = Bewisi
    .question = Aksi
    .section = Seksi
    .solution = Oplosing
    .task = Opdrakti
    .theorem = Teorema

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Tipi


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tafra { $enumeration }
        [numbered-title] Tafra { $enumeration }{ ": " }
        [unnumbered-title] Tafra{ ": " }
       *[unnumbered] Tafra
    }

figure-name =
    { $parts ->
        [numbered] Prenki { $enumeration }
        [numbered-caption] Prenki { $enumeration }{ ": " }
        [unnumbered-caption] Prenki{ ": " }
       *[unnumbered] Prenki
    }


## Paginator controls

paginator-previous = Baka
paginator-next = Fesi
paginator-page = Blad

paginator-page-status = { $pageLabel } { $currentPage } fu { $numPages }


## Piecewise functions

piecewise-condition-or = noso

piecewise-condition-if = efu

piecewise-condition-otherwise = efu no so


## Chemistry
##
## `element-name` and `element-anion-name` are omitted; see the header.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = A chemia-marki no bun
chemistry-invalid-ionic-compound = A ioni-verbinding no bun

## Inputs embedded in math

math-embedded-input-blank = leigi

math-embedded-input-blank-ordinal = leigi { $ordinal } fu { $total }
