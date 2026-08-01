---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Translate Chinese into both scripts: `zh-Hans` for Simplified and `zh-Hant` for Traditional.

Catalogues the pair by script rather than leaving Simplified as a plain `zh`, which is what makes a Traditional reader reach Traditional text. Locale negotiation tries the region-stripped tag before it consults likely-subtags, so a catalog named `zh` would answer `zh-TW`, `zh-HK` and `zh-MO` ahead of `zh-Hant` — a reader in Taipei would be served Simplified. Named by script, `zh-CN` and `zh-SG` reach `zh-Hans`, the Traditional regions reach `zh-Hant`, and a bare `zh` reaches `zh-Hans`, which is what it means.

`<document lang="zh">` and `documentLocale="zh"` therefore render Simplified, as the tag says. `zh-Hans` and `zh-Hant` are what `<document lang>`'s autocomplete offers, as *Simplified Chinese (简体中文)* and *Traditional Chinese (繁體中文)*.

The Traditional catalog is a full translation rather than a character conversion of the Simplified one, and follows Taiwan usage where the two diverge — 預設 over 默认, 變數 over 变量, 質數 over 素数, 元件 over 组件, 影片 over 视频. A table's rows and columns are 列 and 欄, the opposite assignment to the mainland's, so the matrix and data-frame messages are not a mistranslation of their Simplified counterparts. Several elements are named differently too, 矽 for silicon among them.

Both remain **unreviewed machine-generated seeds**, as their headers say. Neither script falls back to the other: a key missing from one renders in English rather than in the wrong script.
