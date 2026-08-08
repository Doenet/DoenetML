# Zulu content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Zulu reads `$gender` as the noun **class**, the way `locales/sw` does: it has
# no masculine or feminine, and what a describing word agrees with is the class
# of the noun in front of it. `noun-gender` answers `c3`, `c5`, `c7` or `c9`,
# and every word that carries a concord selects on it.
#
# Zulu differs from Swahili in needing *two* concord sets rather than one, and
# which set a word takes is a fact about the word and not about the noun:
#
#   adjective concord (-khulu, -ncane)   c3 om-  c5 eli-  c7 esi-  c9 en-
#   relative concord (the colours, -gcwalisiwe)  c3 o-  c5 eli-  c7 esi-  c9 e-
#
# Class 6 is absent on purpose. It is the plural of class 5 and every noun the
# core names is singular, so `noun-gender` can never answer `c6` — a `c6`
# branch would be a variant nothing can select. Adding one means adding the
# noun that reaches it first. `locales/sw` and `locales/ny` do have such a
# noun, which is why they write the branch and this file does not.
#
# So the two tables are written out per word rather than derived, which is why
# «omkhulu» and «obomvu» describe the same line with different prefixes.
#
# `c9` is the default and the class a loanword joins, so an author's own
# `markerStyleWord` — which this catalog has never seen — is described as one.
#
# Describing words follow the noun, so the composition messages put the noun
# first. `$role` goes unused: Zulu marks no case.


## Style vocabulary

# The colours take the relative concord. Only the six with a native stem are
# written that way; the loans are relatives too, built on the borrowed stem.
color =
    .black =
        { $gender ->
            [c3] omnyama
            [c5] elimnyama
            [c7] esimnyama
           *[c9] emnyama
        }
    .white =
        { $gender ->
            [c3] omhlophe
            [c5] elimhlophe
            [c7] esimhlophe
           *[c9] emhlophe
        }
    .gray =
        { $gender ->
            [c3] ompunga
            [c5] elimpunga
            [c7] esimpunga
           *[c9] empunga
        }
    .red =
        { $gender ->
            [c3] obomvu
            [c5] elibomvu
            [c7] esibomvu
           *[c9] ebomvu
        }
    .orange =
        { $gender ->
            [c3] o-orenji
            [c5] eli-orenji
            [c7] esi-orenji
           *[c9] e-orenji
        }
    .yellow =
        { $gender ->
            [c3] ophuzi
            [c5] eliphuzi
            [c7] esiphuzi
           *[c9] ephuzi
        }
    .green =
        { $gender ->
            [c3] oluhlaza okotshani
            [c5] eliluhlaza okotshani
            [c7] esiluhlaza okotshani
           *[c9] eluhlaza okotshani
        }
    .cyan =
        { $gender ->
            [c3] osayeni
            [c5] elisayeni
            [c7] esisayeni
           *[c9] esayeni
        }
    .blue =
        { $gender ->
            [c3] oluhlaza okwesibhakabhaka
            [c5] eliluhlaza okwesibhakabhaka
            [c7] esiluhlaza okwesibhakabhaka
           *[c9] eluhlaza okwesibhakabhaka
        }
    .purple =
        { $gender ->
            [c3] obubende
            [c5] elibubende
            [c7] esibubende
           *[c9] ebubende
        }
    .pink =
        { $gender ->
            [c3] opinki
            [c5] elipinki
            [c7] esipinki
           *[c9] epinki
        }
    .brown =
        { $gender ->
            [c3] onsundu
            [c5] elinsundu
            [c7] esinsundu
           *[c9] ensundu
        }

# These two are true adjectives and take the adjective concord, not the
# relative one the colours take.
line-width =
    .thick =
        { $gender ->
            [c3] omkhulu
            [c5] elikhulu
            [c7] esikhulu
           *[c9] enkulu
        }
    .thin =
        { $gender ->
            [c3] omncane
            [c5] elincane
            [c7] esincane
           *[c9] encane
        }

# Written as an invariable «one-…» phrase — "having …" — rather than as a
# describing word, so that it agrees with nothing and can close the phrase.
# `style-stroke` puts it last for that reason.
line-style =
    .dashed = onemidwa
    .dotted = onamachashazi

