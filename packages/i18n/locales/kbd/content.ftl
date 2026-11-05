# Kabardian (East Circassian) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic literary standard of Kabardino-Balkaria and
# Karachay-Cherkessia — the orthography the republics' schools, their
# newspapers and their textbook publishing use, and what CLDR fills a bare
# `kbd` in as (`kbd` maximizes to `kbd-Cyrl-RU`). Kabardian and Adyghe are two
# written standards over one Circassian continuum; this catalog is the eastern
# one and is not `locales/ady`, which is the western one and was seeded
# separately.
#
# **The palochka Ӏ is a letter of the alphabet.** It is neither a Latin capital
# I nor a digit 1, and Kabardian cannot be read without it: «фӀыцӀэ» (black),
# «щхъуантӀэ» (green), «Ӏув» (thick) and «Ӏыхьэ» (part) all turn into different
# words or into nothing at all if it is typed as `I` or `1`. This file uses
# U+04C0 throughout, inside lowercase words as well, which is how Kabardian
# printing sets it.
#
# Kabardian counts in two plural categories, `one` and `other`. Nothing in this
# file selects on a count.
#
# **Kabardian has no grammatical gender and no noun classes, and an attributive
# adjective agrees with nothing** — it takes no prefix, no suffix and no
# concord. So `noun-gender` answers one token for everything and not a single
# message below forks on `$gender` or on `$role`. That is the opposite answer
# from `locales/ce`, the exemplar this catalog was written against: Chechen is
# Nakh and has a real four-way class system, and Kabardian is Northwest
# Caucasian and has none. Two Caucasian languages, one script, two answers.
#
# **An attributive adjective FOLLOWS its noun in Kabardian** — «хъурей плъыжь»
# is a red circle, «линэ занщӀэ Ӏув» a thick straight line — so every
# composition message below puts the noun first and the describing words after
# it, which is the reverse of the English frame. Among the adjectives
# themselves the relative order is English's: width, then dash pattern, then
# colour, the way `locales/ga`, `locales/gd` and `locales/br` run their
# postnominal strings. A numeral also follows its noun («сатыр 5», line 5),
# which is why the counted messages in the other three files read noun-first.
#
# **Adjective and noun very often form a compound in Kabardian, and this
# catalog cannot write one.** The tight construction welds the describing word
# onto the noun's stem, and in `style-with-noun` the noun arrives as
# `{ $noun }` — a value the catalog never sees. So the loose, juxtaposed
# construction is written throughout, which is grammatical everywhere and is
# what a Kabardian technical description uses anyway. This is the README's
# affix rule reached through a compound rather than through a case ending.
#
# **Nothing here welds a case suffix onto a placeable, and Kabardian's oblique
# is exactly why it must not.** The oblique/ergative marker is «-м» after a
# vowel and «-ым» after a consonant, so its shape is decided by a word the
# catalog cannot see. Every place a case would have fallen on a value, the
# sentence is rebuilt around a free word instead — «иӀэу» (having), «щӀыгъуу»
# (together with), «тету» (standing on) — which is the README's third and fifth
# ways out taken together.
#
# **What a speaker should check first, in this order.** (1) The colour table:
# Circassian «щхъуантӀэ» historically covers green *and* blue, and the style
# pipeline needs those as two separate words, so this catalog splits them as
# «щхъуантӀэ» green against «къащхъуэ» blue — a choice, not a translation, and
# the same problem `locales/sah` and `locales/os` record for «күөх» and
# «цъæх». «гъуэжьыплъ» for orange, «шхъуэплъ» for purple and «плъыжьыфэ» for
# pink are modern compounds of the same kind; «гъуабжэ» grey and «гъуэплъ»
# brown are the two this seed is least sure of. (2) The polygon nouns, built on
# «къуапэ» (corner) with an incorporated numeral — «къуапищ» three-cornered,
# «къуапиплӀ» four-cornered — which is a real Circassian construction but one
# whose school-register spelling this seed could not check. (3) Whether the
# Russian loans naturalized with final -э (точкэ, линэ, функцэ, таблицэ) are the
# forms the mathematics textbooks print, or whether they keep the Russian -а.


## Style vocabulary
##
## No word here agrees with anything, so nothing forks. Every describing word
## is placed after the noun by the composition messages below.

color =
    .black = фӀыцӀэ
    .white = хужь
    .gray = гъуабжэ
    .red = плъыжь
    .orange = гъуэжьыплъ
    .yellow = гъуэжь
    .green = щхъуантӀэ
    .cyan = къащхъуэ нэху
    .blue = къащхъуэ
    .purple = шхъуэплъ
    .pink = плъыжьыфэ
    .brown = гъуэплъ
line-width =
    .thick = Ӏув
    .thin = псыгъуэ
line-style =
    .dashed = зэпыуда
    .dotted = точкэкӀэ гъэпса
# Noun phrases: they stand in front of «щӀыгъуу» and modify nothing.
fill-style =
    .horizontal = горизонталь линэ
    .vertical = вертикаль линэ
    .diagonal = диагональ линэ
    .backdiagonal = мыдрей диагональ линэ
    .dots = точкэ
    .diamonds = ромб
noun =
    .line = линэ занщӀэ
    .line-segment = линэ Ӏыхьэ
    .ray = нэбзий
    .vector = вектор
    .curve = линэ гъэша
    .function = функцэ
    .slope-field = наклон губгъуэ
    .vector-field = вектор губгъуэ
    .parabola = параболэ
    .polyline = линэ къута
    .polygon = къуапэкуэд
    .triangle = къуапищ
    .rectangle = къуапиплӀ захуэ
    .circle = хъурей
    .region = щӀыпӀэ
    .point = точкэ
    .square = квадрат
    .diamond = ромб
    .cross = жор
    .plus = плюс
