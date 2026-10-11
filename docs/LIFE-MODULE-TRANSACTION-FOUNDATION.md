# Life Module Transaction Foundation

Alpha Slice 129-A adds an internal, in-memory transaction boundary for supported Life Module award resolutions.

## Contract

`buildLifeModuleTransaction` accepts a canonical committed character state, an ordered list of supported `resolve-pending-award` operations, and optional provenance/source context. It clones the input and applies each operation through the existing single-award resolver. No persistence or input mutation occurs during build.

`validateLifeModuleTransaction` validates the complete prospective character with the existing character legality service. A transaction fails with structured errors for an unsupported operation, malformed operation, unavailable choice, or illegal prospective state. On failure, the prospective state is discarded and the original state remains untouched.

`commitLifeModuleTransaction` is the only commit boundary. It is available only after successful validation, returns a cloned next state, and can be called exactly once for a transaction.

The transaction currently supports the award destinations already supported by the resolver, including mixed Attribute, Trait, and concrete/parameterized Skill resolutions. Existing single-award behavior remains unchanged. Choice packages, conditional awards, and Field grants remain explicitly unsupported and are not activated by this foundation.

## 129-B package boundary

`resolveLifeModulePackage` provides canonical package, option, and nested-choice identity handling and expands fixed and nested conditional awards into an ordered transaction operation list. Package provenance is retained with the resolution result. The current production catalog contains no activated conditional package definitions.

Field grants remain rejected unless a governed school-offer context is present. The existing Field legality model requires category, chronology, purchase cost, awarded XP, prerequisites, and source provenance; the legacy `field-grant` award shape does not provide those values. Adding a package Field without that context would omit mandatory mechanics or invent rules, so it is deliberately rejected pending the authorized 129-C domain model. No package is partially applied.

The B2 extension now accepts governed Field context on a `field-grant`: canonical school module and offer identities, category, chronology, awarded XP, purchase cost, and canonical Field provenance. Context is resolved against the existing school-offer and Field catalogs. A valid grant expands through the same transaction into component Skill awards and required concrete variable-Skill choices; invalid context, missing choices, duplicate acquisition, unavailable school, or inconsistent XP/chronology is rejected atomically. Clan Fields remain unavailable.

## Follow-on requirements for 129-B

129-C remains responsible for player-facing package UI and complete source-backed package catalog integration. 129-D must persist package, option, offer, Field, and nested concrete-choice identities without replaying awards during restoration. Persistence codecs and UI remain unchanged in this checkpoint.

## 129-C1 production catalog and draft contract

The Life Module catalog now owns the conditional-package schema and validator. Package IDs, option IDs, nested-choice IDs, source provenance, complete award bundles, eligibility, and unsupported-dependency reasons are represented canonically. The active production package catalog remains empty until a complete source audit supplies a real package; no invented player-selectable award bundle is activated.

The in-memory Life Module draft may carry `conditionalPackageDraft` with package ID, selected option ID, nested canonical selections, source provenance, status (`not-selected`, `incomplete`, `invalid`, or `ready`), and validation messages. Selecting a replacement option replaces the draft and invalidates incompatible nested choices. Draft resolution delegates to the existing package-to-transaction operation resolver and does not mutate committed XP, chronology, provenance, or persistence.

129-D must serialize this draft identity and validation-relevant state if package selection is made resumable: package ID, choice ID, option ID, nested selections, status/errors, and source provenance. It must not replay package awards during restoration. Player-facing UI and Continue integration remain the next 129-C step.

## 129-C preview and UI boundary

`ConditionalPackagePanel` is a reusable, keyboard-accessible UI surface that consumes injected governed package definitions. It presents canonical package/option controls, nested governed values, preview award identities, validation status, and a disabled Continue action until the draft is ready. It returns draft changes through the existing in-memory character callback; it does not persist or commit awards. The active production catalog is empty, so the panel is intentionally not visible in the current released workflow. Full production package Continue commitment remains dependent on a source-audited package definition and the later persistence checkpoint.

## 129-D persistence

The canonical character envelope already serializes `CharacterDefinition`, so conditional-package draft state and governed Field context travel through Save/Resume and export/import without a competing codec. Decode validation rejects unknown package identities, invalid option relationships, invalid nested selections, and inconsistent ready status. Decoding only restores canonical state; it never replays package operations, adds XP, advances chronology, or creates provenance.

Committed package results remain represented by the existing character ledgers, resolved awards, selected Fields, chronology, and provenance records. Finalized snapshots remain independently cloned by the existing snapshot workflow. The active production package catalog remains empty, so live package persistence is not browser-verifiable until a source-audited package is authorized. 129-E remains responsible for release-level verification and future compatibility migration.
