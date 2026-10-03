# General Studies prerequisite audit

Alpha Slice 71 audits General Studies and its University dependency chain against the *A Time of War* Corrected Third Printing Master Schools List (pp. 82-83), Master Skill Fields List (p. 92), final-level rules (p. 92), and the v4.0 errata. The errata contains no applicable correction.

## Source semantics

General Studies is a Basic Civilian Field offered by University for one year. It requires INT 3 and "at least one other Skill related to those shown below." The Field contains Career/Any, Computers, Interest/Any, Perception, and Protocol/Affiliation. It grants +30 XP to each of those five Skills and costs 24 XP per Skill, or 120 XP.

The source supplies no closed related-Skill list, category, minimum level, or objective relationship test. "Other Skill" is therefore represented as a concrete Skill the character already possesses before the University preview, with the relationship explicitly subject to GM approval. The selector excludes unresolved `/Any` placeholders and untrained ledger fragments. Selecting the prerequisite records canonical Skill identity but grants no XP and creates no Skill. Prerequisites remain final-validation requirements rather than entry gates.

The selected Skill is retained on the durable General Studies Field grant because the relationship cannot be reconstructed deterministically after export/import. Changing the preview selection replaces that provenance; deselecting General Studies removes it with the rest of the preview. No account or live GM-approval workflow is introduced.

## Dependent Fields

| Field | University offer | Exact prerequisites | Field Skills | Cost | Result |
|---|---|---|---|---:|---|
| Anthropologist | Advanced, 2 years | General Studies, INT 4 | Career/Anthropologist; Interest/History (one culture); Investigation; two Language/Any choices; Protocol/Any | 144 XP | Mechanical; open cultural Interest, modeled languages, and affiliation-constrained Protocol use existing governance. |
| Archaeologist | Advanced, 2 years | General Studies, INT 4 | Career/Archaeologist; Appraisal; Interest/Geology; Interest/History (any); Navigation/Ground; Perception | 144 XP | Mechanical; the open History subject uses existing Interest governance. |
| Lawyer | Special, 2 years | General Studies, INT 4, CHA 4, WIL 5 | Acting; Administration; Career/Lawyer; Interest/Law; Negotiation; Protocol/Any | 144 XP | Mechanical; Protocol uses the existing affiliation-constrained domain. |

Each dependent Field requires the actual acquired General Studies Field. General Studies component Skills, goal guidance, or its related-Skill prerequisite do not substitute. University category ordering still requires one Basic Field and at least one Advanced Field before Special training.

HPG Technician remains reference-only because its ComStar, Word of Blake, or Clan affiliation requirement cannot be met by an implemented Stage 0 context.

## Checkpoint

The independent reference catalog remains 56 entries. The mechanical catalog increases from 35 to 39. Equipment remains 84 records with 84 unique stable IDs. The implementation adds optional Field-grant provenance only, so existing Alpha saves remain backward compatible without a schema migration. Preview, Continue-only commit, committed-only save/export, University rules, Stage 3 family governance, and faction themes are unchanged.
