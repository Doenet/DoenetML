---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A new viewer setting, `mathKeyStrip`, shows a row of math keys on top of a phone's or tablet's own keyboard while a math input has focus: union, infinity, nth root, fraction, power, pi, intersection, ≤, ≥, <, >, ≠, absolute value and ±, with a right-arrow key pinned at the end that steps out of an exponent, root or fraction as the arrow key does. The device's keyboard stays up for letters and digits, and the row scrolls sideways. It is off unless a host turns it on, and it appears only while the device's keyboard is in play: with `addVirtualKeyboard` off, or once the reader closes the Doenet keyboard.

A page that embeds activities in iframes draws the row itself with the new `math-key-strip.js` script in `@doenet/standalone` (`DoenetMathKeyStrip.attach(iframe)`), and renders each activity with `mathKeyStrip`, `externalVirtualKeyboardProvided` and `addVirtualKeyboard` off. `@doenet/standalone` now reads `data-doenet-external-virtual-keyboard-provided` and `data-doenet-math-key-strip` as viewer settings rather than flags. A viewer rendered with `externalVirtualKeyboardProvided`, with the row on or off, now includes where the focused math input is (`inputRect`) in its `keyboard-focus` report, reports again when focus moves from one math input to another, and answers a `keyboard-focus-query` from its parent.

A viewer in a frame whose parent is on another origin no longer throws a `SecurityError` for each message the parent sends it.
