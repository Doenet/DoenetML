# Pangasinan (Salitan Pangasinan) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography: the modernised spelling.** Pangasinan has two spelling
# traditions still in use. The older one is Spanish-influenced and writes «c»
# and «qu» for /k/, «gu» for /g/ before a front vowel, and «o» where the
# modern one writes «u» in some closed syllables — the spelling of the
# nineteenth-century dictionaries and of most devotional printing. The
# modernised one, used by the Pangasinan-language press and in the schools,
# writes «k» throughout and has no «c», «q», «f», «v», «z» or «x» outside
# untranslated identifiers. This catalog writes the **modernised** one.
#
# A reviewer who prefers the older spelling should **respell rather than
# retranslate**: the disagreement between the two is a letter-for-letter
# mapping and none of the word choices below depend on it. What must not
# happen is one file being respelled and the other three left alone.
#
# **The technical register is a loan register, and it is a real one.**
# Pangasinan speakers are schooled in Filipino and English, and Pangasinan
# mathematics teaching carries a Spanish-derived vocabulary that predates
# both — «linya», «punto», «sirkulo», «poligono», «kolor», «hilera»,
# «kolumna», «estadistika», «ekspresyon». Those are used here as the words
# the community uses, not as English respelled. Where the seed had no such
# established loan and no Pangasinan word it could vouch for, it kept the
# English term outright — `Feedback`, `WCAG`, `keyboard`, `renderer`,
# `reload`, `load` — rather than coining one.
#
# **What is Pangasinan here** is the frame: the markers «so», «na», «ed»,
# «say»; the linker «a»/«ya»; the negator «ag»; «walay» ('there is') and
# «anggapoy» ('there is none'); «nepeg» ('must'); «nayari» ('is possible');
# «lapud» ('because'); and the verb morphology on «nengneng», «pawit»,
# «ekal», «iyarum», «romog» and «sinop». A speaker should expect to rewrite
# whole sentences rather than to correct words inside them.
#
# **The linker.** Pangasinan joins an attributive word to what it describes
# with a linker whose shape the **preceding** word decides: «a» after a
# consonant, enclitic «-n» (often written «ya») after a vowel. This catalog
# writes the free «a» everywhere, which is right after a consonant-final word
# and wrong after a vowel-final one. `content.ftl`'s header names the exact
# entries in its own tables where that misfires.

answer-checking = Nenengnengen...
answer-submitting = Ipapawit...

answer-checking-status = Nenengnengen so ebat
answer-submitting-status = Ipapawit so ebat

answer-correct = Duga
answer-incorrect = Aliwa

answer-response-saved = Nisinop so Ebat

answer-percent-credit = { $percent }% a Kredito
answer-percent-correct = { $percent }% a Duga
answer-percent-short = { $percent } %

max-credit-available = Sankarakelan a kredito: { $percent }%

attempts-remaining =
    { $count ->
        [0] anggapo lay akeran sali
       *[other] { $count } a sali so akera
    }

validation-correct = (Duga)
validation-incorrect = (Aliwa)
validation-partially-correct = (Kabiangan a duga)

answer-show-responses =
    { $count ->
       *[other] Ipanengneng so { $count } ya ebat ed { $answerId }
    }

feedback-heading = Feedback

collapsible-click-to-open = (i-click pian nalukasan)
collapsible-click-to-close = (i-click pian nakapotan)

collapsible-initializing = Manggagapo...

footnote-show = Ipanengneng so nota ed leksab
footnote-hide = Iyamot so nota ed leksab

description-more-information = arum ni ran impormasyon

slider-previous = Akauna
slider-next = Onsublay

keyboard-open = Lukasan so Keyboard
keyboard-close = Kapotan so Keyboard

choice-input-remove-choice = Ekalen so { $choice }

matrix-remove-row = Ekalen so hilera
matrix-add-row = Mangiyarum na hilera
matrix-remove-column = Ekalen so kolumna
matrix-add-column = Mangiyarum na kolumna

subset-add-remove-points = Mangiyarum/Mangekal na saray punto
subset-toggle-points-intervals = Manguman ed saray punto tan interbalo
subset-move-points = Iyalis iray punto
subset-clear = Punasen

orbital-add-row = Mangiyarum na hilera
orbital-remove-row = Ekalen so hilera
orbital-add-box = Mangiyarum na kahon
orbital-remove-box = Ekalen so kahon
orbital-add-up-arrow = Mangiyarum na pana ya patagey
orbital-add-down-arrow = Mangiyarum na pana ya paleksab
orbital-remove-arrow = Ekalen so pana

orbital-row-label = Label parad hilera { $row }

pretzel-answer = Ebat


math-input-preview-region = pakanengnengan na ekspresyon a matematika
math-input-preview = Pakanengnengan
math-input-invalid-expression = Aliwan ekspresyon:

viewer-initializing = Manggagapo...

error-heading = Lingo

error-found-at =
    { $span ->
        [line] Naromog ed linya { $startLine }.
       *[lines] Naromog ed saray linya { $startLine }–{ $endLine }.
    }

document-contains-errors = Walay lingo na sayan dokumento!

diagnostic-heading-error = Lingo
diagnostic-heading-warning = Pasakbay
diagnostic-heading-information = Impormasyon
diagnostic-heading-hint = Bilin

accessibility-heading-level-1 = Kasumlangan ed WCAG AA ya Aksesibilidad
accessibility-heading-level-2 = Pasakbay ed aksesibilidad

something-went-wrong = Walay lingo ya agawa.

renderer-load-failed = ag akaload so sakey a renderer. Ipa-reload pa so pahina.

core-start-failed = Ag ayari ya igapo so sayan dokumento. Ipa-reload pa so pahina.

core-start-failed-busy = Ag ayari ya igapo so sayan dokumento. Dakel a dokumento so ginapoan ya sanbaan, tan mas manbayag itan ed mairap a debais. No asumpal la ray arum a dokumento, nayarin ontulong so pangi-reload ed pahina.

core-start-failed-retry = Ag ayari ya igapo so sayan dokumento.

core-start-failed-busy-retry = Ag ayari ya igapo so sayan dokumento. Dakel a dokumento so ginapoan ya sanbaan, tan mas manbayag itan ed mairap a debais.

core-start-retry = Salien lamet

saved-state-unavailable = Ag ayari ya naload so nisinop mon kimey.
