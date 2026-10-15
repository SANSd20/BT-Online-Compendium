# G1h-A Chronology Foundation

The application now supports an optional, durable chronology profile with two modes:

- `fixed-dob`: the player-supplied ISO birth date remains unchanged.
- `progression-derived`: life-module progression supplies age; no exact birthday is invented.

`SET_AGE` is an absolute progression operation. It records before/after age, provenance, source relation, and deterministic ordering. `ADD_YEARS` remains elapsed-duration behavior. The published G1g Capellan relation is the only currently authorized relation reference for `SET_AGE`; this slice does not implement the substitution transaction.

Birth-date ranges are calculated only when a campaign reference date is explicitly supplied. No campaign year is assumed. Without that input, the derived-age representation remains valid but calendar-dependent DOB calculation is deferred.

Chronology entries and the optional profile are JSON-compatible and absent fields preserve existing saves. Existing life-module age markers and Stage 2–4 behavior remain unchanged. No awards or XP are replayed by decode.

Deferred: Capellan substitution execution, Stage 3/4 duration gating, Citizenship restrictions, campaign setup UI, and player-facing DOB entry.
