# Luganda content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The roster calls this language **Ganda**, which is what `Intl.DisplayNames`
# renders `lg` as and so what `<document lang>`'s autocomplete offers. Luganda
# is the name its speakers use, and the two are one language — the same split
# `ny` has, where the roster says Nyanja and the speakers say Chichewa.
#
# Luganda has no masculine or feminine, and it agrees an adjective with its
# noun's **class**, so this catalog reads `$gender` as the class token rather
# than as a gender — the same device `locales/sw` uses. `noun-gender` answers
# `c3`, `c5`, `c7`, `c9`, `c11` or `c12`, and every adjective that carries a
# concord selects on it.
#
# Six classes is the widest table in this batch, and the reason is that
# Luganda's own geometry words land in classes the other Bantu catalogs here
# never need: «olunyiriri», a line, is class 11, and «akasaale», a ray, and
# «akatonnyeze», a point, are class 12 — the diminutive, which is where a small
# thing goes whether or not it is small on purpose.
#
#           c3 (omu-)   c5 (eri-)    c7 (eki-)    c9 (en-)     c11 (olu-)   c12 (aka-)
#   -ddugavu omuddugavu eriddugavu   ekiddugavu   enzirugavu   oluddugavu   akaddugavu
#   -yeru    omweru     eryeru       ekyeru       enjeru       olweru       akeeru
#   -myufu   omumyufu   erimyufu     ekimyufu     emmyufu      olumyufu     akamyufu
#   -nene    omunene    erinene      ekinene      ennene       olunene      akanene
#   -tono    omutono    eritono      ekitono      entono       olutono      akatono
#   -jjuvu   omujjuvu   erijjuvu     ekijjuvu     enjjuvu      olujjuvu     akajjuvu
#
# The initial vowel is part of the word, not an article: «omuddugavu» is one
# word and dropping the «o» does not make it indefinite, it makes it wrong.
#
# `c9` is the default, because that is the class a loanword joins — and an
# author's own `markerStyleWord`, which this catalog has never seen, is a
# loanword as far as it is concerned.
#
# Only the three colours with a native adjective stem inflect. The rest are
# invariable nouns, joined attributively with the associative of the class
# («olunyiriri olunene *olwa* kiragala»). The associative is computable from
# `$gender`, but the same string is what `backgroundColor` reports standing
# alone, where a bare associative would be ungrammatical, and nothing in
# `$role` tells the two apart. So the colour nouns are written bare — the same
# trade `locales/sw` makes.
#
# Adjectives follow the noun, so the composition messages put the noun first.
# `$role` goes unused: Luganda marks no case.
#
# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black =
        { $gender ->
            [c3] omuddugavu
            [c5] eriddugavu
            [c7] ekiddugavu
            [c11] oluddugavu
            [c12] akaddugavu
           *[c9] enzirugavu
        }
    .white =
        { $gender ->
            [c3] omweru
            [c5] eryeru
            [c7] ekyeru
            [c11] olweru
            [c12] akeeru
           *[c9] enjeru
        }
    .gray = kiwuka
    .red =
        { $gender ->
            [c3] omumyufu
            [c5] erimyufu
            [c7] ekimyufu
            [c11] olumyufu
            [c12] akamyufu
           *[c9] emmyufu
        }
    .orange = mucungwa
    .yellow = kyenvu
    .green = kiragala
    .cyan = sayani
    .blue = bbululu
    .purple = kakobe
    .pink = pinki
    .brown = kikanvu
line-width =
    .thick =
        { $gender ->
            [c3] omunene
            [c5] erinene
            [c7] ekinene
            [c11] olunene
            [c12] akanene
           *[c9] ennene
        }
    .thin =
        { $gender ->
            [c3] omutono
            [c5] eritono
            [c7] ekitono
            [c11] olutono
            [c12] akatono
           *[c9] entono
        }
# Written as invariable «olwa …» phrases rather than as adjectives, so that
# they agree with nothing and can close the description. `style-stroke` puts
# them last for that reason.
line-style =
    .dashed = olw'obutundutundu
    .dotted = olw'obutonnyeze
fill-style =
    .horizontal = ennyiriri ezigalamidde
    .vertical = ennyiriri eziyimiridde
    .diagonal = ennyiriri ezisenzeeko
    .backdiagonal = ennyiriri ezisenzeeko emabega
    .dots = obutonnyeze
    .diamonds = daayimondi
