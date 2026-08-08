# Fijian editor and language-server surfaces. Translated from
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
# Fijian marks no number on the noun, so a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Vakasukaya
       *[update] Vakavoui
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } na irairai
       *[other] { $word } na irairai { $shortcut }
    }


## The variant picker

editor-variant = Ivakaduidui
editor-variant-filter = Vakawiliwili…
editor-variant-next = Digitaka na ivakaduidui tarava
editor-variant-previous = Digitaka na ivakaduidui liu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] E kune e dua na beitaki ni rawarawa WCAG AA. Kilika me { $action ->
            [close] sogoti
           *[open] dolavi
        } na ripote ni rawarawa.
        [advisories] Kilika me { $action ->
            [close] sogoti
           *[open] dolavi
        } na ripote ni rawarawa. E sega ni kune e dua na beitaki WCAG AA, ia e tiko e so tale na ivakasala ni rawarawa.
       *[clean] Kilika me { $action ->
            [close] sogoti
           *[open] dolavi
        } na ripote ni rawarawa. E sega ni kune e dua na leqa ni rawarawa.
    }

# No select on `$count` inside the branches: «beitaki» and «ivakasala» are the
# same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] E kune e dua na beitaki ni rawarawa WCAG AA. E kune e { $count } na beitaki WCAG AA. Kilika me { $action ->
            [close] sogoti
           *[open] dolavi
        } na ripote ni rawarawa.
        [advisories] E sega ni kune e dua na beitaki WCAG AA. E kune e { $count } tale na ivakasala ni rawarawa. Kilika me { $action ->
            [close] sogoti
           *[open] dolavi
        } na ripote ni rawarawa.
       *[clean] E sega ni kune e dua na beitaki WCAG AA. Kilika me { $action ->
            [close] sogoti
           *[open] dolavi
        } na ripote ni rawarawa.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Kena ivakarau DoenetML { $version }

editor-tab-help = Veivuke me salavata kei na ituvaki
editor-tab-help-short = Ituvaki
editor-tab-errors = Cala
editor-tab-warnings = Ivakasalasala
editor-tab-info = Itukutuku
editor-tab-accessibility = Rawarawa
editor-tab-responses = Isau sa vakau

editor-tab-with-count = { $label }: { $count }

editor-options = Digidigi ni idraudrau ni volavola
editor-format-as-doenetml = Vakarautaka me DoenetML
editor-format-as-xml = Vakarautaka me XML


## The diagnostics panel

editor-diagnostic-line = Laini #{ $line }

editor-no-errors = Sega ni dua na cala
editor-no-warnings = Sega ni dua na ivakasalasala
editor-no-info = Sega ni dua na itukutuku ni vakadidike

editor-show-info-annotations = Vakaraitaka na itukutuku ni vakadidike ena idraudrau ni volavola
editor-show-accessibility-annotations = Vakaraitaka na vakadidike ni rawarawa ena idraudrau ni volavola

editor-accessibility-learn-more = Vulica na sala e qarava kina o Doenet na rawarawa

editor-accessibility-violations-heading = Beitaki ni rawarawa ({ $standard })

editor-accessibility-other-heading = Leqa tale ni rawarawa
editor-none-found = Sega ni dua e kune


## Submitted responses

editor-no-responses = Se bera ni dua na isau e vakau
editor-response-answer-id = Id ni isau
editor-response-response = Isau
editor-response-credit = Ivotavota
editor-response-submitted = Sa vakau


## The context-help panel

help-placeholder = Biuta na kasolo ena yaca ni tag, ena atirabiuti, se ena { $ref } me baleta na ivola ni veivuke.

help-unsupported-ref-chain = Se bera ni tokoni na veivuke me baleta na ivakadewa levu na tikina me vaka na { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] E sega ni kune e dua na ka e dusia na ivakadewa: { $ref }.
        [multiple] E levu na ka e kune e dusia na ivakadewa: { $ref }.
       *[indeterminate] E sega ni rawa ni vakadeitaki na ka e dusia na { $ref }.
    }

help-learn-about-references = Vulica na veika me baleta na ivakadewa →
help-reference-page = Tabana ni ivakadewa →

help-suggestions-header =
    { $location ->
        [inside] E loma ni { $element }
       *[top] Ena vanua cecere duadua
    }{ $allowed ->
        [none] { " — e sega ni dua na ka e biu eke." }
        [text] { " — vola e dua na itukutuku eke." }
        [text-and-components] { " — vola e dua na itukutuku eke, se tovolea:" }
       *[components] { " — na ka me tovoleti:" }
    }

help-suggestions-footer = Butuka na { $shortcut } mo raica kece na { $total } na iwasewase.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Na { $ref } e ivakadewa ki na { $target }.
       *[other] Na { $ref } e ivakadewa ki na { $target } (laini { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] E kau mai vei { $owner } me { $role }.
       *[other] E kau mai vei { $owner } ena laini { $line } me { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Na { $ref } e ivakadewa ki na itovo { $property } ni { $element }.
       *[other] Na { $ref } e ivakadewa ki na itovo { $property } ni { $element } (laini { $line }).
    }

help-kind-attribute = atirabiuti
help-kind-snippet = tikitiki ni kodi
help-kind-array-entry = icurucuru ni array

help-default = Ka e dau vakayagataki:
help-active-default = Ka e dau vakayagataki tiko:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ivalu e vakadonui (e dua ena ka yadua):
       *[other] Ivalu e vakadonui:
    }

help-suggested-values = Ivalu e vakatututaki:

help-inserts = E biu curu:

# No select: «kodineti» is the same word for one and for many.
help-coordinates = Kodineti:

help-type = Mataqali:

help-resolved-style = Isitaili sa vakadeitaki (styleNumber { $styleNumber }):

help-resolved-function-names = Yaca ni fanisini sa vakadeitaki:
help-reset-list = Ilisi ni veivakasukai ena icurucuru oqo:
help-added-on-input = E kuria ena icurucuru oqo:
help-removed-on-input = E kau tani ena icurucuru oqo:

help-reset-overrides = Na { $reset } e sosomitaka na { $additional } kei na { $removed }.
