# Malayalam editor and language-server surfaces. Translated from
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


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] പുനഃസജ്ജമാക്കുക
       *[update] പുതുക്കുക
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ദർശിനി { $word }
       *[other] ദർശിനി { $word } { $shortcut }
    }


## The variant picker

editor-variant = വകഭേദം
editor-variant-filter = അരിക്കുക...
editor-variant-next = അടുത്ത വകഭേദം തിരഞ്ഞെടുക്കുക
editor-variant-previous = മുൻപത്തെ വകഭേദം തിരഞ്ഞെടുക്കുക


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA പ്രാപ്യതാ ലംഘനം കണ്ടെത്തി. പ്രാപ്യതാ റിപ്പോർട്ട് { $action ->
            [close] അടയ്ക്കാൻ
           *[open] തുറക്കാൻ
        } ക്ലിക്ക് ചെയ്യുക.
        [advisories] പ്രാപ്യതാ റിപ്പോർട്ട് { $action ->
            [close] അടയ്ക്കാൻ
           *[open] തുറക്കാൻ
        } ക്ലിക്ക് ചെയ്യുക. WCAG AA ലംഘനങ്ങളൊന്നും കണ്ടെത്തിയില്ല, എന്നാൽ കൂടുതൽ പ്രാപ്യതാ ശുപാർശകൾ ലഭ്യമാണ്.
       *[clean] പ്രാപ്യതാ റിപ്പോർട്ട് { $action ->
            [close] അടയ്ക്കാൻ
           *[open] തുറക്കാൻ
        } ക്ലിക്ക് ചെയ്യുക. പ്രാപ്യതാ പ്രശ്നങ്ങളൊന്നും കണ്ടെത്തിയില്ല.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA പ്രാപ്യതാ ലംഘനം കണ്ടെത്തി. { $count ->
            [one] { $count } WCAG AA ലംഘനം
           *[other] { $count } WCAG AA ലംഘനങ്ങൾ
        } കണ്ടെത്തി. പ്രാപ്യതാ റിപ്പോർട്ട് { $action ->
            [close] അടയ്ക്കാൻ
           *[open] തുറക്കാൻ
        } ക്ലിക്ക് ചെയ്യുക.
        [advisories] WCAG AA ലംഘനങ്ങളൊന്നും കണ്ടെത്തിയില്ല. { $count ->
            [one] { $count } അധിക പ്രാപ്യതാ ശുപാർശ
           *[other] { $count } അധിക പ്രാപ്യതാ ശുപാർശകൾ
        } കണ്ടെത്തി. പ്രാപ്യതാ റിപ്പോർട്ട് { $action ->
            [close] അടയ്ക്കാൻ
           *[open] തുറക്കാൻ
        } ക്ലിക്ക് ചെയ്യുക.
       *[clean] WCAG AA ലംഘനങ്ങളൊന്നും കണ്ടെത്തിയില്ല. പ്രാപ്യതാ റിപ്പോർട്ട് { $action ->
            [close] അടയ്ക്കാൻ
           *[open] തുറക്കാൻ
        } ക്ലിക്ക് ചെയ്യുക.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML പതിപ്പ് { $version }

editor-tab-help = സന്ദർഭോചിത സഹായം
editor-tab-help-short = സന്ദർഭം
editor-tab-errors = പിശകുകൾ
editor-tab-warnings = മുന്നറിയിപ്പുകൾ
editor-tab-info = വിവരം
editor-tab-accessibility = പ്രാപ്യത
editor-tab-responses = സമർപ്പിച്ച ഉത്തരങ്ങൾ

editor-tab-with-count = { $label }: { $count }

editor-options = എഡിറ്റർ ഐച്ഛികങ്ങൾ
editor-format-as-doenetml = DoenetML ആയി ക്രമീകരിക്കുക
editor-format-as-xml = XML ആയി ക്രമീകരിക്കുക


## The diagnostics panel

editor-diagnostic-line = വരി #{ $line }

editor-no-errors = പിശകുകളില്ല
editor-no-warnings = മുന്നറിയിപ്പുകളില്ല
editor-no-info = വിവര നിർണയങ്ങളില്ല

editor-show-info-annotations = എഡിറ്ററിൽ വിവര നിർണയങ്ങൾ കാണിക്കുക
editor-show-accessibility-annotations = എഡിറ്ററിൽ പ്രാപ്യതാ നിർണയങ്ങൾ കാണിക്കുക

editor-accessibility-learn-more = പ്രാപ്യതയോടുള്ള Doenet ന്റെ സമീപനം അറിയുക

editor-accessibility-violations-heading = പ്രാപ്യതാ ലംഘനങ്ങൾ ({ $standard })

editor-accessibility-other-heading = മറ്റു പ്രാപ്യതാ പ്രശ്നങ്ങൾ
editor-none-found = ഒന്നും കണ്ടെത്തിയില്ല


