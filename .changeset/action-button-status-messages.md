---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Pressing the button of an `<updateValue>`, `<callAction>` or `<triggerSet>` is now announced to screen readers. Before, a screen reader user heard nothing after a press, even when the press changed something on screen.

The announcement is "Value updated", in the reader's language. An author can replace it with a `<statusMessage>` child that says what changed. The message is read after the button has done its work, so `<statusMessage>Count is now $n.</statusMessage>` names the new value. A `<statusMessage>` is never shown on screen.

Changes made without a press, such as through `triggerWhen`, are not announced yet.

The announcements are made in one visually hidden status region per document, with id `_announcements` after the viewer's `prefixForIds`.

Part of #2277.