# Kabardian would say «къуапитху» — five-cornered, with the numeral inside the
# word — and the count arrives as a placeable, so the numeral cannot be
# incorporated. The side count is written out as a trailing complement instead,
# the way `locales/es` writes «de 5 lados», and the composition messages put it
# behind the adjectives.
noun-regular-polygon =
    { $part ->
        [tail] къуапэ { $numSides } иӀэу
       *[head] къуапэкуэд захуэ
    }
# Kabardian has no grammatical gender and no noun classes, so every noun
# answers the same and the answer goes unused — as in English, and unlike
# `locales/ce` beside it.
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
# The noun leads and the describing words follow it, which is the whole of what
# Kabardian changes about this message.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
# «из» — full, filled. Nothing agrees with it, so it is written flat.
style-filled-word = из
# «щӀыгъуу» — "together with" — is a free word, so the pattern needs no case
# suffix welded to it.
style-filled =
    { $parts ->
        [pattern] { $pattern } щӀыгъуу { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } щӀыгъуу { $noun } { $filled } { $color }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $pattern } щӀыгъуу { $noun } { $filled } { $color } { $nounTail }
       *[plain] { $noun } { $filled } { $color }
    }
# «гъунапкъэ … иӀэу» — "having a … border" — carries the whole of what English
# says with a preposition and an article, so all four branches differ only in
# the connective, and «иӀэу» is a free word rather than a suffix on the value.
style-border-clause =
    { $parts ->
        [with-article] гъунапкъэ { $border } иӀэу
        [and] икӀи гъунапкъэ { $border } иӀэу
        [and-article] икӀи гъунапкъэ { $border } иӀэу
       *[with] гъунапкъэ { $border } иӀэу
    }
# The pattern is a noun and the colour describes it, so the colour follows —
# the reverse of English's order.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = изкъым
# «тету» — "standing on" — is a free postposition, so the background colour
# takes no ending it would have to agree with.
style-text =
    { $parts ->
        [background] фон { $background } тету { $color }
       *[plain] { $color }
    }
style-background-none = щыӀэкъым

## Boolean words

boolean-true = пэж
boolean-false = пцӀы

## Answer buttons

answer-submit-label = Лэжьыгъэр къэпщытэн
answer-submit-label-no-correctness = Жэуапыр егъэхьын

## Sectional blocks

section-name =
    .activity = Ӏуэхугъуэ
    .aside = Щхьэхуэ
    .cascade = Каскад
    .definition = Убзыхуныгъэ
    .example = Щапхъэ
    .exercise = Упражненэ
    .exercises = Упражненэхэр
    .given-answer = Жэуап
    .note = Гулъытэ
    .objectives = Мурадхэр
    .paragraphs = Абзацхэр
    .part = Ӏыхьэ
    .problem = Задачэ
    .problems = Задачэхэр
    .proof = Щыхьэтыгъэ
    .question = УпщӀэ
    .section = Пычыгъуэ
    .solution = ЗэхэгъэкӀыныгъэ
    .task = Лэжьыгъэ
    .theorem = Теоремэ
# The numeral follows the word it counts, as everywhere else in this catalog,
# and a numbered heading is closed with a period rather than a colon — the
# convention Kabardian publishing takes from Russian typography.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Чэнджэщ

## Tables and figures

table-name =
    { $parts ->
        [numbered] Таблицэ { $enumeration }
        [numbered-title] Таблицэ { $enumeration }{ ". " }
        [unnumbered-title] Таблицэ{ ". " }
       *[unnumbered] Таблицэ
    }
figure-name =
    { $parts ->
        [numbered] Сурэт { $enumeration }
        [numbered-caption] Сурэт { $enumeration }{ ". " }
        [unnumbered-caption] Сурэт{ ". " }
       *[unnumbered] Сурэт
    }

## Paginator controls

paginator-previous = Ипэрей
paginator-next = КӀэлъыкӀуэ
paginator-page = НапэкӀуэцӀ
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## `piecewise-condition-if` is the one key in this catalog that cannot land
## correctly, and it is recorded rather than worked around. Kabardian's
## conditional is a **suffix**, «-мэ», on the verb that closes the clause it
## conditions; there is no free word standing in front of a condition the way
## English's "if" does. The renderer places this message *before* the
## mathematics it introduces, so «хъумэ» — "if it is" — sits where Kabardian
## would never put it. That is the shape `locales/sah`, `locales/tyv`,
## `locales/udm`, `locales/kpv` and `locales/mhr` already record for their own
## clause-final conditionals; splitting the key into a prefix and a suffix
## would fix it, and no existing catalog needs that.

piecewise-condition-or = е
piecewise-condition-if = хъумэ
piecewise-condition-otherwise = нэгъуэщӀ щытыкӀэхэм

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. Secondary chemistry in Kabardino-Balkaria and
## Karachay-Cherkessia is taught in Russian — Kabardian is a subject and the
## medium of the primary grades, not of the periodic table — so the element
## names a Kabardian-speaking pupil actually meets are the Russian ones, and
## the English fallback stands nearer that curriculum than 118 unreviewed
## coinages would. This is the school-system case, and it is a fact about one
## education ministry rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Химие дамыгъэ мытэмэм
chemistry-invalid-ionic-compound = Ион зэгухьэныгъэ мытэмэм
