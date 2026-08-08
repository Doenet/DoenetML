# Klingon content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Klingon is the roster's first constructed language, and it is partial for a
# reason no earlier catalog had.** Every other partial catalog leaves out the
# chemistry tables because a school system teaches chemistry in another
# language. This one leaves out most of its nouns because the words do not
# exist: `tlhIngan Hol` has a closed lexicon of a few thousand words, published
# by Marc Okrand, and it contains no mathematics register at all. There is no
# canon word for *circle*, *polygon*, *parabola* or *function*.
#
# So this file draws a line and states it once, because every omission below is
# an application of it:
#
#   **A compound of canon words whose sense a speaker could work out is a
#   description, and is written. A new root is an invention, and is not.**
#
# Under that rule «nagHom» — «nagh» (rock) with the canon diminutive «-Hom» —
# is a fair way to say *dot*, and a word for *parabola* is not a translation of
# anything. What is left out falls back to English, which is what makes seeding
# safe here exactly as it does everywhere else: a description reads «SuDbogh
# circle» rather than reading a word no Klingon speaker has ever met.
#
# Words Okrand has published since TKD — in KGT, in the addenda, and in the
# material released through the Klingon Language Institute — are where a
# corrector should start, and replacing an English fallback with one is the
# single most useful edit anyone can make to this file. The KLI itself does not
# coin vocabulary, so a word with no Okrand source behind it is an invention
# whoever the speaker is.
#
# ## Every quality word here is a verb
#
# Klingon has no adjectives. What English writes as an adjective is a verb of
# quality, and TKD 4.4 describes putting **one** of them directly after the
# noun it modifies — «tlhegh Doq», a red line. It gives no way to chain them
# there, and `style-stroke` chains three in its widest branch.
#
# The device that takes any number of them is the relative clause: «-bogh» on
# each verb, «'ej» between them, and the whole clause standing **in front of**
# the noun — «tInbogh 'ej Doqbogh tlhegh». So the tables below hold **bare
# verbs** and the composition messages weld «-bogh» on. That keeps each table
# entry usable as the citation form a state variable reports, where a bare verb
# of quality is a whole Klingon sentence answering «what colour is it?», and it
# is why this catalog needs no `$role` fork: the *position* is handled by the
# message that composes the phrase rather than by the word inside it.
#
# **Welding «-bogh» onto a placeable is sound here, and that is a fact about
# Klingon rather than a liberty.** The README's affix rule forbids it in Arabic,
# Uyghur, Finnish and Hungarian because the ending's *shape* is decided by the
# word it lands on. Klingon suffixes have one shape each — no vowel harmony, no
# assimilation, no consonant grade — so «-bogh», «-Daq» and «-vaD» sit on a
# value the catalog never sees and come out right whatever it is. This is the
# «{ $numSides }-kulmio» case in the README, not the «ве»/«в» case.
#
# ## Gender
#
# `noun-gender` answers one token for every noun. Klingon does have a noun class
# system — «-pu'» pluralizes beings capable of language, «-Du'» body parts,
# «-mey» everything else — and it is the sort of thing `$gender` carries for the
# Bantu catalogs. It goes unused because no message here has to choose a class
# at runtime: the few plurals below («ngoQmey», «tlheghmey», «nagHommey») are
# fixed table entries, written out with the class they take.
#
# ## Plurals
#
# `Intl.PluralRules("tlh")` reports `one` and `other`, which is ICU's default
# for a language it has no data for rather than anything about Klingon. Klingon
# marks no number on a noun after a numeral, so nothing here selects on a count
# and no branch relies on those categories.


## Style vocabulary

