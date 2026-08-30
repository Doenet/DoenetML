# Northern Kurdish (Kurmanji) content catalog: the prose the core computes
# into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# This is **Northern Kurdish (Kurmanji) in the Hawar Latin alphabet**, which is
# the orthography Kurmanji publishing uses in Turkey, in Syria and across the
# diaspora, and it is what CLDR fills a bare `ku` in as: `ku` maximizes to
# `ku-Latn-TR`, and `Intl.DisplayNames` renders the endonym «kurdî
# (kurmancî)». So this catalog is **left to right**, and the letters here are
# the twenty-two consonants and nine vowels of Hawar — `ê`, `î`, `û`, `ç`, `ş`
# are letters of the alphabet and not decorated Latin ones.
#
# **Why the directory is `kmr` and not `ku`.** `ku` is the ISO 639-3
# **macrolanguage** over Northern Kurdish (`kmr`), Central Kurdish (`ckb`) and
# Southern Kurdish (`sdh`), and Central Kurdish has a catalog of its own in
# `locales/ckb`. A directory named for the macrolanguage would claim to cover a
# sibling it cannot serve, so this one is named for the individual language
# actually written in it. Nothing is lost to a reader who types the old tag:
# ICU canonicalizes `kmr` straight back onto `ku`, so `negotiate.ts` carries
# `ku: "kmr"` in `LANGUAGE_ALIASES` and **both tags reach this catalog**. A
# document that says `lang="ku"` keeps working exactly as before; one that says
# `lang="kmr"` now says precisely what it means. Southern Kurdish (`sdh`) has
# no catalog, and folds onto this one through `MACROLANGUAGE_MEMBERS`.
#
# **A reader arriving under `ku-Arab` reaches this catalog and gets Latin.**
# That is the same script asymmetry `locales/pa`, `locales/sr` and `locales/ha`
# already have, and the answer to it is a second catalog beside this one rather
# than a rename of this one. **Central Kurdish (Sorani) is `locales/ckb`**, a
# separate right-to-left catalog seeded alongside this one; `negotiate.ts`
# keeps the two apart, and nothing here serves a Sorani reader.
#
# Kurmanji counts in two plural categories, `one` and `other`. Nothing in this
# file selects on a count.
#
# **Kurmanji has grammatical gender, and this is the one catalog in its batch
# that forks on it — but not where a reader of `locales/fr` would expect.**
# A Kurmanji attributive adjective does not itself inflect: «sor», «stûr»,
# «reş» are the same word after a masculine noun and after a feminine one. What
# carries the agreement is the **ezafe**, the linking vowel between the noun and
# what describes it — `-ê` after a masculine singular, `-a` after a feminine
# singular, `-ên` in the plural — and a chain of adjectives repeats it on each
# one after the first: «xaniyê mezin ê spî».
#
# So the colour, width and dash tables below fork nowhere, and the composition
# messages fork everywhere. That is the opposite shape from French, and it is
# the reason Kurmanji is in this batch.
#
# **The ezafe cannot be welded to a placeable, and that decided the design of
# this file.** The bound ezafe attaches to the *noun*; in `style-with-noun` and
# `style-filled-with-noun` the noun arrives as `{ $noun }`, a value this
# catalog never sees, and its vowel depends both on that noun's gender and on
# whether it ends in a vowel (an epenthetic `y` appears: «xanî» → «xaniyê»).
# Worse, `attachNoun` in `styleDescriptions.ts` passes `style-with-noun` no
# `$gender` at all — it passes `parts`, `description`, `noun`, `nounTail` and
# `role` — so even the gender fork is unavailable in the one message that most
# needs it.
#
# The way out is the README's fifth one, *prefer the free allomorph over the
# bound one*: Kurmanji's ezafe also exists as the free-standing particle
# «yê» / «ya» / «yên», which is what stands between a noun and a following
# adjective in the northern (Behdinî) pattern and what links every adjective
# after the first in the standard one. So **every describing phrase this
# catalog builds leads with that free particle, and the particle is written
# inside the message that knows the gender** — `style-stroke`, `style-filled`,
# `style-filled-with-noun` — rather than beside the noun that does not.
# `style-with-noun` then simply places `{ $noun }` in front of a phrase that
# already agrees, and needs no fork of its own. This is the same move
# `locales/quc` makes with «rech» and `locales/ceb` with «nga», and it is
# where this seed is deliberately stiff: standard written Kurmanji would bind
# the first ezafe to the noun («xêza stûr a sor»), and this catalog writes it
# free («xêz ya stûr ya sor»). A speaker should read that as a known compromise
# rather than as a mistake, and the fix is a change to `styleDescriptions.ts` —
# passing the noun *key* rather than only the rendered word — not a change to
# the strings.
#
# Two smaller consequences of the same constraint, recorded so they are not
# "fixed" into something worse:
#
#   * The particle is written **«yê» / «ya» / «yên» with the `y` throughout**,
#     never the bare «ê» / «a» / «ên». Which of the two a printed text uses is
#     decided by the sound of the word in front, and beside a placeable there
#     is no word to look at. One shape everywhere is findable; a scatter is not.
#   * `style-unfilled` is rendered with no arguments (`describeFill` hands it
#     none), so it cannot select on `$gender` and is written flat, as every
#     agreeing catalog in the roster does. «nedagirtî» does not inflect anyway,
#     so nothing is lost here — unlike in `locales/ce`, where the flat form is
#     a real compromise.
#
# `$role` goes unused. Kurmanji marks an oblique case, but it marks it on the
# noun and on the ezafe, never on the adjective, and every position these
# phrases land in is one this catalog writes the noun for itself.
#
# **`noun-gender`'s table is the least certain thing in this file.** The gender
# of the everyday nouns — «xêz», «xal», «bazine», «herêm» — this seed is
# confident of; the gender of the loanwords and coinages it is not, and
# Kurmanji assigns gender to a loanword unpredictably. «parabol»,
# «fonksiyon», «vektor», «almas», «xaç» and «nîşana komê» are the entries a
# speaker should check first. Anything not listed falls to `m`.


