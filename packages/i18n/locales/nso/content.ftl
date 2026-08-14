# Northern Sotho content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `nso` is Northern Sotho, which its own speakers call **Sesotho sa Leboa** and
# which is also known as Sepedi. `Intl.DisplayNames` renders the English name
# "Northern Sotho" and the endonym "Sesotho sa Leboa", so that is what
# `<document lang>`'s autocomplete offers; the three names are one language.
#
# This is the third Sotho-Tswana catalog, beside `locales/st` (Southern Sotho)
# and `locales/tn` (Tswana), and it is a directory of its own for the reason
# the README already gives for those two: three standard languages, three
# orthographies, three vocabularies. This file writes «mothaladi» where `st`
# writes «mola» and `tn` writes «mola», «gomme» where `st` writes «’me», and
# «efela» where `tn` writes «mme».
#
# **What an adjective agrees with here is the noun's class**, as in the ten
# Bantu catalogs that came before, so `noun-gender` answers `c3`, `c5`, `c7`
# or `c9` and every concording word selects on it. Sotho-Tswana builds
# that concord out of two pieces where Nguni builds it out of one — a
# qualificative particle and then the adjective prefix — so the whole of it is
# written into each variant rather than assembled:
#
#            c3 (mo-)      c5 (le-)       c7 (se-)      c9 (N-)
#   -koto     o mokoto      le lekoto      se sekoto     e nkoto
#   -sesane   o mosesane    le lesesane    se sesesane   e sesane
#   -so       o moso        le leso        se seso       e ntsho
#   -šweu     o mošweu      le lešweu      se sešweu     e tšhweu
#   -hubedu   o mohubedu    le lehubedu    se sehubedu   e khubedu
#
# Class 6 is absent because no noun the core names reaches it — it is the
# plural of class 5 and every noun here is singular; see `locales/zu`'s header
# for the reachability rule that decides which class branches a catalog is
# entitled to write.
#
# `c9` is the default and the class a loanword joins, which is what an author's
# own `markerStyleWord` is as far as this catalog is concerned.
#
# The seed is stiff in one place on purpose, and it is `locales/sw`'s place for
# `locales/sw`'s reason: only the three colours with a native adjective stem
# take a concord. The rest are nouns, and attributively Sesotho sa Leboa joins
# a noun to what it describes with the possessive concord of the class («wa»,
# «sa», «la», «ya») — which is computable from `$gender`, but the same string
# is what `backgroundColor` reports standing alone, where a bare possessive is
# ungrammatical, and `$role` is `standalone` in both positions. So the colour
# nouns are written bare, which is what a label says in this language anyway.
#
# Adjectives follow the noun, so the composition messages put the noun first.
# `$role` goes unused: Sesotho sa Leboa marks no case, and the three clause
# positions each arrive with the class of their own noun already set.
#
# The mathematical nouns are the first thing to check here. Where the language
# has an everyday word for the thing — «mothaladi» a line, «ntlha» a point,
# «sediko» a circle, «sefapano» a cross — that word is used; where this seed
# had nothing to reach for it writes an adapted loan in Northern Sotho
# orthography, and a speaker with the school terminology in front of them
# should replace those first.


## Style vocabulary

# Only the three with a native adjective stem inflect. The rest are nouns and
# do not change shape for anything.
color =
    .black =
        { $gender ->
            [c3] o moso
            [c5] le leso
            [c7] se seso
           *[c9] e ntsho
        }
    .white =
        { $gender ->
            [c3] o mošweu
            [c5] le lešweu
            [c7] se sešweu
           *[c9] e tšhweu
        }
    .gray = putswa
    .red =
        { $gender ->
            [c3] o mohubedu
            [c5] le lehubedu
            [c7] se sehubedu
           *[c9] e khubedu
        }
    .orange = namune
    .yellow = serolane
    .green = tala
    .cyan = saene
    .blue = talalerata
    .purple = phephole
    .pink = phinki
    .brown = sootho

line-width =
    .thick =
        { $gender ->
            [c3] o mokoto
            [c5] le lekoto
            [c7] se sekoto
           *[c9] e nkoto
        }
    .thin =
        { $gender ->
            [c3] o mosesane
            [c5] le lesesane
            [c7] se sesesane
           *[c9] e sesane
        }

# Written as an invariable «ka …» phrase rather than as an adjective, so that
# it agrees with nothing and can close the phrase. `style-stroke` puts it last
# for that reason.
line-style =
    .dashed = ka dikgaotšo
    .dotted = ka marontho

# Noun phrases: they follow «ka» or «gomme le» and modify nothing.
fill-style =
    .horizontal = methaladi ya go rapama
    .vertical = methaladi ya go ema
    .diagonal = methaladi ya sekhutlwana
    .backdiagonal = methaladi ya sekhutlwana se se retologilego
    .dots = marontho
    .diamonds = ditaamane

