# Lingala content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lingala has no masculine or feminine, and it agrees an adjective with its
# noun's **class**, so this catalog reads `$gender` as the class token rather
# than as a gender — the same device `locales/sw` uses, and for the same
# reason: a token set is a token set. `noun-gender` answers `c3`, `c5`, `c7` or
# `c9`, and the adjectives that carry a concord select on it.
#
# The concords this catalog writes out:
#
#          c3 (mo-/mi-)  c5 (li-/ma-)  c7 (e-/bi-)  c9 (N-)
#   -nene   monene        linene        enene        enene
#   -kɛ     mokɛ          likɛ          ekɛ          ekɛ
#   -tondi  motondi       litondi       etondi       etondi
#
# Two adjective stems and one participle is all it reaches, and that is the
# difference from Swahili worth recording: Lingala's inventory of true
# adjectives — the stems that take a concord at all — is small, and every
# colour in this catalog is outside it.
# The colours are French loans, which is what Kinshasa and Brazzaville say, and
# a loan is invariable. So `color` selects on nothing, and the three native
# colour words that do exist — «moindo», «mpɛmbɛ», «motane» — are written in
# the c3 shape they are usually cited in rather than inflected, because the
# same string is what `backgroundColor` reports standing alone.
#
# Adjectives follow the noun, so the composition messages put the noun first.
# `$role` goes unused: Lingala marks no case, and the three clause positions
# each arrive with the class of their own noun already set.
#
# `c9` is the default, because that is the class a loanword joins — and an
# author's own `markerStyleWord`, which this catalog has never seen, is a
# loanword as far as it is concerned.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

# Invariable: the three native words are cited in their c3 shape, and the rest
# are French loans, which do not change shape for anything.
color =
    .black = moindo
    .white = mpɛmbɛ
    .gray = gri
    .red = motane
    .orange = oranje
    .yellow = jonɛ
    .green = vɛrɛ
    .cyan = siyan
    .blue = blɛ
    .purple = violɛ
    .pink = rozɛ
    .brown = marɔ

line-width =
    .thick =
        { $gender ->
            [c3] monene
            [c5] linene
            [c7] enene
           *[c9] enene
        }
    .thin =
        { $gender ->
            [c3] mokɛ
            [c5] likɛ
            [c7] ekɛ
           *[c9] ekɛ
        }

# Written as invariable «na …» phrases rather than as adjectives, so that they
# agree with nothing and can close the description. `style-stroke` puts them
# last for that reason.
line-style =
    .dashed = na bantɔkɔ
    .dotted = na bapwɛ

fill-style =
    .horizontal = milɔngɔ ya kolala
    .vertical = milɔngɔ ya kotɛlɛma
    .diagonal = milɔngɔ ya ngwɛ
    .backdiagonal = milɔngɔ ya ngwɛ ya nsima
    .dots = bapwɛ
    .diamonds = balozanje

noun =
    .line = molɔngɔ
    .line-segment = eteni ya molɔngɔ
    .ray = mwinda
    .vector = vɛktɛrɛ
    .curve = kurbɛ
    .function = fɔnksiɔ
    .parabola = parabolɛ
    .polyline = milɔngɔ ebele
    .polygon = poligonɛ
    .triangle = triangle
    .rectangle = rɛktangle
    .circle = sɛrkɛlɛ
    .region = etuka
    .point = litono
    .square = karé
    .diamond = lozanje
    .cross = ekulusu
    .plus = elembo ya kobakisa

# The side count goes in the tail, behind the adjectives, because «oyo ezali na
# mipanzi 5» is a relative clause and Lingala closes a noun phrase with one
# rather than opening one.
noun-regular-polygon =
    { $part ->
        [tail] oyo ezali na mipanzi { $numSides }
       *[head] poligonɛ ya bokokani
    }

# The noun class, which is what an adjective agrees with. `c9` is the default
# and the class of every loanword, including a word an author supplies.
noun-gender =
    { $noun ->
        [line] c3
        [ray] c3
        [polyline] c3
        [border] c3
        [point] c5
        [region] c7
        [line-segment] c7
        [fill] c7
        [text] c5
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
        [c3] motondi
        [c5] litondi
        [c7] etondi
       *[c9] etondi
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

# «ndelo» leads its own adjectives, so the border's words agree with it and not
# with the shape it surrounds. Lingala has no article and joins a complement
# with the invariable «na», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] na ndelo { $border }
        [and] na ndelo { $border }
        [and-article] na ndelo { $border }
       *[with] na ndelo { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = etondi te

style-text =
    { $parts ->
        [background] { $color } likolo ya nsima { $background }
       *[plain] { $color }
    }

style-background-none = eloko te


## Boolean words

boolean-true = solo
boolean-false = lokuta


## Answer buttons

answer-submit-label = Talá Mosala
answer-submit-label-no-correctness = Tinda Eyano


## Sectional blocks

section-name =
    .activity = Mosala
    .aside = Liloba ya pembeni
    .cascade = Kaskadɛ
    .definition = Ndimbola
    .example = Ndakisa
    .exercise = Momekano
    .exercises = Mimekano
    .given-answer = Eyano
    .note = Likanisi
    .objectives = Mikano
    .paragraphs = Biteni
    .part = Eteni
    .problem = Mokakatano
    .problems = Mikakatano
    .proof = Elembeteli
    .question = Motuna
    .section = Eteni
    .solution = Bosili
    .task = Mosala
    .theorem = Teorɛmɛ

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Toli


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabelo { $enumeration }
        [numbered-title] Tabelo { $enumeration }{ ": " }
        [unnumbered-title] Tabelo{ ": " }
       *[unnumbered] Tabelo
    }

figure-name =
    { $parts ->
        [numbered] Elilingi { $enumeration }
        [numbered-caption] Elilingi { $enumeration }{ ": " }
        [unnumbered-caption] Elilingi{ ": " }
       *[unnumbered] Elilingi
    }


## Paginator controls

paginator-previous = Eleki
paginator-next = Elandi
paginator-page = Lokasa

paginator-page-status = { $pageLabel } { $currentPage } na kati ya { $numPages }


## Piecewise functions

piecewise-condition-or = to
piecewise-condition-if = soki
piecewise-condition-otherwise = soki te


## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Secondary science in both
# Congos is taught in French, so a student meeting these words meets them in a
# European language already, and the seed has no settled Lingala list to
# reproduce. A speaker adding one should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Elembo ya Shimi Ebongi Te
chemistry-invalid-ionic-compound = Bosangani ya Ioni Ebongi Te
