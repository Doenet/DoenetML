# Odia viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Controls take the polite ଆପଣ imperative Odia software uses — «କୀବୋର୍ଡ
# ଖୋଲନ୍ତୁ» — which is what a reader expects here.
#
# Odia counts in two plural categories, but a counted noun is usually left
# unmarked, so the select is dropped where writing both out would produce the
# same words twice.
#
# Numbers render in Latin digits rather than in Odia numerals, which is the
# digit policy in the package README (#1615).


## Answer submission

answer-checking = ଯାଞ୍ଚ କରାଯାଉଛି...
answer-submitting = ପଠାଯାଉଛି...
answer-checking-status = ଉତ୍ତର ଯାଞ୍ଚ କରାଯାଉଛି
answer-submitting-status = ଉତ୍ତର ପଠାଯାଉଛି
answer-correct = ସଠିକ
answer-incorrect = ଭୁଲ
answer-response-saved = ଉତ୍ତର ସଂରକ୍ଷିତ ହେଲା
answer-percent-credit = { $percent }% ନମ୍ବର
answer-percent-correct = { $percent }% ସଠିକ
answer-percent-short = { $percent }%
max-credit-available = ସର୍ବାଧିକ ସମ୍ଭାବ୍ୟ ନମ୍ବର: { $percent }%
attempts-remaining =
    { $count ->
        [0] କୌଣସି ପ୍ରୟାସ ବାକି ନାହିଁ
       *[other] { $count } ପ୍ରୟାସ ବାକି
    }
validation-correct = (ସଠିକ)
validation-incorrect = (ଭୁଲ)
validation-partially-correct = (ଆଂଶିକ ସଠିକ)
answer-show-responses = { $answerId } ପାଇଁ { $count } ଉତ୍ତର ଦେଖାନ୍ତୁ

## Disclosure panels

feedback-heading = ପ୍ରତିକ୍ରିୟା
collapsible-click-to-open = (ଖୋଲିବାକୁ କ୍ଲିକ କରନ୍ତୁ)
collapsible-click-to-close = (ବନ୍ଦ କରିବାକୁ କ୍ଲିକ କରନ୍ତୁ)
collapsible-initializing = ଆରମ୍ଭ ହେଉଛି...
footnote-show = ପାଦଟୀକା ଦେଖାନ୍ତୁ
footnote-hide = ପାଦଟୀକା ଲୁଚାନ୍ତୁ
description-more-information = ଅଧିକ ସୂଚନା

## Controls

slider-previous = ପୂର୍ବବର୍ତ୍ତୀ
slider-next = ପରବର୍ତ୍ତୀ
keyboard-open = କୀବୋର୍ଡ ଖୋଲନ୍ତୁ
keyboard-close = କୀବୋର୍ଡ ବନ୍ଦ କରନ୍ତୁ
choice-input-remove-choice = { $choice } ହଟାନ୍ତୁ
matrix-remove-row = ଧାଡ଼ି ହଟାନ୍ତୁ
matrix-add-row = ଧାଡ଼ି ଯୋଡ଼ନ୍ତୁ
matrix-remove-column = ସ୍ତମ୍ଭ ହଟାନ୍ତୁ
matrix-add-column = ସ୍ତମ୍ଭ ଯୋଡ଼ନ୍ତୁ
subset-add-remove-points = ବିନ୍ଦୁ ଯୋଡ଼ନ୍ତୁ/ହଟାନ୍ତୁ
subset-toggle-points-intervals = ବିନ୍ଦୁ ଓ ଅନ୍ତରାଳ ମଧ୍ୟରେ ବଦଳାନ୍ତୁ
subset-move-points = ବିନ୍ଦୁ ଘୁଞ୍ଚାନ୍ତୁ
subset-clear = ଲିଭାନ୍ତୁ
# A `box` here is one orbital, drawn as a square: ଖାନା.
orbital-add-row = ଧାଡ଼ି ଯୋଡ଼ନ୍ତୁ
orbital-remove-row = ଧାଡ଼ି ହଟାନ୍ତୁ
orbital-add-box = ଖାନା ଯୋଡ଼ନ୍ତୁ
orbital-remove-box = ଖାନା ହଟାନ୍ତୁ
orbital-add-up-arrow = ଉପର ତୀର ଯୋଡ଼ନ୍ତୁ
orbital-add-down-arrow = ତଳ ତୀର ଯୋଡ଼ନ୍ତୁ
orbital-remove-arrow = ତୀର ହଟାନ୍ତୁ
orbital-row-label = ଧାଡ଼ି { $row } ର ଲେବଲ
pretzel-answer = ଉତ୍ତର

## Math input

math-input-preview-region = ଗାଣିତିକ ଅଭିବ୍ୟକ୍ତିର ପୂର୍ବାବଲୋକନ
math-input-preview = ପୂର୍ବାବଲୋକନ
math-input-invalid-expression = ଅବୈଧ ଅଭିବ୍ୟକ୍ତି:

## Document status

viewer-initializing = ଆରମ୍ଭ ହେଉଛି...

## Errors

error-heading = ତ୍ରୁଟି
error-found-at =
    { $span ->
        [line] { $startLine } ଧାଡ଼ିରେ ମିଳିଲା।
       *[lines] { $startLine }–{ $endLine } ଧାଡ଼ିରେ ମିଳିଲା।
    }
document-contains-errors = ଏହି ଦଲିଲରେ ତ୍ରୁଟି ଅଛି!
diagnostic-heading-error = ତ୍ରୁଟି
diagnostic-heading-warning = ଚେତାବନୀ
diagnostic-heading-information = ସୂଚନା
diagnostic-heading-hint = ସୂଚନା ସଙ୍କେତ
accessibility-heading-level-1 = WCAG AA ଅଭିଗମ୍ୟତା ଉଲ୍ଲଙ୍ଘନ
accessibility-heading-level-2 = ଅଭିଗମ୍ୟତା ଚେତାବନୀ
something-went-wrong = କିଛି ଭୁଲ ହେଲା।
renderer-load-failed = ଗୋଟିଏ ରେଣ୍ଡରର ଲୋଡ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ପୃଷ୍ଠାଟି ପୁଣି ଲୋଡ କରନ୍ତୁ।
core-start-failed = ଦଲିଲ ଦର୍ଶକ ଆରମ୍ଭ ହୋଇପାରିଲା ନାହିଁ। ଦୟାକରି ପୃଷ୍ଠାଟି ପୁଣି ଲୋଡ କରନ୍ତୁ।
