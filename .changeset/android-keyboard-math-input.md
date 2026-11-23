---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Typing on an Android phone's own keyboard, such as Gboard or Samsung Keyboard, now reaches a math input. Chrome on Android reports each key of an on-screen keyboard as an unidentified key and says what it typed in a separate input event, and the math input ignored every unidentified key, so letters, digits, symbols and backspace typed on the phone's keyboard did nothing. Samsung Keyboard composes letters as a word, and the math input now shows each composed letter as it is typed and follows the keyboard's backspace within it. The keyboard's Enter submits the answer as typed, and a key typed over a selection replaces it. A word inserted whole, such as a swiped word, is still ignored.
