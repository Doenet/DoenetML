# Gagauz (gagauz dili) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Latin alphabet official in Gagauzia (Moldova) since
# 1996: `ș` for sh (not Turkish `ş`), `ț` for ts, `ä` for the open front
# vowel, `ê` for the vowel of the «-êr» present tense, and `ç c ö ü ı i` with
# their Turkish values. The pre-1993 Cyrillic alphabet is not used anywhere in
# these four files and must not be mixed into them. `chrome.ftl`'s header sets
# the alphabet out letter by letter.
#
# **Word order: the modifier comes before the noun.** Gagauz is Turkic, and an
# attributive adjective stands in front of its head just as in English —
# «kalın kırmızı çizgi» is *thick red line*, in that order. So the composition
# messages keep the English order. Two of them reorder: `style-text` puts the
# background first, behind the postposition «üstündä», and
# `style-border-clause` puts the description in front of the derived word
# «kenarlı», because a postposition and a suffix both follow what they govern
# in Gagauz.
#
# **How modifiers attach.** Gagauz is agglutinative and every ending that
# matters here lands on the **noun**; an attributive adjective takes no ending
# and agrees with nothing. That is why no message forks on `$gender` or
# `$role`. Where a word gets its sense from a suffix — «kenarlı» *having a
# border*, «dolu» *filled*, «boș» *unfilled* — the suffix sits on a word this
# catalog writes itself, never on a placeable whose vowels it cannot see.
#
# **No grammatical gender.** Gagauz has none; `noun-gender` answers a single
# token that nothing reads.
#
# **Number.** A noun after a numeral is unmarked («3 nokta», not
# «3 noktalar»), so nothing here varies with a count, and `Intl.PluralRules`
# has no CLDR data for `gag` in any case. No plural-category branch appears in
# any of these four files.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Chemistry in Gagauzia is taught in Russian and in Romanian, from Russian and
# Romanian textbooks; there is no Gagauz periodic table in school use and no
# settled Gagauz spelling for the hundred and eighteen names. Writing one out
# would be transliterating the Russian list and calling the result a Gagauz
# nomenclature. `lint:i18n` reports the two keys as missing coverage and that
# is the correct report. `ion-name-oxidation-state` and the two
# invalid-symbol messages **are** covered — they are frames, not vocabulary.
#
# **Loans kept, rather than coined.** Russian-mediated: «funkțiya»,
# «parabola», «poligon», «vektor», «kvadrat», «romb», «variant», «teorema»,
# «paragraf», «kaskad», «problema», «tablița», «diagramma». Romanian-mediated
# or shared Balkan: «aktivitet», «definițiya», «portokal» (the fruit, hence
# the colour). From Turkish, where Gagauz and Turkish simply agree: «üçgen»,
# «dikdörtgen», «çember», «ıșın», «ipucu», «kahvä rengi». **«siyan»** is a
# bare loan and the weakest word here — Gagauz has «mavi» for blue and no
# settled word for cyan, and a speaker may prefer «açık mavi».
#
# **One word does two jobs**, as it does in Turkish: «dooru» is both the
# geometric *line* (`noun.line`) and the boolean *true* (`boolean-true`). That
# is the language's own homonymy, not a copy-paste slip, and the two keys are
# deliberately the same word.


## Style vocabulary

color =
    .black = kara
    .white = ak
    .gray = boz
    .red = kırmızı
    .orange = portokal rengi
    .yellow = sarı
    .green = yeșil
    .cyan = siyan
    .blue = mavi
    .purple = mor
    .pink = pembä
    .brown = kahvä rengi
line-width =
    .thick = kalın
    .thin = incä
line-style =
    .dashed = kesikli
    .dotted = noktalı
# Noun phrases: they name the pattern and modify nothing.
fill-style =
    .horizontal = yatık çizgilär
    .vertical = dik çizgilär
    .diagonal = köșegen çizgilär
    .backdiagonal = ters köșegen çizgilär
    .dots = noktalar
    .diamonds = romblar
noun =
    .line = dooru
    .line-segment = dooru payı
    .ray = ıșın
    .vector = vektor
    .curve = iiri
    .function = funkțiya
    .slope-field = eegim alanı
    .vector-field = vektor alanı
    .parabola = parabola
    .polyline = kırık çizgi
    .polygon = poligon
    .triangle = üçgen
    .rectangle = dikdörtgen
    .circle = çember
    .region = bölgä
    .point = nokta
    .square = kvadrat
    .diamond = romb
    .cross = çarpı
    .plus = artı
# Gagauz builds the whole phrase in front of the noun, so the side count is
# part of the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } köșeli düzgün poligon
    }
# Gagauz has no grammatical gender: one answer for every noun, never read.
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
style-filled-word = dolu
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
# «kenarlı» — *having a border* — says with one suffix what English says with
# a preposition and an article, so the description simply stands in front of
# it and the four branches differ only by the conjunction.
style-border-clause =
    { $parts ->
        [with-article] { $border } kenarlı
        [and] hem { $border } kenarlı
        [and-article] hem { $border } kenarlı
       *[with] { $border } kenarlı
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = boș
# The background comes first, behind the postposition «üstündä».
style-text =
    { $parts ->
        [background] { $background } fon üstündä { $color }
       *[plain] { $color }
    }
style-background-none = yok


## Boolean words

boolean-true = dooru
boolean-false = yannıș


## Answer buttons

answer-submit-label = İși bak
answer-submit-label-no-correctness = Cuvabı yolla


## Sectional blocks

section-name =
    .activity = Aktivitet
    .aside = Yan yazı
    .cascade = Kaskad
    .definition = Definițiya
    .example = Örnek
    .exercise = Alıștırma
    .exercises = Alıștırmalar
    .given-answer = Cuvap
    .note = Not
    .objectives = Amaçlar
    .paragraphs = Paragraflar
    .part = Pay
    .problem = Problema
    .problems = Problemalar
    .proof = İspat
    .question = Sorgu
    .section = Bölüm
    .solution = Çözüm
    .task = Ödev
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
        [numbered] Tablița { $enumeration }
        [numbered-title] Tablița { $enumeration }{ ": " }
        [unnumbered-title] Tablița{ ": " }
       *[unnumbered] Tablița
    }
figure-name =
    { $parts ->
        [numbered] Resim { $enumeration }
        [numbered-caption] Resim { $enumeration }{ ": " }
        [unnumbered-caption] Resim{ ": " }
       *[unnumbered] Resim
    }


## Paginator controls

paginator-previous = Öncäki
paginator-next = Sonraki
paginator-page = Sayfa
paginator-page-status = { $numPages } { $pageLabel } içindän { $currentPage }


## Piecewise functions

piecewise-condition-or = yada
piecewise-condition-if = eer
piecewise-condition-otherwise = başka türlü


## Chemistry
##
## `element-name` and `element-anion-name` are omitted; the header says why.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Geçersiz himiya simvolu
chemistry-invalid-ionic-compound = Geçersiz ion birleșmesi


## Inputs embedded in math

math-embedded-input-blank = boș
math-embedded-input-blank-ordinal = { $total } boștan { $ordinal }.
