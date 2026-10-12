# Alpha Slice 165-B6 — Trait and conditional legality

This slice adds an internal legality evaluator over the existing Clan identity, caste, Phenotype, concrete Language, Trait, destination, and governed-choice models. Results are structured as `ELIGIBLE`, `INELIGIBLE`, `UNRESOLVED_REQUIRED_CHOICE`, or `UNSUPPORTED_DEPENDENCY`, with a canonical requirement identity, reason, source citation, and relevant context.

The evaluator preserves signed Trait XP/TP and does not convert TP to XP. It checks the existing modeled opposition pairs, concrete Language duplication, destination support, Clan Phenotype and caste context, governed choice completion, and the absence of a modeled service-era context. Missing service-era state is explicitly unsupported; no era is invented. Conditional requirements are classified, never applied.

No specific-Clan awards are executed. Clan readiness, player-facing Clan selection, and public Clan import remain disabled. Atomic prospective transaction and award application remain the next dependency.
