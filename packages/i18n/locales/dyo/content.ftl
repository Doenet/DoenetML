# Jola-Fonyi content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `dyo` is Jola-Fonyi (Diola-Fogny), an Atlantic language of the Niger-Congo
# family, Jola/Bak subgroup, spoken in the Casamance region of southern
# Senegal. `new Intl.Locale('dyo').maximize()` resolves to `dyo-Latn-SN`:
# Latin script, no surprises. `Intl.PluralRules("dyo").resolvedOptions()
# .pluralCategories` reports `["one", "other"]`.
#
# **`$gender` is a noun class**, the way it is for Temne (`locales/tem`), and
# for the same reason: Jola-Fonyi is a genuine Atlantic noun-class language,
# described in J. David Sapir's *A Grammar of Diola-Fogny* as having roughly
# fifteen classes, each with its own nasal/oral prefix on the noun and on
# every word agreeing with it (adjective, numeral, some verb agreement). This
# catalog uses four of them, the ones its own vocabulary actually needs, named
# here after their prefixes rather than after Sapir's letter codes:
#
#          ka-class      si-class      bu-class      fu-class
#   red     kanuux        sinuux        bunuux        funuux
#   thick   kaboorboor    siboorboor    buboorboor    fuboorboor
#   filled  kafees        sifees        bufees        fufees
#
# **That is the property worth having a catalog for**, the same one the
# Temne header points at: the class marking the noun and the class marking
# the word describing it are the *same syllable*, so `noun-gender` is
# checkable against `noun` by eye. `noun` below spells every entry's class
# prefix in writing — `bupoligɔn`, `fututi`, `silay si bare` — and
# `noun-gender`'s table assigns each the class its own written prefix
# carries. A reviewer who finds a mismatch has found a bug without needing
# to know Jola-Fonyi.
#
# `bu-` marks the closed, bounded plane shapes (polygon, triangle, rectangle,
# circle, square) — a natural class for solid, self-contained things. `fu-`
# marks the small or dimensionless ones (point, region, diamond, cross,
# plus) and is also where a head this catalog does not spell a noun for
# (`fill`, `text`) is assumed to sit, next to `border`, which does get a
# word: `funbaŋ` in `style-border-clause` carries `fu-` itself. `si-` is the
# plural class and marks `polyline`, which this catalog treats as "lines,
# several" (`silay si bare`) rather than as one thing. `ka-` is the default —
# the class a loanword joins, and what an author's own `markerStyleWord`
# gets, since the catalog has never seen it.
#
# This is closer to Temne's alliterative concord than to Wolof's
# determiner-marking (`locales/wo`): Wolof's class lives on the article
# beside the noun and never touches the adjective stem, so `$gender` goes
# unused there. Jola-Fonyi and Temne both put the class on the describing
# word itself, which is what makes either catalog checkable the way this
# comment describes. Where Jola-Fonyi differs from Temne is only in which
# concrete prefixes and how many classes are in play — the mechanism itself
# is the same typological choice, unsurprising in two Atlantic languages,
# and worth remarking precisely because Wolof, a third Atlantic language in
# this same repository, made the opposite one.
#
# `$role` goes unused: nothing here inflects for case.
#
# The mathematical nouns lean on French loans («fɔnksiyɔŋ», «poligɔn»,
# «rɛktaŋgal») because Senegalese schooling supplies that vocabulary, the
# same way `locales/wo`'s do. Where Jola-Fonyi has its own word it is used:
# «kalay» for line, «katut» for point.
#
# The 118 element names and 12 anion names in `element-name` and
# `element-anion-name` are deliberately absent, so those keys fall back to
# English and `lint:i18n` reports the gap. Secondary science in the
# Casamance, as elsewhere in Senegal, is taught in French out of
# French-language textbooks — the same reasoning `locales/wo`'s header gives
# for leaving its own chemistry tables out, and it applies here without
# adjustment: a Jola-Fonyi-speaking student meets the periodic table in
# French already, and this seed has no settled Jola-Fonyi list to reproduce.


## Style vocabulary

# The last eight attributes are French-derived loans, written bare with no
# class prefix — the same seam `locales/tem` leaves at its own eight English
# loans. The four inflected colors below supply all four classes, as does
# `line-width` and `style-filled-word`.
color =
    .black =
        { $gender ->
            [si] sisitup
            [bu] busitup
            [fu] fusitup
           *[ka] kasitup
        }
    .white =
        { $gender ->
            [si] siyoor
            [bu] buyoor
            [fu] fuyoor
           *[ka] kayoor
        }
    .gray =
        { $gender ->
            [si] sipusum
            [bu] bupusum
            [fu] fupusum
           *[ka] kapusum
        }
    .red =
        { $gender ->
            [si] sinuux
            [bu] bunuux
            [fu] funuux
           *[ka] kanuux
        }
    .orange = oranj
    .yellow = jonn
    .green = vɛr
    .cyan = siyan
    .blue = blɛ
    .purple = mov
    .pink = roz
    .brown = maron
