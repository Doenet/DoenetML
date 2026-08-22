# Fula content catalog: the prose the core computes into the document. Selected
# by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `ff` is the ISO 639-3 **macrolanguage** over the Fula varieties spoken from
# Senegal to Sudan. The catalog is **Pulaar**, the western variety of Senegal
# and Mauritania — which is what CLDR fills a bare `ff` in as (`ff-Latn-SN`)
# and what the roster's endonym, "Pulaar", names. `negotiate.ts` folds the
# other eight member codes onto it: `ffm`, `fub`, `fue`, `fuf`, `fuh`, `fui`,
# `fuq` and `fuv` all reach this file, and `fuc` is the one ICU already folds.
# Serving Pulaar to a Nigerian Fulfulde reader is a real compromise, and the
# alternative is English.
#
# The orthography is the Latin one Senegal and Guinea standardized, with **ɓ,
# ɗ, ƴ and ŋ** — the hooked letters are their own characters (U+0253, U+0257,
# U+01B4, U+014B) and not b, d, y and n with anything added. A reader arriving
# under `ff-Adlm` reaches this catalog and gets Latin: **Adlam is a living
# script for Fulfulde**, encoded since Unicode 9, taught and published in, and
# the answer to that mismatch is a second catalog beside this one rather than a
# rename of it — the `pa`/`sr`/`mni` case, and the one in this batch where the
# second catalog is owed rather than hypothetical.
#
# **Fula agrees an adjective with the noun's class, and the concord is a
# suffix.** That is what this catalog adds to the sixteen Bantu ones beside it:
# there `$gender` reaches the *front* of the word and here it reaches the back,
# and no code outside these files had to learn the difference, because the
# argument is a token set and nothing outside a catalog reads its values.
#
#            ngol         nde        ndi        ngal
#   ɓalee-    ɓaleewol     ɓaleere    ɓaleeri    ɓaleewal
#   danee-    daneewol     daneere    daneeri    daneewal
#   bodee-    bodeewol     bodeere    bodeeri    bodeewal
#   mawn-     mawngol      mawnde     mawndi     mawngal
#   famɗu-    famɗungol    famɗunde   famɗundi   famɗungal
#
# Fula has more than twenty classes; these four are the ones the shapes this
# catalog names actually land in, and `nde` is the default — the class a
# loanword joins, which is what an author's own `markerStyleWord` is as far as
# this file is concerned. Adding a class means adding the noun that reaches it
# first, which is `locales/zu`'s reachability rule stated for a suffix.
#
# Adjectives follow the noun, so the composition messages put the noun first.
# `$role` goes unused: Fula marks no case on an adjective.
#
# The geometry nouns are the first thing to check. «diidol» a line, «toɓɓere» a
# point and «laawol» a way are Pulaar words; the rest are adapted loans this
# seed had nothing else to reach for.


## Style vocabulary

color =
    .black =
        { $gender ->
            [ngol] ɓaleewol
            [ndi] ɓaleeri
            [ngal] ɓaleewal
           *[nde] ɓaleere
        }
    .white =
        { $gender ->
            [ngol] daneewol
            [ndi] daneeri
            [ngal] daneewal
           *[nde] daneere
        }
    .gray = buruus
    .red =
        { $gender ->
            [ngol] bodeewol
            [ndi] bodeeri
            [ngal] bodeewal
           *[nde] bodeere
        }
    .orange = oraas
    .yellow = oolo
    .green = haako
    .cyan = siyaa
    .blue = bula
    .purple = purpul
    .pink = roos
    .brown = mbaroodi
line-width =
    .thick =
        { $gender ->
            [ngol] mawngol
            [ndi] mawndi
            [ngal] mawngal
           *[nde] mawnde
        }
    .thin =
        { $gender ->
            [ngol] famɗungol
            [ndi] famɗundi
            [ngal] famɗungal
           *[nde] famɗunde
        }
# Written as an invariable «e …» phrase, so that it agrees with nothing and can
# close the phrase. `style-stroke` puts it last for that reason.
line-style =
    .dashed = e taƴe
    .dotted = e toɓɓe
