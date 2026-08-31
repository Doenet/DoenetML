---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for two Bantu languages of Uganda: Chiga
(`cgg`, Rukiga) and Soga (`xog`, Olusoga). A document declaring either now
renders its style descriptions, section headings, boolean words, answer
buttons, editor chrome and diagnostics in that language instead of falling
back to English, and `<document lang>` autocompletes both from CLDR's own
names.

Both sit at 440/575 keys rather than the 445 recent batches reach. The two
chemistry element tables are left out for the school-system reason — Uganda
teaches science in English from upper primary, so the fallback is the language
the periodic table is actually taught in — and five further keys are left out
deliberately: the three remaining chemistry prose messages, so the chemistry
group falls back entire rather than appearing half in Rukiga and half in
English inside one sentence, and `noun.slope-field` and `noun.vector-field`,
where neither language has a term and a phrase would have been the seed's
invention rather than a word.

Both are written in Latin script, left to right, with the initial vowel — the
augment — written as part of the word, so a line is «omurongo» and
«olunyiriri» rather than «murongo» and «lunyiriri». Both put a describing word
after its noun and agree it with the noun's class rather than with a gender,
so `$gender` carries a class token: five classes in Soga and five in Chiga.
Neither keeps English's order of the three style adjectives, because both
render the dash pattern as an associative phrase — «na tucweka», «n'obutundu»
— which cannot sit between two adjectives, so both read width, colour, then
pattern.

CLDR has plural rules for both, and the class prefix does the marking rather
than a suffix, so «ekirikuruga» and «ebirikuruga» differ at the front of the
word rather than the end. Not every noun does: a class 9/10 noun is spelt the
same in both numbers and the number shows on what agrees with it instead, and
where the counted noun is one that does not inflect at all — a Lusoga class-15
verbal noun — the two branches are the same string. Each header says which of
the three its counted selects are doing rather than coining a countable noun
to hide it.

This batch was assembled as **fifteen** languages of Kenya, Uganda and
Tanzania and thirteen were left out rather than shipped: Kamba, Gusii,
Kalenjin, Luyia, Masai, Meru, Samburu, Taita, Embu, Teso, Shambala, Vunjo and
Machame. Attempted honestly they came to between 0 and 91 keys of 575 — against
the 440 the two that ship reach — and they are recorded on #1655 with the
coverage each reached and the orthography each attempt settled. `lint:i18n`
does not report them at all, because no catalog for them exists to be partial;
a document declaring one of the thirteen renders in English exactly as it did
before.

These two are machine-generated seeds pending review by speakers (#1521), and
each file's header says so and names where it is weakest. Both name the loan
language they keep openly — English, not Swahili — and both name a near
relative already on this roster as the first thing a reviewer should hunt for:
Luganda intrusion in Soga, which is catchable because Lusoga writes `dh` where
Luganda writes `z` or `j`, and Ankole rather than Kigezi vocabulary in Chiga,
which is not catchable by a rule and so is stated as a question instead.

Numbers written into a message render in Latin digits in both, so a digit
inside a sentence matches the count formatted beside it.
