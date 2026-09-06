# Limburgish (Limburgs) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **Veldeke spelling**, the convention Limburgish
# publishing on the Dutch side of the border uses. Two things in it are
# spelling rather than decoration: the digraphs **«tj»** and **«dj»** write
# palatalized stops — «pöntj», «vierkantj» — and are two letters standing for
# one sound rather than a stray consonant; and the diaereses in «ö», «ü», «ä»
# are vowels of their own, not decorated Dutch ones.
#
# **This is a standard over a spread of varieties.** Limburgish is a dialect
# continuum with no single settled written norm, and this file writes the
# central Veldeke-based koine rather than Maastrichtian, Venloos or Kerkraads
# specifically — the trade `locales/sc` and `locales/rm` already record. A
# deployment that wants a variety supplies its own catalog as
# `localeResources`.
#
# **`li` has an ISO 639-1 code**, so a reader can arrive under either `li` or
# the alpha-3 `lim`, which `Intl.getCanonicalLocales` folds for us.
# `negotiate.test.ts` pins both doors, and `li-NL` and `li-BE` filter to this
# catalog unaided.
#
# **Number.** CLDR has **no** plural rules for `li`:
# `Intl.PluralRules("li")` resolves to the runtime's default locale, so a
# `zero`, `two`, `few` or `many` branch here would be selected by some other
# language. None appears anywhere. `one`/`other` is kept because it is the
# split the fallback happens to make correctly for Limburgish too, and `[0]` is
# matched against the number itself and so stays legal.


## Answer submission

answer-checking = Aan 't kieke…
answer-submitting = Aan 't versjikke…
answer-checking-status = 't Antwoord weurt gekeke
answer-submitting-status = 't Antwoord weurt versjik
answer-correct = Good
answer-incorrect = Verkierd
answer-response-saved = Antwoord bewaard
answer-percent-credit = { $percent }% pungte
answer-percent-correct = { $percent }% good
answer-percent-short = { $percent } %
max-credit-available = Miest te haole pungte: { $percent }%
attempts-remaining =
    { $count ->
        [0] gein poginge mie euver
        [one] { $count } poging euver
       *[other] { $count } poginge euver
    }
validation-correct = (Good)
validation-incorrect = (Verkierd)
validation-partially-correct = (Deilswies good)
answer-show-responses =
    { $count ->
        [one] Wies { $count } antwoord bie { $answerId }
       *[other] Wies { $count } antwoorde bie { $answerId }
    }

## Disclosure panels

feedback-heading = Trökkoppeling
collapsible-click-to-open = (klik veur ope te doon)
collapsible-click-to-close = (klik veur toe te doon)
collapsible-initializing = Weurt opgestart…
footnote-show = Wies de voetnoot
footnote-hide = Versjtaek de voetnoot
description-more-information = mie informatie

## Controls

slider-previous = Veurige
slider-next = Volgende
keyboard-open = Doog 't toetsebord ope
keyboard-close = Doog 't toetsebord toe
choice-input-remove-choice = Haol { $choice } weg
matrix-remove-row = Haol e riej weg
matrix-add-row = Doog e riej derbie
matrix-remove-column = Haol e kolom weg
matrix-add-column = Doog e kolom derbie
subset-add-remove-points = Pöntj derbie doon / weghaole
subset-toggle-points-intervals = Wissel tösje pöntje en intervalle
subset-move-points = Versjuuf de pöntje
subset-clear = Maak leeg
orbital-add-row = Doog e riej derbie
orbital-remove-row = Haol e riej weg
orbital-add-box = Doog e vekske derbie
orbital-remove-box = Haol e vekske weg
orbital-add-up-arrow = Doog e pieltje nao bove derbie
orbital-add-down-arrow = Doog e pieltje nao ongder derbie
orbital-remove-arrow = Haol 't pieltje weg
orbital-row-label = Naam veur riej { $row }
pretzel-answer = Antwoord

## Math input

math-input-preview-region = veurbeeld van de wiskundige uutdrökking
math-input-preview = Veurbeeld
math-input-invalid-expression = Uutdrökking deug neet:

## Document status

viewer-initializing = Weurt opgestart…

## Errors

error-heading = Faeler
error-found-at =
    { $span ->
        [line] Gevónje op regel { $startLine }.
       *[lines] Gevónje op de regels { $startLine }–{ $endLine }.
    }
document-contains-errors = In dit document zitte faelers!
diagnostic-heading-error = Faeler
diagnostic-heading-warning = Waarsjuwing
diagnostic-heading-information = Informatie
diagnostic-heading-hint = Tip
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = WCAG AA-euvertraeding van de toegankelikheid
accessibility-heading-level-2 = Melding euver de toegankelikheid
something-went-wrong = D'r is get misgegange.
renderer-load-failed = e weergaafmoduul is neet gelaje. Laad de blaadzie opnuuj.
core-start-failed = Dit document kós neet gestart waere. Laad de blaadzie opnuuj.
core-start-failed-busy = Dit document kós neet gestart waere. Mie documente startde tegeliek, en op e langsamer apparaat kan det langer doere. De blaadzie opnuuj laje kan helpe wen de anger documente klaor zin.
core-start-failed-retry = Dit document kós neet gestart waere.
core-start-failed-busy-retry = Dit document kós neet gestart waere. Mie documente startde tegeliek, en op e langsamer apparaat kan det langer doere.
core-start-retry = Probeer 't opnuuj
saved-state-unavailable = Dien bewaarde werk kós neet gelaje waere.
