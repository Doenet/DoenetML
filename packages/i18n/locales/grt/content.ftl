# Garo (A·chik ku·rang) content catalog: the prose the core computes into the
# document — style descriptions ("thick red line"), boolean words, section
# names, the paginator's status line. Selected by `documentLocale`, the
# language the activity was written in, rather than by the reader's UI
# language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator, and
# no permission is needed to fix it.
#
# **Script: Latin.** ICU maximizes a bare `grt` to `grt-Beng`, and this
# catalog writes Latin anyway, because Latin is what a Garo reader in
# Meghalaya reads. `chrome.ftl` carries the full argument; converting this
# catalog to Bengali letters means converting all four files at once. The raka
# is the middle dot «·» throughout.
#
# **Word order: prenominal — the description comes BEFORE the noun.**
# `style-with-noun` and `style-filled-with-noun` keep English's order of
# `{ $description }` then `{ $noun }`, so a thick dashed red line reads
# «dal·gipa dashgipa gitchak lain». This follows `locales/brx`, Bodo, which is
# Garo's closest relative in the roster and records the same order for the same
# reason: a Tibeto-Burman describing word stands in front of its noun and never
# moves. It is worth saying that this puts Garo at odds with the other two
# catalogs of Northeast India seeded in the same batch — `kha` and `lus`, both
# postnominal — while agreeing with the batch's twelve others. The order here
# is a fact about the family, not about the region.
#
# **No `$gender` fork and no `$role` fork.** Garo has no grammatical gender and
# no adjective agreement of any kind, and its describing words — stative verbs
# used attributively, carrying the «gi-»/«-gipa» shapes, «gitchak»,
# «dal·gipa» — never change for the position the phrase they belong to goes
# into. So `noun-gender` answers the single token `neuter`, and every
# composition message ignores both arguments. Both of those are claims about
# the language rather than gaps in the seed. This is `locales/brx`'s finding a
# second time from the same branch.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` and leaves
# `tail` empty, as English does: the side count stands in front of the noun
# with everything else, so there is no complement to put behind the
# describing words. The `-tail` branches are still written out, because a
# partly-translated locale falls back through them.
#
# **Nothing selects on a count.** A Garo noun is unmarked after a numeral — it
# counts with a classifier this frame has no place for — and CLDR has no
# plural data for `grt` in any case. Every English plural select is collapsed
# to its `*[other]` wording.
#
# **`piecewise-condition-if` is where the frame and the grammar disagree, and
# it is this file's sharpest open question.** Garo's own conditional is the
# **verbal suffix «-oba»**, which is clause-final: it is welded to the end of
# the verb of the condition. The renderer places this word *in front of* the
# mathematics it introduces, so «-oba» cannot be written here at all — there is
# no verb in the catalog for it to attach to, and nothing follows it that it
# could attach to either. So the seed takes the README's second way out,
# *reach for a word that can stand beside it*, and uses the free conjunction
# **«jodi»**, Assamese-derived and already carried by Garo prose, which can
# stand in front. `piecewise-condition-otherwise` needs no such trick and uses
# the well-formed «ong·jaoba», "if it is not" — which is «-oba» doing its
# proper job, one line below the place it could not.
#
# **The vocabulary splits three ways, and the split is declared rather than
# hidden.** Meghalaya teaches mathematics in English out of English textbooks,
# so the geometry and computing nouns here — line, ray, vector, curve,
# function, parabola, polygon, triangle, rectangle, circle, point, square,
# diamond, region, horizontal, vertical, diagonal — are written as **English
# loans**, because that is what the classroom says. So are nine of the twelve
# colours. What is **Garo** is: «gitchak» red, «gipok» white, «gisim» black;
# «dal·gipa» big and «chon·gipa» small for a stroke's thick and thin; «ong·a»
# and «ong·ja» for true and false; «sing·ani» question and «aganchakani»
# answer; «skang» previous and «ja·man» next; «bak» part; «kam» work. A third
# group is **Assamese- or Bengali-derived** and is the register Garo schooling
# already carries: «sanggya», «uddahoron», «abbash», «tippani», «anuchhed»,
# «somossa», «proman», «bibag», «somadan», «upapadya», «sarni», «chitro»,
# «pata», «jodi», «bhorti».
#
# **Four things to check before anything else here.** «dal·gipa» / «chon·gipa»
# for a stroke's thick and thin is the ordinary pair for large and small, and
# it is `locales/brx`'s and `locales/mni`'s guess rather than a verified
# term — it is the first thing to put to a speaker. «bhorti» for *filled* is a
# loan standing in for a Garo word the seed could not supply. The nine loan
# colours are loans, not Garo, and are marked as such rather than invented: no
# colour term is written here that the seed is not confident of. And
# «ong·jaoba» is the only place «-oba» appears at all.


## Style vocabulary

# Three of these are Garo — gitchak, gipok, gisim. The other nine are English
# loans written as English, not Garo words: the seed does not invent a colour
# term it is not confident of.
color =
    .black = gisim
    .white = gipok
    .gray = gray
    .red = gitchak
    .orange = orange
    .yellow = yellow
    .green = green
    .cyan = cyan
    .blue = blue
    .purple = purple
    .pink = pink
    .brown = brown

