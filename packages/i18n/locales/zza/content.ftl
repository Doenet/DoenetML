# Zazaki (Zazakî / Kirmanckî) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in, not the reader's interface language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which Zazaki, and in what letters.** `zza` is the ISO 639-3 macrolanguage
# over Northern Zazaki (Kirmanckî, `kiu`) and Southern Zazaki (Dimlî, `diq`).
# This file is written in the **Vate written standard** and leans on the
# Northern forms where the two part company. The alphabet is the Zazaki Latin
# one: the Hawar letters `ç ê î ş û` **plus `ı`, the dotless i**, which Zazaki
# has and Kurmanji does not. A corrector should not silently normalize `ı`
# to `i`, and should not mix Arabic-script Zazaki into these files.
#
# **Word order: the noun comes first and its modifiers follow it, linked by
# the ezafe.** «xeto sûr» is *a red line*. The ezafe is a **bound vowel on the
# noun** — `-o` after a masculine, `-a` after a feminine, `-ê` in the plural,
# with a `y` inserted after a vowel («noqta» → «noqtaya») — and it therefore
# cannot be welded onto `{ $noun }`, which is a value this catalog never sees.
# The way out is the one `locales/ckb` takes for Sorani: `$noun` lands in
# exactly one position, immediately in front of the words that describe it, so
# **every entry in the `noun` table below is written with its ezafe already on
# it** and the composition messages add nothing. The known cost is an author's
# own `markerStyleWord`, which the catalog has never seen and which therefore
# arrives with no linker at all.
#
# **Two deliberate stiffnesses, recorded so they are not mistaken for slips:**
#
#   * Written Zazaki repeats the ezafe before each modifier after the first
#     («xeto stûr o sûr»). This catalog writes it **once, on the noun**, and
#     lets the modifiers follow in sequence: «xeto stûr sûr». A speaker should
#     read that as a compromise forced by the placeable, not as a mistake.
#   * After the preposition «bi» a masculine noun takes the oblique. This
#     catalog writes the direct form with its ezafe — «bi kenaro { $border }»
#     — because one shape everywhere is findable and a scatter of guesses is
#     not.
#
# **Gender.** Zazaki does have masculine and feminine, but **nothing in this
# file forks on `$gender`**: a Zazaki attributive adjective after the ezafe is
# invariable, and the agreement that does exist has already been spent in the
# `noun` table. `noun-gender` therefore answers a single token, which nothing
# reads. `$role` goes unused for the same reason — this catalog writes every
# preposition it needs itself.
#
# **Number.** Zazaki leaves a noun unmarked after a numeral, so no message
# here selects on a count; see the plural note in `chrome.ftl`.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Zazaki is not a medium of instruction: chemistry in Turkey is taught in
# Turkish, and the periodic table a Zazaki-speaking pupil meets is the Turkish
# one. There is no settled Zazaki list of the hundred and eighteen elements to
# check a translation against, and writing one would be inventing a
# nomenclature rather than recording one. `lint:i18n` reports the two keys as
# missing coverage, and that report is correct. `ion-name-oxidation-state` and
# the two invalid-symbol messages **are** covered — they are frames and
# punctuation, not vocabulary.
#
# **Loans kept rather than replaced by coinages.** Turkish or international
# words a Zazaki speaker schooled in Turkey actually uses: `vektor`,
# `fonksîyon`, `parabol`, `paragraf`, `problem`, `teorem`, `aktîvîte`,
# `tablo`, `şekil`, `sembol`, `terkîb`, `îyonîk`, `muntezem`, `artî`, `elmas`.
# Several geometry and style words are **Kurmanji terms** rather than attested
# Zazaki ones — `qutbirr` (dashed), `xalxalî` (dotted), `asoyî` (horizontal),
# `firûzeyî` (cyan) — and are marked as such below. `çewte` for *curve* is the
# least certain word in the file.


## Style vocabulary
##
## Nothing here forks. The words are invariable after the ezafe the noun
## carries.

# «kewe» is the ordinary Zazaki blue. Cyan has no settled word, so the
# Kurmanji «firûzeyî» — turquoise — stands for it; that is a colour boundary
# the style pipeline draws where the language does not.
color =
    .black = siya
    .white = sıpê
    .gray = gewr
    .red = sûr
    .orange = porteqalî
    .yellow = zerd
    .green = kesk
    .cyan = firûzeyî
    .blue = kewe
    .purple = mor
    .pink = pembeyî
    .brown = qehweyî
line-width =
    .thick = stûr
    .thin = barî
# Both are Kurmanji terms; Zazaki has no settled pair of its own for these.
line-style =
    .dashed = qutbirr
    .dotted = xalxalî