fill-style =
    .horizontal = diide lelinde
    .vertical = diide dariinde
    .diagonal = diide ooñiinde
    .backdiagonal = diide ooñiinde e banŋe goɗɗo
    .dots = toɓɓe
    .diamonds = damaa
noun =
    .line = diidol
    .line-segment = taƴre diidol
    .ray = leyol
    .vector = wektoor
    .curve = diidol ooñiingol
    .function = golle
    .parabola = parabool
    .polyline = diidol taƴe
    .polygon = poligoŋ
    .triangle = tiriyaangal
    .rectangle = rektaangal
    .circle = sirkul
    .region = nokku
    .point = toɓɓere
    .square = kare
    .diamond = damaa
    .cross = kuruwaa
    .plus = maandeeji ɓeydugol
# The side count follows the whole phrase, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] mo banŋeeji { $numSides }
       *[head] poligoŋ fotduɗo
    }
# The noun class, which is what a concording suffix agrees with. `nde` is the
# default and the class of every loanword.
noun-gender =
    { $noun ->
        [line] ngol
        [curve] ngol
        [polyline] ngol
        [ray] ngol
        [border] ngol
        [triangle] ngal
        [rectangle] ngal
        [circle] ngal
        [polygon] ngal
        [regular-polygon] ngal
        [text] ndi
        [fill] ndi
       *[other] nde
    }

## Style composition

# The dash pattern is an «e …» phrase and closes the description, so it moves
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
        [ngol] heewngol
        [ndi] heewndi
        [ngal] heewngal
       *[nde] heewnde
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } e { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } e { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } e { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «keerol» is an `ngol` noun and leads its own adjectives, so the border's
# words agree with it rather than with the shape it surrounds. Fula has no
# article and joins this clause with the invariable «e», so all four branches
# read alike.
style-border-clause =
    { $parts ->
        [with-article] e keerol { $border }
        [and] e keerol { $border }
        [and-article] e keerol { $border }
       *[with] e keerol { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = heewaani
style-text =
    { $parts ->
        [background] { $color } e dow ɓaawo { $background }
       *[plain] { $color }
    }
style-background-none = alaa

## Boolean words

boolean-true = goonga
boolean-false = fenaande

## Answer buttons

answer-submit-label = Ƴeewto Golle
answer-submit-label-no-correctness = Neldu Jaabawol

## Sectional blocks

section-name =
    .activity = Golle
    .aside = Ɓeydannde
    .cascade = Njuɓɓudi
    .definition = Firo
    .example = Misaal
    .exercise = Coftal
    .exercises = Coftal
    .given-answer = Jaabawol
    .note = Bindol
    .objectives = Payndaale
    .paragraphs = Kelme dental
    .part = Geɗal
    .problem = Caɗeele
    .problems = Caɗeele
    .proof = Seedamfaagu
    .question = Naamnal
    .section = Geɗal
    .solution = Ndimaagu
    .task = Golle
    .theorem = Teyoreem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Tinndinoore

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabal { $enumeration }
        [numbered-title] Tabal { $enumeration }{ ": " }
        [unnumbered-title] Tabal{ ": " }
       *[unnumbered] Tabal
    }
figure-name =
    { $parts ->
        [numbered] Natal { $enumeration }
        [numbered-caption] Natal { $enumeration }{ ": " }
        [unnumbered-caption] Natal{ ": " }
       *[unnumbered] Natal
    }

## Paginator controls

paginator-previous = Ɓennungo
paginator-next = Garowo
paginator-page = Hello
paginator-page-status = { $pageLabel } { $currentPage } e { $numPages }

## Piecewise functions

piecewise-condition-or = walla
piecewise-condition-if = si
piecewise-condition-otherwise = si wonaa noon

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case, told across a wider stretch of countries than any
## other catalog in this batch: secondary science is taught in French in
## Senegal, Mali, Guinea, Niger, Burkina Faso, Cameroon and Chad, and in
## English in Nigeria, so a Fula speaker meets the periodic table in one of
## those two and the fallback *is* the curriculum wherever they are.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Maandeeji Kimi Moƴƴaani
chemistry-invalid-ionic-compound = Denndaangal Iyoŋ Moƴƴaani
