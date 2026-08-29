# Abkhaz content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the extended Cyrillic alphabet Abkhazia's schools and publishing
# have used since 1954, and what CLDR fills a bare `ab` in as: `ab` maximizes
# to `ab-Cyrl-GE`. Six of its letters are easy to mis-key and a wrong one turns
# a word into nothing: ԥ Ԥ is U+0525, **not** the older ҧ Ҧ (U+04A7) and not a
# Latin p; ә is U+04D9, not a Latin a or e; and ҟ, ҭ, ҳ, ҵ, ҷ, ҽ, ҿ, ҩ, ҕ are
# each a single letter rather than a Cyrillic base plus a mark. A file that
# spells «аҟаԥшь» with ҧ or with a Latin p has quietly stopped being Abkhaz.
#
# **Abkhaz agrees, and this catalog still forks nowhere — that is the finding,
# not an omission.** Abkhaz sorts nouns into human and non-human, and splits
# the human class into masculine and feminine. But the agreement is spelled as
# a prefix on the *verb*, and an attributive adjective — «ҟаԥшь», «ҭбаа»,
# «шкәакәа» — never carries it and never changes shape. The one word in the
# style pipeline that could agree is `style-filled-word` «иҭәу», a relative
# verb form, whose human counterparts «дҭәу» and the plural «иҭәу» do exist in
# the language. Nothing the core names is human: every entry in `noun` is a
# line, a shape or a mark. So a `$gender` fork here would have exactly one
# reachable branch and would render what the branch underneath it already
# renders, which is the rule `locales/gu` and the three Berber catalogs each
# reached from their own direction. `noun-gender` therefore answers one token
# and no message selects on it. `$role` goes unused for the same reason: what a
# clause position asks for in Abkhaz lands on a postposition or on the head
# noun, both of which this catalog writes out itself.
#
# **The word order is not English's, and `style-with-noun` is where you see
# it.** A qualitative adjective *follows* its noun in Abkhaz — «аҩны ду», the
# big house — so the description comes after the thing described:
# `{ $noun } { $description }`, not the other way round. A *relational*
# adjective in -тә goes the other way and precedes, which is why the fill
# patterns read «адиагоналтә ҵәаӷәа» and the participle «иҭәу» stands in front
# of the noun in `style-filled-with-noun`. Both orders are in this file on
# purpose.
#
# **The colour table is a set of choices, not a set of translations, and it is
# the second thing to check.** Abkhaz's inherited «аиаҵәа» covers green and
# blue together, and the language has no everyday grey. Where the style
# pipeline needs the terms apart this catalog writes transparent compounds on
# «аԥштәы», colour: «ажәҩанԥштәы» sky-colour for blue, «ахаҳәԥштәы»
# stone-colour for grey, «адгьылԥштәы» earth-colour for brown, and «аиаҵәа»
# kept for green alone. Orange, purple and pink are honest Russian loans in the
# Abkhaz -тә adjective frame rather than invented natives, which is the reading
# `locales/sah` took for the same problem in Sakha and `locales/os` for
# «цъæх» in Ossetian. A speaker may well prefer other words for any of them.
#
# **Three further things this seed could not verify, listed loudest first.**
# (1) The colour words are written in their citation form, with the article
# а-; in a real attributive phrase the article moves to the head noun and the
# adjective stands bare, «аҽы ҟаԥшь». This catalog does not attempt the bare
# forms of the vowel-initial colours, because it could not check them, and
# `standalone` could not tell the two positions apart even if it had — the
# limit `locales/tpi` records for Tok Pisin's «-pela». (2) The width pair
# «аҭбаа» broad and «ахәыҷы» small are stand-ins used as thick and thin; if
# Abkhaz has proper width adjectives for a drawn stroke, replace them. (3) The
# geometry nouns built on «акәакь», corner — «акәакьрацәа», «ахԥакәакь»,
# «аиашакәакь» — are calques on the Russian school terms rather than words
# read out of an Abkhaz textbook. Abkhaz-medium schooling stops below the
# grades where this vocabulary is taught, so there was no textbook to read.


## Style vocabulary
##
## Nothing here takes an agreement prefix, so nothing forks. The words are in
## their citation form with the article а-; see the note at the top of the file
## about what an attributive phrase does to it.

color =
    .black = аиқәаҵәа
    .white = ашкәакәа
    .gray = ахаҳәԥштәы
    .red = аҟаԥшь
    .orange = аоранжтә
    .yellow = аҩежь
    .green = аиаҵәа
    .cyan = ажәҩанԥштәы лаша
    .blue = ажәҩанԥштәы
    .purple = афиолеттә
    .pink = арозатә
    .brown = адгьылԥштәы
# «аҭбаа» is broad and «ахәыҷы» is small; both are stand-ins, and the header
# says so.
line-width =
    .thick = аҭбаа
    .thin = ахәыҷы
# Reduplications, which is how Abkhaz builds a distributive: «piece-piece» and
# «dot-dot». Coinages rather than attested drawing terms.
line-style =
    .dashed = ахәҭа-хәҭа
    .dotted = акәаԥ-кәаԥ
# Noun phrases, and the one place a relational adjective in -тә stands in front
# of its noun rather than behind it.
fill-style =
    .horizontal = агоризонталтә ҵәаӷәақәа
    .vertical = авертикалтә ҵәаӷәақәа
    .diagonal = адиагоналтә ҵәаӷәақәа
    .backdiagonal = иаҿагылоу адиагоналтә ҵәаӷәақәа
    .dots = акәаԥқәа
    .diamonds = аромбқәа