# Noun phrases, and the one place a word's position is fixed enough to inflect
# in advance: all four uses of a fill pattern stand behind «bi», so these are
# written in the plural form wanted there.
fill-style =
    .horizontal = xetê asoyî
    .vertical = xetê tîkanî
    .diagonal = xetê çewtî
    .backdiagonal = xetê çewtî yê berevajî
    .dots = xalî
    .diamonds = elmasî
# Every entry carries its own ezafe: `-o` masculine, `-a` feminine, `-ya`
# after a vowel. The two field nouns already end in an ezafe of their own and
# take no second one.
noun =
    .line = xeto
    .line-segment = parçexeto
    .ray = nîmxeto
    .vector = vektoro
    .curve = çewta
    .function = fonksîyona
    .slope-field = zewiya meyli
    .vector-field = zewiya vektorî
    .parabola = parabola
    .polyline = zafxeto
    .polygon = zafgoşeyo
    .triangle = hîrêgoşeyo
    .rectangle = raştgoşeyo
    .circle = çembero
    .region = herêma
    .point = noqtaya
    .square = çargoşeyo
    .diamond = elmaso
    .cross = xaço
    .plus = artîyo
# The side count follows the modifiers rather than sitting inside the noun, so
# that they stay beside the word they describe: «zafgoşeyo muntezem sûr stûr
# bi 5 kenaran». Zazaki counts with an unmarked noun, so nothing agrees here.
noun-regular-polygon =
    { $part ->
        [tail] bi { $numSides } kenaran
       *[head] zafgoşeyo muntezem
    }
# Zazaki has masculine and feminine, but the agreement lives in the `noun`
# table above rather than in any adjective, so this token is defined on
# purpose and read by nothing.
noun-gender = neuter


## Style composition
##
## The mirror of the English order: the modifier English puts nearest the noun
## is the one Zazaki puts nearest it.

style-stroke =
    { $parts ->
        [width-style-color] { $color } { $lineStyle } { $width }
        [width-color] { $color } { $width }
        [style-color] { $color } { $lineStyle }
        [width-style] { $lineStyle } { $width }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
# «pırr» — full — against «veng» — empty — which is how Zazaki says a shape is
# filled rather than hollow.
style-filled-word = pırr
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } bi { $pattern }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } bi { $pattern }
        [plain-tail] { $noun } { $color } { $filled } { $nounTail }
        [pattern-tail] { $noun } { $color } { $filled } { $nounTail } bi { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# Zazaki has no indefinite article, so the two `-article` branches say what
# their plain counterparts do. They are kept apart because the distinction
# belongs to the English message rather than to this one.
style-border-clause =
    { $parts ->
        [with-article] bi kenaro { $border }
        [and] û kenaro { $border }
        [and-article] û kenaro { $border }
       *[with] bi kenaro { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = veng
style-text =
    { $parts ->
        [background] { $color } bi zemino { $background }
       *[plain] { $color }
    }
style-background-none = çin


## Boolean words
##
## What a `<boolean>` displays. `true` and `false` as an author writes them in
## the source stay English; only these two move.

boolean-true = raşt
boolean-false = xelet


## Answer buttons
##
## The two buttons are imperative rather than verbal nouns — unlike the
## controls in `chrome.ftl` — because they are what the reader is being told
## to do.

answer-submit-label = Kontrol ke
answer-submit-label-no-correctness = Cewab bırusne


## Sectional blocks

section-name =
    .activity = Aktîvîte
    .aside = Kenar
    .cascade = Zincîre
    .definition = Tarîf
    .example = Nimûne
    .exercise = Temrîn
    .exercises = Temrînî
    .given-answer = Cewab
    .note = Not
    .objectives = Amancî
    .paragraphs = Paragrafî
    .part = Beş
    .problem = Problem
    .problems = Problemî
    .proof = Îsbat
    .question = Pers
    .section = Qısım
    .solution = Çareserî
    .task = Wezîfe
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
hint-title = Rêberî


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
##
## The status line is written with a slash rather than a word: «Pele 3 / 5».
## `$pageLabel` may be the author's own word, and a Zazaki preposition placed
## against it would have to agree with a word this catalog never sees.

paginator-previous = Verên
paginator-next = Peyên
paginator-page = Pele
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = yan
piecewise-condition-if = eke
piecewise-condition-otherwise = wına nêbo


## Chemistry
##
## The element tables are absent on purpose; see the header. What is here is
## the frames around a name, which need no nomenclature.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Sembolo kîmyewî xelet
chemistry-invalid-ionic-compound = Terkîbo îyonîk xelet


## Inputs embedded in math

math-embedded-input-blank = veng
math-embedded-input-blank-ordinal = { $total } ra vengo { $ordinal }
