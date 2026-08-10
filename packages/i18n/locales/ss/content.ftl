# Swati content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `ss` is siSwati, official in Eswatini and one of South Africa's official
# languages. CLDR has no Swati-language data to answer the endonym with, so
# `<document lang>`'s autocomplete reads "Swati" once rather than twice — the
# `locales/co` case, which four catalogs in this batch share.
#
# **This is the roster's third Nguni catalog, beside `locales/zu` and
# `locales/xh`, and it is a directory of its own for the reason `hr` is one
# beside `sr`**: three standard languages, one grammar, three vocabularies and
# three orthographies. The grammar it shares with Zulu is real and this file
# reproduces it — `$gender` is the noun **class**, and a describing word takes
# one of two concord sets depending on what kind of word it is:
#
#   adjective concord (-khulu, -ncane)          c3 lom-  c5 leli-  c7 lesi-  c9 len-
#   relative concord (the colours, -gcwalisiwe) c3 lo-   c5 leli-  c7 lesi-  c9 le-
#
# What differs from `locales/zu` is the words and their spelling. siSwati
# writes «umudvwa» where Zulu writes «umugqa», «indingilizi» where it writes
# «isiyingi», «bovu» where it writes «bomvu», and «kubili» where it writes
# «kubili» but «tsatfu» where it writes «thathu». Copying either file over the
# other would be wrong in both.
#
# Class 6 is absent for `locales/zu`'s reason: it is the plural of class 5,
# every noun the core names is singular, so `noun-gender` can never answer it
# and a `c6` branch would be a variant nothing can select. `locales/sw` and
# `locales/ny` write one because they have a noun that reaches it.
#
# `c9` is the default and the class a loanword joins, so an author's own
# `markerStyleWord` — which this catalog has never seen — is described as one.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: siSwati marks no case, and the three clause
# positions each arrive with the class of their own noun already set.


## Style vocabulary

# The colours take the relative concord, the loans among them built on the
# borrowed stem the same way.
color =
    .black =
        { $gender ->
            [c3] lomnyama
            [c5] lelimnyama
            [c7] lesimnyama
           *[c9] lomnyama
        }
    .white =
        { $gender ->
            [c3] lomhlophe
            [c5] lelimhlophe
            [c7] lesimhlophe
           *[c9] lomhlophe
        }
    .gray =
        { $gender ->
            [c3] lompunga
            [c5] lelimpunga
            [c7] lesimpunga
           *[c9] lompunga
        }
    .red =
        { $gender ->
            [c3] lobovu
            [c5] lelibovu
            [c7] lesibovu
           *[c9] lobovu
        }
    .orange = losawulo
    .yellow = lophuti
    .green = loluhlata
    .cyan = losayeni
    .blue = loluhlata sasibhakabhaka
    .purple = lophephuli
    .pink = lophinki
    .brown = lonsundvu

line-width =
    .thick =
        { $gender ->
            [c3] lomkhulu
            [c5] lelikhulu
            [c7] lesikhulu
           *[c9] lenkhulu
        }
    .thin =
        { $gender ->
            [c3] lomncane
            [c5] lelincane
            [c7] lesincane
           *[c9] lencane
        }

# Written as an invariable «nge…» phrase rather than as a describing word, so
# that it agrees with nothing and can close the phrase. `style-stroke` puts it
# last for that reason.
line-style =
    .dashed = ngetincetu
    .dotted = ngemachashati

# Noun phrases: they follow «nge» or «na» and modify nothing.
fill-style =
    .horizontal = imidvwa levundlile
    .vertical = imidvwa lemile
    .diagonal = imidvwa letsekile
    .backdiagonal = imidvwa letsekile ngekuphambene
    .dots = emachashati
    .diamonds = emadayimane

noun =
    .line = umudvwa
    .line-segment = sicheme semudvwa
    .ray = umsebe
    .vector = ivektha
    .curve = umjiko
    .function = umsebenti
    .parabola = iparabhola
    .polyline = umudvwa lonetitfo
    .polygon = sakhiwo lesinetinhlangotsi letinyenti
    .triangle = unxantsatfu
    .rectangle = unxande
    .circle = indingilizi
    .region = sifundza
    .point = liphuzu
    .square = sikwele
    .diamond = lidayimane
    .cross = siphambano
    .plus = luphawu lwekuhlanganisa

