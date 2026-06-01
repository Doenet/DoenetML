---
"@doenet/doenetml-iframe": patch
---

iframe `<DoenetEditor>`: stop re-initializing the editor when the parent passes new callback identities.

A React parent that supplies inline callback props (e.g. `immediateDoenetmlChangeCallback`) hands the wrapper a fresh function on every render. The iframe wrapper was rebuilding the whole editor on each such change, which — when it overlapped the editor's startup — could keep the document viewer from ever finishing loading, leaving it blank with "The document viewer could not be started." The editor now holds stable internal callbacks that always dispatch to the latest function the parent passed, so callback-identity changes update behavior without re-initializing the editor or disturbing its startup.
