# Kosraean (kas Kosrae) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ## Orthography
#
# The **standard modern Kosraean orthography** of Lee's *Kusaiean–English
# Dictionary* (1976) and of Kosrae State's schools. The digraph vowels `ac`,
# `ah`, `oa`, `oh`, `uc`, `uh` are each one vowel; `ng`, `sr`, `kw`, `mw` and
# `srw` are each one consonant; there are no diacritics. `chrome.ftl`'s header
# is the canonical statement of all of this and of the working vocabulary, and
# the `noun` table below is canonical for the words themselves.
#
# ## The loans, and why they are in English spelling
#
# This is the file where the lexical gap shows most, so it is stated here in
# full. **Every technical word this seed could not establish in Kosraean is
# left as the English word, in English spelling, and is a loan.** It is not
# respelled into the Kosraean alphabet. `b`, `c`, `d`, `g`, `h`, `j`, `q`, `v`,
# `x` and `z` are not Kosraean letters, so a word carrying them is visibly
# borrowed — which is the point. Respelling would have dressed this seed's
# invented loan phonology up as a fact about Kosraean, and there is no
# published evidence within reach for how Kosraean actually takes a
# mathematical loan. `locales/na` reached the same conclusion for the same
# reason; `locales/pon`, `locales/mh`, `locales/chk` and `locales/gil` respell
# theirs, and this catalog **parts company with those four deliberately**, not
# by oversight.
#
# The loans in this file: `line`, `ray`, `vector`, `curve`, `function`,
# `slope field`, `vector field`, `parabola`, `polyline`, `polygon`, `triangle`,
# `rectangle`, `circle`, `point`, `square`, `diamond`, `plus`, `diagonal`,
# `regular polygon`, `Table`, `Figure`, `Page`, `Cascade`, `Paragraph`,
# `Theorem`, `chemistry`, `ionic compound`, and eight of the twelve colours.
#
# ## Colours
#
# Four are Kosraean and this seed is reasonably sure of them:
#
#   sroalsroal   black       fasrfasr    white
#   srusra       red         folfol      blue
#
# The other eight — grey, orange, yellow, green, cyan, purple, pink, brown —
# are **English words kept as loans**. Kosraean certainly has words for some of
# them, and yellow and green in particular are very likely native; this seed
# simply could not establish which, and a guess in a colour table is a guess a
# reader meets on every graph. A speaker should start here: eight lines fix it.
#
# ## Coinages built by Kosraean's own means, needing confirmation
#
#   ip in line      line segment — "a piece of line"
#   acn             region — the ordinary word for a place or an area
#   sakseng         cross — a real Kosraean word, the cross of the church,
#                   used here for the marker shape
#   ma oasr siska { $numSides }
#                   the side count, as a following relative clause: "that has
#                   N sides". See the note at `noun-regular-polygon`.
#   line oan / line tuyak
#                   horizontal / vertical lines — "lying" and "standing" lines
#   point srisrik   dots — "small points"
#   kotkot          dashed — "cut up", from «kot», to cut
#   sessesla        filled, from the word for full; «tia sessesla» unfilled
#   sisken          border, the edge of a thing. It shares a root with
#                   «siska», the side counted in `noun-regular-polygon`; a
#                   reviewer may want two clearly different words.
#   acn tok         background — "the place behind"
#   acn oalal       a blank, an empty place
#   kas in kol      hint — "words that guide", the same word `chrome.ftl` uses
#   kalmac          meaning, used for *definition*
#   srikasrak       example, parable
#   kusen siyuk     a question
#   mwe srike       a problem — "a thing to try"
#   mwe akpwaye     a proof — "the thing that makes true"
#   ma in oru       a task — "a thing to do"
#   kas in esam     a note — "words to remember"
#   kas saya        an aside — "other words"
#   aketeya         to explain, pressed into service as *solution*; this is the
#                   least satisfying word in the table and the reviewer should
#                   expect to replace it.
#
# «Ip» is *part* and «tafu» is *section*: two different words for two different
# English words, on purpose. «tafu» (a portion) is the less certain of the two.
#
# ## No gender, no `$role` fork, no plural
#
# Kosraean has no grammatical gender, so `noun-gender` answers one token and no
# adjective here forks on `$gender`. No adjective changes shape between
# standing alone and standing in a clause either, so nothing forks on `$role` —
# the four positions would render four copies of one string. A noun takes no
# ending after a numeral, and `Intl.PluralRules("kos")` has no CLDR data, so
# nothing here selects on a count. This is `locales/sm`'s answer and the answer
# the whole Micronesian group of this batch gives.
#
# ## Word order
#
# Head-initial: the describing word **follows** the noun. So the composition
# messages at the foot of this file put `{ $noun }` first and keep the English
# order among the describing words themselves, exactly as `locales/pon` and
# `locales/sm` do.
#
# ## The 130 chemistry keys are deliberately absent
#
# `element-name` and `element-anion-name` are not defined here, so all 130 keys
# fall back to English and `lint:i18n` reports the gap. Secondary science on
# Kosrae is taught in English; naming the elements here would report a fact
# about a curriculum rather than about the language, and the English fallback
# is the vocabulary a Kosraean student actually meets in class.


