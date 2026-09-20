# Kikuyu content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `ki` is Gĩkũyũ, the language `Intl.DisplayNames` calls "Kikuyu" in English
# and "Gikuyu" as the endonym, so `<document lang>`'s autocomplete reads
# "Kikuyu (Gikuyu)". The two are one language.
#
# **The vowels are the thing to get right before the words.** Gĩkũyũ writes
# seven vowels with five letters plus ĩ and ũ — «mũhari» a line, «gĩthiũrũrĩ» a
# circle — and those are i and u with a **combining tilde**, U+0129 and U+0169,
# not plain letters and not the Portuguese ĩ of a nasal vowel. A file that
# drops them is a file in a different language.
#
# `$gender` is the noun **class**, as in every Bantu catalog here, and
# `noun-gender` answers `c3`, `c7` or `c9`:
#
#            c3 (mũ-)   c7 (gĩ-/kĩ-)   c9 (N-)
#   -irũ      mũirũ      kĩirũ          njirũ
#   -erũ      mwerũ      kĩerũ          njerũ
#   -tune     mũtune     gĩtune         ndune
#   -nene     mũnene     kĩnene         nene
#   -nini     mũnini     kĩnini         nini
#
# Only the three colours with a native stem take the concord; the rest are
# nouns, written bare for `locales/sw`'s reason.
#
# Classes 5 and 6 are absent because no noun the core names reaches either —
# class 6 is the plural of class 5 and every noun here is singular; see
# `locales/zu`'s header for the reachability rule. Adding a `c5` branch — the
# i- prefix — means adding the noun that reaches it first.
#
# `c9` is the default and the class a loanword joins, which is what an author's
# own `markerStyleWord` is as far as this catalog is concerned.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: Gĩkũyũ marks no case.
#
# The mathematical nouns are the first thing to check. «mũhari»,
# «gĩthiũrũrĩ», «gĩthatũ» and «mũtharaba» are Gĩkũyũ words; the rest are
# adapted loans this seed had nothing else to reach for, which is the usual
# shape for a language whose secondary mathematics is taught in English.


## Style vocabulary

# Only the three with a native stem inflect.
color =
    .black =
        { $gender ->
            [c3] mũirũ
            [c7] kĩirũ
           *[c9] njirũ
        }
    .white =
        { $gender ->
            [c3] mwerũ
            [c7] kĩerũ
           *[c9] njerũ
        }
    .gray = ngoikoni
    .red =
        { $gender ->
            [c3] mũtune
            [c7] gĩtune
           *[c9] ndune
        }
    .orange = ndanguru
    .yellow = ngoikoni ya ngoro
    .green = nyeki
    .cyan = saini
    .blue = burũ
    .purple = ndathi
    .pink = pingi
    .brown = ngoikoni ya thĩ
line-width =
    .thick =
        { $gender ->
            [c3] mũnene
            [c7] kĩnene
           *[c9] nene
        }
    .thin =
        { $gender ->
            [c3] mũnini
            [c7] kĩnini
           *[c9] nini
        }
# Written as an invariable «na …» phrase, so that it agrees with nothing and
# can close the phrase. `style-stroke` puts it last for that reason.
line-style =
    .dashed = na icunjĩ
    .dotted = na tũdoti
fill-style =
    .horizontal = mĩhari ĩkomete
    .vertical = mĩhari ĩrũngiĩ
    .diagonal = mĩhari ĩinamĩte
    .backdiagonal = mĩhari ĩinamĩte na mwena ũngĩ
    .dots = tũdoti
    .diamonds = daimondi
noun =
    .line = mũhari
    .line-segment = gĩcunjĩ kĩa mũhari
    .ray = reyi
    .vector = vekita
    .curve = mũhari mũgothe
    .function = wĩra
    .parabola = parabola
    .polyline = mũhari wa icunjĩ
    .polygon = mũhianĩre wa mĩena mĩingĩ
    .triangle = gĩthatũ
    .rectangle = kĩenanne
    .circle = gĩthiũrũrĩ
    .region = gĩcigo
    .point = ndoti
    .square = kĩiganu
    .diamond = daimondi
    .cross = mũtharaba
    .plus = kĩmenyithia kĩa kuongerera