# The side count goes in the tail, behind the describing words, because
# «lesinetinhlangotsi letingu-5» is a relative phrase and siSwati closes a noun
# phrase with one rather than opening it.
noun-regular-polygon =
    { $part ->
        [tail] lesinetinhlangotsi letingu-{ $numSides }
       *[head] sakhiwo lesilinganako
    }

# The noun class, which is what a describing word agrees with. `c9` is the
# default and the class of every loanword.
noun-gender =
    { $noun ->
        [line] c3
        [ray] c3
        [curve] c3
        [function] c3
        [polyline] c3
        [triangle] c3
        [rectangle] c3
        [border] c3
        [text] c3
        [line-segment] c7
        [polygon] c7
        [regular-polygon] c7
        [circle] c9
        [region] c7
        [square] c7
        [cross] c7
        [point] c5
        [diamond] c5
       *[other] c9
    }


## Style composition

# The dash pattern is a «nge…» phrase and closes the description, so it moves
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

# The noun leads and its describing words follow, with the noun's own relative
# complement closing the phrase.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [c3] logcwalisiwe
        [c5] leligcwalisiwe
        [c7] lesigcwalisiwe
       *[c9] legcwalisiwe
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } nge{ $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } nge{ $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } nge{ $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «umngcele» is class 3 and leads its own describing words, so the border's
# words agree with it rather than with the shape it surrounds. siSwati has no
# article and joins this clause with the invariable «lonem-», so all four
# branches read alike.
style-border-clause =
    { $parts ->
        [with-article] lonemngcele { $border }
        [and] lonemngcele { $border }
        [and-article] lonemngcele { $border }
       *[with] lonemngcele { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = akagcwaliswanga

style-text =
    { $parts ->
        [background] { $color } etikwesizinda { $background }
       *[plain] { $color }
    }

style-background-none = kute


## Boolean words

boolean-true = liciniso
boolean-false = emanga


## Answer buttons

answer-submit-label = Hlola Umsebenti
answer-submit-label-no-correctness = Tfumela Imphendvulo


## Sectional blocks

section-name =
    .activity = Umsebenti
    .aside = Sicalo
    .cascade = Luhlelo
    .definition = Inchazelo
    .example = Sibonelo
    .exercise = Sivivinyo
    .exercises = Tivivinyo
    .given-answer = Imphendvulo
    .note = Inothi
    .objectives = Tinhloso
    .paragraphs = Tigaba
    .part = Incenye
    .problem = Inkinga
    .problems = Tinkinga
    .proof = Bufakazi
    .question = Umbuto
    .section = Sigaba
    .solution = Sisombululo
    .task = Umsebenti
    .theorem = Ithiyoremu

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Sicondziso


## Tables and figures

table-name =
    { $parts ->
        [numbered] Ithebula { $enumeration }
        [numbered-title] Ithebula { $enumeration }{ ": " }
        [unnumbered-title] Ithebula{ ": " }
       *[unnumbered] Ithebula
    }

figure-name =
    { $parts ->
        [numbered] Umfanekiso { $enumeration }
        [numbered-caption] Umfanekiso { $enumeration }{ ": " }
        [unnumbered-caption] Umfanekiso{ ": " }
       *[unnumbered] Umfanekiso
    }


## Paginator controls

paginator-previous = Lokwendlulile
paginator-next = Lokulandzelako
paginator-page = Likhasi

paginator-page-status = { $pageLabel } { $currentPage } kwangu-{ $numPages }


## Piecewise functions

piecewise-condition-or = nobe

piecewise-condition-if = nangabe

piecewise-condition-otherwise = ngaphandle kwaloko


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case, in two school systems that answer the same way:
## secondary science is taught in English in Eswatini and in English or
## Afrikaans in South Africa, so a siSwati speaker meets the periodic table in
## English and the fallback *is* the curriculum.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Luphawu Lwemakhemikhali Lolungasilo
chemistry-invalid-ionic-compound = Inhlanganisela Ye-ayoni Lengasiyo