## Style vocabulary
##
## Not one word here forks. A Kurmanji attributive adjective is invariable; the
## agreement is in the ezafe, which lives in the composition messages below.

# «şîn» historically covered both blue and green, and «kesk» is the modern
# green; cyan has no settled Kurmanji word, so «firûzeyî» — turquoise — is
# written for it. That is a colour boundary the style pipeline splits where the
# language does not, and a speaker may well prefer «şîna vekirî».
color =
    .black = reş
    .white = spî
    .gray = gewr
    .red = sor
    .orange = pirteqalî
    .yellow = zer
    .green = kesk
    .cyan = firûzeyî
    .blue = şîn
    .purple = mor
    .pink = pembe
    .brown = qehweyî
line-width =
    .thick = stûr
    .thin = zirav
line-style =
    .dashed = qutbirr
    .dotted = xalxalî
# Noun phrases, and the only place in this catalog where a word's position is
# fixed enough to inflect it in advance: all four uses of a fill pattern stand
# behind «bi», so these are written as they are wanted there. «xêzên …» carries
# its own plural ezafe and is already right after a preposition; «xal» and
# «almas» have no ezafe to carry it, so they are written in the oblique plural.
# That is the `locales/kab` move — make the position uniform, then one written
# form is right in all of them.
fill-style =
    .horizontal = xêzên asoyî
    .vertical = xêzên stûnî
    .diagonal = xêzên çeprast
    .backdiagonal = xêzên çeprast ên berevajî
    .dots = xalan
    .diamonds = almasan
