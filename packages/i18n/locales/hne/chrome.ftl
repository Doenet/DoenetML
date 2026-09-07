# Chhattisgarhi (छत्तीसगढ़ी) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari**, which is the only script Chhattisgarhi is written
# in — it is a scheduled state language of Chhattisgarh with a Devanagari
# print tradition and no competing script. Digits are **Latin** (`1`, `2`,
# `1,234`), not Devanagari, because that is what DoenetML pins for every
# locale in `src/intl.ts`; the grouping separator is the locale's own.
#
# **What is Chhattisgarhi here is the frame, and it is used consistently.**
# The copula is «हे» / «हें», the negator «नइ», the dative and purposive is
# **«बर»** — *for* — which is the single most visible Chhattisgarhi word in
# this catalog and the quickest way to tell these files from Hindi at a
# glance. Beside it: «अउ» for *and*, «काबर के» for *because*, «तेकर सेती» for
# *therefore*, «कहूँ» for *if*, «नइते» for *otherwise*, «ले» for *from / out
# of*, «ला» for the accusative, «ए» for *this*, «कोनो» for *any*, and the
# plural marker **«मन»** written as a separate word after the noun («बिंदु
# मन», «रेखा मन»). Buttons carry the honorific imperative in **-व** —
# «खोलव», «हटावव», «जोड़व», «देखावव».
#
# **The technical vocabulary is Hindi and Sanskrit, and that is declared
# rather than disguised.** «कीबोर्ड», «पंक्ति», «स्तंभ», «व्यंजक», «त्रुटि»,
# «सुगम्यता», «पूर्वावलोकन» are the words a Chhattisgarhi speaker has met in
# school and on a screen, in Hindi. Where the language's own everyday word is
# the one a reader would use, it is used instead — across the catalog, not
# only in this file: «जवाब», «गलत» and «बाँचे» here, «करिया», «पंडरा»,
# «पींयर», «हरियर» among `content.ftl`'s colours.
#
# **Counts.** CLDR has no plural data for `hne`, so `Intl.PluralRules` would
# resolve it against the runtime's own locale and any `[one]` branch would be
# selected by somebody else's rules. `answer-show-responses` therefore drops
# the selector entirely and writes one form, and the only branch on a number
# left in this file is `attempts-remaining`'s explicit `[0]`, which Fluent
# matches against the number itself rather than against a category. A Chhattisgarhi noun is unmarked
# after a numeral in any case — «मन» marks plurality, not counting — so one
# form is right.


## Answer submission

answer-checking = जाँचल जावत हे...
answer-submitting = पठावल जावत हे...
answer-checking-status = जवाब जाँचल जावत हे
answer-submitting-status = जवाब पठावल जावत हे
answer-correct = सही
answer-incorrect = गलत
answer-response-saved = जवाब सहेजल गिस
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% सही
answer-percent-short = { $percent }%
max-credit-available = सबसे जादा मिले वाला अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कोनो मौका नइ बचा
       *[other] { $count } मौका बाँचे हे
    }
validation-correct = (सही)
validation-incorrect = (गलत)
validation-partially-correct = (कुछ हद तक सही)
answer-show-responses = { $answerId } के { $count } जवाब देखावव


## Disclosure panels

feedback-heading = राय
collapsible-click-to-open = (खोले बर क्लिक करव)
collapsible-click-to-close = (बंद करे बर क्लिक करव)
collapsible-initializing = सुरू करे जावत हे...
footnote-show = पादटिप्पणी देखावव
footnote-hide = पादटिप्पणी छिपावव
description-more-information = अउ जानकारी


## Controls

slider-previous = पहिली
slider-next = आगे
keyboard-open = कीबोर्ड खोलव
keyboard-close = कीबोर्ड बंद करव
choice-input-remove-choice = { $choice } हटावव
matrix-remove-row = पंक्ति हटावव
matrix-add-row = पंक्ति जोड़व
matrix-remove-column = स्तंभ हटावव
matrix-add-column = स्तंभ जोड़व
subset-add-remove-points = बिंदु जोड़व/हटावव
subset-toggle-points-intervals = बिंदु अउ अंतराल के बीच बदलव
subset-move-points = बिंदु सरकावव
subset-clear = साफ करव
# A `box` here is one orbital, drawn as a square: खाँचा.
orbital-add-row = पंक्ति जोड़व
orbital-remove-row = पंक्ति हटावव
orbital-add-box = खाँचा जोड़व
orbital-remove-box = खाँचा हटावव
orbital-add-up-arrow = ऊपर के तीर जोड़व
orbital-add-down-arrow = नीचे के तीर जोड़व
orbital-remove-arrow = तीर हटावव
orbital-row-label = पंक्ति { $row } के लेबल
pretzel-answer = जवाब


## Math input

math-input-preview-region = गणितीय व्यंजक के पूर्वावलोकन
math-input-preview = पूर्वावलोकन
math-input-invalid-expression = अमान्य व्यंजक:


## Document status

viewer-initializing = सुरू करे जावत हे...


## Errors

error-heading = त्रुटि
error-found-at =
    { $span ->
        [line] पंक्ति { $startLine } म मिलिस।
       *[lines] पंक्ति { $startLine }–{ $endLine } म मिलिस।
    }
document-contains-errors = ए दस्तावेज म त्रुटि हें!
diagnostic-heading-error = त्रुटि
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = संकेत
accessibility-heading-level-1 = WCAG AA सुगम्यता उल्लंघन
accessibility-heading-level-2 = सुगम्यता चेतावनी
something-went-wrong = कुछ गलत होइ गिस।
renderer-load-failed = एक रेंडरर लोड नइ हो सकिस। कृपया पन्ना फेर लोड करव।
core-start-failed = ए दस्तावेज सुरू नइ हो सकिस। कृपया पन्ना फेर लोड करव।
core-start-failed-busy = ए दस्तावेज सुरू नइ हो सकिस। एके संग कई दस्तावेज सुरू होवत रिहिन, अउ धीमे यंत्र पर ए म जादा समय लागथे। दूसर दस्तावेज पूरा होइ जाँय तब पन्ना फेर लोड करे ले काम बन सकथे।
core-start-failed-retry = ए दस्तावेज सुरू नइ हो सकिस।
core-start-failed-busy-retry = ए दस्तावेज सुरू नइ हो सकिस। एके संग कई दस्तावेज सुरू होवत रिहिन, अउ धीमे यंत्र पर ए म जादा समय लागथे।
core-start-retry = फेर कोसिस करव
saved-state-unavailable = तोर सहेजल काम लोड नइ हो सकिस।
