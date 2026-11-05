# Talysh content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** orthography Talysh publishing in Azerbaijan uses —
# the Azerbaijani alphabet, with ə, ı, ö, ü, ğ, ş and ç. That is what the
# language's own periodicals print and what CLDR answers with:
# `Intl.Locale("tly").maximize()` is `tly-Latn-AZ`. Talysh is also written in
# Cyrillic, and in Iran in the Perso-Arabic script, and a reader arriving under
# `tly-Cyrl` or `tly-Arab` reaches this catalog and gets Latin. A second
# catalog beside this one is the answer to that, not a rename of this one —
# the same asymmetry `locales/pa`, `locales/sr`, `locales/jv` and `locales/kmr`
# already carry.
#
# **Talysh has no grammatical gender and no noun class**, as Persian and
# Ossetic have none. `noun-gender` below answers `neuter` for every noun, the
# answer goes unused, and not one message in this file forks on `$gender` or on
# `$role`. This catalog was seeded in a batch full of Northeast Caucasian and
# Nakh class systems, where a fork is the normal shape, so it is worth saying
# outright: there is nothing to fork here, and a table of classes added later
# would be describing a language other than this one.
#
# **The colour table is the first thing to read, and part of it is a choice
# rather than a translation.** Talysh's inherited colour vocabulary does not
# split where the style pipeline needs it split: «kavu» covers blue and
# blue-grey and reaches into green, and the green/blue/cyan contrast the
# pipeline draws is not one the language draws in one word each. So this
# catalog writes the compounds that split it — «vaşi rang», grass-colour, for
# green, «osmoni rang», sky-colour, for blue, and «ravşanə osmoni rang» for
# cyan. That is the move `locales/sah` and `locales/os` already made for the
# same reason, and it is a decision a speaker may reverse; if they do, they
# should reverse it in this table rather than in the composition messages.
#
# Attributive adjectives **precede** their noun in Talysh, as they do in
# English, so the style descriptions keep English's order and the composition
# messages below are unrearranged. The adjectives carry the attributive «-ə»
# where they take one; the colours that end in «-i» or in a vowel do not.
#
# The affix rule is met once, in `style-border-clause` and `style-filled`:
# "with a red border" is written «{ $border } kənordor», border-having, and
# "with diamonds" «{ $pattern } nəxşdorə», pattern-having, so the suffix lands
# on a noun this catalog supplies rather than on a placeable whose shape it
# cannot see.
#
# **Least certain here:** the geometry nouns. «çandkunc», «sekunc»,
# «rostəkunc», «şıkəstə xət» and «meyli meydon» are built on Talysh stems the
# way Azerbaijani builds its own, but Talysh has no school geometry of its own
# to check them against, and a speaker who has read mathematics in the language
# should overwrite them without hesitating.


## Style vocabulary

color =
    .black = siyo
    .white = sipi
    .gray = xokəsti
    .red = sıə
    .orange = narinci
    .yellow = zard
    .green = vaşi rang
    .cyan = ravşanə osmoni rang
    .blue = osmoni rang
    .purple = bənəvşəyi
    .pink = çəhrayi
    .brown = ğəhvəyi
line-width =
    .thick = kuluftə
    .thin = nozıkə
line-style =
    .dashed = tirəyinə
    .dotted = nuğtəyinə
# Noun phrases: they stand in front of «nəxşdorə» and modify nothing.
fill-style =
    .horizontal = üfüqiyə xəton
    .vertical = şaquliyə xəton
    .diagonal = diaqonalə xəton
    .backdiagonal = əkəs diaqonalə xəton
    .dots = nuğtəon
    .diamonds = rombon
noun =
    .line = xət
    .line-segment = xəti poə
    .ray = şüə
    .vector = vektor
    .curve = kəcə xət
    .function = funksiya
    .slope-field = meyli meydon
    .vector-field = vektori meydon
    .parabola = parabola
    .polyline = şıkəstə xət
    .polygon = çandkunc
    .triangle = sekunc
    .rectangle = rostəkunc
    .circle = doyrə
    .region = sahə
    .point = nuğtə
    .square = kvadrat
    .diamond = romb
    .cross = xaç
    .plus = plyus
