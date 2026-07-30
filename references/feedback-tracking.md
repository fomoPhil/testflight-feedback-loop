# Check & track feedback

Goal: pull the user's TestFlight feedback (screenshots + notes) and crashes, record everything in the per-project tracker so nothing is re-investigated, and hand the user a triage summary to green-light. The actual code fixes are normal Claude work afterward — this command sets them up, it does not encode them.

## 0. Pre-flight

- **Confirm the `asc` profile** (`asc auth status` → matches this project's team; switch if not).
- **Read the tracker first.** Open `testflight-feedback.md` at the repo root. If it doesn't exist, create it by copying `assets/testflight-feedback.template.md` and filling the app id / bundle / team header. Knowing what's already addressed prevents re-triaging resolved items.

## 1. Pull written feedback

```bash
asc testflight feedback list --app <APP_ID>
```

Each item has: `id`, `createdDate`, `deviceModel` + `osVersion`, `comment`, and `screenshots[].url`. Sort by `createdDate` descending. For each NEW item (not already in the tracker):

- Download the screenshot(s): `curl -s "<url>" -o /tmp/tf_<short-id>.jpg` and view it — the image usually carries as much signal as the note.
- Map `deviceModel` to a human name when helpful (e.g. `iPhone17,2` → iPhone 16 Pro Max). The screen point size (e.g. 956×440) tells you orientation/size class.
- Note which build it was filed against when it matters (Dynamic Island / notch issues, layout regressions). `asc` may not expose the build cleanly per item; infer from timing + the screenshot, and say so if uncertain.

## 2. Pull crashes (this loop includes crashes)

Also fetch TestFlight crash reports + beta diagnostics for the app — delegate to the `asc-crash-triage` skill (it knows the current crash/feedback/diagnostics commands). Fold any device crashes into the same triage summary so they're not missed alongside written feedback.

## 3. Update the tracker

Maintain `testflight-feedback.md` (see the template): add a row per item to the log table (#, date UTC, device, reported build, summary, status, fixed-in) and a short detail section (feedback id, comment, root cause once known, fix, status). Use the status legend: ✅ Addressed · 🔧 In progress · ⏳ Open · 🚫 Won't fix (reason) · ❓ Needs user decision. Commit the tracker update.

## 4. Triage summary (hand to the user)

Give the user a concise, plain-language summary they can green-light — for each new item:

- **What they reported** (1 line, their words distilled).
- **Proposed fix** (1 line) + **severity** (P0 ship-blocker / P1 should-fix / P2 nice / P3 minor).
- Anything that's actually a **design/product decision** → ask, don't assume.

Flag tradeoffs honestly (e.g. "scrolling the AU plug-in would fight its own knob drags — the collapsible keyboard is the better mechanism"). Don't over-promise; if something isn't worth doing, say so.

## 5. Hand off to fixing + the next ship

The fixes themselves are ordinary Claude work (edit code, build, test) — not part of this skill. Once the user green-lights and fixes land green, run the **Ship a build** command (`references/ship-build.md`) to ship the next build, then come back and mark the tracker items ✅ Addressed with `Fixed in: build N`. That's one turn of the loop.
