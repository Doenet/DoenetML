---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Viewer: make the virtual keyboard usable on phones and tablets.

On a touch device the Doenet keyboard and the device's own on-screen keyboard
were competing for the same screen. Tapping a math input raised the system
keyboard, which on iOS covered the Doenet keyboard tray outright; on Android,
dismissing it was futile, because pressing a Doenet key blurred the input and
the refocus that followed summoned the system keyboard again.

A math input on a touch device now sets `inputmode="none"` while the Doenet
tray is open, so the device leaves its own keyboard down — focus, the caret,
selection, and any physical keyboard still work as before. The tray also
declines focus when it is pressed, so the input no longer blurs and is no
longer refocused on every key. Closing the tray hands the device's keyboard
back; the choice is remembered, so the tray stays shut as the reader moves
between math inputs until they ask for it again.

The tray now follows focus on touch devices: it opens when a math input takes
focus and gets out of the way when focus moves to something else, such as a
text input, whose editing wants the device's own keyboard. On a desktop the
tray remains under manual control, exactly as before.

Which input the keyboard types into is now recorded explicitly rather than
inferred from a 100 ms window between a blur and a tray press. Besides being
deterministic, that decouples typing from `document.activeElement`, which is
the prerequisite for operating the keyboard from the keyboard (#747).

Closes #1692.
