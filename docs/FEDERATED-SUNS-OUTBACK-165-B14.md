# Federated Suns Outback — Alpha 165-B14

Release version: `0.1.0-alpha.165-b14`.

This slice adds the source-backed Federated Suns / Outback Stage 0 sub-affiliation.

## Source

The package is based on *A Time of War — Corrected Third Printing*, printed page 65, with the v4.0 Errata checked for applicable corrections.

Outback awards are STR +50, BOD +150, WIL +100, INT -100 XP; Illiterate -50, Reputation -50, Wealth -100; Streetwise/FedSuns +10; Survival/Any +20; and exactly one Art/Any or Interest/Any award at +10 XP. The package adds no cost beyond the Federated Suns parent cost of 150 XP.

## Choices and transactions

The Outback choice uses the shared source-open subject mechanism. The player must resolve one Art or Interest subject and one Survival subject before Continue. Preview remains isolated from the committed character; resolved awards, signed XP, choice grants, package history, and source provenance are committed atomically through the existing Life Module engine.

The Federated Suns Natural Aptitude choice and INT 4+ final prerequisite remain unchanged. Outback is mutually exclusive with the other March packages and does not alter parent-only, Crucis, Capellan, or Draconis behavior.

## Persistence and verification

Outback records use the existing character codec and repository/export pathways. Regression coverage checks catalog identity, signed awards, governed choices, source-open validation, parent cost/composition, switching cleanup, and existing March/Clan gating. The established browser framework remains the integration path for selection, unresolved-choice gating, commit, persistence, and export/import verification.

## Deferred

Other Great Houses, additional Federated Suns regions, Clan activation, and unrelated gameplay or equipment changes remain outside this slice.
