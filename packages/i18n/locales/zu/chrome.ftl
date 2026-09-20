# Zulu viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Zulu has two plural categories, and a noun marks number with a class prefix
# rather than a suffix: «umzamo owodwa», «imizamo emihlanu». So the selects are
# kept and the noun changes shape inside them.
#
# A numeral takes the «ngu-» copulative when it stands against a noun, which is
# why several counted messages here write «ngu-{ $count }» rather than the bare
# placeable — the prefix is on a word this catalog writes, never welded to the
# value itself.


## Answer submission

answer-checking = Iyahlola...
answer-submitting = Iyathumela...
answer-checking-status = Ihlola impendulo
answer-submitting-status = Ithumela impendulo
answer-correct = Kulungile
answer-incorrect = Akulungile
answer-response-saved = Impendulo Ilondoloziwe
answer-percent-credit = Amamaki angu-{ $percent }%
answer-percent-correct = { $percent }% Kulungile
answer-percent-short = { $percent }%
max-credit-available = Amamaki aphezulu atholakalayo: { $percent }%
attempts-remaining =
    { $count ->
        [0] ayikho imizamo esele
        [one] kusele umzamo ongu-{ $count }
       *[other] kusele imizamo engu-{ $count }
    }
validation-correct = (Kulungile)
validation-incorrect = (Akulungile)
validation-partially-correct = (Kulungile ngokwengxenye)
answer-show-responses =
    { $count ->
        [one] Bonisa impendulo engu-{ $count } ku-{ $answerId }
       *[other] Bonisa izimpendulo ezingu-{ $count } ku-{ $answerId }
    }

## Disclosure panels

feedback-heading = Impendulo Yokuqondisa
collapsible-click-to-open = (chofoza ukuze uvule)
collapsible-click-to-close = (chofoza ukuze uvale)
collapsible-initializing = Iyaqalisa...
footnote-show = Bonisa inothi elingezansi
footnote-hide = Fihla inothi elingezansi
description-more-information = olunye ulwazi

## Controls

slider-previous = Emuva
slider-next = Phambili
keyboard-open = Vula Ikhibhodi
keyboard-close = Vala Ikhibhodi
choice-input-remove-choice = Susa { $choice }
matrix-remove-row = Susa umugqa
matrix-add-row = Engeza umugqa
matrix-remove-column = Susa ikholomu
matrix-add-column = Engeza ikholomu
subset-add-remove-points = Engeza/Susa amaphuzu
subset-toggle-points-intervals = Shintsha phakathi kwamaphuzu nezikhala
subset-move-points = Hambisa Amaphuzu
subset-clear = Sula
# A `box` here is one orbital, drawn as a square: ibhokisi.
orbital-add-row = Engeza Umugqa
orbital-remove-row = Susa Umugqa
orbital-add-box = Engeza Ibhokisi
orbital-remove-box = Susa Ibhokisi
orbital-add-up-arrow = Engeza Umcibisholo Obhekise Phezulu
orbital-add-down-arrow = Engeza Umcibisholo Obhekise Phansi
orbital-remove-arrow = Susa Umcibisholo
orbital-row-label = Ilebula lomugqa { $row }
pretzel-answer = Impendulo

## Math input

math-input-preview-region = ukubuka kuqala kwenkulumo yezibalo
math-input-preview = Buka Kuqala
math-input-invalid-expression = Inkulumo engavumelekile:

## Document status

viewer-initializing = Iyaqalisa...

## Errors

error-heading = Iphutha
error-found-at =
    { $span ->
        [line] Litholakale emugqeni { $startLine }.
       *[lines] Litholakale emigqeni { $startLine }–{ $endLine }.
    }
document-contains-errors = Lo mbhalo unamaphutha!
diagnostic-heading-error = Iphutha
diagnostic-heading-warning = Isixwayiso
diagnostic-heading-information = Ulwazi
diagnostic-heading-hint = Isexwayiso
accessibility-heading-level-1 = Ukwephulwa Kokufinyeleleka Kwe-WCAG AA
accessibility-heading-level-2 = Isixwayiso sokufinyeleleka
something-went-wrong = Kukhona okungahambanga kahle.
renderer-load-failed = esinye isibonisi sehlulekile ukulayisha. Sicela ulayishe ikhasi kabusha.
core-start-failed = Isibonisi sombhalo asikwazanga ukuqalwa. Sicela ulayishe ikhasi kabusha.
