# Tongan viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Two marks carry meaning and both are written here.** The glottal stop is the
# *fakauʻa* «ʻ» — U+02BB MODIFIER LETTER TURNED COMMA, a letter of the alphabet,
# never U+0027 or a typographic quote — and vowel length is the *toloi*, the
# macron, «ā ē ī ō ū». Both distinguish words, so a corrector who replaces a
# fakauʻa with an apostrophe is changing the spelling of the word: the two
# render alike and compare unequal, which is the trap `locales/yi` records for
# its own digraphs.
#
# Tongan marks no number on the noun — plurality is «ʻu» or «ngaahi» before it,
# and a numeral does not take them — so a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped. A `[0]` branch stays wherever English has one.


## Answer submission

answer-checking = ʻOku sivi…
answer-submitting = ʻOku ʻave…
answer-checking-status = ʻOku sivi ʻa e tali
answer-submitting-status = ʻOku ʻave ʻa e tali
answer-correct = Totonu
answer-incorrect = Hala
answer-response-saved = Kuo tauhi ʻa e tali
answer-percent-credit = { $percent }% ʻo e mataʻitohi
answer-percent-correct = { $percent }% totonu
answer-percent-short = { $percent } %
max-credit-available = Mataʻitohi lahi taha ʻe lava ʻo maʻu: { $percent }%
# No select: «feinga» is the same word for one and for many. The `[0]` branch
# stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] ʻoku ʻikai toe ʻi ai ha feinga
       *[other] ʻoku toe ʻi ai ʻa e feinga ʻe { $count }
    }
validation-correct = (Totonu)
validation-incorrect = (Hala)
validation-partially-correct = (Totonu fakakonga)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Fakahā ʻa e tali ʻe { $count } ki he { $answerId }

## Disclosure panels

feedback-heading = Fakamatala
collapsible-click-to-open = (lomiʻi ke fakaava)
collapsible-click-to-close = (lomiʻi ke tāpuni)
collapsible-initializing = ʻOku kamata…
footnote-show = Fakahā ʻa e footnote
footnote-hide = Fufū ʻa e footnote
description-more-information = fakamatala lahi ange

## Controls

slider-previous = Kimuʻa
slider-next = Hoko
keyboard-open = Fakaava ʻa e kīpoti
keyboard-close = Tāpuni ʻa e kīpoti
choice-input-remove-choice = Toʻo ʻa e { $choice }
matrix-remove-row = Toʻo ʻa e laine
matrix-add-row = Tānaki ha laine
matrix-remove-column = Toʻo ʻa e kolomu
matrix-add-column = Tānaki ha kolomu
subset-add-remove-points = Tānaki/Toʻo ʻa e ngaahi poini
subset-toggle-points-intervals = Liliu ʻa e ngaahi poini mo e vahaʻa
subset-move-points = Hiki ʻa e ngaahi poini
subset-clear = Fakamaʻa
orbital-add-row = Tānaki ha laine
orbital-remove-row = Toʻo ʻa e laine
orbital-add-box = Tānaki ha puha
orbital-remove-box = Toʻo ʻa e puha
orbital-add-up-arrow = Tānaki ha ngahau ki ʻolunga
orbital-add-down-arrow = Tānaki ha ngahau ki lalo
orbital-remove-arrow = Toʻo ʻa e ngahau
orbital-row-label = Fakaʻilonga ki he laine { $row }
pretzel-answer = Tali

## Math input

math-input-preview-region = fakahā muʻa ʻo e fakamatala fika
math-input-preview = Fakahā muʻa
math-input-invalid-expression = Fakamatala fika taʻetotonu:

## Document status

viewer-initializing = ʻOku kamata…

## Errors

error-heading = Hala
error-found-at =
    { $span ->
        [line] Naʻe maʻu ʻi he laine { $startLine }.
       *[lines] Naʻe maʻu ʻi he ngaahi laine { $startLine }–{ $endLine }.
    }
document-contains-errors = ʻOku ʻi ai ha hala ʻi he pepa ni!
diagnostic-heading-error = Hala
diagnostic-heading-warning = Fakatokanga
diagnostic-heading-information = Fakamatala
diagnostic-heading-hint = Fakahinohino
accessibility-heading-level-1 = Maumauʻi ʻo e aʻusia WCAG AA
accessibility-heading-level-2 = Fakatokanga fekauʻaki mo e aʻusia
something-went-wrong = Naʻe ʻi ai ha meʻa naʻe hala.
renderer-load-failed = naʻe ʻikai lava ʻo hū mai ha renderer. Kātaki ʻo toe fakaake ʻa e peesi.
core-start-failed = Naʻe ʻikai lava ʻo kamata ʻa e mata sio ki he pepa. Kātaki ʻo toe fakaake ʻa e peesi.
