# Soga (Olusoga) content catalog: the prose the core computes into the
# document — style descriptions ("thick red line"), boolean words, section
# names. Selected by `documentLocale`, the language the activity was written
# in, rather than by the reader's UI language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** As `chrome.ftl` sets it out: the Lusoga Language
# Authority standard, `dh` written where Luganda writes `z` or `j`
# («amaadhi», «okwidha»), the initial vowel written, Latin digits.
#
# **Noun class, not gender.** Lusoga has no masculine or feminine and agrees a
# describing word with its noun's **class**, so this catalog reads `$gender`
# as a class token — the device `locales/sw` and `locales/lg` both use.
# `noun-gender` answers `c3`, `c7`, `c9`, `c11` or `c12` — five classes.
# Lusoga's own geometry words land where Luganda's do: «olunyiriri», a line,
# is class 11, and «akasaale» (a ray) and «akatonnyeze» (a point) are class
# 12, the diminutive, which is where a small thing goes whether or not it is
# small on purpose. **Class 5 (eli-) is deliberately absent**: no noun this
# catalog names falls in it, so no adjective below writes a `[c5]` branch that
# nothing could select. If a reviewer moves a noun into class 5 — «eiriba»
# for a shape, say — the `[c5]` column has to come back with it.
#
#            c3 (omu-)  c7 (eki-)  c9 (en-)  c11 (olu-)  c12 (aka-)
#   -nene    omunene    ekinene    ennene    olunene     akanene
#   -tono    omutono    ekitono    entono    olutono     akatono
#   -dugavu  omudugavu  ekidugavu  endugavu  oludugavu   akadugavu
#   -eru     omweru     ekyeru     enjeru    olweru      akeeru
#   -myufu   omumyufu   ekimyufu   emmyufu   olumyufu    akamyufu
#   -dhuvu   omudhuvu   ekidhuvu   endhuvu   oludhuvu    akadhuvu
#
# Only the three colours with a native adjective stem inflect. The other nine
# are invariable nouns and are written bare, joined attributively without the
# associative particle: the associative is computable from `$gender`, but the
# same string is what `backgroundColor` reports standing alone, where a bare
# associative would be ungrammatical, and nothing in `$role` tells the two
# positions apart. That is the trade `locales/lg` and `locales/sw` both make.
#
# **Word order.** A describing word **follows** its noun in Lusoga, so every
# composition message puts the noun first. `$role` goes unused: Lusoga marks
# no case.
#
# **What is Lusoga here.** «kiragala» (green), «kyenvu» (yellow), «kakobe»
# (purple), «bbululu» (blue) and «eivu» (ash, for grey) are the colour words
# of the Ganda–Soga area rather than loans made for this file. So are the
# geometry nouns that could be said natively: «olunyiriri» (line), «akasaale»
# (ray), «akatonnyeze» (point), «enkulungo» (circle), «omusalaba» (cross),
# «ekitundu» (segment, region), and the descriptive phrases for a curve, a
# polyline and a polygon. **«-dhuvu»** for *filled* is this catalog's
# application of the Lusoga `dh` to Luganda's «-jjuvu», and a reviewer should
# check that it is the shape Lusoga actually has.
#
# **What is borrowed, and from where.** **English**, openly, because that is
# the register a Lusoga speaker does mathematics in: «vekita», «fonkisoni»,
# «parabola», «esukweya», «edaimondi», «tiyoremu», «etaburo», and the
# remaining colours («oranji», «sayani», «pinki», «buraawuni»). Swahili is not
# the loan language in Busoga. Nothing here is an English word respelled to
# look Lusoga: where there is no word, the key is left out.
#
# **What is left out, and why.**
#
#   * `noun.slope-field` and `noun.vector-field` — Lusoga has no phrase for
#     either and a descriptive one would be this seed's invention.
#   * `element-name` and `element-anion-name` — 130 keys, the whole periodic
#     table. Uganda teaches secondary chemistry in English, so the fallback
#     *is* what these readers meet.
#   * `chemistry-invalid-symbol`, `chemistry-invalid-ionic-compound` and
#     `ion-name-oxidation-state`, for the same reason: the chemistry group
#     falls back entire rather than half of it being answered in Lusoga and
#     half in English.
#
# **Weakest here.** «ekifaanani eky'embali enna» is literally *four-sided
# figure* and so names a quadrilateral rather than a rectangle; Lusoga wants a
# word for the right angle that this seed does not have. The six-class table
# above is Luganda's, transposed to Lusoga spelling, and the `c9` forms
# («enjeru», «emmyufu», «endhuvu») are where a transposition is most likely to
# be wrong.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] omudugavu
            [c7] ekidugavu
            [c11] oludugavu
            [c12] akadugavu
           *[c9] endugavu
        }
    .white =
        { $gender ->
            [c3] omweru
            [c7] ekyeru
            [c11] olweru
            [c12] akeeru
           *[c9] enjeru
        }
    .gray = eivu
    .red =
        { $gender ->
            [c3] omumyufu
            [c7] ekimyufu
            [c11] olumyufu
            [c12] akamyufu
           *[c9] emmyufu
        }
    .orange = oranji
    .yellow = kyenvu
    .green = kiragala
    .cyan = sayani
    .blue = bbululu
    .purple = kakobe
    .pink = pinki
    .brown = buraawuni

