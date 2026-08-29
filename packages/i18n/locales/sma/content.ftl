# Southern Sami content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in. Latin script, Southern Sami orthography.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Southern Sami is not Northern Sami with different spelling, and this file is
# where a reader will see that first. Its orthography has no `á`, `č`, `đ`,
# `ŋ`, `š`, `ŧ` or `ž` at all: it writes `tj` and `sj` where Northern writes
# `č` and `š`, doubles a long vowel instead of accenting it, and uses `ï`, `ä`,
# `ö` and `å`, none of which Northern Sami has. The colour words show it
# plainly — «tjeehpes», «rööpses», «viskes», «rusjkes» against Northern
# «čáhppes», «rukses», «fiskes», «ruškes» — and any `á` or `č` that turns up
# below is a bug rather than a variant.
#
# The colours are the sound half of this table. «kruana» and «plaave» are
# Southern Sami's own words and are not built from anything Northern; the
# borrowed ones — «oransje», «turkose», «lilla», «rosa» — are cited in one
# shape because they have no inflected form of their own. That the table is
# uneven is a fact about which colour words the language inherited and which
# it borrowed.
#
# This catalog selects on neither `$gender` nor `$role`. Southern Sami has no
# grammatical gender for anything to agree with, and an adjective standing in
# front of a noun takes an attributive form that agrees with nothing — not
# with the noun's case, not with its number. So «rööpses» is the word in every
# position and a `$role` fork would write four copies of one string. The
# attributive is not the same word as the predicative, and only
# `backgroundColor` and `textColor`, reported as bare state variables, would
# want the predicative; this catalog writes the attributive throughout, so
# those two read as the front half of a phrase whose noun has not arrived.
# That is the same trade `locales/se` makes, for the same reason: `$role`
# cannot tell the two positions apart, because `standalone` is both of them.
#
# Adjectives precede the noun, as in English, so the composition messages at
# the foot of the file keep the English order.
#
# The words this seed had to build rather than find, and so the first things
# to check: «straejmies» and «tjuvtjies» for the two dash patterns, from
# «straejmie» (a stripe) and «tjuvtjie» (a dot); «deavhteme» and «deavhtehts»
# for filled and unfilled; «Loesedimmie» for a worked solution; and the two
# field nouns «luejtiegïedtie» and «vektoregïedtie», built on «gïedtie», a
# meadow — the ordinary Southern Sami word a mathematical field has to be
# borrowed from, since the language has no established term for one.


# **Two words here carry more than one concept, and the seed could coin no
# replacement.** «vuesiehtimmie» is *example* in the `section-name` table and
# is also *reference* throughout `editor.ftl` — so `help-reference-page`
# reads "Example page" — and *display* in `accessibility-name-display-part`.
# `locales/smj` and `locales/smn` keep the two apart («gehtjalvis» and
# «åvdåmærkka», «čujottâs» and «ovdâmerkkâ») and this file does not.
# «buerkiestimmie» is *definition* in the same table and *description* in the
# five short-description diagnostics, which those two catalogs also separate.
# Both need a speaker rather than a guess.
#
# Two more are inherited from `locales/se` and are shared with all four Sami
# catalogs of this batch: the renderer is «vuesiehtimmiemoduvle» in
# `chrome.ftl` and «vuesiehtæjja» in `diagnostics.ftl`, where
# `editor-update-viewer-title` uses that second word for the *viewer*; and
# `parser-node-unconvertible` calls a parse-tree node «tjuvtjie», the
# canonical noun for a geometric point. Fixing either properly means fixing
# `locales/se` in the same pass.


## Style vocabulary

color =
    .black = tjeehpes
    .white = veelkes
    .gray = raanes
    .red = rööpses
    .orange = oransje
    .yellow = viskes
    .green = kruana
    .cyan = turkose
    .blue = plaave
    .purple = lilla
    .pink = rosa
    .brown = rusjkes
line-width =
    .thick = asse
    .thin = seagkoe
line-style =
    .dashed = straejmies
    .dotted = tjuvtjies
