# Dhivehi viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# Thaana, right to left, written in logical order; see `content.ftl`'s header.


## Answer submission

answer-checking = ބަލަނީ…
answer-submitting = ފޮނުވަނީ…
answer-checking-status = ޖަވާބު ބަލަނީ
answer-submitting-status = ޖަވާބު ފޮނުވަނީ
answer-correct = ރަނގަޅު
answer-incorrect = ނުބައި
answer-response-saved = ޖަވާބު ރައްކާކުރެވިއްޖެ
answer-percent-credit = { $percent }% މާކްސް
answer-percent-correct = { $percent }% ރަނގަޅު
answer-percent-short = { $percent } %
max-credit-available = ލިބެންހުރި އެންމެ ގިނަ މާކްސް: { $percent }%
attempts-remaining =
    { $count ->
        [0] އެއްވެސް ފުރުސަތެއް ނެތް
        [one] { $count } ފުރުސަތު ބާކީ
       *[other] { $count } ފުރުސަތު ބާކީ
    }
validation-correct = (ރަނގަޅު)
validation-incorrect = (ނުބައި)
validation-partially-correct = (އެއްބައި ރަނގަޅު)
answer-show-responses =
    { $count ->
        [one] { $answerId } އަށް { $count } ޖަވާބު ދައްކާ
       *[other] { $answerId } އަށް { $count } ޖަވާބު ދައްކާ
    }

## Disclosure panels

feedback-heading = ފީޑްބެކް
collapsible-click-to-open = (ހުޅުވަން ކްލިކްކުރައްވާ)
collapsible-click-to-close = (ބަންދުކުރަން ކްލިކްކުރައްވާ)
collapsible-initializing = ފަށަނީ…
footnote-show = ފުޓްނޯޓު ދައްކާ
footnote-hide = ފުޓްނޯޓު ފޮރުވާ
description-more-information = އިތުރު މައުލޫމާތު

## Controls

slider-previous = ކުރީގެ
slider-next = ދެން
keyboard-open = ކީބޯޑު ހުޅުވާ
keyboard-close = ކީބޯޑު ބަންދުކުރޭ
choice-input-remove-choice = { $choice } ނަގާ
matrix-remove-row = ރޯ ނަގާ
matrix-add-row = ރޯ އިތުރުކުރޭ
matrix-remove-column = ކޮލަމް ނަގާ
matrix-add-column = ކޮލަމް އިތުރުކުރޭ
subset-add-remove-points = ނުކުތާ އިތުރުކުރޭ/ނަގާ
subset-toggle-points-intervals = ނުކުތާއާއި ފަށަލަ ބަދަލުކުރޭ
subset-move-points = ނުކުތާ ގެންދޭ
subset-clear = ސާފުކުރޭ
orbital-add-row = ރޯ އިތުރުކުރޭ
orbital-remove-row = ރޯ ނަގާ
orbital-add-box = ފޮށި އިތުރުކުރޭ
orbital-remove-box = ފޮށި ނަގާ
orbital-add-up-arrow = މައްޗަށް އަމާޒު އިތުރުކުރޭ
orbital-add-down-arrow = ތިރިއަށް އަމާޒު އިތުރުކުރޭ
orbital-remove-arrow = އަމާޒު ނަގާ
orbital-row-label = ރޯ { $row } ގެ ލޭބަލް
pretzel-answer = ޖަވާބު

## Math input

math-input-preview-region = ހިސާބުގެ އިބާރާތުގެ ކުރީގެ ނަޒަރު
math-input-preview = ކުރީގެ ނަޒަރު
math-input-invalid-expression = ސައްހަނޫން އިބާރާތެއް:

## Document status

viewer-initializing = ފަށަނީ…

## Errors

error-heading = ކުށް
error-found-at =
    { $span ->
        [line] ފޮޅުވަތް { $startLine } ން ފެނުނު.
       *[lines] ފޮޅުވަތް { $startLine }–{ $endLine } ން ފެނުނު.
    }
document-contains-errors = މި ލިޔުމުގައި ކުށް އެބަހުރި!
diagnostic-heading-error = ކުށް
diagnostic-heading-warning = އިންޒާރު
diagnostic-heading-information = މައުލޫމާތު
diagnostic-heading-hint = އިޝާރާތް
accessibility-heading-level-1 = WCAG AA ވާސިލުވުމުގެ ޚިލާފުވުން
accessibility-heading-level-2 = ވާސިލުވުމުގެ އިންޒާރު
something-went-wrong = ކޮންމެވެސް ކަމެއް ގޯސްވެއްޖެ.
renderer-load-failed = ދައްކާ އެއް ބައި ލޯޑެއް ނުވި. ސަފުހާ އަލުން ލޯޑުކުރައްވާ.
core-start-failed = ލިޔުން ދައްކާ ބައި ފެށޭގޮތެއް ނުވި. ސަފުހާ އަލުން ލޯޑުކުރައްވާ.