# **Four words for twelve keys, and this is the catalog's central fact.**
# Klingon's basic colour terms are «qIj» (black), «chIS» (white), «Doq» (be
# red, be orange) and «SuD» (be green, be blue, be yellow — one term across all
# three). The twelve keys English distinguishes collapse onto those four.
#
# Three of the twelve go beyond even that. Canon «Doq» is the red-orange range,
# and nothing canon covers brown, purple or pink; putting all three under «Doq»
# is this file choosing the nearest of the four rather than reporting a Klingon
# fact, and it is the first thing a speaker should overrule.
#
# The collapse is left standing rather than repaired, and the reason is the one
# `locales/oj` gives for leaving the periodic table alone: eight invented colour
# words would be eight inventions, not a translation. Tongan, Fijian and
# Tahitian met the mild form of this — one key, `.cyan`, sitting inside a
# neighbour's word — and this is the same thing at full size.
#
# **It costs something real, and a corrector should know what.** These strings
# exist so that a reader who cannot see a graph can tell its objects apart, and
# after the collapse a blue curve and a green one report the same word. A
# deployment that needs the distinction supplies coined terms as
# `localeResources`, which win over this file; inventing them here would put
# them in front of every reader of every document instead.
#
# `.gray` is the one entry with no basic term over it at all. «Hurgh» is «be
# dark», a canon word doing a job it was not given — a placeholder a speaker
# should replace or delete rather than a Klingon colour name.
color =
    .black = qIj
    .white = chIS
    .gray = Hurgh
    .red = Doq
    .orange = Doq
    .yellow = SuD
    .green = SuD
    .cyan = SuD
    .blue = SuD
    .purple = Doq
    .pink = Doq
    .brown = Doq

# «tIn» and «mach» are «be big» and «be small», canon words describing a stroke
# rather than naming a thickness, which Klingon has no word for.
line-width =
    .thick = tIn
    .thin = mach

# Both are verbs, so that «-bogh» can weld on: «pe'lu'» is «one cuts it», and
# «nagHommey ngaS» is «it contains dots» — an object and its verb, which takes
# the suffix on the verb exactly as a bare one does.
line-style =
    .dashed = pe'lu'
    .dotted = nagHommey ngaS

# Nouns, placed after the colour by `style-fill`. «yav» (ground) and «chal»
# (sky) carry the horizontal/vertical contrast, and «nIH» (right) and «poS»
# (left) which way a diagonal leans; all four are canon words, and the compounds
# are this file's own. `.diamonds` is left to English: a shape name is a root,
# not a description, which is the rule this file opened with.
fill-style =
    .horizontal = yav tlheghmey
    .vertical = chal tlheghmey
    .diagonal = nIH tlheghmey
    .backdiagonal = poS tlheghmey
    .dots = nagHommey

# Five of the eighteen. «tlhegh» (rope, line), «'ay'» (section), «tIH» (beam,
# ray), «Daq» (site, location) and «yer» (territory) are canon words that mean
# what these keys mean.
#
# The other thirteen — curve, function, parabola, polyline, polygon, triangle,
# rectangle, circle, square, diamond, cross, plus, vector — are left to English.
# Every one of them would be a new root, and `noun-regular-polygon` is left with
# them for the same reason, so a regular polygon reads in English entire rather
# than in half of each language.
noun =
    .line = tlhegh
    .line-segment = tlhegh 'ay'
    .ray = tIH
    .region = yer
    .point = Daq

# One answer for every noun; see the note on noun class in the header.
noun-gender = neuter


## Style composition
##
## Where the grammar lives. Each of these welds «-bogh» onto the bare verbs the
## tables above supply, joins them with «'ej», and puts the finished relative
## clause in front of the noun.
##
## `$description` and `$border` arrive already carrying their «-bogh», because
## they are `style-stroke`'s own output; only a raw table word is ever welded.

style-stroke =
    { $parts ->
        [width-style-color] { $width }bogh 'ej { $lineStyle }bogh 'ej { $color }bogh
        [width-color] { $width }bogh 'ej { $color }bogh
        [style-color] { $lineStyle }bogh 'ej { $color }bogh
        [width-style] { $width }bogh 'ej { $lineStyle }bogh
        [width] { $width }bogh
        [style] { $lineStyle }bogh
       *[color] { $color }bogh
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# «buy'» is «be full», the nearest canon verb to *filled*.
style-filled-word = buy'

# A pattern is a noun, so it joins the chain as «X ngaSbogh» — «which contains
# X» — rather than as another quality verb.
style-filled =
    { $parts ->
        [pattern] { $filled }bogh 'ej { $color }bogh 'ej { $pattern } ngaSbogh
       *[plain] { $filled }bogh 'ej { $color }bogh
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled }bogh 'ej { $color }bogh 'ej { $pattern } ngaSbogh { $noun }
        [plain-tail] { $filled }bogh 'ej { $color }bogh { $noun } { $nounTail }
        [pattern-tail] { $filled }bogh 'ej { $color }bogh 'ej { $pattern } ngaSbogh { $noun } { $nounTail }
       *[plain] { $filled }bogh 'ej { $color }bogh { $noun }
    }

