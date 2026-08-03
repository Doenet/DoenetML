# Oromo content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Oromo is written in Qubee, the Latin orthography, and a doubled vowel or
# consonant is a different sound rather than a typo: «sarara» is a line and
# «saraaraa» is not a word. A correction that shortens one has changed it.
#
# Oromo has gender, and it agrees an adjective with it — «diimaa» against
# «diimtuu» — so `$gender` is meaningful here in the sense the argument was
# named for. Nothing selects on it all the same, and the reason is the
# vocabulary rather than the grammar: every noun this catalog names is a
# derived form or a loan, and both default to masculine. `noun-gender`
# therefore answers `m` throughout, and a fork on it would have one branch.
# Write the feminine forms in the moment a feminine noun joins the table, not
# before.
#
# Adjectives follow the noun, so the composition messages put the noun first.
# `$role` goes unused: the case endings Oromo does have fall on the noun rather
# than on the adjective beside it.


## Style vocabulary

color =
    .black = gurraacha
    .white = adii
    .gray = daalacha
    .red = diimaa
    .orange = burtukaanaa
    .yellow = keelloo
    .green = magariisa
    .cyan = cuquliisa magariisaa
    .blue = cuquliisa
    .purple = hoomacha
    .pink = biloo
    .brown = magaala

line-width =
    .thick = furdaa
    .thin = qal'aa

line-style =
    .dashed = kutaa-kutaa
    .dotted = tuqaa-tuqaa

# Noun phrases: they follow «waliin» and modify nothing.
fill-style =
    .horizontal = sarara ciisaa
    .vertical = sarara dhaabbataa
    .diagonal = sarara jal'ataa
    .backdiagonal = sarara jal'ataa faallaa
    .dots = tuqaalee
    .diamonds = daayimandii

noun =
    .line = sarara
    .line-segment = kutaa sararaa
    .ray = ifa sararaa
    .vector = veektara
    .curve = sarara jallataa
    .function = hojii
    .parabola = paaraboolaa
    .polyline = sarara kutaalee
    .polygon = boca rogoota baay'ee
    .triangle = rog-sadee
    .rectangle = rog-afur dheeraa
    .circle = geengoo
    .region = naannoo
    .point = tuqaa
    .square = rog-afur walqixa
    .diamond = daayimandii
    .cross = fannoo
    .plus = mallattoo ida'uu

# The side count goes in the tail, behind the adjectives: «boca walqixa diimaa
# rogoota 5 qabu».
noun-regular-polygon =
    { $part ->
        [tail] rogoota { $numSides } qabu
       *[head] boca walqixa
    }

# Every noun this catalog names is masculine — see the header. The feminine
# exists in the language and simply has no member here yet.
noun-gender = m


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
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = guutame

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern } waliin
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } { $pattern } waliin
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } { $pattern } waliin
       *[plain] { $noun } { $filled } { $color }
    }

# «daangaa» leads its own adjectives, the same way every noun here does, and
# «waliin» closes the clause rather than opening it: Oromo is a postpositional
# language, so the word joining the border to the shape follows the whole
# phrase. Oromo has no article, so the two `-article` branches read like the
# ones without.
style-border-clause =
    { $parts ->
        [with-article] daangaa { $border } waliin
        [and] fi daangaa { $border } waliin
        [and-article] fi daangaa { $border } waliin
       *[with] daangaa { $border } waliin
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = hin guutamne

style-text =
    { $parts ->
        [background] { $color } duubbee { $background } irratti
       *[plain] { $color }
    }

style-background-none = hin jiru


## Boolean words

boolean-true = dhugaa
boolean-false = soba


## Answer buttons

answer-submit-label = Hojii Ilaali
answer-submit-label-no-correctness = Deebii Ergi


## Sectional blocks

section-name =
    .activity = Gocha
    .aside = Ida'ama
    .cascade = Tartiiba
    .definition = Hiikkaa
    .example = Fakkeenya
    .exercise = Shaakala
    .exercises = Shaakalawwan
    .given-answer = Deebii
    .note = Yaadannoo
    .objectives = Kaayyoolee
    .paragraphs = Keewwattoota
    .part = Kutaa
    .problem = Rakkoo
    .problems = Rakkoolee
    .proof = Ragaa
    .question = Gaaffii
    .section = Kutaa
    .solution = Furmaata
    .task = Hojii
    .theorem = Seera

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Qajeelfama


## Tables and figures

table-name =
    { $parts ->
        [numbered] Gabatee { $enumeration }
        [numbered-title] Gabatee { $enumeration }{ ": " }
        [unnumbered-title] Gabatee{ ": " }
       *[unnumbered] Gabatee
    }

figure-name =
    { $parts ->
        [numbered] Fakkii { $enumeration }
        [numbered-caption] Fakkii { $enumeration }{ ": " }
        [unnumbered-caption] Fakkii{ ": " }
       *[unnumbered] Fakkii
    }


## Paginator controls

paginator-previous = Kan darbe
paginator-next = Kan itti aanu
paginator-page = Fuula

paginator-page-status = { $pageLabel } { $currentPage } kan { $numPages }


## Piecewise functions

piecewise-condition-or = yookaan
piecewise-condition-if = yoo
piecewise-condition-otherwise = yoo kanaan ta'uu baate


## Chemistry

# Oromo is one of the catalogs that leaves `element-name` and
# `element-anion-name` out, so those 130 keys fall back to English. Ethiopian
# secondary chemistry is taught in English, and no Oromo list of the elements
# has reached a classroom to seed from.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Mallattoo Keemikaalaa Sirrii Hin Taane
chemistry-invalid-ionic-compound = Walmakaa Ayoonii Sirrii Hin Taane
