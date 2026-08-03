# Xhosa content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Xhosa reads `$gender` as the noun **class**, the way `locales/zu` and
# `locales/sw` do, and it takes the same two concord sets Zulu takes:
#
#   adjective concord (-khulu, -ncinci)   c3 om-  c5 eli-  c6 ama-  c7 esi-  c9 en-
#   relative concord (the colours, -zalisiweyo)  c3 o-  c5 eli-  c6 a-  c7 esi-  c9 e-
#
# `locales/zu` is the closest thing to a parallel text for this file, the way
# `locales/hi` is for Urdu, and a correction to one is usually a correction to
# both — but the vocabulary is not shared, and neither is the class a given
# noun lands in: «isangqa» is class 7 here where Zulu's «isiyingi» is too, but
# «ummandla» is class 3 where Zulu's «isifunda» is class 7. That is why these
# are two catalogs and not one with a spelling table over it.
#
# `c9` is the default and the class a loanword joins. Describing words follow
# the noun, and `$role` goes unused: Xhosa marks no case.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] omnyama
            [c5] elimnyama
            [c6] amnyama
            [c7] esimnyama
           *[c9] emnyama
        }
    .white =
        { $gender ->
            [c3] omhlophe
            [c5] elimhlophe
            [c6] amhlophe
            [c7] esimhlophe
           *[c9] emhlophe
        }
    .gray =
        { $gender ->
            [c3] ongwevu
            [c5] elingwevu
            [c6] angwevu
            [c7] esingwevu
           *[c9] engwevu
        }
    .red =
        { $gender ->
            [c3] obomvu
            [c5] elibomvu
            [c6] abomvu
            [c7] esibomvu
           *[c9] ebomvu
        }
    .orange =
        { $gender ->
            [c3] o-orenji
            [c5] eli-orenji
            [c6] a-orenji
            [c7] esi-orenji
           *[c9] e-orenji
        }
    .yellow =
        { $gender ->
            [c3] otyheli
            [c5] elityheli
            [c6] atyheli
            [c7] esityheli
           *[c9] etyheli
        }
    .green =
        { $gender ->
            [c3] oluhlaza okwengca
            [c5] eliluhlaza okwengca
            [c6] aluhlaza okwengca
            [c7] esiluhlaza okwengca
           *[c9] eluhlaza okwengca
        }
    .cyan =
        { $gender ->
            [c3] osayeni
            [c5] elisayeni
            [c6] asayeni
            [c7] esisayeni
           *[c9] esayeni
        }
    .blue =
        { $gender ->
            [c3] oluhlaza okwesibhakabhaka
            [c5] eliluhlaza okwesibhakabhaka
            [c6] aluhlaza okwesibhakabhaka
            [c7] esiluhlaza okwesibhakabhaka
           *[c9] eluhlaza okwesibhakabhaka
        }
    .purple =
        { $gender ->
            [c3] omfusa
            [c5] elimfusa
            [c6] amfusa
            [c7] esimfusa
           *[c9] emfusa
        }
    .pink =
        { $gender ->
            [c3] opinki
            [c5] elipinki
            [c6] apinki
            [c7] esipinki
           *[c9] epinki
        }
    .brown =
        { $gender ->
            [c3] ontsundu
            [c5] elintsundu
            [c6] antsundu
            [c7] esintsundu
           *[c9] entsundu
        }

# These two are true adjectives and take the adjective concord, not the
# relative one the colours take.
line-width =
    .thick =
        { $gender ->
            [c3] omkhulu
            [c5] elikhulu
            [c6] amakhulu
            [c7] esikhulu
           *[c9] enkulu
        }
    .thin =
        { $gender ->
            [c3] omncinci
            [c5] elincinci
            [c6] amancinci
            [c7] esincinci
           *[c9] encinci
        }

# Written as an invariable "having …" phrase rather than as a describing word,
# so that it agrees with nothing and can close the phrase. `style-stroke` puts
# it last for that reason.
line-style =
    .dashed = onemigcana
    .dotted = onamachokoza

fill-style =
    .horizontal = imigca ethe tyaba
    .vertical = imigca emileyo
    .diagonal = imigca ejikelezileyo
    .backdiagonal = imigca ejikelezileyo ngokuchasene
    .dots = amachokoza
    .diamonds = amadayimani

