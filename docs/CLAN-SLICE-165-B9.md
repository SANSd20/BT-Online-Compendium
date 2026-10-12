# Alpha Slice 165-B9

## Signed specific-Clan Trait legality and persistence

Slice 165-C1 showed that the complete Blood Spirit and Ice Hellion internal pathways reached Watch Operative but failed internal decode validation. The failures were caused by applying the generic Point Buy Trait range to published Clan award state, and by rounding a negative accumulated Trait value away from zero during Optimization.

Published source awards are now preserved as authoritative signed Trait ledger values. Generic modeled Trait ranges remain enforced for ordinary/manual records. Negative Optimization now returns only excess XP toward zero, preserving the attained signed Trait level; for example, `-150 XP` remains `-1 TP` and optimizes to `-100 XP`, not `-200 XP`.

The repair preserves canonical Clan package history, award provenance, atomic transaction behavior, malformed-record rejection, internal Clan decode boundaries, and the `clan-foundation-unsupported` readiness blocker. Clan player-facing creation and public Clan import remain disabled.

Exact-zero Final Improvements remain a subsequent Slice 165-C1 validation task.
