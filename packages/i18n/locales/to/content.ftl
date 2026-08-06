# Tongan content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The fakauʻa «ʻ» is U+02BB and the toloi is the macron; see `chrome.ftl`.
#
# Tongan has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The adjectives **follow** the noun — «laine kulokula», a red line — so every
# composition message inverts the English order, as the other two Polynesian
# catalogs in this batch do.
#
# **The colour table is where Tongan does not fit English's twelve keys**, and
# it fails to fit in the way a great many Pacific languages do: «lanu» plus a
# thing of that colour is the productive pattern, so blue is «lanumoana», the
# colour of the deep sea, and green is «lanumata», the colour of raw or unripe
# growth. Those two are not translations of "blue" and "green" — they are the
# sea and the leaf, and the boundary between them falls where the sea meets the
# land rather than where English puts it. `.cyan` is the key with no answer at
# all: it lands inside «lanumoana» with nothing to distinguish it, and the
# transliteration written here is a placeholder a speaker should replace or
# delete. `.purple` and `.pink` are loans, which is what Tongan writing uses.
#
# The geometry vocabulary is a mixture: the shapes Tongan names itself
# («fuopotopoto», «tapatolu») are its own, and the terms schooling introduced
# are transliterations, because secondary mathematics in Tonga is taught in
# English.


## Style vocabulary

color =
    .black = ʻuliʻuli
    .white = hinehina
    .gray = efuefu
    .red = kulokula
    .orange = moli
    .yellow = engeenga
    .green = lanumata
    .cyan = saiane
    .blue = lanumoana
    .purple = vaioleti
    .pink = pingi
    .brown = melo

line-width =
    .thick = matolu
    .thin = manifinifi

line-style =
    .dashed = motumotu
    .dotted = tuʻitongi

# Noun phrases. Tongan marks no plural on the noun, so «laine» is the word for
# one line and for many alike.
fill-style =
    .horizontal = laine fakatokalalo
    .vertical = laine fakatuʻu
    .diagonal = laine fakahekeheke
    .backdiagonal = laine fakahekeheke fakafoki
    .dots = tongi
    .diamonds = taimane

noun =
    .line = laine
    .line-segment = konga laine
    .ray = huelo
    .vector = veketā
    .curve = pikopiko
    .function = ngāue fika
    .parabola = palapola
    .polyline = laine tuʻo lahi
    .polygon = polikoni
    .triangle = tapatolu
    .rectangle = tapafā loloa
    .circle = fuopotopoto
    .region = feituʻu
    .point = poini
    .square = sikuea
    .diamond = taimane
    .cross = kolosi
    .plus = tānaki

# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] ʻoku tapa { $numSides }
       *[head] polikoni tatau
    }

# One answer for every noun: Tongan has no grammatical gender.
noun-gender = neuter


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

# The noun first and the adjectives behind it, which is the opposite of English.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = fonu

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } mo e { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } mo e { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } mo e { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Tongan's article is «ha» for an indefinite and «e» for a definite, and neither
# is what English's "a" is doing here, so all four branches read alike but for
# the connective: «mo e» opens the first clause and «pea mo e» a further one.
style-border-clause =
    { $parts ->
        [with-article] mo e kapa { $border }
        [and] pea mo e kapa { $border }
        [and-article] pea mo e kapa { $border }
       *[with] mo e kapa { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = taʻefonu

style-text =
    { $parts ->
        [background] { $color } mo e tuʻunga { $background }
       *[plain] { $color }
    }

style-background-none = ʻikai ha taha


## Boolean words

boolean-true = moʻoni
boolean-false = loi


## Answer buttons

answer-submit-label = Sivi ʻa e ngāue
answer-submit-label-no-correctness = ʻAve ʻa e tali


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Tongan marks no plural on the noun.
section-name =
    .activity = Ngāue
    .aside = Fakamatala tafaʻaki
    .cascade = Kasikeiti
    .definition = Fakamatala
    .example = Fakatātā
    .exercise = Ngāue fakaako
    .exercises = Ngāue fakaako
    .given-answer = Tali
    .note = Nouti
    .objectives = Taumuʻa
    .paragraphs = Palakalafa
    .part = Konga
    .problem = Palopalema
    .problems = Palopalema
    .proof = Fakamoʻoni
    .question = Fehuʻi
    .section = Vahe
    .solution = Fakalelei
    .task = Ngāue
    .theorem = Tioleme

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Fakahinohino


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tēpile { $enumeration }
        [numbered-title] Tēpile { $enumeration }{ ": " }
        [unnumbered-title] Tēpile{ ": " }
       *[unnumbered] Tēpile
    }

figure-name =
    { $parts ->
        [numbered] Fakatātā { $enumeration }
        [numbered-caption] Fakatātā { $enumeration }{ ": " }
        [unnumbered-caption] Fakatātā{ ": " }
       *[unnumbered] Fakatātā
    }


## Paginator controls

paginator-previous = Kimuʻa
paginator-next = Hoko
paginator-page = Peesi

paginator-page-status = { $pageLabel } { $currentPage } ʻo e { $numPages }


## Piecewise functions

piecewise-condition-or = pe
piecewise-condition-if = kapau
piecewise-condition-otherwise = kapau ʻoku ʻikai


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Tonga teaches secondary science in English, and Tongan has no
## settled list of all 118 to seed from — the Samoan and Hawaiian case in
## `locales/sm` and `locales/haw`, and for the same reason: what exists is
## everyday vocabulary for the substances known long before the elements were,
## not a table.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Fakaʻilonga kemikale taʻetotonu
chemistry-invalid-ionic-compound = Fefiofi ʻaioniki taʻetotonu
