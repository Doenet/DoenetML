---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: make the virtual keyboard usable on phones and tablets.

On a touch device the Doenet keyboard and the device's own on-screen keyboard
were competing for the same screen. Tapping a math input raised the system
keyboard, which on iOS covered the Doenet keyboard tray outright; on Android,
dismissing it was futile, because pressing a Doenet key blurred the input and
the refocus that followed summoned the system keyboard again.

A math input on a touch device now sets `inputmode="none"` from the outset —
not merely once the tray is open, which would be too late to stop the system
keyboard appearing at the first input the reader taps — so the device leaves
its own keyboard down. Focus, the caret, selection, and any physical keyboard
still work as before. The tray also declines focus when it is pressed, so the
input no longer blurs and is no longer refocused on every key. Closing the
tray hands the device's keyboard back; the choice is remembered, so the tray
stays shut, and the system keyboard keeps coming up, as the reader moves
between math inputs until they ask for the Doenet keyboard again.

The tray now follows focus on touch devices: it opens when a math input takes
focus and gets out of the way when focus moves to something else, such as a
text input, whose editing wants the device's own keyboard. Several viewers can
share a page; the tray stays open while any of them has a math input focused.
On a desktop the tray remains under manual control, exactly as before.

Which input the keyboard types into is now recorded explicitly rather than
inferred from a 100 ms window between a blur and a tray press. Besides being
deterministic, that decouples typing from `document.activeElement`, which is
the prerequisite for operating the keyboard from the keyboard (#747).

Note for embedders who pin `doenetmlVersion` (or serve a `standaloneUrl` for
an older release) inside `@doenet/doenetml-iframe`: the tray no longer blurs
the input it types into, and viewers from before this release typed only in
response to that blur. Such a pairing leaves the virtual keyboard unable to
type — physical keyboards are unaffected. Pinning the viewer and the wrapper
to the same release avoids this.

Closes #1692.