# The side count is a relative complement and closes the noun phrase behind the
# describing words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] ũrĩ na mĩena { $numSides }
       *[head] mũhianĩre mũiganu
    }
# The noun class. `c9` is the default and the class of every loanword.
noun-gender =
    { $noun ->
        [line] c3
        [curve] c3
        [polyline] c3
        [polygon] c3
        [regular-polygon] c3
        [cross] c3
        [border] c3
        [line-segment] c7
        [triangle] c7
        [rectangle] c7
        [circle] c7
        [region] c7
        [square] c7
        [plus] c7
        [text] c7
        [fill] c7
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
        [c3] mũiyũre
        [c7] kĩiyũre
       *[c9] njiyũre
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
# «mũhaka» is class 3 and leads its own describing words, so the border's words
# agree with it rather than with the shape it surrounds. Gĩkũyũ has no article
# and joins this clause with the invariable «na», so all four branches read
# alike.
style-border-clause =
    { $parts ->
        [with-article] na mũhaka { $border }
        [and] na mũhaka { $border }
        [and-article] na mũhaka { $border }
       *[with] na mũhaka { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = ndĩiyũre
style-text =
    { $parts ->
        [background] { $color } igũrũ rĩa kĩhumo { $background }
       *[plain] { $color }
    }
style-background-none = gũtirĩ kĩndũ

## Boolean words

boolean-true = ma
boolean-false = maheeni

## Answer buttons

answer-submit-label = Rora Wĩra
answer-submit-label-no-correctness = Tũma Macookio

## Sectional blocks

section-name =
    .activity = Wĩra
    .aside = Kĩongererwa
    .cascade = Mũtaratara
    .definition = Gũtaarĩria
    .example = Kĩonereria
    .exercise = Kwĩmenyeria
    .exercises = Kwĩmenyeria
    .given-answer = Macookio
    .note = Kĩandĩko
    .objectives = Muoroto
    .paragraphs = Ciandĩko
    .part = Gĩcunjĩ
    .problem = Thĩna
    .problems = Mathĩna
    .proof = Ũira
    .question = Kĩũria
    .section = Gĩcunjĩ
    .solution = Ũtaũri
    .task = Wĩra
    .theorem = Thioremu
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Kĩrĩkanĩro

## Tables and figures

table-name =
    { $parts ->
        [numbered] Metha { $enumeration }
        [numbered-title] Metha { $enumeration }{ ": " }
        [unnumbered-title] Metha{ ": " }
       *[unnumbered] Metha
    }
figure-name =
    { $parts ->
        [numbered] Mũhianano { $enumeration }
        [numbered-caption] Mũhianano { $enumeration }{ ": " }
        [unnumbered-caption] Mũhianano{ ": " }
       *[unnumbered] Mũhianano
    }

## Paginator controls

paginator-previous = Ĩrĩa ĩhĩtũkĩte
paginator-next = Ĩrĩa ĩrũmĩrĩire
paginator-page = Karatathi
paginator-page-status = { $pageLabel } { $currentPage } harĩ { $numPages }

## Piecewise functions

piecewise-condition-or = kana
piecewise-condition-if = angĩkorwo
piecewise-condition-otherwise = angĩkorwo tiguo

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Kenya teaches secondary science in English, so a
## Gĩkũyũ speaker meets the periodic table there and the fallback *is* the
## curriculum — which is the same sentence `locales/sw` does **not** get to
## say, because Swahili is taught as a subject with a settled scientific
## vocabulary of its own and supplies the whole table. Two languages, one
## education system, two different answers.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kĩmenyithia kĩa Kemikaru Gĩtarĩ kĩega
chemistry-invalid-ionic-compound = Mũtukanio wa Ayoni Ũtarĩ mwega