# The ordinary words for large and small, as Bodo and Meitei both do. Check
# this pair first.
line-width =
    .thick = dal·gipa
    .thin = chon·gipa

# A loan stem carrying the Garo attributive «-gipa», which is how Garo makes a
# describing word out of a borrowed one.
line-style =
    .dashed = dashgipa
    .dotted = dotgipa

fill-style =
    .horizontal = horizontal lainrang
    .vertical = vertical lainrang
    .diagonal = diagonal lainrang
    .backdiagonal = ulta diagonal lainrang
    .dots = dotrang
    .diamonds = diamondrang

noun =
    .line = lain
    .line-segment = lain segment
    .ray = ray
    .vector = vector
    .curve = curve
    .function = function
    .slope-field = slope field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = triangle
    .rectangle = rectangle
    .circle = circle
    .region = region
    .point = point
    .square = square
    .diamond = diamond
    .cross = cross
    .plus = plus

# «-bakgipa» takes the side count and stands in front of the noun with
# everything else, so nothing follows the describing words and the tail is
# empty. The ending has one shape whatever number lands before it.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-bakgipa regular polygon
    }

# Nothing selects on it: Garo has no grammatical gender.
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

# Prenominal, as Bodo is: the description stands in front of the noun.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = bhortigipa

# «-chi» is the instrumental and follows what it governs, so the pattern moves
# to the front of the phrase where English appends it. It has one shape
# whatever precedes it, so writing it onto a placeable is sound.
style-filled =
    { $parts ->
        [pattern] { $pattern }-chi { $filled } { $color }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern }-chi { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern }-chi { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }

# Garo has no article, so the two `-article` branches read like their
# neighbours; «aro» is the conjunction and stands in front. «-chi» here is the
# comitative, and again has one shape.
style-border-clause =
    { $parts ->
        [with-article] { $border } border-chi
        [and] aro { $border } border-chi
        [and-article] aro { $border } border-chi
       *[with] { $border } border-chi
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = bhorti ong·gija

# «-o» is the locative and has one shape too.
style-text =
    { $parts ->
        [background] { $background } background-o { $color }
       *[plain] { $color }
    }

style-background-none = maiba dongja


## Boolean words

boolean-true = ong·a
boolean-false = ong·ja


## Answer buttons

answer-submit-label = Kamko Nikbo
answer-submit-label-no-correctness = Aganchakanikon On·bo


## Sectional blocks

section-name =
    .activity = Kam
    .aside = Bak ku·ra
    .cascade = Cascade
    .definition = Sanggya
    .example = Uddahoron
    .exercise = Abbash
    .exercises = Abbash
    .given-answer = Aganchakani
    .note = Tippani
    .objectives = Uddesyo
    .paragraphs = Anuchhed
    .part = Bak
    .problem = Somossa
    .problems = Somossa
    .proof = Proman
    .question = Sing·ani
    .section = Bibag
    .solution = Somadan
    .task = Dakani kam
    .theorem = Upapadya

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Dakchakani


## Tables and figures

table-name =
    { $parts ->
        [numbered] Sarni { $enumeration }
        [numbered-title] Sarni { $enumeration }{ ": " }
        [unnumbered-title] Sarni{ ": " }
       *[unnumbered] Sarni
    }

figure-name =
    { $parts ->
        [numbered] Chitro { $enumeration }
        [numbered-caption] Chitro { $enumeration }{ ": " }
        [unnumbered-caption] Chitro{ ": " }
       *[unnumbered] Chitro
    }


## Paginator controls

paginator-previous = Skanggipa
paginator-next = Ja·mangipa
paginator-page = Pata

# «-oni» is the ablative — "out of" — and it follows the total, so the two
# counts change places against English. It has one shape whatever precedes it.
paginator-page-status = { $numPages }-oni { $pageLabel } { $currentPage }


## Piecewise functions
##
## «jodi» is a free conjunction that can stand in front of the mathematics.
## Garo's own conditional «-oba» cannot: see the header.

piecewise-condition-or = ba
piecewise-condition-if = jodi
piecewise-condition-otherwise = ong·jaoba


## Chemistry
##
## `element-name` and `element-anion-name` are **deliberately absent**, so all
## 130 of those keys fall back to English and `lint:i18n` reports the gap.
##
## Meghalaya teaches secondary chemistry in English, out of English textbooks,
## so the element names a Garo student actually meets are the English ones. A
## Garo table here would not be a translation; it would be a claim about how
## to spell "Praseodymium" in Garo letters, and no such convention exists to
## report. Falling back to English shows the student the word their own
## textbook uses. Whoever fills this in should be filling in a list Garo
## chemistry teaching already carries, not inventing one.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ong·gijagipa rasayonik chinho
chemistry-invalid-ionic-compound = Ong·gijagipa ayonik jougik

## Inputs embedded in math

math-embedded-input-blank = khali

math-embedded-input-blank-ordinal = { $total }-oni khali { $ordinal }