# Noun phrases: they follow «kanye ne-» and modify nothing.
fill-style =
    .horizontal = imigqa evundlile
    .vertical = imigqa emile
    .diagonal = imigqa etshekile
    .backdiagonal = imigqa etshekile ngokuphambene
    .dots = amachashazi
    .diamonds = amadayimane

noun =
    .line = umugqa
    .line-segment = isiqephu somugqa
    .ray = umsebe
    .vector = ivektha
    .curve = ijika
    .function = umsebenzi
    .parabola = iparabhola
    .polyline = umugqa onamacezu
    .polygon = isakhiwo esinezinhlangothi eziningi
    .triangle = unxantathu
    .rectangle = unxande
    .circle = isiyingi
    .region = isifunda
    .point = iphuzu
    .square = isikwele
    .diamond = idayimane
    .cross = isiphambano
    .plus = uphawu lokuhlanganisa

# The side count goes in the tail, behind the describing words, because
# «esinezinhlangothi ezingu-5» is a relative phrase and Zulu closes a noun
# phrase with one rather than opening it.
noun-regular-polygon =
    { $part ->
        [tail] esinezinhlangothi ezingu-{ $numSides }
       *[head] isakhiwo esilingene
    }

# The noun class, which is what a describing word agrees with. `c9` is the
# default and the class of every loanword.
noun-gender =
    { $noun ->
        [line] c3
        [ray] c3
        [function] c3
        [polyline] c3
        [border] c3
        [text] c3
        [circle] c7
        [region] c7
        [square] c7
        [cross] c7
        [line-segment] c7
        [polygon] c7
        [curve] c5
        [point] c5
        [diamond] c5
       *[other] c9
    }


## Style composition

# The dash pattern is a relative phrase of its own and closes the description,
# so it moves behind the colour rather than sitting between the width and it.
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
        [c3] ogcwalisiwe
        [c5] eligcwalisiwe
        [c7] esigcwalisiwe
       *[c9] egcwalisiwe
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kanye ne-{ $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } kanye ne-{ $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } kanye ne-{ $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «umngcele» is class 3, so the border's words agree with it and not with the
# shape it surrounds. Zulu has no article, and it joins a complement with the
# invariable «kanye no-» rather than with a concording relative, so all four
# branches read alike.
style-border-clause =
    { $parts ->
        [with-article] kanye nomngcele { $border }
        [and] kanye nomngcele { $border }
        [and-article] kanye nomngcele { $border }
       *[with] kanye nomngcele { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = akugcwalisiwe

style-text =
    { $parts ->
        [background] { $color } engemuva { $background }
       *[plain] { $color }
    }

style-background-none = lutho


## Boolean words

boolean-true = kuyiqiniso
boolean-false = akulona iqiniso


## Answer buttons

answer-submit-label = Hlola Umsebenzi
answer-submit-label-no-correctness = Thumela Impendulo


## Sectional blocks

section-name =
    .activity = Umsebenzi
    .aside = Ibuka Ngasese
    .cascade = Ukwehla
    .definition = Incazelo
    .example = Isibonelo
    .exercise = Umsebenzi Wokuzilolonga
    .exercises = Imisebenzi Yokuzilolonga
    .given-answer = Impendulo
    .note = Inothi
    .objectives = Izinhloso
    .paragraphs = Izigaba
    .part = Ingxenye
    .problem = Inkinga
    .problems = Izinkinga
    .proof = Ubufakazi
    .question = Umbuzo
    .section = Isigaba
    .solution = Isixazululo
    .task = Umsebenzi
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

hint-title = Isexwayiso


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

paginator-previous = Okwedlule
paginator-next = Okulandelayo
paginator-page = Ikhasi

paginator-page-status = { $pageLabel } { $currentPage } kwangu-{ $numPages }


## Piecewise functions

piecewise-condition-or = noma
piecewise-condition-if = uma
piecewise-condition-otherwise = kwenye indawo


## Chemistry

# Zulu is one of the catalogs that leaves `element-name` and
# `element-anion-name` out, so those 130 keys fall back to English. South
# African school chemistry is taught in English or Afrikaans, and the Zulu
# terminology projects that have named the elements disagree with one another
# and have not reached a classroom. Seeding either list would misreport the
# other, and the English a learner falls back to is the one printed in the
# textbook in front of them.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Uphawu Lwamakhemikhali Olungavumelekile
chemistry-invalid-ionic-compound = Inhlanganisela Ye-ayoni Engavumelekile
