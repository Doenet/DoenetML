# Scottish Gaelic viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Gaelic counts in four plural categories — `one`, `two`, `few` and `other` —
# one fewer than Irish, which keeps a separate `many` for the eclipsing
# numerals seven to ten. What separates `two` here is the dual: «dà» leaves the
# noun singular and lenites it, exactly as «aon» does — so the `two` branch
# reads like `one` rather than like `few`, and only `few` takes a plural noun.


## Answer submission

answer-checking = Ga dhearbhadh…
answer-submitting = Ga chur…
answer-checking-status = A' dearbhadh na freagairte
answer-submitting-status = A' cur na freagairte
answer-correct = Ceart
answer-incorrect = Ceàrr
answer-response-saved = Chaidh an fhreagairt a shàbhaladh
answer-percent-credit = { $percent }% de chreideas
answer-percent-correct = { $percent }% ceart
answer-percent-short = { $percent } %
max-credit-available = An creideas as motha a tha ri fhaighinn: { $percent }%
attempts-remaining =
    { $count ->
        [0] chan eil oidhirp air fhàgail
        [one] { $count } oidhirp air fhàgail
        [two] { $count } oidhirp air fhàgail
        [few] { $count } oidhirpean air fhàgail
       *[other] { $count } oidhirp air fhàgail
    }
validation-correct = (Ceart)
validation-incorrect = (Ceàrr)
validation-partially-correct = (Ceart gu ìre)
answer-show-responses =
    { $count ->
        [one] Seall { $count } fhreagairt air { $answerId }
        [two] Seall { $count } fhreagairt air { $answerId }
        [few] Seall { $count } freagairtean air { $answerId }
       *[other] Seall { $count } freagairt air { $answerId }
    }

## Disclosure panels

feedback-heading = Beachdan
collapsible-click-to-open = (briog gus a fhosgladh)
collapsible-click-to-close = (briog gus a dhùnadh)
collapsible-initializing = Ga thòiseachadh…
footnote-show = Seall am bun-nòta
footnote-hide = Falaich am bun-nòta
description-more-information = barrachd fiosrachaidh

## Controls

slider-previous = Air ais
slider-next = Air adhart
keyboard-open = Fosgail am meur-chlàr
keyboard-close = Dùin am meur-chlàr
choice-input-remove-choice = Thoir { $choice } air falbh
matrix-remove-row = Thoir sreath air falbh
matrix-add-row = Cuir sreath ris
matrix-remove-column = Thoir colbh air falbh
matrix-add-column = Cuir colbh ris
subset-add-remove-points = Cuir puingean ris / thoir air falbh
subset-toggle-points-intervals = Toglaich eadar puingean is eadaramhan
subset-move-points = Gluais na puingean
subset-clear = Falamhaich
orbital-add-row = Cuir sreath ris
orbital-remove-row = Thoir sreath air falbh
orbital-add-box = Cuir bogsa ris
orbital-remove-box = Thoir bogsa air falbh
orbital-add-up-arrow = Cuir saighead-suas ris
orbital-add-down-arrow = Cuir saighead-sìos ris
orbital-remove-arrow = Thoir saighead air falbh
orbital-row-label = Leubail airson sreath { $row }
pretzel-answer = Freagairt

## Math input

math-input-preview-region = ro-shealladh air an abairt mhatamataigeach
math-input-preview = Ro-shealladh
math-input-invalid-expression = Abairt mhì-dhligheach:

## Document status

viewer-initializing = Ga thòiseachadh…

## Errors

error-heading = Mearachd
error-found-at =
    { $span ->
        [line] Chaidh a lorg air loidhne { $startLine }.
       *[lines] Chaidh a lorg air loidhnichean { $startLine }–{ $endLine }.
    }
document-contains-errors = Tha mearachdan san sgrìobhainn seo!
diagnostic-heading-error = Mearachd
diagnostic-heading-warning = Rabhadh
diagnostic-heading-information = Fiosrachadh
diagnostic-heading-hint = Sanas
accessibility-heading-level-1 = Briseadh so-ruigsinneachd WCAG AA
accessibility-heading-level-2 = Rabhadh so-ruigsinneachd
something-went-wrong = Chaidh rudeigin ceàrr.
renderer-load-failed = dh'fhàillig le reandaraiche a luchdachadh. Ath-luchdaich an duilleag.
core-start-failed = Cha b' urrainnear sealladair na sgrìobhainn a thòiseachadh. Ath-luchdaich an duilleag.
