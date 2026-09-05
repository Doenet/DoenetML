# Hawaiian viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The ʻokina «ʻ» is a consonant and the kahakō a length mark; both are part of
# the spelling. «pau» and «paʻu» and «pāʻū» are three different words, so a
# correction that drops either mark is a mis-spelling rather than a
# simplification. The ʻokina here is U+02BB, not an apostrophe.
#
# Hawaiian marks number on the **article** — «ka laina» one line, «nā laina»
# many — and not on the noun, so a count in front of a noun changes nothing
# about the noun and the counted messages here need no selection even though
# CLDR gives Hawaiian two plural categories. `[0]` is still spelled out where
# the English wording changes for zero, and Hawaiian has its own word for it:
# «ʻaʻohe», there is none.


## Answer submission

answer-checking = Ke nānā nei...
answer-submitting = Ke hoʻouna nei...
answer-checking-status = Ke nānā nei i ka pane
answer-submitting-status = Ke hoʻouna nei i ka pane
answer-correct = Pololei
answer-incorrect = Hewa
answer-response-saved = Ua mālama ʻia ka pane
answer-percent-credit = { $percent }% o ka helu
answer-percent-correct = { $percent }% pololei
answer-percent-short = { $percent }%
max-credit-available = Ka helu kiʻekiʻe loa e loaʻa ai: { $percent }%
attempts-remaining =
    { $count ->
        [0] ʻaʻohe hoʻāʻo i koe
       *[other] koe { $count } hoʻāʻo
    }
validation-correct = (Pololei)
validation-incorrect = (Hewa)
validation-partially-correct = (Pololei ma kekahi hapa)
answer-show-responses = E hōʻike i { $count } pane iā { $answerId }

## Disclosure panels

feedback-heading = Manaʻo hoʻi
collapsible-click-to-open = (kaomi e wehe)
collapsible-click-to-close = (kaomi e pani)
collapsible-initializing = Ke hoʻomaka nei...
footnote-show = E hōʻike i ka memo wāwae
footnote-hide = E hūnā i ka memo wāwae
# «ʻike», knowledge, rather than «ʻikepili», which is this catalog's word for
# data and would read as "more data" on an affordance that reveals prose.
description-more-information = ʻike hou aku

## Controls

slider-previous = Mua
slider-next = Aʻe
keyboard-open = E wehe i ka papapihi
keyboard-close = E pani i ka papapihi
choice-input-remove-choice = E wehe iā { $choice }
matrix-remove-row = E wehe i ka lālani
matrix-add-row = E hoʻohui i lālani
matrix-remove-column = E wehe i ke kolamu
matrix-add-column = E hoʻohui i kolamu
subset-add-remove-points = E hoʻohui/wehe i nā kiko
subset-toggle-points-intervals = E hoʻololi i nā kiko a me nā kaʻawale
subset-move-points = E hoʻoneʻe i nā kiko
subset-clear = E holoi
orbital-add-row = E hoʻohui i lālani
orbital-remove-row = E wehe i ka lālani
orbital-add-box = E hoʻohui i pahu
orbital-remove-box = E wehe i ka pahu
orbital-add-up-arrow = E hoʻohui i pua i luna
orbital-add-down-arrow = E hoʻohui i pua i lalo
orbital-remove-arrow = E wehe i ka pua
orbital-row-label = Inoa no ka lālani { $row }
pretzel-answer = Pane

## Math input

math-input-preview-region = nānā mua o ka hōʻike makemakika
math-input-preview = Nānā mua
math-input-invalid-expression = Hōʻike kūpono ʻole:

## Document status

viewer-initializing = Ke hoʻomaka nei...

## Errors

error-heading = Hewa
error-found-at =
    { $span ->
        [line] Ua loaʻa ma ka lālani { $startLine }.
       *[lines] Ua loaʻa ma nā lālani { $startLine }–{ $endLine }.
    }
document-contains-errors = Aia nā hewa i loko o kēia palapala!
diagnostic-heading-error = Hewa
diagnostic-heading-warning = Ao
diagnostic-heading-information = ʻIke
diagnostic-heading-hint = Kuhikuhi
accessibility-heading-level-1 = Kūʻē i ka hiki ke komo WCAG AA
accessibility-heading-level-2 = Ao no ka hiki ke komo
something-went-wrong = Ua hewa kekahi mea.
renderer-load-failed = ʻaʻole i hoʻouka ʻia kekahi mea hōʻike. E ʻoluʻolu, e hoʻouka hou i ka ʻaoʻao.
core-start-failed = ʻAʻole hiki ke hoʻomaka i ka mea nānā palapala. E ʻoluʻolu, e hoʻouka hou i ka ʻaoʻao.
