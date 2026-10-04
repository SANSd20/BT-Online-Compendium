# Order affiliation theme audit

Alpha Slice 86 consumes the shared government/faction UI palette authority from `SANSd20/battletech-faction-colors`, `palettes/government-ui.yaml`, at commit `8fb1dde0e10c2f455fef7d822b6bd6e2ae43d760`.

The ComStar and Word of Blake palettes are `PROVISIONAL` and classified `UI_ADAPTATION`. Their exact hexadecimal values are project UI adaptations, not official BattleTech digital color specifications.

## Consumed palettes

ComStar: primary `#AAB5BF`, primary deep `#4B555E`, primary surface `#737D86`, panel `#394249`, alternate panel `#596771`, border `#BECCD4`, secondary `#22272B`, accent `#BFC9CE`, foreground `#F1F6F8`, ink `#111111`.

Word of Blake: primary `#22272B`, primary deep `#121A20`, primary surface `#191F25`, panel `#131A1F`, alternate panel `#1C272E`, border `#BCA752`, secondary `#B9C2C8`, accent `#765A99`, foreground `#F1F6F8`, ink `#111111`.

## Priority and derivation

Theme identity is derived rather than persisted:

1. a canonical committed or Stage 0 preview Order affiliation (`comstar` or `word-of-blake`) is globally dominant;
2. otherwise the canonical birth-affiliation context selects its existing theme;
3. otherwise the neutral application theme remains.

During an Order-dominant theme, a compact identity marker names the dominant Order and presents the birth affiliation as a secondary identity. Its narrow border uses the birth identity color, while surfaces, current-stage state, controls, summary panels, and focus emphasis remain governed by the Order palette. This prevents the birth palette from competing with the dominant theme or weakening text/control contrast.

The Stage 0 selectors drive preview-only theme changes. After Continue, later stages derive the same priority from `stage0AffiliationContext` and `orderAffiliation`; JSON save/import therefore restores the theme without presentation-only state or schema migration. Older saves without an Order field derive the existing birth theme.
