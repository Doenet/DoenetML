# Southern Sotho content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The roster calls this language **Southern Sotho**, which is what
# `Intl.DisplayNames` renders `st` as and so what `<document lang>`'s
# autocomplete offers. Sesotho is the name its speakers use, and the two are
# one language — the same split `ny` has between Nyanja and Chichewa.
#
# Sesotho has no masculine or feminine, and it agrees an adjective with its
# noun's **class**, so this catalog reads `$gender` as the class token rather
# than as a gender — the same device `locales/sw` uses. `noun-gender` answers
# `c3`, `c5`, `c7` or `c9`, and every adjective that carries a concord selects
# on it.
#
# The concords this catalog writes out:
#
#           c3 (mo-/me-)  c5 (le-/ma-)  c7 (se-/di-)  c9 (N-)
#   -tšo     motšo         letšo         setšo         ntšo
#   -tšweu   motšweu       letšweu       setšweu       tšweu
#   -fubedu  mofubedu      lefubedu      sefubedu      khubedu
#   -tenya   motenya       letenya       setenya       tenya
#   -sesane  mosesane      lesesane      sesesane      sesane
#
# **The qualificative particle is left out on purpose**, and that is the one
# thing a speaker will notice first. Sesotho joins an adjective to its noun
# with a particle agreeing in class as well — «mola *o* motenya», «ntlha *e*
# ntšo» — and the particle is computable from `$gender`. It is left out because
# the same string is also what `backgroundColor` and `lineColorDescription`
# report standing alone, where a bare particle would be a fragment, and nothing
# in `$role` tells the two positions apart. Restoring it belongs in
# `style-with-noun`, where the noun is in hand; this is the same trade
# `locales/sw` makes with its associative.
#
# `style-filled-word` is the one entry that does carry a concord in front of
# it — «o tletseng», «se tletseng» — and it is not the particle being restored
# there: «tletseng» is a relative verb form, and its relative concord is part
# of the word rather than a linker that could be dropped. It selects on
# `$gender` like the adjectives do.
#
# Adjectives follow the noun, so the composition messages put the noun first.
# `$role` goes unused: Sesotho marks no case.
#
# `c9` is the default, because that is the class a loanword joins — and an
# author's own `markerStyleWord`, which this catalog has never seen, is a
# loanword as far as it is concerned.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

# Only the three with a native adjective stem inflect. The rest are invariable
# loans and do not change shape for anything.
color =
    .black =
        { $gender ->
            [c3] motšo
            [c5] letšo
            [c7] setšo
           *[c9] ntšo
        }
    .white =
        { $gender ->
            [c3] motšweu
            [c5] letšweu
            [c7] setšweu
           *[c9] tšweu
        }
    .gray = boputswa
    .red =
        { $gender ->
            [c3] mofubedu
            [c5] lefubedu
            [c7] sefubedu
           *[c9] khubedu
        }
    .orange = lamunu
    .yellow = mosehla
    .green = botala
    .cyan = sayane
    .blue = boputsoa
    .purple = perese
    .pink = pinki
    .brown = sootho
line-width =
    .thick =
        { $gender ->
            [c3] motenya
            [c5] letenya
            [c7] setenya
           *[c9] tenya
        }
    .thin =
        { $gender ->
            [c3] mosesane
            [c5] lesesane
            [c7] sesesane
           *[c9] sesane
        }
# Written as invariable «ka …» phrases rather than as adjectives, so that they
# agree with nothing and can close the description. `style-stroke` puts them
# last for that reason.
line-style =
    .dashed = ka dikgaolo
    .dotted = ka dintlha
fill-style =
    .horizontal = mela e robetseng
    .vertical = mela e emeng
    .diagonal = mela e sekameng
    .backdiagonal = mela e sekameng morao
    .dots = dintlha
    .diamonds = ditaemane
