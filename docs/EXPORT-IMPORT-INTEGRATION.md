# Export/import integration verification

## Alpha Slice 106

The repository now contains a repeatable browser integration suite at
`scripts/export-import.integration.test.ts`, invoked with:

```text
npm run test:integration
```

The suite starts a local Vite server, launches the installed Chrome browser
through `playwright-core`, and uses separate browser contexts for source and
destination characters. It imports a deterministic source-legal Life Modules
fixture through the normal file input, exports it through the normal UI,
imports the resulting JSON into a fresh context, reopens it, and exports it
again. Each run compares the canonical character payload to the original and
checks that both finalized snapshots and the independent draft are preserved.

The test executes the complete cycle twice in one invocation. The temporary
fixture and downloaded files are removed after each invocation. The suite does
not change production persistence behavior or use direct browser storage
injection.

Malformed-file and schema-negative behavior remains covered by the codec and
repository unit tests; the browser suite is intentionally limited to the
supported normal UI workflow.
