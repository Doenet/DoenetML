# Garo (A·chik ku·rang) viewer chrome: the buttons, panel headings and status
# words the reader interacts with. Rendered on the main thread and selected by
# `uiLocale`. Translated from `locales/en/chrome.ftl`, which is the source of
# truth: `lint:i18n` rejects a key that does not exist there, and reports a key
# that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator, and
# no permission is needed to fix it.
#
# **Script: Latin, and this is a deliberate departure from the roster's rule.**
# Everywhere else in these catalogs the script is whatever CLDR fills the bare
# tag in as — that is why `sr` is Cyrillic and `mni` is Bengali. ICU maximizes
# a bare `grt` to **`grt-Beng`**, the Bengali script Garo was also written in
# across the Assam side of the border. This catalog writes **Latin anyway**,
# because Latin is what a Garo reader in Meghalaya actually reads: it has been
# the script of Garo since the mission presses of the 1870s, and it is what
# Garo schoolbooks, the Garo newspapers and the Garo Bible are set in. The
# header says so rather than leaving it to be discovered. Converting this
# catalog to Bengali letters means converting **all four files at once**; a
# half-converted catalog is worse than either choice.
#
# **The raka is written with the middle dot «·» (U+00B7)**, everywhere in all
# four files — «A·chik», «ong·a», «dal·gipa», «ja·man», «man·ja». It is one
# character throughout, so a search for `·` finds every one of them. No
# apostrophe is used for it anywhere.
#
# **Much of the technical vocabulary here is an English loan, and that is
# stated rather than hidden.** Meghalaya teaches mathematics and secondary
# science in English, and Garo has a long missionary-orthography and
# English-medium schooling tradition, so the classroom words for a row, a
# column, a matrix, a keyboard, an interval, a box or an arrow *are* the
# English ones. They are written here as English rather than respelled into a
# Garo shape the language does not give them. A second, smaller group is
# Assamese- or Bengali-derived and is the register Garo prose already carries:
# «bhul» for an error, «sabdanani» for a warning, «khobor» for information,
# «khali» for empty, «lebel», «kredit», «bondho».
#
# **What is Garo here is the frame**, and it is used consistently: «ong·a» /
# «ong·ja» for is and is not (so *correct* is «ong·gipa» and *incorrect*
# «ong·gija», and *invalid* is «ong·gijagipa»), «man·a» / «man·ja» for can and
# cannot, «nanga» for must, «baha» for use, «rakkia» for keep, «chesota»
# for try, «nika» for see, «dongata» for add and «ra·kata» for remove,
# «skang» for previous and «ja·man» for next, «aro sa·bsa» for again, «-rang»
# for a plural, «-ni» for a genitive and «-o» for a locative. The attributive
# «-gipa» is used to make a describing word, including on a loan stem.
#
# **Words a reviewer should check first**, in this file: «sabdanani» for
# *warning* and «pinigijabo» for *hide* — the second is a transparent "do not
# show" rather than a word, and Garo will have a better one; «sokna man·ani»
# for *accessibility*; and «chesotani» for an *attempt*.
#
# Numbers render in Latin digits (#1615). **Nothing in this catalog selects on
# a count**: a Garo noun is unmarked after a numeral, and CLDR has no plural
# data for `grt` in any case, so every English plural select is collapsed to
# its `*[other]` wording. The numeric literal `[0]` in `attempts-remaining` is
# kept exactly where English has it — it is a literal, not a plural category.


## Answer submission

answer-checking = Nikenga...
answer-submitting = On·enga...

answer-checking-status = Aganchakanikon nikenga
answer-submitting-status = Aganchakanikon on·enga

answer-correct = Ong·gipa
answer-incorrect = Ong·gija

answer-response-saved = Aganchakani Rakkiaha

answer-percent-credit = { $percent }% Kredit
answer-percent-correct = { $percent }% Ong·gipa
answer-percent-short = { $percent } %

max-credit-available = Bang·bata man·gipa kredit: { $percent }%

