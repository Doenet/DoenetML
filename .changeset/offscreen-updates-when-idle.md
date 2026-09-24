---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Keep typing and dragging responsive on long documents by updating content that is out of view only when there is time to spare.

After a keystroke, or after you move a point, a slider or anything else you drag, what is on screen, and just beyond its edges, updates right away. Content further up or down the page that depends on the change updates moments later, a little at a time, as fast as the page can draw it, and gives way to the next keystroke or click. Math you can see is redrawn first; math elsewhere on the page is redrawn while the page is otherwise idle, nearest first, and gives way as soon as you type or click again. Scrolling to content brings it up to date first.

On a document with 600 maths computed from one input, the math beside the input now shows each keystroke in about a third of a second; before, it could take several seconds, and a second keystroke typed soon after took far longer.

Answer checking and saved work are unaffected: they always use the current values, whatever is on screen.