# Comitative plurals. The `-jgujmie` ending is Southern Sami's own word for
# "with", which is why `style-filled` below places these straight after the
# colour and writes no preposition of its own: the ending already said it.
fill-style =
    .horizontal = horisontaale straejmiejgujmie
    .vertical = vertikaale straejmiejgujmie
    .diagonal = diagonaale straejmiejgujmie
    .backdiagonal = mubpien bealan diagonaale straejmiejgujmie
    .dots = tjuvtjiejgujmie
    .diamonds = rombejgujmie
noun =
    .line = linje
    .line-segment = linjebielie
    .ray = bielielinje
    .vector = vektore
    .curve = kurve
    .function = funksjovne
    .slope-field = luejtiegïedtie
    .vector-field = vektoregïedtie
    .parabola = parabole
    .polyline = gellielinje
    .polygon = polygone
    .triangle = golmetjiehtjie
    .rectangle = rektangele
    .circle = sirkele
    .region = dajve
    .point = tjuvtjie
    .square = kvadraate
    .diamond = rombe
    .cross = ruesie
    .plus = plusse
# Southern Sami keeps the side count in front of the noun, so the whole of it
# is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] seammalaakan { $numSides }-bielien polygone
    }
# Southern Sami has no grammatical gender, so nothing above reads this and
# every noun answers alike. It is here because the argument is passed to every
# adjective and a message that resolves to nothing would render
# `{noun-gender}`.
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
style-filled-word = deavhteme
# The pattern words carry their own «with» in their comitative ending, so
# nothing is written between them and what they follow.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «raastine» is «raaste», a border, in the comitative — the case that carries
# "with" — so the clause needs no preposition either. Southern Sami has no
# article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] { $border } raastine
        [and] jïh { $border } raastine
        [and-article] jïh { $border } raastine
       *[with] { $border } raastine
    }
style-fill =
    { $parts ->
        [pattern] { $color } deavhteme { $pattern }
       *[plain] { $color } deavhteme
    }
style-unfilled = deavhtehts
style-text =
    { $parts ->
        [background] { $color } { $background } duekine
       *[plain] { $color }
    }
style-background-none = ij mij gænnah

## Boolean words

boolean-true = saetnies
boolean-false = ij saetnies

## Answer buttons

answer-submit-label = Gïehtjh barkoem
answer-submit-label-no-correctness = Seedtieh vaestiedassem

## Sectional blocks

section-name =
    .activity = Darjome
    .aside = Lissietjaalege
    .cascade = Kaskaade
    .definition = Buerkiestimmie
    .example = Vuesiehtimmie
    .exercise = Haarjanimmie
    .exercises = Haarjanimmieh
    .given-answer = Vaestiedasse
    .note = Mïerhkesjimmie
    .objectives = Ulmieh
    .paragraphs = Teekstebielieh
    .part = Bielie
    .problem = Laavenjasse
    .problems = Laavenjassh
    .proof = Vihtiestimmie
    .question = Gyhtjelasse
    .section = Kapihtele
    .solution = Loesedimmie
    .task = Barkoe
    .theorem = Teoreme
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Raerie

## Tables and figures

table-name =
    { $parts ->
        [numbered] Taabele { $enumeration }
        [numbered-title] Taabele { $enumeration }{ ": " }
        [unnumbered-title] Taabele{ ": " }
       *[unnumbered] Taabele
    }
figure-name =
    { $parts ->
        [numbered] Guvvie { $enumeration }
        [numbered-caption] Guvvie { $enumeration }{ ": " }
        [unnumbered-caption] Guvvie{ ": " }
       *[unnumbered] Guvvie
    }

## Paginator controls

paginator-previous = Aerebi
paginator-next = Mubpie
paginator-page = Sæjroe
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }

## Piecewise functions

piecewise-condition-or = jallh
piecewise-condition-if = jis
piecewise-condition-otherwise = jeatjebelaakan

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Southern Sami schooling in Norway and Sweden does not reach
## secondary chemistry in the language: that subject is taught in Norwegian or
## in Swedish, and the element names a Southern Sami pupil meets are the
## Norwegian or the Swedish ones. The English fallback is closer to the
## student's own textbook than 118 invented coinages would be, and a coined
## table would report a fact about this seed rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Faamoehts kemiske symbovle
chemistry-invalid-ionic-compound = Faamoehts iovneles vïedteldimmie
