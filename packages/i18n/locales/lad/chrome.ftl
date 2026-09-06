# Ladino / Judeo-Spanish (djudeoespanyol) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script.** Ladino was written for four centuries in **Hebrew script** — in
# the semi-cursive **Rashi** letters for print and in **solitreo** by hand —
# and the great body of Judeo-Spanish literature is in those letters. It is
# not what a reader meets today. From the 1920s the Turkish alphabet reform
# and the Istanbul press moved the language into the **Latin** script, and the
# orthography that settled and is now normative is **Aki Yerushalayim**, the
# spelling of the Jerusalem review of that name, taught by the Autoridad
# Nasionala del Ladino and used by Sefaradi communities online. So this
# catalog is Latin script in Aki Yerushalayim spelling, and the page **lays
# out left to right** like every other Latin-script locale here. A Rashi- or
# solitreo-script Ladino would be a different catalog with a different
# direction, and this seed does not pretend to be one.
#
# **What Aki Yerushalayim looks like**, and what this file is consistent in:
# ⟨k⟩ always for /k/ and never ⟨c⟩ or ⟨qu⟩ («ke», «kuando», «komo», «kada»);
# ⟨s⟩ for the sound Spanish writes ⟨c⟩ or ⟨z⟩ («definision», «seksion»);
# ⟨sh⟩, ⟨ch⟩, ⟨j⟩ and ⟨dj⟩ for the four palatals; ⟨y⟩ where Spanish has ⟨ll⟩
# («amariyo», «reyeno»); ⟨ny⟩ for /ɲ/ («linya», «anyo»); no silent ⟨h⟩; and
# **⟨v⟩ where Spanish has intervocalic ⟨b⟩** — «avrir», «eskrivir»,
# «palavra», «livro». That last rule governs the **inherited** layer only: the
# technical nouns this catalog takes from Spanish keep their ⟨b⟩ («atributo»,
# «aksesibilidad», «parabola», «dibuja»), which is what the printed language
# does with them too. No Ladino word in these four files carries an accent;
# the only accented letters anywhere in them are in this header and in the
# English prose of the others, which quote a French and a Spanish name.
#
# **What is Ladino here and what is borrowed.** «ke», «ay», «no se puede»,
# «deve», «topar» for *to find*, «trokar» for *to change*, «kitar» for *to
# remove*, «amostrar», «eskonder», «avrir», «serrar», «kasha» for *box*,
# «yerro» for *error*, «ma» for *but*, «i» for *and*, «agora», «ansina» — these
# are the language's own and are what should make the file recognisable as
# Ladino rather than as Spanish respelt. The technical nouns — «komponente»,
# «atributo», «dokumento», «matris», «estatistikas», «aksesibilidad» — have no
# Ladino attestation in a software register, so they are taken from the
# **Spanish** learned Romance layer and respelt into Aki Yerushalayim. That
# borrowing is not disguised: a Ladino speaker in Israel meets this vocabulary
# in **Hebrew**, and one in Turkey in **Turkish**, and neither of those could
# be spliced into a Romance sentence. `WCAG AA` and `DoenetML` are names and
# stay in English.
#
# **Counts.** CLDR has **no plural data for `lad`**, so `Intl.PluralRules`
# falls back to the root locale, where the only category is `other` and an
# `[one]` branch could never be selected. This catalog therefore writes **no**
# `[one]`, `[zero]`, `[two]`, `[few]` or `[many]` branch anywhere: where
# English selects on number, one form is written that reads for any count. The
# numeric literal `[0]` in `attempts-remaining` is a different mechanism — an
# exact-value match, not a plural category — and is kept, because "no attempts
# left" is worth saying in its own words.
#
# **Numbers** render in Latin digits everywhere, which is what Aki
# Yerushalayim Ladino uses.
#
# **Weakest first.** The button verbs, which no Ladino software has ever had
# to name: «kontrolar» for *check work*, «mandar» for *submit*, «adjustar» for
# *add*. After those, «vedre» for *green* — the older Ladino form, which some
# speakers now write «verde».


