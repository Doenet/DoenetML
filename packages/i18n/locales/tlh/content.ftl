# Klingon content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Klingon is the roster's first constructed language, and it is the most
# partial catalog in the roster.** `tlhIngan Hol` has a closed lexicon — a few
# thousand words, all of them published by Marc Okrand — so the ceiling on what
# can be translated is a published word list rather than a translator's time.
#
# The lexicon is **not** as bare as a first look suggests, and this file's
# earlier drafts got that wrong. Okrand has released a mathematics register
# over the years, mostly through the new-word lists at `qep'a'` and `qepHom`
# and through answers relayed by the Klingon Language Institute: «mI'QeD»
# (mathematics), «gho» (circle, already in TKD), «mey'» (polygon), «ra'Duch»
# (triangle), «letbaQ» (rectangle), «meyrI'» (square), «vI'» (point, geometry),
# «baSta'» (vector), «chav» (function, mathematics), «reD» (side, geometry).
# Those are used below. So are «wa'chaw» (spreadsheet, table), «wev» (row) and
# «war» (column), «tenwal» (page in a book) and «vorgh» (be previous).
#
# What is genuinely missing is narrower than "mathematics": *parabola*,
# *polyline*, *curve* as a noun, *diamond* as a shape, and the vocabulary of a
# document editor — *attribute*, *variant*, *matrix*, *interval*, *snippet*,
# *accessibility*, *theorem*, *proof*, *exercise*. For those this file draws a
# line and states it once, because every omission below is an application of it:
#
#   **A compound of canon words whose sense a speaker could work out is a
#   description, and is written. A new root is an invention, and is not.**
#
# Under that rule «nagHom» — «nagh» (rock) with the canon diminutive «-Hom» —
# is a fair way to say *dot*, and a word for *parabola* is not a translation of
# anything. What is left out falls back to English, which is what makes seeding
# safe here exactly as it does everywhere else: a description reads «SuDbogh
# parabola» rather than reading a word no Klingon speaker has ever met.
#
# Replacing an English fallback with a word Okrand has published is the single
# most useful edit anyone can make to this file, and the new-word lists are
# where to look: they are still growing, so a gap here may already have closed.
# The KLI itself does not coin vocabulary — it relays Okrand's — so a word with
# no Okrand source behind it is an invention whoever the speaker is.
#
# ## Every quality word here is a verb
#
# Klingon has no adjectives. What English writes as an adjective is a verb of
# quality, and TKD describes putting **one** of them directly after the noun it
# modifies — «tlhegh Doq», a red line. It gives no way to chain them there, and
# `style-stroke` chains three in its widest branch.
#
# So this file uses the relative clause instead: «-bogh» on each verb, «'ej»
# between them, and the whole clause standing **in front of** the noun —
# «jeDbogh 'ej Doqbogh tlhegh», which is the order TKD gives for a head noun
# that is the subject of its clause. Chaining «-bogh» clauses with «'ej» is an
# extension rather than an attested pattern: «'ej» joins sentences, a relative
# clause is one, and no canon example strings three of them together. It is the
# defensible way to say what `style-stroke` has to say, not the only one.
# So the tables below hold **bare
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
# `.brown` under «Doq» is not part of the collapse's cost: Okrand says «Doq»
# covers what English calls brown, and the canon way to narrow it is the phrase
# «Doq 'ej wovbe'» (red and not bright). Only `.purple` and `.pink` are this
# file choosing the nearest of the four with nothing canon behind the choice,
# and they are the first entries a speaker should overrule.
#
# The collapse is left standing rather than repaired, and the reason is the one
# `locales/oj` gives for leaving the periodic table alone: coined colour words
# would be inventions, not a translation. Tongan, Fijian and Tahitian met the
# mild form of this — one key, `.cyan`, sitting inside a neighbour's word — and
# this is the same thing at full size.
#
# **It costs something real, and a corrector should know what.** These strings
# exist so that a reader who cannot see a graph can tell its objects apart, and
# after the collapse a blue curve and a green one report the same word. A
# deployment that needs the distinction supplies coined terms as
# `localeResources`, which win over this file; inventing them here would put
# them in front of every reader of every document instead.
#
# `.gray` is the one entry whose canon answer this file cannot use. Okrand
# gives the phrase «qIj 'ej wov» (black and bright) for gray, and a phrase
# cannot go in this table: `style-stroke` welds «-bogh» onto whatever the table
# supplies, and «-bogh» belongs on each verb of a pair rather than on the
# second. So «Hurgh» (be dark) stands in — a canon word doing a job it was not
# given, and the entry to fix if `style-stroke` ever composes gray itself.
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

