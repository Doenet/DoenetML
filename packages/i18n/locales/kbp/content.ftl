# Kabiyè content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `kbp` is Kabiyè, a Gur language of northern Togo and the country's second
# national language beside Ewe. It is the third Gur catalog here, after
# `locales/mos` (Mooré) and `locales/dag` (Dagbani), both seeded in #1685.
#
# **`$gender` is a noun class spelled as a suffix, which is what the Gur
# catalogs already established — but the count is different and that is the
# point.** Mooré answers with four classes and Dagbani with three; Kabiyè
# answers with five, and it puts the describing word's class suffix in the same
# slot the noun's own suffix occupies:
#
#            c1 (-ʋ)     c2 (-tʋ)    c3 (-ɖɛ)    c4 (-a)     c5 (-m)
#   kɩkpɛd-   kɩkpɛdʋ     kɩkpɛdɩtʋ   kɩkpɛdɩɖɛ   kɩkpɛda     kɩkpɛdɩm
#   kɩhʋlʋm-  kɩhʋlʋmʋ    kɩhʋlʋmɩtʋ  kɩhʋlʋmɩɖɛ  kɩhʋlʋma    kɩhʋlʋmɩm
#
# So the whole of the agreement is one final morph, as it is in `locales/mos`
# and `locales/dag`. Held against `locales/kg`, seeded in the same batch, the
# two are the same fact from opposite ends: Kongo factors its agreement into a
# linker syllable *in front of* an invariant stem, Kabiyè into a suffix *behind*
# one, and `locales/tiv` writes it as a separate word between the two. Three
# positions, one argument, no change to anything outside these files.
#
# **The affix rule bites here and the way out is the third one the README
# lists.** A class suffix cannot be welded to a placeable, so a message whose
# describing word would have to inflect an argument is not written that way.
# Every `$gender` fork in this file is over whole words the catalog owns, and
# the fill patterns and the mathematical nouns — which the catalog does not
# inflect — are kept out of any position that would demand one.
#
# `$role` goes unused: Kabiyè marks no case.
#
# ICU has no name for `kbp`, so the roster would label it "kbp" without an
# entry in `LOCALE_NAME_FALLBACKS`; see `scripts/catalogUtils.ts`. It is the
# fifth locale in the repository to need one.
#
# The geometry leans on the French loans Togolese schooling supplies; where
# Kabiyè has its own word it is used — «ɖenɖe» a place, «yʋsaɣ» a mark. They
# are the first thing to check.


## Style vocabulary

# The last eight attributes are French loans. A loan joins class 1 and does not
# take the suffix, so it is written bare — which is what makes the seam between
# the four Kabiyè stems and the rest of this message visible at a glance, the
# way `locales/fon` makes its own seam visible.
#
# A comment cannot go inside the message beside the attribute it describes:
# an indented comment line is part of the pattern and renders as a newline,
# which `lint:i18n` rejects.
color =
    .black =
        { $gender ->
            [c2] kɩkpɛdɩtʋ
            [c3] kɩkpɛdɩɖɛ
            [c4] kɩkpɛda
            [c5] kɩkpɛdɩm
           *[c1] kɩkpɛdʋ
        }
    .white =
        { $gender ->
            [c2] kɩhʋlʋmɩtʋ
            [c3] kɩhʋlʋmɩɖɛ
            [c4] kɩhʋlʋma
            [c5] kɩhʋlʋmɩm
           *[c1] kɩhʋlʋmʋ
        }
    .gray =
        { $gender ->
            [c2] kɩñɔʋtʋ
            [c3] kɩñɔʋɖɛ
            [c4] kɩñɔʋa
            [c5] kɩñɔʋm
           *[c1] kɩñɔʋʋ
        }
    .red =
        { $gender ->
            [c2] kɩsɛmɩtʋ
            [c3] kɩsɛmɩɖɛ
            [c4] kɩsɛma
            [c5] kɩsɛmɩm
           *[c1] kɩsɛmʋ
        }
    .orange = orangɩ
    .yellow = jonɩ
    .green = vɛrɩ
    .cyan = siyaŋ
    .blue = blɛɛ
    .purple = violɛɛ
    .pink = rozɩ
    .brown = maroŋ

line-width =
    .thick =
        { $gender ->
            [c2] sɔsɔtʋ
            [c3] sɔsɔɖɛ
            [c4] sɔsɔa
            [c5] sɔsɔm
           *[c1] sɔsɔʋ
        }
    .thin =
        { $gender ->
            [c2] pɩŋɩtʋ
            [c3] pɩŋɩɖɛ
            [c4] pɩŋa
            [c5] pɩŋɩm
           *[c1] pɩŋʋ
        }

# Written as «nɛ …» phrases rather than as class-marked qualifiers, so that
# they take no suffix and can close the description. `style-stroke` puts them
# last.
line-style =
    .dashed = nɛ hɔɔlɩŋ cikpeŋ
    .dotted = nɛ yʋsasɩ

fill-style =
    .horizontal = ñɔsɩ nzɩ sɩhɩnɩ yɔ
    .vertical = ñɔsɩ nzɩ sɩsɩŋ yɔ
    .diagonal = ñɔsɩ nzɩ sɩlɩɣ hɔɔlʋʋ yɔ
    .backdiagonal = ñɔsɩ nzɩ sɩlɩɣ hɔɔlʋʋ lɛɛkʋ yɔ
    .dots = yʋsasɩ
    .diamonds = diyamaanɩwaa

