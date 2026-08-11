# Temne content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `tem` is Temne (Themne), an Atlantic language of northern Sierra Leone and
# the country's largest first language. CLDR spells it "Timne", which is why
# the roster says that and this header does not.
#
# **`$gender` is a noun class again, and the concord is *alliterative*.** The
# describing word takes the same prefix the noun itself carries, syllable for
# syllable:
#
#            c1 (kʌ-)      c2 (tʌ-)      c3 (rʌ-)      c4 (ʌŋ-)
#   noun      kʌ-bath       tʌ-bath       rʌ-th        ʌŋ-fəm
#   -fith     kʌfith        tʌfith        rʌfith        ʌŋfith
#   -fera     kʌfera        tʌfera        rʌfera        ʌŋfera
#
# **That is the property worth having a catalog for.** In `locales/kg` the
# class is a separate linker word, in `locales/kbp` a suffix, in `locales/tiv`
# a particle: in each of those the concord and the noun's own prefix are
# different morphs, so a reviewer has to take `noun-gender`'s table on trust.
# Here the two are the same syllable, so `noun-gender` can be *checked against
# `noun`* by eye — every entry below assigns a noun to the class its own
# written prefix names, and a reviewer who finds one that does not has found a
# bug without needing to know Temne.
#
# It is the third Atlantic catalog here and answers differently from both the
# others: `locales/ff` spells its class as a suffix and `locales/wo` on a
# determiner beside the noun, and neither is alliterative with the noun's own
# shape the way this is.
#
# `$role` goes unused: Temne marks no case.
#
# The geometry leans on the English loans Sierra Leonean schooling supplies —
# the same ministry `locales/kri` records — with Temne words where they are
# solid: «ro-» a place, «ʌŋ-mark» a mark. They are the first thing to check.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c2] tʌfith
            [c3] rʌfith
            [c4] ʌŋfith
           *[c1] kʌfith
        }
    .white =
        { $gender ->
            [c2] tʌfera
            [c3] rʌfera
            [c4] ʌŋfera
           *[c1] kʌfera
        }
    .gray =
        { $gender ->
            [c2] tʌthupu
            [c3] rʌthupu
            [c4] ʌŋthupu
           *[c1] kʌthupu
        }
    .red =
        { $gender ->
            [c2] tʌbana
            [c3] rʌbana
            [c4] ʌŋbana
           *[c1] kʌbana
        }
    .orange = ɔrenji
    .yellow = yɛlo
    .green = grin
    .cyan = sayan
    .blue = blu
    .purple = pəpul
    .pink = pink
    .brown = braun

line-width =
    .thick =
        { $gender ->
            [c2] tʌbana-bana
            [c3] rʌbana-bana
            [c4] ʌŋbana-bana
           *[c1] kʌbana-bana
        }
    .thin =
        { $gender ->
            [c2] tʌkəni
            [c3] rʌkəni
            [c4] ʌŋkəni
           *[c1] kʌkəni
        }

# Written as «na …» phrases rather than as prefixed qualifiers, so that they
# take no concord and can close the description. `style-stroke` puts them last.
line-style =
    .dashed = na ʌŋpath-pathi
    .dotted = na ʌŋtoni

fill-style =
    .horizontal = ʌŋlayn ŋa ŋi lay
    .vertical = ʌŋlayn ŋa ŋi yema
    .diagonal = ʌŋlayn ŋa ŋi kəri
    .backdiagonal = ʌŋlayn ŋa ŋi kəri ka pʌŋ ʌŋbʌŋ
    .dots = ʌŋtoni
    .diamonds = ʌŋdayamɔn

# Every noun below carries its class prefix in writing, so `noun-gender`'s
# table can be read straight off this message. That is the alliterative-concord
# property the header describes, and it is what makes this catalog checkable.
noun =
    .line = kʌlayn
    .line-segment = kʌpath kʌ layn
    .ray = kʌre
    .vector = kʌvɛkta
    .curve = kʌlayn kʌ kəri
    .function = kʌfɔnkshɔn
    .parabola = kʌparabola
    .polyline = tʌlayn tʌ path
    .polygon = tʌpɔligɔn
    .triangle = tʌtrayangul
    .rectangle = tʌrɛktangul
    .circle = tʌkərəŋ
    .region = rʌro
    .point = rʌtoni
    .square = tʌskwea
    .diamond = rʌdayamɔn
    .cross = rʌkrɔs
    .plus = rʌmark rʌ plɔs

