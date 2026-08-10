# Sanskrit editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand, as do the attribute names quoted back at an
# author.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] पुनःस्थाप्यताम्
       *[update] नवीक्रियताम्
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] दर्शकः { $word }
       *[other] दर्शकः { $word } { $shortcut }
    }


## The variant picker

editor-variant = भेदः

editor-variant-filter = चालनी…

editor-variant-next = अग्रिमः भेदः चीयताम्

editor-variant-previous = पूर्वः भेदः चीयताम्


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA सुगम्यताभङ्गः दृष्टः। सुगम्यताप्रतिवेदनं { $action ->
            [close] पिधातुं
           *[open] उद्घाटयितुं
        } नुद्यताम्।
        [advisories] सुगम्यताप्रतिवेदनं { $action ->
            [close] पिधातुं
           *[open] उद्घाटयितुं
        } नुद्यताम्। WCAG AA भङ्गाः न दृष्टाः, किन्तु अपराणि सुगम्यतासूचनानि उपलब्धानि सन्ति।
       *[clean] सुगम्यताप्रतिवेदनं { $action ->
            [close] पिधातुं
           *[open] उद्घाटयितुं
        } नुद्यताम्। कोऽपि सुगम्यतादोषः न दृष्टः।
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA सुगम्यताभङ्गः दृष्टः। { $count ->
            [one] { $count } WCAG AA भङ्गः
           *[other] { $count } WCAG AA भङ्गाः
        } दृष्टाः। सुगम्यताप्रतिवेदनं { $action ->
            [close] पिधातुं
           *[open] उद्घाटयितुं
        } नुद्यताम्।
        [advisories] कोऽपि WCAG AA भङ्गः न दृष्टः। { $count ->
            [one] { $count } अपरा सुगम्यतासूचना
           *[other] { $count } अपराणि सुगम्यतासूचनानि
        } दृष्टानि। सुगम्यताप्रतिवेदनं { $action ->
            [close] पिधातुं
           *[open] उद्घाटयितुं
        } नुद्यताम्।
       *[clean] कोऽपि WCAG AA भङ्गः न दृष्टः। सुगम्यताप्रतिवेदनं { $action ->
            [close] पिधातुं
           *[open] उद्घाटयितुं
        } नुद्यताम्।
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML आवृत्तिः { $version }

editor-tab-help = सन्दर्भानुसारिणी सहायता
editor-tab-help-short = सन्दर्भः
editor-tab-errors = दोषाः
editor-tab-warnings = सावधानानि
editor-tab-info = सूचनाः
editor-tab-accessibility = सुगम्यता
editor-tab-responses = प्रेषितानि उत्तराणि

editor-tab-with-count = { $label }: { $count }

editor-options = सम्पादकविकल्पाः
editor-format-as-doenetml = DoenetML-रूपेण सज्ज्यताम्
editor-format-as-xml = XML-रूपेण सज्ज्यताम्


## The diagnostics panel

editor-diagnostic-line = पङ्क्तिः #{ $line }

editor-no-errors = न के अपि दोषाः
editor-no-warnings = न कानि अपि सावधानानि
editor-no-info = न काः अपि सूचनाः

editor-show-info-annotations = सम्पादके सूचनाः दर्श्यन्ताम्
editor-show-accessibility-annotations = सम्पादके सुगम्यतासूचनानि दर्श्यन्ताम्

editor-accessibility-learn-more = Doenet कथं सुगम्यतां साधयति इति ज्ञायताम्

editor-accessibility-violations-heading = सुगम्यताभङ्गाः ({ $standard })

editor-accessibility-other-heading = अपरे सुगम्यतादोषाः
editor-none-found = न किमपि दृष्टम्


## Submitted responses

editor-no-responses = अद्यापि न किमपि उत्तरं प्रेषितम्
editor-response-answer-id = उत्तरसङ्केतः
editor-response-response = उत्तरम्
editor-response-credit = अङ्काः
editor-response-submitted = प्रेषितम्


## The context-help panel

help-placeholder = लेखार्थं सूचकं पिधाननाम्नि, विशेषणे, अथवा { $ref } इत्यत्र स्थाप्यताम्।

help-unsupported-ref-chain = { $example } इत्यादीनां बहुखण्डसन्दर्भाणां कृते सहायता अद्यापि नास्ति।

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } इति सन्दर्भस्य कोऽपि लक्ष्यः न दृष्टः।
        [multiple] { $ref } इति सन्दर्भस्य बहवः लक्ष्याः दृष्टाः।
       *[indeterminate] { $ref } इत्यस्य लक्ष्यः निर्णेतुं न शक्तः।
    }

help-learn-about-references = सन्दर्भविषये ज्ञायताम् →
help-reference-page = सन्दर्भपृष्ठम् →

help-suggestions-header =
    { $location ->
        [inside] { $element } इत्यस्य अन्तः
       *[top] उपरितने स्तरे
    }{ $allowed ->
        [none] { " — अत्र किमपि न याति।" }
        [text] { " — अत्र पाठ्यं लिख्यताम्।" }
        [text-and-components] { " — अत्र पाठ्यं लिख्यताम्, अथवा एतानि प्रयुज्यन्ताम्:" }
       *[components] { " — एतानि प्रयुज्यन्ताम्:" }
    }

help-suggestions-footer = सर्वेषां { $total } घटकानां दर्शनाय { $shortcut } नुद्यताम्।

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } इति { $target } इत्यस्य सन्दर्भः।
       *[other] { $ref } इति { $target } इत्यस्य सन्दर्भः ({ $line } पङ्क्तिः)।
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } इत्यनेन { $role } रूपेण प्रवर्तितम्।
       *[other] { $owner } इत्यनेन { $line } पङ्क्तौ { $role } रूपेण प्रवर्तितम्।
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } इति { $element } इत्यस्य { $property } गुणस्य सन्दर्भः।
       *[other] { $ref } इति { $element } इत्यस्य { $property } गुणस्य सन्दर्भः ({ $line } पङ्क्तिः)।
    }

help-kind-attribute = विशेषणम्
help-kind-snippet = खण्डः
help-kind-array-entry = सारणीप्रविष्टिः

help-default = पूर्वनिर्धारितम्:
help-active-default = सक्रियं पूर्वनिर्धारितम्:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] अनुज्ञातानि मूल्यानि (प्रतिवस्तु एकम्):
       *[other] अनुज्ञातानि मूल्यानि:
    }

help-suggested-values = सूचितानि मूल्यानि:

help-inserts = निवेशयति:

help-coordinates =
    { $count ->
        [one] निर्देशाङ्कः:
       *[other] निर्देशाङ्काः:
    }

help-type = प्रकारः:

help-resolved-style = निर्णीता शैली (styleNumber { $styleNumber }):

help-resolved-function-names = निर्णीतानि फलननामानि:
help-reset-list = अस्मिन् निवेशे पुनःस्थापनसूची:
help-added-on-input = अस्मिन् निवेशे योजितम्:
help-removed-on-input = अस्मिन् निवेशे अपनीतम्:

help-reset-overrides = { $reset } इति { $additional } { $removed } चेत्येतयोः उपरि वर्तते।
