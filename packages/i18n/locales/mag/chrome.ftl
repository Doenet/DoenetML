# Magahi (मगही) viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Devanagari.** Magahi's historical script is Kaithi, and printed
# Magahi has used Devanagari for a century; Kaithi is not used here and a
# conversion to it would be a research project, not a transliteration. Digits
# are **Latin** (`1`, `2`, `1,234`), not Devanagari, because that is what
# DoenetML pins for every locale in `src/intl.ts`.
#
# **What is Magahi here is the frame, and it is used consistently.** The
# copula is «हइ», the negator «ना», the dative and purposive **«लेल»** —
# *for* — which is the quickest way to tell these files from Hindi at a
# glance, and from `locales/hne`, which writes «बर» in the same slot.
# Beside it: «आउ» for *and*, «काहेकि» for *because*, «तेकरा लेल» for
# *therefore*, «अगर» for *if*, «ना त» for *otherwise*, «में» for the
# locative, «ई» for *this*, «कोनो» for *any*, «जे» for the relative
# pronoun, and the plural word **«सब»** after the noun («बिंदु सब», «रेखा
# सब»). Verbs are the eastern **-ल** participle — «देल», «कएल», «मिलल»,
# «छोड़ल», «रहल» — where Awadhi in the same batch writes «दीन», «कीन»,
# «मिला». Buttons carry the honorific imperative in **-ू** — «खोलू»,
# «हटावू», «जोड़ू», «देखावू».
#
# **The technical vocabulary is Hindi and Sanskrit, and that is declared
# rather than disguised.** «कीबोर्ड», «पंक्ति», «स्तंभ», «व्यंजक», «त्रुटि»,
# «सुगम्यता», «पूर्वावलोकन» are the words a Magahi speaker has met in school
# and on a screen, in Hindi. Where Magahi's own everyday word is the one a
# reader would use, it is used instead — across the catalog, not only in this
# file: «जवाब» and «गलत» here, «करिया», «उज्जर», «पीयर», «हरियर» among
# `content.ftl`'s colours, «धेयान» in `diagnostics.ftl`.
#
# **Counts.** CLDR has no plural data for `mag`, so `Intl.PluralRules` would
# resolve it against the runtime's own locale and any `[one]` branch would be
# selected by somebody else's rules. `answer-show-responses` therefore drops
# the selector entirely and writes one form, and the only branch on a number
# left in this file is `attempts-remaining`'s explicit `[0]`, which Fluent
# matches against the number itself rather than against a category. A Magahi noun is unmarked after a
# numeral in any case — «सब» marks plurality, not counting — so one form is
# right.


## Answer submission

answer-checking = जाँचल जा रहल हइ...
answer-submitting = पठावल जा रहल हइ...
answer-checking-status = जवाब जाँचल जा रहल हइ
answer-submitting-status = जवाब पठावल जा रहल हइ
answer-correct = सही
answer-incorrect = गलत
answer-response-saved = जवाब सहेजल गेल
answer-percent-credit = { $percent }% अंक
answer-percent-correct = { $percent }% सही
answer-percent-short = { $percent }%
max-credit-available = सबसे जादा मिले वाला अंक: { $percent }%
attempts-remaining =
    { $count ->
        [0] कोनो मौका ना बचा
       *[other] { $count } मौका बाँचल हइ
    }
validation-correct = (सही)
validation-incorrect = (गलत)
validation-partially-correct = (कुछ हद तक सही)
answer-show-responses = { $answerId } के { $count } जवाब देखावू


## Disclosure panels

feedback-heading = राय
collapsible-click-to-open = (खोले लेल क्लिक करू)
collapsible-click-to-close = (बंद करे लेल क्लिक करू)
collapsible-initializing = सुरू कएल जा रहल हइ...
footnote-show = पादटिप्पणी देखावू
footnote-hide = पादटिप्पणी छिपावू
description-more-information = आउ जानकारी


## Controls

slider-previous = पहिले
slider-next = आगे
keyboard-open = कीबोर्ड खोलू
keyboard-close = कीबोर्ड बंद करू
choice-input-remove-choice = { $choice } हटावू
matrix-remove-row = पंक्ति हटावू
matrix-add-row = पंक्ति जोड़ू
matrix-remove-column = स्तंभ हटावू
matrix-add-column = स्तंभ जोड़ू
subset-add-remove-points = बिंदु जोड़ू/हटावू
subset-toggle-points-intervals = बिंदु आउ अंतराल के बीच बदलू
subset-move-points = बिंदु सरकावू
subset-clear = साफ करू
# A `box` here is one orbital, drawn as a square: खाँचा.
orbital-add-row = पंक्ति जोड़ू
orbital-remove-row = पंक्ति हटावू
orbital-add-box = खाँचा जोड़ू
orbital-remove-box = खाँचा हटावू
orbital-add-up-arrow = ऊपर के तीर जोड़ू
orbital-add-down-arrow = नीचे के तीर जोड़ू
orbital-remove-arrow = तीर हटावू
orbital-row-label = पंक्ति { $row } के लेबल
pretzel-answer = जवाब


## Math input

math-input-preview-region = गणितीय व्यंजक के पूर्वावलोकन
math-input-preview = पूर्वावलोकन
math-input-invalid-expression = अमान्य व्यंजक:


## Document status

viewer-initializing = सुरू कएल जा रहल हइ...


## Errors

error-heading = त्रुटि
error-found-at =
    { $span ->
        [line] पंक्ति { $startLine } में मिलल।
       *[lines] पंक्ति { $startLine }–{ $endLine } में मिलल।
    }
document-contains-errors = ई दस्तावेज में त्रुटि हइ!
diagnostic-heading-error = त्रुटि
diagnostic-heading-warning = चेतावनी
diagnostic-heading-information = जानकारी
diagnostic-heading-hint = संकेत
accessibility-heading-level-1 = WCAG AA सुगम्यता उल्लंघन
accessibility-heading-level-2 = सुगम्यता चेतावनी
something-went-wrong = कुछ गलत होइ गेल।
renderer-load-failed = एक रेंडरर लोड ना हो सकल। कृपया पन्ना फेर लोड करू।
core-start-failed = ई दस्तावेज सुरू ना हो सकल। कृपया पन्ना फेर लोड करू।
core-start-failed-busy = ई दस्तावेज सुरू ना हो सकल। एके संग कई दस्तावेज सुरू होवऽ हल, आउ धीमे यंत्र पर ई में जादा समय लगऽ हइ। दूसर दस्तावेज पूरा होइ जाँय तब पन्ना फेर लोड करे से काम बन सकऽ हइ।
core-start-failed-retry = ई दस्तावेज सुरू ना हो सकल।
core-start-failed-busy-retry = ई दस्तावेज सुरू ना हो सकल। एके संग कई दस्तावेज सुरू होवऽ हल, आउ धीमे यंत्र पर ई में जादा समय लगऽ हइ।
core-start-retry = फेर कोसिस करू
saved-state-unavailable = तोहर सहेजल काम लोड ना हो सकल।