# No count select: a Garo noun is unmarked after a numeral. The `[0]` branch is
# English's own numeric literal and stays.
attempts-remaining =
    { $count ->
        [0] chesotani dongja
       *[other] { $count } chesotani donga
    }

validation-correct = (Ong·gipa)
validation-incorrect = (Ong·gija)
validation-partially-correct = (Bak ong·gipa)

answer-show-responses = { $answerId }-ni { $count } aganchakanikon pinibo


## Disclosure panels

feedback-heading = Fidbek

collapsible-click-to-open = (khena klik ka·bo)
collapsible-click-to-close = (bondho ka·na klik ka·bo)

collapsible-initializing = Ja·rikatenga...

footnote-show = Futnotko pinibo
footnote-hide = Futnotko pinigijabo

description-more-information = bang·bata khobor


## Controls

slider-previous = Skang
slider-next = Ja·man

keyboard-open = Kibordko Khebo
keyboard-close = Kibordko Bondho Ka·bo

choice-input-remove-choice = { $choice }-ko ra·katbo

matrix-remove-row = Row-ko ra·katbo
matrix-add-row = Row dongatbo
matrix-remove-column = Column-ko ra·katbo
matrix-add-column = Column dongatbo

subset-add-remove-points = Pointrangko dongatbo/ra·katbo
subset-toggle-points-intervals = Pointrang aro intervalrangko salbo
subset-move-points = Pointrangko Chalaibo
subset-clear = Khali Ka·bo

orbital-add-row = Row Dongatbo
orbital-remove-row = Row-ko Ra·katbo
orbital-add-box = Boks Dongatbo
orbital-remove-box = Boks-ko Ra·katbo
orbital-add-up-arrow = Up Arrow Dongatbo
orbital-add-down-arrow = Down Arrow Dongatbo
orbital-remove-arrow = Arrow-ko Ra·katbo

orbital-row-label = Row { $row }-ni lebel

pretzel-answer = Aganchakani



## Math input

math-input-preview-region = math expression-ni skang nikani
math-input-preview = Skang Nikani
math-input-invalid-expression = Ong·gijagipa expression:


## Document status

viewer-initializing = Ja·rikatenga...


## Errors

error-heading = Bhul

error-found-at =
    { $span ->
        [line] Lain { $startLine }-o man·aha.
       *[lines] Lain { $startLine }–{ $endLine }-o man·aha.
    }

document-contains-errors = Ia dokumento bhulrang donga!

diagnostic-heading-error = Bhul
diagnostic-heading-warning = Sabdanani
diagnostic-heading-information = Khobor
diagnostic-heading-hint = Dakchakani

accessibility-heading-level-1 = WCAG AA Sokna man·anini bhul
accessibility-heading-level-2 = Sokna man·anini sabdanani

something-went-wrong = Maiba bhul ong·aha.

renderer-load-failed = renderer sa·gipa lodo ong·jaha. Pejko aro sa·bsa lodo ka·bo.

core-start-failed = Ia dokumentoko ja·rikatna man·jaha. Pejko aro sa·bsa lodo ka·bo.

core-start-failed-busy = Ia dokumentoko ja·rikatna man·jaha. Bang·gipa dokumentrang sasa somoyo ja·rikatengaha, aro dingdingrata deviceo iaba bang·gipa somoyko ra·gen. Gipin dokumentrang ong·chinaha ja·mano pejko aro sa·bsa lodo ka·ani dakchakgen.

core-start-failed-retry = Ia dokumentoko ja·rikatna man·jaha.

core-start-failed-busy-retry = Ia dokumentoko ja·rikatna man·jaha. Bang·gipa dokumentrang sasa somoyo ja·rikatengaha, aro dingdingrata deviceo iaba bang·gipa somoyko ra·gen.

core-start-retry = Aro sa·bsa chesotbo

saved-state-unavailable = Na·ni rakkigipa kamko lodo ka·na man·jaha.
