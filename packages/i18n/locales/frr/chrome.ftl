# Northern Frisian (Nordfriisk) viewer chrome, in the **Mooring** variety
# (Frasch, Bökingharde). Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script. **`frr` is a tag over a cluster of
# dialects, not one language with one spelling**: Mooring, Fering (Föhr),
# Öömrang (Amrum), Sölring (Sylt), Halligfrasch, Wiedingharder and
# Karrharder each have their own orthography and their own lexicon, and a word
# right in one is wrong in the next. This catalog is written in **one** of
# them, **Mooring** (Bökingharde, the mainland), because it is the variety with
# the fullest published apparatus: the *Frasch-Tjüsch Uurdebök* (Sjölin,
# Århammar & Wilts, Nordfriisk Instituut) and the Mooring school grammar and
# schoolbooks are the normative references followed here. A reader of Fering,
# Öömrang or Sölring will find this alien in places, and the fix is a
# `localeResources` catalog in their own variety rather than a file corrected
# word by word until it is in three dialects at once.
#
# **What is the language's own.** The grammatical spine is Mooring: the copula
# «as» / «san», the negator **«ai»**, «nian» for *no/none*, «nönt» for
# *nothing*, «än» for *and*, «of» for *or*, «wan» for *if/when*, «wiil» for
# *because*, «koon» / «mötj» for *can* / *must*, «tobääg» for *back*, «sidj»
# for *page*, «riege» for *row/line*, «aantwurd» for *answer*, «rocht» /
# «falsch» for *correct* / *wrong*, «wise» for *show*.
#
# **What is borrowed, and from where.** Every technical noun — «komponänt»,
# «atribut», «dokument», «funktjoon», «wektoor», «referens», «tastatuur» — is
# German, respelled to Mooring. That is deliberate and it is not disguised:
# Northern Frisian has no technical register of its own, and German is the
# language a North Frisian speaker is schooled in and reads mathematics in.
# «struket» for *dashed* is a coinage on the Mooring noun «struk» (a stroke),
# and «lek» for the gap an input fills is the weakest word in the catalog.
#
# **Counts.** CLDR has **no plural data for `frr` at all**, so no plural
# category can be selected here: this catalog writes **no** `[zero]`, `[one]`,
# `[two]`, `[few]` or `[many]` branch anywhere in any of its four files, and
# every count reads with a single form. The numeric literal `[0]` in
# `attempts-remaining` is a different
# mechanism — an exact-value match, not a plural category — and stays.
#
# **Digits.** Every number renders in Latin digits, so the digits written into
# prose here are Latin digits too.
#
# **Weakest first.** A reviewer should attack the borrowed technical nouns
# first, then the verb forms in the long error sentences: Mooring word order
# (verb second, and the participle at the end) is easy to get subtly wrong in
# writing, and this seed will have got some of it wrong.
#
# Register: impersonal throughout — infinitives and bare nouns, no «du» form.


## Answer submission

answer-checking = Woort nååkiket …
answer-submitting = Woort stjüürd …
answer-checking-status = Jü aantwurd woort nååkiket
answer-submitting-status = Jü aantwurd woort stjüürd
answer-correct = Rocht
answer-incorrect = Falsch
answer-response-saved = Aantwurd seekerd
answer-percent-credit = { $percent } % pungte
answer-percent-correct = { $percent } % rocht
answer-percent-short = { $percent } %
max-credit-available = Toop tu hoolen: { $percent } %
# CLDR has no plural rules for `frr`, so there is no category branch: one form
# for every count. The `[0]` key is an exact numeric match, not a category, and
# stays as it is.
attempts-remaining =
    { $count ->
        [0] nian försäk mör auer
       *[other] nuch { $count } försäk auer
    }
validation-correct = (Rocht)
validation-incorrect = (Falsch)
validation-partially-correct = (Diilwise rocht)
answer-show-responses = { $count } aantwurde tu { $answerId } wise

## Disclosure panels

feedback-heading = Tobäägmälding
collapsible-click-to-open = (tu't iepenmåågen klike)
collapsible-click-to-close = (tu't tuumåågen klike)
collapsible-initializing = Woort apstoort …
footnote-show = Jü foutnoot wise
footnote-hide = Jü foutnoot ferbargen
description-more-information = mör informatioone

## Controls

slider-previous = Tobääg
slider-next = Widere
keyboard-open = Tastatuur iepenmååge
keyboard-close = Tastatuur tuumååge
choice-input-remove-choice = { $choice } wächnääme
matrix-remove-row = Riege wächnääme
matrix-add-row = Riege tuufäie
matrix-remove-column = Spoolt wächnääme
matrix-add-column = Spoolt tuufäie
subset-add-remove-points = Punkte tuufäie / wächnääme
subset-toggle-points-intervals = Twasken punkte än interwaale weesle
subset-move-points = Punkte ferschüwe
subset-clear = Aal wächnääme
# A `box` here is one orbital, drawn as a square: «kaast».
orbital-add-row = Riege tuufäie
orbital-remove-row = Riege wächnääme
orbital-add-box = Kaast tuufäie
orbital-remove-box = Kaast wächnääme
orbital-add-up-arrow = Pil aw tuufäie
orbital-add-down-arrow = Pil deel tuufäie
orbital-remove-arrow = Pil wächnääme
orbital-row-label = Beeteekning för jü riege { $row }
pretzel-answer = Aantwurd

## Math input

math-input-preview-region = Föörskau foon dåt matemaatisk ütdrük
math-input-preview = Föörskau
math-input-invalid-expression = Ai jülti ütdrük:

## Document status

viewer-initializing = Woort apstoort …

## Errors

error-heading = Fäler
error-found-at =
    { $span ->
        [line] Fünen üüb riege { $startLine }.
       *[lines] Fünen üüb riege { $startLine }–{ $endLine }.
    }
document-contains-errors = Dåt dokument hää fälern deerin!
diagnostic-heading-error = Fäler
diagnostic-heading-warning = Waarnang
diagnostic-heading-information = Info
diagnostic-heading-hint = Tip
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Ferstoos juun WCAG AA (tugöngelkhaid)
accessibility-heading-level-2 = Tip tu jü tugöngelkhaid
something-went-wrong = Hocht as skiifgingen.
renderer-load-failed = en wisemoduul hää ai leesen wårde koon. Man leese jü sidj nay.
core-start-failed = Dåt dokument hää ai apstoort wårde koon. Man leese jü sidj nay.
core-start-failed-busy = Dåt dokument hää ai apstoort wårde koon. Der san moor dokumente tu jü seelewe tid apstoort wurden, än üüb en loongsemer aparaat koon dåt loonger düre. Jü sidj nay leese koon heelpe, wan da uur dokumente kloor san.
core-start-failed-retry = Dåt dokument hää ai apstoort wårde koon.
core-start-failed-busy-retry = Dåt dokument hää ai apstoort wårde koon. Der san moor dokumente tu jü seelewe tid apstoort wurden, än üüb en loongsemer aparaat koon dåt loonger düre.
core-start-retry = Nuch iinjsen prowe
saved-state-unavailable = Din seekerd årbe hää ai leesen wårde koon.
