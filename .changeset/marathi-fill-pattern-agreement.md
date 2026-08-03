---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Give the Marathi fill description the noun its colour agrees with. `describeFill` hands the colour the gender of the fill, and the pattern words have genders of their own, so a shape filled with horizontal lines described itself as `निळे आडव्या रेषा` — a neuter adjective in front of a feminine plural noun. It now names «भरण» and hangs the pattern off वापरून: `आडव्या रेषा वापरून निळे भरण`.