line-width =
    .thick =
        { $gender ->
            [c3] omunene
            [c7] ekinene
            [c11] olunene
            [c12] akanene
           *[c9] ennene
        }
    .thin =
        { $gender ->
            [c3] omutono
            [c7] ekitono
            [c11] olutono
            [c12] akatono
           *[c9] entono
        }

# Written as an invariable «n'…» phrase, so that it agrees with nothing and
# can close the description; `style-stroke` puts it last for that reason.
line-style =
    .dashed = n'obutundu
    .dotted = n'obutonnyeze

fill-style =
    .horizontal = ennyiriri ezigalamidde
    .vertical = ennyiriri eziyimiridde
    .diagonal = ennyiriri ezisalako
    .backdiagonal = ennyiriri ezisalako ku ludha olulala
    .dots = obutonnyeze
    .diamonds = amadaimondi

# `slope-field` and `vector-field` are deliberately absent; see the header.
noun =
    .line = olunyiriri
    .line-segment = ekitundu ky'olunyiriri
    .ray = akasaale
    .vector = vekita
    .curve = olunyiriri olukyamye
    .function = fonkisoni
    .parabola = parabola
    .polyline = olunyiriri olw'ebitundu
    .polygon = ekifaanani eky'embali ennyingi
    .triangle = ekifaanani eky'embali essatu
    .rectangle = ekifaanani eky'embali enna
    .circle = enkulungo
    .region = ekitundu
    .point = akatonnyeze
    .square = esukweya
    .diamond = edaimondi
    .cross = omusalaba
    .plus = akabonero k'okugatta

# The side count is a relative clause and closes the noun phrase behind the
# describing words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] ekirina embali { $numSides }
       *[head] ekifaanani eky'embali edhenkanye
    }

# `c9` is the default, and the class a loanword joins — which is what an
# author's own `markerStyleWord` is as far as this catalog is concerned.
noun-gender =
    { $noun ->
        [cross] c3
        [line] c11
        [curve] c11
        [polyline] c11
        [ray] c12
        [point] c12
        [plus] c12
        [line-segment] c7
        [polygon] c7
        [regular-polygon] c7
        [triangle] c7
        [rectangle] c7
        [region] c7
        [text] c7
        [fill] c7
       *[other] c9
    }


## Style composition

# The dash pattern is an «n'…» phrase and closes the description, so it moves
# behind the colour rather than sitting between the width and it.
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

style-filled-word =
    { $gender ->
        [c3] omudhuvu
        [c7] ekidhuvu
        [c11] oludhuvu
        [c12] akadhuvu
       *[c9] endhuvu
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } n'{ $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } n'{ $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } n'{ $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «ensalo» is class 9 and leads its own describing words, so they agree with
# it rather than with the shape it surrounds. Lusoga has no article and joins
# the clause with the invariable «n'», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] n'ensalo { $border }
        [and] n'ensalo { $border }
        [and-article] n'ensalo { $border }
       *[with] n'ensalo { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = tikidhuvu

style-text =
    { $parts ->
        [background] { $color } ku nnyuma { $background }
       *[plain] { $color }
    }

style-background-none = tewali


## Boolean words

boolean-true = kya mazima
boolean-false = tikiri kya mazima


## Answer buttons

answer-submit-label = Kebeera Omulimo
answer-submit-label-no-correctness = Weereza Eky'okwiramu


## Sectional blocks

section-name =
    .activity = Omulimo
    .aside = Ekyongerwako
    .cascade = Olukalala
    .definition = Okunyonyola
    .example = Ekyokulabirako
    .exercise = Okwegezaamu
    .exercises = Okwegezaamu
    .given-answer = Eky'okwiramu
    .note = Ekyokujjukira
    .objectives = Ebigenderwa
    .paragraphs = Ebiwandiiko
    .part = Omugabo
    .problem = Ekizibu
    .problems = Ebizibu
    .proof = Obukakafu
    .question = Ekibuuzo
    .section = Ekitundu
    .solution = Eky'okugonjoola
    .task = Omulimo
    .theorem = Tiyoremu

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Akabonero


## Tables and figures

table-name =
    { $parts ->
        [numbered] Etaburo { $enumeration }
        [numbered-title] Etaburo { $enumeration }{ ": " }
        [unnumbered-title] Etaburo{ ": " }
       *[unnumbered] Etaburo
    }

figure-name =
    { $parts ->
        [numbered] Ekifaanani { $enumeration }
        [numbered-caption] Ekifaanani { $enumeration }{ ": " }
        [unnumbered-caption] Ekifaanani{ ": " }
       *[unnumbered] Ekifaanani
    }


## Paginator controls

paginator-previous = Ekiyise
paginator-next = Ekidha
paginator-page = Olupapula
paginator-page-status = { $pageLabel } { $currentPage } ku { $numPages }


## Piecewise functions

piecewise-condition-or = oba
piecewise-condition-if = singa
piecewise-condition-otherwise = bwe kitaba bwe kityo


## Inputs embedded in math

math-embedded-input-blank = ekyereere
math-embedded-input-blank-ordinal = ekyereere { $ordinal } ku { $total }
