# Ga content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `gaa` is Ga, of Accra. The roster reads "Ga (Gã)" — CLDR knows both, and they
# are one language.
#
# Ga has no grammatical gender, no noun class the describing words agree with,
# and no case, so `$gender` and `$role` go unused exactly as they do in
# English. It sits in this batch beside three catalogs that fork on a class and
# two that fork on a suffixed one, and it is the plainest form of the sentence
# they add up to: **a region says nothing about agreement.** Accra and Tamale
# are in one country and one school system, and `locales/dag` writes a class
# table where this file writes none.
#
# What Ga does have is **reduplication for the plural of a qualifier** —
# «agbo» becomes «agbogbo» after a plural noun. Nothing in these messages ever
# describes more than one thing at a time, so every qualifier here is written
# in the singular, and a reader adding one should write it that way too. The
# one place a plural appears is `fill-style`, where the pattern is a set of
# lines rather than a described object, and those are written out whole.
#
# Adjectives follow the noun, so the composition messages put the noun first.
#
# The mathematical nouns lean on the English loans Ghanaian schooling supplies,
# spelled the way Ga writes them; where Ga has its own word it is used —
# «kɛnkɛn» a border, «he» a place. They are the first thing to check.


## Style vocabulary

color =
    .black = diŋ
    .white = yɛŋ
    .gray = mumu
    .red = tsuru
    .orange = akutu
    .yellow = kɔɔlɔɔ
    .green = baabaa
    .cyan = sian
    .blue = blu
    .purple = paapul
    .pink = piŋk
    .brown = braun

line-width =
    .thick = agbo
    .thin = bibioo

# Written as invariable «kɛ …» phrases rather than as qualifiers, so that they
# can close the description. `style-stroke` puts them last.
line-style =
    .dashed = kɛ dashii
    .dotted = kɛ dɔtsii

fill-style =
    .horizontal = laiŋi ni ekã shi
    .vertical = laiŋi ni edamɔ shi
    .diagonal = laiŋi ni ekpe
    .backdiagonal = laiŋi ni ekpe yɛ gbɛ kroko nɔ
    .dots = dɔtsii
    .diamonds = diamondii

noun =
    .line = laiŋi
    .line-segment = laiŋi fã
    .ray = rei
    .vector = vɛktɔ
    .curve = laiŋi ni ekpe
    .function = fɔŋkshɔn
    .parabola = parabola
    .polyline = laiŋi fãi
    .polygon = poligɔn
    .triangle = trayaŋgul
    .rectangle = rɛktaŋgul
    .circle = kokloo
    .region = he
    .point = pɔint
    .square = skwea
    .diamond = diamond
    .cross = sɛŋɛ
    .plus = kɛfataa okadi

# The side count follows the qualifiers, behind «ni yɔɔ», because Ga closes a
# noun phrase with a relative rather than opening one.
noun-regular-polygon =
    { $part ->
        [tail] ni yɔɔ tsɔɔmɔ { $numSides }
       *[head] poligɔn ni damɔ pɛpɛɛpɛ
    }

# No grammatical gender, so this answers one token for every noun and the
# answer goes unused — the shape `locales/en` has.
noun-gender = ekome


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

style-filled-word = ni eyi obɔ

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } kɛ { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } kɛ { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } kɛ { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Ga has no article, and joins this clause with the invariable «kɛ» whatever
# came before it, so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] kɛ kɛnkɛn { $border }
        [and] kɛ kɛnkɛn { $border }
        [and-article] kɛ kɛnkɛn { $border }
       *[with] kɛ kɛnkɛn { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = ni eyiii obɔ

style-text =
    { $parts ->
        [background] { $color } kɛ sɛɛgbɛ { $background }
       *[plain] { $color }
    }

style-background-none = nɔ ko bɛ jɛi


## Boolean words

boolean-true = anɔkwale
boolean-false = amale


## Answer buttons

answer-submit-label = Kwɛmɔ Nitsumɔ
answer-submit-label-no-correctness = Maje Hetoo


## Sectional blocks

section-name =
    .activity = Nitsumɔ
    .aside = Nɔ ni afata he
    .cascade = Gbɛjianɔtoo
    .definition = Shishitsɔɔmɔ
    .example = Nɔkwɛmɔnɔ
    .exercise = Kasemɔ
    .exercises = Kasemɔi
    .given-answer = Hetoo
    .note = Kadimɔ
    .objectives = Otii
    .paragraphs = Wiemɔkui
    .part = Fã
    .problem = Naagba
    .problems = Naagbai
    .proof = Odaseyeli
    .question = Sanebimɔ
    .section = Fã
    .solution = Tsabaa
    .task = Nitsumɔ
    .theorem = Tiorɛm

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Hiɛtsɔɔmɔ


## Tables and figures

table-name =
    { $parts ->
        [numbered] Okpɔlɔ { $enumeration }
        [numbered-title] Okpɔlɔ { $enumeration }{ ": " }
        [unnumbered-title] Okpɔlɔ{ ": " }
       *[unnumbered] Okpɔlɔ
    }

figure-name =
    { $parts ->
        [numbered] Mfoniri { $enumeration }
        [numbered-caption] Mfoniri { $enumeration }{ ": " }
        [unnumbered-caption] Mfoniri{ ": " }
       *[unnumbered] Mfoniri
    }


## Paginator controls

paginator-previous = Nɔ ni tsɔ hiɛ
paginator-next = Nɔ ni nyiɛ sɛɛ
paginator-page = Baafa

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = loo

piecewise-condition-if = kɛji

piecewise-condition-otherwise = hei krokomɛi fɛɛ


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Ghana teaches secondary science in English, so a Ga
## speaker meets the periodic table there and the fallback *is* the curriculum
## — the same answer `locales/ak`, `locales/ee` and `locales/dag` give from the
## same ministry.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Kɛmistri Okadi ni Ejaaa
chemistry-invalid-ionic-compound = Ayɔn Fatamɔ ni Ejaaa
