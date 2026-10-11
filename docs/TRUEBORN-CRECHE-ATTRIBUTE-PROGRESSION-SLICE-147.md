# Alpha Slice 147 — Trueborn Crèche Award and Attribute Progression

Slice 147 repairs the internal Trueborn Crèche transaction boundary identified by the Slice 146 audit.

The five source-defined Crèche flexible choices are now recorded as concrete `creche.flexible` grant records. Each record preserves the selected Attribute, Trait, or Skill destination, 15 XP award, Crèche provenance, source citation, and committed resolution identity. The transaction remains atomic and does not create a pending or synthetic award after successful resolution.

The Crèche continues to apply its corrected-printing fixed awards, 300 XP cost, and 10-year chronology. Attribute awards continue through the existing Attribute ledger and attained-score calculation; Slice 147 does not change global Attribute thresholds or inject XP.

The real Stage 0 package → Trueborn Crèche transaction now passes full character validation and preserves the required grant count and provenance. A source-legal MechWarrior caste fixture reaches 225 accumulated BOD XP after Stage 0 and Crèche awards. The existing Sibko prerequisite correctly rejects that fixture at the published BOD 3 threshold, so the complete Sibko pathway remains blocked until a source-authorized Attribute progression route is identified. No prerequisite is lowered and no fabricated history is accepted.

Coverage verifies valid and invalid Crèche destinations, required grant records, atomic rejection, exactly-once resolution, persistence-compatible state, Stage 0 → Crèche construction, and unchanged Slice 142 Sibko enforcement. Clan creation and Clan readiness remain disabled.

## Verification

- Focused Slice 141, 142, and 145 regressions pass.
- Full `npm run check`, separate production build, integration tests, and `git diff --check` are required before release.
- Reference Fields, mechanical Fields, equipment records, and equipment IDs remain unchanged at 56, 54, 84, and 84 respectively.

## Remaining dependency

The authoritative source and current engine agree that the Sibko MechWarrior branch requires BOD 3. The current legal Stage 0 MechWarrior package plus Trueborn Crèche fixed and five flexible awards produces BOD 225 XP in the Attribute ledger. Slice 147 records this discrepancy for a future source-backed Attribute progression decision; it does not activate Clan creation.