noun =
    .line = аҵәаӷәа
    .line-segment = аҵәаӷәа хәҭа
    .ray = алуч
    .vector = авектор
    .curve = аҵәаӷәа гьежь
    .function = афункциа
    .slope-field = анаклонтә поле
    .vector-field = авектортә поле
    .parabola = апарабола
    .polyline = еиԥҟьоу аҵәаӷәа
    .polygon = акәакьрацәа
    .triangle = ахԥакәакь
    .rectangle = аиашакәакь
    .circle = агьежь
    .region = аҵакыра
    .point = акәаԥ
    .square = аквадрат
    .diamond = аромб
    .cross = аџьар
    .plus = аплиус
# The side count is a relational adjective in -тә and precedes the noun, while
# «иаша» — regular, on the Russian «правильный» — follows it. So the whole of
# the phrase is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-кәакьтә акәакьрацәа иаша
    }
# Abkhaz agrees a verb with a human/non-human class and, inside human, with
# masculine and feminine — but an attributive adjective carries none of it, and
# every noun the core names is non-human. So this answers one token and nothing
# in the file selects on it. See the header.
noun-gender = non-human

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
# The noun comes first and the describing words follow it, which is Abkhaz's
# order for a qualitative adjective and the reverse of English's.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
# A relative verb form, "that is full". It is the one word here that could
# carry a class prefix — «дҭәу» of a person — and no noun the core names is a
# person, so it is written flat. The header says why at length.
style-filled-word = иҭәу
# «змоу» — "which has" — is a free word, so the fill pattern is named without
# welding a case suffix onto a placeable.
style-filled =
    { $parts ->
        [pattern] { $pattern } змоу { $filled } { $color }
       *[plain] { $filled } { $color }
    }
# The participle precedes the noun and the colour follows it, which is the
# split the header describes.
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } змоу { $filled } { $noun } { $color }
        [plain-tail] { $filled } { $noun } { $color } { $nounTail }
        [pattern-tail] { $pattern } змоу { $filled } { $noun } { $color } { $nounTail }
       *[plain] { $filled } { $noun } { $color }
    }
# «аҳәаа … змоу» — "having a … border". The relative «змоу» stands as a word of
# its own, so nothing is welded to the description, and Abkhaz wants no
# article, which is why the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] аҳәаа { $border } змоу
        [and] насгьы аҳәаа { $border } змоу
        [and-article] насгьы аҳәаа { $border } змоу
       *[with] аҳәаа { $border } змоу
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] аԥштәы { $color }
    }
# The negation of «иҭәу». It agrees in the language exactly as the positive
# form does, and `describeFill` hands this message no noun at all, so there is
# no `$gender` to select on even if a human shape existed.
style-unfilled = иҭәым
# «аҿы» — "on" — is a postposition written as a separate word, so the colour it
# follows can be a placeable without an ending being welded to it.
style-text =
    { $parts ->
        [background] афон { $background } аҿы { $color }
       *[plain] { $color }
    }
style-background-none = мап

## Boolean words

boolean-true = иаша
boolean-false = имцу

## Answer buttons

answer-submit-label = Агәаҭара
answer-submit-label-no-correctness = Аҭак адәықәҵара

## Sectional blocks

section-name =
    .activity = Аусура
    .aside = Аганахьтәи азгәаҭа
    .cascade = Акаскад
    .definition = Аилыркаара
    .example = Аҿырԥштәы
    .exercise = Аҽазыҟаҵага
    .exercises = Аҽазыҟаҵагақәа
    .given-answer = Аҭак
    .note = Азгәаҭа
    .objectives = Ахықәкқәа
    .paragraphs = Абзацқәа
    .part = Ахәҭа
    .problem = Азадача
    .problems = Азадачақәа
    .proof = Ашьақәырӷәӷәара
    .question = Азҵаара
    .section = Аҟәша
    .solution = Аӡбара
    .task = Адҵа
    .theorem = Атеорема
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ацхыраагӡа

## Tables and figures

table-name =
    { $parts ->
        [numbered] Атаблица { $enumeration }
        [numbered-title] Атаблица { $enumeration }{ ". " }
        [unnumbered-title] Атаблица{ ". " }
       *[unnumbered] Атаблица
    }
figure-name =
    { $parts ->
        [numbered] Асахьа { $enumeration }
        [numbered-caption] Асахьа { $enumeration }{ ". " }
        [unnumbered-caption] Асахьа{ ". " }
       *[unnumbered] Асахьа
    }

## Paginator controls

paginator-previous = Аԥхьатәи
paginator-next = Анаҩстәи
paginator-page = Адаҟьа
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions
##
## `piecewise-condition-if` cannot land correctly here, and the reason is
## structural rather than lexical. Abkhaz has no free word for "if": a
## condition is marked by the suffix -зар at the *end* of its own clause, and
## the renderer places this key *before* the mathematics it introduces. The
## nearest free-standing form, «акәзар» — "if it is" — is written out so the
## sentence is at least readable, and it belongs after the inequality rather
## than in front of it. That is the wall `locales/sah`, `locales/tyv`,
## `locales/udm`, `locales/kv` and `locales/chm` each record for their own
## clause-final conditional; no workaround is invented for it here.

piecewise-condition-or = ма
piecewise-condition-if = акәзар
piecewise-condition-otherwise = даҽа ҭагылазаашьақәа рҿы

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately left out, so their
## 130 keys fall back to English. This is the school-system case in its
## sharpest form: Abkhaz-medium schooling stops below the grades where
## chemistry is taught, and secondary science in Abkhazia is taught in Russian.
## There is no Abkhaz element list a pupil would recognize, so the English
## fallback sits nearer their curriculum than an invented Abkhaz table would.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ииашам ахимиатә дырга
chemistry-invalid-ionic-compound = Ииашам аионтә еилаҵа
