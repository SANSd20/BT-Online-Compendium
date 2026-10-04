# Life Modules affiliation framework

Alpha Slice 29 centralizes the affiliation metadata already used by the narrow Alpha Life Modules path. It is a framework boundary, not an affiliation-data expansion.

## Modeled contexts

`Universal Fixed Experience Points` is a supported universal context with `isAffiliation: false`. It is not included in the selectable affiliation-context registry and supplies no implicit affiliation or language default.

The only supported affiliation context remains `Capellan Confederation / Capellan Commonality`. Its existing affiliation ID, affiliation and sub-affiliation labels, primary language, secondary languages, language-selector group IDs, and `Capellan` Protocol/Streetwise context labels are held in one typed, source-cited registry.

The three selector groups already present in Alpha are centralized without changing their values:

- affiliation languages: Mandarin Chinese, Russian, Cantonese, Vietnamese, English;
- Capellan secondary languages: Russian, Cantonese, Vietnamese, English;
- Federated Suns languages: English, French.

## Deferred boundary

An unknown context resolves as `deferred`; it does not become a selectable option and does not authorize a raw internal ID or free-text substitute. Pending awards continue to stay pending when the current source-backed data supplies no safe choice.

Full Great House, Periphery, Clan, Changing Affiliations, and broader affiliation-language expansion remain deferred. Broad Life Modules Workflow/UI Review, random name generation, Beta 1, and PDF export also remain future work.

## Compatibility

Existing module IDs, affiliation IDs, selector-group strings, award records, and saved JSON fields are unchanged, so no Slice 29 save migration is required. Stage 1–4 behavior, Archetype, Point Buy, Final Touches, and the 84-item equipment catalog are unchanged. The public title is `AToW Online Character Creator`, and the deployment target remains `https://sansd20.github.io/BT-Online-Compendium/`.

## Alpha Slice 79 — birth affiliation plus order affiliation

ComStar/Word of Blake is an optional order-affiliation layer, not a replacement for the normal birth affiliation. Stage 0 presents the existing combined stable birth-context IDs through separate Affiliation, Affiliation Language, and Affiliation Sub controls, preserving save compatibility. A fourth selector offers exactly No, ComStar, and Word of Blake; old saves and new ordinary characters behave as No.

The order layer costs 50 XP in addition to the birth package's full cost and effects. It commits in the same Stage 0 transaction and records a distinct `order` affiliation history role. Branch data, shared awards, explicit nearest-state language and Protocol resolution, canonical Technician selection, and Extra Income/Property conflicts are previewed without mutating committed state. Switching branch or birth context rebuilds preview from committed state, so prior effects and dependent choices cannot leak.

The rules say “nearest state” but do not define a geographic resolver. Slice 79 therefore requires an explicit governed choice from the currently modeled states and constrains the secondary language to that state's existing language selector. It does not infer that the birth affiliation is nearest or claim a complete setting-wide geography model.

## Alpha Slice 80 — optional sub-affiliation correction

The corrected core rules label sub-affiliation optional. New Stage 0 selections therefore default Affiliation Sub to `No`; this is a complete legal selection, not an unresolved placeholder. The main affiliation remains required, retains its full 150-XP module cost and all main-affiliation effects and choices, while sub-specific awards, choices, and provenance are absent. Selecting a concrete sub-affiliation adds its published effects without changing that module cost.

The UI now presents a larger affiliation region with the required Affiliation selector above side-by-side Affiliation Language and Affiliation Sub controls. The independent ComStar/Word of Blake selector and its governed choices occupy a smaller right-hand region and stack after the affiliation controls on narrow screens. Combined context IDs remain stable: an explicit `stage0SubAffiliation: "no"` records new no-sub characters, while absence of that property preserves pre-Slice-80 saves as their historically selected combined sub-affiliation.
