# G1h-B Stage 3/4 Duration Rules

G1h-B adds profile-driven duration eligibility while preserving legacy characters that have no chronology profile.

## Reference time

The approved default is the Jihad-era year **3076**, represented as a year-only reference. No month, day, January 1, December 31, or era-selection UI is introduced. A year-only reference cannot establish an exact deadline; the engine reports the result as ambiguous unless an explicit available duration or precise campaign date is supplied.

## Stage 3

Stage 3 requires the full normal duration. An insufficient or ambiguous duration blocks selection. No partial Stage 3 module is allowed.

## Stage 4

Stage 4 is eligible at exactly 50% of normal duration. Below 50% is blocked. At 50% or above but below 100%, the normal full XP and awards are applied, the normal duration remains in the module definition, and the history records the actual available duration and campaign-deadline reason. Further Stage 4 selection is terminated through the existing `alpha-stage-4-stop` state.

At 100% or more, normal progression remains available. Existing characters without the new optional profile preserve their prior behavior.

Fixed DOB remains unchanged. Progression-derived chronology remains compatible with G1h-A. History, XP, awards, provenance, and optional profile fields round-trip without replaying effects.

Deferred: era selection, Capellan Civilian Job substitution, Citizenship restrictions, player-facing duration controls, and Clan activation.
