# Efik content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `efi` is Efik, a Cross River language (Niger-Congo, Delta-Cross) of Cross
# River State, Nigeria, centered on Calabar. It sits in the Lower Cross
# subgroup beside Ibibio, its closest relative, with which it is largely
# mutually intelligible — the two are sometimes described as one language
# with two literary standards, and Efik owes much of its written convention to
# nineteenth-century mission printing.
#
# **No adjective-noun class agreement.** Cross River languages retain a
# reduced noun-class system for number (a human noun's singular/plural prefix
# alternation, «akparawa»/«nkparawa» "youth/youths"), but that prefixing does
# not extend to descriptive words the way it does in the Bantu core: an Efik
# quality word — «ọfọn» "good", «ọwụt» "red" — is invariant, and what marks it
# as a modifier is word order and, for many of them, a linking particle «eke»
# ("of/that is") rather than any class-agreement affix. There is no gender at
# all — Efik does not distinguish masculine/feminine even in pronouns, which
# reduces `he`/`she`/`it` to one form. So `$gender` answers one token for every
# noun, exactly as it does in `locales/en`, and `$role` is likewise unused:
# nothing here inflects for the syntactic position a phrase sits in, so the
# same adjective serves standing alone, behind a preposition, or beside
# another adjective in a clause. This is the shape `locales/dyu` and
# `locales/pcm` already carry, and the same one `locales/gaa` (also Kwa,
# also no noun-class agreement on adjectives) reaches from a different branch
# of Niger-Congo — worth reading against `locales/tiv` or a Bantu catalog like
# `locales/sw`, where the class marked on the noun is repeated on everything
# that agrees with it and `$gender` is exactly the token that says which class
# that is.
#
# `$count` selects with `Intl.PluralRules('efi')`, which resolves only `one`
# and `other` — a number is either exactly one or it is not, the shape English
# has, with no dual or paucal category the way some neighboring Cross River
# languages have been described as having for pronouns (not reflected here,
# since nothing in this catalog counts a pronoun).
#
# Written in the standard orthography: the underdot consonant `n̄` (a velar
# nasal, distinct from `n`) and the underdotted vowels `ọ` (open o) and `ị`
# (a central vowel close to schwa). Efik is not a tone language in its written
# form the way Yoruba or Igbo are marked — the standard orthography does not
# write tone — so no diacritics beyond these appear.
#
# **Chemistry is deliberately absent, the `locales/pcm` case exactly.**
# `element-name` and `element-anion-name` are omitted, so all 130 keys between
# them fall back to English and `lint:i18n` reports the gap. Nigeria teaches
# secondary-school chemistry in English everywhere, Cross River State's
# schools included, and an Efik-medium classroom is not where a student meets
# "Sodium" or "Chloride" — the textbook already says those words in English.
# Filling the 130 keys in would produce a file character-identical to
# `locales/en` and claim a translation nothing in the curriculum makes true.
# `locales/pcm`, `locales/ha`, `locales/ig`, `locales/yo` and `locales/tiv`
# leave the same gap for the same ministry; Efik joins them rather than
# opening a new case.


## Style vocabulary

color =
    .black = ndịdi
    .white = afia
    .gray = ntanekpo
    .red = ọbara
    .orange = orañ
    .yellow = itiat-ntong
    .green = mfia
    .cyan = sayan
    .blue = mbiokpo
    .purple = ntong-ọbara
    .pink = ntong-ndịdiọn̄
    .brown = itiat
line-width =
    .thick = akwa
    .thin = nsịn
line-style =
    .dashed = eke ẹkpade ẹkpade
    .dotted = eke mme ntọt
fill-style =
    .horizontal = mme ọfụhọ eke ẹnyụn̄de
    .vertical = mme ọfụhọ eke ẹdarade
    .diagonal = mme ọfụhọ eke ẹdarade ke ọkpọkpọ
    .backdiagonal = mme ọfụhọ eke ẹdarade ke ọkpọkpọ efep
    .dots = mme ntọt
    .diamonds = mme diamon
noun =
    .line = ọfụhọ
    .line-segment = ubak ọfụhọ
    .ray = un̄wan̄a
    .vector = fektọ
    .curve = ọwan̄wan̄
    .function = function
    .parabola = parabola
    .polyline = ọfụhọ eke edinuenede
    .polygon = orụk n̄kanika
    .triangle = n̄kanika ita
    .rectangle = n̄kanika inan̄
    .circle = ekpịkpa
    .region = ebiet
    .point = ntọt
    .square = n̄kanika inan̄ ekemede kiet
    .diamond = diamon
    .cross = ekpri-ubọk
    .plus = idian
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] n̄kanika eke enyenede { $numSides } n̄kịk emi ekemde kiet
    }
# No grammatical gender, so this answers one token for every noun and the
# answer goes unused — the shape `locales/en` has.
noun-gender = kiet

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
style-filled-word = eke ẹyọhọde
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ye { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } ye { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } ye { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
style-border-clause =
    { $parts ->
        [with-article] ye ọkpọkpọ { $border }
        [and] ye ọkpọkpọ { $border }
        [and-article] ye ọkpọkpọ { $border }
       *[with] ye ọkpọkpọ { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = eke mîyọhọke
style-text =
    { $parts ->
        [background] { $color } ye ọkpọkpọ efep { $background }
       *[plain] { $color }
    }
style-background-none = idụhe n̄kpọ

## Boolean words

boolean-true = true
boolean-false = false

## Answer buttons

answer-submit-label = Nse Utom
answer-submit-label-no-correctness = Nọ Ibọrọ

## Sectional blocks

section-name =
    .activity = Utom
    .aside = Ikpri Ikọ
    .cascade = Uduak
    .definition = Ntịn̄
    .example = Uwụtn̄kpọ
    .exercise = Ndomo
    .exercises = Mme Ndomo
    .given-answer = Ibọrọ
    .note = Ntọn̄ọ
    .objectives = Mme Uduak
    .paragraphs = Mme Ubak Uwetn̄kpọ
    .part = Ikpehe
    .problem = Ọdiọn̄ọ
    .problems = Mme Ọdiọn̄ọ
    .proof = Uwụtn̄kpọ Akpanikọn̄
    .question = Mbụk
    .section = Ikpehe
    .solution = Ibiere
    .task = Utom
    .theorem = Eti Ikọ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ibuot

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebụl { $enumeration }
        [numbered-title] Tebụl { $enumeration }{ ": " }
        [unnumbered-title] Tebụl{ ": " }
       *[unnumbered] Tebụl
    }
figure-name =
    { $parts ->
        [numbered] Ndise { $enumeration }
        [numbered-caption] Ndise { $enumeration }{ ": " }
        [unnumbered-caption] Ndise{ ": " }
       *[unnumbered] Ndise
    }

## Paginator controls

paginator-previous = Mbemiso
paginator-next = N̄kaha
paginator-page = Page
paginator-page-status = { $pageLabel } { $currentPage } eke { $numPages }

## Piecewise functions

piecewise-condition-or = m̀mê
piecewise-condition-if = edieke
piecewise-condition-otherwise = ke n̄kpọ efen

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent — see the
## header above.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ndamban̄a Kemistri Emi Mîdotke
chemistry-invalid-ionic-compound = N̄kpọ Ionic Emi Mîdotke