noun =
    .line = umgca
    .line-segment = isiqwenga somgca
    .ray = umtha
    .vector = ivektha
    .curve = ijika
    .function = umsebenzi
    .parabola = iparabhola
    .polyline = umgca onamacandelo
    .polygon = isakhelo esinamacala amaninzi
    .triangle = unxantathu
    .rectangle = uxande
    .circle = isangqa
    .region = ummandla
    .point = inqaku
    .square = isikwere
    .diamond = idayimani
    .cross = umnqamlezo
    .plus = uphawu lokudibanisa

# The side count goes in the tail, behind the describing words: Xhosa closes a
# noun phrase with a relative clause rather than opening one with it.
noun-regular-polygon =
    { $part ->
        [tail] esinamacala angu-{ $numSides }
       *[head] isakhelo esilinganayo
    }

noun-gender =
    { $noun ->
        [line] c3
        [ray] c3
        [function] c3
        [polyline] c3
        [region] c3
        [cross] c3
        [border] c3
        [text] c3
        [circle] c7
        [square] c7
        [line-segment] c7
        [polygon] c7
        [curve] c5
        [point] c5
        [diamond] c5
       *[other] c9
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
        [c3] ozalisiweyo
        [c5] elizalisiweyo
        [c6] azalisiweyo
        [c7] esizalisiweyo
       *[c9] ezalisiweyo
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kunye ne-{ $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } kunye ne-{ $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } kunye ne-{ $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «umda» is class 3, so the border's words agree with it and not with the shape
# it surrounds. Xhosa has no article and joins a complement with the invariable
# «kunye no-», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] kunye nomda { $border }
        [and] kunye nomda { $border }
        [and-article] kunye nomda { $border }
       *[with] kunye nomda { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = akuzaliswanga

style-text =
    { $parts ->
        [background] { $color } kumva { $background }
       *[plain] { $color }
    }

style-background-none = akukho


## Boolean words

boolean-true = inyaniso
boolean-false = ubuxoki


## Answer buttons

answer-submit-label = Jonga Umsebenzi
answer-submit-label-no-correctness = Ngenisa Impendulo


## Sectional blocks

section-name =
    .activity = Umsebenzi
    .aside = Icala
    .cascade = Ukwehla
    .definition = Inkcazelo
    .example = Umzekelo
    .exercise = Uqheliselo
    .exercises = Uqheliselo
    .given-answer = Impendulo
    .note = Inqaku
    .objectives = Iinjongo
    .paragraphs = Imihlathi
    .part = Inxalenye
    .problem = Ingxaki
    .problems = Iingxaki
    .proof = Ubungqina
    .question = Umbuzo
    .section = Icandelo
    .solution = Isisombululo
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

hint-title = Icebiso


## Tables and figures

table-name =
    { $parts ->
        [numbered] Itheyibhile { $enumeration }
        [numbered-title] Itheyibhile { $enumeration }{ ": " }
        [unnumbered-title] Itheyibhile{ ": " }
       *[unnumbered] Itheyibhile
    }

figure-name =
    { $parts ->
        [numbered] Umfanekiso { $enumeration }
        [numbered-caption] Umfanekiso { $enumeration }{ ": " }
        [unnumbered-caption] Umfanekiso{ ": " }
       *[unnumbered] Umfanekiso
    }


## Paginator controls

paginator-previous = Ephelileyo
paginator-next = Elandelayo
paginator-page = Iphepha

paginator-page-status = { $pageLabel } { $currentPage } kwangama-{ $numPages }


## Piecewise functions

piecewise-condition-or = okanye
piecewise-condition-if = ukuba
piecewise-condition-otherwise = ngaphandle koko


## Chemistry

# Xhosa is one of the catalogs that leaves `element-name` and
# `element-anion-name` out, so those 130 keys fall back to English, for the
# same reason `locales/zu` does: South African school chemistry is taught in
# English or Afrikaans, and no Xhosa list of the elements has reached a
# classroom to seed from.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Uphawu Lweekhemikhali Olungasebenziyo
chemistry-invalid-ionic-compound = Umxube Weayoni Ongasebenziyo
