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
input no longer blurs and is no longer refocused on every key. Tabbing into
the tray does not end the edit either — the keys still go to the input that
was left, and what was typed is committed once focus leaves the tray for
somewhere other than that input. Closing the tray hands the device's keyboard
back; the choice is remembered, so the tray stays shut, and the system
keyboard keeps coming up, as the reader moves between math inputs until they
ask for the Doenet keyboard again. When the
system keyboard is the one in use, it no longer capitalizes or autocorrects
what is typed into a math input.

The tray now follows focus on touch devices: it opens when a math input takes
focus and gets out of the way when focus moves to something else, such as a
text input, whose editing wants the device's own keyboard. Several viewers can
share a page; the tray stays open while any of them has a math input focused.
On a desktop the tray remains under manual control, exactly as before.

Which input the keyboard types into is now recorded explicitly rather than
inferred from a 100 ms window between a blur and a tray press. Besides being
deterministic, that decouples typing from `document.activeElement`, which is
the prerequisite for operating the keyboard from the keyboard (#747). The
record is also taken correctly for a math input focused the instant it
appears, which used to leave the virtual keyboard typing nowhere until the
reader left that input and came back to it.

Note for embedders of `@doenet/doenetml-iframe`, where the wrapper hosts the
tray and the iframe holds the viewer, and the two can come from different
releases — a `doenetmlVersion` or `standaloneUrl` naming a particular release,
a document declaring an `xmlns` version that the wrapper's version
autodetection pins to, or simply a wrapper installed before the viewer it
loads from the CDN. A viewer from this release **can** be driven by a tray
from before it: the old tray announces itself by the `accessed` message it
sends as it takes focus, and its keys are then delivered to the math input the
same press blurred a moment earlier, with the caret given back afterwards —
including when the press carried no key, such as opening the tray while
already editing an input. Only that input, and only that moment: a press made
after the reader has left a math input of their own accord types nowhere and
moves no caret, as before. Under such a tray the Doenet keyboard is the only
one on offer on a touch device: the tray does not follow focus, so the reader
opens it themselves as they always did with it, and closing it does not hand
the device's own keyboard back, because that tray has no way to report that
they asked for it. This is the pairing that arises the moment a new viewer is
published under an already-deployed wrapper, so it is the one worth keeping
working — without it, a phone reader would meet a math input that raises no
keyboard at all and a Doenet keyboard that types nothing.

The opposite pairing cannot be rescued from the viewer's side: a viewer from
before this release typed only in response to a blur that this tray no longer
causes. An embedder pinning a viewer older than this release should pin the
wrapper with it. Physical keyboards are unaffected either way.

Closes #1692.