## Style vocabulary

color =
    .black = sroalsroal
    .white = fasrfasr
    .gray = gray
    .red = srusra
    .orange = orange
    .yellow = yellow
    .green = green
    .cyan = cyan
    .blue = folfol
    .purple = purple
    .pink = pink
    .brown = brown
line-width =
    .thick = matoltol
    .thin = minini
line-style =
    .dashed = kotkot
    .dotted = point srisrik
# Noun phrases: they follow «ke» and modify nothing. `diagonal` is a loan, and
# it is placed after its head noun in the Kosraean order rather than before it.
fill-style =
    .horizontal = line oan
    .vertical = line tuyak
    .diagonal = line diagonal
    .backdiagonal = line diagonal folokla
    .dots = point srisrik
    .diamonds = diamond
noun =
    .line = line
    .line-segment = ip in line
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
    .region = acn
    .point = point
    .square = square
    .diamond = diamond
    .cross = sakseng
    .plus = plus
# The side count is a relative clause in Kosraean and has to follow the whole
# phrase, so it goes in the tail rather than folding into the head. This is the
# `[noun-tail]` shape the Austronesian catalogs established and `locales/pon`
# repeats.
noun-regular-polygon =
    { $part ->
        [tail] ma oasr siska { $numSides }
       *[head] regular polygon
    }
# Kosraean has no grammatical gender, so every noun answers the same and the
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
# The noun leads and its describing words follow. The tail closes the phrase.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = sessesla
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ke { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ke { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ke { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Kosraean has no article, so the two `-article` branches read like the ones
# without them; «ac» is the conjunction and «ke» the accompaniment word.
style-border-clause =
    { $parts ->
        [with-article] ke sisken { $border }
        [and] ac sisken { $border }
        [and-article] ac sisken { $border }
       *[with] ke sisken { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = tia sessesla
style-text =
    { $parts ->
        [background] { $color } ke acn tok { $background }
       *[plain] { $color }
    }
style-background-none = wangin


## Boolean words

boolean-true = pwaye
boolean-false = tia pwaye


## Answer buttons

answer-submit-label = Liye orekma
answer-submit-label-no-correctness = Supwala topuk


## Sectional blocks

section-name =
    .activity = Orekma
    .aside = Kas saya
    .cascade = Cascade
    .definition = Kalmac
    .example = Srikasrak
    .exercise = Srike
    .exercises = Srike
    .given-answer = Topuk
    .note = Kas in esam
    .objectives = Sripa
    .paragraphs = Paragraph
    .part = Ip
    .problem = Mwe srike
    .problems = Mwe srike
    .proof = Mwe akpwaye
    .question = Kusen siyuk
    .section = Tafu
    .solution = Aketeya
    .task = Ma in oru
    .theorem = Theorem
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Kas in kol


## Tables and figures

table-name =
    { $parts ->
        [numbered] Table { $enumeration }
        [numbered-title] Table { $enumeration }{ ": " }
        [unnumbered-title] Table{ ": " }
       *[unnumbered] Table
    }
figure-name =
    { $parts ->
        [numbered] Figure { $enumeration }
        [numbered-caption] Figure { $enumeration }{ ": " }
        [unnumbered-caption] Figure{ ": " }
       *[unnumbered] Figure
    }


## Paginator controls

paginator-previous = Meet
paginator-next = Tok
paginator-page = Page
paginator-page-status = { $pageLabel } { $currentPage } liki { $numPages }


## Piecewise functions
##
## A known limit, recorded rather than hidden. Kosraean's conditional «fin» is
## a clitic that follows the subject of its clause — «el fin tuku», "if he
## comes" — and it does not naturally stand in front of a whole inequality the
## way English's *if* does. The renderer writes this word and then the
## mathematics, and there is nowhere else for it to go, so «fin» is written
## clause-initially here. That is the same shape `locales/dv`'s header records
## for a clause-final language, reached from the other direction, and a
## reviewer may well want a different word — a nominalized "ke pacl se ma"
## ("at the time that") would read better and is longer than this message can
## comfortably carry.

piecewise-condition-or = ku
piecewise-condition-if = fin
piecewise-condition-otherwise = fin tia


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap. See the header.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Symbol chemistry tia fal
chemistry-invalid-ionic-compound = Ionic compound tia fal


## Inputs embedded in math

# «acn oalal» is an empty place. Kept to two words, since it is read aloud
# inside an expression.
math-embedded-input-blank = acn oalal
math-embedded-input-blank-ordinal = acn oalal { $ordinal } liki { $total }
