# Telugu viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the bare నువ్వు imperative Telugu puts on a button — «కీబోర్డు
# తెరువు» — which is what a reader expects from software.
#
# Telugu counts in two plural categories and marks the plural on the noun, so
# both are written out where the noun changes.
#
# Numbers render in Latin digits rather than in Telugu numerals, which is the
# digit policy in the package README (#1615).


## Answer submission

answer-checking = సరిచూస్తోంది...
answer-submitting = సమర్పిస్తోంది...
answer-checking-status = సమాధానం సరిచూడబడుతోంది
answer-submitting-status = సమాధానం సమర్పించబడుతోంది
answer-correct = సరైనది
answer-incorrect = తప్పు
answer-response-saved = స్పందన భద్రపరచబడింది
answer-percent-credit = { $percent }% మార్కులు
answer-percent-correct = { $percent }% సరైనది
answer-percent-short = { $percent }%
max-credit-available = సాధ్యమైన గరిష్ఠ మార్కులు: { $percent }%
attempts-remaining =
    { $count ->
        [0] ప్రయత్నాలు ఏవీ మిగలలేదు
        [one] { $count } ప్రయత్నం మిగిలింది
       *[other] { $count } ప్రయత్నాలు మిగిలాయి
    }
validation-correct = (సరైనది)
validation-incorrect = (తప్పు)
validation-partially-correct = (పాక్షికంగా సరైనది)
answer-show-responses =
    { $count ->
        [one] { $answerId } కు వచ్చిన { $count } స్పందనను చూపు
       *[other] { $answerId } కు వచ్చిన { $count } స్పందనలను చూపు
    }

## Disclosure panels

feedback-heading = సమీక్ష
collapsible-click-to-open = (తెరవడానికి నొక్కండి)
collapsible-click-to-close = (మూయడానికి నొక్కండి)
collapsible-initializing = ప్రారంభమవుతోంది...
footnote-show = అధోజ్ఞాపికను చూపు
footnote-hide = అధోజ్ఞాపికను దాచు
description-more-information = మరింత సమాచారం

## Controls

slider-previous = మునుపటిది
slider-next = తదుపరిది
keyboard-open = కీబోర్డు తెరువు
keyboard-close = కీబోర్డు మూయి
choice-input-remove-choice = { $choice } ను తొలగించు
matrix-remove-row = వరుసను తొలగించు
matrix-add-row = వరుసను చేర్చు
matrix-remove-column = నిలువు వరుసను తొలగించు
matrix-add-column = నిలువు వరుసను చేర్చు
subset-add-remove-points = బిందువులను చేర్చు/తొలగించు
subset-toggle-points-intervals = బిందువులు, అంతరాల మధ్య మార్చు
subset-move-points = బిందువులను కదుపు
subset-clear = తుడిచివేయి
# A `box` here is one orbital, drawn as a square: గడి.
orbital-add-row = వరుసను చేర్చు
orbital-remove-row = వరుసను తొలగించు
orbital-add-box = గడిని చేర్చు
orbital-remove-box = గడిని తొలగించు
orbital-add-up-arrow = పైకి బాణం చేర్చు
orbital-add-down-arrow = కిందికి బాణం చేర్చు
orbital-remove-arrow = బాణాన్ని తొలగించు
orbital-row-label = వరుస { $row } కు లేబుల్
pretzel-answer = సమాధానం

## Math input

math-input-preview-region = గణిత సమాసం మునుజూపు
math-input-preview = మునుజూపు
math-input-invalid-expression = చెల్లని సమాసం:

## Document status

viewer-initializing = ప్రారంభమవుతోంది...

## Errors

error-heading = దోషం
# The ordinal «వ» is invariant whatever number precedes it, and Telugu writes
# it closed up against the digits — «1వ», not «1 వ» — so it is welded to the
# placeable, which is the case the README's affix rule allows.
error-found-at =
    { $span ->
        [line] { $startLine }వ పంక్తిలో కనుగొనబడింది.
       *[lines] { $startLine }–{ $endLine } పంక్తులలో కనుగొనబడింది.
    }
document-contains-errors = ఈ పత్రంలో దోషాలు ఉన్నాయి!
diagnostic-heading-error = దోషం
diagnostic-heading-warning = హెచ్చరిక
diagnostic-heading-information = సమాచారం
diagnostic-heading-hint = సూచన
accessibility-heading-level-1 = WCAG AA అందుబాటు ఉల్లంఘన
accessibility-heading-level-2 = అందుబాటు హెచ్చరిక
something-went-wrong = ఏదో తప్పు జరిగింది.
renderer-load-failed = ఒక రెండరర్ లోడ్ కాలేదు. దయచేసి పేజీని మళ్ళీ లోడ్ చేయండి.
core-start-failed = పత్ర దర్శినిని ప్రారంభించలేకపోయాం. దయచేసి పేజీని మళ్ళీ లోడ్ చేయండి.
