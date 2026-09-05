# Tibetan viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the single plural category and for the case
# particles the composition messages are restricted to. With one category there
# is nothing for a counted message to select on, so `answer-show-responses` is
# written flat; `attempts-remaining` keeps two branches because its `[0]` is
# matched by number rather than by category, which Fluent resolves first.
#
# `orbital-row-label` is one of the messages `content.ftl`'s header names as
# unable to avoid a genitive after a placeable. It writes the default shape,
# གི་.


## Answer submission

answer-checking = ཞིབ་བཤེར་བྱེད་བཞིན་པ།
answer-submitting = སྐུར་བཞིན་པ།
answer-checking-status = ལན་ལ་ཞིབ་བཤེར་བྱེད་བཞིན་པ
answer-submitting-status = ལན་སྐུར་བཞིན་པ
answer-correct = ཡང་དག
answer-incorrect = ནོར་འཁྲུལ
answer-response-saved = ལན་ཉར་ཚགས་བྱས་ཟིན
answer-percent-credit = { $percent }% སྐར་གྲངས
answer-percent-correct = { $percent }% ཡང་དག
answer-percent-short = { $percent } %
max-credit-available = ཐོབ་ཐུབ་པའི་སྐར་གྲངས་མཐོ་ཤོས། { $percent }%
attempts-remaining =
    { $count ->
        [0] འབད་བརྩོན་ལྷག་མ་མེད
       *[other] འབད་བརྩོན་ { $count } ལྷག་ཡོད
    }
validation-correct = (ཡང་དག)
validation-incorrect = (ནོར་འཁྲུལ)
validation-partially-correct = (ཕྱོགས་གཅིག་ཡང་དག)
answer-show-responses = { $answerId } ལ་ལན་ { $count } སྟོན

## Disclosure panels

feedback-heading = ལན་འདེབས
collapsible-click-to-open = (ཕྱེ་བར་ནོན)
collapsible-click-to-close = (སྒོ་རྒྱག་པར་ནོན)
collapsible-initializing = འགོ་འཛུགས་བཞིན་པ།
footnote-show = མཇུག་མཆན་སྟོན
footnote-hide = མཇུག་མཆན་སྦེད
description-more-information = གནས་ཚུལ་མང་བ

## Controls

slider-previous = སྔོན་མ
slider-next = རྗེས་མ
keyboard-open = མཐེབ་གཞོང་ཕྱེ
keyboard-close = མཐེབ་གཞོང་སྒོ་རྒྱོབ
choice-input-remove-choice = { $choice } ཕྱིར་འདོན
matrix-remove-row = ཕྲེང་ཕྱིར་འདོན
matrix-add-row = ཕྲེང་སྣོན
matrix-remove-column = སྟར་ཕྱིར་འདོན
matrix-add-column = སྟར་སྣོན
subset-add-remove-points = ཚེག་སྣོན་དང་ཕྱིར་འདོན
subset-toggle-points-intervals = ཚེག་དང་བར་མཚམས་བརྗེ
subset-move-points = ཚེག་སྤོ
subset-clear = གཙང་སེལ
orbital-add-row = ཕྲེང་སྣོན
orbital-remove-row = ཕྲེང་ཕྱིར་འདོན
orbital-add-box = སྒམ་སྣོན
orbital-remove-box = སྒམ་ཕྱིར་འདོན
orbital-add-up-arrow = ཡར་མདའ་སྣོན
orbital-add-down-arrow = མར་མདའ་སྣོན
orbital-remove-arrow = མདའ་ཕྱིར་འདོན
orbital-row-label = ཕྲེང་ { $row } གི་མིང་བྱང
pretzel-answer = ལན

## Math input

math-input-preview-region = རྩིས་བརྗོད་ཀྱི་སྔོན་ལྟ
math-input-preview = སྔོན་ལྟ
math-input-invalid-expression = བརྗོད་པ་ནོར་བ།

## Document status

viewer-initializing = འགོ་འཛུགས་བཞིན་པ།

## Errors

error-heading = ནོར་འཁྲུལ
error-found-at =
    { $span ->
        [line] ཐིག་ཕྲེང་ { $startLine } ལ་རྙེད་བྱུང་།
       *[lines] ཐིག་ཕྲེང་ { $startLine }–{ $endLine } ལ་རྙེད་བྱུང་།
    }
document-contains-errors = ཡིག་ཆ་འདིའི་ནང་ནོར་འཁྲུལ་ཡོད།
diagnostic-heading-error = ནོར་འཁྲུལ
diagnostic-heading-warning = ཉེན་བརྡ
diagnostic-heading-information = གནས་ཚུལ
diagnostic-heading-hint = བརྡ་སྟོན
accessibility-heading-level-1 = WCAG AA བདེ་སྤྱོད་འགལ་བ
accessibility-heading-level-2 = བདེ་སྤྱོད་ཉེན་བརྡ
something-went-wrong = ཅི་ཞིག་ནོར་སོང་།
renderer-load-failed = སྟོན་བྱེད་ཅིག་སྣོན་མ་ཐུབ། ཤོག་ངོས་སླར་ཡང་སྣོན་རོགས།
core-start-failed = ཡིག་ཆ་སྟོན་བྱེད་འགོ་འཛུགས་མ་ཐུབ། ཤོག་ངོས་སླར་ཡང་སྣོན་རོགས།
