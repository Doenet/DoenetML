# Malayalam viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the -ുക infinitive Malayalam puts on a button — «കീബോർഡ്
# തുറക്കുക» — which is what a reader expects from software, and which is
# neutral about who is being addressed.
#
# Malayalam counts in two plural categories and marks the plural on the noun,
# so both are written out where the noun changes.
#
# Numbers render in Latin digits rather than in Malayalam numerals, which is
# the digit policy in the package README (#1615).


## Answer submission

answer-checking = പരിശോധിക്കുന്നു...
answer-submitting = സമർപ്പിക്കുന്നു...
answer-checking-status = ഉത്തരം പരിശോധിക്കുന്നു
answer-submitting-status = ഉത്തരം സമർപ്പിക്കുന്നു
answer-correct = ശരി
answer-incorrect = തെറ്റ്
answer-response-saved = ഉത്തരം സൂക്ഷിച്ചു
answer-percent-credit = { $percent }% മാർക്ക്
answer-percent-correct = { $percent }% ശരി
answer-percent-short = { $percent }%
max-credit-available = ലഭ്യമായ പരമാവധി മാർക്ക്: { $percent }%
attempts-remaining =
    { $count ->
        [0] ശ്രമങ്ങളൊന്നും ബാക്കിയില്ല
        [one] { $count } ശ്രമം ബാക്കി
       *[other] { $count } ശ്രമങ്ങൾ ബാക്കി
    }
validation-correct = (ശരി)
validation-incorrect = (തെറ്റ്)
validation-partially-correct = (ഭാഗികമായി ശരി)
answer-show-responses =
    { $count ->
        [one] { $answerId } നു ലഭിച്ച { $count } ഉത്തരം കാണിക്കുക
       *[other] { $answerId } നു ലഭിച്ച { $count } ഉത്തരങ്ങൾ കാണിക്കുക
    }

## Disclosure panels

feedback-heading = പ്രതികരണം
collapsible-click-to-open = (തുറക്കാൻ ക്ലിക്ക് ചെയ്യുക)
collapsible-click-to-close = (അടയ്ക്കാൻ ക്ലിക്ക് ചെയ്യുക)
collapsible-initializing = ആരംഭിക്കുന്നു...
footnote-show = അടിക്കുറിപ്പ് കാണിക്കുക
footnote-hide = അടിക്കുറിപ്പ് മറയ്ക്കുക
description-more-information = കൂടുതൽ വിവരം

## Controls

slider-previous = മുൻപത്തേത്
slider-next = അടുത്തത്
keyboard-open = കീബോർഡ് തുറക്കുക
keyboard-close = കീബോർഡ് അടയ്ക്കുക
choice-input-remove-choice = { $choice } നീക്കുക
matrix-remove-row = വരി നീക്കുക
matrix-add-row = വരി ചേർക്കുക
matrix-remove-column = നിര നീക്കുക
matrix-add-column = നിര ചേർക്കുക
subset-add-remove-points = ബിന്ദുക്കൾ ചേർക്കുക/നീക്കുക
subset-toggle-points-intervals = ബിന്ദുക്കളും ഇടവേളകളും തമ്മിൽ മാറ്റുക
subset-move-points = ബിന്ദുക്കൾ നീക്കുക
subset-clear = മായ്ക്കുക
# A `box` here is one orbital, drawn as a square: കളം.
orbital-add-row = വരി ചേർക്കുക
orbital-remove-row = വരി നീക്കുക
orbital-add-box = കളം ചേർക്കുക
orbital-remove-box = കളം നീക്കുക
orbital-add-up-arrow = മുകളിലേക്കുള്ള അമ്പ് ചേർക്കുക
orbital-add-down-arrow = താഴേക്കുള്ള അമ്പ് ചേർക്കുക
orbital-remove-arrow = അമ്പ് നീക്കുക
orbital-row-label = വരി { $row } ന്റെ ലേബൽ
pretzel-answer = ഉത്തരം

## Math input

math-input-preview-region = ഗണിത വ്യഞ്ജക പൂർവദൃശ്യം
math-input-preview = പൂർവദൃശ്യം
math-input-invalid-expression = അസാധുവായ വ്യഞ്ജകം:

## Document status

viewer-initializing = ആരംഭിക്കുന്നു...

## Errors

error-heading = പിശക്
# The ordinal «-ാം» opens with a combining vowel sign, so it needs a base
# character in front of it and cannot stand as a word of its own. It is
# invariant whatever number precedes it, so it is welded to the placeable with
# the hyphen Malayalam writes a digit ordinal with — the case the README's
# affix rule allows.
error-found-at =
    { $span ->
        [line] { $startLine }-ാം വരിയിൽ കണ്ടെത്തി.
       *[lines] { $startLine }–{ $endLine } വരികളിൽ കണ്ടെത്തി.
    }
document-contains-errors = ഈ രേഖയിൽ പിശകുകളുണ്ട്!
diagnostic-heading-error = പിശക്
diagnostic-heading-warning = മുന്നറിയിപ്പ്
diagnostic-heading-information = വിവരം
diagnostic-heading-hint = സൂചന
accessibility-heading-level-1 = WCAG AA പ്രാപ്യതാ ലംഘനം
accessibility-heading-level-2 = പ്രാപ്യതാ മുന്നറിയിപ്പ്
something-went-wrong = എന്തോ കുഴപ്പം സംഭവിച്ചു.
renderer-load-failed = ഒരു റെൻഡറർ ലോഡ് ചെയ്യാനായില്ല. ദയവായി പേജ് വീണ്ടും ലോഡ് ചെയ്യുക.
core-start-failed = രേഖാ ദർശിനി ആരംഭിക്കാനായില്ല. ദയവായി പേജ് വീണ്ടും ലോഡ് ചെയ്യുക.