noun =
    .line = xêz
    .line-segment = parçeyê xêzê
    .ray = tîrêj
    .vector = vektor
    .curve = xêza xwar
    .function = fonksiyon
    .slope-field = qada hêlan
    .vector-field = qada vektoran
    .parabola = parabol
    .polyline = xêza şikestî
    .polygon = pirgoşe
    .triangle = sêgoşe
    .rectangle = rastgoşe
    .circle = bazine
    .region = herêm
    .point = xal
    .square = çargoşe
    .diamond = almas
    .cross = xaç
    .plus = nîşana komê
# Kurmanji builds the word from the side count in front of the noun — «5-goşeyê
# birêk», a regular 5-gon — so the whole of it is one head and there is no
# tail. The suffix welded to `{ $numSides }` has one shape whatever number
# lands there, which is what makes the weld safe.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-goşeyê birêk
    }
# The gender of the noun being described, which decides the ezafe particle the
# composition messages write. Only the entries this seed is reasonably
# confident of are listed; everything else falls to `m`. See the note at the
# top of this file — this table is the first thing a speaker should check.
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [polyline] f
        [circle] f
        [region] f
        [point] f
        [cross] f
        [parabola] f
        [function] f
        [slope-field] f
        [vector-field] f
        [plus] f
        [border] f
        [fill] f
        [text] f
        [background] f
       *[other] m
    }

## Style composition

# The free ezafe particle leads the phrase and repeats before each further
# adjective, so that the whole description already agrees with the noun by the
# time `style-with-noun` puts a noun in front of it. Standing on its own — as
# `borderStyleDescription` reports it — the same string reads as a nominalized
# phrase, «yê stûr yê sor», "the thick red one", which is the right citation
# form for a state variable.
style-stroke =
    { $parts ->
        [width-style-color]
            { $gender ->
                [f] ya { $width } ya { $lineStyle } ya { $color }
               *[m] yê { $width } yê { $lineStyle } yê { $color }
            }
        [width-color]
            { $gender ->
                [f] ya { $width } ya { $color }
               *[m] yê { $width } yê { $color }
            }
        [style-color]
            { $gender ->
                [f] ya { $lineStyle } ya { $color }
               *[m] yê { $lineStyle } yê { $color }
            }
        [width-style]
            { $gender ->
                [f] ya { $width } ya { $lineStyle }
               *[m] yê { $width } yê { $lineStyle }
            }
        [width]
            { $gender ->
                [f] ya { $width }
               *[m] yê { $width }
            }
        [style]
            { $gender ->
                [f] ya { $lineStyle }
               *[m] yê { $lineStyle }
            }
       *[color]
            { $gender ->
                [f] ya { $color }
               *[m] yê { $color }
            }
    }
# The one composition message that is handed no `$gender`, and the reason the
# particle is written upstream instead of here: the noun leads and the phrase
# behind it has already agreed with it.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
# «dagirtî» is a past participle and does not inflect for gender in Kurmanji,
# so this word is flat where `locales/fr` and `locales/ce` fork it. The
# agreement it would carry elsewhere is in the particle beside it.
style-filled-word = dagirtî
style-filled =
    { $parts ->
        [pattern]
            { $gender ->
                [f] ya { $filled } ya { $color } bi { $pattern }
               *[m] yê { $filled } yê { $color } bi { $pattern }
            }
       *[plain]
            { $gender ->
                [f] ya { $filled } ya { $color }
               *[m] yê { $filled } yê { $color }
            }
    }
style-filled-with-noun =
    { $parts ->
        [pattern]
            { $gender ->
                [f] { $noun } ya { $filled } ya { $color } bi { $pattern }
               *[m] { $noun } yê { $filled } yê { $color } bi { $pattern }
            }
        [plain-tail]
            { $gender ->
                [f] { $noun } { $nounTail } ya { $filled } ya { $color }
               *[m] { $noun } { $nounTail } yê { $filled } yê { $color }
            }
        [pattern-tail]
            { $gender ->
                [f] { $noun } { $nounTail } ya { $filled } ya { $color } bi { $pattern }
               *[m] { $noun } { $nounTail } yê { $filled } yê { $color } bi { $pattern }
            }
       *[plain]
            { $gender ->
                [f] { $noun } ya { $filled } ya { $color }
               *[m] { $noun } yê { $filled } yê { $color }
            }
    }
