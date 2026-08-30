# Crimean Tatar (qırımtatar tili) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script.** The **Latin alphabet** standardized for Crimean Tatar in Ukraine
# in 2021: `a b c ç d e f g ğ h i ı j k l m n ñ o ö p q r s ş t u ü v y z`.
# `q` is the uvular stop («qara», «yoq»), `ñ` the velar nasal, and `i`/`ı` are
# two different letters. The **Cyrillic orthography is equally current** among
# readers in Crimea; a reviewer who prefers it must transliterate all four
# files of this locale at once and must not mix the two alphabets inside a
# catalog. `chrome.ftl`'s header states that at length.
#
# **Word order: the modifier comes before the noun.** Crimean Tatar is Turkic,
# and an attributive adjective precedes its head exactly as in English —
# «qalın qırmızı doğru» is *thick red line*, in that order. So the composition
# messages below keep the order English uses, and the only place this catalog
# reorders anything is `style-text` and `style-border-clause`, where a
# postposition or a derived suffix wants the description in front of it.
#
# **How modifiers attach.** Crimean Tatar is agglutinative, and every suffix
# that would matter here lands on the **noun**, not on the adjectives stacked
# in front of it: an attributive adjective takes no ending at all and does not
# agree with anything. That is why nothing below forks on `$gender` or
# `$role`. Two messages get their sense from a suffix rather than from a
# separate word — «kenarlı» *having a border* in `style-border-clause` and
# «tolğan»/«boş» in `style-filled-word`/`style-unfilled` — and in both the
# suffix sits on a word this catalog writes itself, never on a placeable, so
# nothing is welded to a value the catalog cannot see.
#
# **No grammatical gender.** Crimean Tatar has none. `noun-gender` answers a
# single token for every noun and the answer is never read.
#
# **Number.** A noun after a numeral is unmarked («3 noqta», not
# «3 noqtalar»), so no message here varies with a count. `Intl.PluralRules`
# has no CLDR data for `crh`, so no plural-category branch is written in any
# of these four files.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Chemistry in Crimea is taught from Russian textbooks and in Ukraine from
# Ukrainian ones; there is no Crimean Tatar periodic table in general school
# use, and no settled Latin-orthography spelling for the hundred and eighteen
# element names — a Crimean Tatar chemist writes them in Russian. Filling the
# table would mean transliterating the Russian list and presenting the result
# as a nomenclature, which it is not. `lint:i18n` reports the two keys as
# missing coverage and that report is accurate.
# `ion-name-oxidation-state` and the two invalid-symbol messages **are**
# covered: they are frames and punctuation rather than vocabulary.
#
# **Loans kept, rather than coined.** «funktsiya», «parabola», «poligon»,
# «vektor», «kvadrat», «romb», «variant», «statistika», «teorema»,
# «paragraf», «kaskad», «diagramma» — Russian-mediated international
# vocabulary, spelled as Crimean Tatar spells it. From Turkish: «turuncı»
# (orange), «pembe» (pink), «ışın» (ray), «eşkenar» in the shape names, and
# «kenarlı». **«siyan»** for *cyan* is a bare loan and the weakest word in the
# file: Crimean Tatar has «mavi» for blue and «kök» for the blue-green of the
# sky, and a speaker may well prefer «açıq mavi» or «kök» here. «qoñur»
# (brown) and «boz» (grey) are native and should be checked first, since both
# also name animal colours and a reviewer may want a more neutral word.


## Style vocabulary

color =
    .black = qara
    .white = aq
    .gray = boz
    .red = qırmızı
    .orange = turuncı
    .yellow = sarı
    .green = yeşil
    .cyan = siyan
    .blue = mavi
    .purple = mor
    .pink = pembe
    .brown = qoñur
line-width =
    .thick = qalın
    .thin = ince
line-style =
    .dashed = kesikli
    .dotted = noqtalı
# Noun phrases: they name the pattern and modify nothing.
fill-style =
    .horizontal = yatıq sızıqlar
    .vertical = tik sızıqlar
    .diagonal = köşegen sızıqlar
    .backdiagonal = ters köşegen sızıqlar
    .dots = noqtalar
    .diamonds = rombçıqlar
