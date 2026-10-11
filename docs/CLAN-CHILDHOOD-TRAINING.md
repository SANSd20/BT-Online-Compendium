# Clan Childhood and Training — Alpha Slice 135

Slice 135 adds internal, source-backed Life Module definitions for the Clan
childhood path. Player-facing Clan creation remains disabled and the existing
Clan readiness blocker is preserved.

| Module | Stage | Cost | Source | Chronology |
| --- | ---: | ---: | --- | ---: |
| Trueborn Crèche | 1 | 300 XP | Corrected Third Printing p. 76 | age 10 |
| Clan Apprenticeship | 2 | 500 XP | Corrected Third Printing p. 77 | age 16 |
| Trueborn Sibko | 2 | 1,600 XP | Corrected Third Printing p. 79 | age 16 |

Trueborn Crèche requires Clan affiliation, Trueborn identity, and one of the
source-defined Aerospace, Elemental, or MechWarrior Phenotypes. Its fixed
Attributes, Compulsion/Clan Honor, Phenotype, Slow Learner, Trueborn, concrete
Clan Skills, and five 15-XP flexible grants are represented with provenance.

Clan Apprenticeship preserves its fixed Attribute, Trait, and Skill awards and
its 200-XP flexible pool. Its internal branch package supports Aerospace,
Elemental, and MechWarrior branches with the corresponding governed Clan
Field grant and Vehicle award. Trueborn Sibko preserves the source module
identity, Crèche-history and Trueborn requirements, fixed training awards,
and internal Aerospace, Elemental, and MechWarrior branch packages.

Branch packages reuse the existing build/validate/commit transaction model.
Field grants use the existing governed school-offer context, source Field
identity, reduced acquisition cost, component Skill XP, provenance, and
chronology rules. No package flattens a branch into independent optional
awards, and invalid packages cannot commit partially.

Cavalry remains deferred because the source requires alternatives not
representable exactly by the current governed component model. ProtoMech and
advanced ProtoMech remain deferred because the EI Neural Implant and chemical
addiction dependencies are unsupported. Technician/Any-dependent branches,
Clan Infantry, Bloodname acquisition, and Clan Stage 3/4 remain outside this
slice. No literal `/Any` Skill identity or invented restriction is added.

The definitions are persistence-safe through the existing canonical Life
Module envelope. Save/Resume and export/import restore committed module,
package, award, chronology, XP, and provenance state without replaying awards;
Clan player-facing controls remain unavailable.

Source authority: *A Time of War — Corrected Third Printing*, pp. 76–77 and
79, p. 95 for Clan Fields, and applicable *A Time of War v4.0 Errata*.
