# Tokelauan (Gagana Tokelau) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard spelling taught in Tokelau and used by the
# Tokelau Dictionary: the five vowels a e i o u, **macrons on the long
# vowels** (ā ē ī ō ū), and the velar nasal written **`g`** — never `ng` — so
# the language names itself «Gagana Tokelau». **Tokelauan has no glottal stop
# and none is written here**: the koma liliu «ʻ» that is part of Samoan
# spelling has no counterpart in this language, and a «ʻ» anywhere in these
# four files would be an error rather than a variant. A macron is part of the
# spelling and not decoration; where this seed has left one out it is a
# mistake to fix.
#
# **Samoan is the nearest existing catalog, and this file is not a copy of
# it.** Tokelauan and Samoan are both Samoic-Outlier Polynesian and share a
# great deal of inherited vocabulary, so a word that comes out the same in
# both is often simply right: «tali», «togi», «lanu», «laina», «igoa»,
# «vaega», «muamua», «taumafai» are the two languages' common inheritance and
# stand here because they are Tokelauan, not because `locales/sm` has them.
# What must never come out the same is anything the regular correspondences
# touch:
#
#   Samoan «s»  → Tokelauan «h»   sesē → hehē, sili → hili, sino → hino,
#                                 tasi → tahi, tutusa → tutuha,
#                                 faʻamalositino → fakamalohitino
#   Samoan «ʻ»  → Tokelauan «k»   where the glottal continues PPn *k:
#                                 faʻa- → faka-, aʻoaʻo → akoako,
#                                 piʻo → piko, tuaoi → tuakoi,
#                                 tuʻu → tuku, ʻafai → kafai,
#                                 amata → kamata, ʻese → kehe
#   Samoan «ʻ»  → nothing         where it does not: vaʻai → vaai,
#                                 faʻafitauli's «-fitauli» is untouched
#
# **That last pair is this seed's largest single risk.** The Samoan koma
# liliu has two histories and only one of them surfaces as a Tokelauan «k»,
# and this seed had to judge which applied word by word. Where it judged
# wrong the result is not a misspelling but a different word. The words it is
# least sure of are named at the foot of this header.
#
# **Tokelauan has no t/k register split.** Samoan's colloquial register turns
# «t» into «k» and «n» into «g»; Tokelauan does not, so there is one spelling
# here rather than a formal and an informal one, and every «k» in these files
# is a real «k».
#
# **`locales/tvl` (Tuvaluan) is a sibling in this same batch, and the two
# catalogs are expected to look alike.** Tuvaluan is Tokelauan's closest
# relative and the same correspondences run through it, so agreement between
# the two files is what relatedness predicts and is **not evidence that
# either is right** — two seeds can be wrong together in the same way. Check
# this file against Tokelauan, never against `tvl`.
#
# **No grammatical gender.** `noun-gender` answers one token and no adjective
# in these files forks on `$gender`. **No `$role` fork** either: nothing here
# changes shape between standing alone and sitting inside a clause.
#
# **Number.** A numeral in front of a Tokelauan noun leaves the noun alone —
# «tahi taumafai», «lua taumafai» — so a count never changes the word beside
# it, and the counted messages here are written as a single unselected form.
# Tokelauan does mark plural, but on the article («te» → «nā») and, in a
# family of adjectives, by **reduplicating a syllable**: «lahi» → «lalahi»,
# «loa» → «loloa», «poto» → «popoto». Every description these messages build
# is of one thing, so the singular is right throughout; a message about
# several things would want the reduplicated form, and no argument these
# messages receive would tell a translator so. `Intl.PluralRules` has no CLDR
# data for `tkl` and resolves against the runtime's default locale, so a
# `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select.
#
# **Adjectives follow the noun**, as they do in Samoan — «laina mafiafia
# kula» — so the composition messages in `content.ftl` put the noun first and
# keep the English order among the adjectives themselves. That agreement with
# `locales/sm` is a real fact about both languages rather than a copy.
#
# **Loans, named rather than hidden.** Mathematics and computing are taught
# in Tokelau largely in English, so the technical nouns here are loans
# adapted to Tokelauan spelling and are marked as loans: «poini», «veta»,
# «poligoni», «parapola», «matematika», «kipoti», «lipoti», «etita»,
# «palakalafa», «numela», «koluhe», «matrix», «element». A loan takes «l» and
# never «r», Tokelauan having no /r/.
#
# **The words this seed is least sure of**, where a reviewer should start:
# «liko» (circle, from Samoan «liʻo» by the *k rule, which may not apply
# here), «fakataitaiga» (example — the same rule might make it
# «fakatakitakiga»), «lapatakiga» (warning), «hamahama» (yellow), «lanu
# meamata» (green), «enaena» (brown), «hoko» (next), «ka leai» (otherwise),
# «hakega» (slope, a coinage), «manatu fakafoki» (feedback, a coinage),
# «fakailoga tuhi» (the editor's cursor, a coinage), and «fakamama» (filter)
# beside «fakamamā» (clear), which differ only by a macron. None of these is
# attested by this seed; each is a derivation or a description.
#
# The 118 element names and the 12 anion names are left out, so those 130 keys
# fall back to English — see the note above `ion-name-oxidation-state`.


