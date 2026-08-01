# Amharic editor and language-server surfaces. Translated from
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
        [reset] ዳግም አስጀምር
       *[update] አዘምን
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] መመልከቻውን { $word }
       *[other] መመልከቻውን { $word } { $shortcut }
    }


## The variant picker

editor-variant = ተለዋጭ
editor-variant-filter = አጣራ...
editor-variant-next = ቀጣዩን ተለዋጭ ምረጥ
editor-variant-previous = ቀዳሚውን ተለዋጭ ምረጥ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] የWCAG AA ተደራሽነት ጥሰት ተገኝቷል። የተደራሽነት ሪፖርቱን ለ{ $action ->
            [close] መዝጋት
           *[open] መክፈት
        } ጠቅ ያድርጉ።
        [advisories] የተደራሽነት ሪፖርቱን ለ{ $action ->
            [close] መዝጋት
           *[open] መክፈት
        } ጠቅ ያድርጉ። የWCAG AA ጥሰት አልተገኘም፣ ነገር ግን ተጨማሪ የተደራሽነት ምክሮች አሉ።
       *[clean] የተደራሽነት ሪፖርቱን ለ{ $action ->
            [close] መዝጋት
           *[open] መክፈት
        } ጠቅ ያድርጉ። የተደራሽነት ችግር አልተገኘም።
    }

editor-accessibility-label =
    { $status ->
        [violations] የWCAG AA ተደራሽነት ጥሰት ተገኝቷል። { $count } የWCAG AA ጥሰቶች ተገኝተዋል። የተደራሽነት ሪፖርቱን ለ{ $action ->
            [close] መዝጋት
           *[open] መክፈት
        } ጠቅ ያድርጉ።
        [advisories] የWCAG AA ጥሰት አልተገኘም። { $count } ተጨማሪ የተደራሽነት ምክሮች ተገኝተዋል። የተደራሽነት ሪፖርቱን ለ{ $action ->
            [close] መዝጋት
           *[open] መክፈት
        } ጠቅ ያድርጉ።
       *[clean] የWCAG AA ጥሰት አልተገኘም። የተደራሽነት ሪፖርቱን ለ{ $action ->
            [close] መዝጋት
           *[open] መክፈት
        } ጠቅ ያድርጉ።
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = የDoenetML ስሪት { $version }

editor-tab-help = አውዳዊ እገዛ
editor-tab-help-short = አውድ
editor-tab-errors = ስህተቶች
editor-tab-warnings = ማስጠንቀቂያዎች
editor-tab-info = መረጃ
editor-tab-accessibility = ተደራሽነት
editor-tab-responses = የተላኩ መልሶች

editor-tab-with-count = { $label }፦ { $count }

editor-options = የአርታዒ አማራጮች
editor-format-as-doenetml = እንደ DoenetML ቅረጽ
editor-format-as-xml = እንደ XML ቅረጽ


## The diagnostics panel

editor-diagnostic-line = መስመር #{ $line }

editor-no-errors = ስህተት የለም
editor-no-warnings = ማስጠንቀቂያ የለም
editor-no-info = የመረጃ ምርመራ የለም

editor-show-info-annotations = በአርታዒው ውስጥ የመረጃ ምርመራዎችን አሳይ
editor-show-accessibility-annotations = በአርታዒው ውስጥ የተደራሽነት ምርመራዎችን አሳይ

editor-accessibility-learn-more = Doenet ተደራሽነትን እንዴት እንደሚመለከት ይወቁ

editor-accessibility-violations-heading = የተደራሽነት ጥሰቶች ({ $standard })

editor-accessibility-other-heading = ሌሎች የተደራሽነት ችግሮች
editor-none-found = ምንም አልተገኘም


## Submitted responses

editor-no-responses = እስካሁን የተላከ መልስ የለም
editor-response-answer-id = የመልስ መለያ
editor-response-response = መልስ
editor-response-credit = ነጥብ
editor-response-submitted = ተልኳል


## The context-help panel

help-placeholder = ማብራሪያ ለማየት ጠቋሚውን በመለያ ስም፣ በባሕርይ ወይም በ{ $ref } ላይ ያድርጉ።

help-unsupported-ref-chain = እንደ { $example } ላሉ ባለብዙ ክፍል ማጣቀሻዎች እገዛ ገና አልተደገፈም።

help-unresolved-ref =
    { $reason ->
        [notFound] ለማጣቀሻው ዒላማ አልተገኘም፦ { $ref }።
        [multiple] ለማጣቀሻው በርካታ ዒላማዎች ተገኝተዋል፦ { $ref }።
       *[indeterminate] የ{ $ref } ዒላማ ሊወሰን አልቻለም።
    }

help-learn-about-references = ስለ ማጣቀሻዎች ይወቁ →
help-reference-page = የማጣቀሻ ገጽ →

help-suggestions-header =
    { $location ->
        [inside] በ{ $element } ውስጥ
       *[top] በላይኛው ደረጃ
    }{ $allowed ->
        [none] { " — እዚህ ምንም ሊገባ አይችልም።" }
        [text] { " — እዚህ ጽሑፍ መጻፍ ይችላሉ።" }
        [text-and-components] { " — እዚህ ጽሑፍ ይጻፉ፣ ወይም እነዚህን ይሞክሩ፦" }
       *[components] { " — የሚሞከሩ ነገሮች፦" }
    }

help-suggestions-footer = ሁሉንም { $total } አካላት ለማየት { $shortcut } ይጫኑ።

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } የ{ $target } ማጣቀሻ ነው።
       *[other] { $ref } የ{ $target } ማጣቀሻ ነው (መስመር { $line })።
    }

help-ref-derived-from =
    { $line ->
        [none] በ{ $owner } እንደ { $role } ተጨምሯል።
       *[other] በ{ $owner } በመስመር { $line } ላይ እንደ { $role } ተጨምሯል።
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } የ{ $element } የ{ $property } ባሕርይ ማጣቀሻ ነው።
       *[other] { $ref } የ{ $element } የ{ $property } ባሕርይ ማጣቀሻ ነው (መስመር { $line })።
    }

help-kind-attribute = ባሕርይ
help-kind-snippet = የኮድ ቁራጭ
help-kind-array-entry = የድርድር ግቤት

help-default = ነባሪ፦
help-active-default = በሥራ ላይ ያለ ነባሪ፦

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] የተፈቀዱ እሴቶች (ለእያንዳንዱ አንድ)፦
       *[other] የተፈቀዱ እሴቶች፦
    }

help-suggested-values = የተጠቆሙ እሴቶች፦

help-inserts = ያስገባል፦

help-coordinates =
    { $count ->
        [one] መጋጠሚያ፦
       *[other] መጋጠሚያዎች፦
    }

help-type = ዓይነት፦

help-resolved-style = የተወሰነ ቅጥ (styleNumber { $styleNumber })፦

help-resolved-function-names = የተወሰኑ የተግባር ስሞች፦
help-reset-list = የዚህ ግቤት ዳግም ማስጀመሪያ ዝርዝር፦
help-added-on-input = በዚህ ግቤት ላይ የተጨመረ፦
help-removed-on-input = በዚህ ግቤት ላይ የተወገደ፦

help-reset-overrides = { $reset } ከ{ $additional } እና ከ{ $removed } ይቀድማል።
