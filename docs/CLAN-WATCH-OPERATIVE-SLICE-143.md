# Clan Watch Operative — Alpha Slice 143

Slice 143 connects the internal Clan Watch Operative Stage 4 module to the atomic Life Module transaction engine. Clan creation remains disabled in the player-facing application and Clan readiness remains blocked.

The source entry is *A Time of War—The BattleTech RPG*, Corrected Third Printing, p. 84: 1,200 XP and +3 years. It requires any Clan affiliation and Warrior, Scientist, or Technician caste. The shared awards are INT +70, RFL +50, CHA −75; Connections +100, Dark Secret −50, In For Life −100, Reputation −50; Acting +30, Computers +75, Cryptography +50, Demolitions +40, Martial Arts +75, Perception +75, Protocol/Affiliation +50, Small Arms +80, Stealth +50, Streetwise/Affiliation +50, and Tracking/Any +80; plus 175 flexible XP.

The executable branch selection is explicit and must match the canonical affiliation category: Homeworld Clan or Invader Clan. Homeworld awards are Career/Soldier +60, Interrogation +50, Investigation +50, Melee Weapons +40, Protocol/Any Clan +75, Security Systems/Any +35, Streetwise/Any Homeworld Clan +50, Survival/Any +25, and Technician/Any +40. Invader awards are Equipped +50, Dark Secret −50, Computers +50, Disguise +35, Interrogation +75, Investigation +75, Negotiation +40, Perception +50, Streetwise/Any Invader Clan or Inner Sphere +50, and Survival/Any +50.

Open-subject awards require explicit concrete choices in the transaction; literal unrestricted `/Any` destinations are not created. The committed record stores the branch, p. 84 provenance, 1,200 XP cost, +3 chronology years, all awards, and the unresolved 175 XP pool. The module cannot be repeated.

Verification covers both branches, mismatched branch atomic rejection, existing regression coverage, full checks, production build, integration tests, and diff validation. Persistence uses the existing character serialization model; no player-facing Clan workflow or readiness activation was added.
