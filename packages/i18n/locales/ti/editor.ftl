# Tigrinya editor and language-server surfaces. Translated from
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
# name are identifiers, not prose, and stay as written. They are Latin letters
# in the middle of Ge'ez, which is what a Tigrinya developer reads on screen
# anyway; the script is left to right, so no direction mark is needed to keep
# them in place.
#
# Tigrinya marks the plural on the noun, so the counted messages keep their
# selects.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] እንደገና ኣቐምጥ
       *[update] ኣሐድስ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] ኣርኣዪ { $word }
       *[other] ኣርኣዪ { $word } { $shortcut }
    }


## The variant picker

editor-variant = ዓይነት
editor-variant-filter = ኣጻሪ...
editor-variant-next = ዝቕጽል ዓይነት ምረጽ
editor-variant-previous = ዝሓለፈ ዓይነት ምረጽ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] ጥሕሰት ተበጻሕነት WCAG AA ተረኺቡ። ጸብጻብ ተበጻሕነት ንም{ $action ->
            [close] ዕጻው
           *[open] ኽፋት
        } ጠውቕ።
        [advisories] ጸብጻብ ተበጻሕነት ንም{ $action ->
            [close] ዕጻው
           *[open] ኽፋት
        } ጠውቕ። ጥሕሰት WCAG AA ኣይተረኽበን፡ ግን ተወሳኺ ምኽሪ ተበጻሕነት ኣሎ።
       *[clean] ጸብጻብ ተበጻሕነት ንም{ $action ->
            [close] ዕጻው
           *[open] ኽፋት
        } ጠውቕ። ዝኾነ ጸገም ተበጻሕነት ኣይተረኽበን።
    }