## Style vocabulary

color =
    .black = uliuli
    .white = kena
    .gray = efuefu
    .red = kula
    .orange = lanu moli
    .yellow = hamahama
    .green = lanu meamata
    .cyan = lanu moana meamata
    .blue = lanu moana
    .purple = lanu viole
    .pink = piniki
    .brown = enaena
line-width =
    .thick = mafiafia
    .thin = manifinifi
line-style =
    .dashed = motumotu
    .dotted = togitogi
# Noun phrases: they follow «ma te» and modify nothing.
fill-style =
    .horizontal = laina fakalava
    .vertical = laina fakahako
    .diagonal = laina fakapiko
    .backdiagonal = laina fakapiko fakafeagai
    .dots = togitogi
    .diamonds = taimane
# «hakega», the rise of a slope, is a coinage of this seed and is used for
# `slope` here and in `diagnostics.ftl` alike.
noun =
    .line = laina
    .line-segment = vaega o te laina
    .ray = ū
    .vector = veta
    .curve = piko
    .function = gāluega
    .slope-field = koga hakega
    .vector-field = koga veta
    .parabola = parapola
    .polyline = laina fehokotaki
    .polygon = poligoni
    .triangle = tafatolu
    .rectangle = tafafā fakalava
    .circle = liko
    .region = koga
    .point = poini
    .square = tafafā tutuha
    .diamond = taimane
    .cross = koluhe
    .plus = fakailoga fakaopoopo
# The side count follows the noun and its adjectives follow that, so the whole
# of it folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligoni tutuha e { $numSides } ona itu
    }
# Tokelauan has no grammatical gender, so every noun answers the same and the
# answer goes unused — as in English.
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
# The noun leads and its adjectives follow: «laina mafiafia motumotu kula».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = fakatumu
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ma te { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ma te { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } ma te { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «he» is the indefinite article and carries what English writes as "a", so
# the four branches come out alike: Tokelauan wants the article in all of
# them, and the "and" of the later clauses is the same «ma».
style-border-clause =
    { $parts ->
        [with-article] ma he tuakoi { $border }
        [and] ma he tuakoi { $border }
        [and-article] ma he tuakoi { $border }
       *[with] ma he tuakoi { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = e lē fakatumuina
style-text =
    { $parts ->
        [background] { $color } i luga o he tua { $background }
       *[plain] { $color }
    }
style-background-none = leai

## Boolean words

boolean-true = moni
boolean-false = hehē

## Answer buttons

answer-submit-label = Hiaki te gāluega
answer-submit-label-no-correctness = Lafo te tali

## Sectional blocks

section-name =
    .activity = Gaoioiga
    .aside = Fakamatalaga i tafatafa
    .cascade = Fakahologa
    .definition = Fakauigaga
    .example = Fakataitaiga
    .exercise = Fakamalohitino
    .exercises = Fakamalohitino
    .given-answer = Tali
    .note = Manatua
    .objectives = Hini
    .paragraphs = Palakalafa
    .part = Vaega
    .problem = Fakafitauli
    .problems = Fakafitauli
    .proof = Fakamaoniga
    .question = Fehili
    .section = Vaega
    .solution = Fofō
    .task = Gāluega
    .theorem = Akoakoga fakamaonia
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Fautuaga

## Tables and figures

table-name =
    { $parts ->
        [numbered] Laulau { $enumeration }
        [numbered-title] Laulau { $enumeration }{ ": " }
        [unnumbered-title] Laulau{ ": " }
       *[unnumbered] Laulau
    }
figure-name =
    { $parts ->
        [numbered] Ata { $enumeration }
        [numbered-caption] Ata { $enumeration }{ ": " }
        [unnumbered-caption] Ata{ ": " }
       *[unnumbered] Ata
    }

## Paginator controls

paginator-previous = Muamua
paginator-next = Hoko
paginator-page = Itulau
paginator-page-status = { $pageLabel } { $currentPage } mai te { $numPages }

## Piecewise functions
##
## «kafai» opens its clause and the mathematics follows it, which is the shape
## the renderer wants: the key is placed in front of what it introduces.

piecewise-condition-or = pe
piecewise-condition-if = kafai
piecewise-condition-otherwise = ka leai

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Tokelau's schools teach secondary science in English — the New Zealand
## curriculum reaches the islands and Tokelauan pupils sit its examinations —
## so the fallback here *is* the vocabulary a student meets in their own
## classroom. There is no settled Tokelauan list of the 118 elements to seed
## from either, which is `locales/sm`'s and `locales/haw`'s second reason as
## well: a Polynesian language names the substances it knew long before the
## elements were counted, and no table was ever laid over that. Naming them
## here would report a fact about a curriculum, or invent one.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Fakailoga kemikala hehē
chemistry-invalid-ionic-compound = Tukufakatahiga ionika hehē

## Inputs embedded in math

math-embedded-input-blank = avanoa
math-embedded-input-blank-ordinal = avanoa { $ordinal } mai te { $total }