## Submitted responses

editor-no-responses = ഇതുവരെ ഒരു ഉത്തരവും സമർപ്പിച്ചിട്ടില്ല
editor-response-answer-id = ഉത്തരം Id
editor-response-response = ഉത്തരം
editor-response-credit = മാർക്ക്
editor-response-submitted = സമർപ്പിച്ചു


## The context-help panel

help-placeholder = രേഖകൾ കാണാൻ ടാഗ് പേര്, ഗുണം അല്ലെങ്കിൽ { $ref } നു മുകളിൽ കഴ്സർ വയ്ക്കുക.

help-unsupported-ref-chain = { $example } പോലുള്ള ബഹുഭാഗ പരാമർശങ്ങൾക്കുള്ള സഹായം ഇനിയും ലഭ്യമല്ല.

help-unresolved-ref =
    { $reason ->
        [notFound] ഈ പരാമർശത്തിനു ഒന്നും കണ്ടെത്തിയില്ല: { $ref }.
        [multiple] ഈ പരാമർശത്തിനു ഒന്നിലധികം ലക്ഷ്യങ്ങൾ കണ്ടെത്തി: { $ref }.
       *[indeterminate] { $ref } നു ലക്ഷ്യം നിർണയിക്കാനായില്ല.
    }

help-learn-about-references = പരാമർശങ്ങളെക്കുറിച്ച് അറിയുക →
help-reference-page = അവലംബ താൾ →

help-suggestions-header =
    { $location ->
        [inside] { $element } നുള്ളിൽ
       *[top] മുകൾത്തട്ടിൽ
    }{ $allowed ->
        [none] { " — ഇവിടെ ഒന്നും വരില്ല." }
        [text] { " — ഇവിടെ എഴുത്ത് ടൈപ്പ് ചെയ്യാം." }
        [text-and-components] { " — ഇവിടെ എഴുത്ത് ടൈപ്പ് ചെയ്യാം, അല്ലെങ്കിൽ ഇവ പരീക്ഷിക്കാം:" }
       *[components] { " — ഇവ പരീക്ഷിക്കാം:" }
    }

help-suggestions-footer = എല്ലാ { $total } ഘടകങ്ങളും കാണാൻ { $shortcut } അമർത്തുക.

help-name-summary = { $name } — { $summary }

# «-ാം» is the ordinal of the line number, and it opens with a combining
# vowel sign, so it is welded to the placeable rather than left standing
# after a space — see the note on `error-found-at` in `chrome.ftl`.
help-ref-is-reference =
    { $line ->
        [none] { $ref } എന്നത് { $target } നുള്ള പരാമർശമാണ്.
       *[other] { $ref } എന്നത് { $target } നുള്ള പരാമർശമാണ് ({ $line }-ാം വരി).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ഇത് { $role } ആയി അവതരിപ്പിച്ചു.
       *[other] { $owner } ഇത് { $line }-ാം വരിയിൽ { $role } ആയി അവതരിപ്പിച്ചു.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } എന്നത് { $element } ന്റെ { $property } ഗുണത്തിനുള്ള പരാമർശമാണ്.
       *[other] { $ref } എന്നത് { $element } ന്റെ { $property } ഗുണത്തിനുള്ള പരാമർശമാണ് ({ $line }-ാം വരി).
    }

help-kind-attribute = ഗുണം
help-kind-snippet = ശകലം
help-kind-array-entry = നിര ഉൾപ്പെടുത്തൽ

help-default = സ്ഥിരസ്ഥിതി:
help-active-default = പ്രാബല്യത്തിലുള്ള സ്ഥിരസ്ഥിതി:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] അനുവദനീയ മൂല്യങ്ങൾ (ഓരോ ഇനത്തിനും ഒന്ന്):
       *[other] അനുവദനീയ മൂല്യങ്ങൾ:
    }

help-suggested-values = നിർദേശിച്ച മൂല്യങ്ങൾ:

help-inserts = ചേർക്കുന്നത്:

help-coordinates =
    { $count ->
        [one] നിർദേശാങ്കം:
       *[other] നിർദേശാങ്കങ്ങൾ:
    }

help-type = തരം:

help-resolved-style = നിർണയിച്ച ശൈലി (styleNumber { $styleNumber }):

help-resolved-function-names = നിർണയിച്ച ഫലന നാമങ്ങൾ:
help-reset-list = ഈ ഇൻപുട്ടിൽ പുനഃസജ്ജമാക്കുന്ന പട്ടിക:
help-added-on-input = ഈ ഇൻപുട്ടിൽ ചേർത്തവ:
help-removed-on-input = ഈ ഇൻപുട്ടിൽ നീക്കിയവ:

help-reset-overrides = { $reset } എന്നത് { $additional }, { $removed } എന്നിവയെ മറികടക്കുന്നു.
