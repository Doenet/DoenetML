# Odia editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Odia counts in two plural categories, but a counted noun is usually left
# unmarked, so the select is dropped where writing both out would produce the
# same words twice.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ପୁନଃସ୍ଥାପନ କରନ୍ତୁ
       *[update] ଅଦ୍ୟତନ କରନ୍ତୁ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ଦର୍ଶକ { $word }
       *[other] ଦର୍ଶକ { $word } { $shortcut }
    }


## The variant picker

editor-variant = ପ୍ରକାର
editor-variant-filter = ଛାଣନ୍ତୁ...
editor-variant-next = ପରବର୍ତ୍ତୀ ପ୍ରକାର ବାଛନ୍ତୁ
editor-variant-previous = ପୂର୍ବବର୍ତ୍ତୀ ପ୍ରକାର ବାଛନ୍ତୁ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA ଅଭିଗମ୍ୟତା ଉଲ୍ଲଙ୍ଘନ ମିଳିଲା। ଅଭିଗମ୍ୟତା ରିପୋର୍ଟ { $action ->
            [close] ବନ୍ଦ କରିବାକୁ
           *[open] ଖୋଲିବାକୁ
        } କ୍ଲିକ କରନ୍ତୁ।
        [advisories] ଅଭିଗମ୍ୟତା ରିପୋର୍ଟ { $action ->
            [close] ବନ୍ଦ କରିବାକୁ
           *[open] ଖୋଲିବାକୁ
        } କ୍ଲିକ କରନ୍ତୁ। କୌଣସି WCAG AA ଉଲ୍ଲଙ୍ଘନ ମିଳିଲା ନାହିଁ, କିନ୍ତୁ ଅତିରିକ୍ତ ଅଭିଗମ୍ୟତା ସୁପାରିଶ ଉପଲବ୍ଧ ଅଛି।
       *[clean] ଅଭିଗମ୍ୟତା ରିପୋର୍ଟ { $action ->
            [close] ବନ୍ଦ କରିବାକୁ
           *[open] ଖୋଲିବାକୁ
        } କ୍ଲିକ କରନ୍ତୁ। କୌଣସି ଅଭିଗମ୍ୟତା ସମସ୍ୟା ମିଳିଲା ନାହିଁ।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA ଅଭିଗମ୍ୟତା ଉଲ୍ଲଙ୍ଘନ ମିଳିଲା। { $count } WCAG AA ଉଲ୍ଲଙ୍ଘନ ମିଳିଲା। ଅଭିଗମ୍ୟତା ରିପୋର୍ଟ { $action ->
            [close] ବନ୍ଦ କରିବାକୁ
           *[open] ଖୋଲିବାକୁ
        } କ୍ଲିକ କରନ୍ତୁ।
        [advisories] କୌଣସି WCAG AA ଉଲ୍ଲଙ୍ଘନ ମିଳିଲା ନାହିଁ। { $count } ଅତିରିକ୍ତ ଅଭିଗମ୍ୟତା ସୁପାରିଶ ମିଳିଲା। ଅଭିଗମ୍ୟତା ରିପୋର୍ଟ { $action ->
            [close] ବନ୍ଦ କରିବାକୁ
           *[open] ଖୋଲିବାକୁ
        } କ୍ଲିକ କରନ୍ତୁ।
       *[clean] କୌଣସି WCAG AA ଉଲ୍ଲଙ୍ଘନ ମିଳିଲା ନାହିଁ। ଅଭିଗମ୍ୟତା ରିପୋର୍ଟ { $action ->
            [close] ବନ୍ଦ କରିବାକୁ
           *[open] ଖୋଲିବାକୁ
        } କ୍ଲିକ କରନ୍ତୁ।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ସଂସ୍କରଣ { $version }

editor-tab-help = ପ୍ରସଙ୍ଗ ଅନୁସାରେ ସହାୟତା
editor-tab-help-short = ପ୍ରସଙ୍ଗ
editor-tab-errors = ତ୍ରୁଟି
editor-tab-warnings = ଚେତାବନୀ
editor-tab-info = ସୂଚନା
editor-tab-accessibility = ଅଭିଗମ୍ୟତା
editor-tab-responses = ପଠାଯାଇଥିବା ଉତ୍ତର

editor-tab-with-count = { $label }: { $count }

editor-options = ସମ୍ପାଦକ ବିକଳ୍ପ
editor-format-as-doenetml = DoenetML ଭାବେ ସଜାନ୍ତୁ
editor-format-as-xml = XML ଭାବେ ସଜାନ୍ତୁ


## The diagnostics panel

editor-diagnostic-line = ଧାଡ଼ି #{ $line }

editor-no-errors = କୌଣସି ତ୍ରୁଟି ନାହିଁ
editor-no-warnings = କୌଣସି ଚେତାବନୀ ନାହିଁ
editor-no-info = କୌଣସି ସୂଚନା ନିର୍ଣ୍ଣୟ ନାହିଁ

editor-show-info-annotations = ସମ୍ପାଦକରେ ସୂଚନା ନିର୍ଣ୍ଣୟ ଦେଖାନ୍ତୁ
editor-show-accessibility-annotations = ସମ୍ପାଦକରେ ଅଭିଗମ୍ୟତା ନିର୍ଣ୍ଣୟ ଦେଖାନ୍ତୁ

editor-accessibility-learn-more = ଅଭିଗମ୍ୟତା ପ୍ରତି Doenet ର ଦୃଷ୍ଟିକୋଣ ଜାଣନ୍ତୁ

