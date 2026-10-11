# Alpha Slice 108: Stasis Tube history and browser verification

## Source and policy

The primary source is *Handbook - Major Periphery States*, pp. 185-186,
Stasis Tube. The source states that freezing requires separate BOD checks for
the brain and body at -2; failure reduces the corresponding INT or BOD to 0
and is fatal. Each full year in stasis requires a BOD check at -1; failure
loses 1 BOD and 1 INT, with zero fatal. Thawing takes 24 hours and requires no
check. A power interruption longer than one day requires a BOD check at -3;
failure causes BOD -1 and Sudden Stasis Shock unless a Medtech Skill level 2+
operator succeeds with MoS 4+. The process stops and full revival is required
before restarting. Ancient tubes may receive discretionary -1 to -4 modifiers.

Secondary post-thaw effects are explicitly GM-determined. The application
records this as an unresolved advisory and does not invent Traits or a random
complication table.

The application policy keeps chronological age separate from biological age.
Stasis adds chronological years but only one biological day per stasis year,
retaining fractional biological age internally. Ordinary aging brackets use
biological age. Stasis damage is a direct effective-Attribute loss, not XP and
not a Life Module award.

## Event model and readiness

`CharacterDefinition.stasisHistory` stores stable event IDs, source/provenance,
start year, duration, fractional biological aging, separate freezing and
annual outcomes, power interruptions, thaw state, BOD/INT losses, survival,
and unresolved conditions. Overlapping intervals are rejected. Existing saves
without this optional field remain valid.

Fatal or unresolved mandatory Stasis outcomes block ready-for-play status;
characters without Stasis history are unaffected. Finalized snapshots and
export/import retain the canonical event data through the existing character
codec.

The Final Touches area provides a bounded outcome-entry control for recording a
Stasis event. It does not treat Stasis as a Life Module, Trait, equipment
catalog record, XP award, or training event. The isolated browser integration
suite exercises these controls against the running application, including
successful and fatal brain/body freezing outcomes, annual outcomes,
power-interruption controls, export round-trip preservation, Save/Resume,
player-facing fatal readiness blockers, and rendered BOD/INT values. The suite
runs in temporary Playwright contexts and does not use the user's normal
browser profile.

## Slice 108 browser coverage

Run `npm run test:integration` to execute the existing Slice 106 isolated
Chrome framework. The suite now covers the player-facing Stasis controls and
the existing finalized-snapshot export/import workflow; the Stasis tests also
assert the -2 freezing modifiers, annual -1 and power-interruption -3
modifiers, cumulative BOD/INT losses, forced thaw, biological-age display,
stable creation XP, rendered Attribute values, fatal readiness blockers, and
Save/Resume. The integration suite was run twice during Slice 108 verification
with three passing tests per run.

Automated browser coverage does not constitute manual live-browser coverage.
The Codex computer-use helper could not provide a fresh isolated Chrome
session in this environment, so manual browser interaction, visual responsive
inspection, and browser-console capture remain unverified. Secondary effects,
ancient-tube discretionary modifiers, and a full human-entered MedTech
workflow remain explicit Alpha limitations. The UI's bounded outcome-entry
controls cannot independently model a fatal annual threshold from a high BOD
starting point or a missing annual check; those cases remain domain-verified
and browser-unverified. The age-25 biological boundary and full rendered
readiness clearance for a completed event also remain outside this browser
fixture's supported boundary.
