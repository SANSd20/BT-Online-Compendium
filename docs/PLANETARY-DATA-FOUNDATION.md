# Planetary Data Foundation

## Purpose and boundary

This supporting workstream began because four affiliations use “Any from nearest state”:

1. Independent / Generic
2. Independent / Pirate
3. Independent / Spacer
4. ComStar / Word of Blake

ComStar/Word of Blake also uses `Protocol/Nearest state`.

The AToW meaning of “nearest state” is unresolved. No origin location, date, definition of state, or resolver algorithm has been approved. The planetary layer must provide objective data primitives without deciding AToW semantics.

## Two-layer architecture

MegaMek/mm-data → **Layer 1 lossless versioned snapshot** → validation → **Layer 2 normalized compendium data**.

Layer 1 preserves complete original YAML and unknown future fields. It must not depend on a rigid schema that mirrors current MekHQ Java classes. Available raw data may include system identity/coordinates/stars/events and multiple worlds with physical, atmospheric, biological, geographic, descriptive, visual, political, administrative, and historical data. Existence in raw data does not require immediate normalization.

## Snapshot lifecycle

Snapshots are `staged`, `accepted`, or `superseded`.

Import creates a staged snapshot. Validation plus explicit acceptance is required before it becomes current. New upstream data never silently becomes current. Historical snapshots remain available, and deletion from a later upstream snapshot does not erase older history.

Comparisons between staged and current accepted snapshots classify files as `ADDED`, `MODIFIED`, `DELETED`, or `UNCHANGED`.

## Minimum normalized model

### System

- stable internal ID;
- upstream system ID;
- SUCS ID when supplied;
- X/Y coordinates;
- connector classification;
- provenance and snapshot relationship.

### World

- stable internal ID;
- parent system;
- upstream planet ID when supplied;
- system position;
- primary-world flag;
- provenance and snapshot relationship.

### Temporal identity

- dated name;
- dated short name.

### Temporal politics

- dated faction list;
- dated administration.

Names can change. Stable IDs identify systems/worlds. Future lookup must support name plus date and historical aliases. Ambiguous names return multiple candidates rather than an arbitrary record.

## Temporal and political model

Events are persistent state changes, not independent annual rows. Do not generate a row for every year.

Political faction ownership is a list: zero, one, or multiple simultaneous factions are valid. Do not choose a winner for disputed/joint records. Missing ownership is not automatically Independent. Preserve distinctions among Independent, abandoned, uninhabited, disputed, and politically controlled.

Administration and ownership are separate concepts. Administrative hierarchies must not be flattened into faction ownership or vice versa.

## Lookup service

Other compendium features must not read MegaMek YAML directly. The future Planetary Lookup Service provides:

- system/world search and stable-ID resolution;
- historical-name lookup;
- name, political affiliations, administration, and inhabited/abandoned state at an explicit date;
- system coordinates;
- straight system-to-system distance.

Date-dependent political queries must not silently use today's date. Connector systems are excluded by default.

Straight geographic distance is:

`sqrt((x2 - x1)^2 + (y2 - y1)^2)`

This is distinct from jump routing, jump count, connector-assisted travel, and political borders.

## Connector systems

`connector_systems/` contains routing helpers rather than ordinary BattleTech systems. Classification comes from the upstream source path, not a guessed naming convention.

Connectors are retained losslessly and explicitly classified, but excluded by default from ordinary world selection and real-world political/geographic-neighbor calculations. Routing is outside the current foundation.

## Validation principles

Before acceptance, detect/report at least malformed YAML, duplicate system IDs, malformed/non-finite coordinates, missing geography-required coordinates, duplicate world positions, invalid `primarySlot`, malformed event dates, unpreservable provenance, and other normalization-blocking structure.

Unknown fields, multiple factions, no faction, and sparse histories are not automatically failures.

Validation reports; it does not silently repair. It must not alter coordinates, infer ownership, guess faction mappings, choose disputed winners, invent primary worlds, manufacture source annotations, substitute Sarna, or reconcile source conflicts.

## Rollout sequence

### Rollout 1 — Planetary Data Foundation

Lossless Layer 1 import; exact snapshot provenance; lifecycle; validation; minimum normalization; lookup service; historical political/name resolution; connector exclusion; Euclidean distance; update comparison.

### Rollout 2 — Political Geography

Objective primitives such as nearby political systems, nearest system for a specified faction, and factions within a radius. These deal in recorded factions, not an assumed AToW definition of “state.” Independent and disputed systems participate according to recorded data, and the origin is normally excluded from interstellar-neighbor calculations.

### Rollout 3 — AToW Nearest-State Integration

Only after “nearest state” is resolved by source clarification or an explicit project interpretation.

Do not automatically proceed between rollouts.

## Reproducibility and updates

If planetary information contributes to a durable saved-character result, retain the resolved result, planetary snapshot/version, relevant IDs/date, and applicable resolver version. Existing characters must not silently recalculate after dataset changes.

Dataset and resolver versions are both required because data changes and rule-interpretation changes are independent causes. An explicit recalculation retains the prior result in history.

Future update reporting should distinguish no rules impact, potential rules impact, and confirmed result impact without prematurely building a giant dependency system.

## Rollout 1 exclusions

Rollout 1 does not implement nearest state/faction, a definition of political state, automatic Secondary Language selection, mandatory homeworlds, border polygons, routing or jump counts, connector-assisted travel, saved-character auto-recalculation, character effects from planetary environment, rich planetary UI, or corrections to MegaMek data. Layer 1 nevertheless preserves unused upstream fields.

