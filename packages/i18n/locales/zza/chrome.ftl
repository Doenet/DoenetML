# Zazaki (Zazakî / Kirmanckî) viewer chrome: the buttons, panel headings and
# status words the reader interacts with. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which Zazaki.** `zza` is the ISO 639-3 macrolanguage over Northern Zazaki
# (Kirmanckî, `kiu`) and Southern Zazaki (Dimlî, `diq`). This catalog is
# written in the **Vate written standard**, the norm the Vate Working Group's
# dictionary and journal established and the one nearly all published Zazaki
# in Turkey follows; where the two varieties differ it leans on the Northern
# (Kirmanckî) forms, which is what that standard mostly does. A Southern
# (Dimlî) reader will find the forms unfamiliar in places — «vano» against
# «vono», «kerdış» against «kerdiş» — and that is a known cost of naming the
# directory for the macrolanguage rather than for one member.
#
# **Orthography.** The Zazaki Latin alphabet: the Hawar letters `ç ê î ş û`
# plus **`ı`, the dotless i**, which Zazaki has and Kurmanji does not
# («zıwan», «kerdış», «sıtûn»). That letter is the single easiest thing to get
# wrong here, and a corrector should not quietly replace it with `i`. Nothing
# in these four files is written in the Arabic script, and no Turkish spelling
# convention is mixed in beyond the loanwords that are Turkish anyway.
#
# **Plurals.** `Intl.PluralRules` has no data for `zza`; it resolves to the
# runtime default, so a `[few]` or `[many]` branch written here could never be
# selected by Zazaki's own rules. Zazaki also leaves a noun unmarked after a
# numeral — «des ceribnayış», not a plural — so a count branch would say the
# same thing twice. Every message English counts on is therefore written with
# a single `*[other]`, except where English matches an explicit `[0]`: Fluent
# compares a numeric literal against the number itself before it consults any
# plural rules, so that branch is reachable in any locale and is kept.
#
# **Register.** A control is named by a verbal noun — «Rêze zêdekerdış», never
# an imperative — and a short parenthetical addressed to the reader takes the
# imperative singular, which is what the Zazaki of these two sentences would
# actually be. `Verên` / `Peyên` is the previous/next pair this seed settled
# on; it is the first thing to check if the slider reads oddly.
#
# **Loans this file keeps**, rather than inventing a Zazaki word for:
# `klavye`, `matrîs`, `kontrol`, `puan`, `îstatîstîk`, `etîket`, `orbîtal` and
# `WCAG` — Turkish or international words a Zazaki speaker schooled in Turkey
# uses. `verdîyayîş` for *preview* is modeled on the Kurmanji IT term
# «pêşdîtin» rather than taken from attested Zazaki, and is flagged here for
# that reason.


## Answer submission

answer-checking = Kontrol kerdış...
answer-submitting = Rusnayış...
answer-checking-status = Cewabi kontrol kerdış
answer-submitting-status = Cewabi rusnayış
answer-correct = Raşt
answer-incorrect = Xelet
answer-response-saved = Cewab qeyd bi
answer-percent-credit = { $percent }% puan
answer-percent-correct = { $percent }% raşt
answer-percent-short = { $percent } %
max-credit-available = Tewr zaf puan: { $percent }%
attempts-remaining =
    { $count ->
        [0] ceribnayış nêmendo
       *[other] { $count } ceribnayış mendo
    }
validation-correct = (Raşt)
validation-incorrect = (Xelet)
validation-partially-correct = (Qısmen raşt)
# «rê» is a free postposition and stands after the placeable unchanged,
# whatever the answer's authored name turns out to be.
answer-show-responses = { $answerId } rê { $count } cewab mocnayış


## Disclosure panels

feedback-heading = Şırove
collapsible-click-to-open = (akerdış rê tıkne)
collapsible-click-to-close = (qefilnayış rê tıkne)
collapsible-initializing = Dest pêkerdış...
footnote-show = Notê cêrî mocnayış
footnote-hide = Notê cêrî nimitış
description-more-information = melumatê zêdeyî


## Controls

slider-previous = Verên
slider-next = Peyên
keyboard-open = Klavye akerdış
keyboard-close = Klavye qefilnayış
choice-input-remove-choice = { $choice } wedardış
matrix-remove-row = Rêze wedardış
matrix-add-row = Rêze zêdekerdış
matrix-remove-column = Sıtûn wedardış
matrix-add-column = Sıtûn zêdekerdış
subset-add-remove-points = Noqte zêdekerdış/wedardış
subset-toggle-points-intervals = Noqte û navberan miyan de vurnayış
subset-move-points = Noqteyan cabecakerdış
subset-clear = Paqkerdış
orbital-add-row = Rêze zêdekerdış
orbital-remove-row = Rêze wedardış
orbital-add-box = Qutî zêdekerdış
orbital-remove-box = Qutî wedardış
orbital-add-up-arrow = Tîrê corî zêdekerdış
orbital-add-down-arrow = Tîrê cêrî zêdekerdış
orbital-remove-arrow = Tîr wedardış
orbital-row-label = Rêze { $row } rê etîket
pretzel-answer = Cewab
# «sıtûn» names what `$column` is, so that the phrase does not have to attach
# anything to the placeable itself.


## Math input

math-input-preview-region = îfadeya matematîkî rê verdîyayîş
math-input-preview = Verdîyayîş
math-input-invalid-expression = Îfadeya xelete:


## Document status

viewer-initializing = Dest pêkerdış...


## Errors

error-heading = Xeta
error-found-at =
    { $span ->
        [line] Rêze { $startLine } de dîya.
       *[lines] Rêzeyan { $startLine }–{ $endLine } de dîya.
    }
document-contains-errors = Na dokumand de xetayî estê!
diagnostic-heading-error = Xeta
diagnostic-heading-warning = Îqaz
diagnostic-heading-information = Melumat
diagnostic-heading-hint = Rêberî
# `WCAG AA` is the standard's own name and is not translated.
accessibility-heading-level-1 = Îhlalê resayîşî: WCAG AA
accessibility-heading-level-2 = Îqazê resayîşî
something-went-wrong = Çîyê xelet bi.
renderer-load-failed = yew renderer bar nêbi. Kerem ke pele newe ra bar ke.
core-start-failed = Na dokumand dest pê nêkerde. Kerem ke pele newe ra bar ke.
core-start-failed-busy = Na dokumand dest pê nêkerde. Zaf dokumandî eynı wext de dest pê kerdê, no zî cîhazêko yavaş ser o zêdeyêr wext gêno. Dokumandê bînî qediyayî ra pey, pele newe ra barkerdış eşkeno bıvêro.
core-start-failed-retry = Na dokumand dest pê nêkerde.
core-start-failed-busy-retry = Na dokumand dest pê nêkerde. Zaf dokumandî eynı wext de dest pê kerdê, no zî cîhazêko yavaş ser o zêdeyêr wext gêno.
core-start-retry = Reyna bıcerebne
saved-state-unavailable = Xebata to ya qeydbiyaye bar nêbiye.
