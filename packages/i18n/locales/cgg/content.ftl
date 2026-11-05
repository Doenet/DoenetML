# Chiga (Rukiga) content catalog: the prose the core computes into the
# document — style descriptions ("thick red line"), boolean words, section
# names. Selected by `documentLocale`, the language the activity was written
# in, rather than by the reader's UI language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** As `chrome.ftl` sets it out: the shared
# Runyankore-Rukiga standard, `c` and not `ch` for /tʃ/ («ekicweka», not
# «ekichweka»), the augment written, Latin digits.
#
# **Noun class, not gender.** Rukiga has no masculine or feminine and agrees a
# describing word with its noun's **class**, so this catalog reads `$gender`
# as a class token — the device `locales/sw`, `locales/lg` and `locales/nyn`
# all use. `noun-gender` answers `c3`, `c5`, `c7`, `c9` or `c12`, and there are
# two concord sets, with which set a word takes being a fact about the word:
#
#   adjective concord (-hango, -kye)   c3 mu-   c5 ri-   c7 ki-   c9 e-   c12 ka-
#   associative particle (the colours) c3 w'    c5 ry'   c7 ky'   c9 y'   c12 k'
#
# The colours are nouns, not adjectives, so they take the associative particle
# rather than the concord: «w'omukara» carries its class the way «muhango»
# does. That costs what it costs in every catalog on this shelf —
# `backgroundColor` reports «y'omukara» standing alone, where the particle
# wants a head in front of it, and `$role` cannot tell that citation position
# from the attributive one. The two are written alike; see `locales/nyn`'s
# header for the same trade made next door.
#
# **Word order.** A describing word **follows** its noun in Rukiga, so every
# composition message puts the noun first and the description after it —
# «omurongo muhango w'omutukura», not the English order. `$role` goes unused:
# Rukiga marks no case.
#
# **What is Rukiga here.** «omukara», «obwera», «eivu», «omutukura» and
# «ekiragara» are Rukiga colour words. So are the geometry nouns that could be
# said natively: «omurongo» (line), «omurasho» (ray, on «okurasha», to shoot),
# «akadomo» (point), «eriziga» (circle), «omusaraba» (cross), «ekicweka»
# (segment, region), and the descriptive phrases for a curve, a polyline and a
# polygon.
#
# **What is borrowed, and from where.** **English**, openly, because that is
# the register a Rukiga speaker actually does mathematics in: «vekita»,
# «fonkishoni», «parabora», «esikweya», «edaimonde», «tiyoremu», and seven of
# the twelve colours («orenji», «yero», «sayani», «buruu», «paapuro»,
# «pinki», «buraawuni»). Swahili is **not** the loan language in Uganda and is
# reached for only for words that travelled into the region long before the
# classroom did — «etaburo», «akasanduuko». Nothing here is an English word
# respelled to look Rukiga: where there is no word, the key is left out.
#
# **What is left out, and why.**
#
#   * `noun.slope-field` and `noun.vector-field` — Rukiga has no phrase for
#     either and a descriptive one would be this seed's invention, so both
#     fall back to English.
#   * `noun.rectangle` — «ekishushani ky'empande ina» is literally *four-sided
#     figure*, which names a quadrilateral and not a rectangle: Rukiga wants
#     the word for the right angle that this seed does not have. Calling every
#     four-sided figure a rectangle is worse than the English fallback, so the
#     key is left out and `noun-gender` carries no branch for it.
#   * `element-name` and `element-anion-name` — 130 keys, the whole periodic
#     table. Uganda teaches secondary chemistry in English, so the fallback
#     *is* what these readers meet.
#   * `chemistry-invalid-symbol`, `chemistry-invalid-ionic-compound` and
#     `ion-name-oxidation-state`, for the same reason: the chemistry group
#     falls back entire rather than half of it being answered in Rukiga and
#     half in English.
#
# **Weakest here.** «Tiyoremu» and «parabora» are the two loans most likely to
# be wrong about what a Kigezi classroom actually says.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] w'omukara
            [c5] ry'omukara
            [c7] ky'omukara
            [c12] k'omukara
           *[c9] y'omukara
        }
    .white =
        { $gender ->
            [c3] w'obwera
            [c5] ry'obwera
            [c7] ky'obwera
            [c12] k'obwera
           *[c9] y'obwera
        }
    .gray =
        { $gender ->
            [c3] w'eivu
            [c5] ry'eivu
            [c7] ky'eivu
            [c12] k'eivu
           *[c9] y'eivu
        }
    .red =
        { $gender ->
            [c3] w'omutukura
            [c5] ry'omutukura
            [c7] ky'omutukura
            [c12] k'omutukura
           *[c9] y'omutukura
        }
    .orange =
        { $gender ->
            [c3] wa orenji
            [c5] rya orenji
            [c7] kya orenji
            [c12] ka orenji
           *[c9] ya orenji
        }
    .yellow =
        { $gender ->
            [c3] wa yero
            [c5] rya yero
            [c7] kya yero
            [c12] ka yero
           *[c9] ya yero
        }
    .green =
        { $gender ->
            [c3] w'ekiragara
            [c5] ry'ekiragara
            [c7] ky'ekiragara
            [c12] k'ekiragara
           *[c9] y'ekiragara
        }
    .cyan =
        { $gender ->
            [c3] wa sayani
            [c5] rya sayani
            [c7] kya sayani
            [c12] ka sayani
           *[c9] ya sayani
        }
    .blue =
        { $gender ->
            [c3] wa buruu
            [c5] rya buruu
            [c7] kya buruu
            [c12] ka buruu
           *[c9] ya buruu
        }
    .purple =
        { $gender ->
            [c3] wa paapuro
            [c5] rya paapuro
            [c7] kya paapuro
            [c12] ka paapuro
           *[c9] ya paapuro
        }
    .pink =
        { $gender ->
            [c3] wa pinki
            [c5] rya pinki
            [c7] kya pinki
            [c12] ka pinki
           *[c9] ya pinki
        }
    .brown =
        { $gender ->
            [c3] wa buraawuni
            [c5] rya buraawuni
            [c7] kya buraawuni
            [c12] ka buraawuni
           *[c9] ya buraawuni
        }

