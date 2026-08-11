# Bulu content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `bum` is Bulu, a Beti-Pahuin (Bantu, Guthrie A70) language of Cameroon's
# South Region, centered on Ebolowa and Sangmélima. It is close enough to
# Ewondo, Eton and Fang that speakers of any two of them largely understand
# each other; `locales/ewo` (Ewondo) is its nearest sister among these
# catalogs, the way `locales/rn` sits beside `locales/rw`. Where the two
# differ is exactly what a reviewer of either file should check first once
# both exist — see the note at the end of this header.
#
# `$gender` is the noun **class**, as in every Bantu catalog here, and
# `noun-gender` answers `c1` or `c7`. Beti-Pahuin languages mark class twice
# on a describing word — the noun's own prefix and the concord that repeats
# it on the adjective — and, as in `locales/bem`, this file writes out each
# whole form rather than deriving it:
#
#              c1 (mo-/be-)   c7 (e-/bi-)
#   -vidi        môvidi         évidi         (black)
#   -fub         môfub          éfub          (white)
#   -volô        môvolô         évolô         (red)
#
# Only these three colours have a stem this seed is confident is native
# Bulu; the rest are French loanwords, adapted the way `locales/bem` and
# `locales/rn` adapt English and French ones respectively — written bare,
# with no concord, for `locales/sw`'s reason: the associative particle that
# would attach a class to a loan is ungrammatical in the standalone position
# `backgroundColor` reports it in.
#
# `c1` is the class this seed assigns to the "long, drawable line" group —
# `line`, `curve`, `polyline`, `ray`, `cross` and `border` — on the pattern
# of Ewondo/Bulu class 3 (also mo-/mi-), the elongated-object class in most
# Beti-Pahuin descriptions. `c7` is everywhere else, including every
# loanword, which is what an author's own `markerStyleWord` gets since the
# catalog has never seen it. A third class is deliberately not attempted:
# this seed found two prefixes — c1 and c7 — it could write out with enough
# confidence to commit to paper, and stopped there rather than guess at a
# third. A speaker may well split `c7` further once reviewing.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: Bulu, like the other Beti-Pahuin catalogs here,
# marks no case that these phrases would need to agree for.
#
# The mathematical and UI nouns are almost entirely French loanwords —
# «sɛrkl», «triyangl», «poligon» — rather than native coinages. That is the
# school-system case: Cameroon's South Region, where Bulu is spoken, is
# Francophone, and secondary mathematics and science there are taught in
# French rather than in Bulu or English, so a Bulu-speaking student meets
# this vocabulary in French first. The chemistry section below omits
# `element-name`/`element-anion-name` for the same reason and states it
# again there rather than only here.
#
# A reviewer with both this file and `locales/ewo/content.ftl` in hand should
# check first whether Ewondo's concord vowels and Bulu's actually coincide as
# written here — the two languages are close enough that a shared class-prefix
# table is a reasonable first guess, but Beti-Pahuin dialects are also known
# to disagree on the concord's exact vowel where the noun prefix agrees, and
# this seed had no way to verify that distinction independently for either
# language.


## Style vocabulary

# Only the three with a native stem inflect.
color =
    .black =
        { $gender ->
            [c1] môvidi
           *[c7] évidi
        }
    .white =
        { $gender ->
            [c1] môfub
           *[c7] éfub
        }
    .gray = gri
    .red =
        { $gender ->
            [c1] môvolô
           *[c7] évolô
        }
    .orange = oranj
    .yellow = jonu
    .green = vɛr
    .cyan = siyan
    .blue = blé
    .purple = violɛ
    .pink = rozɛ
    .brown = marɔ̃

line-width =
    .thick =
        { $gender ->
            [c1] môbébé
           *[c7] ébébé
        }
    .thin =
        { $gender ->
            [c1] môkekele
           *[c7] ékekele
        }

# Written as an invariable «a bo …» phrase, so that it agrees with nothing
# and can close the phrase. `style-stroke` puts it last for that reason.
line-style =
    .dashed = a bo tirɛ
    .dotted = a bo pwɛ̃

