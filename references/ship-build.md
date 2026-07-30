# Ship a build (headless TestFlight)

Goal: get the current branch's code onto TestFlight as a new build, with zero Xcode GUI, and tell the user when it's downloadable. Use after a feature/fix is green (build + tests pass, zero warnings).

## 0. Pre-flight (always)

- **Confirm the build is green first.** Don't ship a red tree. Build + run tests on the project's simulator; zero warnings.
- **Confirm the `asc` profile.** `asc auth status` → default must match THIS project's team (see the project CLAUDE.md). If not, `asc auth switch --name "<profile>"`.
- **Load coordinates** from the project CLAUDE.md: app id, scheme, `.xcodeproj` path, team id, and whether the project uses XcodeGen (`project.yml`). If any are missing, detect (`asc apps list`, `xcodebuild -list`, look for `project.yml`) and confirm with the user once, then offer to save them into the project CLAUDE.md.
- **Working tree should be committed.** The archive builds the working tree; commit pending work so the build is reproducible.

## 1. Bump the build number (only the build number)

```bash
asc builds next-build-number --app <APP_ID> --version <MARKETING_VERSION> --platform IOS
```

- **XcodeGen project:** set `CURRENT_PROJECT_VERSION: "<N>"` in `project.yml`, then `xcodegen generate`. Verify `CFBundleVersion` tracks `$(CURRENT_PROJECT_VERSION)`.
- **Plain Xcode project:** set `CURRENT_PROJECT_VERSION` in the target build settings (or `agvtool`).
- Leave `MARKETING_VERSION` alone unless the user explicitly asked to bump it.
- Commit the bump.

## 2. Archive → export → upload

Run the bundled script (it writes the ExportOptions plist from `--team`):

```bash
scripts/ship_testflight.sh --app <APP_ID> --scheme <SCHEME> --project <App.xcodeproj> --team <TEAM_ID>
```

This archives Release for `generic/platform=iOS` with `-allowProvisioningUpdates`, exports an `app-store-connect` IPA (automatic signing), and uploads it. Each `asc xcode …`/`asc builds upload` step prints SUCCEEDED/committed. (Equivalent manual steps live in the `asc-xcode-build` skill if a step needs tweaking.)

## 3. Poll to VALID + notify

The just-uploaded build takes a few minutes to appear, then ~5–15 min to process. Poll in the **background** so the turn isn't blocked, and notify the user when it resolves:

```bash
scripts/poll_build_status.sh <APP_ID> <BUILD_NUMBER>
```

Run it with `run_in_background: true`. On VALID, tell the user plainly: "Build N is live in TestFlight — update and test." Internal builds auto-distribute to the user; no separate submission step.

## 4. Close the loop

- If this ship resolved tracked feedback, update `testflight-feedback.md`: set those items' status to ✅ Addressed and `Fixed in: build N`.
- Tell the user (concise, non-coder): what changed, what to test on device, and that it's downloadable.