# The adjective concord, which is not the particle the colours take.
line-width =
    .thick =
        { $gender ->
            [c3] muhango
            [c5] rihango
            [c7] kihango
            [c12] kahango
           *[c9] ehango
        }
    .thin =
        { $gender ->
            [c3] mukye
            [c5] rikye
            [c7] kikye
            [c12] kakye
           *[c9] ekye
        }

# Written as an invariable «na …» phrase, so that it agrees with nothing and
# can close the description; `style-stroke` puts it last for that reason.
line-style =
    .dashed = na tucweka
    .dotted = na tudomo

fill-style =
    .horizontal = emirongo egaramire
    .vertical = emirongo eyemereire
    .diagonal = emirongo eyegamiire
    .backdiagonal = emirongo eyegamiire oruhande orundi
    .dots = obudomo
    .diamonds = amadaimonde

# `slope-field` and `vector-field` are deliberately absent; see the header.
noun =
    .line = omurongo
    .line-segment = ekicweka ky'omurongo
    .ray = omurasho
    .vector = vekita
    .curve = omurongo ogugombire
    .function = fonkishoni
    .parabola = parabora
    .polyline = omurongo gw'ebicweka
    .polygon = ekishushani ky'empande nyingi
    .triangle = ekishushani ky'empande ishatu
    .circle = eriziga
    .region = ekicweka
    .point = akadomo
    .square = esikweya
    .diamond = edaimonde
    .cross = omusaraba
    .plus = ekimanyiso ky'okwongyera

# The side count is a relative clause and closes the noun phrase behind the
# describing words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] ekiine empande { $numSides }
       *[head] ekishushani ekingana empande
    }

# `c9` is the default, and the class a loanword joins — which is what an
# author's own `markerStyleWord` is as far as this catalog is concerned.
noun-gender =
    { $noun ->
        [line] c3
        [ray] c3
        [curve] c3
        [polyline] c3
        [cross] c3
        [border] c3
        [circle] c5
        [line-segment] c7
        [polygon] c7
        [regular-polygon] c7
        [triangle] c7
        [region] c7
        [plus] c7
        [text] c7
        [fill] c7
        [point] c12
       *[other] c9
    }


## Style composition

# The dash pattern is a «na …» phrase and closes the description, so it moves
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
        [c3] ogwijwire
        [c5] eryijwire
        [c7] ekyijwire
        [c12] akijwire
       *[c9] eyijwire
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } na { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } na { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } na { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «omupaka» is class 3 and leads its own describing words, so they agree with
# it rather than with the shape it surrounds. Rukiga has no article and joins
# the clause with the invariable «na», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] n'omupaka { $border }
        [and] n'omupaka { $border }
        [and-article] n'omupaka { $border }
       *[with] n'omupaka { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = tikyijwire

style-text =
    { $parts ->
        [background] { $color } aha nyima { $background }
       *[plain] { $color }
    }

style-background-none = tihariho


## Boolean words

boolean-true = ni buzima
boolean-false = ti buzima


## Answer buttons

answer-submit-label = Cendereza Omurimo
answer-submit-label-no-correctness = Ohereza Eky'okugarukamu


## Sectional blocks

section-name =
    .activity = Omurimo
    .aside = Ekyongyeirweho
    .cascade = Orukurikirana
    .definition = Okushoboorora
    .example = Eky'okureeberaho
    .exercise = Okwegyeza
    .exercises = Okwegyeza
    .given-answer = Eky'okugarukamu
    .note = Ekyokwetegyereza
    .objectives = Ebigyendererwa
    .paragraphs = Ebihandiiko
    .part = Omugabo
    .problem = Ekibazo
    .problems = Ebibazo
    .proof = Obujurizi
    .question = Ekibuuzo
    .section = Ekicweka
    .solution = Eky'okukiza
    .task = Omurimo
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

hint-title = Akamanyiso


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
        [numbered] Ekishushani { $enumeration }
        [numbered-caption] Ekishushani { $enumeration }{ ": " }
        [unnumbered-caption] Ekishushani{ ": " }
       *[unnumbered] Ekishushani
    }


## Paginator controls

paginator-previous = Ekihweireho
paginator-next = Ekirikukuratsya
paginator-page = Orupapura
paginator-page-status = { $pageLabel } { $currentPage } aha { $numPages }


## Piecewise functions

piecewise-condition-or = nari
piecewise-condition-if = obu
piecewise-condition-otherwise = ahandi hoona


## Inputs embedded in math

math-embedded-input-blank = obusa
math-embedded-input-blank-ordinal = obusa { $ordinal } aha { $total }