noun =
    .line = doğru
    .line-segment = doğru parçası
    .ray = ışın
    .vector = vektor
    .curve = egri
    .function = funktsiya
    .slope-field = eğim meydanı
    .vector-field = vektor meydanı
    .parabola = parabola
    .polyline = sınıq sızıq
    .polygon = poligon
    .triangle = üçköşe
    .rectangle = tuvra dörtköşe
    .circle = çember
    .region = bölge
    .point = noqta
    .square = kvadrat
    .diamond = romb
    .cross = çarpı
    .plus = artı
# Crimean Tatar builds the whole phrase before the noun, so the side count is
# part of the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] düzgün { $numSides } köşeli poligon
    }
# Crimean Tatar has no grammatical gender: one answer for every noun, and it
# is never read.
noun-gender = neuter


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
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
style-filled-word = tolğan
style-filled =
    { $parts ->
        [pattern] { $pattern } desenli { $color } { $filled }
       *[plain] { $color } { $filled }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } desenli { $color } { $filled } { $noun }
        [plain-tail] { $color } { $filled } { $noun } { $nounTail }
        [pattern-tail] { $pattern } desenli { $color } { $filled } { $noun } { $nounTail }
       *[plain] { $color } { $filled } { $noun }
    }
# «kenarlı» — *having a border* — carries in its own suffix everything English
# says with a preposition and an article, so the description simply stands in
# front of it and the four branches differ only by the conjunction Crimean
# Tatar needs and English does not.
style-border-clause =
    { $parts ->
        [with-article] { $border } kenarlı
        [and] ve { $border } kenarlı
        [and-article] ve { $border } kenarlı
       *[with] { $border } kenarlı
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = boş
# The background is named first, behind the postposition «üstünde», and the
# text colour follows it — the reverse of the English order.
style-text =
    { $parts ->
        [background] { $background } zemin üstünde { $color }
       *[plain] { $color }
    }
style-background-none = yoq


## Boolean words

boolean-true = doğru
boolean-false = yañlış


## Answer buttons

answer-submit-label = Teşker
answer-submit-label-no-correctness = Cevapnı yiber


## Sectional blocks

section-name =
    .activity = Faaliyet
    .aside = Yan qayd
    .cascade = Kaskad
    .definition = Tarif
    .example = Misal
    .exercise = Alıştırma
    .exercises = Alıştırmalar
    .given-answer = Cevap
    .note = Qayd
    .objectives = Maqsatlar
    .paragraphs = Paragraflar
    .part = Qısım
    .problem = Mesele
    .problems = Meseleler
    .proof = İsbat
    .question = Sual
    .section = Bölük
    .solution = Çezüv
    .task = Vazife
    .theorem = Teorema
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = İpucu


## Tables and figures

table-name =
    { $parts ->
        [numbered] Cedvel { $enumeration }
        [numbered-title] Cedvel { $enumeration }{ ": " }
        [unnumbered-title] Cedvel{ ": " }
       *[unnumbered] Cedvel
    }
figure-name =
    { $parts ->
        [numbered] Resim { $enumeration }
        [numbered-caption] Resim { $enumeration }{ ": " }
        [unnumbered-caption] Resim{ ": " }
       *[unnumbered] Resim
    }


## Paginator controls

paginator-previous = Evelki
paginator-next = Soñraki
paginator-page = Sahife
paginator-page-status = { $numPages } { $pageLabel } içinden { $currentPage }


## Piecewise functions

piecewise-condition-or = ya da
piecewise-condition-if = eger
piecewise-condition-otherwise = aksi taqdirde


## Chemistry
##
## `element-name` and `element-anion-name` are omitted; the header says why.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Keçersiz kimyeviy işaret
chemistry-invalid-ionic-compound = Keçersiz ion bileşimi


## Inputs embedded in math

math-embedded-input-blank = boş
math-embedded-input-blank-ordinal = { $total } boştan { $ordinal }.
