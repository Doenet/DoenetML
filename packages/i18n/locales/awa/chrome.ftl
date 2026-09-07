# Awadhi (अवधी) viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari**, which is what Awadhi is written in wherever it is
# written at all — in Ramcharitmanas editions, in schoolbooks about it, and
# online. Kaithi is historical and is not used here. Digits are **Latin**
# (`1`, `2`, `1,234`), not Devanagari, because that is what DoenetML pins for
# every locale in `src/intl.ts`; the grouping separator is the locale's own.
#
# **What is Awadhi is the frame, and it is used consistently across all four
# files of this catalog rather than only in this one.** The
# copula is «अहै» / «अहैं», the negator «नाहीं», the genitive «क» beside the
# borrowed «के», *for* is «खातिर», *and* is «अउर», *because* is «काहे से कि»,
# *like* is «जइसे», *this* is «ई» with oblique «एह», *some / any* is «कउनो»,
# *again* is «फेर». A button carries the honorific imperative in **-औ** —
# «खोलौ», «हटावौ», «जोड़ौ», «देखावौ» — which is the form the seed is least
# sure of: some descriptions of Awadhi give **-अ** («खोला», «देखावा») for the
# same person, and a reviewer who prefers that shape should change all four
# files at once rather than message by message.
#
# **The technical vocabulary is Hindi and Sanskrit, and that is declared
# rather than disguised.** «कीबोर्ड», «पंक्ति», «स्तंभ», «व्यंजक», «त्रुटि»,
# «सुगम्यता», «पूर्वावलोकन» are the words an Awadhi speaker has met in school
# and on a screen, in Hindi. Where Awadhi's own everyday word is the one a
# reader would use, it is used instead — across the catalog, not only in this
# file: «जवाब» rather than «उत्तर» and «गलत» here, «करिया», «उजर», «पियर»,
# «हरियर» among `content.ftl`'s colours.
#
# **Counts.** CLDR has no plural data for `awa`, so `Intl.PluralRules` would
# resolve it against the runtime's own locale and any `[one]` branch would be
# selected by somebody else's rules. `answer-show-responses` therefore drops
# the selector entirely and writes one form, and the only branch on a number
# left in this file is `attempts-remaining`'s explicit `[0]`, which Fluent
# matches against the number itself rather than against a category. An Awadhi noun is unmarked after a
# numeral in any case, so one form is right.


## Answer submission

answer-checking = जाँचल जात अहै...
answer-submitting = पठावल जात अहै...
answer-checking-status = जवाब जाँचल जात अहै
answer-submitting-status = जवाब पठावल जात अहै
answer-correct = सही
answer-incorrect = गलत
answer-response-saved = जवाब सहेजल गा
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% सही
answer-percent-short = { $percent }%
max-credit-available = सबसे जादा मिलै वाला अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कउनो मौका नाहीं बचा
       *[other] { $count } मौका बचा
    }
validation-correct = (सही)
validation-incorrect = (गलत)
validation-partially-correct = (कुछ हद तक सही)
answer-show-responses = { $answerId } क { $count } जवाब देखावौ


## Disclosure panels

feedback-heading = राय
collapsible-click-to-open = (खोलै खातिर क्लिक करौ)
collapsible-click-to-close = (बंद करै खातिर क्लिक करौ)
collapsible-initializing = सुरू कीन जात अहै...
footnote-show = पादटिप्पणी देखावौ
footnote-hide = पादटिप्पणी छिपावौ
description-more-information = अउर जानकारी


## Controls

slider-previous = पहिले
slider-next = आगे
keyboard-open = कीबोर्ड खोलौ
keyboard-close = कीबोर्ड बंद करौ
choice-input-remove-choice = { $choice } हटावौ
matrix-remove-row = पंक्ति हटावौ
matrix-add-row = पंक्ति जोड़ौ
matrix-remove-column = स्तंभ हटावौ
matrix-add-column = स्तंभ जोड़ौ
subset-add-remove-points = बिंदु जोड़ौ/हटावौ
subset-toggle-points-intervals = बिंदु अउर अंतराल क बीच बदलौ
subset-move-points = बिंदु सरकावौ
subset-clear = साफ करौ
# A `box` here is one orbital, drawn as a square: खाँचा.
orbital-add-row = पंक्ति जोड़ौ
orbital-remove-row = पंक्ति हटावौ
orbital-add-box = खाँचा जोड़ौ
orbital-remove-box = खाँचा हटावौ
orbital-add-up-arrow = ऊपर क तीर जोड़ौ
orbital-add-down-arrow = नीचे क तीर जोड़ौ
orbital-remove-arrow = तीर हटावौ
orbital-row-label = पंक्ति { $row } क लेबल
pretzel-answer = जवाब


## Math input

math-input-preview-region = गणितीय व्यंजक क पूर्वावलोकन
math-input-preview = पूर्वावलोकन
math-input-invalid-expression = अमान्य व्यंजक:


## Document status

viewer-initializing = सुरू कीन जात अहै...


## Errors

error-heading = त्रुटि
error-found-at =
    { $span ->
        [line] पंक्ति { $startLine } मा मिली।
       *[lines] पंक्ति { $startLine }–{ $endLine } मा मिली।
    }
document-contains-errors = एह दस्तावेज मा त्रुटि अहैं!
diagnostic-heading-error = त्रुटि
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = संकेत
accessibility-heading-level-1 = WCAG AA सुगम्यता उल्लंघन
accessibility-heading-level-2 = सुगम्यता चेतावनी
something-went-wrong = कुछ गलत होइ गा।
renderer-load-failed = एक रेंडरर लोड नाहीं होइ पावा। कृपया पन्ना फेर से लोड करौ।
core-start-failed = ई दस्तावेज सुरू नाहीं होइ पावा। कृपया पन्ना फेर से लोड करौ।
core-start-failed-busy = ई दस्तावेज सुरू नाहीं होइ पावा। एक्के संग कई दस्तावेज सुरू होत रहे, अउर धीमे यंत्र पर एह मा जादा समय लागत अहै। दूसर दस्तावेज पूरा होइ जाँय तब पन्ना फेर से लोड करै से काम बनि सकत अहै।
core-start-failed-retry = ई दस्तावेज सुरू नाहीं होइ पावा।
core-start-failed-busy-retry = ई दस्तावेज सुरू नाहीं होइ पावा। एक्के संग कई दस्तावेज सुरू होत रहे, अउर धीमे यंत्र पर एह मा जादा समय लागत अहै।
core-start-retry = फेर कोसिस करौ
saved-state-unavailable = तोहार सहेजल काम लोड नाहीं होइ पावा।