# The side count is a relative and closes the noun phrase behind the describing
# words, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] tʌ na tʌbʌŋ { $numSides }
       *[head] tʌpɔligɔn tʌ kɔmɔ
    }

# The noun class. Read it against `noun` above: each entry names the class the
# noun's own written prefix carries, and `regular-polygon` takes `c2` because
# `noun-regular-polygon`'s head is «tʌpɔligɔn». `c1` is the default and the
# class an English loan joins, which is what an author's own `markerStyleWord`
# is as far as this catalog is concerned.
noun-gender =
    { $noun ->
        [polyline] c2
        [polygon] c2
        [regular-polygon] c2
        [triangle] c2
        [rectangle] c2
        [circle] c2
        [square] c2
        [region] c3
        [point] c3
        [diamond] c3
        [cross] c3
        [plus] c3
        [text] c3
        [fill] c4
        [background] c4
        [border] c4
       *[other] c1
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
        [c2] tʌwuni
        [c3] rʌwuni
        [c4] ʌŋwuni
       *[c1] kʌwuni
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

# «ʌŋbʌŋ» is the border and leads its own describing words, so they agree with
# it rather than with the shape it surrounds — which is why `border` answers
# `c4` in `noun-gender`, matching that word's own «ʌŋ-». Temne has no article
# and joins this clause with the invariable «na», so all four branches read
# alike.
style-border-clause =
    { $parts ->
        [with-article] na ʌŋbʌŋ { $border }
        [and] na ʌŋbʌŋ { $border }
        [and-article] na ʌŋbʌŋ { $border }
       *[with] na ʌŋbʌŋ { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = kʌwuni bɔm

style-text =
    { $parts ->
        [background] { $color } na ʌŋkəbaka { $background }
       *[plain] { $color }
    }

style-background-none = kəm bɔm


## Boolean words

boolean-true = ʌŋtɔfɔ
boolean-false = ʌŋgbɔl


## Answer buttons

answer-submit-label = Chɛk Ʌŋpaŋth
answer-submit-label-no-correctness = Sɔŋ Ʌŋlipi


## Sectional blocks

section-name =
    .activity = Ʌŋpaŋth
    .aside = Ʌŋkəre kʌbʌŋ
    .cascade = Kasked
    .definition = Ʌŋkəbath
    .example = Kʌmisal
    .exercise = Kʌtʌmpa
    .exercises = Tʌtʌmpa
    .given-answer = Ʌŋlipi
    .note = Kʌsɔŋ
    .objectives = Tʌgbap
    .paragraphs = Tʌpath
    .part = Kʌpath
    .problem = Kʌwuni
    .problems = Tʌwuni
    .proof = Kʌyilaŋ
    .question = Kʌmɔthɔ
    .section = Kʌpath
    .solution = Ʌŋsɔlushɔn
    .task = Ʌŋpaŋth
    .theorem = Tiɔrɛm

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Kʌsandi


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebul { $enumeration }
        [numbered-title] Tebul { $enumeration }{ ": " }
        [unnumbered-title] Tebul{ ": " }
       *[unnumbered] Tebul
    }

figure-name =
    { $parts ->
        [numbered] Kʌmisal { $enumeration }
        [numbered-caption] Kʌmisal { $enumeration }{ ": " }
        [unnumbered-caption] Kʌmisal{ ": " }
       *[unnumbered] Kʌmisal
    }


## Paginator controls

paginator-previous = Kʌ pʌ
paginator-next = Kʌ tʌŋ

paginator-page = Kʌpej

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = ɔ

piecewise-condition-if = ma

piecewise-condition-otherwise = ka tʌbʌŋ tʌ pəŋ


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Sierra Leone teaches secondary science in English,
## so a Temne speaker meets the periodic table there and the fallback *is* the
## curriculum — the same answer `locales/kri` gives from the same ministry.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Kʌmark kʌ Kɛmistri kʌ Bana Bɔm
chemistry-invalid-ionic-compound = Kʌthɔfi kʌ Ayɔn kʌ Bana Bɔm