noun =
    .line = ñɔʋ
    .line-segment = ñɔʋ hɔɔlʋʋ
    .ray = mintʋsʋʋ
    .vector = vɛktɛɛrɩ
    .curve = ñɔʋ ŋgʋ kɩpɩsɩɣ yɔ
    .function = fɔŋksɩyɔŋ
    .parabola = parabolɩ
    .polyline = ñɔʋ hɔɔlɩŋ sakɩyɛ
    .polygon = poligɔnɩ
    .triangle = tirisaŋgɩlɩ
    .rectangle = rɛktaŋgɩlɩ
    .circle = kpelaɣ
    .region = ɖenɖe
    .point = yʋsaɣ
    .square = kaaree
    .diamond = diyamaanɩ
    .cross = sɩŋgɩyɛ
    .plus = plisɩ yʋsaɣ

# The side count is a relative clause and closes the noun phrase behind the
# describing words, so it goes in the tail — which is also what keeps a class
# suffix from ever needing to land on `{ $numSides }`.
noun-regular-polygon =
    { $part ->
        [tail] ŋgʋ kɩwɛnɩ hɔɔlɩŋ { $numSides } yɔ
       *[head] poligɔnɩ kɩmaɣzaɣ
    }

# The noun class. `c1` is the default and the class a French loan joins, which
# is what an author's own `markerStyleWord` is as far as this catalog is
# concerned.
noun-gender =
    { $noun ->
        [line-segment] c2
        [region] c2
        [text] c2
        [polygon] c3
        [regular-polygon] c3
        [triangle] c3
        [rectangle] c3
        [square] c3
        [circle] c3
        [point] c4
        [cross] c4
        [plus] c4
        [fill] c5
        [background] c5
       *[other] c1
    }


## Style composition

# The dash pattern is a «nɛ …» phrase and closes the description, so it moves
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
        [c2] sʋʋtʋ
        [c3] sʋʋɖɛ
        [c4] sʋʋa
        [c5] sʋʋm
       *[c1] sʋʋʋ
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } nɛ { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } nɛ { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } nɛ { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «kamaɣ» is the border and leads its own describing words, so they agree with
# it rather than with the shape it surrounds — which is why `border` answers
# `c1` in `noun-gender`. Kabiyè has no article and joins this clause with the
# invariable «nɛ», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] nɛ kamaɣ { $border }
        [and] nɛ kamaɣ { $border }
        [and-article] nɛ kamaɣ { $border }
       *[with] nɛ kamaɣ { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ɛtɩsʋʋ

style-text =
    { $parts ->
        [background] { $color } nɛ wayɩ { $background }
       *[plain] { $color }
    }

style-background-none = pʋyʋ nabʋyʋ fɛyɩ


## Boolean words

boolean-true = toovenim
boolean-false = cɛtɩm


## Answer buttons

answer-submit-label = Maɣzɩ Tʋmɩyɛ
answer-submit-label-no-correctness = Tiyi Cosuu


## Sectional blocks

section-name =
    .activity = Tʋmɩyɛ
    .aside = Tɔm lɛɛtʋ
    .cascade = Kaskaadɩ
    .definition = Tɔbʋʋ
    .example = Kɩɖaʋ
    .exercise = Nʋmɔʋ
    .exercises = Nʋmɔŋ
    .given-answer = Cosuu
    .note = Takayaɣ
    .objectives = Kaɖʋsɩ
    .paragraphs = Hɔɔlɩŋ
    .part = Hɔɔlʋʋ
    .problem = Kʋñɔŋ
    .problems = Kʋñɔmɩŋ
    .proof = Aseɣɖe
    .question = Tɔm pɔzʋʋ
    .section = Hɔɔlʋʋ
    .solution = Nʋmɔʋ kɩbaŋʋ
    .task = Tʋmɩyɛ
    .theorem = Teyorɛm

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Sɩnʋʋ


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
        [numbered] Kɩlɛmʋʋ { $enumeration }
        [numbered-caption] Kɩlɛmʋʋ { $enumeration }{ ": " }
        [unnumbered-caption] Kɩlɛmʋʋ{ ": " }
       *[unnumbered] Kɩlɛmʋʋ
    }


## Paginator controls

paginator-previous = Ŋgʋ kɩɖɛwa yɔ
paginator-next = Ŋgʋ kɩkɔŋ yɔ

paginator-page = Hɔɔlʋʋ

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = yaa

piecewise-condition-if = ye

piecewise-condition-otherwise = alɩwaatʋ lɛɛtʋ tɩŋa taa


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Togo teaches secondary science in French, so a
## Kabiyè speaker meets the periodic table there and neither Kabiyè nor English
## is the curriculum. `locales/ee` and `locales/fon` leave the same gap for the
## same reason.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Siimii Yʋsaɣ Kɩdɛkɛdɩɣ
chemistry-invalid-ionic-compound = Iyɔŋ Kpɛndʋʋ Kɩdɛkɛdɩɣ