# «jeD» is «be thick, be dense» and «lang» is «be thin, be narrow» — canon
# verbs of quality, so «-bogh» welds onto them as onto any other.
line-width =
    .thick = jeD
    .thin = lang

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

# Fourteen of the eighteen, and all fourteen are Okrand's rather than this
# file's. «tlhegh» is «line, rope» and «'ay'» «section, part», both from TKD, so
# a line segment is a compound of two canon words. «gho» (circle) is TKD too.
# The geometry vocabulary released since is where the rest come from: «mey'»
# (polygon), «ra'Duch» (triangle), «letbaQ» (rectangle), «meyrI'» (square),
# «vI'» (point, in the geometric sense rather than «Daq», a site), «baSta'»
# (vector), «chav» (function, in its mathematical sense rather than its TKD
# sense of an achievement) and «me'cheD», which is one word for both the cross
# (+) and the ex (×) and so answers `.cross` and `.plus` alike.
#
# «tIH» is «ray, beam», and Okrand's note makes it an energy beam; using it for
# a geometric ray is the nearest canon word rather than an exact one.
#
# The other four — curve, parabola, polyline, and diamond as a shape — are left
# to English. Each would be a new root: «'ob» is «be curved» and gives no noun,
# and «chanmon» is the gemstone. `noun-regular-polygon` is left to English too,
# because nothing canon says *regular*; a corrector who wants it has «reD»
# (side, geometry) and the canon pattern «loS reD mey'» — a four-sided polygon —
# to build the rest of it from.
noun =
    .line = tlhegh
    .line-segment = tlhegh 'ay'
    .ray = tIH
    .vector = baSta'
    .function = chav
    .polygon = mey'
    .triangle = ra'Duch
    .rectangle = letbaQ
    .circle = gho
    .region = yer
    .point = vI'
    .square = meyrI'
    .cross = me'cheD
    .plus = me'cheD

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
## Five of the twenty. «'ay'» (section, part), «Qu'» (task, mission), «ngoQ»
## (goal), «QIn» (message) and «ghantoH» (model, example, pattern) are canon
## words that mean what their keys mean; the other fifteen name a kind of
## writing Klingon has no word for — theorem, corollary, proof, exercise — and
## are left to English rather than coined.

section-name =
    .example = ghantoH
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
## Only half of this is a lexical gap. «wa'chaw» is canon for a table of ruled
## data — it is Okrand's word for a spreadsheet — so `table-name` is written.
## Klingon has no word for a *figure* in the sense of an illustration, and
## coining one would be coining a root, so `figure-name` falls back to English.
## The number follows what it counts, as in `section-title-prefix`.

table-name =
    { $parts ->
        [numbered] wa'chaw { $enumeration }
        [numbered-title] wa'chaw { $enumeration }{ ": " }
        [unnumbered-title] wa'chaw{ ": " }
       *[unnumbered] wa'chaw
    }


## Paginator controls

# «veb» is «be next» and «vorgh» is «be previous»; both are canon, and an
# earlier draft of this file coined «vebHa'» for the second before finding it.
# «tenwal» is a page in a book, which is exactly what a paginator turns.
paginator-previous = vorgh
paginator-next = veb
paginator-page = tenwal

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
## left to English, and the reason is arithmetic rather than absence. Klingon
## has «tamler» (element, in chemistry) and «tamler wa'chaw» (the periodic
## table), and Okrand has named roughly thirty of the elements — «bIQSIp»
## (hydrogen), «Sorpuq» (copper), «tarngeb» (uranium), «letbIng» (mercury) and
## the rest. Thirty of 118 is a table that would read in two languages down its
## own length, and the missing eighty-eight are exactly the coinage
## `locales/oj` refuses. Filling in the thirty is real work a corrector can do,
## and it is the largest single gap left in this catalog.
