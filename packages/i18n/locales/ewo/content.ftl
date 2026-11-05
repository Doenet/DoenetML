# Ewondo content catalog: the prose the core computes into the document.
# Selected by `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `ewo` is Ewondo, a Beti–Pahuin language of the Bantu family (Zone A70),
# spoken around Yaoundé and the Centre region of Cameroon. `Intl.DisplayNames`
# calls it "Ewondo" in English, which is also the name Ewondo speakers use of
# themselves in French and increasingly in English; there is no separate
# endonym mismatch the way `locales/ki` records for Gĩkũyũ.
#
# **`$gender` and `$role` go unused, and that is a data-confidence decision
# rather than a typological one.** Ewondo has a real noun-class system with
# adjective concord — unlike Kituba (`locales/ktu`), whose creole history
# actually erased it — but this seed does not have reliable class-prefix data
# for the specific nouns and adjectives this catalog needs, only for a couple
# of colour stems. Writing a partial concord table from unreliable memory
# would be worse than not forking: a wrong prefix reads as confidently wrong,
# where a flat answer reads as what it is, a placeholder. So `noun-gender`
# answers one token and every descriptive word is joined to its noun by the
# Ewondo associative particle «a» ("of/that is"), left uninflected. A speaker
# filling this in should treat `locales/ki` and `locales/bem` as the shape to
# grow into, not `locales/ktu` — the grammar is there, this seed just could
# not responsibly guess its details.
#
# The colour, drawing and geometry vocabulary leans on French loanwords —
# «rúzi» (rouge), «vɛktɛr» (vecteur), «poligɔn» (polygone) — adapted to Ewondo
# syllable shapes (open syllables, no consonant clusters). This is the ordinary
# shape Ewondo mathematical registers take: Cameroon's Centre region is taught
# secondary mathematics and science in French, the medium the loans come from.
# Only «vindi» (black) and «fup» (white) are native stems here; the rest of the
# palette had no confidently attested native word to reach for, which is the
# same gap `noun-gender` records, not a separate one.
#
# `Intl.PluralRules("ewo")` returns only `one` and `other`, the ordinary Bantu
# two-way split; no `$count` select below needs a category beyond those.
#
# The chemistry tables (`element-name`, `element-anion-name`) are left out of
# this catalog, so both fall back to English. This is the school-system case:
# secondary science in the Centre region, like the rest of Francophone
# Cameroon, is taught in French, not Ewondo — so a Yaoundé reader meets the
# periodic table in French rather than in either English or Ewondo, and
# neither this catalog nor `locales/fr` is the one a document actually reaches
# for it in practice. Leaving the keys absent is honest about that; inventing
# Ewondo element names nobody's classroom uses would not be.


## Style vocabulary

color =
    .black = vindi
    .white = fup
    .gray = ngri
    .red = rúzi
    .orange = oranzi
    .yellow = zoni
    .green = vɛrɛ
    .cyan = sian
    .blue = belu
    .purple = vyolɛ
    .pink = rɔzi
    .brown = maroŋ
line-width =
    .thick = abibí
    .thin = afefele
line-style =
    .dashed = a mimbaŋ
    .dotted = a mimpwɛ̃
fill-style =
    .horizontal = milɔn mi orizɔntal
    .vertical = milɔn mi vertikal
    .diagonal = milɔn mi diagonal
    .backdiagonal = milɔn mi diagonal, nkíli
    .dots = mimpwɛ̃
    .diamonds = milozãzi
noun =
    .line = liɲi
    .line-segment = segimã a liɲi
    .ray = rayɔŋ
    .vector = vɛktɛr
    .curve = kurbu
    .function = fɔŋksiɔŋ
    .parabola = parabɔl
    .polyline = poliliɲi
    .polygon = poligɔn
    .triangle = triyaŋgele
    .rectangle = rɛktãgele
    .circle = sɛrkele
    .region = reziɔŋ
    .point = pwɛ̃
    .square = kare
    .diamond = lozãzi
    .cross = krwa
    .plus = plisi
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligɔn a kɔte { $numSides }, a regilie
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
        [noun-tail] { $description } a { $noun } { $nounTail }
       *[noun] { $description } a { $noun }
    }
style-filled-word = tôbé
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } a { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } a { $noun } a { $pattern }
        [plain-tail] { $filled } { $color } a { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } a { $noun } { $nounTail } a { $pattern }
       *[plain] { $filled } { $color } a { $noun }
    }
style-border-clause =
    { $parts ->
        [with-article] a mfeg { $border }
        [and] a { $border } mfeg
        [and-article] a mfeg { $border }
       *[with] a mfeg { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = te tôbé
style-text =
    { $parts ->
        [background] { $color }, a ndoŋ { $background }
       *[plain] { $color }
    }
style-background-none = éziŋ

## Boolean words

boolean-true = true
boolean-false = false

## Answer buttons

answer-submit-label = Lɛk Nkɔbɔ
answer-submit-label-no-correctness = Lɔɔt Ajapkɔb

## Sectional blocks

section-name =
    .activity = Nkɔbɔ
    .aside = Nkɔ̂bɔ Bulú
    .cascade = Kaskad
    .definition = Ntili
    .example = Fetíla
    .exercise = Nkɔbɔ ya lat
    .exercises = Bikɔbɔ ya lat
    .given-answer = Ajapkɔb
    .note = Foɔn
    .objectives = Mimbolo
    .paragraphs = Beparagraf
    .part = Ekat
    .problem = Nsɔŋgɔlɔ
    .problems = Minsɔŋgɔlɔ
    .proof = Nfefeg
    .question = Nsili
    .section = Ekat
    .solution = Ajapkɔb
    .task = Nkɔbɔ
    .theorem = Teorɛm
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Ntílán

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabló { $enumeration }
        [numbered-title] Tabló { $enumeration }{ ": " }
        [unnumbered-title] Tabló{ ": " }
       *[unnumbered] Tabló
    }
figure-name =
    { $parts ->
        [numbered] Figír { $enumeration }
        [numbered-caption] Figír { $enumeration }{ ": " }
        [unnumbered-caption] Figír{ ": " }
       *[unnumbered] Figír
    }

## Paginator controls

paginator-previous = Osú
paginator-next = Ényiñ
paginator-page = Pázi
paginator-page-status = { $pageLabel } { $currentPage } dama { $numPages }

## Piecewise functions

piecewise-condition-or = to
piecewise-condition-if = nge
piecewise-condition-otherwise = ényiñ éziŋ

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so both
## fall back to English. See the header above for the school-system reason:
## secondary science in Ewondo-speaking Cameroon is taught in French.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Symbole Chimique a si mvɛ̃ te
chemistry-invalid-ionic-compound = Compound Ionique a si mvɛ̃ te
