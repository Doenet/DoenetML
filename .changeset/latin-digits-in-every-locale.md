---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Write every number in Latin digits, whatever the locale counts in.

CLDR gives a locale a default numbering system, and for a number of languages it is not Latin. A warning's contrast ratio, a count in a message, and `<intComma>`'s output all went through `Intl` under the document's or the reader's own tag, so under such a locale they came back written in that locale's own digits.

What localizes is now the punctuation and never the ten characters: German still groups with periods, India still groups in twos, and `4.53` is `4.53` everywhere. Two things made this the answer rather than the reverse. A number in prose sits beside numbers that are not — a contrast ratio is written `4.53:1` with the `1` a literal in the message, a line number is read off a gutter the editor draws itself, an author's `styleNumber="3"` is quoted back at them — and localizing the digits split those across two scripts rather than moving them together. And mathematics is Latin-digit regardless, so a document whose prose counted one way and whose equations counted another would be worse than either alone.

In the Arabic script the separator moves with the digits, because CLDR pairs one set with the other: Persian writes `٬` and `٫` around its own digits and `,` and `.` around these, so a Persian document now writes `1,000.50` where it wrote `۱٬۰۰۰٫۵۰`. Everywhere else the separator is untouched. A tag that asks for a numbering system itself (`zh-u-nu-hanidec`) is overridden too — one answer per product, not per tag.

No currently shipped language moves: every catalog in the repository is one CLDR already counts in Latin digits, and each of the twenty renders byte-for-byte what it did. What changes is what the next languages will do — Bangla, Assamese, Marathi, Nepali and Burmese are all otherwise ready to seed, and this is what was standing in front of them.