# «-kunc» is welded to the side count, which is safe for `locales/tlh`'s
# reason rather than by luck: the stem has one shape whatever number precedes
# it. The whole of the word is the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] müntəzəmə { $numSides }-kunc
    }
# Talysh has no grammatical gender, so every noun answers the same and the
# answer goes unused.
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
style-filled-word = purə
# «nəxşdorə» — "pattern-having" — is written after the pattern words this
# catalog supplies, so the suffix sits on a noun of its own rather than on a
# placeable, and no preposition is wanted.
style-filled =
    { $parts ->
        [pattern] { $pattern } nəxşdorə { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } nəxşdorə { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } nəxşdorə { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# «kənordor» — "border-having" — is the same construction, and Talysh wants
# neither an article nor a preposition in front of it, so the four branches
# differ only in the conjunction.
style-border-clause =
    { $parts ->
        [with-article] { $border } kənordor
        [and] iyən { $border } kənordor
        [and-article] iyən { $border } kənordor
       *[with] { $border } kənordor
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = pur nıbə
# «-ədə» is a locative on the catalog's own word «fon», and it stands in front
# of the text colour, which is where a Talysh clause of place goes.
style-text =
    { $parts ->
        [background] { $background } fonədə { $color }
       *[plain] { $color }
    }
style-background-none = ni


## Boolean words

boolean-true = rost
boolean-false = rost ni


## Answer buttons

answer-submit-label = Kor yoxlə kardey
answer-submit-label-no-correctness = Cəvob vığandey


## Sectional blocks

section-name =
    .activity = Fəoliyət
    .aside = Kənoə ğeyd
    .cascade = Kaskad
    .definition = Tərif
    .example = Nımunə
    .exercise = Təmrin
    .exercises = Təmrinon
    .given-answer = Cəvob
    .note = Ğeyd
    .objectives = Məğsədon
    .paragraphs = Abzason
    .part = Poə
    .problem = Məsələ
    .problems = Məsələon
    .proof = İsbot
    .question = Soal
    .section = Bəxş
    .solution = Həll
    .task = Tapşırığ
    .theorem = Teorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = İşorə


## Tables and figures

table-name =
    { $parts ->
        [numbered] Cədvəl { $enumeration }
        [numbered-title] Cədvəl { $enumeration }{ ". " }
        [unnumbered-title] Cədvəl{ ". " }
       *[unnumbered] Cədvəl
    }
figure-name =
    { $parts ->
        [numbered] Şəkil { $enumeration }
        [numbered-caption] Şəkil { $enumeration }{ ". " }
        [unnumbered-caption] Şəkil{ ". " }
       *[unnumbered] Şəkil
    }


## Paginator controls

paginator-previous = Navınə
paginator-next = Peşinə
paginator-page = Səhifə
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions
##
## Talysh's conditional «əqər» opens its clause, as Persian's «agar» does, so
## `piecewise-condition-if` lands where the renderer puts it — in front of the
## mathematics it introduces. This catalog therefore records no limit here,
## unlike `locales/sah`, `locales/tyv`, `locales/udm`, `locales/kpv` and
## `locales/mhr`, whose conditionals close their clause.

piecewise-condition-or = ya
piecewise-condition-if = əqər
piecewise-condition-otherwise = əks holədə


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. This is the school-system case, and for
## Talysh it is a two-country one: there is no single school system to point
## at. Secondary chemistry is taught in Azerbaijani in Azerbaijan and in
## Persian in Iran, and Talysh is a language of the home and the newspaper on
## both sides of that border rather than of the chemistry lesson on either. So
## the element names a Talysh-speaking pupil has actually met are Azerbaijani
## or Persian ones, and an invented Talysh table would be further from every
## classroom than the English fallback is.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Səhvə kimyəvi işorə
chemistry-invalid-ionic-compound = Səhvə ionə tərkib
