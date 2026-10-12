# Alpha Slice 165-B1 — specific-Clan identity and governed-draft foundation

This slice adds the internal identity and choice-state contract required before specific Homeworld Clan awards can be executed.

Each of the eight Homeworld Clan IDs remains beneath the canonical `affiliation.clan` identity and retains the Homeworld category. The persisted `clanSubAffiliationDraft` records the specific Clan, additive package identity, required choice records, selected governed destinations, status, and source provenance. Replacing an identity cannot preserve an incompatible draft.

The draft validator rejects unknown identities, category/package mismatches, duplicate or missing choices, invalid destinations, and incorrect required counts. Source `/Any` domains remain explicit governed domains or unresolved dependencies; they are never converted into literal `/Any` identities or unrestricted free text. No specific-Clan award is applied and no committed package history is fabricated.

The existing internal codec preserves this state through round trips when `allowInternalClanRecord` is used. Public import remains blocked, the `clan-foundation-unsupported` readiness blocker remains active, and player-facing Clan selection remains disabled.

Slice 165-B2 remains responsible for canonical destination catalogs and complete opposition/prerequisite resolution. Later Slice 165-B work may then connect fully resolved drafts to atomic award transactions.