noun =
    .line = mothaladi
    .line-segment = karolo ya mothaladi
    .ray = lehlasedi
    .vector = bektara
    .curve = mokgopo
    .function = tirišo
    .parabola = parabola
    .polyline = mothaladi wa dikarolo
    .polygon = sekhutlokhutlo
    .triangle = khutlotharo
    .rectangle = khutlonne
    .circle = sediko
    .region = lefelo
    .point = ntlha
    .square = sekwere
    .diamond = taamane
    .cross = sefapano
    .plus = leswao la tlaleletšo

# The side count is a possessive complement — «sa mahlakore a 5» — and closes
# the noun phrase behind the adjectives rather than opening it, so it goes in
# the tail.
noun-regular-polygon =
    { $part ->
        [tail] sa mahlakore a { $numSides }
       *[head] sekhutlokhutlo se se lekanego
    }

# The noun class, which is what a concording word agrees with. `c9` is the
# default and the class of every loanword, including a word an author supplies.
noun-gender =
    { $noun ->
        [line] c3
        [curve] c3
        [polyline] c3
        [border] c3
        [fill] c3
        [ray] c5
        [region] c5
        [plus] c5
        [polygon] c7
        [regular-polygon] c7
        [circle] c7
        [square] c7
        [cross] c7
        [text] c7
       *[other] c9
    }


## Style composition

# The dash pattern is a «ka …» phrase and closes the description, so it moves
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

# The noun leads and its adjectives follow, with the noun's own possessive
# complement closing the phrase: «sekhutlokhutlo se se lekanego e khubedu sa
# mahlakore a 5».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [c3] o tladitšwego
        [c5] le tladitšwego
        [c7] se tladitšwego
       *[c9] e tladitšwego
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ka { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ka { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ka { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «mollwane» is class 3 and leads its own adjectives, so the border's words
# agree with it rather than with the shape it surrounds. Northern Sotho has no
# article and joins this clause with the invariable «le», so all four branches
# read alike.
style-border-clause =
    { $parts ->
        [with-article] le mollwane { $border }
        [and] le mollwane { $border }
        [and-article] le mollwane { $border }
       *[with] le mollwane { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ga se ya tlala

style-text =
    { $parts ->
        [background] { $color } godimo ga bokamorago { $background }
       *[plain] { $color }
    }

style-background-none = ga go na selo


## Boolean words

boolean-true = therešo
boolean-false = maaka


## Answer buttons

answer-submit-label = Lekola Mošomo
answer-submit-label-no-correctness = Romela Karabo


## Sectional blocks

section-name =
    .activity = Modiro
    .aside = Tlaleletšo
    .cascade = Tatelano
    .definition = Tlhalošo
    .example = Mohlala
    .exercise = Tlwaetšo
    .exercises = Ditlwaetšo
    .given-answer = Karabo
    .note = Lengwalo
    .objectives = Maikemišetšo
    .paragraphs = Dirapa
    .part = Karolo
    .problem = Bothata
    .problems = Mathata
    .proof = Tiišetšo
    .question = Potšišo
    .section = Karolwana
    .solution = Tharollo
    .task = Mošomo
    .theorem = Teoreme

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Keletšo


## Tables and figures

table-name =
    { $parts ->
        [numbered] Lenaneo { $enumeration }
        [numbered-title] Lenaneo { $enumeration }{ ": " }
        [unnumbered-title] Lenaneo{ ": " }
       *[unnumbered] Lenaneo
    }

figure-name =
    { $parts ->
        [numbered] Seswantšho { $enumeration }
        [numbered-caption] Seswantšho { $enumeration }{ ": " }
        [unnumbered-caption] Seswantšho{ ": " }
       *[unnumbered] Seswantšho
    }


## Paginator controls

paginator-previous = Pele
paginator-next = Latelago
paginator-page = Letlakala

paginator-page-status = { $pageLabel } { $currentPage } go { $numPages }


## Piecewise functions

piecewise-condition-or = goba

piecewise-condition-if = ge

piecewise-condition-otherwise = go sego bjalo


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## This is the school-system case, and in South Africa it is a sharp one: the
## Further Education and Training phase is taught in English or Afrikaans in
## effectively every school, so a Northern Sotho speaker meets the periodic
## table in English and the fallback *is* the curriculum. `locales/af`, which
## shares those classrooms, supplies the whole table; that difference is a fact
## about the medium of instruction rather than about either language.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Leswao la Khemi le Fošagetšego
chemistry-invalid-ionic-compound = Motswako wa Ayone o Fošagetšego
