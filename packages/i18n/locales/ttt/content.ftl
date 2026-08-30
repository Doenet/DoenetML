# Muslim Tat (zuhun-i tati) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
# **This locale is the least certain of its batch and a reviewer should assume
# every line needs work**, for the reasons set out below.
#
# **Which Tat, and which script.** This is the **Muslim Tat of Azerbaijan and
# southern Dagestan** — an Iranian (southwestern, Persian-group) language, not
# a Turkic one — and it is written here in the **Latin alphabet of
# Azerbaijan**: `a b c ç d e ə f g ğ h x i ı j k q l m n o ö p r s ş t u ü v y
# z`, with `ə` for the open vowel, `x` for the velar fricative and `q` for the
# uvular stop. That is the tradition Tat-language material published in
# Azerbaijan has followed since Azerbaijani itself went back to Latin.
# **Cyrillic is the tradition in Dagestan**, where Tat has been written in a
# Cyrillic alphabet for far longer and where most published Tat text still is.
# The two are both real and both current; a reviewer who wants the Cyrillic
# one must convert **all four files of this locale together** and must never
# mix the two inside a catalog. (Judeo-Tat / Juhuri is a separate written
# tradition again and is not what this locale is.)
#
# **Word order: Tat is Iranian, and the modifier follows the noun, joined by
# the ezafe.** «xətt-i kuluft-i sürx» is *thick red line* — head noun, ezafe,
# then each adjective, with the ezafe repeated before every one of them. That
# is the opposite of the Turkic order its Azerbaijani neighbours use, and it
# is the single most important thing in this file to get right. So:
#
#   * `style-with-noun` writes `{ $noun }-i { $description }`, not the English
#     order;
#   * `style-stroke` chains its own pieces with the same ezafe, so that a
#     three-part stroke comes out «kuluft-i nüqtəyi-i sürx»;
#   * `style-fill` puts the colour **after** the pattern — «rombho-i kabud»,
#     *blue diamonds* — where English puts it first.
#
# **The ezafe is a suffix, and one message has to weld it to a placeable.**
# Where the catalog writes the word itself the ezafe is written attached and
# unhyphenated («kenori», «foni», «statistikayi»). Where it must follow a
# value the catalog never sees — `{ $noun }`, `{ $color }`, `{ $width }` — it
# is written as a hyphenated `-i`, because gluing it on invisibly would be
# unreadable and there is no way to choose the form without seeing the word.
# **That is a recorded debt: the ezafe is `-i` after a consonant but `-yi`
# after a vowel, and this catalog always writes `-i`.** Every hyphenated `-i`
# in these files is therefore wrong after a vowel-final word, and a speaker
# fixing this locale should start there.
#
# **Plural.** The Tat plural is «-ho» — «xətho» lines, «nüqtəho» points,
# «məsələho» problems — and it is used in this file wherever the catalog
# writes a plural noun itself. It is **not** used after a numeral, where Tat
# leaves the noun unmarked, so no message here varies with a count.
# `Intl.PluralRules` has no CLDR data for `ttt` in any case, and no
# plural-category branch appears in any of these four files.
#
# **No grammatical gender.** Tat, like Persian, has none. `noun-gender`
# answers one token that nothing reads.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Tat is not a language of schooling: chemistry in Azerbaijan is taught in
# Azerbaijani and Russian, in Dagestan in Russian, and there has never been a
# Tat periodic table. There is no list of a hundred and eighteen element names
# in this language to check a translation against, so writing one would be
# manufacturing a nomenclature rather than reporting one. `lint:i18n` reports
# both keys as missing coverage, correctly. `ion-name-oxidation-state` and the
# two invalid-symbol messages **are** covered — they are frames, not
# vocabulary.
#
# **How much of this is a loan: most of it.** Tat has a small written corpus
# and no technical register at all, so the rule this seed followed was to keep
# the word the language actually uses rather than coin one. In practice that
# means:
#
#   * **The Iranian core is Tat's own**, and is what a reviewer should find
#     familiar: «xətt», «nüqtə», «sürx», «zard», «sabz», «sipi», «siyoh»,
#     «kabud», «pur» (filled), «xoli» (empty), «kenor» (edge), «rost» (true),
#     «duruğ» (false), «bəxş» (section), «se-» (three, in «sebucaq»), the
#     plural «-ho» and the ezafe itself.
#   * **Everything technical is Azerbaijani**, kept as the loan a Tat speaker
#     in Azerbaijan would actually say: «vektor», «funksiya», «parabola»,
#     «poliqon», «kvadrat», «romb», «interval», «diaqonal», «üfüqi»,
#     «şaquli», «teorem», «paraqraf», «cədvəl», «şəkil», «səhifə»,
#     «məsələ», «məşq», «fəaliyyət», «əvvəlki», «növbəti». Several colour
#     words — «narinci», «çəhrayi», «qəhvəyi», «bənəvşəyi», «firuzəyi» — are
#     Persian words that reached Tat through Azerbaijani and are spelled as
#     Azerbaijani spells them.
#   * **`firuzəyi` for *cyan* is the weakest word in the file.** It names
#     turquoise, and Tat has no settled word for cyan at all.
#
# **Verbs are the least reliable part of this locale.** Tat borrows a verb by
# taking a stem and putting a light verb on it — «yoxlamiş sax», *check* —
# and this catalog uses that pattern throughout rather than inventing native
# verbs it cannot check. The forms in `chrome.ftl` and `editor.ftl` are where
# a speaker will find the most to correct.


