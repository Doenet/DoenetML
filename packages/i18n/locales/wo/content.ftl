# Wolof content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Wolof has noun classes, and the Bantu catalogs in this repository read
# `$gender` as the class token for exactly that reason. Wolof is the case where
# that device is *not* wanted, and it is worth saying why so nobody adds it:
# the class in Wolof is carried by the determiner and the relative marker — bi,
# gi, mi, si, wi, ki, li, ji — and never by the adjective. «rëdd wu réy», «poñ
# bu xonq»: the adjective stem is the same in both, and only the linker in
# front of it changes. So `$gender` goes unused here, as it does in English.
#
# What the adjective does need is that **linker**, and this catalog cannot
# write it: the class belongs to the noun the phrase is being said of, and
# `style-stroke` is composed before the noun is known — it is also what
# `lineStyleDescription` reports standing alone, with no noun at all. Writing a
# linker there would be wrong in half the places the string lands. So the
# adjectives are written bare, which is what a label says in Wolof anyway, and
# `style-with-noun` is where a corrected catalog would put the concord back
# once the noun is in hand.
#
# Adjectives follow the noun, so the composition messages put the noun first
# and keep the English order among the adjectives themselves.
#
# `$role` goes unused: Wolof marks no case, and a phrase behind a preposition
# has the same shape as one standing alone.
#
# The mathematical nouns lean on French loans — «serkal», «wektëer»,
# «poligon» — because that is the vocabulary Senegalese schooling supplies for
# them. Where Wolof has its own word it is used: «rëdd» for line, «poñ» for
# point, «xaaj» for section.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = ñuul
    .white = weex
    .gray = gris
    .red = xonq
    .orange = oraas
    .yellow = jaan
    .green = wert
    .cyan = siyaan
    .blue = bulo
    .purple = wiyole
    .pink = roos
    .brown = maroo
line-width =
    .thick = réy
    .thin = sew
# Written as «ak …» phrases rather than as adjectives, so that they take no
# linker and can close the description. `style-stroke` puts them last.
line-style =
    .dashed = ak ay tiret
    .dotted = ak ay poñ
fill-style =
    .horizontal = ay rëdd yu tëdd
    .vertical = ay rëdd yu taxaw
    .diagonal = ay rëdd yu jeng
    .backdiagonal = ay rëdd yu jeng gannaaw
    .dots = ay poñ
    .diamonds = ay losaas
noun =
    .line = rëdd
    .line-segment = dogu rëdd
    .ray = reyoŋ
    .vector = wektëer
    .curve = kurb
    .function = fonksiyoŋ
    .parabola = parabol
    .polyline = rëdd wu bare dog
    .polygon = poligon
    .triangle = triyangal
    .rectangle = rektangal
    .circle = serkal
    .region = gox
    .point = poñ
    .square = kare
    .diamond = losaas
    .cross = kruwaa
    .plus = màndarga plus
# The side count follows the adjectives, behind «bu am», because Wolof closes a
# noun phrase with a relative rather than opening one: «poligon bu yem bu xonq
# bu am 5 wet».
noun-regular-polygon =
    { $part ->
        [tail] bu am { $numSides } wet
       *[head] poligon bu yem
    }
# Unused: the class lives on the determiner, not on the adjective.
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
# The noun leads and its adjectives follow, with the noun's own relative
# complement closing the phrase.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = feesal
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ak { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ak { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ak { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Wolof has no article, and the complement is joined with the invariable «ak»,
# so all four branches read alike.
style-border-clause =
    { $parts ->
        [with-article] ak wetu { $border }
        [and] ak wetu { $border }
        [and-article] ak wetu { $border }
       *[with] ak wetu { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = feesalul
style-text =
    { $parts ->
        [background] { $color } ci kaw ginnaaw { $background }
       *[plain] { $color }
    }
style-background-none = amul

## Boolean words

boolean-true = dëgg
boolean-false = fen

## Answer buttons

answer-submit-label = Seetlu Liggéey bi
answer-submit-label-no-correctness = Yónnee Tontu bi

## Sectional blocks

section-name =
    .activity = Aktiwite
    .aside = Ci wet
    .cascade = Kaskaad
    .definition = Firnde
    .example = Misaal
    .exercise = Ekserkis
    .exercises = Ekserkis
    .given-answer = Tontu
    .note = Xamle
    .objectives = Jubluwaay
    .paragraphs = Paragraf
    .part = Cër
    .problem = Jafe-jafe
    .problems = Jafe-jafe
    .proof = Firndeel
    .question = Laaj
    .section = Xaaj
    .solution = Saafara
    .task = Liggéey
    .theorem = Teyoreem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Xelal

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
        [numbered] Nataal { $enumeration }
        [numbered-caption] Nataal { $enumeration }{ ": " }
        [unnumbered-caption] Nataal{ ": " }
       *[unnumbered] Nataal
    }

## Paginator controls

paginator-previous = Bi jiitu
paginator-next = Bi ci topp
paginator-page = Xët
paginator-page-status = { $pageLabel } { $currentPage } ci { $numPages }

## Piecewise functions

piecewise-condition-or = walla
piecewise-condition-if = su
piecewise-condition-otherwise = su dul loolu

## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Senegalese secondary science
# is taught in French, out of French-language textbooks, so a student meeting
# these words meets them in a European language already — and the seed has no
# settled Wolof list to reproduce. A speaker adding one should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Màndarga Simi bu Baaxul
chemistry-invalid-ionic-compound = Konpose Iyonik bu Baaxul
