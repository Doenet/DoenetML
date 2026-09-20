# Shona viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Shona has two plural categories, and whether a counted noun changes shape
# depends on which class it is in — which is why the two counted messages here
# do different things. «edzo», an attempt, is class 5 and takes «ma-» in the
# plural, so `attempts-remaining` keeps its select. «mhinduro», an answer, is
# class 9, whose plural is class 10 and identical to it, so
# `answer-show-responses` drops its select rather than writing a `[one]` that
# repeats its `[other]`.
#
# `attempts-remaining` also keeps its `[0]` branch, an exact-value match rather
# than a plural category, which says «hapana» instead of counting to zero.


## Answer submission

answer-checking = Iri kuongorora...
answer-submitting = Iri kutumira...
answer-checking-status = Iri kuongorora mhinduro
answer-submitting-status = Iri kutumira mhinduro
answer-correct = Yakarurama
answer-incorrect = Haina kururama
answer-response-saved = Mhinduro Yachengetwa
answer-percent-credit = Mamakisi { $percent }%
answer-percent-correct = { $percent }% Yakarurama
answer-percent-short = { $percent } %
max-credit-available = Mamakisi epamusoro anowanikwa: { $percent }%
attempts-remaining =
    { $count ->
        [0] hapana edzo yasara
        [one] edzo { $count } yasara
       *[other] maedzo { $count } asara
    }
validation-correct = (Yakarurama)
validation-incorrect = (Haina kururama)
validation-partially-correct = (Yakarurama pane zvimwe)
answer-show-responses = Ratidza mhinduro { $count } dza{ $answerId }

## Disclosure panels

feedback-heading = Mhinduro yeMudzidzisi
collapsible-click-to-open = (dzvanya kuti uvhure)
collapsible-click-to-close = (dzvanya kuti uvhare)
collapsible-initializing = Iri kutanga...
footnote-show = Ratidza cherechedzo yepasi
footnote-hide = Vanza cherechedzo yepasi
description-more-information = mamwe mashoko

## Controls

slider-previous = Yapfuura
slider-next = Inotevera
keyboard-open = Vhura Kibhodhi
keyboard-close = Vhara Kibhodhi
choice-input-remove-choice = Bvisa { $choice }
matrix-remove-row = Bvisa mutsara wakarara
matrix-add-row = Wedzera mutsara wakarara
matrix-remove-column = Bvisa mutsara wakamira
matrix-add-column = Wedzera mutsara wakamira
subset-add-remove-points = Wedzera/Bvisa mapoindi
subset-toggle-points-intervals = Chinjanisa pakati pemapoindi nenhambo
subset-move-points = Fambisa Mapoindi
subset-clear = Dzima
# A `box` here is one orbital, drawn as a square: «bhokisi».
orbital-add-row = Wedzera Mutsara
orbital-remove-row = Bvisa Mutsara
orbital-add-box = Wedzera Bhokisi
orbital-remove-box = Bvisa Bhokisi
orbital-add-up-arrow = Wedzera Museve Wekumusoro
orbital-add-down-arrow = Wedzera Museve Wepasi
orbital-remove-arrow = Bvisa Museve
orbital-row-label = Zita remutsara { $row }
pretzel-answer = Mhinduro

## Math input

math-input-preview-region = pfungwa yekutarisa kwechirevo chemasvomhu
math-input-preview = Tarisa
math-input-invalid-expression = Chirevo hachina kururama:

## Document status

viewer-initializing = Iri kutanga...

## Errors

error-heading = Kukanganisa
error-found-at =
    { $span ->
        [line] Yawanikwa pamutsara { $startLine }.
       *[lines] Yawanikwa pamitsara { $startLine }–{ $endLine }.
    }
document-contains-errors = Gwaro rino rine zvikanganiso!
diagnostic-heading-error = Kukanganisa
diagnostic-heading-warning = Yambiro
diagnostic-heading-information = Ruzivo
diagnostic-heading-hint = Zano
accessibility-heading-level-1 = Kutyorwa kweWCAG AA kweKuwanikwa
accessibility-heading-level-2 = Yambiro yekuwanikwa
something-went-wrong = Pane chakakanganisika.
renderer-load-failed = muratidzi mumwe wakundikana kurodha. Ndapota dzokorora peji.
core-start-failed = Muratidzi wegwaro haana kukwanisa kutanga. Ndapota dzokorora peji.