# «HeH» is «edge, border» and «je» is the noun conjunction, which follows what
# it joins. Klingon has no article and «je» opens no clause, so all four
# branches say the same thing — English's first-clause-against-further-clause
# distinction has nothing to land on here.
style-border-clause =
    { $parts ->
        [with-article] { $border } HeH je
        [and] { $border } HeH je
        [and-article] { $border } HeH je
       *[with] { $border } HeH je
    }

style-fill =
    { $parts ->
        [pattern] { $color }bogh { $pattern }
       *[plain] { $color }bogh
    }

style-unfilled = buy'be'

# «'em» is «the area behind», and «ghaj» is «have»: «{ $background }bogh 'em
# ghajbogh» is «which has a background that is ⟨colour⟩», with the object in
# front of its verb as Klingon puts it.
style-text =
    { $parts ->
        [background] { $color }bogh 'ej { $background }bogh 'em ghajbogh
       *[plain] { $color }bogh
    }

style-background-none = pagh


## Boolean words

# «teH» is «be true», which is what a `<boolean>` displays; «HIja'» and «ghobe'»
# are yes and no, which answer a question and are not the same thing.
boolean-true = teH
boolean-false = teHbe'


## Answer buttons

# «chov» is «evaluate», which is what checking work is; «ngeH» is «send».
answer-submit-label = yIchov
answer-submit-label-no-correctness = yIngeH


## Sectional blocks
##
## Four of the twenty. «'ay'» (section), «Qu'» (task, mission), «ngoQ» (goal)
## and «QIn» (message) are canon words that mean what their keys mean; the other
## sixteen name a kind of writing Klingon has no word for — theorem, corollary,
## proof, exercise — and are left to English rather than coined.

section-name =
    .section = 'ay'
    .task = Qu'
    .objectives = ngoQmey
    .note = QIn

# Klingon puts a number after what it counts, which is the order English uses
# here too, so only the punctuation moves.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

# «boQ» is «assist, aid». `diagnostics.ftl` has no competing word for it, and
# `feedback-heading` in `chrome.ftl` takes «qeS» (advice) so that the two stay
# apart.
hint-title = boQ


## Tables and figures
##
## Left to English. Klingon has no word for either — «table» in the sense of
## ruled data and «figure» in the sense of an illustration are both roots — and
## a heading built half of each language would read worse than one built of
## neither.


## Paginator controls

# «veb» is «be next». «vebHa'» is this file's own, formed with the canon
# reversative «-Ha'»; Klingon has no word for *previous*.
paginator-previous = vebHa'
paginator-next = veb
paginator-page = nav

# Klingon has no partitive «of». «Hoch» is «all», so the count of pages is named
# as a whole beside the page being read rather than as a fraction of it.
paginator-page-status = { $pageLabel } { $currentPage }, Hoch { $numPages }


## Piecewise functions

# «pagh» is the conjunction «or» that joins sentences, which is what a piecewise
# condition is. Klingon keeps two sets of conjunctions, and the noun set —
# «je», «joq», «ghap» — would be wrong here whichever of them was picked.
# It is a homophone of the «pagh» (nothing) that `style-background-none` uses,
# and the two are unrelated words.
#
# «-chugh» is the conditional suffix, which cannot stand alone in front of
# mathematics, so «qaSchugh» — «if it happens» — carries it. «latlhDaq» is «at
# another», this file's own way to say *elsewhere*.
piecewise-condition-or = pagh
piecewise-condition-if = qaSchugh
piecewise-condition-otherwise = latlhDaq


## Chemistry
##
## The 118 element names, the 12 anion names and the two error messages are all
## left to English, and Klingon is the clearest case in the roster of the reason
## `locales/sm` and `locales/haw` give: there is no settled list to seed from,
## and here there is not even a school system that might one day produce one.
## Okrand's lexicon names a handful of substances — «baS» (metal), «bIQ»
## (water), «Hov» (star) — and nothing resembling a periodic table. Coining 118
## names would be coining 118 words.
