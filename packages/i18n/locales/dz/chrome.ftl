# Dzongkha viewer chrome: buttons, panel headers, and other UI the reader
# interacts with. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# One plural category, so there is nothing for a counted message to select on
# and `answer-show-responses` is written flat; `attempts-remaining` keeps two
# branches because its `[0]` is matched by number rather than by category. See
# `content.ftl`'s header for the case particles the composition messages
# restrict themselves to — and for why `orbital-row-label` here cannot, and
# writes the default གི་.


## Answer submission

answer-checking = ཞིབ་དཔྱད་འབད་དོ།
answer-submitting = བཏང་དོ།
answer-checking-status = ལན་ལུ་ཞིབ་དཔྱད་འབད་དོ
answer-submitting-status = ལན་བཏང་དོ
answer-correct = ངོ་མ
answer-incorrect = འཛོལ་བ
answer-response-saved = ལན་བསྲུངས་ཡི
answer-percent-credit = { $percent }% སྐུགས
answer-percent-correct = { $percent }% ངོ་མ
answer-percent-short = { $percent } %
max-credit-available = ཐོབ་ཚུགས་པའི་སྐུགས་མང་ཤོས། { $percent }%
attempts-remaining =
    { $count ->
        [0] འབད་རྩོལ་ལྷག་ལུས་མེད
       *[other] འབད་རྩོལ་ { $count } ལྷག་ལུས་ཡོད
    }
validation-correct = (ངོ་མ)
validation-incorrect = (འཛོལ་བ)
validation-partially-correct = (ཕྱོགས་གཅིག་ངོ་མ)
answer-show-responses = { $answerId } ལུ་ལན་ { $count } སྟོན

## Disclosure panels

feedback-heading = བསམ་ལན
collapsible-click-to-open = (ཁ་ཕྱེ་ནི་ལུ་ཨེབ)
collapsible-click-to-close = (ཁ་བསྡམ་ནི་ལུ་ཨེབ)
collapsible-initializing = འགོ་བཙུགས་དོ།
footnote-show = མཇུག་གི་དྲན་གསོ་སྟོན
footnote-hide = མཇུག་གི་དྲན་གསོ་སྦས
description-more-information = བརྡ་དོན་ཧེང་བཀལ

## Controls

slider-previous = ཧེ་མམ
slider-next = ཤུལ་མམ
keyboard-open = ལྡེ་སྒྲོམ་ཁ་ཕྱེ
keyboard-close = ལྡེ་སྒྲོམ་ཁ་བསྡམ
choice-input-remove-choice = { $choice } རྩ་བསྐྲད
matrix-remove-row = གྲལ་ཐིག་རྩ་བསྐྲད
matrix-add-row = གྲལ་ཐིག་ཁ་སྐོང
matrix-remove-column = ཀེར་ཐིག་རྩ་བསྐྲད
matrix-add-column = ཀེར་ཐིག་ཁ་སྐོང
subset-add-remove-points = ཚག་ཁ་སྐོང་དང་རྩ་བསྐྲད
subset-toggle-points-intervals = ཚག་དང་བར་མཚམས་སོར
subset-move-points = ཚག་སྤོ
subset-clear = བསལ
orbital-add-row = གྲལ་ཐིག་ཁ་སྐོང
orbital-remove-row = གྲལ་ཐིག་རྩ་བསྐྲད
orbital-add-box = སྒྲོམ་ཁ་སྐོང
orbital-remove-box = སྒྲོམ་རྩ་བསྐྲད
orbital-add-up-arrow = ཡར་མདའ་ཁ་སྐོང
orbital-add-down-arrow = མར་མདའ་ཁ་སྐོང
orbital-remove-arrow = མདའ་རྩ་བསྐྲད
orbital-row-label = གྲལ་ཐིག་ { $row } གི་ཁ་ཡིག
pretzel-answer = ལན

## Math input

math-input-preview-region = ཨང་རྩིས་བརྗོད་པའི་སྔོན་ལྟ
math-input-preview = སྔོན་ལྟ
math-input-invalid-expression = བརྗོད་པ་ནོར་བ།

## Document status

viewer-initializing = འགོ་བཙུགས་དོ།

## Errors

error-heading = འཛོལ་བ
error-found-at =
    { $span ->
        [line] གྲལ་ཐིག་ { $startLine } ལུ་ཐོབ་ཅི།
       *[lines] གྲལ་ཐིག་ { $startLine }–{ $endLine } ལུ་ཐོབ་ཅི།
    }
document-contains-errors = ཡིག་ཆ་འདི་ནང་འཛོལ་བ་འདུག
diagnostic-heading-error = འཛོལ་བ
diagnostic-heading-warning = ཉེན་བརྡ
diagnostic-heading-information = བརྡ་དོན
diagnostic-heading-hint = བརྡ་མཚོན
accessibility-heading-level-1 = WCAG AA འཛུལ་སྤྱོད་འགལ་བ
accessibility-heading-level-2 = འཛུལ་སྤྱོད་ཉེན་བརྡ
something-went-wrong = ག་ཅི་ཞིག་འཛོལ་སོ་ནུག
renderer-load-failed = སྟོན་བྱེད་ཅིག་མངོན་གསལ་འབད་མ་ཚུགས། ཤོག་ལེབ་ལོག་མངོན་གསལ་འབད་གནང་།
core-start-failed = ཡིག་ཆ་སྟོན་བྱེད་འགོ་བཙུགས་མ་ཚུགས། ཤོག་ལེབ་ལོག་མངོན་གསལ་འབད་གནང་།