noun =
    .line = olunyiriri
    .line-segment = ekitundu ky'olunyiriri
    .ray = akasaale
    .vector = vekita
    .curve = ekikoona
    .function = omulimu
    .parabola = paraboola
    .polyline = ennyiriri ez'awamu
    .polygon = poligoni
    .triangle = ekisatu
    .rectangle = eky'enjuyi ennya
    .circle = enkulungo
    .region = ekitundu
    .point = akatonnyeze
    .square = ekyenkanyi
    .diamond = daayimondi
    .cross = omusaalaba
    .plus = akabonero k'okugatta
# The side count goes in the tail, behind the adjectives, because «erina
# enjuyi 5» is a relative clause and Luganda closes a noun phrase with one
# rather than opening one.
noun-regular-polygon =
    { $part ->
        [tail] erina enjuyi { $numSides }
       *[head] poligoni enkanyi
    }
noun-gender =
    { $noun ->
        [line] c11
        [polyline] c11
        [border] c11
        [ray] c12
        [point] c12
        [line-segment] c7
        [region] c7
        [triangle] c7
        [rectangle] c7
        [square] c7
        [fill] c7
        [cross] c3
        [function] c3
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
        [c3] omujjuvu
        [c5] erijjuvu
        [c7] ekijjuvu
        [c11] olujjuvu
        [c12] akajjuvu
       *[c9] enjjuvu
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } n'{ $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } n'{ $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } n'{ $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «olukugiro» is class 11 and leads its own adjectives, so the border's words
# agree with it and not with the shape it surrounds. Luganda has no article, so
# the two `-article` branches read like the two without, and the complement is
# joined with the invariable «ne» — «n'» before a vowel — whether it is the
# first clause or a further one, so `[and]` reads like `[with]` as well. All
# four end up the same string.
style-border-clause =
    { $parts ->
        [with-article] n'olukugiro { $border }
        [and] n'olukugiro { $border }
        [and-article] n'olukugiro { $border }
       *[with] n'olukugiro { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = tejjuzibbwa
style-text =
    { $parts ->
        [background] { $color } ku mabega { $background }
       *[plain] { $color }
    }
style-background-none = tewali

## Boolean words

boolean-true = kituufu
boolean-false = bulimba

## Answer buttons

answer-submit-label = Kebera Omulimu
answer-submit-label-no-correctness = Weereza Eky'okuddamu

## Sectional blocks

section-name =
    .activity = Omulimu
    .aside = Ekigambo eky'oku ludda
    .cascade = Kasukeedi
    .definition = Ennyinyonnyola
    .example = Ekyokulabirako
    .exercise = Okwegezaamu
    .exercises = Okwegezaamu
    .given-answer = Eky'okuddamu
    .note = Ekijjukizo
    .objectives = Ebiruubirirwa
    .paragraphs = Obutundu
    .part = Ekitundu
    .problem = Ekizibu
    .problems = Ebizibu
    .proof = Obukakafu
    .question = Ekibuuzo
    .section = Ekitundu
    .solution = Eky'okugonjoola
    .task = Omulimu
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
hint-title = Amagezi

## Tables and figures

table-name =
    { $parts ->
        [numbered] Ttebulo { $enumeration }
        [numbered-title] Ttebulo { $enumeration }{ ": " }
        [unnumbered-title] Ttebulo{ ": " }
       *[unnumbered] Ttebulo
    }
figure-name =
    { $parts ->
        [numbered] Ekifaananyi { $enumeration }
        [numbered-caption] Ekifaananyi { $enumeration }{ ": " }
        [unnumbered-caption] Ekifaananyi{ ": " }
       *[unnumbered] Ekifaananyi
    }

## Paginator controls

paginator-previous = Ekiyise
paginator-next = Ekiddako
paginator-page = Olupapula
paginator-page-status = { $pageLabel } { $currentPage } ku { $numPages }

## Piecewise functions

piecewise-condition-or = oba
piecewise-condition-if = singa
piecewise-condition-otherwise = bwe kitaba bwe kityo

## Chemistry

# The 118 element names and the 12 anion names are left out, so those keys fall
# back to English and `lint:i18n` reports the gap. Ugandan secondary science is
# taught in English, so a student meeting these words meets them in English
# already, and the seed has no settled Luganda list to reproduce. A speaker
# adding one should add it here.
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Akabonero ka Kemikaali Akatatuufu
chemistry-invalid-ionic-compound = Ekitabuliddwa kya Ayoni Ekitatuufu