line-width =
    .thick =
        { $gender ->
            [si] siboorboor
            [bu] buboorboor
            [fu] fuboorboor
           *[ka] kaboorboor
        }
    .thin =
        { $gender ->
            [si] sikenkeen
            [bu] bukenkeen
            [fu] fukenkeen
           *[ka] kakenkeen
        }
# Written as «ku …» phrases rather than as class-marked qualifiers, so that
# they take no concord and can close the description. `style-stroke` puts
# them last.
line-style =
    .dashed = ku sipatpati
    .dotted = ku sitoni
fill-style =
    .horizontal = silay si lëmp
    .vertical = silay si tell
    .diagonal = silay si jeeñ
    .backdiagonal = silay si jeeñ ku situp
    .dots = sitoni
    .diamonds = sidiyamɔn
# Every noun below carries its class prefix in writing, so `noun-gender`'s
# table can be read straight off this message. That is the property the
# header describes.
noun =
    .line = kalay
    .line-segment = kalay ka bʌt
    .ray = kare
    .vector = kavɛktɛr
    .curve = kalay ka kar
    .function = kafɔnksiyɔŋ
    .parabola = kaparabɔl
    .polyline = silay si bare
    .polygon = bupoligɔn
    .triangle = butriyaŋgal
    .rectangle = burɛktaŋgal
    .circle = busɛrkal
    .region = fuguy
    .point = fututi
    .square = bukare
    .diamond = fulosas
    .cross = fukurwa
    .plus = fumandarga plus
# The side count is a relative and closes the noun phrase behind the
# describing words, so it goes in the tail — mirroring the shape
# `noun-regular-polygon`'s own comment in `locales/en` asks for.
noun-regular-polygon =
    { $part ->
        [tail] bu am { $numSides } wet
       *[head] bupoligɔn bu yem
    }
# The noun class. Read it against `noun` above: each entry naming one of
# `noun`'s attributes takes the class that attribute's own written prefix
# carries, and `regular-polygon` takes `bu` because `noun-regular-polygon`'s
# head is «bupoligɔn». `fill` and `text` name phrase heads this catalog
# writes no word for and are assigned `fu` on trust, alongside `border`,
# which does get a word: «funbaŋ» in `style-border-clause` already carries
# `fu-`. `ka` is the default, the class a loanword or an author's own
# `markerStyleWord` joins.
noun-gender =
    { $noun ->
        [polyline] si
        [polygon] bu
        [regular-polygon] bu
        [triangle] bu
        [rectangle] bu
        [circle] bu
        [square] bu
        [region] fu
        [point] fu
        [diamond] fu
        [cross] fu
        [plus] fu
        [text] fu
        [fill] fu
        [border] fu
       *[other] ka
    }

## Style composition

# The dash pattern is a «ku …» phrase and closes the description, so it
# moves behind the colour rather than sitting between the width and it.
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
        [si] sifees
        [bu] bufees
        [fu] fufees
       *[ka] kafees
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ku { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ku { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ku { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «funbaŋ» is the border and leads its own describing words, so they agree
# with it rather than with the shape it surrounds — which is why `border`
# answers `fu` in `noun-gender`, matching that word's own `fu-`. Jola-Fonyi
# has no article here, and the clause is joined by the invariable «ku», so
# all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ku funbaŋ { $border }
        [and] ku funbaŋ { $border }
        [and-article] ku funbaŋ { $border }
       *[with] ku funbaŋ { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = fees arus
style-text =
    { $parts ->
        [background] { $color } ku kabaka { $background }
       *[plain] { $color }
    }
style-background-none = lëf

## Boolean words

boolean-true = yem
boolean-false = arus

## Answer buttons

answer-submit-label = Juut Lil
answer-submit-label-no-correctness = Lel Kalipi

## Sectional blocks

section-name =
    .activity = Lil
    .aside = Kapat ka Fen
    .cascade = Kaskad
    .definition = Kabat
    .example = Kamisal
    .exercise = Katampa
    .exercises = Sitampa
    .given-answer = Kalipi
    .note = Kasandi
    .objectives = Sijom
    .paragraphs = Sipat
    .part = Kapat
    .problem = Kakaañ
    .problems = Sikaañ
    .proof = Kayilaŋ
    .question = Kamootɔ
    .section = Kapat
    .solution = Solisiyɔŋ
    .task = Lil
    .theorem = Tiyorɛm
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Kasandi

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
        [numbered] Kamisal { $enumeration }
        [numbered-caption] Kamisal { $enumeration }{ ": " }
        [unnumbered-caption] Kamisal{ ": " }
       *[unnumbered] Kamisal
    }

## Paginator controls

paginator-previous = Ka paa
paginator-next = Ka taŋ
paginator-page = Kapej
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = mba
piecewise-condition-if = te
piecewise-condition-otherwise = ku sipeŋ

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all
## 130 keys fall back to English and `lint:i18n` reports the gap. See the
## header above for why: Senegalese secondary science, in the Casamance as
## elsewhere, is taught in French.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kamark ka Kimi ka Yem Arus
chemistry-invalid-ionic-compound = Katofi ka Ayɔn ka Yem Arus
