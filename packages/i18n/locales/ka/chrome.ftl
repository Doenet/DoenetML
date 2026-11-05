# Georgian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Georgian counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 მცდელობა», not a plural — so the two
# branches differ in nothing but the number they print.
#
# Georgian has no letter case, so a button's word is spelled the way it is
# spelled anywhere else.
#
# An affix is never welded to a placeable where it would have to agree with the
# value. The genitive alternates on the sound before it — «-ის» after a
# consonant, «-ს» after a vowel — so a genitive goes on a word this catalog
# writes («{ $component } კომპონენტის», «{ $element } ელემენტის») and the value
# stays bare. The postpositions «-ზე», «-ში» and «-დან» and the dative «-ს» do
# not alternate, so those still sit directly on a value.


## Answer submission

answer-checking = მოწმდება…
answer-submitting = იგზავნება…
answer-checking-status = პასუხის შემოწმება
answer-submitting-status = პასუხის გაგზავნა
answer-correct = სწორია
answer-incorrect = არასწორია
answer-response-saved = პასუხი შენახულია
answer-percent-credit = { $percent }% ქულა
answer-percent-correct = { $percent }% სწორია
answer-percent-short = { $percent } %
max-credit-available = მაქსიმალური შესაძლო ქულა: { $percent }%
attempts-remaining =
    { $count ->
        [0] მცდელობა აღარ დარჩა
        [one] დარჩა { $count } მცდელობა
       *[other] დარჩა { $count } მცდელობა
    }
validation-correct = (სწორია)
validation-incorrect = (არასწორია)
validation-partially-correct = (ნაწილობრივ სწორია)
answer-show-responses =
    { $count ->
        [one] { $count } პასუხის ჩვენება { $answerId }-ზე
       *[other] { $count } პასუხის ჩვენება { $answerId }-ზე
    }

## Disclosure panels

feedback-heading = უკუკავშირი
collapsible-click-to-open = (დააწკაპუნეთ გასახსნელად)
collapsible-click-to-close = (დააწკაპუნეთ დასახურად)
collapsible-initializing = ემზადება…
footnote-show = სქოლიოს ჩვენება
footnote-hide = სქოლიოს დამალვა
description-more-information = დამატებითი ინფორმაცია

## Controls

slider-previous = წინა
slider-next = შემდეგი
keyboard-open = კლავიატურის გახსნა
keyboard-close = კლავიატურის დახურვა
choice-input-remove-choice = { $choice } არჩევანის წაშლა
matrix-remove-row = სტრიქონის წაშლა
matrix-add-row = სტრიქონის დამატება
matrix-remove-column = სვეტის წაშლა
matrix-add-column = სვეტის დამატება
subset-add-remove-points = წერტილების დამატება/წაშლა
subset-toggle-points-intervals = წერტილებსა და შუალედებს შორის გადართვა
subset-move-points = წერტილების გადატანა
subset-clear = გასუფთავება
orbital-add-row = სტრიქონის დამატება
orbital-remove-row = სტრიქონის წაშლა
orbital-add-box = უჯრის დამატება
orbital-remove-box = უჯრის წაშლა
orbital-add-up-arrow = ზემოთ ისრის დამატება
orbital-add-down-arrow = ქვემოთ ისრის დამატება
orbital-remove-arrow = ისრის წაშლა
orbital-row-label = { $row } სტრიქონის წარწერა
pretzel-answer = პასუხი

## Math input

math-input-preview-region = მათემატიკური გამოსახულების წინასწარი ხედი
math-input-preview = წინასწარი ხედი
math-input-invalid-expression = არასწორი გამოსახულება:

## Document status

viewer-initializing = ემზადება…

## Errors

error-heading = შეცდომა
error-found-at =
    { $span ->
        [line] ნაპოვნია { $startLine } სტრიქონში.
       *[lines] ნაპოვნია { $startLine }–{ $endLine } სტრიქონებში.
    }
document-contains-errors = ეს დოკუმენტი შეიცავს შეცდომებს!
diagnostic-heading-error = შეცდომა
diagnostic-heading-warning = გაფრთხილება
diagnostic-heading-information = ინფორმაცია
diagnostic-heading-hint = მინიშნება
accessibility-heading-level-1 = WCAG AA ხელმისაწვდომობის დარღვევა
accessibility-heading-level-2 = ხელმისაწვდომობის შეტყობინება
something-went-wrong = რაღაც შეცდომა მოხდა.
renderer-load-failed = გამომსახველის ჩატვირთვა ვერ მოხერხდა. გთხოვთ, განაახლოთ გვერდი.
core-start-failed = დოკუმენტის დამთვალიერებლის გაშვება ვერ მოხერხდა. გთხოვთ, განაახლოთ გვერდი.
