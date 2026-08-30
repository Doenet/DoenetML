# Kashubian (kaszëbsczi) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard Kashubian alphabet; see `chrome.ftl` for the
# note on «ã», «ë», «é», «ò», «ó», «ô» and «ù» — «ë» is the szwa and «ò»/«ù»
# mark the diphthongal onset — and for why this file is not `locales/pl` and
# must not be edited toward it («nié», «òdpòwiésc», «bëlno», «jinaczi»,
# «kaszëbsczi»). German is the second contact language, which is where «ôrt»
# and «fela» come from.
#
# Kashubian inflects for gender *and* for case, so every adjective below
# selects on `$role` first — which position the words are going into — and then
# on `$gender` where the answer still depends on one, as `locales/pl`,
# `locales/cs`, `locales/szl` and the two Sorbian catalogs do:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-i`/`-y` m, `-ô` f, `-é` n
#   border-clause       instrumental after «z», of «rant» — masculine: `-im`/
#                       `-ym`, and the noun itself takes the Kashubian
#                       instrumental singular «-ã»: «z czôrnym rantã»
#   background-clause   locative after «na», of «tło» — neuter: `-im`/`-ym`
#   text-clause         nominative masculine, agreeing with «tekst»
#
# The instrumental masculine and the locative neuter fall together in the
# adjective, so the two clause branches read alike here and are still written
# out separately: they are two positions, and a later correction to one of them
# should not silently move the other.
#
# The genders of the four unnamed heads: `border` = «rant», **m**; `fill` =
# «wëpełnienié», **n**; `text` = «tekst», **m**; `background` = «tło», **n**.
# Both neuters are listed in `noun-gender` below.
#
# Adjectives precede their noun, as in English.
#
# **Number.** CLDR has no plural rules for `csb`, so no `zero`, `two`, `few` or
# `many` branch appears anywhere in this file; see `chrome.ftl` for the whole
# note. Every symbolic selector — `$role`, `$gender`, `$parts`, `$part` — is
# kept byte for byte from English, keys included.
#
# **The periodic table is left to fall back to English.** Secondary science in
# Pomerania is taught in Polish out of Polish textbooks, so the table a
# Kashubian speaker meets is `locales/pl`'s. That is a fact about a school
# system rather than about the language.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] czôrnym
            [background-clause] czôrnym
            [text-clause] czôrny
           *[standalone]
                { $gender ->
                    [f] czôrnô
                    [n] czôrné
                   *[m] czôrny
                }
        }
    .white =
        { $role ->
            [border-clause] biôłim
            [background-clause] biôłim
            [text-clause] biôłi
           *[standalone]
                { $gender ->
                    [f] biôłô
                    [n] biôłé
                   *[m] biôłi
                }
        }
    .gray =
        { $role ->
            [border-clause] szarim
            [background-clause] szarim
            [text-clause] szari
           *[standalone]
                { $gender ->
                    [f] szarô
                    [n] szaré
                   *[m] szari
                }
        }
    .red =
        { $role ->
            [border-clause] czerwionym
            [background-clause] czerwionym
            [text-clause] czerwiony
           *[standalone]
                { $gender ->
                    [f] czerwionô
                    [n] czerwioné
                   *[m] czerwiony
                }
        }
    .orange =
        { $role ->
            [border-clause] pòmarańczowim
            [background-clause] pòmarańczowim
            [text-clause] pòmarańczowi
           *[standalone]
                { $gender ->
                    [f] pòmarańczowô
                    [n] pòmarańczowé
                   *[m] pòmarańczowi
                }
        }
    .yellow =
        { $role ->
            [border-clause] żôłtim
            [background-clause] żôłtim
            [text-clause] żôłti
           *[standalone]
                { $gender ->
                    [f] żôłtô
                    [n] żôłté
                   *[m] żôłti
                }
        }
    .green =
        { $role ->
            [border-clause] zelonym
            [background-clause] zelonym
            [text-clause] zelony
           *[standalone]
                { $gender ->
                    [f] zelonô
                    [n] zeloné
                   *[m] zelony
                }
        }
    .cyan =
        { $role ->
            [border-clause] cyjanowim
            [background-clause] cyjanowim
            [text-clause] cyjanowi
           *[standalone]
                { $gender ->
                    [f] cyjanowô
                    [n] cyjanowé
                   *[m] cyjanowi
                }
        }
    .blue =
        { $role ->
            [border-clause] mòdrim
            [background-clause] mòdrim
            [text-clause] mòdri
           *[standalone]
                { $gender ->
                    [f] mòdrô
                    [n] mòdré
                   *[m] mòdri
                }
        }
    .purple =
        { $role ->
            [border-clause] pùrpùrowim
            [background-clause] pùrpùrowim
            [text-clause] pùrpùrowi
           *[standalone]
                { $gender ->
                    [f] pùrpùrowô
                    [n] pùrpùrowé
                   *[m] pùrpùrowi
                }
        }
    .pink =
        { $role ->
            [border-clause] różewim
            [background-clause] różewim
            [text-clause] różewi
           *[standalone]
                { $gender ->
                    [f] różewô
                    [n] różewé
                   *[m] różewi
                }
        }
    .brown =
        { $role ->
            [border-clause] brunatnym
            [background-clause] brunatnym
            [text-clause] brunatny
           *[standalone]
                { $gender ->
                    [f] brunatnô
                    [n] brunatné
                   *[m] brunatny
                }
        }
