# Stage 0 Affiliations and Phenotypes Audit — Slice 116

Sources examined through authenticated Box retrieval:

- *A Time of War — Corrected Third Printing*, Stage 0 pp. 63–74 and Phenotype pp. 121–122.
- *A Time of War v4.0 Errata*. The relevant Stage 0 correction is the Independent/Astrokaszy Streetwise award: `+10 XP`, not `+10 CP`; the errata also notes that extreme-gravity rules can alter Attribute maximums and costs. No erratum authorizes ordinary non-Clan Aerospace, Elemental, or MechWarrior phenotypes.

## Source-defined affiliation inventory

All entries below are Stage 0 source identities. Major affiliations have optional sub-affiliations whose awards are additional to the parent package.

| Entry | Source | Cost | Slice 115 status | Slice 116 finding |
|---|---:|---:|---|---|
| Capellan Confederation (House Liao) | p. 63 | 150 XP | Supported as Capellan Commonality context | Existing implementation covers only one sub-affiliation; Liao, Sian, St. Ives, and Victoria packages remain unavailable. |
| Draconis Combine (House Kurita) | p. 65 | 150 XP | Unsupported | Japanese/Arabic/Swedenese language identity, Combine sub-affiliations, and faction-specific awards are not fully modeled. |
| Federated Suns (House Davion) | p. 67 | 150 XP | Supported as Federated Suns / Crucis March | Remaining Davion sub-affiliation packages are not represented. |
| Free Worlds League (House Marik) | p. 69 | 150 XP | Unsupported | Full language, sub-affiliation, and award packages are not represented. |
| Lyran Alliance (House Steiner) | p. 71 | 150 XP | Unsupported | Full language, sub-affiliation, and award packages are not represented. |
| Free Rasalhague Republic | p. 73 | 100 XP | Unsupported | Rasalhague-specific language, sub-affiliation, and award package are not represented. |
| Minor Periphery State | p. 73 | 100 XP | Deferred/out of current target | Periphery identity and source-defined variants are not represented in the supported Stage 0 registry. |
| Major Periphery State | p. 73 | 100 XP | Deferred/out of current target | Periphery identity and source-defined variants are not represented in the supported Stage 0 registry. |
| Deep Periphery | p. 74 | 50 XP | Deferred/out of current target | Deep Periphery language and package choices are not represented. |
| Terran | p. 74 | 240 XP | Unsupported | Terran package and required language/award choices are not represented. |
| Independent | p. 74 | 50 XP | Unsupported | Independent sub-affiliations and unrestricted language/award choices are not represented. |
| ComStar/Word of Blake | p. 74 | 50 XP plus birth affiliation | Supported only as an order layer | Existing ComStar and Word of Blake order layers are preserved; they are not treated as ordinary birth affiliations. |

The source also defines optional sub-affiliations under the major affiliations, including Capellan Commonality, Liao Commonality, Sian Commonality, St. Ives Commonality, Victoria Commonality; Azami, Benjamin, Dieron, New Samarkand/Galedon, and Pesht; and corresponding sub-affiliations for Federated Suns, Free Worlds League, and Lyran Alliance. The current model exposes only Capellan Commonality and Crucis March as complete contexts. Unknown contexts remain deferred rather than silently mapped to a generic faction.

## Current implementation counts

- Birth-affiliation context entries: 2 supported contexts (Capellan Commonality and Crucis March).
- Distinct birth-affiliation options exposed by the current registry: 2.
- Order layers: 2 (ComStar and Word of Blake), retained separately from birth affiliation.
- Phenotype definitions in the shared catalog: 4 (Normal Human, Aerospace, Elemental, MechWarrior).
- Ordinary supported phenotype: Normal Human only.
- New affiliations implemented in Slice 116: 0.
- New phenotypes implemented in Slice 116: 0.

## Phenotype findings

The source states that every character has exactly one Phenotype. Non-Clan characters use Normal Human; Clan trueborn characters choose Aerospace, Elemental, or MechWarrior. The existing definitions preserve the source-backed Attribute modifiers, Attribute maximums, and bonus-trait metadata for those Clan phenotypes, while ordinary character creation correctly does not expose Clan phenotype selection. Exceptional Attribute remains governed by the existing effective-maximum legality and is not broadened by this audit.

## Homeworld, residence, languages, and readiness

Homeworld and residence are already distinct persisted fields. Family Training and Solaris Internship retain their existing homeworld/residence behavior. Existing language selectors use concrete modeled Language subskills and required-choice gating; adding the remaining affiliations would require expanding the governed concrete language and sub-affiliation award data. Readiness therefore continues to reject unresolved or illegal supported-path choices without falsely blocking unrelated optional factions.

## Release decision

No implementation or version release is warranted for Slice 116. Adding an affiliation now would either omit mandatory source awards/choices or invent unsupported mechanics. Clan character creation, Clan Life Modules, general Skill/Trait expansion, and broader faction systems remain explicit dependencies for later work.
