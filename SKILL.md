---
name: testflight-feedback-loop
description: Orchestrates a tight Apple-app build-and-iterate loop: ship a build to TestFlight headlessly, and pull/track/triage TestFlight device feedback + crashes into a per-project tracker, then fix and ship the next build. This skill should be used when shipping an iOS/macOS build to TestFlight without the Xcode GUI, when checking for or acting on TestFlight beta feedback or crash reports, when maintaining the testflight-feedback.md tracker, or any time running the "ship, test on device, feedback, fix, ship" loop.
---

# TestFlight Feedback Loop

A fast way of building Apple apps: build a focused MVP/feature, ship it to TestFlight **headlessly** via the `asc` CLI; the user installs and tests on device and sends feedback as screenshots + notes; Claude pulls/tracks/triages that feedback (plus crashes), fixes, and ships the next build. This skill is the **thin orchestrator** for that loop. It owns the **ship pipeline** and the **feedback-tracker discipline**, delegates raw mechanics to the `asc-*` skills, and leaves actual code fixes to normal Claude work.

The skill is **two separate commands**. Pick the one being asked for:

| Command | When | Read |
|---|---|---|
| **Ship a build** | "ship to TestFlight", "push a build", after landing a fix to test on device | `references/ship-build.md` |
| **Check & track feedback** | "check for feedback", "any new feedback?", a screenshot/note arrived, triage crashes | `references/feedback-tracking.md` |

## Hard guardrails (BOTH commands)

1. **Confirm the `asc` profile before ANY `asc` command.** If the user has multiple Apple Developer accounts, each is a stored `asc` credential profile, and `asc` has ONE default that every command hits. Run `asc auth status`; confirm the default matches THIS project's team. If not, `asc auth switch --name "<profile>"` first. A command that "returns nothing" or "can't find the app" is almost always the wrong profile, not a real failure.
2. **Per-project coordinates are never assumed across projects.** App id, bundle id, team id, scheme, `.xcodeproj` path, and ExportOptions live in the **project's own CLAUDE.md**. Read them there. If missing, detect from the project (`asc apps list`, `xcodebuild -list`, `project.yml`) and ask once, then offer to save them into the project CLAUDE.md so future runs are turnkey.
3. **Headless only.** Never require the Xcode GUI. Everything runs via `asc` + `xcodebuild`/`xcodegen`.
4. **Bump the build number only.** The marketing version (1.0 to 1.1) is a deliberate decision the user makes; never auto-bump it.
5. **The tracker is the memory.** Always read `testflight-feedback.md` before triaging so resolved items are never re-investigated. Update it whenever feedback is pulled or a fix ships.
6. **Audience may be a non-coder.** Keep user-facing summaries concise and plain (what changed for them, what to test), not code detail.

## Bundled resources

- `scripts/ship_testflight.sh` archives (Release), exports an App Store IPA, and uploads. The deterministic core of a ship; run it AFTER bumping the build number (see `references/ship-build.md`). Args: `--app --scheme --project --team [--archive --ipa --export-options]`. Writes the ExportOptions plist itself from `--team`.
- `scripts/poll_build_status.sh` polls App Store Connect until a build is VALID/INVALID. Args: `<app-id> <build-number> [max-polls] [interval-seconds]`. Run with `run_in_background: true` and notify the user when it finishes.
- `assets/testflight-feedback.template.md` is the per-project feedback tracker. Copy to the repo root as `testflight-feedback.md` on first use.
- `references/ship-build.md` is the full ship workflow (auth check, bump, regenerate, scripts, poll, notify).
- `references/feedback-tracking.md` is the full feedback + crash + tracker + triage-summary workflow.

## Delegation

This skill sequences the loop; it does not re-document `asc`. For command-level detail, defer to: `asc-xcode-build` (archive/export/upload, version/build numbers), `asc-testflight-orchestration` (builds, groups, testers, What-to-Test), `asc-crash-triage` (TestFlight crashes, beta feedback, diagnostics), `asc-cli-usage` (flags, auth, output formats, pagination). When those skills are available, lean on them instead of duplicating their content.