editor-accessibility-violations-heading = ଅଭିଗମ୍ୟତା ଉଲ୍ଲଙ୍ଘନ ({ $standard })

editor-accessibility-other-heading = ଅନ୍ୟ ଅଭିଗମ୍ୟତା ସମସ୍ୟା
editor-none-found = କିଛି ମିଳିଲା ନାହିଁ


## Submitted responses

editor-no-responses = ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଉତ୍ତର ପଠାଯାଇନାହିଁ
editor-response-answer-id = ଉତ୍ତର Id
editor-response-response = ଉତ୍ତର
editor-response-credit = ନମ୍ବର
editor-response-submitted = ପଠାଗଲା


## The context-help panel

help-placeholder = ଦଲିଲ ଦେଖିବାକୁ ଟ୍ୟାଗ ନାମ, ଗୁଣ କିମ୍ବା { $ref } ଉପରେ କର୍ସର ରଖନ୍ତୁ।

help-unsupported-ref-chain = { $example } ପରି ବହୁଭାଗୀ ସନ୍ଦର୍ଭ ପାଇଁ ସହାୟତା ଏପର୍ଯ୍ୟନ୍ତ ଉପଲବ୍ଧ ନାହିଁ।

help-unresolved-ref =
    { $reason ->
        [notFound] ଏହି ସନ୍ଦର୍ଭ ପାଇଁ କିଛି ମିଳିଲା ନାହିଁ: { $ref }।
        [multiple] ଏହି ସନ୍ଦର୍ଭ ପାଇଁ ଏକାଧିକ ଲକ୍ଷ୍ୟ ମିଳିଲା: { $ref }।
       *[indeterminate] { $ref } ପାଇଁ ଲକ୍ଷ୍ୟ ନିର୍ଦ୍ଧାରଣ ହୋଇପାରିଲା ନାହିଁ।
    }

help-learn-about-references = ସନ୍ଦର୍ଭ ବିଷୟରେ ଜାଣନ୍ତୁ →
help-reference-page = ସନ୍ଦର୍ଭ ପୃଷ୍ଠା →

help-suggestions-header =
    { $location ->
        [inside] { $element } ଭିତରେ
       *[top] ଉପର ସ୍ତରରେ
    }{ $allowed ->
        [none] { " — ଏଠାରେ କିଛି ଆସେ ନାହିଁ।" }
        [text] { " — ଏଠାରେ ଲେଖା ଟାଇପ କରାଯାଇପାରେ।" }
        [text-and-components] { " — ଏଠାରେ ଲେଖା ଟାଇପ କରାଯାଇପାରେ, କିମ୍ବା ଏଗୁଡ଼ିକ ଚେଷ୍ଟା କରନ୍ତୁ:" }
       *[components] { " — ଏଗୁଡ଼ିକ ଚେଷ୍ଟା କରନ୍ତୁ:" }
    }

help-suggestions-footer = ସମସ୍ତ { $total } ଉପାଦାନ ଦେଖିବାକୁ { $shortcut } ଦବାନ୍ତୁ।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ହେଉଛି { $target } ର ସନ୍ଦର୍ଭ।
       *[other] { $ref } ହେଉଛି { $target } ର ସନ୍ଦର୍ଭ (ଧାଡ଼ି { $line })।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ଏହାକୁ { $role } ଭାବେ ଆଣିଥିଲା।
       *[other] { $owner } ଏହାକୁ ଧାଡ଼ି { $line } ରେ { $role } ଭାବେ ଆଣିଥିଲା।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ହେଉଛି { $element } ର { $property } ଗୁଣର ସନ୍ଦର୍ଭ।
       *[other] { $ref } ହେଉଛି { $element } ର { $property } ଗୁଣର ସନ୍ଦର୍ଭ (ଧାଡ଼ି { $line })।
    }

help-kind-attribute = ଗୁଣ
help-kind-snippet = ଅଂଶ
help-kind-array-entry = ଆରେ ପ୍ରବିଷ୍ଟି

help-default = ପୂର୍ବନିର୍ଦ୍ଧାରିତ:
help-active-default = ସକ୍ରିୟ ପୂର୍ବନିର୍ଦ୍ଧାରିତ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ଅନୁମୋଦିତ ମୂଲ୍ୟ (ପ୍ରତି ପ୍ରବିଷ୍ଟିରେ ଗୋଟିଏ):
       *[other] ଅନୁମୋଦିତ ମୂଲ୍ୟ:
    }

help-suggested-values = ପ୍ରସ୍ତାବିତ ମୂଲ୍ୟ:

help-inserts = ଯୋଡ଼ିଥାଏ:

help-coordinates = ସ୍ଥାନାଙ୍କ:

help-type = ପ୍ରକାର:

help-resolved-style = ନିର୍ଦ୍ଧାରିତ ଶୈଳୀ (styleNumber { $styleNumber }):

help-resolved-function-names = ନିର୍ଦ୍ଧାରିତ ଫଳନ ନାମ:
help-reset-list = ଏହି ଇନପୁଟରେ ପୁନଃସ୍ଥାପିତ ତାଲିକା:
help-added-on-input = ଏହି ଇନପୁଟରେ ଯୋଡ଼ାଯାଇଥିବା:
help-removed-on-input = ଏହି ଇନପୁଟରୁ ହଟାଯାଇଥିବା:

help-reset-overrides = { $reset } { $additional } ଓ { $removed } ଉପରେ ପ୍ରାଧାନ୍ୟ ପାଏ।
