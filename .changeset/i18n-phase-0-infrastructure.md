---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add a `lang` attribute to `<document>` and `documentLocale` / `uiLocale` settings to the viewer and editor, laying the groundwork for translated activities.

`<document lang="es-MX">` declares what language the content is written in. The rendered activity now carries a matching `lang` attribute, so screen readers pronounce the content with the right voice and rules — an accessibility improvement that applies today, before any strings are translated.

Hosts can supply the same information from outside the document with the new `documentLocale` prop (`data-doenet-document-locale` on a standalone container), and can set the language of the surrounding interface separately with `uiLocale`, which defaults to following `documentLocale`. An authored `lang` always wins over the host's setting: the author knows what language they wrote in. Both settings are available through `DoenetViewer`, `DoenetEditor`, `@doenet/standalone`, and `@doenet/doenetml-iframe`.

Content itself is not translated yet. With the default locale, output is unchanged.