line-width =
    .thick =
        { $role ->
            [border-clause] grubim
            [background-clause] grubim
            [text-clause] gruby
           *[standalone]
                { $gender ->
                    [f] grubô
                    [n] grubé
                   *[m] gruby
                }
        }
    .thin =
        { $role ->
            [border-clause] cenczim
            [background-clause] cenczim
            [text-clause] cenczi
           *[standalone]
                { $gender ->
                    [f] cenkô
                    [n] cenczé
                   *[m] cenczi
                }
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] kreskòwónym
            [background-clause] kreskòwónym
            [text-clause] kreskòwóny
           *[standalone]
                { $gender ->
                    [f] kreskòwónô
                    [n] kreskòwóné
                   *[m] kreskòwóny
                }
        }
    .dotted =
        { $role ->
            [border-clause] kropkòwónym
            [background-clause] kropkòwónym
            [text-clause] kropkòwóny
           *[standalone]
                { $gender ->
                    [f] kropkòwónô
                    [n] kropkòwóné
                   *[m] kropkòwóny
                }
        }
fill-style =
    .horizontal = pòzemné linie
    .vertical = pionowé linie
    .diagonal = ùkòsné linie
    .backdiagonal = òdwrotno ùkòsné linie
    .dots = kropczi
    .diamonds = rombë
noun =
    .line = linia
    .line-segment = òdcynk
    .ray = półprostô
    .vector = wektor
    .curve = krzëwô
    .function = fùnkcjô
    .slope-field = pòle nachileniô
    .vector-field = wektorowé pòle
    .parabola = parabòla
    .polyline = łamónô
    .polygon = wielobòk
    .triangle = trójkąt
    .rectangle = prostokąt
    .circle = kòło
    .region = òbszôr
    .point = pùnkt
    .square = kwadrat
    .diamond = romb
    .cross = krziż
    .plus = plus
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with: «gruby czerwiony regularny wielobòk ò 5
# bòkach».
noun-regular-polygon =
    { $part ->
        [tail] ò { $numSides } bòkach
       *[head] regularny wielobòk
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (wielobòk, m) or
# the head of a phrase the description never names: `border` (rant, m), `fill`
# (wëpełnienié, n), `text` (tekst, m), `background` (tło, n).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] n
        [slope-field] n
        [vector-field] n
        [fill] n
        [background] n
       *[other] m
    }

## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $lineStyle } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] wëpełnionô
        [n] wëpełnioné
       *[m] wëpełniony
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } z { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } z { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } z { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «z» governs the instrumental, which the `border-clause` branch of every
# adjective supplies, and «rant» itself takes the Kashubian instrumental
# singular «-ã». Kashubian has no article, so the `-article` branches read the
# same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] z { $border } rantã
        [and] a z { $border } rantã
        [and-article] a z { $border } rantã
       *[with] z { $border } rantã
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = niewëpełniony
style-text =
    { $parts ->
        [background] { $color } na { $background } tle
       *[plain] { $color }
    }
style-background-none = żóden

## Boolean words

boolean-true = prôwda
boolean-false = nieprôwda

## Answer buttons

answer-submit-label = Sprôwdzë robòtã
answer-submit-label-no-correctness = Wëslë òdpòwiésc

## Sectional blocks

section-name =
    .activity = Aktiwnosc
    .aside = Bòcznô nota
    .cascade = Kaskada
    .definition = Definicjô
    .example = Przikłôd
    .exercise = Cwiczenié
    .exercises = Cwiczenia
    .given-answer = Òdpòwiésc
    .note = Nota
    .objectives = Célë
    .paragraphs = Akapitë
    .part = Dzél
    .problem = Zadanié
    .problems = Zadania
    .proof = Dowòd
    .question = Pëtanié
    .section = Rozdzél
    .solution = Rozwiązanié
    .task = Robòta
    .theorem = Twierdzenié
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Rada

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabela { $enumeration }
        [numbered-title] Tabela { $enumeration }{ ": " }
        [unnumbered-title] Tabela{ ": " }
       *[unnumbered] Tabela
    }
figure-name =
    { $parts ->
        [numbered] Òbrôzk { $enumeration }
        [numbered-caption] Òbrôzk { $enumeration }{ ": " }
        [unnumbered-caption] Òbrôzk{ ": " }
       *[unnumbered] Òbrôzk
    }

## Paginator controls

paginator-previous = Nazôd
paginator-next = Dali
paginator-page = Strona
paginator-page-status = { $pageLabel } { $currentPage } z { $numPages }

## Piecewise functions

piecewise-condition-or = abò
piecewise-condition-if = jeżlë
piecewise-condition-otherwise = jinaczi

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Secondary science in Pomerania is taught in Polish out of Polish textbooks,
## so the periodic table a Kashubian speaker meets is `locales/pl`'s. That is a
## fact about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Lëchi chemiczny symbòl
chemistry-invalid-ionic-compound = Lëchi jonowi związk

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = lëka
math-embedded-input-blank-ordinal = lëka { $ordinal } z { $total }
