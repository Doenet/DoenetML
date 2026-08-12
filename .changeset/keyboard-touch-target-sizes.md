---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Viewer: size the virtual keyboard's controls for a fingertip on touch devices.

Every control in the keyboard tray was built for a mouse pointer. On a phone or
tablet the tab that opens the tray was 48x24, the button that closes it 24x24,
the layout tabs (`123`, `f(x)`, `ABC`, `αβγ`, `$%∞`) 30x25, and the keys
themselves 39x40 — all under the 44px minimum a fingertip needs, which is the
figure in both Apple's HIG and WCAG 2.5.5. The tab that opens the tray was the
worst of them, since it is the only way in and had to be found before anything
else could be tapped.

On a device whose primary pointing device is coarse, those controls are now at
least 44px in the direction that was short: the open tab is 64x44, the close
button 44x44, and the layout tabs and keys are 44px tall. Key width is left to
the row layout, which shares the row out evenly — a phone cannot fit twelve
44px-wide keys across, and forcing it would only cause an overflow. What the
extra room buys on a tablet is wider keys: the keyboard may now spread to 48rem
rather than 42rem, so a key grows to 48px there instead of staying at 40px in
the middle of an empty row.

The tray also stops short of the height that would carry its own tab off the
top of the screen — floor as well as ceiling, so a window shorter than the
tray's usual 280px no longer pushes the tab out of reach either. It hangs the
tab exactly its own height above the tray, so a taller tab needs a taller gap;
on a phone held sideways, where the tray is tall enough to reach that limit,
the tab was being clipped.

Nothing else changes for a reader with a mouse, including on a narrow window:
the sizing is keyed on the primary pointer being coarse, which is the same test
the viewer already uses to decide whether to suppress the device's own
on-screen keyboard.

Closes #449.
