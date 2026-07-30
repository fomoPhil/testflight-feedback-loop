#!/usr/bin/env bash
# Archive (Release) -> export App Store IPA -> upload to App Store Connect. Headless.
# Run this AFTER the build number has been bumped + the project regenerated
# (see references/ship-build.md). Confirm the asc auth profile first.
#
# Usage:
#   ship_testflight.sh --app <app-id> --scheme <scheme> --project <App.xcodeproj> --team <TEAMID> \
#                      [--archive <path>] [--ipa <path>] [--export-options <path>]
# Writes the App Store ExportOptions plist itself from --team (automatic signing).
set -euo pipefail

ARCHIVE=/tmp/tf-archive.xcarchive
IPA=/tmp/tf-export.ipa
EXPORT_OPTS=/tmp/tf-ExportOptions.plist
APP="" SCHEME="" PROJECT="" TEAM=""

while [ $# -gt 0 ]; do
  case "$1" in
    --app)            APP="$2"; shift 2;;
    --scheme)         SCHEME="$2"; shift 2;;
    --project)        PROJECT="$2"; shift 2;;
    --team)           TEAM="$2"; shift 2;;
    --archive)        ARCHIVE="$2"; shift 2;;
    --ipa)            IPA="$2"; shift 2;;
    --export-options) EXPORT_OPTS="$2"; shift 2;;
    *) echo "unknown arg: $1" >&2; exit 64;;
  esac
done
: "${APP:?--app required}"; : "${SCHEME:?--scheme required}"
: "${PROJECT:?--project required}"; : "${TEAM:?--team required}"

rm -rf "$ARCHIVE" "$IPA"

# Respect a user-provided plist (e.g. manual signing w/ profile maps) —
# only generate the default automatic-signing plist when none exists.
if [ ! -f "$EXPORT_OPTS" ]; then
cat > "$EXPORT_OPTS" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>app-store-connect</string>
  <key>signingStyle</key><string>automatic</string>
  <key>teamID</key><string>$TEAM</string>
  <key>destination</key><string>export</string>
</dict></plist>
EOF
fi

echo "==> Archiving (Release)…"
asc xcode archive --project "$PROJECT" --scheme "$SCHEME" --configuration Release \
  --archive-path "$ARCHIVE" \
  --xcodebuild-flag=-destination --xcodebuild-flag=generic/platform=iOS \
  --xcodebuild-flag=-allowProvisioningUpdates

echo "==> Exporting App Store IPA…"
asc xcode export --archive-path "$ARCHIVE" --export-options "$EXPORT_OPTS" --ipa-path "$IPA" \
  --xcodebuild-flag=-allowProvisioningUpdates

echo "==> Uploading to App Store Connect…"
asc builds upload --app "$APP" --ipa "$IPA"

echo "==> Upload committed. Now poll: poll_build_status.sh $APP <build-number>"
