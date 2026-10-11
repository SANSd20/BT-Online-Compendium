# Alpha Slice 160 — Clan Finalization and Internal Persistence

Slice 160 repairs two bounded internal Clan boundaries without enabling Clan creation or Clan readiness.

- The canonical `watch.caste` prerequisite now recognizes Warrior, Scientist, and Technician caste identities. Merchant, Laborer, missing, and invalid caste values remain ineligible.
- The representative Homeworld Clan pathway can use existing Final Improvements to spend exactly 400 XP on the audited Sibko DEX 4+ and Clan MechWarrior WIL 5+ requirements. Optimization remains source-backed and returns 1,000 XP across 44 opportunities, leaving 1,216 XP before any further legal spending.
- `decodeCharacter` supports an explicit internal Clan-record option. It preserves canonical IDs, history, chronology, provenance, prerequisites, and grants while continuing to reject malformed records. Public decoding remains unchanged and Clan readiness remains blocked.

The internal persistence option is not a readiness bypass and is not used by public player-facing import. Inner Sphere persistence and browser integration remain covered by the existing regression suite.
