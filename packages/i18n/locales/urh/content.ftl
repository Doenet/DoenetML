# Urhobo content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `chrome.ftl`'s header for the family (Southwestern Edoid, Volta-Niger),
# the pairing with `locales/bin`, and the note on how thin online lexical
# coverage for Urhobo is.
#
# Urhobo has no grammatical gender and no noun-class agreement that an
# adjective needs to mark — the same finding this batch's sibling seed made
# for Bini — so `$gender` and `$role` go unused here exactly as they do in
# English and in Yoruba's catalog. `noun-gender` is `neuter` throughout.
#
# Adjectives and other modifiers in Urhobo follow the noun they describe
# (Qualifier + Noun + modifier + Adjective, per the descriptive grammar this
# seed drew on), so — like Yoruba and Malay — the composition messages here
# put the noun before its adjectives rather than after.
#
# This seed leaves out `element-name` and `element-anion-name`: secondary
# science in Nigeria, including in Urhobo-speaking Delta State, is taught in
# English, and Urhobo has no settled chemical nomenclature of its own to seed
# those 130 keys from — the same reasoning already recorded for Yoruba, Igbo,
# Hausa and the other Nigerian languages in this repository's roster. Both
# keys fall back to English, and `lint:i18n` will report the gap as expected.
#
# Basic color, number and a few other everyday words below come from the
# Urhobo dictionary and word-list material this seed could find online; the
# rest of the technical vocabulary (geometry nouns, style words) is not
# attested anywhere available to this seed, so it is rendered as an English
# loanword fit to Urhobo spelling — flagged here as the first thing for a
# speaker to replace.


## Style vocabulary

color =
    .black = dudu
    .white = fuafua
    .gray = grei
    .red = redi
    .orange = orenji
    .yellow = yẹlo
    .green = griini
    .cyan = sayan
    .blue = bulu
    .purple = pọpol
    .pink = pinki
    .brown = brawun
line-width =
    .thick = ro gbanro
    .thin = ro dinrin
line-style =
    .dashed = ro vwo edaesi
    .dotted = ro vwo ẹkpo
fill-style =
    .horizontal = eyin ro fẹẹ
    .vertical = eyin ro tọtọ
    .diagonal = eyin ro krisikrọsi
    .backdiagonal = eyin ro krisikrọsi ephiare
    .dots = ẹkpo
    .diamonds = daimọn
noun =
    .line = layin
    .line-segment = ẹkpẹrọ layin
    .ray = rey
    .vector = vẹkto
    .curve = kọvu
    .function = fọkshọn
    .parabola = parabola
    .polyline = poli-layin
    .polygon = poligọn
    .triangle = traengul
    .rectangle = rẹktangul
    .circle = sakul
    .region = ẹkẹ
    .point = pọint
    .square = skwia
    .diamond = daimọn
    .cross = krọsi
    .plus = plọsi
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligọn ro dogba, vwo eyin { $numSides }
    }
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
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = ro vwo evwo vwẹrhọ
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } vwẹ { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } vwẹ { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } vwẹ { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
style-border-clause =
    { $parts ->
        [with-article] vwẹ ẹkpẹrọ { $border }
        [and] vẹ ẹkpẹrọ { $border }
        [and-article] vẹ ẹkpẹrọ { $border }
       *[with] vwẹ ẹkpẹrọ { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = ro vwo evwo vwẹrhọ-e
style-text =
    { $parts ->
        [background] { $color } vwẹ ẹkẹ-otọ { $background }
       *[plain] { $color }
    }
style-background-none = ovwan

## Boolean words

boolean-true = true
boolean-false = false

## Answer buttons

answer-submit-label = Chek Iruo
answer-submit-label-no-correctness = Sọmit Ẹkpahọnphiyọ

## Sectional blocks

section-name =
    .activity = Iruo
    .aside = Ota-ephiare
    .cascade = Kaskedi
    .definition = Odjekọ
    .example = Udje
    .exercise = Iruo-erhirhie
    .exercises = Iruo-erhirhie
    .given-answer = Ẹkpahọnphiyọ
    .note = Odjekọ
    .objectives = Ekpokpọ
    .paragraphs = Paragrafu
    .part = Ẹkpẹrọ
    .problem = Otọfa
    .problems = Eyin Otọfa
    .proof = Uyota
    .question = Onọ
    .section = Ẹkẹ
    .solution = Efejorin
    .task = Iruo
    .theorem = Iyẹrẹ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Uphiudu

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tebul { $enumeration }
        [numbered-title] Tebul { $enumeration }{ ": " }
        [unnumbered-title] Tebul{ ": " }
       *[unnumbered] Tebul
    }
figure-name =
    { $parts ->
        [numbered] Fọtọ { $enumeration }
        [numbered-caption] Fọtọ { $enumeration }{ ": " }
        [unnumbered-caption] Fọtọ{ ": " }
       *[unnumbered] Fọtọ
    }

## Paginator controls

paginator-previous = Ọsiẹvwin
paginator-next = Ọrhirie
paginator-page = Pej
paginator-page-status = { $pageLabel } { $currentPage } vwẹ { $numPages }

## Piecewise functions

piecewise-condition-or = yẹrẹ
piecewise-condition-if = wọ da nẹ
piecewise-condition-otherwise = ọvo ọfa

## Chemistry
##
## Left out — see this file's header for why: Nigerian secondary science,
## including in Delta State, is taught in English, and this seed found no
## settled Urhobo chemical nomenclature to draw on.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ami-Kemistri ro Fioma
chemistry-invalid-ionic-compound = Ọbọ-Aiọni ro Fioma
