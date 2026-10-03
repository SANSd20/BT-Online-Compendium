# Stage 3 school expansion audit

Alpha Slice 70 audits every remaining normal Stage 3 school against the Corrected Third Printing Master Schools List on pages 82-83 and the v4.0 errata. The errata contains no correction to Trade School, University, Solaris Internship, Family Training, Planetary Surveyor, or their relevant Field offers.

## Remaining-school audit

| School | Family | Source mechanics | Current dependency result |
|---|---|---|---|
| Trade School | Civilian | 560 XP plus Fields; no prerequisites; INT +50, any one other Attribute +100, Connections +50, Equipped +100, any three distinct Skills +20 each, and 200 flexible XP. Basic General Studies and Merchant take one year; its Advanced Fields take two years. | Mechanical in Slice 72. The three slots reuse governed concrete destinations; open Career, Interest, Science, and Survival subjects reuse Slice 69 validation. The UI states that the available set is the currently modeled subset, not the complete setting-wide Skill universe. |
| University | Civilian | 710 XP plus Fields; INT 4+; when the character lacks Preparatory School, Nobility, and White Collar, apply WIL +100, EDG -100, Connections +200, Reputation -100, and Wealth -100. Automatic awards are INT +150, WIL +75, CHA +25, EDG +25, Connections +200, Equipped +50, Reputation +75, Wealth -200, Computers +25, Interest/Any +20, Perception +25, Protocol/Affiliation +20, any one other Attribute +50, and 220 flexible XP. Basic Fields take one year; Advanced and Special Fields take two years. | Selected. Every school-level award and choice reuses an existing governed mechanism, including the Slice 69 open Interest subject and the established conditional-entry model. |
| Solaris Internship | Civilian | 700 XP plus Fields; requires Solaris VII residency and Connections +2 TP; awards CHA +150, EDG +50, any one other Attribute +50, Connections +100, Enemy -50, Reputation +100, a choice of Equipped +100 or Vehicle +100, Acting +25, Interest/Solaris Games +30, Perception +20, Streetwise/Any +25, and 100 flexible XP. Its Basic and Advanced Fields take two years, with published prerequisite waivers for Solaris Cavalry, MechWarrior, and Battle Armor training. | Deferred. Solaris residency, the Equipped-or-Vehicle package, Streetwise/Any scope, and source-specific Field prerequisite waivers require additional bounded mechanics. |
| Family Training | Military | 570 XP plus Fields; requires Preparatory School or Military School, or Connections +1 TP; awards STR +75, BOD +75, RFL +50, WIL +50, Equipped +50, Rank +100, Driving/Any +15, Interest/Homeworld History +20, Protocol/Affiliation +15, Survival/Any +20, and 100 flexible XP. Basic Fields take 0.5 years, Advanced 1.5 years, and Special two years. | Deferred. The Stage-2-or-Connections prerequisite and durable homeworld-specific Interest identity are not yet represented. |

University is the smallest coherent next expansion because it uses established family, conditional-entry, fixed-award, affiliation-bound, flexible-pool, fixed-grant, open-subject, Field-selection, preview, chronology, and persistence machinery without adding an unrelated identity or exhaustive Skill-catalog subsystem.

## University Field classification

| Field | Offer | Result |
|---|---|---|
| Cartographer, Communications, Scientist, Technician/Civilian | Basic, 1 year | Mechanical; reused canonical Fields. |
| Manager | Basic, 1 year | Mechanical in Slice 70. Exact fixed and affiliation-bound Skills are representable. |
| General Studies | Basic, 1 year | Reference-only. Its prerequisite requires at least one other Skill related to its listed Field Skills; that structural relationship is not mechanically governed. |
| Analysis, Detective, Engineer, Medical Assistant, Technician/Aerospace, Technician/Vehicle | Advanced, 2 years | Mechanical; reused canonical Fields. |
| Planetary Surveyor | Advanced, 2 years | Mechanical in Slice 70. Scientist and INT 6+ prerequisites are represented; Driving/Any uses the closed domain and Survival/Any uses Slice 69 open-subject governance. |
| Politician | Advanced, 2 years | Mechanical in Slice 70. It requires the canonical Manager Field and CHA 4+; its Skills are fixed or affiliation-bound. |
| Anthropologist, Archaeologist | Advanced, 2 years | Reference-only because General Studies remains reference-only. |
| HPG Technician | Advanced, 2 years | Reference-only because its ComStar, Word of Blake, or Clan affiliation restriction cannot be met by the implemented Stage 0 contexts. |
| Doctor, Military Scientist, Technician/Mech, Technician/Military | Special, 2 years | Mechanical; reused canonical Fields. |
| Lawyer | Special, 2 years | Reference-only because General Studies remains reference-only. |

All mechanical Fields retain +30 XP per Field Skill at a purchase cost of 24 XP per Field Skill. Manager costs 144 XP for six Skills, Planetary Surveyor costs 120 XP for five Skills, and Politician costs 120 XP for five Skills. The independent reference catalog remains 56 entries; the mechanical catalog increases from 32 to 35; equipment remains 84 unique stable IDs.

## Slice 71 dependency update

The Slice 70 classifications above preserve that checkpoint. Slice 71 subsequently establishes General Studies' "related Skill" as a GM-arbitrated selection of an already possessed concrete Skill and promotes General Studies, Anthropologist, Archaeologist, and Lawyer through University. HPG Technician remains reference-only for its unsupported affiliation prerequisite. The current mechanical catalog is 39; the reference catalog remains 56 and equipment remains 84.

## Slice 72 Trade School update

Trade School is mechanical with its source-exact 560-XP base package. “Any one other Attribute” excludes INT because INT is the school’s named +50 award. The three +20 XP Skill slots require distinct canonical concrete Skill identities, may add XP to an existing Skill or introduce a source-permitted governed Skill, and have no silent defaults. The separate 200 flexible XP pool has no Stage 2 caps. General Studies and Merchant are Basic one-year offers; Analysis, Anthropologist, Archaeologist, Cartographer, Communications, Journalist, Manager, Medical Assistant, and Merchant Marine are Advanced two-year offers. HPG Technician remains reference-only because its affiliation prerequisite is unavailable. Merchant and Journalist are newly mechanical at 144 XP each. The mechanical catalog is 41; the reference catalog remains 56 and equipment remains 84.
