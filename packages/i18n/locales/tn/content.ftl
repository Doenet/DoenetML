# Setswana content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The roster calls this language **Tswana**, which is what `Intl.DisplayNames`
# renders `tn` as and so what `<document lang>`'s autocomplete offers. Setswana
# is the name its speakers use, and the two are one language — the same split
# `st` has between Southern Sotho and Sesotho, and `ny` between Nyanja and
# Chichewa.
#
# Setswana has no masculine or feminine, and it agrees an adjective with its
# noun's **class**, so this catalog reads `$gender` as the class token rather
# than as a gender — the same device `locales/sw` uses. `noun-gender` answers
# `c3`, `c5`, `c7` or `c9`, and every adjective that carries a concord selects
# on it.
#
# The concords this catalog writes out:
#
#           c3 (mo-/me-)  c5 (le-/ma-)  c7 (se-/di-)  c9 (N-)
#   -ntsho   montsho       lentsho       sentsho       ntsho
#   -tshweu  motshweu      letshweu      setshweu      tshweu
#   -hibidu  mohibidu      lehibidu      sehibidu      khibidu
#   -kima    mokima        lekima        sekima        kima
#   -sesane  mosesane      lesesane      sesesane      sesane
#
# The qualificative particle — «mola *o* mokima», «ntlha *e* ntsho» — is left
# out for the reason `locales/st` gives at length: the same string is what
# `backgroundColor` reports standing alone, where a bare particle would be a
# fragment, and nothing in `$role` tells the two positions apart.
#
# `style-filled-word` is the one entry that does carry a concord in front of
# it — «o o tletseng», «se se tletseng» — and it is not the particle being
# restored there: «tletseng» is a relative verb form, and the concord is part
# of the word rather than a linker that could be dropped. It selects on
# `$gender` like the adjectives do.
#
# Setswana and Sesotho are close enough that a reader may wonder why they are
# two catalogs. They are two standard languages with two orthographies, and
# this file is where that shows: Setswana writes «kgotsa» where Sesotho writes
# «kapa», «boammaaruri» where Sesotho writes «nnete», and «-hibidu» where
# Sesotho writes «-fubedu». Copying either file over the other would be wrong
# in both.
#
# Adjectives follow the noun, so the composition messages put the noun first.
# `$role` goes unused: Setswana marks no case.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] montsho
            [c5] lentsho
            [c7] sentsho
           *[c9] ntsho
        }
    .white =
        { $gender ->
            [c3] motshweu
            [c5] letshweu
            [c7] setshweu
           *[c9] tshweu
        }
    .gray = boputswa
    .red =
        { $gender ->
            [c3] mohibidu
            [c5] lehibidu
            [c7] sehibidu
           *[c9] khibidu
        }
    .orange = namune
    .yellow = serolwana
    .green = botala jwa tlhaga
    .cyan = sayane
    .blue = bolou
    .purple = phepolo
    .pink = pinki
    .brown = borokwa
line-width =
    .thick =
        { $gender ->
            [c3] mokima
            [c5] lekima
            [c7] sekima
           *[c9] kima
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
    .dashed = ka dikgaotso
    .dotted = ka dintlha
fill-style =
    .horizontal = mela e e rapameng
    .vertical = mela e e emeng
    .diagonal = mela e e sekameng
    .backdiagonal = mela e e sekameng morago
    .dots = dintlha
    .diamonds = ditaemane
noun =
    .line = mola
    .line-segment = karolo ya mola
    .ray = lesedi
    .vector = vektara
    .curve = kobamo
    .function = tiro
    .parabola = parabola
    .polyline = letlhotlho la mela
    .polygon = polikone
    .triangle = khutlotharo
    .rectangle = khutlonne
    .circle = sedikadikwe
    .region = lefelo
    .point = ntlha
    .square = khutlonne e e lekanang
    .diamond = taemane
    .cross = sefapaano
    .plus = letshwao la go oketsa
# The side count goes in the tail, behind the adjectives, because «e e nang le
# matlhakore a le 5» is a relative clause and Setswana closes a noun phrase
# with one rather than opening one.
noun-regular-polygon =
    { $part ->
        [tail] e e nang le matlhakore a le { $numSides }
       *[head] polikone e e lekalekanang
    }
noun-gender =
    { $noun ->
        [line] c3
        [polyline] c3
        [border] c3
        [ray] c5
        [line-segment] c7
        [region] c5
        [circle] c7
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
        [c3] o o tletseng
        [c5] le le tletseng
        [c7] se se tletseng
       *[c9] e e tletseng
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
# with it and not with the shape it surrounds. Setswana has no article, so the
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
style-unfilled = e e sa tlalang
style-text =
    { $parts ->
        [background] { $color } mo godimo ga bokamorago { $background }
       *[plain] { $color }
    }
style-background-none = ga go na sepe

## Boolean words

boolean-true = boammaaruri
boolean-false = maaka

## Answer buttons

answer-submit-label = Tlhatlhoba Tiro
answer-submit-label-no-correctness = Romela Karabo

## Sectional blocks

section-name =
    .activity = Tiro
    .aside = Tlhaloso ya ka thoko
    .cascade = Kaskade
    .definition = Tlhaloso
    .example = Sekai
    .exercise = Boitshidilo
    .exercises = Boitshidilo
    .given-answer = Karabo
    .note = Tlhokomelo
    .objectives = Maikaelelo
    .paragraphs = Dirapa
    .part = Karolo
    .problem = Bothata
    .problems = Mathata
    .proof = Bosupi
    .question = Potso
    .section = Karolo
    .solution = Tharabololo
    .task = Tiro
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
hint-title = Kgakololo

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

paginator-previous = E e fetileng
paginator-next = E e latelang
paginator-page = Tsebe
paginator-page-status = { $pageLabel } { $currentPage } mo go { $numPages }

## Piecewise functions

piecewise-condition-or = kgotsa
piecewise-condition-if = fa
piecewise-condition-otherwise = fa go sa nna jalo

## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Botswana teaches secondary
# science in English, and so does the North West, so a student meeting these
# words meets them in English already; the seed has no settled Setswana list to
# reproduce. A speaker adding one should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Letshwao la Khemisi le le sa Siamang
chemistry-invalid-ionic-compound = Motswako wa Ione o o sa Siamang
