# Sango viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# **Every counted message here is flat**, because `Intl.PluralRules("sg")`
# reports exactly one category; see `content.ftl`'s header. `attempts-remaining`
# keeps its `[0]` branch, which Fluent matches by number rather than by
# category, so a wording for none is still reachable.


## Answer submission

answer-checking = Bâa…
answer-submitting = Tokua…
answer-checking-status = A yeke bâa kîri-tënë
answer-submitting-status = A yeke tokua kîri-tënë
answer-correct = A yeke tâ
answer-incorrect = A yeke tâ pëpe
answer-response-saved = A bata kîri-tënë
answer-percent-credit = { $percent }% tî apoin
answer-percent-correct = { $percent }% a yeke tâ
answer-percent-short = { $percent } %
max-credit-available = Kötä apoin so ayeke: { $percent }%
attempts-remaining =
    { $count ->
        [0] mbênî tarä angbâ pëpe
       *[other] tarä { $count } angbâ
    }
validation-correct = (A yeke tâ)
validation-incorrect = (A yeke tâ pëpe)
validation-partially-correct = (A yeke tâ na mbâgë)
answer-show-responses = Fa akîri-tënë { $count } tî { $answerId }

## Disclosure panels

feedback-heading = Wängö
collapsible-click-to-open = (pîka tî zi)
collapsible-click-to-close = (pîka tî kânga)
collapsible-initializing = A yeke tö ndâ…
footnote-show = Fa nôte tî gbe
footnote-hide = Honde nôte tî gbe
description-more-information = tënë ndê

## Controls

slider-previous = Kôzo
slider-next = Na pekô
keyboard-open = Zi Klavîe
keyboard-close = Kânga Klavîe
choice-input-remove-choice = Zî { $choice }
matrix-remove-row = Zî lignë
matrix-add-row = Zîa lignë
matrix-remove-column = Zî kolöne
matrix-add-column = Zîa kolöne
subset-add-remove-points = Zîa/Zî apoin
subset-toggle-points-intervals = Gbîan apoin na angoi
subset-move-points = Gue na Apoin
subset-clear = Sukûla
orbital-add-row = Zîa Lignë
orbital-remove-row = Zî Lignë
orbital-add-box = Zîa Bôite
orbital-remove-box = Zî Bôite
orbital-add-up-arrow = Zîa Flêshe tî Ndüzü
orbital-add-down-arrow = Zîa Flêshe tî Gbe
orbital-remove-arrow = Zî Flêshe
orbital-row-label = Îri tî lignë { $row }
pretzel-answer = Kîri-tënë

## Math input

math-input-preview-region = bängö kôzo tî tënë tî nömbre
math-input-preview = Bängö kôzo
math-input-invalid-expression = Tënë so ayeke tâ pëpe:

## Document status

viewer-initializing = A yeke tö ndâ…

## Errors

error-heading = Fîon
error-found-at =
    { $span ->
        [line] A wara na lignë { $startLine }.
       *[lines] A wara na alignë { $startLine }–{ $endLine }.
    }
document-contains-errors = Mbëtï sô ayeke na afîon!
diagnostic-heading-error = Fîon
diagnostic-heading-warning = Gbotöngö-mê
diagnostic-heading-information = Tënë
diagnostic-heading-hint = Fängö-lêgë
accessibility-heading-level-1 = Fütïngö WCAG AA tî Sïngö
accessibility-heading-level-2 = Gbotöngö-mê tî sïngö
something-went-wrong = Mbênî ye ague nzönî pëpe.
renderer-load-failed = wafängö-ye alîngbi tî lodë pëpe. Sâra nzönî lodë lêmbëtï nînga.
core-start-failed = Wafängö-mbëtï alîngbi tî tö ndâ pëpe. Sâra nzönî lodë lêmbëtï nînga.
