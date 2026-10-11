# Clan Stage 4 Eligibility — Alpha Slice 137

Slice 137 adds a shared, domain-only Clan Stage 4 eligibility foundation. It
does not add or expose Clan Stage 4 career modules and does not activate Clan
character creation.

The canonical context distinguishes Clan affiliation, Invading/Homeworld
category, caste, Trueborn/Freeborn origin, committed Stage 1/2 training
history, and Clan departure state (`within-clan`, `left-clan`, or
`dark-caste`). Departure state is provenance-bearing metadata and is never
inferred from Phenotype or assigned automatically.

The evaluator returns one of four explicit outcomes:

- `ELIGIBLE`
- `INELIGIBLE`
- `UNSUPPORTED_DEPENDENCY`
- `UNRESOLVED_REQUIRED_CHOICE`

The audited future career contexts include Clan Watch Operative, Warrior
Washout, Dark Caste, Scientist Caste Service, Civilian Job, Merchant,
Organized Crime, Cloister Training, Goliath Scorpion Seeker, and ProtoMech
Pilot Training. Their eligibility metadata preserves source-defined caste,
affiliation-category, departure, training-history, Phenotype, and specialized
dependency boundaries without making the modules playable.

The source-defined warrior transition remains Stage 2 → Stage 4 after Clan
Apprenticeship or Trueborn Sibko. This bypass is represented as a derived
domain result and does not globally alter Inner Sphere Stage 3 navigation.

The Conditional Package panel now renders only when an applicable package
exists for the current canonical context. A selected unresolved package stays
visible so required choices cannot disappear. Package selection, preview,
Continue gating, XP, and committed state are unchanged.

Source authority: *A Time of War — Corrected Third Printing*, pp. 63,
69–71, 80–90, 95, and 121–122, with applicable *A Time of War v4.0 Errata*.