fill-style =
    .horizontal = melal ma ne mimbaman
    .vertical = melal ma ne miyembane
    .diagonal = melal ma ne melogolo
    .backdiagonal = melal ma ne melogolo m'ényiñ
    .dots = bipwɛ̃
    .diamonds = bidiyaman

noun =
    .line = liñ
    .line-segment = morso liñ
    .ray = rayɔ̃
    .vector = vektɛr
    .curve = kurb
    .function = fonksiɔ̃
    .parabola = parabol
    .polyline = poliliñ
    .polygon = poligon
    .triangle = triyangl
    .rectangle = rektangl
    .circle = sɛrkl
    .region = rejɔ̃
    .point = pwɛ̃
    .square = kare
    .diamond = diyaman
    .cross = kwa
    .plus = plis

# The side count is a relative complement and closes the noun phrase, so it
# goes in the tail, following `locales/bem`'s shape for the same reason.
noun-regular-polygon =
    { $part ->
        [tail] a ne bibalabala { $numSides }
       *[head] poligon é ne mvegan
    }

# The noun class. `c7` is the default and the class of every loanword.
noun-gender =
    { $noun ->
        [line] c1
        [curve] c1
        [polyline] c1
        [ray] c1
        [cross] c1
        [border] c1
       *[other] c7
    }


## Style composition

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
        [c1] môlôné
       *[c7] élôné
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } a bo { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } a bo { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } a bo { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «bɔr» is a loanword and takes no concord, so its describing words agree
# with nothing and all four branches read alike, on `locales/bem`'s pattern
# for its invariable «na».
style-border-clause =
    { $parts ->
        [with-article] a bo bɔr { $border }
        [and] a bo bɔr { $border }
        [and-article] a bo bɔr { $border }
       *[with] a bo bɔr { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = a si lôné ki

style-text =
    { $parts ->
        [background] { $color } a bo fɔ̃ { $background }
       *[plain] { $color }
    }

style-background-none = jôm éziñ te


## Boolean words

boolean-true = mvaé
boolean-false = abé


## Answer buttons

answer-submit-label = Yene Nkobo
answer-submit-label-no-correctness = Lôm Nkobo


## Sectional blocks

section-name =
    .activity = Ésaé
    .aside = Éjô Éziñ
    .cascade = Nkalatè
    .definition = Ndimba
    .example = Egzanp
    .exercise = Égzɛrsis
    .exercises = Bégzɛrsis
    .given-answer = Nkobo
    .note = Ntili
    .objectives = Mimbamba
    .paragraphs = Bikalate
    .part = Pati
    .problem = Ébuma
    .problems = Mebuma
    .proof = Nlélane
    .question = Ésili
    .section = Sɛksiɔ̃
    .solution = Sɔlisiɔ̃
    .task = Ésaé
    .theorem = Téyorɛm

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Ajô

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tab { $enumeration }
        [numbered-title] Tab { $enumeration }{ ": " }
        [unnumbered-title] Tab{ ": " }
       *[unnumbered] Tab
    }

figure-name =
    { $parts ->
        [numbered] Figɛr { $enumeration }
        [numbered-caption] Figɛr { $enumeration }{ ": " }
        [unnumbered-caption] Figɛr{ ": " }
       *[unnumbered] Figɛr
    }


## Paginator controls

paginator-previous = Avan
paginator-next = Apre
paginator-page = Ibumu

paginator-page-status = { $pageLabel } { $currentPage } asu { $numPages }


## Piecewise functions

piecewise-condition-or = nge
piecewise-condition-if = nge

piecewise-condition-otherwise = nge te fe


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all
## 130 keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case, as `locales/rn` states it for Burundi. Cameroon's
## South Region — where Bulu is spoken — is Francophone, and secondary
## science there is taught in French, so a Bulu speaker meets the periodic
## table there and the fallback *is* the curriculum.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ébwaé a Kemi É Si Mvaé Ki
chemistry-invalid-ionic-compound = Nkobo w'Ayɔ̃ Wu Si Mvaé Ki
