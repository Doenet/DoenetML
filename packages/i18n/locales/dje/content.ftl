# Zarma content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `dje` is Zarma (Zarmaciine), the largest Songhay variety and the most widely
# spoken language of Niger after Hausa. It is the second catalog here for a
# language of Niger, after `locales/kr` (Kanuri, whose range crosses eastern
# Niger) in #1685.
#
# **Songhay is the reason this catalog is here, and the reason is
# classificatory rather than morphological.** Every other language in these
# three batches but one is Niger-Congo — Bantu, Gur, Mande, Atlantic, Kwa,
# Benue-Congo — or an English-lexifier creole built on one. Songhay is not, and
# neither is the exception: `locales/kr`, which #1685 seeded as the one
# Nilo-Saharan catalog of its batch. Zarma's own affiliation is genuinely
# unsettled — often filed under Nilo-Saharan too, and just as often argued to
# be an isolate that borrowed heavily from Mande and Berber — so `locales/kr`
# is the only neighbour here under the same disputed label, and the two are not
# close.
#
# **`$gender` and `$role` both go unused.** Zarma has no noun class and no
# gender, and marks no case; a describing word follows its noun and never
# changes shape. So the catalog looks like `locales/men` or `locales/pcm` from
# the outside — and that is worth saying plainly, because the interesting fact
# about this file is *where it sits in the roster*, not what it does with
# `$gender`. A batch that only ever added forking catalogs would be selecting
# its languages for the argument rather than for the readers.
#
# **The negotiation entry is this file's real contribution**, and it is the
# shape `locales/mnk` introduced. `son` is the ISO 639-3 macrolanguage over the
# Songhay varieties; this repository now has a catalog for one *member* and
# none for the macrolanguage. #1686 recorded that `son` was deliberately not
# aliased, because `new Intl.Locale("son").maximize()` adds no region and CLDR
# therefore has no opinion about which variety a bare `son` means — the
# opposite of `man`, which maximizes to the Gambia and so decides for itself.
# That reasoning is unchanged by this catalog's arrival and the test still
# asserts it. What *is* new is that `dje` can now carry its sibling members —
# `ddn`, `khq`, `ses`, `twq` and the rest — the way `mnk` carries the other
# Manding varieties. See `negotiate.ts`.
#
# Zarma writes in the official Nigerien Latin orthography. The one letter in it
# outside ASCII is «ŋ», which is common — «kaŋ», «ŋwaarey», «duyaŋ» — while «ɲ»
# and the open vowels «ɛ» and «ɔ» happen not to occur anywhere in these four
# files, so a reviewer editing them will type plain ASCII almost throughout.
# Colour terms are few — «bi» black, «kwaaray» white, «ciray» red
# — and the rest are French, which is where a Zarma speaker meets them.
#
# The geometry leans on those French loans; where Zarma has its own word it is
# used — «nangu» a place, «alaama» a sign. They are the first thing to check.


## Style vocabulary

color =
    .black = bi
    .white = kwaaray
    .gray = boosu
    .red = ciray
    .orange = oranji
    .yellow = jooni
    .green = veer
    .cyan = siyaŋ
    .blue = bulu
    .purple = violee
    .pink = roozu
    .brown = maroŋ

line-width =
    .thick = beeri
    .thin = kayna

# Written as «nda …» phrases rather than as bare qualifiers, so that they close
# the description. `style-stroke` puts them last.
line-style =
    .dashed = nda dumbu-dumbu
    .dotted = nda alaama-alaama

fill-style =
    .horizontal = kar-yaŋ kaŋ ga kani
    .vertical = kar-yaŋ kaŋ ga kay
    .diagonal = kar-yaŋ kaŋ ga daŋ banda
    .backdiagonal = kar-yaŋ kaŋ ga daŋ banda kambu fo ra
    .dots = alaama-yaŋ
    .diamonds = diyaman-yaŋ

noun =
    .line = kar
    .line-segment = kar dumbu
    .ray = hayni
    .vector = vekteer
    .curve = kar kaŋ ga gungum
    .function = fonksiyon
    .parabola = parabol
    .polyline = kar dumbu boobo
    .polygon = poligon
    .triangle = triyangul
    .rectangle = rektangul
    .circle = windi
    .region = nangu
    .point = alaama
    .square = kaare
    .diamond = diyaman
    .cross = gurumey
    .plus = tontoni alaama

# The side count is a relative and closes the noun phrase behind the describing
# words, so it goes in the tail.
noun-regular-polygon =
    { $part ->
        [tail] kaŋ gonda kambu { $numSides }
       *[head] poligon saawa
    }

# Zarma has no noun class and no gender, so every noun answers the same and the
# answer goes unused — the shape `locales/en`, `locales/men` and `locales/pcm`
# have.
noun-gender = afo


## Style composition

# The dash pattern is a «nda …» phrase and closes the description, so it moves
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

style-filled-word = toonante

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } nda { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } nda { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } nda { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «hirri» is the border and leads its own describing words. Zarma has no
# article and joins this clause with the invariable «nda», so all four branches
# read alike.
style-border-clause =
    { $parts ->
        [with-article] nda hirri { $border }
        [and] nda hirri { $border }
        [and-article] nda hirri { $border }
       *[with] nda hirri { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = mana too

style-text =
    { $parts ->
        [background] { $color } nda banda { $background }
       *[plain] { $color }
    }

style-background-none = hay kulu si


## Boolean words

boolean-true = cimi
boolean-false = tangari


## Answer buttons

answer-submit-label = Guna Goyo
answer-submit-label-no-correctness = Samba Tuuruyaŋ


## Sectional blocks

section-name =
    .activity = Goy
    .aside = Sanni fo
    .cascade = Kaskad
    .definition = Feerijandi
    .example = Misal
    .exercise = Dooni
    .exercises = Dooni-yaŋ
    .given-answer = Tuuruyaŋ
    .note = Hantum
    .objectives = Miila-yaŋ
    .paragraphs = Dumbu-yaŋ
    .part = Dumbu
    .problem = Taabi
    .problems = Taabi-yaŋ
    .proof = Seeda
    .question = Hã
    .section = Dumbu
    .solution = Feeriji
    .task = Goy
    .theorem = Teorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Faada


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tablo { $enumeration }
        [numbered-title] Tablo { $enumeration }{ ": " }
        [unnumbered-title] Tablo{ ": " }
       *[unnumbered] Tablo
    }

figure-name =
    { $parts ->
        [numbered] Biiyaŋ { $enumeration }
        [numbered-caption] Biiyaŋ { $enumeration }{ ": " }
        [unnumbered-caption] Biiyaŋ{ ": " }
       *[unnumbered] Biiyaŋ
    }


## Paginator controls

paginator-previous = Kaŋ bisa
paginator-next = Kaŋ ga kaa

paginator-page = Moo

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = wala

piecewise-condition-if = da

piecewise-condition-otherwise = hari fo kulu ra


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Niger teaches secondary science in French, so a
## Zarma speaker meets the periodic table there and neither Zarma nor English
## is the curriculum — the same answer `locales/kr` gives from the same
## ministry, and `locales/kg`, `locales/fon` and `locales/kbp` from theirs.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simi Alaama Kaŋ Si Boori
chemistry-invalid-ionic-compound = Iyon Margayaŋ Kaŋ Si Boori
