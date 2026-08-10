# Venda content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `ve` is Tshivenḓa, one of South Africa's official languages. CLDR has no
# Venda-language data to answer the endonym with, so `<document lang>`'s
# autocomplete reads "Venda" once rather than twice.
#
# **The orthography is the first thing to get right here**, because it is the
# one thing in this file a reader can check without knowing the language:
# Tshivenḓa marks its dental and retroflex consonants with a **combining
# circumflex below**, U+0331 — ḓ, ṱ, ṋ, ḽ, ṅ — and those letters are not
# interchangeable with plain d, t, n, l, n. «tshiṱenderedzwa» is a circle and
# «tshitenderedzwa» is not a word. Everything written here uses the precomposed
# characters where Unicode has them and the combining mark where it does not,
# which is what the SABC and the Department of Basic Education both print.
#
# `$gender` is the noun **class**, as in every Bantu catalog here, and
# `noun-gender` answers `c3`, `c5`, `c7` or `c9`. The concord is a prefix on
# the stem:
#
#            c3 (mu-)   c5 (ḽi-)   c7 (tshi-)   c9 (N-)
#   -tswu     mutswu     ḽitswu     tshitswu     ntswu
#   -tshena   mutshena   ḽitshena   tshitshena   ntshena
#   -tswuku   mutswuku   ḽitswuku   tshitswuku   ntswuku
#   -hulu     muhulu     ḽihulu     tshihulu     khulu
#   -ṱuku     muṱuku     ḽiṱuku     tshiṱuku     nṱuku
#
# Only the three colours with a native stem take the concord; the rest are
# nouns, written bare for `locales/sw`'s reason — the possessive concord that
# would attach them attributively is ungrammatical in the standalone position
# `backgroundColor` reports them in, and `$role` cannot tell the two apart.
#
# Class 6 is absent because no noun the core names reaches it; see
# `locales/zu`'s header for the reachability rule.
#
# `c9` is the default and the class a loanword joins, which is what an author's
# own `markerStyleWord` is as far as this catalog is concerned.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: Tshivenḓa marks no case.
#
# The mathematical nouns mix Tshivenḓa words with adapted loans, and which is
# which is worth checking first: «mutalo», «tshiṱenderedzwa» and
# «tshifhambano» are the language's, and «thirayangele», «pharabola» and
# «vhekhithara» are loans this seed had nothing else to reach for.


## Style vocabulary

# Only the three with a native stem inflect.
color =
    .black =
        { $gender ->
            [c3] mutswu
            [c5] ḽitswu
            [c7] tshitswu
           *[c9] ntswu
        }
    .white =
        { $gender ->
            [c3] mutshena
            [c5] ḽitshena
            [c7] tshitshena
           *[c9] ntshena
        }
    .gray = pfumbu
    .red =
        { $gender ->
            [c3] mutswuku
            [c5] ḽitswuku
            [c7] tshitswuku
           *[c9] ntswuku
        }
    .orange = orintshi
    .yellow = tshiṱaha
    .green = daladala
    .cyan = sayana
    .blue = buruu
    .purple = phephuḽi
    .pink = phinngi
    .brown = buraweni

line-width =
    .thick =
        { $gender ->
            [c3] muhulu
            [c5] ḽihulu
            [c7] tshihulu
           *[c9] khulu
        }
    .thin =
        { $gender ->
            [c3] muṱuku
            [c5] ḽiṱuku
            [c7] tshiṱuku
           *[c9] nṱuku
        }

# Written as an invariable «nga …» phrase, so that it agrees with nothing and
# can close the phrase. `style-stroke` puts it last for that reason.
line-style =
    .dashed = nga zwipiḓa
    .dotted = nga thodzi

fill-style =
    .horizontal = mitalo yo lalaho
    .vertical = mitalo yo imaho
    .diagonal = mitalo yo sendamaho
    .backdiagonal = mitalo yo sendamaho nga u fhambana
    .dots = thodzi
    .diamonds = daimonde