## Answer submission

answer-checking = Kontrolando…
answer-submitting = Mandando…
answer-checking-status = Kontrolando la repuesta
answer-submitting-status = Mandando la repuesta
answer-correct = Djusto
answer-incorrect = Yerrado
answer-response-saved = Repuesta guadrada
answer-percent-credit = { $percent }% de los puntos
answer-percent-correct = { $percent }% djusto
answer-percent-short = { $percent } %
max-credit-available = Puntos maksimos ke se puede tomar: { $percent }%
attempts-remaining =
    { $count ->
        [0] no keda ninguna prova
       *[other] kedan { $count } provas
    }
validation-correct = (Djusto)
validation-incorrect = (Yerrado)
validation-partially-correct = (En parte djusto)
answer-show-responses = Amostrar las { $count } repuestas a { $answerId }

## Disclosure panels

feedback-heading = Komentario
collapsible-click-to-open = (aprieta para avrir)
collapsible-click-to-close = (aprieta para serrar)
collapsible-initializing = Empesando…
footnote-show = Amostrar la nota
footnote-hide = Eskonder la nota
description-more-information = mas informasion

## Controls

slider-previous = Anterior
slider-next = Sigiente
keyboard-open = Avrir el teklado
keyboard-close = Serrar el teklado
choice-input-remove-choice = Kitar { $choice }
matrix-remove-row = Kitar una fila
matrix-add-row = Adjustar una fila
matrix-remove-column = Kitar una kolona
matrix-add-column = Adjustar una kolona
subset-add-remove-points = Adjustar/kitar puntos
subset-toggle-points-intervals = Trokar entre puntos i intervalos
subset-move-points = Mover los puntos
subset-clear = Alimpiar
orbital-add-row = Adjustar una fila
orbital-remove-row = Kitar una fila
orbital-add-box = Adjustar una kasha
orbital-remove-box = Kitar una kasha
orbital-add-up-arrow = Adjustar una flecha para arriva
orbital-add-down-arrow = Adjustar una flecha para abasho
orbital-remove-arrow = Kitar la flecha
orbital-row-label = Etiketa de la fila { $row }
pretzel-answer = Repuesta

## Math input

math-input-preview-region = vista previa de la ekspresion matematika
math-input-preview = Vista previa
math-input-invalid-expression = Ekspresion no valida:

## Document status

viewer-initializing = Empesando…

## Errors

error-heading = Yerro
error-found-at =
    { $span ->
        [line] Topado en la linya { $startLine }.
       *[lines] Topado en las linyas { $startLine }–{ $endLine }.
    }
document-contains-errors = ¡Este dokumento tiene yerros!
diagnostic-heading-error = Yerro
diagnostic-heading-warning = Advertensia
diagnostic-heading-information = Informasion
diagnostic-heading-hint = Pista
# `WCAG AA` is the name of the standard and is not translated.
accessibility-heading-level-1 = Violasion de aksesibilidad WCAG AA
accessibility-heading-level-2 = Avizo de aksesibilidad
something-went-wrong = Algo salio mal.
renderer-load-failed = un modulo de rendision no se pudo kargar. Torna a kargar la pajina.
core-start-failed = Este dokumento no se pudo empesar. Torna a kargar la pajina.
core-start-failed-busy = Este dokumento no se pudo empesar. Munchos dokumentos empesavan a la vez, i en un aparato mas lento esto puede tadrar mas. Tornar a kargar la pajina puede ayudar kuando los otros dokumentos ayan akavado.
core-start-failed-retry = Este dokumento no se pudo empesar.
core-start-failed-busy-retry = Este dokumento no se pudo empesar. Munchos dokumentos empesavan a la vez, i en un aparato mas lento esto puede tadrar mas.
core-start-retry = Prova otra vez
saved-state-unavailable = El tu lavoro guadrado no se pudo kargar.
