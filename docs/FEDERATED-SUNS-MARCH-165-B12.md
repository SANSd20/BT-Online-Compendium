# Alpha 165-B12 — Federated Suns March Expansion

## Scope and authority

This bounded slice adds the player-facing Federated Suns Capellan March and
Draconis March sub-affiliations. Rules and source provenance remain anchored
to the corrected A Time of War core, p. 65, with the existing application
affiliation and award-governance model.

## Implemented packages

- **Capellan March** — 150 XP complete Stage 0 transaction; WIL +40;
  Connections +25; Compulsion/Hatred of Capellan Confederation −50;
  Protocol/FedSuns +10; Interest/FedSuns History +10; one governed language
  from Cantonese, German, Mandarin Chinese, Russian, or Spanish for +5 XP.
- **Draconis March** — 150 XP complete Stage 0 transaction; EDG +25;
  Connections +20; Compulsion/Hatred of Draconis Combine −30; Art/Any +10;
  Interest/FedSuns History +10; Protocol/FedSuns +5. Art remains an open
  subject and is resolved through the existing validated custom-subject path.

Both packages retain the parent Federated Suns affiliation, primary English,
the governed secondary language set, and the existing Natural Aptitude /
Protocol-Strategy requirement. The parent package is composed without
duplicating Crucis March awards.

## Governance and transaction behavior

The March selectors are mutually exclusive with Crucis March and the
Capellan Commonality path. Preview is uncommitted; Continue commits the
complete Stage 0 package once. Invalid Capellan language values are rejected,
while Draconis custom Art subjects use canonical open-subject normalization.
Existing Crucis Art/Painting saves remain valid as governed known choices.

## Persistence and verification

March state, selected language or Art subject, awards, provenance, XP, and
affiliation history round-trip through the existing character codec. Focused
B12 tests cover Capellan language resolution, Draconis open Art resolution,
parent-only behavior, and persistence. Existing codec, catalog, language, and
affiliation suites were updated for the expanded canonical data.

## Deferred

No Clan activation, Outback implementation, new school/family behavior,
consumer reference-data migration, commit, push, deployment, or version bump
is part of B12.
