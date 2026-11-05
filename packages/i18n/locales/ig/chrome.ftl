# Igbo viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Igbo has a single plural category, so a countable message needs no
# selection — `[other]` covers every count. `[0]` is still spelled out where
# the English wording changes for zero, because that is a different sentence
# rather than a different number.
#
# A noun is not marked for number: «mgbalị { $count }» is both "1 attempt" and
# "5 attempts".


## Answer submission

answer-checking = Na-elele...
answer-submitting = Na-ezipu...
answer-checking-status = Na-elele azịza
answer-submitting-status = Na-ezipu azịza
answer-correct = Ọ ziri ezi
answer-incorrect = Ọ ezighi ezi
answer-response-saved = E chekwaala Azịza
answer-percent-credit = Akara { $percent }%
answer-percent-correct = { $percent }% Ziri ezi
answer-percent-short = { $percent }%
max-credit-available = Akara kachasị elu dị: { $percent }%
attempts-remaining =
    { $count ->
        [0] ọ dịghị mgbalị fọdụrụ
       *[other] mgbalị { $count } fọdụrụ
    }
validation-correct = (Ọ ziri ezi)
validation-incorrect = (Ọ ezighi ezi)
validation-partially-correct = (Ọ ziri ezi n'akụkụ)
answer-show-responses = Gosi azịza { $count } nye { $answerId }

## Disclosure panels

feedback-heading = Nzaghachi
collapsible-click-to-open = (pịa iji mepee)
collapsible-click-to-close = (pịa iji mechie)
collapsible-initializing = Na-amalite...
footnote-show = Gosi ihe ncheta ala
footnote-hide = Zoo ihe ncheta ala
description-more-information = ozi ndị ọzọ

## Controls

slider-previous = Azụ
slider-next = Ihu
keyboard-open = Mepee Ahụ Ihe Odide
keyboard-close = Mechie Ahụ Ihe Odide
choice-input-remove-choice = Wepụ { $choice }
matrix-remove-row = Wepụ ahịrị
matrix-add-row = Tinye ahịrị
matrix-remove-column = Wepụ ogidi
matrix-add-column = Tinye ogidi
subset-add-remove-points = Tinye/Wepụ ntụpọ
subset-toggle-points-intervals = Gbanwee n'etiti ntụpọ na oghere
subset-move-points = Kpụga Ntụpọ
subset-clear = Hichaa
# A `box` here is one orbital, drawn as a square: igbe.
orbital-add-row = Tinye Ahịrị
orbital-remove-row = Wepụ Ahịrị
orbital-add-box = Tinye Igbe
orbital-remove-box = Wepụ Igbe
orbital-add-up-arrow = Tinye Àkụ Elu
orbital-add-down-arrow = Tinye Àkụ Ala
orbital-remove-arrow = Wepụ Àkụ
orbital-row-label = Akara ahịrị { $row }
pretzel-answer = Azịza

## Math input

math-input-preview-region = nlele okwu mgbakọ na mwepụ
math-input-preview = Nlele
math-input-invalid-expression = Okwu na-ezighị ezi:

## Document status

viewer-initializing = Na-amalite...

## Errors

error-heading = Njehie
error-found-at =
    { $span ->
        [line] Achọtara ya n'ahịrị { $startLine }.
       *[lines] Achọtara ya n'ahịrị { $startLine }–{ $endLine }.
    }
document-contains-errors = Akwụkwọ a nwere njehie!
diagnostic-heading-error = Njehie
diagnostic-heading-warning = Ịdọ aka ná ntị
diagnostic-heading-information = Ozi
diagnostic-heading-hint = Ndụmọdụ
accessibility-heading-level-1 = Mmebi Nnweta WCAG AA
accessibility-heading-level-2 = Ịdọ aka ná ntị nke nnweta
something-went-wrong = Ihe ụfọdụ agaghị nke ọma.
renderer-load-failed = otu ngosi adaghị ibudata. Biko budataghachi ibe a.
core-start-failed = Ngosi akwụkwọ enweghị ike ịmalite. Biko budataghachi ibe a.