# «kevî» — the edge of a shape — is a noun this catalog writes itself, so the
# preposition «bi» governs a word whose form is known and nothing is welded to
# a placeable. `{ $border }` arrives already led by its own particle, since
# `noun-gender` answers `f` for `border`. Kurmanji needs no article, so only
# the connective distinguishes the four branches.
style-border-clause =
    { $parts ->
        [with-article] bi kevî { $border }
        [and] û bi kevî { $border }
        [and-article] û bi kevî { $border }
       *[with] bi kevî { $border }
    }
# Here the head of the phrase is «dagirtin», a word this catalog supplies, so
# the *bound* ezafe can be written after all — «dagirtina sor» — and no fork is
# wanted: `describeFill` only ever asks for `fill`'s gender, so a `$gender`
# branch here would be a variant nothing else can select.
style-fill =
    { $parts ->
        [pattern] dagirtina { $color } bi { $pattern }
       *[plain] dagirtina { $color }
    }
# Rendered with no arguments at all, so it cannot select on `$gender`. The word
# does not inflect, so the flat form is also the correct one.
style-unfilled = nedagirtî
# «paşxane» is this catalog's own word, so the bound ezafe is written on it.
# The text colour is predicative here and stays a bare adjective.
style-text =
    { $parts ->
        [background] { $color } li ser paşxaneya { $background }
       *[plain] { $color }
    }
style-background-none = tune

## Boolean words

boolean-true = rast
boolean-false = şaş

## Answer buttons

answer-submit-label = Kontrol Bike
answer-submit-label-no-correctness = Bersivê Bişîne

## Sectional blocks
##
## Kurmanji does not mark the plural in the direct case, so a heading that
## names one exercise and a heading that names several are the same word.
## `.exercise` and `.exercises`, and `.problem` and `.problems`, therefore read
## alike; that is the language rather than a copy-paste.

section-name =
    .activity = Çalakî
    .aside = Nîşeya Alîkî
    .cascade = Kaskad
    .definition = Pênase
    .example = Mînak
    .exercise = Temrîn
    .exercises = Temrîn
    .given-answer = Bersiv
    .note = Nîşe
    .objectives = Armanc
    .paragraphs = Paragraf
    .part = Parçe
    .problem = Mesele
    .problems = Mesele
    .proof = Îsbat
    .question = Pirs
    .section = Beş
    .solution = Çareserî
    .task = Erk
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
hint-title = Alîkarî

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
        [numbered] Şekil { $enumeration }
        [numbered-caption] Şekil { $enumeration }{ ": " }
        [unnumbered-caption] Şekil{ ": " }
       *[unnumbered] Şekil
    }

## Paginator controls

paginator-previous = Berê
paginator-next = Pêş
paginator-page = Rûpel
paginator-page-status = { $pageLabel } { $currentPage } ji { $numPages }

## Piecewise functions
##
## Kurmanji's «eger» opens its clause, exactly where the renderer puts this
## key and ahead of the mathematics it introduces, so nothing has to be
## recorded here as unplaceable — unlike the catalogs whose conditional closes
## its clause.

piecewise-condition-or = an
piecewise-condition-if = eger
piecewise-condition-otherwise = wekî din

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Kurmanji-medium secondary schooling barely
## exists: a pupil in Turkey is taught chemistry in Turkish and a pupil in
## Syria in Arabic, so there is no Kurmanji element list a student would
## recognize from their own textbook, and an invented one would be further from
## the curriculum than the English fallback is. `locales/ckb` beside this one
## is a different case and says so in its own header — Central Kurdish *is* the
## medium of secondary science teaching in the Kurdistan Region of Iraq.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Sembola kîmyewî ya nederbasdar
chemistry-invalid-ionic-compound = Pêkhateya îyonî ya nederbasdar
