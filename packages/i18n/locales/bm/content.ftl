# Bambara content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Bambara has no grammatical gender, no article and no case, so `$gender` and
# `$role` go unused here exactly as they do in English.
#
# What it does have is a **qualifier suffix**: an adjective following a noun
# takes `-man` — «liɲi finman», «liɲi bonman» — and the same stem standing on
# its own as a noun does not. Every adjective in this catalog is written in the
# qualifier form, because every one of them is said of something: even where
# `lineColorDescription` reports a colour alone, what it reports is the colour
# *of a line*. `style-background-none` is the one string that is not a
# qualifier and so has no suffix.
#
# Adjectives follow the noun, so the composition messages put the noun first
# and keep the English order among the adjectives themselves.
#
# The mathematical nouns lean on the French loans Malian schooling supplies —
# «liɲi», «sɛrɛkili», «fɔnksiyɔn» — spelled the way Bambara writes them rather
# than the way French does. Where Bambara has its own word it is used: «yɔrɔ» a
# region, «kuruwa» a cross, «jate» a number.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = finman
    .white = jɛman
    .gray = bugurilama
    .red = bilenman
    .orange = lenburulama
    .yellow = nɛrɛmugulama
    .green = binkɛnɛlama
    .cyan = siyan
    .blue = bulama
    .purple = wulenfinman
    .pink = wulenɲɛman
    .brown = bɔgɔlama

line-width =
    .thick = bonman
    .thin = misɛnman

# Written as «ni …» phrases rather than as qualifiers, so that they take no
# `-man` and can close the description. `style-stroke` puts them last.
line-style =
    .dashed = ni tirɛw ye
    .dotted = ni pɔnw ye

fill-style =
    .horizontal = liɲi dalenw
    .vertical = liɲi jɔlenw
    .diagonal = liɲi jɛngɛlenw
    .backdiagonal = liɲi jɛngɛlen kɔfɛtaw
    .dots = pɔnw
    .diamonds = losanziw

noun =
    .line = liɲi
    .line-segment = liɲi tilayɔrɔ
    .ray = reyɔn
    .vector = wɛkitɛri
    .curve = kurubu
    .function = fɔnksiyɔn
    .parabola = parabɔli
    .polyline = liɲi kuruma
    .polygon = poligɔni
    .triangle = tiriyanguli
    .rectangle = rɛktangili
    .circle = sɛrɛkili
    .region = yɔrɔ
    .point = pɔn
    .square = kare
    .diamond = losanzi
    .cross = kuruwa
    .plus = fara-taamasere

# The side count follows the qualifiers, behind «min kɛrɛ … ye», because
# Bambara closes a noun phrase with a relative rather than opening one.
noun-regular-polygon =
    { $part ->
        [tail] min kɛrɛ { $numSides } ye
       *[head] poligɔni bɛnnen
    }

noun-gender = neuter


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

style-filled-word = falen

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ni { $pattern } ye
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ni { $pattern } ye
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ni { $pattern } ye
       *[plain] { $noun } { $filled } { $color }
    }

# Bambara has no article and joins the complement with the invariable «ni …
# ye», so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ni dancɛ { $border } ye
        [and] ni dancɛ { $border } ye
        [and-article] ni dancɛ { $border } ye
       *[with] ni dancɛ { $border } ye
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = falenbali

style-text =
    { $parts ->
        [background] { $color } kɔkanna { $background } kan
       *[plain] { $color }
    }

style-background-none = foyi tɛ


## Boolean words

boolean-true = tiɲɛ
boolean-false = galon


## Answer buttons

answer-submit-label = Baara Sɛgɛsɛgɛ
answer-submit-label-no-correctness = Jaabi Ci


## Sectional blocks

section-name =
    .activity = Baara
    .aside = Kɛrɛfɛ kuma
    .cascade = Kaskadi
    .definition = Kɔrɔfɔli
    .example = Misali
    .exercise = Ekizɛrisi
    .exercises = Ekizɛrisiw
    .given-answer = Jaabi
    .note = Kɔlɔsili
    .objectives = Laɲiniw
    .paragraphs = Paragarafuw
    .part = Tilayɔrɔ
    .problem = Gɛlɛya
    .problems = Gɛlɛyaw
    .proof = Dalilu
    .question = Ɲininkali
    .section = Yɔrɔ
    .solution = Ɲɛnabɔli
    .task = Baara
    .theorem = Teyorɛmu

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Ladilikan


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabali { $enumeration }
        [numbered-title] Tabali { $enumeration }{ ": " }
        [unnumbered-title] Tabali{ ": " }
       *[unnumbered] Tabali
    }

figure-name =
    { $parts ->
        [numbered] Ja { $enumeration }
        [numbered-caption] Ja { $enumeration }{ ": " }
        [unnumbered-caption] Ja{ ": " }
       *[unnumbered] Ja
    }


## Paginator controls

paginator-previous = Kɔfɛta
paginator-next = Nata
paginator-page = Sɛbɛnnisɛn

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = walima
piecewise-condition-if = ni
piecewise-condition-otherwise = n'o tɛ


## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Malian secondary science is
# taught in French, so a student meeting these words meets them in a European
# language already — and the seed has no settled Bambara list to reproduce. A
# speaker adding one should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simi Taamasere Tɛ Ɲɛ
chemistry-invalid-ionic-compound = Iyɔn Fɛn-Fara Tɛ Ɲɛ
