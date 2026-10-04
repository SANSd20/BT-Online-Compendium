# Generic required-control status treatment

Alpha Slice 87 adds one reusable semantic control-state model for concrete form controls. Alpha Slice 88 refines required-but-unresolved into a separate subdued state and generically deduplicates control-mappable blockers. Neither slice changes rules, validation, award resolution, persistence, provenance, or preview/Continue boundaries.

## States and mapping

- `valid`: an enabled required control is resolved, so the active theme supplies its normal border.
- `required-unresolved`: an enabled required control still needs a choice or value but is legal so far. It receives `aria-required="true"` and a 1px `#9B5555` border with no glow, fill, animation, or thickness change. The token remains generic across neutral, Federated Suns, Capellan, ComStar, and Word of Blake themes.
- `invalid`: a provided value fails validation. It receives `aria-invalid="true"`, remains associated with existing help or validation text where available, and uses the stronger shared `--control-error` treatment.
- `disabled`: a dependent control cannot yet be used because its prerequisite is missing. It remains disabled and is not falsely marked invalid.
- `optional-empty`: an empty optional control is normal, not an error.

The most specific responsible control is marked. A resolved parent selector is not marked merely because a dependent child remains unresolved. When an open choice selects `Other…`, the selector is resolved and the custom-subject input becomes the responsible control. Blockers that cannot be mapped reliably remain section-level text.

## Theme and accessibility behavior

The required or invalid semantic border temporarily overrides the normal control border under neutral, Federated Suns, Capellan Confederation, ComStar, Word of Blake, and future themes. Resolving the choice immediately restores the active-theme border. The existing theme-colored focus outline remains in addition to either status border, so keyboard location and status remain independently visible. Labels, `aria-required`/`aria-invalid`, help, validation messages, and alert semantics ensure color is supplementary.

## Blocker mapping and deduplication

A pending requirement with a reliable, visible, semantically marked control is control-mappable and is omitted from the section-level blocker list. Mixed sets retain only non-mappable blockers. Character-wide legality, cross-stat prerequisites, missing prerequisite Fields, module eligibility, chronology/family restrictions, and multi-control conflicts remain section-level. Stage 0 replaces its repeated list with a screen-reader description referenced by marked controls; the status area states only that no additional non-control blocker exists.

## Applied consumers

The generic helper is used by Stage 0 affiliation and Order controls, reusable Life Module choice slots, open-subject and governed-subskill controls, direct Skill and Field award destinations, Flexible XP target/amount controls, fallback pending-award resolution, Stage 4 choices through the same slot architecture, and the modeled final-review XP allocation input. Disabled prerequisites and optional Stage 0 Sub/Order selections retain non-error states.
