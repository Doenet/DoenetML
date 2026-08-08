# Shona content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Shona has no masculine or feminine, and it agrees an adjective with its
# noun's **class**, so this catalog reads `$gender` as the class token rather
# than as a gender — the same device `locales/sw` uses. `noun-gender` answers
# `c3`, `c5`, `c7` or `c9`, and every adjective that carries a concord selects
# on it.
#
# What is worth reading closely is *how* Shona marks the concord, because it is
# not a prefix bolted onto an unchanged stem. In class 5 the stem's own first
# consonant changes with it — «-tema» becomes «dema», «-chena» becomes «jena»,
# «-kobvu» becomes «gobvu» — so the table below is not derivable from the
# stems and has to be written out:
#
#           c3 (mu-/mi-)  c5 (ma-)   c7 (chi-/zvi-)  c9 (N-)
#   -tema    mutema        dema       chitema         nhema
#   -chena   muchena       jena       chichena        chena
#   -tsvuku  mutsvuku      dzvuku     chitsvuku       tsvuku
#   -kobvu   mukobvu       gobvu      chikobvu        hobvu
#   -tete    mutete        dete       chitete         tete
#   -zadzwa  wakazadzwa    rakazadzwa chakazadzwa     yakazadzwa
#
# `c9` is the default, because that is the class a loanword joins — and an
# author's own `markerStyleWord`, which this catalog has never seen, is a
# loanword as far as it is concerned.
#
# Only the three colours with a native adjective stem inflect — black, white
# and red; the two stems below them in the table are the widths. The rest are
# invariable nouns, and attributively Shona joins them with the associative of
# the class («mutsara mukobvu *we*girini»). The associative is computable from
# `$gender`, but the same string is what `backgroundColor` reports standing
# alone, where a bare associative would be ungrammatical, and nothing in
# `$role` tells the two apart. So the colour nouns are written bare, which is
# what a label says in Shona anyway. This is the same trade `locales/sw` makes,
# and for the same reason.
#
# Adjectives follow the noun, so the composition messages put the noun first.
# `$role` goes unused: Shona marks no case.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] mutema
            [c5] dema
            [c7] chitema
           *[c9] nhema
        }
    .white =
        { $gender ->
            [c3] muchena
            [c5] jena
            [c7] chichena
           *[c9] chena
        }
    .gray = girei
    .red =
        { $gender ->
            [c3] mutsvuku
            [c5] dzvuku
            [c7] chitsvuku
           *[c9] tsvuku
        }
    .orange = orenji
    .yellow = yero
    .green = girini
    .cyan = sayani
    .blue = bhuruu
    .purple = pepuru
    .pink = pingi
    .brown = bhurauni

line-width =
    .thick =
        { $gender ->
            [c3] mukobvu
            [c5] gobvu
            [c7] chikobvu
           *[c9] hobvu
        }
    .thin =
        { $gender ->
            [c3] mutete
            [c5] dete
            [c7] chitete
           *[c9] tete
        }

# Written as invariable «ane …» phrases rather than as adjectives, so that they
# agree with nothing and can close the description. `style-stroke` puts them
# last for that reason.
line-style =
    .dashed = ane zvidimbu
    .dotted = ane madotsi

fill-style =
    .horizontal = mitsara yakarara
    .vertical = mitsara yakamira
    .diagonal = mitsara yakatsveyama
    .backdiagonal = mitsara yakatsveyama kumashure
    .dots = madotsi
    .diamonds = madhaimondi

noun =
    .line = mutsara
    .line-segment = chidimbu chemutsara
    .ray = mwaranzi
    .vector = vhekita
    .curve = chikombamiro
    .function = basa
    .parabola = parabhora
    .polyline = mitsara yakabatana
    .polygon = poligoni
    .triangle = tirayangoni
    .rectangle = rekitangoni
    .circle = denderedzwa
    .region = nzvimbo
    .point = poindi
    .square = sikweya
    .diamond = dhaimondi
    .cross = muchinjikwa
    .plus = chiratidzo chekuwedzera

# The side count goes in the tail, behind the adjectives, because «ine mativi
# 5» is a relative phrase and Shona closes a noun phrase with it rather than
# opening one.
noun-regular-polygon =
    { $part ->
        [tail] ine mativi { $numSides }
       *[head] poligoni yakaenzana
    }

noun-gender =
    { $noun ->
        [line] c3
        [ray] c3
        [cross] c3
        [border] c3
        [line-segment] c7
        [region] c9
        [circle] c5
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
        [c3] wakazadzwa
        [c5] rakazadzwa
        [c7] chakazadzwa
       *[c9] yakazadzwa
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ne{ $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ne{ $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ne{ $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «muganhu» is class 3 and leads its own adjectives, so the border's words
# agree with it and not with the shape it surrounds. Shona has no article, so
# the two `-article` branches read like the two without, and «une» — a relative
# «having» rather than a conjunction — opens the clause wherever it lands, so
# `[and]` reads like `[with]` as well. All four end up the same string.
style-border-clause =
    { $parts ->
        [with-article] une muganhu { $border }
        [and] une muganhu { $border }
        [and-article] une muganhu { $border }
       *[with] une muganhu { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = isina kuzadzwa

style-text =
    { $parts ->
        [background] { $color } pamusoro pechigadziko { $background }
       *[plain] { $color }
    }

style-background-none = hapana


## Boolean words

boolean-true = chokwadi
# «nhema» is also the class 9 word for black, three blocks above this one; the
# word for a falsehood here is «manyepo», which is not.
boolean-false = manyepo


## Answer buttons

answer-submit-label = Ongorora Basa
answer-submit-label-no-correctness = Tumira Mhinduro


## Sectional blocks

section-name =
    .activity = Chiitiko
    .aside = Rutivi
    .cascade = Kasikedhi
    .definition = Tsanangudzo
    .example = Muenzaniso
    .exercise = Kudzidzira
    .exercises = Kudzidzira
    .given-answer = Mhinduro
    .note = Cherechedzo
    .objectives = Zvinangwa
    .paragraphs = Ndima
    .part = Chikamu
    .problem = Dambudziko
    .problems = Matambudziko
    .proof = Uchapupu
    .question = Mubvunzo
    .section = Chikamu
    .solution = Gadziriso
    .task = Basa
    .theorem = Tiyoremu

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Zano


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tafura { $enumeration }
        [numbered-title] Tafura { $enumeration }{ ": " }
        [unnumbered-title] Tafura{ ": " }
       *[unnumbered] Tafura
    }

figure-name =
    { $parts ->
        [numbered] Mufananidzo { $enumeration }
        [numbered-caption] Mufananidzo { $enumeration }{ ": " }
        [unnumbered-caption] Mufananidzo{ ": " }
       *[unnumbered] Mufananidzo
    }


## Paginator controls

paginator-previous = Yapfuura
paginator-next = Inotevera
paginator-page = Peji

paginator-page-status = { $pageLabel } { $currentPage } pa{ $numPages }


## Piecewise functions

# Shona says «kana» for both "if" and "or", so the disjunction is written
# «kana kuti» to keep the two apart where a branch shows them side by side.
piecewise-condition-or = kana kuti
piecewise-condition-if = kana
piecewise-condition-otherwise = kana zvisina kudaro


## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Zimbabwean secondary science
# is taught in English, so a student meeting these words meets them in English
# already, and the seed has no settled Shona list to reproduce. A speaker
# adding one should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Chiratidzo cheKemisitiri Chisiri Icho
chemistry-invalid-ionic-compound = Musanganiswa weIoni Usiri Iwo
