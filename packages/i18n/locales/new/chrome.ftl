# Newar / Nepal Bhasa (नेपाल भाषा, नेवाः भाय्) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari, not Ranjana.** Newar has one of the richest script
# histories in South Asia — Ranjana, Bhujimol, Prachalit and their
# relatives are Newar scripts in a way Devanagari is not, and Ranjana in
# particular is a living emblem of the language: it is carved on temples,
# painted on shopfronts, taught in classes and used for titles and headings
# throughout the Kathmandu Valley. A reviewer may reasonably have expected it
# here. This catalog nevertheless writes **Devanagari**, and the reason is
# about what a reader reads rather than about which script is the language's
# own. Continuous Newar prose — newspapers, the Nepal Bhasa Wikipedia,
# dictionaries, school materials, government notices, everything published
# since the twentieth century — is set in Devanagari; Ranjana is used for
# display, not for paragraphs, and a reader who reads Newar fluently reads it
# in these letters. There is a second, mechanical reason: the Newar script is
# encoded as **Newa** (U+11400–U+1147F), a young block whose font coverage in
# a browser is thin and inconsistent, and a
# catalog that renders as boxes on most machines helps nobody. Converting this
# catalog to Ranjana means converting **all four files at once**, never a
# mixture inside one catalog, and it is a real conversion rather than a
# transliteration — the conjunct repertoire and the orthographic conventions
# would have to be settled by someone who writes the script.
#
# **This seed leans on Nepali.** Newar and Nepali have shared the same valley,
# the same schoolrooms and the same Devanagari letters for a long time, and
# the technical vocabulary in these files — त्रुटि, चेतावनी, जानकारी, पंक्ति,
# स्तम्भ, अन्तराल, दस्तावेज — is the Sanskrit-and-Nepali register a Newar
# reader meets in Nepali schooling, not a Newar coinage. What is Newar here is
# the **frame**: मदु and मखु for the negations, दु for the existential, याये /
# यानादिसँ for the verb, नापं and निंतिं for the postpositions, लिसः for an
# answer, ल्यंगु for what remains. A message where that frame has slipped back
# into Nepali — where छ, छैन, गर्नुहोस् or को has appeared — is a defect rather
# than a variant, and is the single easiest thing to check in this catalog.
#
# **Controls take the honorific -दिसँ imperative** where they instruct the
# reader, and the -गु verbal noun where they name an action, which is what
# Newar software convention does.
#
# **Numbers render in Latin digits** rather than in Devanagari numerals, which
# is the digit policy in the package README (#1615). The grouping is the
# locale's; the ten characters are not.
#
# **No plural branches.** CLDR has no plural data for `new`, so a `one` or
# `few` category here would be text selected by somebody else's rules. The
# numeric literal `[0]` in `attempts-remaining` stays, because Fluent matches
# it against the number itself before any plural rule is consulted.


## Answer submission

answer-checking = जाँच यानाच्वंगु...
answer-submitting = छ्वयाच्वंगु...
answer-checking-status = लिसः जाँच यानाच्वंगु दु
answer-submitting-status = लिसः छ्वयाच्वंगु दु
answer-correct = ठीक
answer-incorrect = ठीक मखु
answer-response-saved = लिसः सुरक्षित जुल
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% ठीक
answer-percent-short = { $percent } %
max-credit-available = तःधंगु अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] छुं नं प्रयास ल्यंगु मदु
       *[other] { $count } प्रयास ल्यंगु दु
    }
validation-correct = (ठीक)
validation-incorrect = (ठीक मखु)
validation-partially-correct = (छगू भाग ठीक)
answer-show-responses =
    { $count ->
       *[other] { $answerId } या { $count } लिसः क्यनेगु
    }


## Disclosure panels

feedback-heading = प्रतिक्रिया
collapsible-click-to-open = (खुल्ला यायेत क्लिक यानादिसँ)
collapsible-click-to-close = (बन्द यायेत क्लिक यानादिसँ)
collapsible-initializing = शुरु यानाच्वंगु...
footnote-show = पादटिप्पणी क्यनेगु
footnote-hide = पादटिप्पणी लुकायेगु
description-more-information = अप्व जानकारी


## Controls

slider-previous = न्ह्यः
slider-next = लिपा
keyboard-open = किबोर्ड खुल्ला यायेगु
keyboard-close = किबोर्ड बन्द यायेगु
choice-input-remove-choice = { $choice } पिकायेगु
matrix-remove-row = पंक्ति पिकायेगु
matrix-add-row = पंक्ति तयेगु
matrix-remove-column = स्तम्भ पिकायेगु
matrix-add-column = स्तम्भ तयेगु
subset-add-remove-points = बिन्दु तयेगु/पिकायेगु
subset-toggle-points-intervals = बिन्दु व अन्तराल बदलेगु
subset-move-points = बिन्दु न्ह्याकेगु
subset-clear = सफा यायेगु
orbital-add-row = पंक्ति तयेगु
orbital-remove-row = पंक्ति पिकायेगु
orbital-add-box = बाकस तयेगु
orbital-remove-box = बाकस पिकायेगु
orbital-add-up-arrow = च्वय् ल्हाःगु तीर तयेगु
orbital-add-down-arrow = क्वय् ल्हाःगु तीर तयेगु
orbital-remove-arrow = तीर पिकायेगु
orbital-row-label = पंक्ति { $row } या नां
pretzel-answer = लिसः


## Math input

math-input-preview-region = गणितीय अभिव्यक्तिया झलक
math-input-preview = झलक
math-input-invalid-expression = अवैध अभिव्यक्ति:


## Document status

viewer-initializing = शुरु यानाच्वंगु...


## Errors

error-heading = त्रुटि
error-found-at =
    { $span ->
        [line] { $startLine } लाइनय् लुत।
       *[lines] { $startLine }–{ $endLine } लाइनय् लुत।
    }
document-contains-errors = थ्व दस्तावेजय् त्रुटि दु!
diagnostic-heading-error = त्रुटि
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = इशारा
accessibility-heading-level-1 = WCAG AA पहुँचयोग्यता उल्लङ्घन
accessibility-heading-level-2 = पहुँचयोग्यता सूचना
something-went-wrong = छुं गल्ती जुल।
renderer-load-failed = छगू रेन्डरर लोड जुइ मफुत। कृपया पेज हानं लोड यानादिसँ।
core-start-failed = थ्व दस्तावेज शुरु याये मफुत। कृपया पेज हानं लोड यानादिसँ।
core-start-failed-busy = थ्व दस्तावेज शुरु याये मफुत। छगू इलय् दक्व दस्तावेज शुरु जुयाच्वंगु खनाः, कम्ज्या याइगु उपकरणय् थ्व अप्व इलं काइ। मेमेगु दस्तावेज सिधयेधुंकाः पेज हानं लोड यात धाःसा ग्वाहालि जुइ फु।
core-start-failed-retry = थ्व दस्तावेज शुरु याये मफुत।
core-start-failed-busy-retry = थ्व दस्तावेज शुरु याये मफुत। छगू इलय् दक्व दस्तावेज शुरु जुयाच्वंगु खनाः, कम्ज्या याइगु उपकरणय् थ्व अप्व इलं काइ।
core-start-retry = हानं कुतः यानादिसँ
saved-state-unavailable = छिगु सुरक्षित ज्या लोड याये मफुत।