## Style vocabulary

color =
    .black = siyoh
    .white = sipi
    .gray = xakisteri
    .red = sürx
    .orange = narinci
    .yellow = zard
    .green = sabz
    .cyan = firuzəyi
    .blue = kabud
    .purple = bənəvşəyi
    .pink = çəhrayi
    .brown = qəhvəyi
line-width =
    .thick = kuluft
    .thin = nozuk
line-style =
    .dashed = kəsik
    .dotted = nüqtəyi
# Plural nouns in `-ho`, naming the pattern; they modify nothing.
fill-style =
    .horizontal = xətho-i üfüqi
    .vertical = xətho-i şaquli
    .diagonal = xətho-i diaqonal
    .backdiagonal = xətho-i əks-diaqonal
    .dots = nüqtəho
    .diamonds = rombho
noun =
    .line = xətt
    .line-segment = parçəyi xətt
    .ray = şüa
    .vector = vektor
    .curve = əyri
    .function = funksiya
    .slope-field = sahəyi mayil
    .vector-field = sahəyi vektor
    .parabola = parabola
    .polyline = xətti şikəstə
    .polygon = poliqon
    .triangle = sebucaq
    .rectangle = müstətil
    .circle = dayirə
    .region = nahiyə
    .point = nüqtə
    .square = kvadrat
    .diamond = romb
    .cross = xaç
    .plus = plüs
# The side count follows the noun behind «ba», *with*, so the whole of it is
# still one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poliqoni münəzzəm ba { $numSides } tərəf
    }
# Tat has no grammatical gender: one answer for every noun, never read.
noun-gender = neuter


## Style composition
##
## The pieces are chained with the ezafe, which is how Tat stacks adjectives
## behind a noun. See the header on the `-i`/`-yi` debt.

style-stroke =
    { $parts ->
        [width-style-color] { $width }-i { $lineStyle }-i { $color }
        [width-color] { $width }-i { $color }
        [style-color] { $lineStyle }-i { $color }
        [width-style] { $width }-i { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
# The noun comes first and the description hangs off its ezafe.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun }-i { $description } { $nounTail }
       *[noun] { $noun }-i { $description }
    }
style-filled-word = pur
style-filled =
    { $parts ->
        [pattern] { $filled }-i { $color } ba { $pattern }
       *[plain] { $filled }-i { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun }-i { $filled }-i { $color } ba { $pattern }
        [plain-tail] { $noun }-i { $filled }-i { $color } { $nounTail }
        [pattern-tail] { $noun }-i { $filled }-i { $color } { $nounTail } ba { $pattern }
       *[plain] { $noun }-i { $filled }-i { $color }
    }
# «ba kenori …» — *with a border of …*. The preposition «ba» and the ezafe on
# «kenor» together do the work of English's preposition and article, so all
# four branches differ only by the conjunction «və».
style-border-clause =
    { $parts ->
        [with-article] ba kenori { $border }
        [and] və kenori { $border }
        [and-article] və kenori { $border }
       *[with] ba kenori { $border }
    }
# The colour follows the pattern, behind its ezafe: «rombho-i kabud».
style-fill =
    { $parts ->
        [pattern] { $pattern }-i { $color }
       *[plain] { $color }
    }
style-unfilled = xoli
style-text =
    { $parts ->
        [background] { $color } ba foni { $background }
       *[plain] { $color }
    }
style-background-none = nist


## Boolean words

boolean-true = rost
boolean-false = duruğ


## Answer buttons

answer-submit-label = Yoxlamiş sax
answer-submit-label-no-correctness = Cavob fürüst


## Sectional blocks

section-name =
    .activity = Fəaliyyət
    .aside = Qeydi kənor
    .cascade = Kaskad
    .definition = Tərif
    .example = Misol
    .exercise = Məşq
    .exercises = Məşqho
    .given-answer = Cavob
    .note = Qeyd
    .objectives = Məqsədho
    .paragraphs = Paraqrafho
    .part = Hissə
    .problem = Məsələ
    .problems = Məsələho
    .proof = İsbot
    .question = Sual
    .section = Bəxş
    .solution = Həll
    .task = Vəzifə
    .theorem = Teorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = İşorə


## Tables and figures

table-name =
    { $parts ->
        [numbered] Cədvəl { $enumeration }
        [numbered-title] Cədvəl { $enumeration }{ ": " }
        [unnumbered-title] Cədvəl{ ": " }
       *[unnumbered] Cədvəl
    }
figure-name =
    { $parts ->
        [numbered] Şəkil { $enumeration }
        [numbered-caption] Şəkil { $enumeration }{ ": " }
        [unnumbered-caption] Şəkil{ ": " }
       *[unnumbered] Şəkil
    }


## Paginator controls

paginator-previous = Əvvəlki
paginator-next = Növbəti
paginator-page = Səhifə
paginator-page-status = { $pageLabel } { $currentPage } əz { $numPages }


## Piecewise functions

piecewise-condition-or = yo
piecewise-condition-if = əgər
piecewise-condition-otherwise = vagərnə


## Chemistry
##
## `element-name` and `element-anion-name` are omitted; the header says why.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simvoli kimyəvi-i nodürüs
chemistry-invalid-ionic-compound = Birləşməyi ioni-i nodürüs


## Inputs embedded in math

math-embedded-input-blank = xoli
math-embedded-input-blank-ordinal = xoli { $ordinal } əz { $total }