editor-accessibility-label =
    { $status ->
        [violations] ጥሕሰት ተበጻሕነት WCAG AA ተረኺቡ። { $count ->
            [one] { $count } ጥሕሰት WCAG AA ተረኺቡ
           *[other] { $count } ጥሕሰታት WCAG AA ተረኺበን
        }። ጸብጻብ ተበጻሕነት ንም{ $action ->
            [close] ዕጻው
           *[open] ኽፋት
        } ጠውቕ።
        [advisories] ጥሕሰት WCAG AA ኣይተረኽበን። { $count ->
            [one] { $count } ተወሳኺ ምኽሪ ተበጻሕነት ተረኺቡ
           *[other] { $count } ተወሰኽቲ ምኽርታት ተበጻሕነት ተረኺበን
        }። ጸብጻብ ተበጻሕነት ንም{ $action ->
            [close] ዕጻው
           *[open] ኽፋት
        } ጠውቕ።
       *[clean] ጥሕሰት WCAG AA ኣይተረኽበን። ጸብጻብ ተበጻሕነት ንም{ $action ->
            [close] ዕጻው
           *[open] ኽፋት
        } ጠውቕ።
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML ስሪት { $version }

editor-tab-help = ምስ ኩነታት ዝሰማማዕ ሓገዝ
editor-tab-help-short = ኩነታት
editor-tab-errors = ጌጋታት
editor-tab-warnings = መጠንቀቕታታት
editor-tab-info = ሓበሬታ
editor-tab-accessibility = ተበጻሕነት
editor-tab-responses = ዝተላእኩ መልስታት

editor-tab-with-count = { $label }፡ { $count }

editor-options = ምርጫታት ኣርታዒ
editor-format-as-doenetml = ከም DoenetML ኣሰናዲ
editor-format-as-xml = ከም XML ኣሰናዲ


## The diagnostics panel

editor-diagnostic-line = መስመር #{ $line }

editor-no-errors = ጌጋታት የልቦን
editor-no-warnings = መጠንቀቕታታት የልቦን
editor-no-info = ናይ ሓበሬታ ምርመራ የልቦን

editor-show-info-annotations = ናይ ሓበሬታ ምርመራታት ኣብ ኣርታዒ ኣርኢ
editor-show-accessibility-annotations = ናይ ተበጻሕነት ምርመራታት ኣብ ኣርታዒ ኣርኢ

editor-accessibility-learn-more = Doenet ንተበጻሕነት ብኸመይ ከም ዝሕዞ ተማሃር

editor-accessibility-violations-heading = ጥሕሰታት ተበጻሕነት ({ $standard })

editor-accessibility-other-heading = ካልኦት ጸገማት ተበጻሕነት
editor-none-found = ዝኾነ ኣይተረኽበን


## Submitted responses

editor-no-responses = ክሳብ ሕጂ ዝተላእከ መልሲ የልቦን
editor-response-answer-id = መለለዪ መልሲ
editor-response-response = መልሲ
editor-response-credit = ነጥቢ
editor-response-submitted = ተላኢኹ


## The context-help panel

help-placeholder = ሰነዳት ንምርካብ መርኣዪ ኣብ ልዕሊ ስም ታግ፡ ባህሪ ወይ { $ref } ኣቐምጥ።

help-unsupported-ref-chain = ከም { $example } ንዝኣመሰሉ ብዙሕ ክፋል ዘለዎም መወከሲታት ዘሎ ሓገዝ ገና ኣይተደገፈን።

help-unresolved-ref =
    { $reason ->
        [notFound] ንመወከሲ { $ref } ዝኾነ ኣይተረኽበን።
        [multiple] ንመወከሲ { $ref } ብዙሓት ተረኺበን።
       *[indeterminate] { $ref } እንታይ ከም ዘመልክት ክፍለጥ ኣይከኣለን።
    }

help-learn-about-references = ብዛዕባ መወከሲታት ተማሃር →
help-reference-page = ገጽ መወከሲ →

help-suggestions-header =
    { $location ->
        [inside] ኣብ ውሽጢ { $element }
       *[top] ኣብ ላዕለዋይ ደረጃ
    }{ $allowed ->
        [none] { " — ኣብዚ ዝኣቱ የልቦን።" }
        [text] { " — ኣብዚ ጽሑፍ ጽሓፍ።" }
        [text-and-components] { " — ኣብዚ ጽሑፍ ጽሓፍ፡ ወይ እዚኣቶም ፈትን፡" }
       *[components] { " — ክትፍትኖም እትኽእል፡" }
    }

help-suggestions-footer = ኩሎም { $total } ኣቕሑ ንምርኣይ { $shortcut } ጠውቕ።

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } መወከሲ ናይ { $target } እዩ።
       *[other] { $ref } መወከሲ ናይ { $target } እዩ (መስመር { $line })።
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ከም { $role } ሰይምዎ።
       *[other] { $owner } ኣብ መስመር { $line } ከም { $role } ሰይምዎ።
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } መወከሲ ናይ ባህሪ { $property } ናይ { $element } እዩ።
       *[other] { $ref } መወከሲ ናይ ባህሪ { $property } ናይ { $element } እዩ (መስመር { $line })።
    }

help-kind-attribute = ባህሪ
help-kind-snippet = ቁራጽ ጽሑፍ
help-kind-array-entry = ኣታዊ ሰንጠረዥ

help-default = ቀዳምነት ዘለዎ፡
help-active-default = ኣብ ስራሕ ዘሎ ቀዳምነት፡

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] ዝፍቀዱ ክብርታት (ሓደ ንነፍሲ ወከፍ ኣቕሓ)፡
       *[other] ዝፍቀዱ ክብርታት፡
    }

help-suggested-values = ዝምከሩ ክብርታት፡

help-inserts = የእቱ፡

help-coordinates =
    { $count ->
        [one] መወከሲ ነጥቢ፡
       *[other] መወከሲ ነጥብታት፡
    }

help-type = ዓይነት፡

help-resolved-style = እተፈልጠ ቅዲ (styleNumber { $styleNumber })፡

help-resolved-function-names = እተፈልጡ ስማት ተግባር፡
help-reset-list = ኣብዚ ኣታዊ ዝምለስ ዝርዝር፡
help-added-on-input = ኣብዚ ኣታዊ እተወሰኸ፡
help-removed-on-input = ኣብዚ ኣታዊ እተወግደ፡

help-reset-overrides = { $reset } ን{ $additional } ከምኡ'ውን ን{ $removed } ይስዕር።
