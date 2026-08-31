---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for fifteen more languages of South Asia and
its diaspora: Awadhi (`awa`), Chhattisgarhi (`hne`), Magahi (`mag`), Marwari
(`mwr`), Garhwali (`gbm`), Kumaoni (`kfy`), Newar (`new`), Sylheti (`syl`),
Tulu (`tcy`), Mizo (`lus`), Khasi (`kha`), Garo (`grt`), Saraiki (`skr`),
Brahui (`brh`) and Fiji Hindi (`hif`). A document declaring one of them now
renders its style descriptions, section headings, boolean words, answer
buttons, editor chrome and diagnostics in that language instead of falling
back to English.

Five scripts: Devanagari for the six Hindi-belt and Uttarakhand catalogs and
for Newar, the Bengali script for Sylheti, Kannada for Tulu, Latin for Mizo,
Khasi, Garo and Fiji Hindi, and Perso-Arabic for Saraiki and Brahui. **Saraiki
and Brahui lay out right to left**, which takes the roster's right-to-left
catalogs from sixteen to eighteen; the other thirteen lay out left to right.

Thirteen of the fifteen put a shape's adjectives in front of its noun, as
English does. Khasi and Mizo put them behind it, so a Khasi document reads
«lain bakhraw badash basaw» where a Garo one — the same state, the other
order — reads «dal·gipa dashgipa gitchak lain». Saraiki is the one catalog of
the fifteen that agrees its adjectives with the noun's gender; the other
fourteen write one invariant form, which is a fact about the language in eight
of them and a stated gap in the seed in six.

The chemistry element tables are left out of all fifteen, so a document in one
of these languages still shows the element names in English. Thirteen are the
school-system case — chemistry is taught in Hindi, Nepali, Bengali, Urdu or
English wherever these languages are spoken — and Marwari has no settled list
of all 118 in any case. Tulu is the one whose neighbour cannot help either:
a Tulu pupil meets the table in Kannada, and `locales/kn` omits it too. Each
catalog's header says which case it is in.

`<document lang>` autocompletes all fifteen. Chhattisgarhi, Garhwali, Kumaoni,
Sylheti, Garo and Saraiki are offered from hand-written entries, since CLDR
has no name for those tags in any language.

These are machine-generated seeds pending review by speakers (#1521), and each
file's header says so and names where it is weakest. In the nine Indo-Aryan
catalogs, and in Newar beside them, the technical vocabulary is largely
borrowed — Hindi in the six Hindi-belt and Uttarakhand catalogs, Nepali in
Newar, Bengali in Sylheti, Urdu in Saraiki — and
what is the language's own is the grammar around it and, more often than not,
the colour words. Every header declares that rather than leaving it to be
discovered.

Numbers written into a message render in Latin digits in every one of the
fifteen, so a digit inside a sentence matches the count formatted beside it.