noun =
    .line = mola
    .line-segment = karolo ya mola
    .ray = lesedi
    .vector = vektoro
    .curve = kobeho
    .function = tshebetso
    .parabola = parabola
    .polyline = mokoloko wa mela
    .polygon = polikone
    .triangle = khutlotharo
    .rectangle = khutlonne
    .circle = sedikadikwe
    .region = sebaka
    .point = ntlha
    .square = sekwere
    .diamond = taemane
    .cross = sefapano
    .plus = letshwao la ho eketsa
# The side count goes in the tail, behind the adjectives, because «e nang le
# mahlakore a 5» is a relative clause and Sesotho closes a noun phrase with one
# rather than opening one.
noun-regular-polygon =
    { $part ->
        [tail] e nang le mahlakore a { $numSides }
       *[head] polikone e lekanang
    }
noun-gender =
    { $noun ->
        [line] c3
        [polyline] c3
        [border] c3
        [ray] c5
        [line-segment] c7
        [region] c7
        [circle] c7
        [square] c7
        [cross] c7
        [fill] c7
        [text] c5
       *[other] c9
    }

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
style-filled-word =
    { $gender ->
        [c3] o tletseng
        [c5] le tletseng
        [c7] se tletseng
       *[c9] e tletseng
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ka { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ka { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ka { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «moedi» is class 3 and leads its own adjectives, so the border's words agree
# with it and not with the shape it surrounds. Sesotho has no article, so the
# two `-article` branches read like the two without, and the complement is
# joined with the invariable «ka» whether it is the first clause or a further
# one, so `[and]` reads like `[with]` as well. All four end up the same string.
style-border-clause =
    { $parts ->
        [with-article] ka moedi { $border }
        [and] ka moedi { $border }
        [and-article] ka moedi { $border }
       *[with] ka moedi { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = e sa tlalang
style-text =
    { $parts ->
        [background] { $color } holim'a bokamorao { $background }
       *[plain] { $color }
    }
style-background-none = ha ho letho

## Boolean words

boolean-true = nnete
boolean-false = leshano

## Answer buttons

answer-submit-label = Hlahloba Mosebetsi
answer-submit-label-no-correctness = Romela Karabo

## Sectional blocks

section-name =
    .activity = Mosebetsi
    .aside = Tlhaloso ka thoko
    .cascade = Kaskade
    .definition = Tlhaloso
    .example = Mohlala
    .exercise = Boitlwaetso
    .exercises = Boitlwaetso
    .given-answer = Karabo
    .note = Tlhokomediso
    .objectives = Merero
    .paragraphs = Dirapa
    .part = Karolo
    .problem = Bothata
    .problems = Mathata
    .proof = Bopaki
    .question = Potso
    .section = Karolo
    .solution = Tharollo
    .task = Mosebetsi
    .theorem = Thiorema
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Keletso

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tafole { $enumeration }
        [numbered-title] Tafole { $enumeration }{ ": " }
        [unnumbered-title] Tafole{ ": " }
       *[unnumbered] Tafole
    }
figure-name =
    { $parts ->
        [numbered] Setshwantsho { $enumeration }
        [numbered-caption] Setshwantsho { $enumeration }{ ": " }
        [unnumbered-caption] Setshwantsho{ ": " }
       *[unnumbered] Setshwantsho
    }

## Paginator controls

paginator-previous = E fetileng
paginator-next = E latelang
paginator-page = Leqephe
paginator-page-status = { $pageLabel } { $currentPage } ho { $numPages }

## Piecewise functions

piecewise-condition-or = kapa
piecewise-condition-if = ha
piecewise-condition-otherwise = ho seng joalo

## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Secondary science in Lesotho
# and in the Free State is taught in English, so a student meeting these words
# meets them in English already, and the seed has no settled Sesotho list to
# reproduce. A speaker adding one should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Letshwao la Khemistri le sa Nepahalang
chemistry-invalid-ionic-compound = Motswako wa Ione o sa Nepahalang
