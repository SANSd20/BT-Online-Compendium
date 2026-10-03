# Open Skill subject audit

Alpha Slice 69 audits the Corrected Third Printing Skill descriptions and v4.0 errata before enabling text entry. The errata contains no Career, Interest, Science, or Survival correction that changes these semantics.

| Parent Skill | Source semantics | Governance |
|---|---|---|
| Career | Various occupations; Accountant, Cook, Doctor, and Soldier are examples. It covers only tasks within the chosen profession that are not better represented by another Skill. The gamemaster decides applicability. | Open, GM-defined occupation subject. |
| Interest | Any academic or cultural pursuit or hobby; History, Literature, Holo-Games, and Sports Statistics are examples. It covers only the chosen area when another Skill is not a better fit. The gamemaster decides applicability. | Open, GM-defined interest subject. |
| Science | Any major scientific field; Biology, Chemistry, Mathematics, and Physics are examples. It excludes work already covered by Technician and yields to a better-fitting Skill. The gamemaster decides applicability. | Open, GM-defined scientific-field subject. |
| Survival | By environment. Arctic, desert, forest, ocean, mountain, jungle, and so on are examples; the text explicitly permits other general environment types. Survival expertise should also be tied to a specific planet because environments vary between worlds. | Open, GM-defined general-environment subject. The Alpha records the environment subject; planet association remains campaign guidance rather than a new identity field. |

## Canonical input policy

- The parent Skill is selected by the published award and cannot be typed or replaced by the player.
- Subjects are Unicode-normalized to NFC, trimmed, and have repeated whitespace collapsed to one space.
- Meaningful case and permitted punctuation are preserved.
- Empty subjects, control characters, `/`, `\`, and subjects longer than 60 characters are rejected.
- `/` is reserved as the display/identity separator between parent Skill and subject.
- Canonical Skill matching is case-insensitive through the existing Skill key, so an award accumulates onto an existing concrete Skill instead of creating a duplicate.
- Entry is a proposed open/GM-defined subject, not an in-app GM approval or a claim of universal campaign legality.

Language/Any remains the existing modeled bounded catalog. Closed, named, and affiliation-governed Slice 68 domains remain selectors and are not converted to text entry.
