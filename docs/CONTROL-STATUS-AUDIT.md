# Generic required-control status treatment

Alpha Slice 87 adds one reusable semantic control-state model for concrete form controls. It does not change rules, validation, award resolution, persistence, provenance, or preview/Continue boundaries.

## States and mapping

- `valid`: an enabled required control is resolved, so the active theme supplies its normal border.
- `error`: an enabled required control is unresolved or its concrete value is invalid. The control receives `aria-invalid="true"`, remains associated with existing help or validation text where available, and uses the shared `--control-error` border token.
- `disabled`: a dependent control cannot yet be used because its prerequisite is missing. It remains disabled and is not falsely marked invalid.
- `optional`: an empty optional control is normal, not an error.

The most specific responsible control is marked. A resolved parent selector is not marked merely because a dependent child remains unresolved. When an open choice selects `Other…`, the selector is resolved and the custom-subject input becomes the responsible control. Blockers that cannot be mapped reliably remain section-level text.

## Theme and accessibility behavior

The semantic error border temporarily overrides the normal control border under neutral, Federated Suns, Capellan Confederation, ComStar, Word of Blake, and future themes. Resolving the choice immediately restores the active-theme border. The existing theme-colored focus outline remains in addition to the red border, so keyboard location and error state remain independently visible. Existing Pending labels, blocker lists, help, validation messages, and alert semantics remain; color is supplementary.

## Applied consumers

The generic helper is used by Stage 0 affiliation and Order controls, reusable Life Module choice slots, open-subject and governed-subskill controls, direct Skill and Field award destinations, Flexible XP target/amount controls, fallback pending-award resolution, Stage 4 choices through the same slot architecture, and the modeled final-review XP allocation input. Disabled prerequisites and optional Stage 0 Sub/Order selections retain non-error states.