noun =
    .line = mutalo
    .line-segment = tshipiḓa tsha mutalo
    .ray = reyi
    .vector = vhekhithara
    .curve = mutalo wo kokovhaho
    .function = mushumo
    .parabola = pharabola
    .polyline = mutalo wa zwipiḓa
    .polygon = tshivhumbeo tsha masia manzhi
    .triangle = thirayangele
    .rectangle = rekithengele
    .circle = tshiṱenderedzwa
    .region = vhupo
    .point = phoinnti
    .square = sikweya
    .diamond = daimonde
    .cross = tshifhambano
    .plus = tshiga tsha u engedza

# The side count is a possessive complement and closes the noun phrase behind
# the describing words rather than opening it, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] tsha masia a { $numSides }
       *[head] tshivhumbeo tsho linganaho
    }

# The noun class. `c9` is the default and the class of every loanword.
noun-gender =
    { $noun ->
        [line] c3
        [curve] c3
        [polyline] c3
        [function] c3
        [border] c3
        [line-segment] c7
        [polygon] c7
        [regular-polygon] c7
        [circle] c7
        [cross] c7
        [plus] c7
        [text] c7
        [fill] c7
       *[other] c9
    }


## Style composition

# The dash pattern is a «nga …» phrase and closes the description, so it moves
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
        [c3] wo ḓadzwaho
        [c5] ḽo ḓadzwaho
        [c7] tsho ḓadzwaho
       *[c9] yo ḓadzwaho
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } nga { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } nga { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } nga { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «mukano» is class 3 and leads its own describing words, so the border's words
# agree with it rather than with the shape it surrounds. Tshivenḓa has no
# article and joins this clause with the invariable «na», so all four branches
# read alike.
style-border-clause =
    { $parts ->
        [with-article] na mukano { $border }
        [and] na mukano { $border }
        [and-article] na mukano { $border }
       *[with] na mukano { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = a yo ngo ḓadzwa

style-text =
    { $parts ->
        [background] { $color } nṱha ha muvhala wa murahu { $background }
       *[plain] { $color }
    }

style-background-none = a hu na tshithu


## Boolean words

boolean-true = ngoho
boolean-false = mazwifhi


## Answer buttons

answer-submit-label = Sedza Mushumo
answer-submit-label-no-correctness = Rumela Phindulo


## Sectional blocks

section-name =
    .activity = Nyito
    .aside = Ṱhoḓea
    .cascade = Tevhekano
    .definition = Ṱhalutshedzo
    .example = Tsumbo
    .exercise = Ngudo
    .exercises = Ngudo
    .given-answer = Phindulo
    .note = Ṋowuthu
    .objectives = Zwipikwa
    .paragraphs = Dziphara
    .part = Tshipiḓa
    .problem = Thaidzo
    .problems = Thaidzo
    .proof = Vhuṱanzi
    .question = Mbudziso
    .section = Khethekanyo
    .solution = Tandululo
    .task = Mushumo
    .theorem = Thiyoreme

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Nyeletshedzo


## Tables and figures

table-name =
    { $parts ->
        [numbered] Ṱhefula { $enumeration }
        [numbered-title] Ṱhefula { $enumeration }{ ": " }
        [unnumbered-title] Ṱhefula{ ": " }
       *[unnumbered] Ṱhefula
    }

figure-name =
    { $parts ->
        [numbered] Tshifanyiso { $enumeration }
        [numbered-caption] Tshifanyiso { $enumeration }{ ": " }
        [unnumbered-caption] Tshifanyiso{ ": " }
       *[unnumbered] Tshifanyiso
    }


## Paginator controls

paginator-previous = Zwo fhiraho
paginator-next = Zwi tevhelaho
paginator-page = Siaṱari

paginator-page-status = { $pageLabel } { $currentPage } kha { $numPages }


## Piecewise functions

piecewise-condition-or = kana

piecewise-condition-if = arali

piecewise-condition-otherwise = nga nnḓa ha zwenezwo


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case, the same one `locales/nso`, `locales/ss` and
## `locales/ts` record: South Africa teaches the Further Education and Training
## phase in English or Afrikaans, so a Tshivenḓa speaker meets the periodic
## table in one of those and the fallback *is* the curriculum.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Tshiga tsha Khemikhala tsho Khakheaho
chemistry-invalid-ionic-compound = Ṱhanganelo ya Ayoni yo Khakheaho
