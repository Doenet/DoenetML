# Georgian editor and language-server surfaces. Translated from
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
# Georgian counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] აღდგენა
       *[update] განახლება
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] მაჩვენებლის { $word }
       *[other] მაჩვენებლის { $word } { $shortcut }
    }


## The variant picker

editor-variant = ვარიანტი
editor-variant-filter = გაფილტვრა…
editor-variant-next = შემდეგი ვარიანტის არჩევა
editor-variant-previous = წინა ვარიანტის არჩევა


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] აღმოჩენილია WCAG AA ხელმისაწვდომობის დარღვევა. დააწკაპუნეთ ხელმისაწვდომობის ანგარიშის { $action ->
            [close] დასახურად
           *[open] გასახსნელად
        }.
        [advisories] დააწკაპუნეთ ხელმისაწვდომობის ანგარიშის { $action ->
            [close] დასახურად
           *[open] გასახსნელად
        }. WCAG AA დარღვევები არ აღმოჩენილა, თუმცა არსებობს ხელმისაწვდომობის დამატებითი რეკომენდაციები.
       *[clean] დააწკაპუნეთ ხელმისაწვდომობის ანგარიშის { $action ->
            [close] დასახურად
           *[open] გასახსნელად
        }. ხელმისაწვდომობის პრობლემები არ აღმოჩენილა.
    }

editor-accessibility-label =
    { $status ->
        [violations] აღმოჩენილია WCAG AA ხელმისაწვდომობის დარღვევა. ნაპოვნია { $count ->
            [one] { $count } WCAG AA დარღვევა
           *[other] { $count } WCAG AA დარღვევა
        }. დააწკაპუნეთ ხელმისაწვდომობის ანგარიშის { $action ->
            [close] დასახურად
           *[open] გასახსნელად
        }.
        [advisories] WCAG AA დარღვევები არ აღმოჩენილა. ნაპოვნია ხელმისაწვდომობის { $count ->
            [one] { $count } დამატებითი რეკომენდაცია
           *[other] { $count } დამატებითი რეკომენდაცია
        }. დააწკაპუნეთ ხელმისაწვდომობის ანგარიშის { $action ->
            [close] დასახურად
           *[open] გასახსნელად
        }.
       *[clean] WCAG AA დარღვევები არ აღმოჩენილა. დააწკაპუნეთ ხელმისაწვდომობის ანგარიშის { $action ->
            [close] დასახურად
           *[open] გასახსნელად
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ვერსია { $version }

editor-tab-help = კონტექსტური დახმარება
editor-tab-help-short = კონტექსტი
editor-tab-errors = შეცდომები
editor-tab-warnings = გაფრთხილებები
editor-tab-info = ინფორმაცია
editor-tab-accessibility = ხელმისაწვდომობა
editor-tab-responses = გაგზავნილი პასუხები

editor-tab-with-count = { $label }: { $count }

editor-options = რედაქტორის პარამეტრები
editor-format-as-doenetml = DoenetML-ად დაფორმატება
editor-format-as-xml = XML-ად დაფორმატება


## The diagnostics panel

editor-diagnostic-line = სტრიქონი #{ $line }

editor-no-errors = შეცდომები არ არის
editor-no-warnings = გაფრთხილებები არ არის
editor-no-info = საინფორმაციო შეტყობინებები არ არის

editor-show-info-annotations = საინფორმაციო შეტყობინებების ჩვენება რედაქტორში
editor-show-accessibility-annotations = ხელმისაწვდომობის შეტყობინებების ჩვენება რედაქტორში

editor-accessibility-learn-more = როგორ უდგება Doenet ხელმისაწვდომობას

editor-accessibility-violations-heading = ხელმისაწვდომობის დარღვევები ({ $standard })

editor-accessibility-other-heading = ხელმისაწვდომობის სხვა პრობლემები
editor-none-found = არაფერი მოიძებნა


## Submitted responses

editor-no-responses = გაგზავნილი პასუხები ჯერ არ არის
editor-response-answer-id = პასუხის Id
editor-response-response = პასუხი
editor-response-credit = ქულა
editor-response-submitted = გაგზავნილია


## The context-help panel

help-placeholder = დოკუმენტაციისთვის დააყენეთ კურსორი ტეგის სახელზე, ატრიბუტზე ან { $ref }-ზე.

help-unsupported-ref-chain = { $example }-ის მსგავსი მრავალნაწილიანი მიმართვების დახმარება ჯერ არ არის მხარდაჭერილი.

help-unresolved-ref =
    { $reason ->
        [notFound] მიმართვისთვის ობიექტი ვერ მოიძებნა: { $ref }.
        [multiple] მიმართვისთვის რამდენიმე ობიექტი მოიძებნა: { $ref }.
       *[indeterminate] { $ref }-ის ობიექტის დადგენა ვერ მოხერხდა.
    }

help-learn-about-references = გაიგეთ მეტი მიმართვების შესახებ →
help-reference-page = საცნობარო გვერდი →

help-suggestions-header =
    { $location ->
        [inside] { $element }-ის შიგნით
       *[top] ზედა დონეზე
    }{ $allowed ->
        [none] { " — აქ არაფერი ჯდება." }
        [text] { " — აქ შეგიძლიათ ტექსტის აკრეფა." }
        [text-and-components] { " — აქ შეგიძლიათ ტექსტის აკრეფა, ან სცადეთ:" }
       *[components] { " — შეგიძლიათ სცადოთ:" }
    }

help-suggestions-footer = დააჭირეთ { $shortcut }-ს ყველა { $total } კომპონენტის სანახავად.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } არის მიმართვა { $target }-ზე.
       *[other] { $ref } არის მიმართვა { $target }-ზე ({ $line } სტრიქონი).
    }

help-ref-derived-from =
    { $line ->
        [none] შემოტანილია { $owner }-ის მიერ, როგორც { $role }.
       *[other] შემოტანილია { $owner }-ის მიერ { $line } სტრიქონში, როგორც { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } არის მიმართვა { $element }-ის { $property } თვისებაზე.
       *[other] { $ref } არის მიმართვა { $element }-ის { $property } თვისებაზე ({ $line } სტრიქონი).
    }

help-kind-attribute = ატრიბუტი
help-kind-snippet = ნაწყვეტი
help-kind-array-entry = მასივის ელემენტი

help-default = ნაგულისხმევი მნიშვნელობა:
help-active-default = მოქმედი ნაგულისხმევი მნიშვნელობა:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] დასაშვები მნიშვნელობები (თითო ელემენტზე ერთი):
       *[other] დასაშვები მნიშვნელობები:
    }

help-suggested-values = რეკომენდებული მნიშვნელობები:

help-inserts = ამატებს:

help-coordinates =
    { $count ->
        [one] კოორდინატი:
       *[other] კოორდინატები:
    }

help-type = ტიპი:

help-resolved-style = მიღებული სტილი (styleNumber { $styleNumber }):

help-resolved-function-names = მიღებული ფუნქციების სახელები:
help-reset-list = ამ ველის აღდგენის სია:
help-added-on-input = ამ ველზე დამატებული:
help-removed-on-input = ამ ველიდან წაშლილი:

help-reset-overrides = { $reset } უპირატესია { $additional }-სა და { $removed }-ზე.
